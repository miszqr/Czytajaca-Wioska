import {Scene,TransformNode,Mesh,StandardMaterial,Color3,CreateBox,CreateSphere,CreateCylinder,CreateTorus} from './babylon';
export function createShapes(scene:Scene){
  const materials=new Map<string,StandardMaterial>();
  function material(color:string){let m=materials.get(color);if(!m){m=new StandardMaterial(color,scene);m.diffuseColor=Color3.FromHexString(color);m.specularColor=Color3.Black();materials.set(color,m)}return m}
  function group(name:string,parent?:TransformNode,x=0,y=0,z=0){const n=new TransformNode(name,scene);if(parent)n.parent=parent;n.position.set(x,y,z);return n}
  function shape(kind:'box'|'ball'|'cone'|'cylinder'|'ring',name:string,color:string,parent:TransformNode|null,x:number,y:number,z:number,sx:number,sy=sx,sz=sx){
    let mesh:Mesh;
    if(kind==='box')mesh=CreateBox(name,{size:1},scene);
    else if(kind==='ball')mesh=CreateSphere(name,{diameter:2,segments:6},scene);
    else if(kind==='ring')mesh=CreateTorus(name,{diameter:1,thickness:.1,tessellation:16},scene);
    else mesh=CreateCylinder(name,{diameterTop:kind==='cone'?0:2,diameterBottom:2,height:1,tessellation:kind==='cone'?7:12},scene);
    mesh.position.set(x,y,z);mesh.scaling.set(sx,sy,sz);mesh.material=material(color);mesh.parent=parent;mesh.isPickable=false;return mesh;
  }
  return {material,group,shape};
}
export type Shapes=ReturnType<typeof createShapes>;
