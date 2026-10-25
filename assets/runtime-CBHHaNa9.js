import{n as e,r as t}from"./rolldown-runtime-B0fFmPBj.js";import{f as n,p as r}from"./runtime-80dgCbxm.js";import{$t as ee,Bt as te,Ft as ne,It as re,Lt as ie,Mt as ae,Nt as oe,Pt as se,Rt as ce,cn as i,en as le,jt as ue,nn as de,sn as a,tn as fe,zt as pe}from"./runtime-DvXRDN6u.js";import{A as me,F as he,I as ge,L as _e,M as ve,N as ye,P as be,R as xe,_ as Se,a as Ce,c as we,d as Te,f as Ee,g as De,h as o,i as s,j as c,k as l,l as u,o as d,r as f,s as p,u as m,v as h}from"./runtime-CC94dKUK.js";import{A as g,D as _,F as v,I as y,M as b,N as x,O as S,P as C,S as w,U as T,W as E,_ as Oe,b as ke,c as Ae,d as je,f as Me,g as D,gt as Ne,h as Pe,ht as Fe,j as Ie,k as Le,l as Re,m as O,p as k,s as ze,u as Be,v as Ve,x as He,y as Ue}from"./runtime-2ouihl8y.js";import{$ as We,J as Ge,Q as Ke,X as qe,Y as Je,Z as Ye,ct as Xe,et as Ze,nt as Qe,q as $e,st as et,tt}from"./runtime-Du6tFp7F.js";var nt=t({depthBoxBlurPixelShader:()=>M}),A,j,M;function N(){return(N=e((()=>{r(),A=`depthBoxBlurPixelShader`,j=`varying vec2 vUV;uniform sampler2D textureSampler;uniform vec2 screenSize;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{vec4 colorDepth=vec4(0.0);for (int x=-OFFSET; x<=OFFSET; x++)
for (int y=-OFFSET; y<=OFFSET; y++)
colorDepth+=texture2D(textureSampler,vUV+vec2(x,y)/screenSize);gl_FragColor=(colorDepth/float((OFFSET*2+1)*(OFFSET*2+1)));}`,n.ShadersStore[A]||(n.ShadersStore[A]=j),M={name:A,shader:j}})))()}var rt=t({geometryPixelShader:()=>L}),P,F,I,L;function R(){return(R=e((()=>{r(),et(),be(),He(),xe(),fe(),ge(),Ne(),pe(),ie(),a(),ne(),tt(),oe(),ee(),We(),Ye(),ve(),me(),Je(),$e(),P=`geometryPixelShader`,F=`#extension GL_EXT_draw_buffers : require
#if defined(BUMP) || !defined(NORMAL)
#extension GL_OES_standard_derivatives : enable
#endif
precision highp float;
#ifdef BUMP
varying mat4 vWorldView;varying vec3 vNormalW;
#else
varying vec3 vNormalV;
#endif
varying vec4 vViewPos;
#if defined(POSITION) || defined(BUMP) || defined(IRRADIANCE)
varying vec3 vPositionW;
#endif
#if defined(VELOCITY) || defined(VELOCITY_LINEAR)
varying vec4 vCurrentPosition;varying vec4 vPreviousPosition;
#endif
#ifdef NEED_UV
varying vec2 vUV;
#endif
#ifdef BUMP
uniform vec3 vBumpInfos;uniform vec2 vTangentSpaceParams;
#endif
#if defined(REFLECTIVITY)
#if defined(ORMTEXTURE) || defined(SPECULARGLOSSINESSTEXTURE) || defined(REFLECTIVITYTEXTURE)
uniform sampler2D reflectivitySampler;varying vec2 vReflectivityUV;
#else
#ifdef METALLIC_TEXTURE
uniform sampler2D metallicSampler;varying vec2 vMetallicUV;
#endif
#ifdef ROUGHNESS_TEXTURE
uniform sampler2D roughnessSampler;varying vec2 vRoughnessUV;
#endif
#endif
#ifdef ALBEDOTEXTURE
varying vec2 vAlbedoUV;uniform sampler2D albedoSampler;
#endif
#ifdef REFLECTIVITYCOLOR
uniform vec3 reflectivityColor;
#endif
#ifdef ALBEDOCOLOR
uniform vec3 albedoColor;
#endif
#ifdef METALLIC
uniform float metallic;
#endif
#if defined(ROUGHNESS) || defined(GLOSSINESS)
uniform float glossiness;
#endif
#endif
#if defined(ALPHATEST) && defined(NEED_UV)
uniform sampler2D diffuseSampler;uniform float alphaCutOff;
#endif
#ifdef OBJECT_ID
uniform float objectId;
#include<objectIdFunctions>
#endif
#ifdef MESH_BLEND_TAG
uniform int meshBlendTag;
#endif
#include<clipPlaneFragmentDeclaration>
#include<mrtFragmentDeclaration>[SCENE_MRT_COUNT]
#include<bumpFragmentMainFunctions>
#include<bumpFragmentFunctions>
#include<helperFunctions>
#ifdef IRRADIANCE
#include<pbrFragmentReflectionDeclaration>
#ifdef REFLECTION
#ifdef USEIRRADIANCEMAP
#include<__decl__sceneFragment>
uniform mat4 reflectionMatrix;uniform vec2 vReflectionInfos;uniform vec3 vReflectionDominantDirection;
#include<pbrBRDFFunctions>
#include<openpbrDielectricReflectance>
#include<pbrIBLFunctions>
#include<reflectionFunction>
#include<openpbrGeometryInfo>
#include<openpbrIblFunctions>
#elif defined(USESPHERICALFROMREFLECTIONMAP)
varying vec3 vEnvironmentIrradiance;
#endif
#ifdef IBL_SHADOW_TEXTURE
uniform sampler2D iblShadowSampler;uniform vec2 shadowTextureSize;
#endif
#ifdef IRRADIANCE_SCATTER_MASK
uniform float vSubsurfaceWeight;
#include<samplerFragmentDeclaration>(_DEFINENAME_,SUBSURFACE_WEIGHT,_VARYINGNAME_,SubsurfaceWeight,_SAMPLERNAME_,subsurfaceWeight)
uniform float vSubsurfaceScatterAnisotropy;uniform float vTransmissionWeight;
#include<samplerFragmentDeclaration>(_DEFINENAME_,TRANSMISSION_WEIGHT,_VARYINGNAME_,TransmissionWeight,_SAMPLERNAME_,transmissionWeight)
uniform float vTransmissionScatterAnisotropy;
#endif
#endif
#endif
void main() {
#include<clipPlaneFragment>
#ifdef ALPHATEST
if (texture2D(diffuseSampler,vUV).a<alphaCutOff)
discard;
#endif
vec3 normalOutput;
#ifdef BUMP
vec3 normalW=normalize(vNormalW);
#include<bumpFragment>
#ifdef NORMAL_WORLDSPACE
normalOutput=normalW;
#else
normalOutput=normalize(vec3(vWorldView*vec4(normalW,0.0)));
#endif
#elif defined(HAS_NORMAL_ATTRIBUTE)
normalOutput=normalize(vNormalV);
#elif defined(POSITION)
normalOutput=normalize(-cross(dFdx(vPositionW),dFdy(vPositionW)));
#endif
#ifdef ENCODE_NORMAL
normalOutput=normalOutput*0.5+0.5;
#endif
#ifdef DEPTH
WRITE_GEOMETRY_FRAGMENT_OUTPUT(DEPTH_INDEX,vec4(vViewPos.z/vViewPos.w,0.0,0.0,1.0));
#endif
#ifdef NORMAL
WRITE_GEOMETRY_FRAGMENT_OUTPUT(NORMAL_INDEX,vec4(normalOutput,1.0));
#endif
#ifdef SCREENSPACE_DEPTH
WRITE_GEOMETRY_FRAGMENT_OUTPUT(SCREENSPACE_DEPTH_INDEX,vec4(gl_FragCoord.z,0.0,0.0,1.0));
#endif
#ifdef POSITION
WRITE_GEOMETRY_FRAGMENT_OUTPUT(POSITION_INDEX,vec4(vPositionW,1.0));
#endif
#ifdef OBJECT_ID
WRITE_GEOMETRY_FRAGMENT_OUTPUT(OBJECT_ID_INDEX,encodeObjectId(objectId));
#endif
#ifdef MESH_BLEND_TAG
meshBlendTagOutput=uvec4(uint(meshBlendTag),0u,0u,0u);
#endif
#ifdef VELOCITY
vec2 a=(vCurrentPosition.xy/vCurrentPosition.w)*0.5+0.5;vec2 b=(vPreviousPosition.xy/vPreviousPosition.w)*0.5+0.5;vec2 velocity=abs(a-b);velocity=vec2(pow(velocity.x,1.0/3.0),pow(velocity.y,1.0/3.0))*sign(a-b)*0.5+0.5;WRITE_GEOMETRY_FRAGMENT_OUTPUT(VELOCITY_INDEX,vec4(velocity,0.0,1.0));
#endif
#ifdef VELOCITY_LINEAR
vec2 velocity=vec2(0.5)*((vPreviousPosition.xy/vPreviousPosition.w) -
(vCurrentPosition.xy/vCurrentPosition.w));WRITE_GEOMETRY_FRAGMENT_OUTPUT(VELOCITY_LINEAR_INDEX,vec4(velocity,0.0,1.0));
#endif
#ifdef REFLECTIVITY
vec4 reflectivity=vec4(0.0,0.0,0.0,1.0);
#ifdef METALLICWORKFLOW
float metal=1.0;float roughness=1.0;
#ifdef ORMTEXTURE
metal*=texture2D(reflectivitySampler,vReflectivityUV).b;roughness*=texture2D(reflectivitySampler,vReflectivityUV).g;
#else
#ifdef METALLIC_TEXTURE
metal*=texture2D(metallicSampler,vMetallicUV).r;
#endif
#ifdef ROUGHNESS_TEXTURE
roughness*=texture2D(roughnessSampler,vRoughnessUV).r;
#endif
#endif
#ifdef METALLIC
metal*=metallic;
#endif
#ifdef ROUGHNESS
roughness*=(1.0-glossiness); 
#endif
reflectivity.a-=roughness;vec3 color=vec3(1.0);
#ifdef ALBEDOTEXTURE
color=texture2D(albedoSampler,vAlbedoUV).rgb;
#ifdef GAMMAALBEDO
color=toLinearSpace(color);
#endif
#endif
#ifdef ALBEDOCOLOR
color*=albedoColor.xyz;
#endif
reflectivity.rgb=mix(vec3(0.04),color,metal);
#else
#if defined(SPECULARGLOSSINESSTEXTURE) || defined(REFLECTIVITYTEXTURE)
reflectivity=texture2D(reflectivitySampler,vReflectivityUV);
#ifdef GAMMAREFLECTIVITYTEXTURE
reflectivity.rgb=toLinearSpace(reflectivity.rgb);
#endif
#else 
#ifdef REFLECTIVITYCOLOR
reflectivity.rgb=toLinearSpace(reflectivityColor.xyz);reflectivity.a=1.0;
#endif
#endif
#ifdef GLOSSINESSS
reflectivity.a*=glossiness; 
#endif
#endif
WRITE_GEOMETRY_FRAGMENT_OUTPUT(REFLECTIVITY_INDEX,reflectivity);
#endif
#ifdef IRRADIANCE
vec3 irradiance=vec3(0.0);float irradiance_alpha=1.0;
#ifdef REFLECTION
#ifdef IRRADIANCE_SCATTER_MASK
#ifndef BUMP
vec2 uvOffset=vec2(0.0);
#endif
vec3 vSubsurfaceColor=vec3(1.0);float vSubsurfaceRadius=0.0;vec3 vSubsurfaceRadiusScale=vec3(1.0);
#include<openpbrSubsurfaceLayerData>
float vTransmissionDepth=1.0;vec3 vTransmissionColor=vec3(1.0);vec3 vTransmissionScatter=vec3(0.0);float vTransmissionDispersionScale=0.0;float vTransmissionDispersionAbbeNumber=0.0;
#include<openpbrTransmissionLayerData>
#endif
#ifdef IBL_SHADOW_TEXTURE
#ifdef COLORED_IBL_SHADOWS
vec3 iblShadowValue=texture(iblShadowSampler,gl_FragCoord.xy/shadowTextureSize).rgb;
#else
vec3 iblShadowValue=vec3(texture(iblShadowSampler,gl_FragCoord.xy/shadowTextureSize).r);
#endif
#endif
#if defined(USEIRRADIANCEMAP)
#ifdef IRRADIANCE_SCATTER_MASK
float bendAmount=subsurface_weight*-min(subsurface_scatter_anisotropy,0.0);bendAmount=mix(bendAmount,-min(transmission_scatter_anisotropy,0.0),transmission_weight);vec3 viewVector=normalize(vEyePosition.xyz-vPositionW.xyz);vec3 bentNormal=mix(normalOutput,viewVector,bendAmount*dot(normalOutput,viewVector));
#else
vec3 bentNormal=normalOutput;
#endif
irradiance=sampleIrradiance(
bentNormal
#if defined(NORMAL) && defined(USESPHERICALINVERTEX)
,vEnvironmentIrradiance
#endif
#if (defined(USESPHERICALFROMREFLECTIONMAP) && (!defined(NORMAL) || !defined(USESPHERICALINVERTEX))) || (defined(USEIRRADIANCEMAP) && defined(REFLECTIONMAP_3D))
,reflectionMatrix
#endif
#ifdef USEIRRADIANCEMAP
,irradianceSampler
#ifdef USE_IRRADIANCE_DOMINANT_DIRECTION
,vReflectionDominantDirection
#endif
#endif
#ifdef REALTIME_FILTERING
,vReflectionFilteringInfo
#ifdef IBL_CDF_FILTERING
,icdfSampler
#endif
#endif
,vReflectionInfos
,vViewPos.xyz
,1.0
,vec3(1.0)
);
#elif defined(USESPHERICALFROMREFLECTIONMAP)
irradiance=vEnvironmentIrradiance;
#endif
#ifdef IBL_SHADOW_TEXTURE
irradiance*=iblShadowValue;
#endif
#ifdef IRRADIANCE_SCATTER_MASK
irradiance_alpha=min(subsurface_weight+transmission_weight,1.0);
#endif
#endif
WRITE_GEOMETRY_FRAGMENT_OUTPUT(IRRADIANCE_INDEX,vec4(irradiance,irradiance_alpha));
#endif
}
`,n.ShadersStore[P]||(n.ShadersStore[P]=F),I=[Xe,ye,w,_e,de,he,Fe,te,ce,i,re,Qe,se,le,Ze,Ke,c,l,qe,Ge];for(let e of I)n.IncludesShadersStore[e.name]||(n.IncludesShadersStore[e.name]=e.shader);L={name:P,shader:F}})))()}var it=t({geometryVertexShader:()=>H}),z,B,V,H;function U(){return(U=e((()=>{r(),h(),De(),v(),x(),T(),ke(),a(),Ve(),Ee(),D(),Ie(),Le(),_(),m(),we(),s(),d(),z=`geometryVertexShader`,B=`precision highp float;
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<instancesDeclaration>
#include<__decl__geometryVertex>
#include<clipPlaneVertexDeclaration>
#ifdef IRRADIANCE
#ifdef REFLECTION
uniform mat4 reflectionMatrix;uniform vec2 vReflectionInfos;uniform vec3 vReflectionColor;
#ifdef USESPHERICALFROMREFLECTIONMAP
varying vec3 vEnvironmentIrradiance;
#ifdef SPHERICAL_HARMONICS
uniform vec3 vSphericalL00;uniform vec3 vSphericalL1_1;uniform vec3 vSphericalL10;uniform vec3 vSphericalL11;uniform vec3 vSphericalL2_2;uniform vec3 vSphericalL2_1;uniform vec3 vSphericalL20;uniform vec3 vSphericalL21;uniform vec3 vSphericalL22;
#else
uniform vec3 vSphericalX;uniform vec3 vSphericalY;uniform vec3 vSphericalZ;uniform vec3 vSphericalXX_ZZ;uniform vec3 vSphericalYY_ZZ;uniform vec3 vSphericalZZ;uniform vec3 vSphericalXY;uniform vec3 vSphericalYZ;uniform vec3 vSphericalZX;
#endif
#include<harmonicsFunctions>
#endif
#endif
#endif
attribute vec3 position;
#ifdef HAS_NORMAL_ATTRIBUTE
attribute vec3 normal;
#endif
#ifdef NEED_UV
varying vec2 vUV;
#ifdef ALPHATEST
uniform mat4 diffuseMatrix;
#endif
#ifdef BUMP
uniform mat4 bumpMatrix;varying vec2 vBumpUV;
#endif
#ifdef REFLECTIVITY
uniform mat4 reflectivityMatrix;uniform mat4 albedoMatrix;varying vec2 vReflectivityUV;varying vec2 vAlbedoUV;
#endif
#ifdef METALLIC_TEXTURE
varying vec2 vMetallicUV;uniform mat4 metallicMatrix;
#endif
#ifdef ROUGHNESS_TEXTURE
varying vec2 vRoughnessUV;uniform mat4 roughnessMatrix;
#endif
#ifdef SUBSURFACE_WEIGHT
varying vec2 vSubsurfaceWeightUV;uniform mat4 subsurfaceWeightMatrix;
#endif
#ifdef TRANSMISSION_WEIGHT
varying vec2 vTransmissionWeightUV;uniform mat4 transmissionWeightMatrix;
#endif
#ifdef UV1
attribute vec2 uv;
#endif
#ifdef UV2
attribute vec2 uv2;
#endif
#endif
#ifdef BUMP
varying mat4 vWorldView;
#endif
#ifdef BUMP
varying vec3 vNormalW;
#else
varying vec3 vNormalV;
#endif
varying vec4 vViewPos;
#if defined(POSITION) || defined(BUMP) || defined(IRRADIANCE)
varying vec3 vPositionW;
#endif
#if defined(VELOCITY) || defined(VELOCITY_LINEAR)
uniform mat4 previousViewProjection;varying vec4 vCurrentPosition;varying vec4 vPreviousPosition;
#endif
#define CUSTOM_VERTEX_DEFINITIONS
void main(void)
{vec3 positionUpdated=position;
#ifdef HAS_NORMAL_ATTRIBUTE
vec3 normalUpdated=normal;
#else
vec3 normalUpdated=vec3(0.0,0.0,0.0);
#endif
#ifdef UV1
vec2 uvUpdated=uv;
#endif
#ifdef UV2
vec2 uv2Updated=uv2;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#if (defined(VELOCITY) || defined(VELOCITY_LINEAR)) && !defined(BONES_VELOCITY_ENABLED)
vCurrentPosition=viewProjection*finalWorld*vec4(positionUpdated,1.0);vPreviousPosition=previousViewProjection*finalPreviousWorld*vec4(positionUpdated,1.0);
#endif
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=vec4(finalWorld*vec4(positionUpdated,1.0));
#ifdef BUMP
vWorldView=view*finalWorld;mat3 normalWorld=mat3(finalWorld);vNormalW=normalize(normalWorld*normalUpdated);
#else
#ifdef NORMAL_WORLDSPACE
vNormalV=normalize(vec3(finalWorld*vec4(normalUpdated,0.0)));
#else
vNormalV=normalize(vec3((view*finalWorld)*vec4(normalUpdated,0.0)));
#endif
#endif
vViewPos=view*worldPos;
#if (defined(VELOCITY) || defined(VELOCITY_LINEAR)) && defined(BONES_VELOCITY_ENABLED)
vCurrentPosition=viewProjection*finalWorld*vec4(positionUpdated,1.0);
#if NUM_BONE_INFLUENCERS>0
mat4 previousInfluence;previousInfluence=mPreviousBones[int(matricesIndices[0])]*matricesWeights[0];
#if NUM_BONE_INFLUENCERS>1
previousInfluence+=mPreviousBones[int(matricesIndices[1])]*matricesWeights[1];
#endif
#if NUM_BONE_INFLUENCERS>2
previousInfluence+=mPreviousBones[int(matricesIndices[2])]*matricesWeights[2];
#endif
#if NUM_BONE_INFLUENCERS>3
previousInfluence+=mPreviousBones[int(matricesIndices[3])]*matricesWeights[3];
#endif
#if NUM_BONE_INFLUENCERS>4
previousInfluence+=mPreviousBones[int(matricesIndicesExtra[0])]*matricesWeightsExtra[0];
#endif
#if NUM_BONE_INFLUENCERS>5
previousInfluence+=mPreviousBones[int(matricesIndicesExtra[1])]*matricesWeightsExtra[1];
#endif
#if NUM_BONE_INFLUENCERS>6
previousInfluence+=mPreviousBones[int(matricesIndicesExtra[2])]*matricesWeightsExtra[2];
#endif
#if NUM_BONE_INFLUENCERS>7
previousInfluence+=mPreviousBones[int(matricesIndicesExtra[3])]*matricesWeightsExtra[3];
#endif
vPreviousPosition=previousViewProjection*finalPreviousWorld*previousInfluence*vec4(positionUpdated,1.0);
#else
vPreviousPosition=previousViewProjection*finalPreviousWorld*vec4(positionUpdated,1.0);
#endif
#endif
#if defined(POSITION) || defined(BUMP) || defined(IRRADIANCE)
vPositionW=worldPos.xyz/worldPos.w;
#endif
gl_Position=viewProjection*finalWorld*vec4(positionUpdated,1.0);
#include<clipPlaneVertex>
#ifdef NEED_UV
#ifdef UV1
#if defined(ALPHATEST) && defined(ALPHATEST_UV1)
vUV=vec2(diffuseMatrix*vec4(uvUpdated,1.0,0.0));
#else
vUV=uvUpdated;
#endif
#ifdef BUMP_UV1
vBumpUV=vec2(bumpMatrix*vec4(uvUpdated,1.0,0.0));
#endif
#ifdef REFLECTIVITY_UV1
vReflectivityUV=vec2(reflectivityMatrix*vec4(uvUpdated,1.0,0.0));
#else
#ifdef METALLIC_UV1
vMetallicUV=vec2(metallicMatrix*vec4(uvUpdated,1.0,0.0));
#endif
#ifdef ROUGHNESS_UV1
vRoughnessUV=vec2(roughnessMatrix*vec4(uvUpdated,1.0,0.0));
#endif
#endif
#ifdef ALBEDO_UV1
vAlbedoUV=vec2(albedoMatrix*vec4(uvUpdated,1.0,0.0));
#endif
#ifdef SUBSURFACE_COLOR_UV1
vSubsurfaceColorUV=vec2(subsurfaceColorMatrix*vec4(uvUpdated,1.0,0.0));
#endif
#ifdef SUBSURFACE_WEIGHT_UV1
vSubsurfaceWeightUV=vec2(subsurfaceWeightMatrix*vec4(uvUpdated,1.0,0.0));
#endif
#endif
#ifdef UV2
#if defined(ALPHATEST) && defined(ALPHATEST_UV2)
vUV=vec2(diffuseMatrix*vec4(uv2Updated,1.0,0.0));
#else
vUV=uv2Updated;
#endif
#ifdef BUMP_UV2
vBumpUV=vec2(bumpMatrix*vec4(uv2Updated,1.0,0.0));
#endif
#ifdef REFLECTIVITY_UV2
vReflectivityUV=vec2(reflectivityMatrix*vec4(uv2Updated,1.0,0.0));
#else
#ifdef METALLIC_UV2
vMetallicUV=vec2(metallicMatrix*vec4(uv2Updated,1.0,0.0));
#endif
#ifdef ROUGHNESS_UV2
vRoughnessUV=vec2(roughnessMatrix*vec4(uv2Updated,1.0,0.0));
#endif
#endif
#ifdef ALBEDO_UV2
vAlbedoUV=vec2(albedoMatrix*vec4(uv2Updated,1.0,0.0));
#endif
#ifdef SUBSURFACE_COLOR_UV2
vSubsurfaceColorUV=vec2(subsurfaceColorMatrix*vec4(uv2Updated,1.0,0.0));
#endif
#ifdef SUBSURFACE_WEIGHT_UV2
vSubsurfaceWeightUV=vec2(subsurfaceWeightMatrix*vec4(uv2Updated,1.0,0.0));
#endif
#endif
#endif
#include<bumpVertex>
#ifdef IRRADIANCE
#ifdef REFLECTION
#ifdef USESPHERICALFROMREFLECTIONMAP
vec3 reflectionVector=vec3(reflectionMatrix*vec4(normalUpdated,0.0)).xyz;
#ifdef REFLECTIONMAP_OPPOSITEZ
reflectionVector.z*=-1.0;
#endif
vEnvironmentIrradiance=computeEnvironmentIrradiance(reflectionVector)*vReflectionInfos.x;
#endif
#endif
#endif
}
`,n.ShadersStore[z]||(n.ShadersStore[z]=B),V=[Se,o,y,C,E,Ue,i,Oe,Te,Pe,b,g,S,u,p,f,Ce];for(let e of V)n.IncludesShadersStore[e.name]||(n.IncludesShadersStore[e.name]=e.shader);H={name:z,shader:B}})))()}var at=t({kernelBlurPixelShader:()=>q}),W,G,K,q;function J(){return(J=e((()=>{r(),k(),ue(),je(),Re(),W=`kernelBlurPixelShader`,G=`uniform sampler2D textureSampler;uniform vec2 delta;varying vec2 sampleCenter;
#ifdef DOF
uniform sampler2D circleOfConfusionSampler;float sampleCoC(in vec2 offset) {float coc=texture2D(circleOfConfusionSampler,offset).r;return coc; }
#endif
#include<kernelBlurVaryingDeclaration>[0..varyingCount]
#ifdef PACKEDFLOAT
#include<packingFunctions>
#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{float computedWeight=0.0;
#ifdef PACKEDFLOAT
float blend=0.;
#else
vec4 blend=vec4(0.);
#endif
#ifdef DOF
float sumOfWeights=CENTER_WEIGHT; 
float factor=0.0;
#ifdef PACKEDFLOAT
blend+=unpack(texture2D(textureSampler,sampleCenter))*CENTER_WEIGHT;
#else
blend+=texture2D(textureSampler,sampleCenter)*CENTER_WEIGHT;
#endif
#endif
#include<kernelBlurFragment>[0..varyingCount]
#include<kernelBlurFragment2>[0..depCount]
#ifdef PACKEDFLOAT
gl_FragColor=pack(blend);
#else
gl_FragColor=blend;
#endif
#ifdef DOF
gl_FragColor/=sumOfWeights;
#endif
}`,n.ShadersStore[W]||(n.ShadersStore[W]=G),K=[O,ae,Me,Be];for(let e of K)n.IncludesShadersStore[e.name]||(n.IncludesShadersStore[e.name]=e.shader);q={name:W,shader:G}})))()}var ot=t({kernelBlurVertexShader:()=>Q}),Y,X,Z,Q;function $(){return($=e((()=>{r(),k(),ze(),Y=`kernelBlurVertexShader`,X=`attribute vec2 position;uniform vec2 delta;varying vec2 sampleCenter;
#include<kernelBlurVaryingDeclaration>[0..varyingCount]
const vec2 madd=vec2(0.5,0.5);
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
sampleCenter=(position*madd+madd);
#include<kernelBlurVertex>[0..varyingCount]
gl_Position=vec4(position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`,n.ShadersStore[Y]||(n.ShadersStore[Y]=X),Z=[O,Ae];for(let e of Z)n.IncludesShadersStore[e.name]||(n.IncludesShadersStore[e.name]=e.shader);Q={name:Y,shader:X}})))()}export{it as a,R as c,at as i,nt as l,ot as n,U as o,J as r,rt as s,$ as t,N as u};