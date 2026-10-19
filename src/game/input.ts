import {deadzone} from './movement';
export type Action='confirm'|'back'|'menu'|'left'|'right'|'up'|'down'|'listen'|'hint';
export type InputFrame={horizontal:number;forward:number;turn:number;characterForward:number;characterControls:boolean;lookX:number;lookY:number;run:boolean;actions:Action[];gamepad:boolean};
export class Input {
  private keys=new Set<string>();private actions:Action[]=[];private previous=new Set<string>();private touch={x:0,y:0};private runTouch=false;
  private keydown=(e:KeyboardEvent)=>{
    if(e.target instanceof HTMLElement&&e.target.closest('input,textarea,select'))return;
    if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();
    this.keys.add(e.code);
    if(!e.repeat){if(e.code==='KeyE')this.actions.push('confirm');if(e.code==='Escape')this.actions.push('back');if(e.code==='KeyM')this.actions.push('menu');const direction=({ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down'} as const)[e.code as 'ArrowLeft'];if(direction)this.actions.push(direction)}
  };
  private keyup=(e:KeyboardEvent)=>this.keys.delete(e.code);
  private blur=()=>this.clear();
  constructor(){window.addEventListener('keydown',this.keydown);window.addEventListener('keyup',this.keyup);window.addEventListener('blur',this.blur)}
  clear(){this.keys.clear();this.touch={x:0,y:0};this.runTouch=false;this.actions=[]}
  setTouch(x:number,y:number){this.touch={x,y}}
  setRun(value:boolean){this.runTouch=value}
  poll():InputFrame{
    const keys=this.keys,actions=this.actions.splice(0),pad=Array.from(navigator.getGamepads?.()||[]).find(p=>p?.connected),pressed=new Set<string>();
    function edge(id:string,down:boolean,action:Action,previous:Set<string>){if(down){pressed.add(id);if(!previous.has(id))actions.push(action)}}
    if(pad){
      const p=(i:number)=>!!pad.buttons[i]?.pressed;
      for(const [i,action] of [[0,'confirm'],[1,'back'],[2,'listen'],[3,'hint'],[9,'menu'],[12,'up'],[13,'down'],[14,'left'],[15,'right']] as const)edge('b'+i,p(i),action,this.previous);
      edge('left',(pad.axes[0]||0)<-.65,'left',this.previous);edge('right',(pad.axes[0]||0)>.65,'right',this.previous);
      edge('up',(pad.axes[1]||0)<-.65,'up',this.previous);edge('down',(pad.axes[1]||0)>.65,'down',this.previous);
    }
    this.previous=pressed;
    return {
      horizontal:Number(keys.has('KeyD'))-Number(keys.has('KeyA'))+this.touch.x+deadzone(pad?.axes[0]||0),
      forward:Number(keys.has('KeyW'))-Number(keys.has('KeyS'))+this.touch.y-deadzone(pad?.axes[1]||0),
      turn:Number(keys.has('ArrowRight'))-Number(keys.has('ArrowLeft')),
      characterForward:Number(keys.has('ArrowUp'))-Number(keys.has('ArrowDown')),
      characterControls:['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].some(key=>keys.has(key)),
      lookX:deadzone(pad?.axes[2]||0),lookY:deadzone(pad?.axes[3]||0),
      run:keys.has('ShiftLeft')||keys.has('ShiftRight')||this.runTouch||!!pad?.buttons[7]?.pressed||!!pad?.buttons[10]?.pressed,actions,gamepad:!!pad,
    };
  }
  dispose(){window.removeEventListener('keydown',this.keydown);window.removeEventListener('keyup',this.keyup);window.removeEventListener('blur',this.blur)}
}
