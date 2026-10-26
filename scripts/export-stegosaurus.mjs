// Export real mesh/skinning data for an offline CPU preview, without WebGL.
// node scripts/export-stegosaurus.mjs output.json [fallback|idle|walk] [seconds]
import {readFileSync,writeFileSync} from 'node:fs';
import {createServer} from 'vite';
const server=await createServer({server:{middlewareMode:true},appType:'custom'});
try{
 const {NullEngine,Scene,Vector3,Matrix}=await server.ssrLoadModule('/src/game/babylon.ts');
 const mode=process.argv[3]??'idle',engine=new NullEngine(),scene=new Scene(engine);
 try{
  const actor=mode==='fallback'
   ?(await server.ssrLoadModule('/src/characters/stegosaurus-fallback.ts')).createFallbackStegosaurus(scene)
   :(await server.ssrLoadModule('/src/characters/stegosaurus.ts')).createStegosaurus(scene,new Uint8Array(readFileSync('public/models/stegosaurus.glb')));
  if(actor.ready){await actor.ready;if(actor.root.metadata.model!=='quaternius-stegosaurus')throw new Error('Asset did not load')}
  actor.animate(Number(process.argv[4]??0),mode==='walk',mode==='fallback');
  for(const node of scene.transformNodes)node.computeWorldMatrix(true);
  for(const skeleton of scene.skeletons)skeleton.prepare(true);
  const meshes=[];
  for(const mesh of actor.root.getChildMeshes().filter(m=>m.getTotalVertices()>0)){
   const matrix=mesh.computeWorldMatrix(true),nm=Matrix.Transpose(matrix.clone().invert());
   const p=mesh.getPositionData(true),n=mesh.getNormalsData(true),base=mesh.material.diffuseColor;
   const positions=[],normals=[],colors=[];
   for(let i=0;i<p.length;i+=3){
    positions.push(...Vector3.TransformCoordinates(Vector3.FromArray(p,i),matrix).asArray());
    normals.push(...Vector3.TransformNormal(Vector3.FromArray(n,i),nm).normalize().asArray());
    colors.push(base.r,base.g,base.b);
   }
   meshes.push({name:mesh.name,positions,normals,colors,indices:Array.from(mesh.getIndices())});
  }
  const stats={triangles:meshes.reduce((sum,m)=>sum+m.indices.length/3,0),meshes:meshes.length};
  writeFileSync(process.argv[2],JSON.stringify({stats,meshes}));console.log(stats);
 }finally{scene.dispose();engine.dispose()}
}finally{await server.close()}
