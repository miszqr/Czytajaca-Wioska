import{n as e}from"./rolldown-runtime-CNOWq4Kh.js";import{f as t,p as n}from"./runtime-COARTP6Z.js";import{Vt as ee,qt as te}from"./runtime-U-v-W3Ar.js";import{hn as ne}from"./runtime-DCavzC8c.js";var r,i,re;function ie(){return(ie=e((()=>{n(),te(),ne(),r=`defaultUboDeclaration`,i=`uniform diffuseLeftColor: vec4f;uniform diffuseRightColor: vec4f;uniform opacityParts: vec4f;uniform reflectionLeftColor: vec4f;uniform reflectionRightColor: vec4f;uniform refractionLeftColor: vec4f;uniform refractionRightColor: vec4f;uniform emissiveLeftColor: vec4f;uniform emissiveRightColor: vec4f;uniform vDiffuseInfos: vec2f;uniform vAmbientInfos: vec2f;uniform vOpacityInfos: vec2f;uniform vEmissiveInfos: vec2f;uniform vLightmapInfos: vec2f;uniform vSpecularInfos: vec2f;uniform vBumpInfos: vec3f;uniform diffuseMatrix: mat4x4f;uniform ambientMatrix: mat4x4f;uniform opacityMatrix: mat4x4f;uniform emissiveMatrix: mat4x4f;uniform lightmapMatrix: mat4x4f;uniform specularMatrix: mat4x4f;uniform bumpMatrix: mat4x4f;uniform vTangentSpaceParams: vec2f;uniform pointSize: f32;uniform alphaCutOff: f32;uniform refractionMatrix: mat4x4f;uniform vRefractionInfos: vec4f;uniform vRefractionPosition: vec3f;uniform vRefractionSize: vec3f;uniform vSpecularColor: vec4f;uniform vEmissiveColor: vec3f;uniform vDiffuseColor: vec4f;uniform vAmbientColor: vec3f;uniform cameraInfo: vec4f;uniform vTextureRepetitionHexTilingParams: vec4f;uniform vReflectionInfos: vec2f;uniform reflectionMatrix: mat4x4f;uniform vReflectionPosition: vec3f;uniform vReflectionSize: vec3f;
#define ADDITIONAL_UBO_DECLARATION
#include<sceneUboDeclaration>
#include<meshUboDeclaration>
`,t.IncludesShadersStoreWGSL[r]||(t.IncludesShadersStoreWGSL[r]=i),re={name:r,shader:i}})))()}var a,o,ae;function oe(){return(oe=e((()=>{n(),a=`clusteredLightingFunctions`,o=`struct ClusteredLight {vLightData: vec4f,
vLightDiffuse: vec4f,
vLightSpecular: vec4f,
vLightDirection: vec4f,
vLightFalloff: vec4f,}
fn getClusteredLight(lightDataTexture: texture_2d<f32>,index: u32)->ClusteredLight {return ClusteredLight(
textureLoad(lightDataTexture,vec2u(0,index),0),
textureLoad(lightDataTexture,vec2u(1,index),0),
textureLoad(lightDataTexture,vec2u(2,index),0),
textureLoad(lightDataTexture,vec2u(3,index),0),
textureLoad(lightDataTexture,vec2u(4,index),0)
);}
fn getClusteredSliceIndex(sliceData: vec2f,viewDepth: f32)->i32 {return i32(log(viewDepth)*sliceData.x+sliceData.y);}
`,t.IncludesShadersStoreWGSL[a]||(t.IncludesShadersStoreWGSL[a]=o),ae={name:a,shader:o}})))()}var s,c,l;function se(){return(se=e((()=>{n(),s=`clusteredLightingCompute`,c=`#if defined(CLUSTLIGHT{X}) && defined(CLUSTLIGHT_BATCH) && CLUSTLIGHT_BATCH>0
fn computeClusteredLighting{X}(
lightDataTexture: texture_2d<f32>,
viewDirectionW: vec3f,
vNormal: vec3f,
lightData: vec4f,
sliceRange: vec2u,
glossiness: f32
)->lightingInfo {var result: lightingInfo;let tilePosition=vec2u(fragmentInputs.position.xy*lightData.xy);let maskResolution=vec2u(lightData.zw);var tileIndex=(tilePosition.x*maskResolution.x+tilePosition.y)*maskResolution.y;let batchRange=sliceRange/CLUSTLIGHT_BATCH;var batchOffset=batchRange.x*CLUSTLIGHT_BATCH;tileIndex+=batchRange.x;for (var i=batchRange.x; i<=batchRange.y; i+=1) {var mask=tileMaskBuffer{X}[tileIndex];tileIndex+=1;let maskOffset=max(sliceRange.x,batchOffset)-batchOffset; 
let maskWidth=min(sliceRange.y-batchOffset+1,CLUSTLIGHT_BATCH);mask=extractBits(mask,maskOffset,maskWidth);while mask != 0 {let trailing=firstTrailingBit(mask);mask ^= 1u<<trailing;let light=getClusteredLight(lightDataTexture,batchOffset+maskOffset+trailing);var info: lightingInfo;if light.vLightDirection.w<0.0 {info=computeLighting(viewDirectionW,vNormal,light.vLightData,light.vLightDiffuse.rgb,light.vLightSpecular.rgb,light.vLightDiffuse.a,glossiness);} else {info=computeSpotLighting(viewDirectionW,vNormal,light.vLightData,light.vLightDirection,light.vLightDiffuse.rgb,light.vLightSpecular.rgb,light.vLightDiffuse.a,glossiness);}
result.diffuse+=info.diffuse;
#ifdef SPECULARTERM
result.specular+=info.specular;
#endif
}
batchOffset+=CLUSTLIGHT_BATCH;}
return result;}
#endif
`,t.IncludesShadersStoreWGSL[s]||(t.IncludesShadersStoreWGSL[s]=c),l={name:s,shader:c}})))()}var u,d,ce;function le(){return(le=e((()=>{n(),u=`bumpFragmentMainFunctions`,d=`#ifndef TEXRD_DEFINED
fn TEXRD(t: texture_2d<f32>,ts: sampler,uv: vec2f)->vec4f {return textureSample(t,ts,uv);}
#define TEXRD_DEFINED
#endif
#if defined(BUMP) || defined(CLEARCOAT_BUMP) || defined(ANISOTROPIC) || defined(DETAIL)
#if defined(TANGENT) && defined(NORMAL) 
varying vTBN0: vec3f;varying vTBN1: vec3f;varying vTBN2: vec3f;
#endif
#ifdef OBJECTSPACE_NORMALMAP
uniform normalMatrix: mat4x4f;fn toNormalMatrix(m: mat4x4f)->mat4x4f
{var a00=m[0][0];var a01=m[0][1];var a02=m[0][2];var a03=m[0][3];var a10=m[1][0];var a11=m[1][1];var a12=m[1][2];var a13=m[1][3];var a20=m[2][0]; 
var a21=m[2][1];var a22=m[2][2];var a23=m[2][3];var a30=m[3][0]; 
var a31=m[3][1];var a32=m[3][2];var a33=m[3][3];var b00=a00*a11-a01*a10;var b01=a00*a12-a02*a10;var b02=a00*a13-a03*a10;var b03=a01*a12-a02*a11;var b04=a01*a13-a03*a11;var b05=a02*a13-a03*a12;var b06=a20*a31-a21*a30;var b07=a20*a32-a22*a30;var b08=a20*a33-a23*a30;var b09=a21*a32-a22*a31;var b10=a21*a33-a23*a31;var b11=a22*a33-a23*a32;var det=b00*b11-b01*b10+b02*b09+b03*b08-b04*b07+b05*b06;var mi=mat4x4<f32>(
(a11*b11-a12*b10+a13*b09)/det,
(a02*b10-a01*b11-a03*b09)/det,
(a31*b05-a32*b04+a33*b03)/det,
(a22*b04-a21*b05-a23*b03)/det,
(a12*b08-a10*b11-a13*b07)/det,
(a00*b11-a02*b08+a03*b07)/det,
(a32*b02-a30*b05-a33*b01)/det,
(a20*b05-a22*b02+a23*b01)/det,
(a10*b10-a11*b08+a13*b06)/det,
(a01*b08-a00*b10-a03*b06)/det,
(a30*b04-a31*b02+a33*b00)/det,
(a21*b02-a20*b04-a23*b00)/det,
(a11*b07-a10*b09-a12*b06)/det,
(a00*b09-a01*b07+a02*b06)/det,
(a31*b01-a30*b03-a32*b00)/det,
(a20*b03-a21*b01+a22*b00)/det);return mat4x4<f32>(mi[0][0],mi[1][0],mi[2][0],mi[3][0],
mi[0][1],mi[1][1],mi[2][1],mi[3][1],
mi[0][2],mi[1][2],mi[2][2],mi[3][2],
mi[0][3],mi[1][3],mi[2][3],mi[3][3]);}
#endif
fn perturbNormalBase(cotangentFrame: mat3x3f,normal: vec3f,scale: f32)->vec3f
{var output=normal;
#ifdef NORMALXYSCALE
output=normalize(output* vec3f(scale,scale,1.0));
#endif
return normalize(cotangentFrame*output);}
fn perturbNormal(cotangentFrame: mat3x3f,textureSample: vec3f,scale: f32)->vec3f
{return perturbNormalBase(cotangentFrame,textureSample*2.0-1.0,scale);}
fn cotangent_frame(normal: vec3f,p: vec3f,uv: vec2f,tangentSpaceParams: vec2f)->mat3x3f
{var dp1: vec3f=dpdx(p);var dp2: vec3f=dpdy(p);var duv1: vec2f=dpdx(uv);var duv2: vec2f=dpdy(uv);var dp2perp: vec3f=cross(dp2,normal);var dp1perp: vec3f=cross(normal,dp1);var tangent: vec3f=dp2perp*duv1.x+dp1perp*duv2.x;var bitangent: vec3f=dp2perp*duv1.y+dp1perp*duv2.y;tangent*=tangentSpaceParams.x;bitangent*=tangentSpaceParams.y;var det: f32=max(dot(tangent,tangent),dot(bitangent,bitangent));var invmax: f32=select(inverseSqrt(det),0.0,det==0.0);return mat3x3f(tangent*invmax,bitangent*invmax,normal);}
#endif
`,t.IncludesShadersStoreWGSL[u]||(t.IncludesShadersStoreWGSL[u]=d),ce={name:u,shader:d}})))()}var f,p,m;function ue(){return(ue=e((()=>{n(),ee(),f=`bumpFragmentFunctions`,p=`#if defined(BUMP)
#include<samplerFragmentDeclaration>(_DEFINENAME_,BUMP,_VARYINGNAME_,Bump,_SAMPLERNAME_,bump)
#endif
#if defined(DETAIL)
#include<samplerFragmentDeclaration>(_DEFINENAME_,DETAIL,_VARYINGNAME_,Detail,_SAMPLERNAME_,detail)
#endif
#if defined(BUMP) && defined(PARALLAX)
const minSamples: f32=4.;const maxSamples: f32=15.;const iMaxSamples: i32=15;fn parallaxOcclusion(vViewDirCoT: vec3f,vNormalCoT: vec3f,texCoord: vec2f,parallaxScale: f32)->vec2f {var parallaxLimit: f32=length(vViewDirCoT.xy)/vViewDirCoT.z;parallaxLimit*=parallaxScale;var vOffsetDir: vec2f=normalize(vViewDirCoT.xy);var vMaxOffset: vec2f=vOffsetDir*parallaxLimit;var numSamples: f32=maxSamples+(dot(vViewDirCoT,vNormalCoT)*(minSamples-maxSamples));var stepSize: f32=1.0/numSamples;var currRayHeight: f32=1.0;var vCurrOffset: vec2f= vec2f(0,0);var vLastOffset: vec2f= vec2f(0,0);var lastSampledHeight: f32=1.0;var currSampledHeight: f32=1.0;var keepWorking: bool=true;for (var i: i32=0; i<iMaxSamples; i++)
{currSampledHeight=textureSample(bumpSampler,bumpSamplerSampler,texCoord+vCurrOffset).w;if (!keepWorking)
{}
else if (currSampledHeight>currRayHeight)
{var delta1: f32=currSampledHeight-currRayHeight;var delta2: f32=(currRayHeight+stepSize)-lastSampledHeight;var ratio: f32=delta1/(delta1+delta2);vCurrOffset=(ratio)* vLastOffset+(1.0-ratio)*vCurrOffset;keepWorking=false;}
else
{currRayHeight-=stepSize;vLastOffset=vCurrOffset;
#ifdef PARALLAX_RHS
vCurrOffset-=stepSize*vMaxOffset;
#else
vCurrOffset+=stepSize*vMaxOffset;
#endif
lastSampledHeight=currSampledHeight;}}
return vCurrOffset;}
fn parallaxOffset(viewDir: vec3f,heightScale: f32)->vec2f
{var height: f32=textureSample(bumpSampler,bumpSamplerSampler,fragmentInputs.vBumpUV).w;var texCoordOffset: vec2f=heightScale*viewDir.xy*height;
#ifdef PARALLAX_RHS
return texCoordOffset;
#else
return -texCoordOffset;
#endif
}
#endif
`,t.IncludesShadersStoreWGSL[f]||(t.IncludesShadersStoreWGSL[f]=p),m={name:f,shader:p}})))()}var h,g,_;function v(){return(v=e((()=>{n(),h=`clipPlaneFragmentDeclaration`,g=`#ifdef CLIPPLANE
varying fClipDistance: f32;
#endif
#ifdef CLIPPLANE2
varying fClipDistance2: f32;
#endif
#ifdef CLIPPLANE3
varying fClipDistance3: f32;
#endif
#ifdef CLIPPLANE4
varying fClipDistance4: f32;
#endif
#ifdef CLIPPLANE5
varying fClipDistance5: f32;
#endif
#ifdef CLIPPLANE6
varying fClipDistance6: f32;
#endif
`,t.IncludesShadersStoreWGSL[h]||(t.IncludesShadersStoreWGSL[h]=g),_={name:h,shader:g}})))()}var y,b,x;function S(){return(S=e((()=>{n(),y=`clipPlaneFragment`,b=`#if defined(CLIPPLANE) || defined(CLIPPLANE2) || defined(CLIPPLANE3) || defined(CLIPPLANE4) || defined(CLIPPLANE5) || defined(CLIPPLANE6)
if (false) {}
#endif
#ifdef CLIPPLANE
else if (fragmentInputs.fClipDistance>0.0)
{discard;}
#endif
#ifdef CLIPPLANE2
else if (fragmentInputs.fClipDistance2>0.0)
{discard;}
#endif
#ifdef CLIPPLANE3
else if (fragmentInputs.fClipDistance3>0.0)
{discard;}
#endif
#ifdef CLIPPLANE4
else if (fragmentInputs.fClipDistance4>0.0)
{discard;}
#endif
#ifdef CLIPPLANE5
else if (fragmentInputs.fClipDistance5>0.0)
{discard;}
#endif
#ifdef CLIPPLANE6
else if (fragmentInputs.fClipDistance6>0.0)
{discard;}
#endif
`,t.IncludesShadersStoreWGSL[y]||(t.IncludesShadersStoreWGSL[y]=b),x={name:y,shader:b}})))()}var C,w,de;function fe(){return(fe=e((()=>{n(),C=`bumpFragment`,w=`var uvOffset: vec2f= vec2f(0.0,0.0);
#if defined(BUMP) || defined(PARALLAX) || defined(DETAIL)
#ifdef NORMALXYSCALE
var normalScale: f32=1.0;
#elif defined(BUMP)
var normalScale: f32=uniforms.vBumpInfos.y;
#else
var normalScale: f32=1.0;
#endif
#if defined(TANGENT) && defined(NORMAL)
var TBN: mat3x3f=mat3x3<f32>(input.vTBN0,input.vTBN1,input.vTBN2); 
#elif defined(BUMP)
var TBNUV: vec2f=select(-fragmentInputs.vBumpUV,fragmentInputs.vBumpUV,fragmentInputs.frontFacing);var TBN: mat3x3f=cotangent_frame(normalW*normalScale,input.vPositionW,TBNUV,uniforms.vTangentSpaceParams);
#else
var TBNUV: vec2f=select(-fragmentInputs.vDetailUV,fragmentInputs.vDetailUV,fragmentInputs.frontFacing);var TBN: mat3x3f=cotangent_frame(normalW*normalScale,input.vPositionW,TBNUV, vec2f(1.,1.));
#endif
#elif defined(ANISOTROPIC)
#if defined(TANGENT) && defined(NORMAL)
var TBN: mat3x3f=mat3x3<f32>(input.vTBN0,input.vTBN1,input.vTBN2); 
#else
var TBNUV: vec2f=select( -fragmentInputs.vMainUV1,fragmentInputs.vMainUV1,fragmentInputs.frontFacing);var TBN: mat3x3f=cotangent_frame(normalW,input.vPositionW,TBNUV, vec2f(1.,1.));
#endif
#endif
#ifdef PARALLAX
var invTBN: mat3x3f=transposeMat3(TBN);
#ifdef PARALLAXOCCLUSION
uvOffset=parallaxOcclusion(invTBN*-viewDirectionW,invTBN*normalW,fragmentInputs.vBumpUV,uniforms.vBumpInfos.z);
#else
uvOffset=parallaxOffset(invTBN*viewDirectionW,uniforms.vBumpInfos.z);
#endif
#endif
#ifdef DETAIL
var detailColor: vec4f=textureSample(detailSampler,detailSamplerSampler,fragmentInputs.vDetailUV+uvOffset);var detailNormalRG: vec2f=detailColor.wy*2.0-1.0;var detailNormalB: f32=sqrt(1.-saturate(dot(detailNormalRG,detailNormalRG)));var detailNormal: vec3f= vec3f(detailNormalRG,detailNormalB);
#endif
#ifdef BUMP
#ifdef OBJECTSPACE_NORMALMAP
#define CUSTOM_FRAGMENT_BUMP_FRAGMENT
normalW=normalize(TEXRD(bumpSampler,bumpSamplerSampler,fragmentInputs.vBumpUV).xyz *2.0-1.0);normalW=normalize(mat3x3f(uniforms.normalMatrix[0].xyz,uniforms.normalMatrix[1].xyz,uniforms.normalMatrix[2].xyz)*normalW);
#elif !defined(DETAIL)
normalW=perturbNormal(TBN,TEXRD(bumpSampler,bumpSamplerSampler,fragmentInputs.vBumpUV+uvOffset).xyz,uniforms.vBumpInfos.y);
#else
var bumpNormal: vec3f=TEXRD(bumpSampler,bumpSamplerSampler,fragmentInputs.vBumpUV+uvOffset).xyz*2.0-1.0;
#if DETAIL_NORMALBLENDMETHOD==0 
detailNormal=vec3f(detailNormal.xy*uniforms.vDetailInfos.z,detailNormal.z);var blendedNormal: vec3f=normalize( vec3f(bumpNormal.xy+detailNormal.xy,bumpNormal.z*detailNormal.z));
#elif DETAIL_NORMALBLENDMETHOD==1 
detailNormal=vec3f(detailNormal.xy*uniforms.vDetailInfos.z,detailNormal.z);bumpNormal+= vec3f(0.0,0.0,1.0);detailNormal*= vec3f(-1.0,-1.0,1.0);var blendedNormal: vec3f=bumpNormal*dot(bumpNormal,detailNormal)/bumpNormal.z-detailNormal;
#endif
normalW=perturbNormalBase(TBN,blendedNormal,uniforms.vBumpInfos.y);
#endif
#elif defined(DETAIL)
detailNormal=vec3f(detailNormal.xy*uniforms.vDetailInfos.z,detailNormal.z);normalW=perturbNormalBase(TBN,detailNormal,uniforms.vDetailInfos.z);
#endif
`,t.IncludesShadersStoreWGSL[C]||(t.IncludesShadersStoreWGSL[C]=w),de={name:C,shader:w}})))()}var T,E,pe;function me(){return(me=e((()=>{n(),T=`decalFragment`,E=`#ifdef DECAL
var decalTempColor=decalColor.rgb;var decalTempAlpha=decalColor.a;
#ifdef GAMMADECAL
decalTempColor=toLinearSpaceVec3(decalColor.rgb);
#endif
#ifdef DECAL_SMOOTHALPHA
decalTempAlpha=decalColor.a*decalColor.a;
#endif
surfaceAlbedo=mix(surfaceAlbedo.rgb,decalTempColor,decalTempAlpha);
#endif
`,t.IncludesShadersStoreWGSL[T]||(t.IncludesShadersStoreWGSL[T]=E),pe={name:T,shader:E}})))()}var D,O,he;function k(){return(k=e((()=>{n(),D=`defaultFragmentAlpha`,O=`#ifdef OPACITY
var opacityMap: vec4f=TEXRD(opacitySampler,opacitySamplerSampler,fragmentInputs.vOpacityUV+uvOffset);
#ifdef OPACITYRGB
opacityMap=vec4f(opacityMap.rgb* vec3f(0.3,0.59,0.11),opacityMap.a);alpha*=(opacityMap.x+opacityMap.y+opacityMap.z)* uniforms.vOpacityInfos.y;
#else
alpha*=opacityMap.a*uniforms.vOpacityInfos.y;
#endif
#endif
#if defined(VERTEXALPHA) || defined(INSTANCESCOLOR) && defined(INSTANCES)
alpha*=fragmentInputs.vColor.a;
#endif
#ifdef OPACITYFRESNEL
var opacityFresnelTerm: f32=computeFresnelTerm(viewDirectionW,normalW,uniforms.opacityParts.z,uniforms.opacityParts.w);alpha+=uniforms.opacityParts.x*(1.0-opacityFresnelTerm)+opacityFresnelTerm*uniforms.opacityParts.y;
#endif
#ifdef ALPHATEST
#ifdef ALPHATEST_AFTERALLALPHACOMPUTATIONS
if (alpha<uniforms.alphaCutOff) {discard;}
#endif
#ifndef ALPHABLEND
alpha=1.0;
#endif
#endif
`,t.IncludesShadersStoreWGSL[D]||(t.IncludesShadersStoreWGSL[D]=O),he={name:D,shader:O}})))()}var A,j,M;function N(){return(N=e((()=>{n(),A=`depthPrePass`,j=`#ifdef DEPTHPREPASS
#if !defined(PREPASS) && !defined(ORDER_INDEPENDENT_TRANSPARENCY)
fragmentOutputs.color= vec4f(0.,0.,0.,1.0);
#endif
#ifndef DEPTHPREPASS_SKIP_EARLY_RETURN
return fragmentOutputs;
#endif
#endif
`,t.IncludesShadersStoreWGSL[A]||(t.IncludesShadersStoreWGSL[A]=j),M={name:A,shader:j}})))()}var P,F,I;function L(){return(L=e((()=>{n(),P=`bonesDeclaration`,F=`#if NUM_BONE_INFLUENCERS>0
#ifndef USE_VERTEX_PULLING
attribute matricesIndices : vec4f;attribute matricesWeights : vec4f;
#if NUM_BONE_INFLUENCERS>4
attribute matricesIndicesExtra : vec4f;attribute matricesWeightsExtra : vec4f;
#endif
#endif
#ifndef BAKED_VERTEX_ANIMATION_TEXTURE
#ifdef BONETEXTURE
var boneSampler : texture_2d<f32>;uniform boneTextureInfo : vec2f;
#else
uniform mBones : array<mat4x4f,BonesPerMesh>;
#endif
#ifdef BONES_VELOCITY_ENABLED
uniform mPreviousBones : array<mat4x4f,BonesPerMesh>;
#endif
#ifdef BONETEXTURE
fn readMatrixFromRawSampler(smp : texture_2d<f32>,index : f32)->mat4x4f
{let offset=i32(index)*4; 
let textureWidth=i32(uniforms.boneTextureInfo.x);let y=offset/textureWidth;let x=offset % textureWidth;let m0=textureLoad(smp,vec2<i32>(x+0,y),0);let m1=textureLoad(smp,vec2<i32>(x+1,y),0);let m2=textureLoad(smp,vec2<i32>(x+2,y),0);let m3=textureLoad(smp,vec2<i32>(x+3,y),0);return mat4x4f(m0,m1,m2,m3);}
#endif
#endif
#endif
`,t.IncludesShadersStoreWGSL[P]||(t.IncludesShadersStoreWGSL[P]=F),I={name:P,shader:F}})))()}var R,z,ge;function _e(){return(_e=e((()=>{n(),R=`bakedVertexAnimationDeclaration`,z=`#ifdef BAKED_VERTEX_ANIMATION_TEXTURE
uniform bakedVertexAnimationTime: f32;uniform bakedVertexAnimationSettings: vec4<f32>;var bakedVertexAnimationTexture : texture_2d<f32>;
#ifdef INSTANCES
attribute bakedVertexAnimationSettingsInstanced : vec4<f32>;
#endif
fn readMatrixFromRawSamplerVAT(smp : texture_2d<f32>,index : f32,frame : f32)->mat4x4<f32>
{let offset=i32(index)*4;let frameUV=i32(frame);let m0=textureLoad(smp,vec2<i32>(offset+0,frameUV),0);let m1=textureLoad(smp,vec2<i32>(offset+1,frameUV),0);let m2=textureLoad(smp,vec2<i32>(offset+2,frameUV),0);let m3=textureLoad(smp,vec2<i32>(offset+3,frameUV),0);return mat4x4<f32>(m0,m1,m2,m3);}
#endif
`,t.IncludesShadersStoreWGSL[R]||(t.IncludesShadersStoreWGSL[R]=z),ge={name:R,shader:z}})))()}var B,V,ve;function ye(){return(ye=e((()=>{n(),B=`bumpVertexDeclaration`,V=`#if defined(BUMP) || defined(PARALLAX) || defined(CLEARCOAT_BUMP) || defined(ANISOTROPIC)
#if defined(TANGENT) && defined(NORMAL) 
varying vTBN0: vec3f;varying vTBN1: vec3f;varying vTBN2: vec3f;
#endif
#endif
`,t.IncludesShadersStoreWGSL[B]||(t.IncludesShadersStoreWGSL[B]=V),ve={name:B,shader:V}})))()}var H,U,be;function xe(){return(xe=e((()=>{n(),H=`clipPlaneVertexDeclaration`,U=`#ifdef CLIPPLANE
uniform vClipPlane: vec4<f32>;varying fClipDistance: f32;
#endif
#ifdef CLIPPLANE2
uniform vClipPlane2: vec4<f32>;varying fClipDistance2: f32;
#endif
#ifdef CLIPPLANE3
uniform vClipPlane3: vec4<f32>;varying fClipDistance3: f32;
#endif
#ifdef CLIPPLANE4
uniform vClipPlane4: vec4<f32>;varying fClipDistance4: f32;
#endif
#ifdef CLIPPLANE5
uniform vClipPlane5: vec4<f32>;varying fClipDistance5: f32;
#endif
#ifdef CLIPPLANE6
uniform vClipPlane6: vec4<f32>;varying fClipDistance6: f32;
#endif
`,t.IncludesShadersStoreWGSL[H]||(t.IncludesShadersStoreWGSL[H]=U),be={name:H,shader:U}})))()}var W,G,Se;function Ce(){return(Ce=e((()=>{n(),W=`bonesVertex`,G=`#ifndef BAKED_VERTEX_ANIMATION_TEXTURE
#if NUM_BONE_INFLUENCERS>0
var influence : mat4x4<f32>;
#ifdef BONETEXTURE
influence=readMatrixFromRawSampler(boneSampler,vertexInputs.matricesIndices[0])*vertexInputs.matricesWeights[0];
#if NUM_BONE_INFLUENCERS>1
influence=influence+readMatrixFromRawSampler(boneSampler,vertexInputs.matricesIndices[1])*vertexInputs.matricesWeights[1];
#endif 
#if NUM_BONE_INFLUENCERS>2
influence=influence+readMatrixFromRawSampler(boneSampler,vertexInputs.matricesIndices[2])*vertexInputs.matricesWeights[2];
#endif 
#if NUM_BONE_INFLUENCERS>3
influence=influence+readMatrixFromRawSampler(boneSampler,vertexInputs.matricesIndices[3])*vertexInputs.matricesWeights[3];
#endif 
#if NUM_BONE_INFLUENCERS>4
influence=influence+readMatrixFromRawSampler(boneSampler,vertexInputs.matricesIndicesExtra[0])*vertexInputs.matricesWeightsExtra[0];
#endif 
#if NUM_BONE_INFLUENCERS>5
influence=influence+readMatrixFromRawSampler(boneSampler,vertexInputs.matricesIndicesExtra[1])*vertexInputs.matricesWeightsExtra[1];
#endif 
#if NUM_BONE_INFLUENCERS>6
influence=influence+readMatrixFromRawSampler(boneSampler,vertexInputs.matricesIndicesExtra[2])*vertexInputs.matricesWeightsExtra[2];
#endif 
#if NUM_BONE_INFLUENCERS>7
influence=influence+readMatrixFromRawSampler(boneSampler,vertexInputs.matricesIndicesExtra[3])*vertexInputs.matricesWeightsExtra[3];
#endif 
#else 
influence=uniforms.mBones[i32(vertexInputs.matricesIndices[0])]*vertexInputs.matricesWeights[0];
#if NUM_BONE_INFLUENCERS>1
influence=influence+uniforms.mBones[i32(vertexInputs.matricesIndices[1])]*vertexInputs.matricesWeights[1];
#endif 
#if NUM_BONE_INFLUENCERS>2
influence=influence+uniforms.mBones[i32(vertexInputs.matricesIndices[2])]*vertexInputs.matricesWeights[2];
#endif 
#if NUM_BONE_INFLUENCERS>3
influence=influence+uniforms.mBones[i32(vertexInputs.matricesIndices[3])]*vertexInputs.matricesWeights[3];
#endif 
#if NUM_BONE_INFLUENCERS>4
influence=influence+uniforms.mBones[i32(vertexInputs.matricesIndicesExtra[0])]*vertexInputs.matricesWeightsExtra[0];
#endif 
#if NUM_BONE_INFLUENCERS>5
influence=influence+uniforms.mBones[i32(vertexInputs.matricesIndicesExtra[1])]*vertexInputs.matricesWeightsExtra[1];
#endif 
#if NUM_BONE_INFLUENCERS>6
influence=influence+uniforms.mBones[i32(vertexInputs.matricesIndicesExtra[2])]*vertexInputs.matricesWeightsExtra[2];
#endif 
#if NUM_BONE_INFLUENCERS>7
influence=influence+uniforms.mBones[i32(vertexInputs.matricesIndicesExtra[3])]*vertexInputs.matricesWeightsExtra[3];
#endif 
#endif
finalWorld=finalWorld*influence;
#endif
#endif
`,t.IncludesShadersStoreWGSL[W]||(t.IncludesShadersStoreWGSL[W]=G),Se={name:W,shader:G}})))()}var K,q,we;function Te(){return(Te=e((()=>{n(),K=`bakedVertexAnimation`,q=`#ifdef BAKED_VERTEX_ANIMATION_TEXTURE
{
#ifdef INSTANCES
let VATStartFrame: f32=vertexInputs.bakedVertexAnimationSettingsInstanced.x;let VATEndFrame: f32=vertexInputs.bakedVertexAnimationSettingsInstanced.y;let VATOffsetFrame: f32=vertexInputs.bakedVertexAnimationSettingsInstanced.z;let VATSpeed: f32=vertexInputs.bakedVertexAnimationSettingsInstanced.w;
#else
let VATStartFrame: f32=uniforms.bakedVertexAnimationSettings.x;let VATEndFrame: f32=uniforms.bakedVertexAnimationSettings.y;let VATOffsetFrame: f32=uniforms.bakedVertexAnimationSettings.z;let VATSpeed: f32=uniforms.bakedVertexAnimationSettings.w;
#endif
let totalFrames: f32=VATEndFrame-VATStartFrame+1.0;let time: f32=uniforms.bakedVertexAnimationTime*VATSpeed/totalFrames;let frameCorrection: f32=select(1.0,0.0,time<1.0);let numOfFrames: f32=totalFrames-frameCorrection;var VATFrameNum: f32=fract(time)*numOfFrames;VATFrameNum=(VATFrameNum+VATOffsetFrame) % numOfFrames;VATFrameNum=floor(VATFrameNum);VATFrameNum=VATFrameNum+VATStartFrame+frameCorrection;var VATInfluence : mat4x4<f32>;VATInfluence=readMatrixFromRawSamplerVAT(bakedVertexAnimationTexture,vertexInputs.matricesIndices[0],VATFrameNum)*vertexInputs.matricesWeights[0];
#if NUM_BONE_INFLUENCERS>1
VATInfluence=VATInfluence+readMatrixFromRawSamplerVAT(bakedVertexAnimationTexture,vertexInputs.matricesIndices[1],VATFrameNum)*vertexInputs.matricesWeights[1];
#endif
#if NUM_BONE_INFLUENCERS>2
VATInfluence=VATInfluence+readMatrixFromRawSamplerVAT(bakedVertexAnimationTexture,vertexInputs.matricesIndices[2],VATFrameNum)*vertexInputs.matricesWeights[2];
#endif
#if NUM_BONE_INFLUENCERS>3
VATInfluence=VATInfluence+readMatrixFromRawSamplerVAT(bakedVertexAnimationTexture,vertexInputs.matricesIndices[3],VATFrameNum)*vertexInputs.matricesWeights[3];
#endif
#if NUM_BONE_INFLUENCERS>4
VATInfluence=VATInfluence+readMatrixFromRawSamplerVAT(bakedVertexAnimationTexture,vertexInputs.matricesIndicesExtra[0],VATFrameNum)*vertexInputs.matricesWeightsExtra[0];
#endif
#if NUM_BONE_INFLUENCERS>5
VATInfluence=VATInfluence+readMatrixFromRawSamplerVAT(bakedVertexAnimationTexture,vertexInputs.matricesIndicesExtra[1],VATFrameNum)*vertexInputs.matricesWeightsExtra[1];
#endif
#if NUM_BONE_INFLUENCERS>6
VATInfluence=VATInfluence+readMatrixFromRawSamplerVAT(bakedVertexAnimationTexture,vertexInputs.matricesIndicesExtra[2],VATFrameNum)*vertexInputs.matricesWeightsExtra[2];
#endif
#if NUM_BONE_INFLUENCERS>7
VATInfluence=VATInfluence+readMatrixFromRawSamplerVAT(bakedVertexAnimationTexture,vertexInputs.matricesIndicesExtra[3],VATFrameNum)*vertexInputs.matricesWeightsExtra[3];
#endif
finalWorld=finalWorld*VATInfluence;}
#endif
`,t.IncludesShadersStoreWGSL[K]||(t.IncludesShadersStoreWGSL[K]=q),we={name:K,shader:q}})))()}var J,Y,Ee;function De(){return(De=e((()=>{n(),J=`bumpVertex`,Y=`#if defined(BUMP) || defined(PARALLAX) || defined(CLEARCOAT_BUMP) || defined(ANISOTROPIC)
#if defined(TANGENT) && defined(NORMAL)
var tbnNormal: vec3f=normalize(normalUpdated);var tbnTangent: vec3f=normalize(tangentUpdated.xyz);var tbnBitangent: vec3f=cross(tbnNormal,tbnTangent)*tangentUpdated.w;var matTemp= mat3x3f(finalWorld[0].xyz,finalWorld[1].xyz,finalWorld[2].xyz)* mat3x3f(tbnTangent,tbnBitangent,tbnNormal);vertexOutputs.vTBN0=matTemp[0];vertexOutputs.vTBN1=matTemp[1];vertexOutputs.vTBN2=matTemp[2];
#endif
#endif
`,t.IncludesShadersStoreWGSL[J]||(t.IncludesShadersStoreWGSL[J]=Y),Ee={name:J,shader:Y}})))()}var X,Z,Oe;function ke(){return(ke=e((()=>{n(),X=`clipPlaneVertex`,Z=`#ifdef CLIPPLANE
vertexOutputs.fClipDistance=dot(worldPos,uniforms.vClipPlane);
#endif
#ifdef CLIPPLANE2
vertexOutputs.fClipDistance2=dot(worldPos,uniforms.vClipPlane2);
#endif
#ifdef CLIPPLANE3
vertexOutputs.fClipDistance3=dot(worldPos,uniforms.vClipPlane3);
#endif
#ifdef CLIPPLANE4
vertexOutputs.fClipDistance4=dot(worldPos,uniforms.vClipPlane4);
#endif
#ifdef CLIPPLANE5
vertexOutputs.fClipDistance5=dot(worldPos,uniforms.vClipPlane5);
#endif
#ifdef CLIPPLANE6
vertexOutputs.fClipDistance6=dot(worldPos,uniforms.vClipPlane6);
#endif
`,t.IncludesShadersStoreWGSL[X]||(t.IncludesShadersStoreWGSL[X]=Z),Oe={name:X,shader:Z}})))()}var Q,$,Ae;function je(){return(je=e((()=>{n(),Q=`bayerDitherFunctions`,$=`fn bayerDither2(_P: vec2f)->f32 {return ((2.0*_P.y+_P.x+1.0)%(4.0));}
fn bayerDither4(_P: vec2f)->f32 {var P1: vec2f=((_P)%(2.0)); 
var P2: vec2f=floor(0.5*((_P)%(4.0))); 
return 4.0*bayerDither2(P1)+bayerDither2(P2);}
fn bayerDither8(_P: vec2f)->f32 {var P1: vec2f=((_P)%(2.0)); 
var P2: vec2f=floor(0.5 *((_P)%(4.0))); 
var P4: vec2f=floor(0.25*((_P)%(8.0))); 
return 4.0*(4.0*bayerDither2(P1)+bayerDither2(P2))+bayerDither2(P4);}
`,t.IncludesShadersStoreWGSL[Q]||(t.IncludesShadersStoreWGSL[Q]=$),Ae={name:Q,shader:$}})))()}export{v as A,ie as B,pe as C,x as D,fe as E,l as F,se as I,ae as L,ue as M,ce as N,S as O,le as P,oe as R,k as S,de as T,I as _,Ee as a,N as b,Te as c,be as d,xe as f,_e as g,ge as h,ke as i,m as j,_ as k,Se as l,ye as m,je as n,De as o,ve as p,Oe as r,we as s,Ae as t,Ce as u,L as v,me as w,he as x,M as y,re as z};