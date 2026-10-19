import {emptyProgress,type ReadingProgress} from '../reading/model';
export type QuestProgress={status:'available'|'active'|'completed';reading:ReadingProgress;rewardGranted:boolean;revision:number;introduced:boolean};
export const newQuest=(revision=1):QuestProgress=>({status:'available',reading:emptyProgress(),rewardGranted:false,revision,introduced:false});
export function startQuest(quest:QuestProgress):QuestProgress{return quest.status==='available'?{...quest,status:'active'}:quest}
