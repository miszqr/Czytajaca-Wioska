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
import {newSave} from '../src/persistence/state';
import type {SaveState} from '../src/persistence/state';
import {Input as KeyboardInput} from '../src/game/input';

let game:VillageGame|undefined,input:Input|undefined;
const errors=vi.fn();
function key(code:string,down=true){window.dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code,cancelable:true}))}
function frames(count=1){for(let i=0;i<count;i++)loop.frame!();expect(errors).not.toHaveBeenCalled()}
function start(state:SaveState=newSave()){
  const canvas=document.createElement('canvas');canvas.width=800;canvas.height=600;
  canvas.setPointerCapture=vi.fn();
  game=new VillageGame(canvas,state,{onReady:vi.fn(),onError:errors,onNear:vi.fn(),onSave:vi.fn(),onAction:vi.fn(),onGamepad:vi.fn()},DEFAULT_CONTENT);
  // Exercise the real input, frame loop, collision rays and camera transforms;
  // only GPU rendering is skipped in this deterministic control test.
  vi.spyOn(game.scene,'render').mockImplementation(()=>{});
  game.setPaused(false);
  return {game,canvas};
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
