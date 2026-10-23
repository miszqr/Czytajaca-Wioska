// @vitest-environment jsdom
import {afterEach,beforeEach,expect,it,vi} from 'vitest';
import type {Input} from '../src/game/input';

const loop=vi.hoisted(()=>({frame:null as (()=>void)|null}));
vi.mock('../src/game/babylon',async()=>{
  const actual=await vi.importActual<typeof import('../src/game/babylon')>('../src/game/babylon');
  return {...actual,Engine:class extends actual.NullEngine{
    override getDeltaTime(){return 1000/60}
    override runRenderLoop(frame:()=>void){loop.frame=frame}
    override stopRenderLoop(){loop.frame=null}
  }};
});
import {DEFAULT_CONTENT} from '../src/content/defaults';
import {VillageGame} from '../src/game/runtime';
import {newSave,validateSave} from '../src/persistence/state';
import type {SaveState} from '../src/persistence/state';
import {Input as KeyboardInput} from '../src/game/input';
import {Vector3} from '../src/game/babylon';
import {CONFIG} from '../src/game/config';
import {choose,findNode} from '../src/story/engine';
import {POND,terrainHeight} from '../src/game/island-terrain';
import {GAS_LANTERNS,NIGHT_FLAG,lanternLitFlag} from '../src/game/lantern-layout';

let game:VillageGame|undefined,input:Input|undefined;
const errors=vi.fn();
function key(code:string,down=true){window.dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code,cancelable:true}))}
function frames(count=1){for(let i=0;i<count;i++)loop.frame!();expect(errors).not.toHaveBeenCalled()}
function start(state:SaveState=newSave()){
  const canvas=document.createElement('canvas');canvas.width=800;canvas.height=600;
  canvas.setPointerCapture=vi.fn();
  const onMapPose=vi.fn(),onSave=vi.fn();
  game=new VillageGame(canvas,state,{onReady:vi.fn(),onError:errors,onNear:vi.fn(),onMapPose,onSave,onAction:vi.fn(),onGamepad:vi.fn()},DEFAULT_CONTENT);
  // Exercise the real input, frame loop, collision rays and camera transforms;
  // only GPU rendering is skipped in this deterministic control test.
  vi.spyOn(game.scene,'render').mockImplementation(()=>{});
  game.setPaused(false);
  return {game,canvas,onMapPose,onSave};
}
function angleDifference(a:number,b:number){return Math.atan2(Math.sin(a-b),Math.cos(a-b))}
beforeEach(()=>{
  errors.mockClear();
  vi.stubGlobal('ResizeObserver',class{observe(){} disconnect(){}});
  vi.stubGlobal('matchMedia',()=>({matches:false}));
  vi.spyOn(document,'hidden','get').mockReturnValue(false);
});
afterEach(()=>{game?.dispose();game=undefined;input?.dispose();input=undefined;vi.restoreAllMocks();vi.unstubAllGlobals()});

it('strzałki obracają w obie strony w miejscu, kamera pozostaje za plecami',()=>{
  const {game}=start(),initial=game.snapshot().player;
  key('ArrowRight');frames(30);key('ArrowRight',false);
  let state=game.snapshot();expect(state.player.heading).toBeGreaterThan(1);
  expect(state.player.x).toBe(initial.x);expect(state.player.z).toBe(initial.z);
  expect(angleDifference(state.camera.yaw,state.player.heading)).toBeCloseTo(0);
  const behind=(game.camera.position.x-state.player.x)*Math.sin(state.player.heading)+(game.camera.position.z-state.player.z)*Math.cos(state.player.heading);
  expect(behind).toBeLessThan(0);
  key('ArrowLeft');frames(30);key('ArrowLeft',false);
  state=game.snapshot();expect(state.player.heading).toBeCloseTo(initial.heading);
  expect(angleDifference(state.camera.yaw,state.player.heading)).toBeCloseTo(0);
});

it('po obrocie idzie do przodu i cofa bez odwracania Kitka ani kamery',()=>{
  const {game}=start();key('ArrowRight');frames(30);key('ArrowRight',false);
  const initial=game.snapshot();key('ArrowUp');frames(30);key('ArrowUp',false);
  const forward=game.snapshot();
  expect(forward.player.x).toBeGreaterThan(initial.player.x+.7);
  expect(forward.player.heading).toBeCloseTo(initial.player.heading);
  key('ArrowDown');frames(45);key('ArrowDown',false);
  const back=game.snapshot();expect(back.player.x).toBeLessThan(forward.player.x-.7);
  expect(back.player.heading).toBeCloseTo(initial.player.heading);
  expect(angleDifference(back.camera.yaw,back.player.heading)).toBeCloseTo(0);
});

