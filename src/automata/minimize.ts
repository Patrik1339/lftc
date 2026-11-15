import { Automaton, State, Step, addEdge, clone, freshName, isComplete, reachable, restrict, setName, targets } from './types';

export const CLASS_COLORS = ['#93c5fd', '#fca5a5', '#86efac', '#fde68a', '#c4b5fd', '#fdba74', '#67e8f9', '#f9a8d4', '#bef264', '#d6d3d1'];

export interface MinimizeResult {
  result: Automaton;
  /** The partition after each iteration (≡0, ≡1, ...). */
  partitions: State[][][];
  steps: Step[];
}

const className = (i: number) => `C${i + 1}`;

/**
 * AFD minimization:
 *   1. remove inaccessible states,
 *   2. complete the automaton with a sink state if δ is partial,
 *   3. refine ≡0 = {F, Q∖F} into ≡k+1 (p ≡k+1 q iff p ≡k q and δ(p,a) ≡k δ(q,a) ∀a) until stable,
 *   4. build the quotient automaton.
 * Expects a deterministic automaton (see isDeterministic).
 */
export function minimize(input: Automaton): MinimizeResult {
  const steps: Step[] = [];
  steps.push({
    title: { key: 'min.s.intro.t' },
    body: { key: 'min.s.intro.b' },
    graphs: [{ title: { key: 'graph.original' }, automaton: input }],
  });

  // 1. accessibility
  const reach = reachable(input);
  const unreachable = input.states.filter((q) => !reach.includes(q));
  steps.push({
    title: { key: 'min.s.reach.t' },
    body: {
      key: unreachable.length ? 'min.s.reach.b' : 'min.s.reach.none',
      params: { reach: setName(reach), list: setName(unreachable) },
    },
    graphs: [{ title: { key: 'graph.original' }, automaton: input, highlight: { states: reach, dim: unreachable } }],
  });
  let a = restrict(input, reach);

  // 2. completion
  if (!isComplete(a)) {
    a = clone(a);
    const sink = freshName(a, '∅');
    const missing: string[] = [];
    a.states.push(sink);
    for (const q of a.states) {
      for (const sym of a.alphabet) {
        if (targets(a, q, sym).length === 0) {
          addEdge(a, q, sym, sink);
          if (q !== sink) missing.push(`δ(${q}, ${sym})`);
        }
      }
    }
    steps.push({
      title: { key: 'min.s.complete.t' },
      body: { key: 'min.s.complete.b', params: { sink, list: missing.join(', ') } },
      graphs: [{ title: { key: 'graph.complete' }, automaton: a, highlight: { states2: [sink], edges: a.states.flatMap((q) => a.alphabet.filter((s) => targets(a, q, s)[0] === sink).map((s) => [q, s, sink] as [string, string, string])) } }],
    });
  }

  // 3. partition refinement
  const finals = a.states.filter((q) => a.finals.includes(q));
  const nonFinals = a.states.filter((q) => !a.finals.includes(q));
  let partition: State[][] = [finals, nonFinals].filter((c) => c.length).sort((x, y) => a.states.indexOf(x[0]) - a.states.indexOf(y[0]));
  const partitions = [partition];
  const classOf = (p: State[][]) => {
    const m: Record<State, number> = {};
    p.forEach((c, i) => c.forEach((q) => (m[q] = i)));
    return m;
  };
  const colorsFor = (p: State[][]) => {
    const m: Record<State, string> = {};
    p.forEach((c, i) => c.forEach((q) => (m[q] = CLASS_COLORS[i % CLASS_COLORS.length])));
    return m;
  };
  const describe = (p: State[][]) => p.map((c, i) => `${className(i)} = ${setName(c)}`).join(', ');

  steps.push({
    title: { key: 'min.s.eq0.t' },
    body: { key: 'min.s.eq0.b', params: { classes: describe(partition) } },
    graphs: [{ title: { key: 'graph.complete' }, automaton: a, highlight: { stateColors: colorsFor(partition) } }],
    tables: [{
      title: '≡0',
      headers: [{ key: 'col.class' }, { key: 'col.states' }],
      rows: partition.map((c, i) => [className(i), setName(c)]),
    }],
  });

  for (let k = 0; ; k++) {
    const cls = classOf(partition);
    const signature = (q: State) => [cls[q], ...a.alphabet.map((s) => cls[targets(a, q, s)[0]])].join('|');
    const groups = new Map<string, State[]>();
    for (const q of a.states) groups.set(signature(q), [...(groups.get(signature(q)) ?? []), q]);
    // Keep refined classes ordered by the first state that appears in them.
    const next = [...groups.values()].sort((x, y) => a.states.indexOf(x[0]) - a.states.indexOf(y[0]));
    const nextCls = classOf(next);
    const stable = next.length === partition.length;

    steps.push({
      title: { key: 'min.s.iter.t', params: { k, k1: k + 1 } },
      body: {
        key: stable ? 'min.s.iter.stable' : 'min.s.iter.b',
        params: { k, k1: k + 1, classes: describe(next) },
      },
      graphs: [{ title: { key: 'graph.complete' }, automaton: a, highlight: { stateColors: colorsFor(next) } }],
      tables: [{
        title: `≡${k} → ≡${k + 1}`,
        headers: [{ key: 'col.state' }, `≡${k}`, ...a.alphabet.map((s) => `δ(q, ${s})`), `≡${k + 1}`],
        rows: a.states.map((q) => [
          q,
          className(cls[q]),
          ...a.alphabet.map((s) => {
            const t = targets(a, q, s)[0];
            return `${t} ∈ ${className(cls[t])}`;
          }),
          className(nextCls[q]),
        ]),
      }],
    });
    partition = next;
    partitions.push(partition);
    if (stable) break;
  }

  // 4. quotient automaton
  const cls = classOf(partition);
  const nameOf = (c: State[]) => (c.length === 1 ? c[0] : `[${c.join(',')}]`);
  const names = partition.map(nameOf);
  const result: Automaton = {
    states: names,
    alphabet: [...a.alphabet],
    start: names[cls[a.start]],
    finals: partition.filter((c) => a.finals.includes(c[0])).map(nameOf),
    delta: {},
  };
  partition.forEach((c, i) => {
    for (const s of a.alphabet) addEdge(result, names[i], s, names[cls[targets(a, c[0], s)[0]]]);
  });
  const resultColors: Record<State, string> = {};
  names.forEach((n, i) => (resultColors[n] = CLASS_COLORS[i % CLASS_COLORS.length]));

  steps.push({
    title: { key: 'min.s.quotient.t' },
    body: { key: 'min.s.quotient.b', params: { n: input.states.length, m: result.states.length } },
    graphs: [
      { title: { key: 'graph.complete' }, automaton: a, highlight: { stateColors: colorsFor(partition) } },
      { title: { key: 'graph.minimal' }, automaton: result, highlight: { stateColors: resultColors } },
    ],
    tables: [{
      headers: [{ key: 'col.class' }, { key: 'col.states' }, ...a.alphabet],
      rows: partition.map((c, i) => [names[i], setName(c), ...a.alphabet.map((s) => targets(result, names[i], s)[0])]),
    }],
  });

  return { result, partitions, steps };
}
