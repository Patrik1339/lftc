import { minimize } from '../automata/minimize';
import { ParseError, parseAutomaton, serializeAutomaton } from '../automata/parse';
import { accepts, allWords, epsilonClosure } from '../automata/simulate';
import { subsetConstruction } from '../automata/subset';
import { Automaton, EPSILON, hasEpsilon, isComplete, isDeterministic, reachable } from '../automata/types';
import { findAmbiguity, treesForWord } from '../grammar/ambiguity';
import { GeneralGrammar, classify, parseGeneralGrammar } from '../grammar/chomsky';
import { eliminateLeftRecursion, isLeftRecursive } from '../grammar/leftrec';
import { derives, wordsUpTo } from '../grammar/membership';
import { isCNF, normalize } from '../grammar/normal';
import { Grammar, parseGrammar, serializeGrammar } from '../grammar/types';
import type { PageId } from '../pages/common';
import { LANGUAGES, Lang } from '../pumping/languages';
import { Split, allSplits, breakingI, pump } from '../pumping/pumping';

/** Bilingual HTML. */
export type L = Record<Lang, string>;
const l = (ro: string, en: string): L => ({ ro, en });

export interface Feedback {
  ok: boolean;
  msg: L;
  /** Parse errors of the typed answer (i18n keys). */
  errors?: ParseError[];
}

/** One generated exercise, with its own checker. */
export interface Exercise {
  prompt: L;
  automaton?: Automaton;
  grammar?: Grammar;
  general?: GeneralGrammar;
  /** w = xyz with x, y, z colored. */
  split?: Split;
  input: 'automaton' | 'grammar' | 'line';
  placeholder?: string;
  check: (answer: string) => Feedback;
  solution: L;
  /** Automaton / grammar text of a correct answer. */
  solutionText?: string;
  /** Opens the topic page on this input, to see the algorithm step by step. */
  open?: { page: PageId; text?: string };
}

export interface ExerciseType {
  id: string;
  topic: PageId;
  title: L;
  desc: L;
  make: () => Exercise;
}

// ---------------------------------------------------------------- helpers

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const shown = (w: string) => (w === '' ? 'ε' : esc(w));
const pick = <T,>(xs: T[]): T => xs[Math.floor(Math.random() * xs.length)];
const rand = (n: number) => Math.floor(Math.random() * n);

const parseA = (text: string): Automaton => {
  const r = parseAutomaton(text);
  if (!r.ok) throw new Error(JSON.stringify(r.errors));
  return r.automaton;
};
const parseG = (text: string): Grammar => {
  const r = parseGrammar(text);
  if (!r.ok) throw new Error(JSON.stringify(r.errors));
  return r.grammar;
};

const syntaxError: L = l('Răspunsul nu poate fi citit:', 'The answer cannot be read:');

/** Shortest word (length ≤ maxLen) on which the two acceptors disagree, or null. */
export function counterexample(alphabet: string[], maxLen: number, ref: (w: string[]) => boolean, got: (w: string[]) => boolean) {
  for (const w of allWords(alphabet, maxLen)) if (ref(w) !== got(w)) return { word: w.join(''), shouldAccept: ref(w) };
  return null;
}

/** Compares a typed automaton with a reference language. */
function checkAutomaton(answer: string, alphabet: string[], ref: (w: string[]) => boolean, mustBeDfa: boolean): Feedback {
  const r = parseAutomaton(answer);
  if (!r.ok) return { ok: false, msg: syntaxError, errors: r.errors };
  const a = r.automaton;
  if (mustBeDfa && !isDeterministic(a))
    return {
      ok: false,
      msg: hasEpsilon(a)
        ? l('Automatul are ε-tranziții, deci nu este determinist.', 'The automaton has ε-transitions, so it is not deterministic.')
        : l(
            'Automatul nu este determinist: o stare are două tranziții cu același simbol.',
            'The automaton is not deterministic: some state has two transitions on the same symbol.',
          ),
    };
  const sigma = [...new Set([...alphabet, ...a.alphabet])];
  const cx = counterexample(sigma, 8, ref, (w) => accepts(a, w));
  if (!cx) return { ok: true, msg: l('Corect! Automatul acceptă exact limbajul cerut.', 'Correct! The automaton accepts exactly the required language.') };
  const w = `<b class="mono">${shown(cx.word)}</b>`;
  return {
    ok: false,
    msg: cx.shouldAccept
      ? l(`Automatul tău respinge cuvântul ${w}, care ar trebui acceptat.`, `Your automaton rejects ${w}, which should be accepted.`)
      : l(`Automatul tău acceptă cuvântul ${w}, care ar trebui respins.`, `Your automaton accepts ${w}, which should be rejected.`),
  };
}

