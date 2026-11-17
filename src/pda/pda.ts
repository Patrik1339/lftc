import type { DotPalette } from '../automata/dot';
import type { ParseError } from '../automata/parse';
import { EPSILON, State } from '../automata/types';
import type { Grammar } from '../grammar/types';

/** δ(from, input, top) ∋ (to, push). `input` is '' for ε; `push[0]` becomes the new top, [] pops. */
export interface PdaTransition {
  from: State;
  input: string;
  top: string;
  to: State;
  push: string[];
}

export type AcceptMode = 'final' | 'empty';

/** A pushdown automaton P = (Q, Σ, Γ, δ, q0, Z0, F). */
export interface Pda {
  states: State[];
  inputAlphabet: string[];
  stackAlphabet: string[];
  start: State;
  startStack: string;
  finals: State[];
  /** Acceptance by final state or by empty stack. */
  mode: AcceptMode;
  transitions: PdaTransition[];
}

export type PdaParse = { ok: true; pda: Pda } | { ok: false; errors: ParseError[] };

const EPS = new Set(['ε', 'eps', 'epsilon', 'λ', 'lambda']);
const MODES: Record<string, AcceptMode> = { final: 'final', empty: 'empty', vida: 'empty', 'vidă': 'empty' };
const tokens = (s: string) => s.split(/[\s,]+/).filter(Boolean);

/** Splits a pushed string into stack symbols: longest known symbol first (so AZ0 is A, Z0), else one character. */
function splitPush(raw: string[], known: string[]): string[] {
  if (raw.length !== 1) return raw.flatMap((t) => (EPS.has(t) ? [] : [t]));
  const s = raw[0];
  if (EPS.has(s)) return [];
  const byLen = [...known].sort((a, b) => b.length - a.length);
  const out: string[] = [];
  for (let i = 0; i < s.length; ) {
    const k = byLen.find((x) => s.startsWith(x, i)) ?? String.fromCodePoint(s.codePointAt(i)!);
    out.push(k);
    i += k.length;
  }
  return out;
}

/**
 * Text format:
 *   start: q0
 *   stack: Z            # initial stack symbol Z0
 *   final: q2           # with "accept: empty" the final states are ignored
 *   accept: final       # or: empty (default: final if final: is given, else empty)
 *   q0 a Z -> q0 AZ     # from input top -> to push (push AZ: A is the new top)
 *   q0 ε A -> q1 ε | q2 A
 *   δ(q0, b, A) = {(q1, ε)}
 */
export function parsePda(text: string): PdaParse {
  const errors: ParseError[] = [];
  let start = '';
  let startStack = '';
  let mode: AcceptMode | null = null;
  const finals: State[] = [];
  const raw: { line: number; from: State; input: string; top: string; to: State; push: string[] }[] = [];

  text.split('\n').forEach((rawLine, i) => {
    const line = i + 1;
    const content = rawLine.replace(/#.*/, '').trim();
    if (!content) return;

    const header = content.match(/^([A-Za-z0-9]+)\s*:\s*(.*)$/);
    if (header) {
      const key = header[1].toLowerCase();
      const values = tokens(header[2]);
      if (['start', 'initial', 'init'].includes(key)) {
        if (values.length !== 1) errors.push({ line, key: 'parse.oneStart' });
        else start = values[0];
      } else if (['stack', 'z0', 'bottom', 'stiva'].includes(key)) {
        if (values.length !== 1) errors.push({ line, key: 'pda.parse.oneStack' });
        else startStack = values[0];
      } else if (['accept', 'mode', 'acceptare'].includes(key)) {
        // "accept: q2" (as for finite automata) still lists final states.
        const v = values.length === 1 ? MODES[values[0].toLowerCase()] : undefined;
        if (v) mode = v;
        else if (key === 'accept' && values.length) values.forEach((q) => finals.includes(q) || finals.push(q));
        else errors.push({ line, key: 'pda.parse.badMode' });
      } else if (['final', 'finals', 'finale', 'f'].includes(key)) {
        for (const q of values) if (!finals.includes(q)) finals.push(q);
      } else {
        errors.push({ line, key: 'pda.parse.unknownHeader', params: { name: header[1] } });
      }
      return;
    }

    // δ(q, a, Z) = {(p, AZ), (r, ε)}
    const delta = content.match(/^(?:δ|d)\s*\(([^)]*)\)\s*=\s*(.*)$/);
    let lhs: string[];
    let rhss: string[][];
    if (delta) {
      lhs = tokens(delta[1]);
      rhss = [...delta[2].matchAll(/\(([^)]*)\)/g)].map((m) => tokens(m[1]));
    } else {
      const [l, r] = content.split(/->|→/);
      if (r === undefined) {
        errors.push({ line, key: 'pda.parse.badTransition' });
        return;
      }
      lhs = tokens(l);
      rhss = r.split('|').map(tokens);
    }
    if (lhs.length !== 3 || !rhss.length || rhss.some((x) => x.length < 1)) {
      errors.push({ line, key: 'pda.parse.badTransition' });
      return;
    }
    const [from, input, top] = lhs;
    if (EPS.has(top)) {
      errors.push({ line, key: 'pda.parse.epsTop' });
      return;
    }
    for (const [to, ...push] of rhss) raw.push({ line, from, input: EPS.has(input) ? '' : input, top, to, push });
  });

  if (!errors.length && !raw.length) errors.push({ line: 0, key: 'pda.parse.empty' });
  if (!errors.length && !start) errors.push({ line: 0, key: 'parse.noStart' });
  if (!errors.length && !startStack) errors.push({ line: 0, key: 'pda.parse.noStack' });
  if (errors.length) return { ok: false, errors };

  const known = [...new Set([startStack, ...raw.map((t) => t.top)])];
  const transitions: PdaTransition[] = raw.map((t) => ({ from: t.from, input: t.input, top: t.top, to: t.to, push: splitPush(t.push, known) }));
  const states = [...new Set([start, ...transitions.flatMap((t) => [t.from, t.to]), ...finals])];
  const inputAlphabet = [...new Set(transitions.map((t) => t.input).filter(Boolean))];
  const stackAlphabet = [...new Set([startStack, ...transitions.flatMap((t) => [t.top, ...t.push])])];
  return {
    ok: true,
    pda: { states, inputAlphabet, stackAlphabet, start, startStack, finals, mode: mode ?? (finals.length ? 'final' : 'empty'), transitions },
  };
}

