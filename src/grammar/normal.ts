import type { Step } from '../automata/types';
import { MAX_PRODUCTIONS, TooLargeError, accessibleNts, removeDirectLeftRecursion, substituteAllLeading, substituteLeading } from './ops';
import { eliminateEpsilonProds, eliminateInaccessible, eliminateRenames, eliminateUnproductive, txt } from './simplify';
import {
  Grammar,
  PhaseResult,
  Rhs,
  Sym,
  addNT,
  addProd,
  clone,
  freshIndexed,
  freshName,
  isNT,
  pkey,
  prodCount,
  prodHtml,
  restrictGrammar,
  rhsHtml,
  setHtml,
  symHtml,
} from './types';

export { MAX_PRODUCTIONS, TooLargeError };

const checkSize = (g: Grammar) => {
  if (prodCount(g) > MAX_PRODUCTIONS) throw new TooLargeError();
};

export function isCNF(g: Grammar): boolean {
  const onRhs = g.nonterminals.some((A) => g.prods[A].some((r) => r.includes(g.start)));
  return g.nonterminals.every((A) =>
    g.prods[A].every(
      (r) =>
        (r.length === 1 && !isNT(g, r[0])) ||
        (r.length === 2 && isNT(g, r[0]) && isNT(g, r[1])) ||
        (r.length === 0 && A === g.start && !onRhs),
    ),
  );
}

export function isGNF(g: Grammar): boolean {
  const onRhs = g.nonterminals.some((A) => g.prods[A].some((r) => r.includes(g.start)));
  return g.nonterminals.every((A) =>
    g.prods[A].every((r) =>
      r.length === 0 ? A === g.start && !onRhs : !isNT(g, r[0]) && r.slice(1).every((X) => isNT(g, X)),
    ),
  );
}

// ---------------------------------------------------------------- Chomsky normal form

const cnfOk = (g: Grammar, A: Sym, r: Rhs) =>
  (r.length === 1 && !isNT(g, r[0])) || (r.length === 2 && isNT(g, r[0]) && isNT(g, r[1])) || (r.length === 0 && A === g.start);

/** Expects a reduced grammar (steps 1–4 done). */
export function toCNF(g: Grammar): PhaseResult {
  const phase = txt('cfg.ph.cnf');
  const steps: Step[] = [];
  const bad = g.nonterminals.flatMap((A) => g.prods[A].filter((r) => !cnfOk(g, A, r)).map((r) => pkey(A, r)));
  steps.push({
    phase,
    title: txt('cfg.cnf.intro.t'),
    body: txt(bad.length ? 'cfg.cnf.intro.b' : 'cfg.cnf.intro.ok'),
    grammars: [{ grammar: g, highlight: { marked: bad } }],
  });
  if (!bad.length) return { result: g, steps };

  // (a) terminals inside right-hand sides of length ≥ 2 get their own nonterminal X_a → a.
  const result = clone(g);
  const termNt: Record<Sym, Sym> = {};
  const added: string[] = [];
  for (const A of g.nonterminals) {
    result.prods[A] = result.prods[A].map((r) =>
      r.length < 2
        ? r
        : r.map((X) => {
            if (isNT(g, X)) return X;
            if (!termNt[X]) {
              termNt[X] = /^[A-Za-z0-9]$/.test(X) ? freshName(result, `X_${X}`) : freshIndexed(result, 'X');
              addProd(result, termNt[X], [X]);
              added.push(pkey(termNt[X], [X]));
            }
            return termNt[X];
          }),
    );
  }
  const termList = Object.keys(termNt);
  if (termList.length) {
    const changed = g.nonterminals.flatMap((A) => g.prods[A].flatMap((r, i) => (r.length >= 2 && r.some((X) => !isNT(g, X)) ? [pkey(A, result.prods[A][i])] : [])));
    steps.push({
      phase,
      title: txt('cfg.cnf.term.t'),
      body: txt('cfg.cnf.term.b'),
      grammars: [{ title: txt('gview.building'), grammar: clone(result), highlight: { added: [...added, ...changed] } }],
      tables: [{ headers: [txt('col.terminal'), txt('col.newNt')], rows: termList.map((a) => [symHtml(a), prodHtml(termNt[a], [a])]), html: true }],
    });
  }

  // (b) A → B₁B₂…Bₖ (k ≥ 3) becomes a chain A → B₁Y₁, Y₁ → B₂Y₂, …, Yₖ₋₂ → Bₖ₋₁Bₖ. Equal tails share one Y.
  const tailNt = new Map<string, Sym>();
  const tailOf = (tail: Rhs, created: [Sym, Rhs][]): Sym => {
    const k = tail.join(' ');
    let Y = tailNt.get(k);
    if (!Y) {
      Y = freshIndexed(result, 'Y');
      tailNt.set(k, Y);
      addNT(result, Y);
      const rhs = tail.length === 2 ? tail : [tail[0], tailOf(tail.slice(1), created)];
      result.prods[Y] = [rhs];
      created.unshift([Y, rhs]);
    }
    return Y;
  };
  for (const A of [...result.nonterminals]) {
    if (!result.prods[A].some((r) => r.length > 2)) continue;
    const rows: string[][] = [];
    const added: string[] = [];
    result.prods[A] = result.prods[A].map((r) => {
      if (r.length <= 2) return r;
      const created: [Sym, Rhs][] = [];
      const nr = [r[0], tailOf(r.slice(1), created)];
      created.unshift([A, nr]);
      added.push(...created.map(([L, rhs]) => pkey(L, rhs)));
      rows.push([prodHtml(A, r), created.map(([L, rhs]) => prodHtml(L, rhs)).join(';  ')]);
      return nr;
    });
    steps.push({
      phase,
      title: txt('cfg.cnf.long.t', { A: symHtml(A) }),
      body: txt('cfg.cnf.long.b', { A: symHtml(A) }),
      grammars: [{ title: txt('gview.building'), grammar: clone(result), highlight: { nts: [A], added } }],
      tables: [{ headers: [txt('col.prod'), txt('col.replacedBy')], rows, html: true }],
    });
  }

  steps.push({
    phase,
    title: txt('cfg.cnf.done.t'),
    body: txt('cfg.cnf.done.b'),
    grammars: [
      { title: txt('gview.before'), grammar: g, highlight: { marked: bad } },
      { title: txt('gview.cnf'), grammar: result },
    ],
  });
  return { result, steps };
}

