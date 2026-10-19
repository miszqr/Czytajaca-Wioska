import {it,expect,vi} from 'vitest';
import {DEFAULT_CONTENT} from '../src/content/defaults';
import manifest from '../public/content/manifest.json';
import {loadContent} from '../src/content/load';
import {validateManifest,validatePack} from '../src/content/validate';
it('wykrywa literówki, nieznane cele i odwołania do flag bez źródła',()=>{
 expect(()=>validatePack({...DEFAULT_CONTENT,quiz:{}})).toThrow('quiz');
 let p=structuredClone(DEFAULT_CONTENT);p.story.nodes[0].target='missing';expect(()=>validatePack(p)).toThrow('nieznany cel');
 p=structuredClone(DEFAULT_CONTENT);p.story.scenes[0].when=[{type:'flag',key:'typo',value:true}];expect(()=>validatePack(p)).toThrow('nie ma żadnego źródła');
 p=structuredClone(DEFAULT_CONTENT);p.story.nodes[0].choices[0].effects=[{type:'read',documentId:'missing'}];expect(()=>validatePack(p)).toThrow('nieznany list');
});
it('nie pozwala na skrypty JS ani wyjście poza katalog treści',()=>{
 for(const story of ['../data.json','https://example.com/data.json','/data.json','quests/a.js'])expect(()=>validateManifest({...manifest,story})).toThrow();
 expect(()=>validatePack({...DEFAULT_CONTENT,characters:[{...DEFAULT_CONTENT.characters[0],behavior:{type:'script',file:'evil.js'}}]})).toThrow();
});
it('wczytuje cały pakiet z JSON pod ścieżką repozytorium, bez cache',async()=>{
 const files:Record<string,unknown>={'manifest.json':manifest,'characters.json':DEFAULT_CONTENT.characters,'items.json':DEFAULT_CONTENT.items,'interactions.json':DEFAULT_CONTENT.interactions,'story.json':DEFAULT_CONTENT.story};
 const fetcher=vi.fn(async(url:URL|RequestInfo,options?:RequestInit)=>{expect(options?.cache).toBe('no-store');const path=String(url).split('/Czytajaca-Wioska/content/')[1];return new Response(JSON.stringify(files[path]),{status:files[path]?200:404})}) as typeof fetch;
 expect(await loadContent(new URL('https://example.com/Czytajaca-Wioska/content/'),fetcher)).toEqual(DEFAULT_CONTENT);expect(fetcher).toHaveBeenCalledTimes(5);
});
it('brakujący plik zatrzymuje ładowanie z nazwą ścieżki',async()=>{
 const fetcher=vi.fn(async(url:URL|RequestInfo)=>String(url).endsWith('manifest.json')?new Response(JSON.stringify(manifest)):new Response('',{status:404})) as typeof fetch;
 await expect(loadContent(new URL('https://example.com/content/'),fetcher)).rejects.toThrow('characters.json');
});
