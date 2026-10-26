import {TransformNode,Vector3,StandardMaterial,Color3} from '../game/babylon';
import type {Scene} from '../game/babylon';
import type {AssetContainer} from '@babylonjs/core/assetContainer';
import type {AnimationGroup} from '@babylonjs/core/Animations/animationGroup';
import type {AbstractMesh} from '@babylonjs/core/Meshes/abstractMesh';

export const STEGOSAURUS_MODEL_URL=import.meta.env.BASE_URL+'models/stegosaurus.glb';

/** Quaternius CC0 mesh, normalised to nine metres. Loads only after discovery. */
export function createStegosaurus(scene:Scene,source:string|Uint8Array=STEGOSAURUS_MODEL_URL){
 const root=new TransformNode('stegosaurus',scene);root.setEnabled(false);
 let container:AssetContainer|null=null,loaded=false,disposed=false;
 let model:TransformNode|undefined,meshes:AbstractMesh[]=[];
 let idle:AnimationGroup|undefined,walk:AnimationGroup|undefined,active:AnimationGroup|undefined;
 let fallback:ReturnType<typeof import('./stegosaurus-fallback').createFallbackStegosaurus>|null=null;
 function animate(time:number,moving:boolean,reduced=false){
  if(!loaded||disposed)return;
  if(fallback){fallback.animate(time,moving,reduced);return}
  const clip=moving&&!reduced?walk:idle;if(!clip)return;
  if(active!==clip){active?.stop();clip.start(true);clip.pause();active=clip}
  // Sample with the game's clock so menu, collision stops and inactive scenes
  // also pause the authored animation. No second, independent animation clock.
  const fps=clip.targetedAnimations[0]?.animation.framePerSecond??60;
  const length=clip.to-clip.from;
  clip.goToFrame(clip.from+(reduced||length<=0?0:(time*fps)%length));
  // Authored clips move the feet slightly below the bind-pose ground. Keep the
  // lowest foot on the local ground plane, including on the sloping beach.
  if(model&&container){
   for(const node of container.transformNodes)node.computeWorldMatrix(true);
   for(const skeleton of container.skeletons)skeleton.prepare(true);
   const inverse=root.computeWorldMatrix(true).clone().invert();let floor=Infinity;
   for(const mesh of meshes){
    const positions=mesh.getPositionData(true);
    const matrix=mesh.computeWorldMatrix(true).multiply(inverse).m;
    if(positions)for(let i=0;i<positions.length;i+=3)floor=Math.min(floor,positions[i]*matrix[1]+positions[i+1]*matrix[5]+positions[i+2]*matrix[9]+matrix[13]);
   }
   if(Number.isFinite(floor))model.position.y-=floor;
   for(const mesh of meshes){mesh.computeWorldMatrix(true);mesh.refreshBoundingInfo({applySkeleton:true})}
  }
 }
 root.onDisposeObservable.add(()=>{disposed=true;container?.dispose();container=null});
 const ready=(async()=>{
  try{
   const [{LoadAssetContainerAsync}]=await Promise.all([
    import('@babylonjs/core/Loading/sceneLoader'),import('@babylonjs/loaders/glTF/2.0/glTFLoader'),
   ]);
   if(disposed||scene.isDisposed)return false;
   const imported=await LoadAssetContainerAsync(source,scene,{pluginExtension:'.glb'});
   if(disposed||scene.isDisposed){imported.dispose();return false}
   container=imported;container.animationGroups.forEach(clip=>clip.stop());
   idle=container.animationGroups.find(clip=>clip.name==='Stegosaurus_Idle');
   walk=container.animationGroups.find(clip=>clip.name==='Stegosaurus_Walk');
   if(!idle||!walk)throw new Error('Missing stegosaurus idle/walk animation');
   model=new TransformNode('stegosaurus-model',scene);model.parent=root;
   container.addAllToScene();for(const node of container.rootNodes)node.parent=model;
   meshes=container.meshes.filter(mesh=>mesh.getTotalVertices()>0);
   const min=new Vector3(Infinity,Infinity,Infinity),max=new Vector3(-Infinity,-Infinity,-Infinity);
   for(const mesh of meshes){
    mesh.computeWorldMatrix(true);mesh.refreshBoundingInfo({applySkeleton:true});
    const box=mesh.getBoundingInfo().boundingBox;min.minimizeInPlace(box.minimumWorld);max.maximizeInPlace(box.maximumWorld);
   }
   const scale=9/(max.z-min.z);if(!Number.isFinite(scale)||scale<=0)throw new Error('Invalid stegosaurus geometry');
   model.scaling.setAll(scale);model.position.y=-min.y*scale;
   // Match the village's matte materials and avoid a dependency on an HDR map.
   const palette:Record<string,string>={DarkBrown:'#51452F',LightBrown:'#D5C394',Brown:'#9C8F61'};
   for(const original of [...container.materials]){
    const material=new StandardMaterial('stegosaurus-'+original.name,scene);
    material.diffuseColor=Color3.FromHexString(palette[original.name]??'#9C8F61');
    material.specularColor=Color3.Black();material.backFaceCulling=false;material.twoSidedLighting=true;
    for(const mesh of meshes)if(mesh.material===original)mesh.material=material;
    container.materials.push(material);original.dispose();
   }
   for(const mesh of meshes){mesh.isPickable=true;mesh.receiveShadows=true;mesh.metadata={cameraObstacle:true,shadowBackFaces:true}}
   // Bounds follow the skeleton (including the tail) for camera picks/culling.
   for(const mesh of meshes){mesh.computeBonesUsingShaders=true;mesh.refreshBoundingInfo({applySkeleton:true})}
   root.metadata={model:'quaternius-stegosaurus',license:'CC0-1.0'};
   loaded=true;root.setEnabled(true);animate(0,false);return true;
  }catch(error){
   container?.dispose();container=null;
   if(disposed||scene.isDisposed)return false;
   console.warn('Stegosaurus asset unavailable; using the local fallback.',error);
   const {createFallbackStegosaurus}=await import('./stegosaurus-fallback');
   if(disposed||scene.isDisposed)return false;
   fallback=createFallbackStegosaurus(scene);fallback.root.name='stegosaurus-fallback';fallback.root.parent=root;
   root.metadata={model:'procedural-fallback'};loaded=true;root.setEnabled(true);return true;
  }
 })();
 return {root,ready,animate,get loaded(){return loaded}};
}
