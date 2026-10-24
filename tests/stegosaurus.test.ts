import {expect,it} from 'vitest';
import {PondSecret,STEGOSAURUS_FLAG} from '../src/game/pond-secret';
import {ISLAND,POND,pondRadius,shoreDistance,terrainHeight} from '../src/game/island-terrain';
import {newSave,validateSave} from '../src/persistence/state';
import {NullEngine,Scene,Vector3,VertexBuffer,FreeCamera} from '../src/game/babylon';
import {createStegosaurus} from '../src/characters/stegosaurus';
import {createSeaStegosaurus,stegosaurusPose} from '../src/game/sea-stegosaurus';
import {createVillage} from '../src/game/world';
import {DEFAULT_CONTENT} from '../src/content/defaults';
import {blocked,moveWithSlide,type Point,type Solid} from '../src/game/movement';

const TAU=Math.PI*2;
function point(angle:number,radius=1.15){return {x:POND.x+Math.cos(angle)*POND.radiusX*radius,z:POND.z+Math.sin(angle)*POND.radiusZ*radius}}
function state(){const s=newSave();s.inventory.apple=3;return s}
function walk(tracker:PondSecret,s=state(),from=0,to=TAU*3,radius=1.15){
 let events=0;const steps=Math.ceil(Math.abs(to-from)/.02);
 for(let i=0;i<=steps;i++)if(tracker.update(point(from+(to-from)*i/(steps||1),radius),s))events++;
 return events;
}
it('wymaga trzech pełnych okrążeń CCW z dowolnego startu, wyzwala tylko raz',()=>{
 const tracker=new PondSecret(),s=state(),start=2.9;
 expect(walk(tracker,s,start,start+TAU*2.99)).toBe(0);
 expect(tracker.laps).toBeCloseTo(2.99);
 expect(walk(tracker,s,start+TAU*2.99,start+TAU*3)).toBe(1);
 expect(walk(tracker,s,start+TAU*3,start+TAU*7)).toBe(0);
 expect(s.inventory.apple).toBe(3);
});
it.each([undefined,0,1,2,4,12])('nie wyzwala sekretu przy %s jabłkach ani z jabłkami w schowku',apples=>{
 const s=state();if(apples===undefined)delete s.inventory.apple;else s.inventory.apple=apples;s.storage.apple=3;
 const tracker=new PondSecret();expect(walk(tracker,s)).toBe(0);expect(tracker.laps).toBe(0);
});
it('ruch zgodny z zegarem, obrót w miejscu i oscylowanie nie nabijają okrążeń',()=>{
 const tracker=new PondSecret(),s=state();expect(walk(tracker,s,0,-TAU*4)).toBe(0);
 for(let i=0;i<100;i++){expect(walk(tracker,s,0,.15)).toBe(0);expect(walk(tracker,s,.15,0)).toBe(0)}
 for(let i=0;i<1000;i++)expect(tracker.update(point(0),s)).toBe(false);
 expect(tracker.laps).toBeCloseTo(0);
 // On the fixed minimap: east -> north -> west -> south is CCW.
 const ccw=new PondSecret();walk(ccw,s,0,TAU*.75);expect(ccw.laps).toBeCloseTo(.75);
 walk(ccw,s,TAU*.75,TAU*.5);expect(ccw.laps).toBeCloseTo(.5);
});
it('przejście przez wodę, odejście od stawu, teleport i wejście do domu przerywają serię',()=>{
 for(const invalid of [{x:POND.x,z:POND.z},point(0,2.4),{x:NaN,z:17},point(Math.PI)]){
  const tracker=new PondSecret(),s=state();walk(tracker,s,0,TAU*2);tracker.update(invalid,s);
  expect(tracker.laps).toBe(0);expect(walk(tracker,s,0,TAU*2.9)).toBe(0);
 }
 for(const change of [(s:ReturnType<typeof state>)=>{s.location='home'},(s:ReturnType<typeof state>)=>{s.inventory.apple=4}]){
  const tracker=new PondSecret(),s=state();walk(tracker,s,0,TAU*2);change(s);tracker.sync(s);
  s.location='village';s.inventory.apple=3;expect(walk(tracker,s,0,TAU*2.9)).toBe(0);
 }
});
it('odkrycie przeżywa zapis v3 bez utraty fabuły i jabłek; nowa gra pozwala na nowy sekret',()=>{
 const s=state();s.flags[STEGOSAURUS_FLAG]=true;s.flags['met-bruno']=true;s.completed=['arrival'];
 const loaded=validateSave(JSON.parse(JSON.stringify(s)))!;
 expect(loaded.flags).toEqual(s.flags);expect(loaded.inventory.apple).toBe(3);expect(loaded.completed).toEqual(['arrival']);
 expect(walk(new PondSecret(),loaded)).toBe(0);expect(walk(new PondSecret(),state())).toBe(1);
});

