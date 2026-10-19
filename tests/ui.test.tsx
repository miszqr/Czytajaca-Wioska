// @vitest-environment jsdom
import {it,expect,vi} from 'vitest';
import {act} from 'react';
import {createRoot} from 'react-dom/client';
import 'fake-indexeddb/auto';
const mock=vi.hoisted(()=>({callbacks:null as any,nearId:'bruno',loadError:false}));
vi.mock('../src/game/runtime',()=>({VillageGame:class{
 constructor(_canvas:unknown,_state:unknown,callbacks:any){mock.callbacks=callbacks;queueMicrotask(()=>callbacks.onReady())}
 setPaused(){} syncState(){} faceTarget(id:string){return mock.nearId===id} dispose(){} celebrate(){} moveTouch(){} runTouch(){} recenter(){} previewFurniture(){}
}}));
vi.mock('../src/content/load',async()=>{const {DEFAULT_CONTENT}=await import('../src/content/defaults');return {loadContent:async()=>{if(mock.loadError)throw new Error('story.json: błąd');return DEFAULT_CONTENT}}});
import {App} from '../src/ui/App';
import {SaveStore} from '../src/persistence/store';
import {newSave} from '../src/persistence/state';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT=true;
async function settle(){await act(async()=>{await new Promise(r=>setTimeout(r,25))})}
function button(text:string){const b=Array.from(document.querySelectorAll('button')).find(b=>b.textContent?.trim()===text);expect(b,`button: ${text}`).toBeDefined();return b!}
async function click(text:string){await act(async()=>button(text).click());await settle()}
async function approach(targetId:string){mock.nearId=targetId;await act(async()=>mock.callbacks.onNear({targetId,label:targetId,near:true,distance:1,x:200,y:200,visible:true}));await act(async()=>mock.callbacks.onAction('confirm'));await settle()}
it('P0: ręczny dialog, wejście do domu, list, dziennik i wznowienie',async()=>{
 const store=new SaveStore();await store.save(newSave());const container=document.createElement('div');document.body.append(container);let root=createRoot(container);
 try{
  await act(async()=>root.render(<App/>));await settle();await click('Ruszamy');await approach('bruno');expect(document.querySelector('.dialogue-text')?.textContent).toContain('Witaj, Kitku!');expect((document.activeElement as HTMLElement).textContent).toBe('Dalej');
  await click('Dalej');await click('Rozejrzę się.');await approach('home-door');await click('Otwieram drzwi.');await approach('fela-letter');expect(document.querySelector('.dialogue-text')?.textContent).toContain('Cześć, Kitku!');await click('Dalej');await click('Zachowam ten list.');
  expect(document.querySelector('.syllable')).toBeNull();expect(document.body.textContent).not.toMatch(/odpowiedź|punkty|ćwiczenie/i);
  const saved=await store.load();expect(saved?.location).toBe('home');expect(saved?.read).toEqual(['fela-letter']);
  await act(async()=>document.querySelector<HTMLButtonElement>('[aria-label="Otwórz dziennik"]')!.click());await click('List od Feli');await click('Dalej');await click('Zamknij list.');await click('Wracam do spaceru.');
  await act(async()=>root.unmount());root=createRoot(container);await act(async()=>root.render(<App/>));await settle();expect(document.querySelector('[role="dialog"]')).toBeNull();expect((await store.load())?.read).toEqual(['fela-letter']);
 }finally{await act(async()=>root.unmount());container.remove();await store.close()}
});
it('błędna konfiguracja pokazuje diagnozę i nie nadpisuje zapisu',async()=>{
 mock.loadError=true;const store=new SaveStore(),before=newSave();before.player.x=7;await store.save(before);const saved=await store.load(),spy=vi.spyOn(SaveStore.prototype,'save');const container=document.createElement('div');document.body.append(container);const root=createRoot(container);
 try{await act(async()=>root.render(<App/>));await settle();expect(document.querySelector('[role="alert"]')?.textContent).toContain('story.json');expect(spy).not.toHaveBeenCalled();expect(await store.load()).toEqual(saved)}finally{await act(async()=>root.unmount());container.remove();await store.close();spy.mockRestore();mock.loadError=false}
});
