export const en = {
  'app.title': 'LFTC Visual',
  'app.subtitle': 'Formal Languages & Compiler Techniques — step by step',
  'nav.home': 'Home',
  'nav.epsilon': 'ε-transitions',
  'nav.nfa': 'NFA → DFA',
  'nav.min': 'Minimization',
  'nav.pump': 'Pumping lemma',

  'home.intro': 'Pick a topic. Each page has a short theory refresher, ready-made examples, and an animated step-by-step run of the algorithm on any automaton you type in.',
  'home.epsilon': 'Remove ε-transitions using ε-closures, keeping the accepted language unchanged.',
  'home.nfa': 'Turn a nondeterministic automaton into a deterministic one with the subset construction.',
  'home.min': 'Remove inaccessible states and merge equivalent states to get the minimal DFA.',
  'home.pump': 'Prove that a language is not regular, by contradiction, with a random p.',
  'home.flow': 'Typical pipeline: NFA-ε → (remove ε) → NFA → (subsets) → DFA → (minimize) → minimal DFA. Each page has a button to send its result to the next step.',

  'graph.original': 'Initial automaton',
  'graph.building': 'Automaton under construction',
  'graph.result': 'Result (without ε)',
  'graph.afn': 'NFA',
  'graph.afdBuilding': 'DFA under construction',
  'graph.afd': 'Resulting DFA',
  'graph.complete': 'Accessible, complete DFA',
  'graph.minimal': 'Minimal DFA',

  'col.state': 'State',
  'col.symbol': 'Symbol',
  'col.final': 'Final?',
  'col.dfaState': 'DFA state',
  'col.class': 'Class',
  'col.states': 'States',

  'parse.oneStart': 'exactly one start state is required',
  'parse.unknownHeader': 'unknown header "{name}" (use start:, final: or states:)',
  'parse.badTransition': 'a transition is written as: state symbol target(s)',
  'parse.empty': 'the automaton has no states',
  'parse.noStart': 'missing "start: ..." line',
  'parse.line': 'Line {line}',

  'editor.title': 'Automaton',
  'editor.examples': 'Example…',
  'editor.help': 'Format: <code>start: q0</code>, <code>final: q1, q2</code>, then one line per transition: <code>q0 a q1 q2</code>. Use <code>ε</code> or <code>eps</code> for the empty word, <code>#</code> for comments.',
  'stepper.first': 'First',
  'stepper.prev': 'Previous',
  'stepper.next': 'Next',
  'stepper.last': 'Last',
  'stepper.play': 'Play',
  'stepper.pause': 'Pause',
  'stepper.step': 'Step {i} of {n}',
  'stepper.keys': 'Tip: use ← → arrow keys',
  'tester.title': 'Test a word',
  'tester.placeholder': 'e.g. abba (empty = ε)',
  'tester.accept': 'accepted',
  'tester.reject': 'rejected',
  'result.title': 'Result (text)',
  'result.copy': 'Copy',
  'result.copied': 'Copied!',
  'theory.title': 'Theory',

  'ex.epsilon.abc': 'a*b*c* (ε-chain)',
  'ex.epsilon.union': '(ab)* ∪ a*',
  'ex.epsilon.chain': 'a(b|ε)c',
  'ex.nfa.endsAb': 'Ends in "ab"',
  'ex.nfa.thirdLast': 'Third symbol from the end is "a" (8 subsets)',
  'ex.nfa.aaOrBb': 'Contains "aa" or "bb"',
  'ex.nfa.epsilon': '(a|b)*abb with ε',
  'ex.dfa.hopcroft': 'Classic 8-state DFA (Hopcroft)',
  'ex.dfa.evenA': 'Even number of a\'s',
  'ex.dfa.partial': 'Starts with "ab" (partial δ)',

  // ε-elimination
  'epsilon.goto.nfa': 'Convert result to DFA →',
  'epsilon.none': 'This automaton has no ε-transitions; the algorithm only recomputes the same transitions. Try an example with ε.',
  'epsilon.tbl.closures': 'ε-closures',
  'epsilon.tbl.delta': 'New transitions',
  'epsilon.s.intro.t': 'The initial automaton',
  'epsilon.s.intro.b': 'The automaton has {n} ε-transition(s) (dashed / highlighted). We will replace them with ordinary transitions so that the accepted language stays the same.',
  'epsilon.s.closure.t': 'ε-closure of {q}',
  'epsilon.s.closure.b': 'ε-cl({q}) is the set of states reachable from {q} using only ε-transitions (including {q} itself): ε-cl({q}) = {cl}.',
  'epsilon.s.closure.b1': 'No ε-transition leaves {q}, so ε-cl({q}) = {cl}.',
  'epsilon.s.delta.t': "δ'({q}, {a})",
  'epsilon.s.delta.b': "δ'({q}, {a}) = ε-cl(δ(ε-cl({q}), {a})) = ε-cl(δ({cl}, {a})) = ε-cl({mid}) = {fin}. We add these transitions to the new automaton.",
  'epsilon.s.delta.empty': "δ'({q}, {a}) = ε-cl(δ({cl}, {a})) = ε-cl({mid}) = ∅, so no transition is added.",
  'epsilon.s.finals.t': 'Final states',
  'epsilon.s.finals.b': "A state q becomes final if ε-cl(q) contains a final state. F = {F}, newly final: {added}. So F' = {F2}.",
  'epsilon.s.finals.none': "A state q is final if ε-cl(q) contains a final state. No new final states appear: F' = {F2}.",
  'epsilon.s.unreach.t': 'Remove inaccessible states',
  'epsilon.s.unreach.b': 'Without ε-transitions, the states {list} can no longer be reached from the start state, so we can delete them.',
  'epsilon.s.done.t': 'Done',
  'epsilon.s.done.b': 'The automaton on the right has no ε-transitions and accepts exactly the same language as the initial one.',

  // subset construction
  'subset.goto.min': 'Minimize this DFA →',
  'subset.includeEmpty': 'Keep ∅ as a sink state (complete DFA)',
  'subset.tbl': 'Subset table',
  'subset.s.intro.t': 'The NFA',
  'subset.s.intro.b': 'Every DFA state will be a set of NFA states: "all the states the NFA could be in at the same time". We only build the subsets that are actually reachable.',
  'subset.s.intro.epsilon': 'This NFA has ε-transitions. Every DFA state will be a <b>ε-closed</b> set of NFA states: after each move we also add everything reachable by ε.',
  'subset.s.start.t': 'Start state',
  'subset.s.start.b': 'The DFA starts in the set containing only the NFA start state: {S}.',
  'subset.s.start.epsilon': 'The DFA starts in ε-cl({q0}) = {S}.',
  'subset.s.move.t': 'From {S} with {a}',
  'subset.s.move.new': '{parts}. The union is {mv}. {closure} The set {T} is <b>new</b>, so it becomes a new DFA state and is added to the table.',
  'subset.s.move.old': '{parts}. The union is {mv}. {closure} The set {T} already exists, so we only add the transition {S} —{a}→ {T}.',
  'subset.s.move.skip': '{parts}. The union is empty, so there is no transition (we chose not to draw the sink state ∅).',
  'subset.s.finals.t': 'Final states',
  'subset.s.finals.b': 'A DFA state is final if it contains at least one NFA final state from {F}. Final states: {F2}.',
  'subset.s.done.t': 'Done',
  'subset.s.done.b': 'The DFA has {n} states and accepts the same language as the NFA.',

  // minimization
  'min.goto.input': 'Use the resulting DFA as input',
  'min.notDfa': 'Minimization needs a deterministic automaton (no ε, at most one target per state and symbol).',
  'min.convert': 'Convert it to a DFA first →',
  'min.s.intro.t': 'The initial DFA',
  'min.s.intro.b': 'We minimize in 3 phases: (1) remove inaccessible states, (2) complete δ with a sink state if needed, (3) merge equivalent states by refining the partitions ≡0, ≡1, ….',
  'min.s.reach.t': 'Accessible states',
  'min.s.reach.b': 'Starting from the start state, we reach {reach}. The states {list} are inaccessible and are removed.',
  'min.s.reach.none': 'All states are accessible from the start state: {reach}. Nothing to remove.',
  'min.s.complete.t': 'Complete the DFA',
  'min.s.complete.b': 'Some transitions are missing ({list}). We add a sink (dead) state {sink} that loops on every symbol and send all missing transitions there.',
  'min.s.eq0.t': 'Equivalence ≡0',
  'min.s.eq0.b': 'Initially we only separate final states from non-final ones: {classes}. (The empty word distinguishes them.)',
  'min.s.iter.t': 'From ≡{k} to ≡{k1}',
  'min.s.iter.b': 'Two states stay in the same class only if they were in the same ≡{k} class <b>and</b> for every symbol go to states in the same ≡{k} class. Classes split: ≡{k1}: {classes}.',
  'min.s.iter.stable': 'No class splits: ≡{k1} = ≡{k}. The partition is stable, so these are the classes of equivalent states: {classes}.',
  'min.s.quotient.t': 'The minimal DFA',
  'min.s.quotient.b': 'Each class becomes one state; the transition of a class is taken from any of its states. From {n} states we got {m}.',

  // pumping
  'pump.general': 'Proof (for an arbitrary p)',
  'pump.g.lbl.assume': 'Assumption',
  'pump.g.lbl.word': 'Choosing w',
  'pump.g.lbl.lemma': 'Lemma conditions',
  'pump.g.lbl.split': 'Shape of the split',
  'pump.g.lbl.pump': 'Pumping',
  'pump.g.lbl.contra': 'Contradiction',
  'pump.g.lbl.end': 'Conclusion',
  'pump.g.assume': 'Assume, by contradiction, that L is regular. Let p ≥ 1 be the constant given by the pumping lemma. We do not know the value of p, so the argument must work for <b>every</b> p.',
  'pump.g.word': 'Choose {w}.',
  'pump.g.lemma': 'By the lemma, there is a split w = xyz such that: <b>(1)</b> |xy| ≤ p, <b>(2)</b> |y| ≥ 1, <b>(3)</b> xy<sup>i</sup>z ∈ L for every i ≥ 0. We do not know which split it is, so we work with an arbitrary one, using only (1) and (2).',
  'pump.g.end': 'The contradiction holds for an arbitrary split satisfying (1) and (2), so the assumption is false: <b>L is not regular</b>. ∎',
  'pump.example': 'Check on a concrete example',
  'pump.example.b': 'The proof above holds for every p. To see it "in action", we check it on a randomly generated p.',
  'pump.lang': 'Language',
  'pump.newP': 'New random p',
  'pump.s1': '1. A concrete p',
  'pump.s1.b': 'For illustration we take <b>p = {p}</b> (generated at random).',
  'pump.s2': '2. Choose a word w ∈ L with |w| ≥ p',
  'pump.s2.b': 'We choose w = {w}, with |w| = {len} ≥ {p}.',
  'pump.s3': '3. Any split w = xyz with |xy| ≤ p, |y| ≥ 1',
  'pump.s3.b': 'The lemma only says <i>some</i> split exists, so we must defeat <b>every</b> possible one. Try them with the sliders:',
  'pump.xlen': '|x|',
  'pump.ylen': '|y|',
  'pump.s4': '4. Pump: choose i',
  'pump.s4.b': 'The lemma claims xy<sup>i</sup>z ∈ L for every i ≥ 0. Find an i for which it fails:',
  'pump.in': '∈ L — this i does not give a contradiction, try another.',
  'pump.out': '∉ L — contradiction for this split!',
  'pump.hint': 'Hint: i = {i} works for this split.',
  'pump.s5': '5. All splits',
  'pump.s5.b': 'There are {n} possible splits. For each of them there is an i with xy<sup>i</sup>z ∉ L:',
  'pump.col.i': 'i',
  'pump.col.pumped': 'xyⁱz',

  'theory.epsilon': `
<p>An <b>NFA-ε</b> may change state without reading a symbol. To eliminate ε-transitions we use the <b>ε-closure</b>:</p>
<p class="formula">ε-cl(q) = { r | r is reachable from q using only ε-transitions } (q ∈ ε-cl(q))</p>
<p>The new automaton A' = (Q, Σ, δ', q<sub>0</sub>, F') has the same states and:</p>
<ul>
<li class="formula">δ'(q, a) = ε-cl( δ( ε-cl(q), a ) )</li>
<li class="formula">F' = { q ∈ Q | ε-cl(q) ∩ F ≠ ∅ }</li>
</ul>
<p>Intuition: a step of A' on <i>a</i> = "any number of ε-steps, then one <i>a</i>-step, then any number of ε-steps". A state becomes final if it can reach a final state by ε alone. Finally, states that became inaccessible can be removed.</p>`,
  'theory.nfa': `
<p>For every NFA there is an equivalent DFA (<b>subset construction</b>). A DFA state is a <b>set</b> of NFA states.</p>
<ul>
<li>Start state: {q<sub>0</sub>} (or ε-cl(q<sub>0</sub>) if there are ε-transitions).</li>
<li class="formula">δ<sub>D</sub>(S, a) = ⋃<sub>q ∈ S</sub> δ(q, a)   (followed by ε-cl if needed)</li>
<li>Final states: all sets S with S ∩ F ≠ ∅.</li>
</ul>
<p>We build only the <b>reachable</b> subsets, with a work list: take an unprocessed set, compute its transition on each symbol, add new sets to the list. In the worst case there are 2<sup>|Q|</sup> subsets. The empty set ∅ is a sink state; it can be omitted if a partial DFA is allowed.</p>`,
  'theory.min': `
<p>A DFA is <b>minimal</b> if no DFA with fewer states accepts the same language. The minimal DFA is unique (up to renaming states).</p>
<ol>
<li><b>Inaccessible states</b> — those not reachable from q<sub>0</sub> — are removed.</li>
<li>If δ is partial, we add a <b>sink</b> state so that δ is total.</li>
<li><b>Equivalent states</b>: p ≡ q if for every word w, δ(p, w) ∈ F ⟺ δ(q, w) ∈ F. We compute ≡ by successive refinement:
  <ul>
  <li class="formula">≡<sub>0</sub>: {F, Q ∖ F}</li>
  <li class="formula">p ≡<sub>k+1</sub> q ⟺ p ≡<sub>k</sub> q and δ(p, a) ≡<sub>k</sub> δ(q, a) for every a ∈ Σ</li>
  </ul>
  We stop when ≡<sub>k+1</sub> = ≡<sub>k</sub>.</li>
<li>Each equivalence class becomes one state of the minimal DFA.</li>
</ol>`,
  'theory.pump': `
<p><b>Pumping lemma for regular languages.</b> If L is regular, then there exists p ≥ 1 such that every w ∈ L with |w| ≥ p can be written as w = xyz with:</p>
<ol>
<li>|xy| ≤ p,</li>
<li>|y| ≥ 1,</li>
<li>xy<sup>i</sup>z ∈ L for every i ≥ 0.</li>
</ol>
<p><b>Proof template (by contradiction)</b> — think of it as a game against an adversary:</p>
<ol>
<li>Assume L is regular; the adversary picks p.</li>
<li><b>You</b> pick a word w ∈ L with |w| ≥ p (cleverly, so that xy falls in a useful part).</li>
<li>The adversary picks <b>any</b> split w = xyz with |xy| ≤ p, |y| ≥ 1 — you must handle all of them.</li>
<li><b>You</b> pick i ≥ 0 such that xy<sup>i</sup>z ∉ L. Contradiction ⇒ L is not regular.</li>
</ol>
<p>Note: the lemma is a necessary condition only. It can show a language is <i>not</i> regular, never that it is.</p>`,
  // grammars (shared)
  'nav.cfg': 'CNF & GNF',
  'nav.lr': 'Left recursion',
  'home.cfg': 'Bring any context-free grammar to Chomsky and then Greibach normal form: ε-productions, renames, useless symbols, CNF, GNF.',
  'home.lr': 'Detect direct and indirect left recursion and remove it with the classic substitution algorithm.',
  'home.flowCfg': 'For grammars: grammar → (ε, renames, unproductive, inaccessible) → reduced grammar → CNF → GNF.',
  'gparse.noArrow': 'a production is written as: A -> α | β',
  'gparse.badLhs': '"{name}" is not a nonterminal (nonterminals start with an uppercase letter)',
  'gparse.empty': 'the grammar has no productions',
  'gparse.badStart': 'the start symbol "{name}" has no productions',
  'geditor.title': 'Grammar',
  'geditor.help': 'One line per nonterminal: <code>S -> aSb | AB | ε</code>. Nonterminals are uppercase letters, optionally indexed (<code>A1</code>, <code>X_a</code>, <code>S\'</code>); every other character is a terminal. Use <code>ε</code>, <code>eps</code> or <code>λ</code> for the empty word. The first line gives the start symbol.',
  'gview.original': 'Initial grammar',
  'gview.building': 'Grammar under construction',
  'gview.before': 'Before',
  'gview.after': 'After',
  'gview.cnf': 'Chomsky normal form (CNF)',
  'gview.gnf': 'Greibach normal form (GNF)',
  'col.prod': 'Production',
  'col.newProds': 'New productions',
  'col.copied': 'Copied productions',
  'col.terminal': 'Terminal',
  'col.newNt': 'New nonterminal',
  'col.replacedBy': 'Replaced by',
  'gtester.placeholder': 'e.g. aabb (empty = ε)',
  'gtester.yes': 'generated',
  'gtester.no': 'not generated',
  'gtester.sample': 'Words of length ≤ {n} (initial grammar)',
  'gtester.same': 'all grammars generate exactly these words',
  'gtester.differ': 'the grammars generate different short words',
  'ex.cfg.full': 'Complete example (every step does something)',
  'ex.cfg.anbn': 'aⁿbⁿ (S → aSb | ε)',
  'ex.cfg.paren': 'Balanced parentheses',
  'ex.cfg.expr': 'Arithmetic expressions',
  'ex.cfg.cnfIndirect': 'Already in CNF, indirect left recursion',
  'ex.lr.expr': 'Expressions E, T, F (direct)',
  'ex.lr.indirect': 'Indirect: S → Aa, A → Sd',
  'ex.lr.multi': 'Several recursive alternatives',
  'ex.lr.cycle3': 'Indirect through 3 nonterminals',
  'ex.lr.epsilon': 'With ε-productions (needs cleaning)',

  // CNF & GNF
  'cfg.emptyLang': 'The start symbol is unproductive, so <b>L(G) = ∅</b>: there is nothing to bring to normal form.',
  'cfg.tooLarge': 'The Greibach form of this grammar has more than {n} productions, so we stop after CNF. (GNF can be exponentially larger.)',
  'cfg.goto.lr': 'Remove left recursion from the reduced grammar →',
  'cfg.ph.eps': 'ε-productions',
  'cfg.ph.unit': 'Renames',
  'cfg.ph.prod': 'Unproductive',
  'cfg.ph.acc': 'Inaccessible',
  'cfg.ph.cnf': 'CNF',
  'cfg.ph.gnf': 'GNF',
  'cfg.tbl.nullable': 'Nullable nonterminals (A ⇒* ε)',
  'cfg.tbl.unit': 'Renaming sets',
  'cfg.tbl.productive': 'Productive nonterminals',
  'cfg.tbl.accessible': 'Accessible symbols',
  'cfg.tbl.order': 'Order of the nonterminals',

  'cfg.eps.none.t': '1. ε-productions',
  'cfg.eps.none.b': 'The grammar has no ε-productions. Nothing to do in this step.',
  'cfg.eps.onlyStart.b': 'The only ε-production is {S} → ε and {S} does not appear on any right-hand side, which is allowed. Nothing to do in this step.',
  'cfg.eps.null.t': '1. Nullable nonterminals: N{i}',
  'cfg.eps.null0.b': 'We first find the nonterminals that derive ε. We start with those having an ε-production (struck through — they will disappear): N<sub>0</sub> = {A | A → ε} = {N}.',
  'cfg.eps.nullI.b': 'N<sub>{i}</sub> = N<sub>{i1}</sub> ∪ {A | A → α, α ∈ N<sub>{i1}</sub>*}: a nonterminal is nullable if some right-hand side consists only of nullable nonterminals. N<sub>{i}</sub> = {N}.',
  'cfg.eps.stable.t': '1. The set of nullable nonterminals',
  'cfg.eps.stable.b': 'N<sub>{k1}</sub> = N<sub>{k}</sub>, so the iteration stops. Nullable nonterminals: N<sub>ε</sub> = {N}.',
  'cfg.eps.prod.t': '1. New productions for {A}',
  'cfg.eps.prod.b': 'For every production of {A} we add all the variants obtained by <b>deleting any subset of the occurrences</b> of nullable symbols {N} (but never the empty variant). ε-productions are dropped.',
  'cfg.eps.start.t': '1. Is ε in the language?',
  'cfg.eps.start.new': 'The start symbol {S} is nullable, so ε ∈ L(G) and we must keep it. Since {S} appears on right-hand sides, we add a new start symbol {S1} → {S} | ε ({S1} never appears on a right-hand side).',
  'cfg.eps.start.keep': 'The start symbol {S} is nullable, so ε ∈ L(G). {S} does not appear on any right-hand side, so we simply keep {S} → ε.',
  'cfg.eps.done.t': '1. Without ε-productions',
  'cfg.eps.done.b': 'The new grammar has no ε-productions (except possibly S → ε, with S not on a right-hand side) and generates the same language.',

  'cfg.unit.none.t': '2. Renames',
  'cfg.unit.none.b': 'There is no rename (production of the form A → B). Nothing to do in this step.',
  'cfg.unit.sets.t': '2. Renaming sets N<sub>A</sub>',
  'cfg.unit.sets.b': 'A <b>rename</b> is a production A → B with B a nonterminal (struck through). For every A we compute N<sub>A</sub> = {B | A ⇒* B using renames only}: start with {A} and keep adding C whenever B → C with B already in the set.',
  'cfg.unit.prod.t': '2. Productions of {A}',
  'cfg.unit.prod.b': 'N<sub>A</sub> = {NA}. {A} keeps its own non-rename productions and receives every non-rename production of each B ∈ N<sub>A</sub>: A → α whenever B → α is not a rename.',
  'cfg.unit.done.t': '2. Without renames',
  'cfg.unit.done.b': 'All renames have been replaced by the productions they lead to.',

  'cfg.prod.iter.t': '3. Productive nonterminals: N{i}',
  'cfg.prod.iter1.b': 'A nonterminal is <b>productive</b> if it derives a word of terminals. N<sub>0</sub> = ∅ and N<sub>1</sub> = {A | A → x, x ∈ Σ*} = {N}.',
  'cfg.prod.iterI.b': 'N<sub>{i}</sub> = {A | A → α, α ∈ (N<sub>{i1}</sub> ∪ Σ)*}: right-hand sides with only terminals and already productive nonterminals. N<sub>{i}</sub> = {N}.',
  'cfg.prod.none.t': '3. All nonterminals are productive',
  'cfg.prod.none.b': 'The iteration is stable and N = {N} contains every nonterminal. Nothing to remove.',
  'cfg.prod.remove.t': '3. Remove unproductive symbols',
  'cfg.prod.remove.b': 'The iteration is stable: N = {N}. The unproductive nonterminals {bad} never finish a derivation, so we remove them together with <b>every production that contains them</b>.',
  'cfg.prod.empty.t': '3. The language is empty',
  'cfg.prod.empty.b': 'The start symbol {S} is not productive (N = {N}), so L(G) = ∅. The algorithm stops.',

  'cfg.acc.iter.t': '4. Accessible symbols: V{i}',
  'cfg.acc.iter0.b': 'A symbol is <b>accessible</b> if it appears in some sentential form derived from {S}. We start with V<sub>0</sub> = {V}.',
  'cfg.acc.iterI.b': 'V<sub>{i}</sub> = V<sub>{i1}</sub> ∪ {X | A → αXβ, A ∈ V<sub>{i1}</sub>}: we add every symbol from the right-hand sides of accessible nonterminals. V<sub>{i}</sub> = {V}.',
  'cfg.acc.none.t': '4. All symbols are accessible',
  'cfg.acc.none.b': 'The iteration is stable and every symbol is accessible. Nothing to remove. The grammar is now <b>reduced</b> (proper).',
  'cfg.acc.remove.t': '4. Remove inaccessible symbols',
  'cfg.acc.remove.b': 'V = {V}. The symbols {bad} are never reached from the start symbol, so we remove them and their productions. The grammar is now <b>reduced</b> (proper).',

  'cfg.cnf.intro.t': '5. Towards Chomsky normal form',
  'cfg.cnf.intro.b': 'In CNF every production is A → BC or A → a (plus S → ε when needed). The marked productions do not have this shape: they contain terminals next to other symbols, or have more than two symbols.',
  'cfg.cnf.intro.ok': 'Every production already has the form A → BC or A → a (plus possibly S → ε). The grammar is already in CNF.',
  'cfg.cnf.term.t': '5a. Terminals in long productions',
  'cfg.cnf.term.b': 'In every right-hand side of length ≥ 2 we replace each terminal a by a new nonterminal X<sub>a</sub> and add X<sub>a</sub> → a.',
  'cfg.cnf.long.t': '5b. Break up long productions of {A}',
  'cfg.cnf.long.b': 'A production A → B<sub>1</sub>B<sub>2</sub>…B<sub>k</sub> with k ≥ 3 becomes the chain A → B<sub>1</sub>Y<sub>1</sub>, Y<sub>1</sub> → B<sub>2</sub>Y<sub>2</sub>, …, Y<sub>k-2</sub> → B<sub>k-1</sub>B<sub>k</sub>, with new nonterminals Y (identical tails reuse the same Y).',
  'cfg.cnf.done.t': '5. The grammar in CNF',
  'cfg.cnf.done.b': 'All productions now have the form A → BC or A → a (and possibly S → ε).',

  'cfg.gnf.intro.t': '6. Towards Greibach normal form',
  'cfg.gnf.intro.b': 'In GNF every production is A → aα with a ∈ Σ and α ∈ N*. We start from the CNF and number its {n} nonterminals A<sub>1</sub>, …, A<sub>n</sub>. Goal of the first pass: every production A<sub>i</sub> → A<sub>j</sub>γ has j &gt; i.',
  'cfg.gnf.intro.eps': 'In GNF every production is A → aα with a ∈ Σ and α ∈ N*. We set {S} → ε aside (we add it back at the end) and number the {n} nonterminals A<sub>1</sub>, …, A<sub>n</sub>. Goal of the first pass: every production A<sub>i</sub> → A<sub>j</sub>γ has j &gt; i.',
  'cfg.gnf.sub.t': '6. Substitute {Aj} in the productions of {Ai}',
  'cfg.gnf.sub.b': '{Ai} (i = {i}) has productions starting with {Aj} (j = {j} &lt; i). We replace each {Ai} → {Aj}γ by {Ai} → δγ for every production {Aj} → δ.',
  'cfg.gnf.lr.t': '6. Left recursion of {A}',
  'cfg.gnf.lr.b': '{A} is now directly left recursive: {A} → {A}α with α ∈ {alphas}; the other productions are β ∈ {betas}. With the new nonterminal {Z}: {A} → β | β{Z} and {Z} → α | α{Z} (variant without ε).',
  'cfg.gnf.back.t': '6. Back substitution',
  'cfg.gnf.back.b': 'Now every A<sub>i</sub> → A<sub>j</sub>γ has j &gt; i, so the last nonterminal {An} only has productions that start with a terminal. Going backwards (A<sub>n-1</sub>, …, A<sub>1</sub>, then the Z\'s), we substitute leading nonterminals that already start with terminals. Marked productions still start with a nonterminal.',
  'cfg.gnf.backsub.t': '6. Substitute in {A}',
  'cfg.gnf.backsub.b': 'Productions of {A} start with {B}, whose productions all start with a terminal by now. After substitution every production of {A} starts with a terminal.',
  'cfg.gnf.backsubZ.b': 'The productions of the new nonterminal {A} start with {B}; those already start with terminals, so we substitute them.',
  'cfg.gnf.unused.t': 'Remove inaccessible nonterminals',
  'cfg.gnf.unused.b': 'After substitution, {bad} no longer appear on any right-hand side reachable from the start symbol, so we remove them.',
  'cfg.gnf.done.t': '6. The grammar in GNF',
  'cfg.gnf.done.b': 'Every production has the form A → aα (a terminal followed by nonterminals). {n} productions in total.',
  'cfg.gnf.done.eps': 'Every production has the form A → aα, plus {S} → ε which we added back. {n} productions in total.',

  // left recursion
  'lr.variant': 'Form of the new productions',
  'lr.variant.eps': "with ε: A → βA', A' → αA' | ε (LL parsers)",
  'lr.variant.noeps': "without ε: A → β | βA', A' → α | αA' (for GNF)",
  'lr.needClean.eps': 'The algorithm needs a grammar <b>without ε-productions</b> (they can hide left recursion, e.g. A → BAα with B ⇒ ε).',
  'lr.needClean.cycle': 'The algorithm needs a grammar <b>without cycles</b> A ⇒⁺ A (made of renames).',
  'lr.clean': 'Remove ε-productions and renames first',
  'lr.result': 'Without left recursion',
  'lr.tbl.detect': 'Left recursion',
  'lr.col.corners': 'A ⇒⁺ B… for B in',
  'lr.col.direct': 'direct',
  'lr.col.indirect': 'indirect',
  'lr.s.detect.t': 'Detect left recursion',
  'lr.s.detect.b': 'A is <b>left recursive</b> if A ⇒⁺ Aα. For each nonterminal we list the nonterminals that can appear first in a sentential form derived from it. Left recursive: {list}. We number the nonterminals A<sub>1</sub>, …, A<sub>n</sub> in the order shown.',
  'lr.s.detect.none': 'No nonterminal can derive a sentential form that starts with itself, so the grammar has no left recursion. Nothing to do.',
  'lr.s.sub.t': 'i = {i}: substitute {Aj} in {Ai}',
  'lr.s.sub.b': '{Ai} has productions {Ai} → {Aj}γ with j = {j} &lt; i = {i}. We replace them by {Ai} → δγ for every {Aj} → δ. Since {Aj} was processed earlier, this can only produce productions starting with a terminal, A<sub>k</sub> with k &gt; j, or {Ai} itself (direct recursion).',
  'lr.s.direct.t': 'i = {i}: direct left recursion of {A}',
  'lr.s.noDirect.b': '{A} has no production of the form {A} → {A}α, so it stays as it is.',
  'lr.s.direct.eps': 'Split the productions: {A} → {A}α with α ∈ {alphas}, and {A} → β with β ∈ {betas}. Since {A} ⇒* βα…α, we generate the same words from right to left: {A} → β{Z} and {Z} → α{Z} | ε.',
  'lr.s.direct.noeps': 'Split the productions: {A} → {A}α with α ∈ {alphas}, and {A} → β with β ∈ {betas}. Since {A} ⇒* βα…α, we generate the same words from right to left: {A} → β | β{Z} and {Z} → α | α{Z}.',
  'lr.s.done.t': 'Done',
  'lr.s.done.b': 'The grammar on the right has no left recursion (direct or indirect) and generates the same language.',

  'theory.cfg': `
<p>A context-free grammar G = (N, Σ, P, S) is brought to a normal form in a fixed order. Each step preserves L(G).</p>
<h4>1. ε-productions</h4>
<p class="formula">N<sub>0</sub> = {A | A → ε},   N<sub>i+1</sub> = N<sub>i</sub> ∪ {A | A → α, α ∈ N<sub>i</sub>*}</p>
<p>Every production A → α is replaced by all the variants obtained by deleting some occurrences of nullable symbols (except ε). If S is nullable, ε ∈ L(G): we keep S → ε, using a new start S' → S | ε when S appears on a right-hand side.</p>
<div class="example">S → aSb | ε   ⇒   S' → S | ε,  S → aSb | ab</div>
<h4>2. Renames (A → B)</h4>
<p class="formula">N<sub>A</sub> = {B ∈ N | A ⇒* B} ;   A → α for every B ∈ N<sub>A</sub>, B → α not a rename</p>
<div class="example">S → A | a,  A → bA | c   ⇒   S → a | bA | c,  A → bA | c</div>
<h4>3. Unproductive symbols</h4>
<p class="formula">N<sub>0</sub> = ∅,   N<sub>i+1</sub> = {A | A → α, α ∈ (N<sub>i</sub> ∪ Σ)*}</p>
<p>Nonterminals outside N are removed, with every production containing them. If S ∉ N, then L(G) = ∅.</p>
<h4>4. Inaccessible symbols</h4>
<p class="formula">V<sub>0</sub> = {S},   V<sub>i+1</sub> = V<sub>i</sub> ∪ {X | A → αXβ, A ∈ V<sub>i</sub>}</p>
<p>The order 3 → 4 matters: removing unproductive symbols can make others inaccessible, not the other way round.</p>
<div class="example">S → a | AB,  A → a   (B unproductive) ⇒ S → a,  A → a ⇒ (A inaccessible) S → a</div>
<h4>5. Chomsky normal form (CNF)</h4>
<p>Productions <span class="formula">A → BC</span> or <span class="formula">A → a</span> (and S → ε if ε ∈ L, S not on a right-hand side). Starting from the reduced grammar:</p>
<ol><li>in right-hand sides of length ≥ 2, replace each terminal a by X<sub>a</sub> and add X<sub>a</sub> → a;</li>
<li>replace A → B<sub>1</sub>…B<sub>k</sub> (k ≥ 3) by A → B<sub>1</sub>Y<sub>1</sub>, Y<sub>1</sub> → B<sub>2</sub>Y<sub>2</sub>, …, Y<sub>k-2</sub> → B<sub>k-1</sub>B<sub>k</sub>.</li></ol>
<div class="example">S → aSb | ab   ⇒   S → X<sub>a</sub>Y<sub>1</sub> | X<sub>a</sub>X<sub>b</sub>,  Y<sub>1</sub> → SX<sub>b</sub>,  X<sub>a</sub> → a,  X<sub>b</sub> → b</div>
<h4>6. Greibach normal form (GNF)</h4>
<p>Productions <span class="formula">A → aα</span>, a ∈ Σ, α ∈ N* (and S → ε). Starting from CNF, with nonterminals ordered A<sub>1</sub>, …, A<sub>n</sub>:</p>
<ol><li>for i = 1..n: for j &lt; i, substitute A<sub>j</sub> in every A<sub>i</sub> → A<sub>j</sub>γ; then remove the direct left recursion of A<sub>i</sub> with a new Z<sub>i</sub> (A<sub>i</sub> → β | βZ<sub>i</sub>, Z<sub>i</sub> → α | αZ<sub>i</sub>);</li>
<li>now A<sub>i</sub> → A<sub>j</sub>γ implies j &gt; i, so A<sub>n</sub> starts with terminals; substitute backwards in A<sub>n-1</sub>, …, A<sub>1</sub>;</li>
<li>finally substitute in the Z productions (they start with some A<sub>k</sub>).</li></ol>
<div class="example">A<sub>1</sub> → A<sub>2</sub>A<sub>2</sub> | a,  A<sub>2</sub> → A<sub>1</sub>A<sub>2</sub> | b<br>A<sub>2</sub> → A<sub>2</sub>A<sub>2</sub>A<sub>2</sub> | aA<sub>2</sub> | b   ⇒   A<sub>2</sub> → aA<sub>2</sub> | b | aA<sub>2</sub>Z | bZ,  Z → A<sub>2</sub>A<sub>2</sub> | A<sub>2</sub>A<sub>2</sub>Z<br>then A<sub>1</sub> and Z get A<sub>2</sub>'s productions substituted in front.</div>`,
  'theory.lr': `
<p>A grammar is <b>left recursive</b> if some nonterminal A has a derivation A ⇒⁺ Aα. It is <b>directly</b> left recursive if A → Aα is a production, and <b>indirectly</b> otherwise (e.g. S → Aa, A → Sd).</p>
<p>Why remove it: a top-down (recursive-descent / LL) parser expanding A would call A again without consuming input — an infinite loop. It is also a step of the Greibach normal form.</p>
<h4>Direct left recursion</h4>
<p>Group the productions of A: <span class="formula">A → Aα<sub>1</sub> | … | Aα<sub>m</sub> | β<sub>1</sub> | … | β<sub>n</sub></span> (no β starts with A). A generates β<sub>j</sub> followed by any sequence of α's, so we generate it left-to-right with a new nonterminal A':</p>
<ul><li class="formula">with ε:  A → β<sub>1</sub>A' | … | β<sub>n</sub>A',   A' → α<sub>1</sub>A' | … | α<sub>m</sub>A' | ε</li>
<li class="formula">without ε:  A → β<sub>j</sub> | β<sub>j</sub>A',   A' → α<sub>i</sub> | α<sub>i</sub>A'</li></ul>
<div class="example">E → E+T | T   ⇒   E → TE',  E' → +TE' | ε   (or  E → T | TE',  E' → +T | +TE')</div>
<div class="example">A → Aa | Ab | c | d   ⇒   A → cA' | dA',  A' → aA' | bA' | ε</div>
<h4>Indirect left recursion (general algorithm)</h4>
<p>Condition: no ε-productions and no cycles A ⇒⁺ A. Order the nonterminals A<sub>1</sub>, …, A<sub>n</sub>.</p>
<p class="formula">for i = 1..n:<br>&emsp;for j = 1..i−1: replace each A<sub>i</sub> → A<sub>j</sub>γ by A<sub>i</sub> → δγ for all A<sub>j</sub> → δ<br>&emsp;remove the direct left recursion of A<sub>i</sub></p>
<p>Invariant: after step i, every A<sub>i</sub> → A<sub>k</sub>γ has k &gt; i, so no cycle of "first symbols" can remain.</p>
<div class="example">S → Aa | b,  A → Ac | Sd | c<br>i = 2, j = 1:  A → Ac | Aad | bd | c<br>direct:  A → bdA' | cA',  A' → cA' | adA' | ε</div>`,
  // ambiguity
  'nav.amb': 'Ambiguity',
  'home.amb': 'Search for a word with two different derivation trees, and compare the two leftmost and the two rightmost derivations.',
  'ex.amb.expr': 'E → E+E | E*E (ambiguous)',
  'ex.amb.dangling': 'Dangling else',
  'ex.amb.eps': 'S → AB with nullable A, B',
  'ex.amb.concat': 'Concatenation S → SS',
  'ex.amb.inherent': 'Inherently ambiguous language',
  'ex.amb.exprFixed': 'E, T, F (unambiguous)',
  'amb.maxLen': 'Search all words of length ≤ {n}',
  'amb.ownWord': 'Or check a specific word',
  'amb.ownWord.ph': 'e.g. a+a*a (empty = search)',
  'amb.found': '<b>The grammar is ambiguous.</b> The shortest word with two different derivation trees is <b>{w}</b> (length {n}).',
  'amb.notFound': 'No word of length ≤ {n} has two derivation trees ({count} words generated, all checked). This does <b>not</b> prove the grammar unambiguous — ambiguity is undecidable in general — but it is good evidence. Try a larger length.',
  'amb.word.none': 'The word <b>{w}</b> is not generated by the grammar.',
  'amb.word.one': 'The word <b>{w}</b> has exactly one derivation tree, so it is not a witness of ambiguity.',
  'amb.word.two': '<b>{w}</b> has (at least) two different derivation trees, so the grammar is ambiguous.',
  'amb.trees': 'Derivation trees',
  'amb.trees.b': 'Both trees have root {root} and the same frontier <b>{w}</b>. The highlighted subtrees are where they first use different productions.',
  'amb.single.tree': 'The only derivation tree of <b>{w}</b>, with root {root}.',
  'amb.treeN': 'Tree {n}',
  'amb.left': 'Leftmost derivations',
  'amb.right': 'Rightmost derivations',
  'amb.left.b': 'At each step the <u>leftmost</u> nonterminal is rewritten (underlined; the production used is on the right). Each tree has exactly one leftmost derivation, so two trees give two distinct leftmost derivations of the same word. The highlighted line is where they split.',
  'amb.right.b': 'At each step the <u>rightmost</u> nonterminal is rewritten. Again, two different trees give two different rightmost derivations of the same word; the highlighted line is where they split.',
  'amb.single.deriv': 'The rewritten nonterminal is underlined; the production used is on the right.',
  'amb.derivN': 'Derivation {n}',
  'theory.amb': `
<p>A context-free grammar G is <b>ambiguous</b> if some word w ∈ L(G) has two different <b>derivation trees</b>. Equivalently, w has two different <b>leftmost</b> derivations, or two different <b>rightmost</b> derivations (each tree corresponds to exactly one leftmost and one rightmost derivation).</p>
<p>Two derivations that only rewrite nonterminals in a different order (same tree) do <i>not</i> count — that is why we compare leftmost with leftmost and rightmost with rightmost.</p>
<h4>Example</h4>
<div class="example">E → E+E | E*E | a,   w = a+a*a<br>
E ⇒ <u>E</u>+E ⇒ a+<u>E</u> ⇒ a+<u>E</u>*E ⇒ a+a*<u>E</u> ⇒ a+a*a   (a+(a*a))<br>
E ⇒ <u>E</u>*E ⇒ <u>E</u>+E*E ⇒ a+<u>E</u>*E ⇒ a+a*<u>E</u> ⇒ a+a*a   ((a+a)*a)</div>
<h4>Good to know</h4>
<ul>
<li>Ambiguity is <b>undecidable</b>: no algorithm decides it for every grammar. Here we search all words up to a length: finding a word proves ambiguity, not finding one does not prove the opposite.</li>
<li>Ambiguity is a property of the <b>grammar</b>; often an equivalent unambiguous grammar exists, e.g. E → E+T | T, T → T*F | F, F → (E) | a (precedence by levels, left associativity).</li>
<li>Some languages are <b>inherently ambiguous</b>: every grammar for them is ambiguous, e.g. {a<sup>i</sup>b<sup>j</sup>c<sup>k</sup> | i = j or j = k}.</li>
<li>Typical sources: E → EαE (missing precedence/associativity), S → SS, the "dangling else", and two ways of deriving ε.</li>
</ul>`,
  // Chomsky hierarchy
  'nav.chomsky': 'Chomsky hierarchy',
  'home.chomsky': 'The four types of grammars (0–3), their production forms, an example grammar for each, and a checker that finds the type of any grammar.',
  'ex.ch.t3': 'Type 3 — right-linear (ends in b)',
  'ex.ch.t2': 'Type 2 — aⁿbⁿ',
  'ex.ch.t1': 'Type 1 — aⁿbⁿcⁿ',
  'ex.ch.t0': 'Type 0 — a^(2ⁿ)',
  'ex.ch.t3left': 'Type 3 — left-linear (starts with a)',
  'ex.ch.mixed': 'Mixed right/left-linear (not type 3)',
  'ex.ch.t2eps': 'Type 2 with an ε-production',
  'ex.ch.t1eps': 'Type 1 with S → ε',
  'chparse.lhsNoNT': 'the left-hand side "{name}" must contain a nonterminal',
  'ch.diagram': 'Language classes',
  'ch.diagram.b': 'ℒ<sub>3</sub> ⊊ ℒ<sub>2</sub> ⊊ ℒ<sub>1</sub> ⊊ ℒ<sub>0</sub>: every inclusion is strict. The language on the right of each ring belongs to that class but not to the next one inside.',
  'ch.t0.short': 'Type 0 — recursively enumerable',
  'ch.t1.short': 'Type 1 — context-sensitive',
  'ch.t2.short': 'Type 2 — context-free',
  'ch.t3.short': 'Type 3 — regular',
  'ch.t0.diag': 'halting problem',
  'ch.t1.diag': 'aⁿbⁿcⁿ',
  'ch.t2.diag': 'aⁿbⁿ',
  'ch.t3.diag': 'a*b*',
  'ch.t0.name': 'Unrestricted grammar',
  'ch.t1.name': 'Context-sensitive grammar',
  'ch.t2.name': 'Context-free grammar',
  'ch.t3.name': 'Regular grammar',
  'ch.t0.form': 'α → β, α contains a nonterminal',
  'ch.t1.form': 'α → β, |α| ≤ |β| (or αAβ → αγβ, γ ≠ ε); S → ε only if S is on no right-hand side',
  'ch.t2.form': 'A → β, A ∈ N, β ∈ (N ∪ Σ)*',
  'ch.t3.form': 'A → aB | a (right-linear) or A → Ba | a (left-linear); S → ε allowed',
  'ch.t0.machine': 'Turing machine',
  'ch.t1.machine': 'Linear bounded automaton',
  'ch.t2.machine': 'Pushdown automaton',
  'ch.t3.machine': 'Finite automaton',
  'ch.t0.lang': '{⟨M, w⟩ | M halts on w}',
  'ch.t1.lang': '{a<sup>n</sup>b<sup>n</sup>c<sup>n</sup> | n ≥ 1}, {ww | w ∈ {a,b}*}',
  'ch.t2.lang': '{a<sup>n</sup>b<sup>n</sup> | n ≥ 1}, balanced parentheses',
  'ch.t3.lang': 'a*b*, identifiers, numbers',
  'ch.t0.cardLang': 'L(G) = {a<sup>2<sup>n</sup></sup> | n ≥ 1} = {aa, aaaa, a<sup>8</sup>, …}',
  'ch.t1.cardLang': 'L(G) = {a<sup>n</sup>b<sup>n</sup>c<sup>n</sup> | n ≥ 1}',
  'ch.t2.cardLang': 'L(G) = {a<sup>n</sup>b<sup>n</sup> | n ≥ 1}',
  'ch.t3.cardLang': 'L(G) = {a, b}*b — the words over {a, b} that end in b',
  'ch.t0.why': 'Not type 1: <b>CB → E</b> and <b>AE → ε</b> make the form shorter. A and B are end markers; C walks right doubling each a, then D walks back (or E ends the word and erases A). The language itself is context-sensitive — the grammar is not.',
  'ch.t1.why': 'Not type 2: the left sides <b>CB</b>, <b>aB</b>, <b>bB</b>, … have length 2 — B becomes b only in the <i>context</i> a_ or b_. Every rule is non-contracting, so it is type 1.',
  'ch.t2.why': 'Every left side is a single nonterminal, but aSb has a nonterminal in the middle, so it is not linear on one side: not type 3. (aⁿbⁿ is not regular — see the pumping lemma.)',
  'ch.t3.why': 'Each right side is a terminal, optionally followed by one nonterminal: right-linear. A finite automaton with states S and a final state accepts the same language.',
  'ch.table': 'The four types at a glance',
  'ch.col.type': 'Type',
  'ch.col.grammar': 'Grammar',
  'ch.col.form': 'Productions',
  'ch.col.machine': 'Recognized by',
  'ch.col.example': 'Example language',
  'ch.typeN': 'Type {n}',
  'ch.examples': 'One example per type',
  'ch.load': 'Open in checker',
  'ch.derivOf': 'Derivation of {w}',
  'ch.wordsUpTo': 'Words of length ≤ {n}:',
  'ch.checker': 'Which type is my grammar?',
  'ch.checker.b': 'Type any grammar — left-hand sides may be strings like <code>CB</code> or <code>aB</code>. The checker tests the conditions from the most restrictive type (3) to the most general (0) and shows the first production that breaks each one.',
  'ch.editor.help': 'One rule per line: <code>S -> aSBC | aBC</code>, <code>CB -> BC</code>. A left side may be any string with at least one nonterminal. Nonterminals are uppercase letters (optionally indexed: <code>A1</code>, <code>X_a</code>); every other character is a terminal. <code>ε</code> / <code>eps</code> for the empty word. The start symbol is S (or the first nonterminal, or <code>start: X</code>).',
  'ch.verdict': 'The grammar is of type {n}: {name}.',
  'ch.linear.right': 'All productions are <b>right-linear</b> (A → wB or A → w).',
  'ch.linear.left': 'All productions are <b>left-linear</b> (A → Bw or A → w).',
  'ch.r.startEps': 'an ε-production of the start symbol is allowed only if S appears on no right-hand side',
  'ch.r.contracting': 'the right side is shorter than the left side (contracting rule)',
  'ch.r.lhs': 'the left side is not a single nonterminal',
  'ch.r.notLinear': 'not linear: the nonterminal is not at one end, or there is more than one',
  'ch.r.mixed': 'right-linear and left-linear rules are mixed — that can generate non-regular languages',
  'ch.note.eps': 'Type 1 fails only because of ε-productions. They can be removed (see <b>CNF &amp; GNF</b>, step 1) with an equivalent grammar, so the language is context-sensitive anyway.',
  'ch.note.lang': 'This is the type of the <i>grammar</i>. The language it generates may be of a more restrictive type, if a different grammar for it exists.',
  'ch.gen': 'Generated words of length ≤ {n}',
  'ch.gen.none': 'none',
  'ch.gen.truncated': '(search stopped early — the list may be incomplete)',
  'ch.ownWord': 'Derive a word',
  'ch.ownWord.ph': 'e.g. aabbcc',
  'ch.ownWord.none': 'No derivation of <b>{w}</b> found.',
  'theory.chomsky': `
<p>A grammar is G = (N, Σ, P, S): nonterminals N, terminals Σ, start symbol S ∈ N and productions <span class="formula">α → β</span> with α ∈ (N ∪ Σ)*N(N ∪ Σ)* (at least one nonterminal on the left) and β ∈ (N ∪ Σ)*. Chomsky (1956) sorted grammars by how restricted their productions are:</p>
<h4>Type 0 — unrestricted</h4>
<p>No restriction besides the one above. Generates the <b>recursively enumerable</b> languages (those accepted by Turing machines).</p>
<div class="example">S → aAb,  aA → aaAb,  A → ε   (here: aⁿbⁿ, n ≥ 1)</div>
<h4>Type 1 — context-sensitive</h4>
<p>Every production is <b>non-contracting</b>: <span class="formula">|α| ≤ |β|</span>. Equivalent form: <span class="formula">αAβ → αγβ</span>, γ ≠ ε — A is rewritten to γ only in the context α_β. Exception: S → ε, if S appears on no right-hand side.</p>
<div class="example">S → aSBC | aBC,  CB → BC,  aB → ab,  bB → bb,  bC → bc,  cC → cc   (aⁿbⁿcⁿ)</div>
<h4>Type 2 — context-free</h4>
<p>The left side is a <b>single nonterminal</b>: <span class="formula">A → β</span>. A is replaced regardless of its neighbours.</p>
<div class="example">S → aSb | ab   (aⁿbⁿ),    E → E+T | T,  T → T*F | F,  F → (E) | a</div>
<h4>Type 3 — regular</h4>
<p><b>Right-linear</b>: <span class="formula">A → aB | a</span>, or <b>left-linear</b>: <span class="formula">A → Ba | a</span> (a ∈ Σ), plus S → ε. All rules must be on the same side. Often the extended form A → wB | w, w ∈ Σ*, is allowed too; it generates the same languages.</p>
<div class="example">S → aS | bA | b,  A → bA | b   (a*b⁺)</div>
<h4>Good to know</h4>
<ul>
<li>A <b>language</b> is of type k if <i>some</i> grammar of type k generates it. The classes form a strict hierarchy ℒ<sub>3</sub> ⊊ ℒ<sub>2</sub> ⊊ ℒ<sub>1</sub> ⊊ ℒ<sub>0</sub>.</li>
<li>Every type 3 grammar is type 2. Type 2 grammars with ε-productions are not literally type 1, but ε-productions can always be removed, so ℒ<sub>2</sub> ⊆ ℒ<sub>1</sub> still holds for languages.</li>
<li>Membership (is w ∈ L(G)?) is decidable for types 1, 2, 3 — for type 1, sentential forms never get longer than w — and undecidable for type 0.</li>
</ul>`,
  // BNF & EBNF
  'nav.bnf': 'BNF & EBNF',
  'home.bnf': 'The notations used to write the syntax of programming languages: metasymbols, EBNF → BNF conversion and worked examples.',
  'bnf.meta': 'Metasymbols',
  'bnf.col.meaning': 'Meaning',
  'bnf.meta.def': 'is defined as',
  'bnf.meta.alt': 'alternative (or)',
  'bnf.meta.nt': 'nonterminal (syntactic category)',
  'bnf.meta.t': 'terminal (literal text)',
  'bnf.meta.cat': 'concatenation',
  'bnf.meta.opt': 'optional: 0 or 1 times',
  'bnf.meta.rep': 'repetition: 0 or more times',
  'bnf.meta.group': 'grouping',
  'bnf.meta.end': 'end of rule',
  'bnf.meta.b': 'Many tools use a regex-like EBNF instead: <code>x?</code> optional, <code>x*</code> zero or more, <code>x+</code> one or more, and concatenation by juxtaposition (ANTLR, W3C specs, Python\'s grammar).',
  'bnf.rules': 'From EBNF to BNF',
  'bnf.rules.b': 'Each EBNF construct is replaced by a new nonterminal &lt;N&gt; with plain BNF rules. Repetition becomes recursion — the only way BNF has to say "many times". So EBNF is more convenient but not more powerful: both describe exactly the context-free languages.',
  'bnf.col.construct': 'Construct',
  'bnf.rule.opt': 'Optional [ β ]',
  'bnf.rule.rep': 'Repetition { β }',
  'bnf.rule.group': 'Grouping ( β | γ )',
  'bnf.rule.plus': 'One or more β+',
  'bnf.examples': 'Examples',
  'bnf.asGrammar': 'As a grammar (A → α notation)',
  'bnf.toAmb': 'Derivation trees →',
  'bnf.toChomsky': 'Check the type →',
  'bnf.ex.digits.title': 'Unsigned number',
  'bnf.ex.digits.note': 'BNF has to use recursion (&lt;digit&gt; &lt;number&gt;) for "one or more digits"; EBNF writes it as a digit followed by a repetition.',
  'bnf.ex.signed.title': 'Integer with optional sign',
  'bnf.ex.signed.note': 'The optional sign needs a second alternative in BNF; in EBNF it is a single <code>[ … ]</code>. The group <code>( "+" | "-" )</code> inside it avoids naming &lt;sign&gt;.',
  'bnf.ex.ident.title': 'Identifier',
  'bnf.ex.ident.note': 'A letter followed by any letters or digits. The BNF version is left-recursive; the EBNF version has no recursion at all.',
  'bnf.ex.list.title': 'Comma-separated list',
  'bnf.ex.list.note': 'The pattern <code>x { "," x }</code> — one item, then any number of ", item" — is how separators are written in EBNF.',
  'bnf.ex.expr.title': 'Arithmetic expression',
  'bnf.ex.expr.note': 'Precedence comes from the levels expr → term → factor. The left recursion of BNF (left associativity) becomes a repetition in EBNF, which is exactly what a recursive-descent parser implements as a loop.',
  'bnf.ex.if.title': 'If statement',
  'bnf.ex.if.note': 'The optional else branch. Both versions are ambiguous for <code>if c then if d then s else t</code> (the "dangling else"); languages fix it with the rule "else belongs to the nearest if".',
  'theory.bnf': `
<p><b>BNF</b> (Backus–Naur Form) is a notation for context-free grammars, introduced by John Backus and Peter Naur for the ALGOL 60 report (1960). It is the standard way to describe the <b>syntax</b> of programming languages.</p>
<p>A BNF rule <span class="formula"><span class="bnf-nt">&lt;A&gt;</span> ::= α | β</span> is exactly the production <span class="formula">A → α | β</span>: nonterminals are written in angle brackets, terminals as literal text (here in quotes), <code>::=</code> reads "is defined as" and <code>|</code> separates alternatives.</p>
<div class="example"><span class="bnf-nt">&lt;bit&gt;</span> ::= "0" | "1"<br><span class="bnf-nt">&lt;bits&gt;</span> ::= <span class="bnf-nt">&lt;bit&gt;</span> | <span class="bnf-nt">&lt;bit&gt;</span> <span class="bnf-nt">&lt;bits&gt;</span>     ⟺     B → 0 | 1,  S → B | BS</div>
<h4>EBNF — Extended BNF</h4>
<p>Proposed by Niklaus Wirth (1977) and standardized as ISO/IEC 14977 (1996). It adds three constructs that remove most auxiliary nonterminals and recursion:</p>
<ul>
<li><code>[ α ]</code> — α is <b>optional</b> (0 or 1 times);</li>
<li><code>{ α }</code> — α is <b>repeated</b> 0 or more times;</li>
<li><code>( α | β )</code> — <b>grouping</b> of alternatives inside a rule.</li>
</ul>
<p>In ISO EBNF nonterminals have no brackets, terminals are quoted, <code>=</code> defines, <code>,</code> concatenates and <code>;</code> ends a rule.</p>
<div class="example">bits = bit , { bit } ;</div>
<h4>Good to know</h4>
<ul>
<li>BNF, EBNF and the A → α notation all have the <b>same power</b>: they describe the context-free (type 2) languages. EBNF is only shorter.</li>
<li>Every EBNF rule is turned into BNF by introducing new nonterminals (table below).</li>
<li>Syntax diagrams (railroad diagrams) draw the same EBNF rules as graphs.</li>
<li>Context conditions (a variable must be declared, types must match) cannot be written in BNF; they are checked later, by semantic analysis.</li>
</ul>`,
};

export type Dict = typeof en;
export type Key = keyof Dict;
