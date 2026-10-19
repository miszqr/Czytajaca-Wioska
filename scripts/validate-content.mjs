import {readFile} from 'node:fs/promises';
import {validateManifest,validatePack} from '../src/content/validate.ts';
const read=async path=>JSON.parse(await readFile(new URL(`../public/content/${path}`,import.meta.url),'utf8'));
try{const m=validateManifest(await read('manifest.json'));const [characters,items,interactions,story]=await Promise.all([m.characters,m.items,m.interactions,m.story].map(read));const p=validatePack({characters,items,interactions,story});console.log(`Treści poprawne: ${p.characters.length} mieszkańców, ${p.story.scenes.length} scen, ${p.story.nodes.length} dialogów, ${p.items.length} przedmiotów.`)}catch(error){console.error(error.message);process.exitCode=1}
