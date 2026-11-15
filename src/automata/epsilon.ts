import { epsilonClosure, move } from './simulate';
import { Automaton, Edge, EPSILON, State, Step, StepTable, addEdge, edges, reachable, restrict, setName } from './types';

export interface EpsilonResult {
  result: Automaton;
  closures: Record<State, State[]>;
  steps: Step[];
}

/**
 * ε-transition elimination:
 *   δ'(q, a) = ε-cl( δ( ε-cl(q), a ) )
 *   F' = { q | ε-cl(q) ∩ F ≠ ∅ }
 */
export function eliminateEpsilon(a: Automaton): EpsilonResult {
  const steps: Step[] = [];
  const epsilonEdges: Edge[] = edges(a).filter(([, s]) => s === EPSILON);
  const original = { title: { key: 'graph.original' }, automaton: a };

  steps.push({
    title: { key: 'epsilon.s.intro.t' },
    body: { key: 'epsilon.s.intro.b', params: { n: epsilonEdges.length } },
    graphs: [{ ...original, highlight: { edges: epsilonEdges } }],
  });

  // 1. ε-closures
  const closures: Record<State, State[]> = {};
  const closureTable = (hl: number): StepTable => ({
    title: { key: 'epsilon.tbl.closures' },
    headers: [{ key: 'col.state' }, 'ε-cl'],
    rows: a.states.filter((q) => closures[q]).map((q) => [q, setName(closures[q])]),
    highlightRows: [hl],
  });
  a.states.forEach((q, i) => {
    closures[q] = epsilonClosure(a, [q]);
    const lamEdgesInside = epsilonEdges.filter(([f]) => closures[q].includes(f));
    steps.push({
      title: { key: 'epsilon.s.closure.t', params: { q } },
      body: {
        key: closures[q].length === 1 ? 'epsilon.s.closure.b1' : 'epsilon.s.closure.b',
        params: { q, cl: setName(closures[q]) },
      },
      graphs: [{ ...original, highlight: { states: [q], states2: closures[q].filter((x) => x !== q), edges: lamEdgesInside } }],
      tables: [closureTable(i)],
    });
  });

  // 2. new transitions
  const result: Automaton = { states: [...a.states], alphabet: [...a.alphabet], start: a.start, finals: [], delta: {} };
  const transRows: string[][] = [];
  const transTable = (): StepTable => ({
    title: { key: 'epsilon.tbl.delta' },
    headers: [{ key: 'col.state' }, { key: 'col.symbol' }, 'ε-cl(q)', 'δ(ε-cl(q), a)', "δ'(q, a)"],
    rows: transRows.map((r) => [...r]),
    highlightRows: [transRows.length - 1],
  });
  for (const q of a.states) {
    for (const sym of a.alphabet) {
      const mid = move(a, closures[q], sym);
      const fin = epsilonClosure(a, mid);
      for (const t of fin) addEdge(result, q, sym, t);
      transRows.push([q, sym, setName(closures[q]), setName(mid), setName(fin)]);
      const snapshot = structuredClone(result);
      steps.push({
        title: { key: 'epsilon.s.delta.t', params: { q, a: sym } },
        body: {
          key: fin.length ? 'epsilon.s.delta.b' : 'epsilon.s.delta.empty',
          params: { q, a: sym, cl: setName(closures[q]), mid: setName(mid), fin: setName(fin) },
        },
        graphs: [
          { ...original, highlight: { states: closures[q], states2: fin } },
          {
            title: { key: 'graph.building' },
            automaton: snapshot,
            highlight: { states: [q], edges: fin.map((t): Edge => [q, sym, t]) },
          },
        ],
        tables: [transTable()],
      });
    }
  }

  // 3. final states
  result.finals = a.states.filter((q) => closures[q].some((x) => a.finals.includes(x)));
  const added = result.finals.filter((q) => !a.finals.includes(q));
  steps.push({
    title: { key: 'epsilon.s.finals.t' },
    body: {
      key: added.length ? 'epsilon.s.finals.b' : 'epsilon.s.finals.none',
      params: { F: setName(a.finals), added: setName(added), F2: setName(result.finals) },
    },
    graphs: [{ title: { key: 'graph.building' }, automaton: structuredClone(result), highlight: { states: added } }],
    tables: [
      {
        headers: [{ key: 'col.state' }, 'ε-cl(q)', { key: 'col.final' }],
        rows: a.states.map((q) => [q, setName(closures[q]), result.finals.includes(q) ? '✓' : '']),
        highlightRows: added.map((q) => a.states.indexOf(q)),
      },
    ],
  });

  // 4. inaccessible states
  const reach = reachable(result);
  const unreachable = result.states.filter((q) => !reach.includes(q));
  let final = result;
  if (unreachable.length) {
    steps.push({
      title: { key: 'epsilon.s.unreach.t' },
      body: { key: 'epsilon.s.unreach.b', params: { list: setName(unreachable) } },
      graphs: [{ title: { key: 'graph.building' }, automaton: result, highlight: { dim: unreachable } }],
    });
    final = restrict(result, reach);
  }

  steps.push({
    title: { key: 'epsilon.s.done.t' },
    body: { key: 'epsilon.s.done.b' },
    graphs: [original, { title: { key: 'graph.result' }, automaton: final }],
  });

  return { result: final, closures, steps };
}
