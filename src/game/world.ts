import {Scene,Mesh,VertexData} from './babylon';
import {createShapes} from './shapes';
import {createCharacter} from '../characters/models';
import {terrainHeight,blocked,type Solid} from './movement';
import type {CharacterDefinition} from '../content/types';
import type {NpcMotion} from './npc';
import {createVegetation,type TreeKind} from './vegetation';
import {createFelaHouse} from './fela-house';
import {createTolaLibrary} from './tola-library';
import {createGoldenHour} from './golden-hour';
import {createStorybookCottage,COTTAGES} from './storybook-cottage';
import {createIslandGround,createOcean} from './island-coast';
import {beachApproach,shoreDistance,POND,pondRadius} from './island-terrain';
import {createPondWater} from './pond';
export function createVillage(scene:Scene,characters:readonly CharacterDefinition[]){
  const lighting=createGoldenHour(scene);
  const shapes=createShapes(scene),{shape,group,material}=shapes,environment=group('village'),solids:Solid[]=[];
  const vegetation=createVegetation(scene,shapes);
  let seed=923;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
  const ground=createIslandGround(scene,shapes),ocean=createOcean(scene,lighting.sun.direction.negate().normalize());
  // Preserve the scenery seed previously consumed by the 71×71 ground vertices.
  for(let i=0;i<71*71;i++)random();
  function obstacle(mesh:Mesh){mesh.isPickable=true;mesh.metadata={cameraObstacle:true};return mesh}
  // Thin surfaces lie almost on the terrain. Rendering them into the shadow
  // map causes self-shadow stripes at the low golden-hour sun angle.
  function groundDetail(mesh:Mesh){mesh.metadata={...mesh.metadata,castsShadow:false};return mesh}
  function path(points:number[][],width=2.7){
    const vertices:number[]=[],indices:number[]=[],normals:number[]=[];
    for(let i=0;i<=80;i++){
      const t=i/80,v=1-t;
      const point=[0,1].map(k=>v*v*v*points[0][k]+3*v*v*t*points[1][k]+3*v*t*t*points[2][k]+t*t*t*points[3][k]);
      const d=[0,1].map(k=>3*v*v*(points[1][k]-points[0][k])+6*v*t*(points[2][k]-points[1][k])+3*t*t*(points[3][k]-points[2][k]));
      const length=Math.hypot(...d)||1,w=width*(1+.12*Math.sin(t*7));
      for(const side of [-1,1]){const x=point[0]+side*d[1]/length*w/2,z=point[1]-side*d[0]/length*w/2;vertices.push(x,terrainHeight(x,z)+.026,z)}
      if(i<80){const j=i*2;indices.push(j,j+1,j+2,j+1,j+3,j+2)}
    }
    VertexData.ComputeNormals(vertices,indices,normals);const data=new VertexData();Object.assign(data,{positions:vertices,indices,normals});const mesh=groundDetail(new Mesh('soft-village-path',scene));data.applyToMesh(mesh);mesh.material=material('#D7C396');mesh.parent=environment;
  }
  path([beachApproach(0,-49),[-5,-27],[5,-8],[0,0]],3.4);path([[0,0],[-2,10],[2,28],beachApproach(4,49)],3.1);
  path([beachApproach(-49,10),[-18,15],[-10,0],[0,0]],3);path([[0,0],[10,-2],[28,2],beachApproach(49,-3)],3);
  const plaza=groundDetail(shape('cylinder','village-square','#DCCA9F',environment,0,.035,0,4.3,.035,4.3));
  for(let i=0;i<22;i++){const a=i/22*Math.PI*2;const p=groundDetail(shape('box','plaza-stone',i%2?'#E8D8B6':'#CEBB91',environment,Math.sin(a)*3.9,.06,Math.cos(a)*3.9,.70,.065,.38));p.rotation.y=a}
  void plaza;
  for(const kind of ['kitek','bruno','milus'] as const){const {x,z}=COTTAGES[kind];createStorybookCottage(scene,shapes,environment,kind,terrainHeight(x,z),solids)}
  path([[0,0],[8,0],[15,1],[18,4.7]],2);
  createFelaHouse(scene,shapes,environment,10,terrainHeight(10,9),9,solids);
  createTolaLibrary(scene,shapes,environment,0,terrainHeight(0,23),23,solids);
  const stall=group('fela-stall',environment,8,terrainHeight(8,4.8),4.8);
  shape('box','stall-counter','#B79163',stall,0,.7,0,1.8,.13,.75);for(const x of [-.75,.75])shape('box','stall-leg','#92714E',stall,x,.34,0,.1,.68,.6);
  for(let i=0;i<4;i++)shape('ball','stall-apple',i%2?'#BC7865':'#D1AD64',stall,-.6+i*.35,.87,0,.12,.12,.12);
  solids.push({id:'stall',type:'box',x:8,z:4.8,halfX:.9,halfZ:.4});
  const mail=group('mailbox',environment,14.4,terrainHeight(14.4,-15),-15);shape('box','mailbox-post','#96744F',mail,0,.5,0,.12,1,.12);shape('box','mailbox-body','#8FA6AC',mail,0,1,0,.55,.4,.45);
  function fence(x:number,z:number,length:number,angle=0){
    const g=group('fence',environment,x,terrainHeight(x,z),z);g.rotation.y=angle;
    for(let i=0;i<=length;i+=1.25){shape('box','fence-post','#B69B6F',g,i-length/2,.48,0,.12,.96,.12);shape('cone','post-cap','#CCB480',g,i-length/2,1.02,0,.11,.12,.11)}
    for(const y of [.35,.72])obstacle(shape('box','fence-rail','#C5AE80',g,0,y,0,length,.12,.09));
    solids.push({id:'fence',type:'box',x,z,halfX:angle? .12:length/2,halfZ:angle?length/2:.12});
  }
  fence(-7,7.1,7);fence(-11,3.7,5.5,Math.PI/2);fence(8,-5,5);fence(17,10,8,Math.PI/2);
  for(const x of [-7.9,-5.8]){
    const z=3.2;shape('box','garden-soil','#94714F',environment,x,.12,z,1.5,.22,3.6);solids.push({id:'raised-bed',type:'box',x,z,halfX:.8,halfZ:1.85});
    for(const side of [-1,1])shape('box','garden-border','#B59869',environment,x+side*.77,.17,z,.09,.3,3.8);
    for(let i=0;i<6;i++){shape('ball','garden-leaf','#6A9A55',environment,x+(i%2-.5)*.6,.35,z-1.2+Math.floor(i/2)*1.15,.25,.18,.25);shape('ball','poppy','#D88B6E',environment,x+(i%2-.5)*.6,.58,z-1.2+Math.floor(i/2)*1.15,.13,.12,.13)}
  }
  // Kitek can wade across the basin; vegetation still stays on the dry bank.
  const water=createPondWater(scene);
  for(let i=0;i<12;i++){const a=random()*Math.PI*2;groundDetail(shape('ball','lily-leaf','#729F69',environment,POND.x+Math.cos(a)*4.2,POND.waterLevel+.025,POND.z+Math.sin(a)*3.3,.35,.02,.25))}
  function tree(x:number,z:number,scale:number,kind:TreeKind){
    if(shoreDistance(x,z)<8.8||pondRadius(x,z)<1.15||blocked({x,z},solids,.8))return;
    vegetation.tree(environment,x,terrainHeight(x,z),z,scale,kind);solids.push({id:'tree',type:'circle',x,z,radius:.23*scale});
  }
  for(const [i,[x,z,s]] of [[-6,-5,1.1],[5,4,1],[-14,1,1.3],[8,-16,1.1],[15,1,1.2],[-4,15,1],[7,19,1]].entries())tree(x,z,s,(['oak','apple','birch'] as const)[i%3]);
  for(let i=0;i<100;i++){
    const x=random()*96-48,z=random()*96-48;if(Math.hypot(x,z)<18||Math.abs(x)<4||Math.abs(z)<4)continue;tree(x,z,.8+random()*.65,i%3===0?'pine':i%4===0?'birch':'oak');
  }
  for(let i=0;i<100;i++){
    const x=random()*48-24,z=random()*48-24;if(Math.hypot(x,z)<5||Math.abs(x)<3||Math.abs(z)<3||pondRadius(x,z)<1.1||blocked({x,z},solids,.65))continue;
    const y=terrainHeight(x,z);shape('cylinder','flower-stem','#73925D',environment,x,y+.15,z,.018,.30,.018);
    const flowerColor=['#E8BC5B','#EFE2B4','#C99EB0'][i%3];
    for(let p=0;p<5;p++){const a=p*Math.PI*2/5;shape('ball','flower-petal',flowerColor,environment,x+Math.cos(a)*.075,y+.31,z+Math.sin(a)*.075,.065,.035,.065)}
    shape('ball','flower-centre','#E8BC5B',environment,x,y+.34,z,.045,.028,.045);
    for(let k=0;k<2;k++){const leaf=shape('ball','grass-leaf','#7C9F60',environment,x+.12*k,y+.09,z,.025,.17,.06);leaf.rotation.z=.4+k*.6}
    vegetation.grass(environment,x+.25,y+.02,z,.7);
  }
  for(const [x,z,s] of [[-13,-6,1.3],[-14,-7,1],[-3,13,1.1],[7,7,1.2],[14,-8,1],[-14,13,1.2],[8,21,1]]){
    if(pondRadius(x,z)>=1.15&&!blocked({x,z},solids,.8))vegetation.shrub(environment,x,terrainHeight(x,z),z,s);
  }
  // Seed these decorations separately so adding detail cannot move trees or flowers.
  for(let i=0;i<180;i++){
    const x=Math.sin(i*127.1+3)*26,z=Math.cos(i*311.7+1)*26;
    if(Math.hypot(x,z)>5&&Math.abs(x)>3.5&&Math.abs(z)>3.5&&pondRadius(x,z)>=1.1&&!blocked({x,z},solids,.6))vegetation.grass(environment,x,terrainHeight(x,z)+.02,z,.65+(i%4)*.18);
  }
  const sign=group('garden-sign',environment,-3.7,.0,1.4);shape('cylinder','sign-post','#8C7150',sign,0,.52,0,.06,1.04,.06);shape('box','sign-board','#D8C49B',sign,0,.95,0,.8,.34,.10);shape('ball','sign-leaf','#7B9C61',sign,0,.97,-.07,.12,.08,.02);
  // Low draw-call count on mobile; obstacle batches remain available to camera raycasts.
  const batches=new Map<string,Mesh[]>();
  // Keep shadow roles separate even when a ground detail shares a material
  // with a building; merging otherwise loses the receive-only flag.
  for(const mesh of environment.getChildMeshes() as Mesh[]){mesh.computeWorldMatrix(true);const key=mesh.material!.uniqueId+':'+!!mesh.metadata?.cameraObstacle+':'+(mesh.metadata?.castsShadow!==false);const list=batches.get(key)||[];list.push(mesh);batches.set(key,list)}
  for(const [key,meshes] of batches){const cameraObstacle=!!meshes[0].metadata?.cameraObstacle,castsShadow=meshes[0].metadata?.castsShadow!==false;const merged=Mesh.MergeMeshes(meshes,true,true,undefined,false,false);if(merged){merged.name='scenery-'+key;merged.parent=environment;merged.metadata={cameraObstacle,castsShadow};merged.isPickable=cameraObstacle;merged.freezeWorldMatrix()}}
  const kitek=createCharacter(scene,'kitek');
  const npcs=characters.map(definition=>{
    const {x,z,heading}=definition.position;
    if(blocked({x,z},solids,.5))throw new Error(`characters.${definition.id}.position: postać znajduje się wewnątrz przeszkody.`);
    if(definition.behavior.type==='patrol')for(const point of definition.behavior.waypoints)if(blocked(point,solids,.5))throw new Error(`characters.${definition.id}.behavior.waypoints: punkt znajduje się wewnątrz przeszkody.`);
    const character=createCharacter(scene,definition.model);character.root.name=definition.id;character.root.position.set(x,terrainHeight(x,z),z);character.root.rotation.y=heading;
    const solid:Solid={id:`npc:${definition.id}`,type:'circle',x,z,radius:.42};solids.push(solid);
    const motion:NpcMotion={x,z,heading,waypoint:0,waiting:0,stuck:0};return {definition,character,solid,motion};
  });
  for(const character of [kitek,...npcs.map(npc=>npc.character)]){const shadow=shape('cylinder','contact-shadow','#66784F',character.root,0,.018,0,.31,.012,.22);shadow.material=material('#66784F')}
  const scenery=environment.getChildMeshes(),actors=[kitek,...npcs.map(n=>n.character)].flatMap(c=>c.root.getChildMeshes());
  lighting.addShadows([...scenery,...actors],[ground,water,...scenery,...actors]);
  return {environment,ground,kitek,npcs,solids,water,ocean};
}
