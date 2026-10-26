import {expect,it} from 'vitest';
import {DEFAULT_CONTENT as content} from '../src/content/defaults';
import {APPLE_TREES,APPLES_PER_TREE,applePickedFlag} from '../src/game/orchard';
import {choose,currentScene,findNode,PACK_CAPACITY} from '../src/story/engine';
import {newSave,validateSave} from '../src/persistence/state';

it('pozwala zebrać po jednym owocu z obu jabłoni, zachowuje postęp i nie powiela zbiorów',()=>{
 let state=newSave();
 for(const tree of APPLE_TREES){
  const target=content.interactions.find(t=>t.id===tree.id)!;
  expect(target.position).toEqual({x:tree.x,z:tree.z});
  for(let index=0;index<APPLES_PER_TREE;index++){
   const node=findNode(content,state,tree.id)!;expect(node).toBeDefined();
   const previous=state.inventory.apple??0,result=choose(content,state,node.id,'pick');
   expect(result.message).toBe('');expect(result.state.inventory.apple).toBe(previous+1);
   expect(result.state.flags[applePickedFlag(tree.id,index)]).toBe(true);
   state=validateSave(JSON.parse(JSON.stringify(result.state)))!;expect(state).not.toBeNull();
   expect(choose(content,state,node.id,'pick').state).toBe(state);
  }
  expect(findNode(content,state,tree.id)).toBeUndefined();
 }
 expect(state.inventory).toEqual({apple:APPLE_TREES.length*APPLES_PER_TREE});
 expect(currentScene(content,state)?.id).toBe('arrival');expect(state.completed).toEqual([]);
 expect(findNode(content,{...state,location:'home'},APPLE_TREES[0].id)).toBeUndefined();
 expect(findNode(content,newSave(),APPLE_TREES[0].id)).toBeDefined();
});

it('pełny plecak pozostawia owoc na drzewie, a kolejne jabłka mieszczą się w istniejącym stosie',()=>{
 const state=newSave(),tree=APPLE_TREES[0];
 state.inventory=Object.fromEntries(content.items.filter(i=>i.id!=='apple').slice(0,PACK_CAPACITY).map(i=>[i.id,1]));
 const node=findNode(content,state,tree.id)!,full=choose(content,state,node.id,'pick');
 expect(full.state).toBe(state);expect(full.message).toContain('miejsca');expect(state.flags).toEqual({});expect(state.seen).toEqual([]);
 delete state.inventory[Object.keys(state.inventory)[0]];
 const first=choose(content,state,node.id,'pick').state;
 expect(Object.keys(first.inventory)).toHaveLength(PACK_CAPACITY);expect(first.inventory.apple).toBe(1);
 const next=findNode(content,first,tree.id)!,second=choose(content,first,next.id,'pick');
 expect(second.message).toBe('');expect(second.state.inventory.apple).toBe(2);expect(Object.keys(second.state.inventory)).toHaveLength(PACK_CAPACITY);
});
