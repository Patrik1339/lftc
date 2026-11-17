import { describe, expect, it } from 'vitest';
import { serializeAutomaton } from './automata/parse';
import { epsilonClosure } from './automata/simulate';
import { findAmbiguity } from './grammar/ambiguity';
import { classify } from './grammar/chomsky';
import { EXERCISES, ExerciseType } from './practice/exercises';
import { QUESTIONS } from './practice/quiz';
import { LANGUAGES } from './pumping/languages';
import { breakingI } from './pumping/pumping';

const byId = (id: string): ExerciseType => EXERCISES.find((e) => e.id === id)!;
const RUNS = 25;

describe('practice exercises', () => {
  it('reference solutions pass their own checker', () => {
    for (const type of EXERCISES) {
      for (let k = 0; k < RUNS; k++) {
        const ex = type.make();
        // For min-count the answer is a number; the DFA text only illustrates it.
        if (ex.solutionText && type.id !== 'min-count') expect(ex.check(ex.solutionText).ok, `${type.id}\n${ex.solutionText}`).toBe(true);
      }
    }
  });

  it('ε-closure: accepts the closure in any order, rejects a missing state', () => {
    for (let k = 0; k < RUNS; k++) {
      const ex = byId('eps-closure').make();
      const q = /ε-cl\((\w+)\)/.exec(ex.prompt.en)![1];
      const cl = epsilonClosure(ex.automaton!, [q]);
      expect(ex.check(`{${[...cl].reverse().join(', ')}}`).ok).toBe(true);
      expect(ex.check(cl.slice(1).join(' ')).ok).toBe(false);
    }
  });

  it('NFA → DFA: rejects the NFA itself (not deterministic)', () => {
    for (let k = 0; k < RUNS; k++) {
      const ex = byId('nfa-dfa').make();
      expect(ex.check(serializeAutomaton(ex.automaton!)).ok).toBe(false);
    }
  });

  it('minimal DFA: only the right count passes', () => {
    for (let k = 0; k < RUNS; k++) {
      const ex = byId('min-count').make();
      const n = Number(/<b>(\d+)<\/b>/.exec(ex.solution.en)![1]);
      expect(ex.check(String(n)).ok).toBe(true);
      expect(ex.check(String(n + 1)).ok).toBe(false);
      expect(ex.automaton!.states.length).toBeGreaterThan(n);
    }
  });

  it('design DFA: a wrong automaton gets a counterexample', () => {
    const ex = byId('design-dfa').make();
    const fb = ex.check('start: q0\nfinal: q0\nq0 a q0\nq0 b q0');
    expect(fb.ok).toBe(false);
    expect(fb.msg.en).toMatch(/accepts|rejects/);
    expect(ex.check('start q0').errors?.length).toBeGreaterThan(0);
  });

  it('pumping: the suggested i works and i = 1 never does', () => {
    for (let k = 0; k < RUNS; k++) {
      const ex = byId('pump-i').make();
      const i = /i = <b>(\d+)<\/b>/.exec(ex.solution.en)![1];
      expect(ex.check(i).ok).toBe(true);
      expect(ex.check('1').ok).toBe(false);
    }
  });

  it('every pumping language breaks every split for small p', () => {
    for (const lang of LANGUAGES) {
      for (let p = 2; p <= Math.min(lang.maxP ?? 5, 5); p++) {
        const w = lang.word(p);
        for (let xl = 0; xl < p; xl++)
          for (let yl = 1; xl + yl <= p; yl++)
            expect(breakingI(lang, { x: w.slice(0, xl), y: w.slice(xl, xl + yl), z: w.slice(xl + yl) }), `${lang.id} p=${p}`).not.toBeNull();
      }
    }
  });

  it('Chomsky type: matches classify', () => {
    for (let k = 0; k < RUNS; k++) {
      const ex = byId('chomsky-type').make();
      const type = classify(ex.general!).type;
      expect(ex.check(String(type)).ok).toBe(true);
      expect(ex.check(String((type + 1) % 4)).ok).toBe(false);
    }
  });

  it('grammar exercises: the original grammar is rejected where it is not a valid answer', () => {
    for (let k = 0; k < RUNS; k++) {
      expect(byId('left-rec').make().check('S -> b').ok).toBe(false);
      const lr = byId('left-rec').make();
      const original = lr.open!.text!;
      expect(lr.check(original).ok).toBe(false);
      expect(byId('cnf').make().check('S -> a').ok).toBe(false);
      expect(byId('design-cfg').make().check('S -> aS | bS | ε').ok).toBe(false);
    }
  });

  it('ambiguity: the shortest ambiguous word is accepted', () => {
    for (let k = 0; k < RUNS; k++) {
      const ex = byId('amb-word').make();
      const w = findAmbiguity(ex.grammar!, 7).word;
      expect(w).not.toBeNull();
      expect(ex.check(w!).ok).toBe(true);
    }
  });
});

describe('pushdown automaton exercises', () => {
  it('a wrong PDA gets a counterexample, a syntax error gets parse errors', () => {
    for (let k = 0; k < RUNS; k++) {
      const ex = byId('design-pda').make();
      const fb = ex.check('start: q\nstack: Z\naccept: empty\nq ε Z -> q ε');
      expect(fb.ok).toBe(false);
      expect(fb.msg.en).toMatch(/accepts|rejects/);
    }
    expect(byId('design-pda').make().check('q0 a Z').errors?.length).toBeGreaterThan(0);
  });

  it("what's on the stack: the stack in the solution passes, a shorter one does not", () => {
    for (let k = 0; k < RUNS; k++) {
      const ex = byId('pda-stack').make();
      const want = /<b class="mono">([^<]+)<\/b>\)/.exec(ex.solution.en)![1];
      expect(ex.check(want).ok, ex.prompt.en).toBe(true);
      expect(ex.check([...want].join(' ')).ok).toBe(true);
      expect(ex.check(want.slice(1)).ok).toBe(false);
    }
  });
});

describe('quiz', () => {
  it('has well-formed questions with distinct options', () => {
    expect(QUESTIONS.length).toBeGreaterThanOrEqual(25);
    for (const q of QUESTIONS) {
      expect(q.options.length).toBe(4);
      for (const lang of ['ro', 'en'] as const) {
        expect(new Set(q.options.map((o) => o[lang])).size, q.q.en).toBe(4);
        expect(q.q[lang] && q.explain[lang]).toBeTruthy();
      }
    }
  });
});