/** Compares the words of length ≤ n of a typed grammar with a reference set. */
function languageDiff(g: Grammar, n: number, ref: Set<string>): Feedback | null {
  const got = new Set(wordsUpTo(g, n));
  const missing = [...ref].filter((w) => !got.has(w));
  const extra = [...got].filter((w) => !ref.has(w));
  const shortest = (ws: string[]) => ws.sort((a, b) => [...a].length - [...b].length || a.localeCompare(b))[0];
  const m = shortest(missing);
  const x = shortest(extra);
  if (m === undefined && x === undefined) return null;
  const pickMissing = x === undefined || (m !== undefined && [...m].length <= [...x].length);
  const w = `<b class="mono">${shown(pickMissing ? m! : x!)}</b>`;
  return {
    ok: false,
    msg: pickMissing
      ? l(`Gramatica ta nu generează ${w}, dar ar trebui.`, `Your grammar does not generate ${w}, but it should.`)
      : l(`Gramatica ta generează ${w}, dar nu ar trebui.`, `Your grammar generates ${w}, but it should not.`),
  };
}

const wordSet = (alphabet: string[], n: number, inL: (w: string) => boolean) => {
  const out = new Set<string>();
  for (const w of allWords(alphabet, n)) if (inL(w.join(''))) out.add(w.join(''));
  return out;
};

// ---------------------------------------------------------------- random automata

function randomAutomaton(n: number, opts: { eps?: number; edge: number; dfa?: boolean }): Automaton {
  const states = Array.from({ length: n }, (_, i) => `q${i}`);
  const lines = ['start: q0', `final: ${states.filter((_, i) => i > 0 && Math.random() < 0.4).join(', ') || states[n - 1]}`];
  for (const q of states) {
    for (const s of ['a', 'b']) {
      const ts = opts.dfa ? [pick(states)] : states.filter(() => Math.random() < opts.edge);
      if (ts.length) lines.push(`${q} ${s} ${ts.join(' ')}`);
    }
    if (opts.eps) {
      const ts = states.filter((t) => t !== q && Math.random() < opts.eps!);
      if (ts.length) lines.push(`${q} ${EPSILON} ${ts.join(' ')}`);
    }
  }
  return parseA(lines.join('\n'));
}

function until<T>(make: () => T, ok: (x: T) => boolean): T {
  for (let i = 0; i < 2000; i++) {
    const x = make();
    if (ok(x)) return x;
  }
  throw new Error('no instance found');
}

// ---------------------------------------------------------------- banks

