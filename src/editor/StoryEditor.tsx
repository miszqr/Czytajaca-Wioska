import {useEffect,useMemo,useRef,useState} from 'react';
import type {ContentPack,StoryNode} from '../content/types';
import {newSave,validateSave,type SaveState} from '../persistence/state';
import {prepareStorage} from '../housing/model';
import {choose,currentScene} from '../story/engine';
import {BoolField,NumberField,SelectField,TextField} from './Fields';
import {entries,EntryForm,makeEntry,SECTIONS,type Entry,type Section} from './EntryForm';
import {DRAFT_KEY,FILES,diffLines,diagnoseNodes,draftSnapshot,exportedFiles,importDraft,json,parseDraft,restoreDraft,stateChanges,toDraft,type ContentFile,type Draft} from './model';
import './editor.css';
import GraphEditor from './GraphEditor';
import type {Graph} from './graph';

type Props={base:ContentPack;state:SaveState;open:boolean;onClose:()=>void;onApply:(pack:ContentPack,state:SaveState)=>void;onGraphTest:(g:Graph,state:SaveState)=>void;onRestore:()=>void};
function download(name:string,text:string){const url=URL.createObjectURL(new Blob([text],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function readLocal(base:ContentPack){try{return restoreDraft(base,localStorage.getItem(DRAFT_KEY))}catch{return {draft:toDraft(base),warning:'Pamięć przeglądarki jest niedostępna. Pobieraj kopie szkicu.'}}}
export default function StoryEditor({base,state,open,onClose,onApply,onGraphTest,onRestore}:Props){
 const [view,setView]=useState<'graph'|'forms'>('graph');
 const [initial]=useState(()=>readLocal(base)),[draft,setDraft]=useState<Draft>(initial.draft),[dirty,setDirty]=useState(false),[notice,setNotice]=useState(initial.warning),[saveStatus,setSaveStatus]=useState('Szkic lokalny');
 const [section,setSection]=useState<Section>('nodes'),[index,setIndex]=useState(0),[search,setSearch]=useState(''),[tab,setTab]=useState<'form'|'json'|'export'>('form'),[file,setFile]=useState<ContentFile>('story');
 const [testState,setTestState]=useState(()=>structuredClone(state)),[stateJson,setStateJson]=useState(''),[log,setLog]=useState<string[]>([]),[undo,setUndo]=useState<Draft[]>([]),[redo,setRedo]=useState<Draft[]>([]);
 const panel=useRef<HTMLDivElement>(null),wasOpen=useRef(false);
 const parsed=useMemo(()=>{try{return {pack:parseDraft(draft),error:''}}catch(e){return {pack:null,error:e instanceof Error?e.message:String(e)}}},[draft]);
 // Keep the form editable while temporarily invalid (empty labels, broken references).
 const formPack=useMemo(()=>{try{const p=Object.fromEntries(FILES.map(k=>[k,JSON.parse(draft[k])])) as ContentPack;return p}catch{return null}},[draft]);
 const [formSafe,setFormSafe]=useState(()=>{try{parseDraft(initial.draft);return true}catch{return false}});
 const pack=parsed.pack??base;
 const list=formPack&&formSafe?entries(formPack,section):[];
 const selected=list[index];
 const flagNames=useMemo(()=>Array.from(new Set([...Object.keys(testState.flags),...pack.story.nodes.flatMap(n=>[...n.when.filter(c=>c.type==='flag').map(c=>c.key),...n.choices.flatMap(c=>c.effects.filter(e=>e.type==='flag').map(e=>e.key))])])).sort(),[pack,testState.flags]);
 const node=section==='nodes'?selected as StoryNode|undefined:undefined;
 const diagnoses=node&&parsed.pack?diagnoseNodes(parsed.pack,testState,node.target,node.event):[];
 const chosen=diagnoses.find(d=>d.selected)?.node;
 const changes=parsed.pack?exportedFiles(base,draft):[];
 useEffect(()=>{
  if(open&&!wasOpen.current){setTestState(structuredClone(state));setLog([]);panel.current?.focus()}
  wasOpen.current=open;
 },[open,state]);
 useEffect(()=>{if(!dirty)return;const timer=setTimeout(()=>{try{localStorage.setItem(DRAFT_KEY,draftSnapshot(base,draft));setSaveStatus('Szkic zapisany lokalnie')}catch{setSaveStatus('Nie zapisano szkicu — pobierz kopię')}} ,350);return()=>clearTimeout(timer)},[base,draft,dirty]);
 // Flush the latest draft when the tab closes, even before the debounce expires.
 useEffect(()=>{const save=()=>{if(dirty)try{localStorage.setItem(DRAFT_KEY,draftSnapshot(base,draft))}catch{}};window.addEventListener('pagehide',save);return()=>window.removeEventListener('pagehide',save)},[base,draft,dirty]);
 function change(next:Draft){setUndo(h=>[...h.slice(-29),draft]);setRedo([]);setDraft(next);setDirty(true);setSaveStatus('Zapisywanie szkicu…')}
 function editEntries(next:Entry[]){if(!formPack)return;const copy=structuredClone(formPack);if(section==='interactions')copy.interactions=next as ContentPack['interactions'];else (copy.story[section] as Entry[])=next;change({...draft,[section==='interactions'?'interactions':'story']:json(section==='interactions'?copy.interactions:copy.story)})}
 function changeEntry(value:Entry){editEntries(list.map((v,i)=>i===index?value:v))}
 function add(copy?:Entry){if(!formPack)return;editEntries([...list,makeEntry(formPack,section,copy)]);setIndex(list.length);setSearch('')}
 function move(direction:number){const to=index+direction;if(to<0||to>=list.length)return;const next=[...list];[next[index],next[to]]=[next[to],next[index]];editEntries(next);setIndex(to)}
 function apply(fresh:boolean){if(!parsed.pack)return;const valid=validateSave(fresh?{...prepareStorage(newSave(),parsed.pack),welcomed:true}:testState);if(!valid){setNotice('Stan testowy jest niepoprawny. Sprawdź plecak i flagi.');return}onApply(structuredClone(parsed.pack),valid)}
 async function copy(text:string){try{await navigator.clipboard.writeText(text);setNotice('Skopiowano pełną zawartość pliku.')}catch{setNotice('Schowek niedostępny. Zaznacz zawartość pola i skopiuj ręcznie lub pobierz plik.')}}
 function simulate(choiceId:string){if(!parsed.pack||!chosen)return;if(!validateSave(testState)){setNotice('Stan testowy jest niepoprawny. Popraw plecak lub wyzeruj stan.');return}const result=choose(parsed.pack,testState,chosen.id,choiceId);setLog([result.message||`Wykonano: ${chosen.id} / ${choiceId}`,...stateChanges(testState,result.state)]);setTestState(result.state)}
 if(!open)return null;
 return <div className="story-editor" data-story-editor ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Edytor fabuły" onKeyDown={e=>{e.stopPropagation();if(e.key==='Tab'){const controls=Array.from(panel.current!.querySelectorAll<HTMLElement>('button:not(:disabled),input,textarea,select,[tabindex="0"]'));const first=controls[0],last=controls.at(-1);if(e.shiftKey&&(document.activeElement===first||document.activeElement===panel.current)){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}}}}>
  <header className="se-header"><div><span>WARSZTAT AUTORA · ODDZIELNY ZAPIS TESTOWY</span><h1>Edytor fabuły</h1><small>{saveStatus}</small></div><div className="se-actions"><button onClick={()=>setView('graph')}>Graf bloczków</button><button onClick={()=>setView('forms')}>Formularze</button><button disabled={!parsed.pack} onClick={()=>apply(false)}>Zastosuj i testuj</button><button disabled={!parsed.pack} onClick={()=>apply(true)}>Testuj od początku</button><button onClick={()=>setTab('export')}>Eksportuj zmiany ({changes.length})</button><button onClick={onClose}>Ukryj panel</button></div></header>
  {view==='graph'?<GraphEditor pack={pack} state={state} onTest={onGraphTest} onRestore={onRestore}/>:<><div className="se-status" role="status">{parsed.error?<strong>Nie można zastosować ani wyeksportować: {parsed.error}</strong>:'✓ Fabuła poprawna'}{notice&&<p>{notice}</p>}</div>
  <div className="se-columns">
   <nav className="se-sidebar" aria-label="Zawartość fabuły"><SelectField label="Kategoria" value={section} options={SECTIONS} onChange={s=>{setSection(s as Section);setIndex(0);setSearch('');setTab('form')}}/><TextField label="Szukaj wpisu" value={search} onChange={setSearch}/><div className="se-actions"><button disabled={!formSafe||!formPack} onClick={()=>add()}>+ Dodaj</button><button disabled={!selected} onClick={()=>add(selected)}>Duplikuj</button></div><div className="se-entry-list">{list.map((e,i)=>(JSON.stringify(e).toLowerCase().includes(search.toLowerCase())&&<button key={i} aria-current={index===i?'true':undefined} onClick={()=>{setIndex(i);setTab('form')}}><strong>{'title' in e?e.title:'label' in e?e.label:e.id}</strong><small>{e.id}</small></button>))}</div><hr/><button onClick={()=>download('szkic-fabuly.json',draftSnapshot(base,draft))}>Pobierz kopię szkicu</button><label>Importuj szkic / pakiet<input type="file" accept=".json,application/json" onChange={async e=>{const input=e.currentTarget,f=input.files?.[0];if(!f)return;try{if(f.size>2_000_000)throw new Error('Plik jest za duży (maks. 2 MB).');const next=importDraft(await f.text());change(next);setFormSafe(true);setIndex(0);setNotice('Zaimportowano szkic. Zastosuj go, aby testować w grze.')}catch(err){setNotice(`Import odrzucony: ${String(err)}`)}input.value=''}}/></label><button onClick={()=>{if(window.confirm('Odrzucić szkic i przywrócić pliki opublikowanej gry?')){change(toDraft(base));setFormSafe(true);setIndex(0);setNotice('Przywrócono oryginalną fabułę.')}}}>Przywróć oryginał</button></nav>
   <section className="se-center" aria-label="Edycja wpisu"><div className="se-actions"><button aria-pressed={tab==='form'} onClick={()=>setTab('form')}>Formularz</button><button aria-pressed={tab==='json'} onClick={()=>{setFile(section==='interactions'?'interactions':'story');setTab('json')}}>JSON</button><button aria-pressed={tab==='export'} onClick={()=>setTab('export')}>Eksport</button><button disabled={!undo.length} onClick={()=>{setRedo(h=>[...h,draft]);setDraft(undo.at(-1)!);setUndo(h=>h.slice(0,-1));setDirty(true);setFormSafe(false)}}>Cofnij</button><button disabled={!redo.length} onClick={()=>{setUndo(h=>[...h,draft]);setDraft(redo.at(-1)!);setRedo(h=>h.slice(0,-1));setDirty(true);setFormSafe(false)}}>Ponów</button></div>
    {tab==='form'&&(!formSafe?<p>Po edycji JSON lub cofnięciu sprawdź strukturę: <button disabled={!parsed.pack} onClick={()=>setFormSafe(true)}>Otwórz formularz</button></p>:selected&&formPack?<><div className="se-actions"><button disabled={index===0} onClick={()=>move(-1)}>W górę</button><button disabled={index===list.length-1} onClick={()=>move(1)}>W dół</button><button onClick={()=>{if(window.confirm(`Usunąć wpis ${selected.id}?`)){editEntries(list.filter((_,i)=>i!==index));setIndex(Math.max(0,index-1))}}}>Usuń wpis</button></div><EntryForm entry={selected} section={section} pack={formPack} onChange={changeEntry}/></>:<p>Wybierz lub dodaj wpis.</p>)}
    {tab==='json'&&<><SelectField label="Plik źródłowy" value={file} options={FILES.map(id=>({id,name:`public/content/${id}.json`}))} onChange={s=>setFile(s as ContentFile)}/><TextField label="Kod JSON" multiline value={draft[file]} onChange={text=>{change({...draft,[file]:text});setFormSafe(false)}}/><p>Możesz wkleić cały plik. Błędy nie zmienią działającej gry.</p></>}
    {tab==='export'&&<><h2>Pliki do repozytorium</h2><p>Wklej pełną zawartość pod wskazaną ścieżką. Stan testowy nie jest eksportowany.</p>{!parsed.pack?<p>Najpierw popraw błędy fabuły.</p>:!changes.length?<p>Brak zmian względem opublikowanej wersji.</p>:changes.map(f=><article className="se-export" key={f.key}><h3>{f.path}</h3><div className="se-actions"><button onClick={()=>void copy(f.after)}>Kopiuj cały plik</button><button onClick={()=>download(`${f.key}.json`,f.after)}>Pobierz plik</button></div><details><summary>Pokaż różnice (− usunięte, + dodane)</summary><pre>{diffLines(f.before,f.after)}</pre></details><label>Pełna zawartość {f.key}.json<textarea readOnly value={f.after} onFocus={e=>e.currentTarget.select()}/></label></article>)}</>}
   </section>
   <aside className="se-inspector" aria-label="Podgląd i test"><h2>Podgląd i test</h2><p>Cel: <strong>{currentScene(pack,testState)?.objective??'Brak aktywnego celu'}</strong></p>
    {selected&&'lines' in selected&&<div className="se-dialog-preview">{'speaker' in selected&&<strong>{pack.characters.find(c=>c.id===selected.speaker)?.name??selected.speaker}</strong>}{selected.lines.map((line,i)=><p key={i}>{line}</p>)}</div>}
    {diagnoses.length>0&&<><h3>Wybór wariantu przez silnik</h3>{diagnoses.map(d=><div className={'se-diagnosis '+(d.selected?'selected':'')} key={d.node.id}><strong>{d.node.id} · {d.node.priority}</strong><p>{d.selected?'✓ Ten wariant zostanie uruchomiony':d.reasons.join('; ')}</p></div>)}{chosen?.choices.map(c=><button key={c.id} onClick={()=>simulate(c.id)}>Testuj odpowiedź: {c.label}</button>)}</>}
    {log.length>0&&<pre className="se-log" role="status">{log.join('\n')}</pre>}
    <h3>Stan testowy</h3><p>Zmiany poniżej dotyczą symulatora. „Zastosuj i testuj” przenosi je do świata gry.</p><SelectField label="Lokalizacja testowa" value={testState.location} options={[{id:'village',name:'Wioska'},{id:'home',name:'Dom'}]} onChange={location=>setTestState(s=>({...s,location:location as SaveState['location'],player:{x:0,z:0,heading:0}}))}/>
    <button onClick={()=>{setTestState({...prepareStorage(newSave(),pack),welcomed:true});setLog([])}}>Wyzeruj stan testowy</button><button onClick={()=>setTestState(s=>({...s,seen:[]}))}>Odblokuj jednorazowe dialogi</button>
    <details><summary>Flagi ({flagNames.length})</summary>{flagNames.map(key=><BoolField key={key} label={key} value={!!testState.flags[key]} onChange={value=>setTestState(s=>({...s,flags:{...s.flags,[key]:value}}))}/>)}</details>
    <details><summary>Plecak</summary>{pack.items.map(item=><NumberField key={item.id} label={item.name} value={testState.inventory[item.id]??0} onChange={quantity=>setTestState(s=>{const inventory={...s.inventory};if(quantity===0)delete inventory[item.id];else inventory[item.id]=quantity;return {...s,inventory}})}/>)}</details>
    <details><summary>Ukończone etapy</summary>{pack.story.scenes.map(s=><BoolField key={s.id} label={s.title} value={testState.completed.includes(s.id)} onChange={value=>setTestState(t=>({...t,completed:value?[...t.completed,s.id]:t.completed.filter(id=>id!==s.id)}))}/>)}</details>
    <details onToggle={e=>{if(e.currentTarget.open)setStateJson(json(testState))}}><summary>Zaawansowany stan JSON</summary><TextField label="Stan testowy JSON" value={stateJson} multiline onChange={setStateJson}/><button onClick={()=>{try{const next=validateSave(JSON.parse(stateJson));if(!next)throw new Error('Niepoprawny stan');setTestState(next);setNotice('Wczytano stan do symulatora.')}catch{setNotice('Niepoprawny stan testowy — nie zastosowano zmian.')}}}>Wczytaj stan do symulatora</button></details>
   </aside>
  </div></>}
 </div>;
}
