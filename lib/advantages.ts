import { ADVANTAGES } from "./advantages-data";

export const ADVANTAGE_COUNT = ADVANTAGES.length;
export const DUEL_COUNT = (ADVANTAGE_COUNT * (ADVANTAGE_COUNT - 1)) / 2;

export function idxToLetter(i: number): string {
  return "ABCDEFGHI"[i];
}

export function advantage(id: number) {
  return ADVANTAGES[id];
}