it('model ma dorosłe rozmiary, poprawną geometrię i niewielką liczbę ruchomych siatek',()=>{
 const engine=new NullEngine(),scene=new Scene(engine);
 try{
  const actor=createStegosaurus(scene),meshes=actor.root.getChildMeshes();
  const min=new Vector3(Infinity,Infinity,Infinity),max=new Vector3(-Infinity,-Infinity,-Infinity);
  for(const mesh of meshes){
   mesh.computeWorldMatrix(true);const bounds=mesh.getBoundingInfo().boundingBox;
   min.minimizeInPlace(bounds.minimumWorld);max.maximizeInPlace(bounds.maximumWorld);
   for(const kind of [VertexBuffer.PositionKind,VertexBuffer.NormalKind])expect(mesh.getVerticesData(kind)!.every(Number.isFinite)).toBe(true);
   expect(mesh.metadata.cameraObstacle).toBe(true);expect(mesh.isPickable).toBe(true);
  }
  expect(max.z-min.z).toBeGreaterThan(8.5);expect(max.z-min.z).toBeLessThan(9.5);
  expect(max.y-min.y).toBeGreaterThan(3.7);expect(max.y-min.y).toBeLessThan(4.3);
  expect(min.y).toBeCloseTo(0,1);expect(max.x-min.x).toBeLessThan(2.6);
  expect(meshes.length).toBeLessThan(30);
  actor.animate(1,true);expect(scene.getTransformNodeByName('stegosaurus-front-leg')!.rotation.x).not.toBe(0);
  actor.animate(1,true,true);expect(scene.getTransformNodeByName('stegosaurus-front-leg')!.rotation.x).toBe(0);
 }finally{scene.dispose();engine.dispose()}
});
it('wychodzi spod morza, zatrzymuje się na plaży, pauzuje przy Kitku i odtwarza z zapisu',()=>{
 const engine=new NullEngine(),scene=new Scene(engine),solids:Solid[]=[];
 try{
  let shadowMeshes=0;const visitor=createSeaStegosaurus(scene,solids,meshes=>{shadowMeshes+=meshes.length}),s=state();
  visitor.sync(s);expect(visitor.actor).toBeNull();expect(solids).toHaveLength(0);
  s.flags[STEGOSAURUS_FLAG]=true;visitor.sync(s);expect(visitor.progress).toBe(0);expect(shadowMeshes).toBeGreaterThan(0);
  for(const mesh of visitor.actor!.root.getChildMeshes()){mesh.computeWorldMatrix(true);expect(mesh.getBoundingInfo().boundingBox.maximumWorld.y).toBeLessThan(ISLAND.seaLevel)}
  visitor.update(.05,{x:0,z:0},true);expect(visitor.progress).toBe(0);
  for(let i=0;i<240;i++)visitor.update(.05,{x:0,z:0},false);
  const half=visitor.progress;expect(half).toBeCloseTo(.5);
  const ahead=stegosaurusPose(half+.05/24);visitor.update(.05,ahead,false);expect(visitor.progress).toBe(half);
  for(let i=0;i<400;i++)visitor.update(.05,{x:0,z:0},false);
  expect(visitor.progress).toBe(1);expect(solids).toHaveLength(4);
  const end=visitor.actor!.root.position;expect(shoreDistance(end.x,end.z)).toBeGreaterThan(4);
  expect(end.y).toBeCloseTo(terrainHeight(end.x,end.z));expect(blocked(end,solids)).toBe(true);
  visitor.sync(s);expect(visitor.progress).toBe(1);expect(solids).toHaveLength(4);
  const restored=createSeaStegosaurus(scene,[],()=>{});restored.sync(s);expect(restored.progress).toBe(1);
  visitor.sync(newSave());expect(visitor.actor).toBeNull();expect(solids).toHaveLength(0);
 }finally{scene.dispose();engine.dispose()}
});

