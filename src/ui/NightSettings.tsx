export function NightSettings({night,onChange}:{night:boolean;onChange:(night:boolean)=>void}){
 return <button type="button" className="night-setting" role="switch" aria-checked={night} aria-label="Zapada noc" onClick={()=>onChange(!night)}>
  <span><strong>Zapada noc</strong><small>Zapal latarnie przy ścieżkach.</small></span>
  <span className={'night-setting-state'+(night?' on':'')} aria-hidden="true"><i/>{night?'Włączone':'Wyłączone'}</span>
 </button>;
}
