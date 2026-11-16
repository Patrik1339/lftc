import type { Step, StepTable, Text } from '../automata/types';
import {
  Grammar,
  PhaseResult,
  Rhs,
  Sym,
  addNT,
  addProd,
  altsHtml,
  clone,
  freshName,
  isNT,
  pkey,
  prodHtml,
  restrictGrammar,
  rhsHtml,
  setHtml,
  symHtml,
} from './types';

export const txt = (key: string, raw?: Record<string, string>, params?: Record<string, string | number>): Text => ({ key, raw, params });

/** Table of the successive sets of a fixpoint iteration (N0, N1, …). */
function iterTable(title: string, letter: string, iters: Sym[][], hl: number): StepTable {
  return {
    title: txt(title),
    headers: ['i', `${letter}<sub>i</sub>`],
    rows: iters.slice(0, hl + 1).map((s, i) => [String(i), setHtml(s)]),
    highlightRows: [hl],
    html: true,
  };
}

const keys = (A: Sym, alts: Rhs[]) => alts.map((r) => pkey(A, r));

// ---------------------------------------------------------------- 1. ε-productions

/** All ways of deleting some of the nullable occurrences in rhs (never producing ε). */
function nullableVariants(rhs: Rhs, nullable: Set<Sym>): Rhs[] {
  const pos = rhs.flatMap((X, i) => (nullable.has(X) ? [i] : []));
  const out: Rhs[] = [];
  const seen = new Set<string>();
  for (let mask = 0; mask < 1 << pos.length; mask++) {
    const drop = new Set(pos.filter((_, b) => mask & (1 << b)));
    const v = rhs.filter((_, i) => !drop.has(i));
    if (v.length && !seen.has(v.join(' '))) {
      seen.add(v.join(' '));
      out.push(v);
    }
  }
  return out;
}

export function nullableSets(g: Grammar): Sym[][] {
  let cur = g.nonterminals.filter((A) => g.prods[A].some((r) => !r.length));
  const iters = [cur];
  for (;;) {
    const set = new Set(cur);
    const next = g.nonterminals.filter((A) => set.has(A) || g.prods[A].some((r) => r.every((X) => set.has(X))));
    if (next.length === cur.length) return iters;
    iters.push((cur = next));
  }
}

