import {CONFIG} from '../game/config';

export function CameraSettings({distance,onChange}:{distance:number;onChange:(distance:number)=>void}){
 const text=distance.toLocaleString('pl-PL',{minimumFractionDigits:1,maximumFractionDigits:1});
 return <fieldset className="camera-settings">
  <legend>Kamera</legend>
  <div className="camera-setting-label"><label htmlFor="camera-distance">Odległość od Kitka</label><output htmlFor="camera-distance">{text}</output></div>
  <div className="camera-distance-controls">
   <button className="secondary" aria-label="Przybliż kamerę" disabled={distance<=CONFIG.cameraMinDistance} onClick={()=>onChange(Math.round((distance-.1)*10)/10)}>−</button>
   <input id="camera-distance" data-dialog-autofocus type="range" min={CONFIG.cameraMinDistance} max={CONFIG.cameraMaxDistance} step="0.1" value={distance} aria-valuetext={text} aria-describedby="camera-distance-help" onChange={e=>onChange(Number(e.currentTarget.value))}/>
   <button className="secondary" aria-label="Oddal kamerę" disabled={distance>=CONFIG.cameraMaxDistance} onClick={()=>onChange(Math.round((distance+.1)*10)/10)}>+</button>
  </div>
  <div className="camera-distance-scale" aria-hidden="true"><span>Bliżej</span><span>Dalej</span></div>
  <button className="text-button" onClick={()=>onChange(CONFIG.cameraDistance)}>Domyślna odległość</button>
  <p id="camera-distance-help" className="quiet">Przy przeszkodach kamera zbliża się automatycznie.</p>
 </fieldset>;
}
