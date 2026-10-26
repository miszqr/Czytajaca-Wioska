import{n as e,r as t}from"./rolldown-runtime-CNOWq4Kh.js";import{f as n,p as r}from"./runtime-COARTP6Z.js";import{Bt as ee,Ct as te,Dt as ne,Et as i,Ht as re,Jt as a,Ot as ie,St as ae,Tt as oe,Vt as se,qt as o,wt as ce,xt as le,zt as ue}from"./runtime-U-v-W3Ar.js";import{$ as s,Ct as de,Et as fe,J as pe,Nt as me,Pt as he,Q as ge,St as _e,Tt as ve,X as ye,Y as be,Z as xe,_t as Se,at as Ce,bt as we,cn as Te,ct as c,dt as l,et as u,ft as d,it as f,lt as p,mn as m,nt as h,ot as g,pn as _,q as v,rt as y,sn as b,st as x,tt as S,ut as C,vt as w,wt as T,xt as E,yt as D}from"./runtime-DCavzC8c.js";import{A as O,D as Ee,E as k,M as De,N as Oe,O as ke,P as Ae,T as je,_ as Me,a as Ne,c as Pe,d as Fe,f as Ie,g as Le,h as Re,i as ze,j as Be,k as Ve,l as He,o as Ue,r as We,s as Ge,u as Ke,v as qe}from"./runtime-DyQzXkpZ.js";var Je=t({depthBoxBlurPixelShaderWGSL:()=>M}),A,j,M;function N(){return(N=e((()=>{r(),A=`depthBoxBlurPixelShader`,j=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;uniform screenSize: vec2f;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var colorDepth: vec4f=vec4f(0.0);for (var x: i32=-OFFSET; x<=OFFSET; x++) {for (var y: i32=-OFFSET; y<=OFFSET; y++) {colorDepth+=textureSample(textureSampler,textureSamplerSampler,input.vUV+ vec2f(f32(x),f32(y))/uniforms.screenSize);}}
fragmentOutputs.color=(colorDepth/ f32((OFFSET*2+1)*(OFFSET*2+1)));}`,n.ShadersStoreWGSL[A]||(n.ShadersStoreWGSL[A]=j),M={name:A,shader:j}})))()}var Ye=t({geometryPixelShaderWGSL:()=>L}),P,F,I,L;function R(){return(R=e((()=>{r(),_(),O(),Ae(),se(),De(),Te(),ne(),o(),oe(),l(),te(),ue(),p(),x(),ke(),k(),Ce(),y(),P=`geometryPixelShader`,F=`#ifdef BUMP
varying vWorldView0: vec4f;varying vWorldView1: vec4f;varying vWorldView2: vec4f;varying vWorldView3: vec4f;varying vNormalW: vec3f;
#else
varying vNormalV: vec3f;
#endif
varying vViewPos: vec4f;
#if defined(POSITION) || defined(BUMP) || defined(IRRADIANCE)
varying vPositionW: vec3f;
#endif
#if defined(VELOCITY) || defined(VELOCITY_LINEAR)
varying vCurrentPosition: vec4f;varying vPreviousPosition: vec4f;
#endif
#ifdef NEED_UV
varying vUV: vec2f;
#endif
#ifdef BUMP
uniform vBumpInfos: vec3f;uniform vTangentSpaceParams: vec2f;
#endif
#if defined(REFLECTIVITY)
#if defined(ORMTEXTURE) || defined(SPECULARGLOSSINESSTEXTURE) || defined(REFLECTIVITYTEXTURE)
var reflectivitySamplerSampler: sampler;var reflectivitySampler: texture_2d<f32>;varying vReflectivityUV: vec2f;
#else
#ifdef METALLIC_TEXTURE
var metallicSamplerSampler: sampler;var metallicSampler: texture_2d<f32>;varying vMetallicUV: vec2f;
#endif
#ifdef ROUGHNESS_TEXTURE
var roughnessSamplerSampler: sampler;var roughnessSampler: texture_2d<f32>;varying vRoughnessUV: vec2f;
#endif
#endif
#ifdef ALBEDOTEXTURE
varying vAlbedoUV: vec2f;var albedoSamplerSampler: sampler;var albedoSampler: texture_2d<f32>;
#endif
#ifdef REFLECTIVITYCOLOR
uniform reflectivityColor: vec3f;
#endif
#ifdef ALBEDOCOLOR
uniform albedoColor: vec3f;
#endif
#ifdef METALLIC
uniform metallic: f32;
#endif
#if defined(ROUGHNESS) || defined(GLOSSINESS)
uniform glossiness: f32;
#endif
#endif
#if defined(ALPHATEST) && defined(NEED_UV)
var diffuseSamplerSampler: sampler;var diffuseSampler: texture_2d<f32>;uniform alphaCutOff: f32;
#endif
#ifdef OBJECT_ID
uniform objectId: f32;
#include<objectIdFunctions>
#endif
#ifdef MESH_BLEND_TAG
uniform meshBlendTag: i32;
#endif
#include<clipPlaneFragmentDeclaration>
#include<bumpFragmentMainFunctions>
#include<bumpFragmentFunctions>
#include<helperFunctions>
#ifdef IRRADIANCE
#include<pbrFragmentReflectionDeclaration>
#ifdef REFLECTION
#ifdef USEIRRADIANCEMAP
#include<sceneUboDeclaration>
uniform reflectionMatrix: mat4x4f;uniform vReflectionInfos: vec2f;uniform vReflectionDominantDirection: vec3f;
#include<pbrBRDFFunctions>
#include<openpbrDielectricReflectance>
#include<pbrIBLFunctions>
#include<reflectionFunction>
#include<openpbrGeometryInfo>
#include<openpbrIblFunctions>
#elif defined(USESPHERICALFROMREFLECTIONMAP)
varying vEnvironmentIrradiance: vec3f;
#endif
#ifdef IBL_SHADOW_TEXTURE
var iblShadowSampler: texture_2d<f32>;var iblShadowSamplerSampler: sampler;uniform shadowTextureSize: vec2f;
#endif
#ifdef IRRADIANCE_SCATTER_MASK
uniform vSubsurfaceWeight: f32;
#include<samplerFragmentDeclaration>(_DEFINENAME_,SUBSURFACE_WEIGHT,_VARYINGNAME_,SubsurfaceWeight,_SAMPLERNAME_,subsurfaceWeight)
uniform vSubsurfaceScatterAnisotropy: f32;uniform vTransmissionWeight: f32;
#include<samplerFragmentDeclaration>(_DEFINENAME_,TRANSMISSION_WEIGHT,_VARYINGNAME_,TransmissionWeight,_SAMPLERNAME_,transmissionWeight)
uniform vTransmissionScatterAnisotropy: f32;
#endif
#endif
#endif
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#include<clipPlaneFragment>
#ifdef ALPHATEST
if (textureSample(diffuseSampler,diffuseSamplerSampler,input.vUV).a<uniforms.alphaCutOff) {discard;}
#endif
var normalOutput: vec3f;
#ifdef BUMP
var normalW: vec3f=normalize(input.vNormalW);
#include<bumpFragment>
#ifdef NORMAL_WORLDSPACE
normalOutput=normalW;
#else
normalOutput=normalize( (mat4x4f(input.vWorldView0,input.vWorldView1,input.vWorldView2,input.vWorldView3)* vec4f(normalW,0.0)).xyz);
#endif
#elif defined(HAS_NORMAL_ATTRIBUTE)
normalOutput=normalize(input.vNormalV);
#elif defined(POSITION)
normalOutput=normalize(-cross(dpdx(input.vPositionW),dpdy(input.vPositionW)));
#endif
#ifdef ENCODE_NORMAL
normalOutput=normalOutput*0.5+0.5;
#endif
var fragData: array<vec4<f32>,SCENE_MRT_COUNT>;
#ifdef DEPTH
fragData[DEPTH_INDEX]=vec4f(input.vViewPos.z/input.vViewPos.w,0.0,0.0,1.0);
#endif
#ifdef NORMAL
fragData[NORMAL_INDEX]=vec4f(normalOutput,1.0);
#endif
#ifdef SCREENSPACE_DEPTH
fragData[SCREENSPACE_DEPTH_INDEX]=vec4f(fragmentInputs.position.z,0.0,0.0,1.0);
#endif
#ifdef POSITION
fragData[POSITION_INDEX]= vec4f(input.vPositionW,1.0);
#endif
#ifdef OBJECT_ID
fragData[OBJECT_ID_INDEX]=encodeObjectId(uniforms.objectId);
#endif
#ifdef VELOCITY
var a: vec2f=(input.vCurrentPosition.xy/input.vCurrentPosition.w)*0.5+0.5;var b: vec2f=(input.vPreviousPosition.xy/input.vPreviousPosition.w)*0.5+0.5;var velocity: vec2f=abs(a-b);velocity= vec2f(pow(velocity.x,1.0/3.0),pow(velocity.y,1.0/3.0))*sign(a-b)*0.5+0.5;fragData[VELOCITY_INDEX]= vec4f(velocity,0.0,1.0);
#endif
#ifdef VELOCITY_LINEAR
var velocity : vec2f=vec2f(0.5)*((input.vPreviousPosition.xy /
input.vPreviousPosition.w) -
(input.vCurrentPosition.xy /
input.vCurrentPosition.w));fragData[VELOCITY_LINEAR_INDEX]=vec4f(velocity,0.0,1.0);
#endif
#ifdef REFLECTIVITY
var reflectivity: vec4f= vec4f(0.0,0.0,0.0,1.0);
#ifdef METALLICWORKFLOW
var metal: f32=1.0;var roughness: f32=1.0;
#ifdef ORMTEXTURE
metal*=textureSample(reflectivitySampler,reflectivitySamplerSampler,input.vReflectivityUV).b;roughness*=textureSample(reflectivitySampler,reflectivitySamplerSampler,input.vReflectivityUV).g;
#else
#ifdef METALLIC_TEXTURE
metal*=textureSample(metallicSampler,metallicSamplerSampler,input.vMetallicUV).r;
#endif
#ifdef ROUGHNESS_TEXTURE
roughness*=textureSample(roughnessSampler,roughnessSamplerSampler,input.vRoughnessUV).r;
#endif
#endif
#ifdef METALLIC
metal*=uniforms.metallic;
#endif
#ifdef ROUGHNESS
roughness*=(1.0-uniforms.glossiness); 
#endif
reflectivity=vec4f(reflectivity.rgb,reflectivity.a-roughness);var color: vec3f= vec3f(1.0);
#ifdef ALBEDOTEXTURE
color=textureSample(albedoSampler,albedoSamplerSampler,input.vAlbedoUV).rgb;
#ifdef GAMMAALBEDO
color=toLinearSpaceVec4(color);
#endif
#endif
#ifdef ALBEDOCOLOR
color*=uniforms.albedoColor.xyz;
#endif
reflectivity=vec4f(mix( vec3f(0.04),color,metal),reflectivity.a);
#else
#if defined(SPECULARGLOSSINESSTEXTURE) || defined(REFLECTIVITYTEXTURE)
reflectivity=textureSample(reflectivitySampler,reflectivitySamplerSampler,input.vReflectivityUV);
#ifdef GAMMAREFLECTIVITYTEXTURE
reflectivity=vec4f(toLinearSpaceVec3(reflectivity.rgb),reflectivity.a);
#endif
#else 
#ifdef REFLECTIVITYCOLOR
reflectivity=vec4f(toLinearSpaceVec3(uniforms.reflectivityColor.xyz),1.0);
#endif
#endif
#ifdef GLOSSINESSS
reflectivity=vec4f(reflectivity.rgb,reflectivity.a*glossiness); 
#endif
#endif
fragData[REFLECTIVITY_INDEX]=reflectivity;
#endif
#ifdef IRRADIANCE
var irradiance: vec3f=vec3f(0.0);var irradiance_alpha: f32=1.0;
#ifdef REFLECTION
#ifdef IRRADIANCE_SCATTER_MASK
#ifndef BUMP
let uvOffset: vec2f=vec2f(0.0);
#endif
var vSubsurfaceColor: vec3f=vec3f(1.0);var vSubsurfaceRadius: f32=0.0;var vSubsurfaceRadiusScale: vec3f=vec3f(1.0);
#include<openpbrSubsurfaceLayerData>(uniforms.vSubsurfaceColor,vSubsurfaceColor,uniforms.vSubsurfaceRadius,vSubsurfaceRadius,uniforms.vSubsurfaceRadiusScale,vSubsurfaceRadiusScale)
var vTransmissionDepth: f32=1.0;var vTransmissionColor: vec3f=vec3f(1.0);var vTransmissionScatter: vec3f=vec3f(0.0);var vTransmissionDispersionScale: f32=0.0;var vTransmissionDispersionAbbeNumber: f32=0.0;
#include<openpbrTransmissionLayerData>(uniforms.vTransmissionDispersionScale,vTransmissionDispersionScale,uniforms.vTransmissionDispersionAbbeNumber,vTransmissionDispersionAbbeNumber,uniforms.vTransmissionColor,vTransmissionColor,uniforms.vTransmissionDepth,vTransmissionDepth,uniforms.vTransmissionScatter\\.,vTransmissionScatter.)
#endif
#ifdef IBL_SHADOW_TEXTURE
#ifdef COLORED_IBL_SHADOWS
let iblShadowValue: vec3f=textureSample(iblShadowSampler,iblShadowSamplerSampler,fragmentInputs.position.xy/uniforms.shadowTextureSize).rgb;
#else
let iblShadowValue: vec3f=vec3f(textureSample(iblShadowSampler,iblShadowSamplerSampler,fragmentInputs.position.xy/uniforms.shadowTextureSize).r);
#endif
#endif
#if defined(USEIRRADIANCEMAP)
#ifdef IRRADIANCE_SCATTER_MASK
let bendAmount: f32=subsurface_weight*-min(subsurface_scatter_anisotropy,0.0);let mixedBendAmount: f32=mix(bendAmount,-min(transmission_scatter_anisotropy,0.0),transmission_weight);let viewVector: vec3f=normalize(scene.vEyePosition.xyz-input.vPositionW);let bentNormal: vec3f=mix(normalOutput,viewVector,mixedBendAmount*dot(normalOutput,viewVector));
#else
let bentNormal: vec3f=normalOutput;
#endif
irradiance=sampleIrradiance(
bentNormal
#if defined(NORMAL) && defined(USESPHERICALINVERTEX)
,input.vEnvironmentIrradiance
#endif
#if (defined(USESPHERICALFROMREFLECTIONMAP) && (!defined(NORMAL) || !defined(USESPHERICALINVERTEX))) || (defined(USEIRRADIANCEMAP) && defined(REFLECTIONMAP_3D))
,uniforms.reflectionMatrix
#endif
#ifdef USEIRRADIANCEMAP
,irradianceSampler
,irradianceSamplerSampler
#ifdef USE_IRRADIANCE_DOMINANT_DIRECTION
,uniforms.vReflectionDominantDirection
#endif
#endif
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#ifdef IBL_CDF_FILTERING
,icdfSampler
,icdfSamplerSampler
#endif
#endif
,uniforms.vReflectionInfos
,input.vViewPos.xyz
,1.0
,vec3f(1.0)
);
#elif defined(USESPHERICALFROMREFLECTIONMAP)
irradiance=input.vEnvironmentIrradiance;
#endif
#ifdef IBL_SHADOW_TEXTURE
irradiance*=iblShadowValue;
#endif
#ifdef IRRADIANCE_SCATTER_MASK
irradiance_alpha=min(subsurface_weight+transmission_weight,1.0);
#endif
#endif
fragData[IRRADIANCE_INDEX]=vec4f(irradiance,irradiance_alpha);
#endif
#if SCENE_MRT_COUNT>0
#if defined(MESH_BLEND_TAG) && MESH_BLEND_TAG_INDEX==0
fragmentOutputs.fragData0=vec4u(u32(uniforms.meshBlendTag),0u,0u,0u);
#else
fragmentOutputs.fragData0=fragData[0];
#endif
#endif
#if SCENE_MRT_COUNT>1
#if defined(MESH_BLEND_TAG) && MESH_BLEND_TAG_INDEX==1
fragmentOutputs.fragData1=vec4u(u32(uniforms.meshBlendTag),0u,0u,0u);
#else
fragmentOutputs.fragData1=fragData[1];
#endif
#endif
#if SCENE_MRT_COUNT>2
#if defined(MESH_BLEND_TAG) && MESH_BLEND_TAG_INDEX==2
fragmentOutputs.fragData2=vec4u(u32(uniforms.meshBlendTag),0u,0u,0u);
#else
fragmentOutputs.fragData2=fragData[2];
#endif
#endif
#if SCENE_MRT_COUNT>3
#if defined(MESH_BLEND_TAG) && MESH_BLEND_TAG_INDEX==3
fragmentOutputs.fragData3=vec4u(u32(uniforms.meshBlendTag),0u,0u,0u);
#else
fragmentOutputs.fragData3=fragData[3];
#endif
#endif
#if SCENE_MRT_COUNT>4
#if defined(MESH_BLEND_TAG) && MESH_BLEND_TAG_INDEX==4
fragmentOutputs.fragData4=vec4u(u32(uniforms.meshBlendTag),0u,0u,0u);
#else
fragmentOutputs.fragData4=fragData[4];
#endif
#endif
#if SCENE_MRT_COUNT>5
#if defined(MESH_BLEND_TAG) && MESH_BLEND_TAG_INDEX==5
fragmentOutputs.fragData5=vec4u(u32(uniforms.meshBlendTag),0u,0u,0u);
#else
fragmentOutputs.fragData5=fragData[5];
#endif
#endif
#if SCENE_MRT_COUNT>6
#if defined(MESH_BLEND_TAG) && MESH_BLEND_TAG_INDEX==6
fragmentOutputs.fragData6=vec4u(u32(uniforms.meshBlendTag),0u,0u,0u);
#else
fragmentOutputs.fragData6=fragData[6];
#endif
#endif
#if SCENE_MRT_COUNT>7
#if defined(MESH_BLEND_TAG) && MESH_BLEND_TAG_INDEX==7
fragmentOutputs.fragData7=vec4u(u32(uniforms.meshBlendTag),0u,0u,0u);
#else
fragmentOutputs.fragData7=fragData[7];
#endif
#endif
}
`,n.ShadersStoreWGSL[P]||(n.ShadersStoreWGSL[P]=F),I=[m,Ve,Oe,re,Be,b,ie,a,i,d,ce,ee,C,c,Ee,je,g,f];for(let e of I)n.IncludesShadersStoreWGSL[e.name]||(n.IncludesShadersStoreWGSL[e.name]=e.shader);L={name:P,shader:F}})))()}var Xe=t({geometryVertexShaderWGSL:()=>H}),z,B,V,H;function U(){return(U=e((()=>{r(),qe(),Le(),ve(),de(),me(),o(),Ie(),h(),E(),D(),Se(),Ke(),Pe(),ze(),Ue(),z=`geometryVertexShader`,B=`#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<instancesDeclaration>
#include<sceneUboDeclaration>
#include<clipPlaneVertexDeclaration>
#ifdef IRRADIANCE
#ifdef REFLECTION
uniform reflectionMatrix: mat4x4f;uniform vReflectionInfos: vec2f;uniform vReflectionColor: vec3f;
#ifdef USESPHERICALFROMREFLECTIONMAP
varying vEnvironmentIrradiance: vec3f;
#ifdef SPHERICAL_HARMONICS
uniform vSphericalL00: vec3f;uniform vSphericalL1_1: vec3f;uniform vSphericalL10: vec3f;uniform vSphericalL11: vec3f;uniform vSphericalL2_2: vec3f;uniform vSphericalL2_1: vec3f;uniform vSphericalL20: vec3f;uniform vSphericalL21: vec3f;uniform vSphericalL22: vec3f;
#else
uniform vSphericalX: vec3f;uniform vSphericalY: vec3f;uniform vSphericalZ: vec3f;uniform vSphericalXX_ZZ: vec3f;uniform vSphericalYY_ZZ: vec3f;uniform vSphericalZZ: vec3f;uniform vSphericalXY: vec3f;uniform vSphericalYZ: vec3f;uniform vSphericalZX: vec3f;
#endif
#include<harmonicsFunctions>
#endif
#endif
#endif
attribute position : vec3<f32>;
#ifdef HAS_NORMAL_ATTRIBUTE
attribute normal: vec3f;
#endif
#ifdef NEED_UV
varying vUV: vec2f;
#ifdef ALPHATEST
uniform diffuseMatrix: mat4x4f;
#endif
#ifdef BUMP
uniform bumpMatrix: mat4x4f;varying vBumpUV: vec2f;
#endif
#ifdef REFLECTIVITY
uniform reflectivityMatrix: mat4x4f;uniform albedoMatrix: mat4x4f;varying vReflectivityUV: vec2f;varying vAlbedoUV: vec2f;
#endif
#ifdef METALLIC_TEXTURE
varying vMetallicUV: vec2f;uniform metallicMatrix: mat4x4f;
#endif
#ifdef ROUGHNESS_TEXTURE
varying vRoughnessUV: vec2f;uniform roughnessMatrix: mat4x4f;
#endif
#ifdef SUBSURFACE_WEIGHT
varying vSubsurfaceWeightUV: vec2f;uniform subsurfaceWeightMatrix: mat4x4f;
#endif
#ifdef TRANSMISSION_WEIGHT
varying vTransmissionWeightUV: vec2f;uniform transmissionWeightMatrix: mat4x4f;
#endif
#ifdef UV1
attribute uv: vec2f;
#endif
#ifdef UV2
attribute uv2: vec2f;
#endif
#endif
#ifdef BUMP
varying vWorldView0: vec4f;varying vWorldView1: vec4f;varying vWorldView2: vec4f;varying vWorldView3: vec4f;
#endif
#ifdef BUMP
varying vNormalW: vec3f;
#else
varying vNormalV: vec3f;
#endif
varying vViewPos: vec4f;
#if defined(POSITION) || defined(BUMP) || defined(IRRADIANCE)
varying vPositionW: vec3f;
#endif
#if defined(VELOCITY) || defined(VELOCITY_LINEAR)
uniform previousViewProjection: mat4x4f;varying vCurrentPosition: vec4f;varying vPreviousPosition: vec4f;
#endif
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {var positionUpdated: vec3f=vertexInputs.position;
#ifdef HAS_NORMAL_ATTRIBUTE
var normalUpdated: vec3f=vertexInputs.normal;
#else
var normalUpdated: vec3f=vec3f(0.0,0.0,0.0);
#endif
#ifdef UV1
var uvUpdated: vec2f=vertexInputs.uv;
#endif
#ifdef UV2
var uv2Updated: vec2f=vertexInputs.uv2;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#if (defined(VELOCITY) || defined(VELOCITY_LINEAR)) && !defined(BONES_VELOCITY_ENABLED)
vCurrentPosition=scene.viewProjection*finalWorld*vec4f(positionUpdated,1.0);vPreviousPosition=uniforms.previousViewProjection*finalPreviousWorld* vec4f(positionUpdated,1.0);
#endif
#include<bonesVertex>
#include<bakedVertexAnimation>
var worldPos: vec4f= vec4f(finalWorld* vec4f(positionUpdated,1.0));
#ifdef BUMP
let vWorldView=scene.view*finalWorld;vertexOutputs.vWorldView0=vWorldView[0];vertexOutputs.vWorldView1=vWorldView[1];vertexOutputs.vWorldView2=vWorldView[2];vertexOutputs.vWorldView3=vWorldView[3];let normalWorld: mat3x3f= mat3x3f(finalWorld[0].xyz,finalWorld[1].xyz,finalWorld[2].xyz);vertexOutputs.vNormalW=normalize(normalWorld*normalUpdated);
#else
#ifdef NORMAL_WORLDSPACE
vertexOutputs.vNormalV=normalize((finalWorld* vec4f(normalUpdated,0.0)).xyz);
#else
vertexOutputs.vNormalV=normalize(((scene.view*finalWorld)* vec4f(normalUpdated,0.0)).xyz);
#endif
#endif
vertexOutputs.vViewPos=scene.view*worldPos;
#if (defined(VELOCITY) || defined(VELOCITY_LINEAR)) && defined(BONES_VELOCITY_ENABLED)
vertexOutputs.vCurrentPosition=scene.viewProjection*finalWorld* vec4f(positionUpdated,1.0);
#if NUM_BONE_INFLUENCERS>0
var previousInfluence: mat4x4f;previousInfluence=uniforms.mPreviousBones[ i32(vertexInputs.matricesIndices[0])]*vertexInputs.matricesWeights[0];
#if NUM_BONE_INFLUENCERS>1
previousInfluence+=uniforms.mPreviousBones[ i32(vertexInputs.matricesIndices[1])]*vertexInputs.matricesWeights[1];
#endif
#if NUM_BONE_INFLUENCERS>2
previousInfluence+=uniforms.mPreviousBones[ i32(vertexInputs.matricesIndices[2])]*vertexInputs.matricesWeights[2];
#endif
#if NUM_BONE_INFLUENCERS>3
previousInfluence+=uniforms.mPreviousBones[ i32(vertexInputs.matricesIndices[3])]*vertexInputs.matricesWeights[3];
#endif
#if NUM_BONE_INFLUENCERS>4
previousInfluence+=uniforms.mPreviousBones[ i32(vertexInputs.matricesIndicesExtra[0])]*vertexInputs.matricesWeightsExtra[0];
#endif
#if NUM_BONE_INFLUENCERS>5
previousInfluence+=uniforms.mPreviousBones[ i32(vertexInputs.matricesIndicesExtra[1])]*vertexInputs.matricesWeightsExtra[1];
#endif
#if NUM_BONE_INFLUENCERS>6
previousInfluence+=uniforms.mPreviousBones[ i32(vertexInputs.matricesIndicesExtra[2])]*vertexInputs.matricesWeightsExtra[2];
#endif
#if NUM_BONE_INFLUENCERS>7
previousInfluence+=uniforms.mPreviousBones[ i32(vertexInputs.matricesIndicesExtra[3])]*vertexInputs.matricesWeightsExtra[3];
#endif
vertexOutputs.vPreviousPosition=uniforms.previousViewProjection*finalPreviousWorld*previousInfluence* vec4f(positionUpdated,1.0);
#else
vertexOutputs.vPreviousPosition=uniforms.previousViewProjection*finalPreviousWorld* vec4f(positionUpdated,1.0);
#endif
#endif
#if defined(POSITION) || defined(BUMP) || defined(IRRADIANCE)
vertexOutputs.vPositionW=worldPos.xyz/worldPos.w;
#endif
vertexOutputs.position=scene.viewProjection*finalWorld* vec4f(positionUpdated,1.0);
#include<clipPlaneVertex>
#ifdef NEED_UV
#ifdef UV1
#if defined(ALPHATEST) && defined(ALPHATEST_UV1)
vertexOutputs.vUV=(uniforms.diffuseMatrix* vec4f(uvUpdated,1.0,0.0)).xy;
#else
vertexOutputs.vUV=uvUpdated;
#endif
#ifdef BUMP_UV1
vertexOutputs.vBumpUV=(uniforms.bumpMatrix* vec4f(uvUpdated,1.0,0.0)).xy;
#endif
#ifdef REFLECTIVITY_UV1
vertexOutputs.vReflectivityUV=(uniforms.reflectivityMatrix* vec4f(uvUpdated,1.0,0.0)).xy;
#else
#ifdef METALLIC_UV1
vertexOutputs.vMetallicUV=(uniforms.metallicMatrix* vec4f(uvUpdated,1.0,0.0)).xy;
#endif
#ifdef ROUGHNESS_UV1
vertexOutputs.vRoughnessUV=(uniforms.roughnessMatrix* vec4f(uvUpdated,1.0,0.0)).xy;
#endif
#endif
#ifdef ALBEDO_UV1
vertexOutputs.vAlbedoUV=(uniforms.albedoMatrix* vec4f(uvUpdated,1.0,0.0)).xy;
#endif
#ifdef SUBSURFACE_WEIGHT_UV1
vertexOutputs.vSubsurfaceWeightUV=(uniforms.subsurfaceWeightMatrix* vec4f(uvUpdated,1.0,0.0)).xy;
#endif
#ifdef TRANSMISSION_WEIGHT_UV1
vertexOutputs.vTransmissionWeightUV=(uniforms.transmissionWeightMatrix* vec4f(uvUpdated,1.0,0.0)).xy;
#endif
#endif
#ifdef UV2
#if defined(ALPHATEST) && defined(ALPHATEST_UV2)
vertexOutputs.vUV=(uniforms.diffuseMatrix* vec4f(uv2Updated,1.0,0.0)).xy;
#else
vertexOutputs.vUV=uv2Updated;
#endif
#ifdef BUMP_UV2
vertexOutputs.vBumpUV=(uniforms.bumpMatrix* vec4f(uv2Updated,1.0,0.0)).xy;
#endif
#ifdef REFLECTIVITY_UV2
vertexOutputs.vReflectivityUV=(uniforms.reflectivityMatrix* vec4f(uv2Updated,1.0,0.0)).xy;
#else
#ifdef METALLIC_UV2
vertexOutputs.vMetallicUV=(uniforms.metallicMatrix* vec4f(uv2Updated,1.0,0.0)).xy;
#endif
#ifdef ROUGHNESS_UV2
vertexOutputs.vRoughnessUV=(uniforms.roughnessMatrix* vec4f(uv2Updated,1.0,0.0)).xy;
#endif
#endif
#ifdef ALBEDO_UV2
vertexOutputs.vAlbedoUV=(uniforms.albedoMatrix* vec4f(uv2Updated,1.0,0.0)).xy;
#endif
#ifdef SUBSURFACE_WEIGHT_UV2
vertexOutputs.vSubsurfaceWeightUV=(uniforms.subsurfaceWeightMatrix* vec4f(uv2Updated,1.0,0.0)).xy;
#endif
#ifdef TRANSMISSION_WEIGHT_UV2
vertexOutputs.vTransmissionWeightUV=(uniforms.transmissionWeightMatrix* vec4f(uv2Updated,1.0,0.0)).xy;
#endif
#endif
#endif
#include<bumpVertex>
#ifdef IRRADIANCE
#ifdef REFLECTION
#ifdef USESPHERICALFROMREFLECTIONMAP
var reflectionVector: vec3f=(uniforms.reflectionMatrix*vec4f(normalUpdated,0.0)).xyz;
#ifdef REFLECTIONMAP_OPPOSITEZ
reflectionVector.z*=-1.0f;
#endif
vertexOutputs.vEnvironmentIrradiance=computeEnvironmentIrradiance(reflectionVector)*uniforms.vReflectionInfos.x;
#endif
#endif
#endif
}
`,n.ShadersStoreWGSL[z]||(n.ShadersStoreWGSL[z]=B),V=[Me,Re,fe,T,he,a,Fe,S,_e,we,w,He,Ge,We,Ne];for(let e of V)n.IncludesShadersStoreWGSL[e.name]||(n.IncludesShadersStoreWGSL[e.name]=e.shader);H={name:z,shader:B}})))()}var Ze=t({kernelBlurPixelShaderWGSL:()=>q}),W,G,K,q;function J(){return(J=e((()=>{r(),s(),le(),xe(),be(),W=`kernelBlurPixelShader`,G=`var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;uniform delta: vec2f;varying sampleCenter: vec2f;
#ifdef DOF
var circleOfConfusionSamplerSampler: sampler;var circleOfConfusionSampler: texture_2d<f32>;fn sampleCoC(offset: vec2f)->f32 {var coc: f32=textureSample(circleOfConfusionSampler,circleOfConfusionSamplerSampler,offset).r;return coc; }
#endif
#include<kernelBlurVaryingDeclaration>[0..varyingCount]
#ifdef PACKEDFLOAT
#include<packingFunctions>
#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var computedWeight: f32=0.0;
#ifdef PACKEDFLOAT
var blend: f32=0.;
#else
var blend: vec4f= vec4f(0.);
#endif
#ifdef DOF
var sumOfWeights: f32=CENTER_WEIGHT; 
var factor: f32=0.0;
#ifdef PACKEDFLOAT
blend+=unpack(textureSample(textureSampler,textureSamplerSampler,input.sampleCenter))*CENTER_WEIGHT;
#else
blend+=textureSample(textureSampler,textureSamplerSampler,input.sampleCenter)*CENTER_WEIGHT;
#endif
#endif
#include<kernelBlurFragment>[0..varyingCount]
#include<kernelBlurFragment2>[0..depCount]
#ifdef PACKEDFLOAT
fragmentOutputs.color=pack(blend);
#else
fragmentOutputs.color=blend;
#endif
#ifdef DOF
fragmentOutputs.color/=sumOfWeights;
#endif
}`,n.ShadersStoreWGSL[W]||(n.ShadersStoreWGSL[W]=G),K=[u,ae,ge,ye];for(let e of K)n.IncludesShadersStoreWGSL[e.name]||(n.IncludesShadersStoreWGSL[e.name]=e.shader);q={name:W,shader:G}})))()}var Qe=t({kernelBlurVertexShaderWGSL:()=>Q}),Y,X,Z,Q;function $(){return($=e((()=>{r(),s(),v(),Y=`kernelBlurVertexShader`,X=`attribute position: vec2f;uniform delta: vec2f;varying sampleCenter: vec2f;
#include<kernelBlurVaryingDeclaration>[0..varyingCount]
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {const madd: vec2f= vec2f(0.5,0.5);
#define CUSTOM_VERTEX_MAIN_BEGIN
vertexOutputs.sampleCenter=(vertexInputs.position*madd+madd);
#include<kernelBlurVertex>[0..varyingCount]
vertexOutputs.position= vec4f(vertexInputs.position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`,n.ShadersStoreWGSL[Y]||(n.ShadersStoreWGSL[Y]=X),Z=[u,pe];for(let e of Z)n.IncludesShadersStoreWGSL[e.name]||(n.IncludesShadersStoreWGSL[e.name]=e.shader);Q={name:Y,shader:X}})))()}export{Xe as a,R as c,Ze as i,Je as l,Qe as n,U as o,J as r,Ye as s,$ as t,N as u};