// ---------------------------------------------------------------- Greibach normal form

/** Expects a grammar in CNF. */
export function toGNF(cnf: Grammar): PhaseResult {
  const phase = txt('cfg.ph.gnf');
  const steps: Step[] = [];
  const g = clone(cnf);
  const hasEps = g.prods[g.start].some((r) => !r.length);
  if (hasEps) g.prods[g.start] = g.prods[g.start].filter((r) => r.length);
  const order = [...g.nonterminals];
  const orderTable = {
    title: txt('cfg.tbl.order'),
    headers: ['i', 'A<sub>i</sub>'],
    rows: order.map((A, i) => [String(i + 1), symHtml(A)]),
    html: true,
  };
  steps.push({
    phase,
    title: txt('cfg.gnf.intro.t'),
    body: txt(hasEps ? 'cfg.gnf.intro.eps' : 'cfg.gnf.intro.b', { S: symHtml(g.start) }, { n: order.length }),
    grammars: [{ grammar: clone(g) }],
    tables: [orderTable],
  });

  // Phase 1: make every Aᵢ → Aⱼγ have j > i.
  const zs: Sym[] = [];
  order.forEach((Ai, i) => {
    for (let j = 0; j < i; j++) {
      const Aj = order[j];
      const rw = substituteLeading(g, Ai, Aj);
      if (!rw) continue;
      checkSize(g);
      steps.push({
        phase,
        title: txt('cfg.gnf.sub.t', { Ai: symHtml(Ai), Aj: symHtml(Aj) }),
        body: txt('cfg.gnf.sub.b', { Ai: symHtml(Ai), Aj: symHtml(Aj) }, { i: i + 1, j: j + 1 }),
        grammars: [{ title: txt('gview.building'), grammar: clone(g), highlight: { nts: [Ai], added: rw.added } }],
        tables: [{ headers: [txt('col.prod'), txt('col.replacedBy')], rows: rw.rows, html: true }],
      });
    }
    const Z = freshIndexed(g, 'Z');
    const lr = removeDirectLeftRecursion(g, Ai, Z, false);
    if (!lr) return;
    if (isNT(g, Z)) zs.push(Z);
    checkSize(g);
    steps.push({
      phase,
      title: txt('cfg.gnf.lr.t', { A: symHtml(Ai) }),
      body: txt('cfg.gnf.lr.b', {
        A: symHtml(Ai),
        Z: symHtml(Z),
        alphas: lr.alphas.map(rhsHtml).join(', ') || '—',
        betas: lr.betas.map(rhsHtml).join(', ') || '—',
      }),
      grammars: [{ title: txt('gview.building'), grammar: clone(g), highlight: { nts: [Ai, Z], added: lr.added } }],
    });
  });

  // Phase 2: substitute back, from the last Aᵢ upwards and then the Z's, until every production starts with a terminal.
  const ready = (X: Sym) => g.prods[X].every((r) => !isNT(g, r[0]));
  const pending = [...order.slice(0, -1).reverse(), ...zs];
  steps.push({
    phase,
    title: txt('cfg.gnf.back.t'),
    body: txt('cfg.gnf.back.b', { An: symHtml(order[order.length - 1]) }),
    grammars: [{ grammar: clone(g), highlight: { marked: g.nonterminals.flatMap((A) => g.prods[A].filter((r) => isNT(g, r[0])).map((r) => pkey(A, r))) } }],
  });
  for (;;) {
    const X = pending.find((X) => !ready(X) && g.prods[X].every((r) => !isNT(g, r[0]) || ready(r[0])));
    if (!X) break;
    const leads = [...new Set(g.prods[X].map((r) => r[0]).filter((B) => isNT(g, B)))];
    const rw = substituteAllLeading(g, X, (B) => isNT(g, B))!;
    checkSize(g);
    steps.push({
      phase,
      title: txt('cfg.gnf.backsub.t', { A: symHtml(X) }),
      body: txt(zs.includes(X) ? 'cfg.gnf.backsubZ.b' : 'cfg.gnf.backsub.b', { A: symHtml(X), B: setHtml(leads) }),
      grammars: [{ title: txt('gview.building'), grammar: clone(g), highlight: { nts: [X], added: rw.added } }],
      tables: [{ headers: [txt('col.prod'), txt('col.replacedBy')], rows: rw.rows, html: true }],
    });
  }
  if (!g.nonterminals.every(ready)) throw new Error('GNF: substitution did not converge');

  if (hasEps) addProd(g, g.start, []);
  const acc = accessibleNts(g);
  let result = g;
  if (acc.length < g.nonterminals.length) {
    const bad = g.nonterminals.filter((A) => !acc.includes(A));
    result = restrictGrammar(g, acc);
    steps.push({
      phase,
      title: txt('cfg.gnf.unused.t'),
      body: txt('cfg.gnf.unused.b', { bad: setHtml(bad) }),
      grammars: [{ grammar: g, highlight: { dim: bad, removed: bad.flatMap((A) => g.prods[A].map((r) => pkey(A, r))) } }],
    });
  }
  steps.push({
    phase,
    title: txt('cfg.gnf.done.t'),
    body: txt(hasEps ? 'cfg.gnf.done.eps' : 'cfg.gnf.done.b', { S: symHtml(result.start) }, { n: prodCount(result) }),
    grammars: [
      { title: txt('gview.cnf'), grammar: cnf },
      { title: txt('gview.gnf'), grammar: result },
    ],
  });
  return { result, steps };
}

