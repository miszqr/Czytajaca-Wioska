import type {Scene,TransformNode} from './babylon';
import {createShapes,type Shapes} from './shapes';
import type {ContentPack,ItemDefinition,Furniture,Location} from '../content/types';
import type {SaveState} from '../persistence/state';
import {targetPosition} from '../interactions/model';
import {matches} from '../story/engine';
import {terrainHeight} from './movement';
export function drawItem(shapes:Shapes,parent:TransformNode,item:ItemDefinition,x:number,z:number,rotation=0){
 const {group,shape}=shapes,g=group(item.id,parent,x,0,z),c=item.color,w=item.width,d=item.depth;g.rotation.y=rotation*Math.PI/2;
 const box=(name:string,color:string,y:number,sx:number,sy:number,sz:number,px=0,pz=0)=>shape('box',name,color,g,px,y,pz,sx,sy,sz);
 if(item.model==='bed'){box('bed-frame','#927151',.23,w,.35,d);box('mattress','#F6E7C6',.48,w*.92,.2,d*.94);box('blanket',c,.61,w*.93,.12,d*.6,0,-d*.15);box('pillow','#FFF2DA',.65,w*.8,.16,.45,0,d*.32);box('headboard','#927151',.65,w,.9,.12,0,d/2)}
 else if(item.model==='table'){box('tabletop',c,.85,w,.16,d);for(const px of [-w*.4,w*.4])for(const pz of [-d*.38,d*.38])box('table-leg','#866244',.4,.1,.8,.1,px,pz)}
 else if(item.model==='lamp'){shape('cylinder','lamp-foot','#8A7158',g,0,.05,0,.22,.1,.22);shape('cylinder','lamp-stem','#8A7158',g,0,.55,0,.035,1,.035);shape('cone','lamp-shade',c,g,0,1.2,0,.36,.45,.36);shape('ball','lamp-warm-light','#FFE4A2',g,0,1.08,0,.17,.12,.17)}
 else if(item.model==='chair'){box('seat',c,.5,w,.12,d);box('chair-back',c,.9,w,.7,.1,0,d*.44);for(const px of [-w*.35,w*.35])for(const pz of [-d*.35,d*.35])box('chair-leg','#866244',.23,.09,.46,.09,px,pz)}
 else if(item.model==='rug'){box('rug',c,.035,w,.035,d);box('rug-border','#F4DFB6',.057,w*.9,.01,d*.85)}
 else if(item.model==='plant'){shape('cylinder','pot',c,g,0,.23,0,w*.35,.45,d*.35);for(let i=0;i<5;i++){const a=i*Math.PI*2/5;shape('ball','plant-leaf','#7D9C64',g,Math.sin(a)*w*.22,.65+(i%2)*.1,Math.cos(a)*d*.22,w*.2,.3,d*.2)}}
 else if(item.model==='shelf'){for(const px of [-w*.46,w*.46])box('shelf-side',c,.75,.09,1.5,d,px);for(const y of [.15,.75,1.4])box('shelf',c,y,w,.1,d);for(let i=0;i<4;i++)box('shelf-book',['#A4B282','#D7B788','#A4BDCC','#B9847B'][i],.98,.13,.38,d*.7,-w*.3+i*.18)}
 else if(item.model==='letter'){box('envelope','#FFF0CE',.94,.38,.025,.25);box('envelope-seal','#BA8169',.96,.075,.015,.07)}
 else if(item.model==='crate'){box('crate',c,.32,w,.6,d);for(const y of [.08,.36,.6])box('crate-slat','#9C754E',y,w+.04,.065,d+.04)}
 else if(item.model==='book'){box('book-cover',c,.11,w,.18,d);box('book-pages','#F4E8CD',.12,w*.94,.11,d*.98)}
 else if(item.model==='key'){shape('ring','key-ring',c,g,0,.12,0,.35,.35,.35);box('key-shaft',c,.1,.06,.06,.4,0,-.25)}
 else shape('ball',item.model,c,g,0,.18,0,w/2,.18,d/2);
 return g;
}
function createHomeInterior(scene:Scene,content:ContentPack){
 const shapes=createShapes(scene),{group,shape}=shapes,home=group('home-interior'),furnishings=group('home-furnishings',home);
 shape('box','wood-floor','#D8B88A',home,0,-.1,0,10,.2,8);
 for(let x=-4.8;x<5;x+=.5)shape('box','floor-plank','#BF9C72',home,x,.005,0,.015,.012,8);
 for(const [x,z,w,d] of [[-5,0,.16,8],[5,0,.16,8],[0,4,10,.16],[0,-4,10,.16]]){const wall=shape('box','home-wall','#EADCC1',home,x,1.4,z,w,2.8,d);wall.isPickable=true;wall.metadata={cameraObstacle:true}}
 shape('box','inside-door','#9F7855',home,0,1,-3.9,1.2,2,.08);
 shape('box','window-frame','#A58260',home,-1,1.8,3.88,1.6,1.4,.08);shape('box','window-sky','#B7D4C7',home,-1,1.8,3.82,1.4,1.2,.04);
 shape('box','cabinet-note','#F5E6C5',home,3.3,1.35,2.65,.3,.35,.02);
 for(const x of [2.65,3.95])shape('box','cabinet-side','#9E7957',home,x,.85,3.15,.1,1.7,.8);
 shape('box','cabinet-back','#8F6F51',home,3.3,.85,3.52,1.4,1.7,.06);for(const y of [.07,.7,1.65])shape('box','cabinet-shelf','#B58F66',home,3.3,y,3.15,1.4,.1,.8);
 const cabinetDoor=shape('box','cabinet-door','#BF986B',home,3.3,.85,2.72,1.3,1.6,.07);shape('ball','cabinet-knob','#D6BD7F',home,3.75,.85,2.65,.04);
 const grid=group('placement-grid',home);for(let x=-4.5;x<=4.5;x+=.5)shape('box','grid-line','#9DAA8A',grid,x,.018,0,.012,.008,7);for(let z=-3.5;z<=3.5;z+=.5)shape('box','grid-line','#9DAA8A',grid,0,.018,z,9,.008,.012);grid.setEnabled(false);
 let furnitureKey='';
 function sync(state:SaveState){
  cabinetDoor.setEnabled(!state.flags['cabinet-open']);
  const key=JSON.stringify(state.furniture);if(key!==furnitureKey){furnitureKey=key;for(const child of furnishings.getChildren())child.dispose();for(const f of state.furniture){const item=content.items.find(i=>i.id===f.itemId);if(item){const g=drawItem(shapes,furnishings,item,f.x,f.z,f.rotation);g.name=f.id;for(const m of g.getChildMeshes()){m.isPickable=item.model!=='rug';m.metadata={cameraObstacle:item.model!=='rug'}}}}}
 }
 function preview(f:Furniture|null,valid=true){let old=home.getChildren().find(n=>n.name==='placement-preview');old?.dispose();if(!f)return;const item=content.items.find(i=>i.id===f.itemId);if(item){const g=drawItem(shapes,home,{...item,color:valid?'#90B77B':'#C58B77'},f.x,f.z,f.rotation);g.name='placement-preview';for(const m of g.getChildMeshes())m.visibility=.55}}
 return {home,sync,preview,setEditing:(value:boolean)=>grid.setEnabled(value)};
}

