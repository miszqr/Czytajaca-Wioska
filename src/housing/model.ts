import type {ContentPack,Furniture} from '../content/types';
import type {SaveState} from '../persistence/state';
import {blocked,type Solid} from '../game/movement';
export const ROOM_SOLIDS:Solid[]=[{id:'west-wall',type:'box',x:-5,z:0,halfX:.2,halfZ:4.2},{id:'east-wall',type:'box',x:5,z:0,halfX:.2,halfZ:4.2},{id:'back-wall',type:'box',x:0,z:4,halfX:5,halfZ:.2},{id:'front-wall',type:'box',x:0,z:-4,halfX:5,halfZ:.2},{id:'cabinet',type:'box',x:3.3,z:3.15,halfX:.7,halfZ:.4}];
export function furnitureSolid(f:Furniture,content:ContentPack):Solid|undefined{const item=content.items.find(i=>i.id===f.itemId);if(!item||item.model==='rug')return;return {id:`furniture:${f.id}`,type:'box',x:f.x,z:f.z,halfX:(f.rotation%2?item.depth:item.width)/2,halfZ:(f.rotation%2?item.width:item.depth)/2}}
export function homeSolids(state:SaveState,content:ContentPack){return [...ROOM_SOLIDS,...state.furniture.map(f=>furnitureSolid(f,content)).filter((s):s is Solid=>!!s)]}
export function canPlace(f:Furniture,state:SaveState,content:ContentPack,ignoreId?:string):string{
 const item=content.items.find(i=>i.id===f.itemId);if(state.location!=='home'||!item||item.kind!=='decoration')return 'Tę dekorację możesz ustawić w domu.';
 const w=(f.rotation%2?item.depth:item.width)/2,d=(f.rotation%2?item.width:item.depth)/2;
 if(Math.abs(f.x)+w>4.6||Math.abs(f.z)+d>3.6)return 'Przesuń mebel dalej od ściany.';
 // Keep access to the entrance and the cabinet even when the room is full.
 const reserved=[{x:0,z:-2.9,w:.8,d:1},{x:3.3,z:2.05,w:.8,d:.7}];
 if(reserved.some(r=>Math.abs(f.x-r.x)<w+r.w&&Math.abs(f.z-r.z)<d+r.d))return 'Zostaw tu przejście do drzwi lub szafki.';
 if(item.model==='rug'&&state.furniture.some(o=>o.id!==ignoreId&&content.items.find(i=>i.id===o.itemId)?.model==='rug'&&Math.abs(f.x-o.x)<w+(content.items.find(i=>i.id===o.itemId)!.width/2)&&Math.abs(f.z-o.z)<d+(content.items.find(i=>i.id===o.itemId)!.depth/2)))return 'Tu leży już dywan.';
 if(item.model!=='rug')for(const s of [...ROOM_SOLIDS,...state.furniture.filter(o=>o.id!==ignoreId).map(o=>furnitureSolid(o,content)).filter((s):s is Solid=>!!s)])if(s.type==='box'&&Math.abs(f.x-s.x)<w+s.halfX+.05&&Math.abs(f.z-s.z)<d+s.halfZ+.05)return 'Tu stoi już inny mebel. Wybierz wolne miejsce.';
 if(item.model!=='rug'&&Math.abs(f.x-state.player.x)<w+.3&&Math.abs(f.z-state.player.z)<d+.3)return 'Odsuń się kawałek, aby postawić tu mebel.';
 const placed={...state,furniture:[...state.furniture.filter(o=>o.id!==ignoreId),f]},solids=homeSolids(placed,content);
 if(!roomReachable(solids,state.player))return 'Zostaw drogę do drzwi i szafki.';
 if(state.flags.hosting&&Object.values(guestPositions(state,content)).some(p=>Math.abs(f.x-p.x)<w+.5&&Math.abs(f.z-p.z)<d+.5))return 'Tu stoi gość. Wybierz inne miejsce.';
 return '';
}

export function placeFurniture(state:SaveState,content:ContentPack,f:Furniture){
 const existing=state.furniture.find(o=>o.id===f.id);if(existing&&existing.itemId!==f.itemId)return {state,message:'Wybierz ponownie dekorację.'};
 const message=canPlace(f,state,content,existing?.id);if(message)return {state,message};
 if(!existing&&(state.inventory[f.itemId]??0)<1)return {state,message:'Ten przedmiot nie jest teraz w plecaku.'};
 const next=structuredClone(state);if(!existing){next.inventory[f.itemId]--;if(!next.inventory[f.itemId])delete next.inventory[f.itemId]}
 next.furniture=[...next.furniture.filter(o=>o.id!==f.id),f];return {state:next,message:''};
}

