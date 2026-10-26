import {Scene,Color3,Color4,Vector3,HemisphericLight,DirectionalLight,CreateSphere,Mesh} from './babylon';
import {ShaderMaterial} from '@babylonjs/core/Materials/shaderMaterial';
import {ShadowGenerator} from '@babylonjs/core/Lights/Shadows/shadowGenerator';
import '@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent';
import type {AbstractMesh} from '@babylonjs/core/Meshes/abstractMesh';

// One sky draw call, no downloaded textures or post-processing passes.
// The visible sun and the light share exactly the same direction.
export function createGoldenHour(scene:Scene){
 const sunDirection=new Vector3(-.62,.30,.72).normalize();
 scene.clearColor=Color4.FromHexString('#F3CCABFF');
 scene.fogMode=Scene.FOGMODE_EXP2;scene.fogDensity=.0085;
 scene.fogColor=Color3.FromHexString('#EBC6A5');
 const fill=new HemisphericLight('golden-hour-sky',Vector3.Up(),scene);
 fill.intensity=.72;fill.diffuse=Color3.FromHexString('#D7E3FA');
 fill.groundColor=Color3.FromHexString('#92816B');fill.specular=Color3.Black();
 const sun=new DirectionalLight('golden-hour-sun',sunDirection.negate(),scene);
 sun.position=sunDirection.scale(90);sun.intensity=1.05;
 sun.diffuse=Color3.FromHexString('#FFD092');sun.specular=Color3.FromHexString('#FFE0B0');
 // Fixed world-space projection: camera movement must not move the texel grid.
 // Cover the island without spending most of the map on the surrounding sea.
 sun.shadowMinZ=1;sun.shadowMaxZ=180;sun.shadowFrustumSize=104;

 const sky=CreateSphere('golden-hour-sky-dome',{diameter:240,segments:24,sideOrientation:Mesh.BACKSIDE},scene);
 sky.infiniteDistance=true;sky.isPickable=false;sky.applyFog=false;
 sky.alwaysSelectAsActiveMesh=true;
 const material=new ShaderMaterial('golden-hour-sky-material',scene,{
  vertexSource:`precision highp float;
   attribute vec3 position;
   uniform mat4 worldViewProjection;
   varying vec3 skyDirection;
   void main(){skyDirection=position;gl_Position=worldViewProjection*vec4(position,1.0);}`,
  fragmentSource:`precision highp float;
   varying vec3 skyDirection;
   uniform vec3 sunDirection;
   uniform float nightAmount;
   float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
   float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
   void main(){
    vec3 d=normalize(skyDirection);float height=max(d.y,0.0);
    vec3 horizon=mix(vec3(.96,.77,.61),vec3(.12,.15,.25),nightAmount);
    vec3 zenith=mix(vec3(.36,.56,.76),vec3(.018,.035,.09),nightAmount);
    vec3 color=mix(horizon,zenith,pow(smoothstep(0.0,.90,height),.65));
    color=mix(mix(vec3(.79,.68,.57),vec3(.045,.075,.12),nightAmount),color,smoothstep(-.3,.04,d.y));
    float alignment=max(dot(d,sunDirection),0.0);
    color+=mix(vec3(.15,.075,.012),vec3(.012,.018,.035),nightAmount)*pow(alignment,12.0);
    color+=mix(vec3(.16,.10,.025),vec3(.035,.045,.065),nightAmount)*pow(alignment,180.0);
    // Wispy, stationary clouds in a spherical sky: no drifting during camera movement.
    vec2 p=d.xz/max(d.y+.22,.08)*3.0;
    float cloud=noise(p)*.65+noise(p*2.3)*.25+noise(p*5.1)*.10;
    float veil=smoothstep(.55,.78,cloud)*smoothstep(.06,.22,d.y)*(1.0-smoothstep(.55,.85,d.y));
    color=mix(color,mix(vec3(1.0,.86,.73),vec3(.19,.23,.34),nightAmount),veil*.55);
    vec2 stars=d.xz/max(d.y+.15,.08)*110.0;
    float star=step(.995,hash(floor(stars)))*(1.0-smoothstep(.04,.17,length(fract(stars)-.5)));
    color+=vec3(.7,.78,.92)*star*nightAmount*smoothstep(.15,.4,d.y)*(1.0-veil);
    float disk=smoothstep(.99965,.99983,alignment);
    color=mix(color,mix(vec3(1.0,.96,.78),vec3(.80,.87,1.0),nightAmount),disk);
    gl_FragColor=vec4(color,1.0);
   }`,
 },{attributes:['position'],uniforms:['worldViewProjection','sunDirection','nightAmount']});
 material.setVector3('sunDirection',sunDirection);
 material.setFloat('nightAmount',0);
 material.backFaceCulling=false;material.disableDepthWrite=true;sky.material=material;

 let nightAmount=0,targetNight=0;
 const dayFog=Color3.FromHexString('#EBC6A5'),nightFog=Color3.FromHexString('#17253E');
 const dayFill=fill.diffuse.clone(),nightFill=Color3.FromHexString('#A6BAE8');
 const dayGround=fill.groundColor.clone(),nightGround=Color3.FromHexString('#455776');
 const daySun=sun.diffuse.clone(),nightSun=Color3.FromHexString('#A4BCEB');
 function applyNight(){
  fill.intensity=.72-.40*nightAmount;sun.intensity=1.05-.91*nightAmount;
  Color3.LerpToRef(dayFog,nightFog,nightAmount,scene.fogColor);
  Color3.LerpToRef(dayFill,nightFill,nightAmount,fill.diffuse);
  Color3.LerpToRef(dayGround,nightGround,nightAmount,fill.groundColor);
  Color3.LerpToRef(daySun,nightSun,nightAmount,sun.diffuse);
  scene.clearColor.copyFromFloats(1.0-.91*nightAmount,.80-.67*nightAmount,.67-.46*nightAmount,1);
  material.setFloat('nightAmount',nightAmount);
 }
 function setNight(night:boolean,immediate=false){targetNight=night?1:0;if(immediate){nightAmount=targetNight;applyNight()}}
 function update(dt:number,reducedMotion=false){
  if(nightAmount===targetNight)return nightAmount;
  const step=reducedMotion?1:Math.max(0,Math.min(dt,.1))/6;
  nightAmount+=Math.sign(targetNight-nightAmount)*Math.min(Math.abs(targetNight-nightAmount),step);
  applyNight();return nightAmount;
 }

 function addShadows(casters:AbstractMesh[],receivers:AbstractMesh[]){
  const shadows=new ShadowGenerator(2048,sun);
  shadows.usePercentageCloserFiltering=true;shadows.filteringQuality=ShadowGenerator.QUALITY_MEDIUM;
  shadows.bias=.0004;shadows.normalBias=.02;shadows.setDarkness(.25);
  // Babylon invokes this before configuring culling for each shadow draw.
  // Closed character volumes use their far surface to avoid shadow acne on
  // their own skin. Scenery keeps normal culling, including single-sided roofs.
  shadows.customAllowRendering=subMesh=>{
   shadows.forceBackFacesOnly=subMesh.getRenderingMesh().metadata?.shadowBackFaces===true;
   return true;
  };
  for(const mesh of casters)if(mesh.metadata?.castsShadow!==false&&mesh.name!=='contact-shadow')shadows.addShadowCaster(mesh,false);
  for(const mesh of receivers)mesh.receiveShadows=true;
  return shadows;
 }
 return {sky,sun,fill,addShadows,setNight,update,get nightAmount(){return nightAmount}};
}
