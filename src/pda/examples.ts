import type { Example } from '../automata/examples';

export const PDA_EXAMPLES: Example[] = [
  {
    name: 'ex.pda.anbn',
    text: `# L = { aⁿbⁿ | n ≥ 1 }, acceptance by final state
start: q0
stack: Z
final: q2
q0 a Z -> q0 AZ     # push one A for every a
q0 a A -> q0 AA
q0 b A -> q1 ε      # pop one A for every b
q1 b A -> q1 ε
q1 ε Z -> q2 Z      # only Z left: as many b as a`,
  },
  {
    name: 'ex.pda.wcw',
    text: `# L = { w c wᴿ | w ∈ {a,b}* }, empty stack, deterministic
start: q0
stack: Z
accept: empty
q0 a Z -> q0 AZ
q0 a A -> q0 AA
q0 a B -> q0 AB
q0 b Z -> q0 BZ
q0 b A -> q0 BA
q0 b B -> q0 BB
q0 c Z -> q1 Z      # the middle marker
q0 c A -> q1 A
q0 c B -> q1 B
q1 a A -> q1 ε
q1 b B -> q1 ε
q1 ε Z -> q1 ε`,
  },
  {
    name: 'ex.pda.wwr',
    text: `# L = { w wᴿ | w ∈ {a,b}* }, empty stack, nondeterministic:
# the ε-moves from q0 to q1 guess where the middle is
start: q0
stack: Z
accept: empty
q0 a Z -> q0 AZ
q0 a A -> q0 AA
q0 a B -> q0 AB
q0 b Z -> q0 BZ
q0 b A -> q0 BA
q0 b B -> q0 BB
q0 ε Z -> q1 Z
q0 ε A -> q1 A
q0 ε B -> q1 B
q1 a A -> q1 ε
q1 b B -> q1 ε
q1 ε Z -> q1 ε`,
  },
  {
    name: 'ex.pda.paren',
    text: `# balanced parentheses, empty stack
start: q
stack: Z
accept: empty
q ( Z -> q XZ
q ( X -> q XX
q ) X -> q ε
q ε Z -> q ε`,
  },
  {
    name: 'ex.pda.equal',
    text: `# as many a as b (in any order), final state
# the stack holds the surplus: A…A if more a, B…B if more b
start: q0
stack: Z
final: q1
q0 a Z -> q0 AZ
q0 a A -> q0 AA
q0 a B -> q0 ε
q0 b Z -> q0 BZ
q0 b B -> q0 BB
q0 b A -> q0 ε
q0 ε Z -> q1 Z`,
  },
  {
    name: 'ex.pda.cfg',
    text: `# built from the grammar S → aSb | ε (expand / match), empty stack
start: q
stack: S
accept: empty
δ(q, ε, S) = {(q, aSb), (q, ε)}
δ(q, a, a) = {(q, ε)}
δ(q, b, b) = {(q, ε)}`,
  },
];
