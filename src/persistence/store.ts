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
    try{
      const db=await this.open();
      const value=await new Promise<unknown>((resolve,reject)=>{const r=db.transaction('saves').objectStore('saves').get(KEY);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});
      this.mode='indexeddb';return validateSave(value);
    }catch{
      try{this.mode='localStorage';return validateSave(JSON.parse(localStorage.getItem(FALLBACK)||'null'))}catch{this.mode='memory';return null}
    }
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
