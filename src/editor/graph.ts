import type {ContentPack,Effect,StoryNode} from '../content/types';
import type {SaveState} from '../persistence/state';
import {applyEffects,matches} from '../story/engine';
import {validatePack} from '../content/validate';
export const GRAPH_KEY='czytajaca-wioska-graph-v1';
export const labels={start:'Start / rozmowa',dialogue:'Dialog NPC',condition:'Warunek flagi',inventory:'Sprawdź plecak',giveItem:'Dodaj przedmiot',takeItem:'Odbierz przedmiot',flag:'Ustaw flagę',action:'Akcja świata',end:'Koniec'};
export type Kind=keyof typeof labels;
export type GraphNode={id:string;type:Kind;position:{x:number;y:number};data:{target?:string;speaker?:string;text?:string;key?:string;value?:boolean;itemId?:string;quantity?:number;comparison?:'gte'|'eq'|'lt';effect?:Effect}};
export type GraphEdge={id:string;source:string;target:string;sourceHandle:string};
export type Graph={version:1;id:string;nodes:GraphNode[];edges:GraphEdge[]};
export function ports(n:GraphNode){return n.type==='end'?[]:['condition','inventory'].includes(n.type)?['yes','no']:['next']}
const safe=(v:unknown):v is string=>typeof v==='string'&&/^[a-z][a-z0-9-]{0,63}$/.test(v)&&!['constructor','prototype'].includes(v);
const object=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
function keys(v:Record<string,unknown>,allowed:string[]){return Object.keys(v).every(k=>allowed.includes(k))}
export function validateGraph(value:unknown,pack:ContentPack,complete=true):Graph{
 const fail=(s:string):never=>{throw new Error(s)};
 if(!object(value)||!keys(value,['version','id','nodes','edges'])||value.version!==1||!safe(value.id)||!Array.isArray(value.nodes)||!Array.isArray(value.edges)||value.nodes.length>200||value.edges.length>400)fail('Niepoprawny format grafu (wersja 1, do 200 bloczków).');
 const g=value as unknown as Graph,ids=new Set<string>(),edgeIds=new Set<string>();
 for(const n of g.nodes){
  if(!object(n)||!keys(n,['id','type','position','data'])||!safe(n.id)||ids.has(n.id)||!Object.hasOwn(labels,n.type)||!object(n.position)||!keys(n.position,['x','y'])||![n.position.x,n.position.y].every(v=>typeof v==='number'&&Number.isFinite(v)&&Math.abs(v)<100000)||!object(n.data))fail('Niepoprawny lub powtórzony bloczek.');
  ids.add(n.id);const d=n.data;
  const fields:Record<Kind,string[]>={start:['target'],dialogue:['speaker','text'],condition:['key','value'],inventory:['itemId','quantity','comparison'],giveItem:['itemId','quantity'],takeItem:['itemId','quantity'],flag:['key','value'],action:['effect'],end:[]};
  if(!keys(d,fields[n.type]))fail(`${n.id}: niedozwolone pola.`);
  if(n.type==='start'&&!pack.characters.some(c=>c.id===d.target)&&!pack.interactions.some(c=>c.id===d.target))fail(`${n.id}: wybierz cel rozmowy.`);
  if(n.type==='dialogue'&&(!pack.characters.some(c=>c.id===d.speaker)||typeof d.text!=='string'||!d.text.trim()||d.text.length>2000))fail(`${n.id}: wybierz postać i wpisz tekst (do 2000 znaków).`);
  if(['condition','flag'].includes(n.type)&&(!safe(d.key)||typeof d.value!=='boolean'))fail(`${n.id}: niepoprawna flaga.`);
  if(['inventory','giveItem','takeItem'].includes(n.type)&&(!pack.items.some(i=>i.id===d.itemId)||!Number.isSafeInteger(d.quantity)||d.quantity!<1||d.quantity!>999))fail(`${n.id}: wybierz przedmiot i liczbę 1–999.`);
  if(n.type==='inventory'&&!['gte','eq','lt'].includes(d.comparison!))fail(`${n.id}: wybierz porównanie.`);
  if(n.type==='action'){
   const copy=structuredClone(pack);copy.story.nodes[0].choices[0].effects.push(d.effect!);
   try{validatePack(copy)}catch(e){fail(`${n.id}: ${String(e)}`)}
  }
 }
 const starts=g.nodes.filter(n=>n.type==='start');if(starts.length!==1)fail('Graf musi mieć dokładnie jeden Start.');
 const used=new Set<string>();
 for(const e of g.edges){const source=g.nodes.find(n=>n.id===e.source),target=g.nodes.find(n=>n.id===e.target),port=`${e.source}:${e.sourceHandle}`;
  if(!object(e)||!keys(e,['id','source','target','sourceHandle'])||!safe(e.id)||edgeIds.has(e.id)||!source||!target||target.type==='start'||!ports(source).includes(e.sourceHandle)||used.has(port))fail('Niedozwolone połączenie: port może mieć tylko jedno wyjście, bez wejść do Start.');
  used.add(port);edgeIds.add(e.id);
 }
 const visited=new Set<string>(),active=new Set<string>();
 function visit(id:string){if(active.has(id))fail(`Cykl przy ${id}. Ponowienie rozmowy uruchamia Start; usuń pętlę.`);if(visited.has(id))return;active.add(id);for(const e of g.edges.filter(e=>e.source===id))visit(e.target);active.delete(id);visited.add(id)}
 // Check cycles in disconnected components too.
 for(const n of g.nodes)visit(n.id);
 if(complete){
  for(const n of g.nodes)for(const p of ports(n))if(!used.has(`${n.id}:${p}`))fail(`${n.id}: podłącz wyjście ${p==='yes'?'TAK':p==='no'?'NIE':'Dalej'}.`);
  const reachable=new Set<string>();function reach(id:string){if(reachable.has(id))return;reachable.add(id);g.edges.filter(e=>e.source===id).forEach(e=>reach(e.target))}reach(starts[0].id);
  for(const n of g.nodes)if(!reachable.has(n.id))fail(`${n.id}: bloczek nieosiągalny od Start.`);
 }
 return structuredClone(g);
}
export function parseGraph(raw:string,pack:ContentPack,complete=true){if(raw.length>1_000_000)throw new Error('Graf jest za duży (maks. 1 MB).');return validateGraph(JSON.parse(raw),pack,complete)}
export function createNode(type:Kind,pack:ContentPack,id=`node-${crypto.randomUUID()}`,x=0,y=0):GraphNode{
 const data:GraphNode['data']=type==='start'?{target:'bruno'}:type==='dialogue'?{speaker:'bruno',text:'Cześć, Kitku!'}:['condition','flag'].includes(type)?{key:'nowa-flaga',value:true}:['inventory','giveItem','takeItem'].includes(type)?{itemId:'apple',quantity:3,...(type==='inventory'?{comparison:'gte' as const}:{})}:type==='action'?{effect:{type:'complete',sceneId:pack.story.scenes[0].id}}:{};
 return {id,type,position:{x,y},data};
}
export function demoGraph(pack:ContentPack):Graph{
 const types:Kind[]=['start','dialogue','inventory','takeItem','dialogue','action','end','dialogue','end'];
 const nodes=types.map((type,i)=>createNode(type,pack,`demo-${i}`,i<3?i*260:i<7?(i-3)*260+780:780+(i-7)*260,i<7?80:330));
 nodes[1].data.text='Przynieś mi trzy jabłka.';nodes[4].data.text='Dziękuję!';nodes[7].data.text='Czekam na jabłka.';
 const links:[number,number,string][]=[[0,1,'next'],[1,2,'next'],[2,3,'yes'],[3,4,'next'],[4,5,'next'],[5,6,'next'],[2,7,'no'],[7,8,'next']];
 return {version:1,id:'bruno-apples',nodes,edges:links.map(([a,b,p],i)=>({id:`edge-${i}`,source:nodes[a].id,target:nodes[b].id,sourceHandle:p}))};
}
export type GraphStep={state:SaveState;cursor:string|null;dialogue:StoryNode|null;message:string};
// Only control flow lives here. All game mutations and flag checks use the existing story engine.
export function advanceGraph(g:Graph,pack:ContentPack,state:SaveState,cursor?:string|null):GraphStep{
 validateGraph(g,pack);let current=cursor===undefined?g.nodes.find(n=>n.type==='start')!.id:cursor,next=state;
 for(let budget=0;current&&budget<201;budget++){
  const n=g.nodes.find(n=>n.id===current)!;let port='next';const d=n.data;
  const follow=(p:string)=>g.edges.find(e=>e.source===n.id&&e.sourceHandle===p)?.target??null;
  if(n.type==='end')return {state:next,cursor:null,dialogue:null,message:''};
  if(n.type==='dialogue')return {state:next,cursor:follow('next'),message:'',dialogue:{id:n.id,event:'interact',target:g.nodes.find(n=>n.type==='start')!.data.target!,speaker:d.speaker!,lines:d.text!.split('\n'),priority:999,once:false,when:[],choices:[{id:'graph-next',label:'Dalej',effects:[]}]}};
  if(n.type==='condition')port=matches(next,[{type:'flag',key:d.key!,value:d.value!}])?'yes':'no';
  if(n.type==='inventory'){const count=next.inventory[d.itemId!]??0;port=(d.comparison==='eq'?count===d.quantity:d.comparison==='lt'?count<d.quantity!:matches(next,[{type:'item',itemId:d.itemId!,quantity:d.quantity!}]))?'yes':'no'}
  let effect:Effect|undefined;
  if(n.type==='action')effect=d.effect;
  if(n.type==='flag')effect={type:'flag',key:d.key!,value:d.value!};
  if(n.type==='giveItem'||n.type==='takeItem')effect={type:n.type,itemId:d.itemId!,quantity:d.quantity!};
  if(effect){const result=applyEffects(pack,next,[effect]);if(result.message)return {state,cursor:current,dialogue:null,message:result.message};next=result.state}
  current=follow(port);
 }
 return {state:next,cursor:null,dialogue:null,message:''};
}
