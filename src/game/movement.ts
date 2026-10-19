import {CONFIG} from './config';
export type Point={x:number;z:number};
export type Solid=({type:'circle';x:number;z:number;radius:number}|{type:'box';x:number;z:number;halfX:number;halfZ:number}) & {id:string};
export function blocked(p:Point,solids:readonly Solid[],radius:number=CONFIG.playerRadius){
  if(Math.abs(p.x)>CONFIG.worldHalfSize-radius||Math.abs(p.z)>CONFIG.worldHalfSize-radius)return true;
  return solids.some(s=>s.type==='circle'?Math.hypot(p.x-s.x,p.z-s.z)<s.radius+radius:Math.hypot(Math.max(Math.abs(p.x-s.x)-s.halfX,0),Math.max(Math.abs(p.z-s.z)-s.halfZ,0))<radius);
}
export function moveWithSlide(p:Point,delta:Point,solids:readonly Solid[],radius:number=CONFIG.playerRadius):Point{
  const n=Math.max(1,Math.ceil(Math.hypot(delta.x,delta.z)/.1)),step={x:delta.x/n,z:delta.z/n};let result={...p};
  for(let i=0;i<n;i++){
    const next={x:result.x+step.x,z:result.z+step.z};
    if(!blocked(next,solids,radius)){result=next;continue}
    const x={x:result.x+step.x,z:result.z};if(!blocked(x,solids,radius))result=x;
    const z={x:result.x,z:result.z+step.z};if(!blocked(z,solids,radius))result=z;
  }return result;
}
export function movementVector(horizontal:number,forward:number,yaw:number):Point{
  const length=Math.hypot(horizontal,forward),scale=length>1?1/length:1;
  return {x:(Math.cos(yaw)*horizontal+Math.sin(yaw)*forward)*scale,z:(-Math.sin(yaw)*horizontal+Math.cos(yaw)*forward)*scale};
}
export function turnTowards(current:number,target:number,maxDelta:number){const delta=Math.atan2(Math.sin(target-current),Math.cos(target-current));return current+Math.max(-maxDelta,Math.min(maxDelta,delta))}
export function deadzone(value:number,threshold=.18){return Math.abs(value)<threshold?0:Math.sign(value)*(Math.abs(value)-threshold)/(1-threshold)}
export function terrainHeight(x:number,z:number){const edge=Math.min(1,Math.max(0,(Math.hypot(x,z)-12)/18));return edge*(.4*Math.sin(x*.11)*Math.cos(z*.09)+.15*Math.sin(z*.2))}
