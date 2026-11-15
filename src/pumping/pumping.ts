import type { PumpingLanguage } from './languages';

export interface Split {
  x: string;
  y: string;
  z: string;
}

export const pump = ({ x, y, z }: Split, i: number) => x + y.repeat(i) + z;

/** All decompositions w = xyz with |xy| ≤ p and |y| ≥ 1. */
export function allSplits(w: string, p: number): Split[] {
  const out: Split[] = [];
  for (let xl = 0; xl < Math.min(p, w.length); xl++) {
    for (let yl = 1; xl + yl <= Math.min(p, w.length); yl++) {
      out.push({ x: w.slice(0, xl), y: w.slice(xl, xl + yl), z: w.slice(xl + yl) });
    }
  }
  return out;
}

/** The first i (tried in the order 0, 2, 3, ...) for which xyⁱz ∉ L, or null. */
export function breakingI(lang: PumpingLanguage, s: Split, maxI = s.x.length + s.y.length + s.z.length + 2): number | null {
  for (const i of [0, ...Array.from({ length: Math.max(0, maxI - 1) }, (_, k) => k + 2)]) {
    if (!lang.inL(pump(s, i))) return i;
  }
  return null;
}

export function randomP(max = 7, min = 2): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}
