import {useCallback,useEffect,useRef,useState} from 'react';
import {VillageGame,type NearInfo} from '../game/runtime';
import type {Action} from '../game/input';
import {SaveStore} from '../persistence/store';
import {newSave,type SaveState} from '../persistence/state';
import {FIRST_QUEST} from '../data/quests';
import {answerExercise,useHint} from '../reading/model';
import {startQuest,completeQuest} from '../quests/model';
import {canSpeak,speak,stopSpeech} from '../audio/speech';
import {Icon,Portrait} from './Icons';
import {Dialog} from './Dialog';
import {TouchControls} from './TouchControls';
type Overlay='welcome'|'dialogue'|'reading'|'success'|'menu'|null;
export function App(){
 const canvas=useRef<HTMLCanvasElement>(null),game=useRef<VillageGame|null>(null),[store]=useState(()=>new SaveStore());
 const [state,setState]=useState(newSave),stateRef=useRef(state),[loaded,setLoaded]=useState(false),[ready,setReady]=useState(false),[error,setError]=useState('');
 const [overlay,setOverlay]=useState<Overlay>('welcome'),[line,setLine]=useState(0),[feedback,setFeedback]=useState(''),[hint,setHint]=useState(false),[practice,setPractice]=useState(false);
 const [saveMode,setSaveMode]=useState<'indexeddb'|'localStorage'|'memory'>('indexeddb'),[pad,setPad]=useState(false);
 const [near,setNear]=useState<NearInfo>({near:false,distance:9,x:0,y:0,visible:false});
 const actions=useRef<(a:Action)=>void>(()=>{});
 const update=useCallback((change:(s:SaveState)=>SaveState)=>{
   const next=change(stateRef.current);stateRef.current=next;setState(next);void store.save(next).then(()=>setSaveMode(store.mode));
 },[store]);
 useEffect(()=>{let alive=true;void store.load().then(saved=>{if(!alive)return;const initial=saved||newSave();stateRef.current=initial;setState(initial);setSaveMode(store.mode);setOverlay(initial.welcomed?null:'welcome');setLoaded(true)});return()=>{alive=false}},[store]);
 useEffect(()=>{
   if(!loaded||!canvas.current)return;
   try{game.current=new VillageGame(canvas.current,stateRef.current,{onReady:()=>setReady(true),onError:()=>{setError('Nie udało się wyświetlić świata 3D. Sprawdź, czy przeglądarka obsługuje WebGL, i odśwież stronę.');setReady(false)},onNear:setNear,onGamepad:setPad,onAction:a=>actions.current(a),onSave:snapshot=>update(s=>({...s,...snapshot}))})}
   catch(error){console.error('Village graphics initialization failed:',error);setError('Nie udało się uruchomić grafiki 3D. Spróbuj użyć aktualnego Chrome, Edge, Firefox lub Safari.');}
   return()=>{game.current?.dispose();game.current=null;stopSpeech()};
 },[loaded,update]);
 useEffect(()=>{game.current?.setPaused(!ready||overlay!==null);stopSpeech()},[overlay,ready]);
 useEffect(()=>{const onVisibility=()=>{if(document.hidden)stopSpeech()};document.addEventListener('visibilitychange',onVisibility);return()=>document.removeEventListener('visibilitychange',onVisibility)},[]);
 function close(){stopSpeech();setOverlay(null);setFeedback('');setHint(false)}
 function interact(){
   if(!ready||overlay||!game.current?.faceBruno())return;
   setLine(state.quest.status==='active'?1:0);setFeedback('');setHint(false);setPractice(state.quest.status==='completed');setOverlay('dialogue');
 }
 function beginReading(){update(s=>({...s,quest:startQuest(s.quest)}));setOverlay('reading');setFeedback('');setHint(false)}
 function answer(choice:string){
   const reading=answerExercise(FIRST_QUEST.exercise,stateRef.current.quest.reading,choice);
   update(s=>({...s,quest:completeQuest({...s.quest,reading})}));
   if(choice===FIRST_QUEST.exercise.target){setOverlay('success');setFeedback('');game.current?.celebrate()}
   else setFeedback(`To ${choice}. Poszukaj MA. Spróbuj jeszcze raz.`);
 }
 function showHint(){setHint(true);update(s=>({...s,quest:{...s.quest,reading:useHint(s.quest.reading)}}))}
 function readText(){const text=overlay==='reading'?FIRST_QUEST.exercise.prompt:overlay==='success'?FIRST_QUEST.thanks:overlay==='dialogue'?(practice?'Miło cię widzieć, Kitku! Chcesz jeszcze raz znaleźć MA?':FIRST_QUEST.dialogue[line]):'Cześć, jestem Kitek! Chodźmy poznać Brunona, naszego sąsiada.';speak(text)}
 actions.current=(action)=>{
   if(!ready||error)return;
   if(overlay){
     if(action==='confirm'){const focused=document.activeElement as HTMLButtonElement;if(focused?.matches('[role="dialog"] button:not([disabled])'))focused.click();else document.querySelector<HTMLButtonElement>('[role="dialog"] .syllable:not([disabled]),[role="dialog"] .primary:not([disabled])')?.click()}
     else if(action==='back'){if(overlay!=='welcome')close()}
     else if(['left','right','up','down'].includes(action)){
       const buttons=Array.from(document.querySelectorAll<HTMLButtonElement>('[role="dialog"] button:not([disabled])')),current=buttons.indexOf(document.activeElement as HTMLButtonElement),d=action==='left'||action==='up'?-1:1;buttons[(current+d+buttons.length)%buttons.length]?.focus();
     }else if(action==='listen')readText();else if(action==='hint'&&overlay==='reading')showHint();
   }else if(action==='confirm')interact();else if(action==='menu'||action==='back')setOverlay('menu');
 };
 const completed=state.quest.status==='completed';
 return <main className="game-shell">
   <canvas ref={canvas} className="world-canvas" tabIndex={-1} aria-label="Wioska 3D. Strzałki góra i dół: przód i tył; lewo i prawo: obrót Kitka z kamerą za plecami. Możesz też użyć WASD lub joysticka. E: rozmowa z Brunonem."/>
   <div className="vignette"/>
   <header className="hud-header">
     <div className="brand"><span className="brand-leaf"><Icon name="leaf" size={28}/></span><div><span className="brand-small">Przygody Kitka</span><h1>Czytająca Wioska</h1></div></div>
     <div className="header-actions"><div className="seed-counter" title="Nasionka w plecaku"><Icon name="seed"/><span>{state.quest.rewardGranted?1:0}</span><span className="seed-label">nasionko</span></div><button className="icon-button menu-button" aria-label="Otwórz menu" disabled={!ready||!!overlay} onClick={()=>setOverlay('menu')}><Icon name="menu"/></button></div>
   </header>
   {ready&&!overlay&&!error&&<>
     <aside className="quest-card"><span className="quest-icon"><Icon name={completed?'check':'leaf'}/></span><div><span className="eyebrow">{completed?'Pierwsza przyjaźń':'Mała przygoda'}</span><h2>{completed?'Nasionko od Brunona':state.quest.status==='active'?'Znajdź MA z Brunonem':'Poznajmy Brunona'}</h2><p>{completed?'Rozejrzyj się po wiosce.':near.near?'Bruno czeka na rozmowę.':`Podejdź do ogrodu · ${Math.ceil(near.distance)} m`}</p></div></aside>
     {near.visible&&near.distance<12&&<button className={'npc-label '+(near.near?'available':'')} style={{left:near.x,top:near.y}} onClick={interact} disabled={!near.near} aria-label={near.near?'Porozmawiaj z Brunonem':'Bruno — podejdź bliżej'}>{near.near&&<Icon name="chat" size={19}/>}<span>Bruno</span>{near.near&&<kbd>{pad?'A':'E'}</kbd>}</button>}
     <div className="bottom-hud"><div className="controls-help"><span><kbd>↑ ↓</kbd> przód / tył</span><i/><span><kbd>← →</kbd> obrót</span><i/><span><kbd>Shift</kbd> bieg</span>{pad&&<span className="pad-connected">Pad połączony</span>}</div><button className="interact-button" disabled={!near.near} onClick={interact}><Icon name="chat" size={22}/>{near.near?'Porozmawiaj':'Podejdź do Brunona'}<kbd>{pad?'A':'E'}</kbd></button></div>
     <button className="icon-button camera-button" aria-label="Ustaw kamerę za Kitkiem" onClick={()=>game.current?.recenter()}><Icon name="camera" size={23}/></button>
     <TouchControls key={String(!!overlay)} move={(x,y)=>game.current?.moveTouch(x,y)} run={value=>game.current?.runTouch(value)} interact={interact} near={near.near}/>
   </>}
   <div className="save-status" role="status">{saveMode==='memory'?'Zapis niedostępny — postęp zniknie po zamknięciu.':ready?'Postęp zapisuje się na tym urządzeniu':''}</div>
   {error?<div className="scrim"><section className="dialog"><Icon name="help" size={36}/><h2>Świat potrzebuje chwili</h2><p>{error}</p><button className="primary" onClick={()=>location.reload()}>Spróbuj ponownie</button></section></div>:!loaded?<div className="loading"><Icon name="leaf" size={42}/><p>Otwieramy wioskę…</p></div>:overlay==='welcome'?<Dialog label="Witaj w Czytającej Wiosce" onBack={()=>{}}>
     <div className="welcome-portrait"><Portrait/></div><span className="eyebrow">Twoja pierwsza przygoda</span><h2>Cześć, jestem Kitek!</h2><p>Chodźmy poznać Brunona.<br/>Czeka na nas w swoim ogrodzie.</p><p className="quiet">Możemy też po prostu pospacerować.</p>
     <button className="primary" disabled={!ready} onClick={()=>{update(s=>({...s,welcomed:true}));close()}}>{ready?'Ruszamy':'Przygotowujemy świat…'}<Icon name="arrow"/></button>
     <div className="welcome-instructions"><span>↑ ↓ — przód / tył · ← → — obrót</span><span>Mysz / gest — kamera</span><span>E / A — rozmowa</span></div>
   </Dialog>:overlay==='dialogue'?<Dialog label="Rozmowa z Brunonem" onBack={close}>
     <div className="speaker"><Portrait bear/><div><span className="eyebrow">Nasz sąsiad · ogrodnik</span><h2>Bruno</h2></div><button className="icon-button speaker-listen" onClick={readText} disabled={!canSpeak()} aria-label="Posłuchaj wypowiedzi Brunona"><Icon name="sound"/></button></div>
     <p className="dialogue-text">{practice?'Miło cię widzieć, Kitku! Chcesz jeszcze raz znaleźć MA?':FIRST_QUEST.dialogue[line]}</p>
     <div className="dialogue-dots" aria-label={`Wypowiedź ${line+1} z ${FIRST_QUEST.dialogue.length}`}><i className={line===0?'current':''}/><i className={line===1?'current':''}/></div>
     <div className="dialog-actions"><button className="secondary" onClick={close}>Jeszcze pospaceruję</button>{!practice&&line===0?<button className="primary" onClick={()=>setLine(1)}>Dalej<Icon name="arrow"/></button>:<button className="primary" onClick={beginReading}>{practice?'Poćwiczmy':'Pomogę!'}<Icon name="arrow"/></button>}</div>
   </Dialog>:overlay==='reading'?<Dialog label="Ćwiczenie: znajdź MA" onBack={close} wide>
     <div className="exercise-header"><div className="speaker compact"><Portrait bear/><div><span className="eyebrow">Pomagamy Brunonowi</span><h2>Pierwsze nasionko</h2></div></div><button className="icon-button" aria-label="Wróć do spaceru" onClick={close}><Icon name="close"/></button></div>
     <p className="reading-prompt">Znajdź sylabę <strong>MA</strong>.</p><div className="choices">{FIRST_QUEST.exercise.choices.map(choice=><button className="syllable" key={choice} onClick={()=>answer(choice)}>{choice}</button>)}</div>
     <div className="reading-feedback" aria-live="polite">{feedback||'Wybierz jeden napis.'}</div>{hint&&<p className="hint-text">{FIRST_QUEST.exercise.hint}</p>}
     <div className="exercise-tools"><button className="text-button" onClick={readText} disabled={!canSpeak()}><Icon name="sound"/>Posłuchaj</button><button className="text-button" onClick={showHint}><Icon name="help"/>Podpowiedź</button></div>
   </Dialog>:overlay==='success'?<Dialog label="Ukończone zadanie" onBack={close}>
     <div className="reward"><Icon name="seed" size={64}/></div><span className="eyebrow">Dziękuję, Kitku!</span><h2>Tak, to MA!</h2><p>{practice?'Miło było znowu poćwiczyć razem.':<>Bruno podarował ci<br/><strong>nasionko maku.</strong></>}</p><p className="quiet">Co jeszcze odkryjemy w wiosce?</p><button className="primary" onClick={close}>Wracam do wioski<Icon name="arrow"/></button>
   </Dialog>:overlay==='menu'?<Dialog label="Menu wioski" onBack={close}>
     <span className="eyebrow">Chwila odpoczynku</span><h2>Twój spacer</h2><div className="menu-progress"><Icon name="seed" size={32}/><div><strong>{completed?'Pierwsze nasionko zdobyte':'Bruno czeka w ogrodzie'}</strong><p>{completed?'Możesz wrócić i poćwiczyć MA.':'Czytanie możemy zacząć, kiedy zechcesz.'}</p></div></div>
     <dl className="control-list"><div><dt>Przód / tył</dt><dd>↑ ↓ — względem Kitka</dd></div><div><dt>Obrót Kitka</dt><dd>← → — kamera za plecami</dd></div><div><dt>Ruch względem kamery</dt><dd>WASD · lewy drążek · joystick</dd></div><div><dt>Rozejrzyj się</dt><dd>Przeciągnij · prawy drążek</dd></div><div><dt>Rozmowa</dt><dd>E · przycisk A na padzie</dd></div><div><dt>Bieg</dt><dd>Shift · RT na padzie</dd></div><div><dt>Menu i powrót</dt><dd>Esc · Start / B na padzie</dd></div></dl><p className="quiet">Postęp zapisuje się automatycznie na tym urządzeniu.</p><button className="primary" onClick={close}>Wracam do spaceru<Icon name="arrow"/></button>
   </Dialog>:null}
 </main>;
}