// ---------------------------------------------------------------- whole pipeline

export interface NormalizeResult {
  steps: Step[];
  reduced?: Grammar;
  cnf?: Grammar;
  gnf?: Grammar;
  /** L(G) = ∅ (the start symbol is unproductive). */
  empty: boolean;
  /** GNF exceeded MAX_PRODUCTIONS. */
  tooLarge: boolean;
}

export function normalize(g: Grammar): NormalizeResult {
  const s1 = eliminateEpsilonProds(g);
  const s2 = eliminateRenames(s1.result);
  const s3 = eliminateUnproductive(s2.result);
  const steps = [...s1.steps, ...s2.steps, ...s3.steps];
  if (s3.empty) return { steps, empty: true, tooLarge: false };
  const s4 = eliminateInaccessible(s3.result);
  const s5 = toCNF(s4.result);
  steps.push(...s4.steps, ...s5.steps);
  try {
    const s6 = toGNF(s5.result);
    steps.push(...s6.steps);
    return { steps, reduced: s4.result, cnf: s5.result, gnf: s6.result, empty: false, tooLarge: false };
  } catch (e) {
    if (!(e instanceof TooLargeError)) throw e;
    return { steps, reduced: s4.result, cnf: s5.result, empty: false, tooLarge: true };
  }
}
