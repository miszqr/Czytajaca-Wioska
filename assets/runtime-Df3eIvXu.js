import{n as e}from"./rolldown-runtime-B0fFmPBj.js";import{f as t,p as n}from"./runtime-80dgCbxm.js";import{Dt as ee,Vt as te,qt as ne}from"./runtime-C2hiUyDL.js";import{I as re,R as ie}from"./runtime-DyTznOqg.js";var r,ae,oe;function se(){return(se=e((()=>{n(),r=`meshUboDeclaration`,ae=`struct Mesh {world : mat4x4<f32>,
visibility : f32,};var<uniform> mesh : Mesh;
#define WORLD_UBO
`,t.IncludesShadersStoreWGSL[r]||(t.IncludesShadersStoreWGSL[r]=ae),oe={name:r,shader:ae}})))()}var i,ce,le;function ue(){return(ue=e((()=>{n(),i=`objectIdFunctions`,ce=`fn encodeObjectId(objectId: f32)->vec4f {
#ifdef PREPASS_OBJECT_ID_R8
return vec4f(objectId/255.0,0.0,0.0,1.0);
#else
let id=i32(objectId);let encodedId=vec3f(
f32((id>>16) & 0xFF),
f32((id>>8) & 0xFF),
f32(id & 0xFF)
)/255.0;return vec4f(encodedId,select(0.0,1.0,id>0));
#endif
}
`,t.IncludesShadersStoreWGSL[i]||(t.IncludesShadersStoreWGSL[i]=ce),le={name:i,shader:ce}})))()}var a,de,fe;function pe(){return(pe=e((()=>{n(),a=`oitDeclaration`,de=`#ifdef ORDER_INDEPENDENT_TRANSPARENCY
#define MAX_DEPTH 99999.0
var oitDepthSamplerSampler: sampler;var oitDepthSampler: texture_2d<f32>;var oitFrontColorSamplerSampler: sampler;var oitFrontColorSampler: texture_2d<f32>;
#endif
`,t.IncludesShadersStoreWGSL[a]||(t.IncludesShadersStoreWGSL[a]=de),fe={name:a,shader:de}})))()}var o,me,he;function ge(){return(ge=e((()=>{n(),o=`mainUVVaryingDeclaration`,me=`#ifdef MAINUV{X}
varying vMainUV{X}: vec2f;
#endif
`,t.IncludesShadersStoreWGSL[o]||(t.IncludesShadersStoreWGSL[o]=me),he={name:o,shader:me}})))()}var s,_e,ve;function ye(){return(ye=e((()=>{n(),s=`helperFunctions`,_e=`const PI: f32=3.1415926535897932384626433832795;const TWO_PI: f32=6.283185307179586;const HALF_PI: f32=1.5707963267948966;const RECIPROCAL_PI: f32=0.3183098861837907;const RECIPROCAL_PI2: f32=0.15915494309189535;const RECIPROCAL_PI4: f32=0.07957747154594767;const HALF_MIN: f32=5.96046448e-08; 
const LinearEncodePowerApprox: f32=2.2;const GammaEncodePowerApprox: f32=1.0/LinearEncodePowerApprox;const LuminanceEncodeApprox: vec3f=vec3f(0.2126,0.7152,0.0722);const Epsilon:f32=0.0000001;fn square(x: f32)->f32 {return x*x;}
fn saturate(x: f32)->f32 {return clamp(x,0.0,1.0);}
fn saturateVec3(x: vec3f)->vec3f {return clamp(x,vec3f(),vec3f(1.0));}
fn saturateEps(x: f32)->f32 {return clamp(x,Epsilon,1.0);}
fn maxEps(x: f32)->f32 {return max(x,Epsilon);}
fn maxEpsVec3(x: vec3f)->vec3f {return max(x,vec3f(Epsilon));}
fn absEps(x: f32)->f32 {return abs(x)+Epsilon;}
fn transposeMat3(inMatrix: mat3x3f)->mat3x3f {let i0: vec3f=inMatrix[0];let i1: vec3f=inMatrix[1];let i2: vec3f=inMatrix[2];let outMatrix:mat3x3f=mat3x3f(
vec3(i0.x,i1.x,i2.x),
vec3(i0.y,i1.y,i2.y),
vec3(i0.z,i1.z,i2.z)
);return outMatrix;}
fn inverseMat3(inMatrix: mat3x3f)->mat3x3f {let a00: f32=inMatrix[0][0];let a01: f32=inMatrix[0][1];let a02: f32=inMatrix[0][2];let a10: f32=inMatrix[1][0];let a11: f32=inMatrix[1][1];let a12: f32=inMatrix[1][2];let a20: f32=inMatrix[2][0];let a21: f32=inMatrix[2][1];let a22: f32=inMatrix[2][2];let b01: f32=a22*a11-a12*a21;let b11: f32=-a22*a10+a12*a20;let b21: f32=a21*a10-a11*a20;let det: f32=a00*b01+a01*b11+a02*b21;return mat3x3f(b01/det,(-a22*a01+a02*a21)/det,(a12*a01-a02*a11)/det,
b11/det,(a22*a00-a02*a20)/det,(-a12*a00+a02*a10)/det,
b21/det,(-a21*a00+a01*a20)/det,(a11*a00-a01*a10)/det);}
#if USE_EXACT_SRGB_CONVERSIONS
fn toLinearSpaceExact(color: vec3f)->vec3f
{let nearZeroSection: vec3f=0.0773993808*color;let remainingSection: vec3f=pow(0.947867299*(color+vec3f(0.055)),vec3f(2.4));return select(remainingSection,nearZeroSection,color<=vec3f(0.04045));}
fn toGammaSpaceExact(color: vec3f)->vec3f
{let nearZeroSection: vec3f=12.92*color;let remainingSection: vec3f=1.055*pow(color,vec3f(0.41666))-vec3f(0.055);return select(remainingSection,nearZeroSection,color<=vec3f(0.0031308));}
#endif
fn toLinearSpace(color: f32)->f32
{
#if USE_EXACT_SRGB_CONVERSIONS
var nearZeroSection=0.0773993808*color;var remainingSection=pow(0.947867299*(color+0.055),2.4);return select(remainingSection,nearZeroSection,color<=0.04045);
#else
return pow(color,LinearEncodePowerApprox);
#endif
}
fn toLinearSpaceVec3(color: vec3f)->vec3f
{
#if USE_EXACT_SRGB_CONVERSIONS
return toLinearSpaceExact(color);
#else
return pow(color,vec3f(LinearEncodePowerApprox));
#endif
}
fn toLinearSpaceVec4(color: vec4<f32>)->vec4<f32>
{
#if USE_EXACT_SRGB_CONVERSIONS
return vec4f(toLinearSpaceExact(color.rgb),color.a);
#else
return vec4f(pow(color.rgb,vec3f(LinearEncodePowerApprox)),color.a);
#endif
}
fn toGammaSpace(color: vec4<f32>)->vec4<f32>
{
#if USE_EXACT_SRGB_CONVERSIONS
return vec4<f32>(toGammaSpaceExact(color.rgb),color.a);
#else
return vec4<f32>(pow(color.rgb,vec3f(GammaEncodePowerApprox)),color.a);
#endif
}
fn toGammaSpaceVec3(color: vec3f)->vec3f
{
#if USE_EXACT_SRGB_CONVERSIONS
return toGammaSpaceExact(color);
#else
return pow(color,vec3f(GammaEncodePowerApprox));
#endif
}
fn squareVec3(value: vec3f)->vec3f
{return value*value;}
fn pow5(value: f32)->f32 {let sq: f32=value*value;return sq*sq*value;}
fn double_refract(I: vec3f,N: vec3f,eta: f32)->vec3f {let Tfront: vec3f=refract(I,N,1.0/eta);let Nback: vec3f=normalize(reflect(N,Tfront));return refract(Tfront,-Nback,eta);}
fn getLuminanceUnclamped(color: vec3f)->f32
{return dot(color,LuminanceEncodeApprox);}
fn getLuminance(color: vec3f)->f32
{return saturate(getLuminanceUnclamped(color));}
fn getRand(seed: vec2<f32>)->f32 {return fract(sin(dot(seed.xy ,vec2<f32>(12.9898,78.233)))*43758.5453);}
fn dither(seed: vec2<f32>,varianceAmount: f32)->f32 {let rand: f32=getRand(seed);let normVariance: f32=varianceAmount/255.0;let dither: f32=mix(-normVariance,normVariance,rand);return dither;}
const rgbdMaxRange: f32=255.0;fn toRGBD(color: vec3f)->vec4<f32> {let maxRGB: f32=max(max(color.r,max(color.g,color.b)),Epsilon);var D: f32 =max(rgbdMaxRange/maxRGB,1.);D =clamp(floor(D)/255.0,0.,1.);var rgb: vec3f =color.rgb*D;rgb=toGammaSpaceVec3(rgb);return vec4<f32>(saturateVec3(rgb),D);}
fn fromRGBD(rgbd: vec4<f32>)->vec3f {let rgb=toLinearSpaceVec3(rgbd.rgb);return rgb/rgbd.a;}
fn parallaxCorrectNormal(vertexPos: vec3f,origVec: vec3f,cubeSize: vec3f,cubePos: vec3f)->vec3f {let invOrigVec: vec3f=vec3f(1.)/origVec;let halfSize: vec3f=cubeSize*0.5;let intersecAtMaxPlane: vec3f=(cubePos+halfSize-vertexPos)*invOrigVec;let intersecAtMinPlane: vec3f=(cubePos-halfSize-vertexPos)*invOrigVec;let largestIntersec: vec3f=max(intersecAtMaxPlane,intersecAtMinPlane);let distance: f32=min(min(largestIntersec.x,largestIntersec.y),largestIntersec.z);let intersectPositionWS: vec3f=vertexPos+origVec*distance;return intersectPositionWS-cubePos;}
fn equirectangularToCubemapDirection(uv : vec2f)->vec3f {var longitude : f32=uv.x*TWO_PI-PI;var latitude : f32=HALF_PI-uv.y*PI;var direction : vec3f;direction.x=cos(latitude)*sin(longitude);direction.y=sin(latitude);direction.z=cos(latitude)*cos(longitude);return direction;}
fn sqrtClamped(value: f32)->f32 {return sqrt(max(value,0.));}
fn avg(value: vec3f)->f32 {return dot(value,vec3f(0.333333333));}
fn singleScatterToMultiScatterAlbedo(rho_ss: vec3f)->vec3f {let s: vec3f=sqrt(max(vec3f(1.0)-rho_ss,vec3f(0.0)));return (vec3f(1.0)-s)*(vec3f(1.0)-vec3f(0.139)*s)/(vec3f(1.0)+vec3f(1.17)*s);}
fn multiScatterToSingleScatterAlbedo(rho_ms: vec3f)->vec3f {let s: vec3f=4.09712f+4.20863f*rho_ms-sqrt(9.59217f+41.6808f*rho_ms+17.7126f*rho_ms*rho_ms);return 1.0f-s*s;}
fn multiScatterToSingleScatterAlbedoWithAniso(rho_ms: vec3f,aniso: f32)->vec3f {let s: vec3f=4.09712+4.20863f*rho_ms-sqrt(9.59217f+41.6808f*rho_ms+17.7126f*rho_ms*rho_ms);return (vec3f(1.0f)-s*s)/maxEpsVec3(vec3f(1.0f)-vec3f(aniso)*s*s);}
fn min3(v: vec3f)->f32 {return min(v.x,min(v.y,v.z));}
fn max3(v: vec3f)->f32 {return max(v.x,max(v.y,v.z));}
fn uint2float(i: u32)->f32 {return bitcast<f32>(0x3F800000u | (i>>9u))-1.0;}
fn plasticSequence(rstate: u32)->vec2f {return vec2f(uint2float(rstate*3242174889u),
uint2float(rstate*2447445414u));}
`,t.IncludesShadersStoreWGSL[s]||(t.IncludesShadersStoreWGSL[s]=_e),ve={name:s,shader:_e}})))()}var c,be,xe;function Se(){return(Se=e((()=>{n(),c=`lightUboDeclaration`,be=`#ifdef LIGHT{X}
struct Light{X}
{vLightData: vec4f,
vLightDiffuse: vec4f,
vLightSpecular: vec4f,
#ifdef SPOTLIGHT{X}
vLightDirection: vec4f,
vLightFalloff: vec4f,
#elif defined(POINTLIGHT{X})
vLightFalloff: vec4f,
#elif defined(HEMILIGHT{X})
vLightGround: vec3f,
#elif defined(CLUSTLIGHT{X})
vSliceData: vec2f,
vSliceRanges: array<vec4f,CLUSTLIGHT_SLICES>,
#endif
#if defined(AREALIGHT{X}) && defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)
vLightWidth: vec4f,
vLightHeight: vec4f,
#endif
shadowsInfo: vec4f,
depthValues: vec2f} ;var<uniform> light{X} : Light{X};
#ifdef IESLIGHTTEXTURE{X}
var iesLightTexture{X}Sampler: sampler;var iesLightTexture{X}: texture_2d<f32>;
#endif
#ifdef RECTAREALIGHTEMISSIONTEXTURE{X}
var rectAreaLightEmissionTexture{X}Sampler: sampler;var rectAreaLightEmissionTexture{X}: texture_2d<f32>;
#endif
#ifdef PROJECTEDLIGHTTEXTURE{X}
uniform textureProjectionMatrix{X}: mat4x4f;var projectionLightTexture{X}Sampler: sampler;var projectionLightTexture{X}: texture_2d<f32>;
#endif
#ifdef CLUSTLIGHT{X}
var lightDataTexture{X}: texture_2d<f32>;var<storage,read> tileMaskBuffer{X}: array<u32>;
#endif
#ifdef SHADOW{X}
#ifdef SHADOWCSM{X}
uniform lightMatrix{X}: array<mat4x4f,SHADOWCSMNUM_CASCADES{X}>;uniform viewFrustumZ{X}: array<f32,SHADOWCSMNUM_CASCADES{X}>;uniform frustumLengths{X}: array<f32,SHADOWCSMNUM_CASCADES{X}>;uniform cascadeBlendFactor{X}: f32;varying vPositionFromLight{X}_0: vec4f;varying vDepthMetric{X}_0: f32;varying vPositionFromLight{X}_1: vec4f;varying vDepthMetric{X}_1: f32;varying vPositionFromLight{X}_2: vec4f;varying vDepthMetric{X}_2: f32;varying vPositionFromLight{X}_3: vec4f;varying vDepthMetric{X}_3: f32;varying vPositionFromCamera{X}: vec4f;var<private> vPositionFromLight{X}: array<vec4f,4>;var<private> vDepthMetric{X} : array<f32,4>;
#if defined(SHADOWPCSS{X})
var shadowTexture{X}Sampler: sampler_comparison; 
var shadowTexture{X}: texture_depth_2d_array;var depthTexture{X}Sampler: sampler;var depthTexture{X}: texture_2d_array<f32>;uniform lightSizeUVCorrection{X}: array<vec2f,SHADOWCSMNUM_CASCADES{X}>;uniform depthCorrection{X}: array<f32,SHADOWCSMNUM_CASCADES{X}>;uniform penumbraDarkness{X}: f32;
#elif defined(SHADOWPCF{X})
var shadowTexture{X}Sampler: sampler_comparison;var shadowTexture{X}: texture_depth_2d_array;
#else 
var shadowTexture{X}Sampler: sampler; 
var shadowTexture{X}: texture_2d_array<f32>;
#endif
#ifdef SHADOWCSMDEBUG{X}
const vCascadeColorsMultiplier{X}: array<vec3f,8>=array<vec3f,8>
(
vec3f ( 1.5,0.0,0.0 ),
vec3f ( 0.0,1.5,0.0 ),
vec3f ( 0.0,0.0,5.5 ),
vec3f ( 1.5,0.0,5.5 ),
vec3f ( 1.5,1.5,0.0 ),
vec3f ( 1.0,1.0,1.0 ),
vec3f ( 0.0,1.0,5.5 ),
vec3f ( 0.5,3.5,0.75 )
);
#endif
#elif defined(SHADOWCUBE{X})
var shadowTexture{X}Sampler: sampler;var shadowTexture{X}: texture_cube<f32>;
#else
varying vPositionFromLight{X}: vec4f;varying vDepthMetric{X}: f32;
#if defined(SHADOWPCSS{X})
var shadowTexture{X}Sampler: sampler_comparison; 
var shadowTexture{X}: texture_depth_2d;var depthTexture{X}Sampler: sampler; 
var depthTexture{X}: texture_2d<f32>;
#elif defined(SHADOWPCF{X})
var shadowTexture{X}Sampler: sampler_comparison;var shadowTexture{X}: texture_depth_2d;
#else
var shadowTexture{X}Sampler: sampler; 
var shadowTexture{X}: texture_2d<f32>;
#endif
uniform lightMatrix{X}: mat4x4f;
#endif
#endif
#endif
`,t.IncludesShadersStoreWGSL[c]||(t.IncludesShadersStoreWGSL[c]=be),xe={name:c,shader:be}})))()}var l,Ce,we;function Te(){return(Te=e((()=>{n(),l=`ltcHelperFunctions`,Ce=`fn LTCUv(N: vec3f,V: vec3f,roughness: f32)->vec2f {var LUTSIZE: f32=64.0;var LUTSCALE: f32=( LUTSIZE-1.0 )/LUTSIZE;var LUTBIAS:f32=0.5/LUTSIZE;var dotNV:f32=saturate( dot( N,V ) );var uv:vec2f=vec2f( roughness,sqrt( 1.0-dotNV ) );uv=uv*LUTSCALE+LUTBIAS;return uv;}
fn LTCClippedSphereFormFactor( f:vec3f )->f32 {var l: f32=length( f );return max( ( l*l+f.z )/( l+1.0 ),0.0 );}
fn LTCEdgeVectorFormFactor( v1:vec3f,v2:vec3f )->vec3f {var x:f32=dot( v1,v2 );var y:f32=abs( x );var a:f32=0.8543985+( 0.4965155+0.0145206*y )*y;var b:f32=3.4175940+( 4.1616724+y )*y;var v:f32=a/b;var thetaSintheta:f32=0.0;if( x>0.0 )
{thetaSintheta=v;}
else
{thetaSintheta=0.5*inverseSqrt( max( 1.0-x*x,0.00000001 ) )-v;}
return cross( v1,v2 )*thetaSintheta;}
fn LTCEvaluate( N:vec3f,V:vec3f,P:vec3f,mInv: mat3x3<f32>,rectCoords0:vec3f,rectCoords1:vec3f,rectCoords2:vec3f,rectCoords3:vec3f )->vec3f {var v1:vec3f=rectCoords1-rectCoords0;var v2:vec3f=rectCoords3-rectCoords0;var lightNormal:vec3f=cross( v1,v2 );if( dot( lightNormal,P-rectCoords0 )<0.0 ){return vec3f( 0.0 );}
var T1:vec3f=normalize( V-N*dot( V,N ) );var T2:vec3f=- cross( N,T1 ); 
var mat: mat3x3<f32>=mInv*transposeMat3( mat3x3<f32>( T1,T2,N ) );var coords0: vec3f=mat*( rectCoords0-P );var coords1: vec3f=mat*( rectCoords1-P );var coords2: vec3f=mat*( rectCoords2-P );var coords3: vec3f=mat*( rectCoords3-P );coords0=normalize( coords0 );coords1=normalize( coords1 );coords2=normalize( coords2 );coords3=normalize( coords3 );var vectorFormFactor:vec3f=vec3( 0.0 );vectorFormFactor+=LTCEdgeVectorFormFactor( coords0,coords1 );vectorFormFactor+=LTCEdgeVectorFormFactor( coords1,coords2 );vectorFormFactor+=LTCEdgeVectorFormFactor( coords2,coords3 );vectorFormFactor+=LTCEdgeVectorFormFactor( coords3,coords0 );var result:f32=LTCClippedSphereFormFactor( vectorFormFactor );return vec3f( result );}
struct areaLightData
{Diffuse: vec3f,
Specular: vec3f,
Fresnel: vec4f};fn computeAreaLightSpecularDiffuseFresnel(ltc1: texture_2d<f32>,ltc1Sampler:sampler,ltc2:texture_2d<f32>,ltc2Sampler:sampler,viewDir: vec3f,normal:vec3f,position:vec3f,lightPos:vec3f,halfWidth:vec3f, halfHeight:vec3f,roughness:f32)->areaLightData {var result: areaLightData;var rectCoords0:vec3f=lightPos+halfWidth-halfHeight; 
var rectCoords1:vec3f=lightPos-halfWidth-halfHeight;var rectCoords2:vec3f=lightPos-halfWidth+halfHeight;var rectCoords3:vec3f=lightPos+halfWidth+halfHeight;
#ifdef SPECULARTERM
var uv:vec2f=LTCUv( normal,viewDir,roughness );var t1:vec4f=textureSample( ltc1,ltc1Sampler,uv );var t2:vec4f=textureSample( ltc2,ltc2Sampler,uv );var mInv:mat3x3<f32>=mat3x3<f32>(
vec3f( t1.x,0,t1.y ),
vec3f( 0,1, 0 ),
vec3f( t1.z,0,t1.w )
);result.Fresnel=t2;result.Specular=LTCEvaluate( normal,viewDir,position,mInv,rectCoords0,rectCoords1,rectCoords2,rectCoords3 );
#endif
var mInvEmpty:mat3x3<f32>=mat3x3<f32>(
vec3f( 1,0,0 ),
vec3f( 0,1,0 ),
vec3f( 0,0,1 )
);result.Diffuse+=LTCEvaluate( normal,viewDir,position,mInvEmpty,rectCoords0,rectCoords1,rectCoords2,rectCoords3 );return result;}
fn FetchDiffuseFilteredTexture(texLightFiltered: texture_2d<f32>,texLightFilteredSampler: sampler,p1_: vec3f,p2_: vec3f,p3_: vec3f,p4_: vec3f)->vec3f {var V1: vec3f=p2_-p1_;var V2: vec3f=p4_-p1_;var planeOrtho: vec3f=cross(V1,V2);var planeAreaSquared: f32=dot(planeOrtho,planeOrtho);var planeDistxPlaneArea: f32=dot(planeOrtho,p1_);var P: vec3f=planeDistxPlaneArea*planeOrtho/planeAreaSquared-p1_;var dot_V1_V2: f32=dot(V1,V2);var inv_dot_V1_V1: f32=1.0/dot(V1,V1);var V2_: vec3f=V2-V1*dot_V1_V2*inv_dot_V1_V1;var Puv: vec2f;Puv.y=dot(V2_,P)/dot(V2_,V2_);Puv.x=dot(V1,P)*inv_dot_V1_V1-dot_V1_V2*inv_dot_V1_V1*Puv.y;var d: f32=abs(planeDistxPlaneArea)/pow(planeAreaSquared,0.75);var sampleLOD: f32=log(2048.0*d)/log(3.0);var sampleUV: vec2f=vec2f(0.125,0.125)+(vec2f(0.75)*Puv);sampleUV.x=1.0-sampleUV.x;return textureSampleLevel(texLightFiltered,texLightFilteredSampler,sampleUV,sampleLOD).rgb;}
fn LTCEvaluateWithEmission(N: vec3f,V: vec3f,P: vec3f,mInv: mat3x3<f32>,rectCoords0: vec3f,rectCoords1: vec3f,rectCoords2: vec3f,rectCoords3: vec3f,texFilteredMap: texture_2d<f32>,texFilteredMapSampler: sampler)->vec3f {var v1: vec3f=rectCoords1-rectCoords0;var v2: vec3f=rectCoords3-rectCoords0;var lightNormal: vec3f=cross(v1,v2);if (dot(lightNormal,P-rectCoords0)<0.0) {return vec3f(0.0);}
var T1: vec3f=normalize(V-N*dot(V,N));var T2: vec3f=-cross(N,T1);var mat: mat3x3<f32>=mInv*transposeMat3(mat3x3<f32>(T1,T2,N));var coords0: vec3f=mat*(rectCoords0-P);var coords1: vec3f=mat*(rectCoords1-P);var coords2: vec3f=mat*(rectCoords2-P);var coords3: vec3f=mat*(rectCoords3-P);var textureLight: vec3f=FetchDiffuseFilteredTexture(texFilteredMap,texFilteredMapSampler,coords0,coords1,coords2,coords3);coords0=normalize(coords0);coords1=normalize(coords1);coords2=normalize(coords2);coords3=normalize(coords3);var vectorFormFactor: vec3f=vec3f(0.0);vectorFormFactor+=LTCEdgeVectorFormFactor(coords0,coords1);vectorFormFactor+=LTCEdgeVectorFormFactor(coords1,coords2);vectorFormFactor+=LTCEdgeVectorFormFactor(coords2,coords3);vectorFormFactor+=LTCEdgeVectorFormFactor(coords3,coords0);var result: f32=LTCClippedSphereFormFactor(vectorFormFactor);return vec3f(result)*textureLight;}
fn computeAreaLightSpecularDiffuseFresnelWithEmission(ltc1: texture_2d<f32>,ltc1Sampler:sampler,ltc2:texture_2d<f32>,ltc2Sampler:sampler,emissionTexture: texture_2d<f32>,emissionTextureSampler:sampler,viewDir: vec3f,normal:vec3f,position:vec3f,lightPos:vec3f,halfWidth:vec3f, halfHeight:vec3f,roughness:f32)->areaLightData {var result: areaLightData;var rectCoords0: vec3f=lightPos+halfWidth-halfHeight; 
var rectCoords1: vec3f=lightPos-halfWidth-halfHeight;var rectCoords2: vec3f=lightPos-halfWidth+halfHeight;var rectCoords3: vec3f=lightPos+halfWidth+halfHeight;
#ifdef SPECULARTERM
var uv: vec2f=LTCUv(normal,viewDir,roughness);var t1: vec4f=textureSample(ltc1,ltc1Sampler,uv);var t2: vec4f=textureSample(ltc2,ltc2Sampler,uv);var mInv: mat3x3<f32>=mat3x3<f32>(
vec3f(t1.x,0,t1.y),
vec3f(0,1,0),
vec3f(t1.z,0,t1.w)
);result.Specular=LTCEvaluateWithEmission(normal,viewDir,position,mInv,rectCoords0,rectCoords1,rectCoords2,rectCoords3,emissionTexture,emissionTextureSampler);result.Fresnel=t2;
#endif
var mInvEmpty: mat3x3<f32>=mat3x3<f32>(
vec3f(1,0,0),
vec3f(0,1,0),
vec3f(0,0,1)
);result.Diffuse=LTCEvaluateWithEmission(normal,viewDir,position,mInvEmpty,rectCoords0,rectCoords1,rectCoords2,rectCoords3,emissionTexture,emissionTextureSampler);return result;}
`,t.IncludesShadersStoreWGSL[l]||(t.IncludesShadersStoreWGSL[l]=Ce),we={name:l,shader:Ce}})))()}var u,Ee,De;function Oe(){return(Oe=e((()=>{n(),Te(),ie(),re(),u=`lightsFragmentFunctions`,Ee=`struct lightingInfo
{diffuse: vec3f,
#ifdef SPECULARTERM
specular: vec3f,
#endif
#ifdef NDOTL
ndl: f32,
#endif
};fn computeLighting(viewDirectionW: vec3f,vNormal: vec3f,lightData: vec4f,diffuseColor: vec3f,specularColor: vec3f,range: f32,glossiness: f32)->lightingInfo {var result: lightingInfo;var lightVectorW: vec3f;var attenuation: f32=1.0;if (lightData.w==0.)
{var direction: vec3f=lightData.xyz-fragmentInputs.vPositionW;
#if defined(SKIP_OUT_OF_RANGE_LIGHTING) && !defined(NDOTL)
if (dot(direction,direction)>=range*range) {result.diffuse=vec3f(0.);
#ifdef SPECULARTERM
result.specular=vec3f(0.);
#endif
return result;}
#endif
attenuation=max(0.,1.0-length(direction)/range);lightVectorW=normalize(direction);}
else
{lightVectorW=normalize(-lightData.xyz);}
var ndl: f32=max(0.,dot(vNormal,lightVectorW));
#ifdef NDOTL
result.ndl=ndl;
#endif
result.diffuse=ndl*diffuseColor*attenuation;
#ifdef SPECULARTERM
var angleW: vec3f=normalize(viewDirectionW+lightVectorW);var specComp: f32=max(0.,dot(vNormal,angleW));specComp=pow(specComp,max(1.,glossiness));result.specular=specComp*specularColor*attenuation;
#endif
return result;}
fn getAttenuation(cosAngle: f32,exponent: f32)->f32 {return max(0.,pow(cosAngle,exponent));}
fn getIESAttenuation(cosAngle: f32,iesLightTexture: texture_2d<f32>,iesLightTextureSampler: sampler)->f32 {var angle=acos(cosAngle)/PI;return textureSampleLevel(iesLightTexture,iesLightTextureSampler,vec2f(angle,0),0.).r;}
fn computeBasicSpotLighting(viewDirectionW: vec3f,lightVectorW: vec3f,vNormal: vec3f,attenuation: f32,diffuseColor: vec3f,specularColor: vec3f,glossiness: f32)->lightingInfo {var result: lightingInfo;var ndl: f32=max(0.,dot(vNormal,lightVectorW));
#ifdef NDOTL
result.ndl=ndl;
#endif
result.diffuse=ndl*diffuseColor*attenuation;
#ifdef SPECULARTERM
var angleW: vec3f=normalize(viewDirectionW+lightVectorW);var specComp: f32=max(0.,dot(vNormal,angleW));specComp=pow(specComp,max(1.,glossiness));result.specular=specComp*specularColor*attenuation;
#endif
return result;}
fn computeIESSpotLighting(viewDirectionW: vec3f,vNormal: vec3f,lightData: vec4f,lightDirection: vec4f,diffuseColor: vec3f,specularColor: vec3f,range: f32,glossiness: f32,iesLightTexture: texture_2d<f32>,iesLightTextureSampler: sampler)->lightingInfo {var direction: vec3f=lightData.xyz-fragmentInputs.vPositionW;
#if defined(SKIP_OUT_OF_RANGE_LIGHTING) && !defined(NDOTL)
if (dot(direction,direction)>=range*range) {var result: lightingInfo;result.diffuse=vec3f(0.);
#ifdef SPECULARTERM
result.specular=vec3f(0.);
#endif
return result;}
#endif
var lightVectorW: vec3f=normalize(direction);var attenuation: f32=max(0.,1.0-length(direction)/range);var dotProduct=dot(lightDirection.xyz,-lightVectorW);var cosAngle: f32=max(0.,dotProduct);if (cosAngle>=lightDirection.w)
{attenuation*=getIESAttenuation(dotProduct,iesLightTexture,iesLightTextureSampler);return computeBasicSpotLighting(viewDirectionW,lightVectorW,vNormal,attenuation,diffuseColor,specularColor,glossiness);}
var result: lightingInfo;result.diffuse=vec3f(0.);
#ifdef SPECULARTERM
result.specular=vec3f(0.);
#endif
#ifdef NDOTL
result.ndl=0.;
#endif
return result;}
fn computeSpotLighting(viewDirectionW: vec3f,vNormal: vec3f ,lightData: vec4f,lightDirection: vec4f,diffuseColor: vec3f,specularColor: vec3f,range: f32,glossiness: f32)->lightingInfo {var direction: vec3f=lightData.xyz-fragmentInputs.vPositionW;
#if defined(SKIP_OUT_OF_RANGE_LIGHTING) && !defined(NDOTL)
if (dot(direction,direction)>=range*range) {var result: lightingInfo;result.diffuse=vec3f(0.);
#ifdef SPECULARTERM
result.specular=vec3f(0.);
#endif
return result;}
#endif
var lightVectorW: vec3f=normalize(direction);var attenuation: f32=max(0.,1.0-length(direction)/range);var cosAngle: f32=max(0.,dot(lightDirection.xyz,-lightVectorW));if (cosAngle>=lightDirection.w)
{attenuation*=getAttenuation(cosAngle,lightData.w);return computeBasicSpotLighting(viewDirectionW,lightVectorW,vNormal,attenuation,diffuseColor,specularColor,glossiness);}
var result: lightingInfo;result.diffuse=vec3f(0.);
#ifdef SPECULARTERM
result.specular=vec3f(0.);
#endif
#ifdef NDOTL
result.ndl=0.;
#endif
return result;}
fn computeHemisphericLighting(viewDirectionW: vec3f,vNormal: vec3f,lightData: vec4f,diffuseColor: vec3f,specularColor: vec3f,groundColor: vec3f,glossiness: f32)->lightingInfo {var result: lightingInfo;var ndl: f32=dot(vNormal,lightData.xyz)*0.5+0.5;
#ifdef NDOTL
result.ndl=ndl;
#endif
result.diffuse=mix(groundColor,diffuseColor,ndl);
#ifdef SPECULARTERM
var angleW: vec3f=normalize(viewDirectionW+lightData.xyz);var specComp: f32=max(0.,dot(vNormal,angleW));specComp=pow(specComp,max(1.,glossiness));result.specular=specComp*specularColor;
#endif
return result;}
fn computeProjectionTextureDiffuseLighting(projectionLightTexture: texture_2d<f32>,projectionLightSampler: sampler,textureProjectionMatrix: mat4x4f,posW: vec3f)->vec3f {var strq: vec4f=textureProjectionMatrix*vec4f(posW,1.0);strq/=strq.w;var textureColor: vec3f=textureSample(projectionLightTexture,projectionLightSampler,strq.xy).rgb;return textureColor;}
#if defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)
#include<ltcHelperFunctions>
var areaLightsLTC1SamplerSampler: sampler;var areaLightsLTC1Sampler: texture_2d<f32>;var areaLightsLTC2SamplerSampler: sampler;var areaLightsLTC2Sampler: texture_2d<f32>;fn computeAreaLighting(ltc1: texture_2d<f32>,ltc1Sampler:sampler,ltc2:texture_2d<f32>,ltc2Sampler:sampler,viewDirectionW: vec3f,vNormal:vec3f,vPosition:vec3f,lightPosition:vec3f,halfWidth:vec3f, halfHeight:vec3f,diffuseColor:vec3f,specularColor:vec3f,roughness:f32 )->lightingInfo
{var result: lightingInfo;var data: areaLightData=computeAreaLightSpecularDiffuseFresnel(ltc1,ltc1Sampler,ltc2,ltc2Sampler,viewDirectionW,vNormal,vPosition,lightPosition,halfWidth,halfHeight,roughness);
#ifdef SPECULARTERM
var fresnel:vec3f=( specularColor*data.Fresnel.x+( vec3f( 1.0 )-specularColor )*data.Fresnel.y );result.specular+=specularColor*fresnel*data.Specular;
#endif
result.diffuse+=diffuseColor*data.Diffuse;return result;}
fn computeAreaLightingWithTexture(ltc1: texture_2d<f32>,ltc1Sampler:sampler,ltc2:texture_2d<f32>,ltc2Sampler:sampler,emissionTexture: texture_2d<f32>,emissionTextureSampler:sampler,viewDirectionW: vec3f,vNormal:vec3f,vPosition:vec3f,lightPosition:vec3f,halfWidth:vec3f, halfHeight:vec3f,diffuseColor:vec3f,specularColor:vec3f,roughness:f32 )->lightingInfo
{var result: lightingInfo;var data: areaLightData=computeAreaLightSpecularDiffuseFresnelWithEmission(ltc1,ltc1Sampler,ltc2,ltc2Sampler,emissionTexture,emissionTextureSampler,viewDirectionW,vNormal,vPosition,lightPosition,halfWidth,halfHeight,roughness);
#ifdef SPECULARTERM
var fresnel: vec3f=( specularColor*data.Fresnel.x+( vec3f( 1.0 )-specularColor )*data.Fresnel.y );result.specular+=specularColor*fresnel*data.Specular;
#endif
result.diffuse+=diffuseColor*data.Diffuse;return result;}
#endif
#if defined(CLUSTLIGHT_BATCH) && CLUSTLIGHT_BATCH>0
#include<clusteredLightingFunctions>
#include<clusteredLightingCompute>[0..maxSimultaneousLights]
#endif
`,t.IncludesShadersStoreWGSL[u]||(t.IncludesShadersStoreWGSL[u]=Ee),De={name:u,shader:Ee}})))()}var d,ke,Ae;function je(){return(je=e((()=>{n(),d=`fresnelFunction`,ke=`#ifdef FRESNEL
fn computeFresnelTerm(viewDirection: vec3f,worldNormal: vec3f,bias: f32,power: f32)->f32
{let fresnelTerm: f32=pow(bias+abs(dot(viewDirection,worldNormal)),power);return clamp(fresnelTerm,0.,1.);}
#endif
`,t.IncludesShadersStoreWGSL[d]||(t.IncludesShadersStoreWGSL[d]=ke),Ae={name:d,shader:ke}})))()}var f,Me,Ne;function Pe(){return(Pe=e((()=>{n(),f=`imageProcessingDeclaration`,Me=`#ifdef EXPOSURE
uniform exposureLinear: f32;
#endif
#ifdef CONTRAST
uniform contrast: f32;
#endif
#ifdef WHITEBALANCE
uniform whiteBalanceMatrix: mat3x3f;
#endif
#if defined(VIGNETTE) || defined(DITHER)
uniform vInverseScreenSize: vec2f;
#endif
#ifdef VIGNETTE
uniform vignetteSettings1: vec4f;uniform vignetteSettings2: vec4f;
#endif
#ifdef COLORCURVES
uniform vCameraColorCurveNegative: vec4f;uniform vCameraColorCurveNeutral: vec4f;uniform vCameraColorCurvePositive: vec4f;
#endif
#ifdef COLORGRADING
#ifdef COLORGRADING3D
var txColorTransformSampler: sampler;var txColorTransform: texture_3d<f32>;
#else
var txColorTransformSampler: sampler;var txColorTransform: texture_2d<f32>;
#endif
uniform colorTransformSettings: vec4f;
#endif
#ifdef DITHER
uniform ditherIntensity: f32;
#endif
`,t.IncludesShadersStoreWGSL[f]||(t.IncludesShadersStoreWGSL[f]=Me),Ne={name:f,shader:Me}})))()}var p,Fe,Ie;function Le(){return(Le=e((()=>{n(),p=`imageProcessingFunctions`,Fe=`#if TONEMAPPING==3
const PBRNeutralStartCompression: f32=0.8-0.04;const PBRNeutralDesaturation: f32=0.15;fn PBRNeutralToneMapping( color: vec3f )->vec3f {var x: f32=min(color.r,min(color.g,color.b));var offset: f32=select(0.04,x-6.25*x*x,x<0.08);var result=color;result-=offset;var peak: f32=max(result.r,max(result.g,result.b));if (peak<PBRNeutralStartCompression) {return result;}
var d: f32=1.-PBRNeutralStartCompression;var newPeak: f32=1.-d*d/(peak+d-PBRNeutralStartCompression);result*=newPeak/peak;var g: f32=1.-1./(PBRNeutralDesaturation*(peak-newPeak)+1.);return mix(result,newPeak* vec3f(1,1,1),g);}
#endif
#if TONEMAPPING==2
const ACESInputMat: mat3x3f= mat3x3f(
vec3f(0.59719,0.07600,0.02840),
vec3f(0.35458,0.90834,0.13383),
vec3f(0.04823,0.01566,0.83777)
);const ACESOutputMat: mat3x3f= mat3x3f(
vec3f( 1.60475,-0.10208,-0.00327),
vec3f(-0.53108, 1.10813,-0.07276),
vec3f(-0.07367,-0.00605, 1.07602)
);fn RRTAndODTFit(v: vec3f)->vec3f
{var a: vec3f=v*(v+0.0245786)-0.000090537;var b: vec3f=v*(0.983729*v+0.4329510)+0.238081;return a/b;}
fn ACESFitted(color: vec3f)->vec3f
{var output=ACESInputMat*color;output=RRTAndODTFit(output);output=ACESOutputMat*output;output=saturateVec3(output);return output;}
#endif
#define CUSTOM_IMAGEPROCESSINGFUNCTIONS_DEFINITIONS
fn applyImageProcessing(result: vec4f)->vec4f {
#define CUSTOM_IMAGEPROCESSINGFUNCTIONS_UPDATERESULT_ATSTART
var rgb=result.rgb;;
#ifdef WHITEBALANCE
rgb=uniforms.whiteBalanceMatrix*rgb;rgb=max(rgb,vec3f(0.0));
#endif
#ifdef EXPOSURE
rgb*=uniforms.exposureLinear;
#endif
#ifdef VIGNETTE
var viewportXY: vec2f=fragmentInputs.position.xy*uniforms.vInverseScreenSize;viewportXY=viewportXY*2.0-1.0;var vignetteXY1: vec3f= vec3f(viewportXY*uniforms.vignetteSettings1.xy+uniforms.vignetteSettings1.zw,1.0);var vignetteTerm: f32=dot(vignetteXY1,vignetteXY1);var vignette: f32=pow(vignetteTerm,uniforms.vignetteSettings2.w);var vignetteColor: vec3f=uniforms.vignetteSettings2.rgb;
#ifdef VIGNETTEBLENDMODEMULTIPLY
var vignetteColorMultiplier: vec3f=mix(vignetteColor, vec3f(1,1,1),vignette);rgb*=vignetteColorMultiplier;
#endif
#ifdef VIGNETTEBLENDMODEOPAQUE
rgb=mix(vignetteColor,rgb,vignette);
#endif
#endif
#if TONEMAPPING==3
rgb=PBRNeutralToneMapping(rgb);
#elif TONEMAPPING==2
rgb=ACESFitted(rgb);
#elif TONEMAPPING==1
const tonemappingCalibration: f32=1.590579;rgb=1.0-exp2(-tonemappingCalibration*rgb);
#endif
rgb=toGammaSpaceVec3(rgb);rgb=saturateVec3(rgb);
#ifdef CONTRAST
var resultHighContrast: vec3f=rgb*rgb*(3.0-2.0*rgb);if (uniforms.contrast<1.0) {rgb=mix( vec3f(0.5,0.5,0.5),rgb,uniforms.contrast);} else {rgb=mix(rgb,resultHighContrast,uniforms.contrast-1.0);}
rgb=max(rgb,vec3f(0.));
#endif
#ifdef COLORGRADING
var colorTransformInput: vec3f=rgb*uniforms.colorTransformSettings.xxx+uniforms.colorTransformSettings.yyy;
#ifdef COLORGRADING3D
var colorTransformOutput: vec3f=textureSample(txColorTransform,txColorTransformSampler,colorTransformInput).rgb;
#else
var colorTransformOutput: vec3f=textureSample(txColorTransform,txColorTransformSampler,colorTransformInput,uniforms.colorTransformSettings.yz).rgb;
#endif
rgb=mix(rgb,colorTransformOutput,uniforms.colorTransformSettings.www);
#endif
#ifdef COLORCURVES
var luma: f32=getLuminance(rgb);var curveMix: vec2f=clamp( vec2f(luma*3.0-1.5,luma*-3.0+1.5), vec2f(0.0), vec2f(1.0));var colorCurve: vec4f=uniforms.vCameraColorCurveNeutral+curveMix.x*uniforms.vCameraColorCurvePositive-curveMix.y*uniforms.vCameraColorCurveNegative;rgb*=colorCurve.rgb;rgb=mix( vec3f(luma),rgb,colorCurve.a);
#endif
#ifdef DITHER
var rand: f32=getRand(fragmentInputs.position.xy*uniforms.vInverseScreenSize);var dither: f32=mix(-uniforms.ditherIntensity,uniforms.ditherIntensity,rand);rgb=saturateVec3(rgb+ vec3f(dither));
#endif
#define CUSTOM_IMAGEPROCESSINGFUNCTIONS_UPDATERESULT_ATEND
return vec4f(rgb,result.a);}`,t.IncludesShadersStoreWGSL[p]||(t.IncludesShadersStoreWGSL[p]=Fe),Ie={name:p,shader:Fe}})))()}var m,Re,ze;function Be(){return(Be=e((()=>{n(),m=`logDepthDeclaration`,Re=`#ifdef LOGARITHMICDEPTH
uniform logarithmicDepthConstant: f32;varying vFragmentDepth: f32;
#endif
`,t.IncludesShadersStoreWGSL[m]||(t.IncludesShadersStoreWGSL[m]=Re),ze={name:m,shader:Re}})))()}var h,Ve,He;function Ue(){return(Ue=e((()=>{n(),h=`fogFragmentDeclaration`,Ve=`#ifdef FOG
#define FOGMODE_NONE 0.
#define FOGMODE_EXP 1.
#define FOGMODE_EXP2 2.
#define FOGMODE_LINEAR 3.
const E=2.71828;uniform vFogInfos: vec4f;uniform vFogColor: vec3f;varying vFogDistance: vec3f;fn CalcFogFactor()->f32
{var fogCoeff: f32=1.0;var fogStart: f32=uniforms.vFogInfos.y;var fogEnd: f32=uniforms.vFogInfos.z;var fogDensity: f32=uniforms.vFogInfos.w;var fogDistance: f32=length(fragmentInputs.vFogDistance);if (FOGMODE_LINEAR==uniforms.vFogInfos.x)
{fogCoeff=(fogEnd-fogDistance)/(fogEnd-fogStart);}
else if (FOGMODE_EXP==uniforms.vFogInfos.x)
{fogCoeff=1.0/pow(E,fogDistance*fogDensity);}
else if (FOGMODE_EXP2==uniforms.vFogInfos.x)
{fogCoeff=1.0/pow(E,fogDistance*fogDistance*fogDensity*fogDensity);}
return clamp(fogCoeff,0.0,1.0);}
#endif
`,t.IncludesShadersStoreWGSL[h]||(t.IncludesShadersStoreWGSL[h]=Ve),He={name:h,shader:Ve}})))()}var g,We,Ge;function Ke(){return(Ke=e((()=>{n(),g=`lightFragment`,We=`#ifdef LIGHT{X}
#if defined(SHADOWONLY) || defined(LIGHTMAP) && defined(LIGHTMAPEXCLUDED{X}) && defined(LIGHTMAPNOSPECULAR{X})
#else
var diffuse{X}: vec4f=light{X}.vLightDiffuse;
#define CUSTOM_LIGHT{X}_COLOR 
#if defined(PBR) && defined(CLUSTLIGHT{X})
{let sliceIndex=min(getClusteredSliceIndex(light{X}.vSliceData,fragmentInputs.vViewDepth),CLUSTLIGHT_SLICES-1);info=computeClusteredLighting{X}(
lightDataTexture{X},
light{X}.vLightData,
vec2u(light{X}.vSliceRanges[sliceIndex].xy),
viewDirectionW,
normalW,
fragmentInputs.vPositionW,
surfaceAlbedo,
reflectivityOut,
#ifdef IRIDESCENCE
iridescenceIntensity,
#endif
#ifdef SS_TRANSLUCENCY
subSurfaceOut,
#endif
#ifdef SPECULARTERM
AARoughnessFactors.x,
#endif
#ifdef ANISOTROPIC
anisotropicOut,
#endif
#ifdef SHEEN
sheenOut,
#endif
#ifdef CLEARCOAT
clearcoatOut,
#endif
);}
#elif defined(PBR)
#ifdef SPOTLIGHT{X}
preInfo=computePointAndSpotPreLightingInfo(light{X}.vLightData,viewDirectionW,normalW,fragmentInputs.vPositionW);
#elif defined(POINTLIGHT{X})
preInfo=computePointAndSpotPreLightingInfo(light{X}.vLightData,viewDirectionW,normalW,fragmentInputs.vPositionW);
#elif defined(HEMILIGHT{X})
preInfo=computeHemisphericPreLightingInfo(light{X}.vLightData,viewDirectionW,normalW);
#elif defined(DIRLIGHT{X})
preInfo=computeDirectionalPreLightingInfo(light{X}.vLightData,viewDirectionW,normalW);
#elif defined(AREALIGHT{X}) && defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)
#if defined(RECTAREALIGHTEMISSIONTEXTURE{X})
preInfo=computeAreaPreLightingInfoWithTexture(areaLightsLTC1Sampler,areaLightsLTC1SamplerSampler,areaLightsLTC2Sampler,areaLightsLTC2SamplerSampler,rectAreaLightEmissionTexture{X},rectAreaLightEmissionTexture{X}Sampler,viewDirectionW,normalW,fragmentInputs.vPositionW,light{X}.vLightData.xyz,light{X}.vLightWidth.xyz,light{X}.vLightHeight.xyz,roughness);
#else
preInfo=computeAreaPreLightingInfo(areaLightsLTC1Sampler,areaLightsLTC1SamplerSampler,areaLightsLTC2Sampler,areaLightsLTC2SamplerSampler,viewDirectionW,normalW,fragmentInputs.vPositionW,light{X}.vLightData.xyz,light{X}.vLightWidth.xyz,light{X}.vLightHeight.xyz,roughness);
#endif
#endif
preInfo.NdotV=NdotV;
#ifdef SPOTLIGHT{X}
#ifdef LIGHT_FALLOFF_GLTF{X}
preInfo.attenuation=computeDistanceLightFalloff_GLTF(preInfo.lightDistanceSquared,light{X}.vLightFalloff.y);
#ifdef IESLIGHTTEXTURE{X}
preInfo.attenuation*=computeDirectionalLightFalloff_IES(light{X}.vLightDirection.xyz,preInfo.L,iesLightTexture{X},iesLightTexture{X}Sampler);
#else
preInfo.attenuation*=computeDirectionalLightFalloff_GLTF(light{X}.vLightDirection.xyz,preInfo.L,light{X}.vLightFalloff.z,light{X}.vLightFalloff.w);
#endif
#elif defined(LIGHT_FALLOFF_PHYSICAL{X})
preInfo.attenuation=computeDistanceLightFalloff_Physical(preInfo.lightDistanceSquared);
#ifdef IESLIGHTTEXTURE{X}
preInfo.attenuation*=computeDirectionalLightFalloff_IES(light{X}.vLightDirection.xyz,preInfo.L,iesLightTexture{X},iesLightTexture{X}Sampler);
#else
preInfo.attenuation*=computeDirectionalLightFalloff_Physical(light{X}.vLightDirection.xyz,preInfo.L,light{X}.vLightDirection.w);
#endif
#elif defined(LIGHT_FALLOFF_STANDARD{X})
preInfo.attenuation=computeDistanceLightFalloff_Standard(preInfo.lightOffset,light{X}.vLightFalloff.x);
#ifdef IESLIGHTTEXTURE{X}
preInfo.attenuation*=computeDirectionalLightFalloff_IES(light{X}.vLightDirection.xyz,preInfo.L,iesLightTexture{X},iesLightTexture{X}Sampler);
#else
preInfo.attenuation*=computeDirectionalLightFalloff_Standard(light{X}.vLightDirection.xyz,preInfo.L,light{X}.vLightDirection.w,light{X}.vLightData.w);
#endif
#else
preInfo.attenuation=computeDistanceLightFalloff(preInfo.lightOffset,preInfo.lightDistanceSquared,light{X}.vLightFalloff.x,light{X}.vLightFalloff.y);
#ifdef IESLIGHTTEXTURE{X}
preInfo.attenuation*=computeDirectionalLightFalloff_IES(light{X}.vLightDirection.xyz,preInfo.L,iesLightTexture{X},iesLightTexture{X}Sampler);
#else
preInfo.attenuation*=computeDirectionalLightFalloff(light{X}.vLightDirection.xyz,preInfo.L,light{X}.vLightDirection.w,light{X}.vLightData.w,light{X}.vLightFalloff.z,light{X}.vLightFalloff.w);
#endif
#endif
#elif defined(POINTLIGHT{X})
#ifdef LIGHT_FALLOFF_GLTF{X}
preInfo.attenuation=computeDistanceLightFalloff_GLTF(preInfo.lightDistanceSquared,light{X}.vLightFalloff.y);
#elif defined(LIGHT_FALLOFF_PHYSICAL{X})
preInfo.attenuation=computeDistanceLightFalloff_Physical(preInfo.lightDistanceSquared);
#elif defined(LIGHT_FALLOFF_STANDARD{X})
preInfo.attenuation=computeDistanceLightFalloff_Standard(preInfo.lightOffset,light{X}.vLightFalloff.x);
#else
preInfo.attenuation=computeDistanceLightFalloff(preInfo.lightOffset,preInfo.lightDistanceSquared,light{X}.vLightFalloff.x,light{X}.vLightFalloff.y);
#endif
#else
preInfo.attenuation=1.0;
#endif
#if defined(HEMILIGHT{X})
preInfo.roughness=roughness;
#elif defined(AREALIGHT{X}) && defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)
preInfo.roughness=roughness;
#else
preInfo.roughness=adjustRoughnessFromLightProperties(roughness,light{X}.vLightSpecular.a,preInfo.lightDistance);
#endif
preInfo.diffuseRoughness=diffuseRoughness;preInfo.surfaceAlbedo=surfaceAlbedo;
#ifdef IRIDESCENCE
preInfo.iridescenceIntensity=iridescenceIntensity;
#endif
#ifdef SS_TRANSLUCENCY
info.diffuseTransmission=vec3f(0.0);
#endif
#ifdef HEMILIGHT{X}
info.diffuse=computeHemisphericDiffuseLighting(preInfo,diffuse{X}.rgb,light{X}.vLightGround);
#elif defined(AREALIGHT{X}) && defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)
info.diffuse=computeAreaDiffuseLighting(preInfo,diffuse{X}.rgb);
#elif defined(SS_TRANSLUCENCY)
#ifndef SS_TRANSLUCENCY_LEGACY
info.diffuse=computeDiffuseLighting(preInfo,diffuse{X}.rgb)*(1.0-subSurfaceOut.translucencyIntensity);info.diffuseTransmission=computeDiffuseTransmittedLighting(preInfo,diffuse{X}.rgb,subSurfaceOut.transmittance); 
#else
info.diffuse=computeDiffuseTransmittedLighting(preInfo,diffuse{X}.rgb,subSurfaceOut.transmittance);
#endif
#else
info.diffuse=computeDiffuseLighting(preInfo,diffuse{X}.rgb);
#endif
#ifdef SPECULARTERM
#if defined(AREALIGHT{X}) && defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)
info.specular=computeAreaSpecularLighting(preInfo,light{X}.vLightSpecular.rgb,clearcoatOut.specularEnvironmentR0,reflectivityOut.colorReflectanceF90);
#else
#if (CONDUCTOR_SPECULAR_MODEL==CONDUCTOR_SPECULAR_MODEL_OPENPBR)
{let metalFresnel: vec3f=vec3f(reflectivityOut.specularWeight)*getF82Specular(preInfo.VdotH,clearcoatOut.specularEnvironmentR0,reflectivityOut.colorReflectanceF90,reflectivityOut.roughness);let dielectricFresnel: vec3f=fresnelSchlickGGXVec3(preInfo.VdotH,reflectivityOut.dielectricColorF0,reflectivityOut.colorReflectanceF90);coloredFresnel=mix(dielectricFresnel,metalFresnel,reflectivityOut.metallic);}
#else
coloredFresnel=fresnelSchlickGGXVec3(preInfo.VdotH,clearcoatOut.specularEnvironmentR0,reflectivityOut.colorReflectanceF90);
#endif
#ifndef LEGACY_SPECULAR_ENERGY_CONSERVATION
{let NdotH: f32=dot(normalW,preInfo.H);let fresnel: vec3f=fresnelSchlickGGXVec3(NdotH,vec3f(reflectanceF0),specularEnvironmentR90);info.diffuse*=(vec3f(1.0)-fresnel);}
#endif
#ifdef ANISOTROPIC
info.specular=computeAnisotropicSpecularLighting(preInfo,viewDirectionW,normalW,anisotropicOut.anisotropicTangent,anisotropicOut.anisotropicBitangent,anisotropicOut.anisotropy,clearcoatOut.specularEnvironmentR0,specularEnvironmentR90,AARoughnessFactors.x,diffuse{X}.rgb);
#else
info.specular=computeSpecularLighting(preInfo,normalW,clearcoatOut.specularEnvironmentR0,coloredFresnel,AARoughnessFactors.x,diffuse{X}.rgb);
#endif
#endif
#endif
#ifndef AREALIGHT{X}
#ifdef SHEEN
#ifdef SHEEN_LINKWITHALBEDO
preInfo.roughness=sheenOut.sheenIntensity;
#else
#ifdef HEMILIGHT{X}
preInfo.roughness=sheenOut.sheenRoughness;
#else
preInfo.roughness=adjustRoughnessFromLightProperties(sheenOut.sheenRoughness,light{X}.vLightSpecular.a,preInfo.lightDistance);
#endif
#endif
info.sheen=computeSheenLighting(preInfo,normalW,sheenOut.sheenColor,specularEnvironmentR90,AARoughnessFactors.x,diffuse{X}.rgb);
#endif
#ifdef CLEARCOAT
#ifdef HEMILIGHT{X}
preInfo.roughness=clearcoatOut.clearCoatRoughness;
#else
preInfo.roughness=adjustRoughnessFromLightProperties(clearcoatOut.clearCoatRoughness,light{X}.vLightSpecular.a,preInfo.lightDistance);
#endif
info.clearCoat=computeClearCoatLighting(preInfo,clearcoatOut.clearCoatNormalW,clearcoatOut.clearCoatAARoughnessFactors.x,clearcoatOut.clearCoatIntensity,diffuse{X}.rgb);
#ifdef CLEARCOAT_TINT
absorption=computeClearCoatLightingAbsorption(clearcoatOut.clearCoatNdotVRefract,preInfo.L,clearcoatOut.clearCoatNormalW,clearcoatOut.clearCoatColor,clearcoatOut.clearCoatThickness,clearcoatOut.clearCoatIntensity);info.diffuse*=absorption;
#ifdef SS_TRANSLUCENCY
info.diffuseTransmission*=absorption;
#endif
#ifdef SPECULARTERM
info.specular*=absorption;
#endif
#endif
info.diffuse*=info.clearCoat.w;
#ifdef SS_TRANSLUCENCY
info.diffuseTransmission*=info.clearCoat.w;
#endif
#ifdef SPECULARTERM
info.specular*=info.clearCoat.w;
#endif
#ifdef SHEEN
info.sheen*=info.clearCoat.w;
#endif
#endif
#endif
#else
#ifdef SPOTLIGHT{X}
#ifdef IESLIGHTTEXTURE{X}
info=computeIESSpotLighting(viewDirectionW,normalW,light{X}.vLightData,light{X}.vLightDirection,diffuse{X}.rgb,light{X}.vLightSpecular.rgb,diffuse{X}.a,glossiness,iesLightTexture{X},iesLightTexture{X}Sampler);
#else
info=computeSpotLighting(viewDirectionW,normalW,light{X}.vLightData,light{X}.vLightDirection,diffuse{X}.rgb,light{X}.vLightSpecular.rgb,diffuse{X}.a,glossiness);
#endif
#elif defined(HEMILIGHT{X})
info=computeHemisphericLighting(viewDirectionW,normalW,light{X}.vLightData,diffuse{X}.rgb,light{X}.vLightSpecular.rgb,light{X}.vLightGround,glossiness);
#elif defined(POINTLIGHT{X}) || defined(DIRLIGHT{X})
info=computeLighting(viewDirectionW,normalW,light{X}.vLightData,diffuse{X}.rgb,light{X}.vLightSpecular.rgb,diffuse{X}.a,glossiness);
#elif define(AREALIGHT{X}) && defined(AREALIGHTSUPPORTED)
#if defined(RECTAREALIGHTEMISSIONTEXTURE{X})
info=computeAreaLightingWithTexture(areaLightsLTC1Sampler,areaLightsLTC1SamplerSampler,areaLightsLTC2Sampler,areaLightsLTC2SamplerSampler,rectAreaLightEmissionTexture{X},rectAreaLightEmissionTexture{X}Sampler,viewDirectionW,normalW,fragmentInputs.vPositionW,light{X}.vLightData.xyz,light{X}.vLightWidth.xyz,light{X}.vLightHeight.xyz,diffuse{X}.rgb,light{X}.vLightSpecular.rgb,
#ifdef AREALIGHTNOROUGHTNESS
0.5
#else
uniforms.vReflectionInfos.y
#endif
);
#else
info=computeAreaLighting(areaLightsLTC1Sampler,areaLightsLTC1SamplerSampler,areaLightsLTC2Sampler,areaLightsLTC2SamplerSampler,viewDirectionW,normalW,fragmentInputs.vPositionW,light{X}.vLightData.xyz,light{X}.vLightWidth.xyz,light{X}.vLightHeight.xyz,diffuse{X}.rgb,light{X}.vLightSpecular.rgb,
#ifdef AREALIGHTNOROUGHTNESS
0.5
#else
uniforms.vReflectionInfos.y
#endif
);
#endif
#elif defined(CLUSTLIGHT{X})
{let sliceIndex=min(getClusteredSliceIndex(light{X}.vSliceData,fragmentInputs.vViewDepth),CLUSTLIGHT_SLICES-1);info=computeClusteredLighting{X}(lightDataTexture{X},viewDirectionW,normalW,light{X}.vLightData,vec2u(light{X}.vSliceRanges[sliceIndex].xy),glossiness);}
#endif
#endif
#ifdef PROJECTEDLIGHTTEXTURE{X}
info.diffuse*=computeProjectionTextureDiffuseLighting(projectionLightTexture{X},projectionLightTexture{X}Sampler,uniforms.textureProjectionMatrix{X},fragmentInputs.vPositionW);
#endif
#endif
#ifdef SHADOW{X}
#ifdef SHADOWCSMDEBUG{X}
var shadowDebug{X}: vec3f;
#endif
#ifdef SHADOWCSM{X}
#ifdef SHADOWCSMUSESHADOWMAXZ{X}
var index{X}: i32=-1;
#else
var index{X}: i32=SHADOWCSMNUM_CASCADES{X}-1;
#endif
var diff{X}: f32=0.;vPositionFromLight{X}[0]=fragmentInputs.vPositionFromLight{X}_0;vPositionFromLight{X}[1]=fragmentInputs.vPositionFromLight{X}_1;vPositionFromLight{X}[2]=fragmentInputs.vPositionFromLight{X}_2;vPositionFromLight{X}[3]=fragmentInputs.vPositionFromLight{X}_3;vDepthMetric{X}[0]=fragmentInputs.vDepthMetric{X}_0;vDepthMetric{X}[1]=fragmentInputs.vDepthMetric{X}_1;vDepthMetric{X}[2]=fragmentInputs.vDepthMetric{X}_2;vDepthMetric{X}[3]=fragmentInputs.vDepthMetric{X}_3;for (var i:i32=0; i<SHADOWCSMNUM_CASCADES{X}; i++)
{
#ifdef SHADOWCSM_RIGHTHANDED{X}
diff{X}=uniforms.viewFrustumZ{X}[i]+fragmentInputs.vPositionFromCamera{X}.z;
#else
diff{X}=uniforms.viewFrustumZ{X}[i]-fragmentInputs.vPositionFromCamera{X}.z;
#endif
if (diff{X}>=0.) {index{X}=i;break;}}
#ifdef SHADOWCSMUSESHADOWMAXZ{X}
if (index{X}>=0)
#endif
{
#if defined(SHADOWPCF{X})
#if defined(SHADOWLOWQUALITY{X})
shadow=computeShadowWithCSMPCF1(index{X},vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],shadowTexture{X},shadowTexture{X}Sampler,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);
#elif defined(SHADOWMEDIUMQUALITY{X})
shadow=computeShadowWithCSMPCF3(index{X},vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],shadowTexture{X},shadowTexture{X}Sampler,light{X}.shadowsInfo.yz,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);
#else
shadow=computeShadowWithCSMPCF5(index{X},vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],shadowTexture{X},shadowTexture{X}Sampler,light{X}.shadowsInfo.yz,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);
#endif
#elif defined(SHADOWPCSS{X})
#if defined(SHADOWLOWQUALITY{X})
shadow=computeShadowWithCSMPCSS16(index{X},vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],depthTexture{X},depthTexture{X}Sampler,shadowTexture{X},shadowTexture{X}Sampler,light{X}.shadowsInfo.y,light{X}.shadowsInfo.z,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w,uniforms.lightSizeUVCorrection{X}[index{X}],uniforms.depthCorrection{X}[index{X}],uniforms.penumbraDarkness{X});
#elif defined(SHADOWMEDIUMQUALITY{X})
shadow=computeShadowWithCSMPCSS32(index{X},vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],depthTexture{X},depthTexture{X}Sampler,shadowTexture{X},shadowTexture{X}Sampler,light{X}.shadowsInfo.y,light{X}.shadowsInfo.z,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w,uniforms.lightSizeUVCorrection{X}[index{X}],uniforms.depthCorrection{X}[index{X}],uniforms.penumbraDarkness{X});
#else
shadow=computeShadowWithCSMPCSS64(index{X},vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],depthTexture{X},depthTexture{X}Sampler,shadowTexture{X},shadowTexture{X}Sampler,light{X}.shadowsInfo.y,light{X}.shadowsInfo.z,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w,uniforms.lightSizeUVCorrection{X}[index{X}],uniforms.depthCorrection{X}[index{X}],uniforms.penumbraDarkness{X});
#endif
#else
shadow=computeShadowCSM(index{X},vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],shadowTexture{X},shadowTexture{X}Sampler,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);
#endif
#ifdef SHADOWCSMDEBUG{X}
shadowDebug{X}=vec3f(shadow)*vCascadeColorsMultiplier{X}[index{X}];
#endif
#ifndef SHADOWCSMNOBLEND{X}
var frustumLength:f32=uniforms.frustumLengths{X}[index{X}];var diffRatio:f32=clamp(diff{X}/frustumLength,0.,1.)*uniforms.cascadeBlendFactor{X};if (index{X}<(SHADOWCSMNUM_CASCADES{X}-1) && diffRatio<1.)
{index{X}+=1;var nextShadow: f32=0.;
#if defined(SHADOWPCF{X})
#if defined(SHADOWLOWQUALITY{X})
nextShadow=computeShadowWithCSMPCF1(index{X},vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],shadowTexture{X},shadowTexture{X}Sampler,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);
#elif defined(SHADOWMEDIUMQUALITY{X})
nextShadow=computeShadowWithCSMPCF3(index{X},vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],shadowTexture{X},shadowTexture{X}Sampler,light{X}.shadowsInfo.yz,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);
#else
nextShadow=computeShadowWithCSMPCF5(index{X},vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],shadowTexture{X},shadowTexture{X}Sampler,light{X}.shadowsInfo.yz,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);
#endif
#elif defined(SHADOWPCSS{X})
#if defined(SHADOWLOWQUALITY{X})
nextShadow=computeShadowWithCSMPCSS16(index{X},vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],depthTexture{X},depthTexture{X}Sampler,shadowTexture{X},shadowTexture{X}Sampler,light{X}.shadowsInfo.y,light{X}.shadowsInfo.z,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w,uniforms.lightSizeUVCorrection{X}[index{X}],uniforms.depthCorrection{X}[index{X}],uniforms.penumbraDarkness{X});
#elif defined(SHADOWMEDIUMQUALITY{X})
nextShadow=computeShadowWithCSMPCSS32(index{X},vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],depthTexture{X},depthTexture{X}Sampler,shadowTexture{X},shadowTexture{X}Sampler,light{X}.shadowsInfo.y,light{X}.shadowsInfo.z,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w,uniforms.lightSizeUVCorrection{X}[index{X}],uniforms.depthCorrection{X}[index{X}],uniforms.penumbraDarkness{X});
#else
nextShadow=computeShadowWithCSMPCSS64(index{X},vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],depthTexture{X},depthTexture{X}Sampler,shadowTexture{X},shadowTexture{X}Sampler,light{X}.shadowsInfo.y,light{X}.shadowsInfo.z,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w,uniforms.lightSizeUVCorrection{X}[index{X}],uniforms.depthCorrection{X}[index{X}],uniforms.penumbraDarkness{X});
#endif
#else
nextShadow=computeShadowCSM(index{X},vPositionFromLight{X}[index{X}],vDepthMetric{X}[index{X}],shadowTexture{X},shadowTexture{X}Sampler,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);
#endif
shadow=mix(nextShadow,shadow,diffRatio);
#ifdef SHADOWCSMDEBUG{X}
shadowDebug{X}=mix(vec3(nextShadow)*vCascadeColorsMultiplier{X}[index{X}],shadowDebug{X},diffRatio);
#endif
}
#endif
}
#elif defined(SHADOWCLOSEESM{X})
#if defined(SHADOWCUBE{X})
shadow=computeShadowWithCloseESMCube(fragmentInputs.vPositionW,light{X}.vLightData.xyz,shadowTexture{X},shadowTexture{X}Sampler,light{X}.shadowsInfo.x,light{X}.shadowsInfo.z,light{X}.depthValues);
#else
shadow=computeShadowWithCloseESM(fragmentInputs.vPositionFromLight{X},fragmentInputs.vDepthMetric{X},shadowTexture{X},shadowTexture{X}Sampler,light{X}.shadowsInfo.x,light{X}.shadowsInfo.z,light{X}.shadowsInfo.w);
#endif
#elif defined(SHADOWESM{X})
#if defined(SHADOWCUBE{X})
shadow=computeShadowWithESMCube(fragmentInputs.vPositionW,light{X}.vLightData.xyz,shadowTexture{X},shadowTexture{X}Sampler,light{X}.shadowsInfo.x,light{X}.shadowsInfo.z,light{X}.depthValues);
#else
shadow=computeShadowWithESM(fragmentInputs.vPositionFromLight{X},fragmentInputs.vDepthMetric{X},shadowTexture{X},shadowTexture{X}Sampler,light{X}.shadowsInfo.x,light{X}.shadowsInfo.z,light{X}.shadowsInfo.w);
#endif
#elif defined(SHADOWPOISSON{X})
#if defined(SHADOWCUBE{X})
shadow=computeShadowWithPoissonSamplingCube(fragmentInputs.vPositionW,light{X}.vLightData.xyz,shadowTexture{X},shadowTexture{X}Sampler,light{X}.shadowsInfo.y,light{X}.shadowsInfo.x,light{X}.depthValues);
#else
shadow=computeShadowWithPoissonSampling(fragmentInputs.vPositionFromLight{X},fragmentInputs.vDepthMetric{X},shadowTexture{X},shadowTexture{X}Sampler,light{X}.shadowsInfo.y,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);
#endif
#elif defined(SHADOWPCF{X})
#if defined(SHADOWLOWQUALITY{X})
shadow=computeShadowWithPCF1(fragmentInputs.vPositionFromLight{X},fragmentInputs.vDepthMetric{X},shadowTexture{X},shadowTexture{X}Sampler,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);
#elif defined(SHADOWMEDIUMQUALITY{X})
shadow=computeShadowWithPCF3(fragmentInputs.vPositionFromLight{X},fragmentInputs.vDepthMetric{X},shadowTexture{X},shadowTexture{X}Sampler,light{X}.shadowsInfo.yz,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);
#else
shadow=computeShadowWithPCF5(fragmentInputs.vPositionFromLight{X},fragmentInputs.vDepthMetric{X},shadowTexture{X},shadowTexture{X}Sampler,light{X}.shadowsInfo.yz,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);
#endif
#elif defined(SHADOWPCSS{X})
#if defined(SHADOWLOWQUALITY{X})
shadow=computeShadowWithPCSS16(fragmentInputs.vPositionFromLight{X},fragmentInputs.vDepthMetric{X},depthTexture{X},depthTexture{X}Sampler,shadowTexture{X},shadowTexture{X}Sampler,light{X}.shadowsInfo.y,light{X}.shadowsInfo.z,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);
#elif defined(SHADOWMEDIUMQUALITY{X})
shadow=computeShadowWithPCSS32(fragmentInputs.vPositionFromLight{X},fragmentInputs.vDepthMetric{X},depthTexture{X},depthTexture{X}Sampler,shadowTexture{X},shadowTexture{X}Sampler,light{X}.shadowsInfo.y,light{X}.shadowsInfo.z,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);
#else
shadow=computeShadowWithPCSS64(fragmentInputs.vPositionFromLight{X},fragmentInputs.vDepthMetric{X},depthTexture{X},depthTexture{X}Sampler,shadowTexture{X},shadowTexture{X}Sampler,light{X}.shadowsInfo.y,light{X}.shadowsInfo.z,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);
#endif
#else
#if defined(SHADOWCUBE{X})
shadow=computeShadowCube(fragmentInputs.vPositionW,light{X}.vLightData.xyz,shadowTexture{X},shadowTexture{X}Sampler,light{X}.shadowsInfo.x,light{X}.depthValues);
#else
shadow=computeShadow(fragmentInputs.vPositionFromLight{X},fragmentInputs.vDepthMetric{X},shadowTexture{X},shadowTexture{X}Sampler,light{X}.shadowsInfo.x,light{X}.shadowsInfo.w);
#endif
#endif
#ifdef SHADOWONLY
#ifndef SHADOWINUSE
#define SHADOWINUSE
#endif
globalShadow+=shadow;shadowLightCount+=1.0;
#endif
#else
shadow=1.;
#endif
aggShadow+=shadow;numLights+=1.0;
#ifndef SHADOWONLY
#ifdef CUSTOMUSERLIGHTING
diffuseBase+=computeCustomDiffuseLighting(info,diffuseBase,shadow);
#ifdef SPECULARTERM
specularBase+=computeCustomSpecularLighting(info,specularBase,shadow);
#endif
#elif defined(LIGHTMAP) && defined(LIGHTMAPEXCLUDED{X})
diffuseBase+=lightmapColor.rgb*shadow;
#ifdef SPECULARTERM
#ifndef LIGHTMAPNOSPECULAR{X}
specularBase+=info.specular*shadow*lightmapColor.rgb;
#endif
#endif
#ifdef CLEARCOAT
#ifndef LIGHTMAPNOSPECULAR{X}
clearCoatBase+=info.clearCoat.rgb*shadow*lightmapColor.rgb;
#endif
#endif
#ifdef SHEEN
#ifndef LIGHTMAPNOSPECULAR{X}
sheenBase+=info.sheen.rgb*shadow;
#endif
#endif
#else
#ifdef SHADOWCSMDEBUG{X}
diffuseBase+=info.diffuse*shadowDebug{X};
#else
diffuseBase+=info.diffuse*shadow;
#endif
#ifdef SS_TRANSLUCENCY
diffuseTransmissionBase+=info.diffuseTransmission*shadow;
#endif
#ifdef SPECULARTERM
specularBase+=info.specular*shadow;
#endif
#ifdef CLEARCOAT
clearCoatBase+=info.clearCoat.rgb*shadow;
#endif
#ifdef SHEEN
sheenBase+=info.sheen.rgb*shadow;
#endif
#endif
#endif
#endif
`,t.IncludesShadersStoreWGSL[g]||(t.IncludesShadersStoreWGSL[g]=We),Ge={name:g,shader:We}})))()}var _,qe,Je;function Ye(){return(Ye=e((()=>{n(),_=`logDepthFragment`,qe=`#ifdef LOGARITHMICDEPTH
fragmentOutputs.fragDepth=log2(fragmentInputs.vFragmentDepth)*uniforms.logarithmicDepthConstant*0.5;
#endif
`,t.IncludesShadersStoreWGSL[_]||(t.IncludesShadersStoreWGSL[_]=qe),Je={name:_,shader:qe}})))()}var v,Xe,Ze;function Qe(){return(Qe=e((()=>{n(),v=`fogFragment`,Xe=`#ifdef FOG
var fog: f32=CalcFogFactor();
#ifdef PBR
fog=toLinearSpace(fog);
#endif
color= vec4f(mix(uniforms.vFogColor,color.rgb,fog),color.a);
#endif
`,t.IncludesShadersStoreWGSL[v]||(t.IncludesShadersStoreWGSL[v]=Xe),Ze={name:v,shader:Xe}})))()}var y,$e,et;function tt(){return(tt=e((()=>{n(),y=`meshBlendTagFragmentOutput`,$e=`#if SCENE_MRT_COUNT>{X}
#if defined(PREPASS_MESH_BLEND_TAG) && PREPASS_MESH_BLEND_TAG_INDEX=={X}
fragmentOutputs.fragData{X}=meshBlendTagOutput;
#else
fragmentOutputs.fragData{X}=fragData[{X}];
#endif
#endif
`,t.IncludesShadersStoreWGSL[y]||(t.IncludesShadersStoreWGSL[y]=$e),et={name:y,shader:$e}})))()}var b,nt,rt;function it(){return(it=e((()=>{n(),b=`oitFragment`,nt=`#ifdef ORDER_INDEPENDENT_TRANSPARENCY
var fragDepth: f32=fragmentInputs.position.z; 
#ifdef ORDER_INDEPENDENT_TRANSPARENCY_16BITS
var halfFloat: u32=pack2x16float( vec2f(fragDepth));var full: vec2f=unpack2x16float(halfFloat);fragDepth=full.x;
#endif
var fragCoord: vec2i=vec2i(fragmentInputs.position.xy);var lastDepth: vec2f=textureLoad(oitDepthSampler,fragCoord,0).rg;var lastFrontColor: vec4f=textureLoad(oitFrontColorSampler,fragCoord,0);fragmentOutputs.depth=vec2f(-MAX_DEPTH);fragmentOutputs.frontColor=lastFrontColor;fragmentOutputs.backColor= vec4f(0.0);
#ifdef USE_REVERSE_DEPTHBUFFER
var furthestDepth: f32=-lastDepth.x;var nearestDepth: f32=lastDepth.y;
#else
var nearestDepth: f32=-lastDepth.x;var furthestDepth: f32=lastDepth.y;
#endif
var alphaMultiplier: f32=1.0-lastFrontColor.a;
#ifdef USE_REVERSE_DEPTHBUFFER
if (fragDepth>nearestDepth || fragDepth<furthestDepth) {
#else
if (fragDepth<nearestDepth || fragDepth>furthestDepth) {
#endif
return fragmentOutputs;}
#ifdef USE_REVERSE_DEPTHBUFFER
if (fragDepth<nearestDepth && fragDepth>furthestDepth) {
#else
if (fragDepth>nearestDepth && fragDepth<furthestDepth) {
#endif
fragmentOutputs.depth=vec2f(-fragDepth,fragDepth);return fragmentOutputs;}
#endif
`,t.IncludesShadersStoreWGSL[b]||(t.IncludesShadersStoreWGSL[b]=nt),rt={name:b,shader:nt}})))()}var x,at,ot;function st(){return(st=e((()=>{n(),x=`instancesDeclaration`,at=`#ifdef INSTANCES
attribute world0 : vec4<f32>;attribute world1 : vec4<f32>;attribute world2 : vec4<f32>;attribute world3 : vec4<f32>;
#ifdef INSTANCESCOLOR
attribute instanceColor : vec4<f32>;
#endif
#if defined(THIN_INSTANCES) && !defined(WORLD_UBO)
uniform world : mat4x4<f32>;
#endif
#if defined(VELOCITY) || defined(PREPASS_VELOCITY) || defined(PREPASS_VELOCITY_LINEAR) || defined(VELOCITY_LINEAR)
attribute previousWorld0 : vec4<f32>;attribute previousWorld1 : vec4<f32>;attribute previousWorld2 : vec4<f32>;attribute previousWorld3 : vec4<f32>;
#ifdef THIN_INSTANCES
uniform previousWorld : mat4x4<f32>;
#endif
#endif
#else
#if !defined(WORLD_UBO)
uniform world : mat4x4<f32>;
#endif
#if defined(VELOCITY) || defined(PREPASS_VELOCITY) || defined(PREPASS_VELOCITY_LINEAR) || defined(VELOCITY_LINEAR)
uniform previousWorld : mat4x4<f32>;
#endif
#endif
`,t.IncludesShadersStoreWGSL[x]||(t.IncludesShadersStoreWGSL[x]=at),ot={name:x,shader:at}})))()}var S,ct,lt;function ut(){return(ut=e((()=>{n(),S=`fogVertexDeclaration`,ct=`#ifdef FOG
varying vFogDistance: vec3f;
#endif
`,t.IncludesShadersStoreWGSL[S]||(t.IncludesShadersStoreWGSL[S]=ct),lt={name:S,shader:ct}})))()}var C,dt,ft;function pt(){return(pt=e((()=>{n(),C=`lightVxFragmentDeclaration`,dt=`#ifdef LIGHT{X}
uniform vLightData{X}: vec4f;uniform vLightDiffuse{X}: vec4f;
#ifdef SPECULARTERM
uniform vLightSpecular{X}: vec4f;
#else
var vLightSpecular{X}: vec4f= vec4f(0.);
#endif
#ifdef SHADOW{X}
#ifdef SHADOWCSM{X}
uniform lightMatrix{X}: mat4x4f[SHADOWCSMNUM_CASCADES{X}];varying var vPositionFromLight{X}: vec4f[SHADOWCSMNUM_CASCADES{X}];varying var vDepthMetric{X}: f32[SHADOWCSMNUM_CASCADES{X}];varying var vPositionFromCamera{X}: vec4f;
#elif defined(SHADOWCUBE{X})
#else
varying var vPositionFromLight{X}: vec4f;varying var vDepthMetric{X}: f32;uniform lightMatrix{X}: mat4x4f;
#endif
uniform shadowsInfo{X}: vec4f;uniform depthValues{X}: vec2f;
#endif
#ifdef SPOTLIGHT{X}
uniform vLightDirection{X}: vec4f;uniform vLightFalloff{X}: vec4f;
#elif defined(POINTLIGHT{X})
uniform vLightFalloff{X}: vec4f;
#elif defined(HEMILIGHT{X})
uniform vLightGround{X}: vec3f;
#endif
#if defined(AREALIGHT{X}) && defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)
uniform vLightWidth{X}: vec4f;uniform vLightHeight{X}: vec4f;
#endif
#endif
`,t.IncludesShadersStoreWGSL[C]||(t.IncludesShadersStoreWGSL[C]=dt),ft={name:C,shader:dt}})))()}var w,mt,ht;function gt(){return(gt=e((()=>{n(),w=`lightVxUboDeclaration`,mt=`#ifdef LIGHT{X}
struct Light{X}
{vLightData: vec4f,
vLightDiffuse: vec4f,
vLightSpecular: vec4f,
#ifdef SPOTLIGHT{X}
vLightDirection: vec4f,
vLightFalloff: vec4f,
#elif defined(POINTLIGHT{X})
vLightFalloff: vec4f,
#elif defined(HEMILIGHT{X})
vLightGround: vec3f,
#elif defined(CLUSTLIGHT{X})
vSliceData: vec2f,
vSliceRanges: array<vec4f,CLUSTLIGHT_SLICES>,
#endif
#if defined(AREALIGHT{X}) && defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)
vLightWidth: vec4f,
vLightHeight: vec4f,
#endif
shadowsInfo: vec4f,
depthValues: vec2f} ;var<uniform> light{X} : Light{X};
#ifdef SHADOW{X}
#ifdef SHADOWCSM{X}
uniform lightMatrix{X}: array<mat4x4f,SHADOWCSMNUM_CASCADES{X}>;varying vPositionFromLight{X}_0: vec4f;varying vDepthMetric{X}_0: f32;varying vPositionFromLight{X}_1: vec4f;varying vDepthMetric{X}_1: f32;varying vPositionFromLight{X}_2: vec4f;varying vDepthMetric{X}_2: f32;varying vPositionFromLight{X}_3: vec4f;varying vDepthMetric{X}_3: f32;varying vPositionFromCamera{X}: vec4f;
#elif defined(SHADOWCUBE{X})
#else
varying vPositionFromLight{X}: vec4f;varying vDepthMetric{X}: f32;uniform lightMatrix{X}: mat4x4f;
#endif
#endif
#endif
`,t.IncludesShadersStoreWGSL[w]||(t.IncludesShadersStoreWGSL[w]=mt),ht={name:w,shader:mt}})))()}var T,_t,vt;function yt(){return(yt=e((()=>{n(),T=`morphTargetsVertexGlobalDeclaration`,_t=`#ifdef MORPHTARGETS
uniform morphTargetInfluences : array<f32,NUM_MORPH_INFLUENCERS>;
#ifdef MORPHTARGETS_TEXTURE 
uniform morphTargetTextureIndices : array<f32,NUM_MORPH_INFLUENCERS>;uniform morphTargetTextureInfo : vec3<f32>;var morphTargets : texture_2d_array<f32>;fn readVector3FromRawSampler(targetIndex : i32,vertexIndex : f32)->vec3<f32>
{ 
let textureWidth: i32=i32(uniforms.morphTargetTextureInfo.y);let y: i32=i32(vertexIndex)/textureWidth;let x: i32=i32(vertexIndex) % textureWidth;return textureLoad(morphTargets,vec2i(x,y),i32(uniforms.morphTargetTextureIndices[targetIndex]),0).xyz;}
fn readVector4FromRawSampler(targetIndex : i32,vertexIndex : f32)->vec4<f32>
{ 
let textureWidth: i32=i32(uniforms.morphTargetTextureInfo.y); 
let y: i32=i32(vertexIndex)/textureWidth;let x: i32=i32(vertexIndex) % textureWidth;return textureLoad(morphTargets,vec2i(x,y),i32(uniforms.morphTargetTextureIndices[targetIndex]),0);}
#endif
#endif
`,t.IncludesShadersStoreWGSL[T]||(t.IncludesShadersStoreWGSL[T]=_t),vt={name:T,shader:_t}})))()}var E,bt,xt;function St(){return(St=e((()=>{n(),E=`morphTargetsVertexDeclaration`,bt=`#ifdef MORPHTARGETS
#ifndef MORPHTARGETS_TEXTURE
#ifdef MORPHTARGETS_POSITION
attribute position{X} : vec3<f32>;
#endif
#ifdef MORPHTARGETS_NORMAL
attribute normal{X} : vec3<f32>;
#endif
#ifdef MORPHTARGETS_TANGENT
attribute tangent{X} : vec3<f32>;
#endif
#ifdef MORPHTARGETS_UV
attribute uv_{X} : vec2<f32>;
#endif
#ifdef MORPHTARGETS_UV2
attribute uv2_{X} : vec2<f32>;
#endif
#ifdef MORPHTARGETS_COLOR
attribute color{X} : vec4<f32>;
#endif
#elif {X}==0
uniform morphTargetCount: f32;
#endif
#endif
`,t.IncludesShadersStoreWGSL[E]||(t.IncludesShadersStoreWGSL[E]=bt),xt={name:E,shader:bt}})))()}var D,Ct,wt;function Tt(){return(Tt=e((()=>{n(),D=`morphTargetsVertexGlobal`,Ct=`#ifdef MORPHTARGETS
#ifdef MORPHTARGETS_TEXTURE
var vertexID : f32;
#endif
#endif
`,t.IncludesShadersStoreWGSL[D]||(t.IncludesShadersStoreWGSL[D]=Ct),wt={name:D,shader:Ct}})))()}var O,Et,Dt;function Ot(){return(Ot=e((()=>{n(),O=`morphTargetsVertex`,Et=`#ifdef MORPHTARGETS
#ifdef MORPHTARGETS_TEXTURE
#if {X}==0
for (var i=0; i<NUM_MORPH_INFLUENCERS; i=i+1) {if (f32(i)>=uniforms.morphTargetCount) {break;}
#ifdef USE_VERTEX_PULLING
vertexID=f32(vpVertexIndex)*uniforms.morphTargetTextureInfo.x;
#else
vertexID=f32(vertexInputs.vertexIndex)*uniforms.morphTargetTextureInfo.x;
#endif
#ifdef MORPHTARGETS_POSITION
#ifdef USE_VERTEX_PULLING
positionUpdated=positionUpdated+(readVector3FromRawSampler(i,vertexID)-vp_basePosition)*uniforms.morphTargetInfluences[i];
#else
positionUpdated=positionUpdated+(readVector3FromRawSampler(i,vertexID)-vertexInputs.position)*uniforms.morphTargetInfluences[i];
#endif
#endif
#ifdef MORPHTARGETTEXTURE_HASPOSITIONS
vertexID=vertexID+1.0;
#endif
#ifdef MORPHTARGETS_NORMAL
#ifdef USE_VERTEX_PULLING
normalUpdated=normalUpdated+(readVector3FromRawSampler(i,vertexID) -vp_baseNormal)*uniforms.morphTargetInfluences[i];
#else
normalUpdated=normalUpdated+(readVector3FromRawSampler(i,vertexID) -vertexInputs.normal)*uniforms.morphTargetInfluences[i];
#endif
#endif
#ifdef MORPHTARGETTEXTURE_HASNORMALS
vertexID=vertexID+1.0;
#endif
#ifdef MORPHTARGETS_UV
#ifdef USE_VERTEX_PULLING
uvUpdated=uvUpdated+(readVector3FromRawSampler(i,vertexID).xy-vp_baseUV)*uniforms.morphTargetInfluences[i];
#else
uvUpdated=uvUpdated+(readVector3FromRawSampler(i,vertexID).xy-vertexInputs.uv)*uniforms.morphTargetInfluences[i];
#endif
#endif
#ifdef MORPHTARGETTEXTURE_HASUVS
vertexID=vertexID+1.0;
#endif
#ifdef MORPHTARGETS_TANGENT
#ifdef USE_VERTEX_PULLING
tangentUpdated=vec4f(tangentUpdated.xyz+(readVector3FromRawSampler(i,vertexID) -vp_baseTangent.xyz)*uniforms.morphTargetInfluences[i],tangentUpdated.a);
#else
tangentUpdated=vec4f(tangentUpdated.xyz+(readVector3FromRawSampler(i,vertexID) -vertexInputs.tangent.xyz)*uniforms.morphTargetInfluences[i],tangentUpdated.a);
#endif
#endif
#ifdef MORPHTARGETTEXTURE_HASTANGENTS
vertexID=vertexID+1.0;
#endif
#ifdef MORPHTARGETS_UV2
#ifdef USE_VERTEX_PULLING
uv2Updated=uv2Updated+(readVector3FromRawSampler(i,vertexID).xy-vp_baseUV2)*uniforms.morphTargetInfluences[i];
#else
uv2Updated=uv2Updated+(readVector3FromRawSampler(i,vertexID).xy-vertexInputs.uv2)*uniforms.morphTargetInfluences[i];
#endif
#endif
#ifdef MORPHTARGETS_COLOR
#ifdef USE_VERTEX_PULLING
colorUpdated=colorUpdated+(readVector4FromRawSampler(i,vertexID)-vp_baseColor)*uniforms.morphTargetInfluences[i];
#else
colorUpdated=colorUpdated+(readVector4FromRawSampler(i,vertexID)-vertexInputs.color)*uniforms.morphTargetInfluences[i];
#endif
#endif
}
#endif
#else
#ifdef MORPHTARGETS_POSITION
#ifdef USE_VERTEX_PULLING
positionUpdated=positionUpdated+(vertexInputs.position{X}-vp_basePosition)*uniforms.morphTargetInfluences[{X}];
#else
positionUpdated=positionUpdated+(vertexInputs.position{X}-vertexInputs.position)*uniforms.morphTargetInfluences[{X}];
#endif
#endif
#ifdef MORPHTARGETS_NORMAL
#ifdef USE_VERTEX_PULLING
normalUpdated=normalUpdated+(vertexInputs.normal{X}-vp_baseNormal)*uniforms.morphTargetInfluences[{X}];
#else
normalUpdated=normalUpdated+(vertexInputs.normal{X}-vertexInputs.normal)*uniforms.morphTargetInfluences[{X}];
#endif
#endif
#ifdef MORPHTARGETS_TANGENT
#ifdef USE_VERTEX_PULLING
tangentUpdated=vec4f(tangentUpdated.xyz+(vertexInputs.tangent{X}-vp_baseTangent.xyz)*uniforms.morphTargetInfluences[{X}],tangentUpdated.a);
#else
tangentUpdated=vec4f(tangentUpdated.xyz+(vertexInputs.tangent{X}-vertexInputs.tangent.xyz)*uniforms.morphTargetInfluences[{X}],tangentUpdated.a);
#endif
#endif
#ifdef MORPHTARGETS_UV
#ifdef USE_VERTEX_PULLING
uvUpdated=uvUpdated+(vertexInputs.uv_{X}-vp_baseUV)*uniforms.morphTargetInfluences[{X}];
#else
uvUpdated=uvUpdated+(vertexInputs.uv_{X}-vertexInputs.uv)*uniforms.morphTargetInfluences[{X}];
#endif
#endif
#ifdef MORPHTARGETS_UV2
#ifdef USE_VERTEX_PULLING
uv2Updated=uv2Updated+(vertexInputs.uv2_{X}-vp_baseUV2)*uniforms.morphTargetInfluences[{X}];
#else
uv2Updated=uv2Updated+(vertexInputs.uv2_{X}-vertexInputs.uv2)*uniforms.morphTargetInfluences[{X}];
#endif
#endif
#ifdef MORPHTARGETS_COLOR
#ifdef USE_VERTEX_PULLING
colorUpdated=colorUpdated+(vertexInputs.color{X}-vp_baseColor)*uniforms.morphTargetInfluences[{X}];
#else
colorUpdated=colorUpdated+(vertexInputs.color{X}-vertexInputs.color)*uniforms.morphTargetInfluences[{X}];
#endif
#endif
#endif
#endif
`,t.IncludesShadersStoreWGSL[O]||(t.IncludesShadersStoreWGSL[O]=Et),Dt={name:O,shader:Et}})))()}var k,kt,At;function jt(){return(jt=e((()=>{n(),k=`instancesVertex`,kt=`#ifdef INSTANCES
var finalWorld=mat4x4<f32>(vertexInputs.world0,vertexInputs.world1,vertexInputs.world2,vertexInputs.world3);
#if defined(PREPASS_VELOCITY) || defined(VELOCITY) || defined(PREPASS_VELOCITY_LINEAR) || defined(VELOCITY_LINEAR)
var finalPreviousWorld=mat4x4<f32>(
vertexInputs.previousWorld0,vertexInputs.previousWorld1,
vertexInputs.previousWorld2,vertexInputs.previousWorld3);
#endif
#ifdef THIN_INSTANCES
#if !defined(WORLD_UBO)
finalWorld=uniforms.world*finalWorld;
#else
finalWorld=mesh.world*finalWorld;
#endif
#if defined(PREPASS_VELOCITY) || defined(VELOCITY) || defined(PREPASS_VELOCITY_LINEAR) || defined(VELOCITY_LINEAR)
finalPreviousWorld=uniforms.previousWorld*finalPreviousWorld;
#endif
#endif
#else
#if !defined(WORLD_UBO)
var finalWorld=uniforms.world;
#else
var finalWorld=mesh.world;
#endif
#if defined(PREPASS_VELOCITY) || defined(VELOCITY) || defined(PREPASS_VELOCITY_LINEAR) || defined(VELOCITY_LINEAR)
var finalPreviousWorld=uniforms.previousWorld;
#endif
#endif
`,t.IncludesShadersStoreWGSL[k]||(t.IncludesShadersStoreWGSL[k]=kt),At={name:k,shader:kt}})))()}var Mt,Nt,Pt;function Ft(){return(Ft=e((()=>{n(),Mt=`fogVertex`,Nt=`#ifdef FOG
#ifdef SCENE_UBO
vertexOutputs.vFogDistance=(scene.view*worldPos).xyz;
#else
vertexOutputs.vFogDistance=(uniforms.view*worldPos).xyz;
#endif
#endif
`,t.IncludesShadersStoreWGSL[Mt]||(t.IncludesShadersStoreWGSL[Mt]=Nt),Pt={name:Mt,shader:Nt}})))()}var A,It,Lt;function Rt(){return(Rt=e((()=>{n(),A=`logDepthVertex`,It=`#ifdef LOGARITHMICDEPTH
vertexOutputs.vFragmentDepth=1.0+vertexOutputs.position.w;vertexOutputs.position.z=log2(max(0.000001,vertexOutputs.vFragmentDepth))*uniforms.logarithmicDepthConstant;
#endif
`,t.IncludesShadersStoreWGSL[A]||(t.IncludesShadersStoreWGSL[A]=It),Lt={name:A,shader:It}})))()}var j,zt,Bt;function Vt(){return(Vt=e((()=>{n(),j=`openpbrDielectricReflectance`,zt=`struct ReflectanceParams
{F0: f32,
F90: f32,
coloredF0: vec3f,
coloredF90: vec3f,};
#define pbr_inline
fn dielectricReflectance(
insideIOR: f32,outsideIOR: f32,specularColor: vec3f,specularWeight: f32
)->ReflectanceParams
{var outParams: ReflectanceParams;let dielectricF0=pow((insideIOR-outsideIOR)/(insideIOR+outsideIOR),2.0);let f90Scale=clamp(2.0f*abs(insideIOR-outsideIOR),0.0f,1.0f);
#if (DIELECTRIC_SPECULAR_MODEL==DIELECTRIC_SPECULAR_MODEL_OPENPBR)
let dielectricColorF90: vec3f=specularColor.rgb*vec3f(f90Scale);
#else
let dielectricColorF90: vec3f=vec3f(f90Scale);
#endif
#if DIELECTRIC_SPECULAR_MODEL==DIELECTRIC_SPECULAR_MODEL_GLTF
let maxF0=max(specularColor.r,max(specularColor.g,specularColor.b));outParams.F0=dielectricF0*maxF0*specularWeight;
#else
outParams.F0=dielectricF0*specularWeight;
#endif
outParams.F90=f90Scale*specularWeight;outParams.coloredF0=vec3f(dielectricF0*specularWeight)*specularColor.rgb;outParams.coloredF90=dielectricColorF90*vec3f(specularWeight);return outParams;}
`,t.IncludesShadersStoreWGSL[j]||(t.IncludesShadersStoreWGSL[j]=zt),Bt={name:j,shader:zt}})))()}var M,Ht,Ut;function Wt(){return(Wt=e((()=>{n(),M=`openpbrGeometryInfo`,Ht=`struct geometryInfoOutParams
{NdotV: f32,
NdotVUnclamped: f32,
environmentBrdf: vec3f,
horizonOcclusion: f32};struct geometryInfoAnisoOutParams
{NdotV: f32,
NdotVUnclamped: f32,
environmentBrdf: vec3f,
horizonOcclusion: f32,
anisotropy: f32,
anisotropicTangent: vec3f,
anisotropicBitangent: vec3f,
TBN: mat3x3<f32>};fn geometryInfo(
normalW: vec3f,viewDirectionW: vec3f,roughness: f32,geometricNormalW: vec3f
)->geometryInfoOutParams
{var outParams: geometryInfoOutParams;outParams.NdotVUnclamped=dot(normalW,viewDirectionW);outParams.NdotV=absEps(outParams.NdotVUnclamped);
#if defined(ENVIRONMENTBRDF)
outParams.environmentBrdf=getBRDFLookup(outParams.NdotV,roughness);
#else
outParams.environmentBrdf=vec3f(0.0);
#endif
outParams.horizonOcclusion=1.0f;
#if defined(ENVIRONMENTBRDF) && !defined(REFLECTIONMAP_SKYBOX)
#ifdef HORIZONOCCLUSION
#if defined(GEOMETRY_NORMAL) || defined(GEOMETRY_COAT_NORMAL)
#ifdef REFLECTIONMAP_3D
outParams.horizonOcclusion=environmentHorizonOcclusion(-viewDirectionW,normalW,geometricNormalW);
#endif
#endif
#endif
#endif
return outParams;}
fn geometryInfoAniso(
normalW: vec3f,viewDirectionW: vec3f,roughness: f32,geometricNormalW: vec3f
,vAnisotropy: vec3f,TBN: mat3x3<f32>
)->geometryInfoAnisoOutParams
{let geoInfo: geometryInfoOutParams=geometryInfo(normalW,viewDirectionW,roughness,geometricNormalW);var outParams: geometryInfoAnisoOutParams;outParams.NdotV=geoInfo.NdotV;outParams.NdotVUnclamped=geoInfo.NdotVUnclamped;outParams.environmentBrdf=geoInfo.environmentBrdf;outParams.horizonOcclusion=geoInfo.horizonOcclusion;outParams.anisotropy=vAnisotropy.b;let anisotropyDirection: vec3f=vec3f(vAnisotropy.xy,0.);let anisoTBN: mat3x3<f32>=mat3x3<f32>(normalize(TBN[0]),normalize(TBN[1]),normalize(TBN[2]));outParams.anisotropicTangent=normalize(anisoTBN*anisotropyDirection);outParams.anisotropicBitangent=normalize(cross(anisoTBN[2],outParams.anisotropicTangent));outParams.TBN=TBN;return outParams;}
`,t.IncludesShadersStoreWGSL[M]||(t.IncludesShadersStoreWGSL[M]=Ht),Ut={name:M,shader:Ht}})))()}var N,Gt,Kt;function qt(){return(qt=e((()=>{n(),N=`openpbrIblFunctions`,Gt=`#ifdef REFLECTION
fn sampleIrradiance(
surfaceNormal: vec3f
#if defined(NORMAL) && defined(USESPHERICALINVERTEX)
,vEnvironmentIrradianceSH: vec3f
#endif
#if (defined(USESPHERICALFROMREFLECTIONMAP) && (!defined(NORMAL) || !defined(USESPHERICALINVERTEX))) || (defined(USEIRRADIANCEMAP) && defined(REFLECTIONMAP_3D))
,iblMatrix: mat4x4f
#endif
#ifdef USEIRRADIANCEMAP
#ifdef REFLECTIONMAP_3D
,irradianceSampler: texture_cube<f32>
,irradianceSamplerSampler: sampler
#else
,irradianceSampler: texture_2d<f32>
,irradianceSamplerSampler: sampler
#endif
#ifdef USE_IRRADIANCE_DOMINANT_DIRECTION
,reflectionDominantDirection: vec3f
#endif
#endif
#ifdef REALTIME_FILTERING
,reflectionFilteringInfo: vec2f
#ifdef IBL_CDF_FILTERING
,icdfSampler: texture_2d<f32>
,icdfSamplerSampler: sampler
#endif
#endif
,reflectionInfos: vec2f
,viewDirectionW: vec3f
,diffuseRoughness: f32
,surfaceAlbedo: vec3f
)->vec3f {var environmentIrradiance=vec3f(0.,0.,0.);
#if (defined(USESPHERICALFROMREFLECTIONMAP) && (!defined(NORMAL) || !defined(USESPHERICALINVERTEX))) || (defined(USEIRRADIANCEMAP) && defined(REFLECTIONMAP_3D))
var irradianceVector=(iblMatrix*vec4f(surfaceNormal,0.0f)).xyz;var irradianceView=(iblMatrix*vec4f(viewDirectionW,0.0f)).xyz;
#if !defined(USE_IRRADIANCE_DOMINANT_DIRECTION) && !defined(REALTIME_FILTERING)
#if BASE_DIFFUSE_MODEL != BRDF_DIFFUSE_MODEL_LAMBERT && BASE_DIFFUSE_MODEL != BRDF_DIFFUSE_MODEL_LEGACY
{let NdotV=max(dot(surfaceNormal,viewDirectionW),0.0f);irradianceVector=mix(irradianceVector,irradianceView,(0.5f*(1.0f-NdotV))*diffuseRoughness);}
#endif
#endif
#ifdef REFLECTIONMAP_OPPOSITEZ
irradianceVector.z*=-1.0;irradianceView.z*=-1.0;
#endif
#ifdef INVERTCUBICMAP
irradianceVector.y*=-1.0;irradianceView.y*=-1.0;
#endif
#endif
#ifdef USESPHERICALFROMREFLECTIONMAP
#if defined(NORMAL) && defined(USESPHERICALINVERTEX)
environmentIrradiance=vEnvironmentIrradianceSH;
#else
#if defined(REALTIME_FILTERING)
environmentIrradiance=irradiance(reflectionSampler,reflectionSamplerSampler,irradianceVector,reflectionFilteringInfo,diffuseRoughness,surfaceAlbedo,irradianceView
#ifdef IBL_CDF_FILTERING
,icdfSampler
,icdfSamplerSampler
#endif
);
#else
environmentIrradiance=computeEnvironmentIrradiance(irradianceVector);
#endif
#endif
#elif defined(USEIRRADIANCEMAP)
#ifdef REFLECTIONMAP_3D
let environmentIrradianceFromTexture: vec4f=textureSample(irradianceSampler,irradianceSamplerSampler,irradianceVector);
#else
let environmentIrradianceFromTexture: vec4f=textureSample(irradianceSampler,irradianceSamplerSampler,reflectionCoords);
#endif
environmentIrradiance=environmentIrradianceFromTexture.rgb;
#ifdef RGBDREFLECTION
environmentIrradiance.rgb=fromRGBD(environmentIrradianceFromTexture);
#endif
#ifdef GAMMAREFLECTION
environmentIrradiance.rgb=toLinearSpaceVec3(environmentIrradiance.rgb);
#endif
#ifdef USE_IRRADIANCE_DOMINANT_DIRECTION
let Ls: vec3f=normalize(reflectionDominantDirection);let NoL: f32=dot(irradianceVector,Ls);let NoV: f32=dot(irradianceVector,irradianceView);var diffuseRoughnessTerm=vec3f(1.0f);
#if BASE_DIFFUSE_MODEL==BRDF_DIFFUSE_MODEL_EON
let LoV: f32=dot (Ls,irradianceView);let mag: f32=length(reflectionDominantDirection)*2.0f;let clampedAlbedo: vec3f=clamp(surfaceAlbedo,vec3f(0.1f),vec3f(1.0f));diffuseRoughnessTerm=diffuseBRDF_EON(clampedAlbedo,diffuseRoughness,NoL,NoV,LoV)*PI;diffuseRoughnessTerm=diffuseRoughnessTerm/clampedAlbedo;diffuseRoughnessTerm=mix(vec3f(1.0f),diffuseRoughnessTerm,sqrt(clamp(mag*NoV,0.0f,1.0f)));
#elif BASE_DIFFUSE_MODEL==BRDF_DIFFUSE_MODEL_BURLEY
let H: vec3f=(irradianceView+Ls)*0.5f;let VoH: f32=dot(irradianceView,H);diffuseRoughnessTerm=vec3f(diffuseBRDF_Burley(NoL,NoV,VoH,diffuseRoughness)*PI);
#endif
environmentIrradiance=environmentIrradiance.rgb*diffuseRoughnessTerm;
#endif
#endif
environmentIrradiance*=reflectionInfos.x;return environmentIrradiance;}
#ifdef REFLECTIONMAP_3D
fn createReflectionCoords(vPositionW: vec3f,normalW: vec3f)->vec3f
#else
fn createReflectionCoords(vPositionW: vec3f,normalW: vec3f)->vec2f
#endif
{var reflectionVector: vec3f=computeReflectionCoords(vec4f(vPositionW,1.0f),normalW);
#ifdef REFLECTIONMAP_OPPOSITEZ
reflectionVector.z*=-1.0;
#endif
#ifdef REFLECTIONMAP_3D
var reflectionCoords: vec3f=reflectionVector;
#else
var reflectionCoords: vec2f=reflectionVector.xy;
#ifdef REFLECTIONMAP_PROJECTION
reflectionCoords/=reflectionVector.z;
#endif
reflectionCoords.y=1.0f-reflectionCoords.y;
#endif
return reflectionCoords;}
fn sampleRadiance(
alphaG: f32
,reflectionMicrosurfaceInfos: vec3f
,reflectionInfos: vec2f
,geoInfo: geometryInfoOutParams
#ifdef REFLECTIONMAP_3D
,reflectionSampler: texture_cube<f32>
,reflectionSamplerSampler: sampler
,reflectionCoords: vec3f
#else
,reflectionSampler: texture_2d<f32>
,reflectionSamplerSampler: sampler
,reflectionCoords: vec2f
#endif
#ifdef REALTIME_FILTERING
,reflectionFilteringInfo: vec2f
#endif
)->vec3f {var environmentRadiance: vec4f=vec4f(0.f,0.f,0.f,0.f);
#if defined(LODINREFLECTIONALPHA) && !defined(REFLECTIONMAP_SKYBOX)
var reflectionLOD: f32=getLodFromAlphaG(reflectionMicrosurfaceInfos.x,alphaG,geoInfo.NdotVUnclamped);
#elif defined(LINEARSPECULARREFLECTION)
var reflectionLOD: f32=getLinearLodFromRoughness(reflectionMicrosurfaceInfos.x,roughness);
#else
var reflectionLOD: f32=getLodFromAlphaG(reflectionMicrosurfaceInfos.x,alphaG);
#endif
reflectionLOD=reflectionLOD*reflectionMicrosurfaceInfos.y+reflectionMicrosurfaceInfos.z;
#ifdef REALTIME_FILTERING
environmentRadiance=vec4f(radiance(alphaG,reflectionSampler,reflectionSamplerSampler,reflectionCoords,reflectionFilteringInfo),1.0f);
#else
environmentRadiance=textureSampleLevel(reflectionSampler,reflectionSamplerSampler,reflectionCoords,reflectionLOD);
#endif
var envRadiance: vec3f=environmentRadiance.rgb;
#ifdef RGBDREFLECTION
envRadiance=fromRGBD(environmentRadiance);
#endif
#ifdef GAMMAREFLECTION
envRadiance=toLinearSpaceVec3(environmentRadiance.rgb);
#endif
envRadiance*=reflectionInfos.x;return envRadiance;}
#if defined(ANISOTROPIC)
fn sampleRadianceAnisotropic(
alphaG: f32
,reflectionMicrosurfaceInfos: vec3f
,reflectionInfos: vec2f
,geoInfo: geometryInfoAnisoOutParams
,normalW: vec3f
,viewDirectionW: vec3f
,positionW: vec3f
,noise: vec3f
,isRefraction: bool
,ior: f32
#ifdef REFLECTIONMAP_3D
,reflectionSampler: texture_cube<f32>
,reflectionSamplerSampler: sampler
#else
,reflectionSampler: texture_2d<f32>
,reflectionSamplerSampler: sampler
#endif
#ifdef REALTIME_FILTERING
,reflectionFilteringInfo: vec2f
#endif
)->vec3f {var environmentRadiance: vec4f=vec4f(0.f,0.f,0.f,0.f);let alphaT=alphaG*sqrt(2.0f/(1.0f+(1.0f-geoInfo.anisotropy)*(1.0f-geoInfo.anisotropy)));let alphaB=(1.0f-geoInfo.anisotropy)*alphaT;let modifiedAlphaG=alphaB;
#if defined(LODINREFLECTIONALPHA) && !defined(REFLECTIONMAP_SKYBOX)
var reflectionLOD: f32=getLodFromAlphaG(reflectionMicrosurfaceInfos.x,modifiedAlphaG,geoInfo.NdotVUnclamped);
#elif defined(LINEARSPECULARREFLECTION)
var reflectionLOD: f32=getLinearLodFromRoughness(reflectionMicrosurfaceInfos.x,roughness);
#else
var reflectionLOD: f32=getLodFromAlphaG(reflectionMicrosurfaceInfos.x,modifiedAlphaG);
#endif
reflectionLOD=reflectionLOD*reflectionMicrosurfaceInfos.y+reflectionMicrosurfaceInfos.z;
#ifdef REALTIME_FILTERING
var view=(uniforms.reflectionMatrix*vec4f(viewDirectionW,0.0f)).xyz;var tangent=(uniforms.reflectionMatrix*vec4f(geoInfo.anisotropicTangent,0.0f)).xyz;var bitangent=(uniforms.reflectionMatrix*vec4f(geoInfo.anisotropicBitangent,0.0f)).xyz;var normal=(uniforms.reflectionMatrix*vec4f(normalW,0.0f)).xyz;
#ifdef REFLECTIONMAP_OPPOSITEZ
view.z*=-1.0f;tangent.z*=-1.0f;bitangent.z*=-1.0f;normal.z*=-1.0f;
#endif
environmentRadiance =
vec4f(radianceAnisotropic(alphaT,alphaB,reflectionSampler,reflectionSamplerSampler,
view,tangent,
bitangent,normal,
reflectionFilteringInfo,noise.xy,isRefraction,ior),
1.0f);
#else
const samples: i32=16;var radianceSample=vec4f(0.0);var accumulatedRadiance=vec3f(0.0);var sample_weight=0.0f;var total_weight=0.0f;let step=1.0f/f32(max(samples-1,1));for (var i: i32=0; i<samples; i++) {var t: f32=mix(-1.0,1.0,f32(i)*step);t+=step*2.0*noise.x;sample_weight=max(1.0-abs(t),0.001);sample_weight*=sample_weight;t*=min(4.0*alphaT*geoInfo.anisotropy,1.0);var bentNormal: vec3f;if (t<0.0) {let blend: f32=t+1.0;bentNormal=normalize(mix(-geoInfo.anisotropicTangent,normalW,blend));} else if (t>0.0) {let blend: f32=t;bentNormal=normalize(mix(normalW,geoInfo.anisotropicTangent,blend));} else {bentNormal=normalW;}
#ifdef REFLECTIONMAP_3D
var reflectionCoords: vec3f;if (isRefraction) {reflectionCoords=double_refract(-viewDirectionW,bentNormal,ior);} else {reflectionCoords=reflect(-viewDirectionW,bentNormal);}
reflectionCoords=(uniforms.reflectionMatrix*vec4f(reflectionCoords,0.f)).xyz;
#ifdef REFLECTIONMAP_OPPOSITEZ
reflectionCoords.z*=-1.0f;
#endif
#else
var sampleDirection: vec3f;if (isRefraction) {sampleDirection=double_refract(-viewDirectionW,bentNormal,ior);} else {sampleDirection=reflect(-viewDirectionW,bentNormal);}
let originalViewDirectionW: vec3f=normalize(scene.vEyePosition.xyz-positionW);let mappingNormalCandidate: vec3f=originalViewDirectionW+sampleDirection;var mappingNormal: vec3f;if (dot(mappingNormalCandidate,mappingNormalCandidate)>Epsilon) {mappingNormal=normalize(mappingNormalCandidate);} else {let perpendicularAxis: vec3f=select(vec3f(0.0f,1.0f,0.0f),vec3f(1.0f,0.0f,0.0f),abs(originalViewDirectionW.x)<0.9f);mappingNormal=normalize(cross(originalViewDirectionW,perpendicularAxis));}
let reflectionCoords: vec2f=createReflectionCoords(positionW,mappingNormal);
#endif
radianceSample=textureSampleLevel(reflectionSampler,reflectionSamplerSampler,reflectionCoords,reflectionLOD);
#ifdef RGBDREFLECTION
accumulatedRadiance+=vec3f(sample_weight)*fromRGBD(radianceSample);
#elif defined(GAMMAREFLECTION)
accumulatedRadiance+=vec3f(sample_weight)*toLinearSpaceVec3(radianceSample.rgb);
#else
accumulatedRadiance+=vec3f(sample_weight)*radianceSample.rgb;
#endif
total_weight+=sample_weight;}
environmentRadiance=vec4f(accumulatedRadiance/vec3f(total_weight),1.0f);
#endif
environmentRadiance=vec4f(environmentRadiance.rgb*reflectionInfos.xxx,environmentRadiance.a);return environmentRadiance.rgb;}
#endif
#endif
#ifdef ENVIRONMENTBRDF
fn computeDielectricIblFresnel(reflectance: ReflectanceParams,environmentBrdf: vec3f)->f32
{let dielectricIblFresnel: f32=getReflectanceFromBRDFWithEnvLookup(vec3f(reflectance.F0),vec3f(reflectance.F90),environmentBrdf).r;let dielectricECF: f32=1.0+reflectance.F0*(1.0/environmentBrdf.y-1.0);return clamp(dielectricIblFresnel*dielectricECF,0.0,1.0);}
fn computeConductorIblFresnel(reflectance: ReflectanceParams,environmentBrdf: vec3f)->vec3f
{
#if (CONDUCTOR_SPECULAR_MODEL==CONDUCTOR_SPECULAR_MODEL_OPENPBR)
let openPBRBrdf: vec3f=vec3f(environmentBrdf.xy,environmentBrdf.z/BRDF_Z_SCALE);let b: vec3f =getF82B(reflectance.coloredF0,reflectance.coloredF90);let E_F82: vec3f=getF82DirectionalAlbedo(reflectance.coloredF0,vec3f(1.0),b,openPBRBrdf);let F_avg: vec3f=getF82AverageFresnel(reflectance.coloredF0,b);let ECF: vec3f =vec3f(1.0)+F_avg*(vec3f(1.0)/openPBRBrdf.y-vec3f(1.0));return clamp(E_F82*ECF,vec3f(0.0),vec3f(1.0));
#else
return getReflectanceFromBRDFLookup(reflectance.coloredF0,reflectance.coloredF90,environmentBrdf);
#endif
}
#endif
`,t.IncludesShadersStoreWGSL[N]||(t.IncludesShadersStoreWGSL[N]=Gt),Kt={name:N,shader:Gt}})))()}var P,Jt,Yt;function Xt(){return(Xt=e((()=>{n(),P=`openpbrSubsurfaceLayerData`,Jt=`var subsurface_weight: f32=uniforms.vSubsurfaceWeight;var subsurface_color: vec3f=uniforms.vSubsurfaceColor.rgb;var subsurface_radius: f32=uniforms.vSubsurfaceRadius;var subsurface_radius_scale: vec3f=uniforms.vSubsurfaceRadiusScale;var subsurface_scatter_anisotropy: f32=clamp(uniforms.vSubsurfaceScatterAnisotropy,-0.9999f,0.9999f);
#ifdef SUBSURFACE_WEIGHT
let subsurfaceWeightFromTexture: vec4f=TEXRD(subsurfaceWeightSampler,subsurfaceWeightSamplerSampler,fragmentInputs.vSubsurfaceWeightUV+uvOffset);
#endif
#ifdef SUBSURFACE_COLOR
let subsurfaceColorFromTexture: vec4f=TEXRD(subsurfaceColorSampler,subsurfaceColorSamplerSampler,fragmentInputs.vSubsurfaceColorUV+uvOffset);
#endif
#ifdef SUBSURFACE_RADIUS_SCALE
let subsurfaceRadiusScaleFromTexture: vec4f=TEXRD(subsurfaceRadiusScaleSampler,subsurfaceRadiusScaleSamplerSampler,fragmentInputs.vSubsurfaceRadiusScaleUV+uvOffset);
#endif
#ifdef SUBSURFACE_WEIGHT
#ifdef SUBSURFACE_WEIGHT_FROM_TEXTURE_ALPHA
subsurface_weight*=subsurfaceWeightFromTexture.a;
#else
subsurface_weight*=subsurfaceWeightFromTexture.r;
#endif
#endif
#ifdef SUBSURFACE_COLOR
#ifdef SUBSURFACE_COLOR_GAMMA
subsurface_color*=toLinearSpaceVec3(subsurfaceColorFromTexture.rgb);
#else
subsurface_color*=subsurfaceColorFromTexture.rgb;
#endif
subsurface_color*=uniforms.vSubsurfaceColorInfos.y;
#endif
#ifdef SUBSURFACE_RADIUS_SCALE
subsurface_radius_scale*=subsurfaceRadiusScaleFromTexture.rgb;
#endif
`,t.IncludesShadersStoreWGSL[P]||(t.IncludesShadersStoreWGSL[P]=Jt),Yt={name:P,shader:Jt}})))()}var F,Zt,Qt;function $t(){return($t=e((()=>{n(),F=`openpbrTransmissionLayerData`,Zt=`var transmission_weight: f32=uniforms.vTransmissionWeight;var transmission_color: vec3f=uniforms.vTransmissionColor.rgb;var transmission_depth: f32=uniforms.vTransmissionDepth;var transmission_scatter: vec3f=uniforms.vTransmissionScatter.rgb;var transmission_scatter_anisotropy: f32=clamp(uniforms.vTransmissionScatterAnisotropy,-0.9999f,0.9999f);var transmission_dispersion_scale: f32=uniforms.vTransmissionDispersionScale;var transmission_dispersion_abbe_number: f32=uniforms.vTransmissionDispersionAbbeNumber;
#ifdef TRANSMISSION_WEIGHT
let transmissionWeightFromTexture: vec4f=TEXRD(transmissionWeightSampler,transmissionWeightSamplerSampler,fragmentInputs.vTransmissionWeightUV+uvOffset);
#endif
#ifdef TRANSMISSION_COLOR
let transmissionColorFromTexture: vec4f=TEXRD(transmissionColorSampler,transmissionColorSamplerSampler,fragmentInputs.vTransmissionColorUV+uvOffset);
#endif
#ifdef TRANSMISSION_DEPTH
let transmissionDepthFromTexture: vec4f=TEXRD(transmissionDepthSampler,transmissionDepthSamplerSampler,fragmentInputs.vTransmissionDepthUV+uvOffset);
#endif
#ifdef TRANSMISSION_SCATTER
let transmissionScatterFromTexture: vec4f=TEXRD(transmissionScatterSampler,transmissionScatterSamplerSampler,fragmentInputs.vTransmissionScatterUV+uvOffset);
#endif
#ifdef TRANSMISSION_DISPERSION_SCALE
let transmissionDispersionScaleFromTexture: vec4f=TEXRD(transmissionDispersionScaleSampler,transmissionDispersionScaleSamplerSampler,fragmentInputs.vTransmissionDispersionScaleUV+uvOffset);
#endif
#ifdef TRANSMISSION_WEIGHT
transmission_weight*=transmissionWeightFromTexture.r;
#endif
#ifdef TRANSMISSION_COLOR
#ifdef TRANSMISSION_COLOR_GAMMA
transmission_color*=toLinearSpaceVec3(transmissionColorFromTexture.rgb);
#else
transmission_color*=transmissionColorFromTexture.rgb;
#endif
transmission_color*=uniforms.vTransmissionColorInfos.y;
#endif
#ifdef TRANSMISSION_DEPTH
transmission_depth*=transmissionDepthFromTexture.r;
#endif
#ifdef TRANSMISSION_SCATTER
transmission_scatter*=transmissionScatterFromTexture.rgb;
#endif
#ifdef TRANSMISSION_DISPERSION_SCALE
transmission_dispersion_scale*=transmissionDispersionScaleFromTexture.r;
#endif
`,t.IncludesShadersStoreWGSL[F]||(t.IncludesShadersStoreWGSL[F]=Zt),Qt={name:F,shader:Zt}})))()}var I,en,tn;function nn(){return(nn=e((()=>{n(),I=`harmonicsFunctions`,en=`#ifdef USESPHERICALFROMREFLECTIONMAP
#ifdef SPHERICAL_HARMONICS
fn computeEnvironmentIrradiance(normal: vec3f)->vec3f {return uniforms.vSphericalL00
+ uniforms.vSphericalL1_1*(normal.y)
+ uniforms.vSphericalL10*(normal.z)
+ uniforms.vSphericalL11*(normal.x)
+ uniforms.vSphericalL2_2*(normal.y*normal.x)
+ uniforms.vSphericalL2_1*(normal.y*normal.z)
+ uniforms.vSphericalL20*((3.0*normal.z*normal.z)-1.0)
+ uniforms.vSphericalL21*(normal.z*normal.x)
+ uniforms.vSphericalL22*(normal.x*normal.x-(normal.y*normal.y));}
#else
fn computeEnvironmentIrradiance(normal: vec3f)->vec3f {var Nx: f32=normal.x;var Ny: f32=normal.y;var Nz: f32=normal.z;var C1: vec3f=uniforms.vSphericalZZ.rgb;var Cx: vec3f=uniforms.vSphericalX.rgb;var Cy: vec3f=uniforms.vSphericalY.rgb;var Cz: vec3f=uniforms.vSphericalZ.rgb;var Cxx_zz: vec3f=uniforms.vSphericalXX_ZZ.rgb;var Cyy_zz: vec3f=uniforms.vSphericalYY_ZZ.rgb;var Cxy: vec3f=uniforms.vSphericalXY.rgb;var Cyz: vec3f=uniforms.vSphericalYZ.rgb;var Czx: vec3f=uniforms.vSphericalZX.rgb;var a1: vec3f=Cyy_zz*Ny+Cy;var a2: vec3f=Cyz*Nz+a1;var b1: vec3f=Czx*Nz+Cx;var b2: vec3f=Cxy*Ny+b1;var b3: vec3f=Cxx_zz*Nx+b2;var t1: vec3f=Cz *Nz+C1;var t2: vec3f=a2 *Ny+t1;var t3: vec3f=b3 *Nx+t2;return t3;}
#endif
#endif
`,t.IncludesShadersStoreWGSL[I]||(t.IncludesShadersStoreWGSL[I]=en),tn={name:I,shader:en}})))()}var L,rn,an;function on(){return(on=e((()=>{n(),L=`kernelBlurVaryingDeclaration`,rn=`varying sampleCoord{X}: vec2f;`,t.IncludesShadersStoreWGSL[L]||(t.IncludesShadersStoreWGSL[L]=rn),an={name:L,shader:rn}})))()}var R,sn,cn;function ln(){return(ln=e((()=>{n(),R=`kernelBlurFragment`,sn=`#ifdef DOF
factor=sampleCoC(fragmentInputs.sampleCoord{X}); 
computedWeight=KERNEL_WEIGHT{X}*factor;sumOfWeights+=computedWeight;
#else
computedWeight=KERNEL_WEIGHT{X};
#endif
#ifdef PACKEDFLOAT
blend+=unpack(textureSample(textureSampler,textureSamplerSampler,fragmentInputs.sampleCoord{X}))*computedWeight;
#else
blend+=textureSample(textureSampler,textureSamplerSampler,fragmentInputs.sampleCoord{X})*computedWeight;
#endif
`,t.IncludesShadersStoreWGSL[R]||(t.IncludesShadersStoreWGSL[R]=sn),cn={name:R,shader:sn}})))()}var z,un,dn;function fn(){return(fn=e((()=>{n(),z=`kernelBlurFragment2`,un=`#ifdef DOF
factor=sampleCoC(fragmentInputs.sampleCenter+uniforms.delta*KERNEL_DEP_OFFSET{X});computedWeight=KERNEL_DEP_WEIGHT{X}*factor;sumOfWeights+=computedWeight;
#else
computedWeight=KERNEL_DEP_WEIGHT{X};
#endif
#ifdef PACKEDFLOAT
blend+=unpack(textureSample(textureSampler,textureSamplerSampler,fragmentInputs.sampleCenter+uniforms.delta*KERNEL_DEP_OFFSET{X}))*computedWeight;
#else
blend+=textureSample(textureSampler,textureSamplerSampler,fragmentInputs.sampleCenter+uniforms.delta*KERNEL_DEP_OFFSET{X})*computedWeight;
#endif
`,t.IncludesShadersStoreWGSL[z]||(t.IncludesShadersStoreWGSL[z]=un),dn={name:z,shader:un}})))()}var B,pn,mn;function hn(){return(hn=e((()=>{n(),B=`kernelBlurVertex`,pn=`vertexOutputs.sampleCoord{X}=vertexOutputs.sampleCenter+uniforms.delta*KERNEL_OFFSET{X};`,t.IncludesShadersStoreWGSL[B]||(t.IncludesShadersStoreWGSL[B]=pn),mn={name:B,shader:pn}})))()}var V,gn,_n;function vn(){return(vn=e((()=>{n(),ne(),se(),V=`openpbrUboDeclaration`,gn=`uniform vTangentSpaceParams: vec2f;uniform vLightingIntensity: vec4f;uniform pointSize: f32;uniform vDebugMode: vec2f;uniform renderTargetSize: vec2f;uniform cameraInfo: vec4f;uniform vTextureRepetitionHexTilingParams: vec4f;uniform backgroundRefractionMatrix: mat4x4f;uniform vBackgroundRefractionInfos: vec3f;uniform vReflectionInfos: vec2f;uniform reflectionMatrix: mat4x4f;uniform vReflectionMicrosurfaceInfos: vec3f;uniform vReflectionPosition: vec3f;uniform vReflectionSize: vec3f;uniform vReflectionFilteringInfo: vec2f;uniform vReflectionDominantDirection: vec3f;uniform vReflectionColor: vec3f;uniform vSphericalL00: vec3f;uniform vSphericalL1_1: vec3f;uniform vSphericalL10: vec3f;uniform vSphericalL11: vec3f;uniform vSphericalL2_2: vec3f;uniform vSphericalL2_1: vec3f;uniform vSphericalL20: vec3f;uniform vSphericalL21: vec3f;uniform vSphericalL22: vec3f;uniform vSphericalX: vec3f;uniform vSphericalY: vec3f;uniform vSphericalZ: vec3f;uniform vSphericalXX_ZZ: vec3f;uniform vSphericalYY_ZZ: vec3f;uniform vSphericalZZ: vec3f;uniform vSphericalXY: vec3f;uniform vSphericalYZ: vec3f;uniform vSphericalZX: vec3f;uniform vBaseWeight: f32;uniform vBaseColor: vec4f;uniform vBaseDiffuseRoughness: f32;uniform vReflectanceInfo: vec4f;uniform vSpecularColor: vec4f;uniform vSpecularAnisotropy: vec3f;uniform vTransmissionWeight : f32;uniform vTransmissionColor : vec3f;uniform vTransmissionDepth : f32;uniform vTransmissionScatter : vec3f;uniform vTransmissionScatterAnisotropy : f32;uniform vTransmissionDispersionScale : f32;uniform vTransmissionDispersionAbbeNumber : f32;uniform vSubsurfaceWeight: f32;uniform vSubsurfaceColor: vec3f;uniform vSubsurfaceRadius: f32;uniform vSubsurfaceRadiusScale: vec3f;uniform vSubsurfaceScatterAnisotropy: f32;uniform vCoatWeight: f32;uniform vCoatColor: vec3f;uniform vCoatRoughness: f32;uniform vCoatRoughnessAnisotropy: f32;uniform vCoatIor: f32;uniform vCoatDarkening : f32;uniform vFuzzWeight: f32;uniform vFuzzColor: vec3f;uniform vFuzzRoughness: f32;uniform vGeometryThinWalled: f32;uniform vGeometryCoatTangent: vec2f;uniform vGeometryThickness: f32;uniform vEmissionColor: vec3f;uniform vThinFilmWeight: f32;uniform vThinFilmThickness: vec2f;uniform vThinFilmIor: f32;uniform vBaseWeightInfos: vec2f;uniform baseWeightMatrix: mat4x4f;uniform vBaseColorInfos: vec2f;uniform baseColorMatrix: mat4x4f;uniform vBaseDiffuseRoughnessInfos: vec2f;uniform baseDiffuseRoughnessMatrix: mat4x4f;uniform vBaseMetalnessInfos: vec2f;uniform baseMetalnessMatrix: mat4x4f;uniform vSpecularWeightInfos: vec2f;uniform specularWeightMatrix: mat4x4f;uniform vSpecularColorInfos: vec2f;uniform specularColorMatrix: mat4x4f;uniform vSpecularRoughnessInfos: vec2f;uniform specularRoughnessMatrix: mat4x4f;uniform vSpecularRoughnessAnisotropyInfos: vec2f;uniform specularRoughnessAnisotropyMatrix: mat4x4f;uniform vTransmissionWeightInfos : vec2f;uniform transmissionWeightMatrix : mat4x4f;uniform vTransmissionColorInfos : vec2f;uniform transmissionColorMatrix : mat4x4f;uniform vTransmissionDepthInfos : vec2f;uniform transmissionDepthMatrix : mat4x4f;uniform vTransmissionScatterInfos : vec2f;uniform transmissionScatterMatrix : mat4x4f;uniform vTransmissionDispersionScaleInfos : vec2f;uniform transmissionDispersionScaleMatrix : mat4x4f;uniform vSubsurfaceWeightInfos: vec2f;uniform subsurfaceWeightMatrix: mat4x4f;uniform vSubsurfaceColorInfos: vec2f;uniform subsurfaceColorMatrix: mat4x4f;uniform vSubsurfaceRadiusScaleInfos: vec2f;uniform subsurfaceRadiusScaleMatrix: mat4x4f;uniform vCoatWeightInfos: vec2f;uniform coatWeightMatrix: mat4x4f;uniform vCoatColorInfos: vec2f;uniform coatColorMatrix: mat4x4f;uniform vCoatRoughnessInfos: vec2f;uniform coatRoughnessMatrix: mat4x4f;uniform vCoatRoughnessAnisotropyInfos: vec2f;uniform coatRoughnessAnisotropyMatrix: mat4x4f;uniform vCoatDarkeningInfos : vec2f;uniform coatDarkeningMatrix : mat4x4f;uniform vFuzzWeightInfos: vec2f;uniform fuzzWeightMatrix: mat4x4f;uniform vFuzzColorInfos: vec2f;uniform fuzzColorMatrix: mat4x4f;uniform vFuzzRoughnessInfos: vec2f;uniform fuzzRoughnessMatrix: mat4x4f;uniform vGeometryNormalInfos: vec2f;uniform geometryNormalMatrix: mat4x4f;uniform vGeometryTangentInfos: vec2f;uniform geometryTangentMatrix: mat4x4f;uniform vGeometryCoatNormalInfos: vec2f;uniform geometryCoatNormalMatrix: mat4x4f;uniform vGeometryCoatTangentInfos: vec2f;uniform geometryCoatTangentMatrix: mat4x4f;uniform vGeometryOpacityInfos: vec2f;uniform geometryOpacityMatrix: mat4x4f;uniform vGeometryThicknessInfos: vec2f;uniform geometryThicknessMatrix: mat4x4f;uniform vEmissionColorInfos: vec2f;uniform emissionColorMatrix: mat4x4f;uniform vThinFilmWeightInfos: vec2f;uniform thinFilmWeightMatrix: mat4x4f;uniform vThinFilmThicknessInfos: vec2f;uniform thinFilmThicknessMatrix: mat4x4f;uniform vAmbientOcclusionInfos: vec2f;uniform ambientOcclusionMatrix: mat4x4f;
#define ADDITIONAL_UBO_DECLARATION
#include<sceneUboDeclaration>
#include<meshUboDeclaration>
`,t.IncludesShadersStoreWGSL[V]||(t.IncludesShadersStoreWGSL[V]=gn),_n={name:V,shader:gn}})))()}var H,yn,bn;function xn(){return(xn=e((()=>{n(),te(),ee(),H=`openpbrFragmentSamplersDeclaration`,yn=`#include<samplerFragmentDeclaration>(_DEFINENAME_,BASE_COLOR,_VARYINGNAME_,BaseColor,_SAMPLERNAME_,baseColor)
#include<samplerFragmentDeclaration>(_DEFINENAME_,BASE_WEIGHT,_VARYINGNAME_,BaseWeight,_SAMPLERNAME_,baseWeight)
#include<samplerFragmentDeclaration>(_DEFINENAME_,BASE_DIFFUSE_ROUGHNESS,_VARYINGNAME_,BaseDiffuseRoughness,_SAMPLERNAME_,baseDiffuseRoughness)
#include<samplerFragmentDeclaration>(_DEFINENAME_,BASE_METALNESS,_VARYINGNAME_,BaseMetalness,_SAMPLERNAME_,baseMetalness)
#include<samplerFragmentDeclaration>(_DEFINENAME_,SPECULAR_WEIGHT,_VARYINGNAME_,SpecularWeight,_SAMPLERNAME_,specularWeight)
#include<samplerFragmentDeclaration>(_DEFINENAME_,SPECULAR_COLOR,_VARYINGNAME_,SpecularColor,_SAMPLERNAME_,specularColor)
#include<samplerFragmentDeclaration>(_DEFINENAME_,SPECULAR_ROUGHNESS,_VARYINGNAME_,SpecularRoughness,_SAMPLERNAME_,specularRoughness)
#include<samplerFragmentDeclaration>(_DEFINENAME_,SPECULAR_ROUGHNESS_ANISOTROPY,_VARYINGNAME_,SpecularRoughnessAnisotropy,_SAMPLERNAME_,specularRoughnessAnisotropy)
#include<samplerFragmentDeclaration>(_DEFINENAME_,TRANSMISSION_WEIGHT,_VARYINGNAME_,TransmissionWeight,_SAMPLERNAME_,transmissionWeight)
#include<samplerFragmentDeclaration>(_DEFINENAME_,TRANSMISSION_COLOR,_VARYINGNAME_,TransmissionColor,_SAMPLERNAME_,transmissionColor)
#include<samplerFragmentDeclaration>(_DEFINENAME_,TRANSMISSION_DEPTH,_VARYINGNAME_,TransmissionDepth,_SAMPLERNAME_,transmissionDepth)
#include<samplerFragmentDeclaration>(_DEFINENAME_,TRANSMISSION_SCATTER,_VARYINGNAME_,TransmissionScatter,_SAMPLERNAME_,transmissionScatter)
#include<samplerFragmentDeclaration>(_DEFINENAME_,TRANSMISSION_DISPERSION_SCALE,_VARYINGNAME_,TransmissionDispersionScale,_SAMPLERNAME_,transmissionDispersionScale)
#include<samplerFragmentDeclaration>(_DEFINENAME_,SUBSURFACE_WEIGHT,_VARYINGNAME_,SubsurfaceWeight,_SAMPLERNAME_,subsurfaceWeight)
#include<samplerFragmentDeclaration>(_DEFINENAME_,SUBSURFACE_COLOR,_VARYINGNAME_,SubsurfaceColor,_SAMPLERNAME_,subsurfaceColor)
#include<samplerFragmentDeclaration>(_DEFINENAME_,SUBSURFACE_RADIUS_SCALE,_VARYINGNAME_,SubsurfaceRadiusScale,_SAMPLERNAME_,subsurfaceRadiusScale)
#include<samplerFragmentDeclaration>(_DEFINENAME_,COAT_WEIGHT,_VARYINGNAME_,CoatWeight,_SAMPLERNAME_,coatWeight)
#include<samplerFragmentDeclaration>(_DEFINENAME_,COAT_COLOR,_VARYINGNAME_,CoatColor,_SAMPLERNAME_,coatColor)
#include<samplerFragmentDeclaration>(_DEFINENAME_,COAT_ROUGHNESS,_VARYINGNAME_,CoatRoughness,_SAMPLERNAME_,coatRoughness)
#include<samplerFragmentDeclaration>(_DEFINENAME_,COAT_ROUGHNESS_ANISOTROPY,_VARYINGNAME_,CoatRoughnessAnisotropy,_SAMPLERNAME_,coatRoughnessAnisotropy)
#include<samplerFragmentDeclaration>(_DEFINENAME_,COAT_DARKENING,_VARYINGNAME_,CoatDarkening,_SAMPLERNAME_,coatDarkening)
#include<samplerFragmentDeclaration>(_DEFINENAME_,FUZZ_WEIGHT,_VARYINGNAME_,FuzzWeight,_SAMPLERNAME_,fuzzWeight)
#include<samplerFragmentDeclaration>(_DEFINENAME_,FUZZ_COLOR,_VARYINGNAME_,FuzzColor,_SAMPLERNAME_,fuzzColor)
#include<samplerFragmentDeclaration>(_DEFINENAME_,FUZZ_ROUGHNESS,_VARYINGNAME_,FuzzRoughness,_SAMPLERNAME_,fuzzRoughness)
#include<samplerFragmentDeclaration>(_DEFINENAME_,GEOMETRY_OPACITY,_VARYINGNAME_,GeometryOpacity,_SAMPLERNAME_,geometryOpacity)
#include<samplerFragmentDeclaration>(_DEFINENAME_,GEOMETRY_TANGENT,_VARYINGNAME_,GeometryTangent,_SAMPLERNAME_,geometryTangent)
#include<samplerFragmentDeclaration>(_DEFINENAME_,GEOMETRY_COAT_TANGENT,_VARYINGNAME_,GeometryCoatTangent,_SAMPLERNAME_,geometryCoatTangent)
#include<samplerFragmentDeclaration>(_DEFINENAME_,GEOMETRY_THICKNESS,_VARYINGNAME_,GeometryThickness,_SAMPLERNAME_,geometryThickness)
#include<samplerFragmentDeclaration>(_DEFINENAME_,EMISSION_COLOR,_VARYINGNAME_,EmissionColor,_SAMPLERNAME_,emissionColor)
#include<samplerFragmentDeclaration>(_DEFINENAME_,THIN_FILM_WEIGHT,_VARYINGNAME_,ThinFilmWeight,_SAMPLERNAME_,thinFilmWeight)
#include<samplerFragmentDeclaration>(_DEFINENAME_,THIN_FILM_THICKNESS,_VARYINGNAME_,ThinFilmThickness,_SAMPLERNAME_,thinFilmThickness)
#include<samplerFragmentDeclaration>(_DEFINENAME_,AMBIENT_OCCLUSION,_VARYINGNAME_,AmbientOcclusion,_SAMPLERNAME_,ambientOcclusion)
#include<samplerFragmentDeclaration>(_DEFINENAME_,DECAL,_VARYINGNAME_,Decal,_SAMPLERNAME_,decal)
#include<pbrFragmentReflectionDeclaration>
#ifdef ENVIRONMENTBRDF
var environmentBrdfSamplerSampler: sampler;var environmentBrdfSampler: texture_2d<f32>;
#endif
#ifdef FUZZENVIRONMENTBRDF
var environmentFuzzBrdfSamplerSampler: sampler;var environmentFuzzBrdfSampler: texture_2d<f32>;
#endif
#ifdef REFRACTED_BACKGROUND
var backgroundRefractionSamplerSampler: sampler;var backgroundRefractionSampler: texture_2d<f32>;
#endif
#ifdef USE_IRRADIANCE_TEXTURE_FOR_SCATTERING
var sceneIrradianceSampler: texture_2d<f32>;var sceneDepthSampler: texture_2d<f32>;
#endif
#if defined(ANISOTROPIC) || defined(FUZZ) || defined(REFRACTED_BACKGROUND) || defined(USE_IRRADIANCE_TEXTURE_FOR_SCATTERING)
var blueNoiseSamplerSampler: sampler;var blueNoiseSampler: texture_2d<f32>;
#endif
#ifdef IBL_CDF_FILTERING
var icdfSamplerSampler: sampler;var icdfSampler: texture_2d<f32>;
#endif
`,t.IncludesShadersStoreWGSL[H]||(t.IncludesShadersStoreWGSL[H]=yn),bn={name:H,shader:yn}})))()}var U,Sn,Cn;function wn(){return(wn=e((()=>{n(),U=`importanceSampling`,Sn=`fn hemisphereCosSample(u: vec2f)->vec3f {var phi: f32=2.*PI*u.x;var cosTheta2: f32=1.-u.y;var cosTheta: f32=sqrt(cosTheta2);var sinTheta: f32=sqrt(1.-cosTheta2);return vec3f(sinTheta*cos(phi),sinTheta*sin(phi),cosTheta);}
fn hemisphereImportanceSampleDggx(u: vec2f,a: f32)->vec3f {var phi: f32=2.*PI*u.x;var cosTheta2: f32=(1.-u.y)/(1.+(a+1.)*((a-1.)*u.y));var cosTheta: f32=sqrt(cosTheta2);var sinTheta: f32=sqrt(1.-cosTheta2);return vec3f(sinTheta*cos(phi),sinTheta*sin(phi),cosTheta);}
fn hemisphereImportanceSampleDggxAnisotropic(Xi: vec2f,alphaTangent: f32,alphaBitangent: f32)->vec3f
{let alphaT: f32=max(alphaTangent,0.0001);let alphaB: f32=max(alphaBitangent,0.0001);var phi: f32=atan(alphaB/alphaT*tan(2.0f*PI*Xi.x));if (Xi.x>0.5) {phi+=PI; }
let cosPhi: f32=cos(phi);let sinPhi: f32=sin(phi);let alpha2: f32=(cosPhi*cosPhi)/(alphaT*alphaT) +
(sinPhi*sinPhi)/(alphaB*alphaB);let tanTheta2: f32=Xi.y/(1.0f-Xi.y)/alpha2;let cosTheta: f32=1.0f/sqrt(1.0f+tanTheta2);let sinTheta: f32=sqrt(max(0.0f,1.0f-cosTheta*cosTheta));return vec3f(sinTheta*cosPhi,sinTheta*sinPhi,cosTheta);}
fn hemisphereImportanceSampleDCharlie(u: vec2f,a: f32)->vec3f { 
var phi: f32=2.*PI*u.x;var sinTheta: f32=pow(u.y,a/(2.*a+1.));var cosTheta: f32=sqrt(1.-sinTheta*sinTheta);return vec3f(sinTheta*cos(phi),sinTheta*sin(phi),cosTheta);}`,t.IncludesShadersStoreWGSL[U]||(t.IncludesShadersStoreWGSL[U]=Sn),Cn={name:U,shader:Sn}})))()}var W,Tn,En;function Dn(){return(Dn=e((()=>{n(),W=`hdrFilteringFunctions`,Tn=`#ifdef NUM_SAMPLES
#if NUM_SAMPLES>0
fn radicalInverse_VdC(value: u32)->f32 
{var bits=(value<<16u) | (value>>16u);bits=((bits & 0x55555555u)<<1u) | ((bits & 0xAAAAAAAAu)>>1u);bits=((bits & 0x33333333u)<<2u) | ((bits & 0xCCCCCCCCu)>>2u);bits=((bits & 0x0F0F0F0Fu)<<4u) | ((bits & 0xF0F0F0F0u)>>4u);bits=((bits & 0x00FF00FFu)<<8u) | ((bits & 0xFF00FF00u)>>8u);return f32(bits)*2.3283064365386963e-10; }
fn hammersley(i: u32,N: u32)->vec2f
{return vec2f( f32(i)/ f32(N),radicalInverse_VdC(i));}
fn log4(x: f32)->f32 {return log2(x)/2.;}
fn uv_to_normal(uv: vec2f)->vec3f {var N: vec3f;var uvRange: vec2f=uv;var theta: f32=uvRange.x*2.0*PI;var phi: f32=uvRange.y*PI;N.x=cos(theta)*sin(phi);N.z=sin(theta)*sin(phi);N.y=cos(phi);return N;}
const NUM_SAMPLES_FLOAT: f32= f32(NUM_SAMPLES);const NUM_SAMPLES_FLOAT_INVERSED: f32=1./NUM_SAMPLES_FLOAT;const K: f32=4.;fn irradiance(
#ifdef CUSTOM_IRRADIANCE_FILTERING_INPUT
CUSTOM_IRRADIANCE_FILTERING_INPUT
#else
inputTexture: texture_cube<f32>,inputSampler: sampler,
#endif
inputN: vec3f,
filteringInfo: vec2f,
diffuseRoughness: f32,
surfaceAlbedo: vec3f,
inputV: vec3f
#ifdef IBL_CDF_FILTERING
,icdfSampler: texture_2d<f32>,icdfSamplerSampler: sampler
#endif
)->vec3f
{var n: vec3f=normalize(inputN);var result: vec3f= vec3f(0.0);
#ifndef IBL_CDF_FILTERING
var tangent: vec3f=select(vec3f(1.,0.,0.),vec3f(0.,0.,1.),abs(n.z)<0.999);tangent=normalize(cross(tangent,n));var bitangent: vec3f=cross(n,tangent);var tbn: mat3x3f= mat3x3f(tangent,bitangent,n);var tbnInverse: mat3x3f=transpose(tbn);
#endif
var maxLevel: f32=filteringInfo.y;var dim0: f32=filteringInfo.x;var omegaP: f32=(4.*PI)/(6.*dim0*dim0);var clampedAlbedo: vec3f=clamp(surfaceAlbedo,vec3f(0.1),vec3f(1.0));for(var i: u32=0u; i<NUM_SAMPLES; i++)
{var Xi: vec2f=hammersley(i,NUM_SAMPLES);
#ifdef IBL_CDF_FILTERING
var T: vec2f;T.x=textureSampleLevel(icdfSampler,icdfSamplerSampler,vec2(Xi.x,0.0),0.0).x;T.y=textureSampleLevel(icdfSampler,icdfSamplerSampler,vec2(T.x,Xi.y),0.0).y;var Ls: vec3f=uv_to_normal(vec2f(1.0-fract(T.x+0.25),T.y));var NoL: f32=dot(n,Ls);var NoV: f32=dot(n,inputV);
#if BASE_DIFFUSE_MODEL==BRDF_DIFFUSE_MODEL_EON
var LoV: f32=dot(Ls,inputV);
#elif BASE_DIFFUSE_MODEL==BRDF_DIFFUSE_MODEL_BURLEY
var H: vec3f=(inputV+Ls)*0.5;var VoH: f32=dot(inputV,H);
#endif 
#else
var Ls: vec3f=hemisphereCosSample(Xi);Ls=normalize(Ls);var Ns: vec3f= vec3f(0.,0.,1.);var NoL: f32=dot(Ns,Ls);var V: vec3f=tbnInverse*inputV;var NoV: f32=dot(Ns,V);
#if BASE_DIFFUSE_MODEL==BRDF_DIFFUSE_MODEL_EON
var LoV: f32=dot(Ls,V);
#elif BASE_DIFFUSE_MODEL==BRDF_DIFFUSE_MODEL_BURLEY
var H: vec3f=(V+Ls)*0.5;var VoH: f32=dot(V,H);
#endif
#endif
if (NoL>0.) {
#ifdef IBL_CDF_FILTERING
var pdf: f32=textureSampleLevel(icdfSampler,icdfSamplerSampler,T,0.0).z;var c: vec3f=textureSampleLevel(inputTexture,inputSampler,Ls,0.0).rgb;
#else
var pdf_inversed: f32=PI/NoL;var omegaS: f32=NUM_SAMPLES_FLOAT_INVERSED*pdf_inversed;var l: f32=log4(omegaS)-log4(omegaP)+log4(K);var mipLevel: f32=clamp(l,0.0,maxLevel);
#ifdef CUSTOM_IRRADIANCE_FILTERING_FUNCTION
CUSTOM_IRRADIANCE_FILTERING_FUNCTION
#else
var c: vec3f=textureSampleLevel(inputTexture,inputSampler,tbn*Ls,mipLevel).rgb;
#endif
#endif
#ifdef GAMMA_INPUT
c=toLinearSpaceVec3(c);
#endif
var diffuseRoughnessTerm: vec3f=vec3f(1.0);
#if BASE_DIFFUSE_MODEL==BRDF_DIFFUSE_MODEL_EON
diffuseRoughnessTerm=diffuseBRDF_EON(clampedAlbedo,diffuseRoughness,NoL,NoV,LoV)*PI;
#elif BASE_DIFFUSE_MODEL==BRDF_DIFFUSE_MODEL_BURLEY
diffuseRoughnessTerm=vec3f(diffuseBRDF_Burley(NoL,NoV,VoH,diffuseRoughness)*PI);
#endif
#ifdef IBL_CDF_FILTERING
var light: vec3f=vec3f(0.0);if (pdf>1e-6) {light=vec3f(1.0)/vec3f(pdf)*c;}
result+=NoL*diffuseRoughnessTerm*light;
#else
result+=c*diffuseRoughnessTerm;
#endif
}}
result=result*NUM_SAMPLES_FLOAT_INVERSED;
#if BASE_DIFFUSE_MODEL==BRDF_DIFFUSE_MODEL_EON
result=result/clampedAlbedo;
#endif
return result;}
fn radiance(alphaG: f32,inputTexture: texture_cube<f32>,inputSampler: sampler,inputN: vec3f,filteringInfo: vec2f)->vec3f
{var n: vec3f=normalize(inputN);var c: vec3f=textureSampleLevel(inputTexture,inputSampler,n,0.0).rgb; 
if (alphaG==0.) {
#ifdef GAMMA_INPUT
c=toLinearSpaceVec3(c);
#endif
return c;} else {var result: vec3f= vec3f(0.);var tangent: vec3f=select(vec3f(1.,0.,0.),vec3f(0.,0.,1.),abs(n.z)<0.999);tangent=normalize(cross(tangent,n));var bitangent: vec3f=cross(n,tangent);var tbn: mat3x3f= mat3x3f(tangent,bitangent,n);var maxLevel: f32=filteringInfo.y;var dim0: f32=filteringInfo.x;var omegaP: f32=(4.*PI)/(6.*dim0*dim0);var weight: f32=0.;for(var i: u32=0u; i<NUM_SAMPLES; i++)
{var Xi: vec2f=hammersley(i,NUM_SAMPLES);var H: vec3f=hemisphereImportanceSampleDggx(Xi,alphaG);var NoV: f32=1.;var NoH: f32=H.z;var NoH2: f32=H.z*H.z;var NoL: f32=2.*NoH2-1.;var L: vec3f= vec3f(2.*NoH*H.x,2.*NoH*H.y,NoL);L=normalize(L);if (NoL>0.) {var pdf_inversed: f32=4./normalDistributionFunction_TrowbridgeReitzGGX(NoH,alphaG);var omegaS: f32=NUM_SAMPLES_FLOAT_INVERSED*pdf_inversed;var l: f32=log4(omegaS)-log4(omegaP)+log4(K);var mipLevel: f32=clamp( f32(l),0.0,maxLevel);weight+=NoL;var c: vec3f=textureSampleLevel(inputTexture,inputSampler,tbn*L,mipLevel).rgb;
#ifdef GAMMA_INPUT
c=toLinearSpaceVec3(c);
#endif
result+=c*NoL;}}
result=result/weight;return result;}}
#ifdef ANISOTROPIC
fn radianceAnisotropic(
alphaTangent: f32, 
alphaBitangent: f32, 
inputTexture: texture_cube<f32>,
inputSampler: sampler,
inputView: vec3f, 
inputTangent: vec3f, 
inputBitangent: vec3f, 
inputNormal: vec3f, 
filteringInfo: vec2f,
noiseInput: vec2f, 
isRefraction: bool,
ior: f32 
)->vec3f {var V: vec3f=inputView;var N: vec3f=inputNormal;var T: vec3f=inputTangent;var B: vec3f=inputBitangent;var result: vec3f=vec3f(0.f);var maxLevel: f32=filteringInfo.y;var dim0: f32=filteringInfo.x;let clampedAlphaT: f32=max(alphaTangent,MINIMUMVARIANCE);let clampedAlphaB: f32=max(alphaBitangent,MINIMUMVARIANCE);var effectiveDim: f32=dim0*sqrt(clampedAlphaT*clampedAlphaB);var omegaP: f32=(4.f*PI)/(6.f*effectiveDim*effectiveDim);let noiseScale: f32=clamp(log2(f32(NUM_SAMPLES))/12.0f,0.0f,1.0f);var weight: f32=0.f;for(var i: u32=0u; i<NUM_SAMPLES; i++)
{var Xi: vec2f=hammersley(i,NUM_SAMPLES);Xi=fract(Xi+noiseInput*mix(0.5f,0.015f,noiseScale)); 
var H_tangent: vec3f=hemisphereImportanceSampleDggxAnisotropic(Xi,clampedAlphaT,clampedAlphaB);var H: vec3f=normalize(H_tangent.x*T+H_tangent.y*B+H_tangent.z*N);var L: vec3f;if (isRefraction) {L=refract(-V,H,1.0/ior);} else {L=reflect(-V,H);}
var NoH: f32=max(dot(N,H),0.001f);var VoH: f32=max(dot(V,H),0.001f);var NoL: f32=max(dot(N,L),0.001f);if (NoL>0.f) {var pdf_inversed: f32=4./normalDistributionFunction_BurleyGGX_Anisotropic(
H_tangent.z,H_tangent.x,H_tangent.y,vec2f(clampedAlphaT,clampedAlphaB)
);var omegaS: f32=NUM_SAMPLES_FLOAT_INVERSED*pdf_inversed;var l: f32=log4(omegaS)-log4(omegaP)+log4(K);var mipLevel: f32=clamp(l,0.0f,maxLevel);weight+=NoL;var c: vec3f=textureSampleLevel(inputTexture,inputSampler,L,mipLevel).rgb;
#if GAMMA_INPUT
c=toLinearSpaceVec3(c);
#endif
result+=c*NoL;}}
result=result/weight;return result;}
#endif
#endif
#endif
`,t.IncludesShadersStoreWGSL[W]||(t.IncludesShadersStoreWGSL[W]=Tn),En={name:W,shader:Tn}})))()}var G,On,kn;function An(){return(An=e((()=>{n(),G=`openpbrNormalMapFragmentMainFunctions`,On=`#if defined(GEOMETRY_NORMAL) || defined(GEOMETRY_COAT_NORMAL) || defined(ANISOTROPIC) || defined(FUZZ) || defined(DETAIL)
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
`,t.IncludesShadersStoreWGSL[G]||(t.IncludesShadersStoreWGSL[G]=On),kn={name:G,shader:On}})))()}var K,jn,Mn;function Nn(){return(Nn=e((()=>{n(),te(),K=`openpbrNormalMapFragmentFunctions`,jn=`#if defined(GEOMETRY_NORMAL)
#include<samplerFragmentDeclaration>(_DEFINENAME_,GEOMETRY_NORMAL,_VARYINGNAME_,GeometryNormal,_SAMPLERNAME_,geometryNormal)
#endif
#if defined(GEOMETRY_COAT_NORMAL)
#include<samplerFragmentDeclaration>(_DEFINENAME_,GEOMETRY_COAT_NORMAL,_VARYINGNAME_,GeometryCoatNormal,_SAMPLERNAME_,geometryCoatNormal)
#endif
#if defined(DETAIL)
#include<samplerFragmentDeclaration>(_DEFINENAME_,DETAIL,_VARYINGNAME_,Detail,_SAMPLERNAME_,detail)
#endif
#if defined(GEOMETRY_NORMAL) && defined(PARALLAX)
const minSamples: f32=4.;const maxSamples: f32=15.;const iMaxSamples: i32=15;fn parallaxOcclusion(vViewDirCoT: vec3f,vNormalCoT: vec3f,texCoord: vec2f,parallaxScale: f32)->vec2f {var parallaxLimit: f32=length(vViewDirCoT.xy)/vViewDirCoT.z;parallaxLimit*=parallaxScale;var vOffsetDir: vec2f=normalize(vViewDirCoT.xy);var vMaxOffset: vec2f=vOffsetDir*parallaxLimit;var numSamples: f32=maxSamples+(dot(vViewDirCoT,vNormalCoT)*(minSamples-maxSamples));var stepSize: f32=1.0/numSamples;var currRayHeight: f32=1.0;var vCurrOffset: vec2f= vec2f(0,0);var vLastOffset: vec2f= vec2f(0,0);var lastSampledHeight: f32=1.0;var currSampledHeight: f32=1.0;var keepWorking: bool=true;for (var i: i32=0; i<iMaxSamples; i++)
{currSampledHeight=textureSample(geometryNormalSampler,geometryNormalSamplerSampler,texCoord+vCurrOffset).w;if (!keepWorking)
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
{var height: f32=textureSample(geometryNormalSampler,geometryNormalSamplerSampler,fragmentInputs.vGeometryNormalUV).w;var texCoordOffset: vec2f=heightScale*viewDir.xy*height;
#ifdef PARALLAX_RHS
return texCoordOffset;
#else
return -texCoordOffset;
#endif
}
#endif
`,t.IncludesShadersStoreWGSL[K]||(t.IncludesShadersStoreWGSL[K]=jn),Mn={name:K,shader:jn}})))()}var q,Pn,Fn;function In(){return(In=e((()=>{n(),q=`openpbrConductorReflectance`,Pn=`#define pbr_inline
fn conductorReflectance(baseColor: vec3f,specularColor: vec3f,specularWeight: f32)->ReflectanceParams
{var outParams: ReflectanceParams;
#if (CONDUCTOR_SPECULAR_MODEL==CONDUCTOR_SPECULAR_MODEL_OPENPBR)
outParams.coloredF0=baseColor*specularWeight;outParams.coloredF90=specularColor*specularWeight;
#else
outParams.coloredF0=baseColor;outParams.coloredF90=vec3f(1.0f);
#endif
outParams.F0=1.0f;outParams.F90=1.0f;return outParams;}`,t.IncludesShadersStoreWGSL[q]||(t.IncludesShadersStoreWGSL[q]=Pn),Fn={name:q,shader:Pn}})))()}var J,Ln,Rn;function zn(){return(zn=e((()=>{n(),J=`openpbrAmbientOcclusionFunctions`,Ln=`fn compute_specular_occlusion(n_dot_v: f32,metallic: f32,ambient_occlusion: f32,roughness: f32)->f32
{let specular_occlusion: f32=saturate(pow(n_dot_v+ambient_occlusion,exp2(-16.0*roughness-1.0))-1.0+ambient_occlusion);return mix(specular_occlusion,1.0,metallic*square(1.0-roughness));}
`,t.IncludesShadersStoreWGSL[J]||(t.IncludesShadersStoreWGSL[J]=Ln),Rn={name:J,shader:Ln}})))()}var Y,Bn,Vn;function Hn(){return(Hn=e((()=>{n(),Y=`openpbrVolumeFunctions`,Bn=`struct OpenPBRHomogeneousVolume {extinction_coeff: vec3f, 
ss_albedo: vec3f, 
multi_scatter_color: vec3f, 
absorption_coeff: vec3f, 
scatter_coeff: vec3f, 
anisotropy: f32, };fn computeOpenPBRTransmissionVolume(
transmission_color: vec3f,
transmission_depth: f32,
transmission_scatter: vec3f,
anisotropy: f32
)->OpenPBRHomogeneousVolume
{var volumeParams: OpenPBRHomogeneousVolume;volumeParams.absorption_coeff=vec3f(0.0f);volumeParams.scatter_coeff=vec3f(0.0f);volumeParams.anisotropy=anisotropy;
#ifdef GEOMETRY_THIN_WALLED
volumeParams.scatter_coeff=vec3f(1.0f);volumeParams.anisotropy=1.0f; 
volumeParams.extinction_coeff=volumeParams.absorption_coeff+volumeParams.scatter_coeff;volumeParams.ss_albedo=vec3f(1.0f);
#else
if (transmission_depth>0.0f) {let invDepth: vec3f=vec3f(1.f/maxEps(transmission_depth));volumeParams.extinction_coeff=-log(maxEpsVec3(transmission_color.rgb))*invDepth;volumeParams.scatter_coeff=transmission_scatter.rgb*invDepth;volumeParams.absorption_coeff=volumeParams.extinction_coeff-volumeParams.scatter_coeff.rgb;let minCoeff: f32=min3(volumeParams.absorption_coeff);if (minCoeff<0.0f) {volumeParams.absorption_coeff-=vec3f(minCoeff);}
volumeParams.extinction_coeff=volumeParams.absorption_coeff+volumeParams.scatter_coeff;volumeParams.ss_albedo=volumeParams.scatter_coeff/(volumeParams.extinction_coeff);} else {volumeParams.extinction_coeff=volumeParams.absorption_coeff+volumeParams.scatter_coeff;volumeParams.ss_albedo=vec3f(0.0f);}
#endif
return volumeParams;}
fn computeOpenPBRSubsurfaceVolume(
subsurface_color: vec3f,
subsurface_radius: f32,
subsurface_radius_scale: vec3f,
anisotropy: f32
)->OpenPBRHomogeneousVolume
{var volumeParams: OpenPBRHomogeneousVolume;volumeParams.absorption_coeff=vec3f(0.0f);volumeParams.scatter_coeff=vec3f(0.0f);volumeParams.anisotropy=anisotropy;volumeParams.multi_scatter_color=subsurface_color;let mfp: vec3f=subsurface_radius_scale*vec3f(subsurface_radius);volumeParams.extinction_coeff=vec3f(1.0f)/maxEpsVec3(mfp);volumeParams.ss_albedo=multiScatterToSingleScatterAlbedoWithAniso(subsurface_color,anisotropy);volumeParams.scatter_coeff=volumeParams.ss_albedo*volumeParams.extinction_coeff;volumeParams.absorption_coeff=volumeParams.extinction_coeff-volumeParams.scatter_coeff.rgb;let minCoeff: f32=min3(volumeParams.absorption_coeff);if (minCoeff<0.0f) {volumeParams.absorption_coeff-=vec3f(minCoeff);}
volumeParams.extinction_coeff=volumeParams.absorption_coeff+volumeParams.scatter_coeff;return volumeParams;}
fn sss_pdf(r: f32,d: vec3f)->vec3f
{let d_clamped=max(vec3f(1e-4f),d);return (exp(-r/d_clamped)+exp(-r/(3.0f*d_clamped)))/max(vec3f(1e-5f),8.0f*PI*d_clamped*r);}
fn sss_samples_pdf(r: f32,d: f32)->f32
{let d_clamped=max(1e-4f,d);return exp(-r/(3.0f*d_clamped))/(6.0f*PI*d_clamped*r);}
fn sss_samples_icdf(x: f32,d: f32)->f32
{let d_clamped=max(1e-4f,d);let x_clamped=max(1e-4f,x);return -3.0f*log(x_clamped)*d_clamped;}
fn samples_scale(x: f32,d: f32)->f32
{return 1.0f-exp(-x/(3.0f*d));}
fn sss_get_position(depth_texture: texture_2d<f32>,tex_coord: vec2f,render_resolution: vec2f,inv_proj: mat4x4f)->vec3f
{var P: vec4f=vec4f(tex_coord,textureLoad(depth_texture,vec2i(tex_coord*render_resolution),0).x,1.0f);P.x=2.0f*P.x-1.0f;P.y=2.0f*P.y-1.0f;P=inv_proj*P;return P.xyz/P.w;}
fn sss_filter_scale(currZ: f32,proj: mat4x4f)->f32
{return 1.0f/dot(vec2f(proj[2].w,proj[3].w),vec2f(currZ,1.0f));}
fn projective_to_pixels(proj_dist: f32,proj: mat4x4f,resolution: vec2f)->f32
{return proj_dist*proj[1][1]*resolution.y;}
fn pixels_to_projective(pixel_dist: f32,proj: mat4x4f,resolution: vec2f)->f32
{return pixel_dist/(proj[1][1]*resolution.y);}
fn sss_convolve(sss_irradiance_texture: texture_2d<f32>,depth_texture: texture_2d<f32>,render_resolution: vec2f,d: vec3f,proj: mat4x4f,inv_proj: mat4x4f,sample_count: i32,noise: vec2f)->vec3f
{let tex_coord: vec2f=fragmentInputs.position.xy/render_resolution;let unconvolved_irradiance: vec3f=textureLoad(sss_irradiance_texture,vec2i(fragmentInputs.position.xy),0).rgb;let curr_pos: vec3f=sss_get_position(depth_texture,tex_coord,render_resolution,inv_proj);var dmax: f32=max3(d);let max_dmax: f32=0.1*f32(sample_count);var d_adjusted=d;if (dmax>max_dmax)
{d_adjusted*=max_dmax/dmax;dmax=max_dmax;}
var dz: f32=dmax*sss_filter_scale(curr_pos.z,proj);let projMat2d: mat2x2f=mat2x2f(proj[0].xy,proj[1].xy);if (determinant(projMat2d)*dz<1e-4f) {return unconvolved_irradiance;}
let overscan_size_in_pixels: f32=max(render_resolution.x,render_resolution.y)*0.1;let filter_crop_ratio: f32=0.8f; 
let crop_radius: f32=projective_to_pixels(sss_samples_icdf(1.0f-filter_crop_ratio,dz),proj,render_resolution);if (crop_radius>overscan_size_in_pixels)
{d_adjusted*=overscan_size_in_pixels/crop_radius;dz*=overscan_size_in_pixels/crop_radius;}
let filter_samples_scale: f32=samples_scale(pixels_to_projective(overscan_size_in_pixels,proj,render_resolution),dz);var irradiance_sum: vec3f=vec3f(0.0f);var weight_sum: vec3f=vec3f(0.0f);for (var i: i32=0; i<sample_count; i++)
{var r: vec2f=fract(plasticSequence(u32(i))+noise);r.x*=TWO_PI;r.y*=filter_samples_scale;let icdf: f32=sss_samples_icdf(1.0-r.y,dz);let sample_uv: vec2f=tex_coord+icdf*projMat2d*vec2f(cos(r.x),sin(r.x));let sss_irradiance: vec4f=textureLoad(sss_irradiance_texture,vec2i(sample_uv*render_resolution),0);let dist: f32=distance(curr_pos,sss_get_position(depth_texture,sample_uv,render_resolution,inv_proj));if (dist>0.0f)
{let weights: vec3f=sss_irradiance.a/sss_samples_pdf(icdf,dz)*sss_pdf(dist,d_adjusted);irradiance_sum+=weights*sss_irradiance.rgb;weight_sum+=weights;}}
return vec3f(select(unconvolved_irradiance.r,irradiance_sum.r/weight_sum.r,weight_sum.r>=1e-5f),
select(unconvolved_irradiance.g,irradiance_sum.g/weight_sum.g,weight_sum.g>=1e-5f),
select(unconvolved_irradiance.b,irradiance_sum.b/weight_sum.b,weight_sum.b>=1e-5f));}
`,t.IncludesShadersStoreWGSL[Y]||(t.IncludesShadersStoreWGSL[Y]=Bn),Vn={name:Y,shader:Bn}})))()}var X,Un,Wn;function Gn(){return(Gn=e((()=>{n(),X=`openpbrNormalMapFragment`,Un=`var uvOffset: vec2f= vec2f(0.0,0.0);
#if defined(GEOMETRY_NORMAL) || defined(GEOMETRY_COAT_NORMAL) || defined(PARALLAX) || defined(DETAIL)
#ifdef NORMALXYSCALE
var normalScale: f32=1.0;
#elif defined(GEOMETRY_NORMAL)
var normalScale: f32=uniforms.vGeometryNormalInfos.y;
#else
var normalScale: f32=1.0;
#endif
#if defined(TANGENT) && defined(NORMAL)
var TBN: mat3x3f=mat3x3<f32>(input.vTBN0,input.vTBN1,input.vTBN2); 
#elif defined(GEOMETRY_NORMAL)
var TBNUV: vec2f=select(-fragmentInputs.vGeometryNormalUV,fragmentInputs.vGeometryNormalUV,fragmentInputs.frontFacing);var TBN: mat3x3f=cotangent_frame(normalW*normalScale,input.vPositionW,TBNUV,uniforms.vTangentSpaceParams);
#elif defined(GEOMETRY_COAT_NORMAL)
var TBNUV: vec2f=select(-fragmentInputs.vGeometryCoatNormalUV,fragmentInputs.vGeometryCoatNormalUV,fragmentInputs.frontFacing);var TBN: mat3x3f=cotangent_frame(normalW*normalScale,input.vPositionW,TBNUV,uniforms.vTangentSpaceParams);
#else
var TBNUV: vec2f=select(-fragmentInputs.vDetailUV,fragmentInputs.vDetailUV,fragmentInputs.frontFacing);var TBN: mat3x3f=cotangent_frame(normalW*normalScale,input.vPositionW,TBNUV, vec2f(1.,1.));
#endif
#elif defined(ANISOTROPIC) || defined(FUZZ)
#if defined(TANGENT) && defined(NORMAL)
var TBN: mat3x3f=mat3x3<f32>(input.vTBN0,input.vTBN1,input.vTBN2);
#else
var TBNUV: vec2f=select( -fragmentInputs.vMainUV1,fragmentInputs.vMainUV1,fragmentInputs.frontFacing);var TBN: mat3x3f=cotangent_frame(normalW,input.vPositionW,TBNUV, vec2f(1.,1.));
#endif
#endif
#ifdef PARALLAX
var invTBN: mat3x3f=transposeMat3(TBN);
#ifdef PARALLAXOCCLUSION
#else
#endif
#endif
#ifdef DETAIL
var detailColor: vec4f=textureSample(detailSampler,detailSamplerSampler,fragmentInputs.vDetailUV+uvOffset);var detailNormalRG: vec2f=detailColor.wy*2.0-1.0;var detailNormalB: f32=sqrt(1.-saturate(dot(detailNormalRG,detailNormalRG)));var detailNormal: vec3f= vec3f(detailNormalRG,detailNormalB);
#endif
#ifdef GEOMETRY_COAT_NORMAL
coatNormalW=perturbNormal(TBN,TEXRD(geometryCoatNormalSampler,geometryCoatNormalSamplerSampler,fragmentInputs.vGeometryCoatNormalUV+uvOffset).xyz,uniforms.vGeometryCoatNormalInfos.y);
#endif
#ifdef GEOMETRY_NORMAL
#ifdef OBJECTSPACE_NORMALMAP
#define CUSTOM_FRAGMENT_BUMP_FRAGMENT
normalW=normalize(TEXRD(geometryNormalSampler,geometryNormalSamplerSampler,fragmentInputs.vGeometryNormalUV).xyz *2.0-1.0);normalW=normalize(mat3x3f(uniforms.normalMatrix[0].xyz,uniforms.normalMatrix[1].xyz,uniforms.normalMatrix[2].xyz)*normalW);
#elif !defined(DETAIL)
normalW=perturbNormal(TBN,TEXRD(geometryNormalSampler,geometryNormalSamplerSampler,fragmentInputs.vGeometryNormalUV+uvOffset).xyz,uniforms.vGeometryNormalInfos.y);
#else
var sampledNormal: vec3f=TEXRD(geometryNormalSampler,geometryNormalSamplerSampler,fragmentInputs.vGeometryNormalUV+uvOffset).xyz*2.0-1.0;
#if DETAIL_NORMALBLENDMETHOD==0 
detailNormal=vec3f(detailNormal.xy*uniforms.vDetailInfos.z,detailNormal.z);var blendedNormal: vec3f=normalize( vec3f(sampledNormal.xy+detailNormal.xy,sampledNormal.z*detailNormal.z));
#elif DETAIL_NORMALBLENDMETHOD==1 
detailNormal=vec3f(detailNormal.xy*uniforms.vDetailInfos.z,detailNormal.z);sampledNormal+= vec3f(0.0,0.0,1.0);detailNormal*= vec3f(-1.0,-1.0,1.0);var blendedNormal: vec3f=sampledNormal*dot(sampledNormal,detailNormal)/sampledNormal.z-detailNormal;
#endif
normalW=perturbNormalBase(TBN,blendedNormal,uniforms.vGeometryNormalInfos.y);
#endif
#elif defined(DETAIL)
detailNormal=vec3f(detailNormal.xy*uniforms.vDetailInfos.z,detailNormal.z);normalW=perturbNormalBase(TBN,detailNormal,uniforms.vDetailInfos.z);
#endif
`,t.IncludesShadersStoreWGSL[X]||(t.IncludesShadersStoreWGSL[X]=Un),Wn={name:X,shader:Un}})))()}var Z,Kn,qn;function Jn(){return(Jn=e((()=>{n(),Z=`openpbrBlockNormalFinal`,Kn=`#if defined(FORCENORMALFORWARD) && defined(NORMAL)
var faceNormal: vec3f=normalize(cross(dpdx(fragmentInputs.vPositionW),dpdy(fragmentInputs.vPositionW)))*scene.vEyePosition.w;
#if defined(TWOSIDEDLIGHTING)
faceNormal=select(-faceNormal,faceNormal,fragmentInputs.frontFacing);
#endif
normalW*=sign(dot(normalW,faceNormal));coatNormalW*=sign(dot(coatNormalW,faceNormal));
#endif
#if defined(TWOSIDEDLIGHTING) && defined(NORMAL)
#if defined(MIRRORED)
normalW=select(normalW,-normalW,fragmentInputs.frontFacing);coatNormalW=select(coatNormalW,-coatNormalW,fragmentInputs.frontFacing);
#else
normalW=select(-normalW,normalW,fragmentInputs.frontFacing);coatNormalW=select(-coatNormalW,coatNormalW,fragmentInputs.frontFacing);
#endif
#endif
`,t.IncludesShadersStoreWGSL[Z]||(t.IncludesShadersStoreWGSL[Z]=Kn),qn={name:Z,shader:Kn}})))()}var Q,Yn,Xn;function Zn(){return(Zn=e((()=>{n(),Q=`openpbrBaseLayerData`,Yn=`var base_color=vec3f(0.8);var base_metalness: f32=0.0;var base_diffuse_roughness: f32=0.0;var specular_weight: f32=1.0;var specular_roughness: f32=0.3;var specular_color: vec3f=vec3f(1.0);var specular_roughness_anisotropy: f32=0.0;var specular_ior: f32=1.5;var alpha: f32=1.0;var geometry_tangent: vec2f=vec2f(1.0,0.0);var geometry_thickness: f32=0.0;
#ifdef BASE_WEIGHT
let baseWeightFromTexture: vec4f=TEXRD(baseWeightSampler,baseWeightSamplerSampler,fragmentInputs.vBaseWeightUV+uvOffset);
#endif
#ifdef BASE_COLOR
let baseColorFromTexture: vec4f=TEXRD(baseColorSampler,baseColorSamplerSampler,fragmentInputs.vBaseColorUV+uvOffset);
#endif
#ifdef BASE_METALNESS
let metallicFromTexture: vec4f=TEXRD(baseMetalnessSampler,baseMetalnessSamplerSampler,fragmentInputs.vBaseMetalnessUV+uvOffset);
#endif
#ifdef BASE_DIFFUSE_ROUGHNESS
let baseDiffuseRoughnessFromTexture: f32=TEXRD(baseDiffuseRoughnessSampler,baseDiffuseRoughnessSamplerSampler,fragmentInputs.vBaseDiffuseRoughnessUV+uvOffset).r;
#endif
#ifdef GEOMETRY_TANGENT
let geometryTangentFromTexture: vec3f=TEXRD(geometryTangentSampler,geometryTangentSamplerSampler,fragmentInputs.vGeometryTangentUV+uvOffset).rgb;
#endif
#ifdef SPECULAR_ROUGHNESS_ANISOTROPY
let anisotropyFromTexture: f32=TEXRD(specularRoughnessAnisotropySampler,specularRoughnessAnisotropySamplerSampler,fragmentInputs.vSpecularRoughnessAnisotropyUV+uvOffset).r*uniforms.vSpecularRoughnessAnisotropyInfos.y;
#endif
#ifdef GEOMETRY_OPACITY
let opacityFromTexture: vec4f=TEXRD(geometryOpacitySampler,geometryOpacitySamplerSampler,fragmentInputs.vGeometryOpacityUV+uvOffset);
#endif
#ifdef GEOMETRY_THICKNESS
let thicknessFromTexture: vec4f=TEXRD(geometryThicknessSampler,geometryThicknessSamplerSampler,fragmentInputs.vGeometryThicknessUV+uvOffset);
#endif
#ifdef DECAL
let decalFromTexture: vec4f=textureSample(decalSampler,decalSamplerSampler,fragmentInputs.vDecalUV+uvOffset);
#endif
#ifdef SPECULAR_COLOR
let specularColorFromTexture: vec4f=TEXRD(specularColorSampler,specularColorSamplerSampler,fragmentInputs.vSpecularColorUV+uvOffset);
#endif
#if defined(SPECULAR_WEIGHT)
#ifdef SPECULAR_WEIGHT_IN_ALPHA
let specularWeightFromTexture: f32=TEXRD(specularWeightSampler,specularWeightSamplerSampler,fragmentInputs.vSpecularWeightUV+uvOffset).a;
#else
let specularWeightFromTexture: f32=TEXRD(specularWeightSampler,specularWeightSamplerSampler,fragmentInputs.vSpecularWeightUV+uvOffset).r;
#endif
#endif
#if defined(ANISOTROPIC) || defined(FUZZ) || defined(REFRACTED_BACKGROUND) || defined(USE_IRRADIANCE_TEXTURE_FOR_SCATTERING)
let noise=vec3f(2.0)*textureSample(blueNoiseSampler,blueNoiseSamplerSampler,fragmentInputs.position.xy/256.0).xyz-vec3f(1.0);
#endif
#if defined(SPECULAR_ROUGHNESS_FROM_METALNESS_TEXTURE_GREEN) && defined(BASE_METALNESS)
let roughnessFromTexture: f32=metallicFromTexture.g;
#elif defined(SPECULAR_ROUGHNESS)
let roughnessFromTexture: f32=TEXRD(specularRoughnessSampler,specularRoughnessSamplerSampler,fragmentInputs.vSpecularRoughnessUV+uvOffset).r;
#endif
base_color=uniforms.vBaseColor.rgb;
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
base_color*=fragmentInputs.vColor.rgb;
#endif
#if defined(VERTEXALPHA) || defined(INSTANCESCOLOR) && defined(INSTANCES)
alpha*=fragmentInputs.vColor.a;
#endif
base_color*=vec3(uniforms.vBaseWeight);alpha=uniforms.vBaseColor.a;base_metalness=uniforms.vReflectanceInfo.x;base_diffuse_roughness=uniforms.vBaseDiffuseRoughness;specular_roughness=uniforms.vReflectanceInfo.y;specular_color=uniforms.vSpecularColor.rgb;specular_weight=uniforms.vReflectanceInfo.a;specular_ior=uniforms.vReflectanceInfo.z;specular_roughness_anisotropy=uniforms.vSpecularAnisotropy.b;geometry_tangent=uniforms.vSpecularAnisotropy.rg;geometry_thickness=uniforms.vGeometryThickness;
#ifdef BASE_COLOR
#ifdef BASE_COLOR_GAMMA
base_color*=toLinearSpaceVec3(baseColorFromTexture.rgb);
#else
base_color*=baseColorFromTexture.rgb;
#endif
base_color*=uniforms.vBaseColorInfos.y;
#endif
#ifdef BASE_WEIGHT
base_color*=baseWeightFromTexture.r;
#endif
#if defined(BASE_COLOR) && defined(ALPHA_FROM_BASE_COLOR_TEXTURE)
alpha*=baseColorFromTexture.a;
#elif defined(GEOMETRY_OPACITY)
alpha*=opacityFromTexture.r;alpha*=uniforms.vGeometryOpacityInfos.y;
#endif
#ifdef GEOMETRY_THICKNESS
#ifdef GEOMETRY_THICKNESS_FROM_GREEN_CHANNEL
geometry_thickness*=thicknessFromTexture.g;
#else
geometry_thickness*=thicknessFromTexture.r;
#endif
geometry_thickness*=uniforms.vGeometryThicknessInfos.y;
#endif
#ifdef ALPHATEST
#if DEBUGMODE != 88
if (alpha<ALPHATESTVALUE) {discard;}
#endif
#ifndef ALPHABLEND
alpha=1.0;
#endif
#endif
#ifdef BASE_METALNESS
#ifdef BASE_METALNESS_FROM_METALNESS_TEXTURE_BLUE
base_metalness*=metallicFromTexture.b;
#else
base_metalness*=metallicFromTexture.r;
#endif
#endif
#ifdef BASE_DIFFUSE_ROUGHNESS
base_diffuse_roughness*=baseDiffuseRoughnessFromTexture*uniforms.vBaseDiffuseRoughnessInfos.y;
#endif
#ifdef SPECULAR_COLOR
#ifdef SPECULAR_COLOR_GAMMA
specular_color*=toLinearSpaceVec3(specularColorFromTexture.rgb);
#else
specular_color*=specularColorFromTexture.rgb;
#endif
#ifdef SPECULAR_WEIGHT_FROM_SPECULAR_COLOR_TEXTURE
specular_weight*=specularColorFromTexture.a;
#elif defined(SPECULAR_WEIGHT)
specular_weight*=specularWeightFromTexture;
#endif
#endif
#if defined(SPECULAR_ROUGHNESS) || (defined(SPECULAR_ROUGHNESS_FROM_METALNESS_TEXTURE_GREEN) && defined(BASE_METALNESS))
specular_roughness*=roughnessFromTexture;
#endif
#ifdef GEOMETRY_TANGENT
{let tangentFromTexture: vec2f=normalize(geometryTangentFromTexture.xy*vec2f(2.0f)-vec2f(1.0f));let tangent_angle_texture: f32=atan2(tangentFromTexture.y,tangentFromTexture.x);let tangent_angle_uniform: f32=atan2(geometry_tangent.y,geometry_tangent.x);let tangent_angle: f32=tangent_angle_texture+tangent_angle_uniform;geometry_tangent=vec2f(cos(tangent_angle),sin(tangent_angle));}
#endif
#if defined(GEOMETRY_TANGENT) && defined(SPECULAR_ROUGHNESS_ANISOTROPY_FROM_TANGENT_TEXTURE)
specular_roughness_anisotropy*=geometryTangentFromTexture.b;
#elif defined(SPECULAR_ROUGHNESS_ANISOTROPY)
specular_roughness_anisotropy*=anisotropyFromTexture;
#endif
#ifdef DETAIL
let detailRoughness: f32=mix(0.5f,detailColor.b,vDetailInfos.w);let loLerp: f32=mix(0.f,specular_roughness,detailRoughness*2.f);let hiLerp: f32=mix(specular_roughness,1.f,(detailRoughness-0.5f)*2.f);specular_roughness=mix(loLerp,hiLerp,step(detailRoughness,0.5f));
#endif
#ifdef USE_GLTF_STYLE_ANISOTROPY
let baseAlpha: f32=specular_roughness*specular_roughness;let roughnessT: f32=mix(baseAlpha,1.0f,specular_roughness_anisotropy*specular_roughness_anisotropy);let roughnessB: f32=baseAlpha;specular_roughness_anisotropy=1.0f-roughnessB/max(roughnessT,0.00001f);specular_roughness=sqrt(roughnessT/sqrt(2.0f/(1.0f+(1.0f-specular_roughness_anisotropy)*(1.0f-specular_roughness_anisotropy))));
#endif
`,t.IncludesShadersStoreWGSL[Q]||(t.IncludesShadersStoreWGSL[Q]=Yn),Xn={name:Q,shader:Yn}})))()}var Qn,$n,er;function tr(){return(tr=e((()=>{n(),Qn=`openpbrCoatLayerData`,$n=`var coat_weight: f32=0.0f;var coat_color: vec3f=vec3f(1.0f);var coat_roughness: f32=0.0f;var coat_roughness_anisotropy: f32=0.0f;var coat_ior: f32=1.6f;var coat_darkening: f32=1.0f;var geometry_coat_tangent: vec2f=vec2f(1.0f,0.0f);
#ifdef COAT_WEIGHT
var coatWeightFromTexture: vec4f=TEXRD(coatWeightSampler,coatWeightSamplerSampler,fragmentInputs.vCoatWeightUV+uvOffset);
#endif
#ifdef COAT_COLOR
var coatColorFromTexture: vec4f=TEXRD(coatColorSampler,coatColorSamplerSampler,fragmentInputs.vCoatColorUV+uvOffset);
#endif
#ifdef COAT_ROUGHNESS
var coatRoughnessFromTexture: vec4f=TEXRD(coatRoughnessSampler,coatRoughnessSamplerSampler,fragmentInputs.vCoatRoughnessUV+uvOffset);
#endif
#ifdef COAT_ROUGHNESS_ANISOTROPY
var coatRoughnessAnisotropyFromTexture: f32=TEXRD(coatRoughnessAnisotropySampler,coatRoughnessAnisotropySamplerSampler,fragmentInputs.vCoatRoughnessAnisotropyUV+uvOffset).r;
#endif
#ifdef COAT_DARKENING
var coatDarkeningFromTexture: vec4f=TEXRD(coatDarkeningSampler,coatDarkeningSamplerSampler,fragmentInputs.vCoatDarkeningUV+uvOffset);
#endif
#ifdef GEOMETRY_COAT_TANGENT
var geometryCoatTangentFromTexture: vec3f=TEXRD(geometryCoatTangentSampler,geometryCoatTangentSamplerSampler,fragmentInputs.vGeometryCoatTangentUV+uvOffset).rgb;
#endif
coat_color=uniforms.vCoatColor.rgb;coat_weight=uniforms.vCoatWeight;coat_roughness=uniforms.vCoatRoughness;coat_roughness_anisotropy=uniforms.vCoatRoughnessAnisotropy;coat_ior=uniforms.vCoatIor;coat_darkening=uniforms.vCoatDarkening;geometry_coat_tangent=uniforms.vGeometryCoatTangent.rg;
#ifdef COAT_WEIGHT
coat_weight*=coatWeightFromTexture.r;
#endif
#ifdef COAT_COLOR
#ifdef COAT_COLOR_GAMMA
coat_color*=toLinearSpaceVec3(coatColorFromTexture.rgb);
#else
coat_color*=coatColorFromTexture.rgb;
#endif
coat_color*=uniforms.vCoatColorInfos.y;
#endif
#ifdef COAT_ROUGHNESS
#ifdef COAT_ROUGHNESS_FROM_GREEN_CHANNEL
coat_roughness*=coatRoughnessFromTexture.g;
#else
coat_roughness*=coatRoughnessFromTexture.r;
#endif
#endif
#if defined(GEOMETRY_COAT_TANGENT) && defined(COAT_ROUGHNESS_ANISOTROPY_FROM_TANGENT_TEXTURE)
coat_roughness_anisotropy*=geometryCoatTangentFromTexture.b;
#elif defined(COAT_ROUGHNESS_ANISOTROPY)
coat_roughness_anisotropy*=coatRoughnessAnisotropyFromTexture;
#endif
#ifdef COAT_DARKENING
coat_darkening*=coatDarkeningFromTexture.r;
#endif
#ifdef GEOMETRY_COAT_TANGENT
{let tangentFromTexture: vec2f=normalize(geometryCoatTangentFromTexture.xy*vec2f(2.0f)-vec2f(1.0f));let tangent_angle_texture: f32=atan2(tangentFromTexture.y,tangentFromTexture.x);let tangent_angle_uniform: f32=atan2(geometry_coat_tangent.y,geometry_coat_tangent.x);let tangent_angle: f32=tangent_angle_texture+tangent_angle_uniform;geometry_coat_tangent=vec2f(cos(tangent_angle),sin(tangent_angle));}
#endif
#ifdef USE_GLTF_STYLE_ANISOTROPY
let coatAlpha: f32=coat_roughness*coat_roughness;let coatRoughnessT: f32=mix(coatAlpha,1.0f,coat_roughness_anisotropy*coat_roughness_anisotropy);let coatRoughnessB: f32=coatAlpha;coat_roughness_anisotropy=1.0f-coatRoughnessB/max(coatRoughnessT,0.00001f);coat_roughness=sqrt(coatRoughnessT/sqrt(2.0f/(1.0f+(1.0f-coat_roughness_anisotropy)*(1.0f-coat_roughness_anisotropy))));
#endif
`,t.IncludesShadersStoreWGSL[Qn]||(t.IncludesShadersStoreWGSL[Qn]=$n),er={name:Qn,shader:$n}})))()}var nr,rr,ir;function ar(){return(ar=e((()=>{n(),nr=`openpbrThinFilmLayerData`,rr=`#ifdef THIN_FILM
var thin_film_weight: f32=uniforms.vThinFilmWeight;var thin_film_thickness: f32=uniforms.vThinFilmThickness.r*1000.0f; 
var thin_film_ior: f32=uniforms.vThinFilmIor;
#ifdef THIN_FILM_WEIGHT
var thinFilmWeightFromTexture: f32=TEXRD(thinFilmWeightSampler,thinFilmWeightSamplerSampler,fragmentInputs.vThinFilmWeightUV+uvOffset).r*uniforms.vThinFilmWeightInfos.y;
#endif
#ifdef THIN_FILM_THICKNESS
var thinFilmThicknessFromTexture: f32=TEXRD(thinFilmThicknessSampler,thinFilmThicknessSamplerSampler,fragmentInputs.vThinFilmThicknessUV+uvOffset).g*uniforms.vThinFilmThicknessInfos.y;
#endif
#ifdef THIN_FILM_WEIGHT
thin_film_weight*=thinFilmWeightFromTexture;
#endif
#ifdef THIN_FILM_THICKNESS
thin_film_thickness*=thinFilmThicknessFromTexture;
#endif
let thin_film_ior_scale: f32=clamp(2.0f*abs(thin_film_ior-1.0f),0.0f,1.0f);
#endif
`,t.IncludesShadersStoreWGSL[nr]||(t.IncludesShadersStoreWGSL[nr]=rr),ir={name:nr,shader:rr}})))()}var or,sr,cr;function lr(){return(lr=e((()=>{n(),or=`openpbrFuzzLayerData`,sr=`var fuzz_weight: f32=0.0f;var fuzz_color: vec3f=vec3f(1.0f);var fuzz_roughness: f32=0.0f;
#ifdef FUZZ
#ifdef FUZZ_WEIGHT
let fuzzWeightFromTexture: vec4f=TEXRD(fuzzWeightSampler,fuzzWeightSamplerSampler,fragmentInputs.vFuzzWeightUV+uvOffset);
#endif
#ifdef FUZZ_COLOR
var fuzzColorFromTexture: vec4f=TEXRD(fuzzColorSampler,fuzzColorSamplerSampler,fragmentInputs.vFuzzColorUV+uvOffset);
#endif
#ifdef FUZZ_ROUGHNESS
let fuzzRoughnessFromTexture: vec4f=TEXRD(fuzzRoughnessSampler,fuzzRoughnessSamplerSampler,fragmentInputs.vFuzzRoughnessUV+uvOffset);
#endif
fuzz_color=uniforms.vFuzzColor.rgb;fuzz_weight=uniforms.vFuzzWeight;fuzz_roughness=uniforms.vFuzzRoughness;
#ifdef FUZZ_WEIGHT
fuzz_weight*=fuzzWeightFromTexture.r;
#endif
#ifdef FUZZ_COLOR
#ifdef FUZZ_COLOR_GAMMA
fuzz_color*=toLinearSpaceVec3(fuzzColorFromTexture.rgb);
#else
fuzz_color*=fuzzColorFromTexture.rgb;
#endif
fuzz_color*=uniforms.vFuzzColorInfos.y;
#endif
#if defined(FUZZ_ROUGHNESS) && defined(FUZZ_ROUGHNESS_FROM_TEXTURE_ALPHA)
fuzz_roughness*=fuzzRoughnessFromTexture.a;
#elif defined(FUZZ_ROUGHNESS)
fuzz_roughness*=fuzzRoughnessFromTexture.r;
#endif
#endif
`,t.IncludesShadersStoreWGSL[or]||(t.IncludesShadersStoreWGSL[or]=sr),cr={name:or,shader:sr}})))()}var ur,dr,fr;function pr(){return(pr=e((()=>{n(),ur=`openpbrAmbientOcclusionData`,dr=`var ambient_occlusion: vec3f=vec3f(1.0f,1.0f,1.0f);var specular_ambient_occlusion: f32=1.0f;var coat_specular_ambient_occlusion: f32=1.0f;
#ifdef AMBIENT_OCCLUSION
var ambientOcclusionFromTexture: vec3f=TEXRD(ambientOcclusionSampler,ambientOcclusionSamplerSampler,fragmentInputs.vAmbientOcclusionUV+uvOffset).rgb;ambient_occlusion=vec3f(ambientOcclusionFromTexture.r*uniforms.vAmbientOcclusionInfos.y+(1.0f-uniforms.vAmbientOcclusionInfos.y));
#endif
`,t.IncludesShadersStoreWGSL[ur]||(t.IncludesShadersStoreWGSL[ur]=dr),fr={name:ur,shader:dr}})))()}var mr,hr,gr;function _r(){return(_r=e((()=>{n(),mr=`openpbrBackgroundTransmission`,hr=`var slab_translucent_background: vec4f=vec4f(0.,0.,0.,1.);
#ifdef REFRACTED_BACKGROUND
{let refractionLOD: f32=min(transmission_roughness,0.8)*uniforms.vBackgroundRefractionInfos.x;let lodTexelSize: f32=pow(2.0f,refractionLOD-uniforms.vBackgroundRefractionInfos.x);
#ifdef DISPERSION
{
#ifdef REFRACTION_HIGH_QUALITY_BLUR
{var dispResult: vec3f=vec3f(0.0);var dispWeight: vec3f=vec3f(0.0);let noiseOffset: vec2f=noise.xy*select(0.0f,lodTexelSize,refractionLOD>0.0f);for (var k: i32=0; k<6; k++) {let t: f32=(f32(k)+noise.y)/6.0f;let t_rg: f32=clamp(t*2.0f,0.0f,1.0f);let t_gb: f32=clamp((t-0.5f)*2.0f,0.0f,1.0f);let refVec: vec3f=mix(mix(refractedViewVectors[0],refractedViewVectors[1],t_rg),refractedViewVectors[2],t_gb);let uvw: vec3f=vec3f((uniforms.backgroundRefractionMatrix*(scene.view*vec4f(fragmentInputs.vPositionW+refVec*geometry_thickness,1.0f))).xyz);var coords: vec2f=uvw.xy/uvw.z;coords.y=1.0f-coords.y;let s: vec4f=textureSampleLevel(backgroundRefractionSampler,backgroundRefractionSamplerSampler,coords+noiseOffset,refractionLOD);let rw: f32=max(0.0f,1.0f-2.0f*t);let gw: f32=max(0.0f,1.0f-abs(2.0f*t-1.0f));let bw: f32=max(0.0f,2.0f*t-1.0f);let w: vec3f=vec3f(rw,gw,bw);dispResult+=s.rgb*w;dispWeight+=w;}
slab_translucent_background=vec4f(dispResult/max(dispWeight,vec3f(1e-6)),1.0f);}
#else
for (var i: i32=0; i<3; i++) {let refractedViewVector: vec3f=refractedViewVectors[i];let uvw: vec3f=vec3f((uniforms.backgroundRefractionMatrix*(scene.view*vec4f(fragmentInputs.vPositionW+refractedViewVector*geometry_thickness,1.0f))).xyz);var coords: vec2f=uvw.xy/uvw.z;coords.y=1.0f-coords.y;if (refractionLOD>0.0f) {let noiseOffset: vec2f=noise.xy*lodTexelSize;slab_translucent_background[i]=textureSampleLevel(backgroundRefractionSampler,backgroundRefractionSamplerSampler,coords+noiseOffset,refractionLOD)[i];} else {slab_translucent_background[i]=textureSampleLevel(backgroundRefractionSampler,backgroundRefractionSamplerSampler,coords,0.0f)[i];}}
#endif
}
#else
{let refractionUVW: vec3f=vec3f((uniforms.backgroundRefractionMatrix*(scene.view*vec4f(fragmentInputs.vPositionW+refractedViewVector*geometry_thickness,1.0f))).xyz);var refractionCoords: vec2f=refractionUVW.xy/refractionUVW.z;refractionCoords.y=1.0f-refractionCoords.y;if (refractionLOD>0.0f) {
#ifdef REFRACTION_HIGH_QUALITY_BLUR
let cosA: f32=cos(noise.x*PI);let sinA: f32=sin(noise.x*PI);let u: vec2f=vec2f( cosA,sinA)*(0.5f*lodTexelSize);let v: vec2f=vec2f(-sinA,cosA)*(0.5f*lodTexelSize);slab_translucent_background=0.25f*(
textureSampleLevel(backgroundRefractionSampler,backgroundRefractionSamplerSampler,refractionCoords+u+v,refractionLOD) +
textureSampleLevel(backgroundRefractionSampler,backgroundRefractionSamplerSampler,refractionCoords-u+v,refractionLOD) +
textureSampleLevel(backgroundRefractionSampler,backgroundRefractionSamplerSampler,refractionCoords+u-v,refractionLOD) +
textureSampleLevel(backgroundRefractionSampler,backgroundRefractionSamplerSampler,refractionCoords-u-v,refractionLOD)
);
#else
let noiseOffset: vec2f=noise.xy*lodTexelSize;slab_translucent_background=textureSampleLevel(backgroundRefractionSampler,backgroundRefractionSamplerSampler,refractionCoords+noiseOffset,refractionLOD);
#endif
} else {slab_translucent_background=textureSampleLevel(backgroundRefractionSampler,backgroundRefractionSamplerSampler,refractionCoords,0.0f);}}
#endif
}
#endif
`,t.IncludesShadersStoreWGSL[mr]||(t.IncludesShadersStoreWGSL[mr]=hr),gr={name:mr,shader:hr}})))()}var vr,yr,br;function xr(){return(xr=e((()=>{n(),vr=`openpbrEnvironmentLighting`,yr=`#if defined(REFLECTION) || defined(REFRACTED_BACKGROUND)
var coatAbsorption=vec3f(1.0f);var coatIblFresnel: f32=0.0;if (coat_weight>0.0) {coatIblFresnel=computeDielectricIblFresnel(coatReflectance,coatGeoInfo.environmentBrdf);let hemisphere_avg_fresnel: f32=coatReflectance.F0+0.5f*(1.0f-coatReflectance.F0);var averageReflectance: f32=(coatIblFresnel+hemisphere_avg_fresnel)*0.5f;let roughnessFactor=1.0f-coat_roughness*0.5f;averageReflectance*=roughnessFactor;var darkened_transmission: f32=(1.0f-averageReflectance)*(1.0f-averageReflectance);darkened_transmission=mix(1.0,darkened_transmission,coat_darkening);var sin2: f32=1.0f-coatGeoInfo.NdotV*coatGeoInfo.NdotV;sin2=sin2/(coat_ior*coat_ior)*coat_weight;let cos_t: f32=sqrt(1.0f-sin2);let coatPathLength=1.0f/cos_t;let effectivePathLength=coatPathLength*coat_weight;let colored_transmission: vec3f=pow(coat_color,vec3f(effectivePathLength));coatAbsorption=colored_transmission*mix(1.0f,darkened_transmission,coat_weight);}
#endif
#ifdef REFLECTION
#if defined(FUZZ) && defined(FUZZENVIRONMENTBRDF)
let environmentFuzzBrdf: vec3f=getFuzzBRDFLookup(fuzzGeoInfo.NdotV,sqrt(fuzz_roughness));
#endif
var baseDiffuseEnvironmentLight: vec3f=sampleIrradiance(
normalW
#if defined(NORMAL) && defined(USESPHERICALINVERTEX)
,vEnvironmentIrradiance 
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
,viewDirectionW
,base_diffuse_roughness
,base_color
);
#ifdef REFLECTIONMAP_3D
var reflectionCoords: vec3f=vec3f(0.f,0.f,0.f);
#else
var reflectionCoords: vec2f=vec2f(0.f,0.f);
#endif
let specularAlphaG: f32=specular_roughness*specular_roughness;
#ifdef ANISOTROPIC_BASE
var baseSpecularEnvironmentLight: vec3f=sampleRadianceAnisotropic(specularAlphaG,uniforms.vReflectionMicrosurfaceInfos.rgb,uniforms.vReflectionInfos
,baseGeoInfo
,normalW
,viewDirectionW
,fragmentInputs.vPositionW
,noise
,false 
,1.0 
,reflectionSampler
,reflectionSamplerSampler
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#endif
);
#else
reflectionCoords=createReflectionCoords(fragmentInputs.vPositionW,normalW);var baseSpecularEnvironmentLight: vec3f=sampleRadiance(specularAlphaG,uniforms.vReflectionMicrosurfaceInfos.rgb,uniforms.vReflectionInfos
,baseGeoInfo
,reflectionSampler
,reflectionSamplerSampler
,reflectionCoords
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#endif
);
#endif
#ifdef ANISOTROPIC_BASE
baseSpecularEnvironmentLight=mix(baseSpecularEnvironmentLight.rgb,baseDiffuseEnvironmentLight,specularAlphaG*specularAlphaG *max(1.0f-baseGeoInfo.anisotropy,0.3f));
#else
baseSpecularEnvironmentLight=mix(baseSpecularEnvironmentLight.rgb,baseDiffuseEnvironmentLight,specularAlphaG);
#endif
var coatEnvironmentLight: vec3f=vec3f(0.f,0.f,0.f);if (coat_weight>0.0) {
#ifdef REFLECTIONMAP_3D
var reflectionCoords: vec3f=vec3f(0.f,0.f,0.f);
#else
var reflectionCoords: vec2f=vec2f(0.f,0.f);
#endif
reflectionCoords=createReflectionCoords(fragmentInputs.vPositionW,coatNormalW);var coatAlphaG: f32=coat_roughness*coat_roughness;
#ifdef ANISOTROPIC_COAT
coatEnvironmentLight=sampleRadianceAnisotropic(coatAlphaG,uniforms.vReflectionMicrosurfaceInfos.rgb,uniforms.vReflectionInfos
,coatGeoInfo
,coatNormalW
,viewDirectionW
,fragmentInputs.vPositionW
,noise
,false 
,1.0 
,reflectionSampler
,reflectionSamplerSampler
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#endif
);
#else
coatEnvironmentLight=sampleRadiance(coatAlphaG,uniforms.vReflectionMicrosurfaceInfos.rgb,uniforms.vReflectionInfos
,coatGeoInfo
,reflectionSampler
,reflectionSamplerSampler
,reflectionCoords
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#endif
);
#endif
}
#if defined(FUZZ) && defined(FUZZENVIRONMENTBRDF)
let modifiedFuzzRoughness: f32=clamp(fuzz_roughness*fuzz_roughness*(1.0f+0.5f*environmentFuzzBrdf.y),0.0f,1.0f);var fuzzEnvironmentLight=vec3f(0.0f,0.0f,0.0f);let fuzzIblFresnel: f32=min(environmentFuzzBrdf.z*2.0f,1.0f);let viewTangent: vec2f=vec2f(dot(viewDirectionW,fuzzTangent),dot(viewDirectionW,fuzzBitangent));let centerAngle: f32=atan2(viewTangent.y,viewTangent.x);for (var i: i32=0; i<i32(FUZZ_IBL_SAMPLES); i++) {let angle: f32=centerAngle+(f32(i)/f32(FUZZ_IBL_SAMPLES)-0.5f+noise.x/f32(FUZZ_IBL_SAMPLES))*3.141592f;let fiberCylinderNormal: vec3f=normalize(cos(angle)*fuzzTangent+sin(angle)*fuzzBitangent);let fuzzReflectionCoords: vec3f=(uniforms.reflectionMatrix*vec4f(fiberCylinderNormal,0.0f)).xyz;let radianceSample: vec3f=sampleRadiance(modifiedFuzzRoughness,uniforms.vReflectionMicrosurfaceInfos.rgb,uniforms.vReflectionInfos
,fuzzGeoInfo
,reflectionSampler
,reflectionSamplerSampler
,fuzzReflectionCoords
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#endif
);fuzzEnvironmentLight+=radianceSample;}
fuzzEnvironmentLight/=f32(FUZZ_IBL_SAMPLES);
#if defined(GEOMETRY_NORMAL) || defined(GEOMETRY_COAT_NORMAL)
var fuzzDiffuseEnvironmentLight: vec3f=sampleIrradiance(
fuzzNormalW
#if defined(NORMAL) && defined(USESPHERICALINVERTEX)
,vEnvironmentIrradiance 
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
,viewDirectionW
,0.0f
,vec3f(1.0f)
);
#else
var fuzzDiffuseEnvironmentLight: vec3f=baseDiffuseEnvironmentLight;
#endif
fuzzEnvironmentLight=mix(min(fuzzEnvironmentLight,fuzzDiffuseEnvironmentLight),fuzzDiffuseEnvironmentLight,modifiedFuzzRoughness);
#endif
var dielectricIblFresnel: f32=computeDielectricIblFresnel(baseDielectricReflectance,baseGeoInfo.environmentBrdf);var dielectricIblColoredFresnel: vec3f=dielectricIblFresnel*specular_color;
#ifdef THIN_FILM
let thin_film_cos_theta: f32=max(baseGeoInfo.NdotV,specularAlphaG);let thin_film_desaturation_scale=(thin_film_ior-1.0)*sqrt(thin_film_thickness*0.001f*thin_film_cos_theta);let tf_brdf_x: f32=baseGeoInfo.environmentBrdf.x;let tf_E_ss: f32 =baseGeoInfo.environmentBrdf.y;var thinFilmDielectricF0: vec3f=evalIridescence(thin_film_outside_ior,thin_film_ior,1.0,thin_film_thickness,vec3f(baseDielectricReflectance.F0));thinFilmDielectricF0=mix(thinFilmDielectricF0,vec3(dot(thinFilmDielectricF0,vec3f(0.3333f))),thin_film_desaturation_scale);var thinFilmDielectricDir: vec3f=evalIridescence(thin_film_outside_ior,thin_film_ior,thin_film_cos_theta,thin_film_thickness,vec3f(baseDielectricReflectance.F0));thinFilmDielectricDir=mix(thinFilmDielectricDir,vec3(dot(thinFilmDielectricDir,vec3f(0.3333f))),thin_film_desaturation_scale);let tf_f0d_avg: f32 =dot(thinFilmDielectricF0, vec3f(0.3333f));let tf_dird_avg: f32=dot(thinFilmDielectricDir,vec3f(0.3333f));var thin_film_dielectric: vec3f=thinFilmDielectricDir*(tf_f0d_avg/max(tf_dird_avg,1e-5));let tf_E_dielectric: vec3f=(vec3f(1.0)-thin_film_dielectric)*vec3f(tf_brdf_x)+thin_film_dielectric*vec3f(tf_E_ss);let tf_F_avg_dielectric: vec3f=thin_film_dielectric+(vec3f(1.0)-thin_film_dielectric)/21.0;let tf_ECF_dielectric: vec3f=vec3f(1.0)+tf_F_avg_dielectric*(vec3f(1.0)/vec3f(tf_E_ss)-vec3f(1.0));thin_film_dielectric=clamp(tf_E_dielectric*tf_ECF_dielectric,vec3f(0.0),vec3f(1.0));dielectricIblColoredFresnel=mix(dielectricIblColoredFresnel,thin_film_dielectric*specular_color,thin_film_weight*thin_film_ior_scale);dielectricIblFresnel=max(dielectricIblColoredFresnel.r,max(dielectricIblColoredFresnel.g,dielectricIblColoredFresnel.b));
#endif
var conductorIblFresnel: vec3f=computeConductorIblFresnel(baseConductorReflectance,baseGeoInfo.environmentBrdf);
#ifdef THIN_FILM
var thinFilmConductorF0: vec3f=evalIridescence(thin_film_outside_ior,thin_film_ior,1.0,thin_film_thickness,baseConductorReflectance.coloredF0);thinFilmConductorF0=mix(thinFilmConductorF0,vec3(dot(thinFilmConductorF0,vec3f(0.3333f))),thin_film_desaturation_scale);var thinFilmConductorDir: vec3f=evalIridescence(thin_film_outside_ior,thin_film_ior,thin_film_cos_theta,thin_film_thickness,baseConductorReflectance.coloredF0);thinFilmConductorDir=mix(thinFilmConductorDir,vec3(dot(thinFilmConductorDir,vec3f(0.3333f))),thin_film_desaturation_scale);let tf_f0c_avg: f32 =dot(thinFilmConductorF0, vec3f(0.3333f));let tf_dirc_avg: f32=dot(thinFilmConductorDir,vec3f(0.3333f));var thinFilmConductorRaw: vec3f=thinFilmConductorDir*(tf_f0c_avg/max(tf_dirc_avg,1e-5));
#if (CONDUCTOR_SPECULAR_MODEL==CONDUCTOR_SPECULAR_MODEL_OPENPBR) && defined(ENVIRONMENTBRDF)
let tf_b: vec3f=getF82B(baseConductorReflectance.coloredF0,baseConductorReflectance.coloredF90);let tf_brdf_z: f32=baseGeoInfo.environmentBrdf.z/BRDF_Z_SCALE;let tf_E_conductor: vec3f=(vec3f(1.0)-thinFilmConductorRaw)*vec3f(tf_brdf_x)+thinFilmConductorRaw*vec3f(tf_E_ss)-tf_b*vec3f(tf_brdf_z);let tf_F_avg_conductor: vec3f=thinFilmConductorRaw+(vec3f(1.0)-thinFilmConductorRaw)/21.0-tf_b/126.0;
#else
let tf_E_conductor: vec3f=(vec3f(1.0)-thinFilmConductorRaw)*vec3f(tf_brdf_x)+thinFilmConductorRaw*vec3f(tf_E_ss);let tf_F_avg_conductor: vec3f=thinFilmConductorRaw+(vec3f(1.0)-thinFilmConductorRaw)/21.0;
#endif
let tf_ECF_conductor: vec3f=vec3f(1.0)+tf_F_avg_conductor*(vec3f(1.0)/vec3f(tf_E_ss)-vec3f(1.0));var thinFilmConductorFresnel: vec3f=specular_weight*clamp(tf_E_conductor*tf_ECF_conductor,vec3f(0.0),vec3f(1.0));conductorIblFresnel=mix(conductorIblFresnel,thinFilmConductorFresnel,thin_film_weight*thin_film_ior_scale);
#endif
var slab_diffuse_ibl: vec3f=vec3f(0.,0.,0.);var slab_glossy_ibl: vec3f=vec3f(0.,0.,0.);var slab_metal_ibl: vec3f=vec3f(0.,0.,0.);var slab_coat_ibl: vec3f=vec3f(0.,0.,0.);slab_diffuse_ibl=baseDiffuseEnvironmentLight*uniforms.vLightingIntensity.z;
#ifdef AMBIENT_OCCLUSION
specular_ambient_occlusion=compute_specular_occlusion(baseGeoInfo.NdotV,base_metalness,ambient_occlusion.x,specular_roughness);
#endif
slab_glossy_ibl=baseSpecularEnvironmentLight*uniforms.vLightingIntensity.z;slab_metal_ibl=baseSpecularEnvironmentLight*conductorIblFresnel*uniforms.vLightingIntensity.z;if (coat_weight>0.0) {slab_coat_ibl=coatEnvironmentLight*uniforms.vLightingIntensity.z;
#ifdef AMBIENT_OCCLUSION
coat_specular_ambient_occlusion=compute_specular_occlusion(coatGeoInfo.NdotV,0.0,ambient_occlusion.x,coat_roughness);
#endif
}
#if defined(FUZZ) && defined(FUZZENVIRONMENTBRDF)
var slab_fuzz_ibl=fuzzEnvironmentLight*uniforms.vLightingIntensity.z;
#endif
var slab_translucent_base_ibl: vec3f=vec3f(0.0f,0.0f,0.0f);
#ifdef REFRACTED_ENVIRONMENT
#ifdef ANISOTROPIC_BASE
var forwardScatteredEnvironmentLight: vec3f=sampleRadianceAnisotropic(transmission_roughness_alpha,uniforms.vReflectionMicrosurfaceInfos.rgb,uniforms.vReflectionInfos
,baseGeoInfo
#ifdef GEOMETRY_THIN_WALLED
,viewDirectionW
#else
,normalW
#endif
,viewDirectionW
,fragmentInputs.vPositionW
,noise
,true 
#ifdef GEOMETRY_THIN_WALLED
,1.05f 
#else
,specular_ior 
#endif
,reflectionSampler
,reflectionSamplerSampler
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#endif
);
#else
var forwardScatteredEnvironmentLight: vec3f=vec3f(0.,0.,0.);
#ifdef DISPERSION
for (var i: i32=0; i<3; i++) {var iblRefractionCoords: vec3f=refractedViewVectors[i];
#else
var iblRefractionCoords: vec3f=refractedViewVector;
#endif
#ifdef REFRACTED_ENVIRONMENT_OPPOSITEZ
iblRefractionCoords.z*=-1.0f;
#endif
#ifdef REFRACTED_ENVIRONMENT_LOCAL_CUBE
iblRefractionCoords=parallaxCorrectNormal(fragmentInputs.vPositionW,refractedViewVector,uniforms.refractionSize,uniforms.refractionPosition);
#endif
iblRefractionCoords=(uniforms.reflectionMatrix*vec4f(iblRefractionCoords,0.0f)).xyz;
#ifdef DISPERSION
forwardScatteredEnvironmentLight[i]=sampleRadiance(transmission_roughness_alpha,uniforms.vReflectionMicrosurfaceInfos.rgb,uniforms.vReflectionInfos
,baseGeoInfo
,reflectionSampler
,reflectionSamplerSampler
,iblRefractionCoords
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#endif
)[i];
#else
forwardScatteredEnvironmentLight=sampleRadiance(transmission_roughness_alpha,uniforms.vReflectionMicrosurfaceInfos.rgb,uniforms.vReflectionInfos
,baseGeoInfo
,reflectionSampler
,reflectionSamplerSampler
,iblRefractionCoords
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#endif
);
#endif
#ifdef DISPERSION
}
#endif
#endif
#ifdef REFRACTED_BACKGROUND
#ifdef GEOMETRY_THIN_WALLED
forwardScatteredEnvironmentLight=mix(slab_translucent_background.rgb,forwardScatteredEnvironmentLight.rgb,0.2*transmission_roughness_alpha);
#else
forwardScatteredEnvironmentLight=max(slab_translucent_background.rgb,mix(slab_translucent_background.rgb,forwardScatteredEnvironmentLight,transmission_roughness_alpha));
#endif
#endif
#ifdef SCATTERING
#ifdef GEOMETRY_THIN_WALLED
var scatterVector: vec3f=normalW;
#else
#if defined(USEIRRADIANCEMAP) && defined(USE_IRRADIANCE_DOMINANT_DIRECTION)
var scatterVector: vec3f=mix(uniforms.vReflectionDominantDirection,normalW,max3(iso_scatter_density));
#else
var scatterVector: vec3f=normalW;
#endif
scatterVector=mix(viewDirectionW,scatterVector,back_to_iso_scattering_blend);
#endif
#if defined(USE_IRRADIANCE_TEXTURE_FOR_SCATTERING) && !defined(GEOMETRY_THIN_WALLED)
var scatteredEnvironmentLight: vec3f=scattered_light_from_irradiance_texture;
#else
var scatteredEnvironmentLight: vec3f=sampleIrradiance(
scatterVector
#if defined(NORMAL) && defined(USESPHERICALINVERTEX)
,vEnvironmentIrradiance 
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
,viewDirectionW
#if defined(GEOMETRY_THIN_WALLED)
,base_diffuse_roughness
,subsurface_color.rgb
#else
,1.0f
,volumeParams.multi_scatter_color
#endif
);
#endif
#ifdef GEOMETRY_THIN_WALLED
let forward_scattered_light: vec3f=forwardScatteredEnvironmentLight*transmission_tint*volumeParams.multi_scatter_color;let back_scattered_light: vec3f=scatteredEnvironmentLight*volumeParams.multi_scatter_color;slab_translucent_base_ibl=mix(back_scattered_light,forward_scattered_light,0.5f+0.5f*volumeParams.anisotropy);
#else
let forward_scattered_light: vec3f=forwardScatteredEnvironmentLight*volume_absorption;let back_scattered_light: vec3f=mix(forward_scattered_light,scatteredEnvironmentLight*backscatter_color,iso_scatter_density);let iso_scattered_light: vec3f=mix(forward_scattered_light,scatteredEnvironmentLight*volumeParams.multi_scatter_color,iso_scatter_density);slab_translucent_base_ibl=mix(back_scattered_light,iso_scattered_light,back_to_iso_scattering_blend);slab_translucent_base_ibl=mix(slab_translucent_base_ibl,forward_scattered_light,iso_to_forward_scattering_blend)*transmission_tint;
#endif
#else
slab_translucent_base_ibl+=forwardScatteredEnvironmentLight*transmission_tint*volume_absorption;
#endif
#endif
#define CUSTOM_FRAGMENT_BEFORE_IBLLAYERCOMPOSITION
slab_diffuse_ibl*=ambient_occlusion;slab_metal_ibl*=specular_ambient_occlusion;slab_glossy_ibl*=specular_ambient_occlusion;slab_coat_ibl*=coat_specular_ambient_occlusion;let material_dielectric_base_ibl: vec3f=mix(slab_diffuse_ibl*base_color.rgb,slab_translucent_base_ibl,surface_translucency_weight);let material_dielectric_gloss_ibl: vec3f=material_dielectric_base_ibl*(1.0-dielectricIblFresnel)+slab_glossy_ibl*dielectricIblColoredFresnel;let material_base_substrate_ibl: vec3f=mix(material_dielectric_gloss_ibl,slab_metal_ibl,base_metalness);let material_coated_base_ibl: vec3f=layer(material_base_substrate_ibl,slab_coat_ibl,coatIblFresnel,coatAbsorption,vec3f(1.0f));
#if defined(FUZZ) && defined(FUZZENVIRONMENTBRDF)
slab_fuzz_ibl*=min(vec3(specular_ambient_occlusion),ambient_occlusion);material_surface_ibl=layer(material_coated_base_ibl,slab_fuzz_ibl,fuzzIblFresnel*fuzz_weight,vec3f(1.0f),fuzz_color);
#else
material_surface_ibl=material_coated_base_ibl;
#endif
#elif defined(REFRACTED_BACKGROUND)
let black=vec3f(0.0f);var slab_translucent_base_ibl: vec3f=vec3f(0.0f);
#ifdef GEOMETRY_THIN_WALLED
#ifdef SCATTERING
let forward_scattered_light: vec3f=slab_translucent_background.rgb*transmission_tint*volumeParams.multi_scatter_color;slab_translucent_base_ibl=mix(black,forward_scattered_light,0.5f+0.5f*volumeParams.anisotropy);
#else
slab_translucent_base_ibl=slab_translucent_background.rgb*transmission_tint;
#endif
#else
#ifdef SCATTERING
let forward_scattered_light: vec3f=slab_translucent_background.rgb*volume_absorption;let iso_scattered_light: vec3f=(1.0f-iso_scatter_density)*forward_scattered_light;slab_translucent_base_ibl=mix(black,iso_scattered_light,back_to_iso_scattering_blend);slab_translucent_base_ibl=mix(slab_translucent_base_ibl,forward_scattered_light,iso_to_forward_scattering_blend)*transmission_tint;
#else
slab_translucent_base_ibl=slab_translucent_background.rgb*volume_absorption*transmission_tint;
#endif
#endif
let material_dielectric_base_ibl: vec3f=mix(black,slab_translucent_base_ibl.rgb,surface_translucency_weight);let material_dielectric_gloss_ibl: vec3f=material_dielectric_base_ibl*(baseGeoInfo.NdotV);let material_base_substrate_ibl: vec3f=mix(material_dielectric_gloss_ibl,black,base_metalness);let material_coated_base_ibl: vec3f=layer(material_base_substrate_ibl,black,coatIblFresnel,coatAbsorption,vec3f(1.0f));material_surface_ibl=material_coated_base_ibl;
#endif
`,t.IncludesShadersStoreWGSL[vr]||(t.IncludesShadersStoreWGSL[vr]=yr),br={name:vr,shader:yr}})))()}var Sr,Cr,wr;function Tr(){return(Tr=e((()=>{n(),Sr=`openpbrDirectLightingInit`,Cr=`#ifdef LIGHT{X}
var preInfo{X}: preLightingInfo;var preInfoCoat{X}: preLightingInfo;let lightColor{X}: vec4f=light{X}.vLightDiffuse;var shadow{X}: f32=1.0f;
#if defined(SHADOWONLY) || defined(LIGHTMAP) && defined(LIGHTMAPEXCLUDED{X}) && defined(LIGHTMAPNOSPECULAR{X})
#else
#define CUSTOM_LIGHT{X}_COLOR 
#ifdef SPOTLIGHT{X}
preInfo{X}=computePointAndSpotPreLightingInfo(light{X}.vLightData,viewDirectionW,normalW,fragmentInputs.vPositionW);preInfoCoat{X}=computePointAndSpotPreLightingInfo(light{X}.vLightData,viewDirectionW,coatNormalW,fragmentInputs.vPositionW);
#elif defined(POINTLIGHT{X})
preInfo{X}=computePointAndSpotPreLightingInfo(light{X}.vLightData,viewDirectionW,normalW,fragmentInputs.vPositionW);preInfoCoat{X}=computePointAndSpotPreLightingInfo(light{X}.vLightData,viewDirectionW,coatNormalW,fragmentInputs.vPositionW);
#elif defined(HEMILIGHT{X})
preInfo{X}=computeHemisphericPreLightingInfo(light{X}.vLightData,viewDirectionW,normalW);preInfoCoat{X}=computeHemisphericPreLightingInfo(light{X}.vLightData,viewDirectionW,coatNormalW);
#elif defined(DIRLIGHT{X})
preInfo{X}=computeDirectionalPreLightingInfo(light{X}.vLightData,viewDirectionW,normalW);preInfoCoat{X}=computeDirectionalPreLightingInfo(light{X}.vLightData,viewDirectionW,coatNormalW);
#elif defined(AREALIGHT{X}) && defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)
preInfo{X}=computeAreaPreLightingInfo(areaLightsLTC1Sampler,areaLightsLTC1SamplerSampler,areaLightsLTC2Sampler,areaLightsLTC2SamplerSampler,viewDirectionW,normalW,fragmentInputs.vPositionW,light{X}.vLightData.xyz,light{X}.vLightWidth.xyz,light{X}.vLightHeight.xyz,specular_roughness);preInfoCoat{X}=computeAreaPreLightingInfo(areaLightsLTC1Sampler,areaLightsLTC1SamplerSampler,areaLightsLTC2Sampler,areaLightsLTC2SamplerSampler,viewDirectionW,coatNormalW,fragmentInputs.vPositionW,light{X}.vLightData.xyz,light{X}.vLightWidth.xyz,light{X}.vLightHeight.xyz,coat_roughness);
#endif
preInfo{X}.NdotV=baseGeoInfo.NdotV;preInfoCoat{X}.NdotV=coatGeoInfo.NdotV;
#ifdef SPOTLIGHT{X}
#ifdef LIGHT_FALLOFF_GLTF{X}
preInfo{X}.attenuation=computeDistanceLightFalloff_GLTF(preInfo{X}.lightDistanceSquared,light{X}.vLightFalloff.y);
#ifdef IESLIGHTTEXTURE{X}
preInfo{X}.attenuation*=computeDirectionalLightFalloff_IES(light{X}.vLightDirection.xyz,preInfo{X}.L,iesLightTexture{X});
#else
preInfo{X}.attenuation*=computeDirectionalLightFalloff_GLTF(light{X}.vLightDirection.xyz,preInfo{X}.L,light{X}.vLightFalloff.z,light{X}.vLightFalloff.w);
#endif
#elif defined(LIGHT_FALLOFF_PHYSICAL{X})
preInfo{X}.attenuation=computeDistanceLightFalloff_Physical(preInfo{X}.lightDistanceSquared);
#ifdef IESLIGHTTEXTURE{X}
preInfo{X}.attenuation*=computeDirectionalLightFalloff_IES(light{X}.vLightDirection.xyz,preInfo{X}.L,iesLightTexture{X});
#else
preInfo{X}.attenuation*=computeDirectionalLightFalloff_Physical(light{X}.vLightDirection.xyz,preInfo{X}.L,light{X}.vLightDirection.w);
#endif
#elif defined(LIGHT_FALLOFF_STANDARD{X})
preInfo{X}.attenuation=computeDistanceLightFalloff_Standard(preInfo{X}.lightOffset,light{X}.vLightFalloff.x);
#ifdef IESLIGHTTEXTURE{X}
preInfo{X}.attenuation*=computeDirectionalLightFalloff_IES(light{X}.vLightDirection.xyz,preInfo{X}.L,iesLightTexture{X});
#else
preInfo{X}.attenuation*=computeDirectionalLightFalloff_Standard(light{X}.vLightDirection.xyz,preInfo{X}.L,light{X}.vLightDirection.w,light{X}.vLightData.w);
#endif
#else
preInfo{X}.attenuation=computeDistanceLightFalloff(preInfo{X}.lightOffset,preInfo{X}.lightDistanceSquared,light{X}.vLightFalloff.x,light{X}.vLightFalloff.y);
#ifdef IESLIGHTTEXTURE{X}
preInfo{X}.attenuation*=computeDirectionalLightFalloff_IES(light{X}.vLightDirection.xyz,preInfo{X}.L,iesLightTexture{X});
#else
preInfo{X}.attenuation*=computeDirectionalLightFalloff(light{X}.vLightDirection.xyz,preInfo{X}.L,light{X}.vLightDirection.w,light{X}.vLightData.w,light{X}.vLightFalloff.z,light{X}.vLightFalloff.w);
#endif
#endif
#elif defined(POINTLIGHT{X})
#ifdef LIGHT_FALLOFF_GLTF{X}
preInfo{X}.attenuation=computeDistanceLightFalloff_GLTF(preInfo{X}.lightDistanceSquared,light{X}.vLightFalloff.y);
#elif defined(LIGHT_FALLOFF_PHYSICAL{X})
preInfo{X}.attenuation=computeDistanceLightFalloff_Physical(preInfo{X}.lightDistanceSquared);
#elif defined(LIGHT_FALLOFF_STANDARD{X})
preInfo{X}.attenuation=computeDistanceLightFalloff_Standard(preInfo{X}.lightOffset,light{X}.vLightFalloff.x);
#else
preInfo{X}.attenuation=computeDistanceLightFalloff(preInfo{X}.lightOffset,preInfo{X}.lightDistanceSquared,light{X}.vLightFalloff.x,light{X}.vLightFalloff.y);
#endif
#else
preInfo{X}.attenuation=1.0f;
#endif
preInfoCoat{X}.attenuation=preInfo{X}.attenuation;
#if defined(HEMILIGHT{X})
preInfo{X}.roughness=specular_roughness;preInfoCoat{X}.roughness=coat_roughness;
#elif defined(AREALIGHT{X}) && defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)
preInfo{X}.roughness=specular_roughness;preInfoCoat{X}.roughness=coat_roughness;
#else
preInfo{X}.roughness=adjustRoughnessFromLightProperties(specular_roughness,light{X}.vLightSpecular.a,preInfo{X}.lightDistance);preInfoCoat{X}.roughness=adjustRoughnessFromLightProperties(coat_roughness,light{X}.vLightSpecular.a,preInfoCoat{X}.lightDistance);
#endif
preInfo{X}.diffuseRoughness=base_diffuse_roughness;preInfo{X}.surfaceAlbedo=base_color.rgb;
#endif
#endif
`,t.IncludesShadersStoreWGSL[Sr]||(t.IncludesShadersStoreWGSL[Sr]=Cr),wr={name:Sr,shader:Cr}})))()}var Er,Dr,Or;function kr(){return(kr=e((()=>{n(),Er=`openpbrDirectLighting`,Dr=`#ifdef LIGHT{X}
{var slab_diffuse: vec3f=vec3f(0.f,0.f,0.f);var slab_translucent: vec3f=vec3f(0.f,0.f,0.f);var slab_glossy: vec3f=vec3f(0.f,0.f,0.f);var specularFresnel: f32=0.0f;var specularColoredFresnel: vec3f=vec3f(0.f,0.f,0.f);var slab_metal: vec3f=vec3f(0.f,0.f,0.f);var slab_coat: vec3f=vec3f(0.f,0.f,0.f);var coatFresnel: f32=0.0f;var slab_fuzz: vec3f=vec3f(0.f,0.f,0.f);var fuzzFresnel: f32=0.0f;
#ifdef HEMILIGHT{X}
slab_diffuse=computeHemisphericDiffuseLighting(preInfo{X},lightColor{X}.rgb,light{X}.vLightGround);
#elif defined(AREALIGHT{X}) && defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)
slab_diffuse=computeAreaDiffuseLighting(preInfo{X},lightColor{X}.rgb);
#else
slab_diffuse=computeDiffuseLighting(preInfo{X},lightColor{X}.rgb);
#endif
#ifdef PROJECTEDLIGHTTEXTURE{X}
slab_diffuse*=computeProjectionTextureDiffuseLighting(projectionLightTexture{X},textureProjectionMatrix{X},fragmentInputs.vPositionW);
#endif
#ifdef FUZZ
let fuzzNdotH: f32=max(dot(fuzzNormalW,preInfo{X}.H),0.0f);let fuzzBrdf: vec3f=getFuzzBRDFLookup(fuzzNdotH,sqrt(fuzz_roughness));
#endif
#ifdef THIN_FILM
let thin_film_desaturation_scale: f32=(thin_film_ior-1.0f)*sqrt(thin_film_thickness*0.001f);
#endif
#if defined(AREALIGHT{X}) && defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)
slab_glossy=computeOpenPBRAreaSpecularLighting(
preInfo{X},
light{X}.vLightSpecular.rgb,
baseDielectricReflectance.coloredF0,
baseDielectricReflectance.coloredF90
);specularFresnel=computeOpenPBRAreaFresnel(preInfo{X},baseDielectricReflectance.F0,baseDielectricReflectance.F90);
#else
{
#ifdef ANISOTROPIC_BASE
slab_glossy=computeAnisotropicSpecularLighting(preInfo{X},viewDirectionW,normalW,
baseGeoInfo.anisotropicTangent,baseGeoInfo.anisotropicBitangent,baseGeoInfo.anisotropy,
0.0f,lightColor{X}.rgb);
#else
slab_glossy=computeSpecularLighting(preInfo{X},normalW,vec3(1.0),vec3(1.0),specular_roughness,lightColor{X}.rgb);
#endif
specularFresnel=fresnelSchlickGGX(preInfo{X}.VdotH,baseDielectricReflectance.F0,baseDielectricReflectance.F90);specularColoredFresnel=specularFresnel*specular_color;
#ifdef THIN_FILM
var thinFilmDielectricFresnel: vec3f=evalIridescence(thin_film_outside_ior,thin_film_ior,preInfo{X}.VdotH,thin_film_thickness,vec3f(baseDielectricReflectance.F0));thinFilmDielectricFresnel=mix(thinFilmDielectricFresnel,vec3f(dot(thinFilmDielectricFresnel,vec3f(0.3333f))),thin_film_desaturation_scale);specularColoredFresnel=mix(specularColoredFresnel,thinFilmDielectricFresnel*specular_color,thin_film_weight*thin_film_ior_scale);
#endif
}
#endif
#ifdef REFRACTED_LIGHTS
var forwardScatteredLight: vec3f=vec3f(0.0f);
#if AREALIGHT{X}
#else
{var preInfoTrans=preInfo{X};
#ifdef SCATTERING
preInfoTrans.roughness=sqrt(sqrt(max(transmission_roughness_alpha,0.05f)));
#else
preInfoTrans.roughness=transmission_roughness;
#endif
if (preInfoTrans.NdotLUnclamped<=0.0) {specularFresnel=0.0;specularColoredFresnel=specularFresnel*specular_color;}
#ifdef GEOMETRY_THIN_WALLED
let refractNormalW: vec3f=viewDirectionW;
#else
let refractNormalW: vec3f=normalW;
#endif
preInfoTrans.NdotL=0.5f*max(dot(-refractNormalW,preInfoTrans.L),0.0f)+0.5f;
#if defined(DISPERSION) && !defined(GEOMETRY_THIN_WALLED)
var dispersion_iors_local: vec3f=dispersion_iors;let diff: f32=min(dispersion_iors_local[2]-dispersion_iors_local[0],max(dispersion_iors_local[0]-1.0f,1.0f));dispersion_iors_local[2]+=diff;dispersion_iors_local[0]-=diff;for (var i: i32=0; i<3; i++) {let eta: f32=1.0f/dispersion_iors_local[i];
#elif defined(GEOMETRY_THIN_WALLED)
let eta: f32=1.0f;
#else
let eta: f32=1.0f/specular_ior;
#endif
preInfoTrans.H=preInfoTrans.L+min(eta,0.95f)*viewDirectionW;let len2: f32=dot(preInfoTrans.H,preInfoTrans.H);if (len2<1e-6f) {preInfoTrans.H=preInfoTrans.L;} else {preInfoTrans.H=preInfoTrans.H*inverseSqrt(len2);}
#ifdef ANISOTROPIC_BASE
preInfoTrans.H=-preInfoTrans.H;
#endif
preInfoTrans.VdotH=dot(viewDirectionW,preInfoTrans.H);
#if defined(DISPERSION) && !defined(GEOMETRY_THIN_WALLED)
forwardScatteredLight[i]+=
#else
forwardScatteredLight+=
#endif
#if defined(ANISOTROPIC_BASE)
computeAnisotropicSpecularLighting(preInfoTrans,viewDirectionW,refractNormalW,
baseGeoInfo.anisotropicTangent,baseGeoInfo.anisotropicBitangent,baseGeoInfo.anisotropy,
transmission_roughness_alpha,lightColor{X}.rgb
#else
computeSpecularLighting(preInfoTrans,-refractNormalW,vec3f(1.0f),vec3f(1.0f),transmission_roughness_alpha,lightColor{X}.rgb
#endif
#if defined(DISPERSION) && !defined(GEOMETRY_THIN_WALLED)
)[i];}
#else
);
#endif
#if !defined(GEOMETRY_THIN_WALLED)
forwardScatteredLight=mix(forwardScatteredLight,0.25f*preInfoTrans.attenuation*lightColor{X}.rgb,clamp(1.0f-pow(baseGeoInfo.NdotV,transmission_roughness_alpha),0.0f,1.0f));
#endif
#ifdef REFRACTED_BACKGROUND
#ifdef GEOMETRY_THIN_WALLED
forwardScatteredLight=mix(vec3f(0.0f),forwardScatteredLight.rgb,0.2*transmission_roughness_alpha);
#else
forwardScatteredLight=max(vec3f(0.0f),mix(vec3f(0.0f),forwardScatteredLight,transmission_roughness_alpha));
#endif
#endif
#ifdef SCATTERING
#if !defined(USE_IRRADIANCE_TEXTURE_FOR_SCATTERING) || defined(USE_IRRADIANCE_TEXTURE_FOR_SCATTERING_GBUFFER)
preInfoTrans.roughness=1.0f;let diffused_forward_scattered_light: vec3f=computeSpecularLighting(preInfoTrans,normalW,vec3f(1.0f),vec3f(1.0f),1.0f,lightColor{X}.rgb)*volume_absorption;
#endif
#ifdef GEOMETRY_THIN_WALLED
let forward_scattered_light: vec3f=forwardScatteredLight*transmission_tint*volumeParams.multi_scatter_color;let back_scattered_light: vec3f=slab_diffuse*volumeParams.multi_scatter_color;slab_translucent=mix(back_scattered_light,forward_scattered_light,0.5f+0.5f*volumeParams.anisotropy);
#else
let back_scattered_normal: vec3f=normalize(normalW+viewDirectionW);preInfoTrans.NdotL=max(dot(back_scattered_normal,preInfoTrans.L),0.0f);preInfoTrans.NdotV=dot(back_scattered_normal,viewDirectionW);preInfoTrans.H=normalize(viewDirectionW+preInfoTrans.L);preInfoTrans.VdotH=clamp(dot(viewDirectionW,preInfoTrans.H),0.0f,1.0f);preInfoTrans.roughness=0.2f;let back_scattered_light: vec3f=computeSpecularLighting(preInfoTrans,viewDirectionW,vec3f(1.0f),vec3f(0.08f),0.0f,lightColor{X}.rgb);let forward_scattered_light: vec3f=(forwardScatteredLight*volume_absorption);let iso_scattered_light: vec3f=slab_diffuse;let back_scattering: vec3f=mix(forward_scattered_light,forward_scattered_light+back_scattered_light*backscatter_color,iso_scatter_density);
#if defined(USE_IRRADIANCE_TEXTURE_FOR_SCATTERING) && !defined(USE_IRRADIANCE_TEXTURE_FOR_SCATTERING_GBUFFER)
let iso_scattering: vec3f=mix(forward_scattered_light,scattered_light_from_irradiance_texture*volumeParams.multi_scatter_color,iso_scatter_density);
#else
let iso_scattering: vec3f=mix(forward_scattered_light,(diffused_forward_scattered_light+iso_scattered_light)*volumeParams.multi_scatter_color,iso_scatter_density);
#endif
slab_translucent=mix(back_scattering,iso_scattering,back_to_iso_scattering_blend);slab_translucent=mix(slab_translucent,forward_scattered_light,iso_to_forward_scattering_blend)*transmission_tint;
#endif
#else
slab_translucent=forwardScatteredLight*transmission_tint*volume_absorption;
#endif
}
#endif
#endif
#if defined(AREALIGHT{X}) && defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)
#if CONDUCTOR_SPECULAR_MODEL==CONDUCTOR_SPECULAR_MODEL_OPENPBR
slab_metal=computeOpenPBRAreaConductorSpecularLighting(
preInfo{X},
light{X}.vLightSpecular.rgb,
baseConductorReflectance.coloredF0,
baseConductorReflectance.coloredF90
);
#else
slab_metal=computeOpenPBRAreaSpecularLighting(
preInfo{X},
light{X}.vLightSpecular.rgb,
baseConductorReflectance.coloredF0,
baseConductorReflectance.coloredF90
);
#endif
#else
{
#if (CONDUCTOR_SPECULAR_MODEL==CONDUCTOR_SPECULAR_MODEL_OPENPBR)
var coloredFresnel: vec3f=getF82Specular(preInfo{X}.VdotH,baseConductorReflectance.coloredF0,baseConductorReflectance.coloredF90,specular_roughness);
#else
var coloredFresnel: vec3f=fresnelSchlickGGX(preInfo{X}.VdotH,baseConductorReflectance.coloredF0,baseConductorReflectance.coloredF90);
#endif
#ifdef THIN_FILM
let thinFilmConductorAngle: f32=max(preInfo{X}.VdotH,specular_roughness);var thinFilmConductorFresnel: vec3f=evalIridescence(thin_film_outside_ior,thin_film_ior,thinFilmConductorAngle,thin_film_thickness,baseConductorReflectance.coloredF0);thinFilmConductorFresnel=mix(thinFilmConductorFresnel,vec3f(dot(thinFilmConductorFresnel,vec3f(0.3333f))),thin_film_desaturation_scale);coloredFresnel=mix(coloredFresnel,specular_weight*thinFilmConductorFresnel,thin_film_weight*thin_film_ior_scale);
#endif
#ifdef ANISOTROPIC_BASE
slab_metal=computeAnisotropicSpecularLighting(preInfo{X},viewDirectionW,normalW,baseGeoInfo.anisotropicTangent,baseGeoInfo.anisotropicBitangent,baseGeoInfo.anisotropy,0.0,lightColor{X}.rgb);
#else
slab_metal=computeSpecularLighting(preInfo{X},normalW,vec3f(1.0f),coloredFresnel,specular_roughness,lightColor{X}.rgb);
#endif
}
#endif
#if defined(AREALIGHT{X}) && defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)
slab_coat=computeOpenPBRAreaSpecularLighting(
preInfoCoat{X},
light{X}.vLightSpecular.rgb,
vec3f(coatReflectance.F0),
vec3f(coatReflectance.F90)
);
#else
{
#ifdef ANISOTROPIC_COAT
slab_coat=computeAnisotropicSpecularLighting(preInfoCoat{X},viewDirectionW,coatNormalW,
coatGeoInfo.anisotropicTangent,coatGeoInfo.anisotropicBitangent,coatGeoInfo.anisotropy,0.0,
lightColor{X}.rgb);
#else
slab_coat=computeSpecularLighting(preInfoCoat{X},coatNormalW,vec3f(coatReflectance.F0),vec3f(1.0f),coat_roughness,lightColor{X}.rgb);
#endif
let NdotH: f32=saturateEps(dot(coatNormalW,preInfoCoat{X}.H));coatFresnel=fresnelSchlickGGX(NdotH,coatReflectance.F0,coatReflectance.F90);}
#endif
var coatAbsorption=vec3f(1.0f);if (coat_weight>0.0) {let cosTheta_view: f32=max(preInfoCoat{X}.NdotV,0.001f);let cosTheta_light: f32=max(preInfoCoat{X}.NdotL,0.001f);let fresnel_view: f32=coatReflectance.F0+(1.0f-coatReflectance.F0)*pow(1.0f-cosTheta_view,5.0);let fresnel_light: f32=coatReflectance.F0+(1.0f-coatReflectance.F0)*pow(1.0f-cosTheta_light,5.0);let averageReflectance: f32=(fresnel_view+fresnel_light)*0.5;var darkened_transmission: f32=(1.0f-averageReflectance)/(1.0f+averageReflectance);darkened_transmission=mix(1.0f,darkened_transmission,coat_darkening);var sin2: f32=1.0f-coatGeoInfo.NdotV*coatGeoInfo.NdotV;sin2=sin2/(coat_ior*coat_ior)*coat_weight;let cos_t: f32=sqrt(1.0f-sin2);let coatPathLength=1.0f/cos_t;let effectivePathLength=coatPathLength*coat_weight;let colored_transmission: vec3f=pow(coat_color,vec3f(effectivePathLength));coatAbsorption=colored_transmission*mix(1.0f,darkened_transmission,coat_weight);}
#ifdef FUZZ
fuzzFresnel=fuzzBrdf.z;let fuzzNormalW=mix(normalW,coatNormalW,coat_weight);let fuzzNdotV: f32=max(dot(fuzzNormalW,viewDirectionW.xyz),0.0f);let fuzzNdotL: f32=max(dot(fuzzNormalW,preInfo{X}.L),0.0);slab_fuzz=lightColor{X}.rgb*preInfo{X}.attenuation*evalFuzz(preInfo{X}.L,fuzzNdotL,fuzzNdotV,fuzzTangent,fuzzBitangent,fuzzBrdf);
#else
let fuzz_color=vec3f(0.0);
#endif
#ifdef PREPASS_IRRADIANCE
total_direct_diffuse+=slab_diffuse;
#endif
let material_dielectric_base: vec3f=mix(slab_diffuse*base_color.rgb,slab_translucent,surface_translucency_weight);
#if defined(AREALIGHT{X}) && defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)
let material_dielectric_gloss: vec3f=material_dielectric_base*(1.0f-specularFresnel)+slab_glossy;
#else
let material_dielectric_gloss: vec3f=material_dielectric_base*(1.0f-specularFresnel)+slab_glossy*specularColoredFresnel;
#endif
let material_base_substrate: vec3f=mix(material_dielectric_gloss,slab_metal,base_metalness);let material_coated_base: vec3f=layer(material_base_substrate,slab_coat,coatFresnel,coatAbsorption,vec3f(1.0f));material_surface_direct+=layer(material_coated_base,slab_fuzz,fuzzFresnel*fuzz_weight,vec3f(1.0f),fuzz_color);}
#endif
`,t.IncludesShadersStoreWGSL[Er]||(t.IncludesShadersStoreWGSL[Er]=Dr),Or={name:Er,shader:Dr}})))()}var Ar,jr,Mr;function Nr(){return(Nr=e((()=>{n(),tt(),Ar=`openpbrBlockPrePass`,jr=`#if SCENE_MRT_COUNT>0
#ifdef ALPHATEST
var writeGeometryInfo: f32=1.0;
#else
var writeGeometryInfo: f32=select(0.0,1.0,finalColor.a>ALPHATESTVALUE);
#endif
var fragData: array<vec4<f32>,SCENE_MRT_COUNT>;
#ifdef PREPASS_MESH_BLEND_TAG
var meshBlendTagOutput: vec4<u32>=vec4u(0u);if (writeGeometryInfo>0.0) {meshBlendTagOutput=vec4u(u32(uniforms.meshBlendTag),0u,0u,0u);}
#endif
#ifdef PREPASS_POSITION
fragData[PREPASS_POSITION_INDEX]= vec4f(fragmentInputs.vPositionW,writeGeometryInfo);
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
#ifdef PREPASS_ALBEDO
fragData[PREPASS_ALBEDO_INDEX]=vec4f(surfaceAlbedo,writeGeometryInfo);
#endif
#ifdef PREPASS_ALBEDO_SQRT
var sqAlbedo : vec3f=sqrt(surfaceAlbedo); 
#endif
#ifdef PREPASS_IRRADIANCE
var irradiance : vec3f=total_direct_diffuse;
#ifndef UNLIT
#ifdef REFLECTION
irradiance+=slab_diffuse_ibl;
#endif
#endif
#ifdef SCATTERING
let scatter_mask: f32=min(subsurface_weight+transmission_weight,1.0);
#else
let scatter_mask: f32=0.0;
#endif
fragData[PREPASS_IRRADIANCE_INDEX]=vec4f(irradiance,writeGeometryInfo*scatter_mask);
#elif defined(PREPASS_COLOR)
fragData[PREPASS_COLOR_INDEX]=vec4f(finalColor.rgb,finalColor.a);
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
#ifdef PREPASS_ALBEDO_SQRT
fragData[PREPASS_ALBEDO_SQRT_INDEX]=vec4f(sqAlbedo,writeGeometryInfo);
#endif
#ifdef PREPASS_REFLECTIVITY
#ifndef UNLIT
fragData[PREPASS_REFLECTIVITY_INDEX]=vec4f(specularEnvironmentR0,microSurface)*writeGeometryInfo;
#else
fragData[PREPASS_REFLECTIVITY_INDEX]=vec4f(0.0,0.0,0.0,1.0)*writeGeometryInfo;
#endif
#endif
#include<meshBlendTagFragmentOutput>[0..8]
#endif
`,t.IncludesShadersStoreWGSL[Ar]||(t.IncludesShadersStoreWGSL[Ar]=jr),Mr={name:Ar,shader:jr}})))()}var Pr,Fr,Ir;function Lr(){return(Lr=e((()=>{n(),Pr=`openpbrNormalMapVertexDeclaration`,Fr=`#if defined(GEOMETRY_NORMAL) || defined(PARALLAX) || defined(CLEARCOAT_BUMP) || defined(ANISOTROPIC) || defined(FUZZ)
#if defined(TANGENT) && defined(NORMAL) 
varying vTBN0: vec3f;varying vTBN1: vec3f;varying vTBN2: vec3f;
#endif
#endif
`,t.IncludesShadersStoreWGSL[Pr]||(t.IncludesShadersStoreWGSL[Pr]=Fr),Ir={name:Pr,shader:Fr}})))()}var $,Rr,zr;function Br(){return(Br=e((()=>{n(),$=`openpbrNormalMapVertex`,Rr=`#if defined(GEOMETRY_NORMAL) || defined(PARALLAX) || defined(CLEARCOAT_BUMP) || defined(ANISOTROPIC) || defined(FUZZ)
#if defined(TANGENT) && defined(NORMAL)
var tbnNormal: vec3f=normalize(normalUpdated);var tbnTangent: vec3f=normalize(tangentUpdated.xyz);var tbnBitangent: vec3f=cross(tbnNormal,tbnTangent)*tangentUpdated.w;var matTemp= mat3x3f(finalWorld[0].xyz,finalWorld[1].xyz,finalWorld[2].xyz)* mat3x3f(tbnTangent,tbnBitangent,tbnNormal);vertexOutputs.vTBN0=matTemp[0];vertexOutputs.vTBN1=matTemp[1];vertexOutputs.vTBN2=matTemp[2];
#endif
#endif
`,t.IncludesShadersStoreWGSL[$]||(t.IncludesShadersStoreWGSL[$]=Rr),zr={name:$,shader:Rr}})))()}export{on as $,Ae as $t,Vn as A,ft as At,Dn as B,Qe as Bt,Zn as C,St as Ct,Gn as D,gt as Dt,qn as E,vt as Et,Nn as F,it as Ft,vn as G,He as Gt,wn as H,Je as Ht,Mn as I,rt as It,mn as J,ze as Jt,_n as K,Ue as Kt,An as L,tt as Lt,Rn as M,ut as Mt,In as N,st as Nt,Wn as O,ht as Ot,Fn as P,ot as Pt,cn as Q,Pe as Qt,kn as R,et as Rt,er as S,wt as St,Jn as T,yt as Tt,xn as U,Ke as Ut,Cn as V,Ye as Vt,bn as W,Ge as Wt,dn as X,Le as Xt,fn as Y,Ie as Yt,ln as Z,Ne as Zt,lr as _,jt as _t,Nr as a,Se as an,Xt as at,ir as b,Dt as bt,Or as c,ye as cn,Kt as ct,xr as d,pe as dn,Vt as dt,je as en,an as et,br as f,fe as fn,Bt as ft,fr as g,oe as gn,Ft as gt,pr as h,se as hn,Pt as ht,Ir as i,we as in,Qt as it,zn as j,lt as jt,Hn as k,pt as kt,Tr as l,ge as ln,Wt as lt,gr as m,le as mn,Lt as mt,zr as n,De as nn,nn as nt,Mr as o,xe as on,Yt as ot,_r as p,ue as pn,Rt as pt,hn as q,Be as qt,Lr as r,Te as rn,$t as rt,kr as s,ve as sn,qt as st,Br as t,Oe as tn,tn as tt,wr as u,he as un,Ut as ut,cr as v,At as vt,Xn as w,xt as wt,tr as x,Tt as xt,ar as y,Ot as yt,En as z,Ze as zt};