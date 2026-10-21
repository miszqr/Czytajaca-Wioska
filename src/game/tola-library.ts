import {Mesh,VertexData,VertexBuffer,Vector3,Color3,CreateIcoSphere} from './babylon';
import type {Scene,TransformNode} from './babylon';
import type {Shapes} from './shapes';
import type {Solid} from './movement';

type Point=[number,number,number];
type Outline=[number,number][];
const BARK=['#92613B','#A67143','#B4814D','#BC8B55','#9D6B40'];
const WOOD='#C4955E',CUT='#DAB27A',DARK='#67482E',IRON='#594B36';
const SLATE=['#657F7B','#78918A','#8E9F90','#6F8985','#80968B'];
const LEAF=['#6F8446','#839350','#99A45C','#ADB36B'];

// A tree hollow, built from the user's exterior-detail sheet. All surfaces use
// the existing vertex-colour material and enter the village's static batches.
export function createTolaLibrary(scene:Scene,{shape,group,material}:Shapes,parent:TransformNode,x:number,y:number,z:number,solids:Solid[]){
 const root=group('Biblioteka Toli',parent,x,y,z);
 let seed=2807;
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 function paint(mesh:Mesh,color:string,obstacle=false){
  const c=Color3.FromHexString(color),colors:number[]=[];
  for(let i=0;i<mesh.getTotalVertices();i++)colors.push(c.r,c.g,c.b,1);
  mesh.setVerticesData(VertexBuffer.ColorKind,colors);mesh.material=material('#FFFFFF');
  if(!mesh.isVerticesDataPresent(VertexBuffer.UVKind))mesh.setVerticesData(VertexBuffer.UVKind,new Array(mesh.getTotalVertices()*2).fill(0));
  mesh.isPickable=obstacle;mesh.metadata={cameraObstacle:obstacle};return mesh;
 }
 function geometry(name:string,color:string,positions:number[],indices:number[],owner=root,obstacle=false){
  const normals:number[]=[];VertexData.ComputeNormals(positions,indices,normals);
  const data=new VertexData();Object.assign(data,{positions,indices,normals});
  const mesh=new Mesh(name,scene);data.applyToMesh(mesh);mesh.parent=owner;return paint(mesh,color,obstacle);
 }
 function box(name:string,color:string,p:Point,size:Point,owner=root,obstacle=false){return paint(shape('box',name,'#FFFFFF',owner,...p,...size),color,obstacle)}
 function ball(name:string,color:string,p:Point,size:Point,owner=root,detail=1){
  const mesh=CreateIcoSphere(name,{radius:1,subdivisions:detail,flat:false},scene);mesh.parent=owner;mesh.position.set(...p);mesh.scaling.set(...size);return paint(mesh,color);
 }
 // Continuous tapered tubes give roots and branches a bent, organic silhouette.
 function tube(name:string,color:string,path:Point[],radii:number[],owner=root,segments=7,obstacle=false){
  const positions:number[]=[],indices:number[]=[];
  for(let i=0;i<path.length;i++){
   const center=Vector3.FromArray(path[i]),before=Vector3.FromArray(path[Math.max(0,i-1)]),after=Vector3.FromArray(path[Math.min(path.length-1,i+1)]);
   const tangent=after.subtract(before).normalize(),axis=Math.abs(tangent.y)>.9?Vector3.Right():Vector3.Up();
   const u=Vector3.Cross(tangent,axis).normalize(),v=Vector3.Cross(tangent,u).normalize();
   for(let j=0;j<segments;j++){const a=j*Math.PI*2/segments,p=center.add(u.scale(Math.cos(a)*radii[i])).add(v.scale(Math.sin(a)*radii[i]));positions.push(...p.asArray())}
   if(i>0)for(let j=0;j<segments;j++){const a=(i-1)*segments+j,b=(i-1)*segments+(j+1)%segments,c=i*segments+j,d=i*segments+(j+1)%segments;indices.push(a,c,b,b,c,d)}
  }
  // End caps have separate normals, including the pale exposed branch ends.
  for(const end of [0,path.length-1]){
   const start=positions.length/3;positions.push(...path[end]);
   for(let j=0;j<segments;j++)positions.push(...positions.slice((end*segments+j)*3,(end*segments+j)*3+3));
   for(let j=0;j<segments;j++){const a=start+1+j,b=start+1+(j+1)%segments;indices.push(start,...(end===0?[a,b]:[b,a]))}
  }
  return geometry(name,color,positions,indices,owner,obstacle);
 }
 function beam(name:string,color:string,a:Point,b:Point,r:number,owner=root){return tube(name,color,[a,b],[r,r],owner,6)}
 function slab(name:string,color:string,outline:Outline,depth:number,owner=root,obstacle=false){
  const positions:number[]=[],indices:number[]=[];
  function face(points:Point[]){const k=positions.length/3;for(const p of points)positions.push(...p);for(let i=1;i<points.length-1;i++)indices.push(k,k+i,k+i+1)}
  face(outline.map(([a,b])=>[a,b,-depth/2]));face([...outline].reverse().map(([a,b])=>[a,b,depth/2]));
  for(let i=0;i<outline.length;i++){const a=outline[i],b=outline[(i+1)%outline.length];face([[a[0],a[1],-depth/2],[a[0],a[1],depth/2],[b[0],b[1],depth/2],[b[0],b[1],-depth/2]])}
  return geometry(name,color,positions,indices,owner,obstacle);
 }
 function loop(name:string,color:string,p:Point,rx:number,ry:number,r:number,owner=root){
  const path:Point[]=Array.from({length:25},(_,i)=>[p[0]+Math.cos(i*Math.PI/12)*rx,p[1]+Math.sin(i*Math.PI/12)*ry,p[2]]);
  return tube(name,color,path,path.map(()=>r),owner,6);
 }
 function disk(name:string,color:string,p:Point,rx:number,ry:number,owner=root){
  const mesh=paint(shape('cylinder',name,'#FFFFFF',owner,...p,rx,.035,ry),color);mesh.rotation.x=Math.PI/2;return mesh;
 }
 function sprig(owner:TransformNode,p:Point,length:number,count=5){
  const path:Point[]=Array.from({length:count},(_,i)=>[p[0]+Math.sin(i*1.3)*.09,p[1]-i*length/(count-1),p[2]-.025*i]);
  tube('tola-ivy-stem',LEAF[0],path,path.map(()=>.019),owner,5);
  path.forEach((a,i)=>{for(const side of [-1,1]){const leaf=ball('tola-ivy-leaf',LEAF[(i+1)%4],[a[0]+side*.085,a[1]-.035,a[2]-.025],[.135,.075,.04],owner);leaf.rotation.z=side*.55}});
 }
 function flowers(owner:TransformNode,p:Point,count:number){
  for(let i=0;i<count;i++){
   const a:Point=[p[0]+(i-(count-1)/2)*.19,p[1]+random()*.15,p[2]+random()*.07];
   beam('tola-flower-stem',LEAF[0],[a[0],a[1]-.18,a[2]],a,.012,owner);
   for(let j=0;j<5;j++){const t=j*Math.PI*2/5;ball('tola-flower-petal',i%4===1?'#C1AEC8':'#F5E8C8',[a[0]+Math.cos(t)*.07,a[1]+Math.sin(t)*.07,a[2]],[.05,.05,.025],owner)}
   ball('tola-flower-center','#DEB65D',[a[0],a[1],a[2]-.03],[.033,.033,.025],owner);
  }
 }

 // The entrance is decorative, like Fela's. Keep Tola's conversation space at
 // z=18.2 open; the thick trunk/roots and raised porch have ground collisions.
 solids.push({id:'Biblioteka Toli',type:'box',x,z,halfX:3.45,halfZ:2.72});
 solids.push({id:'tola-porch',type:'box',x,z:z-3.12,halfX:1.55,halfZ:.71});
 const levels=[[0,3.35,2.55],[.6,3.18,2.45],[1.8,3.05,2.35],[3.25,2.85,2.21],[4.65,2.67,2.05],[6.1,2.45,1.91],[7.25,2.23,1.79]];
 const positions:number[]=[],indices:number[]=[],segments=40;
 for(let row=0;row<levels.length;row++){
  const [height,rx,rz]=levels[row];
  for(let i=0;i<segments;i++){
   const a=i*Math.PI*2/segments,lobe=1+.045*Math.sin(a*7+row*.23)+.022*Math.cos(a*13);
   positions.push(Math.cos(a)*rx*lobe+.10*Math.sin(height*.8),height+(row===6?.32*Math.sin(a*5):0),Math.sin(a)*rz*lobe);
   if(row>0){const j=(i+1)%segments,A=(row-1)*segments+i,B=(row-1)*segments+j,C=row*segments+i,D=row*segments+j;indices.push(A,B,C,B,D,C)}
  }
 }
 const top=positions.length/3;positions.push(0,7.2,0);
 for(let i=0;i<segments;i++)indices.push(top,6*segments+i,6*segments+(i+1)%segments);
 geometry('tola-trunk-shell',BARK[0],positions,indices,root,true);
 // Raised bark follows the trunk's taper. The front details sit beyond it.
 for(let i=0;i<40;i++){
  const a=i*Math.PI*2/40,path:Point[]=levels.map(([h,rx,rz],j)=>{
   const angle=a+.022*Math.sin(j*1.7+i),lobe=1+.045*Math.sin(angle*7+j*.23)+.022*Math.cos(angle*13);
   return [Math.cos(angle)*rx*lobe+.1*Math.sin(h*.8),h,Math.sin(angle)*rz*lobe];
  });
  tube('tola-bark-ridge',BARK[(i+1)%5],path,[.16,.17,.14,.13,.14,.12,.075]);
  if(i%2===0)tube('tola-bark-furrow',DARK,path.map(([a,b,c])=>[a*1.016,b,c*1.016]),[.016,.024,.02,.018,.021,.017,.012],root,5);
 }
 for(let i=0;i<10;i++){
  // Leave a clear central gap for the porch and steps.
  const a=-Math.PI/2+.62+i*(Math.PI*2-1.24)/9,dx=Math.cos(a),dz=Math.sin(a);
  const path:Point[]=[[dx*2.7,1.5,dz*2.0],[dx*3.0,.83,dz*2.45],[dx*3.65,.28,dz*2.92],[dx*4.12,.10,dz*3.36]];
  tube('tola-buttress-root',BARK[i%5],path,[.37,.43,.29,.055],root,8,true);
  tube('tola-root-grain',CUT,path.map(([a,b,c])=>[a,b+.18,c]),[.015,.025,.018,.006],root,5);
  const tip=path[2];solids.push({id:'tola-root',type:'circle',x:x+tip[0],z:z+tip[2],radius:.52});
  ball('tola-root-moss',LEAF[i%4],[tip[0]*.98,.21,tip[2]*.98],[.4,.14,.3]);
 }

 // Broad boughs and a light, irregular crown, with the balcony kept visible.
 for(const [i,a] of [-2.82,-.32,.55,1.2,2.0,2.65].entries()){
  const dx=Math.cos(a),dz=Math.sin(a),h=6.3+(i%3)*.23;
  const path:Point[]=[[dx*1.75,h-1,dz*1.4],[dx*2.5,h+.15,dz*1.9],[dx*3.35,h+1.05,dz*2.1],[dx*3.8,h+1.9,dz*2.25]];
  tube('tola-tree-bough',BARK[i%5],path,[.6,.48,.31,.075],root,9,true);
  tube('tola-bough-grain',CUT,path.map(([a,b,c])=>[a-.06,b,c-.22]),[.025,.035,.025,.009],root,5);
  for(let j=0;j<4;j++){
   const h2=h+1.2+j*.24,px=dx*(2.9+random())+(random()-.5),pz=dz*2+(random()-.5)*1.1;
   ball('tola-leafy-crown',LEAF[(i+j)%4],[px,h2,pz],[.87+random()*.3,.43+random()*.25,.7+random()*.3],root,2);
   for(let k=0;k<4;k++){const leaf=ball('tola-crown-leaf',LEAF[(i+j+k+1)%4],[px+(random()-.5)*1.5,h2+.3,pz+(random()-.5)*1.4],[.26,.055,.13]);leaf.rotation.y=random()*Math.PI}
  }
 }
 for(let i=0;i<6;i++)ball('tola-crown-top',LEAF[i%4],[-1.4+i*.55,7.6+Math.sin(i)*.22,.5],[.94,.5,.9],root,2);
 for(let i=0;i<5;i++)ball('tola-crown-front',LEAF[(i+2)%4],[-1.4+i*.7,7.49+Math.sin(i*2)*.18,-1.25],[.65,.36,.59],root,2);

 // A few elongated knots and forked grain lines break up the long bark ribs.
 for(const [i,a] of [-2.5,-.65,.4,1.5,2.6].entries()){
  const g=group('tola-bark-knot',root,Math.cos(a)*2.86,3.0+(i%2)*1.55,Math.sin(a)*2.25);g.rotation.y=-a-Math.PI/2;
  loop('tola-knot-outer',DARK,[0,0,-.13],.17,.32,.018,g);
  loop('tola-knot-inner',WOOD,[0,0,-.15],.10,.21,.018,g);
  tube('tola-split-grain',CUT,[[-.12,-.32,-.14],[-.21,-.54,-.11],[-.16,-.91,-.05]],[.014,.014,.007],g,5);
 }

 // A small, swept slate hood is tucked under the upper floor; individual
 // staggered shingles are visible from both the path and the balcony.
 const profile:Outline=[[-3.4,3.3],[-2.3,3.62],[-1.15,4.08],[0,4.38],[1.15,4.08],[2.3,3.62],[3.4,3.3]];
 for(let i=1;i<profile.length;i++){
  const [a,ha]=profile[i-1],[b,hb]=profile[i];
  const shell=slab('tola-awning-shell',DARK,[[a,ha-.16],[b,hb-.16],[b,hb],[a,ha]],1.45,root,true);shell.position.z=-2.25;
  beam('tola-awning-edge',WOOD,[a,ha,-3.02],[b,hb,-3.02],.11);
  for(let row=0;row<2;row++)for(let col=0;col<5;col++){
   const u=(row+.1)/2,v=Math.min(1,(row+1.2)/2),xx=a+(b-a)*u,hh=ha+(hb-ha)*u,len=(b-a)*(v-u);
   const tile=box('tola-slate-shingle',SLATE[(i+row+col*3)%5],[xx+len/2,hh+(hb-ha)*(v-u)/2+.06,-2.85+col*.30+(row%2)*.07],[len+.045,.075,.345]);tile.rotation.z=Math.atan2(hb-ha,b-a);
   if(col===0)beam('tola-shingle-grain','#A6AD91',[xx+.1,hh+.108,-3.025],[xx+len-.06,hh+(hb-ha)*(v-u)+.108,-3.025],.008);
  }
 }
 for(const side of [-1,1])tube('tola-awning-bracket',BARK[1],[[side*2.6,2.75,-2.0],[side*2.8,3.1,-2.55],[side*3.08,3.37,-2.9]],[.13,.14,.1]);

 function roundWindow(name:string,p:Point,angle:number,r=.67,planter=true){
  const g=group(name,root,...p);g.rotation.y=angle;
  disk('tola-window-shadow',DARK,[0,0,.03],r+.16,r+.16,g);
  disk('tola-window-amber','#AB8248',[0,0,-.02],r,r,g);
  loop('tola-window-bark-frame',BARK[3],[0,0,-.035],r+.15,r+.15,.10,g);
  loop('tola-window-inner-frame',CUT,[0,0,-.10],r+.035,r+.035,.045,g);
  // Opaque miniature shelves avoid transparency sorting after scene merging.
  for(const row of [-1,1]){
   box('tola-window-bookshelf',WOOD,[0,row*.28,-.08],[r*1.65,.045,.07],g);
   for(let i=0;i<6;i++){
    const bx=-r*.62+i*r*.24,bh=.16+(i%3)*.035;
    box('tola-window-book',['#728779','#BC8D65','#D7BC80','#997C64'][i%4],[bx,row*.28+bh/2+.025,-.125],[.10,bh,.055],g);
    box('tola-book-band',CUT,[bx,row*.28+bh*.7,-.157],[.082,.015,.008],g);
   }
  }
  for(const side of [-1,1])box('tola-window-reflection','#DAC18C',[side*.35,.22,-.16],[.025,.22,.012],g);
  beam('tola-window-mullion',DARK,[-r,0,-.18],[r,0,-.18],.038,g);beam('tola-window-mullion',DARK,[0,-r,-.18],[0,r,-.18],.038,g);
  for(const side of [-1,1])ball('tola-window-fastener',CUT,[side*.08,.04,-.22],[.025,.025,.018],g);
  if(planter){
   box('tola-window-sill',CUT,[0,-r-.16,-.19],[r*2+.38,.11,.42],g);
   box('tola-flower-box',DARK,[0,-r-.34,-.18],[r*2+.14,.25,.36],g);
   for(let i=0;i<7;i++)box('tola-planter-board',BARK[i%5],[-r+i*r/3,-r-.34,-.39],[r*.31,.25,.06],g);
   flowers(g,[0,-r-.12,-.35],7);sprig(g,[-.52,-r-.16,-.42],.55);sprig(g,[.48,-r-.16,-.42],.4);
  }
  return g;
 }
 roundWindow('tola-front-window-left',[-2.04,2.1,-2.19],.42);
 roundWindow('tola-front-window-right',[2.04,2.1,-2.19],-.42);
 roundWindow('tola-side-window-left',[-2.98,3.95,.15],Math.PI/2,.66);
 roundWindow('tola-side-window-right',[2.98,3.95,.15],-Math.PI/2,.66);
 roundWindow('tola-back-window',[0,3.25,2.39],Math.PI,.7);

 function arch(width:number,base:number,spring:number):Outline{
  const points:Outline=[[-width,base],[width,base],[width,spring]];
  for(let i=1;i<=12;i++){const a=i*Math.PI/12;points.push([Math.cos(a)*width,spring+Math.sin(a)*width])}return points;
 }
 const door=group('tola-front-door',root,0,.5,-2.58);
 slab('tola-door-recess',DARK,arch(.89,0,1.66),.23,door);
 const panel=slab('tola-arched-door',WOOD,arch(.71,.02,1.64),.12,door);panel.position.z=-.16;
 for(let i=0;i<8;i++){
  const xx=-.63+i*.18,hh=1.64+Math.sqrt(Math.max(0,.71**2-xx**2));
  box('tola-door-plank',BARK[(i+2)%5],[xx,hh/2,-.237],[.169,hh-.04,.032],door);
  beam('tola-door-grain',WOOD,[xx-.045,.15,-.258],[xx-.025,hh-.12,-.258],.009,door);
 }
 const doorArch:Point[]=[[-.84,.04,-.2],[-.84,1.66,-.2],...Array.from({length:13},(_,i)=>{const a=Math.PI-i*Math.PI/12;return [Math.cos(a)*.84,1.66+Math.sin(a)*.84,-.2] as Point}),[.84,.04,-.2]];
 tube('tola-door-arch-frame',CUT,doorArch,doorArch.map(()=>.085),door,7);
 for(const h of [.46,1.62]){
  const strap=slab('tola-door-iron-strap',IRON,[[-.66,h-.055],[-.15,h-.055],[-.08,h],[-.15,h+.055],[-.66,h+.055]],.035,door);strap.position.z=-.28;
  for(const a of [-.59,-.21])ball('tola-door-rivet',CUT,[a,h,-.31],[.028,.028,.02],door);
 }
 disk('tola-door-knocker-plate',IRON,[.43,1.02,-.29],.095,.16,door);loop('tola-door-ring',CUT,[.43,.94,-.35],.105,.13,.026,door);

 box('tola-porch-shell',DARK,[0,.23,-3.02],[3.1,.46,1.02],root,true);
 for(let i=0;i<12;i++)box('tola-porch-plank',BARK[(i+2)%5],[-1.42+i*.258,.48,-3.04],[.246,.10,1.08]);
 for(let i=0;i<4;i++){
  const h=.08+i*.105,zz=-3.72+i*.17;
  box('tola-porch-step',BARK[(i+2)%5],[0,h,zz],[2.24,.13,.34]);beam('tola-step-edge',CUT,[-1.12,h+.065,zz-.17],[1.12,h+.065,zz-.17],.022);
 }
 for(const side of [-1,1]){
  tube('tola-porch-post',BARK[2],[[side*1.43,.28,-3.5],[side*1.45,1.32,-3.48]],[.13,.12]);
  disk('tola-post-knot',CUT,[side*1.45,.91,-3.61],.075,.1);
  tube('tola-porch-handrail',WOOD,[[side*1.45,1.26,-3.5],[side*1.44,1.42,-2.95],[side*1.35,1.46,-2.57]],[.075,.08,.075]);
  for(let i=0;i<3;i++)beam('tola-porch-baluster',BARK[1],[side*1.44,.5,-3.34+i*.28],[side*1.44,1.29+i*.07,-3.34+i*.28],.035);
 }

 // Upper arched window and a bowed balcony with individually turned spindles.
 const upper=group('tola-balcony-window',root,0,4.85,-1.99);
 slab('tola-upper-window-recess',DARK,arch(.81,0,1.1),.18,upper);
 const glass=slab('tola-upper-window-amber','#CDA15C',arch(.67,.05,1.1),.10,upper);glass.position.z=-.13;
 const upperArch:Point[]=[[-.8,0,-.17],[-.8,1.1,-.17],...Array.from({length:13},(_,i)=>{const a=Math.PI-i*Math.PI/12;return [Math.cos(a)*.8,1.1+Math.sin(a)*.8,-.17] as Point}),[.8,0,-.17]];
 tube('tola-upper-window-frame',CUT,upperArch,upperArch.map(()=>.09),upper,7);
 box('tola-upper-mullion',DARK,[0,.94,-.23],[.08,1.84,.08],upper);box('tola-upper-cross',DARK,[0,.63,-.23],[1.33,.075,.08],upper);
 for(const side of [-1,1]){box('tola-upper-panel',BARK[2],[side*.35,.27,-.23],[.61,.44,.08],upper);ball('tola-upper-handle',CUT,[side*.10,.57,-.30],[.03,.03,.025],upper)}
 function balconyZ(a:number){return -2.23-.70*Math.cos(a*Math.PI/3.8)}
 for(let i=0;i<17;i++){
  const a=-1.8+i*.225,front=balconyZ(a);
  box('tola-balcony-floor',BARK[(i+2)%5],[a,4.72,(-1.78+front)/2],[.216,.14,-1.78-front],root,true);
 }
 for(const h of [4.73,5.52]){
  const rail:Point[]=Array.from({length:17},(_,i)=>{const a=-1.88+i*.235;return [a,h,balconyZ(a)]});
  tube('tola-balcony-curved-rail',WOOD,rail,rail.map(()=>h>5?.095:.11),root,8);
 }
 for(let i=0;i<11;i++){
  const a=-1.78+i*.356,zz=balconyZ(a);
  tube('tola-balcony-spindle',BARK[(i+1)%5],[[a,4.79,zz],[a,4.99,zz],[a,5.16,zz],[a,5.34,zz],[a,5.5,zz]],[.035,.068,.041,.065,.035],root,7);
 }
 for(const side of [-1,1]){
  tube('tola-balcony-bracket',BARK[1],[[side*1.35,3.86,-1.95],[side*1.43,4.32,-2.41],[side*1.62,4.65,-2.55]],[.18,.16,.12]);
  beam('tola-balcony-side-rail',WOOD,[side*1.88,5.52,-2.23],[side*1.88,5.52,-1.5],.085);
  ball('tola-balcony-planter','#9E7548',[side*1.28,4.98,-2.25],[.22,.27,.20]);flowers(root,[side*1.28,5.36,-2.26],3);
  sprig(root,[side*1.6,4.78,-2.61],.63);
 }

 // A legible two-line carved sign. Stroke letters remain crisp without fonts
 // or texture downloads, including in NullEngine and the existing mesh merge.
 const sign=group('tola-library-sign',root,0,3.54,-3.12);
 slab('tola-sign-outline',DARK,[[-1.55,-.30],[1.55,-.30],[1.65,.24],[1.12,.43],[-1.12,.43],[-1.65,.24]],.14,sign);
 const inset=slab('tola-sign-board',CUT,[[-1.47,-.24],[1.47,-.24],[1.55,.19],[1.08,.36],[-1.08,.36],[-1.55,.19]],.035,sign);inset.position.z=-.09;
 const glyphs:Record<string,Outline[]>={
  B:[[[0,0],[0,1],[.6,1],[.78,.82],[.6,.55],[0,.55]],[[.6,.55],[.8,.3],[.6,0],[0,0]]],
  I:[[[.1,1],[.7,1]],[[.4,1],[.4,0]],[[.1,0],[.7,0]]],
  L:[[[0,1],[0,0],[.8,0]]],O:[[[.15,0],[0,.2],[0,.8],[.15,1],[.65,1],[.8,.8],[.8,.2],[.65,0],[.15,0]]],
  T:[[[0,1],[.8,1]],[[.4,1],[.4,0]]],E:[[[.8,1],[0,1],[0,0],[.8,0]],[[0,.52],[.65,.52]]],
  K:[[[0,1],[0,0]],[[.8,1],[0,.45],[.8,0]]],A:[[[0,0],[.4,1],[.8,0]],[[.16,.4],[.64,.4]]],
 };
 function lettering(word:string,h:number,size:number){
  const advance=size*1.04,start=-(word.length-1)*advance/2-size*.4;
  for(const [i,c] of [...word].entries())for(const stroke of glyphs[c])for(let j=1;j<stroke.length;j++){
   const a=stroke[j-1],b=stroke[j];beam('tola-sign-letter',DARK,[start+i*advance+a[0]*size,h+a[1]*size,-.128],[start+i*advance+b[0]*size,h+b[1]*size,-.128],.013,sign);
  }
 }
 lettering('BIBLIOTEKA',.02,.23);lettering('TOLI',-.20,.18);
 const book=group('tola-sign-book',sign,0,.55,-.02);
 for(const side of [-1,1]){
  const outline:Outline=[[0,-.09],[side*.27,-.04],[side*.27,.25],[0,.20]];
  slab('tola-book-cover',DARK,side<0?outline.reverse():outline,.055,book);
  const page=box('tola-book-page','#EFDBAC',[side*.14,.08,-.045],[.23,.24,.028],book);page.rotation.z=side*.17;
  for(let i=0;i<3;i++)beam('tola-book-writing',WOOD,[side*.06,.14-i*.065,-.065],[side*.23,.17-i*.065,-.065],.009,book);
 }
 for(const side of [-1,1])disk('tola-sign-peg',WOOD,[side*1.4,.08,-.13],.035,.035,sign);

 function lantern(p:Point,scale=1){
  const g=group('tola-lantern',root,...p);g.scaling.setAll(scale);
  tube('tola-lantern-hook',IRON,[[0,.29,.07],[0,.46,-.09],[0,.46,-.25],[0,.28,-.31]],[.025,.025,.025,.025],g,6);
  loop('tola-lantern-loop',IRON,[0,.23,-.31],.055,.08,.016,g);
  paint(shape('cone','tola-lantern-cap','#FFFFFF',g,0,.10,-.31,.21,.20,.21),IRON);
  box('tola-lantern-glass','#E8BB62',[0,-.13,-.31],[.25,.35,.25],g);
  ball('tola-lantern-flame','#FFF0BC',[0,-.1,-.46],[.06,.12,.025],g);
  for(const a of [-1,1])for(const b of [-1,1])beam('tola-lantern-corner',IRON,[a*.145,-.32,-.31+b*.145],[a*.145,.06,-.31+b*.145],.018,g);
  box('tola-lantern-base',IRON,[0,-.33,-.31],[.36,.07,.36],g);
 }
 lantern([-1.14,2.79,-2.7]);lantern([.38,6.11,-2.22],.65);

 // Trailing ivy and carved leaves echo the illustrated roots and bark panels.
 for(const side of [-1,1]){
  sprig(root,[side*2.47,6.6,-1.15],1.05,7);sprig(root,[side*2.9,3.16,-1.7],1.45,8);sprig(root,[side*2.55,1.12,-2.48],.65);
  for(let i=0;i<4;i++){
   const yy=4.78+i*.21,xx=side*(2.33-.06*i);
   const leaf=ball('tola-carved-oak-leaf',CUT,[xx,yy,-1.59],[.14,.075,.032]);leaf.rotation.z=side*.7;
  }
  beam('tola-carved-oak-stem',WOOD,[side*2.24,4.64,-1.64],[side*2.24,5.62,-1.64],.025);
  flowers(root,[side*2.3,.48,-2.85],5);
  for(let i=0;i<4;i++)ball('tola-foundation-stone',i%2?'#ABA58B':'#BDB296',[side*(2.7+i*.34),.09,-2.54+Math.sin(i)*.4],[.2,.15,.18]);
 }
 return root;
}
