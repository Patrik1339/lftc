import type { ParseError } from '../automata/parse';
import { EPSILON_ALIASES, Sym, isNTName, symHtml, tokenize } from './types';

/** A production α → β of an unrestricted grammar: α contains at least one nonterminal. */
export interface Rule {
  lhs: Sym[];
  rhs: Sym[];
}

/** A grammar of any Chomsky type (left-hand sides may be strings, not just one nonterminal). */
export interface GeneralGrammar {
  start: Sym;
  nonterminals: Sym[];
  terminals: Sym[];
  rules: Rule[];
}

export type GeneralParse = { ok: true; grammar: GeneralGrammar } | { ok: false; errors: ParseError[] };

/**
 * Same text format as `parseGrammar`, but a left-hand side may be any string with a nonterminal in it:
 *   S -> aSBC | aBC
 *   CB -> BC
 * The start symbol is given by `start: X`, otherwise S if present, otherwise the first nonterminal.
 */
export function parseGeneralGrammar(text: string): GeneralParse {
  const errors: ParseError[] = [];
  const rules: Rule[] = [];
  const seen = new Set<string>();
  let start = '';
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
    const lhs = tokenize(m[1]);
    if (!lhs.some(isNTName)) {
      errors.push({ line: i + 1, key: 'chparse.lhsNoNT', params: { name: m[1].trim() || 'ε' } });
      return;
    }
    for (const alt of m[2].split('|')) {
      const rhs = EPSILON_ALIASES.has(alt.trim()) ? [] : tokenize(alt);
      const k = `${lhs.join(' ')}→${rhs.join(' ')}`;
      if (seen.has(k)) continue;
      seen.add(k);
      rules.push({ lhs, rhs });
    }
  });
  if (!errors.length && !rules.length) errors.push({ line: 0, key: 'gparse.empty' });
  if (errors.length) return { ok: false, errors };

  const nonterminals: Sym[] = [];
  const terminals: Sym[] = [];
  for (const r of rules)
    for (const X of [...r.lhs, ...r.rhs]) {
      const list = isNTName(X) ? nonterminals : terminals;
      if (!list.includes(X)) list.push(X);
    }
  if (start && !nonterminals.includes(start)) return { ok: false, errors: [{ line: 0, key: 'gparse.badStart', params: { name: start } }] };
  start ||= nonterminals.includes('S') ? 'S' : nonterminals[0];
  return { ok: true, grammar: { start, nonterminals: [start, ...nonterminals.filter((A) => A !== start)], terminals, rules } };
}

// ---------- classification ----------

export type ChomskyType = 0 | 1 | 2 | 3;

export interface TypeCheck {
  ok: boolean;
  /** The first production that breaks the condition, with the i18n key explaining why. */
  bad?: Rule;
  reason?: string;
}

export interface Classification {
  /** The most restrictive type the grammar satisfies. */
  type: ChomskyType;
  checks: Record<ChomskyType, TypeCheck>;
  /** For type 3: whether all productions are right-linear or all left-linear. */
  linear?: 'right' | 'left';
  /** Type 2 holds and type 1 fails only because of ε-productions (removable without changing the language, except ε itself). */
  onlyEpsilon: boolean;
}

const terminalsOnly = (syms: Sym[]) => syms.every((X) => !isNTName(X));
/** A → wB or A → w, w ∈ Σ*. */
const isRightLinear = (r: Rule) => terminalsOnly(r.rhs.slice(0, -1));
/** A → Bw or A → w, w ∈ Σ*. */
const isLeftLinear = (r: Rule) => terminalsOnly(r.rhs.slice(1));

export function classify(g: GeneralGrammar): Classification {
  const startOnRight = g.rules.some((r) => r.rhs.includes(g.start));
  const isStartEps = (r: Rule) => r.lhs.length === 1 && r.lhs[0] === g.start && r.rhs.length === 0;

  let t1: TypeCheck = { ok: true };
  for (const r of g.rules) {
    if (isStartEps(r) && !startOnRight) continue;
    if (r.rhs.length < r.lhs.length) {
      t1 = { ok: false, bad: r, reason: isStartEps(r) ? 'ch.r.startEps' : 'ch.r.contracting' };
      break;
    }
  }

  const badLhs = g.rules.find((r) => r.lhs.length !== 1);
  const t2: TypeCheck = badLhs ? { ok: false, bad: badLhs, reason: 'ch.r.lhs' } : { ok: true };

  let t3: TypeCheck;
  let linear: Classification['linear'];
  if (!t2.ok) t3 = { ...t2 };
  else {
    const neither = g.rules.find((r) => !isRightLinear(r) && !isLeftLinear(r));
    if (neither) t3 = { ok: false, bad: neither, reason: 'ch.r.notLinear' };
    else if (g.rules.every(isRightLinear)) (t3 = { ok: true }), (linear = 'right');
    else if (g.rules.every(isLeftLinear)) (t3 = { ok: true }), (linear = 'left');
    else t3 = { ok: false, bad: g.rules.find((r) => !isRightLinear(r)), reason: 'ch.r.mixed' };
  }

  const checks = { 0: { ok: true }, 1: t1, 2: t2, 3: t3 } as Record<ChomskyType, TypeCheck>;
  const type: ChomskyType = t3.ok ? 3 : t2.ok ? 2 : t1.ok ? 1 : 0;
  const onlyEpsilon = t2.ok && !t1.ok && g.rules.every((r) => r.rhs.length > 0 || r.lhs.length === 1);
  return { type, checks, linear, onlyEpsilon };
}

