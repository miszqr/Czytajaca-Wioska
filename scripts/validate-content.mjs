import {readFile} from 'node:fs/promises';
import {validateManifest,validatePack} from '../src/content/validate.ts';
const base=new URL('../public/content/',import.meta.url);
async function read(path){try{return JSON.parse(await readFile(new URL(path,base),'utf8'))}catch(error){throw new Error(`${path}: ${error.message}`)}}
try{
 const manifest=validateManifest(await read('manifest.json'));
 const [characters,items,...quests]=await Promise.all([manifest.characters,manifest.items,...manifest.quests].map(read));
 const pack=validatePack(characters,items,quests,manifest.quests);
 console.log(`Treści poprawne: ${pack.characters.length} mieszkańców, ${pack.quests.length} zadań, ${pack.items.length} przedmiotów.`);
}catch(error){console.error(error.message);process.exitCode=1}
