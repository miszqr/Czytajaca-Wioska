import type {Scene,TransformNode} from '../game/babylon';
import {createShapes} from '../game/shapes';
// Original procedural prototype. The supplied turnaround is a reference, not a rigged asset.
export function createCharacter(scene:Scene,kind:'kitek'|'bruno'|'fela'|'tola'|'milus'){
  const {group,shape}=createShapes(scene),fox=kind==='kitek'||kind==='fela',root=group(kind),body=group(`${kind}-body`,root),fur=fox?'#C98755':kind==='milus'?'#C4AC93':kind==='tola'?'#A58B73':'#967052',cream='#FFE0BC',cloth=kind==='fela'?'#4F8065':fox?'#77A8D7':kind==='tola'?'#8EA4B0':'#8CA878';
  const limbs:TransformNode[]=[];
  for(const side of [-1,1]){
    const leg=group('leg',body,side*.105,.36,0);shape('cylinder','leg-fur',fur,leg,0,-.12,0,.07,.24,.07);shape('ball','boot','#705344',leg,0,-.28,.04,.09,.08,.13);limbs.push(leg);
  }
  shape('ball','shorts','#795B46',body,0,.38,0,.22,.17,.15);
  shape('cylinder','tunic',cloth,body,0,.58,0,.24,.38,.18);
  shape('ring','tunic-hem',fox?'#5F8BB5':'#708D60',body,0,.397,0,.47,.23,.36);
  for(const side of [-1,1]){
    const arm=group('arm',body,side*.24,.73,0);shape('ball','sleeve',cloth,arm,0,-.055,0,.095,.115,.10);shape('cylinder','arm-fur',fur,arm,0,-.19,0,.067,.24,.067);shape('ball','paw',fox?'#846046':fur,arm,0,-.30,.015,.08,.085,.075);limbs.push(arm);
    shape('box','pack-strap','#A88560',body,side*.13,.64,.155,.037,.36,.027);
  }
  const head=group('head',body,0,.97,0);shape('ball','head-fur',fur,head,0,0,0,.29,.26,.24);
  shape('ball','muzzle-left',cream,head,-.105,-.095,.18,.17,.10,.105);shape('ball','muzzle-right',cream,head,.105,-.095,.18,.17,.10,.105);
  for(const side of [-1,1]){
    if(fox){
      const ear=shape('cone','fox-ear',fur,head,side*.22,.25,-.025,.13,.35,.095);ear.rotation.z=-side*.24;
      const inner=shape('cone','inner-ear','#E5A7A3',head,side*.223,.26,.044,.075,.23,.03);inner.rotation.z=-side*.24;
      const tuft=shape('cone','cheek-tuft',cream,head,side*.25,-.09,.085,.085,.17,.075);tuft.rotation.z=-side*1.25;
    }else if(kind==='milus'){shape('ball','rabbit-ear',fur,head,side*.15,.37,-.02,.085,.32,.07);shape('ball','rabbit-ear-inner','#E0B5AA',head,side*.15,.38,.04,.045,.24,.02)}else if(kind==='tola'){shape('ball','owl-face','#E6D5B4',head,side*.13,.025,.18,.16,.18,.045)}else{shape('ball','bear-ear',fur,head,side*.255,.18,-.01,.115,.12,.075);shape('ball','bear-inner-ear','#CCA58A',head,side*.255,.18,.05,.068,.075,.02)}
    shape('ball','eye-white','#FFF9E9',head,side*.105,.015,.202,.083,.104,.04);
    shape('ball','eye-green','#3A6F56',head,side*.105,.012,.234,.055,.076,.021);
    shape('ball','pupil','#26382D',head,side*.105,.011,.251,.035,.056,.012);
    shape('ball','eye-glint','#FFFFFF',head,side*.105-.016,.045,.260,.019,.022,.007);
    const brow=shape('ball','eyebrow','#76513B',head,side*.10,.145,.19,.069,.018,.019);brow.rotation.z=side*.17;
  }
  if(kind==='tola')shape('cone','owl-beak','#C99F58',head,0,-.08,.28,.07,.13,.09);else shape('ball','nose','#45342D',head,0,-.067,.295,.055,.037,.032);
  shape('ball','smile','#825439',head,0,-.15,.254,.046,.009,.01);
  const tail=group('tail',body,0,.34,-.13);
  if(fox){
    const t=shape('ball','fluffy-tail',fur,tail,.08,.06,-.35,.19,.18,.39);t.rotation.x=-.35;t.rotation.y=-.25;
    const tip=shape('ball','tail-tip',cream,tail,.18,.20,-.64,.135,.14,.20);tip.rotation.x=-.35;tip.rotation.y=-.25;
    if(kind==='kitek'){
    const pack=group('backpack',body,0,.62,-.22);
    shape('box','pack-body','#AA805D',pack,0,0,-.06,.34,.39,.16);
    shape('ball','pack-flap','#B9916C',pack,0,.14,-.11,.18,.09,.08);
    for(const side of [-1,1]){shape('box','leather-strap','#806045',pack,side*.10,-.015,-.15,.035,.30,.025);shape('box','buckle','#E1BA68',pack,side*.10,-.04,-.17,.061,.061,.015);shape('box','buckle-hole','#806045',pack,side*.10,-.04,-.18,.035,.035,.01)}
    const roll=shape('cylinder','bedroll','#D1B18A',pack,0,.28,-.035,.085,.40,.085);roll.rotation.z=Math.PI/2;
    shape('ball','leaf-charm','#84A765',pack,.20,.02,-.06,.04,.072,.023);
    }else{
      shape('cone','fela-skirt','#3D6B56',body,0,.32,0,.31,.49,.25);
      shape('box','shop-apron','#C7D4B0',body,0,.51,.18,.30,.36,.035);
      shape('box','shop-pocket','#B8817C',body,0,.50,.207,.17,.10,.018);
      shape('ball','hair-bow','#B8817C',head,-.21,.22,.04,.17,.06,.06);
      root.scaling.setAll(1.08);
    }
  }else if(kind==='bruno'){
    shape('box','apron','#B0BB87',body,0,.51,.18,.30,.39,.035);shape('box','apron-pocket','#8E9E6D',body,0,.50,.207,.17,.10,.018);
    shape('cylinder','hat-brim','#D4B577',head,0,.23,-.01,.40,.045,.31);shape('cylinder','hat-top','#E5C78B',head,0,.31,-.01,.25,.17,.23);shape('cylinder','hat-band','#8A6B44',head,0,.26,-.01,.255,.055,.235);
    root.scaling.setAll(1.23);
  }
  if(kind==='milus'){shape('ball','rabbit-tail','#EEE4CC',tail,0,0,-.07,.11);shape('box','mail-bag','#A58260',body,.22,.45,.03,.22,.28,.22)}
  if(kind==='tola'){for(const side of [-1,1]){shape('ball','owl-wing',fur,body,side*.29,.6,-.04,.1,.26,.14);shape('ring','owl-glasses','#6D6451',head,side*.105,.015,.258,.20,.20,.10)}root.scaling.setAll(1.05)}
  function animate(time:number,speed:number,celebrate=false,reduced=false,gesture:'idle'|'talk'|'pick-up'|'give'='idle'){
    const phase=time*(speed>2.6?12:8),stride=Math.min(1,speed/2.4);
    limbs.forEach((limb,i)=>limb.rotation.x=reduced?0:Math.sin(phase+(i%2)*Math.PI)*(i<2?.52:-.52)*stride);
    body.position.y=reduced?0:(celebrate?Math.abs(Math.sin(time*7))*.13:Math.sin(time*2)*.008+Math.abs(Math.sin(phase))*.026*stride);
    body.rotation.x=!reduced&&gesture==='pick-up'?Math.abs(Math.sin(time*3))*.25:0;
    head.rotation.x=!reduced&&gesture==='talk'?Math.sin(time*4)*.035:0;
    if(!reduced&&(gesture==='give'||gesture==='pick-up')){limbs[2].rotation.x=-.9;limbs[3].rotation.x=-.9}
    if(!reduced&&gesture==='talk')limbs[2].rotation.x=-.3+Math.sin(time*3)*.12;
    tail.rotation.y=reduced?0:Math.sin(time*2.4)*.15;
    if(celebrate){limbs[2].rotation.z=-1.8;limbs[3].rotation.z=1.8}else{limbs[2].rotation.z=0;limbs[3].rotation.z=0}
  }
  return {root,body,head,tail,limbs,animate};
}