const DFA_TASKS: { label: L; inL: (w: string) => boolean; solution: string }[] = [
  {
    label: l('cuvintele peste {a, b} care se termină în <b>ab</b>', 'words over {a, b} ending in <b>ab</b>'),
    inL: (w) => w.endsWith('ab'),
    solution: 'start: q0\nfinal: q2\nq0 a q1\nq0 b q0\nq1 a q1\nq1 b q2\nq2 a q1\nq2 b q0',
  },
  {
    label: l('cuvintele peste {a, b} care conțin <b>aa</b>', 'words over {a, b} containing <b>aa</b>'),
    inL: (w) => w.includes('aa'),
    solution: 'start: q0\nfinal: q2\nq0 a q1\nq0 b q0\nq1 a q2\nq1 b q0\nq2 a q2\nq2 b q2',
  },
  {
    label: l('cuvintele peste {a, b} cu un număr <b>par</b> de a', 'words over {a, b} with an <b>even</b> number of a'),
    inL: (w) => [...w].filter((c) => c === 'a').length % 2 === 0,
    solution: 'start: q0\nfinal: q0\nq0 a q1\nq0 b q0\nq1 a q0\nq1 b q1',
  },
  {
    label: l('cuvintele peste {a, b} cu lungimea divizibilă cu <b>3</b>', 'words over {a, b} whose length is divisible by <b>3</b>'),
    inL: (w) => w.length % 3 === 0,
    solution: 'start: q0\nfinal: q0\nq0 a q1\nq0 b q1\nq1 a q2\nq1 b q2\nq2 a q0\nq2 b q0',
  },
  {
    label: l('cuvintele peste {a, b} care încep cu <b>a</b> și se termină cu <b>b</b>', 'words over {a, b} that start with <b>a</b> and end with <b>b</b>'),
    inL: (w) => /^a.*b$/.test(w),
    solution: 'start: q0\nfinal: q2\nq0 a q1\nq1 a q1\nq1 b q2\nq2 a q1\nq2 b q2',
  },
  {
    label: l('cuvintele peste {a, b} care <b>nu</b> conțin <b>bb</b>', 'words over {a, b} that do <b>not</b> contain <b>bb</b>'),
    inL: (w) => !w.includes('bb'),
    solution: 'start: q0\nfinal: q0, q1\nq0 a q0\nq0 b q1\nq1 a q0',
  },
  {
    label: l('cuvintele peste {a, b} în care fiecare <b>a</b> este urmat imediat de <b>b</b>', 'words over {a, b} where every <b>a</b> is immediately followed by <b>b</b>'),
    inL: (w) => /^(b|ab)*$/.test(w),
    solution: 'start: q0\nfinal: q0\nq0 a q1\nq0 b q0\nq1 b q0',
  },
];

const CFG_TASKS: { label: L; alphabet: string[]; inL: (w: string) => boolean; solution: string }[] = [
  {
    label: l('L = { a<sup>n</sup>b<sup>n</sup> | n ≥ 0 }', 'L = { a<sup>n</sup>b<sup>n</sup> | n ≥ 0 }'),
    alphabet: ['a', 'b'],
    inL: (w) => /^a*b*$/.test(w) && w.split('a').length - 1 === w.split('b').length - 1,
    solution: 'S -> aSb | ε',
  },
  {
    label: l('L = { a<sup>n</sup>b<sup>2n</sup> | n ≥ 0 }', 'L = { a<sup>n</sup>b<sup>2n</sup> | n ≥ 0 }'),
    alphabet: ['a', 'b'],
    inL: (w) => /^a*b*$/.test(w) && 2 * (w.split('a').length - 1) === w.split('b').length - 1,
    solution: 'S -> aSbb | ε',
  },
  {
    label: l('L = { a<sup>n</sup>b<sup>m</sup> | 0 ≤ n ≤ m }', 'L = { a<sup>n</sup>b<sup>m</sup> | 0 ≤ n ≤ m }'),
    alphabet: ['a', 'b'],
    inL: (w) => /^a*b*$/.test(w) && w.split('a').length <= w.split('b').length,
    solution: 'S -> aSb | B\nB -> bB | ε',
  },
  {
    label: l('palindroamele peste {a, b}', 'palindromes over {a, b}'),
    alphabet: ['a', 'b'],
    inL: (w) => w === [...w].reverse().join(''),
    solution: 'S -> aSa | bSb | a | b | ε',
  },
  {
    label: l('cuvintele peste {a, b} cu tot atâția a câți b', 'words over {a, b} with as many a as b'),
    alphabet: ['a', 'b'],
    inL: (w) => w.split('a').length === w.split('b').length,
    solution: 'S -> aSbS | bSaS | ε',
  },
  {
    label: l('parantezele echilibrate peste { (, ) }', 'balanced parentheses over { (, ) }'),
    alphabet: ['(', ')'],
    inL: (w) => {
      let d = 0;
      for (const c of w) if ((d += c === '(' ? 1 : -1) < 0) return false;
      return d === 0;
    },
    solution: 'S -> (S)S | ε',
  },
];

