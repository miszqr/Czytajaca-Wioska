// @vitest-environment jsdom
import {it,expect,vi} from 'vitest';
import {act} from 'react';
import {createRoot} from 'react-dom/client';
import 'fake-indexeddb/auto';
const mock=vi.hoisted(()=>({callbacks:null as any,nearId:'bruno',loadError:false,sessions:[] as any[]}));
vi.mock('../src/game/runtime',()=>({VillageGame:class{
 state:any;disposed=false;
 constructor(_canvas:unknown,state:unknown,private callbacks:any){this.state=structuredClone(state);mock.sessions.push(this);mock.callbacks=callbacks;queueMicrotask(()=>{if(!this.disposed)callbacks.onReady()})}
 syncState(state:unknown){this.state=structuredClone(state)}
 snapshot(){const {player,camera,location}=this.state;return structuredClone({player,camera,location})}
 setCameraDistance(distance:number){this.state.camera.distance=Math.max(CONFIG.cameraMinDistance,Math.min(CONFIG.cameraMaxDistance,distance));this.callbacks.onSave(this.snapshot())}
 dispose(){if(this.disposed)return;this.disposed=true;const {player,camera,location}=this.state;this.callbacks.onSave({player,camera,location})}
 setPaused(){} editHome(){} faceTarget(id:string){return mock.nearId===id} celebrate(){} moveTouch(){} runTouch(){} recenter(){} previewFurniture(){} playStoryAction(){}
}}));
vi.mock('../src/content/load',async()=>{const {DEFAULT_CONTENT}=await import('../src/content/defaults');return {loadContent:async()=>{if(mock.loadError)throw new Error('story.json: błąd');return DEFAULT_CONTENT}}});
import {App} from '../src/ui/App';
import {SaveStore} from '../src/persistence/store';
import {newSave} from '../src/persistence/state';
import {prepareStorage} from '../src/housing/model';
import {DEFAULT_CONTENT} from '../src/content/defaults';
import {CONFIG} from '../src/game/config';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT=true;
async function settle(){await act(async()=>{await new Promise(r=>setTimeout(r,25))})}
function button(text:string){const b=Array.from(document.querySelectorAll('button')).find(b=>b.textContent?.trim()===text);expect(b,`button: ${text}`).toBeDefined();return b!}
async function click(text:string){await act(async()=>button(text).click());await settle()}
async function approach(targetId:string){mock.nearId=targetId;await act(async()=>mock.callbacks.onNear({targetId,label:targetId,near:true,distance:1,x:200,y:200,visible:true}));await act(async()=>mock.callbacks.onAction('confirm'));await settle()}
async function expectIndependentReading(){
 const dialog=document.querySelector('[role="dialog"]')!,before=dialog.textContent;
 expect(Array.from(dialog.querySelectorAll('button')).map(b=>b.getAttribute('aria-label')??b.textContent).join(' ')).not.toMatch(/posłuchaj|odsłuch/i);
 // R / pad X is now a furniture-only action; it must leave reading unchanged.
 await act(async()=>mock.callbacks.onAction('rotate'));expect(dialog.textContent).toBe(before);
}
it('menu zmienia i zapisuje odległość kamery, obsługuje suwak, przyciski i pad',async()=>{
 const before=prepareStorage(newSave(),DEFAULT_CONTENT);before.welcomed=true;before.camera.distance=3.5;before.flags['met-bruno']=true;
 const store=new SaveStore();await store.save(before);const container=document.createElement('div');document.body.append(container);let root=createRoot(container);
 const slider=()=>document.querySelector<HTMLInputElement>('#camera-distance')!;
 async function setDistance(value:string){await act(async()=>{const input=slider();Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')!.set!.call(input,value);input.dispatchEvent(new Event('input',{bubbles:true}))});await settle()}
 try{
  await act(async()=>root.render(<App/>));await settle();
  await act(async()=>document.querySelector<HTMLButtonElement>('[aria-label="Otwórz menu"]')!.click());await settle();
  expect(document.activeElement).toBe(slider());expect(slider().value).toBe('3.5');
  await setDistance('7.4');expect(mock.sessions.at(-1).state.camera.distance).toBe(7.4);
  await act(async()=>mock.callbacks.onAction('right'));await settle();expect(slider().value).toBe('7.5');
  await act(async()=>mock.callbacks.onAction('left'));await settle();expect(slider().value).toBe('7.4');
  await act(async()=>mock.callbacks.onAction('confirm'));expect(document.querySelector('[aria-label="Menu wioski"]')).not.toBeNull();
  await act(async()=>document.querySelector<HTMLButtonElement>('[aria-label="Oddal kamerę"]')!.click());await settle();expect(slider().value).toBe('7.5');
  await click('Domyślna odległość');expect(slider().value).toBe(String(CONFIG.cameraDistance));
  await setDistance(String(CONFIG.cameraMaxDistance));expect(document.querySelector<HTMLButtonElement>('[aria-label="Oddal kamerę"]')!.disabled).toBe(true);
  await setDistance('7.4');await click('Wracam do spaceru.');
  expect((await store.load())?.camera.distance).toBe(7.4);expect((await store.load())?.flags).toEqual(before.flags);
  await act(async()=>root.unmount());root=createRoot(container);await act(async()=>root.render(<App/>));await settle();
  expect(mock.sessions.at(-1).state.camera.distance).toBe(7.4);
  // Menu uses the live pose, including a wheel change not yet autosaved.
  mock.sessions.at(-1).state.camera.distance=8.2;
  await act(async()=>mock.callbacks.onAction('menu'));await settle();expect(slider().value).toBe('8.2');
 }finally{await act(async()=>root.unmount());container.remove();await store.close()}
});
it('P0: ręczny dialog, wejście do domu, list, dziennik i wznowienie',async()=>{
 const store=new SaveStore();await store.save(newSave());const container=document.createElement('div');document.body.append(container);let root=createRoot(container);
 try{
  await act(async()=>root.render(<App/>));await settle();await click('Ruszamy');await approach('bruno');expect(document.querySelector('.dialogue-text')?.textContent).toContain('Witaj, Kitku!');expect((document.activeElement as HTMLElement).textContent).toBe('Dalej');
  await expectIndependentReading();
  await click('Dalej');await click('Rozejrzę się.');await approach('home-door');await click('Otwieram drzwi.');await approach('fela-letter');expect(document.querySelector('.dialogue-text')?.textContent).toContain('Cześć, Kitku!');await click('Dalej');await click('Zachowam ten list.');
  expect(document.querySelector('.syllable')).toBeNull();expect(document.body.textContent).not.toMatch(/odpowiedź|punkty|ćwiczenie/i);
  const saved=await store.load();expect(saved?.location).toBe('home');expect(saved?.read).toEqual(['fela-letter']);
  await act(async()=>document.querySelector<HTMLButtonElement>('[aria-label="Otwórz dziennik"]')!.click());expect(document.activeElement?.textContent).toBe('Dziennik Kitka');await expectIndependentReading();await click('List od Feli');await expectIndependentReading();await click('Dalej');await click('Zamknij list.');await click('Wracam do spaceru.');
  await act(async()=>root.unmount());root=createRoot(container);await act(async()=>root.render(<App/>));await settle();expect(document.querySelector('[role="dialog"]')).toBeNull();expect((await store.load())?.read).toEqual(['fela-letter']);
 }finally{await act(async()=>root.unmount());container.remove();await store.close()}
});
it('błędna konfiguracja pokazuje diagnozę i nie nadpisuje zapisu',async()=>{
 mock.loadError=true;const store=new SaveStore(),before=newSave();before.player.x=7;await store.save(before);const saved=await store.load(),spy=vi.spyOn(SaveStore.prototype,'save');const container=document.createElement('div');document.body.append(container);const root=createRoot(container);
 try{await act(async()=>root.render(<App/>));await settle();expect(document.querySelector('[role="alert"]')?.textContent).toContain('story.json');expect(spy).not.toHaveBeenCalled();expect(await store.load()).toEqual(saved)}finally{await act(async()=>root.unmount());container.remove();await store.close();spy.mockRestore();mock.loadError=false}
});
it('P2: lampa trafia z plecaka do pokoju przez podgląd, kolizje i sterowanie padem',async()=>{
 const {DEFAULT_CONTENT}=await import('../src/content/defaults'),{findNode,choose}=await import('../src/story/engine');
 let state=newSave();state.welcomed=true;for(const target of ['bruno','home-door','fela-letter','home-exit','fela','home-door']){const n=findNode(DEFAULT_CONTENT,state,target)!;state=choose(DEFAULT_CONTENT,state,n.id,n.choices[0].id).state}
 const store=new SaveStore();await store.save(state);const container=document.createElement('div');document.body.append(container);let root=createRoot(container);
 try{
  await act(async()=>root.render(<App/>));await settle();await approach('bedside');expect(document.querySelector('[role="dialog"]')?.getAttribute('aria-label')).toBe('Ustaw: Lampa od Feli');
  await act(async()=>mock.callbacks.onAction('left'));await settle();expect(button('Postaw tutaj').disabled).toBe(true);expect(document.querySelector('.placement-status')?.textContent).toContain('mebel');
  await act(async()=>mock.callbacks.onAction('right'));await act(async()=>mock.callbacks.onAction('rotate'));await settle();expect(button('Postaw tutaj').disabled).toBe(false);
  await act(async()=>mock.callbacks.onAction('confirm'));await settle();expect(document.querySelector('.housing-items')?.textContent).toContain('Lampa od Feli');await click('Gotowe, wracam do pokoju.');
  const saved=await store.load();expect(saved?.flags['lamp-placed']).toBe(true);expect(saved?.inventory.lamp).toBeUndefined();expect(saved?.furniture.filter(f=>f.itemId==='lamp')).toHaveLength(1);expect(saved?.furniture.find(f=>f.itemId==='lamp')?.rotation).toBe(1);
  await click('Urządź dom');await click('W pokoju');await click('Przesuń Lampa od Feli');await act(async()=>mock.callbacks.onAction('right'));await click('Wróć do wyboru');await click('Gotowe, wracam do pokoju.');expect((await store.load())?.furniture).toEqual(saved?.furniture);
  await act(async()=>root.unmount());root=createRoot(container);await act(async()=>root.render(<App/>));await settle();expect((await store.load())?.furniture).toEqual(saved?.furniture);
 }finally{await act(async()=>root.unmount());container.remove();await store.close()}
});

it.each(['village','home'] as const)('nowa gra z %s: anulowanie chroni zapis, potwierdzenie odtwarza świat i zapis od początku',async location=>{
 const before=prepareStorage(newSave(),DEFAULT_CONTENT);before.welcomed=true;before.location=location;before.player={x:2,z:2,heading:1};before.camera={yaw:1,pitch:.5,distance:5};
 before.flags['read-fela-letter']=true;before.flags.hosting=true;before.completed=['arrival','home'];before.seen=['read-fela-letter'];before.read=['fela-letter'];before.inventory={lamp:1,book:1};before.storage={};before.furniture[0].x=-2;
 const store=new SaveStore();await store.save(before);const saved=await store.load();
 const container=document.createElement('div');document.body.append(container);let root=createRoot(container);
 try{
  await act(async()=>root.render(<App/>));await settle();const previous=mock.sessions.at(-1),count=mock.sessions.length;
  await act(async()=>mock.callbacks.onAction('menu'));await click('Zacznij nową grę');
  expect(document.querySelector('[role="dialog"]')?.textContent).toContain('Dotychczasowy postęp zostanie usunięty');
  expect(document.activeElement?.textContent).toBe('Nie, wróć do menu');
  await act(async()=>mock.callbacks.onAction('confirm'));await settle();
  expect(document.querySelector('[role="dialog"]')?.getAttribute('aria-label')).toBe('Menu wioski');expect(await store.load()).toEqual(saved);expect(previous.disposed).toBe(false);
  await click('Zacznij nową grę');await act(async()=>mock.callbacks.onAction('back'));await settle();
  expect(document.querySelector('[role="dialog"]')?.getAttribute('aria-label')).toBe('Menu wioski');expect(await store.load()).toEqual(saved);
  await click('Zacznij nową grę');await act(async()=>document.activeElement?.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true})));await settle();
  expect(document.querySelector('[role="dialog"]')?.getAttribute('aria-label')).toBe('Menu wioski');expect(await store.load()).toEqual(saved);
  await click('Zacznij nową grę');await click('Tak, zacznij od nowa');
  const expected=prepareStorage(newSave(),DEFAULT_CONTENT);const {updatedAt:_,...fresh}=expected;
  expect(previous.disposed).toBe(true);expect(mock.sessions).toHaveLength(count+1);expect(mock.sessions.at(-1).state).toMatchObject(fresh);
  expect(document.querySelector('[role="dialog"]')?.getAttribute('aria-label')).toBe('Witaj w Czytającej Wiosce');expect(await store.load()).toMatchObject(fresh);
  // A reload before accepting the welcome must still load the fresh save,
  // including after the old world's final onSave during disposal.
  await act(async()=>root.unmount());root=createRoot(container);await act(async()=>root.render(<App/>));await settle();
  expect(mock.sessions.at(-1).state).toMatchObject(fresh);expect(document.querySelector('[role="dialog"]')?.getAttribute('aria-label')).toBe('Witaj w Czytającej Wiosce');
  await click('Ruszamy');expect(document.querySelector('.quest-card h2')?.textContent).toBe('Przyjazd');
  await approach('bruno');expect(document.querySelector('.dialogue-text')?.textContent).toContain('Witaj, Kitku!');
  expect(await store.load()).toMatchObject({...fresh,welcomed:true});
 }finally{await act(async()=>root.unmount());container.remove();await store.close()}
});
