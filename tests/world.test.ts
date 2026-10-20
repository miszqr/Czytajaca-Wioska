import {it,expect} from 'vitest';
import {NullEngine,Scene,FreeCamera,Vector3,VertexBuffer} from '../src/game/babylon';
import {DEFAULT_CONTENT} from '../src/content/defaults';
import {createVillage} from '../src/game/world';
import {blocked} from '../src/game/movement';
import {createStoryWorld} from '../src/game/story-world';
import {homeSolids} from '../src/housing/model';
import {newSave} from '../src/persistence/state';
import type {Solid} from '../src/game/movement';
import {CONFIG} from '../src/game/config';
it('buduje rzeczywistą scenę Babylon, bezpieczny start, pięć modeli i kolizje',async()=>{
  const engine=new NullEngine(),scene=new Scene(engine),homeScene=new Scene(engine);
  try{
    const world=createVillage(scene,DEFAULT_CONTENT.characters);const camera=new FreeCamera('test',new Vector3(0,3,-8),scene);scene.activeCamera=camera;camera.setTarget(new Vector3(0,0,0));
    const road=scene.meshes.find(m=>m.material?.name==='#D7C396')!;expect(road).toBeDefined();const normals=road.getVerticesData(VertexBuffer.NormalKind)!;for(let i=1;i<normals.length;i+=3)expect(normals[i]).toBeGreaterThan(.9);
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
