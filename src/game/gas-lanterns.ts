import {Color3,PointLight,StandardMaterial,Vector3} from './babylon';
import type {Scene,TransformNode} from './babylon';
import type {Shapes} from './shapes';
import {terrainHeight,type Solid} from './movement';
import type {SaveState} from '../persistence/state';
import {GAS_LANTERNS,lanternLitFlag} from './lantern-layout';

export function createGasLanterns(scene:Scene,shapes:Shapes,parent:TransformNode,solids:Solid[]){
 const {group,shape}=shapes,iron='#42554B',brass='#B69758';
 const flameMaterial=new StandardMaterial('gas-flame-material',scene);
 flameMaterial.disableLighting=true;flameMaterial.emissiveColor=Color3.FromHexString('#FFE6A6');
 const coreMaterial=new StandardMaterial('gas-flame-core-material',scene);
 coreMaterial.disableLighting=true;coreMaterial.emissiveColor=Color3.FromHexString('#FFF8DC');
 const lanterns=GAS_LANTERNS.map(definition=>{
  const {id,x,z}=definition,y=terrainHeight(x,z),root=group(id,parent,x,y,z);
  shape('cylinder','lantern-foot',iron,root,0,.11,0,.25,.22,.25);
  shape('cylinder','lantern-base',iron,root,0,.34,0,.15,.46,.15);
  const post=shape('cylinder','lantern-post',iron,root,0,1.28,0,.065,1.65,.065);
  post.isPickable=true;post.metadata={cameraObstacle:true};
  for(const height of [.57,1.95])shape('ring','lantern-collar',brass,root,0,height,0,.19,.19,.19);
  shape('cylinder','lantern-tray',iron,root,0,2.13,0,.32,.09,.32);
  for(const dx of [-.22,.22])for(const dz of [-.22,.22])shape('box','lantern-frame',iron,root,dx,2.43,dz,.035,.58,.035);
  // An open glazed housing keeps the flame readable without transparent
  // panes sorting incorrectly against the sea, the pond or each other.
  shape('cone','lantern-cap',iron,root,0,2.88,0,.40,.36,.40);
  shape('ball','lantern-finial',brass,root,0,3.1,0,.07,.10,.07);
  shape('cylinder','gas-burner',brass,root,0,2.21,0,.075,.12,.075);
  const valve=shape('ring','gas-valve',brass,root,0,.95,-.11,.16,.16,.16);valve.rotation.x=Math.PI/2;
  const flame=group('gas-flame',root,0,2.4,0);
  const outer=shape('ball','gas-flame-outer','#FFE6A6',flame,0,0,0,.11,.23,.11);outer.material=flameMaterial;
  const core=shape('ball','gas-flame-core','#FFF8DC',flame,0,-.03,-.075,.05,.13,.05);core.material=coreMaterial;
  for(const mesh of flame.getChildMeshes())mesh.metadata={dynamicScenery:true,castsShadow:false};
  flame.setEnabled(false);
  const light=new PointLight(`${id}-light`,new Vector3(x,y+2.42,z),scene);
  light.diffuse=Color3.FromHexString('#FFD38A');light.specular=Color3.Black();light.range=8;light.intensity=0;light.setEnabled(false);
  solids.push({id,type:'circle',x,z,radius:.25});
  return {definition,root,flame,light};
 });
 function sync(state:SaveState){for(const {definition,flame,light} of lanterns){const lit=!!state.flags[lanternLitFlag(definition.id)];flame.setEnabled(lit);light.setEnabled(lit)}}
 function update(night:number){for(const {light} of lanterns)light.intensity=.65+night*.95}
 return {lanterns,sync,update};
}
