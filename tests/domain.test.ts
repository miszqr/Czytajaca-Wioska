import {describe,it,expect} from 'vitest';
import 'fake-indexeddb/auto';
import {DEFAULT_CONTENT} from '../src/content/defaults';
import {choose,findNode,currentScene} from '../src/story/engine';
import {newSave,validateSave,type SaveState} from '../src/persistence/state';
import {SaveStore} from '../src/persistence/store';
const p=DEFAULT_CONTENT;
function act(s:SaveState,target:string){const node=findNode(p,s,target);expect(node,`interaction ${target}`).toBeDefined();return choose(p,s,node!.id,node!.choices[0].id).state}
describe('P0 opowieści',()=>{
 it('rozmowa → drzwi → list; można przerwać i wznowić bez ponownego powitania',()=>{
  let s=newSave();expect(currentScene(p,s)?.id).toBe('arrival');s=act(s,'bruno');expect(s.flags['met-bruno']).toBe(true);expect(findNode(p,s,'bruno')?.id).toBe('bruno-chat');
  s=act(s,'home-door');expect(s.location).toBe('home');expect(s.completed).toContain('arrival');expect(findNode(p,s,'home-door')).toBeUndefined();
  s=validateSave(s)!;s=act(s,'fela-letter');expect(s.read).toEqual(['fela-letter']);expect(s.completed).toEqual(['arrival','home']);
  expect(act(s,'fela-letter').read).toHaveLength(1);s=act(s,'home-exit');expect(s.location).toBe('village');expect(s.read).toHaveLength(1);
 });
 it('odrzuca nieaktualne wybory, nie ma oceny tekstowej ani punktów',()=>{
  const s=act(newSave(),'bruno');expect(choose(p,s,'bruno-welcome','go').state).toBe(s);expect('score' in s).toBe(false);expect('quests' in s).toBe(false);
 });
});
describe('zapis fabuły',()=>{
 it('migruje P0 i przygotowany format v2, zachowując pozycję i pamiątki',()=>{
  const old={...newSave(),version:1,quest:{status:'completed',rewardGranted:true,reading:{completed:true,attempts:[],hints:0}},player:{x:-3,z:2,heading:1}};
  const s=validateSave(old)!;expect(s.version).toBe(3);expect(s.player).toEqual(old.player);expect(s.inventory).toEqual({'mak-seed':1});expect(s.completed).toEqual([]);expect(s.furniture).toHaveLength(2);
  expect(validateSave({...old,version:2,quests:{},inventory:{apple:1}})?.inventory).toEqual({apple:1});
 });
 it('odrzuca nieznaną wersję, uszkodzone flagi, pozycje i ekwipunek',()=>{
  expect(validateSave({...newSave(),version:99})).toBeNull();expect(validateSave({...newSave(),flags:{a:'yes'}})).toBeNull();expect(validateSave({...newSave(),player:{x:NaN,z:0,heading:0}})).toBeNull();expect(validateSave({...newSave(),inventory:{apple:-1}})).toBeNull();expect(validateSave({...newSave(),read:['same','same']})).toBeNull();
 });
 it('odtwarza wnętrze, list, flagi i meble przez nowe połączenie IndexedDB',async()=>{
  const first=new SaveStore(),s=act(act(newSave(),'home-door'),'fela-letter');await first.save(s);await first.close();const second=new SaveStore(),saved=await second.load();expect(saved).toMatchObject({location:'home',read:['fela-letter'],flags:s.flags,furniture:s.furniture,player:s.player});await second.close();
 });
 it('kolejka zachowuje najnowszy zapis',async()=>{const store=new SaveStore(),a=newSave(),b=newSave();b.player.x=8;await Promise.all([store.save(a),store.save(b)]);expect((await store.load())?.player.x).toBe(8);await store.close()});
 it('archiwizuje starszy format przed migracją, nie nadpisuje przyszłego',async()=>{
  const db=await new Promise<IDBDatabase>(resolve=>{const r=indexedDB.open('czytajaca-wioska',1);r.onsuccess=()=>resolve(r.result)});
  const write=(value:unknown)=>new Promise<void>(resolve=>{const tx=db.transaction('saves','readwrite');tx.objectStore('saves').put(value,'p0');tx.oncomplete=()=>resolve()});
  const read=(key:string)=>new Promise<unknown>(resolve=>{const r=db.transaction('saves').objectStore('saves').get(key);r.onsuccess=()=>resolve(r.result)});
  const old={...newSave(),version:1,quest:{status:'completed',rewardGranted:true,reading:{completed:true,attempts:[],hints:0}}};await write(old);const store=new SaveStore(),migrated=await store.load();expect(await read('legacy-v1')).toEqual(old);await store.save(migrated!);expect(await read('legacy-v1')).toEqual(old);
  await write({version:99,keep:'all'});await expect(store.load()).rejects.toThrow('Nie został nadpisany');expect(await read('p0')).toEqual({version:99,keep:'all'});await store.close();db.close();
 });
});
describe('P1 — pełna opowieść',()=>{
 it('przechodzi wszystkie osiem scen, wznawia każdy krok i nie powiela przedmiotów',()=>{
  let s=newSave();const route=['bruno','home-door','fela-letter','home-exit','fela','home-door','bedside','cabinet','home-exit','bruno','bruno-crate','garden-drop','bruno','home-door','cabinet','cabinet','home-exit','tola','milus','bruno','fela','tola','home-door','home-bell'];
  for(const target of route){const n=findNode(p,s,target);expect(n,`target ${target}`).toBeDefined();const result=choose(p,s,n!.id,n!.choices[0].id);expect(result.message,`step ${target}: ${n!.id}`).toBe('');s=result.state;const restored=validateSave(structuredClone(s));expect(restored,`restore ${target}`).toEqual(s);s=restored!}
  expect(s.completed).toEqual(p.story.scenes.map(s=>s.id));expect(s.flags.hosting).toBe(true);expect(s.flags['story-complete']).toBe(true);expect(s.inventory).toEqual({book:1});expect(s.furniture.filter(f=>f.itemId==='lamp')).toHaveLength(1);expect(s.read).toContain('first-meeting');
  for(const npc of ['bruno','fela','tola','milus']){expect(findNode(p,s,npc)?.id).toBe('guest-'+npc);s=act(s,npc)}
  s=act(s,'home-bell');expect(s.flags.hosting).toBe(false);s=act(s,'home-exit');for(const npc of ['bruno','fela','tola','milus'])s=act(s,npc);expect(s.inventory).toEqual({book:1});expect(s.furniture.filter(f=>f.itemId==='lamp')).toHaveLength(1);
  s=act(s,'home-door');s=act(s,'home-bell');expect(s.flags.hosting).toBe(true);expect(s.read.filter(id=>id==='first-meeting')).toHaveLength(1);
 });
 it('wizyty poza kolejnością nie dają klucza ani zaproszeń; pełny plecak zachowuje prezent',()=>{
  let s=newSave();for(const target of ['milus','tola','fela'])s=act(s,target);expect(s.inventory).toEqual({});
  s=act(act(s,'home-door'),'fela-letter');s=act(s,'home-exit');s.inventory=Object.fromEntries(Array.from({length:12},(_,i)=>[`item-${i}`,1]));const n=findNode(p,s,'fela')!;const full=choose(p,s,n.id,n.choices[0].id);expect(full.state).toBe(s);expect(full.message).toContain('miejsca');expect(s.flags['lamp-received']).toBeUndefined();
  delete s.inventory['item-0'];s=choose(p,s,n.id,n.choices[0].id).state;expect(s.inventory.lamp).toBe(1);expect(choose(p,s,n.id,n.choices[0].id).state).toBe(s);
 });
});
