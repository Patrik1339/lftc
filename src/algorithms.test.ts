import { describe, expect, it } from 'vitest';
import { DFA_EXAMPLES, EPSILON_EXAMPLES, NFA_EXAMPLES } from './automata/examples';
import { eliminateEpsilon } from './automata/epsilon';
import { minimize } from './automata/minimize';
import { parseAutomaton, serializeAutomaton } from './automata/parse';
import { accepts, allWords } from './automata/simulate';
import { subsetConstruction } from './automata/subset';
import { Automaton, EPSILON, hasEpsilon, isComplete, isDeterministic } from './automata/types';
import { LANGUAGES } from './pumping/languages';
import { allSplits, breakingI } from './pumping/pumping';

const parse = (text: string): Automaton => {
  const r = parseAutomaton(text);
  if (!r.ok) throw new Error(JSON.stringify(r.errors));
  return r.automaton;
};

function expectEquivalent(a: Automaton, b: Automaton, maxLen = 7) {
  const alphabet = [...new Set([...a.alphabet, ...b.alphabet])];
  for (const w of allWords(alphabet, maxLen)) {
    expect(accepts(b, w), `word "${w.join('')}"`).toBe(accepts(a, w));
  }
}

function randomNfa(seed: number): Automaton {
  let s = seed;
  const rnd = () => ((s = (s * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
  const n = 2 + Math.floor(rnd() * 4);
  const states = Array.from({ length: n }, (_, i) => `q${i}`);
  const lines = ['start: q0', `final: ${states.filter(() => rnd() < 0.4).join(', ')}`];
  for (const q of states) for (const sym of ['a', 'b', EPSILON]) {
    const ts = states.filter(() => rnd() < (sym === EPSILON ? 0.15 : 0.35));
    if (ts.length) lines.push(`${q} ${sym} ${ts.join(' ')}`);
  }
  return parse(lines.join('\n'));
}

const allExamples = [...EPSILON_EXAMPLES, ...NFA_EXAMPLES, ...DFA_EXAMPLES].map((e) => parse(e.text));
const randoms = Array.from({ length: 40 }, (_, i) => randomNfa(i + 1));

describe('parser', () => {
  it('round-trips through serialize', () => {
    for (const a of allExamples) expectEquivalent(a, parse(serializeAutomaton(a)), 5);
  });
  it('renames unsafe state names when serializing', () => {
    const dfa = subsetConstruction(parse(NFA_EXAMPLES[0].text)).result;
    const text = serializeAutomaton(dfa);
    expect(text).toContain('# q0_q1 = {q0,q1}');
    expectEquivalent(dfa, parse(text), 6);
  });
  it('orders states by start, then first use in transitions', () => {
    expect(parse('start: q0\nfinal: q2\nq0 a q1\nq1 b q2').states).toEqual(['q0', 'q1', 'q2']);
  });
  it('reports errors with line numbers', () => {
    const r = parseAutomaton('start: q0\nq0 a');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors[0].line).toBe(2);
  });
});

describe('ε-elimination', () => {
  it('preserves the language and removes all ε-transitions', () => {
    for (const a of [...allExamples, ...randoms]) {
      const { result, steps } = eliminateEpsilon(a);
      expect(hasEpsilon(result)).toBe(false);
      expect(steps.length).toBeGreaterThan(2);
      expectEquivalent(a, result);
    }
  });
});

describe('subset construction', () => {
  it('produces an equivalent AFD', () => {
    for (const a of [...allExamples, ...randoms]) {
      for (const includeEmpty of [true, false]) {
        const { result } = subsetConstruction(a, { includeEmpty });
        expect(isDeterministic(result)).toBe(true);
        expectEquivalent(a, result);
      }
    }
  });
  it('builds the expected number of states', () => {
    expect(subsetConstruction(parse(NFA_EXAMPLES[0].text)).result.states).toHaveLength(3);
    expect(subsetConstruction(parse(NFA_EXAMPLES[1].text)).result.states).toHaveLength(8);
  });
});

describe('minimization', () => {
  it('matches the textbook results', () => {
    const sizes = DFA_EXAMPLES.map((e) => minimize(parse(e.text)).result.states.length);
    expect(sizes).toEqual([5, 2, 4]);
  });
  it('is equivalent, complete, and idempotent on random automata', () => {
    for (const a of [...allExamples, ...randoms]) {
      const dfa = subsetConstruction(a, { includeEmpty: true }).result;
      const { result } = minimize(dfa);
      expect(isDeterministic(result) && isComplete(result)).toBe(true);
      expectEquivalent(a, result);
      expect(minimize(result).result.states.length).toBe(result.states.length);
      expect(result.states.length).toBeLessThanOrEqual(dfa.states.length);
    }
  });
});

describe('pumping lemma catalog', () => {
  for (const lang of LANGUAGES) {
    it(`${lang.id}: every split of the chosen word can be pumped out of L`, () => {
      for (let p = 2; p <= (lang.maxP ?? 7); p++) {
        const w = lang.word(p);
        expect(lang.inL(w)).toBe(true);
        expect(w.length).toBeGreaterThanOrEqual(p);
        for (const s of allSplits(w, p)) expect(breakingI(lang, s), `p=${p} ${s.x}|${s.y}|${s.z}`).not.toBeNull();
      }
    });
  }
});
