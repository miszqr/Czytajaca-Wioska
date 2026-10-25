import {lazy,Suspense,useCallback,useEffect,useRef,useState} from 'react';
import {VillageGame,type NearInfo} from '../game/runtime';
import type {Action} from '../game/input';
import {SaveStore} from '../persistence/store';
import {newSave,type SaveState,type PlayerPose} from '../persistence/state';
import {loadContent} from '../content/load';
import type {ContentPack,StoryNode,Furniture} from '../content/types';
import {prepareStorage} from '../housing/model';
import {HousingEditor} from './HousingEditor';
import {choose,currentScene,findNode,PACK_CAPACITY} from '../story/engine';
import {Icon,Portrait} from './Icons';
import {Dialog} from './Dialog';
import {TouchControls} from './TouchControls';
import {CameraSettings} from './CameraSettings';
import {QuestHint} from './QuestHint';
import {NightSettings} from './NightSettings';
import {NIGHT_FLAG} from '../game/lantern-layout';
import {MiniMap} from './MiniMap';
import {STEGOSAURUS_FLAG} from '../game/pond-secret';
const StoryEditor=lazy(()=>import('../editor/StoryEditor'));
type Overlay='welcome'|'dialogue'|'journal'|'document'|'menu'|'new-game'|'inventory'|'housing'|null;
export function App(){
 const [editorMode]=useState(()=>new URLSearchParams(window.location.search).get('editor')==='story');
 const [editorOpen,setEditorOpen]=useState(editorMode),[baseContent,setBaseContent]=useState<ContentPack|null>(null);
 const canvas=useRef<HTMLCanvasElement>(null),game=useRef<VillageGame|null>(null),[store]=useState(()=>new SaveStore(editorMode?'story-editor':'player'));
 const [state,setState]=useState(newSave),stateRef=useRef(state),[content,setContent]=useState<ContentPack|null>(null),[ready,setReady]=useState(false),[error,setError]=useState('');
 const [overlay,setOverlay]=useState<Overlay>('welcome'),[node,setNode]=useState<StoryNode|null>(null),[documentId,setDocumentId]=useState(''),[line,setLine]=useState(0),[message,setMessage]=useState('');
 const [saveMode,setSaveMode]=useState<'indexeddb'|'localStorage'|'memory'>('indexeddb'),[pad,setPad]=useState(false);
 const [session,setSession]=useState(0);
 const [secretNotice,setSecretNotice]=useState(false);
 const [mapPosition,setMapPosition]=useState<PlayerPose|null>(null);
 const [near,setNear]=useState<NearInfo>({targetId:null,label:'',near:false,distance:99,x:0,y:0,visible:false});
 const housingActions=useRef<((a:Action)=>void)|null>(null),[housingItem,setHousingItem]=useState<string|undefined>();
 const preview=useCallback((f:Furniture|null,valid:boolean)=>game.current?.previewFurniture(f,valid),[]);
 const actions=useRef<(a:Action)=>void>(()=>{});
 const update=useCallback((change:(s:SaveState)=>SaveState)=>{const next=change(stateRef.current);stateRef.current=next;setState(next);game.current?.syncState(next);void store.save(next).then(()=>setSaveMode(store.mode));return next},[store]);
 useEffect(()=>{let alive=true;void Promise.all([loadContent(),store.load()]).then(([pack,saved])=>{if(!alive)return;const initial=prepareStorage(saved??newSave(),pack);stateRef.current=initial;setState(initial);setSaveMode(store.mode);setOverlay(initial.welcomed?null:'welcome');setBaseContent(pack);setContent(pack)}).catch(error=>{if(alive)setError(error instanceof Error?error.message:'Nie udało się wczytać wioski.')});return()=>{alive=false}},[store]);
 useEffect(()=>{if(!content||!canvas.current)return;try{game.current=new VillageGame(canvas.current,stateRef.current,{onReady:()=>setReady(true),onError:()=>{setError('Nie udało się wyświetlić świata 3D. Sprawdź obsługę WebGL i odśwież stronę.');setReady(false)},onNear:setNear,onMapPose:setMapPosition,onGamepad:setPad,onAction:a=>actions.current(a),onSave:snapshot=>update(s=>({...s,...snapshot})),onStegosaurus:snapshot=>{update(s=>({...s,...snapshot,flags:{...s.flags,[STEGOSAURUS_FLAG]:true}}));setSecretNotice(true)}},content)}catch(error){console.error('Village initialization failed:',error);setError(error instanceof Error?error.message:'Nie udało się uruchomić grafiki 3D.')}return()=>{game.current?.dispose();game.current=null}},[content,update,session]);
 useEffect(()=>{if(!secretNotice)return;const timer=window.setTimeout(()=>setSecretNotice(false),18000);return()=>window.clearTimeout(timer)},[secretNotice]);
 useEffect(()=>{setSecretNotice(false)},[session,content]);
 useEffect(()=>{game.current?.editHome(overlay==='housing')},[overlay,ready]);
 useEffect(()=>{game.current?.setPaused(!ready||overlay!==null||!!error||editorOpen)},[overlay,ready,error,editorOpen]);
 const scene=content?currentScene(content,state):undefined,doc=content?.story.documents.find(d=>d.id===documentId),speaker=content?.characters.find(c=>c.id===node?.speaker);
 const gatheringApples=node?.choices.some(c=>c.effects.some(e=>e.type==='giveItem'&&e.itemId==='apple'));
 const lightingLantern=node?.target.startsWith('lantern-');
 function close(){setOverlay(overlay==='new-game'?'menu':null);setMessage('')}
 function openEditor(){
  const snapshot=game.current?.snapshot();
  if(snapshot){const next={...stateRef.current,...snapshot};stateRef.current=next;setState(next)}
  setEditorOpen(true);
 }
 function applyStory(pack:ContentPack,testState:SaveState){
  // Flush the old world before replacing state; its disposal must not overwrite
  // the new test pose. This store is always separate from the player's store.
  const previous=game.current;game.current=null;previous?.dispose();
  setReady(false);setError('');setPad(false);setMapPosition(null);
  update(()=>testState);setNode(null);setDocumentId('');setLine(0);setMessage('');
  setNear({targetId:null,label:'',near:false,distance:99,x:0,y:0,visible:false});
  setOverlay(testState.welcomed?null:'welcome');setHousingItem(undefined);
  setContent(pack);setEditorOpen(false);
 }
 function openMenu(){
  const snapshot=game.current?.snapshot();
  if(snapshot){const next={...stateRef.current,...snapshot};stateRef.current=next;setState(next)}
  setOverlay('menu');
 }
 function changeCameraDistance(distance:number){game.current?.setCameraDistance(distance)}
 function startNewGame(){
  if(!content||overlay!=='new-game')return;
  // Dispose and flush the old world before queuing the fresh save. Recreate even
  // when both sessions start in the village, so poses and cached scenes reset.
  const previous=game.current;game.current=null;previous?.dispose();
  setReady(false);setPad(false);
  setMapPosition(null);
  update(()=>prepareStorage(newSave(),content));
  setNear({targetId:null,label:'',near:false,distance:99,x:0,y:0,visible:false});
  setNode(null);setDocumentId('');setLine(0);setMessage('');setHousingItem(undefined);
  setOverlay('welcome');setSession(value=>value+1);
 }
 function interact(){if(!ready||overlay||!content||!near.targetId||!game.current?.faceTarget(near.targetId))return;if(near.targetId==='bedside'){setHousingItem('lamp');setOverlay('housing');return}const next=findNode(content,stateRef.current,near.targetId);if(next){setNode(next);setLine(0);setMessage('');setOverlay('dialogue')}}
 function select(id:string){if(!content||!node)return;const result=choose(content,stateRef.current,node.id,id);if(result.message){setMessage(result.message);return}update(()=>result.state);game.current?.playStoryAction(node,id);close()}
 function openDocument(id:string){setDocumentId(id);setLine(0);setOverlay('document')}
 actions.current=action=>{
  if(!ready||error||editorOpen)return;
  if(overlay==='housing'){housingActions.current?.(action);return}
  if(overlay){
   const focused=document.activeElement as HTMLElement,range=focused?.matches('#camera-distance');
   if(action==='confirm'){
    if(focused?.matches('[role="dialog"] button:not([disabled])'))focused.click();
    else if(!range)document.querySelector<HTMLButtonElement>('[role="dialog"] .primary:not([disabled])')?.click();
   }else if(action==='back'){if(overlay!=='welcome')close()}
   else if(range&&(action==='left'||action==='right'))changeCameraDistance(Math.round((stateRef.current.camera.distance+(action==='left'?-.1:.1))*10)/10);
   else if(['left','right','up','down'].includes(action)){
    const controls=Array.from(document.querySelectorAll<HTMLElement>('[role="dialog"] button:not([disabled]),[role="dialog"] input[type="range"]'));
    const current=controls.indexOf(focused),direction=action==='left'||action==='up'?-1:1;
    controls[(current+direction+controls.length)%controls.length]?.focus();
   }
  }else if(action==='confirm')interact();
  else if(action==='menu'||action==='back')openMenu();
  else if(action==='hint')setOverlay('journal');
 };
 const inventory=Object.entries(state.inventory);
 const showMap=ready&&!overlay&&!error&&state.location==='village';
 return <><main inert={editorOpen?true:undefined} className={'game-shell'+(showMap?' has-minimap':'')}>
  <canvas ref={canvas} className="world-canvas" tabIndex={-1} aria-label="Czytająca Wioska 3D. Strzałki: przód, tył i obrót. WASD: ruch względem kamery. E: rozmowa lub użycie przedmiotu."/>
  <div className="vignette"/>
  <header className="hud-header"><div className="brand"><span className="brand-leaf"><Icon name="leaf" size={28}/></span><div><span className="brand-small">Nowy dom Kitka</span><h1>Czytająca Wioska</h1></div></div><div className="header-actions">
   <button className="icon-button" aria-label="Otwórz dziennik" disabled={!ready||!!overlay} onClick={()=>setOverlay('journal')}><Icon name="book"/></button>
   <button className="seed-counter" aria-label="Otwórz plecak" disabled={!ready||!!overlay} onClick={()=>setOverlay('inventory')}><Icon name="bag"/><span>{inventory.length}/{PACK_CAPACITY}</span><span className="seed-label">plecak</span></button>
   <button className="icon-button menu-button" aria-label="Otwórz menu" disabled={!ready||!!overlay} onClick={openMenu}><Icon name="menu"/></button>
  </div></header>
  {ready&&!overlay&&!error&&<>
   <QuestHint title={scene?.title??'Jestem u siebie'} objective={scene?.objective??(state.flags['story-complete']?'Dobrze być u siebie. Mogę odwiedzić sąsiadów.':'Mogę pospacerować i odwiedzić sąsiadów.')} onOpenJournal={()=>setOverlay('journal')}/>
   {near.targetId&&near.visible&&near.distance<10&&<button className={'npc-label '+(near.near?'available':'')} style={{left:near.x,top:near.y}} onClick={interact} disabled={!near.near}>{near.near&&<Icon name="chat" size={19}/>}<span>{near.label}</span>{near.near&&<kbd>{pad?'A':'E'}</kbd>}</button>}
   <div className="bottom-hud"><div className="controls-help"><span><kbd>↑ ↓</kbd> przód / tył</span><span><kbd>← →</kbd> obrót</span><span><kbd>Shift</kbd> włącz / wyłącz bieg</span>{pad&&<span className="pad-connected">Pad połączony</span>}</div><button className="interact-button" disabled={!near.near} onClick={interact}><Icon name="chat" size={22}/>{near.near?near.label:'Rozejrzyj się'}<kbd>{pad?'A':'E'}</kbd></button></div>
   <button className="icon-button camera-button" aria-label="Ustaw kamerę za Kitkiem" onClick={()=>game.current?.recenter()}><Icon name="camera" size={23}/></button>
   {state.location==='home'&&!state.flags.hosting&&<button className="home-edit-button secondary" onClick={()=>{setHousingItem(undefined);setOverlay('housing')}}>Urządź dom</button>}
   <TouchControls move={(x,y)=>game.current?.moveTouch(x,y)} run={value=>game.current?.runTouch(value)} interact={interact} near={near.near}/>
   {showMap&&<MiniMap player={mapPosition??state.player} night={!!state.flags[NIGHT_FLAG]}/>}
   {secretNotice&&state.location==='village'&&<div className="secret-notice" role="status"><strong>Spójrz na morze za jeziorkiem!</strong><span>Z wody wychodzi stegozaur.</span></div>}
  </>}
  <div className="save-status" role="status">{editorMode?'TRYB TESTOWY — osobny zapis':saveMode==='memory'?'Zapis niedostępny — postęp zniknie po zamknięciu.':ready?'Postęp zapisuje się na tym urządzeniu':''}</div>
  {error?<div className="scrim"><section className="dialog" role="alert"><Icon name="help" size={36}/><h2>Nie udało się otworzyć wioski</h2><p>Odśwież stronę, aby ponownie wczytać zapis.</p><details className="load-error"><summary>Szczegóły dla rodzica</summary><p>{error}</p></details><button className="primary" onClick={()=>location.reload()}>Spróbuj ponownie</button></section></div>
  :!content?<div className="loading"><Icon name="leaf" size={42}/><p>Otwieramy wioskę…</p></div>
  :overlay==='welcome'?<Dialog label="Witaj w Czytającej Wiosce" onBack={()=>{}}><div className="welcome-portrait"><Portrait/></div><span className="eyebrow">Nowy dom Kitka</span><h2>Cześć, jestem Kitek!</h2><p>To mój pierwszy dzień w wiosce.<br/>Poznajmy sąsiadów i znajdźmy mój dom.</p><p className="quiet">Możemy też po prostu pospacerować.</p><button className="primary" disabled={!ready} onClick={()=>{update(s=>({...s,welcomed:true}));close()}}>{ready?'Ruszamy':'Przygotowujemy świat…'}<Icon name="arrow"/></button><div className="welcome-instructions"><span>Strzałki — ruch i obrót</span><span>Mysz / gest — kamera</span><span>E / A — działanie</span></div></Dialog>
  :overlay==='dialogue'&&node?<Dialog label={`Rozmowa: ${speaker?.name??node.speaker}`} onBack={close}><div className="speaker">{speaker?<Portrait model={speaker.model} bear={speaker.model==='bruno'} fela={speaker.model==='fela'}/>:<span className="document-icon"><Icon name={lightingLantern?'lantern':gatheringApples?'apple':'letter'} size={42}/></span>}<div><span className="eyebrow">{speaker?.role??(lightingLantern?'Wieczorny spacer':gatheringApples?'Jabłka z wioski':'Nowy dom Kitka')}</span><h2>{speaker?.name??node.speaker}</h2></div></div><p className="dialogue-text">{node.lines[line]}</p><div className="dialogue-dots" aria-label={`Wypowiedź ${line+1} z ${node.lines.length}`}>{node.lines.map((_,i)=><i key={i} className={i===line?'current':''}/>)}</div>{message&&<p className="story-message" role="status">{message}</p>}<div className="dialog-actions"><button className="secondary" onClick={close}>Jeszcze się rozejrzę.</button>{line<node.lines.length-1?<button className="primary" onClick={()=>setLine(i=>i+1)}>Dalej<Icon name="arrow"/></button>:node.choices.map(c=><button className="primary" key={c.id} onClick={()=>select(c.id)}>{c.label}</button>)}</div></Dialog>
  :overlay==='document'&&doc?<Dialog label={doc.title} onBack={()=>setOverlay('journal')}><span className="document-icon"><Icon name="letter" size={42}/></span><h2>{doc.title}</h2><p className="dialogue-text">{doc.lines[line]}</p><div className="dialog-actions">{line<doc.lines.length-1?<button className="primary" onClick={()=>setLine(i=>i+1)}>Dalej</button>:<button className="primary" onClick={()=>setOverlay('journal')}>Zamknij list.</button>}</div></Dialog>
  :overlay==='journal'?<Dialog label="Dziennik Kitka" onBack={close} wide className="journal-dialog"><span className="eyebrow">Moje małe przygody</span><h2 data-dialog-autofocus tabIndex={-1}>Dziennik Kitka</h2><p className="journal-objective">{scene?.objective??('Dobrze być u siebie. Mogę odwiedzić sąsiadów.')}</p><ul className="progress-list">{content.story.scenes.filter(s=>state.completed.includes(s.id)).map(s=><li key={s.id}><Icon name="leaf" size={18}/><span>{s.title}</span></li>)}</ul><div className="quest-list">{state.read.map(id=>{const d=content.story.documents.find(d=>d.id===id);return d&&<button className="secondary" key={id} onClick={()=>openDocument(id)}><Icon name="letter"/>{d.title}</button>})}</div><button className="primary" onClick={close}>Wracam do spaceru.</button></Dialog>
  :overlay==='inventory'?<Dialog label="Plecak Kitka" onBack={close} wide className="inventory-dialog"><span className="eyebrow">Rzeczy na drogę</span><h2 data-dialog-autofocus tabIndex={-1}>Plecak Kitka</h2><div className="inventory-grid">{Array.from({length:PACK_CAPACITY},(_,i)=>{const entry=inventory[i],item=entry?content.items.find(item=>item.id===entry[0]):undefined;return <div className={'inventory-slot '+(!entry?'empty':'')} key={i}>{entry?<><Icon name={item?.model==='seed'?'seed':item?.model==='apple'?'apple':'box'} size={30}/><strong>{item?.name??entry[0]}</strong><span>× {entry[1]}</span><small>{item?.description}</small></>:<span aria-label="Puste miejsce">·</span>}</div>})}</div><button className="primary" onClick={close}>Wracam do spaceru.</button></Dialog>
  :overlay==='housing'?<HousingEditor state={state} content={content} initialItem={housingItem} onChange={next=>update(()=>next)} onClose={close} onPreview={preview} actions={housingActions}/>
  :overlay==='menu'?<Dialog label="Menu wioski" onBack={close}><span className="eyebrow">Chwila odpoczynku</span><h2>Twój spacer</h2><CameraSettings distance={state.camera.distance} onChange={changeCameraDistance}/><NightSettings night={!!state.flags[NIGHT_FLAG]} onChange={night=>update(s=>({...s,flags:{...s.flags,[NIGHT_FLAG]:night}}))}/><div className="quest-list">{state.location==='home'&&!state.flags.hosting&&<button className="secondary" onClick={()=>{setHousingItem(undefined);setOverlay('housing')}}>Urządź dom</button>}<button className="secondary" onClick={()=>setOverlay('journal')}>Otwórz dziennik</button><button className="secondary" onClick={()=>setOverlay('inventory')}>Zajrzyj do plecaka</button><button className="secondary" onClick={()=>setOverlay('new-game')}>Zacznij nową grę</button></div><dl className="control-list"><div><dt>Przód / tył, obrót</dt><dd>↑ ↓ / ← →</dd></div><div><dt>Ruch względem kamery</dt><dd>WASD · lewy drążek · joystick</dd></div><div><dt>Rozmowa i przedmioty</dt><dd>E · A na padzie</dd></div><div><dt>Dziennik</dt><dd>Y na padzie</dd></div></dl><p className="quiet">Postęp zapisuje się na tym urządzeniu.</p><button className="primary" onClick={close}>Wracam do spaceru.<Icon name="arrow"/></button></Dialog>
  :overlay==='new-game'?<Dialog label="Zacząć nową grę?" onBack={close}><span className="eyebrow">Nowa przygoda</span><h2>Zacząć nową grę?</h2><p>Dotychczasowy postęp zostanie usunięty. Kitek zacznie przygodę od początku.</p><div className="quest-list"><button className="primary" onClick={close}>Nie, wróć do menu</button><button className="secondary" onClick={startNewGame}>Tak, zacznij od nowa</button></div></Dialog>:null}
 </main>
 {editorMode&&!editorOpen&&<button className="story-editor-launcher" onClick={openEditor}>Edytor fabuły<span>Tryb testowy</span></button>}
 {editorMode&&baseContent&&<Suspense fallback={<div className="loading">Otwieranie edytora…</div>}><StoryEditor base={baseContent} state={state} open={editorOpen} onClose={()=>setEditorOpen(false)} onApply={applyStory}/></Suspense>}
 </>;
}
