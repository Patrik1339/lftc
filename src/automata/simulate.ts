import { Automaton, EPSILON, State, Symbol, sortStates, targets } from './types';

export function epsilonClosure(a: Automaton, set: Iterable<State>): State[] {
  const out = [...new Set(set)];
  for (let i = 0; i < out.length; i++) {
    for (const t of targets(a, out[i], EPSILON)) if (!out.includes(t)) out.push(t);
  }
  return sortStates(out, a.states);
}

export function move(a: Automaton, set: State[], sym: Symbol): State[] {
  const out = new Set<State>();
  for (const q of set) for (const t of targets(a, q, sym)) out.add(t);
  return sortStates(out, a.states);
}

export function accepts(a: Automaton, word: Symbol[]): boolean {
  let cur = epsilonClosure(a, [a.start]);
  for (const sym of word) {
    cur = epsilonClosure(a, move(a, cur, sym));
    if (cur.length === 0) return false;
  }
  return cur.some((q) => a.finals.includes(q));
}

/** Split a typed word into symbols: single characters if the alphabet allows it, else by spaces. */
export function splitWord(a: Automaton, input: string): Symbol[] {
  const trimmed = input.trim();
  if (trimmed === '' || trimmed === EPSILON) return [];
  if (/\s/.test(trimmed) || a.alphabet.some((s) => s.length > 1)) return trimmed.split(/\s+/);
  return [...trimmed];
}

/** All words over the alphabet with length <= maxLen. */
export function* allWords(alphabet: Symbol[], maxLen: number): Generator<Symbol[]> {
  yield [];
  let layer: Symbol[][] = [[]];
  for (let len = 1; len <= maxLen; len++) {
    const next: Symbol[][] = [];
    for (const w of layer) for (const s of alphabet) {
      const nw = [...w, s];
      next.push(nw);
      yield nw;
    }
    layer = next;
  }
}
