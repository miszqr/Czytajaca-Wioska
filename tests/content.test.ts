import {it,expect,vi} from 'vitest';
import {DEFAULT_CONTENT} from '../src/content/defaults';
import manifest from '../public/content/manifest.json';
import {loadContent} from '../src/content/load';
import {validateManifest,validatePack,validateQuest} from '../src/content/validate';
const copy=()=>structuredClone(DEFAULT_CONTENT);
it('odrzuca literówki, brak kafelka i niewłaściwy typ zachowania',()=>{
 const p=copy();expect(()=>validateQuest({...p.quests[0],titel:'literówka'})).toThrow('titel');
 p.quests[1].exercise.choices=['MA','LA'];expect(()=>validateQuest(p.quests[1])).toThrow('brakuje kafelka SŁO');
 const c=copy();expect(()=>validatePack([{...c.characters[0],behavior:{type:'script',file:'evil.js'}}],c.items,c.quests)).toThrow();
});
it('sprawdza odwołania, unikalne ID oraz cykle wymagań',()=>{
 let p=copy();p.quests[1].reward.itemId='missing';expect(()=>validatePack(p.characters,p.items,p.quests)).toThrow('nieznany przedmiot');
 p=copy();p.quests[1].npcId='missing';expect(()=>validatePack(p.characters,p.items,p.quests)).toThrow('nieznana postać');
 p=copy();p.quests[0].requires=[p.quests[1].id];p.quests[1].requires=[p.quests[0].id];expect(()=>validatePack(p.characters,p.items,p.quests)).toThrow('cykl');
 p=copy();p.quests[1].id=p.quests[0].id;expect(()=>validatePack(p.characters,p.items,p.quests)).toThrow('powtarzające');
});
it('manifest nie pozwala wychodzić poza katalog treści',()=>{
 for(const path of ['../data.json','https://example.com/data.json','/data.json','quests/a.js'])expect(()=>validateManifest({...manifest,quests:[path]})).toThrow();
 expect(validateManifest(manifest)).toEqual(manifest);
});
it('wczytuje treść spod ścieżki repozytorium bez wbudowanej kopii ani cache',async()=>{
 const files:Record<string,unknown>={'manifest.json':manifest,'characters.json':DEFAULT_CONTENT.characters,'items.json':DEFAULT_CONTENT.items};
 manifest.quests.forEach((path,i)=>files[path]=DEFAULT_CONTENT.quests[i]);
 const fetcher=vi.fn(async(url:URL|RequestInfo,options?:RequestInit)=>{expect(options?.cache).toBe('no-store');const path=String(url).split('/Czytajaca-Wioska/content/')[1];return new Response(JSON.stringify(files[path]),{status:files[path]?200:404})}) as typeof fetch;
 expect(await loadContent(new URL('https://example.com/Czytajaca-Wioska/content/'),fetcher)).toEqual(DEFAULT_CONTENT);
 expect(fetcher).toHaveBeenCalledTimes(5);
});
it('błąd pliku zatrzymuje ładowanie i wskazuje jego ścieżkę',async()=>{
 const fetcher=vi.fn(async(url:URL|RequestInfo)=>String(url).endsWith('manifest.json')?new Response(JSON.stringify(manifest)):new Response('',{status:404})) as typeof fetch;
 await expect(loadContent(new URL('https://example.com/content/'),fetcher)).rejects.toThrow('characters.json');
});
