import {it,expect} from 'vitest';
import {NullEngine,Scene,Vector3,VertexBuffer} from '../src/game/babylon';
import {createCharacter} from '../src/characters/models';

it.each(['kitek','fela'] as const)('%s has one closed, outward-facing tail through its cream tip',kind=>{
  const engine=new NullEngine(),scene=new Scene(engine);
  try{
    const actor=createCharacter(scene,kind),meshes=actor.tail.getChildMeshes();
    expect(meshes).toHaveLength(1);
    const mesh=meshes[0],positions=mesh.getVerticesData(VertexBuffer.PositionKind)!,indices=mesh.getIndices()!;
    const colors=mesh.getVerticesData(VertexBuffer.ColorKind)!,normals=mesh.getVerticesData(VertexBuffer.NormalKind)!;
    expect([...positions,...colors,...normals].every(Number.isFinite)).toBe(true);
    // Each edge must be shared by two oppositely wound triangles. This also
    // protects back-face shadow rendering from holes and overlapping caps.
    const edges=new Map<string,number[]>(),neighbors=new Map<number,Set<number>>();
    let volume=0;
    for(let i=0;i<indices.length;i+=3){
      const tri=[indices[i],indices[i+1],indices[i+2]];
      const [a,b,c]=tri.map(j=>Vector3.FromArray(positions,j*3));
      const normal=Vector3.Cross(c.subtract(a),b.subtract(a));
      expect(normal.length()).toBeGreaterThan(1e-6);
      expect(Vector3.Dot(normal,tri.reduce((sum,j)=>sum.add(Vector3.FromArray(normals,j*3)),Vector3.Zero()))).toBeGreaterThan(0);
      volume+=Vector3.Dot(a,Vector3.Cross(c,b))/6;
      for(let j=0;j<3;j++){
        const from=tri[j],to=tri[(j+1)%3],key=[Math.min(from,to),Math.max(from,to)].join(':');
        edges.set(key,[...(edges.get(key)??[]),Math.sign(to-from)]);
        if(!neighbors.has(from))neighbors.set(from,new Set());neighbors.get(from)!.add(to);
      }
    }
    for(const winding of edges.values()){expect(winding).toHaveLength(2);expect(winding[0]+winding[1]).toBe(0)}
    expect(volume).toBeGreaterThan(0);
    const visited=new Set<number>(),pending=[0];
    while(pending.length){const vertex=pending.pop()!;if(visited.has(vertex))continue;visited.add(vertex);pending.push(...neighbors.get(vertex)!)}
    expect(visited.size).toBe(positions.length/3);
    // All the geometry, including its tip, stays on the wagging tail joint.
    expect(mesh.parent).toBe(actor.tail);expect(mesh.metadata.shadowBackFaces).toBe(true);
    actor.animate(.5,2.4);expect(actor.tail.rotation.y).not.toBe(0);
    const matrix=mesh.computeWorldMatrix(true);
    for(let i=0;i<positions.length;i+=3)expect(Vector3.TransformCoordinates(Vector3.FromArray(positions,i),matrix).y).toBeGreaterThan(.12);
  }finally{scene.dispose();engine.dispose()}
});
