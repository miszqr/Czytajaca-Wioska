import {Scene,Mesh,VertexData,StandardMaterial,Color3} from './babylon';
import {POND} from './island-terrain';

export function createPondWater(scene:Scene){
 const water=new Mesh('pond-water',scene),positions=[0,0,0],indices:number[]=[],normals:number[]=[];
 const segments=80;
 for(let i=0;i<=segments;i++){
  const angle=i/segments*Math.PI*2;
  positions.push(Math.cos(angle)*POND.radiusX,0,Math.sin(angle)*POND.radiusZ);
  if(i<segments)indices.push(0,i+1,i+2);
 }
 VertexData.ComputeNormals(positions,indices,normals);
 const data=new VertexData();Object.assign(data,{positions,indices,normals});data.applyToMesh(water);
 water.position.set(POND.x,POND.waterLevel,POND.z);
 const material=new StandardMaterial('pond-water-material',scene);
 material.diffuseColor=Color3.FromHexString('#79B5B8');
 material.specularColor=Color3.FromHexString('#5A7776');material.specularPower=64;
 material.alpha=.72;water.material=material;
 // Keep transparency out of scenery batches and camera/shadow blockers.
 water.isPickable=false;water.metadata={cameraObstacle:false,castsShadow:false};
 water.freezeWorldMatrix();
 return water;
}
