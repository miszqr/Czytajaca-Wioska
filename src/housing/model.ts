import type {ContentPack,Furniture} from '../content/types';
import type {SaveState} from '../persistence/state';
import type {Solid} from '../game/movement';
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
 if(item.model!=='rug')for(const s of [...ROOM_SOLIDS,...state.furniture.filter(o=>o.id!==ignoreId).map(o=>furnitureSolid(o,content)).filter((s):s is Solid=>!!s)])if(s.type==='box'&&Math.abs(f.x-s.x)<w+s.halfX+.05&&Math.abs(f.z-s.z)<d+s.halfZ+.05)return 'Tu stoi już inny mebel. Wybierz wolne miejsce.';
 if(item.model!=='rug'&&Math.abs(f.x-state.player.x)<w+.3&&Math.abs(f.z-state.player.z)<d+.3)return 'Odsuń się kawałek, aby postawić tu mebel.';
 return '';
}
export function placeFurniture(state:SaveState,content:ContentPack,f:Furniture){
 const existing=state.furniture.find(o=>o.id===f.id);if(existing&&existing.itemId!==f.itemId)return {state,message:'Wybierz ponownie dekorację.'};
 const message=canPlace(f,state,content,existing?.id);if(message)return {state,message};
 if(!existing&&(state.inventory[f.itemId]??0)<1)return {state,message:'Ten przedmiot nie jest teraz w plecaku.'};
 const next=structuredClone(state);if(!existing){next.inventory[f.itemId]--;if(!next.inventory[f.itemId])delete next.inventory[f.itemId]}
 next.furniture=[...next.furniture.filter(o=>o.id!==f.id),f];return {state:next,message:''};
}
