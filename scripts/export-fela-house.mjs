// Export the exact pre-batch house geometry for an offline inspection render.
// Usage: node scripts/export-fela-house.mjs /absolute/path/model.json
import {writeFileSync} from 'node:fs';
import {createServer} from 'vite';
const server=await createServer({server:{middlewareMode:true},appType:'custom'});
try{
 const {NullEngine,Scene,Mesh,Vector3,Matrix,VertexBuffer}=await server.ssrLoadModule('/src/game/babylon.ts');
 const {createVillage}=await server.ssrLoadModule('/src/game/world.ts');
 const {DEFAULT_CONTENT}=await server.ssrLoadModule('/src/content/defaults.ts');
 const engine=new NullEngine(),scene=new Scene(engine),meshes=[];
 const merge=Mesh.MergeMeshes;
 Mesh.MergeMeshes=function(parts,...args){
  const root=scene.getTransformNodeByName('Sklep Feli');
  for(const mesh of parts)if(root&&mesh.isDescendantOf(root)){
   const matrix=mesh.computeWorldMatrix(true),nm=Matrix.Transpose(matrix.clone().invert());
   const p=mesh.getVerticesData(VertexBuffer.PositionKind),n=mesh.getVerticesData(VertexBuffer.NormalKind),c=mesh.getVerticesData(VertexBuffer.ColorKind),positions=[],normals=[],colors=[];
   for(let i=0;i<p.length;i+=3){
    const point=Vector3.TransformCoordinates(Vector3.FromArray(p,i),matrix).subtract(root.position);
    positions.push(...point.asArray());normals.push(...Vector3.TransformNormal(Vector3.FromArray(n,i),nm).normalize().asArray());
    const base=mesh.material.diffuseColor;colors.push(base.r*(c?.[i/3*4]??1),base.g*(c?.[i/3*4+1]??1),base.b*(c?.[i/3*4+2]??1));
   }
   meshes.push({name:mesh.name,positions,normals,colors,indices:Array.from(mesh.getIndices())});
  }
  return merge.call(this,parts,...args);
 };
 try{
  const world=createVillage(scene,DEFAULT_CONTENT.characters),scenery=scene.meshes.filter(m=>m.name.startsWith('scenery-'));
  const stats={houseTriangles:meshes.reduce((s,m)=>s+m.indices.length/3,0),housePieces:meshes.length,sceneryBatches:scenery.length,sceneryTriangles:scenery.reduce((s,m)=>s+m.getTotalIndices()/3,0),sceneVertices:scene.meshes.reduce((s,m)=>s+m.getTotalVertices(),0),treeCount:world.solids.filter(s=>s.id==='tree').length};
  writeFileSync(process.argv[2],JSON.stringify({stats,meshes}));console.log(JSON.stringify(stats));
 }finally{Mesh.MergeMeshes=merge;scene.dispose();engine.dispose()}
}finally{await server.close()}
