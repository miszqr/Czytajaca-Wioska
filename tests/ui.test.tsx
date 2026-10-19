// @vitest-environment jsdom
import {it,expect,vi} from 'vitest';
import {act} from 'react';
import {createRoot} from 'react-dom/client';
import 'fake-indexeddb/auto';
const mock=vi.hoisted(()=>({callbacks:null as any,nearId:'bruno',celebrations:0,loadError:false}));
vi.mock('../src/game/runtime',()=>({VillageGame:class{
 constructor(_canvas:unknown,_state:unknown,callbacks:any){mock.callbacks=callbacks;queueMicrotask(()=>callbacks.onReady())}
 setPaused(){} faceNpc(id:string){return mock.nearId===id} dispose(){} celebrate(){mock.celebrations++} moveTouch(){} runTouch(){} recenter(){}
}}));
vi.mock('../src/content/load',async()=>{const {DEFAULT_CONTENT}=await import('../src/content/defaults');return {loadContent:async()=>{if(mock.loadError)throw new Error('quests/fela-maslo.json: błąd');return DEFAULT_CONTENT}}});
import {App} from '../src/ui/App';
import {SaveStore} from '../src/persistence/store';
import {newSave} from '../src/persistence/state';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT=true;
async function settle(){await act(async()=>{await new Promise(r=>setTimeout(r,25))})}
function button(text:string){const b=Array.from(document.querySelectorAll('button')).find(b=>b.textContent?.trim()===text);expect(b,`button: ${text}`).toBeDefined();return b!}
async function click(text:string){await act(async()=>button(text).click());await settle()}
async function approach(npcId:string){mock.nearId=npcId;await act(async()=>mock.callbacks.onNear({npcId,near:true,distance:1,x:200,y:200,visible:true}));await act(async()=>mock.callbacks.onAction('confirm'));await settle()}
it('przechodzi Bruno → Fela → plecak → przeładowanie i powtórka bez nowej nagrody',async()=>{
 const store=new SaveStore();await store.save(newSave());const container=document.createElement('div');document.body.append(container);let root=createRoot(container);
 try{
  await act(async()=>root.render(<App/>));await settle();await click('Ruszamy');expect(document.querySelector('[role="dialog"]')).toBeNull();
  await approach('bruno');expect(document.querySelector('.dialogue-text')?.textContent).toContain('Cześć! Jestem Bruno');expect((document.activeElement as HTMLElement).textContent).toBe('Dalej');
  await act(async()=>mock.callbacks.onAction('confirm'));await settle();await click('Pomogę!');
  expect(document.querySelector('[role="dialog"]')?.getAttribute('aria-label')).toContain('Znajdź sylabę MA');expect((document.activeElement as HTMLElement).textContent).toBe('LA');
  await click('LA');expect(document.querySelector('.reading-feedback')?.textContent).toContain('Spróbuj jeszcze raz');await click('Podpowiedź');expect(document.querySelector('.hint-text')).not.toBeNull();await click('MA');
  expect(document.querySelector('.dialog')?.textContent).toContain('nasionko maku');await click('Wracam do wioski');
  expect(document.querySelector('.quest-card')?.textContent).toContain('Szyld w sklepiku');
  await approach('fela');expect(document.querySelector('.dialogue-text')?.textContent).toContain('Jestem Fela');await click('Dalej');await click('Ułożę napis');
  expect(button('Sprawdź').disabled).toBe(true);await click('SŁO');await click('MA');await click('Sprawdź');expect(document.querySelector('.reading-feedback')?.textContent).toContain('zmienić kolejność');
  await click('Podpowiedź');expect(document.querySelector('.hint-text')?.textContent).toContain('Najpierw MA');await click('Cofnij sylabę');expect(button('Sprawdź').disabled).toBe(true);await click('Od nowa');
  await click('MA');await click('SŁO');await click('Sprawdź');expect(document.querySelector('.reward-name')?.textContent).toContain('Jabłko od Feli');expect(mock.celebrations).toBe(2);await click('Wracam do wioski');
  await act(async()=>document.querySelector<HTMLButtonElement>('[aria-label="Otwórz plecak"]')!.click());expect(document.querySelectorAll('.inventory-slot')).toHaveLength(12);expect(document.querySelector('.inventory-grid')?.textContent).toContain('Jabłko od Feli');await click('Wracam do spaceru');
  await act(async()=>mock.callbacks.onSave({player:{x:-3,z:2,heading:1},camera:{yaw:1,pitch:.3,distance:3.5}}));await settle();
  const saved=await store.load();expect(saved?.quests['bruno-ma'].status).toBe('completed');expect(saved?.quests['bruno-ma'].reading.attempts).toHaveLength(2);expect(saved?.quests['bruno-ma'].reading.hints).toBe(1);
  expect(saved?.quests['fela-maslo'].reading.attempts.map(a=>a.answer)).toEqual(['SŁOMA','MASŁO']);expect(saved?.inventory).toEqual({'mak-seed':1,apple:1});expect(saved?.player.x).toBe(-3);
  await act(async()=>root.unmount());root=createRoot(container);await act(async()=>root.render(<App/>));await settle();expect(document.querySelector('[role="dialog"]')).toBeNull();
  await approach('fela');expect(document.querySelector('.dialogue-text')?.textContent).toContain('Napis jest już gotowy');await click('Poćwiczmy');await click('MA');await click('SŁO');await click('Sprawdź');expect(document.querySelector('.reward-name')).toBeNull();await click('Wracam do wioski');
  expect((await store.load())?.inventory).toEqual({'mak-seed':1,apple:1});
 }finally{await act(async()=>root.unmount());container.remove();await store.close()}
});
it('błędna konfiguracja pokazuje diagnozę i nie nadpisuje zapisu',async()=>{
 mock.loadError=true;const store=new SaveStore(),before=newSave();before.player.x=7;await store.save(before);const saved=await store.load(),spy=vi.spyOn(SaveStore.prototype,'save');const container=document.createElement('div');document.body.append(container);const root=createRoot(container);
 try{await act(async()=>root.render(<App/>));await settle();expect(document.querySelector('[role="alert"]')?.textContent).toContain('quests/fela-maslo.json');expect(spy).not.toHaveBeenCalled();expect(await store.load()).toEqual(saved)}
 finally{await act(async()=>root.unmount());container.remove();await store.close();spy.mockRestore();mock.loadError=false}
});
