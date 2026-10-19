import {validateSave,type SaveState} from './state';
const DB_NAME='czytajaca-wioska',KEY='p0',FALLBACK='czytajaca-wioska-p0';
export class SaveStore {
  private database:Promise<IDBDatabase>|null=null;
  private queue:Promise<void>=Promise.resolve();
  mode:'indexeddb'|'localStorage'|'memory'='indexeddb';
  private open(){
    return this.database??=(new Promise<IDBDatabase>((resolve,reject)=>{
      if(typeof indexedDB==='undefined'){reject(new Error('IndexedDB unavailable'));return}
      const request=indexedDB.open(DB_NAME,1);
      request.onupgradeneeded=()=>request.result.createObjectStore('saves');
      request.onsuccess=()=>{request.result.onversionchange=()=>request.result.close();resolve(request.result)};
      request.onerror=()=>reject(request.error);request.onblocked=()=>reject(new Error('Database blocked'));
    }));
  }
  async load():Promise<SaveState|null>{
    let value:unknown;
    try{
      const db=await this.open();
      value=await new Promise<unknown>((resolve,reject)=>{const r=db.transaction('saves').objectStore('saves').get(KEY);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});
      this.mode='indexeddb';
    }catch{
      let raw:string|null;
      try{raw=localStorage.getItem(FALLBACK);this.mode='localStorage'}catch{this.mode='memory';return null}
      try{value=JSON.parse(raw||'null')}catch{throw new Error('Zapis gry jest uszkodzony. Nie został nadpisany.')}
    }
    if(value==null)return null;
    const state=validateSave(value);
    if(!state)throw new Error('Zapis gry ma nieobsługiwany lub uszkodzony format. Nie został nadpisany.');
    if(value&&typeof value==='object'&&'version' in value&&value.version!==3){
      const backupKey=`legacy-v${value.version}`;
      try{
        if(this.mode==='indexeddb'){const db=await this.open();await new Promise<void>((resolve,reject)=>{const tx=db.transaction('saves','readwrite'),store=tx.objectStore('saves'),get=store.get(backupKey);get.onsuccess=()=>{if(get.result===undefined)store.put(value,backupKey)};tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error)})}
        else if(this.mode==='localStorage'&&!localStorage.getItem(`${FALLBACK}-${backupKey}`))localStorage.setItem(`${FALLBACK}-${backupKey}`,JSON.stringify(value));
      }catch{throw new Error('Nie udało się zachować kopii starszego zapisu. Oryginał nie został nadpisany.')}
    }
    return state;
  }
  save(state:SaveState):Promise<void>{
    const snapshot=structuredClone(state);snapshot.updatedAt=Date.now();
    this.queue=this.queue.catch(()=>{}).then(async()=>{
      try{
        const db=await this.open();await new Promise<void>((resolve,reject)=>{const tx=db.transaction('saves','readwrite');tx.objectStore('saves').put(snapshot,KEY);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error)});this.mode='indexeddb';
      }catch{
        try{localStorage.setItem(FALLBACK,JSON.stringify(snapshot));this.mode='localStorage'}catch{this.mode='memory'}
      }
    });
    return this.queue;
  }
  async close(){await this.queue;try{(await this.database)?.close()}catch{}}
}
