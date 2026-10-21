import {Scene,CreateGround,VertexBuffer,VertexData,Color3,Vector3} from './babylon';
import {ShaderMaterial} from '@babylonjs/core/Materials/shaderMaterial';
import type {Shapes} from './shapes';
import {ISLAND,shoreDistance,smoothRange,terrainHeight} from './island-terrain';

export function createIslandGround(scene:Scene,shapes:Shapes){
 const ground=CreateGround('village-ground',{width:110,height:110,subdivisions:140,updatable:true},scene);
 const positions=ground.getVerticesData(VertexBuffer.PositionKind)!,colors:number[]=[],normals:number[]=[];
 const grass=Color3.FromHexString('#8FB361'),sand=Color3.FromHexString('#E4CE9F'),wetSand=Color3.FromHexString('#BDB590');
 for(let i=0;i<positions.length;i+=3){
  const x=positions[i],z=positions[i+2],inland=shoreDistance(x,z);positions[i+1]=terrainHeight(x,z);
  // Small, deterministic color variation without moving the village's trees.
  const variation=Math.sin(x*1.7+z*.3)*Math.cos(z*1.9-x*.4),tone=.97+.025*variation;
  const sandAmount=1-smoothRange(3.8,8.5,inland+variation*.25);
  const color=Color3.Lerp(grass,sand,sandAmount);
  Color3.LerpToRef(color,wetSand,1-smoothRange(.3,1.8,inland),color);
  colors.push(color.r*tone,color.g*tone,color.b*tone,1);
 }
 VertexData.ComputeNormals(positions,ground.getIndices()!,normals);
 ground.updateVerticesData(VertexBuffer.PositionKind,positions);
 ground.updateVerticesData(VertexBuffer.NormalKind,normals);
 ground.setVerticesData(VertexBuffer.ColorKind,colors);ground.material=shapes.material('#FFFFFF');
 ground.isPickable=true;ground.metadata={cameraObstacle:true,castsShadow:false};ground.refreshBoundingInfo();
 return ground;
}

// One opaque water draw call, no reflection target or downloaded texture.
// The land occludes the sea; foam follows the same shoreline as walking.
export function createOcean(scene:Scene,sunDirection:Vector3){
 const ocean=CreateGround('island-ocean',{width:1400,height:1400,subdivisions:1},scene);
 ocean.position.y=ISLAND.seaLevel;ocean.isPickable=false;ocean.metadata={cameraObstacle:false,castsShadow:false};
 const material=new ShaderMaterial('island-ocean-material',scene,{
  vertexSource:`precision highp float;
   attribute vec3 position;
   uniform mat4 world,worldViewProjection;
   varying vec3 seaPosition;
   void main(){seaPosition=(world*vec4(position,1.0)).xyz;gl_Position=worldViewProjection*vec4(position,1.0);}`,
  fragmentSource:`precision highp float;
   varying vec3 seaPosition;
   uniform float time,fogDensity;
   uniform vec3 eyePosition,sunDirection,fogColor;
   void main(){
    vec2 p=seaPosition.xz;float angle=atan(p.y,p.x);
    float shore=${ISLAND.radius.toFixed(2)}+${ISLAND.lobes.toFixed(2)}*sin(3.0*angle)+${ISLAND.coves.toFixed(2)}*cos(5.0*angle);
    float offshore=max(0.0,length(p)-shore);
    vec3 color=mix(vec3(.40,.72,.69),vec3(.18,.43,.53),smoothstep(0.0,28.0,offshore));
    float ripple=sin(p.x*.68+p.y*.35-time*.75)+sin(p.y*.95-p.x*.26+time*.52);
    color+=vec3(.035,.055,.055)*ripple*.5;
    float crest=pow(.5+.5*sin(offshore*2.8-time*.85+sin(angle*19.0)*.32),14.0);
    float foam=crest*(1.0-smoothstep(.4,3.8,offshore))*.65;
    color=mix(color,vec3(.91,.94,.84),foam);
    vec3 normal=normalize(vec3(-.045*cos(p.x*.68+p.y*.35-time*.75),1.0,-.04*cos(p.y*.95-p.x*.26+time*.52)));
    vec3 viewDirection=normalize(eyePosition-seaPosition);
    float shine=pow(max(dot(reflect(-sunDirection,normal),viewDirection),0.0),90.0);
    color+=vec3(.65,.39,.15)*shine*.6;
    float fog=1.0-exp(-pow(length(eyePosition-seaPosition)*fogDensity,2.0));
    gl_FragColor=vec4(mix(color,fogColor,fog),1.0);
   }`,
 },{attributes:['position'],uniforms:['world','worldViewProjection','time','eyePosition','sunDirection','fogColor','fogDensity']});
 material.setFloat('time',0);material.setFloat('fogDensity',scene.fogDensity);
 material.setColor3('fogColor',scene.fogColor);material.setVector3('sunDirection',sunDirection);
 material.setVector3('eyePosition',Vector3.Zero());ocean.material=material;ocean.freezeWorldMatrix();
 const reduced=typeof window!=='undefined'?window.matchMedia?.('(prefers-reduced-motion: reduce)'):undefined;
 let time=0;
 scene.onBeforeRenderObservable.add(()=>{
  if(!reduced?.matches)time+=Math.min(.05,scene.getEngine().getDeltaTime()/1000||0);
  material.setFloat('time',time);
  if(scene.activeCamera)material.setVector3('eyePosition',scene.activeCamera.globalPosition);
 });
 return ocean;
}
