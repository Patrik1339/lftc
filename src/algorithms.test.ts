import { describe, expect, it } from 'vitest';
import { DFA_EXAMPLES, EPSILON_EXAMPLES, NFA_EXAMPLES } from './automata/examples';
import { eliminateEpsilon } from './automata/epsilon';
import { minimize } from './automata/minimize';
import { parseAutomaton, serializeAutomaton } from './automata/parse';
import { accepts, allWords } from './automata/simulate';
import { subsetConstruction } from './automata/subset';
import { Automaton, EPSILON, hasEpsilon, isComplete, isDeterministic } from './automata/types';
import { CFG_EXAMPLES, LR_EXAMPLES } from './grammar/examples';
import { eliminateLeftRecursion, isLeftRecursive, leftRecPreconditions } from './grammar/leftrec';
import { derives, wordsUpTo } from './grammar/membership';
import { TooLargeError, isCNF, isGNF, normalize } from './grammar/normal';
import { removeEpsilonAndRenames } from './grammar/simplify';
import { Grammar, parseGrammar, serializeGrammar } from './grammar/types';
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

const parseG = (text: string): Grammar => {
  const r = parseGrammar(text);
  if (!r.ok) throw new Error(JSON.stringify(r.errors));
  return r.grammar;
};

function randomGrammar(seed: number): Grammar {
  let s = seed;
  const rnd = () => ((s = (s * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
  const nts = ['S', 'A', 'B', 'C'];
  const syms = [...nts, 'a', 'b'];
  const lines = nts.map((A) => {
    const alts = Array.from({ length: 1 + Math.floor(rnd() * 3) }, () => {
      const len = Math.floor(rnd() * 4);
      return Array.from({ length: len }, () => syms[Math.floor(rnd() * syms.length)]).join('') || 'ε';
    });
    return `${A} -> ${alts.join(' | ')}`;
  });
  return parseG(lines.join('\n'));
}

const grammarExamples = [...CFG_EXAMPLES, ...LR_EXAMPLES].map((e) => parseG(e.text));
const randomGrammars = Array.from({ length: 60 }, (_, i) => randomGrammar(i + 7));

function expectSameLanguage(a: Grammar, b: Grammar, n = 5) {
  expect(wordsUpTo(b, n)).toEqual(wordsUpTo(a, n));
}

describe('grammars', () => {
  it('parses and round-trips through serialize', () => {
    const g = parseG('S -> aSb | X_a B1 | ε\nX_a -> a\nB1 -> b');
    expect(g.prods.S).toEqual([['a', 'S', 'b'], ['X_a', 'B1'], []]);
    for (const x of [...grammarExamples, ...randomGrammars]) expect(parseG(serializeGrammar(x))).toEqual(x);
  });
  it('membership agrees with enumeration', () => {
    for (const g of [...grammarExamples, ...randomGrammars.slice(0, 20)]) {
      const words = new Set(wordsUpTo(g, 4));
      for (const w of allWords(g.terminals, 4)) expect(derives(g, w), w.join('')).toBe(words.has(w.join('')));
    }
  });
});

describe('CNF and GNF', () => {
  it('produce equivalent grammars of the right shape', () => {
    let gnfs = 0;
    for (const g of [...grammarExamples, ...randomGrammars]) {
      const run = normalize(g);
      expect(run.steps.length).toBeGreaterThan(4);
      if (run.empty) {
        expect(wordsUpTo(g, 6)).toEqual([]);
        continue;
      }
      expect(isCNF(run.cnf!), serializeGrammar(run.cnf!)).toBe(true);
      expectSameLanguage(g, run.cnf!);
      if (run.tooLarge) continue;
      gnfs++;
      expect(isGNF(run.gnf!), serializeGrammar(run.gnf!)).toBe(true);
      expectSameLanguage(g, run.gnf!);
    }
    expect(gnfs).toBeGreaterThan(30);
  });
  it('detects an empty language', () => {
    expect(normalize(parseG('S -> aS | AB\nA -> a')).empty).toBe(true);
  });
});

describe('left recursion', () => {
  it('matches the textbook results', () => {
    const r = eliminateLeftRecursion(parseG(LR_EXAMPLES[0].text), true).result;
    expect(serializeGrammar(r)).toBe("E -> TE'\nE' -> +TE' | ε\nT -> FT'\nT' -> *FT' | ε\nF -> (E) | a");
    const ind = eliminateLeftRecursion(parseG(LR_EXAMPLES[1].text), true).result;
    expect(serializeGrammar(ind)).toBe("S -> Aa | b\nA -> bdA' | cA'\nA' -> cA' | adA' | ε");
  });
  it('removes all left recursion and keeps the language', () => {
    for (const g0 of [...grammarExamples, ...randomGrammars]) {
      const pre = leftRecPreconditions(g0);
      const g = pre.epsilon || pre.cycle ? removeEpsilonAndRenames(g0) : g0;
      const p2 = leftRecPreconditions(g);
      expect(p2.epsilon || p2.cycle).toBe(false);
      for (const withEps of [true, false]) {
        let result: Grammar;
        try {
          result = eliminateLeftRecursion(g, withEps).result;
        } catch (e) {
          if (e instanceof TooLargeError) continue;
          throw e;
        }
        expect(isLeftRecursive(result), serializeGrammar(result)).toBe(false);
        expectSameLanguage(g0, result);
      }
    }
  });
});
