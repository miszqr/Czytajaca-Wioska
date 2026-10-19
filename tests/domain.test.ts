import {describe,it,expect} from 'vitest';
import 'fake-indexeddb/auto';
import {DEFAULT_CONTENT} from '../src/content/defaults';
import {answerExercise,emptyProgress} from '../src/reading/model';
import {newQuest} from '../src/quests/model';
import {beginQuest,hintQuest,meetQuest,reconcileContent,submitQuest} from '../src/quests/engine';
import {newSave,validateSave} from '../src/persistence/state';
import {SaveStore} from '../src/persistence/store';
const [bruno,fela]=DEFAULT_CONTENT.quests;
const initial=()=>reconcileContent(newSave(),DEFAULT_CONTENT);
const completed=()=>submitQuest(beginQuest(initial(),bruno),bruno,'MA').state;
describe('zadania i nagrody',()=>{
 it('zła próba i podpowiedź nie karzą; dwa zadania zapisują osobne jednorazowe nagrody',()=>{
  let s=beginQuest(meetQuest(initial(),bruno),bruno);
  s=submitQuest(s,bruno,'LA').state;expect(s.quests[bruno.id].status).toBe('active');expect(s.inventory).toEqual({});
  s=hintQuest(s,bruno);s=submitQuest(s,bruno,'MA').state;
  expect(s.quests[bruno.id]).toMatchObject({status:'completed',introduced:true,reading:{hints:1,completed:true}});
  expect(s.quests[bruno.id].reading.attempts).toHaveLength(2);
  const wrongReplay=submitQuest(s,bruno,'LA');expect(wrongReplay.correct).toBe(false);expect(wrongReplay.state.inventory).toEqual({'mak-seed':1});
  s=submitQuest(wrongReplay.state,bruno,'MA').state;
  s=submitQuest(beginQuest(s,fela),fela,[1,0]).state;
  expect(s.inventory).toEqual({'mak-seed':1,apple:1});expect(s.quests[fela.id].status).toBe('completed');
  expect(submitQuest(s,fela,[1,0]).state.inventory).toEqual(s.inventory);
 });
 it('nie przyjmuje odpowiedzi bez startu i respektuje wymagane zadanie',()=>{
  const s=initial(),locked={...fela,requires:[bruno.id]};
  expect(submitQuest(s,bruno,'MA').state).toBe(s);expect(beginQuest(s,locked)).toBe(s);
  expect(beginQuest(completed(),locked).quests[fela.id].status).toBe('active');
 });
 it('ignoruje podrobione i niepełne kafelki; obsługuje dwie identyczne sylaby',()=>{
  const p=emptyProgress();expect(answerExercise(bruno.exercise,p,'XX')).toBe(p);
  for(const answer of [[1],[1,1],[-1,0],[9,0],[.5,0],'MASŁO'])expect(answerExercise(fela.exercise,p,answer)).toBe(p);
  const exercise={...fela.exercise,type:'syllable-build' as const,target:'MAMA',targetParts:['MA','MA'],choices:['MA','MA','LA']};
  expect(answerExercise(exercise,p,[0,1]).completed).toBe(true);
  expect(answerExercise(fela.exercise,p,[0,1]).attempts[0]).toMatchObject({answer:'SŁOMA',correct:false});
 });
 it('zmiana tekstu zachowuje postęp; rewizja resetuje tylko niedokończone próby, nie nagrody',()=>{
  let s=submitQuest(beginQuest(initial(),fela),fela,[0,1]).state;
  const texts={...DEFAULT_CONTENT,quests:DEFAULT_CONTENT.quests.map(q=>({...q,title:'Nowy tytuł'}))};
  expect(reconcileContent(s,texts).quests[fela.id].reading.attempts).toHaveLength(1);
  s=submitQuest(beginQuest(s,bruno),bruno,'MA').state;
  const pack={...DEFAULT_CONTENT,quests:DEFAULT_CONTENT.quests.map(q=>({...q,revision:2}))},changed=reconcileContent(s,pack);
  expect(changed.quests[fela.id]).toMatchObject({status:'active',revision:2,reading:{attempts:[]}});
  expect(changed.quests[bruno.id].rewardGranted).toBe(true);expect(submitQuest(changed,pack.quests[0],'MA').state.inventory).toEqual({'mak-seed':1});
  expect(reconcileContent(changed,{...pack,quests:[pack.quests[1]]}).quests[bruno.id]).toEqual(changed.quests[bruno.id]);
 });
 it('pełny plecak nie gubi nagrody; istniejący typ przedmiotu nadal się mieści',()=>{
  let s=beginQuest(initial(),fela);s.inventory=Object.fromEntries(Array.from({length:12},(_,i)=>[`item-${i}`,1]));
  const pending=submitQuest(s,fela,[1,0]);expect(pending.rewardPending).toBe(true);expect(pending.state.quests[fela.id].rewardGranted).toBe(false);expect(validateSave(pending.state)).not.toBeNull();
  delete pending.state.inventory['item-0'];expect(submitQuest(pending.state,fela,[1,0]).state.inventory.apple).toBe(1);
  s.inventory={'mak-seed':1,...s.inventory};delete s.inventory['item-0'];s=beginQuest(s,bruno);
  expect(submitQuest(s,bruno,'MA').state.inventory['mak-seed']).toBe(2);
 });
});
describe('zapis',()=>{
 it('migruje P0 z nasionkiem, zachowuje pozycję i próby, dopisuje nowe zadanie',()=>{
  const old={...newSave(),version:1,quest:{status:'completed',rewardGranted:true,reading:{completed:true,hints:1,attempts:[{answer:'MA',correct:true,at:10}]}},player:{x:-3,z:2,heading:1}};
  const migrated=validateSave(old)!;expect(migrated.version).toBe(2);expect(migrated.player).toEqual(old.player);expect(migrated.inventory).toEqual({'mak-seed':1});expect(migrated.quests[bruno.id].reading).toEqual(old.quest.reading);
  const s=reconcileContent(migrated,DEFAULT_CONTENT);expect(s.quests[fela.id].status).toBe('available');expect(submitQuest(s,bruno,'MA').state.inventory['mak-seed']).toBe(1);
  expect(validateSave({...old,quest:{...newQuest(),status:'active'}})?.inventory).toEqual({});
 });
 it('odrzuca uszkodzone dane i przyszłe schematy',()=>{
  expect(validateSave({...newSave(),version:3})).toBeNull();expect(validateSave({...newSave(),player:{x:NaN,z:0,heading:0}})).toBeNull();
  expect(validateSave({...initial(),quests:{[bruno.id]:{...newQuest(),status:'completed'}}})).toBeNull();
  expect(validateSave({...newSave(),inventory:{apple:-1}})).toBeNull();
 });
 it('odtwarza oba zadania, plecak i pozycję przez nowe połączenie IndexedDB',async()=>{
  const first=new SaveStore(),s=submitQuest(beginQuest(completed(),fela),fela,[1,0]).state;s.player={x:3,z:4,heading:1.2};
  await first.save(s);await first.close();const second=new SaveStore(),loaded=await second.load();
  expect(loaded?.player).toEqual(s.player);expect(loaded?.quests).toEqual(s.quests);expect(loaded?.inventory).toEqual(s.inventory);expect(second.mode).toBe('indexeddb');await second.close();
 });
 it('kolejka zachowuje najnowszy zapis',async()=>{const store=new SaveStore(),a=newSave(),b=newSave();b.player.x=8;await Promise.all([store.save(a),store.save(b)]);expect((await store.load())?.player.x).toBe(8);await store.close()});
 it('nie nadpisuje nieobsługiwanej wersji zapisu',async()=>{
  const db=await new Promise<IDBDatabase>(resolve=>{const req=indexedDB.open('czytajaca-wioska',1);req.onsuccess=()=>resolve(req.result)});
  const future={version:99,important:'zachowaj'};
  await new Promise<void>(resolve=>{const tx=db.transaction('saves','readwrite');tx.objectStore('saves').put(future,'p0');tx.oncomplete=()=>resolve()});
  const store=new SaveStore();await expect(store.load()).rejects.toThrow('Nie został nadpisany');await store.close();
  const raw=await new Promise<unknown>(resolve=>{const req=db.transaction('saves').objectStore('saves').get('p0');req.onsuccess=()=>resolve(req.result)});expect(raw).toEqual(future);db.close();
 });
});
