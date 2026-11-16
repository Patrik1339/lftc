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
