import {Scene,Mesh,VertexData,VertexBuffer,CreateGround,Color3,Color4,HemisphericLight,DirectionalLight,Vector3} from './babylon';
import {createShapes} from './shapes';
import {createCharacter} from '../characters/models';
import {terrainHeight,blocked,type Solid} from './movement';
import {CONFIG} from './config';
export function createVillage(scene:Scene){
  scene.clearColor=Color4.FromHexString('#DCE9DDFF');scene.fogMode=Scene.FOGMODE_EXP2;scene.fogDensity=.013;scene.fogColor=Color3.FromHexString('#DCE9DD');
  const sky=new HemisphericLight('warm-sky',new Vector3(0,1,0),scene);sky.intensity=.9;sky.groundColor=Color3.FromHexString('#71856C');
  const sun=new DirectionalLight('afternoon-sun',new Vector3(-.5,-1,.3),scene);sun.intensity=.65;sun.diffuse=Color3.FromHexString('#FFE5BC');
  const {shape,group,material}=createShapes(scene),environment=group('village'),solids:Solid[]=[];
  let seed=923;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
  const ground=CreateGround('village-ground',{width:110,height:110,subdivisions:70,updatable:true},scene),positions=ground.getVerticesData(VertexBuffer.PositionKind)!,colors:number[]=[],normals:number[]=[];
  for(let i=0;i<positions.length;i+=3){const x=positions[i],z=positions[i+2];positions[i+1]=terrainHeight(x,z);const tone=.92+random()*.08;colors.push(.56*tone,.70*tone,.38*tone,1)}
  VertexData.ComputeNormals(positions,ground.getIndices()!,normals);ground.updateVerticesData(VertexBuffer.PositionKind,positions);ground.updateVerticesData(VertexBuffer.NormalKind,normals);ground.setVerticesData(VertexBuffer.ColorKind,colors);ground.material=material('#FFFFFF');ground.isPickable=true;ground.metadata={cameraObstacle:true};
  function obstacle(mesh:Mesh){mesh.isPickable=true;mesh.metadata={cameraObstacle:true};return mesh}
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
    VertexData.ComputeNormals(vertices,indices,normals);const data=new VertexData();Object.assign(data,{positions:vertices,indices,normals});const mesh=new Mesh('soft-village-path',scene);data.applyToMesh(mesh);mesh.material=material('#D7C396');mesh.parent=environment;
  }
  path([[0,-49],[-5,-27],[5,-8],[0,0]],3.4);path([[0,0],[-2,10],[2,28],[4,49]],3.1);
  path([[-49,10],[-18,15],[-10,0],[0,0]],3);path([[0,0],[10,-2],[28,2],[49,-3]],3);
  const plaza=shape('cylinder','village-square','#DCCA9F',environment,0,.035,0,4.3,.035,4.3);
  for(let i=0;i<22;i++){const a=i/22*Math.PI*2;const p=shape('box','plaza-stone',i%2?'#E8D8B6':'#CEBB91',environment,Math.sin(a)*3.9,.06,Math.cos(a)*3.9,.70,.065,.38);p.rotation.y=a}
  void plaza;
  function cottage(name:string,x:number,z:number,width:number,depth:number,wall:string,roof:string){
    const y=terrainHeight(x,z),g=group(name,environment,x,y,z);solids.push({id:name,type:'box',x,z,halfX:width/2+.18,halfZ:depth/2+.18});
    obstacle(shape('box','cottage-stone-foot', '#A4A58B',g,0,.18,0,width+.3,.36,depth+.3));
    obstacle(shape('box','cottage-walls',wall,g,0,1.8,0,width,3.2,depth));
    const roofMesh=obstacle(shape('cone','cottage-roof',roof,g,0,4.15,0,width*.83,2.1,depth*.83));roofMesh.rotation.y=Math.PI/4;
    for(const sx of [-1,1])for(const sz of [-1,1])shape('box','timber-post','#84614B',g,sx*(width/2-.08),1.8,sz*(depth/2-.08),.17,3.25,.17);
    for(const sx of [-1,1]){
      shape('box','window-frame','#866950',g,sx*width*.28,1.9,-depth/2-.03,1.1,1.25,.14);
      shape('box','window-glass','#A9CFD0',g,sx*width*.28,1.9,-depth/2-.12,.90,1.05,.04);
      shape('box','window-cross','#F4E4BC',g,sx*width*.28,1.9,-depth/2-.15,.07,1.1,.04);
      shape('box','window-cross','#F4E4BC',g,sx*width*.28,1.9,-depth/2-.15,.95,.07,.04);
      shape('box','window-box','#95754B',g,sx*width*.28,1.2,-depth/2-.22,1.2,.25,.4);
      for(let i=0;i<4;i++)shape('ball','window-flowers',i%2?'#F1C461':'#DF947D',g,sx*width*.28-.4+i*.26,1.42,-depth/2-.24,.13,.15,.13);
    }
    shape('box','front-door','#816344',g,0,1.15,-depth/2-.07,.90,2,.12);shape('ball','door-knob','#E8BF65',g,.29,1.16,-depth/2-.16,.045);
    shape('box','front-step','#C3BB9F',g,0,.10,-depth/2-.5,1.6,.2,.7);
    obstacle(shape('box','chimney','#BC9575',g,width*.25,4.5,.3,.6,2,.6));
    shape('box','chimney-cap','#D8C6A6',g,width*.25,5.5,.3,.77,.16,.77);
    shape('box','timber-beam','#84614B',g,0,3.28,-depth/2-.06,width,.15,.16);
    return g;
  }
  cottage('Dom Kitka',-10,-9,5.5,4.8,'#F0DFC0','#A77459');
  cottage('Dom Brunona',-10,10,5.2,4.5,'#E8D9AA','#839265');
  cottage('Sklep Feli',10,9,6,5,'#E9CEAA','#B87960');
  cottage('Biblioteka Toli',0,23,7.4,5.5,'#E5DCC2','#768A93');
  cottage('Dom Milusia',13,-12,5,4.4,'#E8D9C3','#A48E6F');
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
  // The pond's collision disk includes its banks, so Kitek cannot fall in.
  const pond={x:23,z:17};solids.push({id:'pond',type:'circle',...pond,radius:7.1});const py=terrainHeight(pond.x,pond.z);
  shape('ball','pond-bank','#B9BD8C',environment,pond.x,py-.15,pond.z,7.4,.25,6.3);
  const water=shape('ball','pond-water','#79B5B8',environment,pond.x,py+.035,pond.z,6.7,.07,5.6);(water.material as import('@babylonjs/core/Materials/standardMaterial').StandardMaterial).specularColor=Color3.FromHexString('#5A7776');
  for(let i=0;i<12;i++){const a=random()*Math.PI*2;shape('ball','lily-leaf','#729F69',environment,pond.x+Math.cos(a)*5,py+.13,pond.z+Math.sin(a)*4,.35,.035,.25)}
  function tree(x:number,z:number,scale:number,conifer:boolean){
    if(blocked({x,z},solids,.8))return;
    const g=group('tree',environment,x,terrainHeight(x,z),z);g.scaling.setAll(scale);
    obstacle(shape('cylinder','trunk','#8D7254',g,0,1.25,0,.20,2.5,.20));solids.push({id:'tree',type:'circle',x,z,radius:.23*scale});
    if(conifer){for(let i=0;i<3;i++)obstacle(shape('cone','pine-canopy',['#577F58','#699164','#80A071'][i],g,0,2.2+i*.72,0,1.25-i*.25,1.9,1.25-i*.25))}
    else{obstacle(shape('ball','leaf-canopy','#72945E',g,0,2.7,0,1.25,1.45,1.15));obstacle(shape('ball','leaf-canopy','#8BA96B',g,-.6,3.2,.1,.90,.95,.88));obstacle(shape('ball','leaf-canopy','#A2B97B',g,-.35,3.8,.2,.65,.65,.65))}
  }
  for(const [x,z,s] of [[-6,-5,1.1],[5,4,1],[-14,1,1.3],[8,-16,1.1],[15,1,1.2],[-4,15,1],[7,19,1]])tree(x,z,s,false);
  for(let i=0;i<100;i++){
    const x=random()*96-48,z=random()*96-48;if(Math.hypot(x,z)<18||Math.abs(x)<4||Math.abs(z)<4)continue;tree(x,z,.8+random()*.65,i%3===0);
  }
  for(let i=0;i<100;i++){
    const x=random()*48-24,z=random()*48-24;if(Math.hypot(x,z)<5||Math.abs(x)<3||Math.abs(z)<3||blocked({x,z},solids,.65))continue;
    const y=terrainHeight(x,z);shape('cylinder','flower-stem','#73925D',environment,x,y+.15,z,.018,.30,.018);
    const flowerColor=['#E8BC5B','#EFE2B4','#C99EB0'][i%3];shape('ball','flower',flowerColor,environment,x,y+.31,z,.105,.065,.105);
    for(let k=0;k<2;k++){const leaf=shape('ball','grass-leaf','#7C9F60',environment,x+.12*k,y+.09,z,.025,.17,.06);leaf.rotation.z=.4+k*.6}
  }
  const sign=group('garden-sign',environment,-3.7,.0,1.4);shape('cylinder','sign-post','#8C7150',sign,0,.52,0,.06,1.04,.06);shape('box','sign-board','#D8C49B',sign,0,.95,0,.8,.34,.10);shape('ball','sign-leaf','#7B9C61',sign,0,.97,-.07,.12,.08,.02);
  // Low draw-call count on mobile; obstacle batches remain available to camera raycasts.
  const batches=new Map<string,Mesh[]>();
  for(const mesh of environment.getChildMeshes() as Mesh[]){mesh.computeWorldMatrix(true);const key=mesh.material!.uniqueId+':'+!!mesh.metadata?.cameraObstacle;const list=batches.get(key)||[];list.push(mesh);batches.set(key,list)}
  for(const [key,meshes] of batches){const merged=Mesh.MergeMeshes(meshes,true,true,undefined,false,false);if(merged){merged.name='scenery-'+key;merged.parent=environment;merged.metadata={cameraObstacle:key.endsWith('true')};merged.isPickable=merged.metadata.cameraObstacle;merged.freezeWorldMatrix()}}
  const kitek=createCharacter(scene,'kitek'),bruno=createCharacter(scene,'bruno');bruno.root.position.set(CONFIG.bruno.x,terrainHeight(CONFIG.bruno.x,CONFIG.bruno.z),CONFIG.bruno.z);bruno.root.rotation.y=Math.PI;
  solids.push({id:'bruno',type:'circle',x:CONFIG.bruno.x,z:CONFIG.bruno.z,radius:.42});
  for(const character of [kitek,bruno]){const shadow=shape('cylinder','contact-shadow','#66784F',character.root,0,.018,0,.31,.012,.22);shadow.material=material('#66784F')}
  return {environment,ground,kitek,bruno,solids,water};
}
