import { Grammar, Rhs, Sym, addNT, pkey, prodHtml, rhsHtml } from './types';

/** Substitutions can blow up exponentially (GNF especially); beyond this many productions we stop. */
export const MAX_PRODUCTIONS = 1500;
export class TooLargeError extends Error {}

export interface Rewrite {
  /** Table rows: [old production, new productions]. */
  rows: string[][];
  /** Keys of the productions that were added. */
  added: string[];
}

function pushUnique(list: Rhs[], r: Rhs): boolean {
  const k = r.join(' ');
  if (list.some((x) => x.length === r.length && x.join(' ') === k)) return false;
  list.push(r);
  return true;
}

/**
 * Replaces every A → Bγ by A → δγ for every B → δ (in place). Returns null if A has no such production.
 * Throws TooLargeError if A would get more than MAX_PRODUCTIONS productions.
 */
export function substituteLeading(g: Grammar, A: Sym, B: Sym): Rewrite | null {
  if (!g.prods[A].some((r) => r[0] === B)) return null;
  const out: Rhs[] = [];
  const seen = new Set<string>();
  const push = (r: Rhs) => {
    const k = r.join(' ');
    if (seen.has(k)) return false;
    seen.add(k);
    out.push(r);
    if (out.length > MAX_PRODUCTIONS) throw new TooLargeError();
    return true;
  };
  const rows: string[][] = [];
  const added: string[] = [];
  for (const r of g.prods[A]) {
    if (r[0] !== B) {
      push(r);
      continue;
    }
    const news = g.prods[B].map((d) => [...d, ...r.slice(1)]);
    rows.push([prodHtml(A, r), news.map(rhsHtml).join(' | ')]);
    for (const n of news) if (push(n)) added.push(pkey(A, n));
  }
  g.prods[A] = out;
  return { rows, added };
}

/** Replaces A → Bγ by A → δγ for every nonterminal B in `which` that starts a production of A. */
export function substituteAllLeading(g: Grammar, A: Sym, which: (B: Sym) => boolean): Rewrite | null {
  const rows: string[][] = [];
  const added: string[] = [];
  const leading = [...new Set(g.prods[A].map((r) => r[0]).filter((B) => B !== undefined && which(B)))];
  for (const B of leading) {
    const rw = substituteLeading(g, A, B);
    if (rw) {
      rows.push(...rw.rows);
      added.push(...rw.added);
    }
  }
  const kept = new Set(g.prods[A].map((r) => pkey(A, r)));
  return rows.length ? { rows, added: added.filter((k) => kept.has(k)) } : null;
}

/**
 * Eliminates direct left recursion A → Aα₁ | … | Aαₘ | β₁ | … | βₙ using the new nonterminal Z:
 *   withEps:  A → β₁Z | … | βₙZ,          Z → α₁Z | … | αₘZ | ε
 *   else:     A → β₁ | … | βₙ | β₁Z | … | βₙZ,   Z → α₁ | … | αₘ | α₁Z | … | αₘZ
 */
export function removeDirectLeftRecursion(g: Grammar, A: Sym, Z: Sym, withEps: boolean): (Rewrite & { alphas: Rhs[]; betas: Rhs[] }) | null {
  const rec = g.prods[A].filter((r) => r[0] === A);
  if (!rec.length) return null;
  const alphas = rec.map((r) => r.slice(1)).filter((a) => a.length); // A → A is useless and simply dropped
  const betas = g.prods[A].filter((r) => r[0] !== A);
  const rows = rec.map((r) => [prodHtml(A, r), '']);
  if (!alphas.length) {
    g.prods[A] = betas;
    return { rows, added: [], alphas, betas };
  }
  // Z is listed right after A, so the grammar reads in the textbook order.
  addNT(g, Z);
  g.nonterminals.splice(g.nonterminals.indexOf(Z), 1);
  g.nonterminals.splice(g.nonterminals.indexOf(A) + 1, 0, Z);
  const newA = withEps ? betas.map((b) => [...b, Z]) : [...betas, ...betas.map((b) => [...b, Z])];
  const newZ = withEps ? [...alphas.map((a) => [...a, Z]), []] : [...alphas, ...alphas.map((a) => [...a, Z])];
  g.prods[A] = [];
  g.prods[Z] = [];
  newA.forEach((r) => pushUnique(g.prods[A], r));
  newZ.forEach((r) => pushUnique(g.prods[Z], r));
  const added = [...g.prods[A].map((r) => pkey(A, r)), ...g.prods[Z].map((r) => pkey(Z, r))].filter(
    (k) => !betas.some((b) => pkey(A, b) === k),
  );
  return { rows, added, alphas, betas };
}

/** Nonterminals reachable from the start symbol. */
export function accessibleNts(g: Grammar): Sym[] {
  const seen = [g.start];
  for (let i = 0; i < seen.length; i++)
    for (const r of g.prods[seen[i]] ?? []) for (const X of r) if (Object.hasOwn(g.prods, X) && !seen.includes(X)) seen.push(X);
  return seen;
}

/**
 * The "left corner" relation: A ⇒⁺ Bγ. Assumes no ε-productions on the way (except possibly S → ε),
 * which is what the left-recursion algorithms require.
 */
export function leftCorners(g: Grammar, A: Sym): Sym[] {
  const seen: Sym[] = [];
  const stack = [A];
  while (stack.length) {
    const X = stack.pop()!;
    for (const r of g.prods[X] ?? []) {
      const B = r[0];
      if (B !== undefined && Object.hasOwn(g.prods, B) && !seen.includes(B)) {
        seen.push(B);
        stack.push(B);
      }
    }
  }
  return seen;
}
