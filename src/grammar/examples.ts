import type { Example } from '../automata/examples';

export const CFG_EXAMPLES: Example[] = [
  {
    name: 'ex.cfg.full',
    text: `# every step has something to do
S -> ASB | aB | C
A -> aA | ε
B -> SbS | A | bb
C -> cC
D -> d`,
  },
  {
    name: 'ex.cfg.anbn',
    text: `# aⁿbⁿ, n ≥ 0 (S appears on the right, so a new start symbol is needed)
S -> aSb | ε`,
  },
  {
    name: 'ex.cfg.paren',
    text: `# balanced parentheses
S -> SS | (S) | ε`,
  },
  {
    name: 'ex.cfg.expr',
    text: `# arithmetic expressions (left recursive)
E -> E+T | T
T -> T*F | F
F -> (E) | a`,
  },
  {
    name: 'ex.cfg.cnfIndirect',
    text: `# already in FNC; indirect left recursion S ⇒ AB ⇒ BSB ⇒ SASB
S -> AB | a
A -> BS | b
B -> SA | a`,
  },
];

export const LR_EXAMPLES: Example[] = [
  {
    name: 'ex.lr.expr',
    text: `# direct left recursion
E -> E+T | T
T -> T*F | F
F -> (E) | a`,
  },
  {
    name: 'ex.lr.indirect',
    text: `# indirect: S ⇒ Aa ⇒ Sda
S -> Aa | b
A -> Ac | Sd | c`,
  },
  {
    name: 'ex.lr.multi',
    text: `# several recursive alternatives
A -> Aa | Ab | c | d`,
  },
  {
    name: 'ex.lr.cycle3',
    text: `# indirect through three nonterminals
A -> Ba | a
B -> Cb | b
C -> Ac | c`,
  },
  {
    name: 'ex.lr.epsilon',
    text: `# has ε-productions: clean the grammar first
S -> Sa | AB
A -> b | ε
B -> c | ε`,
  },
];

export const AMB_EXAMPLES: Example[] = [
  {
    name: 'ex.amb.expr',
    text: `# no precedence, no associativity
E -> E+E | E*E | (E) | a`,
  },
  {
    name: 'ex.amb.dangling',
    text: `# dangling else: i = if, e = else
S -> iS | iSeS | a`,
  },
  {
    name: 'ex.amb.eps',
    text: `# "a" can come from A or from B
S -> AB
A -> a | ε
B -> a | ε`,
  },
  {
    name: 'ex.amb.concat',
    text: `# SS makes the split of a concatenation ambiguous
S -> SS | (S) | ()`,
  },
  {
    name: 'ex.amb.inherent',
    text: `# {aⁱbʲcᵏ | i = j ≥ 1 or j = k ≥ 1}: inherently ambiguous (abc is in both parts)
S -> PC | AQ
P -> aPb | ab
C -> cC | ε
A -> aA | ε
Q -> bQc | bc`,
  },
  {
    name: 'ex.amb.exprFixed',
    text: `# unambiguous: precedence through levels, left associativity
E -> E+T | T
T -> T*F | F
F -> (E) | a`,
  },
];

/** Grammars of every Chomsky type; the first four are the per-type examples shown on the hierarchy page. */
export const CHOMSKY_EXAMPLES: Example[] = [
  {
    name: 'ex.ch.t3',
    text: `# type 3, right-linear: words over {a, b} ending in b
S -> aS | bS | b`,
  },
  {
    name: 'ex.ch.t2',
    text: `# type 2: { aⁿbⁿ | n ≥ 1 }
S -> aSb | ab`,
  },
  {
    name: 'ex.ch.t1',
    text: `# type 1 (monotone): { aⁿbⁿcⁿ | n ≥ 1 }
S -> aSBC | aBC
CB -> BC
aB -> ab
bB -> bb
bC -> bc
cC -> cc`,
  },
  {
    name: 'ex.ch.t0',
    text: `# type 0: { a^(2ⁿ) | n ≥ 1 }, C doubles every a it passes
S -> ACaB
Ca -> aaC
CB -> DB | E
aD -> Da
AD -> AC
aE -> Ea
AE -> ε`,
  },
  {
    name: 'ex.ch.t3left',
    text: `# type 3, left-linear: words over {a, b} starting with a
S -> Sa | Sb | a`,
  },
  {
    name: 'ex.ch.mixed',
    text: `# every rule is linear, but right- and left-linear are mixed: { aⁿbⁿ | n ≥ 1 } is not regular
S -> aA | ab
A -> Sb`,
  },
  {
    name: 'ex.ch.t2eps',
    text: `# type 2 with an ε-production: { aⁿbⁿ | n ≥ 0 }
S -> aSb | ε`,
  },
  {
    name: 'ex.ch.t1eps',
    text: `# S -> ε is allowed in type 1 when S never appears on a right-hand side
S -> ε | T
T -> aTb | ab`,
  },
];