export function prepareStorage(state:SaveState,content:ContentPack):SaveState{
 if(state.flags['decorations-ready'])return state;
 const storage={...state.storage};for(const item of content.items)if(item.kind==='decoration'&&!['bed','table','lamp'].includes(item.id))storage[item.id]=(storage[item.id]??0)+1;
 return {...state,storage,flags:{...state.flags,'decorations-ready':true}};
}
export function takeFromStorage(state:SaveState,itemId:string){
 if(state.location!=='home'||!(state.storage[itemId]>0))return {state,message:'Ten przedmiot nie jest w domowym schowku.'};
 if(!state.inventory[itemId]&&Object.keys(state.inventory).length>=12)return {state,message:'Plecak jest pełny. Odłóż do schowka inną dekorację.'};
 const next=structuredClone(state);next.storage[itemId]--;if(!next.storage[itemId])delete next.storage[itemId];next.inventory[itemId]=(next.inventory[itemId]??0)+1;return {state:next,message:''};
}
export function storeDecoration(state:SaveState,content:ContentPack,itemId:string,furnitureId?:string){
 const item=content.items.find(i=>i.id===itemId);if(state.location!=='home'||item?.kind!=='decoration')return {state,message:'W schowku trzymamy domowe dekoracje.'};
 if(furnitureId==='starter-table'&&!state.flags['read-fela-letter'])return {state,message:'Najpierw zajrzyj do koperty na stole.'};
 const next=structuredClone(state);
 if(furnitureId){if(!state.furniture.some(f=>f.id===furnitureId&&f.itemId===itemId))return {state,message:'Wybierz mebel ponownie.'};next.furniture=next.furniture.filter(f=>f.id!==furnitureId)}
 else{if(!(state.inventory[itemId]>0))return {state,message:'Tego przedmiotu nie ma w plecaku.'};next.inventory[itemId]--;if(!next.inventory[itemId])delete next.inventory[itemId]}
 next.storage[itemId]=(next.storage[itemId]??0)+1;return {state:next,message:''};
}
export function nextFurnitureId(state:SaveState,itemId:string){let i=1;while(state.furniture.some(f=>f.id===`f-${itemId.slice(0,46)}-${i}`))i++;return `f-${itemId.slice(0,46)}-${i}`}
function roomReachable(solids:Solid[],player:{x:number;z:number}){
 const queue=[{x:0,z:-2.5}],seen=new Set(['0,-2.5']);
 for(let i=0;i<queue.length;i++){const p=queue[i];for(const [dx,dz] of [[.5,0],[-.5,0],[0,.5],[0,-.5]]){const n={x:p.x+dx,z:p.z+dz},key=`${n.x},${n.z}`;if(Math.abs(n.x)>4.5||Math.abs(n.z)>3.5||seen.has(key)||blocked(n,solids)||blocked({x:p.x+dx/2,z:p.z+dz/2},solids))continue;seen.add(key);queue.push(n)}}
 return queue.some(p=>Math.hypot(p.x-player.x,p.z-player.z)<.8)&&queue.some(p=>Math.hypot(p.x-3.3,p.z-2.7)<1.7);
}
export function guestPositions(state:SaveState,content:ContentPack){
 const preferred=[{x:-2,z:-.8},{x:2,z:-.7},{x:-1,z:2.8},{x:0,z:2.8}],positions:Record<string,{x:number;z:number}>={},solids=homeSolids(state,content);
 for(const [i,npc] of content.characters.entries()){
  const target=preferred[i%preferred.length],candidates=[target];for(let z=-2.5;z<=3;z+=.5)for(let x=-4;x<=4;x+=.5)candidates.push({x,z});
  candidates.sort((a,b)=>Math.hypot(a.x-target.x,a.z-target.z)-Math.hypot(b.x-target.x,b.z-target.z));
  const spot=candidates.find(p=>!blocked(p,solids,.5)&&Math.hypot(p.x-state.player.x,p.z-state.player.z)>1&&!(Math.abs(p.x)<.8&&p.z<-2));
  if(spot){positions[npc.id]=spot;solids.push({id:npc.id,type:'circle',...spot,radius:.5})}
 }
 return positions;
}
