import {it,expect} from 'vitest';
import {advanceNpc,type NpcMotion} from '../src/game/npc';
import type {Behavior} from '../src/content/types';
import {blocked,type Solid} from '../src/game/movement';
const patrol:Behavior={type:'patrol',speed:.6,pauseSeconds:.5,waypoints:[{x:1,z:0},{x:0,z:0}]};
const start=():NpcMotion=>({x:0,z:0,heading:0,waypoint:0,waiting:0,stuck:0});
it('spaceruje między punktami, czeka i zatrzymuje się na czas rozmowy oraz blisko gracza',()=>{
 let m=start();const far={x:10,z:10};for(let i=0;i<36;i++)m=advanceNpc(m,patrol,.05,[],far,false).motion;
 expect(m.waypoint).toBe(1);expect(m.x).toBeGreaterThan(.8);
 for(const [behavior,player,paused] of [[{type:'idle'},far,false],[patrol,{x:m.x,z:m.z+1},false],[patrol,far,true]] as const)expect(advanceNpc(m,behavior,.05,[],player,paused)).toEqual({motion:m,speed:0});
 for(let i=0;i<42;i++)m=advanceNpc(m,patrol,.05,[],far,false).motion;expect(m.x).toBeLessThan(.3);
});
it('nie wchodzi w przeszkodę, a zablokowaną trasę przerywa bez teleportacji',()=>{
 const solids:Solid[]=[{id:'wall',type:'box',x:.8,z:0,halfX:.1,halfZ:3}];let m=start();let changed=false;
 for(let i=0;i<120;i++){const next=advanceNpc(m,patrol,.05,solids,{x:10,z:10},false).motion;expect(blocked(next,solids,.42)).toBe(false);expect(Math.hypot(next.x-m.x,next.z-m.z)).toBeLessThanOrEqual(.031);if(next.waypoint===1)changed=true;m=next}
 expect(changed).toBe(true);
});
