import type {InteractionDefinition} from '../content/types';
import type {SaveState} from '../persistence/state';
export function targetPosition(target:InteractionDefinition,state:SaveState){
 if(!target.anchor)return target.position;
 const furniture=state.furniture.find(f=>f.itemId===target.anchor!.itemId);if(!furniture)return null;
 const a=furniture.rotation*Math.PI/2,{x,z}=target.anchor;
 return {x:furniture.x+Math.cos(a)*x+Math.sin(a)*z,z:furniture.z-Math.sin(a)*x+Math.cos(a)*z};
}
