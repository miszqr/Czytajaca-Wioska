import type {ContentPack,QuestDefinition} from '../content/types';
import type {SaveState} from '../persistence/state';
import {newQuest,startQuest} from './model';
import {answerExercise,emptyProgress,useHint} from '../reading/model';
export const PACK_CAPACITY=12;
export function reconcileContent(state:SaveState,content:ContentPack):SaveState{
 const quests={...state.quests};
 for(const q of content.quests){const old=quests[q.id];if(!old)quests[q.id]=newQuest(q.revision);else if(old.revision!==q.revision)quests[q.id]={...old,revision:q.revision,reading:old.status==='completed'?old.reading:emptyProgress()}}
 return {...state,quests};
}
export function isUnlocked(q:QuestDefinition,state:SaveState){return q.requires.every(id=>state.quests[id]?.status==='completed')}
export function meetQuest(state:SaveState,q:QuestDefinition):SaveState{return {...state,quests:{...state.quests,[q.id]:{...(state.quests[q.id]??newQuest(q.revision)),introduced:true}}}}
export function beginQuest(state:SaveState,q:QuestDefinition):SaveState{if(!isUnlocked(q,state))return state;return {...state,quests:{...state.quests,[q.id]:startQuest(state.quests[q.id]??newQuest(q.revision))}}}
export function hintQuest(state:SaveState,q:QuestDefinition):SaveState{const p=state.quests[q.id];if(!p||!isUnlocked(q,state))return state;return {...state,quests:{...state.quests,[q.id]:{...p,reading:useHint(p.reading)}}}}
export function submitQuest(state:SaveState,q:QuestDefinition,answer:string|readonly number[]){
 const old=state.quests[q.id];if(!old||old.status==='available'||!isUnlocked(q,state))return {state,correct:false,rewardPending:false};
 const reading=answerExercise(q.exercise,old.reading,answer);if(reading===old.reading)return {state,correct:false,rewardPending:false};
 const correct=reading.attempts.at(-1)!.correct,p={...old,reading},inventory={...state.inventory};let rewardPending=false;
 if(correct&&!p.rewardGranted){
  if(!Object.hasOwn(inventory,q.reward.itemId)&&Object.keys(inventory).length>=PACK_CAPACITY)rewardPending=true;
  else{inventory[q.reward.itemId]=(inventory[q.reward.itemId]??0)+q.reward.quantity;p.status='completed';p.rewardGranted=true}
 }
 return {state:{...state,inventory,quests:{...state.quests,[q.id]:p}},correct,rewardPending};
}
