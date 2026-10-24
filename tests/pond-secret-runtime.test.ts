// @vitest-environment jsdom
import {expect,it,vi} from 'vitest';

const loop=vi.hoisted(()=>({frame:null as (()=>void)|null}));
vi.mock('../src/game/babylon',async()=>{
 const actual=await vi.importActual<typeof import('../src/game/babylon')>('../src/game/babylon');
 return {...actual,Engine:class extends actual.NullEngine{
  override getDeltaTime(){return 50}
  override runRenderLoop(frame:()=>void){loop.frame=frame}
  override stopRenderLoop(){loop.frame=null}
 }};
});
import {VillageGame} from '../src/game/runtime';
import {DEFAULT_CONTENT} from '../src/content/defaults';
import {newSave} from '../src/persistence/state';
import {POND,pondRadius} from '../src/game/island-terrain';
import {STEGOSAURUS_FLAG} from '../src/game/pond-secret';

it('ciągły spacer po suchym brzegu uruchamia sekret przez runtime, autozapis i aktualizację świata',()=>{
 vi.stubGlobal('ResizeObserver',class{observe(){} disconnect(){}});
 vi.stubGlobal('matchMedia',()=>({matches:false}));
 vi.spyOn(document,'hidden','get').mockReturnValue(false);
 let state=newSave();state.welcomed=true;state.inventory.apple=3;
 state.player={x:POND.x+POND.radiusX*.9,z:POND.z,heading:0};state.camera.yaw=0;
 const canvas=document.createElement('canvas');canvas.width=800;canvas.height=600;
 const errors=vi.fn(),found=vi.fn(),progress=vi.fn();let saves=0,game:VillageGame|undefined;
 try{
  game=new VillageGame(canvas,state,{
   onReady:vi.fn(),onError:errors,onNear:vi.fn(),onAction:vi.fn(),onGamepad:vi.fn(),onPondProgress:progress,
   onSave:snapshot=>{saves++;state={...state,...snapshot};game?.syncState(state)},
   onStegosaurus:snapshot=>{found();state={...state,...snapshot,flags:{...state.flags,[STEGOSAURUS_FLAG]:true}};game?.syncState(state)},
  },DEFAULT_CONTENT);
  vi.spyOn(game.scene,'render').mockImplementation(()=>{});game.setPaused(false);
  let travelled=0,previousAngle=0,minRadius=1;
  for(let frame=0;frame<2400&&!found.mock.calls.length;frame++){
   const p=game.snapshot().player;
   const angle=Math.atan2((p.z-POND.z)/POND.radiusZ,(p.x-POND.x)/POND.radiusX);
   travelled+=Math.atan2(Math.sin(angle-previousAngle),Math.cos(angle-previousAngle));previousAngle=angle;
   // Steer along a real walkable ellipse just outside the visible water, using
   // public touch controls and the real acceleration/collision/frame pipeline.
   const target={x:POND.x+POND.radiusX*.9*Math.cos(angle+.1),z:POND.z+POND.radiusZ*.9*Math.sin(angle+.1)};
   const dx=target.x-p.x,dz=target.z-p.z,length=Math.hypot(dx,dz);
   game.moveTouch(dx/length,dz/length);loop.frame!();
   minRadius=Math.min(minRadius,pondRadius(p.x,p.z));
  }
  expect(errors).not.toHaveBeenCalled();expect(found).toHaveBeenCalledTimes(1);
  expect(travelled/(Math.PI*2)).toBeGreaterThan(2.98);expect(travelled/(Math.PI*2)).toBeLessThan(3.01);
  expect(minRadius).toBeLessThan(1);expect(saves).toBeGreaterThan(20);
  expect(state.inventory.apple).toBe(3);expect(state.flags[STEGOSAURUS_FLAG]).toBe(true);
  expect(progress.mock.calls.some(([laps])=>laps>1&&laps<2)).toBe(true);
  expect(game.world.stegosaurus?.actor).not.toBeNull();expect(game.world.stegosaurus?.progress).toBeLessThan(.01);
  game.moveTouch(0,0);for(let frame=0;frame<500;frame++)loop.frame!();
  expect(game.world.stegosaurus?.progress).toBe(1);expect(found).toHaveBeenCalledTimes(1);
  expect(progress.mock.calls.at(-1)?.[0]).toBeNull();expect(errors).not.toHaveBeenCalled();
 }finally{game?.dispose();vi.restoreAllMocks();vi.unstubAllGlobals()}
},30000);
