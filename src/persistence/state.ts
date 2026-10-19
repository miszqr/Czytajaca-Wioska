import {CONFIG} from '../game/config';
import {newQuest,type QuestProgress} from '../quests/model';
export type PlayerPose={x:number;z:number;heading:number};
export type CameraPose={yaw:number;pitch:number;distance:number};
export type SaveState={version:1;player:PlayerPose;camera:CameraPose;quest:QuestProgress;welcomed:boolean;updatedAt:number};
export function newSave():SaveState{return {version:1,player:{...CONFIG.spawn},camera:{yaw:0,pitch:.3,distance:CONFIG.cameraDistance},quest:newQuest(),welcomed:false,updatedAt:Date.now()}}
function finite(value:unknown):value is number{return typeof value==='number'&&Number.isFinite(value)}
export function validateSave(input:unknown):SaveState|null{
  if(!input||typeof input!=='object')return null;
  const s=input as SaveState;
  if(s.version!==1||!s.player||!s.camera||!s.quest||!s.quest.reading)return null;
  if(![s.player.x,s.player.z,s.player.heading,s.camera.yaw,s.camera.pitch,s.camera.distance].every(finite))return null;
  if(Math.abs(s.player.x)>CONFIG.worldHalfSize||Math.abs(s.player.z)>CONFIG.worldHalfSize)return null;
  if(!['available','active','completed'].includes(s.quest.status)||typeof s.quest.rewardGranted!=='boolean'||typeof s.quest.reading.completed!=='boolean')return null;
  if(!Array.isArray(s.quest.reading.attempts)||!finite(s.quest.reading.hints)||s.quest.reading.hints<0)return null;
  if(!s.quest.reading.attempts.every(a=>typeof a.answer==='string'&&typeof a.correct==='boolean'&&finite(a.at)))return null;
  if(s.quest.status==='completed'&&(!s.quest.reading.completed||!s.quest.rewardGranted))return null;
  return {...s,player:{...s.player},camera:{...s.camera,pitch:Math.max(CONFIG.cameraMinPitch,Math.min(CONFIG.cameraMaxPitch,s.camera.pitch)),distance:Math.max(CONFIG.cameraMinDistance,Math.min(CONFIG.cameraMaxDistance,s.camera.distance))},welcomed:s.welcomed===true,quest:{...s.quest,reading:{...s.quest.reading,attempts:s.quest.reading.attempts.slice(-200)}}};
}
