import type {Manifest,ContentPack,CharacterDefinition,ItemDefinition,QuestDefinition} from './types';
type Obj=Record<string,unknown>;
function fail(path:string,message:string):never{throw new Error(`${path}: ${message}`)}
function obj(v:unknown,p:string,keys:string[]):Obj{
  if(!v||typeof v!=='object'||Array.isArray(v))fail(p,'oczekiwano obiektu');
  for(const key of Object.keys(v))if(key!=='$schema'&&!keys.includes(key))fail(`${p}.${key}`,'nieznane pole');return v as Obj;
}
function text(v:unknown,p:string){if(typeof v!=='string'||!v.trim()||v.length>1200)fail(p,'wymagany tekst (1–1200 znaków)');return v}
function id(v:unknown,p:string){const s=text(v,p);if(!/^[a-z][a-z0-9-]{0,63}$/.test(s)||['constructor','prototype'].includes(s))fail(p,'użyj małych liter, cyfr i myślników');return s}
function number(v:unknown,p:string,min:number,max:number,integer=false){if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max||(integer&&!Number.isInteger(v)))fail(p,`wymagana ${integer?'całkowita ':''}liczba od ${min} do ${max}`);return v}
function list(v:unknown,p:string,min=0,max=100):unknown[]{if(!Array.isArray(v)||v.length<min||v.length>max)fail(p,`wymagana lista o długości ${min}–${max}`);return v}
function lines(v:unknown,p:string){return list(v,p,1,12).map((x,i)=>text(x,`${p}[${i}]`))}
function unique(values:string[],p:string){if(new Set(values).size!==values.length)fail(p,'powtarzające się identyfikatory')}
function position(v:unknown,p:string,heading=false){const o=obj(v,p,heading?['x','z','heading']:['x','z']);number(o.x,`${p}.x`,-48,48);number(o.z,`${p}.z`,-48,48);if(heading)number(o.heading,`${p}.heading`,-Math.PI*2,Math.PI*2)}
function file(v:unknown,p:string){const s=text(v,p);if(!/^(?:[a-z0-9-]+\/)*[a-z0-9-]+\.json$/.test(s))fail(p,'wymagana względna ścieżka do JSON wewnątrz content');return s}
export function validateManifest(v:unknown):Manifest{
  const m=obj(v,'manifest',['version','characters','items','quests']);if(m.version!==1)fail('manifest.version','obsługiwana wersja: 1');
  file(m.characters,'manifest.characters');file(m.items,'manifest.items');const quests=list(m.quests,'manifest.quests',1,100).map((x,i)=>file(x,`manifest.quests[${i}]`));unique(quests,'manifest.quests');return m as Manifest;
}
export function validateCharacters(v:unknown):CharacterDefinition[]{
  const entries=list(v,'characters',1,20);
  entries.forEach((value,i)=>{const p=`characters[${i}]`,c=obj(value,p,['id','name','role','model','position','behavior']);id(c.id,`${p}.id`);text(c.name,`${p}.name`);text(c.role,`${p}.role`);if(!['bruno','fela'].includes(String(c.model)))fail(`${p}.model`,'dostępne modele: bruno, fela');position(c.position,`${p}.position`,true);
    const b=obj(c.behavior,`${p}.behavior`,['type','speed','pauseSeconds','waypoints']);
    if(b.type==='idle'){obj(b,`${p}.behavior`,['type'])}else if(b.type==='patrol'){number(b.speed,`${p}.behavior.speed`,.1,1.5);number(b.pauseSeconds,`${p}.behavior.pauseSeconds`,0,30);list(b.waypoints,`${p}.behavior.waypoints`,2,12).forEach((w,j)=>position(w,`${p}.behavior.waypoints[${j}]`))}else fail(`${p}.behavior.type`,'dostępne zachowania: idle, patrol');
  });const characters=entries as CharacterDefinition[];unique(characters.map(c=>c.id),'characters');return characters;
}
export function validateItems(v:unknown):ItemDefinition[]{const entries=list(v,'items',1,100);entries.forEach((x,i)=>{const p=`items[${i}]`,o=obj(x,p,['id','name','icon']);id(o.id,`${p}.id`);text(o.name,`${p}.name`);if(!['seed','apple'].includes(String(o.icon)))fail(`${p}.icon`,'dostępne ikony: seed, apple')});const items=entries as ItemDefinition[];unique(items.map(x=>x.id),'items');return items}
export function validateQuest(v:unknown,path='quest'):QuestDefinition{
  const q=obj(v,path,['version','id','revision','npcId','title','description','requires','dialogue','exercise','feedback','reward']);if(q.version!==1)fail(`${path}.version`,'obsługiwana wersja: 1');
  id(q.id,`${path}.id`);id(q.npcId,`${path}.npcId`);number(q.revision,`${path}.revision`,1,9999,true);text(q.title,`${path}.title`);text(q.description,`${path}.description`);
  const requires=list(q.requires,`${path}.requires`).map((x,i)=>id(x,`${path}.requires[${i}]`));unique(requires,`${path}.requires`);
  const d=obj(q.dialogue,`${path}.dialogue`,['intro','active','completed','acceptLabel','replayLabel']);for(const k of ['intro','active','completed'])lines(d[k],`${path}.dialogue.${k}`);for(const k of ['acceptLabel','replayLabel'])text(d[k],`${path}.dialogue.${k}`);
  const e=obj(q.exercise,`${path}.exercise`,['id','type','prompt','target','choices','hint','targetParts']);for(const k of ['prompt','target','hint'])text(e[k],`${path}.exercise.${k}`);id(e.id,`${path}.exercise.id`);const choices=list(e.choices,`${path}.exercise.choices`,2,8).map((x,i)=>text(x,`${path}.exercise.choices[${i}]`));
  if(choices.some(x=>x.length>12))fail(`${path}.exercise.choices`,'kafelek może mieć najwyżej 12 znaków');
  if(e.type==='syllable-choice'){unique(choices,`${path}.exercise.choices`);if(!choices.includes(String(e.target)))fail(`${path}.exercise.target`,'odpowiedź musi występować na liście choices');if(e.targetParts!==undefined)fail(`${path}.exercise.targetParts`,'pole dostępne tylko dla syllable-build')}
  else if(e.type==='syllable-build'){
    const parts=list(e.targetParts,`${path}.exercise.targetParts`,2,6).map((x,i)=>text(x,`${path}.exercise.targetParts[${i}]`));if(parts.join('')!==e.target)fail(`${path}.exercise.targetParts`,'złączenie sylab musi dawać target');
    const remaining=[...choices];for(const part of parts){const i=remaining.indexOf(part);if(i<0)fail(`${path}.exercise.choices`,`brakuje kafelka ${part}`);remaining.splice(i,1)}
  }else fail(`${path}.exercise.type`,'dostępne typy: syllable-choice, syllable-build');
  const feedback=obj(q.feedback,`${path}.feedback`,['retry','success','practice']);for(const k of ['retry','success','practice'])text(feedback[k],`${path}.feedback.${k}`);
  const reward=obj(q.reward,`${path}.reward`,['itemId','quantity']);id(reward.itemId,`${path}.reward.itemId`);number(reward.quantity,`${path}.reward.quantity`,1,99,true);return q as QuestDefinition;
}
export function validatePack(characters:unknown,items:unknown,quests:unknown[],paths?:string[]):ContentPack{
  const pack={characters:validateCharacters(characters),items:validateItems(items),quests:quests.map((q,i)=>validateQuest(q,paths?.[i]??`quests[${i}]`))};unique(pack.quests.map(q=>q.id),'quests');
  for(const q of pack.quests){if(!pack.characters.some(c=>c.id===q.npcId))fail(q.id,`nieznana postać ${q.npcId}`);if(!pack.items.some(i=>i.id===q.reward.itemId))fail(q.id,`nieznany przedmiot ${q.reward.itemId}`);for(const required of q.requires)if(!pack.quests.some(q=>q.id===required))fail(q.id,`nieznane wymagane zadanie ${required}`)}
  const visited=new Set<string>();function visit(q:QuestDefinition,path:Set<string>){if(path.has(q.id))fail(q.id,'cykl w wymaganiach zadań');if(visited.has(q.id))return;const next=new Set([...path,q.id]);for(const key of q.requires)visit(pack.quests.find(q=>q.id===key)!,next);visited.add(q.id)}
  for(const q of pack.quests)visit(q,new Set());return pack;
}
