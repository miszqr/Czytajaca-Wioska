import {memo,useEffect,useId,useRef,useState} from 'react';
import type {PlayerPose} from '../persistence/state';
import {POND,shoreRadius} from '../game/island-terrain';
import {COTTAGES,FELA_HOUSE,TOLA_LIBRARY,VILLAGE_PATHS} from '../game/village-layout';

// World +Z points up on a fixed map. Positive headings turn clockwise.
export function mapPose(player:PlayerPose){return {x:player.x,y:-player.z,rotation:player.heading*180/Math.PI}}
const coast=Array.from({length:128},(_,i)=>{
 const angle=i*Math.PI*2/128,r=shoreRadius(angle);
 return `${i?'L':'M'}${(Math.cos(angle)*r).toFixed(3)},${(-Math.sin(angle)*r).toFixed(3)}`;
}).join(' ')+' Z';
const paths=VILLAGE_PATHS.map(({points,width})=>({width,d:`M${points[0][0]},${-points[0][1]} C${points.slice(1).map(([x,z])=>`${x},${-z}`).join(' ')}`}));
const homes=[
 {...COTTAGES.kitek,color:'#77A8C6'},
 {...COTTAGES.bruno,color:'#708863'},
 {...COTTAGES.milus,color:'#AE7765'},
 {...FELA_HOUSE,color:'#C88961'},
 {...TOLA_LIBRARY,color:'#78918A'},
];
const MapLandscape=memo(function MapLandscape(){return <>
 <rect className="minimap-sea" x="-52" y="-52" width="104" height="104" rx="10"/>
 <path className="minimap-land" d={coast} strokeWidth="3"/>
 <g fill="none" stroke="#ead5a5" strokeLinecap="round">{paths.map(({d,width},i)=><path key={i} d={d} strokeWidth={width}/>)}</g>
 <circle cx="0" cy="0" r="4.3" fill="#ead5a5"/>
 <ellipse className="minimap-pond" cx={POND.x} cy={-POND.z} rx={POND.radiusX} ry={POND.radiusZ} strokeWidth="1.2"/>
 {homes.map(home=><g key={home.name} transform={`translate(${home.x},${-home.z})`}>
  <title>{home.name}</title>
  <path d="M-3.2,0 V3 H3.2 V0" fill="#fff5d9" stroke="#4d654d" strokeWidth=".8" strokeLinejoin="round"/>
  <path d="M-4,0 L0,-3.7 L4,0 Z" fill={home.color} stroke="#4d654d" strokeWidth=".8" strokeLinejoin="round"/>
  <path d="M-.9,3 V.9 H.9 V3" fill="#4d654d"/>
 </g>)}
 </>});

export function MiniMap({player,night=false}:{player:PlayerPose;night?:boolean}){
 const [expanded,setExpanded]=useState(false),root=useRef<HTMLElement>(null),toggle=useRef<HTMLButtonElement>(null),mapId=useId();
 useEffect(()=>{
  if(!expanded)return;
  const outside=(event:PointerEvent)=>{if(event.target instanceof Node&&!root.current?.contains(event.target))setExpanded(false)};
  document.addEventListener('pointerdown',outside);
  return()=>document.removeEventListener('pointerdown',outside);
 },[expanded]);
 const {x,y,rotation}=mapPose(player);
 return <aside ref={root} className={'minimap'+(night?' minimap-night':'')+(expanded?' expanded':'')} aria-label="Minimapa wioski"
  onKeyDown={event=>{if(event.key==='Escape'&&expanded){event.preventDefault();event.stopPropagation();setExpanded(false);toggle.current?.focus()}else if(event.key===' '||event.key==='Enter')event.stopPropagation()}}>
  <button ref={toggle} type="button" className="icon-button minimap-toggle" aria-label={expanded?'Schowaj mapę':'Pokaż mapę'} aria-expanded={expanded} aria-controls={mapId} onClick={()=>setExpanded(value=>!value)}>
   <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {expanded?<path d="m6 6 12 12M6 18 18 6"/>:<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3ZM9 3v15M15 6v15"/>}
   </svg>
  </button>
  <div className="minimap-content" id={mapId}>
  <div className="minimap-heading"><strong>Mapka</strong><span><i aria-hidden="true"/>Kitek</span></div>
  <svg viewBox="-52 -52 104 104" role="img" aria-label="Mapa wyspy: domki, ścieżki i staw. Pomarańczowa strzałka pokazuje pozycję i kierunek Kitka.">
   <MapLandscape/>
   <g className="minimap-player" transform={`translate(${x},${y}) rotate(${rotation})`}>
    <circle r="4.5" fill="#fff9e9" fillOpacity=".9"/>
    <path d="M0,-4 L3,3 L0,1.7 L-3,3 Z" fill="#e57840" stroke="#663d2d" strokeWidth=".8" strokeLinejoin="round"/>
   </g>
  </svg>
  </div>
 </aside>;
}
