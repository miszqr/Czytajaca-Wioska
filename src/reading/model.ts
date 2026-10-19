type BaseExercise={id:string;prompt:string;target:string;choices:readonly string[];hint:string};
export type Exercise=BaseExercise&({type:'syllable-choice'}|{type:'syllable-build';targetParts:readonly string[]});
export type Attempt = {answer:string; correct:boolean; at:number};
export type ReadingProgress = {attempts:Attempt[]; hints:number; completed:boolean};
export const emptyProgress=():ReadingProgress=>({attempts:[],hints:0,completed:false});
export function answerExercise(exercise:Exercise,progress:ReadingProgress,answer:string|readonly number[],at=Date.now()):ReadingProgress{
  let text:string,correct:boolean;
  if(exercise.type==='syllable-choice'){
    if(typeof answer!=='string'||!exercise.choices.includes(answer))return progress;
    text=answer;correct=text===exercise.target;
  }else{
    if(!Array.isArray(answer)||answer.length!==exercise.targetParts.length||new Set(answer).size!==answer.length||!answer.every(i=>Number.isInteger(i)&&i>=0&&i<exercise.choices.length))return progress;
    const parts=answer.map(i=>exercise.choices[i]);text=parts.join('');correct=parts.every((part,i)=>part===exercise.targetParts[i]);
  }
  return {...progress,completed:progress.completed||correct,attempts:[...progress.attempts,{answer:text,correct,at}].slice(-200)};
}
export function useHint(progress:ReadingProgress):ReadingProgress{return {...progress,hints:progress.hints+1}}
