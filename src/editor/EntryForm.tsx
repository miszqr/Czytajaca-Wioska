import type {ContentPack,StoryNode,StoryScene,StoryDocument,InteractionDefinition} from '../content/types';
import {BoolField,NumberField,Rules,SelectField,TextField} from './Fields';
export type Section='nodes'|'scenes'|'documents'|'interactions';
export type Entry=StoryNode|StoryScene|StoryDocument|InteractionDefinition;
export const SECTIONS:{id:Section;name:string}[]=[{id:'nodes',name:'Dialogi'},{id:'scenes',name:'Etapy i cele'},{id:'documents',name:'Listy'},{id:'interactions',name:'Interakcje'}];
export function entries(pack:ContentPack,section:Section):Entry[]{return section==='interactions'?pack.interactions:pack.story[section]}
export function EntryForm({entry,section,pack,onChange}:{entry:Entry;section:Section;pack:ContentPack;onChange:(v:Entry)=>void}){
 const patch=(p:object)=>onChange({...entry,...p});
 return <div className="se-form"><TextField label="ID" value={entry.id} onChange={id=>patch({id})}/>
 {'title' in entry&&<TextField label="Tytuł" value={entry.title} onChange={title=>patch({title})}/>}
 {'lines' in entry&&<TextField label="Tekst (każda linia to osobna wypowiedź)" value={entry.lines.join('\n')} multiline onChange={text=>patch({lines:text.split('\n')})}/>}
 {section==='nodes'&&(()=>{const n=entry as StoryNode;return <>
  <SelectField label="Zdarzenie" value={n.event} options={[{id:'interact',name:'Rozmowa / interakcja'},{id:'place',name:'Postawienie przedmiotu'}]} onChange={event=>patch({event})}/>
  <SelectField label="Cel" value={n.target} options={n.event==='place'?pack.items:[...pack.characters,...pack.interactions.map(i=>({id:i.id,name:i.label}))]} onChange={target=>patch({target})}/>
  {n.event==='place'&&<p>Zdarzenia postawienia uruchamiają istniejące mechaniki gry (obecnie lampa przy łóżku). Sam wpis nie tworzy nowej mechaniki.</p>}
  <TextField label="Mówiący (ID mieszkańca lub nazwa)" value={n.speaker} onChange={speaker=>patch({speaker})}/>
  <NumberField label="Priorytet (większy wygrywa)" value={n.priority} onChange={priority=>patch({priority})}/>
  <BoolField label="Tylko raz" value={n.once} onChange={once=>patch({once})}/>
  <Rules value={n.when} pack={pack} onChange={when=>patch({when})}/>
  <h3>Odpowiedzi</h3>{n.choices.map((c,i)=>{const change=(p:object)=>patch({choices:n.choices.map((v,j)=>j===i?{...v,...p}:v)});return <fieldset key={i}><legend>Odpowiedź {i+1}</legend><TextField label="ID odpowiedzi" value={c.id} onChange={id=>change({id})}/><TextField label="Tekst odpowiedzi" value={c.label} onChange={label=>change({label})}/><Rules effects pack={pack} value={c.effects} onChange={effects=>change({effects})}/><button onClick={()=>patch({choices:n.choices.filter((_,j)=>j!==i)})}>Usuń odpowiedź</button></fieldset>})}
  <button disabled={n.choices.length>=(n.event==='place'?1:4)} onClick={()=>{let i=1;while(n.choices.some(c=>c.id===`odpowiedz-${i}`))i++;patch({choices:[...n.choices,{id:`odpowiedz-${i}`,label:'Dobrze.',effects:[]}]})}}>+ Odpowiedź</button>
 </>})()}
 {section==='scenes'&&(()=>{const s=entry as StoryScene;return <><TextField label="Cel w dzienniku" value={s.objective} multiline onChange={objective=>patch({objective})}/><Rules pack={pack} value={s.when} onChange={when=>patch({when})}/><h3>Warianty celu (pierwszy pasujący wygrywa)</h3>{s.updates?.map((u,i)=><fieldset key={i}><TextField label="Zmieniony cel" value={u.objective} multiline onChange={objective=>patch({updates:s.updates!.map((v,j)=>i===j?{...v,objective}:v)})}/><Rules pack={pack} value={u.when} onChange={when=>patch({updates:s.updates!.map((v,j)=>i===j?{...v,when}:v)})}/><button onClick={()=>patch({updates:s.updates!.filter((_,j)=>j!==i)})}>Usuń wariant</button></fieldset>)}<button onClick={()=>patch({updates:[...(s.updates??[]),{objective:'Nowy cel.',when:[]}]})}>+ Wariant celu</button></>})()}
 {section==='interactions'&&(()=>{const t=entry as InteractionDefinition;return <><TextField label="Etykieta w świecie" value={t.label} onChange={label=>patch({label})}/><SelectField label="Miejsce" value={t.location} options={[{id:'home',name:'Dom'},{id:'village',name:'Wioska'}]} onChange={location=>patch({location})}/><SelectField label="Model" value={t.model} options={['none','letter','crate','sign','cabinet','garden','bell'].map(id=>({id,name:id}))} onChange={model=>patch({model})}/><NumberField label="Pozycja X" value={t.position.x} onChange={x=>patch({position:{...t.position,x}})}/><NumberField label="Pozycja Z" value={t.position.z} onChange={z=>patch({position:{...t.position,z}})}/><Rules pack={pack} value={t.when} onChange={when=>patch({when})}/><p>Kotwicę względem mebla można zmienić w zakładce JSON.</p></>})()}
 </div>;
}
export function makeEntry(pack:ContentPack,section:Section,copy?:Entry):Entry{
 const list=entries(pack,section);let i=1;const prefix=copy?copy.id.slice(0,48)+'-kopia':'nowy-'+section;while(list.some(x=>x.id===`${prefix}-${i}`))i++;
 const id=`${prefix}-${i}`;
 if(copy){const result={...structuredClone(copy),id};if('priority' in result)result.priority=Math.min(999,Math.max(-1,...pack.story.nodes.filter(n=>n.target===result.target&&n.event===result.event).map(n=>n.priority))+1);return result}
 switch(section){
 case 'nodes':return {id,event:'interact',target:pack.characters[0].id,speaker:pack.characters[0].id,priority:Math.min(999,Math.max(-1,...pack.story.nodes.filter(n=>n.target===pack.characters[0].id&&n.event==='interact').map(n=>n.priority))+1),once:false,when:[],lines:['Cześć, Kitku!'],choices:[{id:'dalej',label:'Do zobaczenia.',effects:[]}]};
 case 'scenes':return {id,title:'Nowy etap',objective:'Odwiedzę sąsiadów.',when:[]};
 case 'documents':return {id,title:'Nowy list',lines:['Cześć, Kitku!']};
 case 'interactions':return {id,label:'Nowy przedmiot',location:'village',model:'sign',position:{x:0,z:0},when:[]};
 }
}
