import {it,expect} from 'vitest';
import {DEFAULT_CONTENT as pack} from '../src/content/defaults';
import {newSave} from '../src/persistence/state';
import {advanceGraph,demoGraph,parseGraph,validateGraph} from '../src/editor/graph';
function run(count:number){const g=demoGraph(pack),s=newSave();s.inventory.apple=count;let result=advanceGraph(g,pack,s);const lines:string[]=[];while(result.dialogue){lines.push(...result.dialogue.lines);result=advanceGraph(g,pack,result.state,result.cursor)}return {result,lines,original:s}}
it('serializes stable node, edge and layout identities',()=>{const g=demoGraph(pack);expect(parseGraph(JSON.stringify(g),pack)).toEqual(g)});
it('uses the actual story effect executor for YES and NO without mutating source state',()=>{
 const yes=run(3);expect(yes.lines).toEqual(['Przynieś mi trzy jabłka.','Dziękuję!']);expect(yes.result.state.inventory.apple).toBeUndefined();expect(yes.result.state.completed).toContain(pack.story.scenes[0].id);expect(yes.original.inventory.apple).toBe(3);
 const no=run(2);expect(no.lines).toContain('Czekam na jabłka.');expect(no.result.state.inventory.apple).toBe(2);expect(no.result.state.completed).toEqual([]);expect(run(4).result.state.inventory.apple).toBe(1);
});
it('supports exact inventory counts and flag branches',()=>{const g=demoGraph(pack);g.nodes[2].data.comparison='eq';const s=newSave();s.inventory.apple=4;let r=advanceGraph(g,pack,s);r=advanceGraph(g,pack,r.state,r.cursor);expect(r.dialogue?.lines).toEqual(['Czekam na jabłka.']);g.nodes[2].type='condition';g.nodes[2].data={key:'ready',value:true};s.flags.ready=true;r=advanceGraph(g,pack,s);r=advanceGraph(g,pack,r.state,r.cursor);expect(r.state.inventory.apple).toBe(1)});
it('rejects malicious, malformed, oversized and unsupported JSON',()=>{for(const raw of ['null','{}','{',JSON.stringify({...demoGraph(pack),version:2}),' '.repeat(1_000_001)])expect(()=>parseGraph(raw,pack)).toThrow();const g=demoGraph(pack);g.nodes[1].data={speaker:'bruno',text:'x',script:'alert(1)'} as any;expect(()=>validateGraph(g,pack)).toThrow('niedozwolone');g.nodes[1].data={speaker:'missing',text:'x'};expect(()=>validateGraph(g,pack)).toThrow('postać')});
it('rejects missing ports, unreachable nodes, cycles and duplicate edges',()=>{
 const g=demoGraph(pack);g.edges.pop();expect(()=>validateGraph(g,pack)).toThrow('podłącz');expect(()=>validateGraph(g,pack,false)).not.toThrow();
 const cycle=demoGraph(pack);cycle.edges[5].target='demo-3';expect(()=>validateGraph(cycle,pack)).toThrow('Cykl');
 const unreachable=demoGraph(pack);unreachable.nodes.push({id:'orphan',type:'end',data:{},position:{x:0,y:0}});expect(()=>validateGraph(unreachable,pack)).toThrow('nieosiągalny');
 const duplicate=demoGraph(pack);duplicate.edges.push({...duplicate.edges[0],id:'duplicate'});expect(()=>validateGraph(duplicate,pack)).toThrow('Niedozwolone');
});
it('validates world effects and reports inventory failures without partial mutations',()=>{
 const g=demoGraph(pack);g.nodes[5].data.effect={type:'complete',sceneId:'missing'};expect(()=>validateGraph(g,pack)).toThrow('nieznana scena');
 const valid=demoGraph(pack);valid.nodes[3].data.quantity=9;const s=newSave();s.inventory.apple=3;let r=advanceGraph(valid,pack,s);r=advanceGraph(valid,pack,r.state,r.cursor);expect(r.message).toContain('plecaka');expect(r.state).toEqual(s);
});
