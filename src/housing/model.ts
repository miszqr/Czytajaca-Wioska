import type {ContentPack,Furniture} from '../content/types';
import type {SaveState} from '../persistence/state';
import type {Solid} from '../game/movement';
export const ROOM_SOLIDS:Solid[]=[{id:'west-wall',type:'box',x:-5,z:0,halfX:.2,halfZ:4.2},{id:'east-wall',type:'box',x:5,z:0,halfX:.2,halfZ:4.2},{id:'back-wall',type:'box',x:0,z:4,halfX:5,halfZ:.2},{id:'front-wall',type:'box',x:0,z:-4,halfX:5,halfZ:.2},{id:'cabinet',type:'box',x:3.3,z:3.15,halfX:.7,halfZ:.4}];
export function furnitureSolid(f:Furniture,content:ContentPack):Solid|undefined{const item=content.items.find(i=>i.id===f.itemId);if(!item||item.model==='rug')return;return {id:`furniture:${f.id}`,type:'box',x:f.x,z:f.z,halfX:(f.rotation%2?item.depth:item.width)/2,halfZ:(f.rotation%2?item.width:item.depth)/2}}
export function homeSolids(state:SaveState,content:ContentPack){return [...ROOM_SOLIDS,...state.furniture.map(f=>furnitureSolid(f,content)).filter((s):s is Solid=>!!s)]}
