import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {setTimeout as delay} from 'node:timers/promises';
import {JSDOM} from 'jsdom';

// Run the actual production entry and its chunks, not Vitest's source imports.
// This catches cross-chunk initialization failures before WebGL is involved.
const directory=resolve(process.argv[2]??'dist');
const html=await readFile(resolve(directory,'index.html'),'utf8');
const dom=new JSDOM(html,{url:'http://localhost/Czytajaca-Wioska/'});
for(const name of ['window','document','navigator','HTMLElement','MutationObserver','localStorage']){
 Object.defineProperty(globalThis,name,{value:dom.window[name],configurable:true});
}
const requests=[];
// Keep content loading pending: this smoke check covers module startup and the
// first React render. GPU rendering is checked separately in a browser.
globalThis.fetch=url=>{requests.push(String(url));return new Promise(()=>{})};
const errors=[];
dom.window.addEventListener('error',event=>errors.push(event.error??event.message));

try{
 const entry=dom.window.document.querySelector('script[type="module"][src]')?.getAttribute('src');
 assert.ok(entry,'Missing production module entry in index.html');
 await import(pathToFileURL(resolve(directory,entry)).href);
 const deadline=Date.now()+5000;
 while((!document.querySelector('.game-shell')||!requests.some(url=>url.includes('content/manifest.json')))&&Date.now()<deadline)await delay(10);
 assert.deepEqual(errors,[],'The production entry raised a browser error');
 assert.ok(document.querySelector('.world-canvas'),'The game UI did not mount');
 assert.match(document.querySelector('#root')?.textContent??'',/Czytająca Wioska/);
 assert.ok(requests.some(url=>url.includes('content/manifest.json')),'Content loading did not start');
 console.log('Production startup OK: module graph evaluated, game UI mounted, content loading started.');
}finally{
 dom.window.close();
}