export function eliminateEpsilonProds(g: Grammar): PhaseResult {
  const phase = txt('cfg.ph.eps');
  const steps: Step[] = [];
  const epsNts = g.nonterminals.filter((A) => g.prods[A].some((r) => !r.length));
  const onlyStart = epsNts.length === 1 && epsNts[0] === g.start && !g.nonterminals.some((A) => g.prods[A].some((r) => r.includes(g.start)));
  if (!epsNts.length || onlyStart) {
    steps.push({
      phase,
      title: txt('cfg.eps.none.t'),
      body: txt(onlyStart ? 'cfg.eps.onlyStart.b' : 'cfg.eps.none.b', { S: symHtml(g.start) }),
      grammars: [{ grammar: g }],
    });
    return { result: g, steps };
  }

  const iters = nullableSets(g);
  const nullable = iters[iters.length - 1];
  const nullSet = new Set(nullable);
  iters.forEach((s, i) => {
    steps.push({
      phase,
      title: txt('cfg.eps.null.t', undefined, { i }),
      body:
        i === 0
          ? txt('cfg.eps.null0.b', { N: setHtml(s) })
          : txt('cfg.eps.nullI.b', { N: setHtml(s), prev: setHtml(iters[i - 1]) }, { i, i1: i - 1 }),
      grammars: [{ grammar: g, highlight: { nts: s, removed: epsNts.map((A) => pkey(A, [])) } }],
      tables: [iterTable('cfg.tbl.nullable', 'N', iters, i)],
    });
  });
  steps.push({
    phase,
    title: txt('cfg.eps.stable.t'),
    body: txt('cfg.eps.stable.b', { N: setHtml(nullable) }, { k: iters.length - 1, k1: iters.length }),
    grammars: [{ grammar: g, highlight: { nts: nullable } }],
    tables: [iterTable('cfg.tbl.nullable', 'N', iters, iters.length - 1)],
  });

  // New productions: every way of omitting nullable occurrences; ε-productions are dropped.
  const result: Grammar = { start: g.start, nonterminals: [...g.nonterminals], terminals: [...g.terminals], prods: {} };
  for (const A of g.nonterminals) result.prods[A] = [];
  const added: string[] = [];
  for (const A of g.nonterminals) {
    const rows: string[][] = [];
    for (const rhs of g.prods[A]) {
      if (!rhs.length) {
        rows.push([prodHtml(A, rhs), '—']);
        continue;
      }
      const vs = nullableVariants(rhs, nullSet);
      for (const v of vs) if (addProd(result, A, v) && v.length !== rhs.length) added.push(pkey(A, v));
      if (vs.length > 1 || rhs.some((X) => nullSet.has(X))) rows.push([prodHtml(A, rhs), vs.map(rhsHtml).join(' | ')]);
    }
    if (!rows.length) continue;
    steps.push({
      phase,
      title: txt('cfg.eps.prod.t', { A: symHtml(A) }),
      body: txt('cfg.eps.prod.b', { A: symHtml(A), N: setHtml(nullable) }),
      grammars: [{ title: txt('gview.building'), grammar: clone(result), highlight: { nts: [A], added: added.filter((k) => k.startsWith(`${A}→`)) } }],
      tables: [{ headers: [txt('col.prod'), txt('col.newProds')], rows, html: true }],
    });
  }

  // ε ∈ L(G) iff S is nullable; keep it with a start symbol that never appears on a right-hand side.
  if (nullSet.has(g.start)) {
    const onRhs = g.nonterminals.some((A) => g.prods[A].some((r) => r.includes(g.start)));
    let S1 = g.start;
    if (onRhs) {
      S1 = freshName(result, `${g.start}'`);
      addNT(result, S1, true);
      result.start = S1;
      addProd(result, S1, [g.start]);
    }
    addProd(result, S1, []);
    steps.push({
      phase,
      title: txt('cfg.eps.start.t'),
      body: txt(onRhs ? 'cfg.eps.start.new' : 'cfg.eps.start.keep', { S: symHtml(g.start), S1: symHtml(S1) }),
      grammars: [{ title: txt('gview.building'), grammar: clone(result), highlight: { nts: [S1], added: keys(S1, result.prods[S1].filter((r) => r.length <= 1)) } }],
    });
  }

  steps.push({
    phase,
    title: txt('cfg.eps.done.t'),
    body: txt('cfg.eps.done.b'),
    grammars: [
      { title: txt('gview.before'), grammar: g, highlight: { removed: epsNts.map((A) => pkey(A, [])) } },
      { title: txt('gview.after'), grammar: result, highlight: { added } },
    ],
  });
  return { result, steps };
}

// ---------------------------------------------------------------- 2. renames (unit productions)

const isUnit = (g: Grammar, r: Rhs) => r.length === 1 && isNT(g, r[0]);

export function unitClosure(g: Grammar, A: Sym): Sym[] {
  const seen = [A];
  for (let i = 0; i < seen.length; i++)
    for (const r of g.prods[seen[i]]) if (isUnit(g, r) && !seen.includes(r[0])) seen.push(r[0]);
  return seen;
}