it('ruch i obrót jednocześnie zakręcają względem bohatera, bez sprzężenia z kamerą',()=>{
  const {game}=start();key('ArrowUp');key('ArrowRight');frames(30);
  const state=game.snapshot();expect(state.player.x).toBeGreaterThan(.4);expect(state.player.z).toBeGreaterThan(-4.4);
  expect(state.player.heading).toBeCloseTo(Math.PI*.4);
  expect(angleDifference(state.camera.yaw,state.player.heading)).toBeCloseTo(0);
});

it('po ręcznym obrocie kamera wraca najkrótszą drogą i kończy powrót po puszczeniu strzałek',()=>{
  const state=newSave();state.player.heading=Math.PI-.1;state.camera.yaw=-Math.PI+.1;
  const {game}=start(state);key('ArrowUp');frames();key('ArrowUp',false);
  expect(Math.abs(game.snapshot().camera.yaw-state.camera.yaw)).toBeLessThan(.1);
  frames(60);expect(Math.abs(angleDifference(game.snapshot().camera.yaw,state.player.heading))).toBeLessThan(.001);
});

it('ręczne rozglądanie ma pierwszeństwo, a WASD nie wpada w orbitowanie',()=>{
  const {game,canvas}=start();key('ArrowRight');frames(5);key('ArrowRight',false);
  function pointer(type:string,x:number){const event=new Event(type);Object.assign(event,{pointerId:1,button:0,clientX:x,clientY:0});canvas.dispatchEvent(event)}
  pointer('pointerdown',0);pointer('pointermove',100);frames();pointer('pointerup',100);
  const manual=game.snapshot().camera.yaw;frames(10);expect(game.snapshot().camera.yaw).toBeCloseTo(manual);
  key('KeyA');frames(30);key('KeyA',false);expect(game.snapshot().camera.yaw).toBeCloseTo(manual);
  key('ArrowUp');frames(60);key('ArrowUp',false);
  expect(Math.abs(angleDifference(game.snapshot().camera.yaw,game.snapshot().player.heading))).toBeLessThan(.001);
});

it('pauza zamraża ruch i kamerę, po zamknięciu dialogu nie zostaje wciśnięta strzałka',()=>{
  const {game}=start();key('ArrowRight');frames(10);game.setPaused(true);
  const before=game.snapshot();key('ArrowRight');frames(30);expect(game.snapshot()).toEqual(before);
  game.setPaused(false);frames(30);expect(game.snapshot()).toEqual(before);
});

it('strzałki zachowują akcje dialogu, a dotyk i pad zachowują wektor względem kamery',()=>{
  input=new KeyboardInput();key('ArrowLeft');key('ArrowUp');
  let frame=input.poll();expect(frame.actions).toEqual(['left','up']);expect(frame.turn).toBe(-1);expect(frame.characterForward).toBe(1);expect(frame.horizontal).toBe(0);expect(frame.forward).toBe(0);
  expect(input.poll().actions).toEqual([]);input.clear();input.setTouch(.5,.75);
  frame=input.poll();expect(frame.characterControls).toBe(false);expect(frame.horizontal).toBe(.5);expect(frame.forward).toBe(.75);
  input.setTouch(0,0);vi.stubGlobal('navigator',{getGamepads:()=>[{connected:true,axes:[1,-1,.5,0],buttons:[]} as unknown as Gamepad]});
  frame=input.poll();expect(frame.characterControls).toBe(false);expect(frame.horizontal).toBe(1);expect(frame.forward).toBe(1);expect(frame.lookX).toBeGreaterThan(0);
  window.dispatchEvent(new Event('blur'));key('ArrowRight');input.clear();expect(input.poll().turn).toBe(0);
});
it('podgląd domu zmienia tylko kamerę edytora i usuwa geometrię po anulowaniu',()=>{
 const state=newSave();state.location='home';state.player={x:0,z:-2.5,heading:0};const {game}=start(state);game.setPaused(true);const before=game.snapshot(),count=game.scene.meshes.length;
 game.editHome(true);expect(game.camera.position.y).toBe(13);
 game.previewFurniture({id:'preview',itemId:'lamp',x:-1.5,z:1.5,rotation:0});expect(game.scene.getTransformNodeByName('placement-preview')).not.toBeNull();
 game.previewFurniture(null);game.editHome(false);expect(game.snapshot()).toEqual(before);expect(game.scene.meshes.length).toBe(count);expect(game.camera.position.y).toBeLessThan(5);frames();
});

