import {POND,pondRadius,terrainHeight} from './island-terrain';
import type {Point} from './movement';
import type {SaveState} from '../persistence/state';

export const STEGOSAURUS_FLAG='stegosaurus-awakened';
export const SECRET_LAPS=3;
const TAU=Math.PI*2;
type SecretState=Pick<SaveState,'location'|'inventory'|'flags'>;

export function onPondBank(point:Point){
 const radius=pondRadius(point.x,point.z);
 // radius=1 is where the basin rejoins the terrain, NOT the visible waterline.
 // Count the actual dry bank and allow a small step into the shallows. Crossing
 // the deeper water or taking a distant lap around the village still resets.
 return Number.isFinite(radius)&&radius>=.5&&radius<=2.3&&(radius>=1||terrainHeight(point.x,point.z)>=POND.waterLevel-.12);
}

/** Session-only progress. The discovery itself lives in the ordinary save flags. */
export class PondSecret{
 private previous:Point|null=null;
 private angle=0;
 private fired=false;
 get laps(){return this.angle/TAU}
 get progress(){return this.previous?Math.min(SECRET_LAPS,this.laps):null}
 reset(){this.previous=null;this.angle=0}
 sync(state:SecretState){
  if(state.location!=='village'||state.inventory.apple!==3||state.flags[STEGOSAURUS_FLAG])this.reset();
 }
 update(point:Point,state:SecretState){
  this.sync(state);
  if(this.fired||state.flags[STEGOSAURUS_FLAG]||state.location!=='village'||state.inventory.apple!==3)return false;
  if(!onPondBank(point)){this.reset();return false}
  const previous=this.previous;this.previous={x:point.x,z:point.z};
  if(!previous)return false;
  // Runtime samples every frame (max 0.2 m at running speed). Reject warps.
  if(Math.hypot(point.x-previous.x,point.z-previous.z)>.75){this.angle=0;return false}
  // +Z is up on the minimap. East -> north is counterclockwise.
  const current=Math.atan2((point.z-POND.z)/POND.radiusZ,(point.x-POND.x)/POND.radiusX);
  const last=Math.atan2((previous.z-POND.z)/POND.radiusZ,(previous.x-POND.x)/POND.radiusX);
  const delta=Math.atan2(Math.sin(current-last),Math.cos(current-last));
  this.angle=Math.max(0,this.angle+delta);
  if(this.angle+1e-9<SECRET_LAPS*TAU)return false;
  this.fired=true;return true;
 }
}
