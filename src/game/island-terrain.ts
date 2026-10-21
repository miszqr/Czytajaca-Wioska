// Shared by rendering, walking, vegetation and the ocean shader.
// The village core keeps its existing elevations, including the pond banks.
export const ISLAND={radius:46,lobes:1.7,coves:.85,slopeStart:35.5,seaLevel:-1.5} as const;
export function smoothRange(start:number,end:number,value:number){
 const t=Math.max(0,Math.min(1,(value-start)/(end-start)));return t*t*(3-2*t);
}
export function shoreRadius(angle:number){return ISLAND.radius+ISLAND.lobes*Math.sin(3*angle)+ISLAND.coves*Math.cos(5*angle)}
/** Positive on land; zero at the waterline. This is a radial distance. */
export function shoreDistance(x:number,z:number){return shoreRadius(Math.atan2(z,x))-Math.hypot(x,z)}
export function onDryLand(x:number,z:number,radius=0){
 // A little extra clearance accounts for the curved shore and the actor's feet.
 return Number.isFinite(x)&&Number.isFinite(z)&&shoreDistance(x,z)>radius*1.1+.45;
}
export function terrainHeight(x:number,z:number){
 const r=Math.hypot(x,z),shore=shoreRadius(Math.atan2(z,x));
 const edge=Math.min(1,Math.max(0,(r-12)/18));
 const hill=edge*(.4*Math.sin(x*.11)*Math.cos(z*.09)+.15*Math.sin(z*.2));
 if(r<=ISLAND.slopeStart)return hill;
 if(r>=shore)return ISLAND.seaLevel-2*smoothRange(0,8,r-shore);
 const descent=smoothRange(ISLAND.slopeStart,shore,r);
 return hill*(1-descent)+ISLAND.seaLevel*descent;
}
export function beachApproach(x:number,z:number,inset=3.6){
 const angle=Math.atan2(z,x),r=shoreRadius(angle)-inset;return [Math.cos(angle)*r,Math.sin(angle)*r];
}
