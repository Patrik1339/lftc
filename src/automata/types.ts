import type { GrammarView } from '../grammar/types';

export const EPSILON = 'ε';

export type State = string;
export type Symbol = string;

/** A finite automaton (AFN, AFN-ε or AFD). `alphabet` never contains ε. */
export interface Automaton {
  states: State[];
  alphabet: Symbol[];
  start: State;
  finals: State[];
  delta: Record<State, Record<Symbol, State[]>>;
}

export type Edge = [from: State, symbol: Symbol, to: State];

/**
 * Text that is either literal or an i18n key with interpolation params.
 * `params` are HTML-escaped; `raw` params are trusted HTML (e.g. grammar symbols with subscripts).
 */
export type Text = string | { key: string; params?: Record<string, string | number>; raw?: Record<string, string> };

export interface Highlight {
  /** States drawn with the primary highlight color. */
  states?: State[];
  /** States drawn with the secondary highlight color. */
  states2?: State[];
  /** States drawn faded (e.g. about to be removed). */
  dim?: State[];
  edges?: Edge[];
  /** Explicit fill color per state (used to color equivalence classes). */
  stateColors?: Record<State, string>;
}

export interface GraphView {
  title?: Text;
  automaton: Automaton;
  highlight?: Highlight;
}

export interface StepTable {
  title?: Text;
  headers: Text[];
  rows: string[][];
  highlightRows?: number[];
  /** Cells contain trusted HTML. */
  html?: boolean;
}

export interface Step {
  /** Label of the algorithm phase this step belongs to; the stepper shows phases as jump links. */
  phase?: Text;
  title: Text;
  body: Text;
  graphs?: GraphView[];
  grammars?: GrammarView[];
  tables?: StepTable[];
}

export function emptyAutomaton(): Automaton {
  return { states: [], alphabet: [], start: '', finals: [], delta: {} };
}

export function targets(a: Automaton, q: State, sym: Symbol): State[] {
  return a.delta[q]?.[sym] ?? [];
}

export function addEdge(a: Automaton, from: State, sym: Symbol, to: State): void {
  const row = (a.delta[from] ??= {});
  const list = (row[sym] ??= []);
  if (!list.includes(to)) list.push(to);
}

export function edges(a: Automaton): Edge[] {
  const out: Edge[] = [];
  for (const q of a.states) {
    const row = a.delta[q] ?? {};
    for (const sym of [EPSILON, ...a.alphabet]) {
      for (const t of row[sym] ?? []) out.push([q, sym, t]);
    }
  }
  return out;
}

export function hasEpsilon(a: Automaton): boolean {
  return a.states.some((q) => (a.delta[q]?.[EPSILON]?.length ?? 0) > 0);
}

export function isDeterministic(a: Automaton): boolean {
  if (hasEpsilon(a)) return false;
  return a.states.every((q) => a.alphabet.every((s) => targets(a, q, s).length <= 1));
}

export function isComplete(a: Automaton): boolean {
  return a.states.every((q) => a.alphabet.every((s) => targets(a, q, s).length >= 1));
}

export function clone(a: Automaton): Automaton {
  const delta: Automaton['delta'] = {};
  for (const [q, row] of Object.entries(a.delta)) {
    delta[q] = {};
    for (const [s, ts] of Object.entries(row)) delta[q][s] = [...ts];
  }
  return { states: [...a.states], alphabet: [...a.alphabet], start: a.start, finals: [...a.finals], delta };
}

/** Sort a set of states by their position in `order`. */
export function sortStates(set: Iterable<State>, order: State[]): State[] {
  const idx = new Map(order.map((q, i) => [q, i]));
  return [...new Set(set)].sort((x, y) => (idx.get(x) ?? 1e9) - (idx.get(y) ?? 1e9));
}

export function setName(set: State[]): string {
  return set.length === 0 ? '∅' : `{${set.join(',')}}`;
}

/** Returns a state name not already used in `a`. */
export function freshName(a: Automaton, preferred: string): string {
  let name = preferred;
  let i = 1;
  while (a.states.includes(name)) name = `${preferred}${i++}`;
  return name;
}

/** States reachable from the start state (BFS order). */
export function reachable(a: Automaton): State[] {
  if (!a.start) return [];
  const seen = [a.start];
  for (let i = 0; i < seen.length; i++) {
    const row = a.delta[seen[i]] ?? {};
    for (const sym of [EPSILON, ...a.alphabet]) {
      for (const t of row[sym] ?? []) if (!seen.includes(t)) seen.push(t);
    }
  }
  return seen;
}

/** Restrict an automaton to the given states. */
export function restrict(a: Automaton, keep: State[]): Automaton {
  const set = new Set(keep);
  const delta: Automaton['delta'] = {};
  for (const q of a.states) {
    if (!set.has(q)) continue;
    delta[q] = {};
    for (const [s, ts] of Object.entries(a.delta[q] ?? {})) {
      const kept = ts.filter((t) => set.has(t));
      if (kept.length) delta[q][s] = kept;
    }
  }
  return {
    states: a.states.filter((q) => set.has(q)),
    alphabet: [...a.alphabet],
    start: a.start,
    finals: a.finals.filter((q) => set.has(q)),
    delta,
  };
}
