import type { ParseError } from '../automata/parse';
import type { Step, Text } from '../automata/types';

export type Sym = string;
/** Right-hand side of a production; [] is ε. */
export type Rhs = Sym[];

/** A context-free grammar. `nonterminals[0]` is always the start symbol. */
export interface Grammar {
  start: Sym;
  nonterminals: Sym[];
  terminals: Sym[];
  /** Every nonterminal has an entry (possibly empty). */
  prods: Record<Sym, Rhs[]>;
}

export interface GrammarHighlight {
  /** Nonterminals whose line is highlighted. */
  nts?: Sym[];
  /** Nonterminals drawn faded (about to be removed). */
  dim?: Sym[];
  /** Production keys (see `pkey`) drawn as newly added. */
  added?: string[];
  /** Production keys drawn struck through (about to be removed). */
  removed?: string[];
  /** Production keys drawn with a neutral marker (need attention). */
  marked?: string[];
}

export interface GrammarView {
  title?: Text;
  grammar: Grammar;
  highlight?: GrammarHighlight;
}

export interface PhaseResult {
  result: Grammar;
  steps: Step[];
}

export type GrammarParse = { ok: true; grammar: Grammar } | { ok: false; errors: ParseError[] };

/** Nonterminal names: an uppercase letter, then an optional index (A1, X_a), then primes (S', A''). */
const NT_PREFIX = /^[A-Z](?:_[A-Za-z0-9]+|[0-9]+)?'*/;
const NT_RE = new RegExp(`${NT_PREFIX.source}$`);
export const EPSILON_ALIASES = new Set(['', 'ε', 'eps', 'epsilon', 'λ', 'lambda']);

export const isNT = (g: Grammar, s: Sym) => Object.hasOwn(g.prods, s);
/** True if `s` has the shape of a nonterminal name (independent of any grammar). */
export const isNTName = (s: Sym) => NT_RE.test(s);
export const pkey = (lhs: Sym, rhs: Rhs) => `${lhs}→${rhs.join(' ')}`;
export const prodCount = (g: Grammar) => g.nonterminals.reduce((n, A) => n + g.prods[A].length, 0);

/** Splits one alternative into symbols: nonterminals as above, every other character is a terminal. */
export function tokenize(s: string): Sym[] {
  const out: Sym[] = [];
  let i = 0;
  while (i < s.length) {
    const rest = s.slice(i);
    const nt = NT_PREFIX.exec(rest);
    if (nt) {
      out.push(nt[0]);
      i += nt[0].length;
      continue;
    }
    const c = String.fromCodePoint(rest.codePointAt(0)!);
    if (!/\s/.test(c) && c !== 'ε' && c !== 'λ') out.push(c);
    i += c.length;
  }
  return out;
}

export function clone(g: Grammar): Grammar {
  const prods: Grammar['prods'] = {};
  for (const A of g.nonterminals) prods[A] = g.prods[A].map((r) => [...r]);
  return { start: g.start, nonterminals: [...g.nonterminals], terminals: [...g.terminals], prods };
}

export function addNT(g: Grammar, A: Sym, first = false): void {
  if (isNT(g, A)) return;
  g.prods[A] = [];
  if (first) g.nonterminals.unshift(A);
  else g.nonterminals.push(A);
}

/** Adds A → rhs unless already present. Returns true if added. */
export function addProd(g: Grammar, A: Sym, rhs: Rhs): boolean {
  addNT(g, A);
  const k = rhs.join(' ');
  if (g.prods[A].some((r) => r.length === rhs.length && r.join(' ') === k)) return false;
  g.prods[A].push(rhs);
  return true;
}

/** Keeps only the given nonterminals (and the productions using only kept symbols). */
export function restrictGrammar(g: Grammar, keepNts: Sym[], keepTerminals = g.terminals): Grammar {
  const keep = new Set([...keepNts, ...keepTerminals]);
  const prods: Grammar['prods'] = {};
  const nonterminals = g.nonterminals.filter((A) => keep.has(A));
  for (const A of nonterminals) prods[A] = g.prods[A].filter((r) => r.every((X) => keep.has(X))).map((r) => [...r]);
  return { start: g.start, nonterminals, terminals: g.terminals.filter((a) => keep.has(a)), prods };
}

