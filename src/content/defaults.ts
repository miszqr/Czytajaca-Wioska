// Test fixtures import the same JSON files that the runtime fetches.
import characters from '../../public/content/characters.json';
import items from '../../public/content/items.json';
import interactions from '../../public/content/interactions.json';
import story from '../../public/content/story.json';
import {validatePack} from './validate';
export const DEFAULT_CONTENT=validatePack({characters,items,interactions,story});
