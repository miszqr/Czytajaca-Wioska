export function canSpeak(){return typeof window!=='undefined'&&'speechSynthesis' in window&&'SpeechSynthesisUtterance' in window}
export function speak(text:string){
  if(!canSpeak())return false;
  const synth=window.speechSynthesis;synth.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.lang='pl-PL';utterance.rate=.82;
  const polish=synth.getVoices().find(voice=>voice.lang.toLowerCase().startsWith('pl'));if(polish)utterance.voice=polish;
  synth.speak(utterance);return true;
}
export function stopSpeech(){if(canSpeak())window.speechSynthesis.cancel()}
