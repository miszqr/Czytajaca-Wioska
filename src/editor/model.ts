import type {ContentPack,StoryNode} from '../content/types';
import {validatePack} from '../content/validate';
import {findNode,matches} from '../story/engine';
import type {SaveState} from '../persistence/state';

export const FILES=['story','interactions','characters','items'] as const;
export type ContentFile=typeof FILES[number];
export type Draft=Record<ContentFile,string>;
export const DRAFT_KEY='czytajaca-wioska-story-editor-draft-v1';
export const json=(value:unknown)=>JSON.stringify(value,null,2)+'\n';
export function toDraft(pack:ContentPack):Draft{return Object.fromEntries(FILES.map(key=>[key,json(pack[key])])) as Draft}
export function parseDraft(draft:Draft):ContentPack{
 const pack=Object.fromEntries(FILES.map(key=>{try{return [key,JSON.parse(draft[key])]}catch{throw new Error(`public/content/${key}.json: niepoprawny JSON`)}}));
 return validatePack(pack);
}
export function exportedFiles(base:ContentPack,draft:Draft){
 const pack=parseDraft(draft);
 return FILES.filter(key=>json(base[key])!==json(pack[key])).map(key=>({key,path:`public/content/${key}.json`,before:json(base[key]),after:json(pack[key])}));
}
export function restoreDraft(base:ContentPack,raw:string|null):{draft:Draft;warning:string}{
 if(!raw)return {draft:toDraft(base),warning:''};
 try{
  const saved=JSON.parse(raw);
  if(saved.version!==1||!FILES.every(k=>typeof saved.draft?.[k]==='string'))throw new Error();
  return {draft:saved.draft,warning:saved.base===JSON.stringify(base)?'':'Gra zmieniła się od zapisania szkicu. Porównaj pliki z aktualną wersją przed eksportem.'};
 }catch{return {draft:toDraft(base),warning:'Nie udało się odczytać lokalnego szkicu. Zachowano go w pamięci przeglądarki; nie nadpisuj go bez sprawdzenia.'}}
}
export function draftSnapshot(base:ContentPack,draft:Draft){return JSON.stringify({version:1,base:JSON.stringify(base),draft})}
export function importDraft(raw:string):Draft{
 const value=JSON.parse(raw);
 const draft=value.version===1&&value.draft?value.draft:toDraft(validatePack(value));
 parseDraft(draft);return draft;
}
export function diagnoseNodes(pack:ContentPack,state:SaveState,target:string,event:StoryNode['event']){
 const selected=findNode(pack,state,target,event);
 return pack.story.nodes.filter(n=>n.target===target&&n.event===event).sort((a,b)=>b.priority-a.priority).map(node=>{
  const reasons:string[]=[];
  if(node.once&&state.seen.includes(node.id))reasons.push('Już wykonano (jednorazowy)');
  for(const c of node.when)if(!matches(state,[c]))reasons.push(c.type==='flag'?`Flaga ${c.key} musi być ${c.value?'włączona':'wyłączona'}`:`Potrzeba: ${c.itemId} × ${c.quantity}`);
  if(!reasons.length&&selected?.id!==node.id)reasons.push(selected?'Inny wariant ma wyższy priorytet':'Cel jest niedostępny w tej lokalizacji lub nie spełnia warunków');
  return {node,reasons,selected:selected?.id===node.id};
 });
}
export function stateChanges(before:SaveState,after:SaveState){
 return (['flags','inventory','completed','seen','read','location','player','furniture'] as const).filter(k=>JSON.stringify(before[k])!==JSON.stringify(after[k])).map(k=>`${k}: ${JSON.stringify(before[k])} → ${JSON.stringify(after[k])}`);
}
// A compact replacement hunk: unchanged prefix/suffix are omitted, with context.
export function diffLines(before:string,after:string):string{
 const a=before.trimEnd().split('\n'),b=after.trimEnd().split('\n');let start=0,end=0;
 while(start<Math.min(a.length,b.length)&&a[start]===b[start])start++;
 if(start===a.length&&start===b.length)return 'Brak zmian';
 while(end<Math.min(a.length,b.length)-start&&a[a.length-1-end]===b[b.length-1-end])end++;
 const context=a.slice(Math.max(0,start-2),start).map(s=>' '+s);
 return [`@@ od linii ${start+1} @@`,...context,...a.slice(start,a.length-end).map(s=>'- '+s),...b.slice(start,b.length-end).map(s=>'+ '+s),...a.slice(a.length-end,a.length-end+2).map(s=>' '+s)].join('\n');
}
