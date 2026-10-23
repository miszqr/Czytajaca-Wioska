export const GAS_LANTERNS=[
 {id:'lantern-arrival',x:-2.8,z:-6.5},
 {id:'lantern-square',x:3.4,z:2},
 {id:'lantern-bruno',x:-4.8,z:8.2},
 {id:'lantern-fela',x:6.2,z:7.2},
 {id:'lantern-home',x:14,z:-1.5},
 {id:'lantern-library',x:-2.7,z:17},
 {id:'lantern-pond',x:14,z:14.8},
 {id:'lantern-milus',x:9.5,z:-8},
] as const;
export const NIGHT_FLAG='night-mode';
// Sky, sun/moon and all eight lanterns can illuminate the same merged scenery.
export const VILLAGE_LIGHT_LIMIT=GAS_LANTERNS.length+2;
export function lanternLitFlag(id:string){return `${id}-lit`}
