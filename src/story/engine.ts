import type {Condition,ContentPack,Effect,StoryNode} from '../content/types';
import type {SaveState} from '../persistence/state';
export const PACK_CAPACITY=12;
export function matches(state:SaveState,conditions:readonly Condition[]){return conditions.every(c=>c.type==='flag'?!!state.flags[c.key]===c.value:(state.inventory[c.itemId]??0)>=c.quantity)}
export function findNode(content:ContentPack,state:SaveState,target:string,event:StoryNode['event']='interact'){
 if(event==='interact'){const t=content.interactions.find(t=>t.id===target);if(t&&(t.location!==state.location||!matches(state,t.when)))return undefined;if(content.characters.some(c=>c.id===target)&&state.location!=='village'&&!state.flags.hosting)return undefined}
 return content.story.nodes.filter(n=>n.target===target&&n.event===event&&(!n.once||!state.seen.includes(n.id))&&matches(state,n.when)).sort((a,b)=>b.priority-a.priority)[0];
}
export function currentScene(content:ContentPack,state:SaveState){return content.story.scenes.find(s=>!state.completed.includes(s.id)&&matches(state,s.when))}
export function applyEffects(state:SaveState,effects:readonly Effect[]):{state:SaveState;message:string}{
 const next=structuredClone(state);
 // Remove first, so delivering an item can free a slot for a gift atomically.
 for(const e of effects.filter(e=>e.type==='takeItem'))if(e.type==='takeItem'){if((next.inventory[e.itemId]??0)<e.quantity)return {state,message:'Zajrzyj do plecaka. Ten przedmiot jest jeszcze potrzebny.'};next.inventory[e.itemId]-=e.quantity;if(next.inventory[e.itemId]===0)delete next.inventory[e.itemId]}
 for(const e of effects){
  if(e.type==='giveItem'){if(!Object.hasOwn(next.inventory,e.itemId)&&Object.keys(next.inventory).length>=PACK_CAPACITY)return {state,message:'W plecaku brakuje miejsca. Odłóż dekorację do domowego schowka. Przedmiot poczeka tutaj.'};next.inventory[e.itemId]=(next.inventory[e.itemId]??0)+e.quantity}
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
 const result=applyEffects(state,option.effects);if(result.state===state)return result;
 if(!result.state.seen.includes(node.id))result.state.seen.push(node.id);return result;
}
