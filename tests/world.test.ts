import {it,expect} from 'vitest';
import {NullEngine,Scene,FreeCamera,Vector3,VertexBuffer,Ray,DirectionalLight} from '../src/game/babylon';
import {DEFAULT_CONTENT} from '../src/content/defaults';
import {createVillage} from '../src/game/world';
import {blocked} from '../src/game/movement';
import {createStoryWorld} from '../src/game/story-world';
import {homeSolids} from '../src/housing/model';
import {newSave} from '../src/persistence/state';
import type {Solid} from '../src/game/movement';
import {CONFIG} from '../src/game/config';
import {createFelaHouse} from '../src/game/fela-house';
import {createTolaLibrary} from '../src/game/tola-library';
import {createShapes} from '../src/game/shapes';
it('buduje rzeczywistą scenę Babylon, bezpieczny start, pięć modeli i kolizje',async()=>{
  const engine=new NullEngine(),scene=new Scene(engine),homeScene=new Scene(engine);
  try{
    const world=createVillage(scene,DEFAULT_CONTENT.characters);const camera=new FreeCamera('test',new Vector3(0,3,-8),scene);scene.activeCamera=camera;camera.setTarget(new Vector3(0,0,0));
    const road=scene.meshes.find(m=>m.material?.name==='#D7C396')!;expect(road).toBeDefined();const normals=road.getVerticesData(VertexBuffer.NormalKind)!;for(let i=1;i<normals.length;i+=3)expect(normals[i]).toBeGreaterThan(.9);
    // Inspect the final merged scene: ground decorations must receive real
    // shadows without being written back into the shadow map themselves.
    const sun=scene.getLightByName('golden-hour-sun') as DirectionalLight;
    const casters=sun.getShadowGenerator()!.getShadowMap()!.renderList!;
    const surfaceColors=['#D7C396','#DCCA9F','#E8D8B6','#CEBB91'];
    const surfaces=scene.meshes.filter(m=>surfaceColors.includes(m.material?.name??'')&&m.metadata?.castsShadow===false);
    expect(surfaces).toHaveLength(surfaceColors.length);
    for(const mesh of [world.ground,...surfaces]){expect(mesh.receiveShadows).toBe(true);expect(casters.includes(mesh),mesh.name).toBe(false)}
    // Other objects reuse the paving colors, but still need their own shadows.
    expect(casters.some(m=>surfaceColors.includes(m.material?.name??''))).toBe(true);
    expect(casters.some(m=>m.name==='golden-hour-sky-dome')).toBe(false);
    expect(casters.some(m=>m.name==='contact-shadow')).toBe(false);
    for(const actor of [world.kitek,...world.npcs.map(n=>n.character)])expect(actor.root.getChildMeshes().some(m=>casters.includes(m))).toBe(true);
    const obstacles=world.environment.getChildMeshes().filter(m=>m.metadata?.cameraObstacle);
    expect(obstacles.length).toBeGreaterThan(0);for(const mesh of obstacles){expect(mesh.isPickable).toBe(true);expect(casters.includes(mesh),mesh.name).toBe(true)}
    expect(blocked(CONFIG.spawn,world.solids)).toBe(false);expect(world.solids.some(s=>s.id==='pond')).toBe(true);
    expect(world.kitek.root.getChildMeshes().some(m=>m.name==='pack-body')).toBe(true);expect(world.npcs.find(n=>n.definition.id==='bruno')!.character.root.getChildMeshes().some(m=>m.name==='apron')).toBe(true);
    expect(world.npcs.map(n=>n.definition.id)).toEqual(['bruno','fela','tola','milus']);
    expect(scene.meshes.filter(m=>m.name.startsWith('scenery-')).length).toBeLessThan(80);
    expect(world.npcs[2].character.root.getChildMeshes().some(m=>m.name==='owl-beak')).toBe(true);
    expect(world.npcs[3].character.root.getChildMeshes().some(m=>m.name==='rabbit-ear')).toBe(true);
    function flood(start:{x:number;z:number},solids:Solid[],bounds:number){
      const seen=new Set<string>(),queue=[start];seen.add(`${start.x},${start.z}`);
      for(let i=0;i<queue.length;i++){const p=queue[i];for(const [dx,dz] of [[.5,0],[-.5,0],[0,.5],[0,-.5]]){const next={x:p.x+dx,z:p.z+dz},key=`${next.x},${next.z}`;if(Math.abs(next.x)>bounds||Math.abs(next.z)>bounds||seen.has(key)||blocked(next,solids)||blocked({x:p.x+dx/2,z:p.z+dz/2},solids))continue;seen.add(key);queue.push(next)}}return queue;
    }
    const outside=flood({x:0,z:-5},world.solids,30);
    for(const target of [...DEFAULT_CONTENT.interactions.filter(t=>t.location==='village'),...DEFAULT_CONTENT.characters])expect(outside.some(p=>Math.hypot(p.x-target.position.x,p.z-target.position.z)<1.8),`reachable ${target.id}`).toBe(true);
    const state=newSave();state.location='home';const room=createStoryWorld(homeScene,DEFAULT_CONTENT,'home');room.sync(state);const inside=flood({x:0,z:-2.5},homeSolids(state,DEFAULT_CONTENT),5);
    for(const target of DEFAULT_CONTENT.interactions.filter(t=>t.location==='home'))expect(inside.some(p=>Math.hypot(p.x-target.position.x,p.z-target.position.z)<1.8),`reachable ${target.id}`).toBe(true);
    expect(homeScene.getTransformNodeByName('starter-bed')).not.toBeNull();
    expect(scene.getTransformNodeByName('home-interior')).toBeNull();
    expect(homeScene.getMeshByName('village-ground')).toBeNull();
    world.kitek.animate(.5,2.4);expect(world.kitek.limbs[0].rotation.x).not.toBe(0);
    await Promise.all(scene.meshes.filter(m=>m.material).map(m=>m.material!.forceCompilationAsync(m)));
    scene.render();expect(scene.getActiveMeshes().length).toBeGreaterThan(0);
  }finally{scene.dispose();homeScene.dispose();engine.dispose()}
  expect(scene.meshes.length).toBe(0);
},15000);

