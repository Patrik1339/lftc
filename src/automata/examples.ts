export interface Example {
  /** i18n key for the example name. */
  name: string;
  text: string;
}

export const EPSILON_EXAMPLES: Example[] = [
  {
    name: 'ex.epsilon.abc',
    text: `# a*b*c*
start: q0
final: q2
q0 a q0
q0 ε q1
q1 b q1
q1 ε q2
q2 c q2`,
  },
  {
    name: 'ex.epsilon.union',
    text: `# (ab)* ∪ a*
start: q0
final: q1, q3
q0 ε q1 q3
q1 a q2
q2 b q1
q3 a q3`,
  },
  {
    name: 'ex.epsilon.chain',
    text: `# a(b|ε)c
start: q0
final: q4
q0 a q1
q1 b q2
q1 ε q2
q2 ε q3
q3 c q4`,
  },
];

export const NFA_EXAMPLES: Example[] = [
  {
    name: 'ex.nfa.endsAb',
    text: `# words over {a,b} ending in "ab"
start: q0
final: q2
q0 a q0 q1
q0 b q0
q1 b q2`,
  },
  {
    name: 'ex.nfa.thirdLast',
    text: `# the third symbol from the end is "a"
start: q0
final: q3
q0 a q0 q1
q0 b q0
q1 a q2
q1 b q2
q2 a q3
q2 b q3`,
  },
  {
    name: 'ex.nfa.aaOrBb',
    text: `# contains "aa" or "bb"
start: q0
final: q3
q0 a q0 q1
q0 b q0 q2
q1 a q3
q2 b q3
q3 a q3
q3 b q3`,
  },
  {
    name: 'ex.nfa.epsilon',
    text: `# AFN with ε-transitions: (a|b)*abb
start: q0
final: q4
q0 ε q1
q1 a q1 q2
q1 b q1
q2 b q3
q3 b q4`,
  },
];

export const DFA_EXAMPLES: Example[] = [
  {
    name: 'ex.dfa.hopcroft',
    text: `# 8 states, D is inaccessible; minimal AFD has 5 states
start: A
final: C
A 0 B
A 1 F
B 0 G
B 1 C
C 0 A
C 1 C
D 0 C
D 1 G
E 0 H
E 1 F
F 0 C
F 1 G
G 0 G
G 1 E
H 0 G
H 1 C`,
  },
  {
    name: 'ex.dfa.evenA',
    text: `# even number of a's (4 states -> 2)
start: q0
final: q0, q2
q0 a q1
q0 b q2
q1 a q0
q1 b q3
q2 a q3
q2 b q0
q3 a q2
q3 b q1`,
  },
  {
    name: 'ex.dfa.partial',
    text: `# words starting with "ab" (partial δ, needs a sink state)
start: q0
final: q2, q3
q0 a q1
q1 b q2
q2 a q3
q2 b q3
q3 a q2
q3 b q3`,
  },
];
