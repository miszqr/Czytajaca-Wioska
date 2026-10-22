import {Color3,Mesh,Vector3,VertexData} from '../game/babylon';
import type {Scene,StandardMaterial,TransformNode} from '../game/babylon';

// A single closed silhouette: the cream end narrows along the same curve as
// the orange fur, instead of sitting above it as a separate ellipsoid.
export function createFoxTail(scene:Scene,parent:TransformNode,material:StandardMaterial,fur:string,cream:string){
  const rings=[
    {center:new Vector3(.008,0,-.045),width:.070,height:.065,cream:false},
    {center:new Vector3(.027,-.015,-.16),width:.120,height:.105,cream:false},
    {center:new Vector3(.064,-.024,-.31),width:.173,height:.145,cream:false},
    {center:new Vector3(.105,-.006,-.46),width:.184,height:.158,cream:false},
    {center:new Vector3(.135,.021,-.55),width:.177,height:.154,cream:false},
    {center:new Vector3(.154,.044,-.61),width:.159,height:.143,cream:true},
    {center:new Vector3(.180,.09,-.70),width:.128,height:.119,cream:true},
    {center:new Vector3(.200,.155,-.79),width:.081,height:.078,cream:true},
    {center:new Vector3(.212,.212,-.855),width:.039,height:.037,cream:true}
  ];
  const start=new Vector3(0,0,.02),end=new Vector3(.217,.258,-.91),sides=12;
  const orange=Color3.FromHexString(fur),ivory=Color3.FromHexString(cream);
  const positions:number[]=[],colors:number[]=[],indices:number[]=[],normals:number[]=[];
  function vertex(p:Vector3,color:Color3){positions.push(p.x,p.y,p.z);colors.push(color.r,color.g,color.b,1)}
  vertex(start,orange);
  rings.forEach((ring,r)=>{
    const tangent=(rings[r+1]?.center??end).subtract(rings[r-1]?.center??start).normalize();
    const side=Vector3.Cross(tangent,Vector3.Up()).normalize(),up=Vector3.Cross(side,tangent).normalize();
    for(let s=0;s<sides;s++){
      const angle=s/sides*Math.PI*2;
      vertex(ring.center.add(side.scale(Math.cos(angle)*ring.width)).add(up.scale(Math.sin(angle)*ring.height)),ring.cream?ivory:orange);
    }
  });
  const tip=positions.length/3;vertex(end,ivory);
  for(let s=0;s<sides;s++){
    const next=(s+1)%sides;
    indices.push(0,1+next,1+s);
    for(let r=0;r<rings.length-1;r++){
      const a=1+r*sides+s,b=1+(r+1)*sides+s,an=1+r*sides+next,bn=1+(r+1)*sides+next;
      indices.push(a,an,b,an,bn,b);
    }
    const last=1+(rings.length-1)*sides;indices.push(tip,last+s,last+next);
  }
  VertexData.ComputeNormals(positions,indices,normals);
  const data=new VertexData();data.positions=positions;data.indices=indices;data.normals=normals;data.colors=colors;
  const mesh=new Mesh('fluffy-tail',scene);data.applyToMesh(mesh);
  mesh.parent=parent;mesh.material=material;mesh.isPickable=false;
  return mesh;
}
