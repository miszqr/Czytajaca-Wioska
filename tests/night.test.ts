import {expect,it} from 'vitest';
import {NullEngine,Scene} from '../src/game/babylon';
import {createGoldenHour} from '../src/game/golden-hour';
import {GAS_LANTERNS,NIGHT_FLAG,lanternLitFlag} from '../src/game/lantern-layout';
import {newSave,validateSave} from '../src/persistence/state';
import {DEFAULT_CONTENT as content} from '../src/content/defaults';
import {choose,findNode} from '../src/story/engine';

it('noc nadchodzi stopniowo, można wrócić do dnia, a zapis i ograniczenie ruchu pomijają przejście',()=>{
 const engine=new NullEngine(),scene=new Scene(engine);
 try{
  const sky=createGoldenHour(scene),day=sky.sun.intensity,direction=sky.sun.direction.clone(),fog=scene.fogColor.clone();
  sky.setNight(true);expect(sky.nightAmount).toBe(0);
  for(let i=0;i<60;i++)sky.update(1/60);
  expect(sky.nightAmount).toBeGreaterThan(0);expect(sky.nightAmount).toBeLessThan(1);
  expect(sky.sun.intensity).toBeLessThan(day);
  for(let i=0;i<360;i++)sky.update(1/60);
  expect(sky.nightAmount).toBe(1);expect(sky.fill.intensity).toBeGreaterThan(.25);
  expect(sky.sun.direction.equals(direction)).toBe(true);expect(scene.fogColor.equals(fog)).toBe(false);
  sky.setNight(false);for(let i=0;i<420;i++)sky.update(1/60);
  expect(sky.nightAmount).toBe(0);expect(sky.sun.intensity).toBe(day);expect(scene.fogColor.equals(fog)).toBe(true);
  sky.setNight(true,true);expect(sky.nightAmount).toBe(1);
  sky.setNight(false);sky.update(1/60,true);expect(sky.nightAmount).toBe(0);
 }finally{scene.dispose();engine.dispose()}
});

it('każdą latarnię zapala się osobno; noc i płomienie przeżywają zapis bez zajmowania plecaka',()=>{
 let state=newSave();state.flags[NIGHT_FLAG]=true;
 for(const lamp of GAS_LANTERNS){
  const target=content.interactions.find(t=>t.id===lamp.id)!;expect(target.position).toEqual({x:lamp.x,z:lamp.z});
  const node=findNode(content,state,lamp.id)!;expect(node).toBeDefined();
  expect(findNode(content,{...state,location:'home'},lamp.id)).toBeUndefined();
  const result=choose(content,state,node.id,'light');expect(result.message).toBe('');
  state=validateSave(JSON.parse(JSON.stringify(result.state)))!;
  expect(state.flags[lanternLitFlag(lamp.id)]).toBe(true);expect(state.flags[NIGHT_FLAG]).toBe(true);
  expect(findNode(content,state,lamp.id)).toBeUndefined();expect(choose(content,state,node.id,'light').state).toBe(state);
 }
 expect(state.inventory).toEqual({});expect(state.completed).toEqual([]);
 expect(findNode(content,newSave(),GAS_LANTERNS[0].id)).toBeDefined();
});
