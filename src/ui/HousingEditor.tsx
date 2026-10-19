import {useEffect,useState,type MutableRefObject} from 'react';
import type {ContentPack,Furniture} from '../content/types';
import type {SaveState} from '../persistence/state';
import type {Action} from '../game/input';
import {canPlace,nextFurnitureId,placeFurniture,storeDecoration,takeFromStorage} from '../housing/model';
import {afterPlacement} from '../story/engine';
import {Dialog} from './Dialog';
import {Icon} from './Icons';
type Props={state:SaveState;content:ContentPack;initialItem?:string;onChange:(state:SaveState)=>void;onClose:()=>void;onPreview:(f:Furniture|null,valid:boolean)=>void;actions:MutableRefObject<((action:Action)=>void)|null>};
export function HousingEditor({state,content,initialItem,onChange,onClose,onPreview,actions}:Props){
 const [draft,setDraft]=useState<Furniture|null>(()=>initialItem?{id:nextFurnitureId(state,initialItem),itemId:initialItem,x:-1.5,z:1.5,rotation:0}:null),[message,setMessage]=useState(''),[tab,setTab]=useState<'bag'|'room'|'storage'>(initialItem?'bag':'storage');
 const problem=draft?canPlace(draft,state,content,state.furniture.some(f=>f.id===draft.id)?draft.id:undefined):'';
 useEffect(()=>{onPreview(draft,!problem);return()=>onPreview(null,true)},[draft,problem,onPreview]);
 const name=(id:string)=>content.items.find(i=>i.id===id)?.name??id;
 function move(dx:number,dz:number){setMessage('');setDraft(d=>d?{...d,x:Math.max(-4.5,Math.min(4.5,d.x+dx)),z:Math.max(-3.5,Math.min(3.5,d.z+dz))}:null)}
 function rotate(){setDraft(d=>d?{...d,rotation:((d.rotation+1)%4) as Furniture['rotation']}:null)}
 function back(){if(draft){setDraft(null);setMessage('')}else onClose()}
 function commit(){if(!draft)return;const result=placeFurniture(state,content,draft);if(result.message){setMessage(result.message);return}onChange(afterPlacement(content,result.state,draft.itemId));setDraft(null);setTab('room');setMessage(`${name(draft.itemId)} ma już swoje miejsce.`)}
 function select(itemId:string,placed?:Furniture){setDraft(placed??{id:nextFurnitureId(state,itemId),itemId,x:-1.5,z:1.5,rotation:0});setMessage('')}
 function take(itemId:string){const result=takeFromStorage(state,itemId);if(result.message){setMessage(result.message);return}onChange(result.state);select(itemId)}
 function store(itemId:string,id?:string){const result=storeDecoration(state,content,itemId,id);setMessage(result.message);if(!result.message)onChange(result.state)}
 actions.current=action=>{
  if(draft){if(action==='left')move(-.5,0);else if(action==='right')move(.5,0);else if(action==='up')move(0,.5);else if(action==='down')move(0,-.5);else if(action==='listen')rotate();else if(action==='confirm')commit();else if(action==='back')back();return}
  if(action==='back'){back();return}const buttons=Array.from(document.querySelectorAll<HTMLButtonElement>('[role="dialog"] button:not([disabled])'));if(action==='confirm'){const focus=document.activeElement as HTMLButtonElement;if(buttons.includes(focus))focus.click();else buttons[0]?.focus()}else if(['left','right','up','down'].includes(action)){const i=buttons.indexOf(document.activeElement as HTMLButtonElement),d=action==='left'||action==='up'?-1:1;buttons[(i+d+buttons.length)%buttons.length]?.focus()}
 };
 return <div className="housing-wrap"><Dialog label={draft?`Ustaw: ${name(draft.itemId)}`:'Urządzanie domu'} onBack={back}>
  <span className="eyebrow">Mój mały kąt</span><h2>{draft?name(draft.itemId):'Urządź swój dom'}</h2>
  {draft?<><p className="quiet">Podgląd w pokoju pokazuje nowe miejsce.</p><div className="placement-controls"><button className="secondary north" aria-label="Przesuń w głąb pokoju" onClick={()=>move(0,.5)}>↑</button><button className="secondary west" aria-label="Przesuń w lewo" onClick={()=>move(-.5,0)}>←</button><button className="secondary east" aria-label="Przesuń w prawo" onClick={()=>move(.5,0)}>→</button><button className="secondary south" aria-label="Przesuń w stronę drzwi" onClick={()=>move(0,-.5)}>↓</button></div><button className="secondary" onClick={rotate}>Obróć</button><p className="placement-status" role="status">{problem||message||'Tutaj jest wolne miejsce.'}</p><div className="housing-actions"><button className="secondary" onClick={back}>Wróć do wyboru</button><button className="primary" disabled={!!problem} onClick={commit}>Postaw tutaj</button></div><p className="quiet">Strzałki / D-pad — miejsce · X na padzie / R — obrót · E / A — postaw</p></>
  :<><div className="housing-tabs" role="group" aria-label="Wybierz miejsce"><button className="secondary" aria-pressed={tab==='storage'} onClick={()=>setTab('storage')}>Schowek</button><button className="secondary" aria-pressed={tab==='bag'} onClick={()=>setTab('bag')}>Plecak</button><button className="secondary" aria-pressed={tab==='room'} onClick={()=>setTab('room')}>W pokoju</button></div><div className="housing-items">
   {tab==='storage'&&Object.entries(state.storage).map(([id,count])=><div className="housing-row" key={id}><span>{name(id)} <small>× {count}</small></span><button className="secondary" onClick={()=>take(id)}>Wybierz {name(id)}</button></div>)}
   {tab==='bag'&&Object.entries(state.inventory).filter(([id])=>content.items.find(i=>i.id===id)?.kind==='decoration').map(([id,count])=><div className="housing-row" key={id}><span>{name(id)} <small>× {count}</small></span><div><button className="secondary" onClick={()=>select(id)}>Ustaw {name(id)}</button><button className="text-button" onClick={()=>store(id)}>Odłóż do schowka</button></div></div>)}
   {tab==='room'&&state.furniture.map(f=><div className="housing-row" key={f.id}><span>{name(f.itemId)}</span><div><button className="secondary" onClick={()=>select(f.itemId,f)}>Przesuń {name(f.itemId)}</button><button className="text-button" onClick={()=>store(f.itemId,f.id)}>Schowaj {name(f.itemId)}</button></div></div>)}
  </div>{message&&<p className="placement-status" role="status">{message}</p>}<button className="primary" onClick={onClose}>Gotowe, wracam do pokoju.</button><p className="quiet">Możesz urządzać dom przed przygodą i po niej.</p></>}
 </Dialog></div>;
}
