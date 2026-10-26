// Stable tree IDs connect the scenery to the interactions and saved harvest.
export const APPLE_TREES=[
 {id:'apple-tree-plaza',x:5,z:4,scale:1},
 {id:'apple-tree-home',x:15,z:1,scale:1.2},
] as const;
export const APPLES_PER_TREE=6;
export function applePickedFlag(treeId:string,index:number){return `${treeId}-fruit-${index+1}-picked`}