const CHOMSKY_TASKS = [
  'S -> aS | bS | b',
  'S -> aSb | ab',
  'S -> aSBC | aBC\nCB -> BC\naB -> ab\nbB -> bb\nbC -> bc\ncC -> cc',
  'S -> ACaB\nCa -> aaC\nCB -> DB | E\naD -> Da\nAD -> AC\naE -> Ea\nAE -> ε',
  'S -> Sa | Sb | a',
  'S -> aA | ab\nA -> Sb',
  'S -> aSb | SS | ε',
  'S -> ε | T\nT -> aTb | ab',
  'S -> abS | a',
  'S -> AB\nAB -> BA\nA -> a\nB -> b',
  'S -> AB\nAB -> a\nA -> a\nB -> b',
  'S -> aA | b\nA -> bS | a',
];

const LR_TASKS = [
  'E -> E+T | T\nT -> T*F | F\nF -> (E) | a',
  'S -> Aa | b\nA -> Ac | Sd | c',
  'A -> Aa | Ab | c | d',
  'A -> Ba | a\nB -> Cb | b\nC -> Ac | c',
  'S -> Sa | b',
  'S -> SaS | b',
];

const CNF_TASKS = ['S -> aSb | ab', 'S -> aSa | bSb | c', 'S -> abc | aS', 'S -> (S) | SS | ()', 'S -> AB | a\nA -> aA | b\nB -> bB | c', 'S -> aB | bA\nA -> a | aS\nB -> b | bS'];

const AMB_TASKS = [
  'E -> E+E | E*E | (E) | a',
  'S -> iS | iSeS | a',
  'S -> AB\nA -> a | ε\nB -> a | ε',
  'S -> SS | (S) | ()',
  'S -> aS | Sa | a',
  'S -> SaS | b',
  'S -> aSb | aaSb | ε',
];

// ---------------------------------------------------------------- exercise types

const epsClosure: ExerciseType = {
  id: 'eps-closure',
  topic: 'epsilon',
  title: l('Calculează ε-închiderea', 'Compute the ε-closure'),
  desc: l('Se dă un AFN-ε; scrie mulțimea ε-cl(q).', 'Given an NFA-ε, write the set ε-cl(q).'),
  make() {
    const [a, q] = until(
      () => {
        const a = randomAutomaton(5, { eps: 0.25, edge: 0.2 });
        return [a, pick(a.states)] as const;
      },
      ([a, q]) => {
        const n = epsilonClosure(a, [q]).length;
        return n >= 2 && n <= 4 && reachable(a).length === a.states.length;
      },
    );
    const cl = epsilonClosure(a, [q]);
    return {
      prompt: l(
        `Care este <b>ε-cl(${q})</b> pentru automatul de mai jos? Scrie stările separate prin virgulă.`,
        `What is <b>ε-cl(${q})</b> for the automaton below? Write the states separated by commas.`,
      ),
      automaton: a,
      input: 'line',
      placeholder: 'q0, q1',
      check(answer) {
        const got = answer.split(/[\s,{}]+/).filter(Boolean);
        const unknown = got.filter((s) => !a.states.includes(s));
        if (unknown.length)
          return { ok: false, msg: l(`Stări necunoscute: ${esc(unknown.join(', '))}.`, `Unknown states: ${esc(unknown.join(', '))}.`) };
        const missing = cl.filter((s) => !got.includes(s));
        const extra = got.filter((s) => !cl.includes(s));
        if (!missing.length && !extra.length) return { ok: true, msg: l('Corect!', 'Correct!') };
        if (extra.length)
          return {
            ok: false,
            msg: l(
              `Din ${q} nu se poate ajunge doar cu ε în ${esc(extra[0])}.`,
              `${esc(extra[0])} cannot be reached from ${q} using only ε-transitions.`,
            ),
          };
        return {
          ok: false,
          msg: l(
            `Lipsesc stări (${missing.length}). Nu uita: q ∈ ε-cl(q), iar ε-tranzițiile se pot înlănțui.`,
            `Some states are missing (${missing.length}). Remember: q ∈ ε-cl(q), and ε-transitions can be chained.`,
          ),
        };
      },
      solution: l(`ε-cl(${q}) = {${cl.join(', ')}}`, `ε-cl(${q}) = {${cl.join(', ')}}`),
      open: { page: 'epsilon', text: serializeAutomaton(a) },
    };
  },
};