/** Writes a stack string: symbols glued together (AZ) unless one is longer than a character. */
export const stackText = (s: string[]) => (s.length === 0 ? EPSILON : s.some((x) => [...x].length > 1) ? s.join(' ') : s.join(''));
export const transitionText = (t: PdaTransition) => `${t.from} ${t.input || EPSILON} ${t.top} -> ${t.to} ${stackText(t.push)}`;
export const deltaText = (t: PdaTransition) => `δ(${t.from}, ${t.input || EPSILON}, ${t.top}) ∋ (${t.to}, ${stackText(t.push)})`;

export function serializePda(p: Pda): string {
  const lines = [`start: ${p.start}`, `stack: ${p.startStack}`];
  if (p.mode === 'final') lines.push(`final: ${p.finals.join(', ')}`);
  lines.push(`accept: ${p.mode}`);
  return [...lines, ...p.transitions.map(transitionText)].join('\n');
}

/** Deterministic: at most one move from any (q, a, Z), and no input move where an ε-move exists. */
export function isDeterministicPda(p: Pda): boolean {
  const seen = new Map<string, number>();
  for (const t of p.transitions) {
    const k = `${t.from}\u0000${t.input}\u0000${t.top}`;
    seen.set(k, (seen.get(k) ?? 0) + 1);
  }
  for (const [k, n] of seen) {
    if (n > 1) return false;
    const [q, a, Z] = k.split('\u0000');
    if (a !== '' && seen.has(`${q}\u0000\u0000${Z}`)) return false;
  }
  return true;
}

// ---------------------------------------------------------------- simulation

/** Instantaneous description (q, remaining input, stack); stack[0] is the top. */
export interface Config {
  state: State;
  pos: number;
  stack: string[];
}

export interface RunStep {
  config: Config;
  /** The transition that led here (absent for the initial configuration). */
  via?: PdaTransition;
}

export interface RunResult {
  accepted: boolean;
  /** The shortest accepting computation, or (if rejected) one that reads the longest prefix. */
  path: RunStep[];
  explored: number;
  /** The search hit a limit, so a rejection is not certain. */
  truncated: boolean;
}

export const isAccepting = (p: Pda, c: Config, n: number) =>
  c.pos === n && (p.mode === 'final' ? p.finals.includes(c.state) : c.stack.length === 0);

/** Moves from a configuration, in the order the transitions are written. */
export function moves(p: Pda, word: string[], c: Config): RunStep[] {
  if (!c.stack.length) return [];
  const out: RunStep[] = [];
  for (const t of p.transitions) {
    if (t.from !== c.state || t.top !== c.stack[0]) continue;
    if (t.input !== '' && word[c.pos] !== t.input) continue;
    out.push({ via: t, config: { state: t.to, pos: c.pos + (t.input ? 1 : 0), stack: [...t.push, ...c.stack.slice(1)] } });
  }
  return out;
}

