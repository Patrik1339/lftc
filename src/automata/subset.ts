import { epsilonClosure, move } from './simulate';
import { Automaton, Edge, State, Step, StepTable, hasEpsilon, setName } from './types';

export interface SubsetOptions {
  /** Keep the empty set ∅ as an explicit (sink) state of the AFD. */
  includeEmpty: boolean;
}

export interface SubsetResult {
  result: Automaton;
  /** AFD state name → set of AFN states it represents. */
  subsets: Record<State, State[]>;
  steps: Step[];
}

/** Subset construction (AFN → AFD). ε-transitions, if present, are handled with ε-closures. */
export function subsetConstruction(a: Automaton, opts: SubsetOptions = { includeEmpty: true }): SubsetResult {
  const steps: Step[] = [];
  const withEpsilon = hasEpsilon(a);
  const close = (set: State[]) => (withEpsilon ? epsilonClosure(a, set) : set);
  const nfa = { title: { key: 'graph.afn' }, automaton: a };

  const dfa: Automaton = { states: [], alphabet: [...a.alphabet], start: '', finals: [], delta: {} };
  const subsets: Record<State, State[]> = {};
  const queue: State[] = [];
  const addSubset = (set: State[]): State => {
    const name = setName(set);
    if (!subsets[name]) {
      subsets[name] = set;
      dfa.states.push(name);
      dfa.delta[name] = {};
      queue.push(name);
    }
    return name;
  };

  // Subset table: one row per AFD state, one column per symbol.
  const cells: Record<State, Record<string, string>> = {};
  const table = (hlState?: State): StepTable => ({
    title: { key: 'subset.tbl' },
    headers: [{ key: 'col.dfaState' }, ...a.alphabet],
    rows: dfa.states.map((s) => [
      `${s === dfa.start ? '→ ' : ''}${s}`,
      ...a.alphabet.map((sym) => cells[s]?.[sym] ?? ''),
    ]),
    highlightRows: hlState ? [dfa.states.indexOf(hlState)] : [],
  });

  steps.push({
    title: { key: 'subset.s.intro.t' },
    body: { key: withEpsilon ? 'subset.s.intro.epsilon' : 'subset.s.intro.b' },
    graphs: [nfa],
  });

  const start = addSubset(close([a.start]));
  dfa.start = start;
  steps.push({
    title: { key: 'subset.s.start.t' },
    body: { key: withEpsilon ? 'subset.s.start.epsilon' : 'subset.s.start.b', params: { q0: a.start, S: start } },
    graphs: [
      { ...nfa, highlight: { states: subsets[start] } },
      { title: { key: 'graph.afdBuilding' }, automaton: structuredClone(dfa), highlight: { states: [start] } },
    ],
    tables: [table(start)],
  });

  while (queue.length) {
    const S = queue.shift()!;
    const set = subsets[S];
    for (const sym of a.alphabet) {
      const mv = move(a, set, sym);
      const T = close(mv);
      const Tname = setName(T);
      cells[S] ??= {};
      cells[S][sym] = Tname;
      const skip = T.length === 0 && !opts.includeEmpty;
      const isNew = !skip && !subsets[Tname];
      if (!skip) {
        addSubset(T);
        dfa.delta[S][sym] = [Tname];
      }
      steps.push({
        title: { key: 'subset.s.move.t', params: { S, a: sym } },
        body: {
          key: skip ? 'subset.s.move.skip' : isNew ? 'subset.s.move.new' : 'subset.s.move.old',
          params: {
            S,
            a: sym,
            parts: set.map((q) => `δ(${q}, ${sym}) = ${setName(move(a, [q], sym))}`).join('; '),
            mv: setName(mv),
            T: Tname,
            closure: withEpsilon ? `ε-cl(${setName(mv)}) = ${Tname}` : '',
          },
        },
        graphs: [
          { ...nfa, highlight: { states: set, states2: T } },
          {
            title: { key: 'graph.afdBuilding' },
            automaton: structuredClone(dfa),
            highlight: { states: [S], states2: isNew ? [Tname] : [], edges: skip ? [] : [[S, sym, Tname] as Edge] },
          },
        ],
        tables: [table(S)],
      });
    }
  }

  dfa.finals = dfa.states.filter((s) => subsets[s].some((q) => a.finals.includes(q)));
  steps.push({
    title: { key: 'subset.s.finals.t' },
    body: { key: 'subset.s.finals.b', params: { F: setName(a.finals), F2: dfa.finals.join(', ') || '∅' } },
    graphs: [{ title: { key: 'graph.afdBuilding' }, automaton: structuredClone(dfa), highlight: { states: dfa.finals } }],
    tables: [table()],
  });
  steps.push({
    title: { key: 'subset.s.done.t' },
    body: { key: 'subset.s.done.b', params: { n: dfa.states.length } },
    graphs: [nfa, { title: { key: 'graph.afd' }, automaton: dfa }],
    tables: [table()],
  });

  return { result: dfa, subsets, steps };
}