it('wnętrze w osobnej scenie nie przybliża kamery na placu, ale ściany działają w domu',()=>{
 const outside=newSave();outside.player={x:0,z:-3,heading:0};
 const {game}=start(outside);
 const cameraDistance=()=>Vector3.Distance(game.camera.position,game.world.kitek.root.position.add(new Vector3(0,CONFIG.cameraTargetHeight,0)));
 expect(game.scene.getTransformNodeByName('home-interior')).toBeNull();
 expect(cameraDistance()).toBeCloseTo(outside.camera.distance);

 const inside={...outside,location:'home' as const};game.syncState(inside);
 expect(game.scene.getTransformNodeByName('home-interior')!.isEnabled()).toBe(true);
 expect(cameraDistance()).toBeGreaterThan(.35);
 expect(cameraDistance()).toBeLessThan(1.2);

 game.syncState(outside);frames();
 expect(cameraDistance()).toBeCloseTo(outside.camera.distance);
 expect(game.world.kitek.root.isEnabled()).toBe(true);
});

it('ustawienie kamery działa w pauzie, zachowuje odległość przy centrowaniu i kolizjach',()=>{
 const saved=newSave(),{game}=start(saved);game.setPaused(true);
 const before=game.snapshot(),distance=()=>Vector3.Distance(game.camera.position,game.world.kitek.root.position.add(new Vector3(0,CONFIG.cameraTargetHeight,0)));
 game.setCameraDistance(8);expect(game.snapshot().camera.distance).toBe(8);expect(distance()).toBeCloseTo(8,2);
 expect(game.snapshot().player).toEqual(before.player);expect(game.snapshot().camera.yaw).toBe(before.camera.yaw);
 game.recenter();expect(game.snapshot().camera.distance).toBe(8);
 game.setCameraDistance(99);expect(game.snapshot().camera.distance).toBe(CONFIG.cameraMaxDistance);
 game.setCameraDistance(-1);expect(game.snapshot().camera.distance).toBe(CONFIG.cameraMinDistance);
 game.setCameraDistance(NaN);expect(game.snapshot().camera.distance).toBe(CONFIG.cameraMinDistance);
 game.setCameraDistance(8);
 const inside={...saved,location:'home' as const,player:{x:0,z:-3,heading:0},camera:game.snapshot().camera};game.syncState(inside);
 expect(distance()).toBeLessThan(1.2);expect(game.snapshot().camera.distance).toBe(8);
 game.syncState({...saved,camera:game.snapshot().camera});expect(distance()).toBeCloseTo(8,2);
 // Save validation accepts the extended range without changing the save format.
 expect(validateSave({...saved,...game.snapshot()})?.camera.distance).toBe(8);
});

it('Kitek wchodzi do stawu po dnie, wznawia zapis w wodzie i wychodzi na brzeg',()=>{
 const saved=newSave();saved.player={x:POND.x,z:POND.z+POND.radiusZ,heading:Math.PI};saved.camera.yaw=Math.PI;
 let {game}=start(saved);
 expect(game.world.kitek.root.position.y).toBeGreaterThan(POND.waterLevel);
 key('ArrowUp');key('ShiftLeft');frames(100);key('ArrowUp',false);key('ShiftLeft',false);
 const middle=game.snapshot(),position=game.world.kitek.root.position;
 expect(Math.abs(middle.player.z-POND.z)).toBeLessThan(.6);
 expect(position.y).toBeCloseTo(terrainHeight(position.x,position.z));
 expect(position.y).toBeLessThan(POND.waterLevel-.45);expect(game.camera.position.y).toBeGreaterThan(POND.waterLevel);
 const restored=validateSave(JSON.parse(JSON.stringify({...saved,...middle})))!;
 game.dispose();({game}=start(restored));
 expect(game.snapshot().player).toEqual(middle.player);
 expect(game.world.kitek.root.position.y).toBeLessThan(POND.waterLevel-.45);
 key('ArrowDown');key('ShiftLeft');frames(105);key('ArrowDown',false);key('ShiftLeft',false);
 expect(game.snapshot().player.z).toBeGreaterThan(POND.z+POND.radiusZ);
 expect(game.world.kitek.root.position.y).toBeGreaterThan(POND.waterLevel);
},15000);

