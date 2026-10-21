import {Mesh,VertexData,VertexBuffer,Vector3,Quaternion,Color3,CreateCylinder,CreateIcoSphere} from './babylon';
import type {Scene,TransformNode} from './babylon';
import type {Shapes} from './shapes';
import type {Solid} from './movement';

type Point=[number,number,number];
type Outline=[number,number][];
export type CottageKind='kitek'|'bruno'|'milus';
export const COTTAGES={
 kitek:{name:'Dom Kitka',x:18,z:8,width:5.5,depth:4.8,peak:5.8,accent:'#77A8C6',accentLight:'#9ABED1',roof:['#B77652','#CB8D62','#B97D58','#D39B70'],wood:['#B78253','#C18D5C','#AD794D'],moss:0},
 bruno:{name:'Dom Brunona',x:-10,z:10,width:5.2,depth:4.5,peak:5.35,accent:'#708863',accentLight:'#9CAB7C',roof:['#8B7954','#A08B60','#947E53','#AF986D'],wood:['#A8784D','#B68557','#9D714A'],moss:.75},
 milus:{name:'Dom Milusia',x:13,z:-12,width:5,depth:4.4,peak:5.6,accent:'#AE7765',accentLight:'#D39E82',roof:['#7C7970','#928B7D','#837C70','#A29882'],wood:['#B8865F','#C6956A','#AC7C56'],moss:.3},
} as const;
const DARK='#684B36',CUT='#D7AE78',TRIM='#E9C58E';

