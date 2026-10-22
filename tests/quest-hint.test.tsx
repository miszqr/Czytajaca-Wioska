// @vitest-environment jsdom
import {afterEach,beforeEach,expect,it,vi} from 'vitest';
import {act} from 'react';
import {createRoot,type Root} from 'react-dom/client';
import {QuestHint} from '../src/ui/QuestHint';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT=true;
let container:HTMLDivElement,root:Root;
const journal=vi.fn();
const card=()=>container.querySelector<HTMLElement>('.quest-card')!;
const toggle=()=>container.querySelector<HTMLButtonElement>('.quest-toggle')!;
const details=()=>container.querySelector<HTMLElement>('.quest-details')!;
async function pointer(target:Element,type:string,pointerType='mouse',relatedTarget:EventTarget|null=null){
 const event=new MouseEvent(type,{bubbles:true,relatedTarget});
 Object.defineProperty(event,'pointerType',{value:pointerType});
 await act(async()=>target.dispatchEvent(event));
}
beforeEach(async()=>{
 journal.mockClear();container=document.createElement('div');document.body.append(container);root=createRoot(container);
 await act(async()=>root.render(<QuestHint title="Tajemnica szafki" objective="Książeczka leżała w szafce. Porozmawiam z Tolą." onOpenJournal={journal}/>));
});
afterEach(async()=>{await act(async()=>root.unmount());container.remove()});

it('pokazuje samą ikonę, rozwija cel po najechaniu i zwija po opuszczeniu całego kafelka',async()=>{
 expect(toggle().getAttribute('aria-expanded')).toBe('false');expect(details().hidden).toBe(true);
 await pointer(toggle(),'pointerover');expect(details().hidden).toBe(false);
 // Moving from the icon into the revealed text must keep the card open.
 await pointer(toggle(),'pointerout','mouse',details());await pointer(details(),'pointerover','mouse',toggle());
 expect(details().hidden).toBe(false);
 await act(async()=>container.querySelector<HTMLButtonElement>('.quest-journal-link')!.click());expect(journal).toHaveBeenCalledOnce();
 await pointer(details(),'pointerout','mouse',document.body);expect(details().hidden).toBe(true);
});

it('na ekranie dotykowym otwiera się dotknięciem i zamyka ponownym dotknięciem lub dotknięciem poza kafelkiem',async()=>{
 await pointer(toggle(),'pointerover','touch');expect(details().hidden).toBe(true);
 await pointer(toggle(),'pointerdown','touch');await act(async()=>toggle().click());expect(details().hidden).toBe(false);
 await pointer(toggle(),'pointerout','touch',document.body);expect(details().hidden).toBe(false);
 await pointer(toggle(),'pointerdown','touch');await act(async()=>toggle().click());expect(details().hidden).toBe(true);
 await act(async()=>toggle().click());await pointer(document.body,'pointerdown','touch');expect(details().hidden).toBe(true);
});

it('obsługuje klawiaturę, utrzymuje widoczność przy fokusie i zamyka Escape bez otwierania menu gry',async()=>{
 document.dispatchEvent(new KeyboardEvent('keydown',{key:'Tab',bubbles:true}));
 await act(async()=>toggle().focus());expect(details().hidden).toBe(false);
 await pointer(card(),'pointerout','mouse',document.body);expect(details().hidden).toBe(false);
 const link=container.querySelector<HTMLButtonElement>('.quest-journal-link')!;
 await act(async()=>link.focus());expect(details().hidden).toBe(false);
 const escaped=vi.fn();document.addEventListener('keydown',escaped);
 try{
  const space=new KeyboardEvent('keydown',{key:' ',code:'Space',bubbles:true,cancelable:true});
  await act(async()=>link.dispatchEvent(space));expect(space.defaultPrevented).toBe(false);expect(escaped).not.toHaveBeenCalled();
  await act(async()=>link.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true})));
  expect(details().hidden).toBe(true);expect(document.activeElement).toBe(toggle());expect(escaped).not.toHaveBeenCalled();
 }finally{document.removeEventListener('keydown',escaped)}
 await act(async()=>toggle().blur());
 document.dispatchEvent(new KeyboardEvent('keydown',{key:'Tab',bubbles:true}));
 await act(async()=>toggle().focus());expect(details().hidden).toBe(false);
 await act(async()=>toggle().blur());expect(details().hidden).toBe(true);
});
