import { Grammar, Rhs, Sym, isNT } from './types';

/** A derivation tree. Terminal leaves have no `children`; a node expanded by A → ε has `children: []`. */
export interface Tree {
  sym: Sym;
  children?: Tree[];
}

export const treeKey = (t: Tree): string => (t.children ? `${t.sym}(${t.children.map(treeKey).join(',')})` : t.sym);

/** Trees kept per (nonterminal, yield). Two are enough to prove ambiguity. */
const CAP = 2;

type Bucket = { trees: Tree[]; keys: Set<string> };
type ByYield = Map<string, Bucket>;

const len = (s: string) => [...s].length;

function add(b: Bucket, t: Tree): boolean {
  if (b.trees.length >= CAP) return false;
  const k = treeKey(t);
  if (b.keys.has(k)) return false;
  b.keys.add(k);
  b.trees.push(t);
  return true;
}

/**
 * For every nonterminal A and every word w with |w| ≤ maxLen (and allow(w)), up to two distinct
 * derivation trees A ⇒* w. Computed bottom-up as a fixpoint, so it handles ε-productions and cycles:
 * a cell only ever grows, and stops at two trees.
 */
export function treesByYield(g: Grammar, maxLen: number, allow: (w: string) => boolean = () => true): Map<Sym, ByYield> {
  const T = new Map<Sym, ByYield>(g.nonterminals.map((A) => [A, new Map()]));
  const optionsOf = (X: Sym): [string, Tree[]][] =>
    isNT(g, X) ? [...T.get(X)!].map(([w, b]) => [w, b.trees]) : [[X, [{ sym: X }]]];

  let changed = true;
  while (changed) {
    changed = false;
    for (const A of g.nonterminals) {
      for (const rhs of g.prods[A]) {
        // Partial children sequences for a prefix of rhs, grouped by yield (also capped at 2).
        let cur = new Map<string, Tree[][]>([['', [[]]]]);
        for (const X of rhs) {
          const byLen = new Map<number, [string, Tree[]][]>();
          for (const o of optionsOf(X)) {
            const l = len(o[0]);
            if (!byLen.has(l)) byLen.set(l, []);
            byLen.get(l)!.push(o);
          }
          const next = new Map<string, Tree[][]>();
          const nextKeys = new Map<string, Set<string>>();
          for (const [u, seqs] of cur) {
            for (let l = 0; l <= maxLen - len(u); l++) {
              for (const [v, trees] of byLen.get(l) ?? []) {
                const w = u + v;
                if (!allow(w)) continue;
                if (!next.has(w)) {
                  next.set(w, []);
                  nextKeys.set(w, new Set());
                }
                const list = next.get(w)!;
                const keys = nextKeys.get(w)!;
                for (const seq of seqs) {
                  for (const t of trees) {
                    if (list.length >= CAP) break;
                    const s = [...seq, t];
                    const k = s.map(treeKey).join(',');
                    if (!keys.has(k)) {
                      keys.add(k);
                      list.push(s);
                    }
                  }
                }
              }
            }
          }
          cur = next;
          if (!cur.size) break;
        }
        const cells = T.get(A)!;
        for (const [w, seqs] of cur) {
          if (!cells.has(w)) cells.set(w, { trees: [], keys: new Set() });
          for (const children of seqs) if (add(cells.get(w)!, { sym: A, children })) changed = true;
        }
      }
    }
  }
  return T;
}

export interface AmbiguityResult {
  /** A shortest word (|w| ≤ maxLen) with two derivation trees, or null if none was found. */
  word: string | null;
  trees: Tree[];
  /** How many words of length ≤ maxLen the grammar generates (all were checked). */
  checked: number;
}

/** Bounded search for an ambiguous word. (Ambiguity is undecidable in general.) */
export function findAmbiguity(g: Grammar, maxLen: number): AmbiguityResult {
  const cells = treesByYield(g, maxLen).get(g.start)!;
  // Shortest first; among equally short witnesses prefer more distinct symbols (a+a*a beats a*a*a).
  const distinct = (w: string) => new Set(w).size;
  const words = [...cells.keys()].sort((a, b) => len(a) - len(b) || distinct(b) - distinct(a) || a.localeCompare(b));
  const word = words.find((w) => cells.get(w)!.trees.length >= 2) ?? null;
  return { word, trees: word === null ? [] : cells.get(word)!.trees, checked: words.length };
}

/** Up to two derivation trees for one given word. */
export function treesForWord(g: Grammar, word: string): Tree[] {
  const cells = treesByYield(g, len(word), (w) => word.includes(w)).get(g.start)!;
  return cells.get(word)?.trees ?? [];
}

export interface Derivation {
  /** Sentential forms α₀ = S ⇒ α₁ ⇒ … ⇒ w. */
  forms: Sym[][];
  /** Index in forms[i] of the nonterminal rewritten to get forms[i+1]. */
  at: number[];
  /** Production used at step i. */
  prods: [Sym, Rhs][];
}

/** The leftmost (or rightmost) derivation that corresponds to a tree. */
export function derivationOf(t: Tree, mode: 'left' | 'right'): Derivation {
  let nodes: Tree[] = [t];
  const d: Derivation = { forms: [[t.sym]], at: [], prods: [] };
  for (;;) {
    const open = nodes.flatMap((n, i) => (n.children ? [i] : []));
    if (!open.length) return d;
    const i = mode === 'left' ? open[0] : open[open.length - 1];
    const node = nodes[i];
    d.at.push(i);
    d.prods.push([node.sym, node.children!.map((c) => c.sym)]);
    nodes = [...nodes.slice(0, i), ...node.children!, ...nodes.slice(i + 1)];
    d.forms.push(nodes.map((n) => n.sym));
  }
}

/** First step at which two derivations use a different production (or rewrite a different position). */
export function firstDifference(a: Derivation, b: Derivation): number {
  const n = Math.min(a.prods.length, b.prods.length);
  for (let i = 0; i < n; i++) {
    if (a.at[i] !== b.at[i] || a.prods[i][0] !== b.prods[i][0] || a.prods[i][1].join(' ') !== b.prods[i][1].join(' ')) return i;
  }
  return n;
}

/** The highest nodes where the two trees use different productions (one set of nodes per tree). */
export function treeDifference(a: Tree, b: Tree): [Set<Tree>, Set<Tree>] {
  const da = new Set<Tree>();
  const db = new Set<Tree>();
  const walk = (x: Tree, y: Tree) => {
    if (!x.children || !y.children) return;
    const same = x.children.length === y.children.length && x.children.every((c, i) => c.sym === y.children![i].sym);
    if (!same) {
      da.add(x);
      db.add(y);
      return;
    }
    x.children.forEach((c, i) => walk(c, y.children![i]));
  };
  walk(a, b);
  return [da, db];
}
