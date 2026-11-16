# LFTC Vizual

**Live:** https://lftc-five.vercel.app/

Interactive study aid for *Limbaje formale și tehnici de compilare* (RO/EN):

- **Ierarhia Chomsky** — types 0–3 with an example grammar and derivation for each; a checker that finds the type of any grammar (left sides may be strings like `CB`), generates its words and derives a given word
- **BNF & EBNF** — metasymbols, EBNF → BNF conversion, worked examples (numbers, identifiers, lists, expressions, if) in BNF, EBNF and A → α form
- **ε-tranziții** — ε-closures and elimination of ε-transitions
- **AFN → AFD** — subset construction
- **Minimizare** — inaccessible states, completion, ≡k partition refinement, quotient AFD
- **Lema de pompare** — proof by contradiction with a random p, every split xyz checked
- **FNC & FNG** — ε-productions, renames, unproductive and inaccessible symbols, then Chomsky and Greibach normal form
- **Recursivitate stângă** — direct and indirect left recursion, with or without ε in the new productions
- **Ambiguitate** — bounded search for a word with two derivation trees; both trees, both leftmost and both rightmost derivations
- **Exersează** — multiple-choice quizzes on every topic (rounds of 10, with explanations), plus open-answer exercises generated at random and checked automatically: ε-closures, NFA → DFA, building a DFA or a CFG for a language, minimal DFA size, pumping, Chomsky type, CNF, left recursion, ambiguous words

```sh
npm install
npm run dev     # http://localhost:5173
npm test        # algorithm tests (language equivalence by brute force)
npm run build   # static site in dist/
```

Automaton text format:

```
start: q0
final: q2
q0 a q0 q1
q0 ε q2      # ε / eps / ε for the empty word
```

Grammar text format:

```
S -> aSb | AB | ε    # first line = start symbol; ε / eps / λ for the empty word
A -> aA | X_a B1     # nonterminals: uppercase letter + optional index (A1, X_a) or primes (S')
```