it('drzwi przełączają scenę i kamerę, zachowują fabułę oraz właściwe punkty wejścia',()=>{
 let state=newSave();const {game}=start(state),village=game.scene,villageCamera=game.camera,villageKitek=game.world.kitek;
 expect(game.engine.scenes).toHaveLength(1);
 function act(target:string){const node=findNode(DEFAULT_CONTENT,state,target)!;expect(node).toBeDefined();state=choose(DEFAULT_CONTENT,state,node.id,node.choices[0].id).state;game.syncState(state)}
 act('bruno');key('ArrowUp');frames(5);act('home-door');const home=game.scene,homeCamera=game.camera;
 expect(home).not.toBe(village);expect(homeCamera).not.toBe(villageCamera);
 expect(game.world.kitek).not.toBe(villageKitek);expect(game.world.kitek.root.getScene()).toBe(home);
 expect(game.snapshot().player).toEqual({x:0,z:-2.5,heading:0});
 const entryPose=game.snapshot().player;frames(2);expect(game.snapshot().player).toEqual(entryPose);
 expect(home.getMeshByName('village-ground')).toBeNull();expect(home.getTransformNodeByName('home-door')).toBeNull();
 expect(village.getTransformNodeByName('home-interior')).toBeNull();expect(village.getTransformNodeByName('fela-letter')).toBeNull();
 act('fela-letter');act('home-exit');expect(game.scene).toBe(village);expect(game.camera).toBe(villageCamera);
 expect(game.snapshot().player).toEqual({x:18,z:4.2,heading:3.14159});expect(state.read).toEqual(['fela-letter']);
 act('home-door');expect(game.scene).toBe(home);expect(game.camera).toBe(homeCamera);expect(game.engine.scenes).toHaveLength(2);
 expect(state.read).toEqual(['fela-letter']);expect(state.completed).toContain('home');
});

it('zmierzch postępuje w otwartym menu, a powrót z domu zachowuje zapaloną latarnię',()=>{
 const state=newSave(),{game}=start(state),village=game.scene,sun=village.getLightByName('golden-hour-sun')!,day=sun.intensity;
 game.setPaused(true);const night=structuredClone(state);night.flags[NIGHT_FLAG]=true;night.flags[lanternLitFlag(GAS_LANTERNS[0].id)]=true;
 game.syncState(night);frames(90);expect(sun.intensity).toBeLessThan(day);expect(sun.intensity).toBeGreaterThan(.14);
 expect(village.getLightByName(`${GAS_LANTERNS[0].id}-light`)!.isEnabled()).toBe(true);
 expect(village.getLightByName(`${GAS_LANTERNS[1].id}-light`)!.isEnabled()).toBe(false);
 game.syncState({...night,location:'home'});expect(game.scene).not.toBe(village);expect(game.scene.getLightByName(`${GAS_LANTERNS[0].id}-light`)).toBeNull();
 game.syncState(night);expect(game.scene).toBe(village);frames(360);
 expect(sun.intensity).toBeCloseTo(.14);expect(village.getLightByName(`${GAS_LANTERNS[0].id}-light`)!.isEnabled()).toBe(true);
});

it('renderuje i aktualizuje tylko aktywną scenę, powroty nie mnożą zasobów, dispose sprząta obie',()=>{
 const outside=newSave(),inside={...outside,location:'home' as const,player:{x:0,z:-2.5,heading:0}};
 const {game}=start(outside),village=game.scene,villageNpcs=game.world.npcs;
 const villageRender=vi.mocked(village.render);villageRender.mockClear();
 const before=villageNpcs.map(n=>({motion:structuredClone(n.motion),position:n.character.root.position.asArray()}));
 game.syncState(inside);const home=game.scene,homeRender=vi.spyOn(home,'render').mockImplementation(()=>{});
 frames(30);expect(homeRender).toHaveBeenCalledTimes(30);expect(villageRender).not.toHaveBeenCalled();
 expect(villageNpcs.map(n=>({motion:n.motion,position:n.character.root.position.asArray()}))).toEqual(before);
 const counts=[village.meshes.length,home.meshes.length,village.materials.length,home.materials.length];
 for(let i=0;i<5;i++){game.syncState(outside);frames();game.syncState(inside);frames()}
 expect(game.engine.scenes).toHaveLength(2);
 expect([village.meshes.length,home.meshes.length,village.materials.length,home.materials.length]).toEqual(counts);
 game.dispose();expect(village.meshes).toHaveLength(0);expect(home.meshes).toHaveLength(0);expect(game.engine.scenes).toHaveLength(0);expect(loop.frame).toBeNull();
});