// Find actual collision-free paths around fences and trees, rather than testing
// only an ideal mathematical ellipse which the player might not be able to walk.
function pathBetween(start:Point,end:Point,solids:Solid[]){
 const step=.4,key=(p:Point)=>`${p.x.toFixed(3)},${p.z.toFixed(3)}`;
 const queue=[start],previous=new Map<string,Point|null>([[key(start),null]]);let goal:Point|undefined;
 for(let i=0;i<queue.length;i++){
  const p=queue[i];if(Math.hypot(p.x-end.x,p.z-end.z)<.5){goal=p;break}
  for(const [dx,dz] of [[step,0],[-step,0],[0,step],[0,-step],[step,step],[step,-step],[-step,step],[-step,-step]]){
   const next={x:p.x+dx,z:p.z+dz},id=key(next),r=pondRadius(next.x,next.z);
   if(previous.has(id)||r<1.03||r>2.25||blocked(next,solids))continue;
   const moved=moveWithSlide(p,{x:dx,z:dz},solids);if(Math.hypot(moved.x-next.x,moved.z-next.z)>.01)continue;
   previous.set(id,p);queue.push(next);
  }
 }
 const closest=queue.reduce((a,b)=>Math.hypot(a.x-end.x,a.z-end.z)<Math.hypot(b.x-end.x,b.z-end.z)?a:b);
 expect(goal,`reachable waypoint ${JSON.stringify(end)}; closest=${JSON.stringify(closest)} nearby=${JSON.stringify(solids.filter(s=>Math.hypot(s.x-end.x,s.z-end.z)<7))} visited=${queue.length}`).toBeDefined();const path:Point[]=[];
 for(let p:Point|null=goal!;p;p=previous.get(key(p))??null)path.unshift(p);
 return path;
}
it('sekret da się uruchomić w rzeczywistej wiosce, omijając płoty; stegozaur nie przecina drzew',()=>{
 const engine=new NullEngine(),scene=new Scene(engine);
 try{
  const world=createVillage(scene,DEFAULT_CONTENT.characters),s=state();world.syncEnvironment(s);
  const camera=new FreeCamera('test',new Vector3(25,5,12),scene);camera.setTarget(new Vector3(30,1,20));scene.activeCamera=camera;
  const route:Point[]=[{x:POND.x+POND.radiusX*1.1,z:POND.z}];
  for(let i=1;i<=12;i++)route.push(...pathBetween(route.at(-1)!,point(i*TAU/12,1.1),world.solids).slice(1));
  route.push(...pathBetween(route.at(-1)!,route[0],world.solids).slice(1));
  const last=route.at(-1)!;
  const closed=moveWithSlide(last,{x:route[0].x-last.x,z:route[0].z-last.z},world.solids);
  expect(closed.x).toBeCloseTo(route[0].x);expect(closed.z).toBeCloseTo(route[0].z);route.push(route[0]);
  const tracker=new PondSecret();let triggered=0;
  for(let lap=0;lap<3;lap++)for(const p of route)if(tracker.update(p,s)){triggered++;s.flags[STEGOSAURUS_FLAG]=true;world.syncEnvironment(s)}
  expect(triggered).toBe(1);expect(world.stegosaurus.actor).not.toBeNull();
  const scenery=world.solids.filter(s=>!s.id.startsWith('stegosaurus-'));
  for(let i=0;i<500;i++){
   world.stegosaurus.update(.05,{x:0,z:0},false);
   for(const body of world.solids.filter(s=>s.id.startsWith('stegosaurus-'))){
    const radius=body.type==='circle'?body.radius:0;
    // Sea creatures may cross the shoreline; blocked() also enforces Kitek's
    // land-only rule, so inspect it only once the entire body circle is ashore.
    if(shoreDistance(body.x,body.z)<=radius*1.1+.45)continue;
    expect(blocked(body,scenery,radius),'dinosaur route avoids scenery').toBe(false);
   }
  }
  expect(world.stegosaurus.progress).toBe(1);scene.render();
 }finally{scene.dispose();engine.dispose()}
});
