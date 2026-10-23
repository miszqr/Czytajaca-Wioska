import {beachApproach} from './island-terrain';

// Shared positions keep the world and the minimap in agreement.
export const COTTAGES={
 kitek:{name:'Dom Kitka',x:18,z:8,width:5.5,depth:4.8,peak:5.8,accent:'#77A8C6',accentLight:'#9ABED1',roof:['#B77652','#CB8D62','#B97D58','#D39B70'],wood:['#B78253','#C18D5C','#AD794D'],moss:0},
 bruno:{name:'Dom Brunona',x:-10,z:10,width:5.2,depth:4.5,peak:5.35,accent:'#708863',accentLight:'#9CAB7C',roof:['#8B7954','#A08B60','#947E53','#AF986D'],wood:['#A8784D','#B68557','#9D714A'],moss:.75},
 milus:{name:'Dom Milusia',x:13,z:-12,width:5,depth:4.4,peak:5.6,accent:'#AE7765',accentLight:'#D39E82',roof:['#7C7970','#928B7D','#837C70','#A29882'],wood:['#B8865F','#C6956A','#AC7C56'],moss:.3},
} as const;
export const FELA_HOUSE={x:10,z:9,name:'Sklep Feli'} as const;
export const TOLA_LIBRARY={x:0,z:23,name:'Biblioteka Toli'} as const;
export const VILLAGE_PATHS=[
 {points:[beachApproach(0,-49),[-5,-27],[5,-8],[0,0]],width:3.4},
 {points:[[0,0],[-2,10],[2,28],beachApproach(4,49)],width:3.1},
 {points:[beachApproach(-49,10),[-18,15],[-10,0],[0,0]],width:3},
 {points:[[0,0],[10,-2],[28,2],beachApproach(49,-3)],width:3},
 {points:[[0,0],[8,0],[15,1],[18,4.7]],width:2},
];
