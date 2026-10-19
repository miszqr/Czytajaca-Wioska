import type {Exercise} from '../reading/model';
export const FIRST_QUEST = {
  id:'bruno-ma',npcId:'bruno',title:'Pierwsze nasionko',
  description:'Odwiedź Brunona w ogrodzie.',
  dialogue:['Cześć! Jestem Bruno. Dbam o nasz ogród.','Pomożesz mi znaleźć MA? Tak zaczyna się słowo MAK.'],
  exercise:{id:'find-ma',type:'syllable-choice',prompt:'Znajdź sylabę MA.',target:'MA',choices:['LA','MA','TO'],hint:'Poszukaj liter M i A, które stoją obok siebie.'} satisfies Exercise,
  reward:{id:'mak-seed',name:'Nasionko maku',quantity:1},
  thanks:'Tak, to MA! Dziękuję, Kitku. To nasionko maku jest dla ciebie.',
} as const;
