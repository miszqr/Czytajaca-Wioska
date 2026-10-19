import {validateManifest,validatePack} from './validate';
import type {ContentPack} from './types';
export async function loadContent(base=new URL(`${import.meta.env.BASE_URL}content/`,document.baseURI),fetcher:typeof fetch=fetch):Promise<ContentPack>{
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),10000);
  async function read(path:string){try{const response=await fetcher(new URL(path,base),{cache:'no-store',signal:controller.signal});if(!response.ok)throw new Error(`HTTP ${response.status}`);return await response.json() as unknown}catch(error){throw new Error(`${path}: nie udało się wczytać pliku (${error instanceof Error?error.message:'błąd sieci'}).`)}}
  try{const manifest=validateManifest(await read('manifest.json'));const [characters,items,...quests]=await Promise.all([manifest.characters,manifest.items,...manifest.quests].map(read));return validatePack(characters,items,quests,manifest.quests)}finally{clearTimeout(timeout)}
}
