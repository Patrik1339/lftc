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
};

export type Dict = typeof en;
export type Key = keyof Dict;
