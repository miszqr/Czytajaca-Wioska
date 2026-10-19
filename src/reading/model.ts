export type Exercise = {id:string; type:'syllable-choice'; prompt:string; target:string; choices:readonly string[]; hint:string};
export type Attempt = {answer:string; correct:boolean; at:number};
export type ReadingProgress = {attempts:Attempt[]; hints:number; completed:boolean};
export const emptyProgress=():ReadingProgress=>({attempts:[],hints:0,completed:false});
export function checkAnswer(exercise:Exercise,answer:string){return answer.trim().normalize('NFC').toLocaleUpperCase('pl-PL')===exercise.target}
export function answerExercise(exercise:Exercise,progress:ReadingProgress,answer:string,at=Date.now()):ReadingProgress{
  if(!exercise.choices.includes(answer))return progress;
  const correct=checkAnswer(exercise,answer);
  return {...progress,completed:progress.completed||correct,attempts:[...progress.attempts,{answer,correct,at}].slice(-200)};
}
export function useHint(progress:ReadingProgress):ReadingProgress{return {...progress,hints:progress.hints+1}}
