import type {Exercise} from '../reading/model';
export type Behavior={type:'idle'}|{type:'patrol';speed:number;pauseSeconds:number;waypoints:{x:number;z:number}[]};
export type CharacterDefinition={id:string;name:string;role:string;model:'bruno'|'fela';position:{x:number;z:number;heading:number};behavior:Behavior};
export type ItemDefinition={id:string;name:string;icon:'seed'|'apple'};
export type QuestDefinition={
  version:1;id:string;revision:number;npcId:string;title:string;description:string;requires:string[];
  dialogue:{intro:string[];active:string[];completed:string[];acceptLabel:string;replayLabel:string};
  exercise:Exercise;feedback:{retry:string;success:string;practice:string};reward:{itemId:string;quantity:number};
};
export type ContentPack={characters:CharacterDefinition[];items:ItemDefinition[];quests:QuestDefinition[]};
export type Manifest={version:1;characters:string;items:string;quests:string[]};