// Smaller relatives of Fela's timber shop. Dimensions and collision footprints
// match the original cottages, so story targets and saved positions stay valid.
// All colour is per-vertex; the village can still batch these into one material.
export function createStorybookCottage(scene:Scene,{shape,group,material}:Shapes,parent:TransformNode,kind:CottageKind,y:number,solids:Solid[]){
 const cfg=COTTAGES[kind],{width:w,depth:d,peak}=cfg,half=w/2,front=-d/2;
 const root=group(cfg.name,parent,cfg.x,y,cfg.z),white=material('#FFFFFF');
 let seed={kitek:193,bruno:477,milus:823}[kind];
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 function paint(mesh:Mesh,color:string,obstacle=false){
  const c=Color3.FromHexString(color),colors:number[]=[];
  for(let i=0;i<mesh.getTotalVertices();i++)colors.push(c.r,c.g,c.b,1);
  mesh.setVerticesData(VertexBuffer.ColorKind,colors);mesh.material=white;
  if(!mesh.isVerticesDataPresent(VertexBuffer.UVKind))mesh.setVerticesData(VertexBuffer.UVKind,new Array(mesh.getTotalVertices()*2).fill(0));
  mesh.isPickable=obstacle;mesh.metadata={cameraObstacle:obstacle};return mesh;
 }
 function box(name:string,color:string,p:Point,size:Point,owner=root,obstacle=false){return paint(shape('box',`${kind}-${name}`,'#FFFFFF',owner,...p,...size),color,obstacle)}
 function ball(name:string,color:string,p:Point,size:Point,owner=root){
  const m=CreateIcoSphere(`${kind}-${name}`,{radius:1,subdivisions:1,flat:false},scene);m.parent=owner;m.position.set(...p);m.scaling.set(...size);return paint(m,color);
 }
 function beam(name:string,color:string,a:Point,b:Point,r:number,owner=root){
  const v=new Vector3(b[0]-a[0],b[1]-a[1],b[2]-a[2]);
  const m=CreateCylinder(`${kind}-${name}`,{height:v.length(),diameter:r*2,tessellation:8},scene);m.parent=owner;
  m.position.set((a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2);m.rotationQuaternion=Quaternion.FromUnitVectorsToRef(Vector3.Up(),v.normalize(),new Quaternion());return paint(m,color);
 }
 function geometry(name:string,color:string,positions:number[],indices:number[],owner=root,obstacle=false){
  const normals:number[]=[];VertexData.ComputeNormals(positions,indices,normals);
  const data=new VertexData();Object.assign(data,{positions,indices,normals});
  const m=new Mesh(`${kind}-${name}`,scene);data.applyToMesh(m);m.parent=owner;return paint(m,color,obstacle);
 }
 function slab(name:string,color:string,outline:Outline,depth:number,owner=root,obstacle=false){
  const positions:number[]=[],indices:number[]=[];
  function face(points:Point[]){const n=positions.length/3;for(const p of points)positions.push(...p);for(let i=1;i<points.length-1;i++)indices.push(n,n+i,n+i+1)}
  face(outline.map(([a,b])=>[a,b,-depth/2]));face([...outline].reverse().map(([a,b])=>[a,b,depth/2]));
  for(let i=0;i<outline.length;i++){const a=outline[i],b=outline[(i+1)%outline.length];face([[a[0],a[1],-depth/2],[a[0],a[1],depth/2],[b[0],b[1],depth/2],[b[0],b[1],-depth/2]])}
  return geometry(name,color,positions,indices,owner,obstacle);
 }
 function ring(name:string,color:string,p:Point,rx:number,ry:number,t:number,owner=root){
  const positions:number[]=[],indices:number[]=[];
  for(let i=0;i<16;i++){const a=i*Math.PI/8,b=(i+1)*Math.PI/8,k=positions.length/3;
   positions.push(p[0]+Math.cos(a)*rx,p[1]+Math.sin(a)*ry,p[2],p[0]+Math.cos(b)*rx,p[1]+Math.sin(b)*ry,p[2],p[0]+Math.cos(b)*(rx-t),p[1]+Math.sin(b)*(ry-t),p[2],p[0]+Math.cos(a)*(rx-t),p[1]+Math.sin(a)*(ry-t),p[2]);indices.push(k,k+1,k+2,k,k+2,k+3);
  }
  return geometry(name,color,positions,indices,owner);
 }
 function disk(name:string,color:string,p:Point,r:number,owner=root){const m=paint(shape('cylinder',`${kind}-${name}`,'#FFFFFF',owner,...p,r,.055,r),color);m.rotation.x=Math.PI/2;return m}

 solids.push({id:cfg.name,type:'box',x:cfg.x,z:cfg.z,halfX:half+.18,halfZ:d/2+.18});
 box('foundation','#96917D',[0,.18,0],[w+.22,.36,d+.22],root,true);
 for(const side of [-1,1]){
  for(let i=0;i<8;i++)box('foundation-stone',i%3?'#C1B599':'#AEAA91',[-half+.34+i*(w-.68)/7,.22,side*(d/2+.12)],[w/8-.05,.3,.13]);
  for(let i=0;i<6;i++)box('foundation-stone',i%2?'#B1AA91':'#C8BA9C',[side*(half+.12),.22,-d/2+.35+i*(d-.7)/5],[.13,.3,d/6-.06]);
 }
 box('wall-shell',DARK,[0,1.75,0],[w-.22,2.85,d-.16],root,true);
 for(let row=0;row<10;row++)for(const side of [-1,1]){
  const h=.48+row*.285;
  beam('front-log',cfg.wood[row%3],[-half-.1,h,side*(d/2-.08)],[half+.1,h,side*(d/2-.08)],.165);
  beam('side-log',cfg.wood[(row+1)%3],[side*(half-.1),h+.1,front-.11],[side*(half-.1),h+.1,-front+.11],.17);
  disk('log-end',CUT,[side*(half-.1),h+.1,front-.125],.15);
  ring('log-growth',cfg.wood[0],[side*(half-.1),h+.1,front-.158],.105,.105,.014);
 }
 for(const side of [-1,1])for(let row=0;row<4;row++){
  beam('wood-grain',cfg.wood[0],[side*.9,.55+row*.285,front-.24],[side*(half-.4),.57+row*.285,front-.24],.009);
  ring('wood-knot',DARK,[side*(half-.65),.55+row*.285,front-.25],.075,.026,.01);
 }

 // Segmented, gently flared eaves echo Fela's swept roof instead of a cone.
 const reach=half+.48,eave=3.05;
 const profile:Outline=[[0,peak],[reach*.39,peak-1.04],[reach*.77,3.55],[reach,eave]];
 function roofHeight(a:number){a=Math.abs(a);for(let i=1;i<profile.length;i++)if(a<=profile[i][0]){const [x0,y0]=profile[i-1],[x1,y1]=profile[i];return y0+(y1-y0)*(a-x0)/(x1-x0)}return eave}
 slab('gable-shell',cfg.wood[0],[[-half,3],[half,3],[half,roofHeight(half)],[profile[1][0],profile[1][1]],[0,peak],[-profile[1][0],profile[1][1]],[-half,roofHeight(half)]],d-.12,root,true);
 for(const side of [-1,1])for(let row=0;row<8;row++){
  const h=3.23+row*(peak-3.45)/8;
  let a=0;while(a<half&&roofHeight(a)>h+.12)a+=.025;
  box('gable-plank',cfg.wood[row%3],[0,h,side*(d/2-.015)],[Math.max(.16,a*2),.26,.11]);
 }
 const roofDepth=d+1.03;
 for(const side of [-1,1]){
  for(let i=1;i<profile.length;i++){
   const [a,ha]=profile[i-1],[b,hb]=profile[i];
   const outline:Outline=side===1?[[a,ha-.14],[b,hb-.14],[b,hb],[a,ha]]:[[-b,hb-.14],[-a,ha-.14],[-a,ha],[-b,hb]];
   slab('roof-shell',DARK,outline,roofDepth,root,true);
  }
  for(let row=0;row<7;row++){
   const a=row*reach/7,b=Math.min(reach+.07,a+reach/7+.075),ha=roofHeight(a),hb=roofHeight(b),len=Math.hypot(b-a,ha-hb);
   for(let col=0;col<10;col++){
    const width=roofDepth/10+.035;
    const tile=slab('roof-shingle',cfg.roof[(row*3+col*7)%4],[[-width/2+.035,0],[width/2-.035,0],[width/2,.05],[width/2,len],[-width/2,len],[-width/2,.055]],.07);
    const frame=group(`${kind}-shingle-frame`,root,side*b,hb+.05,-roofDepth/2+width/2+col*roofDepth/10+(row%2?.065:-.065));
    tile.parent=frame;frame.rotation.y=Math.PI/2;tile.rotation.x=-Math.atan2(side*(b-a),ha-hb);
   }
  }
  for(const end of [-1,1])for(let i=1;i<profile.length;i++){
   const [a,ha]=profile[i-1],[b,hb]=profile[i];
   beam('roof-edge',DARK,[side*a,ha+.02,end*(roofDepth/2+.08)],[side*b,hb+.02,end*(roofDepth/2+.08)],.11);
   beam('roof-edge-highlight',CUT,[side*a,ha+.065,end*(roofDepth/2+.15)],[side*b,hb+.065,end*(roofDepth/2+.15)],.029);
  }
  beam('eave',DARK,[side*reach,eave-.035,-roofDepth/2-.08],[side*reach,eave-.035,roofDepth/2+.08],.11);
  for(let i=0;i<6;i++)beam('rafter',CUT,[side*(half-.24),3.1,-d/2+.1+i*(d-.2)/5],[side*(reach-.12),eave-.05,-d/2+.1+i*(d-.2)/5],.055);
 }
 for(let i=0;i<11;i++){const cap=paint(shape('cylinder',`${kind}-ridge-cap`,'#FFFFFF',root,0,peak+.03,-roofDepth/2+i*roofDepth/10,.135,roofDepth/10+.06,.135),cfg.roof[i%4]);cap.rotation.x=Math.PI/2}

 // Low cushions follow the actual roof profile. Irregular edges and connected
 // lobes form patches, rather than floating green spheres or a flat decal.
 function mossPatch(a:number,z:number,rx:number,rz:number,phase:number){
  const positions:number[]=[a,roofHeight(a)+.19,z],indices:number[]=[],segments=12;
  for(let i=0;i<segments;i++){
   const angle=i*Math.PI*2/segments,r=1+.14*Math.sin(angle*3+phase)+.08*Math.cos(angle*5-phase);
   const x=Math.max(-reach+.03,Math.min(reach-.03,a+Math.cos(angle)*rx*r)),zz=Math.max(-roofDepth/2+.05,Math.min(roofDepth/2-.05,z+Math.sin(angle)*rz*r));
   positions.push(x,roofHeight(x)+.105,zz);
  }
  for(let i=0;i<segments;i++)indices.push(0,1+i,1+(i+1)%segments);
  const moss=geometry('roof-moss',['#758547','#8A9853','#627641','#9AA35D'][Math.floor(phase)%4],positions,indices);
  // Keep only upward normals; the patch is never used as a camera obstacle.
  const n=moss.getVerticesData(VertexBuffer.NormalKind)!;
  if(n[1]<0){moss.dispose();for(let i=0;i<indices.length;i+=3)[indices[i+1],indices[i+2]]=[indices[i+2],indices[i+1]];geometry('roof-moss',['#758547','#8A9853','#627641','#9AA35D'][Math.floor(phase)%4],positions,indices)}
 }
 if(cfg.moss>0){
  const clusters=kind==='bruno'?[[.35,front+.5],[1.5,-.5],[2.3,1.3],[-.7,-1.4],[-2,.5]]:[[-.45,.9],[-1.8,-1.5],[1.8,1.1]];
  for(const [cx,cz] of clusters)for(let i=0;i<(kind==='bruno'?7:4);i++){
   const angle=i*2.4,spread=i===0?0:.25+random()*.36;
   mossPatch(cx+Math.cos(angle)*spread,cz+Math.sin(angle)*spread,.32+cfg.moss*.42+random()*.12,.32+cfg.moss*.4+random()*.18,random()*12);
  }
  if(kind==='bruno')for(const side of [-1,1])for(let i=0;i<5;i++){
   const z=.25+i*.26;ball('hanging-moss',i%2?'#7D8C4D':'#677B42',[side*(reach+.02),eave-.1-i%3*.065,z],[.11,.19+(i%3)*.04,.19]);
  }
 }

 function flowers(owner:TransformNode){
  box('flower-box',DARK,[0,-.79,-.19],[1.15,.24,.34],owner);
  for(let i=0;i<6;i++)box('planter-slat',cfg.wood[i%3],[-.49+i*.195,-.78,-.39],[.18,.25,.055],owner);
  for(let i=0;i<4;i++){
   const x=-.4+i*.27,h=-.49+(i%2)*.06;ball('planter-leaf','#708552',[x,h-.05,-.19],[.18,.1,.13],owner);
   for(let p=0;p<5;p++){const a=p*Math.PI*2/5;ball('flower-petal',kind==='bruno'?'#E1BA60':kind==='milus'?'#E1C9A3':'#D99983',[x+Math.cos(a)*.065,h+Math.sin(a)*.065,-.3],[.05,.05,.035],owner)}
   ball('flower-centre','#E5B95B',[x,h,-.34],[.03,.03,.02],owner);
  }
 }
 function windowAt(p:Point,angle:number,planter:boolean){
  const g=group(`${kind}-window`,root,...p);g.rotation.y=angle;
  box('window-recess',DARK,[0,0,0],[1.1,1.25,.1],g);box('window-glass','#8FB8B4',[0,0,-.065],[.94,1.08,.04],g);
  box('window-reflection','#CEE0CD',[-.21,.18,-.09],[.18,.66,.015],g);
  for(const side of [-1,1]){
   box('window-frame',TRIM,[side*.52,0,-.11],[.1,1.3,.13],g);
   const shutter=group(`${kind}-shutter`,g,side*.77,0,-.04);shutter.rotation.y=side*.19;
   for(let i=0;i<3;i++)box('shutter-plank',i%2?cfg.accentLight:cfg.accent,[(i-1)*.12,0,0],[.113,1.12,.075],shutter);
   for(const h of [-.36,.36])box('shutter-hinge',DARK,[0,h,-.055],[.36,.06,.04],shutter);
  }
  for(const h of [-.59,.59])box('window-frame',TRIM,[0,h,-.11],[1.14,.1,.16],g);
  box('window-cross',TRIM,[0,0,-.13],[.055,1.1,.05],g);box('window-cross',TRIM,[0,0,-.13],[1,.055,.05],g);
  box('window-sill',CUT,[0,-.67,-.18],[1.3,.12,.37],g);if(planter)flowers(g);
 }
 for(const side of [-1,1])windowAt([side*half*.6,1.9,front-.24],0,true);
 windowAt([-half-.15,1.9,.25],Math.PI/2,true);windowAt([half+.15,1.9,.25],-Math.PI/2,false);
 windowAt([0,1.9,d/2+.24],Math.PI,false);
 for(const side of [-1,1])beam('gable-brace',DARK,[side*(half-.2),3.24,front-.15],[side*.15,peak-.23,front-.15],.07);
 beam('gable-tie',DARK,[-half,3.13,front-.18],[half,3.13,front-.18],.1);
 const atticY=3.95+(peak-5.35)*.34;
 disk('attic-glass','#8AB4B5',[0,atticY,front-.19],.42);ring('attic-frame',DARK,[0,atticY,front-.23],.54,.54,.11);
 ring('attic-trim',TRIM,[0,atticY,front-.245],.435,.435,.045);
 box('attic-cross',TRIM,[0,atticY,front-.265],[.05,.81,.04]);box('attic-cross',TRIM,[0,atticY,front-.265],[.81,.05,.04]);

 const door=group(`${kind}-door`,root,0,.35,front-.25);
 const arch:Outline=[[-.51,0],[.51,0],[.51,1.65],[.42,1.88],[.22,2.06],[0,2.12],[-.22,2.06],[-.42,1.88],[-.51,1.65]];
 const surround=slab('door-frame',DARK,arch,.15,door);surround.scaling.set(1.2,1.06,1);
 const panel=slab('arched-door',cfg.accentLight,arch,.1,door);panel.position.z=-.12;
 for(let i=0;i<6;i++){
  const x=-.425+i*.17,h=1.69+.36*(1-Math.abs(x)/.51);
  box('door-board',i%2?cfg.accentLight:cfg.accent,[x,h/2,-.19],[.158,h,.035],door);
 }
 for(const h of [.34,1.44]){box('door-hinge',DARK,[-.33,h,-.23],[.3,.06,.035],door);ball('door-rivet',CUT,[-.43,h,-.26],[.022,.022,.02],door)}
 box('handle-plate',DARK,[.32,.94,-.23],[.1,.22,.03],door);ball('door-knob','#E8BC62',[.32,.95,-.29],[.055,.055,.045],door);
 for(let i=0;i<2;i++){const step=box('door-step',i?CUT:'#BAAE93',[0,.09+i*.12,front-.5+i*.12],[1.4,.12,.32]);step.metadata={cameraObstacle:false,castsShadow:false}}

 const lantern=group(`${kind}-lantern`,root,.78,2.48,front-.4);
 beam('lantern-hook',DARK,[0,.18,.12],[0,.18,-.18],.028,lantern);
 box('lantern-glass','#EFC981',[0,-.04,-.15],[.17,.26,.16],lantern);
 for(const side of [-1,1])for(const back of [-1,1])box('lantern-bar',DARK,[side*.1,-.04,-.15+back*.09],[.024,.29,.024],lantern);
 box('lantern-cap',DARK,[0,.13,-.15],[.26,.06,.24],lantern);box('lantern-base',DARK,[0,-.21,-.15],[.24,.055,.23],lantern);

 const chimney=group(`${kind}-chimney`,root,-half*.54,roofHeight(half*.54)-.42,.65);
 box('chimney-core','#8B8270',[0,.72,0],[.57,1.68,.6],chimney,true);
 for(let row=0;row<6;row++)for(const side of [-1,1])for(let col=0;col<2;col++){
  const p=(col-.5)*.29,h=.03+row*.245,c=(row+col)%3?'#C7B99A':'#DFCEAA';
  box('chimney-stone',c,[p,h,side*.32],[.27,.22,.07],chimney);box('chimney-stone',c,[side*.3,h,p],[.07,.22,.27],chimney);
 }
 box('chimney-cap',DARK,[0,1.58,0],[.81,.14,.84],chimney);box('chimney-lip','#D6C6A6',[0,1.68,0],[.68,.07,.7],chimney);box('chimney-flue','#453D32',[0,1.72,0],[.42,.014,.44],chimney);

 // Individual clues agree with the story: the blue home sign remains visible.
 if(kind==='kitek'){
  const plaque=group('kitek-home-plaque',root,0,2.85,front-.34);
  box('home-sign-frame',DARK,[0,0,0],[.91,.4,.09],plaque);
  const sign=box('home-blue-sign',cfg.accent,[0,0,-.06],[.77,.29,.04],plaque);sign.name='home-blue-sign';
  beam('home-sign-roof',TRIM,[-.16,.02,-.09],[0,.13,-.09],.023,plaque);beam('home-sign-roof',TRIM,[0,.13,-.09],[.16,.02,-.09],.023,plaque);
  box('home-sign-door',TRIM,[0,-.04,-.09],[.12,.14,.025],plaque);
 }else if(kind==='bruno'){
  // A trellis, leafy vine and terracotta pots belong to the gardener.
  for(let i=0;i<3;i++)beam('trellis',CUT,[half+.22,.5,.9+i*.28],[half+.22,2.75,.9+i*.28],.025);
  for(let i=0;i<6;i++)beam('trellis',CUT,[half+.23,.65+i*.36,.76],[half+.23,.65+i*.36,1.64],.022);
  for(let i=0;i<9;i++)ball('vine-leaf',i%2?'#7D9557':'#607B4B',[half+.28,.7+i*.23,1.18+Math.sin(i*1.5)*.27],[.055,.14,.13]);
  for(const side of [-1,1]){paint(shape('cylinder','bruno-pot','#FFFFFF',root,side*(half-.33),.54,front-.25,.21,.35,.21),'#B17B58');ball('pot-herbs','#8A9C62',[side*(half-.33),.77,front-.25],[.28,.23,.22]);}
 }else{
  const sign=group('milus-envelope-sign',root,0,2.85,front-.34);
  box('mail-sign-frame',DARK,[0,0,0],[.9,.48,.08],sign);box('mail-sign',TRIM,[0,0,-.05],[.76,.35,.04],sign);
  beam('envelope-fold',cfg.accent,[-.3,.12,-.08],[0,-.04,-.08],.02,sign);beam('envelope-fold',cfg.accent,[0,-.04,-.08],[.3,.12,-.08],.02,sign);
 }
 return root;
}
