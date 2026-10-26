import{n as e,r as t}from"./rolldown-runtime-CNOWq4Kh.js";import{f as n,p as r}from"./runtime-COARTP6Z.js";import{Mt as i,a as ee,c as te,cn as ne,d as re,f as ie,i as ae,jt as oe,l as se,m as ce,mt as le,n as ue,o as de,p as fe,pt as pe,r as a,s as o,sn as s,t as c,u as l}from"./runtime-DMYWJ5ZP.js";import{M as u,N as d,P as f,_ as p,c as m,d as h,f as g,g as _,h as v,i as y,j as b,l as x,n as S,r as C,s as w,t as T,u as E,v as D}from"./runtime-DfGeXJUZ.js";import{A as O,D as k,F as A,I as j,M,N as me,O as N,P,bt as F,gt as I,ht as L,j as R,k as z,n as he,t as ge,yt as _e}from"./runtime-CZuZX3bo.js";var ve=t({shadowMapPixelShader:()=>U}),B,V,H,U;function W(){return(W=e((()=>{r(),oe(),S(),fe(),f(),u(),re(),B=`shadowMapPixelShader`,V=`#include<shadowMapFragmentExtraDeclaration>
#ifdef ALPHATEXTURE
varying vec2 vUV;uniform sampler2D diffuseSampler;
#endif
#include<clipPlaneFragmentDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{
#include<clipPlaneFragment>
#ifdef ALPHATEXTURE
vec4 opacityMap=texture2D(diffuseSampler,vUV);float alphaFromAlphaTexture=opacityMap.a;
#if SM_SOFTTRANSPARENTSHADOW==1
if (softTransparentShadowSM.y==1.0) {opacityMap.rgb=opacityMap.rgb*vec3(0.3,0.59,0.11);alphaFromAlphaTexture=opacityMap.x+opacityMap.y+opacityMap.z;}
#endif
#ifdef ALPHATESTVALUE
if (alphaFromAlphaTexture<ALPHATESTVALUE)
discard;
#endif
#endif
#if SM_SOFTTRANSPARENTSHADOW==1
#ifdef ALPHATEXTURE
if ((bayerDither8(floor(mod(gl_FragCoord.xy,8.0))))/64.0>=softTransparentShadowSM.x*alphaFromAlphaTexture) discard;
#else
if ((bayerDither8(floor(mod(gl_FragCoord.xy,8.0))))/64.0>=softTransparentShadowSM.x) discard;
#endif
#endif
#include<shadowMapFragment>
}`,n.ShadersStore[B]||(n.ShadersStore[B]=V),H=[i,T,ce,d,b,ie];for(let e of H)n.IncludesShadersStore[e.name]||(n.IncludesShadersStore[e.name]=e.shader);U={name:B,shader:V}})))()}var ye=t({shadowMapVertexShader:()=>J}),G,K,q,J;function Y(){return(Y=e((()=>{r(),D(),_(),A(),me(),I(),pe(),ge(),se(),s(),_e(),o(),ee(),g(),R(),z(),k(),E(),m(),a(),c(),y(),G=`shadowMapVertexShader`,K=`attribute vec3 position;
#ifdef NORMAL
attribute vec3 normal;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#ifdef INSTANCES
attribute vec4 world0;attribute vec4 world1;attribute vec4 world2;attribute vec4 world3;
#endif
#include<helperFunctions>
#include<__decl__shadowMapVertex>
#ifdef ALPHATEXTURE
varying vec2 vUV;uniform mat4 diffuseMatrix;
#ifdef UV1
attribute vec2 uv;
#endif
#ifdef UV2
attribute vec2 uv2;
#endif
#endif
#include<shadowMapVertexExtraDeclaration>
#include<clipPlaneVertexDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
void main(void)
{vec3 positionUpdated=position;
#ifdef UV1
vec2 uvUpdated=uv;
#endif
#ifdef UV2
vec2 uv2Updated=uv2;
#endif
#ifdef NORMAL
vec3 normalUpdated=normal;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(positionUpdated,1.0);
#ifdef NORMAL
mat3 normWorldSM=mat3(finalWorld);
#if defined(INSTANCES) && defined(THIN_INSTANCES)
vec3 vNormalW=normalUpdated/vec3(dot(normWorldSM[0],normWorldSM[0]),dot(normWorldSM[1],normWorldSM[1]),dot(normWorldSM[2],normWorldSM[2]));vNormalW=normalize(normWorldSM*vNormalW);
#else
#ifdef NONUNIFORMSCALING
normWorldSM=transposeMat3(inverseMat3(normWorldSM));
#endif
vec3 vNormalW=normalize(normWorldSM*normalUpdated);
#endif
#endif
#include<shadowMapVertexNormalBias>
gl_Position=viewProjection*worldPos;
#include<shadowMapVertexMetric>
#ifdef ALPHATEXTURE
#ifdef UV1
vUV=vec2(diffuseMatrix*vec4(uvUpdated,1.0,0.0));
#endif
#ifdef UV2
vUV=vec2(diffuseMatrix*vec4(uv2Updated,1.0,0.0));
#endif
#endif
#include<clipPlaneVertex>
}`,n.ShadersStore[G]||(n.ShadersStore[G]=K),q=[p,v,j,P,L,le,he,l,ne,F,te,de,h,M,O,N,x,w,ae,ue,C];for(let e of q)n.IncludesShadersStore[e.name]||(n.IncludesShadersStore[e.name]=e.shader);J={name:G,shader:K}})))()}var be=t({textureProcessorPixelShader:()=>Q}),X,Z,Q;function $(){return($=e((()=>{r(),X=`textureProcessorPixelShader`,Z=`#ifdef OPERAND_A_TEXTURE
uniform sampler2D textureA;
#endif
#ifdef OPERAND_B_TEXTURE
uniform sampler2D textureB;
#endif
#if defined(OP_LERP) && defined(LERP_T_TEXTURE)
uniform sampler2D textureT;
#endif
#ifdef OPERAND_A_MATRIX
uniform mat4 textureAMatrix;
#endif
#ifdef OPERAND_B_MATRIX
uniform mat4 textureBMatrix;
#endif
#if defined(OP_LERP) && defined(LERP_T_MATRIX)
uniform mat4 textureTMatrix;
#endif
#if !defined(OPERAND_A_TEXTURE) || defined(OPERAND_A_FACTOR)
uniform vec4 factorA;
#endif
#if !defined(OPERAND_B_TEXTURE) || defined(OPERAND_B_FACTOR)
uniform vec4 factorB;
#endif
#if defined(OP_LERP) && (!defined(LERP_T_TEXTURE) || defined(LERP_T_FACTOR))
uniform vec4 factorT;
#endif
varying vec2 vUV;void main() {vec2 uv=vUV;
#ifdef OPERAND_A_TEXTURE
#ifdef OPERAND_A_MATRIX
vec4 a=texture2D(textureA,(textureAMatrix*vec4(uv,0.0,1.0)).xy);
#else
vec4 a=texture2D(textureA,uv);
#endif
#ifdef OPERAND_A_SRGB
a.rgb=mix(a.rgb/12.92,pow((a.rgb+0.055)/1.055,vec3(2.4)),step(vec3(0.04045),a.rgb));
#endif
#ifdef OPERAND_A_CHANNEL_R
a=vec4(a.rrr,a.a);
#elif defined(OPERAND_A_CHANNEL_G)
a=vec4(a.ggg,a.a);
#elif defined(OPERAND_A_CHANNEL_B)
a=vec4(a.bbb,a.a);
#elif defined(OPERAND_A_CHANNEL_A)
a=a.aaaa;
#endif
#ifdef OPERAND_A_FACTOR
a*=factorA;
#endif
#else
vec4 a=factorA;
#endif
#ifdef OPERAND_B_TEXTURE
#ifdef OPERAND_B_MATRIX
vec4 b=texture2D(textureB,(textureBMatrix*vec4(uv,0.0,1.0)).xy);
#else
vec4 b=texture2D(textureB,uv);
#endif
#ifdef OPERAND_B_SRGB
b.rgb=mix(b.rgb/12.92,pow((b.rgb+0.055)/1.055,vec3(2.4)),step(vec3(0.04045),b.rgb));
#endif
#ifdef OPERAND_B_CHANNEL_R
b=vec4(b.rrr,b.a);
#elif defined(OPERAND_B_CHANNEL_G)
b=vec4(b.ggg,b.a);
#elif defined(OPERAND_B_CHANNEL_B)
b=vec4(b.bbb,b.a);
#elif defined(OPERAND_B_CHANNEL_A)
b=b.aaaa;
#endif
#ifdef OPERAND_B_FACTOR
b*=factorB;
#endif
#else
vec4 b=factorB;
#endif
#ifdef OP_CHANNEL_MAX
float _cmax=max(max(a.r,a.g),a.b);
#ifdef CHANNEL_MAX_INCLUDE_ALPHA
_cmax=max(_cmax,a.a);vec4 result=vec4(_cmax,_cmax,_cmax,_cmax);
#else
vec4 result=vec4(_cmax,_cmax,_cmax,a.a);
#endif
#elif defined(OP_INVERT)
float _ir=a.r; float _ig=a.g; float _ib=a.b; float _ia=a.a;
#ifdef INVERT_R
_ir=1.0-_ir;
#endif
#ifdef INVERT_G
_ig=1.0-_ig;
#endif
#ifdef INVERT_B
_ib=1.0-_ib;
#endif
#ifdef INVERT_A
_ia=1.0-_ia;
#endif
vec4 result=vec4(_ir,_ig,_ib,_ia);
#elif defined(OP_LERP)
#ifdef LERP_T_TEXTURE
#ifdef LERP_T_MATRIX
vec4 t=texture2D(textureT,(textureTMatrix*vec4(uv,0.0,1.0)).xy);
#else
vec4 t=texture2D(textureT,uv);
#endif
#ifdef LERP_T_SRGB
t.rgb=mix(t.rgb/12.92,pow((t.rgb+0.055)/1.055,vec3(2.4)),step(vec3(0.04045),t.rgb));
#endif
#ifdef LERP_T_CHANNEL_R
t=vec4(t.rrr,t.a);
#elif defined(LERP_T_CHANNEL_G)
t=vec4(t.ggg,t.a);
#elif defined(LERP_T_CHANNEL_B)
t=vec4(t.bbb,t.a);
#elif defined(LERP_T_CHANNEL_A)
t=t.aaaa;
#endif
#ifdef LERP_T_FACTOR
t*=factorT;
#endif
#else
vec4 t=factorT;
#endif
vec4 result=mix(a,b,t);
#elif defined(OP_MAX)
vec4 result=max(a,b);
#else
vec4 result=a*b;
#endif
#ifdef OUTPUT_MASK_R_ZERO
result.r=0.0;
#endif
#ifdef OUTPUT_MASK_G_ZERO
result.g=0.0;
#endif
#ifdef OUTPUT_MASK_B_ZERO
result.b=0.0;
#endif
#ifdef OUTPUT_MASK_A_ONE
result.a=1.0;
#endif
#ifdef OUTPUT_SRGB
result.rgb=mix(result.rgb*12.92,pow(result.rgb,vec3(1.0/2.4))*1.055-0.055,step(vec3(0.0031308),result.rgb));
#endif
gl_FragColor=result;}
`,n.ShadersStore[X]||(n.ShadersStore[X]=Z),Q={name:X,shader:Z}})))()}export{W as a,ye as i,be as n,ve as o,Y as r,$ as t};