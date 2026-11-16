import type { Step } from '../automata/types';
import { accessibleNts, leftCorners, removeDirectLeftRecursion, substituteLeading } from './ops';
import { txt } from './simplify';
import { Grammar, PhaseResult, Sym, clone, freshName, isNT, pkey, restrictGrammar, rhsHtml, setHtml, symHtml } from './types';

/** What prevents the algorithm from running: ε-productions (other than S → ε with S not on a rhs) or cycles A ⇒⁺ A. */
export function leftRecPreconditions(g: Grammar): { epsilon: boolean; cycle: boolean } {
  const startOnRhs = g.nonterminals.some((A) => g.prods[A].some((r) => r.includes(g.start)));
  const epsilon = g.nonterminals.some((A) => g.prods[A].some((r) => !r.length) && (A !== g.start || startOnRhs));
  const cycle = g.nonterminals.some((A) => unitReach(g, A).includes(A));
  return { epsilon, cycle };
}

function unitReach(g: Grammar, A: Sym): Sym[] {
  const seen: Sym[] = [];
  const stack = [A];
  while (stack.length) {
    for (const r of g.prods[stack.pop()!]) {
      if (r.length === 1 && isNT(g, r[0]) && !seen.includes(r[0])) {
        seen.push(r[0]);
        stack.push(r[0]);
      }
    }
  }
  return seen;
}

export const isLeftRecursive = (g: Grammar) => g.nonterminals.some((A) => leftCorners(g, A).includes(A));

/**
 * The classic algorithm (order A₁ … Aₙ; for each i, substitute Aᵢ → Aⱼγ for j < i, then remove direct
 * left recursion of Aᵢ). `withEps` chooses the A' → αA' | ε form; otherwise the ε-free form used for GNF.
 */
export function eliminateLeftRecursion(input: Grammar, withEps: boolean): PhaseResult {
  const steps: Step[] = [];
  const g = clone(input);
  const order = [...g.nonterminals];

  const detect = order.map((A) => {
    const direct = g.prods[A].some((r) => r[0] === A);
    const indirect = !direct && leftCorners(g, A).includes(A);
    return { A, direct, indirect };
  });
  const recursive = detect.filter((d) => d.direct || d.indirect).map((d) => d.A);
  steps.push({
    title: txt('lr.s.detect.t'),
    body: txt(recursive.length ? 'lr.s.detect.b' : 'lr.s.detect.none', { list: setHtml(recursive) }),
    grammars: [{ grammar: input, highlight: { nts: recursive } }],
    tables: [
      {
        title: txt('lr.tbl.detect'),
        headers: ['i', 'A<sub>i</sub>', txt('lr.col.corners'), txt('lr.col.direct'), txt('lr.col.indirect')],
        rows: detect.map(({ A, direct, indirect }, i) => [String(i + 1), symHtml(A), setHtml(leftCorners(g, A)), direct ? '✓' : '', indirect ? '✓' : '']),
        highlightRows: detect.flatMap((d, i) => (d.direct || d.indirect ? [i] : [])),
        html: true,
      },
    ],
  });
  if (!recursive.length) return { result: input, steps };

  order.forEach((Ai, i) => {
    let substituted = false;
    for (let j = 0; j < i; j++) {
      const Aj = order[j];
      const rw = substituteLeading(g, Ai, Aj);
      if (!rw) continue;
      substituted = true;
      steps.push({
        title: txt('lr.s.sub.t', { Ai: symHtml(Ai), Aj: symHtml(Aj) }, { i: i + 1, j: j + 1 }),
        body: txt('lr.s.sub.b', { Ai: symHtml(Ai), Aj: symHtml(Aj) }, { i: i + 1, j: j + 1 }),
        grammars: [{ title: txt('gview.building'), grammar: clone(g), highlight: { nts: [Ai], added: rw.added } }],
        tables: [{ headers: [txt('col.prod'), txt('col.replacedBy')], rows: rw.rows, html: true }],
      });
    }
    const before = clone(g);
    const Z = freshName(g, `${Ai}'`);
    const lr = removeDirectLeftRecursion(g, Ai, Z, withEps);
    if (!lr) {
      if (substituted || recursive.includes(Ai))
        steps.push({
          title: txt('lr.s.direct.t', { A: symHtml(Ai) }, { i: i + 1 }),
          body: txt('lr.s.noDirect.b', { A: symHtml(Ai) }),
          grammars: [{ grammar: clone(g), highlight: { nts: [Ai] } }],
        });
      return;
    }
    const recKeys = before.prods[Ai].filter((r) => r[0] === Ai).map((r) => pkey(Ai, r));
    steps.push({
      title: txt('lr.s.direct.t', { A: symHtml(Ai) }, { i: i + 1 }),
      body: txt(withEps ? 'lr.s.direct.eps' : 'lr.s.direct.noeps', {
        A: symHtml(Ai),
        Z: symHtml(Z),
        alphas: lr.alphas.map(rhsHtml).join(', ') || '—',
        betas: lr.betas.map(rhsHtml).join(', ') || '—',
      }),
      grammars: [
        { title: txt('gview.before'), grammar: before, highlight: { nts: [Ai], removed: recKeys } },
        { title: txt('gview.after'), grammar: clone(g), highlight: { nts: [Ai, Z], added: lr.added } },
      ],
    });
  });

  const acc = accessibleNts(g);
  let result = g;
  if (acc.length < g.nonterminals.length) {
    const bad = g.nonterminals.filter((A) => !acc.includes(A));
    result = restrictGrammar(g, acc);
    steps.push({
      title: txt('cfg.gnf.unused.t'),
      body: txt('cfg.gnf.unused.b', { bad: setHtml(bad) }),
      grammars: [{ grammar: g, highlight: { dim: bad, removed: bad.flatMap((A) => g.prods[A].map((r) => pkey(A, r))) } }],
    });
  }
  steps.push({
    title: txt('lr.s.done.t'),
    body: txt('lr.s.done.b'),
    grammars: [
      { title: txt('gview.before'), grammar: input, highlight: { nts: recursive } },
      { title: txt('gview.after'), grammar: result },
    ],
  });
  return { result, steps };
}
