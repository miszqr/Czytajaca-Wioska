import {useCallback,useEffect,useRef,useState} from 'react';
import {VillageGame,type NearInfo} from '../game/runtime';
import type {Action} from '../game/input';
import {SaveStore} from '../persistence/store';
import {newSave,type SaveState} from '../persistence/state';
import {loadContent} from '../content/load';
import type {ContentPack,QuestDefinition} from '../content/types';
import {newQuest} from '../quests/model';
import {reconcileContent,isUnlocked,meetQuest,beginQuest,hintQuest,submitQuest,PACK_CAPACITY} from '../quests/engine';
import {canSpeak,speak,stopSpeech} from '../audio/speech';
import {Icon,Portrait} from './Icons';
import {Dialog} from './Dialog';
import {TouchControls} from './TouchControls';
import {ReadingExercise} from './ReadingExercise';
type Overlay='welcome'|'npc'|'dialogue'|'reading'|'success'|'menu'|'inventory'|null;
export function App(){
 const canvas=useRef<HTMLCanvasElement>(null),game=useRef<VillageGame|null>(null),[store]=useState(()=>new SaveStore());
 const [state,setState]=useState(newSave),stateRef=useRef(state),[content,setContent]=useState<ContentPack|null>(null),[ready,setReady]=useState(false),[error,setError]=useState('');
 const [overlay,setOverlay]=useState<Overlay>('welcome'),[activeNpcId,setActiveNpcId]=useState(''),[questId,setQuestId]=useState(''),[lines,setLines]=useState<string[]>([]),[line,setLine]=useState(0);
 const [feedback,setFeedback]=useState(''),[hint,setHint]=useState(false),[practice,setPractice]=useState(false),[rewardPending,setRewardPending]=useState(false);
 const [saveMode,setSaveMode]=useState<'indexeddb'|'localStorage'|'memory'>('indexeddb'),[pad,setPad]=useState(false);
 const [near,setNear]=useState<NearInfo>({npcId:null,near:false,distance:9,x:0,y:0,visible:false});
 const actions=useRef<(a:Action)=>void>(()=>{});
 const update=useCallback((change:(s:SaveState)=>SaveState)=>{
   const next=change(stateRef.current);stateRef.current=next;setState(next);void store.save(next).then(()=>setSaveMode(store.mode));return next;
 },[store]);
 useEffect(()=>{
  let alive=true;
  void Promise.all([loadContent(),store.load()]).then(([pack,saved])=>{
   if(!alive)return;const initial=reconcileContent(saved||newSave(),pack);stateRef.current=initial;setState(initial);setSaveMode(store.mode);setOverlay(initial.welcomed?null:'welcome');setContent(pack);
  }).catch(error=>{if(alive)setError(error instanceof Error?error.message:'Nie udało się wczytać wioski.')});
  return()=>{alive=false};
 },[store]);
 useEffect(()=>{
  if(!content||!canvas.current)return;
  try{game.current=new VillageGame(canvas.current,stateRef.current,{onReady:()=>setReady(true),onError:()=>{setError('Nie udało się wyświetlić świata 3D. Sprawdź obsługę WebGL i odśwież stronę.');setReady(false)},onNear:setNear,onGamepad:setPad,onAction:a=>actions.current(a),onSave:snapshot=>update(s=>({...s,...snapshot}))},content)}
  catch(error){console.error('Village initialization failed:',error);setError(error instanceof Error?error.message:'Nie udało się uruchomić grafiki 3D.')}
  return()=>{game.current?.dispose();game.current=null;stopSpeech()};
 },[content,update]);
 useEffect(()=>{game.current?.setPaused(!ready||overlay!==null);stopSpeech()},[overlay,ready]);
 useEffect(()=>{const fn=()=>{if(document.hidden)stopSpeech()};document.addEventListener('visibilitychange',fn);return()=>document.removeEventListener('visibilitychange',fn)},[]);
 const quest=content?.quests.find(q=>q.id===questId),npc=content?.characters.find(n=>n.id===activeNpcId),nearNpc=content?.characters.find(n=>n.id===near.npcId);
 const reward=content?.items.find(i=>i.id===quest?.reward.itemId);
 function close(){stopSpeech();setOverlay(null);setFeedback('');setHint(false)}
 function openQuest(q:QuestDefinition){
  if(!isUnlocked(q,stateRef.current))return;
  const progress=stateRef.current.quests[q.id]??newQuest(q.revision);
  setQuestId(q.id);setActiveNpcId(q.npcId);setLines(q.dialogue[progress.status==='completed'?'completed':progress.introduced?'active':'intro']);setLine(0);setPractice(progress.rewardGranted);setFeedback('');setHint(false);setRewardPending(false);
  update(s=>meetQuest(s,q));setOverlay('dialogue');
 }
 function interact(){
  if(!ready||overlay||!content||!near.npcId||!game.current?.faceNpc(near.npcId))return;
  setActiveNpcId(near.npcId);const quests=content.quests.filter(q=>q.npcId===near.npcId);
  if(quests.length===1&&isUnlocked(quests[0],stateRef.current))openQuest(quests[0]);else setOverlay('npc');
 }
 function beginReading(){if(!quest)return;update(s=>beginQuest(s,quest));setOverlay('reading');setFeedback('');setHint(false)}
 function answer(value:string|readonly number[]){
  if(!quest)return;const result=submitQuest(stateRef.current,quest,value);if(result.state===stateRef.current)return;
  update(()=>result.state);
  if(result.correct){setRewardPending(result.rewardPending);setOverlay('success');setFeedback('');game.current?.celebrate()}
  else setFeedback(quest.feedback.retry);
 }
 function showHint(){if(quest){setHint(true);update(s=>hintQuest(s,quest))}}
 function readText(){if(!quest)return;speak(overlay==='reading'?quest.exercise.prompt:overlay==='success'?(practice?quest.feedback.practice:quest.feedback.success):lines[line]??'')}
 actions.current=action=>{
  if(!ready||error)return;
  if(overlay){
   if(action==='confirm'){const focused=document.activeElement as HTMLButtonElement;if(focused?.matches('[role="dialog"] button:not([disabled])'))focused.click();else document.querySelector<HTMLButtonElement>('[role="dialog"] .syllable:not([disabled]),[role="dialog"] .primary:not([disabled])')?.click()}
   else if(action==='back'){if(overlay!=='welcome')close()}
   else if(['left','right','up','down'].includes(action)){const buttons=Array.from(document.querySelectorAll<HTMLButtonElement>('[role="dialog"] button:not([disabled])')),current=buttons.indexOf(document.activeElement as HTMLButtonElement),d=action==='left'||action==='up'?-1:1;buttons[(current+d+buttons.length)%buttons.length]?.focus()}
   else if(action==='listen')readText();else if(action==='hint'&&overlay==='reading')showHint();
  }else if(action==='confirm')interact();else if(action==='menu'||action==='back')setOverlay('menu');
 };
 const nextQuest=content?.quests.find(q=>state.quests[q.id]?.status==='active'&&isUnlocked(q,state))??content?.quests.find(q=>state.quests[q.id]?.status!=='completed'&&isUnlocked(q,state));
 const completedCount=content?.quests.filter(q=>state.quests[q.id]?.status==='completed').length??0;
 const inventory=Object.entries(state.inventory);
 const portrait=<Portrait bear={npc?.model==='bruno'} fela={npc?.model==='fela'}/>;
 return <main className="game-shell">
  <canvas ref={canvas} className="world-canvas" tabIndex={-1} aria-label="Wioska 3D. Strzałki góra i dół: przód i tył; lewo i prawo: obrót Kitka z kamerą za plecami. WASD lub joystick: ruch względem kamery. E: rozmowa z mieszkańcem."/>
  <div className="vignette"/>
  <header className="hud-header"><div className="brand"><span className="brand-leaf"><Icon name="leaf" size={28}/></span><div><span className="brand-small">Przygody Kitka</span><h1>Czytająca Wioska</h1></div></div><div className="header-actions">
   <button className="seed-counter" aria-label="Otwórz plecak" disabled={!ready||!!overlay} onClick={()=>setOverlay('inventory')}><Icon name="seed"/><span>{inventory.length}/{PACK_CAPACITY}</span><span className="seed-label">plecak</span></button>
   <button className="icon-button menu-button" aria-label="Otwórz menu" disabled={!ready||!!overlay} onClick={()=>setOverlay('menu')}><Icon name="menu"/></button>
  </div></header>
  {ready&&!overlay&&!error&&<>
   <aside className="quest-card"><span className="quest-icon"><Icon name={nextQuest?'leaf':'check'}/></span><div><span className="eyebrow">{nextQuest?'Mała przygoda':'Nasi przyjaciele'}</span><h2>{nextQuest?.title??'Dobry dzień w wiosce'}</h2><p>{nextQuest?.description??'Możesz pospacerować lub powtórzyć zadania.'}</p></div></aside>
   {nearNpc&&near.visible&&near.distance<12&&<button className={'npc-label '+(near.near?'available':'')} style={{left:near.x,top:near.y}} onClick={interact} disabled={!near.near} aria-label={`Rozmowa: ${nearNpc.name}`}>{near.near&&<Icon name="chat" size={19}/>}<span>{nearNpc.name}</span>{near.near&&<kbd>{pad?'A':'E'}</kbd>}</button>}
   <div className="bottom-hud"><div className="controls-help"><span><kbd>↑ ↓</kbd> przód / tył</span><i/><span><kbd>← →</kbd> obrót</span><i/><span><kbd>Shift</kbd> bieg</span>{pad&&<span className="pad-connected">Pad połączony</span>}</div><button className="interact-button" disabled={!near.near} onClick={interact}><Icon name="chat" size={22}/>{near.near?'Porozmawiaj':'Podejdź do mieszkańca'}<kbd>{pad?'A':'E'}</kbd></button></div>
   <button className="icon-button camera-button" aria-label="Ustaw kamerę za Kitkiem" onClick={()=>game.current?.recenter()}><Icon name="camera" size={23}/></button>
   <TouchControls move={(x,y)=>game.current?.moveTouch(x,y)} run={value=>game.current?.runTouch(value)} interact={interact} near={near.near}/>
  </>}
  <div className="save-status" role="status">{saveMode==='memory'?'Zapis niedostępny — postęp zniknie po zamknięciu.':ready?'Postęp zapisuje się na tym urządzeniu':''}</div>
  {error?<div className="scrim"><section className="dialog" role="alert"><Icon name="help" size={36}/><h2>Nie udało się otworzyć wioski</h2><p>Spróbuj odświeżyć stronę. Twój zapis nie został zresetowany.</p><details className="load-error"><summary>Szczegóły dla rodzica</summary><p>{error}</p></details><button className="primary" onClick={()=>location.reload()}>Spróbuj ponownie</button></section></div>
  :!content?<div className="loading"><Icon name="leaf" size={42}/><p>Otwieramy wioskę…</p></div>
  :overlay==='welcome'?<Dialog label="Witaj w Czytającej Wiosce" onBack={()=>{}}><div className="welcome-portrait"><Portrait/></div><span className="eyebrow">Twoja pierwsza przygoda</span><h2>Cześć, jestem Kitek!</h2><p>Poznajmy naszych sąsiadów.<br/>Czekają na nas małe przygody.</p><p className="quiet">Możemy też po prostu pospacerować.</p><button className="primary" disabled={!ready} onClick={()=>{update(s=>({...s,welcomed:true}));close()}}>{ready?'Ruszamy':'Przygotowujemy świat…'}<Icon name="arrow"/></button><div className="welcome-instructions"><span>↑ ↓ — przód / tył · ← → — obrót</span><span>Mysz / gest — kamera</span><span>E / A — rozmowa</span></div></Dialog>
  :overlay==='npc'&&npc?<Dialog label={`Rozmowa: ${npc.name}`} onBack={close}><div className="speaker">{portrait}<div><span className="eyebrow">{npc.role}</span><h2>{npc.name}</h2></div></div><p>Co dziś zrobimy?</p><div className="quest-list">{content.quests.filter(q=>q.npcId===npc.id).map(q=><button className="secondary" key={q.id} disabled={!isUnlocked(q,state)} onClick={()=>openQuest(q)}>{q.title}{!isUnlocked(q,state)&&<small>Najpierw: {q.requires.map(id=>content.quests.find(q=>q.id===id)?.title).join(', ')}</small>}</button>)}</div><button className="primary" onClick={close}>Jeszcze pospaceruję</button></Dialog>
  :overlay==='dialogue'&&quest&&npc?<Dialog label={`Rozmowa: ${npc.name}`} onBack={close}><div className="speaker">{portrait}<div><span className="eyebrow">{npc.role}</span><h2>{npc.name}</h2></div><button className="icon-button speaker-listen" onClick={readText} disabled={!canSpeak()} aria-label="Posłuchaj wypowiedzi"><Icon name="sound"/></button></div><p className="dialogue-text">{lines[line]}</p><div className="dialogue-dots" aria-label={`Wypowiedź ${line+1} z ${lines.length}`}>{lines.map((_,i)=><i key={i} className={i===line?'current':''}/>)}</div><div className="dialog-actions"><button className="secondary" onClick={close}>Jeszcze pospaceruję</button>{line<lines.length-1?<button className="primary" onClick={()=>setLine(i=>i+1)}>Dalej<Icon name="arrow"/></button>:<button className="primary" onClick={beginReading}>{practice?quest.dialogue.replayLabel:quest.dialogue.acceptLabel}<Icon name="arrow"/></button>}</div></Dialog>
  :overlay==='reading'&&quest&&npc?<Dialog label={`Ćwiczenie: ${quest.exercise.prompt}`} onBack={close} wide><div className="exercise-header"><div className="speaker compact">{portrait}<div><span className="eyebrow">{npc.name}</span><h2>{quest.title}</h2></div></div><button className="icon-button" aria-label="Wróć do spaceru" onClick={close}><Icon name="close"/></button></div><ReadingExercise key={`${quest.id}-${quest.revision}`} exercise={quest.exercise} onAnswer={answer}/><div className="reading-feedback" aria-live="polite">{feedback||(quest.exercise.type==='syllable-build'?'Wybierz sylaby po kolei.':'Wybierz jeden napis.')}</div>{hint&&<p className="hint-text">{quest.exercise.hint}</p>}<div className="exercise-tools"><button className="text-button" onClick={readText} disabled={!canSpeak()}><Icon name="sound"/>Posłuchaj</button><button className="text-button" onClick={showHint}><Icon name="help"/>Podpowiedź</button></div></Dialog>
  :overlay==='success'&&quest?<Dialog label="Ukończone ćwiczenie" onBack={close}><div className="reward"><Icon name={reward?.icon??'seed'} size={64}/></div><span className="eyebrow">Dziękuję, Kitku!</span><h2>{quest.title}</h2><p>{rewardPending?'Dobra odpowiedź! Plecak jest pełny. Nagroda poczeka u mieszkańca.':practice?quest.feedback.practice:quest.feedback.success}</p>{!practice&&!rewardPending&&<p className="reward-name">{reward?.name} × {quest.reward.quantity}</p>}<p className="quiet">Co jeszcze odkryjemy w wiosce?</p><button className="primary" onClick={close}>Wracam do wioski<Icon name="arrow"/></button></Dialog>
  :overlay==='inventory'?<Dialog label="Plecak Kitka" onBack={close} wide><span className="eyebrow">Skarby ze spaceru</span><h2>Plecak Kitka</h2><div className="inventory-grid">{Array.from({length:PACK_CAPACITY},(_,i)=>{const entry=inventory[i],item=entry?content.items.find(item=>item.id===entry[0]):undefined;return <div className={'inventory-slot '+(!entry?'empty':'')} key={i}>{entry?<><Icon name={item?.icon??'seed'} size={30}/><strong>{item?.name??entry[0]}</strong><span>× {entry[1]}</span></>:<span aria-label="Puste miejsce">·</span>}</div>})}</div><p className="quiet">{inventory.length} z {PACK_CAPACITY} miejsc zajętych.</p><button className="primary" onClick={close}>Wracam do spaceru</button></Dialog>
  :overlay==='menu'?<Dialog label="Menu wioski" onBack={close}><span className="eyebrow">Chwila odpoczynku</span><h2>Twój spacer</h2><p className="quiet">Ukończone zadania: {completedCount}/{content.quests.length}</p><ul className="progress-list">{content.quests.map(q=><li key={q.id}><span>{q.title}</span><strong>{state.quests[q.id]?.status==='completed'?'Gotowe':state.quests[q.id]?.status==='active'?'W trakcie':'Do odkrycia'}</strong></li>)}</ul><button className="secondary" onClick={()=>setOverlay('inventory')}>Zajrzyj do plecaka</button><dl className="control-list"><div><dt>Przód / tył</dt><dd>↑ ↓ — względem Kitka</dd></div><div><dt>Obrót Kitka</dt><dd>← → — kamera za plecami</dd></div><div><dt>Ruch względem kamery</dt><dd>WASD · lewy drążek · joystick</dd></div><div><dt>Rozmowa</dt><dd>E · A na padzie</dd></div></dl><p className="quiet">Postęp zapisuje się na tym urządzeniu.</p><button className="primary" onClick={close}>Wracam do spaceru<Icon name="arrow"/></button></Dialog>:null}
 </main>;
}
