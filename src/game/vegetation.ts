import {Scene,Mesh,TransformNode,CreateIcoSphere,CreateCylinder,VertexBuffer,VertexData,Vector3,Quaternion,Color3} from './babylon';
import type {Shapes} from './shapes';

export type TreeKind='oak'|'apple'|'birch'|'pine';
type Point=[number,number,number];
const LEAVES={oak:'#72945E',apple:'#80A263',birch:'#9AB872',pine:'#527E60'};

// Per-object seeds keep the world layout independent of decorative detail.
export function createVegetation(scene:Scene,{shape,group,material}:Shapes){
  function randomAt(x:number,z:number){
    let seed=(Math.imul(Math.round(x*100),73856093)^Math.imul(Math.round(z*100),19349663)^4271)>>>0;
    return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
  }
  function canopy(parent:TransformNode,name:string,p:Point,size:Point,color:string,phase:number,obstacle=false){
    // Eighty triangles per lobe, shared material, colour variation in vertices.
    const mesh=CreateIcoSphere(name,{radius:1,subdivisions:2,flat:false},scene);
    const positions=mesh.getVerticesData(VertexBuffer.PositionKind)!,normals:number[]=[],colors:number[]=[],base=Color3.FromHexString(color);
    for(let i=0;i<positions.length;i+=3){
      const [x,y,z]=[positions[i],positions[i+1],positions[i+2]];
      const wobble=1+.085*Math.sin(x*6+phase)*Math.cos(z*5-phase)+.045*Math.sin(y*8+phase);
      positions[i]*=wobble;positions[i+1]*=wobble;positions[i+2]*=wobble;
      const shade=.80+.20*(y+1)/2+.055*Math.sin(x*5+z*4+phase);
      colors.push(base.r*shade,base.g*shade,base.b*shade,1);
    }
    VertexData.ComputeNormals(positions,mesh.getIndices()!,normals);
    mesh.setVerticesData(VertexBuffer.PositionKind,positions);mesh.setVerticesData(VertexBuffer.NormalKind,normals);mesh.setVerticesData(VertexBuffer.ColorKind,colors);
    mesh.parent=parent;mesh.position.set(...p);mesh.scaling.set(...size);mesh.material=material('#FFFFFF');
    mesh.isPickable=obstacle;mesh.metadata={cameraObstacle:obstacle};return mesh;
  }
  function branch(parent:TransformNode,a:Point,b:Point,radius:number,color:string,obstacle=false){
    const direction=new Vector3(b[0]-a[0],b[1]-a[1],b[2]-a[2]);
    const mesh=CreateCylinder('tree-branch',{height:direction.length(),diameterBottom:radius*2,diameterTop:radius*1.15,tessellation:7},scene);
    mesh.position.set((a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2);mesh.parent=parent;
    mesh.rotationQuaternion=Quaternion.FromUnitVectorsToRef(Vector3.Up(),direction.normalize(),new Quaternion());
    mesh.material=material(color);mesh.isPickable=obstacle;mesh.metadata={cameraObstacle:obstacle};return mesh;
  }
  function grass(parent:TransformNode,x:number,y:number,z:number,size=1){
    const random=randomAt(x,z),positions:number[]=[],indices:number[]=[],colors:number[]=[],normals:number[]=[],uvs:number[]=[];
    for(let i=0;i<5;i++){
      const angle=random()*Math.PI*2,height=(.18+random()*.26)*size,width=.045*size,bend=.13*size;
      const px=x+(random()-.5)*.22*size,pz=z+(random()-.5)*.22*size,c=Math.cos(angle),s=Math.sin(angle),j=positions.length/3;
      positions.push(px-c*width,y,pz-s*width,px+c*width,y,pz+s*width,px+s*bend,y+height,pz-c*bend);
      // Separate reverse vertices keep the two face normals from cancelling out.
      positions.push(...positions.slice(-9));indices.push(j,j+1,j+2,j+5,j+4,j+3);
      colors.push(.32,.47,.23,1,.32,.47,.23,1,.58,.69,.35,1);
      colors.push(...colors.slice(-12));uvs.push(0,0,1,0,.5,1,0,0,1,0,.5,1);
    }
    VertexData.ComputeNormals(positions,indices,normals);const data=new VertexData();Object.assign(data,{positions,indices,normals,colors,uvs});
    const mesh=new Mesh('grass-tuft',scene);data.applyToMesh(mesh);mesh.parent=parent;mesh.material=material('#FFFFFF');mesh.isPickable=false;return mesh;
  }
  function tree(parent:TransformNode,x:number,y:number,z:number,scale:number,kind:TreeKind){
    const random=randomAt(x,z),g=group('tree',parent,x,y,z);g.scaling.setAll(scale);g.rotation.y=random()*Math.PI*2;g.metadata={treeKind:kind};
    const bark=kind==='birch'?'#E8D8B6':'#8D7254';
    const tall=kind==='birch'?1.18:1;
    branch(g,[0,0,0],[.06,1.5,0],.22,bark,true);branch(g,[.06,1.5,0],[-.08,3.4*tall,.04],.15,bark,true);
    for(let i=0;i<5;i++){
      const a=i*Math.PI*2/5;
      branch(g,[0,.16,0],[Math.cos(a)*.48,.035,Math.sin(a)*.48],.09,bark);
    }
    if(kind==='pine'){
      // Layered skirts with individual drooping tips, rather than stacked cones.
      for(let layer=0;layer<4;layer++){
        const y=1.7+layer*.72,radius=1.2-layer*.25;
        canopy(g,'pine-heart',[0,y+.35,0],[radius*.76,.78,radius*.76],LEAVES.pine,layer,true);
        for(let j=0;j<5;j++){
          const a=j*Math.PI*2/5+layer*.65,r=radius*.65,tip:Point=[Math.cos(a)*r,y,Math.sin(a)*r];
          branch(g,[0,y-.1,0],tip,.045,bark);
          canopy(g,'pine-bough',tip,[radius*.6,.40,radius*.48],layer%2?'#699164':LEAVES.pine,a);
        }
      }
      canopy(g,'pine-tip',[0,4.65,0],[.3,.65,.3],'#80A071',1,true);
    }else{
      for(let i=0;i<6;i++){
        const a=i*Math.PI*2/6+random()*.35,r=(kind==='birch'?.64:1.02)+random()*.20,y=(2.45+(i%3)*.34)*tall;
        const tip:Point=[Math.cos(a)*r,y,Math.sin(a)*r];
        branch(g,[.02,1.35+i*.16,0],[tip[0]*.80,y-.05,tip[2]*.80],.085,bark);
        const size=kind==='birch'?.70:.89;
        canopy(g,'leaf-crown',tip,[size,.75+random()*.24,size*.88],LEAVES[kind],a,true);
        canopy(g,'leaf-edge',[tip[0]*1.28,y+.1,tip[2]*1.28],[size*.43,.36,size*.48],LEAVES[kind],a+2);
        if(kind==='apple'&&i%2===0){
          for(let j=0;j<2;j++){
            const ax=tip[0]+(j-.5)*.34,az=tip[2]-.45,ay=y-.46;
            shape('ball','apple','#D88B6E',g,ax,ay,az,.13,.14,.13);
            branch(g,[ax,ay+.11,az],[ax+.015,ay+.20,az],.014,bark);
            canopy(g,'apple-leaf',[ax+.06,ay+.19,az],[.10,.026,.045],'#72945E',a);
          }
        }
      }
      canopy(g,'leaf-crown-top',[-.12,3.65*tall,.05],[kind==='birch'?.74:.93,.85,.82],kind==='birch'?'#A2B97B':'#8BA96B',2,true);
      if(kind==='birch')for(let i=0;i<8;i++){
        const a=i*2.4,y=.35+i*.29;
        const mark=shape('box','birch-bark','#84614B',g,Math.sin(a)*.17,y,Math.cos(a)*.17,.13,.035,.025);mark.rotation.y=a;
      }
    }
    for(let i=0;i<3;i++){const a=random()*Math.PI*2;grass(g,Math.cos(a)*.5,.025,Math.sin(a)*.5,.85)}
    return g;
  }
  function shrub(parent:TransformNode,x:number,y:number,z:number,size:number){
    const g=group('shrub',parent,x,y,z),random=randomAt(x,z);
    for(let i=0;i<4;i++){const a=i*2.4;canopy(g,'shrub-leaves',[Math.sin(a)*.3*size,(.25+random()*.12)*size,Math.cos(a)*.25*size],[.44*size,.38*size,.40*size],'#72945E',a)}
    grass(g,.5*size,.02,0,size);return g;
  }
  return {tree,grass,shrub};
}