export function eliminateRenames(g: Grammar): PhaseResult {
  const phase = txt('cfg.ph.unit');
  const steps: Step[] = [];
  const unitKeys = g.nonterminals.flatMap((A) => keys(A, g.prods[A].filter((r) => isUnit(g, r))));
  if (!unitKeys.length) {
    steps.push({ phase, title: txt('cfg.unit.none.t'), body: txt('cfg.unit.none.b'), grammars: [{ grammar: g }] });
    return { result: g, steps };
  }

  const closures = Object.fromEntries(g.nonterminals.map((A) => [A, unitClosure(g, A)]));
  const closureTable = (hl?: Sym): StepTable => ({
    title: txt('cfg.tbl.unit'),
    headers: ['A', 'N<sub>A</sub> = {B | A ⇒* B}'],
    rows: g.nonterminals.map((A) => [symHtml(A), setHtml(closures[A])]),
    highlightRows: hl ? [g.nonterminals.indexOf(hl)] : undefined,
    html: true,
  });
  steps.push({
    phase,
    title: txt('cfg.unit.sets.t'),
    body: txt('cfg.unit.sets.b'),
    grammars: [{ grammar: g, highlight: { removed: unitKeys } }],
    tables: [closureTable()],
  });

  const result: Grammar = { start: g.start, nonterminals: [...g.nonterminals], terminals: [...g.terminals], prods: {} };
  for (const A of g.nonterminals) result.prods[A] = [];
  const added: string[] = [];
  for (const A of g.nonterminals) {
    for (const r of g.prods[A]) if (!isUnit(g, r)) addProd(result, A, r);
    const others = closures[A].filter((B) => B !== A);
    if (!others.length) continue;
    const rows: string[][] = [];
    for (const B of others) {
      const copied = g.prods[B].filter((r) => !isUnit(g, r));
      for (const r of copied) if (addProd(result, A, r)) added.push(pkey(A, r));
      rows.push([symHtml(B), altsHtml(A, copied)]);
    }
    steps.push({
      phase,
      title: txt('cfg.unit.prod.t', { A: symHtml(A) }),
      body: txt('cfg.unit.prod.b', { A: symHtml(A), NA: setHtml(closures[A]) }),
      grammars: [{ title: txt('gview.building'), grammar: clone(result), highlight: { nts: [A], added: added.filter((k) => k.startsWith(`${A}→`)) } }],
      tables: [closureTable(A), { headers: ['B ∈ N<sub>A</sub>', txt('col.copied')], rows, html: true }],
    });
  }
  steps.push({
    phase,
    title: txt('cfg.unit.done.t'),
    body: txt('cfg.unit.done.b'),
    grammars: [
      { title: txt('gview.before'), grammar: g, highlight: { removed: unitKeys } },
      { title: txt('gview.after'), grammar: result, highlight: { added } },
    ],
  });
  return { result, steps };
}

// ---------------------------------------------------------------- 3. unproductive symbols

export function productiveSets(g: Grammar): Sym[][] {
  const iters: Sym[][] = [[]];
  for (;;) {
    const set = new Set(iters[iters.length - 1]);
    const next = g.nonterminals.filter((A) => g.prods[A].some((r) => r.every((X) => set.has(X) || !isNT(g, X))));
    if (next.length === set.size) return iters;
    iters.push(next);
  }
}

