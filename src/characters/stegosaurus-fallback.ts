import {Mesh,VertexData,Vector3,Quaternion} from '../game/babylon';
import type {Scene,TransformNode} from '../game/babylon';
import {createShapes} from '../game/shapes';

/** Metre-scale, low-poly adult: ~9 m nose to tail, ~4 m to the tallest plate. */
export function createFallbackStegosaurus(scene:Scene){
 const {shape,group,material}=createShapes(scene),root=group('stegosaurus'),body=group('stegosaurus-body',root);
 const skin='#7B9471',light='#A4AD7C',dark='#526F59',horn='#E2C894';
 shape('ball','stegosaurus-torso',skin,body,0,1.83,-.1,.94,.98,1.95);
 shape('ball','stegosaurus-hips',skin,body,0,1.93,-1.15,.85,.88,.95);
 shape('ball','stegosaurus-chest',light,body,0,1.45,1.15,.69,.69,.97);
 const head=group('stegosaurus-head',body,0,1.05,1.9);
 const neck=shape('ball','stegosaurus-neck',skin,head,0,.06,.35,.36,.40,.83);neck.rotation.x=.18;
 shape('ball','stegosaurus-skull',skin,head,0,-.03,1.12,.29,.27,.49);
 shape('ball','stegosaurus-muzzle',light,head,0,-.10,1.48,.25,.17,.25);
 shape('ball','stegosaurus-beak',horn,head,0,-.12,1.66,.21,.12,.11);
 for(const side of [-1,1]){
  shape('ball','stegosaurus-eye-rim',light,head,side*.255,.06,1.12,.065,.09,.12);
  shape('ball','stegosaurus-eye','#263C33',head,side*.306,.06,1.15,.032,.052,.055);
  shape('ball','stegosaurus-eye-glint','#FFF4CF',head,side*.333,.079,1.17,.009,.015,.016);
  shape('ball','stegosaurus-nostril',dark,head,side*.19,-.01,1.53,.022,.026,.04);
 }
 // A tapered, connected tail; the four spikes belong to its tip, not the back.
 const tail=group('stegosaurus-tail',body,0,1.75,-1.7);
 const rings=[{z:0,y:0,w:.64,h:.58},{z:-.7,y:-.16,w:.43,h:.39},{z:-1.5,y:-.29,w:.27,h:.26},{z:-2.3,y:-.19,w:.15,h:.15},{z:-3.1,y:.02,w:.055,h:.065},{z:-3.55,y:.18,w:.006,h:.008}];
 const positions:number[]=[],indices:number[]=[],normals:number[]=[],sides=12;
 for(const r of rings)for(let i=0;i<sides;i++){const a=i/sides*Math.PI*2;positions.push(Math.cos(a)*r.w,r.y+Math.sin(a)*r.h,r.z)}
 for(let r=0;r<rings.length-1;r++)for(let i=0;i<sides;i++){const a=r*sides+i,b=r*sides+(i+1)%sides;indices.push(a,b,a+sides,b,b+sides,a+sides)}
 for(let i=1;i<sides-1;i++){indices.push(0,i+1,i);const end=(rings.length-1)*sides;indices.push(end,end+i,end+i+1)}
 VertexData.ComputeNormals(positions,indices,normals);const data=new VertexData();Object.assign(data,{positions,indices,normals});
 const tailMesh=new Mesh('stegosaurus-tail-skin',scene);data.applyToMesh(tailMesh);tailMesh.parent=tail;tailMesh.material=material(skin);
 function spike(parent:TransformNode,x:number,y:number,z:number,side:number){
  const direction=new Vector3(side*.85,.4,-.28).normalize(),length=.85;
  const mesh=shape('cone','stegosaurus-tail-spike',horn,parent,x+direction.x*length/2,y+direction.y*length/2,z+direction.z*length/2,.105,length,.105);
  mesh.rotationQuaternion=Quaternion.FromUnitVectorsToRef(Vector3.Up(),direction,new Quaternion());
 }
 for(const z of [-2.45,-2.95])for(const side of [-1,1])spike(tail,side*.09,-.08,z,side);
 // Thin, closed pentagonal plates, alternating between two rows along the spine.
 function plate(parent:TransformNode,z:number,y:number,height:number,width:number,side:number,index:number){
  const points=[[-.48,0],[-.60,.48],[-.12,1],[.49,.72],[.48,0]],p:number[]=[],ix:number[]=[],n:number[]=[];
  for(const x of [-.055,.055])for(const [pz,py] of points)p.push(x,py*height,pz*width);
  for(let i=1;i<4;i++)ix.push(0,i,i+1,5,5+i+1,5+i);
  for(let i=0;i<5;i++){const j=(i+1)%5;ix.push(i,5+i,j,j,5+i,5+j)}
  VertexData.ComputeNormals(p,ix,n);const d=new VertexData();Object.assign(d,{positions:p,indices:ix,normals:n});
  const mesh=new Mesh(`stegosaurus-plate-${index}`,scene);d.applyToMesh(mesh);mesh.parent=parent;
  mesh.position.set(side*.23,y,z);mesh.rotation.z=-side*.12;mesh.material=material(index%2?'#B77A59':'#C99364');
 }
 for(let i=0;i<13;i++){
  const z=2.15-i*.32,arch=Math.sqrt(Math.max(0,1-((z+.1)/2.55)**2));
  plate(body,z,1.85+.84*arch,.36+.92*arch,.57+(1- Math.abs(z)/3)*.24,i%2?1:-1,i);
 }
 for(let i=0;i<4;i++)plate(tail,-.45-i*.5,-.08-i*.025,.49-i*.095,.52-i*.055,i%2?-1:1,13+i);
 const legs:{root:TransformNode;length:number;phase:number}[]=[];
 for(const front of [false,true])for(const side of [-1,1]){
  const length=front?1.22:1.52,z=front?1.12:-1.15;
  const leg=group(`stegosaurus-${front?'front':'hind'}-leg`,root,side*(front?.57:.68),length,z);
  shape('ball','stegosaurus-thigh',skin,leg,0,-.26,0,front?.25:.36,.48,.34);
  shape('ball','stegosaurus-shin',skin,leg,side*.035,-length*.64,.04,.20,length*.30,.23);
  shape('ball','stegosaurus-foot',light,leg,side*.04,-length+.17,.13,.26,.17,.36);
  for(let toe=0;toe<3;toe++)shape('ball','stegosaurus-toe',horn,leg,(toe-1)*.13+side*.04,-length+.12,.40,.055,.075,.095);
  legs.push({root:leg,length,phase:(front?0:Math.PI/2)+(side===1?Math.PI:0)});
 }
 // Merge only rigid pieces attached to the same joint, keeping animation cheap.
 for(const joint of [body,head,tail,...legs.map(l=>l.root)]){
  const batches=new Map<number,Mesh[]>();
  for(const mesh of joint.getChildMeshes(true) as Mesh[]){mesh.computeWorldMatrix(true);const key=mesh.material!.uniqueId;const list=batches.get(key)??[];list.push(mesh);batches.set(key,list)}
  for(const meshes of batches.values()){
   // MergeMeshes bakes world transforms; move the result back to joint space.
   const inverse=joint.computeWorldMatrix(true).clone().invert();
   const merged=Mesh.MergeMeshes(meshes,true,true,undefined,false,false);
   if(merged){merged.bakeTransformIntoVertices(inverse);merged.parent=joint;merged.name=`${joint.name}-detail`}
  }
 }
 for(const mesh of root.getChildMeshes()){mesh.isPickable=true;mesh.metadata={cameraObstacle:true,shadowBackFaces:true};mesh.receiveShadows=true}
 function animate(time:number,moving:boolean,reduced=false){
  const stride=moving&&!reduced?1:0;
  body.position.y=reduced?0:Math.sin(time*(moving?2.8:.9))*(moving?.025:.012);
  tail.rotation.y=reduced?0:Math.sin(time*.9)*.035;
  head.rotation.y=reduced?0:Math.sin(time*.55)*.035;
  for(const leg of legs){leg.root.rotation.x=Math.sin(time*2.8+leg.phase)*.17*stride;leg.root.position.y=leg.length+Math.max(0,Math.cos(time*2.8+leg.phase))*.08*stride}
 }
 return {root,animate};
}
