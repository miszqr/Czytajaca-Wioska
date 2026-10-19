import {CONFIG} from '../game/config';
import {newQuest,type QuestProgress} from '../quests/model';
export type PlayerPose={x:number;z:number;heading:number};
export type CameraPose={yaw:number;pitch:number;distance:number};
export type SaveState={version:2;player:PlayerPose;camera:CameraPose;quests:Record<string,QuestProgress>;inventory:Record<string,number>;welcomed:boolean;updatedAt:number};
export function newSave():SaveState{return {version:2,player:{...CONFIG.spawn},camera:{yaw:0,pitch:.3,distance:CONFIG.cameraDistance},quests:{},inventory:{},welcomed:false,updatedAt:Date.now()}}
const finite=(value:unknown):value is number=>typeof value==='number'&&Number.isFinite(value);
const record=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
const safeId=(id:string)=>/^[a-z][a-z0-9-]{0,63}$/.test(id)&&!['constructor','prototype'].includes(id);
function progress(value:unknown,legacy=false):QuestProgress|null{
 if(!record(value)||!record(value.reading))return null;
 const q=value,r=q.reading as Record<string,unknown>;
 if(!['available','active','completed'].includes(String(q.status))||typeof q.rewardGranted!=='boolean'||typeof r.completed!=='boolean')return null;
 if(!Array.isArray(r.attempts)||!Number.isInteger(r.hints)||(r.hints as number)<0||!r.attempts.every(a=>record(a)&&typeof a.answer==='string'&&typeof a.correct==='boolean'&&finite(a.at)))return null;
 if(q.status==='completed'&&(!r.completed||!q.rewardGranted)||q.rewardGranted&&q.status!=='completed')return null;
 if(!legacy&&(!Number.isInteger(q.revision)||(q.revision as number)<1||typeof q.introduced!=='boolean'))return null;
 return {...newQuest(),status:q.status as QuestProgress['status'],rewardGranted:q.rewardGranted,revision:legacy?1:q.revision as number,introduced:legacy?q.status!=='available':q.introduced as boolean,reading:{completed:r.completed,hints:r.hints as number,attempts:r.attempts.slice(-200).map(a=>({answer:a.answer,correct:a.correct,at:a.at}))}};
}
export function validateSave(input:unknown):SaveState|null{
 if(!record(input)||(input.version!==1&&input.version!==2)||!record(input.player)||!record(input.camera))return null;
 const s=input,p=s.player as Record<string,unknown>,c=s.camera as Record<string,unknown>;
 if(![p.x,p.z,p.heading,c.yaw,c.pitch,c.distance].every(finite)||Math.abs(p.x as number)>CONFIG.worldHalfSize||Math.abs(p.z as number)>CONFIG.worldHalfSize||!finite(s.updatedAt))return null;
 const quests:Record<string,QuestProgress>={},inventory:Record<string,number>={};
 if(s.version===1){const q=progress(s.quest,true);if(!q)return null;quests['bruno-ma']=q;if(q.rewardGranted)inventory['mak-seed']=1}
 else{
  if(!record(s.quests)||!record(s.inventory)||Object.keys(s.quests).length>300||Object.keys(s.inventory).length>12)return null;
  for(const [id,value] of Object.entries(s.quests)){if(!safeId(id))return null;const q=progress(value);if(!q)return null;quests[id]=q}
  for(const [id,value] of Object.entries(s.inventory)){if(!safeId(id)||!Number.isSafeInteger(value)||(value as number)<1)return null;inventory[id]=value as number}
 }
 return {version:2,player:{x:p.x as number,z:p.z as number,heading:p.heading as number},camera:{yaw:c.yaw as number,pitch:Math.max(CONFIG.cameraMinPitch,Math.min(CONFIG.cameraMaxPitch,c.pitch as number)),distance:Math.max(CONFIG.cameraMinDistance,Math.min(CONFIG.cameraMaxDistance,c.distance as number))},quests,inventory,welcomed:s.welcomed===true,updatedAt:s.updatedAt};
}
