import {useEffect,useMemo,useState} from 'react';
import {ReactFlow,ReactFlowProvider,Background,Controls,MiniMap,Handle,Position,applyNodeChanges,applyEdgeChanges,type NodeProps,type Node,type Connection,useReactFlow} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type {ContentPack} from '../content/types';
import type {SaveState} from '../persistence/state';
import {SaveStore} from '../persistence/store';
import {BoolField,NumberField,Rules,SelectField,TextField} from './Fields';
import {advanceGraph,createNode,demoGraph,GRAPH_KEY,labels,parseGraph,ports,validateGraph,type Graph,type GraphNode,type Kind} from './graph';
import './graph.css';

type Props={pack:ContentPack;state:SaveState;onTest:(g:Graph,state:SaveState)=>void;onRestore:()=>void};
function Block({data,selected}:NodeProps<Node<{block:GraphNode}>>){const n=data.block;return <div className={`graph-block ${selected?'selected':''}`}>
 {n.type!=='start'&&<Handle type="target" position={Position.Left} id="in"/>}<small>{n.id}</small><strong>{labels[n.type]}</strong><p>{n.data.text??n.data.target??n.data.key??n.data.itemId??n.data.effect?.type??'Zakończ rozmowę'}</p>
 {ports(n).map((p,i)=><div key={p} className="graph-port" style={{top:ports(n).length===2?`${48+i*35}%`:'60%'}}><span>{p==='yes'?'TAK':p==='no'?'NIE':'Dalej'}</span><Handle type="source" position={Position.Right} id={p}/></div>)}
 </div>}
