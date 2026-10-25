import{n as e,r as t}from"./rolldown-runtime-B0fFmPBj.js";import{f as n,p as r}from"./runtime-80dgCbxm.js";import{$ as ee,A as te,At as ne,B as re,Bt as ie,C as ae,Ct as oe,D as se,Dt as ce,E as le,Et as i,F as ue,Ft as de,G as fe,Gt as pe,H as me,Ht as he,I as ge,It as _e,J as ve,Jt as a,K as ye,Kt as be,L as xe,Lt as Se,M as Ce,Mt as we,N as Te,Nt as Ee,O as De,Ot as Oe,P as ke,Pt as Ae,Q as je,R as Me,Rt as Ne,S as Pe,St as Fe,T as Ie,Tt as o,U as Le,Ut as Re,V as ze,Vt as Be,W as Ve,Wt as He,X as Ue,Y as We,Z as Ge,_ as Ke,_t as qe,a as Je,at as Ye,b as Xe,bt as Ze,c as Qe,ct as $e,d as et,dt as tt,et as nt,f as rt,ft as it,g as at,gt as ot,h as st,ht as ct,i as lt,it as ut,j as dt,jt as ft,k as pt,kt as mt,l as ht,lt as gt,m as _t,mt as vt,n as yt,nt as bt,o as xt,ot as St,p as Ct,pt as wt,q as Tt,qt as s,r as Et,rt as Dt,s as Ot,st as kt,t as At,tt as jt,u as Mt,ut as Nt,v as Pt,vt as Ft,w as It,wt as Lt,x as Rt,xt as zt,y as Bt,yt as Vt,z as Ht,zt as Ut}from"./runtime-C2hiUyDL.js";import{A as Wt,B as Gt,Bt as Kt,C as qt,Ct as c,D as Jt,Dt as Yt,E as Xt,Et as Zt,F as Qt,Ft as $t,G as en,Gt as tn,H as nn,Ht as rn,I as an,It as on,Jt as l,K as sn,Kt as cn,L as ln,Lt as un,M as dn,Mt as fn,N as pn,Nt as mn,O as hn,Ot as gn,P as _n,Pt as vn,Qt as yn,R as bn,Rt as xn,S as Sn,St as u,T as Cn,Tt as d,U as wn,Ut as Tn,V as En,Vt as Dn,W as On,Wt as kn,Xt as An,Yt as jn,Zt as Mn,_ as Nn,_t as f,a as Pn,an as Fn,at as In,b as Ln,bt as p,c as Rn,cn as m,ct as zn,d as Bn,dn as Vn,dt as Hn,f as Un,fn as Wn,ft as Gn,g as Kn,gn as h,gt as qn,h as Jn,hn as g,ht as Yn,i as Xn,in as Zn,it as Qn,j as $n,jt as er,k as tr,l as nr,ln as _,lt as rr,m as ir,mn as ar,mt as or,n as sr,nt as v,o as cr,on as lr,ot as ur,p as dr,pn as fr,pt as pr,qt as y,r as mr,rn as hr,rt as gr,s as _r,sn as b,st as vr,t as yr,tt as x,u as br,un as S,ut as xr,v as Sr,vt as C,w as Cr,wt as w,x as wr,xt as Tr,y as Er,yt as Dr,z as Or,zt as kr}from"./runtime-Df3eIvXu.js";import{A as Ar,C as jr,D as Mr,E as Nr,L as Pr,M as Fr,N as Ir,O as Lr,P as Rr,R as zr,T as Br,_ as T,a as Vr,b as Hr,c as E,d as D,f as O,g as k,h as A,i as j,j as Ur,k as M,l as N,m as Wr,n as Gr,o as Kr,p as qr,r as P,s as F,t as Jr,u as I,v as L,w as Yr,y as Xr}from"./runtime-DyTznOqg.js";import{a as Zr,c as Qr,d as $r,f as ei,i as ti,l as ni,m as ri,n as ii,o as ai,p as oi,r as si,s as ci,t as li,u as ui}from"./runtime-CEErS56D.js";var di=t({openpbrPixelShaderWGSL:()=>pi}),R,z,fi,pi;function mi(){return(mi=e((()=>{r(),fr(),pe(),Vn(),s(),g(),en(),_(),Vt(),Fn(),Be(),ce(),wn(),yn(),Ar(),y(),cn(),oi(),m(),li(),nn(),qe(),An(),Re(),v(),hr(),ct(),wt(),o(),Gt(),zr(),tt(),gt(),kt(),oe(),ln(),Qt(),Ut(),Hn(),pn(),$n(),rr(),vr(),tr(),Lr(),Ye(),Jt(),Cn(),qt(),gr(),In(),wr(),Er(),Nn(),Jn(),Hr(),dr(),Bn(),nr(),_r(),Dn(),Kt(),Dt(),un(),Pn(),$t(),jt(),R=`openpbrPixelShader`,z=`#define OPENPBR_FRAGMENT_SHADER
#define CUSTOM_FRAGMENT_BEGIN
#include<prePassDeclaration>[SCENE_MRT_COUNT]
#include<oitDeclaration>
#ifndef FROMLINEARSPACE
#define FROMLINEARSPACE
#endif
#include<openpbrUboDeclaration>
#include<pbrFragmentExtraDeclaration>
#include<lightUboDeclaration>[0..maxSimultaneousLights]
#include<openpbrFragmentSamplersDeclaration>
#include<imageProcessingDeclaration>
#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#include<fogFragmentDeclaration>
#include<textureRepetitionFunctions>
#include<helperFunctions>
#include<subSurfaceScatteringFunctions>
#include<importanceSampling>
#include<pbrHelperFunctions>
#include<imageProcessingFunctions>
#include<shadowsFragmentFunctions>
#include<harmonicsFunctions>
#include<pbrDirectLightingSetupFunctions>
#include<pbrDirectLightingFalloffFunctions>
#include<pbrBRDFFunctions>
#include<hdrFilteringFunctions>
#include<pbrDirectLightingFunctions>
#include<pbrIBLFunctions>
#include<openpbrNormalMapFragmentMainFunctions>
#include<openpbrNormalMapFragmentFunctions>
#ifdef REFLECTION
#include<reflectionFunction>
#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
#include<openpbrDielectricReflectance>
#include<openpbrConductorReflectance>
#include<openpbrAmbientOcclusionFunctions>
#include<openpbrGeometryInfo>
#include<openpbrIblFunctions>
#include<openpbrVolumeFunctions>
fn layer(slab_bottom: vec3f,slab_top: vec3f,lerp_factor: f32,bottom_multiplier: vec3f,top_multiplier: vec3f)->vec3f {return mix(slab_bottom*bottom_multiplier,slab_top*top_multiplier,lerp_factor);}
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#ifdef PREPASS_IRRADIANCE
var total_direct_diffuse: vec3f=vec3f(0.0f);
#endif
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
#include<pbrBlockNormalGeometric>
var coatNormalW: vec3f=normalW;
#include<openpbrNormalMapFragment>
#include<openpbrBlockNormalFinal>
#include<openpbrBaseLayerData>
#include<openpbrTransmissionLayerData>
#include<openpbrSubsurfaceLayerData>
#include<openpbrCoatLayerData>
#include<openpbrThinFilmLayerData>
#include<openpbrFuzzLayerData>
#include<openpbrAmbientOcclusionData>
#define CUSTOM_FRAGMENT_UPDATE_ALPHA
#define DEPTHPREPASS_SKIP_EARLY_RETURN
#include<depthPrePass>
#ifndef DEPTHPREPASS
#define CUSTOM_FRAGMENT_BEFORE_LIGHTS
#ifdef ANISOTROPIC_COAT
let coatGeoInfo: geometryInfoAnisoOutParams=geometryInfoAniso(
coatNormalW,viewDirectionW.xyz,coat_roughness,geometricNormalW
,vec3f(geometry_coat_tangent.x,geometry_coat_tangent.y,coat_roughness_anisotropy),TBN
);
#else
let coatGeoInfo: geometryInfoOutParams=geometryInfo(
coatNormalW,viewDirectionW.xyz,coat_roughness,geometricNormalW
);
#endif
specular_roughness=mix(specular_roughness,pow(min(1.0f,pow(specular_roughness,4.0f)+2.0f*pow(coat_roughness,4.0f)),0.25f),coat_weight);
#ifdef ANISOTROPIC_BASE
let baseGeoInfo: geometryInfoAnisoOutParams=geometryInfoAniso(
normalW,viewDirectionW.xyz,specular_roughness,geometricNormalW
,vec3f(geometry_tangent.x,geometry_tangent.y,specular_roughness_anisotropy),TBN
);
#else
let baseGeoInfo: geometryInfoOutParams=geometryInfo(
normalW,viewDirectionW.xyz,specular_roughness,geometricNormalW
);
#endif
#ifdef FUZZ
let fuzzNormalW=normalize(mix(normalW,coatNormalW,coat_weight));var fuzzTangent=normalize(TBN[0]);fuzzTangent=normalize(fuzzTangent-dot(fuzzTangent,fuzzNormalW)*fuzzNormalW);let fuzzBitangent=cross(fuzzNormalW,fuzzTangent);let fuzzGeoInfo: geometryInfoOutParams=geometryInfo(
fuzzNormalW,viewDirectionW.xyz,fuzz_roughness,geometricNormalW
);
#endif
let coatReflectance: ReflectanceParams=dielectricReflectance(
coat_ior 
,1.0f 
,vec3f(1.0f)
,coat_weight
);
#ifdef THIN_FILM
let thin_film_outside_ior: f32=mix(1.0f,coat_ior,coat_weight);
#endif
let baseDielectricReflectance: ReflectanceParams=dielectricReflectance(
specular_ior 
,mix(1.0f,coat_ior,coat_weight) 
,specular_color
,specular_weight
);let baseConductorReflectance: ReflectanceParams=conductorReflectance(base_color,specular_color,specular_weight);var volume_absorption: vec3f=vec3f(1.0f);var transmission_tint: vec3f=vec3f(1.0f);var surface_translucency_weight: f32=0.0f;
#if defined(REFRACTED_BACKGROUND) || defined(REFRACTED_ENVIRONMENT) || defined(REFRACTED_LIGHTS)
#if defined(GEOMETRY_THIN_WALLED)
let refractedViewVector: vec3f=-viewDirectionW;
#else
#ifdef DISPERSION
var refractedViewVectors: array<vec3f,3>;let iorDispersionSpread: f32=transmission_dispersion_scale/transmission_dispersion_abbe_number*(specular_ior-1.0f);let dispersion_iors: vec3f=vec3f(specular_ior-iorDispersionSpread,specular_ior,specular_ior+iorDispersionSpread);for (var i: i32=0; i<3; i++) {refractedViewVectors[i]=double_refract(-viewDirectionW,normalW,dispersion_iors[i]); }
#else
let refractedViewVector: vec3f=double_refract(-viewDirectionW,normalW,specular_ior);
#endif
#endif
#ifdef GEOMETRY_THIN_WALLED
var transmission_roughness: f32=specular_roughness;
#else
var transmission_roughness: f32=specular_roughness*clamp(4.0f*(specular_ior-1.0f),0.001f,1.0f);
#endif
#if (defined(TRANSMISSION_SLAB) || defined(SUBSURFACE_SLAB))
var volumeParams: OpenPBRHomogeneousVolume;{
#if defined(TRANSMISSION_SLAB)
let transmissionVolumeParams: OpenPBRHomogeneousVolume=computeOpenPBRTransmissionVolume(
transmission_color.rgb,
transmission_depth,
transmission_scatter.rgb,
transmission_scatter_anisotropy
);
#endif
#if defined(SUBSURFACE_SLAB)
let subsurfaceVolumeParams: OpenPBRHomogeneousVolume=computeOpenPBRSubsurfaceVolume(
subsurface_color.rgb,
subsurface_radius,
subsurface_radius_scale.rgb,
subsurface_scatter_anisotropy
);
#endif
#if !defined(TRANSMISSION_SLAB)
volumeParams=subsurfaceVolumeParams;surface_translucency_weight=subsurface_weight;
#elif !defined(SUBSURFACE_SLAB)
volumeParams=transmissionVolumeParams;
#ifdef TRANSMISSION_SLAB_VOLUME
volumeParams.multi_scatter_color=singleScatterToMultiScatterAlbedo(volumeParams.ss_albedo);
#endif
surface_translucency_weight=transmission_weight;
#else
let subsurface_fraction_of_dielectric: f32=(1.0f-transmission_weight)*subsurface_weight;let subsurface_and_transmission_fraction_of_dielectric: f32=subsurface_fraction_of_dielectric+transmission_weight;let reciprocal_of_subsurface_and_transmission_fraction_of_dielectric: f32 =
1.0f/maxEps(subsurface_and_transmission_fraction_of_dielectric);let trans_weight: f32=transmission_weight*reciprocal_of_subsurface_and_transmission_fraction_of_dielectric;let subsurf_weight: f32=subsurface_fraction_of_dielectric*reciprocal_of_subsurface_and_transmission_fraction_of_dielectric;volumeParams.scatter_coeff=transmissionVolumeParams.scatter_coeff*trans_weight+subsurfaceVolumeParams.scatter_coeff*subsurf_weight;volumeParams.absorption_coeff=transmissionVolumeParams.absorption_coeff*trans_weight+subsurfaceVolumeParams.absorption_coeff*subsurf_weight;volumeParams.anisotropy=(transmissionVolumeParams.anisotropy*trans_weight+subsurfaceVolumeParams.anisotropy*subsurf_weight)/maxEps(trans_weight+subsurf_weight);volumeParams.extinction_coeff=volumeParams.absorption_coeff+volumeParams.scatter_coeff;volumeParams.ss_albedo=volumeParams.scatter_coeff/maxEpsVec3(volumeParams.extinction_coeff);volumeParams.multi_scatter_color=singleScatterToMultiScatterAlbedo(volumeParams.ss_albedo);surface_translucency_weight=subsurface_and_transmission_fraction_of_dielectric;
#endif
}
volume_absorption=exp(-volumeParams.absorption_coeff*geometry_thickness);var backscatter_color: vec3f=vec3f(1.0f);{let reduced_scatter: vec3f=volumeParams.scatter_coeff*vec3f(1.0f-volumeParams.anisotropy);let reduced_albedo: vec3f=reduced_scatter/(volumeParams.absorption_coeff+reduced_scatter);let sqrt_term: vec3f=max(sqrt(vec3f(1.0f)-reduced_albedo),vec3f(0.0001f));backscatter_color=(vec3f(1.0f)-sqrt_term)/(vec3f(1.0f)+sqrt_term);}
#elif defined(TRANSMISSION_SLAB)
surface_translucency_weight=transmission_weight;
#endif
#ifdef SCATTERING
#ifdef GEOMETRY_THIN_WALLED
var iso_scatter_density: vec3f=vec3f(1.0f);
#else
#ifdef USE_IRRADIANCE_TEXTURE_FOR_SCATTERING
let mfp: vec3f=vec3f(100.0f)/volumeParams.extinction_coeff;var scattered_light_from_irradiance_texture: vec3f=sss_convolve(sceneIrradianceSampler,sceneDepthSampler,uniforms.renderTargetSize,mfp,scene.projection,scene.inverseProjection,SSS_SAMPLE_COUNT,noise.xy);var numLights=f32(LIGHTCOUNT);
#ifdef REFLECTION
numLights+=1.0f;
#endif
scattered_light_from_irradiance_texture/=vec3f(numLights);
#else
let scattered_light_from_irradiance_texture: vec3f=vec3f(0.0f);
#endif
let back_to_iso_scattering_blend: f32=min(1.0f+volumeParams.anisotropy,1.0f);let iso_to_forward_scattering_blend: f32=max(volumeParams.anisotropy,0.0f);let iso_scatter_transmittance: vec3f=pow(exp(-volumeParams.scatter_coeff*geometry_thickness),vec3f(0.2f));var iso_scatter_density: vec3f=clamp(vec3f(1.0f)-iso_scatter_transmittance,vec3f(0.0f),vec3f(1.0f));transmission_roughness=min(transmission_roughness+pow((1.0f-abs(volumeParams.anisotropy))*max3(iso_scatter_density*iso_scatter_density),3.0f),1.0f);
#endif
volumeParams.multi_scatter_color=mix(volumeParams.ss_albedo,volumeParams.multi_scatter_color,max3(iso_scatter_density));
#endif
#if defined(TRANSMISSION_SLAB) && (!defined(TRANSMISSION_SLAB_VOLUME) || defined(GEOMETRY_THIN_WALLED))
transmission_tint*=transmission_color.rgb;
#ifdef GEOMETRY_THIN_WALLED
var sin2: f32=1.0f-baseGeoInfo.NdotV*baseGeoInfo.NdotV;sin2=sin2/(specular_ior*specular_ior);let cos_t: f32=sqrt(1.0f-sin2);let pathLength: f32=1.0f/cos_t;transmission_tint=pow(transmission_tint,vec3f(pathLength));
#else
transmission_tint*=transmission_color.rgb;
#endif
#endif
#if defined(SUBSURFACE_SLAB) && defined(GEOMETRY_THIN_WALLED)
let unweighted_translucency: f32=max(mix(subsurface_weight,1.0f,transmission_weight),0.0001f);transmission_tint=mix(vec3f(1.0f),transmission_tint,transmission_weight/unweighted_translucency);transmission_roughness=mix(1.0f,transmission_roughness,transmission_weight/unweighted_translucency);
#endif
let transmission_roughness_alpha: f32=transmission_roughness*transmission_roughness;
#endif
#include<openpbrBackgroundTransmission>
var material_surface_ibl: vec3f=vec3f(0.f,0.f,0.f);
#include<openpbrEnvironmentLighting>
var material_surface_direct: vec3f=vec3f(0.f,0.f,0.f);
#if defined(LIGHT0)
var aggShadow: f32=0.f;
#include<openpbrDirectLightingInit>[0..maxSimultaneousLights]
#include<openpbrDirectLighting>[0..maxSimultaneousLights]
#endif
var material_surface_emission: vec3f=uniforms.vEmissionColor;
#ifdef EMISSION_COLOR
let emissionColorTex: vec3f=textureSample(emissionColorSampler,emissionColorSamplerSampler,fragmentInputs.vEmissionColorUV+uvOffset).rgb;
#ifdef EMISSION_COLOR_GAMMA
material_surface_emission*=toLinearSpaceVec3(emissionColorTex.rgb);
#else
material_surface_emission*=emissionColorTex.rgb;
#endif
material_surface_emission*= uniforms.vEmissionColorInfos.y;
#endif
material_surface_emission*=uniforms.vLightingIntensity.y;
#define CUSTOM_FRAGMENT_BEFORE_FINALCOLORCOMPOSITION
var finalColor: vec4f=vec4f(material_surface_ibl+material_surface_direct+material_surface_emission,alpha);
#define CUSTOM_FRAGMENT_BEFORE_FOG
finalColor=max(finalColor,vec4f(0.0));
#include<logDepthFragment>
#include<fogFragment>(color,finalColor)
#include<pbrBlockImageProcessing>
#define CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR
#ifdef PREPASS
#include<openpbrBlockPrePass>
#endif
#if !defined(PREPASS) && !defined(ORDER_INDEPENDENT_TRANSPARENCY)
fragmentOutputs.color=finalColor;
#endif
#include<oitFragment>
#if ORDER_INDEPENDENT_TRANSPARENCY
if (fragDepth==nearestDepth) {fragmentOutputs.frontColor=vec4f(fragmentOutputs.frontColor.rgb+finalColor.rgb*finalColor.a*alphaMultiplier,1.0-alphaMultiplier*(1.0-finalColor.a));} else {fragmentOutputs.backColor+=finalColor;}
#endif
#include<pbrDebug>
#define CUSTOM_FRAGMENT_MAIN_END
#endif
}
`,n.ShadersStoreWGSL[R]||(n.ShadersStoreWGSL[R]=z),fi=[ar,be,Wn,a,h,sn,S,Ze,lr,he,Oe,On,Mn,M,l,tn,ri,b,ii,En,Ft,jn,He,x,Zn,ot,vt,i,Or,Pr,it,Nt,$e,Lt,bn,an,ie,Gn,_n,dn,xr,zn,Wt,Mr,St,hn,Xt,Cr,Qn,ur,Sn,Ln,Sr,Kn,Xr,ir,Un,br,Rn,rn,kr,ut,xn,cr,on,bt];for(let e of fi)n.IncludesShadersStoreWGSL[e.name]||(n.IncludesShadersStoreWGSL[e.name]=e.shader);pi={name:R,shader:z}})))()}var hi=t({openpbrVertexShaderWGSL:()=>_i}),B,V,gi,_i;function vi(){return(vi=e((()=>{r(),s(),g(),en(),$r(),_(),m(),o(),L(),k(),mn(),Se(),de(),v(),mr(),O(),fn(),Yt(),d(),c(),y(),ni(),ci(),Tr(),Dr(),f(),I(),E(),Ee(),Zr(),ft(),yr(),j(),qn(),mt(),si(),pr(),B=`openpbrVertexShader`,V=`#define OPENPBR_VERTEX_SHADER
#include<openpbrUboDeclaration>
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
#include<mainUVVaryingDeclaration>[1..7]
#include<helperFunctions>
#include<pbrBRDFFunctions>
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<instancesDeclaration>
#include<prePassVertexDeclaration>
#include<samplerVertexDeclaration>(_DEFINENAME_,BASE_COLOR,_VARYINGNAME_,BaseColor)
#include<samplerVertexDeclaration>(_DEFINENAME_,BASE_WEIGHT,_VARYINGNAME_,BaseWeight)
#include<samplerVertexDeclaration>(_DEFINENAME_,BASE_DIFFUSE_ROUGHNESS,_VARYINGNAME_,BaseDiffuseRoughness)
#include<samplerVertexDeclaration>(_DEFINENAME_,BASE_METALNESS,_VARYINGNAME_,BaseMetalness)
#include<samplerVertexDeclaration>(_DEFINENAME_,SPECULAR_WEIGHT,_VARYINGNAME_,SpecularWeight)
#include<samplerVertexDeclaration>(_DEFINENAME_,SPECULAR_COLOR,_VARYINGNAME_,SpecularColor)
#include<samplerVertexDeclaration>(_DEFINENAME_,SPECULAR_ROUGHNESS,_VARYINGNAME_,SpecularRoughness)
#include<samplerVertexDeclaration>(_DEFINENAME_,SPECULAR_ROUGHNESS_ANISOTROPY,_VARYINGNAME_,SpecularRoughnessAnisotropy)
#include<samplerVertexDeclaration>(_DEFINENAME_,TRANSMISSION_WEIGHT,_VARYINGNAME_,TransmissionWeight)
#include<samplerVertexDeclaration>(_DEFINENAME_,TRANSMISSION_COLOR,_VARYINGNAME_,TransmissionColor)
#include<samplerVertexDeclaration>(_DEFINENAME_,TRANSMISSION_DEPTH,_VARYINGNAME_,TransmissionDepth)
#include<samplerVertexDeclaration>(_DEFINENAME_,TRANSMISSION_SCATTER,_VARYINGNAME_,TransmissionScatter)
#include<samplerVertexDeclaration>(_DEFINENAME_,TRANSMISSION_DISPERSION_SCALE,_VARYINGNAME_,TransmissionDispersionScale)
#include<samplerVertexDeclaration>(_DEFINENAME_,SUBSURFACE_WEIGHT,_VARYINGNAME_,SubsurfaceWeight)
#include<samplerVertexDeclaration>(_DEFINENAME_,SUBSURFACE_COLOR,_VARYINGNAME_,SubsurfaceColor)
#include<samplerVertexDeclaration>(_DEFINENAME_,SUBSURFACE_RADIUS_SCALE,_VARYINGNAME_,SubsurfaceRadiusScale)
#include<samplerVertexDeclaration>(_DEFINENAME_,COAT_WEIGHT,_VARYINGNAME_,CoatWeight)
#include<samplerVertexDeclaration>(_DEFINENAME_,COAT_COLOR,_VARYINGNAME_,CoatColor)
#include<samplerVertexDeclaration>(_DEFINENAME_,COAT_ROUGHNESS,_VARYINGNAME_,CoatRoughness)
#include<samplerVertexDeclaration>(_DEFINENAME_,COAT_ROUGHNESS_ANISOTROPY,_VARYINGNAME_,CoatRoughnessAnisotropy)
#include<samplerVertexDeclaration>(_DEFINENAME_,COAT_DARKENING,_VARYINGNAME_,CoatDarkening)
#include<samplerVertexDeclaration>(_DEFINENAME_,FUZZ_WEIGHT,_VARYINGNAME_,FuzzWeight)
#include<samplerVertexDeclaration>(_DEFINENAME_,FUZZ_COLOR,_VARYINGNAME_,FuzzColor)
#include<samplerVertexDeclaration>(_DEFINENAME_,FUZZ_ROUGHNESS,_VARYINGNAME_,FuzzRoughness)
#include<samplerVertexDeclaration>(_DEFINENAME_,GEOMETRY_NORMAL,_VARYINGNAME_,GeometryNormal)
#include<samplerVertexDeclaration>(_DEFINENAME_,GEOMETRY_TANGENT,_VARYINGNAME_,GeometryTangent)
#include<samplerVertexDeclaration>(_DEFINENAME_,GEOMETRY_COAT_NORMAL,_VARYINGNAME_,GeometryCoatNormal)
#include<samplerVertexDeclaration>(_DEFINENAME_,GEOMETRY_OPACITY,_VARYINGNAME_,GeometryOpacity)
#include<samplerVertexDeclaration>(_DEFINENAME_,GEOMETRY_THICKNESS,_VARYINGNAME_,GeometryThickness)
#include<samplerVertexDeclaration>(_DEFINENAME_,EMISSION_COLOR,_VARYINGNAME_,EmissionColor)
#include<samplerVertexDeclaration>(_DEFINENAME_,THIN_FILM_WEIGHT,_VARYINGNAME_,ThinFilmWeight)
#include<samplerVertexDeclaration>(_DEFINENAME_,THIN_FILM_THICKNESS,_VARYINGNAME_,ThinFilmThickness)
#include<samplerVertexDeclaration>(_DEFINENAME_,AMBIENT_OCCLUSION,_VARYINGNAME_,AmbientOcclusion)
#include<samplerVertexDeclaration>(_DEFINENAME_,DECAL,_VARYINGNAME_,Decal)
#include<samplerVertexDeclaration>(_DEFINENAME_,DETAIL,_VARYINGNAME_,Detail)
varying vPositionW: vec3f;
#if DEBUGMODE>0
varying vClipSpacePosition: vec4f;
#endif
#ifdef NORMAL
varying vNormalW: vec3f;
#if defined(USESPHERICALFROMREFLECTIONMAP) && defined(USESPHERICALINVERTEX)
varying vEnvironmentIrradiance: vec3f;
#include<harmonicsFunctions>
#endif
#endif
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
varying vColor: vec4f;
#endif
#include<openpbrNormalMapVertexDeclaration>
#include<clipPlaneVertexDeclaration>
#include<fogVertexDeclaration>
#include<lightVxUboDeclaration>[0..maxSimultaneousLights]
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#ifdef REFLECTIONMAP_SKYBOX
varying vPositionUVW: vec3f;
#endif
#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)
varying vDirectionW: vec3f;
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
var worldPos: vec4f=finalWorld* vec4f(positionUpdated,1.0);vertexOutputs.vPositionW= worldPos.xyz;
#ifdef PREPASS
#include<prePassVertex>
#endif
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
#if defined(USESPHERICALFROMREFLECTIONMAP) && defined(USESPHERICALINVERTEX)
#if BASE_DIFFUSE_MODEL != BRDF_DIFFUSE_MODEL_LAMBERT && BASE_DIFFUSE_MODEL != BRDF_DIFFUSE_MODEL_LEGACY
var viewDirectionW: vec3f=normalize(scene.vEyePosition.xyz-vertexOutputs.vPositionW);var NdotV: f32=max(dot(vertexOutputs.vNormalW,viewDirectionW),0.0);var roughNormal: vec3f=mix(vertexOutputs.vNormalW,viewDirectionW,(0.5*(1.0-NdotV))*uniforms.vBaseDiffuseRoughness);var reflectionVector: vec3f= (uniforms.reflectionMatrix* vec4f(roughNormal,0)).xyz;
#else
var reflectionVector: vec3f= (uniforms.reflectionMatrix* vec4f(vertexOutputs.vNormalW,0)).xyz;
#endif
#ifdef REFLECTIONMAP_OPPOSITEZ
reflectionVector.z*=-1.0;
#endif
vertexOutputs.vEnvironmentIrradiance=computeEnvironmentIrradiance(reflectionVector);
#endif
#endif
#define CUSTOM_VERTEX_UPDATE_WORLDPOS
#ifdef MULTIVIEW
if (gl_ViewID_OVR==0u) {vertexOutputs.position=scene.viewProjection*worldPos;} else {vertexOutputs.position=scene.viewProjectionR*worldPos;}
#else
vertexOutputs.position=scene.viewProjection*worldPos;
#endif
#if DEBUGMODE>0
vertexOutputs.vClipSpacePosition=vertexOutputs.position;
#endif
#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)
vertexOutputs.vDirectionW=normalize((finalWorld*vec4f(positionUpdated,0.0)).xyz);
#endif
#ifndef UV1
var uvUpdated: vec2f= vec2f(0.,0.);
#endif
#ifdef MAINUV1
vertexOutputs.vMainUV1=uvUpdated;
#endif
#ifndef UV2
var uv2Updated: vec2f= vec2f(0.,0.);
#endif
#ifdef MAINUV2
vertexOutputs.vMainUV2=uv2Updated;
#endif
#include<uvVariableDeclaration>[3..7]
#include<samplerVertexImplementation>(_DEFINENAME_,BASE_COLOR,_VARYINGNAME_,BaseColor,_MATRIXNAME_,baseColor,_INFONAME_,BaseColorInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,BASE_WEIGHT,_VARYINGNAME_,BaseWeight,_MATRIXNAME_,baseWeight,_INFONAME_,BaseWeightInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,BASE_DIFFUSE_ROUGHNESS,_VARYINGNAME_,BaseDiffuseRoughness,_MATRIXNAME_,baseDiffuseRoughness,_INFONAME_,BaseDiffuseRoughnessInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,BASE_METALNESS,_VARYINGNAME_,BaseMetalness,_MATRIXNAME_,baseMetalness,_INFONAME_,BaseMetalnessInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,SPECULAR_WEIGHT,_VARYINGNAME_,SpecularWeight,_MATRIXNAME_,specularWeight,_INFONAME_,SpecularWeightInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,SPECULAR_COLOR,_VARYINGNAME_,SpecularColor,_MATRIXNAME_,specularColor,_INFONAME_,SpecularColorInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,SPECULAR_ROUGHNESS,_VARYINGNAME_,SpecularRoughness,_MATRIXNAME_,specularRoughness,_INFONAME_,SpecularRoughnessInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,SPECULAR_ROUGHNESS_ANISOTROPY,_VARYINGNAME_,SpecularRoughnessAnisotropy,_MATRIXNAME_,specularRoughnessAnisotropy,_INFONAME_,SpecularRoughnessAnisotropyInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,TRANSMISSION_WEIGHT,_VARYINGNAME_,TransmissionWeight,_MATRIXNAME_,transmissionWeight,_INFONAME_,TransmissionWeightInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,TRANSMISSION_COLOR,_VARYINGNAME_,TransmissionColor,_MATRIXNAME_,transmissionColor,_INFONAME_,TransmissionColorInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,TRANSMISSION_DEPTH,_VARYINGNAME_,TransmissionDepth,_MATRIXNAME_,transmissionDepth,_INFONAME_,TransmissionDepthInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,TRANSMISSION_SCATTER,_VARYINGNAME_,TransmissionScatter,_MATRIXNAME_,transmissionScatter,_INFONAME_,TransmissionScatterInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,TRANSMISSION_DISPERSION_SCALE,_VARYINGNAME_,TransmissionDispersionScale,_MATRIXNAME_,transmissionDispersionScale,_INFONAME_,TransmissionDispersionScaleInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,SUBSURFACE_WEIGHT,_VARYINGNAME_,SubsurfaceWeight,_MATRIXNAME_,subsurfaceWeight,_INFONAME_,SubsurfaceWeightInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,SUBSURFACE_COLOR,_VARYINGNAME_,SubsurfaceColor,_MATRIXNAME_,subsurfaceColor,_INFONAME_,SubsurfaceColorInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,SUBSURFACE_RADIUS_SCALE,_VARYINGNAME_,SubsurfaceRadiusScale,_MATRIXNAME_,subsurfaceRadiusScale,_INFONAME_,SubsurfaceRadiusScaleInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,COAT_WEIGHT,_VARYINGNAME_,CoatWeight,_MATRIXNAME_,coatWeight,_INFONAME_,CoatWeightInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,COAT_COLOR,_VARYINGNAME_,CoatColor,_MATRIXNAME_,coatColor,_INFONAME_,CoatColorInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,COAT_ROUGHNESS,_VARYINGNAME_,CoatRoughness,_MATRIXNAME_,coatRoughness,_INFONAME_,CoatRoughnessInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,COAT_ROUGHNESS_ANISOTROPY,_VARYINGNAME_,CoatRoughnessAnisotropy,_MATRIXNAME_,coatRoughnessAnisotropy,_INFONAME_,CoatRoughnessAnisotropyInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,COAT_DARKENING,_VARYINGNAME_,CoatDarkening,_MATRIXNAME_,coatDarkening,_INFONAME_,CoatDarkeningInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,FUZZ_WEIGHT,_VARYINGNAME_,FuzzWeight,_MATRIXNAME_,fuzzWeight,_INFONAME_,FuzzWeightInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,FUZZ_COLOR,_VARYINGNAME_,FuzzColor,_MATRIXNAME_,fuzzColor,_INFONAME_,FuzzColorInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,FUZZ_ROUGHNESS,_VARYINGNAME_,FuzzRoughness,_MATRIXNAME_,fuzzRoughness,_INFONAME_,FuzzRoughnessInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,GEOMETRY_NORMAL,_VARYINGNAME_,GeometryNormal,_MATRIXNAME_,geometryNormal,_INFONAME_,GeometryNormalInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,GEOMETRY_TANGENT,_VARYINGNAME_,GeometryTangent,_MATRIXNAME_,geometryTangent,_INFONAME_,GeometryTangentInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,GEOMETRY_COAT_NORMAL,_VARYINGNAME_,GeometryCoatNormal,_MATRIXNAME_,geometryCoatNormal,_INFONAME_,GeometryCoatNormalInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,GEOMETRY_OPACITY,_VARYINGNAME_,GeometryOpacity,_MATRIXNAME_,geometryOpacity,_INFONAME_,GeometryOpacityInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,GEOMETRY_THICKNESS,_VARYINGNAME_,GeometryThickness,_MATRIXNAME_,geometryThickness,_INFONAME_,GeometryThicknessInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,EMISSION_COLOR,_VARYINGNAME_,EmissionColor,_MATRIXNAME_,emissionColor,_INFONAME_,EmissionColorInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,THIN_FILM_WEIGHT,_VARYINGNAME_,ThinFilmWeight,_MATRIXNAME_,thinFilmWeight,_INFONAME_,ThinFilmWeightInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,THIN_FILM_THICKNESS,_VARYINGNAME_,ThinFilmThickness,_MATRIXNAME_,thinFilmThickness,_INFONAME_,ThinFilmThicknessInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,AMBIENT_OCCLUSION,_VARYINGNAME_,AmbientOcclusion,_MATRIXNAME_,ambientOcclusion,_INFONAME_,AmbientOcclusionInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,DECAL,_VARYINGNAME_,Decal,_MATRIXNAME_,decal,_INFONAME_,DecalInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,DETAIL,_VARYINGNAME_,Detail,_MATRIXNAME_,detail,_INFONAME_,DetailInfos.x)
#include<openpbrNormalMapVertex>
#include<clipPlaneVertex>
#include<fogVertex>
#include<shadowsVertex>[0..maxSimultaneousLights]
#include<vertexColorMixing>
#include<logDepthVertex>
#define CUSTOM_VERTEX_MAIN_END
}`,n.ShadersStoreWGSL[B]||(n.ShadersStoreWGSL[B]=V),gi=[a,h,sn,ei,S,b,i,T,A,vn,Ne,_e,x,Xn,D,er,gn,Zt,w,l,ui,Qr,u,p,C,N,F,Ae,ai,we,sr,P,Yn,ne,ti,or];for(let e of gi)n.IncludesShadersStoreWGSL[e.name]||(n.IncludesShadersStoreWGSL[e.name]=e.shader);_i={name:B,shader:V}})))()}var yi=t({pbrPixelShaderWGSL:()=>xi}),H,U,bi,xi;function Si(){return(Si=e((()=>{r(),fr(),pe(),Vn(),s(),g(),ee(),_(),Vt(),Fn(),Be(),Ge(),ce(),We(),yn(),Ar(),y(),cn(),oi(),m(),li(),nn(),qe(),An(),Re(),v(),hr(),ct(),wt(),o(),Gt(),zr(),tt(),gt(),kt(),oe(),Rr(),Fr(),Ut(),Yr(),Tt(),fe(),Le(),ze(),Ht(),xe(),ue(),Te(),dt(),pt(),Lr(),Ye(),Nr(),se(),Hr(),Ie(),ae(),Rt(),Bt(),Tn(),Ke(),st(),Ct(),Dn(),Kt(),Dt(),un(),et(),$t(),jt(),H=`pbrPixelShader`,U=`#define PBR_FRAGMENT_SHADER
#define CUSTOM_FRAGMENT_BEGIN
#include<prePassDeclaration>[SCENE_MRT_COUNT]
#include<oitDeclaration>
#ifndef FROMLINEARSPACE
#define FROMLINEARSPACE
#endif
#include<pbrUboDeclaration>
#include<pbrFragmentExtraDeclaration>
#include<lightUboDeclaration>[0..maxSimultaneousLights]
#include<pbrFragmentSamplersDeclaration>
#include<imageProcessingDeclaration>
#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#include<fogFragmentDeclaration>
#include<textureRepetitionFunctions>
#include<helperFunctions>
#include<subSurfaceScatteringFunctions>
#include<importanceSampling>
#include<pbrHelperFunctions>
#include<imageProcessingFunctions>
#include<shadowsFragmentFunctions>
#include<harmonicsFunctions>
#include<pbrDirectLightingSetupFunctions>
#include<pbrDirectLightingFalloffFunctions>
#include<pbrBRDFFunctions>
#include<hdrFilteringFunctions>
#include<pbrDirectLightingFunctions>
#include<pbrIBLFunctions>
#include<bumpFragmentMainFunctions>
#include<bumpFragmentFunctions>
#ifdef REFLECTION
#include<reflectionFunction>
#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
#include<pbrBlockAlbedoOpacity>
#include<pbrBlockReflectivity>
#include<pbrBlockAmbientOcclusion>
#include<pbrBlockAlphaFresnel>
#include<pbrBlockAnisotropic>
#include<pbrBlockReflection>
#include<pbrBlockSheen>
#include<pbrBlockClearcoat>
#include<pbrBlockIridescence>
#include<pbrBlockSubSurface>
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
#include<pbrBlockNormalGeometric>
#include<bumpFragment>
#include<pbrBlockNormalFinal>
var albedoOpacityOut: albedoOpacityOutParams;
#ifdef ALBEDO
var albedoTexture: vec4f=TEXRD(albedoSampler,albedoSamplerSampler,fragmentInputs.vAlbedoUV+uvOffset);
#endif
#ifdef BASE_WEIGHT
var baseWeightTexture: vec4f=TEXRD(baseWeightSampler,baseWeightSamplerSampler,fragmentInputs.vBaseWeightUV+uvOffset);
#endif
#ifdef OPACITY
var opacityMap: vec4f=TEXRD(opacitySampler,opacitySamplerSampler,fragmentInputs.vOpacityUV+uvOffset);
#endif
#ifdef DECAL
var decalColor: vec4f=textureSample(decalSampler,decalSamplerSampler,fragmentInputs.vDecalUV+uvOffset);
#endif
albedoOpacityOut=albedoOpacityBlock(
uniforms.vAlbedoColor
#ifdef ALBEDO
,albedoTexture
,uniforms.vAlbedoInfos
#endif
,uniforms.baseWeight
#ifdef BASE_WEIGHT
,baseWeightTexture
,uniforms.vBaseWeightInfos
#endif
#ifdef OPACITY
,opacityMap
,uniforms.vOpacityInfos
#endif
#ifdef DETAIL
,detailColor
,uniforms.vDetailInfos
#endif
#ifdef DECAL
,decalColor
,uniforms.vDecalInfos
#endif
);var surfaceAlbedo: vec3f=albedoOpacityOut.surfaceAlbedo;var alpha: f32=albedoOpacityOut.alpha;
#define CUSTOM_FRAGMENT_UPDATE_ALPHA
#define DEPTHPREPASS_SKIP_EARLY_RETURN
#include<depthPrePass>
#ifndef DEPTHPREPASS
#define CUSTOM_FRAGMENT_BEFORE_LIGHTS
var aoOut: ambientOcclusionOutParams;
#ifdef AMBIENT
var ambientOcclusionColorMap: vec3f=TEXRD(ambientSampler,ambientSamplerSampler,fragmentInputs.vAmbientUV+uvOffset).rgb;
#endif
aoOut=ambientOcclusionBlock(
#ifdef AMBIENT
ambientOcclusionColorMap,
uniforms.vAmbientInfos
#endif
);
#include<pbrBlockLightmapInit>
#ifdef UNLIT
var diffuseBase: vec3f= vec3f(1.,1.,1.);
#else
var baseColor: vec3f=surfaceAlbedo;var reflectivityOut: reflectivityOutParams;
#if defined(REFLECTIVITY)
var surfaceMetallicOrReflectivityColorMap: vec4f=TEXRD(reflectivitySampler,reflectivitySamplerSampler,fragmentInputs.vReflectivityUV+uvOffset);var baseReflectivity: vec4f=surfaceMetallicOrReflectivityColorMap;
#ifndef METALLICWORKFLOW
#ifdef REFLECTIVITY_GAMMA
surfaceMetallicOrReflectivityColorMap=toLinearSpaceVec4(surfaceMetallicOrReflectivityColorMap);
#endif
surfaceMetallicOrReflectivityColorMap=vec4f(surfaceMetallicOrReflectivityColorMap.rgb*uniforms.vReflectivityInfos.y,surfaceMetallicOrReflectivityColorMap.a);
#endif
#endif
#if defined(MICROSURFACEMAP)
var microSurfaceTexel: vec4f=TEXRD(microSurfaceSampler,microSurfaceSamplerSampler,fragmentInputs.vMicroSurfaceSamplerUV+uvOffset)*uniforms.vMicroSurfaceSamplerInfos.y;
#endif
#ifdef BASE_DIFFUSE_ROUGHNESS
var baseDiffuseRoughnessTexture: f32=TEXRD(baseDiffuseRoughnessSampler,baseDiffuseRoughnessSamplerSampler,fragmentInputs.vBaseDiffuseRoughnessUV+uvOffset).x;
#endif
#ifdef METALLICWORKFLOW
var metallicReflectanceFactors: vec4f=uniforms.vMetallicReflectanceFactors;
#ifdef REFLECTANCE
var reflectanceFactorsMap: vec4f=TEXRD(reflectanceSampler,reflectanceSamplerSampler,fragmentInputs.vReflectanceUV+uvOffset);
#ifdef REFLECTANCE_GAMMA
reflectanceFactorsMap=toLinearSpaceVec4(reflectanceFactorsMap);
#endif
metallicReflectanceFactors=vec4f(metallicReflectanceFactors.rgb*reflectanceFactorsMap.rgb,metallicReflectanceFactors.a);
#endif
#ifdef METALLIC_REFLECTANCE
var metallicReflectanceFactorsMap: vec4f=TEXRD(metallicReflectanceSampler,metallicReflectanceSamplerSampler,fragmentInputs.vMetallicReflectanceUV+uvOffset);
#ifdef METALLIC_REFLECTANCE_GAMMA
metallicReflectanceFactorsMap=toLinearSpaceVec4(metallicReflectanceFactorsMap);
#endif
#ifndef METALLIC_REFLECTANCE_USE_ALPHA_ONLY
metallicReflectanceFactors=vec4f(metallicReflectanceFactors.rgb*metallicReflectanceFactorsMap.rgb,metallicReflectanceFactors.a);
#endif
metallicReflectanceFactors.a*=metallicReflectanceFactorsMap.a;
#endif
#endif
reflectivityOut=reflectivityBlock(
uniforms.vReflectivityColor
#ifdef METALLICWORKFLOW
,surfaceAlbedo
,metallicReflectanceFactors
#endif
,uniforms.baseDiffuseRoughness
#ifdef BASE_DIFFUSE_ROUGHNESS
,baseDiffuseRoughnessTexture
,uniforms.vBaseDiffuseRoughnessInfos
#endif
#ifdef REFLECTIVITY
,uniforms.vReflectivityInfos
,surfaceMetallicOrReflectivityColorMap
#endif
#if defined(METALLICWORKFLOW) && defined(REFLECTIVITY) && defined(AOSTOREINMETALMAPRED)
,aoOut.ambientOcclusionColor
#endif
#ifdef MICROSURFACEMAP
,microSurfaceTexel
#endif
#ifdef DETAIL
,detailColor
,uniforms.vDetailInfos
#endif
);var microSurface: f32=reflectivityOut.microSurface;var roughness: f32=reflectivityOut.roughness;var diffuseRoughness: f32=reflectivityOut.diffuseRoughness;
#ifdef METALLICWORKFLOW
surfaceAlbedo=reflectivityOut.surfaceAlbedo;
#endif
#if defined(METALLICWORKFLOW) && defined(REFLECTIVITY) && defined(AOSTOREINMETALMAPRED)
aoOut.ambientOcclusionColor=reflectivityOut.ambientOcclusionColor;
#endif
#ifdef ALPHAFRESNEL
#if defined(ALPHATEST) || defined(ALPHABLEND)
var alphaFresnelOut: alphaFresnelOutParams;alphaFresnelOut=alphaFresnelBlock(
normalW,
viewDirectionW,
alpha,
microSurface
);alpha=alphaFresnelOut.alpha;
#endif
#endif
#include<pbrBlockGeometryInfo>
#ifdef ANISOTROPIC
var anisotropicOut: anisotropicOutParams;
#ifdef ANISOTROPIC_TEXTURE
var anisotropyMapData: vec3f=TEXRD(anisotropySampler,anisotropySamplerSampler,fragmentInputs.vAnisotropyUV+uvOffset).rgb*uniforms.vAnisotropyInfos.y;
#endif
anisotropicOut=anisotropicBlock(
uniforms.vAnisotropy,
roughness,
#ifdef ANISOTROPIC_TEXTURE
anisotropyMapData,
#endif
TBN,
normalW,
viewDirectionW
);
#endif
#ifdef REFLECTION
var reflectionOut: reflectionOutParams;
#ifndef USE_CUSTOM_REFLECTION
reflectionOut=reflectionBlock(
fragmentInputs.vPositionW
,normalW
,alphaG
,uniforms.vReflectionMicrosurfaceInfos
,uniforms.vReflectionInfos
,uniforms.vReflectionColor
#ifdef ANISOTROPIC
,anisotropicOut
#endif
#if defined(LODINREFLECTIONALPHA) && !defined(REFLECTIONMAP_SKYBOX)
,NdotVUnclamped
#endif
#ifdef LINEARSPECULARREFLECTION
,roughness
#endif
,reflectionSampler
,reflectionSamplerSampler
#if defined(NORMAL) && defined(USESPHERICALINVERTEX)
,fragmentInputs.vEnvironmentIrradiance
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
#ifndef LODBASEDMICROSFURACE
,reflectionLowSampler
,reflectionLowSamplerSampler
,reflectionHighSampler
,reflectionHighSamplerSampler
#endif
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#ifdef IBL_CDF_FILTERING
,icdfSampler
,icdfSamplerSampler
#endif
#endif
,viewDirectionW
,diffuseRoughness
,surfaceAlbedo
);
#else
#define CUSTOM_REFLECTION
#endif
#endif
#include<pbrBlockReflectance0>
#ifdef SHEEN
var sheenOut: sheenOutParams;
#ifdef SHEEN_TEXTURE
var sheenMapData: vec4f=TEXRD(sheenSampler,sheenSamplerSampler,fragmentInputs.vSheenUV+uvOffset);
#endif
#if defined(SHEEN_ROUGHNESS) && defined(SHEEN_TEXTURE_ROUGHNESS) && !defined(SHEEN_USE_ROUGHNESS_FROM_MAINTEXTURE)
var sheenMapRoughnessData: vec4f=TEXRD(sheenRoughnessSampler,sheenRoughnessSamplerSampler,fragmentInputs.vSheenRoughnessUV+uvOffset)*uniforms.vSheenInfos.w;
#endif
sheenOut=sheenBlock(
uniforms.vSheenColor
#ifdef SHEEN_ROUGHNESS
,uniforms.vSheenRoughness
#if defined(SHEEN_TEXTURE_ROUGHNESS) && !defined(SHEEN_USE_ROUGHNESS_FROM_MAINTEXTURE)
,sheenMapRoughnessData
#endif
#endif
,roughness
#ifdef SHEEN_TEXTURE
,sheenMapData
,uniforms.vSheenInfos.y
#endif
,reflectanceF0
#ifdef SHEEN_LINKWITHALBEDO
,baseColor
,surfaceAlbedo
#endif
#ifdef ENVIRONMENTBRDF
,NdotV
,environmentBrdf
#endif
#if defined(REFLECTION) && defined(ENVIRONMENTBRDF)
,AARoughnessFactors
,uniforms.vReflectionMicrosurfaceInfos
,uniforms.vReflectionInfos
,uniforms.vReflectionColor
,uniforms.vLightingIntensity
,reflectionSampler
,reflectionSamplerSampler
,reflectionOut.reflectionCoords
,NdotVUnclamped
#ifndef LODBASEDMICROSFURACE
,reflectionLowSampler
,reflectionLowSamplerSampler
,reflectionHighSampler
,reflectionHighSamplerSampler
#endif
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#endif
#if !defined(REFLECTIONMAP_SKYBOX) && defined(RADIANCEOCCLUSION)
,seo
#endif
#if !defined(REFLECTIONMAP_SKYBOX) && defined(HORIZONOCCLUSION) && defined(BUMP) && defined(REFLECTIONMAP_3D)
,eho
#endif
#endif
);
#ifdef SHEEN_LINKWITHALBEDO
surfaceAlbedo=sheenOut.surfaceAlbedo;
#endif
#endif
#ifdef CLEARCOAT
#ifdef CLEARCOAT_TEXTURE
var clearCoatMapData: vec2f=TEXRD(clearCoatSampler,clearCoatSamplerSampler,fragmentInputs.vClearCoatUV+uvOffset).rg*uniforms.vClearCoatInfos.y;
#endif
#endif
#ifdef IRIDESCENCE
var iridescenceOut: iridescenceOutParams;
#ifdef IRIDESCENCE_TEXTURE
var iridescenceMapData: vec2f=TEXRD(iridescenceSampler,iridescenceSamplerSampler,fragmentInputs.vIridescenceUV+uvOffset).rg*uniforms.vIridescenceInfos.y;
#endif
#ifdef IRIDESCENCE_THICKNESS_TEXTURE
var iridescenceThicknessMapData: vec2f=TEXRD(iridescenceThicknessSampler,iridescenceThicknessSamplerSampler,fragmentInputs.vIridescenceThicknessUV+uvOffset).rg*uniforms.vIridescenceInfos.w;
#endif
iridescenceOut=iridescenceBlock(
uniforms.vIridescenceParams
,NdotV
,specularEnvironmentR0
#ifdef IRIDESCENCE_TEXTURE
,iridescenceMapData
#endif
#ifdef IRIDESCENCE_THICKNESS_TEXTURE
,iridescenceThicknessMapData
#endif
#ifdef CLEARCOAT
,NdotVUnclamped
,uniforms.vClearCoatParams
#ifdef CLEARCOAT_TEXTURE
,clearCoatMapData
#endif
#endif
);var iridescenceIntensity: f32=iridescenceOut.iridescenceIntensity;specularEnvironmentR0=iridescenceOut.specularEnvironmentR0;
#endif
var clearcoatOut: clearcoatOutParams;
#ifdef CLEARCOAT
#if defined(CLEARCOAT_TEXTURE_ROUGHNESS) && !defined(CLEARCOAT_USE_ROUGHNESS_FROM_MAINTEXTURE)
var clearCoatMapRoughnessData: vec4f=TEXRD(clearCoatRoughnessSampler,clearCoatRoughnessSamplerSampler,fragmentInputs.vClearCoatRoughnessUV+uvOffset)*uniforms.vClearCoatInfos.w;
#endif
#if defined(CLEARCOAT_TINT) && defined(CLEARCOAT_TINT_TEXTURE)
var clearCoatTintMapData: vec4f=TEXRD(clearCoatTintSampler,clearCoatTintSamplerSampler,fragmentInputs.vClearCoatTintUV+uvOffset);
#endif
#ifdef CLEARCOAT_BUMP
var clearCoatBumpMapData: vec4f=TEXRD(clearCoatBumpSampler,clearCoatBumpSamplerSampler,fragmentInputs.vClearCoatBumpUV+uvOffset);
#endif
clearcoatOut=clearcoatBlock(
fragmentInputs.vPositionW
,geometricNormalW
,viewDirectionW
,uniforms.vClearCoatParams
#if defined(CLEARCOAT_TEXTURE_ROUGHNESS) && !defined(CLEARCOAT_USE_ROUGHNESS_FROM_MAINTEXTURE)
,clearCoatMapRoughnessData
#endif
,specularEnvironmentR0
#ifdef CLEARCOAT_TEXTURE
,clearCoatMapData
#endif
#ifdef CLEARCOAT_TINT
,uniforms.vClearCoatTintParams
,uniforms.clearCoatColorAtDistance
,uniforms.vClearCoatRefractionParams
#ifdef CLEARCOAT_TINT_TEXTURE
,clearCoatTintMapData
#endif
#endif
#ifdef CLEARCOAT_BUMP
,uniforms.vClearCoatBumpInfos
,clearCoatBumpMapData
,fragmentInputs.vClearCoatBumpUV
#if defined(TANGENT) && defined(NORMAL)
,mat3x3<f32>(input.vTBN0,input.vTBN1,input.vTBN2)
#else
,uniforms.vClearCoatTangentSpaceParams
#endif
#ifdef OBJECTSPACE_NORMALMAP
,uniforms.normalMatrix
#endif
#endif
#if defined(FORCENORMALFORWARD) && defined(NORMAL)
,faceNormal
#endif
#ifdef REFLECTION
,uniforms.vReflectionMicrosurfaceInfos
,uniforms.vReflectionInfos
,uniforms.vReflectionColor
,uniforms.vLightingIntensity
,reflectionSampler
,reflectionSamplerSampler
#ifndef LODBASEDMICROSFURACE
,reflectionLowSampler
,reflectionLowSamplerSampler
,reflectionHighSampler
,reflectionHighSamplerSampler
#endif
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#endif
#endif
#if defined(CLEARCOAT_BUMP) || defined(TWOSIDEDLIGHTING)
,select(-1.,1.,fragmentInputs.frontFacing)
#endif
);
#else
clearcoatOut.specularEnvironmentR0=specularEnvironmentR0;
#endif
#include<pbrBlockReflectance>
var subSurfaceOut: subSurfaceOutParams;
#ifdef SUBSURFACE
#ifdef SS_THICKNESSANDMASK_TEXTURE
var thicknessMap: vec4f=TEXRD(thicknessSampler,thicknessSamplerSampler,fragmentInputs.vThicknessUV+uvOffset);
#endif
#ifdef SS_REFRACTIONINTENSITY_TEXTURE
var refractionIntensityMap: vec4f=TEXRD(refractionIntensitySampler,refractionIntensitySamplerSampler,fragmentInputs.vRefractionIntensityUV+uvOffset);
#endif
#ifdef SS_TRANSLUCENCYINTENSITY_TEXTURE
var translucencyIntensityMap: vec4f=TEXRD(translucencyIntensitySampler,translucencyIntensitySamplerSampler,fragmentInputs.vTranslucencyIntensityUV+uvOffset);
#endif
#ifdef SS_TRANSLUCENCYCOLOR_TEXTURE
var translucencyColorMap: vec4f=TEXRD(translucencyColorSampler,translucencyColorSamplerSampler,fragmentInputs.vTranslucencyColorUV+uvOffset);
#ifdef SS_TRANSLUCENCYCOLOR_TEXTURE_GAMMA
translucencyColorMap=toLinearSpaceVec4(translucencyColorMap);
#endif
#endif
subSurfaceOut=subSurfaceBlock(
uniforms.vSubSurfaceIntensity
,uniforms.vThicknessParam
,uniforms.vTintColor
,normalW
#ifdef LEGACY_SPECULAR_ENERGY_CONSERVATION
,vec3f(max(colorSpecularEnvironmentReflectance.r,max(colorSpecularEnvironmentReflectance.g,colorSpecularEnvironmentReflectance.b)))
#else
,baseSpecularEnvironmentReflectance
#endif
#ifdef SS_THICKNESSANDMASK_TEXTURE
,thicknessMap
#endif
#ifdef SS_REFRACTIONINTENSITY_TEXTURE
,refractionIntensityMap
#endif
#ifdef SS_TRANSLUCENCYINTENSITY_TEXTURE
,translucencyIntensityMap
#endif
#ifdef REFLECTION
#ifdef SS_TRANSLUCENCY
,uniforms.reflectionMatrix
#ifdef USESPHERICALFROMREFLECTIONMAP
#if !defined(NORMAL) || !defined(USESPHERICALINVERTEX)
,reflectionOut.irradianceVector
#endif
#if defined(REALTIME_FILTERING)
,reflectionSampler
,reflectionSamplerSampler
,uniforms.vReflectionFilteringInfo
#ifdef IBL_CDF_FILTERING
,icdfSampler
,icdfSamplerSampler
#endif
#endif
#endif
#ifdef USEIRRADIANCEMAP
,irradianceSampler
,irradianceSamplerSampler
#endif
#endif
#endif
#if defined(SS_REFRACTION) || defined(SS_TRANSLUCENCY)
,surfaceAlbedo
#endif
#ifdef SS_REFRACTION
,fragmentInputs.vPositionW
,viewDirectionW
,scene.view
,uniforms.vRefractionInfos
,uniforms.refractionMatrix
,uniforms.vRefractionMicrosurfaceInfos
,uniforms.vLightingIntensity
#ifdef SS_LINKREFRACTIONTOTRANSPARENCY
,alpha
#endif
#ifdef SS_LODINREFRACTIONALPHA
,NdotVUnclamped
#endif
#ifdef SS_LINEARSPECULARREFRACTION
,roughness
#endif
,alphaG
,refractionSampler
,refractionSamplerSampler
#ifndef LODBASEDMICROSFURACE
,refractionLowSampler
,refractionLowSamplerSampler
,refractionHighSampler
,refractionHighSamplerSampler
#endif
#ifdef ANISOTROPIC
,anisotropicOut
#endif
#ifdef REALTIME_FILTERING
,uniforms.vRefractionFilteringInfo
#endif
#ifdef SS_USE_LOCAL_REFRACTIONMAP_CUBIC
,uniforms.vRefractionPosition
,uniforms.vRefractionSize
#endif
#ifdef SS_DISPERSION
,uniforms.dispersion
#endif
#endif
#ifdef SS_TRANSLUCENCY
,uniforms.vDiffusionDistance
,uniforms.vTranslucencyColor
#ifdef SS_TRANSLUCENCYCOLOR_TEXTURE
,translucencyColorMap
#endif
#endif
);
#ifdef SS_REFRACTION
surfaceAlbedo=subSurfaceOut.surfaceAlbedo;
#ifdef SS_LINKREFRACTIONTOTRANSPARENCY
alpha=subSurfaceOut.alpha;
#endif
#endif
#else
subSurfaceOut.specularEnvironmentReflectance=colorSpecularEnvironmentReflectance;
#endif
#include<pbrBlockDirectLighting>
#include<lightFragment>[0..maxSimultaneousLights]
#include<pbrBlockFinalLitComponents>
#endif 
#include<pbrBlockFinalUnlitComponents>
#define CUSTOM_FRAGMENT_BEFORE_FINALCOLORCOMPOSITION
#include<pbrBlockFinalColorComposition>
#include<logDepthFragment>
#include<fogFragment>(color,finalColor)
#include<pbrBlockImageProcessing>
#define CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR
#ifdef PREPASS
#include<pbrBlockPrePass>
#endif
#if !defined(PREPASS) && !defined(ORDER_INDEPENDENT_TRANSPARENCY)
fragmentOutputs.color=finalColor;
#endif
#include<oitFragment>
#if ORDER_INDEPENDENT_TRANSPARENCY
if (fragDepth==nearestDepth) {fragmentOutputs.frontColor=vec4f(fragmentOutputs.frontColor.rgb+finalColor.rgb*finalColor.a*alphaMultiplier,1.0-alphaMultiplier*(1.0-finalColor.a));} else {fragmentOutputs.backColor+=finalColor;}
#endif
#include<pbrDebug>
#define CUSTOM_FRAGMENT_MAIN_END
#endif
}
`,n.ShadersStoreWGSL[H]||(n.ShadersStoreWGSL[H]=U),bi=[ar,be,Wn,a,h,nt,S,Ze,lr,he,je,Oe,Ue,Mn,M,l,tn,ri,b,ii,En,Ft,jn,He,x,Zn,ot,vt,i,Or,Pr,it,Nt,$e,Lt,Ir,Ur,ie,jr,ve,ye,Ve,me,re,Me,ge,ke,Ce,te,Mr,St,Br,De,Xr,le,It,Pe,Xe,kn,Pt,at,_t,rn,kr,ut,xn,rt,on,bt];for(let e of bi)n.IncludesShadersStoreWGSL[e.name]||(n.IncludesShadersStoreWGSL[e.name]=e.shader);xi={name:H,shader:U}})))()}var Ci=t({pbrVertexShaderWGSL:()=>Ti}),W,G,wi,Ti;function Ei(){return(Ei=e((()=>{r(),s(),g(),ee(),$r(),_(),m(),o(),L(),k(),mn(),Se(),de(),v(),Wr(),O(),fn(),Yt(),d(),c(),y(),ni(),ci(),Tr(),Dr(),f(),I(),E(),Ee(),Zr(),ft(),Kr(),j(),qn(),mt(),si(),pr(),W=`pbrVertexShader`,G=`#define PBR_VERTEX_SHADER
#include<pbrUboDeclaration>
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
#include<mainUVVaryingDeclaration>[1..7]
#include<helperFunctions>
#include<pbrBRDFFunctions>
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<instancesDeclaration>
#include<prePassVertexDeclaration>
#include<samplerVertexDeclaration>(_DEFINENAME_,ALBEDO,_VARYINGNAME_,Albedo)
#include<samplerVertexDeclaration>(_DEFINENAME_,BASE_WEIGHT,_VARYINGNAME_,BaseWeight)
#include<samplerVertexDeclaration>(_DEFINENAME_,BASE_DIFFUSE_ROUGHNESS,_VARYINGNAME_,BaseDiffuseRoughness)
#include<samplerVertexDeclaration>(_DEFINENAME_,DETAIL,_VARYINGNAME_,Detail)
#include<samplerVertexDeclaration>(_DEFINENAME_,AMBIENT,_VARYINGNAME_,Ambient)
#include<samplerVertexDeclaration>(_DEFINENAME_,OPACITY,_VARYINGNAME_,Opacity)
#include<samplerVertexDeclaration>(_DEFINENAME_,EMISSIVE,_VARYINGNAME_,Emissive)
#include<samplerVertexDeclaration>(_DEFINENAME_,LIGHTMAP,_VARYINGNAME_,Lightmap)
#include<samplerVertexDeclaration>(_DEFINENAME_,REFLECTIVITY,_VARYINGNAME_,Reflectivity)
#include<samplerVertexDeclaration>(_DEFINENAME_,MICROSURFACEMAP,_VARYINGNAME_,MicroSurfaceSampler)
#include<samplerVertexDeclaration>(_DEFINENAME_,METALLIC_REFLECTANCE,_VARYINGNAME_,MetallicReflectance)
#include<samplerVertexDeclaration>(_DEFINENAME_,REFLECTANCE,_VARYINGNAME_,Reflectance)
#include<samplerVertexDeclaration>(_DEFINENAME_,BUMP,_VARYINGNAME_,Bump)
#include<samplerVertexDeclaration>(_DEFINENAME_,DECAL,_VARYINGNAME_,Decal)
#ifdef CLEARCOAT
#include<samplerVertexDeclaration>(_DEFINENAME_,CLEARCOAT_TEXTURE,_VARYINGNAME_,ClearCoat)
#include<samplerVertexDeclaration>(_DEFINENAME_,CLEARCOAT_TEXTURE_ROUGHNESS,_VARYINGNAME_,ClearCoatRoughness)
#include<samplerVertexDeclaration>(_DEFINENAME_,CLEARCOAT_BUMP,_VARYINGNAME_,ClearCoatBump)
#include<samplerVertexDeclaration>(_DEFINENAME_,CLEARCOAT_TINT_TEXTURE,_VARYINGNAME_,ClearCoatTint)
#endif
#ifdef IRIDESCENCE
#include<samplerVertexDeclaration>(_DEFINENAME_,IRIDESCENCE_TEXTURE,_VARYINGNAME_,Iridescence)
#include<samplerVertexDeclaration>(_DEFINENAME_,IRIDESCENCE_THICKNESS_TEXTURE,_VARYINGNAME_,IridescenceThickness)
#endif
#ifdef SHEEN
#include<samplerVertexDeclaration>(_DEFINENAME_,SHEEN_TEXTURE,_VARYINGNAME_,Sheen)
#include<samplerVertexDeclaration>(_DEFINENAME_,SHEEN_TEXTURE_ROUGHNESS,_VARYINGNAME_,SheenRoughness)
#endif
#ifdef ANISOTROPIC
#include<samplerVertexDeclaration>(_DEFINENAME_,ANISOTROPIC_TEXTURE,_VARYINGNAME_,Anisotropy)
#endif
#ifdef SUBSURFACE
#include<samplerVertexDeclaration>(_DEFINENAME_,SS_THICKNESSANDMASK_TEXTURE,_VARYINGNAME_,Thickness)
#include<samplerVertexDeclaration>(_DEFINENAME_,SS_REFRACTIONINTENSITY_TEXTURE,_VARYINGNAME_,RefractionIntensity)
#include<samplerVertexDeclaration>(_DEFINENAME_,SS_TRANSLUCENCYINTENSITY_TEXTURE,_VARYINGNAME_,TranslucencyIntensity)
#include<samplerVertexDeclaration>(_DEFINENAME_,SS_TRANSLUCENCYCOLOR_TEXTURE,_VARYINGNAME_,TranslucencyColor)
#endif
varying vPositionW: vec3f;
#if DEBUGMODE>0
varying vClipSpacePosition: vec4f;
#endif
#ifdef NORMAL
varying vNormalW: vec3f;
#if defined(USESPHERICALFROMREFLECTIONMAP) && defined(USESPHERICALINVERTEX)
varying vEnvironmentIrradiance: vec3f;
#include<harmonicsFunctions>
#endif
#endif
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
varying vColor: vec4f;
#endif
#include<bumpVertexDeclaration>
#include<clipPlaneVertexDeclaration>
#include<fogVertexDeclaration>
#include<lightVxUboDeclaration>[0..maxSimultaneousLights]
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
var worldPos: vec4f=finalWorld* vec4f(positionUpdated,1.0);vertexOutputs.vPositionW= worldPos.xyz;
#ifdef PREPASS
#include<prePassVertex>
#endif
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
#if defined(USESPHERICALFROMREFLECTIONMAP) && defined(USESPHERICALINVERTEX)
#if BASE_DIFFUSE_MODEL != BRDF_DIFFUSE_MODEL_LAMBERT && BASE_DIFFUSE_MODEL != BRDF_DIFFUSE_MODEL_LEGACY
var viewDirectionW: vec3f=normalize(scene.vEyePosition.xyz-vertexOutputs.vPositionW);var NdotV: f32=max(dot(vertexOutputs.vNormalW,viewDirectionW),0.0);var roughNormal: vec3f=mix(vertexOutputs.vNormalW,viewDirectionW,(0.5*(1.0-NdotV))*uniforms.baseDiffuseRoughness);var reflectionVector: vec3f= (uniforms.reflectionMatrix* vec4f(roughNormal,0)).xyz;
#else
var reflectionVector: vec3f= (uniforms.reflectionMatrix* vec4f(vertexOutputs.vNormalW,0)).xyz;
#endif
#ifdef REFLECTIONMAP_OPPOSITEZ
reflectionVector.z*=-1.0;
#endif
vertexOutputs.vEnvironmentIrradiance=computeEnvironmentIrradiance(reflectionVector);
#endif
#endif
#define CUSTOM_VERTEX_UPDATE_WORLDPOS
#ifdef MULTIVIEW
if (gl_ViewID_OVR==0u) {vertexOutputs.position=scene.viewProjection*worldPos;} else {vertexOutputs.position=scene.viewProjectionR*worldPos;}
#else
vertexOutputs.position=scene.viewProjection*worldPos;
#endif
#if DEBUGMODE>0
vertexOutputs.vClipSpacePosition=vertexOutputs.position;
#endif
#if defined(REFLECTIONMAP_EQUIRECTANGULAR_FIXED) || defined(REFLECTIONMAP_MIRROREDEQUIRECTANGULAR_FIXED)
vertexOutputs.vDirectionW=normalize((finalWorld*vec4f(positionUpdated,0.0)).xyz);
#endif
#if defined(CLUSTLIGHT_BATCH) && CLUSTLIGHT_BATCH>0
#ifdef RIGHT_HANDED
vertexOutputs.vViewDepth=-(scene.view*worldPos).z;
#else
vertexOutputs.vViewDepth=(scene.view*worldPos).z;
#endif
#endif
#ifndef UV1
var uvUpdated: vec2f= vec2f(0.,0.);
#endif
#ifdef MAINUV1
vertexOutputs.vMainUV1=uvUpdated;
#endif
#ifndef UV2
var uv2Updated: vec2f= vec2f(0.,0.);
#endif
#ifdef MAINUV2
vertexOutputs.vMainUV2=uv2Updated;
#endif
#include<uvVariableDeclaration>[3..7]
#include<samplerVertexImplementation>(_DEFINENAME_,ALBEDO,_VARYINGNAME_,Albedo,_MATRIXNAME_,albedo,_INFONAME_,AlbedoInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,BASE_WEIGHT,_VARYINGNAME_,BaseWeight,_MATRIXNAME_,baseWeight,_INFONAME_,BaseWeightInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,BASE_DIFFUSE_ROUGHNESS,_VARYINGNAME_,BaseDiffuseRoughness,_MATRIXNAME_,baseDiffuseRoughness,_INFONAME_,BaseDiffuseRoughnessInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,DETAIL,_VARYINGNAME_,Detail,_MATRIXNAME_,detail,_INFONAME_,DetailInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,AMBIENT,_VARYINGNAME_,Ambient,_MATRIXNAME_,ambient,_INFONAME_,AmbientInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,OPACITY,_VARYINGNAME_,Opacity,_MATRIXNAME_,opacity,_INFONAME_,OpacityInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,EMISSIVE,_VARYINGNAME_,Emissive,_MATRIXNAME_,emissive,_INFONAME_,EmissiveInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,LIGHTMAP,_VARYINGNAME_,Lightmap,_MATRIXNAME_,lightmap,_INFONAME_,LightmapInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,REFLECTIVITY,_VARYINGNAME_,Reflectivity,_MATRIXNAME_,reflectivity,_INFONAME_,ReflectivityInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,MICROSURFACEMAP,_VARYINGNAME_,MicroSurfaceSampler,_MATRIXNAME_,microSurfaceSampler,_INFONAME_,MicroSurfaceSamplerInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,METALLIC_REFLECTANCE,_VARYINGNAME_,MetallicReflectance,_MATRIXNAME_,metallicReflectance,_INFONAME_,MetallicReflectanceInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,REFLECTANCE,_VARYINGNAME_,Reflectance,_MATRIXNAME_,reflectance,_INFONAME_,ReflectanceInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,BUMP,_VARYINGNAME_,Bump,_MATRIXNAME_,bump,_INFONAME_,BumpInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,DECAL,_VARYINGNAME_,Decal,_MATRIXNAME_,decal,_INFONAME_,DecalInfos.x)
#ifdef CLEARCOAT
#include<samplerVertexImplementation>(_DEFINENAME_,CLEARCOAT_TEXTURE,_VARYINGNAME_,ClearCoat,_MATRIXNAME_,clearCoat,_INFONAME_,ClearCoatInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,CLEARCOAT_TEXTURE_ROUGHNESS,_VARYINGNAME_,ClearCoatRoughness,_MATRIXNAME_,clearCoatRoughness,_INFONAME_,ClearCoatInfos.z)
#include<samplerVertexImplementation>(_DEFINENAME_,CLEARCOAT_BUMP,_VARYINGNAME_,ClearCoatBump,_MATRIXNAME_,clearCoatBump,_INFONAME_,ClearCoatBumpInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,CLEARCOAT_TINT_TEXTURE,_VARYINGNAME_,ClearCoatTint,_MATRIXNAME_,clearCoatTint,_INFONAME_,ClearCoatTintInfos.x)
#endif
#ifdef IRIDESCENCE
#include<samplerVertexImplementation>(_DEFINENAME_,IRIDESCENCE_TEXTURE,_VARYINGNAME_,Iridescence,_MATRIXNAME_,iridescence,_INFONAME_,IridescenceInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,IRIDESCENCE_THICKNESS_TEXTURE,_VARYINGNAME_,IridescenceThickness,_MATRIXNAME_,iridescenceThickness,_INFONAME_,IridescenceInfos.z)
#endif
#ifdef SHEEN
#include<samplerVertexImplementation>(_DEFINENAME_,SHEEN_TEXTURE,_VARYINGNAME_,Sheen,_MATRIXNAME_,sheen,_INFONAME_,SheenInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,SHEEN_TEXTURE_ROUGHNESS,_VARYINGNAME_,SheenRoughness,_MATRIXNAME_,sheenRoughness,_INFONAME_,SheenInfos.z)
#endif
#ifdef ANISOTROPIC
#include<samplerVertexImplementation>(_DEFINENAME_,ANISOTROPIC_TEXTURE,_VARYINGNAME_,Anisotropy,_MATRIXNAME_,anisotropy,_INFONAME_,AnisotropyInfos.x)
#endif
#ifdef SUBSURFACE
#include<samplerVertexImplementation>(_DEFINENAME_,SS_THICKNESSANDMASK_TEXTURE,_VARYINGNAME_,Thickness,_MATRIXNAME_,thickness,_INFONAME_,ThicknessInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,SS_REFRACTIONINTENSITY_TEXTURE,_VARYINGNAME_,RefractionIntensity,_MATRIXNAME_,refractionIntensity,_INFONAME_,RefractionIntensityInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,SS_TRANSLUCENCYINTENSITY_TEXTURE,_VARYINGNAME_,TranslucencyIntensity,_MATRIXNAME_,translucencyIntensity,_INFONAME_,TranslucencyIntensityInfos.x)
#include<samplerVertexImplementation>(_DEFINENAME_,SS_TRANSLUCENCYCOLOR_TEXTURE,_VARYINGNAME_,TranslucencyColor,_MATRIXNAME_,translucencyColor,_INFONAME_,TranslucencyColorInfos.x)
#endif
#include<bumpVertex>
#include<clipPlaneVertex>
#include<fogVertex>
#include<shadowsVertex>[0..maxSimultaneousLights]
#include<vertexColorMixing>
#include<logDepthVertex>
#define CUSTOM_VERTEX_MAIN_END
}`,n.ShadersStoreWGSL[W]||(n.ShadersStoreWGSL[W]=G),wi=[a,h,nt,ei,S,b,i,T,A,vn,Ne,_e,x,qr,D,er,gn,Zt,w,l,ui,Qr,u,p,C,N,F,Ae,ai,we,Vr,P,Yn,ne,ti,or];for(let e of wi)n.IncludesShadersStoreWGSL[e.name]||(n.IncludesShadersStoreWGSL[e.name]=e.shader);Ti={name:W,shader:G}})))()}var Di=t({postprocessVertexShaderWGSL:()=>Oi}),K,q,Oi;function ki(){return(ki=e((()=>{r(),K=`postprocessVertexShader`,q=`attribute position: vec2<f32>;uniform scale: vec2<f32>;varying vUV: vec2<f32>;const madd=vec2(0.5,0.5);
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#define CUSTOM_VERTEX_MAIN_BEGIN
vertexOutputs.vUV=(vertexInputs.position*madd+madd)*uniforms.scale;vertexOutputs.position=vec4(vertexInputs.position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}
`,n.ShadersStoreWGSL[K]||(n.ShadersStoreWGSL[K]=q),Oi={name:K,shader:q}})))()}var Ai=t({proceduralVertexShaderWGSL:()=>Mi}),J,ji,Mi;function Ni(){return(Ni=e((()=>{r(),J=`proceduralVertexShader`,ji=`attribute position: vec2f;varying vPosition: vec2f;varying vUV: vec2f;const madd: vec2f= vec2f(0.5,0.5);
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#define CUSTOM_VERTEX_MAIN_BEGIN
vertexOutputs.vPosition=vertexInputs.position;vertexOutputs.vUV=vertexInputs.position*madd+madd;vertexOutputs.position= vec4f(vertexInputs.position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`,n.ShadersStoreWGSL[J]||(n.ShadersStoreWGSL[J]=ji),Mi={name:J,shader:ji}})))()}var Pi=t({rgbdDecodePixelShaderWGSL:()=>Li}),Y,Fi,Ii,Li;function Ri(){return(Ri=e((()=>{r(),m(),Y=`rgbdDecodePixelShader`,Fi=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;
#include<helperFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=vec4f(fromRGBD(textureSample(textureSampler,textureSamplerSampler,input.vUV)),1.0);}`,n.ShadersStoreWGSL[Y]||(n.ShadersStoreWGSL[Y]=Fi),Ii=[b];for(let e of Ii)n.IncludesShadersStoreWGSL[e.name]||(n.IncludesShadersStoreWGSL[e.name]=e.shader);Li={name:Y,shader:Fi}})))()}var zi=t({rgbdEncodePixelShaderWGSL:()=>Hi}),X,Bi,Vi,Hi;function Ui(){return(Ui=e((()=>{r(),m(),X=`rgbdEncodePixelShader`,Bi=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;
#include<helperFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=toRGBD(textureSample(textureSampler,textureSamplerSampler,input.vUV).rgb);}`,n.ShadersStoreWGSL[X]||(n.ShadersStoreWGSL[X]=Bi),Vi=[b];for(let e of Vi)n.IncludesShadersStoreWGSL[e.name]||(n.IncludesShadersStoreWGSL[e.name]=e.shader);Hi={name:X,shader:Bi}})))()}var Wi=t({shadowMapPixelShaderWGSL:()=>qi}),Z,Gi,Ki,qi;function Ji(){return(Ji=e((()=>{r(),zt(),Gr(),ht(),Ar(),Lr(),Ot(),Z=`shadowMapPixelShader`,Gi=`#include<shadowMapFragmentExtraDeclaration>
#ifdef ALPHATEXTURE
varying vUV: vec2f;var diffuseSamplerSampler: sampler;var diffuseSampler: texture_2d<f32>;
#endif
#include<clipPlaneFragmentDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#include<clipPlaneFragment>
#ifdef ALPHATEXTURE
var opacityMap: vec4f=textureSample(diffuseSampler,diffuseSamplerSampler,fragmentInputs.vUV);var alphaFromAlphaTexture: f32=opacityMap.a;
#if SM_SOFTTRANSPARENTSHADOW==1
if (uniforms.softTransparentShadowSM.y==1.0) {opacityMap=vec4f(opacityMap.rgb* vec3f(0.3,0.59,0.11),opacityMap.a);alphaFromAlphaTexture=opacityMap.x+opacityMap.y+opacityMap.z;}
#endif
#ifdef ALPHATESTVALUE
if (alphaFromAlphaTexture<ALPHATESTVALUE) {discard;}
#endif
#endif
#if SM_SOFTTRANSPARENTSHADOW==1
#ifdef ALPHATEXTURE
if ((bayerDither8(floor(((fragmentInputs.position.xy)%(8.0)))))/64.0>=uniforms.softTransparentShadowSM.x*alphaFromAlphaTexture) {discard;}
#else
if ((bayerDither8(floor(((fragmentInputs.position.xy)%(8.0)))))/64.0>=uniforms.softTransparentShadowSM.x) {discard;} 
#endif
#endif
#include<shadowMapFragment>
}`,n.ShadersStoreWGSL[Z]||(n.ShadersStoreWGSL[Z]=Gi),Ki=[Fe,Jr,Mt,M,Mr,Qe];for(let e of Ki)n.IncludesShadersStoreWGSL[e.name]||(n.IncludesShadersStoreWGSL[e.name]=e.shader);qi={name:Z,shader:Gi}})))()}var Yi=t({shadowMapVertexShaderWGSL:()=>Qi}),Q,Xi,Zi,Qi;function $i(){return($i=e((()=>{r(),L(),k(),d(),c(),m(),s(),g(),Je(),O(),Tr(),Dr(),f(),I(),E(),Et(),At(),j(),Q=`shadowMapVertexShader`,Xi=`attribute position: vec3f;
#ifdef NORMAL
attribute normal: vec3f;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#ifdef INSTANCES
attribute world0: vec4f;attribute world1: vec4f;attribute world2: vec4f;attribute world3: vec4f;
#endif
#include<helperFunctions>
#include<sceneUboDeclaration>
#include<meshUboDeclaration>
#ifdef ALPHATEXTURE
varying vUV: vec2f;uniform diffuseMatrix: mat4x4f;
#ifdef UV1
attribute uv: vec2f;
#endif
#ifdef UV2
attribute uv2: vec2f;
#endif
#endif
#include<shadowMapVertexExtraDeclaration>
#include<clipPlaneVertexDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {var positionUpdated: vec3f=vertexInputs.position;
#ifdef UV1
var uvUpdated: vec2f=vertexInputs.uv;
#endif
#ifdef UV2
var uv2Updated: vec2f=vertexInputs.uv2;
#endif
#ifdef NORMAL
var normalUpdated: vec3f=vertexInputs.normal;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
var worldPos: vec4f=finalWorld* vec4f(positionUpdated,1.0);
#ifdef NORMAL
var normWorldSM: mat3x3f= mat3x3f(finalWorld[0].xyz,finalWorld[1].xyz,finalWorld[2].xyz);
#if defined(INSTANCES) && defined(THIN_INSTANCES)
var vNormalW: vec3f=normalUpdated/ vec3f(dot(normWorldSM[0],normWorldSM[0]),dot(normWorldSM[1],normWorldSM[1]),dot(normWorldSM[2],normWorldSM[2]));vNormalW=normalize(normWorldSM*vNormalW);
#else
#ifdef NONUNIFORMSCALING
normWorldSM=transposeMat3(inverseMat3(normWorldSM));
#endif
var vNormalW: vec3f=normalize(normWorldSM*normalUpdated);
#endif
#endif
#include<shadowMapVertexNormalBias>
vertexOutputs.position=scene.viewProjection*worldPos;
#include<shadowMapVertexMetric>
#ifdef ALPHATEXTURE
#ifdef UV1
vertexOutputs.vUV= (uniforms.diffuseMatrix* vec4f(uvUpdated,1.0,0.0)).xy;
#endif
#ifdef UV2
vertexOutputs.vUV= (uniforms.diffuseMatrix* vec4f(uv2Updated,1.0,0.0)).xy;
#endif
#endif
#include<clipPlaneVertex>
}`,n.ShadersStoreWGSL[Q]||(n.ShadersStoreWGSL[Q]=Xi),Zi=[T,A,Zt,w,b,a,h,xt,D,u,p,C,N,F,lt,yt,P];for(let e of Zi)n.IncludesShadersStoreWGSL[e.name]||(n.IncludesShadersStoreWGSL[e.name]=e.shader);Qi={name:Q,shader:Xi}})))()}var ea=t({textureProcessorPixelShaderWGSL:()=>na}),$,ta,na;function ra(){return(ra=e((()=>{r(),$=`textureProcessorPixelShader`,ta=`#ifdef OPERAND_A_TEXTURE
var textureASampler: sampler;var textureA: texture_2d<f32>;
#endif
#ifdef OPERAND_B_TEXTURE
var textureBSampler: sampler;var textureB: texture_2d<f32>;
#endif
#if defined(OP_LERP) && defined(LERP_T_TEXTURE)
var textureTSampler: sampler;var textureT: texture_2d<f32>;
#endif
#ifdef OPERAND_A_MATRIX
uniform textureAMatrix: mat4x4f;
#endif
#ifdef OPERAND_B_MATRIX
uniform textureBMatrix: mat4x4f;
#endif
#if defined(OP_LERP) && defined(LERP_T_MATRIX)
uniform textureTMatrix: mat4x4f;
#endif
#if !defined(OPERAND_A_TEXTURE) || defined(OPERAND_A_FACTOR)
uniform factorA: vec4f;
#endif
#if !defined(OPERAND_B_TEXTURE) || defined(OPERAND_B_FACTOR)
uniform factorB: vec4f;
#endif
#if defined(OP_LERP) && (!defined(LERP_T_TEXTURE) || defined(LERP_T_FACTOR))
uniform factorT: vec4f;
#endif
varying vUV: vec2f;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {let uv: vec2f=input.vUV;
#ifdef OPERAND_A_TEXTURE
#ifdef OPERAND_A_MATRIX
var a: vec4f=textureSample(textureA,textureASampler,(uniforms.textureAMatrix*vec4f(uv,0.0,1.0)).xy);
#else
var a: vec4f=textureSample(textureA,textureASampler,uv);
#endif
#ifdef OPERAND_A_SRGB
a=vec4f(mix(a.rgb/vec3f(12.92),pow((a.rgb+vec3f(0.055))/vec3f(1.055),vec3f(2.4)),step(vec3f(0.04045),a.rgb)),a.a);
#endif
#ifdef OPERAND_A_CHANNEL_R
a=vec4f(a.rrr,a.a);
#elif defined(OPERAND_A_CHANNEL_G)
a=vec4f(a.ggg,a.a);
#elif defined(OPERAND_A_CHANNEL_B)
a=vec4f(a.bbb,a.a);
#elif defined(OPERAND_A_CHANNEL_A)
a=a.aaaa;
#endif
#ifdef OPERAND_A_FACTOR
a*=uniforms.factorA;
#endif
#else
let a: vec4f=uniforms.factorA;
#endif
#ifdef OPERAND_B_TEXTURE
#ifdef OPERAND_B_MATRIX
var b: vec4f=textureSample(textureB,textureBSampler,(uniforms.textureBMatrix*vec4f(uv,0.0,1.0)).xy);
#else
var b: vec4f=textureSample(textureB,textureBSampler,uv);
#endif
#ifdef OPERAND_B_SRGB
b=vec4f(mix(b.rgb/vec3f(12.92),pow((b.rgb+vec3f(0.055))/vec3f(1.055),vec3f(2.4)),step(vec3f(0.04045),b.rgb)),b.a);
#endif
#ifdef OPERAND_B_CHANNEL_R
b=vec4f(b.rrr,b.a);
#elif defined(OPERAND_B_CHANNEL_G)
b=vec4f(b.ggg,b.a);
#elif defined(OPERAND_B_CHANNEL_B)
b=vec4f(b.bbb,b.a);
#elif defined(OPERAND_B_CHANNEL_A)
b=b.aaaa;
#endif
#ifdef OPERAND_B_FACTOR
b*=uniforms.factorB;
#endif
#else
let b: vec4f=uniforms.factorB;
#endif
#ifdef OP_CHANNEL_MAX
var _cmax: f32=max(max(a.r,a.g),a.b);
#ifdef CHANNEL_MAX_INCLUDE_ALPHA
_cmax=max(_cmax,a.a);var result: vec4f=vec4f(_cmax,_cmax,_cmax,_cmax);
#else
var result: vec4f=vec4f(_cmax,_cmax,_cmax,a.a);
#endif
#elif defined(OP_INVERT)
var _ir: f32=a.r; var _ig: f32=a.g; var _ib: f32=a.b; var _ia: f32=a.a;
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
var result: vec4f=vec4f(_ir,_ig,_ib,_ia);
#elif defined(OP_LERP)
#ifdef LERP_T_TEXTURE
#ifdef LERP_T_MATRIX
var t: vec4f=textureSample(textureT,textureTSampler,(uniforms.textureTMatrix*vec4f(uv,0.0,1.0)).xy);
#else
var t: vec4f=textureSample(textureT,textureTSampler,uv);
#endif
#ifdef LERP_T_SRGB
t=vec4f(mix(t.rgb/vec3f(12.92),pow((t.rgb+vec3f(0.055))/vec3f(1.055),vec3f(2.4)),step(vec3f(0.04045),t.rgb)),t.a);
#endif
#ifdef LERP_T_CHANNEL_R
t=vec4f(t.rrr,t.a);
#elif defined(LERP_T_CHANNEL_G)
t=vec4f(t.ggg,t.a);
#elif defined(LERP_T_CHANNEL_B)
t=vec4f(t.bbb,t.a);
#elif defined(LERP_T_CHANNEL_A)
t=t.aaaa;
#endif
#ifdef LERP_T_FACTOR
t*=uniforms.factorT;
#endif
#else
let t: vec4f=uniforms.factorT;
#endif
var result: vec4f=mix(a,b,t);
#elif defined(OP_MAX)
var result: vec4f=max(a,b);
#else
var result: vec4f=a*b;
#endif
#if defined(OUTPUT_MASK_R_ZERO) || defined(OUTPUT_MASK_G_ZERO) || defined(OUTPUT_MASK_B_ZERO) || defined(OUTPUT_MASK_A_ONE)
var _omr: f32=result.r; var _omg: f32=result.g; var _omb: f32=result.b; var _oma: f32=result.a;
#ifdef OUTPUT_MASK_R_ZERO
_omr=0.0;
#endif
#ifdef OUTPUT_MASK_G_ZERO
_omg=0.0;
#endif
#ifdef OUTPUT_MASK_B_ZERO
_omb=0.0;
#endif
#ifdef OUTPUT_MASK_A_ONE
_oma=1.0;
#endif
result=vec4f(_omr,_omg,_omb,_oma);
#endif
#ifdef OUTPUT_SRGB
result=vec4f(mix(result.rgb*vec3f(12.92),pow(result.rgb,vec3f(1.0/2.4))*vec3f(1.055)-vec3f(0.055),step(vec3f(0.0031308),result.rgb)),result.a);
#endif
fragmentOutputs.color=result;}
`,n.ShadersStoreWGSL[$]||(n.ShadersStoreWGSL[$]=ta),na={name:$,shader:ta}})))()}export{di as S,Si as _,Ji as a,hi as b,zi as c,Ni as d,Ai as f,Ci as g,Ei as h,Yi as i,Ri as l,Di as m,ea as n,Wi as o,ki as p,$i as r,Ui as s,ra as t,Pi as u,yi as v,mi as x,vi as y};