const nfaToDfa: ExerciseType = {
  id: 'nfa-dfa',
  topic: 'nfa',
  title: l('Determinizează un AFN', 'Determinize an NFA'),
  desc: l('Scrie un AFD echivalent cu un AFN dat.', 'Write a DFA equivalent to a given NFA.'),
  make() {
    const a = until(
      () => randomAutomaton(3, { edge: 0.4 }),
      (a) => {
        const n = subsetConstruction(a, { includeEmpty: false }).result.states.length;
        return !isDeterministic(a) && reachable(a).length === 3 && n >= 3 && n <= 6;
      },
    );
    const dfa = subsetConstruction(a, { includeEmpty: false }).result;
    return {
      prompt: l(
        'Scrie un <b>AFD</b> (fără ε-tranziții, cel mult o tranziție pe simbol din fiecare stare) care acceptă același limbaj ca AFN-ul de mai jos. Poți folosi orice nume de stări; AFD-ul poate fi parțial.',
        'Write a <b>DFA</b> (no ε-transitions, at most one transition per symbol from each state) accepting the same language as the NFA below. Any state names are fine; the DFA may be partial.',
      ),
      automaton: a,
      input: 'automaton',
      placeholder: 'start: A\nfinal: C\nA a B\n…',
      check: (answer) => checkAutomaton(answer, a.alphabet, (w) => accepts(a, w), true),
      solution: l('Construcția submulțimilor dă:', 'The subset construction gives:'),
      solutionText: serializeAutomaton(dfa),
      open: { page: 'nfa', text: serializeAutomaton(a) },
    };
  },
};

const minCount: ExerciseType = {
  id: 'min-count',
  topic: 'min',
  title: l('Câte stări are AFD-ul minimal?', 'How many states does the minimal DFA have?'),
  desc: l('Elimină stările inaccesibile și unește stările echivalente.', 'Remove inaccessible states and merge equivalent ones.'),
  make() {
    const a = until(
      () => randomAutomaton(6, { edge: 0, dfa: true }),
      (a) => {
        const m = minimize(a).result.states.length;
        return isComplete(a) && a.finals.length > 0 && m >= 2 && m <= a.states.length - 2;
      },
    );
    const m = minimize(a).result;
    return {
      prompt: l(
        'Câte stări are <b>AFD-ul minimal complet</b> echivalent cu automatul de mai jos?',
        'How many states does the <b>complete minimal DFA</b> equivalent to the automaton below have?',
      ),
      automaton: a,
      input: 'line',
      placeholder: '3',
      check(answer) {
        const n = Number(answer.trim());
        if (!Number.isInteger(n)) return { ok: false, msg: l('Scrie un număr.', 'Type a number.') };
        if (n === m.states.length) return { ok: true, msg: l('Corect!', 'Correct!') };
        return {
          ok: false,
          msg:
            n > m.states.length
              ? l('Prea multe: verifică stările inaccesibile și stările echivalente.', 'Too many: look for inaccessible states and equivalent states.')
              : l('Prea puține: ai unit stări care se pot distinge.', 'Too few: you merged states that can be distinguished.'),
        };
      },
      solution: l(`AFD-ul minimal are <b>${m.states.length}</b> stări:`, `The minimal DFA has <b>${m.states.length}</b> states:`),
      solutionText: serializeAutomaton(m),
      open: { page: 'min', text: serializeAutomaton(a) },
    };
  },
};

