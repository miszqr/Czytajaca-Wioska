import {Engine,Vector3,Matrix,Viewport,Ray} from './babylon';
import {LocationScenes,type LocationScene} from './location-scenes';
import {CONFIG} from './config';
import {movementVector,moveWithSlide,blocked,terrainHeight,turnTowards} from './movement';
import type {ContentPack,StoryNode} from '../content/types';
import {targetPosition} from '../interactions/model';
import {homeSolids,guestPositions} from '../housing/model';
import {matches,findNode} from '../story/engine';
import {advanceNpc} from './npc';
import {Input,type Action} from './input';
import type {SaveState,PlayerPose,CameraPose} from '../persistence/state';
export type WorldSnapshot={player:PlayerPose;camera:CameraPose;location:SaveState['location']};
export type NearInfo={targetId:string|null;label:string;near:boolean;distance:number;x:number;y:number;visible:boolean};
export type RuntimeCallbacks={onReady:()=>void;onError:(error:unknown)=>void;onNear:(info:NearInfo)=>void;onSave:(snapshot:WorldSnapshot)=>void;onAction:(action:Action)=>void;onGamepad:(connected:boolean)=>void};
export class VillageGame {
  readonly engine:Engine;
  private locations:LocationScenes;private view:LocationScene;
  get scene(){return this.view.scene}
  get world(){return this.view.world}
  get camera(){return this.view.camera}
  private input=new Input();private pose:PlayerPose;private cameraPose:CameraPose;private paused=true;private disposed=false;
  private vx=0;private vz=0;private time=0;private saveTime=0;private infoTime=0;private celebrateUntil=0;private cameraLength:number;
  private pointer:{id:number;x:number;y:number}|null=null;private observer:ResizeObserver;private pad=false;
  private followHeading=false;private gesture:'idle'|'pick-up'|'give'='idle';private gestureUntil=0;private talkingNpc='';private editing=false;private guestSpots:Record<string,{x:number;z:number}>={};private guestKey='';private state:SaveState;
  private reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  constructor(private canvas:HTMLCanvasElement,state:SaveState,private callbacks:RuntimeCallbacks,private content:ContentPack){
    this.state=state;
    try{this.engine=new Engine(canvas,true,{powerPreference:'low-power',preserveDrawingBuffer:false,stencil:true},false)}catch(e){this.input.dispose();throw e}
    this.engine.setHardwareScalingLevel(1/Math.min(window.devicePixelRatio||1,1.5));
    this.locations=new LocationScenes(this.engine,content);
    try{this.view=this.locations.prepare(state)}catch(error){this.input.dispose();this.locations.dispose();this.engine.dispose();throw error}
    this.guestSpots=guestPositions(state,content);this.guestKey=JSON.stringify([state.flags.hosting,state.furniture]);
    this.syncActors();
    this.pose={...state.player};if(blocked(this.pose,this.solids))this.pose=state.location==='home'?{x:0,z:-2.5,heading:0}:{...CONFIG.spawn};
    this.cameraPose={...state.camera};this.cameraLength=state.camera.distance;
    this.placePlayer();this.updateCamera(1);
    this.observer=new ResizeObserver(()=>{this.engine.resize();if(this.editing)this.updateCamera(1)});this.observer.observe(canvas);this.engine.resize();
    canvas.addEventListener('pointerdown',this.down);canvas.addEventListener('pointermove',this.move);canvas.addEventListener('pointerup',this.up);canvas.addEventListener('pointercancel',this.up);canvas.addEventListener('wheel',this.wheel,{passive:false});canvas.addEventListener('contextmenu',this.context);canvas.addEventListener('webglcontextlost',this.contextLost);
    window.addEventListener('blur',this.blur);window.addEventListener('pagehide',this.flush);document.addEventListener('visibilitychange',this.visibility);
    this.engine.runRenderLoop(this.frame);
    this.scene.executeWhenReady(()=>{if(!this.disposed)this.callbacks.onReady()});
  }
  private context=(e:Event)=>e.preventDefault();
  private contextLost=(e:Event)=>{e.preventDefault();this.paused=true;this.flush();this.callbacks.onError(new Error('Utracono kontekst WebGL. Odśwież stronę, aby wrócić do zapisu.'))};
  private down=(e:PointerEvent)=>{if(this.paused||e.button>2)return;this.canvas.setPointerCapture(e.pointerId);this.pointer={id:e.pointerId,x:e.clientX,y:e.clientY}};
  private move=(e:PointerEvent)=>{if(!this.pointer||this.paused||e.pointerId!==this.pointer.id)return;this.cameraPose.yaw+=(e.clientX-this.pointer.x)*.005;this.cameraPose.pitch=Math.max(CONFIG.cameraMinPitch,Math.min(CONFIG.cameraMaxPitch,this.cameraPose.pitch+(e.clientY-this.pointer.y)*.004));this.pointer={id:e.pointerId,x:e.clientX,y:e.clientY}};
  private up=(e:PointerEvent)=>{if(this.pointer?.id===e.pointerId)this.pointer=null};
  private wheel=(e:WheelEvent)=>{e.preventDefault();if(!this.paused)this.cameraPose.distance=Math.max(CONFIG.cameraMinDistance,Math.min(CONFIG.cameraMaxDistance,this.cameraPose.distance+e.deltaY*.003))};
  private blur=()=>{this.pointer=null;this.input.clear();this.vx=this.vz=0;this.flush()};
  private visibility=()=>{if(document.hidden)this.blur()};
  private flush=()=>{if(!this.disposed)this.callbacks.onSave(this.snapshot())};
  private placePlayer(){this.world.kitek.root.position.set(this.pose.x,this.height(this.pose.x,this.pose.z),this.pose.z);this.world.kitek.root.rotation.y=this.pose.heading}
  private updateCamera(dt:number){
    if(this.editing){const mobile=this.canvas.clientWidth<700;this.camera.viewport=mobile?new Viewport(0,.48,1,.52):new Viewport(0,0,.65,1);this.camera.position.set(0,13,-.01);this.camera.setTarget(Vector3.Zero());this.world.kitek.root.setEnabled(true);return}
    this.camera.viewport=new Viewport(0,0,1,1);
    const {yaw,pitch,distance}=this.cameraPose,target=this.world.kitek.root.position.add(new Vector3(0,CONFIG.cameraTargetHeight,0));
    const direction=new Vector3(-Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),-Math.cos(yaw)*Math.cos(pitch));
    // Several rays reserve clearance around the camera, not only at its centre.
    let allowed=distance;
    for(const offset of [Vector3.Zero(),new Vector3(.16,0,0),new Vector3(-.16,0,0),new Vector3(0,.16,0)]){
      // A custom picking predicate replaces Babylon's default visibility checks.
      // Ignore hidden objects within the active scene, including disabled parents.
      const hit=this.scene.pickWithRay(new Ray(target.add(offset),direction,distance),mesh=>mesh.metadata?.cameraObstacle===true&&mesh.isEnabled()&&mesh.isVisible&&mesh.isPickable);
      if(hit?.hit)allowed=Math.min(allowed,Math.max(.35,hit.distance-.25));
    }
    this.cameraLength=allowed<this.cameraLength?allowed:this.cameraLength+(allowed-this.cameraLength)*(1-Math.exp(-dt*9));
    this.camera.position.copyFrom(target.add(direction.scale(this.cameraLength)));
    this.camera.position.y=Math.max(this.camera.position.y,this.height(this.camera.position.x,this.camera.position.z)+.24);
    this.camera.setTarget(target);this.camera.getViewMatrix(true);this.camera.getProjectionMatrix(true);
    // Avoid the inside of Kitek's head when an obstacle pushes the camera very close.
    this.world.kitek.root.setEnabled(this.cameraLength>.65);
  }
  private frame=()=>{
    if(this.disposed||document.hidden)return;
    try{
      const dt=Math.min(.05,this.engine.getDeltaTime()/1000||.016);this.time+=dt;const frame=this.input.poll();
      if(frame.gamepad!==this.pad){this.pad=frame.gamepad;this.callbacks.onGamepad(this.pad)}
      frame.actions.forEach(action=>this.callbacks.onAction(action));
      if(!this.paused){
        // Arrows steer the character. Camera-relative input must not inherit
        // auto-follow: a held sideways stick/key would otherwise spiral.
        if(frame.characterControls)this.followHeading=true;
        else if(Math.hypot(frame.horizontal,frame.forward)>.05)this.followHeading=false;
        if(this.pointer||frame.lookX!==0||frame.lookY!==0)this.followHeading=false;
        this.cameraPose.yaw+=frame.lookX*dt*2.4;this.cameraPose.pitch=Math.max(CONFIG.cameraMinPitch,Math.min(CONFIG.cameraMaxPitch,this.cameraPose.pitch+frame.lookY*dt*1.5));
        if(frame.characterControls){
          const turn=frame.turn*CONFIG.keyboardTurnSpeed*dt;
          this.pose.heading+=turn;
          // Keep an aligned camera directly behind during a turn. If it was
          // orbited manually, ease the remaining offset back afterwards.
          if(this.followHeading)this.cameraPose.yaw+=turn;
        }
        const intent=frame.characterControls?movementVector(0,frame.characterForward,this.pose.heading):movementVector(frame.horizontal,frame.forward,this.cameraPose.yaw),speed=frame.run?CONFIG.runSpeed:CONFIG.walkSpeed,factor=1-Math.exp(-dt*3/CONFIG.accelerationSeconds);
        this.vx+=(intent.x*speed-this.vx)*factor;this.vz+=(intent.z*speed-this.vz)*factor;
        const next=moveWithSlide(this.pose,{x:this.vx*dt,z:this.vz*dt},this.solids),actualSpeed=Math.hypot(next.x-this.pose.x,next.z-this.pose.z)/dt;
        if(!frame.characterControls&&Math.hypot(intent.x,intent.z)>.05)this.pose.heading=turnTowards(this.pose.heading,Math.atan2(intent.x,intent.z),CONFIG.turnSpeed*dt);
        if(this.followHeading){
          const offset=Math.atan2(Math.sin(this.pose.heading-this.cameraPose.yaw),Math.cos(this.pose.heading-this.cameraPose.yaw));
          this.cameraPose.yaw+=offset*(1-Math.exp(-CONFIG.cameraFollowSpeed*dt));
        }
        this.pose.x=next.x;this.pose.z=next.z;this.placePlayer();this.world.kitek.animate(this.time,actualSpeed,this.time<this.celebrateUntil,this.reduced.matches,this.time<this.gestureUntil?this.gesture:'idle');this.updateCamera(dt);
        this.saveTime+=dt;if(this.saveTime>2){this.saveTime=0;this.flush()}
      }else this.world.kitek.animate(this.time,0,this.time<this.celebrateUntil,this.reduced.matches,this.time<this.gestureUntil?this.gesture:'idle');
      for(const npc of this.world.npcs){
        if(!npc.character.root.isEnabled())continue;
        if(this.state.location==='home'){const pos=this.guestPosition(npc.definition.id);npc.character.root.position.set(pos.x,0,pos.z);npc.character.animate(this.time+.5,0,false,this.reduced.matches,this.paused&&this.talkingNpc===npc.definition.id?'talk':'idle');continue;}
        const others=this.world.solids.filter(s=>s!==npc.solid);
        const {motion,speed}=advanceNpc(npc.motion,npc.definition.behavior,dt,others,this.pose,this.paused);
        npc.motion=motion;npc.solid.x=motion.x;npc.solid.z=motion.z;
        npc.character.root.position.set(motion.x,terrainHeight(motion.x,motion.z),motion.z);npc.character.root.rotation.y=motion.heading;
        npc.character.animate(this.time+.5,speed,false,this.reduced.matches,this.paused&&this.talkingNpc===npc.definition.id?'talk':'idle');
      }
      // Twilight also progresses while the menu is open and movement is paused.
      this.world.updateEnvironment?.(dt,this.reduced.matches);
      this.scene.render();
      this.infoTime+=dt;if(this.infoTime>.12){
        this.infoTime=0;const target=this.nearestTarget();
        if(target){const distance=Math.hypot(this.pose.x-target.x,this.pose.z-target.z),point=new Vector3(target.x,this.height(target.x,target.z)+1.7,target.z),p=Vector3.Project(point,Matrix.Identity(),this.camera.getTransformationMatrix(),new Viewport(0,0,this.canvas.clientWidth,this.canvas.clientHeight));this.callbacks.onNear({targetId:target.id,label:target.label,near:distance<=CONFIG.interactionRadius,distance,x:p.x,y:p.y,visible:p.z>0&&p.z<1&&p.x>0&&p.x<this.canvas.clientWidth&&p.y>0&&p.y<this.canvas.clientHeight})}
        else this.callbacks.onNear({targetId:null,label:'',near:false,distance:99,x:0,y:0,visible:false});
      }
    }catch(error){this.engine.stopRenderLoop(this.frame);this.callbacks.onError(error)}
  };
  private guestPosition(id:string){return this.guestSpots[id]??{x:0,z:0}}
  private get solids(){return this.state.location==='home'?[...homeSolids(this.state,this.content),...(this.state.flags.hosting?this.world.npcs.filter(n=>this.guestSpots[n.definition.id]).map(n=>({id:n.definition.id,type:'circle' as const,...this.guestPosition(n.definition.id),radius:.42})):[])]:this.world.solids}
  private height(x:number,z:number){return this.state.location==='home'?0:terrainHeight(x,z)}
  private targets(){return [
    ...(this.state.location==='village'||this.state.flags.hosting?this.world.npcs.filter(n=>this.state.location==='village'||this.guestSpots[n.definition.id]).map(n=>({id:n.definition.id,label:n.definition.name,...(this.state.location==='home'?this.guestPosition(n.definition.id):{x:n.motion.x,z:n.motion.z})})):[]),
    ...this.content.interactions.filter(t=>t.location===this.state.location&&matches(this.state,t.when)).flatMap(t=>{const pos=targetPosition(t,this.state);return pos?[{id:t.id,label:t.label,...pos}]:[]})
  ].filter(t=>findNode(this.content,this.state,t.id))}
  nearestTarget(){return this.targets().sort((a,b)=>Math.hypot(this.pose.x-a.x,this.pose.z-a.z)-Math.hypot(this.pose.x-b.x,this.pose.z-b.z))[0]}
  snapshot():WorldSnapshot{return {player:{...this.pose},camera:{...this.cameraPose},location:this.state.location}}
  private syncActors(){
    for(const npc of this.world.npcs){
      const visible=this.state.location==='village'||!!this.state.flags.hosting&&!!this.guestSpots[npc.definition.id];
      npc.character.root.setEnabled(visible);
      if(this.state.location==='home'){const pos=this.guestPosition(npc.definition.id);npc.character.root.position.set(pos.x,0,pos.z)}
    }
  }
  syncState(state:SaveState){
    if(this.disposed)return;
    const travel=state.location!==this.state.location,nextView=this.locations.prepare(state);
    if(travel){
      this.view.story.preview(null);this.view.story.setEditing(false);this.editing=false;
      this.input.clear();this.pointer=null;this.vx=this.vz=0;this.followHeading=false;this.talkingNpc='';
    }
    this.state=state;this.view=nextView;
    const guestKey=JSON.stringify([state.flags.hosting,state.furniture]);
    if(guestKey!==this.guestKey){this.guestKey=guestKey;this.guestSpots=guestPositions(state,this.content)}
    this.syncActors();
    if(travel){
      this.pose={...state.player};this.cameraPose={...state.camera};this.cameraLength=this.cameraPose.distance;
      this.placePlayer();this.updateCamera(1);this.infoTime=1;
      this.callbacks.onNear({targetId:null,label:'',near:false,distance:99,x:0,y:0,visible:false});
    }
  }
  previewFurniture(f:import('../content/types').Furniture|null,valid=true){this.view.story.preview(f,valid)}
  editHome(active:boolean){this.editing=active&&this.state.location==='home';this.view.story.setEditing(this.editing);this.updateCamera(1)}
  setPaused(value:boolean){this.paused=value;if(!value)this.talkingNpc='';this.pointer=null;this.followHeading=false;this.input.clear();this.vx=this.vz=0;if(value)this.world.kitek.root.setEnabled(true)}
  faceTarget(id:string){const target=this.targets().find(t=>t.id===id);if(!target||Math.hypot(this.pose.x-target.x,this.pose.z-target.z)>CONFIG.interactionRadius)return false;this.pose.heading=Math.atan2(target.x-this.pose.x,target.z-this.pose.z);this.placePlayer();const npc=this.world.npcs.find(n=>n.definition.id===id);if(npc){this.talkingNpc=id;npc.motion.heading=Math.atan2(this.pose.x-target.x,this.pose.z-target.z);npc.character.root.rotation.y=npc.motion.heading}this.flush();return true}

  playStoryAction(node:StoryNode,choiceId:string){const effects=node.choices.find(c=>c.id===choiceId)?.effects??[];if(effects.some(e=>e.type==='giveItem'||e.type==='takeItem')){this.gesture=effects.some(e=>e.type==='takeItem')?'give':'pick-up';this.gestureUntil=this.time+1.2}if(effects.some(e=>e.type==='flag'&&e.key==='story-complete'))this.celebrate()}
  celebrate(){this.celebrateUntil=this.time+2.5}
  moveTouch(x:number,y:number){this.input.setTouch(x,y)}
  runTouch(value:boolean){this.input.setRun(value)}
  setCameraDistance(distance:number){
    if(!Number.isFinite(distance))return;
    this.cameraPose.distance=Math.max(CONFIG.cameraMinDistance,Math.min(CONFIG.cameraMaxDistance,distance));
    // Update even while the menu pauses movement; save the requested distance,
    // not the temporary shorter distance imposed by walls or trees.
    this.updateCamera(1);this.flush();
  }
  recenter(){this.cameraPose.yaw=this.pose.heading;this.cameraPose.pitch=.3;this.updateCamera(1);this.flush()}
  dispose(){
    if(this.disposed)return;this.flush();this.disposed=true;this.engine.stopRenderLoop(this.frame);this.input.dispose();this.observer.disconnect();
    this.canvas.removeEventListener('pointerdown',this.down);this.canvas.removeEventListener('pointermove',this.move);this.canvas.removeEventListener('pointerup',this.up);this.canvas.removeEventListener('pointercancel',this.up);this.canvas.removeEventListener('wheel',this.wheel);this.canvas.removeEventListener('contextmenu',this.context);this.canvas.removeEventListener('webglcontextlost',this.contextLost);
    window.removeEventListener('blur',this.blur);window.removeEventListener('pagehide',this.flush);document.removeEventListener('visibilitychange',this.visibility);this.locations.dispose();this.engine.dispose();
  }
}
