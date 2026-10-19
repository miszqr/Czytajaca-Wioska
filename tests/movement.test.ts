import {it,expect} from 'vitest';
import {movementVector,moveWithSlide,blocked,turnTowards,deadzone} from '../src/game/movement';
it('W podąża za obrotem kamery, a przekątna nie przyspiesza',()=>{
  expect(movementVector(0,1,Math.PI/2).x).toBeCloseTo(1);expect(movementVector(0,1,Math.PI/2).z).toBeCloseTo(0);
  const diagonal=movementVector(1,1,0);expect(Math.hypot(diagonal.x,diagonal.z)).toBeCloseTo(1);
});
it('małe kroki zapobiegają przenikaniu, pozwalają ślizgać się po ścianie i zatrzymują nad wodą',()=>{
  const walls=[{id:'house',type:'box' as const,x:0,z:0,halfX:1,halfZ:2},{id:'pond',type:'circle' as const,x:8,z:0,radius:3}];
  const result=moveWithSlide({x:-3,z:0},{x:5,z:1},walls);expect(result.x).toBeLessThan(-1.27);expect(result.z).toBeCloseTo(1);expect(blocked(result,walls)).toBe(false);
  const pond=moveWithSlide({x:4,z:0},{x:4,z:0},walls);expect(pond.x).toBeLessThan(4.73);expect(blocked(pond,walls)).toBe(false);
});
it('obrót wybiera krótszą stronę, dryf pada jest ignorowany, granice są zamknięte',()=>{
  expect(turnTowards(Math.PI-.1,-Math.PI+.1,.1)).toBeCloseTo(Math.PI);expect(deadzone(.1)).toBe(0);expect(deadzone(-1)).toBe(-1);
  expect(blocked({x:50,z:0},[])).toBe(true);
});
