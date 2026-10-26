import {useEffect,useId,useRef,useState} from 'react';
import {Icon} from './Icons';

export function QuestHint({title,objective,onOpenJournal}:{title:string;objective:string;onOpenJournal:()=>void}){
 const [expanded,setExpanded]=useState(false),root=useRef<HTMLElement>(null),toggle=useRef<HTMLButtonElement>(null),detailsId=useId();
 useEffect(()=>{
  if(!expanded)return;
  const outside=(event:PointerEvent)=>{if(event.target instanceof Node&&!root.current?.contains(event.target))setExpanded(false)};
  document.addEventListener('pointerdown',outside);
  return()=>document.removeEventListener('pointerdown',outside);
 },[expanded]);
 return <aside ref={root} className={'quest-card'+(expanded?' expanded':'')} aria-label="Cel Kitka"
  onPointerEnter={event=>{if(event.pointerType==='mouse'||event.pointerType==='pen')setExpanded(true)}}
  onPointerLeave={event=>{if(event.pointerType!=='touch'&&!root.current?.querySelector(':focus-visible'))setExpanded(false)}}
  onFocus={event=>{if(event.target.matches(':focus-visible'))setExpanded(true)}}
  onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget))setExpanded(false)}}
  onKeyDown={event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();toggle.current?.focus();setExpanded(false)}else if(event.key===' '||event.key==='Enter')event.stopPropagation()}}
 >
  <button ref={toggle} className="quest-toggle" aria-label={expanded?'Zwiń cel':'Pokaż cel'} aria-expanded={expanded} aria-controls={detailsId} onClick={()=>setExpanded(value=>!value)}>
   <span className="quest-icon"><Icon name="book"/></span>
  </button>
  <div id={detailsId} className="quest-details" hidden={!expanded}>
   <span className="eyebrow">Dziennik Kitka</span><h2>{title}</h2><p>{objective}</p>
   <button className="text-button quest-journal-link" onClick={onOpenJournal}>Otwórz dziennik<Icon name="arrow" size={20}/></button>
  </div>
 </aside>;
}
