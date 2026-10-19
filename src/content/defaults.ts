// Fixtures use the exact files fetched at runtime, with no second copy of the text.
import characters from '../../public/content/characters.json';
import items from '../../public/content/items.json';
import bruno from '../../public/content/quests/bruno-ma.json';
import fela from '../../public/content/quests/fela-maslo.json';
import {validatePack} from './validate';
export const DEFAULT_CONTENT=validatePack(characters,items,[bruno,fela]);
