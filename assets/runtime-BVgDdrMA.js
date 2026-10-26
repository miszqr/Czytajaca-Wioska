import{n as e,r as t}from"./rolldown-runtime-CNOWq4Kh.js";import{f as n,p as r}from"./runtime-COARTP6Z.js";import{At as ee,Bt as te,Ft as i,Gt as a,Ht as ne,It as re,Jt as o,Kt as ie,Lt as ae,Mt as oe,Nt as se,Pt as ce,Rt as le,Ut as ue,Vt as de,Wt as fe,jt as pe,kt as me,qt as s,zt as he}from"./runtime-U-v-W3Ar.js";import{$t as ge,At as _e,Bt as ve,Ct as ye,Dt as c,Et as l,Ft as u,Gt as d,Ht as f,It as p,Jt as m,Kt as h,Lt as g,Mt as _,Nt as v,Ot as y,Pt as b,Qt as x,Rt as S,St as C,Tt as w,Ut as T,Vt as E,Wt as D,Xt as O,Yt as k,Zt as A,_t as j,an as M,bt as N,cn as P,dn as be,en as xe,fn as Se,gn as F,gt as Ce,hn as I,ht as we,in as Te,jt as Ee,kt as De,ln as L,mn as Oe,mt as ke,nn as Ae,on as je,pn as Me,pt as Ne,qt as R,rn as Pe,sn as z,tn as Fe,un as B,vt as Ie,wt as Le,xt as Re,yt as ze,zt as Be}from"./runtime-DCavzC8c.js";import{A as Ve,B as V,C as He,D as Ue,E as H,F as We,I as Ge,L as Ke,M as qe,N as Je,O as Ye,P as Xe,R as Ze,S as Qe,T as $e,_ as et,a as tt,b as nt,c as rt,d as it,f as at,g as ot,h as st,i as ct,j as lt,k as ut,l as dt,m as ft,o as pt,p as mt,r as ht,s as gt,u as _t,v as vt,w as yt,x as bt,y as xt,z as U}from"./runtime-DyQzXkpZ.js";import{a as St,c as Ct,d as wt,f as Tt,i as Et,l as Dt,m as Ot,o as kt,p as At,r as jt,s as Mt,u as Nt}from"./runtime-B8-_2B_e.js";var Pt=t({defaultPixelShaderWGSL:()=>q}),W,G,K,q;function J(){return(J=e((()=>{r(),s(),I(),V(),Me(),a(),be(),L(),P(),M(),Pe(),Ze(),Ge(),Fe(),ue(),de(),xe(),he(),x(),O(),At(),Xe(),qe(),Ve(),R(),h(),Ye(),H(),yt(),Qe(),nt(),T(),E(),ve(),g(),u(),W=`defaultPixelShader`,G=`#include<defaultUboDeclaration>
#include<prePassDeclaration>[SCENE_MRT_COUNT]
#include<oitDeclaration>
#define CUSTOM_FRAGMENT_BEGIN
varying vPositionW: vec3f;
#ifdef NORMAL
varying vNormalW: vec3f;
#endif
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
varying vColor: vec4f;
#endif
#if defined(CLUSTLIGHT_BATCH) && CLUSTLIGHT_BATCH>0
varying vViewDepth: f32;
#endif
#include<mainUVVaryingDeclaration>[1..7]
#include<helperFunctions>
#include<lightUboDeclaration>[0..maxSimultaneousLights]
#include<lightsFragmentFunctions>
#include<shadowsFragmentFunctions>
#include<samplerFragmentDeclaration>(_DEFINENAME_,DIFFUSE,_VARYINGNAME_,Diffuse,_SAMPLERNAME_,diffuse)
#include<samplerFragmentDeclaration>(_DEFINENAME_,AMBIENT,_VARYINGNAME_,Ambient,_SAMPLERNAME_,ambient)
#include<samplerFragmentDeclaration>(_DEFINENAME_,OPACITY,_VARYINGNAME_,Opacity,_SAMPLERNAME_,opacity)
#include<samplerFragmentDeclaration>(_DEFINENAME_,EMISSIVE,_VARYINGNAME_,Emissive,_SAMPLERNAME_,emissive)
#include<samplerFragmentDeclaration>(_DEFINENAME_,LIGHTMAP,_VARYINGNAME_,Lightmap,_SAMPLERNAME_,lightmap)
#include<samplerFragmentDeclaration>(_DEFINENAME_,DECAL,_VARYINGNAME_,Decal,_SAMPLERNAME_,decal)
#ifdef REFRACTION
#ifdef REFRACTIONMAP_3D
var refractionCubeSamplerSampler: sampler;var refractionCubeSampler: texture_cube<f32>;
#else
var refraction2DSamplerSampler: sampler;var refraction2DSampler: texture_2d<f32>;
#endif
#endif
#if defined(SPECULARTERM)
#include<samplerFragmentDeclaration>(_DEFINENAME_,SPECULAR,_VARYINGNAME_,Specular,_SAMPLERNAME_,specular)
#endif
#include<fresnelFunction>
#ifdef REFLECTION
#ifdef REFLECTIONMAP_3D
var reflectionCubeSamplerSampler: sampler;var reflectionCubeSampler: texture_cube<f32>;
#else
var reflection2DSamplerSampler: sampler;var reflection2DSampler: texture_2d<f32>;
#endif
#ifdef REFLECTIONMAP_SKYBOX
varying vPositionUVW: vec3f;
#else
#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)
varying vDirectionW: vec3f;
#endif
#endif
#include<reflectionFunction>
#endif
#include<imageProcessingDeclaration>
#include<imageProcessingFunctions>
#include<textureRepetitionFunctions>
#include<bumpFragmentMainFunctions>
#include<bumpFragmentFunctions>
#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#include<fogFragmentDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
var viewDirectionW: vec3f=normalize(scene.vEyePosition.xyz-fragmentInputs.vPositionW);var baseColor: vec4f= vec4f(1.,1.,1.,1.);var diffuseColor: vec3f=uniforms.vDiffuseColor.rgb;var alpha: f32=uniforms.vDiffuseColor.a;
#ifdef NORMAL
var normalW: vec3f=normalize(fragmentInputs.vNormalW);
#else
var normalW: vec3f=normalize(cross(dpdx(fragmentInputs.vPositionW),dpdy(fragmentInputs.vPositionW)))* scene.vEyePosition.w;
#endif
#include<bumpFragment>
#ifdef TWOSIDEDLIGHTING
normalW=select(-normalW,normalW,fragmentInputs.frontFacing);
#endif
#ifdef DIFFUSE
baseColor=TEXRD(diffuseSampler,diffuseSamplerSampler,fragmentInputs.vDiffuseUV+uvOffset);
#if defined(ALPHATEST) && !defined(ALPHATEST_AFTERALLALPHACOMPUTATIONS)
if (baseColor.a<uniforms.alphaCutOff) {discard;}
#endif
#ifdef ALPHAFROMDIFFUSE
alpha*=baseColor.a;
#endif
#define CUSTOM_FRAGMENT_UPDATE_ALPHA
baseColor=vec4f(baseColor.rgb*uniforms.vDiffuseInfos.y,baseColor.a);
#endif
#if defined(DECAL) && !defined(DECAL_AFTER_DETAIL)
var decalColor: vec4f=textureSample(decalSampler,decalSamplerSampler,fragmentInputs.vDecalUV+uvOffset);
#include<decalFragment>(surfaceAlbedo,baseColor,GAMMADECAL,_GAMMADECAL_NOTUSED_)
#endif
#ifdef DEPTHPREPASS
#include<defaultFragmentAlpha>
#endif
#define DEPTHPREPASS_SKIP_EARLY_RETURN
#include<depthPrePass>
#ifndef DEPTHPREPASS
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
baseColor=vec4f(baseColor.rgb*fragmentInputs.vColor.rgb,baseColor.a);
#endif
#ifdef DETAIL
baseColor=vec4f(baseColor.rgb*2.0*mix(0.5,detailColor.r,uniforms.vDetailInfos.y),baseColor.a);
#endif
#if defined(DECAL) && defined(DECAL_AFTER_DETAIL)
var decalColor: vec4f=textureSample(decalSampler,decalSamplerSampler,fragmentInputs.vDecalUV+uvOffset);
#include<decalFragment>(surfaceAlbedo,baseColor,GAMMADECAL,_GAMMADECAL_NOTUSED_)
#endif
#define CUSTOM_FRAGMENT_UPDATE_DIFFUSE
var baseAmbientColor: vec3f= vec3f(1.,1.,1.);
#ifdef AMBIENT
baseAmbientColor=TEXRD(ambientSampler,ambientSamplerSampler,fragmentInputs.vAmbientUV+uvOffset).rgb*uniforms.vAmbientInfos.y;
#endif
#define CUSTOM_FRAGMENT_BEFORE_LIGHTS
var glossiness: f32=uniforms.vSpecularColor.a;var specularColor: vec3f=uniforms.vSpecularColor.rgb;
#ifdef SPECULARTERM
#ifdef SPECULAR
var specularMapColor: vec4f=TEXRD(specularSampler,specularSamplerSampler,fragmentInputs.vSpecularUV+uvOffset);specularColor=specularMapColor.rgb;
#ifdef GLOSSINESS
glossiness=glossiness*specularMapColor.a;
#endif
#endif
#endif
var diffuseBase: vec3f= vec3f(0.,0.,0.);var info: lightingInfo;
#ifdef SPECULARTERM
var specularBase: vec3f= vec3f(0.,0.,0.);
#endif
var shadow: f32=1.;var aggShadow: f32=0.;var numLights: f32=0.;
#ifdef LIGHTMAP
var lightmapColor: vec4f=TEXRD(lightmapSampler,lightmapSamplerSampler,fragmentInputs.vLightmapUV+uvOffset);
#ifdef RGBDLIGHTMAP
lightmapColor=vec4f(fromRGBD(lightmapColor),lightmapColor.a);
#endif
lightmapColor=vec4f(lightmapColor.rgb*uniforms.vLightmapInfos.y,lightmapColor.a);
#endif
#include<lightFragment>[0..maxSimultaneousLights]
aggShadow=aggShadow/numLights;var refractionColor: vec4f= vec4f(0.,0.,0.,1.);
#ifdef REFRACTION
var refractionVector: vec3f=normalize(refract(-viewDirectionW,normalW,uniforms.vRefractionInfos.y));
#ifdef REFRACTIONMAP_3D
#ifdef USE_LOCAL_REFRACTIONMAP_CUBIC
refractionVector=parallaxCorrectNormal(fragmentInputs.vPositionW,refractionVector,uniforms.vRefractionSize,uniforms.vRefractionPosition);
#endif
refractionVector.y=refractionVector.y*uniforms.vRefractionInfos.w;var refractionLookup: vec4f=textureSample(refractionCubeSampler,refractionCubeSamplerSampler,refractionVector);if (dot(refractionVector,viewDirectionW)<1.0) {refractionColor=refractionLookup;}
#else
var vRefractionUVW: vec3f= (uniforms.refractionMatrix*(scene.view* vec4f(fragmentInputs.vPositionW+refractionVector*uniforms.vRefractionInfos.z,1.0))).xyz;var refractionCoords: vec2f=vRefractionUVW.xy/vRefractionUVW.z;refractionCoords.y=1.0-refractionCoords.y;refractionColor=textureSample(refraction2DSampler,refraction2DSamplerSampler,refractionCoords);
#endif
#ifdef RGBDREFRACTION
refractionColor=vec4f(fromRGBD(refractionColor),refractionColor.a);
#endif
#ifdef IS_REFRACTION_LINEAR
refractionColor=vec4f(toGammaSpaceVec3(refractionColor.rgb),refractionColor.a);
#endif
refractionColor=vec4f(refractionColor.rgb*uniforms.vRefractionInfos.x,refractionColor.a);
#endif
var reflectionColor: vec4f= vec4f(0.,0.,0.,1.);
#ifdef REFLECTION
var vReflectionUVW: vec3f=computeReflectionCoords( vec4f(fragmentInputs.vPositionW,1.0),normalW);
#ifdef REFLECTIONMAP_OPPOSITEZ
vReflectionUVW=vec3f(vReflectionUVW.x,vReflectionUVW.y,vReflectionUVW.z*-1.0);
#endif
#ifdef REFLECTIONMAP_3D
#ifdef ROUGHNESS
var bias: f32=uniforms.vReflectionInfos.y;
#ifdef SPECULARTERM
#ifdef SPECULAR
#ifdef GLOSSINESS
bias*=(1.0-specularMapColor.a);
#endif
#endif
#endif
reflectionColor=textureSampleLevel(reflectionCubeSampler,reflectionCubeSamplerSampler,vReflectionUVW,bias);
#else
reflectionColor=textureSample(reflectionCubeSampler,reflectionCubeSamplerSampler,vReflectionUVW);
#endif
#else
var coords: vec2f=vReflectionUVW.xy;
#ifdef REFLECTIONMAP_PROJECTION
coords/=vReflectionUVW.z;
#endif
coords.y=1.0-coords.y;reflectionColor=textureSample(reflection2DSampler,reflection2DSamplerSampler,coords);
#endif
#ifdef RGBDREFLECTION
reflectionColor=vec4f(fromRGBD(reflectionColor),reflectionColor.a);
#endif
#ifdef IS_REFLECTION_LINEAR
reflectionColor=vec4f(toGammaSpaceVec3(reflectionColor.rgb),reflectionColor.a);
#endif
reflectionColor=vec4f(reflectionColor.rgb*uniforms.vReflectionInfos.x,reflectionColor.a);
#ifdef REFLECTIONFRESNEL
var reflectionFresnelTerm: f32=computeFresnelTerm(viewDirectionW,normalW,uniforms.reflectionRightColor.a,uniforms.reflectionLeftColor.a);
#ifdef REFLECTIONFRESNELFROMSPECULAR
#ifdef SPECULARTERM
reflectionColor=vec4f(reflectionColor.rgb*specularColor.rgb*(1.0-reflectionFresnelTerm)+reflectionFresnelTerm*uniforms.reflectionRightColor.rgb,reflectionColor.a);
#else
reflectionColor=vec4f(reflectionColor.rgb*uniforms.reflectionLeftColor.rgb*(1.0-reflectionFresnelTerm)+reflectionFresnelTerm*uniforms.reflectionRightColor.rgb,reflectionColor.a);
#endif
#else
reflectionColor=vec4f(reflectionColor.rgb*uniforms.reflectionLeftColor.rgb*(1.0-reflectionFresnelTerm)+reflectionFresnelTerm*uniforms.reflectionRightColor.rgb,reflectionColor.a);
#endif
#endif
#endif
#ifdef REFRACTIONFRESNEL
var refractionFresnelTerm: f32=computeFresnelTerm(viewDirectionW,normalW,uniforms.refractionRightColor.a,uniforms.refractionLeftColor.a);refractionColor=vec4f(refractionColor.rgb*uniforms.refractionLeftColor.rgb*(1.0-refractionFresnelTerm)+refractionFresnelTerm*uniforms.refractionRightColor.rgb,refractionColor.a);
#endif
#include<defaultFragmentAlpha>
var emissiveColor: vec3f=uniforms.vEmissiveColor;
#ifdef EMISSIVE
emissiveColor+=TEXRD(emissiveSampler,emissiveSamplerSampler,fragmentInputs.vEmissiveUV+uvOffset).rgb*uniforms.vEmissiveInfos.y;
#endif
#ifdef EMISSIVEFRESNEL
var emissiveFresnelTerm: f32=computeFresnelTerm(viewDirectionW,normalW,uniforms.emissiveRightColor.a,uniforms.emissiveLeftColor.a);emissiveColor*=uniforms.emissiveLeftColor.rgb*(1.0-emissiveFresnelTerm)+emissiveFresnelTerm*uniforms.emissiveRightColor.rgb;
#endif
#ifdef DIFFUSEFRESNEL
var diffuseFresnelTerm: f32=computeFresnelTerm(viewDirectionW,normalW,uniforms.diffuseRightColor.a,uniforms.diffuseLeftColor.a);diffuseBase*=uniforms.diffuseLeftColor.rgb*(1.0-diffuseFresnelTerm)+diffuseFresnelTerm*uniforms.diffuseRightColor.rgb;
#endif
#ifdef EMISSIVEASILLUMINATION
var finalDiffuse: vec3f=clamp(diffuseBase*diffuseColor+uniforms.vAmbientColor,vec3f(0.0),vec3f(1.0))*baseColor.rgb;
#else
#ifdef LINKEMISSIVEWITHDIFFUSE
var finalDiffuse: vec3f=clamp((diffuseBase+emissiveColor)*diffuseColor+uniforms.vAmbientColor,vec3f(0.0),vec3f(1.0))*baseColor.rgb;
#else
var finalDiffuse: vec3f=clamp(diffuseBase*diffuseColor+emissiveColor+uniforms.vAmbientColor,vec3f(0.0),vec3f(1.0))*baseColor.rgb;
#endif
#endif
#ifdef SPECULARTERM
var finalSpecular: vec3f=specularBase*specularColor;
#ifdef SPECULAROVERALPHA
alpha=clamp(alpha+dot(finalSpecular, vec3f(0.3,0.59,0.11)),0.0,1.0);
#endif
#else
var finalSpecular: vec3f= vec3f(0.0);
#endif
#ifdef REFLECTIONOVERALPHA
alpha=clamp(alpha+dot(reflectionColor.rgb, vec3f(0.3,0.59,0.11)),0.0,1.0);
#endif
#ifdef EMISSIVEASILLUMINATION
var color: vec4f= vec4f(clamp(finalDiffuse*baseAmbientColor+finalSpecular+reflectionColor.rgb+emissiveColor+refractionColor.rgb,vec3f(0.0),vec3f(1.0)),alpha);
#else
var color: vec4f= vec4f(finalDiffuse*baseAmbientColor+finalSpecular+reflectionColor.rgb+refractionColor.rgb,alpha);
#endif
#ifdef LIGHTMAP
#ifndef LIGHTMAPEXCLUDED
#ifdef USELIGHTMAPASSHADOWMAP
color=vec4f(color.rgb*lightmapColor.rgb,color.a);
#else
color=vec4f(color.rgb+lightmapColor.rgb,color.a);
#endif
#endif
#endif
#define CUSTOM_FRAGMENT_BEFORE_FOG
color=vec4f(max(color.rgb,vec3f(0.)),color.a);
#include<logDepthFragment>
#include<fogFragment>
#ifdef IMAGEPROCESSINGPOSTPROCESS
color=vec4f(toLinearSpaceVec3(color.rgb),color.a);
#else
#ifdef IMAGEPROCESSING
color=vec4f(toLinearSpaceVec3(color.rgb),color.a);color=applyImageProcessing(color);
#endif
#endif
color=vec4f(color.rgb,color.a*mesh.visibility);
#ifdef PREMULTIPLYALPHA
color=vec4f(color.rgb*color.a, color.a);
#endif
#define CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR
#ifdef PREPASS
#if SCENE_MRT_COUNT>0
#ifdef ALPHATEST
var writeGeometryInfo: f32=1.0;
#else
var writeGeometryInfo: f32=select(0.0,1.0,color.a>0.4);
#endif
var fragData: array<vec4<f32>,SCENE_MRT_COUNT>;
#ifdef PREPASS_MESH_BLEND_TAG
var meshBlendTagOutput: vec4<u32>=vec4u(0u);if (writeGeometryInfo>0.0) {meshBlendTagOutput=vec4u(u32(uniforms.meshBlendTag),0u,0u,0u);}
#endif
#ifdef PREPASS_COLOR
fragData[PREPASS_COLOR_INDEX]=color; 
#endif
#ifdef PREPASS_POSITION
fragData[PREPASS_POSITION_INDEX]=vec4f(fragmentInputs.vPositionW,writeGeometryInfo);
#endif
#ifdef PREPASS_OBJECT_ID
fragData[PREPASS_OBJECT_ID_INDEX]=encodeObjectId(uniforms.objectId)*writeGeometryInfo;
#endif
#ifdef PREPASS_LOCAL_POSITION
fragData[PREPASS_LOCAL_POSITION_INDEX]=vec4f(fragmentInputs.vPosition,writeGeometryInfo);
#endif
#ifdef PREPASS_VELOCITY
var a: vec2f=(fragmentInputs.vCurrentPosition.xy/fragmentInputs.vCurrentPosition.w)*0.5+0.5;var b: vec2f=(fragmentInputs.vPreviousPosition.xy/fragmentInputs.vPreviousPosition.w)*0.5+0.5;var velocity: vec2f=abs(a-b);velocity= vec2f(pow(velocity.x,1.0/3.0),pow(velocity.y,1.0/3.0))*sign(a-b)*0.5+0.5;fragData[PREPASS_VELOCITY_INDEX]= vec4f(velocity,0.0,writeGeometryInfo);
#elif defined(PREPASS_VELOCITY_LINEAR)
var velocity : vec2f=vec2f(0.5)*((fragmentInputs.vPreviousPosition.xy/fragmentInputs.vPreviousPosition.w) -
(fragmentInputs.vCurrentPosition.xy/fragmentInputs.vCurrentPosition.w));fragData[PREPASS_VELOCITY_LINEAR_INDEX]=vec4f(velocity,0.0,writeGeometryInfo);
#endif
#ifdef PREPASS_IRRADIANCE
fragData[PREPASS_IRRADIANCE_INDEX]=vec4f(0.0,0.0,0.0,writeGeometryInfo); 
#endif
#ifdef PREPASS_DEPTH
fragData[PREPASS_DEPTH_INDEX]=vec4f(fragmentInputs.vViewPos.z,0.0,0.0,writeGeometryInfo); 
#endif
#ifdef PREPASS_SCREENSPACE_DEPTH
fragData[PREPASS_SCREENSPACE_DEPTH_INDEX]=vec4f(fragmentInputs.position.z,0.0,0.0,writeGeometryInfo);
#endif
#ifdef PREPASS_NORMALIZED_VIEW_DEPTH
fragData[PREPASS_NORMALIZED_VIEW_DEPTH_INDEX]=vec4f(fragmentInputs.vNormViewDepth,0.0,0.0,writeGeometryInfo);
#endif
#ifdef PREPASS_NORMAL
#ifdef PREPASS_NORMAL_WORLDSPACE
fragData[PREPASS_NORMAL_INDEX]=vec4f(normalW,writeGeometryInfo);
#else
fragData[PREPASS_NORMAL_INDEX]=vec4f(normalize((scene.view*vec4f(normalW,0.0)).rgb),writeGeometryInfo);
#endif
#endif
#ifdef PREPASS_WORLD_NORMAL
fragData[PREPASS_WORLD_NORMAL_INDEX]=vec4f(normalW*0.5+0.5,writeGeometryInfo);
#endif
#ifdef PREPASS_ALBEDO
fragData[PREPASS_ALBEDO_INDEX]=vec4f(baseColor.rgb,writeGeometryInfo);
#endif
#ifdef PREPASS_ALBEDO_SQRT
fragData[PREPASS_ALBEDO_SQRT_INDEX]=vec4f(sqrt(baseColor.rgb),writeGeometryInfo);
#endif
#ifdef PREPASS_REFLECTIVITY
#if defined(SPECULAR)
fragData[PREPASS_REFLECTIVITY_INDEX]=vec4f(toLinearSpaceVec4(specularMapColor))*writeGeometryInfo; 
#else
fragData[PREPASS_REFLECTIVITY_INDEX]=vec4f(toLinearSpaceVec3(specularColor),1.0)*writeGeometryInfo;
#endif
#endif
#include<meshBlendTagFragmentOutput>[0..8]
#endif
#endif
#if !defined(PREPASS) && !defined(ORDER_INDEPENDENT_TRANSPARENCY)
fragmentOutputs.color=color;
#endif
#include<oitFragment>
#if ORDER_INDEPENDENT_TRANSPARENCY
if (fragDepth==nearestDepth) {fragmentOutputs.frontColor=vec4f(fragmentOutputs.frontColor.rgb+color.rgb*color.a*alphaMultiplier,1.0-alphaMultiplier*(1.0-color.a));} else {fragmentOutputs.backColor+=color;}
#endif
#define CUSTOM_FRAGMENT_MAIN_END
#endif
}
`,n.ShadersStoreWGSL[W]||(n.ShadersStoreWGSL[W]=G),K=[o,F,U,Oe,ie,Se,B,z,je,Te,Ke,We,Ae,fe,ne,ge,te,A,k,Ot,Je,lt,ut,m,d,Ue,$e,He,bt,xt,D,f,Be,S,p];for(let e of K)n.IncludesShadersStoreWGSL[e.name]||(n.IncludesShadersStoreWGSL[e.name]=e.shader);q={name:W,shader:G}})))()}var Ft=t({defaultVertexShaderWGSL:()=>Q}),Y,X,Z,Q;function $(){return($=e((()=>{r(),s(),I(),V(),wt(),P(),vt(),ot(),v(),ae(),L(),i(),ft(),at(),_(),De(),c(),w(),ye(),R(),Dt(),Mt(),Re(),ze(),j(),_t(),rt(),se(),St(),pe(),pt(),ct(),Ce(),me(),jt(),Ne(),Y=`defaultVertexShader`,X=`#include<defaultUboDeclaration>
#define CUSTOM_VERTEX_BEGIN
#ifndef USE_VERTEX_PULLING
attribute position: vec3f;
#ifdef NORMAL
attribute normal: vec3f;
#endif
#ifdef TANGENT
attribute tangent: vec4f;
#endif
#ifdef UV1
attribute uv: vec2f;
#endif
#include<uvAttributeDeclaration>[2..7]
#ifdef VERTEXCOLOR
attribute color: vec4f;
#endif
#endif
#include<helperFunctions>
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<instancesDeclaration>
#include<prePassVertexDeclaration>
#include<mainUVVaryingDeclaration>[1..7]
#include<samplerVertexDeclaration>(_DEFINENAME_,DIFFUSE,_VARYINGNAME_,Diffuse)
#include<samplerVertexDeclaration>(_DEFINENAME_,DETAIL,_VARYINGNAME_,Detail)
#include<samplerVertexDeclaration>(_DEFINENAME_,AMBIENT,_VARYINGNAME_,Ambient)
#include<samplerVertexDeclaration>(_DEFINENAME_,OPACITY,_VARYINGNAME_,Opacity)
#include<samplerVertexDeclaration>(_DEFINENAME_,EMISSIVE,_VARYINGNAME_,Emissive)
#include<samplerVertexDeclaration>(_DEFINENAME_,LIGHTMAP,_VARYINGNAME_,Lightmap)
#if defined(SPECULARTERM)
#include<samplerVertexDeclaration>(_DEFINENAME_,SPECULAR,_VARYINGNAME_,Specular)
#endif
#include<samplerVertexDeclaration>(_DEFINENAME_,BUMP,_VARYINGNAME_,Bump)
#include<samplerVertexDeclaration>(_DEFINENAME_,DECAL,_VARYINGNAME_,Decal)
varying vPositionW: vec3f;
#ifdef NORMAL
varying vNormalW: vec3f;
#endif
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
varying vColor: vec4f;
#endif
#include<bumpVertexDeclaration>
#include<clipPlaneVertexDeclaration>
#include<fogVertexDeclaration>
#include<__decl__lightVxFragment>[0..maxSimultaneousLights]
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#ifdef REFLECTIONMAP_SKYBOX
varying vPositionUVW: vec3f;
#endif
#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)
varying vDirectionW: vec3f;
#endif
#if defined(CLUSTLIGHT_BATCH) && CLUSTLIGHT_BATCH>0
varying vViewDepth: f32;
#endif
#include<logDepthDeclaration>
#include<vertexPullingDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#define CUSTOM_VERTEX_MAIN_BEGIN
#ifdef USE_VERTEX_PULLING
var positionUpdated: vec3f=vec3f(0.0);
#ifdef NORMAL
var normalUpdated: vec3f=vec3f(0.0);
#endif
#ifdef TANGENT
var tangentUpdated: vec4f=vec4f(0.0);
#endif
#ifdef UV1
var uvUpdated: vec2f=vec2f(0.0);
#endif
#ifdef UV2
var uv2Updated: vec2f=vec2f(0.0);
#endif
#ifdef VERTEXCOLOR
var colorUpdated: vec4f=vec4f(0.0);
#endif
#else
var positionUpdated: vec3f=vertexInputs.position;
#ifdef NORMAL
var normalUpdated: vec3f=vertexInputs.normal;
#endif
#ifdef TANGENT
var tangentUpdated: vec4f=vertexInputs.tangent;
#endif
#ifdef UV1
var uvUpdated: vec2f=vertexInputs.uv;
#endif
#ifdef UV2
var uv2Updated: vec2f=vertexInputs.uv2;
#endif
#ifdef VERTEXCOLOR
var colorUpdated: vec4f=vertexInputs.color;
#endif
#endif
#include<vertexPullingVertex>
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#ifdef REFLECTIONMAP_SKYBOX
vertexOutputs.vPositionUVW=positionUpdated;
#endif
#define CUSTOM_VERTEX_UPDATE_POSITION
#define CUSTOM_VERTEX_UPDATE_NORMAL
#include<instancesVertex>
#if defined(PREPASS) && ((defined(PREPASS_VELOCITY) || defined(PREPASS_VELOCITY_LINEAR)) && !defined(BONES_VELOCITY_ENABLED)
vertexOutputs.vCurrentPosition=scene.viewProjection*finalWorld*vec4f(positionUpdated,1.0);vertexOutputs.vPreviousPosition=uniforms.previousViewProjection*finalPreviousWorld*vec4f(positionUpdated,1.0);
#endif
#ifdef USE_VERTEX_PULLING
#include<bonesVertex>(vertexInputs.matricesIndices,vp_matricesIndices,vertexInputs.matricesWeights,vp_matricesWeights,vertexInputs.matricesIndicesExtra,vp_matricesIndicesExtra,vertexInputs.matricesWeightsExtra,vp_matricesWeightsExtra)
#include<bakedVertexAnimation>(vertexInputs.matricesIndices,vp_matricesIndices,vertexInputs.matricesWeights,vp_matricesWeights,vertexInputs.matricesIndicesExtra,vp_matricesIndicesExtra,vertexInputs.matricesWeightsExtra,vp_matricesWeightsExtra)
#else
#include<bonesVertex>
#include<bakedVertexAnimation>
#endif
var worldPos: vec4f=finalWorld*vec4f(positionUpdated,1.0);
#ifdef NORMAL
var normalWorld: mat3x3f= mat3x3f(finalWorld[0].xyz,finalWorld[1].xyz,finalWorld[2].xyz);
#if defined(INSTANCES) && defined(THIN_INSTANCES)
vertexOutputs.vNormalW=normalUpdated/ vec3f(dot(normalWorld[0],normalWorld[0]),dot(normalWorld[1],normalWorld[1]),dot(normalWorld[2],normalWorld[2]));vertexOutputs.vNormalW=normalize(normalWorld*vertexOutputs.vNormalW);
#else
#ifdef NONUNIFORMSCALING
normalWorld=transposeMat3(inverseMat3(normalWorld));
#endif
vertexOutputs.vNormalW=normalize(normalWorld*normalUpdated);
#endif
#endif
#define CUSTOM_VERTEX_UPDATE_WORLDPOS
#ifdef MULTIVIEW
if (gl_ViewID_OVR==0u) {vertexOutputs.position=scene.viewProjection*worldPos;} else {vertexOutputs.position=scene.viewProjectionR*worldPos;}
#else
vertexOutputs.position=scene.viewProjection*worldPos;
#endif
vertexOutputs.vPositionW= worldPos.xyz;
#ifdef PREPASS
#include<prePassVertex>
#endif
#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)
vertexOutputs.vDirectionW=normalize((finalWorld* vec4f(positionUpdated,0.0)).xyz);
#endif
#if defined(CLUSTLIGHT_BATCH) && CLUSTLIGHT_BATCH>0
#ifdef RIGHT_HANDED
vertexOutputs.vViewDepth=-(scene.view*worldPos).z;
#else
vertexOutputs.vViewDepth=(scene.view*worldPos).z;
#endif
#endif
#ifndef UV1
var uvUpdated: vec2f=vec2f(0.,0.);
#endif
#ifdef MAINUV1
vertexOutputs.vMainUV1=uvUpdated;
#endif
#ifndef UV2
var uv2Updated: vec2f=vec2f(0.,0.);
#endif
#ifdef MAINUV2
vertexOutputs.vMainUV2=uv2Updated;
#endif
#include<uvVariableDeclaration>[3..7]
#include<samplerVertexImplementation>(_DEFINENAME_,DIFFUSE,_VARYINGNAME_,Diffuse,_MATRIXNAME_,diffuse,_INFONAME_,DiffuseInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,DETAIL,_VARYINGNAME_,Detail,_MATRIXNAME_,detail,_INFONAME_,DetailInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,AMBIENT,_VARYINGNAME_,Ambient,_MATRIXNAME_,ambient,_INFONAME_,AmbientInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,OPACITY,_VARYINGNAME_,Opacity,_MATRIXNAME_,opacity,_INFONAME_,OpacityInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,EMISSIVE,_VARYINGNAME_,Emissive,_MATRIXNAME_,emissive,_INFONAME_,EmissiveInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,LIGHTMAP,_VARYINGNAME_,Lightmap,_MATRIXNAME_,lightmap,_INFONAME_,LightmapInfos.x)
#if defined(SPECULARTERM)
#include<samplerVertexImplementation>(_DEFINENAME_,SPECULAR,_VARYINGNAME_,Specular,_MATRIXNAME_,specular,_INFONAME_,SpecularInfos.x)
#endif
#include<samplerVertexImplementation>(_DEFINENAME_,BUMP,_VARYINGNAME_,Bump,_MATRIXNAME_,bump,_INFONAME_,BumpInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,DECAL,_VARYINGNAME_,Decal,_MATRIXNAME_,decal,_INFONAME_,DecalInfos.x)
#include<bumpVertex>
#include<clipPlaneVertex>
#include<fogVertex>
#include<shadowsVertex>[0..maxSimultaneousLights]
#include<vertexColorMixing>
#include<logDepthVertex>
#define CUSTOM_VERTEX_MAIN_END
}
`,n.ShadersStoreWGSL[Y]||(n.ShadersStoreWGSL[Y]=X),Z=[o,F,U,Tt,z,et,st,b,le,B,re,mt,it,Ee,_e,y,l,Le,m,Nt,Ct,C,N,Ie,dt,gt,ce,kt,oe,tt,ht,we,ee,Et,ke];for(let e of Z)n.IncludesShadersStoreWGSL[e.name]||(n.IncludesShadersStoreWGSL[e.name]=e.shader);Q={name:Y,shader:X}})))()}export{J as i,$ as n,Pt as r,Ft as t};