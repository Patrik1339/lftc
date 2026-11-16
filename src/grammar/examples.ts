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
