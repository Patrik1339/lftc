import { Automaton, EPSILON, State, addEdge, edges } from './types';

export interface ParseError {
  line: number;
  key: string;
  params?: Record<string, string | number>;
}

export type ParseResult = { ok: true; automaton: Automaton } | { ok: false; errors: ParseError[] };

// λ is still accepted on input, since some textbooks use it for the empty word.
const EPSILON_ALIASES = new Set([EPSILON, 'eps', 'epsilon', 'λ', 'lambda']);
const START_KEYS = new Set(['start', 'initial', 'init', 'q0']);
const FINAL_KEYS = new Set(['final', 'finals', 'finale', 'f', 'accept']);

function tokens(s: string): string[] {
  return s.split(/[\s,]+/).filter(Boolean);
}

/**
 * Text format:
 *   start: q0
 *   final: q2, q3
 *   q0 a q0 q1      # transition(s): from symbol to...
 *   q0 ε q2         # ε, ε, eps are accepted for the empty word
 */
export function parseAutomaton(text: string): ParseResult {
  const errors: ParseError[] = [];
  const a: Automaton = { states: [], alphabet: [], start: '', finals: [], delta: {} };
  // States are ordered start first, then by first use in a transition, then header-only states.
  const transitionStates: State[] = [];
  const headerStates: State[] = [];
  const addState = (q: State, list = headerStates) => {
    if (!list.includes(q)) list.push(q);
  };

  text.split('\n').forEach((raw, i) => {
    const line = i + 1;
    const content = raw.replace(/#.*/, '').trim();
    if (!content) return;

    const header = content.match(/^([A-Za-z0-9]+)\s*:\s*(.*)$/);
    if (header) {
      const key = header[1].toLowerCase();
      const values = tokens(header[2]);
      if (START_KEYS.has(key)) {
        if (values.length !== 1) errors.push({ line, key: 'parse.oneStart' });
        else {
          a.start = values[0];
          addState(values[0]);
        }
      } else if (FINAL_KEYS.has(key)) {
        for (const q of values) {
          addState(q);
          if (!a.finals.includes(q)) a.finals.push(q);
        }
      } else if (key === 'states' || key === 'stari') {
        values.forEach((q) => addState(q));
      } else {
        errors.push({ line, key: 'parse.unknownHeader', params: { name: header[1] } });
      }
      return;
    }

    const parts = tokens(content);
    if (parts.length < 3) {
      errors.push({ line, key: 'parse.badTransition' });
      return;
    }
    const [from, rawSym, ...tos] = parts;
    const sym = EPSILON_ALIASES.has(rawSym) ? EPSILON : rawSym;
    if (sym !== EPSILON && !a.alphabet.includes(sym)) a.alphabet.push(sym);
    addState(from, transitionStates);
    for (const to of tos) {
      addState(to, transitionStates);
      addEdge(a, from, sym, to);
    }
  });

  a.states = [...new Set([...(a.start ? [a.start] : []), ...transitionStates, ...headerStates])];
  if (!errors.length && a.states.length === 0) errors.push({ line: 0, key: 'parse.empty' });
  if (!errors.length && !a.start) errors.push({ line: 0, key: 'parse.noStart' });
  if (errors.length) return { ok: false, errors };
  return { ok: true, automaton: a };
}

const SAFE_NAME = /^[^\s,#:{}[\]]+$/;

/**
 * Serialize to the text format. States whose names the parser cannot read back
 * (e.g. "{q0,q1}") are renamed to a readable form ("q0_q1") with a mapping comment.
 */
export function serializeAutomaton(a: Automaton): string {
  const map = new Map<State, State>();
  const used = new Set(a.states.filter((q) => SAFE_NAME.test(q)));
  for (const q of a.states) {
    if (SAFE_NAME.test(q)) {
      map.set(q, q);
      continue;
    }
    const base = q.replace(/[{}[\]\s]/g, '').replace(/[,#:]+/g, '_') || 'S';
    let name = base;
    for (let i = 1; used.has(name); i++) name = `${base}'${i}`;
    used.add(name);
    map.set(q, name);
  }
  const n = (q: State) => map.get(q)!;

  const lines: string[] = [];
  const renamed = a.states.filter((q) => n(q) !== q);
  if (renamed.length) lines.push(...renamed.map((q) => `# ${n(q)} = ${q}`), '');
  lines.push(`start: ${n(a.start)}`);
  lines.push(`final: ${a.finals.map(n).join(', ')}`);
  const isolated = a.states.filter((q) => !edges(a).some(([f, , t]) => f === q || t === q) && q !== a.start && !a.finals.includes(q));
  if (isolated.length) lines.push(`states: ${isolated.map(n).join(', ')}`);
  const grouped = new Map<string, State[]>();
  for (const [f, s, t] of edges(a)) {
    const k = `${n(f)} ${s}`;
    grouped.set(k, [...(grouped.get(k) ?? []), n(t)]);
  }
  for (const [k, ts] of grouped) lines.push(`${k} ${ts.join(' ')}`);
  return lines.join('\n');
}