const nodeTypes={block:Block};
function CanvasEditor({pack,state,onTest,onRestore}:Props){
 const [initial]=useState(()=>{try{const raw=localStorage.getItem(GRAPH_KEY);return {graph:raw?parseGraph(raw,pack,false):demoGraph(pack),message:''}}catch(e){return {graph:demoGraph(pack),message:`Nie odczytano szkicu: ${String(e)}. Oryginał pozostaje w pamięci do pierwszej zmiany.`}}});
 const [graph,setGraph]=useState<Graph>(initial.graph),[selected,setSelected]=useState(''),[edgeSelected,setEdgeSelected]=useState(''),[notice,setNotice]=useState(initial.message),[dirty,setDirty]=useState(false);
 const [sandbox,setSandbox]=useState(()=>structuredClone(state)),[step,setStep]=useState<ReturnType<typeof advanceGraph>|null>(null);
 const flow=useReactFlow();
 const error=useMemo(()=>{try{validateGraph(graph,pack);return ''}catch(e){return String(e)}},[graph,pack]);
 useEffect(()=>{if(!dirty)return;try{localStorage.setItem(GRAPH_KEY,JSON.stringify(graph))}catch{setNotice('Nie zapisano szkicu lokalnie. Pobierz JSON.')}},[graph,dirty]);
 function change(g:Graph){setGraph(g);setDirty(true);setStep(null)}
 const current=graph.nodes.find(n=>n.id===selected);
 function patch(data:GraphNode['data']){change({...graph,nodes:graph.nodes.map(n=>n.id===selected?{...n,data:{...n.data,...data}}:n)})}
 function add(kind:Kind,position?:{x:number;y:number}){if(kind==='start'&&graph.nodes.some(n=>n.type==='start')){setNotice('Graf ma już Start.');return}const pos=position??flow.screenToFlowPosition({x:window.innerWidth/2,y:window.innerHeight/2});const n=createNode(kind,pack,undefined,pos.x,pos.y);change({...graph,nodes:[...graph.nodes,n]});setSelected(n.id)}
 function connect(c:Connection){const g={...graph,edges:[...graph.edges,{id:`edge-${crypto.randomUUID()}`,source:c.source,target:c.target,sourceHandle:c.sourceHandle??'next'}]};try{validateGraph(g,pack,false);change(g);setNotice('Połączono bloczki.')}catch(e){setNotice(String(e))}}
 function download(){const url=URL.createObjectURL(new Blob([JSON.stringify(graph,null,2)+'\n'],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='story-graph.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
 function simulate(restart:boolean){try{const result=advanceGraph(graph,pack,restart?sandbox:step?.state??sandbox,restart?undefined:step?.cursor);setStep(result)}catch(e){setNotice(String(e))}}
 const nodes=graph.nodes.map(n=>({id:n.id,type:'block',position:n.position,data:{block:n},selected:n.id===selected}));
 return <section className="graph-workspace" aria-label="Graficzny edytor fabuły">
 <div className="graph-toolbar"><button disabled={!!error} onClick={()=>{onTest(validateGraph(graph,pack),structuredClone(sandbox))}}>Testuj graf w grze</button><button onClick={onRestore}>Przywróć stan sprzed testu</button><button onClick={download}>Pobierz graf JSON</button><label className="graph-import">Importuj JSON<input aria-label="Importuj graf JSON" type="file" accept=".json" onChange={async e=>{const input=e.currentTarget,f=input.files?.[0];if(!f)return;try{if(f.size>1_000_000)throw new Error('Maksymalnie 1 MB');change(parseGraph(await f.text(),pack));setSelected('');setNotice('Graf wczytany.');setTimeout(()=>flow.fitView(),0)}catch(err){setNotice(`Import odrzucony: ${String(err)}`)}input.value=''}}/></label><button onClick={()=>{change(demoGraph(pack));setSelected('');setTimeout(()=>flow.fitView(),0)}}>Przykład: jabłka Bruna</button></div>
 <button disabled={!edgeSelected} onClick={()=>{change({...graph,edges:graph.edges.filter(e=>e.id!==edgeSelected)});setEdgeSelected('')}}>Usuń zaznaczone połączenie</button><div role="status" className="graph-status">{error||'✓ Graf poprawny'}{notice&&<p>{notice}</p>}</div>
 <div className="graph-layout"><nav aria-label="Paleta bloczków"><h3>Bloczki</h3><p>Przeciągnij na płótno lub kliknij.</p>{(Object.keys(labels) as Kind[]).map(k=><button key={k} draggable onDragStart={e=>e.dataTransfer.setData('application/story-node',k)} onClick={()=>add(k)}>{labels[k]}</button>)}<p>Połącz kropkę wyjścia z wejściem. Delete usuwa zaznaczenie. Przeciągaj tło, aby przesuwać widok.</p></nav>
 <div className="graph-canvas" onDragOver={e=>{e.preventDefault();e.dataTransfer.dropEffect='move'}} onDrop={e=>{e.preventDefault();const k=e.dataTransfer.getData('application/story-node');if(Object.hasOwn(labels,k))add(k as Kind,flow.screenToFlowPosition({x:e.clientX,y:e.clientY}))}}>
 <ReactFlow nodes={nodes} edges={graph.edges.map(e=>({...e,label:e.sourceHandle==='yes'?'TAK':e.sourceHandle==='no'?'NIE':undefined,targetHandle:'in'}))} nodeTypes={nodeTypes} onConnect={connect} onNodeClick={(_,n)=>setSelected(n.id)} onPaneClick={()=>setSelected('')} onEdgeClick={(_,e)=>setEdgeSelected(e.id)} onNodesChange={changes=>{changes=changes.filter(c=>c.type!=='dimensions');if(!changes.length)return;const next=applyNodeChanges(changes,nodes);if(changes.every(c=>c.type==='select')){const chosen=changes.find(c=>c.type==='select'&&c.selected);if(chosen)setSelected(chosen.id);return}change({...graph,nodes:next.map(n=>({...n.data.block,position:n.position})),edges:graph.edges.filter(e=>next.some(n=>n.id===e.source)&&next.some(n=>n.id===e.target))})}} onEdgesChange={changes=>{if(changes.some(c=>c.type==='remove'))change({...graph,edges:applyEdgeChanges(changes,graph.edges)})}} fitView minZoom={.15} maxZoom={2} deleteKeyCode={['Backspace','Delete']}><Background/><Controls/><MiniMap/></ReactFlow>
 </div><aside><h3>{current?labels[current.type]:'Wybierz bloczek'}</h3>{current&&<>
 <small>{current.id}</small>
 {current.type==='start'&&<SelectField label="Cel rozmowy" value={current.data.target!} options={[...pack.characters,...pack.interactions.map(i=>({id:i.id,name:i.label}))]} onChange={target=>patch({target})}/>}
 {current.type==='dialogue'&&<><SelectField label="Postać" value={current.data.speaker!} options={pack.characters} onChange={speaker=>patch({speaker})}/><TextField label="Tekst dialogu" value={current.data.text!} multiline onChange={text=>patch({text})}/></>}
 {['condition','flag'].includes(current.type)&&<><TextField label="Flaga" value={current.data.key!} onChange={key=>patch({key})}/><BoolField label="Wartość flagi" value={current.data.value!} onChange={value=>patch({value})}/></>}
 {['inventory','giveItem','takeItem'].includes(current.type)&&<><SelectField label="Przedmiot" value={current.data.itemId!} options={pack.items} onChange={itemId=>patch({itemId})}/><NumberField label="Liczba sztuk" value={current.data.quantity!} onChange={quantity=>patch({quantity})}/></>}
 {current.type==='inventory'&&<SelectField label="Porównanie" value={current.data.comparison!} options={[{id:'gte',name:'Co najmniej ≥'},{id:'eq',name:'Dokładnie ='},{id:'lt',name:'Mniej niż <'}]} onChange={comparison=>patch({comparison:comparison as 'gte'})}/>}
 {current.type==='action'&&<Rules effects pack={pack} value={current.data.effect?[current.data.effect]:[]} onChange={effects=>patch({effect:effects.at(-1)})}/>}
 <button onClick={()=>{change({...graph,nodes:graph.nodes.filter(n=>n.id!==selected),edges:graph.edges.filter(e=>e.source!==selected&&e.target!==selected)});setSelected('')}}>Usuń bloczek</button></>}
 <hr/><h3>Próba rozmowy</h3><p>Kopia stanu sesji. Zmiany próbne nie dotykają zapisu gracza.</p>
 <button onClick={()=>{setSandbox(structuredClone(state));setStep(null)}}>Pobierz stan bieżącej sesji</button><button onClick={async()=>{const store=new SaveStore();try{const saved=await store.load();if(!saved)throw new Error('Brak zapisu gracza');setSandbox(structuredClone(saved));setStep(null);setNotice('Wczytano kopię zapisu gracza. Oryginał pozostaje bez zmian.')}catch(e){setNotice(String(e))}finally{await store.close()}}}>Wczytaj kopię zapisu gracza</button>
 <NumberField label="Jabłka w testowym plecaku" value={sandbox.inventory.apple??0} onChange={quantity=>{if(!Number.isSafeInteger(quantity)||quantity<0||quantity>999)return;setSandbox(s=>{const n=structuredClone(s);if(quantity)n.inventory.apple=quantity;else delete n.inventory.apple;return n});setStep(null)}}/>
 <button disabled={!!error} onClick={()=>simulate(true)}>Rozpocznij rozmowę</button>
 {step&&<div className="se-dialog-preview"><strong>{step.dialogue?.speaker??'Wynik'}</strong><p>{step.message||step.dialogue?.lines.join('\n')||'Rozmowa zakończona. Możesz rozpocząć ją ponownie.'}</p><p>Jabłka: {step.state.inventory.apple??0}</p>{step.dialogue&&<button onClick={()=>simulate(false)}>Dalej</button>}</div>}
 </aside></div></section>;
}
export default function GraphEditor(props:Props){return <ReactFlowProvider><CanvasEditor {...props}/></ReactFlowProvider>}