const designDfa: ExerciseType = {
  id: 'design-dfa',
  topic: 'nfa',
  title: l('Construiește un automat', 'Build an automaton'),
  desc: l('Scrie un automat finit pentru un limbaj descris în cuvinte.', 'Write a finite automaton for a language described in words.'),
  make() {
    const task = pick(DFA_TASKS);
    return {
      prompt: l(
        `Scrie un <b>automat finit</b> (AFD, AFN sau AFN-ε) care acceptă ${task.label.ro}.`,
        `Write a <b>finite automaton</b> (DFA, NFA or NFA-ε) accepting ${task.label.en}.`,
      ),
      input: 'automaton',
      placeholder: 'start: q0\nfinal: q1\nq0 a q1\n…',
      check: (answer) => checkAutomaton(answer, ['a', 'b'], (w) => task.inL(w.join('')), false),
      solution: l('O soluție posibilă:', 'One possible solution:'),
      solutionText: task.solution,
      open: { page: 'min', text: task.solution },
    };
  },
};

const pumpI: ExerciseType = {
  id: 'pump-i',
  topic: 'pump',
  title: l('Găsește i-ul care „strică” descompunerea', 'Find the i that breaks the split'),
  desc: l('Pentru o descompunere w = xyz dată, alege i cu xyⁱz ∉ L.', 'For a given split w = xyz, pick i with xyⁱz ∉ L.'),
  make() {
    const [lang, p, split] = until(
      () => {
        const lang = pick(LANGUAGES);
        const p = 2 + rand(Math.min(lang.maxP ?? 5, 5) - 1);
        return [lang, p, pick(allSplits(lang.word(p), p))] as const;
      },
      ([lang, , s]) => breakingI(lang, s) !== null,
    );
    const best = breakingI(lang, split)!;
    return {
      prompt: l(
        `L = ${lang.label}, p = <b>${p}</b>, w = ${lang.wordLabel(p)}. Adversarul a ales descompunerea de mai jos. Găsește un <b>i ≥ 0</b> astfel încât xy<sup>i</sup>z ∉ L.`,
        `L = ${lang.label}, p = <b>${p}</b>, w = ${lang.wordLabel(p)}. The adversary chose the split below. Find an <b>i ≥ 0</b> such that xy<sup>i</sup>z ∉ L.`,
      ),
      split,
      input: 'line',
      placeholder: 'i',
      check(answer) {
        const i = Number(answer.trim());
        if (!Number.isInteger(i) || i < 0 || i > 50) return { ok: false, msg: l('Scrie un număr natural (≤ 50).', 'Type a natural number (≤ 50).') };
        const w = pump(split, i);
        const wHtml = `<span class="mono">${w.length > 40 ? esc(w.slice(0, 40)) + '…' : shown(w)}</span>`;
        if (i === 1) return { ok: false, msg: l('Pentru i = 1 obții chiar w, care este în L.', 'For i = 1 you get w itself, which is in L.') };
        return lang.inL(w)
          ? { ok: false, msg: l(`xy<sup>${i}</sup>z = ${wHtml} este încă în L.`, `xy<sup>${i}</sup>z = ${wHtml} is still in L.`) }
          : { ok: true, msg: l(`Corect! xy<sup>${i}</sup>z = ${wHtml} ∉ L.`, `Correct! xy<sup>${i}</sup>z = ${wHtml} ∉ L.`) };
      },
      solution: l(`De exemplu i = <b>${best}</b>: xy<sup>${best}</sup>z ∉ L.`, `For example i = <b>${best}</b>: xy<sup>${best}</sup>z ∉ L.`),
      open: { page: 'pump' },
    };
  },
};