it('wznawia zapis v3 bez tworzenia wioski i zachowuje meble oraz edytor przy kolejnych wizytach',()=>{
 const saved=newSave();saved.location='home';saved.player={x:0,z:-2.5,heading:.4};saved.camera={yaw:.4,pitch:.45,distance:4.2};saved.flags['read-fela-letter']=true;saved.read=['fela-letter'];saved.inventory.crate=1;
 saved.furniture.push({id:'fela-lamp',itemId:'lamp',x:-1.5,z:1.5,rotation:1});
 const restored=validateSave(JSON.parse(JSON.stringify(saved)))!;const {game}=start(restored),home=game.scene;
 expect(game.engine.scenes).toHaveLength(1);expect(home.getMeshByName('village-ground')).toBeNull();expect(game.snapshot()).toEqual({location:'home',player:saved.player,camera:saved.camera});
 expect(home.getTransformNodeByName('fela-lamp')!.position.x).toBe(-1.5);
 game.editHome(true);game.previewFurniture({id:'preview',itemId:'lamp',x:1,z:1,rotation:0});
 const outside={...saved,location:'village' as const,player:{...CONFIG.spawn}};game.syncState(outside);
 expect(home.getTransformNodeByName('placement-preview')).toBeNull();expect(home.getTransformNodeByName('placement-grid')!.isEnabled()).toBe(false);
 const changed=structuredClone(saved);changed.furniture.find(f=>f.id==='fela-lamp')!.x=-1;
 game.syncState(changed);expect(game.scene).toBe(home);expect(game.camera.position.y).toBeLessThan(5);
 expect(home.getTransformNodeByName('fela-lamp')!.position.x).toBe(-1);
 expect(home.getTransformNodeByName('fela-letter')!.isEnabled()).toBe(true);
 expect(home.getTransformNodeByName('crate')!.isEnabled()).toBe(true);
 game.editHome(true);expect(game.camera.position.y).toBe(13);game.editHome(false);
 expect(game.snapshot().camera).toEqual(saved.camera);
});

it('goście mają osobne modele we wnętrzu i nie przenoszą mieszkańców z wioski',()=>{
 const outside=newSave();const {game}=start(outside),villagers=game.world.npcs;
 const before=villagers.map(n=>n.character.root.position.asArray());
 const inside={...outside,location:'home' as const,player:{x:0,z:-2.5,heading:0},flags:{hosting:true}};
 game.syncState(inside);const guests=game.world.npcs;
 for(const [i,npc] of guests.entries()){expect(npc.character.root).not.toBe(villagers[i].character.root);expect(npc.character.root.isEnabled()).toBe(true);expect(npc.character.root.getScene()).toBe(game.scene)}
 expect(villagers.map(n=>n.character.root.position.asArray())).toEqual(before);
 game.syncState({...inside,flags:{hosting:false}});expect(guests.every(n=>!n.character.root.isEnabled())).toBe(true);
 game.syncState(outside);expect(game.world.npcs).toBe(villagers);expect(villagers.every(n=>n.character.root.isEnabled())).toBe(true);
});


it('minimapa śledzi ruch przed autozapisem i natychmiast otrzymuje pozycję po przejściu drzwiami',()=>{
 const saved=newSave(),{game,onMapPose,onSave}=start(saved);
 expect(onMapPose).toHaveBeenLastCalledWith(saved.player);
 key('ArrowUp');key('ArrowRight');frames(32);key('ArrowUp',false);key('ArrowRight',false);
 const shown=onMapPose.mock.lastCall![0],actual=game.snapshot().player;
 expect(shown.x).toBeGreaterThan(saved.player.x);expect(shown.z).toBeGreaterThan(saved.player.z);expect(shown.heading).toBeGreaterThan(0);
 expect(Math.hypot(shown.x-actual.x,shown.z-actual.z)).toBeLessThan(.35);
 expect(onSave).not.toHaveBeenCalled();expect(onMapPose.mock.calls.length).toBeLessThan(10);
 shown.x=999;expect(game.snapshot().player.x).not.toBe(999);
 const inside={...saved,location:'home' as const,player:{x:0,z:-2.5,heading:0}};game.syncState(inside);
 expect(onMapPose).toHaveBeenLastCalledWith(inside.player);
 const outside={...saved,player:{x:18,z:4.2,heading:Math.PI}};game.syncState(outside);
 expect(onMapPose).toHaveBeenLastCalledWith(outside.player);
 game.dispose();expect(loop.frame).toBeNull();
});