export function eliminateUnproductive(g: Grammar): PhaseResult & { empty: boolean } {
  const phase = txt('cfg.ph.prod');
  const steps: Step[] = [];
  const iters = productiveSets(g);
  const productive = iters[iters.length - 1];
  const bad = g.nonterminals.filter((A) => !productive.includes(A));
  iters.forEach((s, i) => {
    if (i === 0) return;
    steps.push({
      phase,
      title: txt('cfg.prod.iter.t', undefined, { i }),
      body: txt(i === 1 ? 'cfg.prod.iter1.b' : 'cfg.prod.iterI.b', { N: setHtml(s) }, { i, i1: i - 1 }),
      grammars: [{ grammar: g, highlight: { nts: s } }],
      tables: [iterTable('cfg.tbl.productive', 'N', iters, i)],
    });
  });
  const table = iterTable('cfg.tbl.productive', 'N', iters, iters.length - 1);

  if (!productive.includes(g.start)) {
    steps.push({
      phase,
      title: txt('cfg.prod.empty.t'),
      body: txt('cfg.prod.empty.b', { S: symHtml(g.start), N: setHtml(productive) }),
      grammars: [{ grammar: g, highlight: { dim: bad } }],
      tables: [table],
    });
    return { result: g, steps, empty: true };
  }
  if (!bad.length) {
    steps.push({ phase, title: txt('cfg.prod.none.t'), body: txt('cfg.prod.none.b', { N: setHtml(productive) }), grammars: [{ grammar: g }], tables: [table] });
    return { result: g, steps, empty: false };
  }
  const result = restrictGrammar(g, productive);
  const removed = g.nonterminals.flatMap((A) => keys(A, g.prods[A].filter((r) => !productive.includes(A) || r.some((X) => bad.includes(X)))));
  steps.push({
    phase,
    title: txt('cfg.prod.remove.t'),
    body: txt('cfg.prod.remove.b', { N: setHtml(productive), bad: setHtml(bad) }),
    grammars: [
      { title: txt('gview.before'), grammar: g, highlight: { dim: bad, removed } },
      { title: txt('gview.after'), grammar: result },
    ],
    tables: [table],
  });
  return { result, steps, empty: false };
}

// ---------------------------------------------------------------- 4. inaccessible symbols

export function accessibleSets(g: Grammar): Sym[][] {
  const iters: Sym[][] = [[g.start]];
  for (;;) {
    const cur = iters[iters.length - 1];
    const next = [...cur];
    for (const A of cur) if (isNT(g, A)) for (const r of g.prods[A]) for (const X of r) if (!next.includes(X)) next.push(X);
    if (next.length === cur.length) return iters;
    iters.push(next);
  }
}

export function eliminateInaccessible(g: Grammar): PhaseResult {
  const phase = txt('cfg.ph.acc');
  const steps: Step[] = [];
  const iters = accessibleSets(g);
  const acc = iters[iters.length - 1];
  iters.forEach((s, i) => {
    steps.push({
      phase,
      title: txt('cfg.acc.iter.t', undefined, { i }),
      body: txt(i === 0 ? 'cfg.acc.iter0.b' : 'cfg.acc.iterI.b', { V: setHtml(s), S: symHtml(g.start) }, { i, i1: i - 1 }),
      grammars: [{ grammar: g, highlight: { nts: s.filter((X) => isNT(g, X)) } }],
      tables: [iterTable('cfg.tbl.accessible', 'V', iters, i)],
    });
  });
  const bad = [...g.nonterminals, ...g.terminals].filter((X) => !acc.includes(X));
  const table = iterTable('cfg.tbl.accessible', 'V', iters, iters.length - 1);
  if (!bad.length) {
    steps.push({ phase, title: txt('cfg.acc.none.t'), body: txt('cfg.acc.none.b'), grammars: [{ grammar: g }], tables: [table] });
    return { result: g, steps };
  }
  const badNts = bad.filter((X) => isNT(g, X));
  const result = restrictGrammar(
    g,
    g.nonterminals.filter((A) => acc.includes(A)),
    g.terminals.filter((a) => acc.includes(a)),
  );
  steps.push({
    phase,
    title: txt('cfg.acc.remove.t'),
    body: txt('cfg.acc.remove.b', { V: setHtml(acc), bad: setHtml(bad) }),
    grammars: [
      { title: txt('gview.before'), grammar: g, highlight: { dim: badNts, removed: badNts.flatMap((A) => keys(A, g.prods[A])) } },
      { title: txt('gview.after'), grammar: result },
    ],
    tables: [table],
  });
  return { result, steps };
}

/** Steps 1–2 only (used to prepare a grammar for left-recursion elimination). */
export function removeEpsilonAndRenames(g: Grammar): Grammar {
  return eliminateRenames(eliminateEpsilonProds(g).result).result;
}
