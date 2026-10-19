import {describe,it,expect} from 'vitest';
import 'fake-indexeddb/auto';
import {FIRST_QUEST} from '../src/data/quests';
import {answerExercise,emptyProgress,useHint} from '../src/reading/model';
import {newQuest,startQuest,completeQuest} from '../src/quests/model';
import {newSave,validateSave} from '../src/persistence/state';
import {SaveStore} from '../src/persistence/store';
describe('pierwsze zadanie',()=>{
  it('błędna odpowiedź pozwala spróbować ponownie, a MA kończy zadanie tylko raz',()=>{
    let q=startQuest(newQuest());q.reading=answerExercise(FIRST_QUEST.exercise,q.reading,'LA',1);
    expect(completeQuest(q).status).toBe('active');q.reading=useHint(q.reading);
    q.reading=answerExercise(FIRST_QUEST.exercise,q.reading,'MA',2);q=completeQuest(q);
    expect(q.status).toBe('completed');expect(q.rewardGranted).toBe(true);expect(q.reading.attempts).toHaveLength(2);
    expect(q.reading.hints).toBe(1);expect(completeQuest(q)).toEqual(q);
  });
  it('ignoruje odpowiedzi spoza ćwiczenia',()=>{const p=emptyProgress();expect(answerExercise(FIRST_QUEST.exercise,p,'XX')).toBe(p)});
});
describe('zapis',()=>{
  it('odrzuca uszkodzone dane i przyszłe schematy',()=>{
    expect(validateSave({version:2})).toBeNull();expect(validateSave({...newSave(),player:{x:NaN,z:0,heading:0}})).toBeNull();
    expect(validateSave({...newSave(),quest:{...newQuest(),status:'completed'}})).toBeNull();
  });
  it('odtwarza zadanie, próby i pozycję przez nowe połączenie IndexedDB',async()=>{
    const first=new SaveStore(),s=newSave();s.player={x:3,z:4,heading:1.2};s.quest=startQuest(s.quest);
    s.quest.reading=answerExercise(FIRST_QUEST.exercise,s.quest.reading,'MA',10);s.quest=completeQuest(s.quest);
    await first.save(s);await first.close();const second=new SaveStore(),loaded=await second.load();
    expect(loaded?.player).toEqual(s.player);expect(loaded?.quest).toEqual(s.quest);expect(second.mode).toBe('indexeddb');await second.close();
  });
  it('kolejka zachowuje najnowszy zapis',async()=>{const store=new SaveStore(),a=newSave(),b=newSave();b.player.x=8;await Promise.all([store.save(a),store.save(b)]);expect((await store.load())?.player.x).toBe(8);await store.close()});
});