const chomskyType: ExerciseType = {
  id: 'chomsky-type',
  topic: 'chomsky',
  title: l('Stabilește tipul gramaticii', 'Find the grammar type'),
  desc: l('Cel mai restrictiv tip Chomsky (0–3) al unei gramatici.', 'The most restrictive Chomsky type (0–3) of a grammar.'),
  make() {
    const text = pick(CHOMSKY_TASKS);
    const r = parseGeneralGrammar(text);
    if (!r.ok) throw new Error(text);
    const { type } = classify(r.grammar);
    return {
      prompt: l(
        'Care este <b>cel mai restrictiv</b> tip din ierarhia Chomsky (0, 1, 2 sau 3) pe care îl are gramatica de mai jos?',
        'What is the <b>most restrictive</b> Chomsky type (0, 1, 2 or 3) that the grammar below has?',
      ),
      general: r.grammar,
      input: 'line',
      placeholder: '0–3',
      check(answer) {
        const n = Number(answer.trim());
        if (![0, 1, 2, 3].includes(n) || answer.trim() === '') return { ok: false, msg: l('Scrie 0, 1, 2 sau 3.', 'Type 0, 1, 2 or 3.') };
        if (n === type) return { ok: true, msg: l('Corect!', 'Correct!') };
        return {
          ok: false,
          msg:
            n > type
              ? l(`Gramatica nu respectă condițiile tipului ${n}.`, `The grammar does not satisfy the conditions of type ${n}.`)
              : l(`Gramatica respectă și condiții mai restrictive decât tipul ${n}.`, `The grammar also satisfies conditions stricter than type ${n}.`),
        };
      },
      solution: l(`Gramatica este de <b>tip ${type}</b>.`, `The grammar is of <b>type ${type}</b>.`),
      open: { page: 'chomsky', text },
    };
  },
};

const designCfg: ExerciseType = {
  id: 'design-cfg',
  topic: 'cfg',
  title: l('Scrie o gramatică', 'Write a grammar'),
  desc: l('O gramatică independentă de context pentru un limbaj dat.', 'A context-free grammar for a given language.'),
  make() {
    const task = pick(CFG_TASKS);
    const ref = wordSet(task.alphabet, 8, task.inL);
    return {
      prompt: l(
        `Scrie o <b>gramatică independentă de context</b> care generează ${task.label.ro}. Prima linie dă simbolul de start.`,
        `Write a <b>context-free grammar</b> generating ${task.label.en}. The first line gives the start symbol.`,
      ),
      input: 'grammar',
      placeholder: 'S -> …',
      check(answer) {
        const r = parseGrammar(answer);
        if (!r.ok) return { ok: false, msg: syntaxError, errors: r.errors };
        return (
          languageDiff(r.grammar, 8, ref) ?? {
            ok: true,
            msg: l('Corect! (verificat pe toate cuvintele de lungime ≤ 8)', 'Correct! (checked on every word of length ≤ 8)'),
          }
        );
      },
      solution: l('O soluție posibilă:', 'One possible solution:'),
      solutionText: task.solution,
      open: { page: 'cfg', text: task.solution },
    };
  },
};

const leftRec: ExerciseType = {
  id: 'left-rec',
  topic: 'lr',
  title: l('Elimină recursivitatea stângă', 'Remove left recursion'),
  desc: l('O gramatică echivalentă fără recursivitate stângă.', 'An equivalent grammar without left recursion.'),
  make() {
    const text = pick(LR_TASKS);
    const g = parseG(text);
    const ref = new Set(wordsUpTo(g, 7));
    const sol = eliminateLeftRecursion(g, true).result;
    return {
      prompt: l(
        'Scrie o gramatică <b>echivalentă</b> cu cea de mai jos, dar <b>fără recursivitate stângă</b> (nici directă, nici indirectă). Noile neterminale pot fi A\', Z1 etc.',
        "Write a grammar <b>equivalent</b> to the one below but <b>without left recursion</b> (neither direct nor indirect). New nonterminals can be A', Z1 etc.",
      ),
      grammar: g,
      input: 'grammar',
      placeholder: "S -> bS'\nS' -> aS' | ε",
      check(answer) {
        const r = parseGrammar(answer);
        if (!r.ok) return { ok: false, msg: syntaxError, errors: r.errors };
        if (isLeftRecursive(r.grammar)) return { ok: false, msg: l('Gramatica ta este încă recursivă la stânga.', 'Your grammar is still left recursive.') };
        return (
          languageDiff(r.grammar, 7, ref) ?? {
            ok: true,
            msg: l('Corect! Fără recursivitate stângă și același limbaj (cuvinte de lungime ≤ 7).', 'Correct! No left recursion and the same language (words of length ≤ 7).'),
          }
        );
      },
      solution: l('Algoritmul clasic (cu ε) dă:', 'The classic algorithm (with ε) gives:'),
      solutionText: serializeGrammar(sol),
      open: { page: 'lr', text },
    };
  },
};