// Only create geometry belonging to this location. No hidden room in the village.
export function createStoryWorld(scene:Scene,content:ContentPack,location:Location){
 const shapes=createShapes(scene),{group,shape}=shapes,objects=group('story-objects');
 const interior=location==='home'?createHomeInterior(scene,content):null;
 const visuals=content.interactions.filter(t=>t.location===location).map(t=>{const g=group(t.id,objects,t.position.x,location==='home'?0:terrainHeight(t.position.x,t.position.z),t.position.z);
  if(t.model==='letter')drawItem(shapes,g,{id:'envelope',name:'',description:'',kind:'usable',model:'letter',color:'#FBE6BD',width:.4,depth:.3},0,0);
  if(t.model==='crate')drawItem(shapes,g,{id:'crate',name:'',description:'',kind:'usable',model:'crate',color:'#C69B69',width:.7,depth:.6},0,0);
  if(t.model==='sign'){shape('cylinder','sign-post','#8C7150',g,0,.6,0,.05,1.2,.05);shape('box','sign-board','#D8C49B',g,0,1.2,0,1.1,.45,.12)}
  if(t.model==='garden'){shape('box','garden-drop','#B99B6F',g,0,.03,0,1.2,.05,1);for(const x of [-.6,.6])shape('box','garden-crate-marker','#A9875A',g,x,.1,0,.06,.15,1)}
  if(t.model==='bell'){shape('cylinder','bell-stand','#927151',g,0,.5,0,.035,1,.035);shape('cone','bell','#D4B474',g,0,1,0,.15,.22,.15)}
  return {target:t,root:g};
 });
 function sync(state:SaveState){
  if(state.location!==location)throw new Error('Nie można synchronizować obiektów innej lokalizacji.');
  for(const {target,root} of visuals){const pos=targetPosition(target,state);root.setEnabled(!!pos&&matches(state,target.when));if(pos){root.position.x=pos.x;root.position.z=pos.z}}
  interior?.sync(state);
 }
 return {objects,sync,preview:(f:Furniture|null,valid=true)=>interior?.preview(f,valid),setEditing:(value:boolean)=>interior?.setEditing(value)};
}
