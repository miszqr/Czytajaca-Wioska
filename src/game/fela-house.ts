import {Mesh,VertexData,VertexBuffer,Vector3,Quaternion,Color3,CreateCylinder,CreateIcoSphere} from './babylon';
import type {Scene,TransformNode} from './babylon';
import type {Shapes} from './shapes';
import type {Solid} from './movement';

type Point=[number,number,number];
type Outline=[number,number][];
const WOOD=['#A8734B','#B78253','#BE8C5C','#AD7950'];
const ROOF=['#B87960','#C88961','#D69969','#B97852','#CD8C5B'];
const DARK='#694832',CUT='#D5AB73',TRIM='#E5BE83',GREEN='#718C72';

// Geometry is baked into the village's shared white material using vertex colours.
// Only the simple structural shells block camera rays; tiny details stay decorative.
export function createFelaHouse(scene:Scene,{shape,group,material}:Shapes,parent:TransformNode,x:number,y:number,z:number,solids:Solid[]){
 const root=group('Sklep Feli',parent,x,y,z);
 let seed=7163;
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 function paint(mesh:Mesh,color:string,obstacle=false){
  const c=Color3.FromHexString(color),colors:number[]=[];
  for(let i=0;i<mesh.getTotalVertices();i++)colors.push(c.r,c.g,c.b,1);
  mesh.setVerticesData(VertexBuffer.ColorKind,colors);mesh.material=material('#FFFFFF');
  if(!mesh.isVerticesDataPresent(VertexBuffer.UVKind))mesh.setVerticesData(VertexBuffer.UVKind,new Array(mesh.getTotalVertices()*2).fill(0));
  mesh.isPickable=obstacle;mesh.metadata={cameraObstacle:obstacle};return mesh;
 }
 function box(name:string,color:string,p:Point,size:Point,owner=root,obstacle=false){return paint(shape('box',name,'#FFFFFF',owner,...p,...size),color,obstacle)}
 function ball(name:string,color:string,p:Point,size:Point,owner=root){
  const mesh=CreateIcoSphere(name,{radius:1,subdivisions:1,flat:false},scene);mesh.parent=owner;mesh.position.set(...p);mesh.scaling.set(...size);return paint(mesh,color);
 }
 function beam(name:string,color:string,a:Point,b:Point,radius:number,owner=root){
  const direction=new Vector3(b[0]-a[0],b[1]-a[1],b[2]-a[2]);
  const mesh=CreateCylinder(name,{height:direction.length(),diameter:radius*2,tessellation:8},scene);
  mesh.parent=owner;mesh.position.set((a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2);
  mesh.rotationQuaternion=Quaternion.FromUnitVectorsToRef(Vector3.Up(),direction.normalize(),new Quaternion());return paint(mesh,color);
 }
 // Counter-clockwise outline in XY, extruded along Z. Separate face vertices
 // preserve crisp bevels and Babylon's left-handed winding after scene batching.
 function slab(name:string,color:string,outline:Outline,depth:number,owner=root,obstacle=false){
  const positions:number[]=[],indices:number[]=[],normals:number[]=[];
  function face(points:Point[]){const k=positions.length/3;for(const p of points)positions.push(...p);for(let i=1;i<points.length-1;i++)indices.push(k,k+i,k+i+1)}
  face(outline.map(([a,b])=>[a,b,-depth/2]));face([...outline].reverse().map(([a,b])=>[a,b,depth/2]));
  for(let i=0;i<outline.length;i++){const a=outline[i],b=outline[(i+1)%outline.length];face([[a[0],a[1],-depth/2],[a[0],a[1],depth/2],[b[0],b[1],depth/2],[b[0],b[1],-depth/2]])}
  VertexData.ComputeNormals(positions,indices,normals);const data=new VertexData();Object.assign(data,{positions,indices,normals});
  const mesh=new Mesh(name,scene);data.applyToMesh(mesh);mesh.parent=owner;return paint(mesh,color,obstacle);
 }
 function ring(name:string,color:string,c:Point,rx:number,ry:number,thickness:number,owner=root){
  const positions:number[]=[],indices:number[]=[],normals:number[]=[];
  for(let i=0;i<16;i++){const a=i*Math.PI/8,b=(i+1)*Math.PI/8,k=positions.length/3;
   positions.push(c[0]+Math.cos(a)*rx,c[1]+Math.sin(a)*ry,c[2],c[0]+Math.cos(b)*rx,c[1]+Math.sin(b)*ry,c[2],c[0]+Math.cos(b)*(rx-thickness),c[1]+Math.sin(b)*(ry-thickness),c[2],c[0]+Math.cos(a)*(rx-thickness),c[1]+Math.sin(a)*(ry-thickness),c[2]);
   indices.push(k,k+1,k+2,k,k+2,k+3);
  }
  VertexData.ComputeNormals(positions,indices,normals);const data=new VertexData();Object.assign(data,{positions,indices,normals});const mesh=new Mesh(name,scene);data.applyToMesh(mesh);mesh.parent=owner;return paint(mesh,color);
 }

 // Retain the shop's position and the open lane used by Fela's patrol.
 solids.push({id:'Sklep Feli',type:'box',x,z,halfX:3.3,halfZ:2.85});
 solids.push({id:'fela-porch',type:'box',x,z:z-3.08,halfX:2.34,halfZ:.43});
 box('fela-foundation','#8D8975',[0,.22,0],[6.35,.44,5.35],root,true);
 for(const side of [-1,1])for(let i=0;i<9;i++){
  const stone=box('fela-foundation-stone',i%3===0?'#C0B69A':'#B2A78D',[-2.8+i*.7,.27,side*2.7],[.65,.32,.18]);stone.rotation.z=(i%3-1)*.025;
 }
 for(const side of [-1,1])for(let i=0;i<7;i++)box('fela-foundation-stone',i%3===0?'#C0B69A':'#B2A78D',[side*3.19,.27,-2.25+i*.75],[.18,.32,.7]);
 box('fela-wall-shell',DARK,[0,1.9,0],[6,3.02,5],root,true);
 for(let row=0;row<10;row++){
  const h=.61+row*.305;
  for(const side of [-1,1]){
   beam('fela-front-log',WOOD[row%4],[-3.14,h,side*2.48],[3.14,h,side*2.48],.18);
   beam('fela-side-log',WOOD[(row+1)%4],[side*2.94,h+.14,-2.82],[side*2.94,h+.14,2.82],.19);
   const end=paint(shape('cylinder','fela-log-end','#FFFFFF',root,side*2.94,h+.14,-2.835,.165,.022,.165),CUT);end.rotation.x=Math.PI/2;
   ring('fela-growth-ring',WOOD[0],[side*2.94,h+.14,-2.85],.115,.115,.012);
   ring('fela-growth-ring',WOOD[1],[side*2.94,h+.14,-2.852],.062,.062,.009);
  }
 }
 // Small grain strokes and knots are actual geometry, not external textures.
 for(const sx of [-1,1])for(let row=0;row<3;row++){
  const h=.64+row*.305;
  beam('fela-wood-grain',WOOD[0],[sx*.88,h,-2.661],[sx*2.45,h+.018,-2.661],.009);
  ring('fela-wood-knot',DARK,[sx*2.15,h+.045,-2.665],.085,.032,.009);
 }

 const profile:[[number,number],[number,number],[number,number],[number,number]]=[[0,6.18],[1.3,4.95],[2.55,3.82],[3.55,3.35]];
 function roofHeight(a:number){for(let i=1;i<profile.length;i++)if(a<=profile[i][0]){const p=profile[i-1],q=profile[i];return p[1]+(q[1]-p[1])*(a-p[0])/(q[0]-p[0])}return profile[3][1]}
 slab('fela-gable-shell',WOOD[0],[[-3,3.25],[3,3.25],[2.55,3.82],[1.3,4.95],[0,6.18],[-1.3,4.95],[-2.55,3.82]],5,root,true);
 for(const side of [-1,1])for(let row=0;row<8;row++){
  const h=3.53+row*.3,half=(6.05-h)/.95;
  box('fela-gable-plank',WOOD[row%4],[0,h,side*2.53],[Math.max(.2,half*2),.275,.12]);
 }
 // A slightly swept roof silhouette, overlapping staggered shingles, and a
 // separate dark underside prevent gaps when viewed from ground level.
 for(const side of [-1,1]){
  for(let i=1;i<profile.length;i++){
   const [a,ha]=profile[i-1],[b,hb]=profile[i];
   const outline:Outline=side===1?[[a,ha-.16],[b,hb-.16],[b,hb],[a,ha]]:[[-b,hb-.16],[-a,ha-.16],[-a,ha],[-b,hb]];
   slab('fela-roof-shell',DARK,outline,6.15,root,true);
  }
  for(let row=0;row<8;row++){
   const a=row*3.55/8,b=Math.min(3.65,a+.53),ha=roofHeight(a),hb=roofHeight(Math.min(b,3.55)),length=Math.hypot(b-a,hb-ha),angle=Math.atan2(side*(b-a),ha-hb);
   for(let col=0;col<12;col++){
    const width=.535,depth=.085,offset=(row%2? .12:-.12);
    const tile=slab('fela-roof-shingle',ROOF[(row*3+col*7)%ROOF.length],[[-width/2+.055,0],[width/2-.055,0],[width/2,.06],[width/2,length],[-width/2,length],[-width/2,.055]],depth);
    // Local X follows the ridge and local Y runs up the slope.
    const tileGroup=group('shingle-frame',root,side*b,hb+.055,-2.91+col*.53+offset);
    tile.parent=tileGroup;tileGroup.rotation.y=Math.PI/2;tile.rotation.x=-angle;
   }
  }
  for(const front of [-1,1])for(let i=1;i<profile.length;i++){
   const [a,ha]=profile[i-1],[b,hb]=profile[i];
   beam('fela-bargeboard',DARK,[side*a,ha+.025,front*3.16],[side*b,hb+.025,front*3.16],.13);
   beam('fela-roof-edge-highlight',CUT,[side*a,ha+.08,front*3.235],[side*b,hb+.08,front*3.235],.035);
  }
  beam('fela-eave',DARK,[side*3.55,3.3,-3.16],[side*3.55,3.3,3.16],.13);
 }
 for(let i=0;i<13;i++){
  const cap=paint(shape('cylinder','fela-ridge-cap','#FFFFFF',root,0,6.19,-3.05+i*.51,.155,.56,.155),ROOF[i%ROOF.length]);cap.rotation.x=Math.PI/2;
 }
 // Exposed rafters and a round attic window give the gable a storybook face.
 for(const front of [-1,1]){
  beam('fela-gable-beam',DARK,[-3.04,3.38,front*2.68],[3.04,3.38,front*2.68],.11);
  for(const side of [-1,1])beam('fela-gable-brace',DARK,[side*2.55,3.5,front*2.65],[side*.17,5.93,front*2.65],.075);
 }
 const attic=paint(shape('cylinder','fela-attic-glass','#FFFFFF',root,0,4.68,-2.67,.48,.08,.48),'#89B8BC');attic.rotation.x=Math.PI/2;
 ring('fela-attic-surround',DARK,[0,4.68,-2.73],.62,.62,.13);
 ring('fela-attic-trim',TRIM,[0,4.68,-2.744],.51,.51,.055);
 box('fela-attic-mullion',TRIM,[0,4.68,-2.76],[.055,.94,.045]);box('fela-attic-mullion',TRIM,[0,4.68,-2.76],[.94,.055,.045]);

 function flower(owner:TransformNode,p:Point,color:string,size=.1){
  beam('fela-flower-stem','#68885A',[p[0],p[1]-.22,p[2]],p,.018,owner);
  for(let j=0;j<5;j++){const a=j*Math.PI*2/5;ball('fela-flower-petal',color,[p[0]+Math.cos(a)*size,p[1]+Math.sin(a)*size,p[2]],[size*.7,size*.7,size*.36],owner)}
  ball('fela-flower-heart','#E5BA60',[p[0],p[1],p[2]-.035],[size*.45,size*.45,size*.4],owner);
  const leaf=ball('fela-flower-leaf','#78935F',[p[0]+.09,p[1]-.13,p[2]],[.12,.035,.055],owner);leaf.rotation.z=.4;
 }
 function windowAt(name:string,p:Point,angle:number,flowers:boolean){
  const g=group(name,root,...p);g.rotation.y=angle;
  box('fela-window-recess',DARK,[0,0,0],[1.2,1.35,.12],g);
  box('fela-window-glass','#8EBAB9',[0,0,-.08],[.99,1.12,.055],g);
  box('fela-window-reflection','#C4D9C5',[-.25,.17,-.114],[.23,.69,.014],g);
  for(const side of [-1,1]){
   box('fela-window-frame',TRIM,[side*.57,0,-.12],[.12,1.4,.15],g);
   const shutter=group('fela-shutter',g,side*.86,0,-.03);shutter.rotation.y=side*.18;
   for(let i=0;i<3;i++)box('fela-shutter-plank',i%2?GREEN:'#829879',[(i-1)*.12,0,0],[.115,1.22,.09],shutter);
   for(const h of [-.4,.4])box('fela-shutter-batten',DARK,[0,h,-.06],[.40,.075,.06],shutter);
  }
  for(const h of [-.65,.65])box('fela-window-frame',TRIM,[0,h,-.12],[1.3,.12,.18],g);
  box('fela-window-cross',TRIM,[0,0,-.13],[.06,1.15,.06],g);box('fela-window-cross',TRIM,[0,.04,-.13],[1.05,.06,.06],g);
  box('fela-window-sill',CUT,[0,-.73,-.19],[1.48,.12,.42],g);
  if(flowers){
   box('fela-flower-box',DARK,[0,-.91,-.22],[1.35,.29,.38],g);
   for(let i=0;i<7;i++)box('fela-planter-slat',WOOD[i%4],[-.59+i*.197,-.9,-.44],[.18,.31,.055],g);
   for(let i=0;i<5;i++)flower(g,[-.5+i*.25,-.54+random()*.12,-.25],['#E7B958','#DA9477','#F1D9A2'][i%3],.09);
  }
 }
 windowAt('fela-front-window-left',[-1.75,2,-2.67],0,true);windowAt('fela-front-window-right',[1.75,2,-2.67],0,true);
 windowAt('fela-side-window-left',[-3.12,1.95,.25],Math.PI/2,true);windowAt('fela-side-window-right',[3.12,1.95,.25],-Math.PI/2,true);
 windowAt('fela-back-window',[0,1.95,2.68],Math.PI,false);

 const door=group('fela-door',root,0,.43,-2.7),arch:Outline=[[-.56,0],[.56,0],[.56,1.82],[.45,2.06],[.24,2.22],[0,2.27],[-.24,2.22],[-.45,2.06],[-.56,1.82]];
 const frame=slab('fela-door-frame',DARK,arch,.18,door);frame.scaling.set(1.22,1.06,1);
 const panel=slab('fela-arched-door',CUT,arch,.13,door);panel.position.z=-.13;
 for(let i=0;i<6;i++)box('fela-door-board',WOOD[(i+2)%4],[-.46+i*.184,.96,-.21],[.174,1.86,.035],door);
 for(const h of [.35,1.58]){box('fela-door-strap',DARK,[-.31,h,-.25],[.38,.07,.04],door);for(const a of [-.44,-.16])ball('fela-hinge-rivet','#C9AD72',[a,h,-.28],[.025,.025,.02],door)}
 box('fela-door-handle-plate',DARK,[.36,1.02,-.25],[.1,.26,.045],door);ball('fela-door-handle','#E5BA60',[.36,1.04,-.31],[.055,.055,.05],door);
 for(const side of [-1,1])beam('fela-door-trim',CUT,[side*.64,.45,-2.84],[side*.64,2.4,-2.84],.055);

 // Porch and shallow decorative steps remain outside the NPC walking lane.
 box('fela-porch-shadow',DARK,[0,.2,-2.99],[4.65,.4,.78],root,true);
 for(let i=0;i<16;i++)box('fela-porch-board',WOOD[(i+1)%4],[-2.17+i*.29,.43,-2.98],[.275,.09,.85]);
 for(let i=0;i<3;i++)box('fela-front-step',i%2?CUT:WOOD[2],[0,.10+i*.115,-3.41+i*.14],[1.5,.12,.36]);
 for(const side of [-1,1]){
  beam('fela-porch-post',DARK,[side*2.2,.43,-3.22],[side*2.2,1.33,-3.22],.065);
  ball('fela-post-cap',CUT,[side*2.2,1.37,-3.22],[.11,.08,.11]);
  beam('fela-porch-rail',CUT,[side*.94,1.09,-3.22],[side*2.2,1.09,-3.22],.045);
  for(let j=0;j<4;j++)beam('fela-porch-spindle',WOOD[1],[side*(1.1+j*.3),.5,-3.22],[side*(1.1+j*.3),1.1,-3.22],.027);
 }
 // A carved FELA sign uses geometry, so it needs no font, canvas or texture.
 const sign=group('fela-shop-sign',root,0,3.03,-2.79);
 slab('fela-sign-board',DARK,[[-.91,-.23],[.91,-.23],[1,-.12],[1,.17],[.9,.24],[-.9,.24],[-1,.17],[-1,-.12]],.13,sign);
 box('fela-sign-inset',TRIM,[0,0,-.08],[1.79,.35,.025],sign);
 const letters:Point[][][]=[[[[0,0,0],[0,.23,0]],[[0,.23,0],[.15,.23,0]],[[0,.13,0],[.12,.13,0]]],[[[0,0,0],[0,.23,0]],[[0,.23,0],[.15,.23,0]],[[0,.12,0],[.12,.12,0]],[[0,0,0],[.15,0,0]]],[[[0,.23,0],[0,0,0]],[[0,0,0],[.15,0,0]]],[[[0,0,0],[.08,.23,0]],[[.08,.23,0],[.16,0,0]],[[.035,.09,0],[.13,.09,0]]]];
 for(let i=0;i<letters.length;i++)for(const [a,b] of letters[i])beam('fela-sign-letter',DARK,[a[0]-.46+i*.25,a[1]-.115,-.11],[b[0]-.46+i*.25,b[1]-.115,-.11],.018,sign);
 for(const side of [-1,1])beam('fela-sign-peg',DARK,[side*.7,3.22,-2.8],[side*.7,3.39,-2.8],.025);

 const lantern=group('fela-lantern',root,.91,2.58,-2.91);
 beam('fela-lantern-bracket',DARK,[0,.2,.15],[0,.2,-.18],.025,lantern);
 box('fela-lantern-glass','#F1CC82',[0,-.08,-.18],[.2,.3,.18],lantern);
 for(const side of [-1,1])for(const back of [-1,1])box('fela-lantern-bar',DARK,[side*.11,-.08,-.18+back*.1],[.025,.34,.025],lantern);
 box('fela-lantern-top',DARK,[0,.12,-.18],[.29,.07,.28],lantern);box('fela-lantern-bottom',DARK,[0,-.27,-.18],[.27,.06,.26],lantern);

 // Pale masonry chimney, staggered joints and a dark flue under the cap.
 const chimney=group('fela-chimney',root,-1.83,4.4,.85);
 box('fela-chimney-core','#827A69',[0,.95,0],[.72,2.2,.72],chimney,true);
 for(let row=0;row<8;row++)for(const side of [-1,1]){
  const bricks=row%2?[[-.27,.15],[0,.33],[.27,.15]]:[[-.18,.33],[.18,.33]];
  for(const [offset,width] of bricks){const c=(row+side)%3===0?'#D8CCAE':'#C4B99E',h=.1+row*.26;
   box('fela-chimney-brick',c,[offset,h,side*.385],[width,.235,.08],chimney);
   box('fela-chimney-brick',c,[side*.385,h,offset],[.08,.235,width],chimney);
  }
 }
 box('fela-chimney-cap',DARK,[0,2.19,0],[.99,.17,.99],chimney);box('fela-chimney-lip','#D8CCAE',[0,2.3,0],[.82,.09,.82],chimney);
 box('fela-chimney-flue','#493D32',[0,2.349,0],[.53,.015,.53],chimney);
 return root;
}
