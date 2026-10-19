import {emptyProgress,type ReadingProgress} from '../reading/model';
export type QuestProgress={status:'available'|'active'|'completed';reading:ReadingProgress;rewardGranted:boolean};
export const newQuest=():QuestProgress=>({status:'available',reading:emptyProgress(),rewardGranted:false});
export function startQuest(quest:QuestProgress):QuestProgress{return quest.status==='available'?{...quest,status:'active'}:quest}
export function completeQuest(quest:QuestProgress):QuestProgress{
  return quest.reading.completed?{...quest,status:'completed',rewardGranted:true}:quest;
}
