import {useRef,useState} from 'react';
import type {PointerEvent} from 'react';
import {Icon} from './Icons';
export function TouchControls({move,run,interact,near}:{move:(x:number,y:number)=>void;run:(value:boolean)=>void;interact:()=>void;near:boolean}){
 const id=useRef<number|null>(null),[knob,setKnob]=useState({x:0,y:0}),[running,setRunning]=useState(false);
 function update(e:PointerEvent<HTMLDivElement>){const rect=e.currentTarget.getBoundingClientRect(),x=(e.clientX-rect.left-rect.width/2)/42,y=(e.clientY-rect.top-rect.height/2)/42,length=Math.max(1,Math.hypot(x,y));setKnob({x:x/length*38,y:y/length*38});move(x/length,-y/length)}
 function release(){id.current=null;setKnob({x:0,y:0});move(0,0)}
 return <div className="touch-controls"><div className="joystick" role="group" aria-label="Joystick chodzenia" onPointerDown={e=>{id.current=e.pointerId;e.currentTarget.setPointerCapture(e.pointerId);update(e)}} onPointerMove={e=>{if(id.current===e.pointerId)update(e)}} onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release}><span className="joystick-ring"/><span className="joystick-knob" style={{transform:`translate(${knob.x}px,${knob.y}px)`}}><Icon name="paw" size={30}/></span></div><div className="touch-right"><button className={'round-control run-control '+(running?'selected':'')} aria-pressed={running} aria-label="Włącz lub wyłącz bieg" onClick={()=>{setRunning(!running);run(!running)}}>Bieg</button><button className="talk-touch" disabled={!near} onClick={interact}><Icon name="chat" size={26}/><span>Rozmowa</span></button></div></div>;
}
