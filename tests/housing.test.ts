import {it,expect} from 'vitest';
import {DEFAULT_CONTENT as content} from '../src/content/defaults';
import {newSave,validateSave} from '../src/persistence/state';
import {prepareStorage,takeFromStorage,storeDecoration,placeFurniture,canPlace,guestPositions,homeSolids} from '../src/housing/model';
import {afterPlacement} from '../src/story/engine';
import {blocked} from '../src/game/movement';
import {targetPosition} from '../src/interactions/model';
it('schowek, plecak, pokój i ponowne schowanie zachowują jedną sztukę mebla',()=>{
 let state=prepareStorage(newSave(),content);state.location='home';state.player={x:0,z:-2.5,heading:0};expect(content.items).toHaveLength(20);expect(prepareStorage(state,content)).toBe(state);
 const original=state.storage['chair-oak'];state=takeFromStorage(state,'chair-oak').state;expect(state.inventory['chair-oak']).toBe(1);
 const f={id:'chair-one',itemId:'chair-oak',x:-1.5,z:0,rotation:0 as const};const placed=placeFurniture(state,content,f);expect(placed.message).toBe('');state=placed.state;expect(state.inventory['chair-oak']).toBeUndefined();
 state=placeFurniture(state,content,{...f,x:-2}).state;expect(state.furniture.filter(x=>x.id==='chair-one')).toHaveLength(1);
 state=storeDecoration(state,content,'chair-oak','chair-one').state;expect(state.storage['chair-oak']).toBe(original);expect(state.furniture.some(f=>f.id==='chair-one')).toBe(false);expect(validateSave(state)).toEqual(state);
});
it('blokuje kolizje, ściany, gracza i przejście przy drzwiach; anulowanie nic nie zużywa',()=>{
 const state=newSave();state.location='home';state.player={x:0,z:-2.5,heading:0};state.inventory.lamp=1;
 for(const [x,z] of [[-3,1.5],[4.5,0],[0,-2.5],[3.3,2.1]]){const f={id:'new-lamp',itemId:'lamp',x,z,rotation:0 as const};expect(canPlace(f,state,content)).not.toBe('');expect(placeFurniture(state,content,f).state).toBe(state)}
 expect(state.inventory.lamp).toBe(1);expect(state.furniture).toHaveLength(2);
});
it('obrót zmienia obrys; lampa kończy scenę tylko blisko faktycznego łóżka',()=>{
 let state=newSave();state.location='home';state.player={x:0,z:-2.5,heading:0};state.inventory.lamp=1;
 const far={id:'fela-lamp',itemId:'lamp',x:3.8,z:0,rotation:0 as const};state=placeFurniture(state,content,far).state;expect(afterPlacement(content,state,'lamp').flags['lamp-placed']).toBeUndefined();
 state=placeFurniture(state,content,{...far,x:-1.5,z:1.5}).state;state=afterPlacement(content,state,'lamp');expect(state.completed).toContain('gift');expect(state.inventory.lamp).toBeUndefined();expect(afterPlacement(content,state,'lamp')).toBe(state);
 const table={id:'another-table',itemId:'table',x:3.9,z:-1,rotation:0 as const};expect(canPlace(table,state,content)).not.toBe('');expect(canPlace({...table,rotation:1},state,content)).toBe('');
});
it('list podąża za stołem, a goście wybierają wolne miejsca',()=>{
 const state=newSave();state.location='home';state.player={x:0,z:-2.5,heading:0};state.furniture.find(f=>f.itemId==='table')!.x=1;
 expect(targetPosition(content.interactions.find(t=>t.id==='fela-letter')!,state)).toEqual({x:1,z:1.2});
 const positions=guestPositions(state,content);expect(Object.keys(positions)).toHaveLength(4);for(const p of Object.values(positions))expect(blocked(p,homeSolids(state,content),.5)).toBe(false);
 expect(storeDecoration(state,content,'table','starter-table').message).toContain('koperty');
});
