import {Scene,FreeCamera,Vector3,Color3,Color4,HemisphericLight,DirectionalLight} from './babylon';
import type {Engine,TransformNode} from './babylon';
import type {ContentPack,Location} from '../content/types';
import type {SaveState} from '../persistence/state';
import {createCharacter} from '../characters/models';
import {createVillage} from './world';
import {createShapes} from './shapes';
import {createStoryWorld,drawItem} from './story-world';

type LocationWorld=Pick<ReturnType<typeof createVillage>,'kitek'|'npcs'|'solids'>&{syncHarvest?:(state:SaveState)=>void};
export type LocationScene={
 location:Location;
 scene:Scene;
 camera:FreeCamera;
 world:LocationWorld;
 story:ReturnType<typeof createStoryWorld>;
 carriedCrate:TransformNode|null;
};

function createHomeActors(scene:Scene,content:ContentPack):LocationWorld{
 scene.clearColor=Color4.FromHexString('#DCE9DDFF');
 const sky=new HemisphericLight('home-sky',new Vector3(0,1,0),scene);sky.intensity=.9;sky.groundColor=Color3.FromHexString('#71856C');
 const sun=new DirectionalLight('home-sun',new Vector3(-.5,-1,.3),scene);sun.intensity=.65;sun.diffuse=Color3.FromHexString('#FFE5BC');
 const kitek=createCharacter(scene,'kitek');
 const npcs=content.characters.map(definition=>{
  const character=createCharacter(scene,definition.model);character.root.name=definition.id;character.root.setEnabled(false);
  return {definition,character,solid:{id:`npc:${definition.id}`,type:'circle' as const,x:0,z:0,radius:.42},motion:{x:0,z:0,heading:0,waypoint:0,waiting:0,stuck:0}};
 });
 const {shape}=createShapes(scene);
 for(const character of [kitek,...npcs.map(npc=>npc.character)])shape('cylinder','contact-shadow','#66784F',character.root,0,.018,0,.31,.012,.22);
 return {kitek,npcs,solids:[]};
}

// An Engine owns the canvas; each cached Scene owns a separate coordinate space.
// This class has no input handlers or render loop. Runtime drives only its active view.
export class LocationScenes{
 private readonly cache=new Map<Location,LocationScene>();
 constructor(private engine:Engine,private content:ContentPack){}

 get(location:Location):LocationScene{
  const cached=this.cache.get(location);if(cached)return cached;
  const scene=new Scene(this.engine);
  // Input is handled once by VillageGame, including manual raycasts.
  scene.detachControl();
  try{
   const world=location==='village'?createVillage(scene,this.content.characters):createHomeActors(scene,this.content);
   const story=createStoryWorld(scene,this.content,location);
   const camera=new FreeCamera('behind-kitek',new Vector3(0,2,-4),scene);
   camera.minZ=.08;camera.maxZ=location==='village'?500:160;camera.fov=.92;scene.activeCamera=camera;
   let carriedCrate:TransformNode|null=null;
   const item=this.content.items.find(i=>i.id==='crate');
   if(item){carriedCrate=drawItem(createShapes(scene),world.kitek.root,item,0,.42);carriedCrate.scaling.setAll(.65);carriedCrate.position.y=.4;carriedCrate.setEnabled(false)}
   const view={location,scene,camera,world,story,carriedCrate};this.cache.set(location,view);return view;
  }catch(error){scene.dispose();throw error}
 }

 prepare(state:SaveState):LocationScene{
  const view=this.get(state.location);view.story.sync(state);view.world.syncHarvest?.(state);view.carriedCrate?.setEnabled(!!state.inventory.crate);return view;
 }

 dispose(){for(const view of this.cache.values())view.scene.dispose();this.cache.clear()}
}
