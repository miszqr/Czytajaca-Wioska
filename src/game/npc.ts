import type {Behavior} from '../content/types';
import {moveWithSlide,turnTowards,type Solid,type Point} from './movement';
export type NpcMotion={x:number;z:number;heading:number;waypoint:number;waiting:number;stuck:number};
export function advanceNpc(motion:NpcMotion,behavior:Behavior,dt:number,solids:readonly Solid[],player:Point,paused:boolean):{motion:NpcMotion;speed:number}{
 if(paused||behavior.type==='idle'||Math.hypot(player.x-motion.x,player.z-motion.z)<3)return {motion,speed:0};
 if(motion.waiting>0)return {motion:{...motion,waiting:Math.max(0,motion.waiting-dt)},speed:0};
 const target=behavior.waypoints[motion.waypoint%behavior.waypoints.length],dx=target.x-motion.x,dz=target.z-motion.z,distance=Math.hypot(dx,dz);
 if(distance<.08)return {motion:{...motion,waypoint:(motion.waypoint+1)%behavior.waypoints.length,waiting:behavior.pauseSeconds,stuck:0},speed:0};
 const step=Math.min(distance,behavior.speed*dt),next=moveWithSlide(motion,{x:dx/distance*step,z:dz/distance*step},solids,.42),moved=Math.hypot(next.x-motion.x,next.z-motion.z),stuck=moved<.001?motion.stuck+dt:0;
 return {motion:{...motion,...next,heading:turnTowards(motion.heading,Math.atan2(dx,dz),dt*3),stuck:stuck>3?0:stuck,waypoint:stuck>3?(motion.waypoint+1)%behavior.waypoints.length:motion.waypoint,waiting:stuck>3?Math.max(.5,behavior.pauseSeconds):0},speed:moved/Math.max(dt,.001)};
}
