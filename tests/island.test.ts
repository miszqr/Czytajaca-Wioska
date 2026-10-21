import {it,expect} from 'vitest';
import {ISLAND,shoreRadius,terrainHeight,shoreDistance,beachApproach} from '../src/game/island-terrain';
import {blocked,moveWithSlide} from '../src/game/movement';
import {CONFIG} from '../src/game/config';
import {NullEngine,Scene,Vector3,Ray,VertexBuffer} from '../src/game/babylon';
import {createIslandGround} from '../src/game/island-coast';
import {createShapes} from '../src/game/shapes';

it('morze otacza całą wyspę, a zejście do plaży jest ciągłe i łagodne',()=>{
 let maximumSlope=0;
 for(let degrees=0;degrees<360;degrees+=2){
  const angle=degrees*Math.PI/180,r=shoreRadius(angle),point=(distance:number)=>({x:Math.cos(angle)*distance,z:Math.sin(angle)*distance});
  const shore=point(r);expect(terrainHeight(shore.x,shore.z)).toBeCloseTo(ISLAND.seaLevel,8);
  const offshore=point(r+3);expect(terrainHeight(offshore.x,offshore.z)).toBeLessThan(ISLAND.seaLevel-.5);
  const beach=point(r-2);expect(blocked(beach,[])).toBe(false);
  // A long movement must stop on sand in every direction, even across coves.
  const end=moveWithSlide(beach,{x:Math.cos(angle)*12,z:Math.sin(angle)*12},[]);
  expect(blocked(end,[])).toBe(false);expect(shoreDistance(end.x,end.z)).toBeLessThan(1.1);
  expect(terrainHeight(end.x,end.z)).toBeGreaterThan(ISLAND.seaLevel);
  expect(Math.abs(end.x)).toBeLessThan(CONFIG.worldHalfSize);expect(Math.abs(end.z)).toBeLessThan(CONFIG.worldHalfSize);
  for(let distance=ISLAND.slopeStart;distance<=r+.1;distance+=.15){
   const p=point(distance),dx=(terrainHeight(p.x+.01,p.z)-terrainHeight(p.x-.01,p.z))/.02,dz=(terrainHeight(p.x,p.z+.01)-terrainHeight(p.x,p.z-.01))/.02;
   maximumSlope=Math.max(maximumSlope,Math.hypot(dx,dz));
  }
 }
 // No cliffs or stair steps: less than 23 degrees at the steepest point.
 expect(maximumSlope).toBeLessThan(.42);
 expect(blocked({x:49,z:49},[])).toBe(true);
 for(const [x,z] of [[0,-49],[-49,10],[4,49],[49,-3]]){
  const [px,pz]=beachApproach(x,z);expect(blocked({x:px,z:pz},[])).toBe(false);
 }
});

it('nowy brzeg zachowuje wysokości domów, fabuły i stawu',()=>{
 for(let x=-35;x<=35;x+=1)for(let z=-35;z<=35;z+=1){
  if(Math.hypot(x,z)>ISLAND.slopeStart)continue;
  const edge=Math.min(1,Math.max(0,(Math.hypot(x,z)-12)/18));
  expect(terrainHeight(x,z)).toBe(edge*(.4*Math.sin(x*.11)*Math.cos(z*.09)+.15*Math.sin(z*.2)));
 }
});

it('widoczny stok zgadza się z chodzeniem i osłoną kamery, krawędzie siatki są pod morzem',()=>{
 const engine=new NullEngine(),scene=new Scene(engine);
 try{
  const ground=createIslandGround(scene,createShapes(scene));ground.computeWorldMatrix(true);
  for(const kind of [VertexBuffer.PositionKind,VertexBuffer.NormalKind,VertexBuffer.ColorKind])expect(ground.getVerticesData(kind)!.every(Number.isFinite)).toBe(true);
  const p=ground.getVerticesData(VertexBuffer.PositionKind)!;
  for(let i=0;i<p.length;i+=3)if(Math.abs(p[i])===55||Math.abs(p[i+2])===55)expect(p[i+1]).toBeLessThan(ISLAND.seaLevel-.5);
  for(let degrees=0;degrees<360;degrees+=15){
   const angle=degrees*Math.PI/180;
   for(const inset of [.8,1,3,6,9]){
    const r=shoreRadius(angle)-inset,x=Math.cos(angle)*r,z=Math.sin(angle)*r;
    const hit=scene.pickWithRay(new Ray(new Vector3(x,5,z),new Vector3(0,-1,0),12),m=>m.metadata?.cameraObstacle===true);
    expect(hit?.hit).toBe(true);expect(hit!.getNormal(true)!.y).toBeGreaterThan(.9);
    expect(hit!.pickedPoint!.y).toBeGreaterThan(ISLAND.seaLevel);
    expect(Math.abs(hit!.pickedPoint!.y-terrainHeight(x,z))).toBeLessThan(.025);
   }
  }
 }finally{scene.dispose();engine.dispose()}
});
