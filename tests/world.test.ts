import {it,expect} from 'vitest';
import {NullEngine,Scene,FreeCamera,Vector3,VertexBuffer} from '../src/game/babylon';
import {DEFAULT_CONTENT} from '../src/content/defaults';
import {createVillage} from '../src/game/world';
import {blocked} from '../src/game/movement';
import {CONFIG} from '../src/game/config';
it('buduje rzeczywistą scenę Babylon, bezpieczny start, trzy modele i kolizje',async()=>{
  const engine=new NullEngine(),scene=new Scene(engine);
  try{
    const world=createVillage(scene,DEFAULT_CONTENT.characters);const camera=new FreeCamera('test',new Vector3(0,3,-8),scene);scene.activeCamera=camera;camera.setTarget(new Vector3(0,0,0));
    const road=scene.meshes.find(m=>m.material?.name==='#D7C396')!;expect(road).toBeDefined();const normals=road.getVerticesData(VertexBuffer.NormalKind)!;for(let i=1;i<normals.length;i+=3)expect(normals[i]).toBeGreaterThan(.9);
    expect(blocked(CONFIG.spawn,world.solids)).toBe(false);expect(world.solids.some(s=>s.id==='pond')).toBe(true);
    expect(world.kitek.root.getChildMeshes().some(m=>m.name==='pack-body')).toBe(true);expect(world.npcs.find(n=>n.definition.id==='bruno')!.character.root.getChildMeshes().some(m=>m.name==='apron')).toBe(true);
    expect(world.npcs.map(n=>n.definition.id)).toEqual(['bruno','fela']);expect(world.npcs[1].character.root.getChildMeshes().some(m=>m.name==='shop-apron')).toBe(true);
    expect(scene.meshes.filter(m=>m.name.startsWith('scenery-')).length).toBeLessThan(80);
    world.kitek.animate(.5,2.4);expect(world.kitek.limbs[0].rotation.x).not.toBe(0);
    await Promise.all(scene.meshes.filter(m=>m.material).map(m=>m.material!.forceCompilationAsync(m)));
    scene.render();expect(scene.getActiveMeshes().length).toBeGreaterThan(0);
  }finally{scene.dispose();engine.dispose()}
  expect(scene.meshes.length).toBe(0);
},15000);
