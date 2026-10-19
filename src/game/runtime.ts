import {Engine,Scene,FreeCamera,Vector3,Matrix,Viewport,Ray} from './babylon';
import {createVillage} from './world';
import {CONFIG} from './config';
import {movementVector,moveWithSlide,blocked,terrainHeight,turnTowards} from './movement';
import {Input,type Action} from './input';
import type {SaveState,PlayerPose,CameraPose} from '../persistence/state';
export type WorldSnapshot={player:PlayerPose;camera:CameraPose};
export type NearInfo={near:boolean;distance:number;x:number;y:number;visible:boolean};
export type RuntimeCallbacks={onReady:()=>void;onError:(error:unknown)=>void;onNear:(info:NearInfo)=>void;onSave:(snapshot:WorldSnapshot)=>void;onAction:(action:Action)=>void;onGamepad:(connected:boolean)=>void};
export class VillageGame {
  readonly engine:Engine;readonly scene:Scene;readonly world:ReturnType<typeof createVillage>;readonly camera:FreeCamera;
  private input=new Input();private pose:PlayerPose;private cameraPose:CameraPose;private paused=true;private disposed=false;
  private vx=0;private vz=0;private time=0;private saveTime=0;private infoTime=0;private celebrateUntil=0;private cameraLength:number;
  private pointer:{id:number;x:number;y:number}|null=null;private observer:ResizeObserver;private pad=false;
  private reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  constructor(private canvas:HTMLCanvasElement,state:SaveState,private callbacks:RuntimeCallbacks){
    try{this.engine=new Engine(canvas,true,{powerPreference:'low-power',preserveDrawingBuffer:false,stencil:true},false)}catch(e){this.input.dispose();throw e}
    this.engine.setHardwareScalingLevel(1/Math.min(window.devicePixelRatio||1,1.5));
    this.scene=new Scene(this.engine);this.world=createVillage(this.scene);
    this.camera=new FreeCamera('behind-kitek',new Vector3(0,2,-4),this.scene);this.camera.minZ=.08;this.camera.maxZ=160;this.camera.fov=.92;this.scene.activeCamera=this.camera;
    this.pose={...state.player};if(blocked(this.pose,this.world.solids))this.pose={...CONFIG.spawn};
    this.cameraPose={...state.camera};this.cameraLength=state.camera.distance;
    this.placePlayer();this.updateCamera(1);
    this.observer=new ResizeObserver(()=>this.engine.resize());this.observer.observe(canvas);this.engine.resize();
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
  private placePlayer(){this.world.kitek.root.position.set(this.pose.x,terrainHeight(this.pose.x,this.pose.z),this.pose.z);this.world.kitek.root.rotation.y=this.pose.heading}
  private updateCamera(dt:number){
    const {yaw,pitch,distance}=this.cameraPose,target=this.world.kitek.root.position.add(new Vector3(0,CONFIG.cameraTargetHeight,0));
    const direction=new Vector3(-Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),-Math.cos(yaw)*Math.cos(pitch));
    // Several rays reserve clearance around the camera, not only at its centre.
    let allowed=distance;
    for(const offset of [Vector3.Zero(),new Vector3(.16,0,0),new Vector3(-.16,0,0),new Vector3(0,.16,0)]){
      const hit=this.scene.pickWithRay(new Ray(target.add(offset),direction,distance),mesh=>mesh.metadata?.cameraObstacle===true);
      if(hit?.hit)allowed=Math.min(allowed,Math.max(.35,hit.distance-.25));
    }
    this.cameraLength=allowed<this.cameraLength?allowed:this.cameraLength+(allowed-this.cameraLength)*(1-Math.exp(-dt*9));
    this.camera.position.copyFrom(target.add(direction.scale(this.cameraLength)));
    this.camera.position.y=Math.max(this.camera.position.y,terrainHeight(this.camera.position.x,this.camera.position.z)+.24);
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
        this.cameraPose.yaw+=frame.lookX*dt*2.4;this.cameraPose.pitch=Math.max(CONFIG.cameraMinPitch,Math.min(CONFIG.cameraMaxPitch,this.cameraPose.pitch+frame.lookY*dt*1.5));
        const intent=movementVector(frame.horizontal,frame.forward,this.cameraPose.yaw),speed=frame.run?CONFIG.runSpeed:CONFIG.walkSpeed,factor=1-Math.exp(-dt*3/CONFIG.accelerationSeconds);
        this.vx+=(intent.x*speed-this.vx)*factor;this.vz+=(intent.z*speed-this.vz)*factor;
        const next=moveWithSlide(this.pose,{x:this.vx*dt,z:this.vz*dt},this.world.solids),actualSpeed=Math.hypot(next.x-this.pose.x,next.z-this.pose.z)/dt;
        if(Math.hypot(intent.x,intent.z)>.05)this.pose.heading=turnTowards(this.pose.heading,Math.atan2(intent.x,intent.z),CONFIG.turnSpeed*dt);
        this.pose.x=next.x;this.pose.z=next.z;this.placePlayer();this.world.kitek.animate(this.time,actualSpeed,this.time<this.celebrateUntil,this.reduced.matches);this.updateCamera(dt);
        this.saveTime+=dt;if(this.saveTime>2){this.saveTime=0;this.flush()}
      }else this.world.kitek.animate(this.time,0,this.time<this.celebrateUntil,this.reduced.matches);
      this.world.bruno.animate(this.time+.5,0,false,this.reduced.matches);
      this.scene.render();
      this.infoTime+=dt;if(this.infoTime>.12){this.infoTime=0;const distance=this.distanceToBruno(),point=this.world.bruno.root.position.add(new Vector3(0,1.9,0));const p=Vector3.Project(point,Matrix.Identity(),this.camera.getTransformationMatrix(),new Viewport(0,0,this.canvas.clientWidth,this.canvas.clientHeight));this.callbacks.onNear({near:distance<=CONFIG.interactionRadius,distance,x:p.x,y:p.y,visible:p.z>0&&p.z<1&&p.x>0&&p.x<this.canvas.clientWidth&&p.y>0&&p.y<this.canvas.clientHeight})}
    }catch(error){this.engine.stopRenderLoop(this.frame);this.callbacks.onError(error)}
  };
  distanceToBruno(){return Math.hypot(this.pose.x-CONFIG.bruno.x,this.pose.z-CONFIG.bruno.z)}
  snapshot():WorldSnapshot{return {player:{...this.pose},camera:{...this.cameraPose}}}
  setPaused(value:boolean){this.paused=value;this.pointer=null;this.input.clear();this.vx=this.vz=0;if(value)this.world.kitek.root.setEnabled(true)}
  faceBruno(){if(this.distanceToBruno()>CONFIG.interactionRadius)return false;this.pose.heading=Math.atan2(CONFIG.bruno.x-this.pose.x,CONFIG.bruno.z-this.pose.z);this.placePlayer();this.world.bruno.root.rotation.y=Math.atan2(this.pose.x-CONFIG.bruno.x,this.pose.z-CONFIG.bruno.z);this.flush();return true}
  celebrate(){this.celebrateUntil=this.time+2.5}
  moveTouch(x:number,y:number){this.input.setTouch(x,y)}
  runTouch(value:boolean){this.input.setRun(value)}
  recenter(){this.cameraPose.yaw=this.pose.heading;this.cameraPose.pitch=.3;this.cameraPose.distance=CONFIG.cameraDistance}
  dispose(){
    if(this.disposed)return;this.flush();this.disposed=true;this.engine.stopRenderLoop(this.frame);this.input.dispose();this.observer.disconnect();
    this.canvas.removeEventListener('pointerdown',this.down);this.canvas.removeEventListener('pointermove',this.move);this.canvas.removeEventListener('pointerup',this.up);this.canvas.removeEventListener('pointercancel',this.up);this.canvas.removeEventListener('wheel',this.wheel);this.canvas.removeEventListener('contextmenu',this.context);this.canvas.removeEventListener('webglcontextlost',this.contextLost);
    window.removeEventListener('blur',this.blur);window.removeEventListener('pagehide',this.flush);document.removeEventListener('visibilitychange',this.visibility);this.scene.dispose();this.engine.dispose();
  }
}
