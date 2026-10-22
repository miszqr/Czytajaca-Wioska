import {it,expect,vi} from 'vitest';
import {NullEngine,Scene,FreeCamera,Vector3,CreateGround} from '../src/game/babylon';
import {createGoldenHour} from '../src/game/golden-hour';
import {createCharacter} from '../src/characters/models';
import {createShapes} from '../src/game/shapes';
import {terrainHeight,shoreRadius} from '../src/game/island-terrain';

it('cień używa tylnych ścian postaci, zachowuje przednią stronę dachu i stałą projekcję podczas ruchu',async()=>{
 const engine=new NullEngine(),scene=new Scene(engine);
 try{
  const lighting=createGoldenHour(scene),kitek=createCharacter(scene,'kitek');
  const roof=CreateGround('single-sided-roof',{width:3,height:3},scene);
  roof.position.set(3,2,0);roof.material=createShapes(scene).material('#D4B577');
  const camera=new FreeCamera('test-camera',new Vector3(0,3,-8),scene);camera.setTarget(Vector3.Zero());scene.activeCamera=camera;
  const actors=kitek.root.getChildMeshes(),shadows=lighting.addShadows([...actors,roof],[...actors,roof]);
  await shadows.forceCompilationAsync();
  // Inspect actual Babylon shadow draws, including the order of the public
  // per-submesh hook. Back-face culling must never leak onto scenery.
  let reversed=false;
  const state=vi.spyOn(engine,'setState').mockImplementation((_cull,_offset,_force,reverse)=>{reversed=!!reverse});
  const draws=new Map<string,boolean>();
  shadows.onBeforeShadowMapRenderMeshObservable.add(mesh=>draws.set(mesh.name,reversed));
  scene.render();
  expect(draws.get('head-fur')).toBe(true);expect(draws.get('fox-ear')).toBe(true);
  expect(draws.get('single-sided-roof')).toBe(false);
  expect(draws.has('eye-glint')).toBe(false);expect(draws.has('pupil')).toBe(false);
  const fixed=Array.from(shadows.getTransformMatrix().asArray());
  for(const [x,z] of [[0,-5],[23,17],[-25,8]]){
   kitek.root.position.set(x,terrainHeight(x,z),z);kitek.animate(x+30,2.4);
   camera.position.set(x+4,4,z-7);camera.setTarget(kitek.root.position);
   draws.clear();scene.render();
   expect(Array.from(shadows.getTransformMatrix().asArray())).toEqual(fixed);
   expect(draws.get('head-fur')).toBe(true);expect(draws.get('single-sided-roof')).toBe(false);
  }
  state.mockRestore();
  // The whole walking boundary remains covered, including the player's head.
  for(let angle=0;angle<Math.PI*2;angle+=.05){
   const r=shoreRadius(angle)-1,x=Math.cos(angle)*r,z=Math.sin(angle)*r;
   const p=Vector3.TransformCoordinates(new Vector3(x,terrainHeight(x,z)+1.5,z),shadows.getTransformMatrix());
   expect(Math.max(Math.abs(p.x),Math.abs(p.y),Math.abs(p.z))).toBeLessThan(1);
  }
 }finally{scene.dispose();engine.dispose();vi.restoreAllMocks()}
},15000);