// ---------- bounded derivations ----------

/** α₀ ⇒ α₁ ⇒ … ; `at[i]`: where in forms[i] the left side of rules[i] was replaced. */
export interface GeneralDerivation {
  forms: Sym[][];
  rules: Rule[];
  at: number[];
}

export interface SearchResult {
  words: string[];
  /** True if the form budget ran out before the search space was exhausted. */
  truncated: boolean;
}

const SEP = '\u0001';
/** How much longer than the target a sentential form may get when rules can shrink it (type 0). */
const SLACK = 4;

function* successors(g: GeneralGrammar, form: Sym[]): Generator<{ next: Sym[]; rule: Rule; at: number }> {
  for (const rule of g.rules) {
    const n = rule.lhs.length;
    for (let i = 0; i + n <= form.length; i++) {
      let match = true;
      for (let k = 0; k < n && match; k++) match = form[i + k] === rule.lhs[k];
      if (match) yield { next: [...form.slice(0, i), ...rule.rhs, ...form.slice(i + n)], rule, at: i };
    }
  }
}

/**
 * Breadth-first search over sentential forms no longer than maxLen (plus a slack when the grammar is not
 * monotone, since a form may then shrink later). Calls `visit` for every new form; stops when it returns true.
 */
function search(
  g: GeneralGrammar,
  maxLen: number,
  budget: number,
  visit: (form: Sym[], key: string, parent: Map<string, { from: string; rule: Rule; at: number }>) => boolean,
): boolean {
  const monotone = classify(g).checks[1].ok;
  const limit = monotone ? Math.max(maxLen, 1) : maxLen + SLACK;
  const parent = new Map<string, { from: string; rule: Rule; at: number }>();
  const startKey = g.start;
  const seen = new Set([startKey]);
  let queue: Sym[][] = [[g.start]];
  if (visit([g.start], startKey, parent)) return false;
  while (queue.length) {
    const next: Sym[][] = [];
    for (const form of queue) {
      const from = form.join(SEP);
      for (const s of successors(g, form)) {
        if (s.next.length > limit) continue;
        const key = s.next.join(SEP);
        if (seen.has(key)) continue;
        if (seen.size >= budget) return true;
        seen.add(key);
        parent.set(key, { from, rule: s.rule, at: s.at });
        if (visit(s.next, key, parent)) return false;
        next.push(s.next);
      }
    }
    queue = next;
  }
  return false;
}

/** All words of length ≤ maxLen found by the bounded search, shortest first. */
export function generateWords(g: GeneralGrammar, maxLen: number, budget = 60000): SearchResult {
  const words = new Set<string>();
  const truncated = search(g, maxLen, budget, (form) => {
    if (form.length <= maxLen && terminalsOnly(form)) words.add(form.join(''));
    return false;
  });
  const sorted = [...words].sort((a, b) => a.length - b.length || (a < b ? -1 : 1));
  return { words: sorted, truncated };
}

/** A shortest derivation of `word` (terminals are single characters), or null if the bounded search finds none. */
export function findDerivation(g: GeneralGrammar, word: string, budget = 60000): GeneralDerivation | null {
  const target = [...word].join(SEP);
  let found: GeneralDerivation | null = null;
  search(g, [...word].length, budget, (_, key, parent) => {
    if (key !== target) return false;
    const forms: Sym[][] = [];
    const rules: Rule[] = [];
    const at: number[] = [];
    let k: string | undefined = key;
    while (k !== undefined) {
      forms.unshift(k === '' ? [] : k.split(SEP));
      const p = parent.get(k);
      if (p) rules.unshift(p.rule), at.unshift(p.at);
      k = p?.from;
    }
    found = { forms, rules, at };
    return true;
  });
  return found;
}

// ---------- HTML ----------

const symsHtml = (syms: Sym[]) => (syms.length ? syms.map(symHtml).join('') : 'ε');
export const ruleHtml = (r: Rule) => `${symsHtml(r.lhs)} → ${symsHtml(r.rhs)}`;

/** Groups rules with the same left side: "αβ → x | y". */
export function rulesByLhs(g: GeneralGrammar): { lhs: Sym[]; rhss: Sym[][] }[] {
  const out: { lhs: Sym[]; rhss: Sym[][] }[] = [];
  for (const r of g.rules) {
    const k = r.lhs.join(SEP);
    const row = out.find((o) => o.lhs.join(SEP) === k);
    if (row) row.rhss.push(r.rhs);
    else out.push({ lhs: r.lhs, rhss: [r.rhs] });
  }
  return out;
}

/** One sentential form, with the part rewritten next underlined. */
export function formHtml(form: Sym[], at?: number, len = 1): string {
  if (!form.length) return 'ε';
  return form
    .map((X, i) => {
      const h = symHtml(X);
      if (at === undefined || i < at || i >= at + len) return h;
      return `${i === at ? '<u class="rw">' : ''}${h}${i === at + len - 1 ? '</u>' : ''}`;
    })
    .join('');
}