/** Breadth-first search over configurations, with a cap on the stack height and on the number of configurations. */
export function runPda(p: Pda, word: string[], opts: { maxConfigs?: number; maxStack?: number } = {}): RunResult {
  const maxConfigs = opts.maxConfigs ?? 20000;
  const maxStack = opts.maxStack ?? 2 * word.length + 10;
  const key = (c: Config) => `${c.state}\u0000${c.pos}\u0000${c.stack.join('\u0001')}`;
  const init: Config = { state: p.start, pos: 0, stack: [p.startStack] };
  const parent = new Map<string, { prev: string | null; step: RunStep }>([[key(init), { prev: null, step: { config: init } }]]);
  const queue = [init];
  let best = init;
  let truncated = false;

  const pathTo = (c: Config): RunStep[] => {
    const out: RunStep[] = [];
    for (let k: string | null = key(c); k !== null; k = parent.get(k)!.prev) out.unshift(parent.get(k)!.step);
    return out;
  };

  for (let i = 0; i < queue.length; i++) {
    const c = queue[i];
    if (isAccepting(p, c, word.length)) return { accepted: true, path: pathTo(c), explored: parent.size, truncated: false };
    if (c.pos > best.pos) best = c;
    for (const m of moves(p, word, c)) {
      const k = key(m.config);
      if (parent.has(k)) continue;
      if (m.config.stack.length > maxStack || parent.size >= maxConfigs) {
        truncated = true;
        continue;
      }
      parent.set(k, { prev: key(c), step: m });
      queue.push(m.config);
    }
  }
  return { accepted: false, path: pathTo(best), explored: parent.size, truncated };
}

export function splitInput(p: Pda, input: string): string[] {
  const s = input.trim();
  if (s === '' || EPS.has(s)) return [];
  if (/\s/.test(s) || p.inputAlphabet.some((x) => [...x].length > 1)) return s.split(/\s+/);
  return [...s];
}

/**
 * Deterministic run that stops right after the last symbol of `word` is read
 * (ε-moves are taken only when needed to read the next symbol). Null if the PDA blocks.
 */
export function readPrefix(p: Pda, word: string[]): Config | null {
  let c: Config = { state: p.start, pos: 0, stack: [p.startStack] };
  for (let guard = 0; c.pos < word.length && guard < 1000; guard++) {
    const ms = moves(p, word, c);
    const m = ms.find((x) => x.via!.input !== '') ?? ms[0];
    if (!m) return null;
    c = m.config;
  }
  return c.pos === word.length ? c : null;
}

export const pdaAccepts = (p: Pda, word: string[], opts?: { maxConfigs?: number }) => runPda(p, word, opts).accepted;

// ---------------------------------------------------------------- CFG → PDA

/** The standard one-state construction: expand a nonterminal on top (ε-move), match a terminal on top with the input. */
export function cfgToPda(g: Grammar): Pda {
  const transitions: PdaTransition[] = [];
  for (const A of g.nonterminals) for (const rhs of g.prods[A]) transitions.push({ from: 'q', input: '', top: A, to: 'q', push: [...rhs] });
  for (const a of g.terminals) transitions.push({ from: 'q', input: a, top: a, to: 'q', push: [] });
  return {
    states: ['q'],
    inputAlphabet: [...g.terminals],
    stackAlphabet: [...g.nonterminals, ...g.terminals],
    start: 'q',
    startStack: g.start,
    finals: [],
    mode: 'empty',
    transitions,
  };
}

// ---------------------------------------------------------------- Graphviz

const dq = (s: string) => `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

/** State diagram; edges are labelled "a, Z / AZ", one line per transition. */
export function pdaToDot(p: Pda, hl: { state?: State; transition?: PdaTransition }, pal: DotPalette): string {
  const lines: string[] = [
    'digraph P {',
    '  rankdir=LR; bgcolor="transparent"; pad=0.2; nodesep=0.4; ranksep=0.7;',
    `  node [fontname="Helvetica", fontsize=13, color="${pal.fg}", fontcolor="${pal.fg}", shape=circle, width=0.45];`,
    `  edge [fontname="Helvetica", fontsize=12, color="${pal.fg}", fontcolor="${pal.fg}", arrowsize=0.7];`,
    '  __start [shape=point, style=invis, width=0];',
  ];
  for (const q of p.states) {
    const attrs: string[] = [];
    if (p.mode === 'final' && p.finals.includes(q)) attrs.push('shape=doublecircle');
    if (hl.state === q) attrs.push(`style=filled, fillcolor="${pal.hlFill}", color="${pal.hl}", penwidth=2.6`);
    lines.push(`  ${dq(q)} [${attrs.join(', ')}];`);
  }
  lines.push(`  __start -> ${dq(p.start)} [arrowsize=0.8];`);
  const groups = new Map<string, PdaTransition[]>();
  for (const t of p.transitions) {
    const k = `${t.from}\u0000${t.to}`;
    groups.set(k, [...(groups.get(k) ?? []), t]);
  }
  for (const ts of groups.values()) {
    const hot = hl.transition !== undefined && ts.includes(hl.transition);
    const label = ts.map((t) => `${t.input || EPSILON}, ${t.top} / ${stackText(t.push)}`.replace(/\\/g, '\\\\').replace(/"/g, '\\"')).join('\\n');
    const attrs = [`label=" ${label} "`];
    if (hot) attrs.push(`color="${pal.hl}", fontcolor="${pal.hl}", penwidth=2.4`);
    lines.push(`  ${dq(ts[0].from)} -> ${dq(ts[0].to)} [${attrs.join(', ')}];`);
  }
  lines.push('}');
  return lines.join('\n');
}
