import {CONFIG} from '../game/config';
import type {Furniture,Location} from '../content/types';
export type PlayerPose={x:number;z:number;heading:number};
export type CameraPose={yaw:number;pitch:number;distance:number};
export type SaveState={version:3;location:Location;player:PlayerPose;camera:CameraPose;flags:Record<string,boolean>;completed:string[];seen:string[];read:string[];inventory:Record<string,number>;storage:Record<string,number>;furniture:Furniture[];welcomed:boolean;updatedAt:number};
export const INITIAL_FURNITURE:Furniture[]=[{id:'starter-bed',itemId:'bed',x:-3,z:1.5,rotation:0},{id:'starter-table',itemId:'table',x:1.7,z:1.2,rotation:0}];
export function newSave():SaveState{return {version:3,location:'village',player:{...CONFIG.spawn},camera:{yaw:0,pitch:.3,distance:CONFIG.cameraDistance},flags:{},completed:[],seen:[],read:[],inventory:{},storage:{},furniture:structuredClone(INITIAL_FURNITURE),welcomed:false,updatedAt:Date.now()}}
const finite=(v:unknown):v is number=>typeof v==='number'&&Number.isFinite(v);
const record=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
const safeId=(id:string)=>/^[a-z][a-z0-9-]{0,63}$/.test(id)&&!['constructor','prototype'].includes(id);
const ids=(v:unknown):v is string[]=>Array.isArray(v)&&v.length<=1000&&v.every(x=>typeof x==='string'&&safeId(x))&&new Set(v).size===v.length;
export function validateSave(input:unknown):SaveState|null{
 if(!record(input)||![1,2,3].includes(input.version as number)||!record(input.player)||!record(input.camera))return null;
 const s=input,p=input.player,c=input.camera;
 if(![p.x,p.z,p.heading,c.yaw,c.pitch,c.distance,s.updatedAt].every(finite)||Math.abs(p.x as number)>CONFIG.worldHalfSize||Math.abs(p.z as number)>CONFIG.worldHalfSize)return null;
 const next=newSave();next.player={x:p.x as number,z:p.z as number,heading:p.heading as number};next.camera={yaw:c.yaw as number,pitch:Math.max(CONFIG.cameraMinPitch,Math.min(CONFIG.cameraMaxPitch,c.pitch as number)),distance:Math.max(CONFIG.cameraMinDistance,Math.min(CONFIG.cameraMaxDistance,c.distance as number))};next.welcomed=s.welcomed===true;next.updatedAt=s.updatedAt as number;
 if(s.version===1||s.version===2){
  // Old reading progress is archived by SaveStore before the first v3 write.
  // The story starts from its arrival, while the player's position and gifts remain.
  if(s.version===1){if(!record(s.quest)||!record(s.quest.reading)||!['available','active','completed'].includes(String(s.quest.status))||typeof s.quest.rewardGranted!=='boolean')return null;if(s.quest.rewardGranted)next.inventory['mak-seed']=1}
  else{if(!record(s.quests)||!record(s.inventory))return null;for(const [id,value] of Object.entries(s.inventory)){if(!safeId(id)||!Number.isSafeInteger(value)||(value as number)<1)return null;next.inventory[id]=value as number}if(Object.keys(next.inventory).length>12)return null}
  return next;
 }
 if(s.location!=='home'&&s.location!=='village'||!record(s.flags)||Object.keys(s.flags).length>1000||!ids(s.completed)||!ids(s.seen)||!ids(s.read)||!record(s.inventory)||Object.keys(s.inventory).length>12||!Array.isArray(s.furniture)||s.furniture.length>80)return null;
 if(Object.entries(s.flags).some(([k,v])=>!safeId(k)||typeof v!=='boolean'))return null;
 for(const [id,value] of Object.entries(s.inventory)){if(!safeId(id)||!Number.isSafeInteger(value)||(value as number)<1)return null;next.inventory[id]=value as number}
 const furniture:Furniture[]=[];
 for(const f of s.furniture){if(!record(f)||typeof f.id!=='string'||!safeId(f.id)||typeof f.itemId!=='string'||!safeId(f.itemId)||!finite(f.x)||!finite(f.z)||Math.abs(f.x)>4.5||Math.abs(f.z)>3.5||![0,1,2,3].includes(f.rotation as number))return null;furniture.push({id:f.id,itemId:f.itemId,x:f.x,z:f.z,rotation:f.rotation as Furniture['rotation']})}
 if(new Set(furniture.map(f=>f.id)).size!==furniture.length)return null;
 if(s.storage!==undefined){if(!record(s.storage)||Object.keys(s.storage).length>200)return null;for(const [id,value] of Object.entries(s.storage)){if(!safeId(id)||!Number.isSafeInteger(value)||(value as number)<1)return null;next.storage[id]=value as number}}
 next.location=s.location;next.flags={...s.flags} as Record<string,boolean>;next.completed=[...s.completed];next.seen=[...s.seen];next.read=[...s.read];next.furniture=furniture;return next;
}
