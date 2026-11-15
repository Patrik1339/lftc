# LFTC Vizual

**Live:** https://lftc-five.vercel.app/

Interactive study aid for *Limbaje formale și tehnici de compilare* (RO/EN):

- **ε-tranziții** — ε-closures and elimination of ε-transitions
- **AFN → AFD** — subset construction
- **Minimizare** — inaccessible states, completion, ≡k partition refinement, quotient AFD
- **Lema de pompare** — proof by contradiction with a random p, every split xyz checked

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