/** Returns `base` or `base`+suffix not used as a symbol in g (suffix: primes for primed names, else 1, 2, …). */
export function freshName(g: Grammar, base: string): Sym {
  const used = (s: Sym) => isNT(g, s) || g.terminals.includes(s);
  if (!used(base)) return base;
  if (base.endsWith("'")) {
    let s = base;
    while (used(s)) s += "'";
    return s;
  }
  for (let i = 1; ; i++) if (!used(`${base}${i}`)) return `${base}${i}`;
}

/** First unused name of the form L_1, L_2, … */
export function freshIndexed(g: Grammar, letter: string): Sym {
  for (let i = 1; ; i++) if (!isNT(g, `${letter}_${i}`) && !g.terminals.includes(`${letter}_${i}`)) return `${letter}_${i}`;
}

/**
 * Text format, one or more lines per nonterminal:
 *   S -> aSb | AB | ε
 *   A -> aA | eps
 * The first left-hand side is the start symbol (or use `start: S`).
 */
export function parseGrammar(text: string): GrammarParse {
  const errors: ParseError[] = [];
  const g: Grammar = { start: '', nonterminals: [], terminals: [], prods: {} };
  let start = '';
  const rhsSyms: Sym[] = [];
  text.split('\n').forEach((raw, i) => {
    const line = raw.replace(/#.*/, '').trim();
    if (!line) return;
    const header = /^start\s*:\s*(\S+)$/i.exec(line);
    if (header) {
      start = header[1];
      return;
    }
    const m = /^(.*?)\s*(?:->|→|::=)\s*(.*)$/.exec(line);
    if (!m) {
      errors.push({ line: i + 1, key: 'gparse.noArrow' });
      return;
    }
    const lhs = m[1].trim();
    if (!NT_RE.test(lhs)) {
      errors.push({ line: i + 1, key: 'gparse.badLhs', params: { name: lhs } });
      return;
    }
    for (const alt of m[2].split('|')) {
      const rhs = EPSILON_ALIASES.has(alt.trim()) ? [] : tokenize(alt);
      addProd(g, lhs, rhs);
      rhsSyms.push(...rhs);
    }
  });
  if (!errors.length && !g.nonterminals.length) errors.push({ line: 0, key: 'gparse.empty' });
  if (start && !isNT(g, start)) errors.push({ line: 0, key: 'gparse.badStart', params: { name: start } });
  if (errors.length) return { ok: false, errors };

  for (const X of rhsSyms) {
    if (NT_RE.test(X)) addNT(g, X);
    else if (!g.terminals.includes(X)) g.terminals.push(X);
  }
  g.start = start || g.nonterminals[0];
  g.nonterminals = [g.start, ...g.nonterminals.filter((A) => A !== g.start)];
  return { ok: true, grammar: g };
}

export function rhsText(rhs: Rhs): string {
  if (!rhs.length) return 'ε';
  let s = rhs[0];
  for (let k = 1; k < rhs.length; k++) {
    // Only insert a space where gluing the two symbols would read back differently.
    const glued = tokenize(rhs[k - 1] + rhs[k]);
    s += (glued.length === 2 && glued[0] === rhs[k - 1] ? '' : ' ') + rhs[k];
  }
  return s;
}

export function serializeGrammar(g: Grammar): string {
  return g.nonterminals
    .filter((A) => g.prods[A].length)
    .map((A) => `${A} -> ${g.prods[A].map(rhsText).join(' | ')}`)
    .join('\n');
}

// ---------- HTML rendering (used in step texts, tables and the grammar view) ----------

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function symHtml(s: Sym): string {
  const m = /^([A-Z])(?:_([A-Za-z0-9]+)|([0-9]+))?('*)$/.exec(s);
  if (!m) return `<span class="t">${esc(s)}</span>`;
  const sub = m[2] ?? m[3];
  return `<span class="nt">${m[1]}${sub ? `<sub>${sub}</sub>` : ''}${m[4]}</span>`;
}
export const rhsHtml = (rhs: Rhs) => (rhs.length ? rhs.map(symHtml).join('') : 'ε');
export const prodHtml = (A: Sym, rhs: Rhs) => `${symHtml(A)} → ${rhsHtml(rhs)}`;
export const altsHtml = (A: Sym, alts: Rhs[]) => (alts.length ? `${symHtml(A)} → ${alts.map(rhsHtml).join(' | ')}` : '—');
export const setHtml = (syms: Sym[]) => (syms.length ? `{${syms.map(symHtml).join(', ')}}` : '∅');