it('drewniany dom Feli zachowuje budżet geometrii, osłonę kamery i drożną trasę spaceru',()=>{
 const engine=new NullEngine(),scene=new Scene(engine),shapes=createShapes(scene),solids:Solid[]=[];
 try{
  const home=createFelaHouse(scene,shapes,shapes.group('village'),10,0,9,solids),meshes=home.getChildMeshes();
  expect(meshes.reduce((sum,m)=>sum+m.getTotalIndices()/3,0)).toBeLessThan(20000);
  expect(new Set(meshes.map(m=>m.material)).size).toBe(1);
  for(const mesh of meshes){mesh.computeWorldMatrix(true);for(const kind of [VertexBuffer.PositionKind,VertexBuffer.NormalKind,VertexBuffer.ColorKind,VertexBuffer.UVKind])expect(mesh.getVerticesData(kind)?.every(Number.isFinite),`${mesh.name}: ${kind}`).toBe(true)}
  const obstacle=(mesh:typeof meshes[number])=>mesh.metadata?.cameraObstacle===true&&mesh.isEnabled()&&mesh.isVisible&&mesh.isPickable;
  const facade=scene.pickWithRay(new Ray(new Vector3(10,1.5,0),new Vector3(0,0,1),20),obstacle);
  expect(facade?.hit).toBe(true);expect(facade?.pickedPoint?.z).toBeCloseTo(6.5);
  const roof=scene.pickWithRay(new Ray(new Vector3(11,10,9),new Vector3(0,-1,0),10),obstacle);
  expect(roof?.hit).toBe(true);expect(roof?.pickedPoint?.y).toBeGreaterThan(5);expect(roof?.pickedPoint?.y).toBeLessThan(6);
  expect(blocked({x:10,z:9},solids)).toBe(true);expect(blocked({x:10,z:6},solids)).toBe(true);
  for(let x=9.5;x<=11.5;x+=.1)expect(blocked({x,z:4.8},solids,.5),`Fela at ${x}`).toBe(false);
 }finally{scene.dispose();engine.dispose()}
});

it('biblioteka w drzewie zachowuje wolne dojście do Toli i poprawne osłony kamery',()=>{
 const engine=new NullEngine(),scene=new Scene(engine),shapes=createShapes(scene),solids:Solid[]=[];
 try{
  const library=createTolaLibrary(scene,shapes,shapes.group('village'),0,0,23,solids),meshes=library.getChildMeshes();
  expect(meshes.reduce((sum,m)=>sum+m.getTotalIndices()/3,0)).toBeLessThan(45000);
  expect(new Set(meshes.map(m=>m.material)).size).toBe(1);
  for(const mesh of meshes){
   mesh.computeWorldMatrix(true);
   for(const kind of [VertexBuffer.PositionKind,VertexBuffer.NormalKind,VertexBuffer.ColorKind,VertexBuffer.UVKind])expect(mesh.getVerticesData(kind)?.every(Number.isFinite),`${mesh.name}: ${kind}`).toBe(true);
  }
  const obstacle=(mesh:typeof meshes[number])=>mesh.metadata?.cameraObstacle===true&&mesh.isEnabled()&&mesh.isVisible&&mesh.isPickable;
  const trunk=scene.pickWithRay(new Ray(new Vector3(0,5.9,10),new Vector3(0,0,1),20),obstacle);
  expect(trunk?.hit).toBe(true);expect(trunk?.pickedPoint?.z).toBeGreaterThan(20);expect(trunk?.pickedPoint?.z).toBeLessThan(21.3);
  // Winding must face outward, including after merging into the scene material.
  expect(trunk?.getNormal(true)?.z).toBeLessThan(-.8);
  const hood=scene.pickWithRay(new Ray(new Vector3(3,8,20.2),new Vector3(0,-1,0),10),obstacle);
  expect(hood?.hit).toBe(true);expect(hood?.pickedPoint?.y).toBeGreaterThan(3);expect(hood?.pickedPoint?.y).toBeLessThan(4);
  expect(blocked({x:0,z:23},solids)).toBe(true);expect(blocked({x:0,z:19.5},solids)).toBe(true);
  // The entire front lane remains free with an NPC-sized safety margin.
  for(let x=-4.5;x<=4.5;x+=.1)expect(blocked({x,z:18.2},solids,.5),`Tola approach at ${x}`).toBe(false);
 }finally{scene.dispose();engine.dispose()}
});
