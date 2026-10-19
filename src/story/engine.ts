import type {Condition,ContentPack,Effect,StoryNode} from '../content/types';
import {placeFurniture} from '../housing/model';
import type {SaveState} from '../persistence/state';
export const PACK_CAPACITY=12;
export function matches(state:SaveState,conditions:readonly Condition[]){return conditions.every(c=>c.type==='flag'?!!state.flags[c.key]===c.value:(state.inventory[c.itemId]??0)>=c.quantity)}
export function findNode(content:ContentPack,state:SaveState,target:string,event:StoryNode['event']='interact'){
 if(event==='interact'){const t=content.interactions.find(t=>t.id===target);if(t&&(t.location!==state.location||!matches(state,t.when)))return undefined;if(content.characters.some(c=>c.id===target)&&state.location!=='village'&&!state.flags.hosting)return undefined}
 return content.story.nodes.filter(n=>n.target===target&&n.event===event&&(!n.once||!state.seen.includes(n.id))&&matches(state,n.when)).sort((a,b)=>b.priority-a.priority)[0];
}
export function currentScene(content:ContentPack,state:SaveState){const scene=content.story.scenes.find(s=>!state.completed.includes(s.id)&&matches(state,s.when));return scene?{...scene,objective:scene.updates?.find(u=>matches(state,u.when))?.objective??scene.objective}:undefined}
export function applyEffects(content:ContentPack,state:SaveState,effects:readonly Effect[]):{state:SaveState;message:string}{
 let next=structuredClone(state);
 // Remove first, so delivering an item can free a slot for a gift atomically.
 for(const e of effects.filter(e=>e.type==='takeItem'))if(e.type==='takeItem'){if((next.inventory[e.itemId]??0)<e.quantity)return {state,message:'Zajrzyj do plecaka. Ten przedmiot jest jeszcze potrzebny.'};next.inventory[e.itemId]-=e.quantity;if(next.inventory[e.itemId]===0)delete next.inventory[e.itemId]}
 for(const e of effects){
  if(e.type==='giveItem'){if(!Object.hasOwn(next.inventory,e.itemId)&&Object.keys(next.inventory).length>=PACK_CAPACITY)return {state,message:'W plecaku brakuje miejsca. Odłóż dekorację do domowego schowka. Przedmiot poczeka tutaj.'};next.inventory[e.itemId]=(next.inventory[e.itemId]??0)+e.quantity}
  else if(e.type==='placeFurniture'){const result=placeFurniture(next,content,{id:e.id,itemId:e.itemId,x:e.x,z:e.z,rotation:e.rotation});if(result.message)return {state,message:result.message};next=result.state}
  else if(e.type==='flag')next.flags[e.key]=e.value;
  else if(e.type==='read'&&!next.read.includes(e.documentId))next.read.push(e.documentId);
  else if(e.type==='complete'&&!next.completed.includes(e.sceneId))next.completed.push(e.sceneId);
  else if(e.type==='travel'){next.location=e.location;next.player={x:e.x,z:e.z,heading:e.heading};next.camera.yaw=e.heading;if(e.location==='village')next.flags.hosting=false}
 }
 return {state:next,message:''};
}
export function choose(content:ContentPack,state:SaveState,nodeId:string,choiceId:string){
 const node=content.story.nodes.find(n=>n.id===nodeId),option=node?.choices.find(c=>c.id===choiceId);
 if(!node||!option||findNode(content,state,node.target,node.event)?.id!==node.id)return {state,message:'Rozejrzyj się. Ta rozmowa już się zmieniła.'};
 const result=applyEffects(content,state,option.effects);if(result.state===state)return result;
 if(!result.state.seen.includes(node.id))result.state.seen.push(node.id);return result;
}

export function afterPlacement(content:ContentPack,state:SaveState,itemId:string){
 if(itemId==='lamp'&&!state.flags['lamp-placed']){
  const lamp=state.furniture.find(f=>f.itemId==='lamp'),bed=state.furniture.find(f=>f.itemId==='bed');
  if(lamp&&bed&&Math.hypot(lamp.x-bed.x,lamp.z-bed.z)<=2.8){const node=findNode(content,state,itemId,'place');if(node)return choose(content,state,node.id,node.choices[0].id).state}
 }
 return state;
}
