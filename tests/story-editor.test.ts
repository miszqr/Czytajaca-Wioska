// @vitest-environment jsdom
import {it,expect,vi} from 'vitest';
import 'fake-indexeddb/auto';
import {DEFAULT_CONTENT} from '../src/content/defaults';
import {diagnoseNodes,draftSnapshot,exportedFiles,importDraft,parseDraft,restoreDraft,toDraft} from '../src/editor/model';
import {makeEntry} from '../src/editor/EntryForm';
import {newSave} from '../src/persistence/state';
import {SaveStore} from '../src/persistence/store';
import {findNode,choose} from '../src/story/engine';

it('exports only changed complete source files, preserving schemas and Polish text',()=>{
 const pack=structuredClone(DEFAULT_CONTENT);pack.story.nodes[0].lines[0]='Zażółć gęślą jaźń.';
 const files=exportedFiles(DEFAULT_CONTENT,toDraft(pack));expect(files).toHaveLength(1);expect(files[0].path).toBe('public/content/story.json');expect(JSON.parse(files[0].after)).toEqual(pack.story);
 expect(parseDraft(toDraft(pack))).toEqual(pack);expect(files[0].after).not.toContain('inventory');
});
it('blocks malformed JSON, duplicate identifiers and broken item references',()=>{
 const draft=toDraft(DEFAULT_CONTENT);expect(()=>parseDraft({...draft,story:'{'})).toThrow('story.json');
 const pack=structuredClone(DEFAULT_CONTENT);pack.story.nodes.push(structuredClone(pack.story.nodes[0]));expect(()=>exportedFiles(DEFAULT_CONTENT,toDraft(pack))).toThrow();
 pack.story.nodes.pop();pack.story.nodes[0].choices[0].effects.push({type:'giveItem',itemId:'missing-item',quantity:1});expect(()=>parseDraft(toDraft(pack))).toThrow('nieznany przedmiot');
});
it('draft restores incomplete edits, detects a new base and rejects invalid imports',()=>{
 const draft={...toDraft(DEFAULT_CONTENT),story:'{unfinished'};
 const raw=draftSnapshot(DEFAULT_CONTENT,draft);expect(restoreDraft(DEFAULT_CONTENT,raw)).toEqual({draft,warning:''});
 const changed=structuredClone(DEFAULT_CONTENT);changed.story.title='Inna wersja';expect(restoreDraft(changed,raw).warning).toContain('Gra zmieniła');
 expect(()=>importDraft(raw)).toThrow();expect(importDraft(draftSnapshot(DEFAULT_CONTENT,toDraft(DEFAULT_CONTENT)))).toEqual(toDraft(DEFAULT_CONTENT));
 expect(restoreDraft(DEFAULT_CONTENT,'broken').warning).toContain('Nie udało');
});
it('new and duplicated nodes have unique priorities and pass the same validator as the game',()=>{
 const pack=structuredClone(DEFAULT_CONTENT);pack.story.nodes.push(makeEntry(pack,'nodes',pack.story.nodes[0]) as any);
 expect(parseDraft(toDraft(pack))).toEqual(pack);
});
it('diagnostics use real priority, conditions and once behavior',()=>{
 const pack=structuredClone(DEFAULT_CONTENT),state=newSave(),node=findNode(pack,state,'bruno')!;
 let report=diagnoseNodes(pack,state,'bruno','interact');expect(report.find(d=>d.selected)?.node.id).toBe(node.id);
 const next=choose(pack,state,node.id,node.choices[0].id).state;
 report=diagnoseNodes(pack,next,'bruno','interact');expect(report.find(d=>d.node.id===node.id)?.reasons.join(' ')).toContain('Już wykonano');
 expect(report.find(d=>d.selected)?.node.id).toBe(findNode(pack,next,'bruno')?.id);
});
it('test saves remain isolated from player saves in IndexedDB and localStorage fallback',async()=>{
 for(const fallback of [false,true]){
  if(fallback)vi.stubGlobal('indexedDB',undefined);
  const player=new SaveStore(),editor=new SaveStore('story-editor'),original=newSave(),sandbox=newSave();original.flags['met-bruno']=true;sandbox.inventory.apple=7;
  try{await player.save(original);const before=await player.load();await editor.save(sandbox);expect((await editor.load())?.inventory.apple).toBe(7);expect(await player.load()).toEqual(before);expect(editor.mode).toBe(fallback?'localStorage':'indexeddb')}
  finally{await player.close();await editor.close();vi.unstubAllGlobals()}
 }
});
