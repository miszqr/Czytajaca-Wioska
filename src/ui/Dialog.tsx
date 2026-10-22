import {useEffect,useRef} from 'react';
import type {ReactNode} from 'react';
export function Dialog({children,label,onBack,wide=false,className=''}:{children:ReactNode;label:string;onBack:()=>void;wide?:boolean;className?:string}){
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{const old=document.activeElement as HTMLElement;const first=ref.current?.querySelector<HTMLElement>('[data-dialog-autofocus]')??ref.current?.querySelector<HTMLElement>('.primary:not([disabled])');first?.focus();return()=>old?.focus()},[label]);
 return <div className="scrim"><section ref={ref} className={['dialog',wide?'wide':'',className].filter(Boolean).join(' ')} role="dialog" aria-modal="true" aria-label={label} onKeyDown={e=>{
   if(e.key==='Escape'){e.preventDefault();e.stopPropagation();onBack()}
   if(e.key==='Tab'){const nodes=Array.from(ref.current!.querySelectorAll<HTMLElement>('button:not([disabled]),input:not([disabled]),a[href]')),i=nodes.indexOf(document.activeElement as HTMLElement);if(e.shiftKey&&i<=0){e.preventDefault();nodes.at(-1)?.focus()}else if(!e.shiftKey&&i===nodes.length-1){e.preventDefault();nodes[0]?.focus()}}
 }}>{children}</section></div>;
}
