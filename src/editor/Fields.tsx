import type {Condition,Effect,ContentPack} from '../content/types';
export function TextField({label,value,onChange,multiline=false}:{label:string;value:string;onChange:(s:string)=>void;multiline?:boolean}){
 return <label>{label}{multiline?<textarea value={value} onChange={e=>onChange(e.target.value)}/>:<input value={value} onChange={e=>onChange(e.target.value)}/>}</label>;
}
export function NumberField({label,value,onChange}:{label:string;value:number;onChange:(n:number)=>void}){return <label>{label}<input type="number" step="any" value={Number.isFinite(value)?value:''} onChange={e=>onChange(e.target.valueAsNumber)}/></label>}
export function SelectField({label,value,options,onChange}:{label:string;value:string;options:{id:string;name:string}[];onChange:(s:string)=>void}){return <label>{label}<select value={value} onChange={e=>onChange(e.target.value)}>{!options.some(o=>o.id===value)&&<option value={value}>{value||'Wybierz…'}</option>}{options.map(o=><option value={o.id} key={o.id}>{o.name}</option>)}</select></label>}
export function BoolField({label,value,onChange}:{label:string;value:boolean;onChange:(v:boolean)=>void}){return <label className="se-check"><input type="checkbox" checked={value} onChange={e=>onChange(e.target.checked)}/>{label}</label>}
const types={flag:'Ustaw flagę',giveItem:'Dodaj przedmiot',takeItem:'Zabierz przedmiot',read:'Zachowaj przeczytany list',complete:'Ukończ etap',travel:'Przenieś Kitka',placeFurniture:'Postaw mebel'};
export function newEffect(type:Effect['type'],pack:ContentPack):Effect{
 switch(type){
  case 'flag':return {type,key:'nowa-flaga',value:true};
  case 'giveItem':case 'takeItem':return {type,itemId:pack.items[0]?.id??'',quantity:1};
  case 'read':return {type,documentId:pack.story.documents[0]?.id??''};
  case 'complete':return {type,sceneId:pack.story.scenes[0]?.id??''};
  case 'travel':return {type,location:'village',x:0,z:0,heading:0};
  case 'placeFurniture':return {type,id:'nowy-mebel',itemId:pack.items.find(i=>i.kind==='decoration')?.id??'',x:0,z:0,rotation:0};
 }
}
export function Rules({value,onChange,pack,effects=false}:{value:(Condition|Effect)[];onChange:(v:any[])=>void;pack:ContentPack;effects?:boolean}){
 const options=effects?Object.entries(types).map(([id,name])=>({id,name})):[{id:'flag',name:'Stan flagi'},{id:'item',name:'Przedmiot w plecaku'}];
 return <fieldset><legend>{effects?'Skutki odpowiedzi':'Warunki (wszystkie muszą być spełnione)'}</legend>{value.map((rule,i)=>{
  const patch=(part:object)=>onChange(value.map((v,j)=>j===i?{...v,...part}:v));
  return <div className="se-rule" key={i}><SelectField label="Rodzaj" value={rule.type} options={options} onChange={type=>onChange(value.map((v,j)=>j!==i?v:type==='item'?{type,itemId:pack.items[0]?.id??'',quantity:1}:newEffect(type as Effect['type'],pack)))}/>
   {rule.type==='flag'&&<><TextField label="Flaga" value={rule.key} onChange={key=>patch({key})}/><BoolField label="Włączona" value={rule.value} onChange={value=>patch({value})}/></>}
   {'itemId' in rule&&<SelectField label="Przedmiot" value={rule.itemId} options={pack.items} onChange={itemId=>patch({itemId})}/>}
   {'quantity' in rule&&<NumberField label="Liczba sztuk" value={rule.quantity} onChange={quantity=>patch({quantity})}/>}
   {rule.type==='read'&&<SelectField label="List" value={rule.documentId} options={pack.story.documents.map(d=>({id:d.id,name:d.title}))} onChange={documentId=>patch({documentId})}/>}
   {rule.type==='complete'&&<SelectField label="Etap" value={rule.sceneId} options={pack.story.scenes.map(s=>({id:s.id,name:s.title}))} onChange={sceneId=>patch({sceneId})}/>}
   {rule.type==='travel'&&<><SelectField label="Miejsce" value={rule.location} options={[{id:'village',name:'Wioska'},{id:'home',name:'Dom'}]} onChange={location=>patch({location})}/><NumberField label="Kierunek (radiany)" value={rule.heading} onChange={heading=>patch({heading})}/></>}
   {rule.type==='placeFurniture'&&<><TextField label="ID mebla" value={rule.id} onChange={id=>patch({id})}/><SelectField label="Obrót" value={String(rule.rotation)} options={[0,1,2,3].map(n=>({id:String(n),name:`${n*90}°`}))} onChange={rotation=>patch({rotation:Number(rotation)})}/></>}
   {'x' in rule&&<><NumberField label="X" value={rule.x} onChange={x=>patch({x})}/><NumberField label="Z" value={rule.z} onChange={z=>patch({z})}/></>}
   <button onClick={()=>onChange(value.filter((_,j)=>j!==i))}>Usuń regułę</button>
  </div>;
 })}<button onClick={()=>onChange([...value,{type:'flag',key:'nowa-flaga',value:true}])}>+ {effects?'Skutek':'Warunek'}</button></fieldset>;
}