const cnf: ExerciseType = {
  id: 'cnf',
  topic: 'cfg',
  title: l('Adu gramatica la FNC', 'Convert to CNF'),
  desc: l('Forma normală Chomsky: doar A → BC și A → a.', 'Chomsky normal form: only A → BC and A → a.'),
  make() {
    const text = pick(CNF_TASKS);
    const g = parseG(text);
    const ref = new Set(wordsUpTo(g, 7));
    const sol = normalize(g).cnf!;
    return {
      prompt: l(
        'Scrie o gramatică în <b>forma normală Chomsky</b> (doar producții A → BC și A → a) echivalentă cu cea de mai jos.',
        'Write a grammar in <b>Chomsky normal form</b> (only A → BC and A → a productions) equivalent to the one below.',
      ),
      grammar: g,
      input: 'grammar',
      placeholder: 'S -> AB\nA -> a\n…',
      check(answer) {
        const r = parseGrammar(answer);
        if (!r.ok) return { ok: false, msg: syntaxError, errors: r.errors };
        if (!isCNF(r.grammar))
          return {
            ok: false,
            msg: l('Gramatica nu este în FNC: există o producție care nu are forma A → BC sau A → a.', 'The grammar is not in CNF: some production is not of the form A → BC or A → a.'),
          };
        return (
          languageDiff(r.grammar, 7, ref) ?? {
            ok: true,
            msg: l('Corect! În FNC și același limbaj (cuvinte de lungime ≤ 7).', 'Correct! In CNF and the same language (words of length ≤ 7).'),
          }
        );
      },
      solution: l('Algoritmul dă:', 'The algorithm gives:'),
      solutionText: serializeGrammar(sol),
      open: { page: 'cfg', text },
    };
  },
};

const ambiguousWord: ExerciseType = {
  id: 'amb-word',
  topic: 'amb',
  title: l('Găsește un cuvânt ambiguu', 'Find an ambiguous word'),
  desc: l('Un cuvânt cu doi arbori de derivare diferiți.', 'A word with two different derivation trees.'),
  make() {
    const text = pick(AMB_TASKS);
    const g = parseG(text);
    const best = findAmbiguity(g, 7).word ?? '';
    return {
      prompt: l(
        'Gramatica de mai jos este ambiguă. Scrie un cuvânt care are <b>doi arbori de derivare diferiți</b>.',
        'The grammar below is ambiguous. Write a word that has <b>two different derivation trees</b>.',
      ),
      grammar: g,
      input: 'line',
      placeholder: 'w',
      check(answer) {
        const w = answer.replace(/\s+/g, '');
        if ([...w].length > 12) return { ok: false, msg: l('Alege un cuvânt mai scurt (≤ 12 simboluri).', 'Pick a shorter word (≤ 12 symbols).') };
        if (!derives(g, [...w])) return { ok: false, msg: l(`Gramatica nu generează ${shown(w)}.`, `The grammar does not generate ${shown(w)}.`) };
        return treesForWord(g, w).length >= 2
          ? { ok: true, msg: l(`Corect! ${shown(w)} are doi arbori de derivare.`, `Correct! ${shown(w)} has two derivation trees.`) }
          : { ok: false, msg: l(`${shown(w)} are un singur arbore de derivare.`, `${shown(w)} has only one derivation tree.`) };
      },
      solution: l(`Cel mai scurt exemplu: <b class="mono">${shown(best)}</b>`, `The shortest example: <b class="mono">${shown(best)}</b>`),
      open: { page: 'amb', text },
    };
  },
};

export const EXERCISES: ExerciseType[] = [chomskyType, epsClosure, nfaToDfa, designDfa, minCount, pumpI, designCfg, cnf, leftRec, ambiguousWord];
