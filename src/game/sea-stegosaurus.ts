import type {AbstractMesh} from '@babylonjs/core/Meshes/abstractMesh';
import type {Scene} from './babylon';
import {createStegosaurus} from '../characters/stegosaurus';
import {ISLAND,shoreRadius,terrainHeight} from './island-terrain';
import {STEGOSAURUS_FLAG} from './pond-secret';
import {CONFIG} from './config';
import type {Point,Solid} from './movement';
import type {SaveState} from '../persistence/state';

// An open stretch of beach east of the pond. Scenery keeps an 8.8 m coast margin.
const ANGLE=.54,SHORE=shoreRadius(ANGLE),START=SHORE+10,END=SHORE-5.5;
export const STEGOSAURUS_WALK_SECONDS=24;
export function stegosaurusPose(progress:number){
 const t=Math.max(0,Math.min(1,progress)),r=START+(END-START)*t;
 const x=Math.cos(ANGLE)*r,z=Math.sin(ANGLE)*r;
 const submerged=2.6*Math.max(0,1-t/.45);
 return {x,z,y:terrainHeight(x,z)-submerged,heading:-Math.PI/2-ANGLE};
}
function bodySolids(progress:number):Solid[]{
 const pose=stegosaurusPose(progress);
 if(pose.y+2.5<ISLAND.seaLevel)return [];
 return [{offset:-1.15,radius:.85},{offset:0,radius:1.02},{offset:1.1,radius:.74},{offset:2.4,radius:.35}].map(({offset,radius},i)=>({
  id:`stegosaurus-${i}`,type:'circle',x:pose.x+Math.sin(pose.heading)*offset,z:pose.z+Math.cos(pose.heading)*offset,radius,
 }));
}

export function createSeaStegosaurus(scene:Scene,solids:Solid[],addShadows:(meshes:AbstractMesh[])=>void){
 let actor:ReturnType<typeof createStegosaurus>|null=null,initialized=false,progress=0,time=0;
 const occupied:Solid[]=[];
 function clearSolids(){for(const solid of occupied){const index=solids.indexOf(solid);if(index>=0)solids.splice(index,1)}occupied.length=0}
 function place(){
  if(!actor?.loaded)return;
  const pose=stegosaurusPose(progress);actor.root.position.set(pose.x,pose.y,pose.z);actor.root.rotation.y=pose.heading;
  // Follow the gentle shoreline slope instead of walking horizontally above it.
  const dx=Math.sin(pose.heading)*1.2,dz=Math.cos(pose.heading)*1.2;
  actor.root.rotation.x=Math.atan2(terrainHeight(pose.x-dx,pose.z-dz)-terrainHeight(pose.x+dx,pose.z+dz),2.4);
  clearSolids();occupied.push(...bodySolids(progress));solids.push(...occupied);
 }
 function sync(state:SaveState){
  if(state.flags[STEGOSAURUS_FLAG]){
   if(!actor){
    const created=createStegosaurus(scene);actor=created;progress=initialized?0:1;
    void created.ready.then(loaded=>{if(loaded&&actor===created&&!scene.isDisposed){addShadows(created.root.getChildMeshes());place()}});
   }
  }else if(actor){clearSolids();actor.root.dispose();actor=null;progress=0;time=0}
  initialized=true;
 }
 function update(dt:number,player:Point,paused:boolean,reducedMotion=false){
  if(!actor?.loaded||paused||!Number.isFinite(dt)||dt<=0)return;
  const step=Math.min(dt,.05);time+=step;
  let moving=false;
  if(progress<1){
   const next=Math.min(1,progress+step/STEGOSAURUS_WALK_SECONDS);
   // Stop before touching Kitek. The player can always step out of its path.
   const occupiedByPlayer=bodySolids(next).some(s=>s.type==='circle'&&Math.hypot(player.x-s.x,player.z-s.z)<s.radius+CONFIG.playerRadius+.12);
   if(!occupiedByPlayer){progress=next;place();moving=true}
  }
  actor.animate(time,moving,reducedMotion);
 }
 return {sync,update,get actor(){return actor},get progress(){return progress}};
}
