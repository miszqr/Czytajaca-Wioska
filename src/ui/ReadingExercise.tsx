import {useState} from 'react';
import type {Exercise} from '../reading/model';
export function ReadingExercise({exercise,onAnswer}:{exercise:Exercise;onAnswer:(answer:string|readonly number[])=>void}){
 const [selected,setSelected]=useState<number[]>([]);
 const build=exercise.type==='syllable-build',slots=build?exercise.targetParts.length:0;
 return <>
  <p className="reading-prompt">{exercise.prompt}</p>
  {build&&<div className="word-slots" aria-label="Ułożone sylaby" aria-live="polite">{Array.from({length:slots},(_,i)=><span className={selected[i]===undefined?'empty':''} key={i}>{selected[i]===undefined?'…':exercise.choices[selected[i]]}</span>)}</div>}
  <div className="choices" style={{gridTemplateColumns:`repeat(${Math.min(3,exercise.choices.length)},minmax(0,1fr))`}}>{exercise.choices.map((choice,i)=><button className="syllable" key={i} disabled={build&&(selected.includes(i)||selected.length>=slots)} onClick={()=>build?setSelected(s=>[...s,i]):onAnswer(choice)}>{choice}</button>)}</div>
  {build&&<div className="build-tools"><button className="secondary" disabled={!selected.length} onClick={()=>setSelected(s=>s.slice(0,-1))}>Cofnij sylabę</button><button className="secondary" disabled={!selected.length} onClick={()=>setSelected([])}>Od nowa</button><button className="primary" disabled={selected.length!==slots} onClick={()=>onAnswer(selected)}>Sprawdź</button></div>}
 </>;
}
