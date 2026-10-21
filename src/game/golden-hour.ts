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
 sun.shadowMinZ=1;sun.shadowMaxZ=180;sun.shadowFrustumSize=145;

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
   float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
   float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
   void main(){
    vec3 d=normalize(skyDirection);float height=max(d.y,0.0);
    vec3 horizon=vec3(.96,.77,.61),zenith=vec3(.36,.56,.76);
    vec3 color=mix(horizon,zenith,pow(smoothstep(0.0,.90,height),.65));
    color=mix(vec3(.79,.68,.57),color,smoothstep(-.3,.04,d.y));
    float alignment=max(dot(d,sunDirection),0.0);
    color+=vec3(.15,.075,.012)*pow(alignment,12.0);
    color+=vec3(.16,.10,.025)*pow(alignment,180.0);
    // Wispy, stationary clouds in a spherical sky: no drifting during camera movement.
    vec2 p=d.xz/max(d.y+.22,.08)*3.0;
    float cloud=noise(p)*.65+noise(p*2.3)*.25+noise(p*5.1)*.10;
    float veil=smoothstep(.55,.78,cloud)*smoothstep(.06,.22,d.y)*(1.0-smoothstep(.55,.85,d.y));
    color=mix(color,vec3(1.0,.86,.73),veil*.55);
    float disk=smoothstep(.99965,.99983,alignment);
    color=mix(color,vec3(1.0,.96,.78),disk);
    gl_FragColor=vec4(color,1.0);
   }`,
 },{attributes:['position'],uniforms:['worldViewProjection','sunDirection']});
 material.setVector3('sunDirection',sunDirection);
 material.backFaceCulling=false;material.disableDepthWrite=true;sky.material=material;

 function addShadows(casters:AbstractMesh[],receivers:AbstractMesh[]){
  const shadows=new ShadowGenerator(1024,sun);
  shadows.usePercentageCloserFiltering=true;shadows.filteringQuality=ShadowGenerator.QUALITY_LOW;
  shadows.bias=.0004;shadows.normalBias=.035;shadows.setDarkness(.25);
  for(const mesh of casters)if(mesh.name!=='contact-shadow')shadows.addShadowCaster(mesh,false);
  for(const mesh of receivers)mesh.receiveShadows=true;
  return shadows;
 }
 return {sky,sun,fill,addShadows};
}
