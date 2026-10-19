// @vitest-environment jsdom
import {it,expect,vi} from 'vitest';
import {act} from 'react';
import {createRoot} from 'react-dom/client';
import 'fake-indexeddb/auto';
const mock=vi.hoisted(()=>({callbacks:null as any,near:false,celebrations:0}));
vi.mock('../src/game/runtime',()=>({VillageGame:class{
 constructor(_canvas:unknown,_state:unknown,callbacks:any){mock.callbacks=callbacks;queueMicrotask(()=>callbacks.onReady())}
 setPaused(){} faceBruno(){return mock.near} dispose(){} celebrate(){mock.celebrations++} moveTouch(){} runTouch(){} recenter(){}
}}));
import {App} from '../src/ui/App';
import {SaveStore} from '../src/persistence/store';
(globalThis as any).IS_REACT_ACT_ENVIRONMENT=true;
async function settle(){await act(async()=>{await new Promise(r=>setTimeout(r,25))})}
function button(text:string){const b=Array.from(document.querySelectorAll('button')).find(b=>b.textContent?.trim()===text);expect(b,`button: ${text}`).toBeDefined();return b!}
async function click(text:string){await act(async()=>button(text).click());await settle()}
it('przechodzi pełne P0: spacer, ręczny dialog, błędna próba, podpowiedź, nagroda i powrót po przeładowaniu',async()=>{
 const container=document.createElement('div');document.body.append(container);let root=createRoot(container);
 await act(async()=>root.render(<App/>));await settle();await click('Ruszamy');expect(document.querySelector('[role="dialog"]')).toBeNull();
 mock.near=true;await act(async()=>mock.callbacks.onNear({near:true,distance:1,x:200,y:200,visible:true}));
 await act(async()=>mock.callbacks.onAction('confirm'));await settle();expect(document.querySelector('.dialogue-text')?.textContent).toContain('Cześć! Jestem Bruno');
 expect((document.activeElement as HTMLElement).textContent).toBe('Dalej');
 await act(async()=>mock.callbacks.onAction('confirm'));await settle();await click('Pomogę!');
 expect(document.querySelector('[role="dialog"]')?.getAttribute('aria-label')).toContain('znajdź MA');
 expect((document.activeElement as HTMLElement).textContent).toBe('LA');
 await click('LA');expect(document.querySelector('.reading-feedback')?.textContent).toContain('Spróbuj jeszcze raz');
 await click('Podpowiedź');expect(document.querySelector('.hint-text')).not.toBeNull();await click('MA');
 expect(document.querySelector('.dialog')?.textContent).toContain('nasionko maku');expect(mock.celebrations).toBe(1);
 await click('Wracam do wioski');expect(document.querySelector('[role="dialog"]')).toBeNull();
 await act(async()=>mock.callbacks.onSave({player:{x:-3,z:2,heading:1},camera:{yaw:1,pitch:.3,distance:3.5}}));await settle();
 const store=new SaveStore(),saved=await store.load();expect(saved?.quest.status).toBe('completed');expect(saved?.quest.reading.attempts).toHaveLength(2);expect(saved?.quest.reading.hints).toBe(1);expect(saved?.player.x).toBe(-3);await store.close();
 await act(async()=>root.unmount());root=createRoot(container);await act(async()=>root.render(<App/>));await settle();
 expect(document.querySelector('[role="dialog"]')).toBeNull();expect(document.querySelector('.quest-card')?.textContent).toContain('Nasionko od Brunona');
 await act(async()=>mock.callbacks.onAction('confirm'));await settle();await click('Poćwiczmy');await click('MA');await click('Wracam do wioski');
 expect(document.querySelector('.seed-counter')?.textContent).toBe('1nasionko');await act(async()=>root.unmount());container.remove();
});
