import type { PageId } from '../pages/common';
import type { L } from './exercises';

export interface Question {
  topic: PageId;
  q: L;
  /** The first option is the correct one; the quiz shuffles them. */
  options: L[];
  explain: L;
}

const l = (ro: string, en: string): L => ({ ro, en });
/** An option written the same way in both languages (formulas, numbers). */
const same = (s: string): L => ({ ro: s, en: s });

export const QUESTIONS: Question[] = [
  // ---------------------------------------------------------------- Chomsky
  {
    topic: 'chomsky',
    q: l('Ce tip are gramatica S → aS | bS | b?', 'What type is the grammar S → aS | bS | b?'),
    options: [l('Tip 3 (regulată)', 'Type 3 (regular)'), l('Doar tip 2', 'Only type 2'), l('Doar tip 1', 'Only type 1'), l('Doar tip 0', 'Only type 0')],
    explain: l('Toate producțiile au forma A → wB sau A → w: liniară la dreapta, deci tip 3.', 'Every production is A → wB or A → w: right-linear, so type 3.'),
  },
  {
    topic: 'chomsky',
    q: l('Care incluziune este corectă pentru clasele de limbaje?', 'Which inclusion between language classes is correct?'),
    options: [same('ℒ₃ ⊂ ℒ₂ ⊂ ℒ₁ ⊂ ℒ₀'), same('ℒ₀ ⊂ ℒ₁ ⊂ ℒ₂ ⊂ ℒ₃'), same('ℒ₂ ⊂ ℒ₃ ⊂ ℒ₁ ⊂ ℒ₀'), same('ℒ₃ = ℒ₂')],
    explain: l('Cu cât tipul e mai mare, cu atât condițiile sunt mai restrictive, deci clasa de limbaje e mai mică.', 'The higher the type, the stricter the conditions, so the smaller the class of languages.'),
  },
  {
    topic: 'chomsky',
    q: l('O producție de forma CB → BC poate apărea într-o gramatică de tip:', 'A production CB → BC can appear in a grammar of type:'),
    options: [l('1 (dar nu 2)', '1 (but not 2)'), same('2'), same('3'), l('niciunul', 'none')],
    explain: l('Partea stângă are două simboluri, deci nu e tip 2; |CB| ≤ |BC|, deci e monotonă (tip 1).', 'The left side has two symbols, so not type 2; |CB| ≤ |BC|, so it is monotone (type 1).'),
  },
  {
    topic: 'chomsky',
    q: l('Gramatica S → aA | ab, A → Sb amestecă reguli liniare la dreapta și la stânga. Ce tip are?', 'The grammar S → aA | ab, A → Sb mixes right- and left-linear rules. What type is it?'),
    options: [l('Tip 2, nu 3', 'Type 2, not 3'), same('Tip 3'), same('Tip 1, nu 2'), same('Tip 0, nu 1')],
    explain: l('Amestecul de reguli liniare la dreapta și la stânga nu e permis în tipul 3; aici generează aⁿbⁿ, care nu e regulat.', 'Mixing right- and left-linear rules is not allowed in type 3; here it generates aⁿbⁿ, which is not regular.'),
  },
  // ---------------------------------------------------------------- BNF
  {
    topic: 'bnf',
    q: l('În EBNF, ce înseamnă { X }?', 'In EBNF, what does { X } mean?'),
    options: [l('X repetat de zero sau mai multe ori', 'X repeated zero or more times'), l('X opțional (0 sau 1 dată)', 'X optional (0 or 1 times)'), l('X exact o dată', 'X exactly once'), l('X de cel puțin o dată', 'X at least once')],
    explain: l('Acoladele înseamnă repetiție (0 sau mai multe); parantezele drepte [ X ] înseamnă opțional.', 'Braces mean repetition (0 or more); square brackets [ X ] mean optional.'),
  },
  {
    topic: 'bnf',
    q: l('Cum se scrie în BNF regula EBNF &lt;A&gt; ::= a [ b ]?', 'How is the EBNF rule &lt;A&gt; ::= a [ b ] written in BNF?'),
    options: [same('&lt;A&gt; ::= a | ab'), same('&lt;A&gt; ::= a | a&lt;A&gt;b'), same('&lt;A&gt; ::= ab'), same('&lt;A&gt; ::= a | b')],
    explain: l('[ b ] înseamnă că b apare o dată sau deloc, deci avem două alternative: a și ab.', '[ b ] means b appears once or not at all, so there are two alternatives: a and ab.'),
  },
  {
    topic: 'bnf',
    q: l('Ce clasă de gramatici descrie notația BNF?', 'What class of grammars does BNF describe?'),
    options: [l('Independente de context (tip 2)', 'Context-free (type 2)'), l('Regulate (tip 3)', 'Regular (type 3)'), l('Dependente de context (tip 1)', 'Context-sensitive (type 1)'), l('Fără restricții (tip 0)', 'Unrestricted (type 0)')],
    explain: l('Fiecare regulă BNF are în stânga un singur neterminal, exact ca o gramatică de tip 2.', 'Each BNF rule has a single nonterminal on the left, exactly like a type 2 grammar.'),
  },
  // ---------------------------------------------------------------- ε
  {
    topic: 'epsilon',
    q: l('Ce conține întotdeauna ε-cl(q)?', 'What does ε-cl(q) always contain?'),
    options: [l('Starea q însăși', 'The state q itself'), l('Starea inițială', 'The start state'), l('O stare finală', 'A final state'), l('Mulțimea vidă', 'The empty set')],
    explain: l('Cu zero ε-tranziții rămânem în q, deci q ∈ ε-cl(q).', 'With zero ε-transitions we stay in q, so q ∈ ε-cl(q).'),
  },
  {
    topic: 'epsilon',
    q: l('După eliminarea ε-tranzițiilor, δ\'(q, a) este:', "After removing ε-transitions, δ'(q, a) is:"),
    options: [same('ε-cl(δ(ε-cl(q), a))'), same('δ(q, a)'), same('ε-cl(q) ∪ δ(q, a)'), same('δ(ε-cl(q), a)')],
    explain: l('Facem ε-uri înainte, citim a, apoi din nou ε-uri.', 'Follow ε-moves first, read a, then follow ε-moves again.'),
  },
  {
    topic: 'epsilon',
    q: l('Când devine q o stare finală după eliminarea ε-tranzițiilor?', 'When does q become a final state after removing ε-transitions?'),
    options: [l('Când ε-cl(q) conține o stare finală', 'When ε-cl(q) contains a final state'), l('Doar dacă q era deja finală', 'Only if q was already final'), l('Când q este starea inițială', 'When q is the start state'), l('Niciodată', 'Never')],
    explain: l('Din q se poate ajunge fără să citim nimic într-o stare finală, deci q trebuie să accepte.', 'From q we can reach a final state without reading anything, so q must accept.'),
  },
  // ---------------------------------------------------------------- NFA → DFA
  {
    topic: 'nfa',
    q: l('Un AFN cu n stări are un AFD echivalent cu cel mult:', 'An NFA with n states has an equivalent DFA with at most:'),
    options: [l('2ⁿ stări', '2ⁿ states'), l('n stări', 'n states'), l('n² stări', 'n² states'), l('n! stări', 'n! states')],
    explain: l('Fiecare stare a AFD-ului este o submulțime a stărilor AFN-ului, și sunt 2ⁿ submulțimi.', 'Every DFA state is a subset of the NFA states, and there are 2ⁿ subsets.'),
  },
  {
    topic: 'nfa',
    q: l('În construcția submulțimilor, o stare S a AFD-ului este finală dacă:', 'In the subset construction, a DFA state S is final if:'),
    options: [l('S conține cel puțin o stare finală a AFN-ului', 'S contains at least one NFA final state'), l('toate stările din S sunt finale', 'all states in S are final'), l('S este mulțimea vidă', 'S is the empty set'), l('S conține starea inițială', 'S contains the start state')],
    explain: l('AFN-ul acceptă dacă măcar un drum se termină într-o stare finală: S ∩ F ≠ ∅.', 'The NFA accepts if at least one path ends in a final state: S ∩ F ≠ ∅.'),
  },
  {
    topic: 'nfa',
    q: l('Ce reprezintă starea ∅ în AFD-ul obținut?', 'What does the state ∅ represent in the resulting DFA?'),
    options: [l('O stare capcană (din care nu se mai acceptă nimic)', 'A sink state (nothing is accepted from it)'), l('Starea inițială', 'The start state'), l('O stare finală', 'A final state'), l('O eroare a algoritmului', 'An error of the algorithm')],
    explain: l('Dacă AFN-ul nu mai are nicio stare activă, niciun sufix nu mai poate fi acceptat.', 'If the NFA has no active states left, no suffix can be accepted anymore.'),
  },
  {
    topic: 'nfa',
    q: l('AFN-urile și AFD-urile recunosc:', 'NFAs and DFAs recognize:'),
    options: [l('Exact aceeași clasă de limbaje (regulate)', 'Exactly the same class of languages (regular)'), l('AFN-urile recunosc mai multe limbaje', 'NFAs recognize more languages'), l('AFD-urile recunosc mai multe limbaje', 'DFAs recognize more languages'), l('Clase incomparabile', 'Incomparable classes')],
    explain: l('Construcția submulțimilor transformă orice AFN într-un AFD echivalent.', 'The subset construction turns any NFA into an equivalent DFA.'),
  },
  // ---------------------------------------------------------------- minimization
  {
    topic: 'min',
    q: l('Partiția inițială ≡₀ în algoritmul de minimizare este:', 'The initial partition ≡₀ in the minimization algorithm is:'),
    options: [same('{F, Q ∖ F}'), l('fiecare stare separat', 'every state on its own'), same('{Q}'), l('{starea inițială, restul}', '{start state, the rest}')],
    explain: l('Cu cuvântul vid putem distinge doar stările finale de cele nefinale.', 'With the empty word we can only tell final states from non-final ones.'),
  },
  {
    topic: 'min',
    q: l('Două stări p și q sunt echivalente dacă:', 'Two states p and q are equivalent if:'),
    options: [
      l('pentru orice w, δ(p, w) ∈ F ⇔ δ(q, w) ∈ F', 'for every w, δ(p, w) ∈ F ⇔ δ(q, w) ∈ F'),
      l('au aceleași tranziții', 'they have the same transitions'),
      l('sunt amândouă finale', 'they are both final'),
      l('se ajunge în ele cu același cuvânt', 'they are reached by the same word'),
    ],
    explain: l('Niciun cuvânt nu le poate distinge: din ambele, exact aceleași cuvinte duc la acceptare.', 'No word distinguishes them: exactly the same words lead to acceptance from both.'),
  },
  {
    topic: 'min',
    q: l('Când se oprește rafinarea partițiilor?', 'When does partition refinement stop?'),
    options: [same('≡ₖ₊₁ = ≡ₖ'), l('după exact |Q| pași', 'after exactly |Q| steps'), l('când fiecare clasă are o singură stare', 'when every class has one state'), l('după 2 pași', 'after 2 steps')],
    explain: l('Dacă un pas nu mai separă nimic, nici pașii următori nu vor separa.', 'If one step separates nothing, later steps will not separate anything either.'),
  },
  {
    topic: 'min',
    q: l('De ce eliminăm întâi stările inaccesibile?', 'Why do we first remove inaccessible states?'),
    options: [l('Nu influențează limbajul, dar ar mări AFD-ul', 'They do not affect the language, but would enlarge the DFA'), l('Sunt mereu finale', 'They are always final'), l('Fac automatul nedeterminist', 'They make the automaton nondeterministic'), l('Nu e nevoie să le eliminăm', 'There is no need to remove them')],
    explain: l('Nu se ajunge în ele din starea inițială, deci nu participă la niciun calcul.', 'They cannot be reached from the start state, so they take part in no computation.'),
  },
  // ---------------------------------------------------------------- pumping
  {
    topic: 'pump',
    q: l('Lema de pompare pentru limbaje regulate poate fi folosită pentru a arăta că:', 'The pumping lemma for regular languages can be used to show that:'),
    options: [l('un limbaj NU este regulat', 'a language is NOT regular'), l('un limbaj este regulat', 'a language is regular'), l('un limbaj este finit', 'a language is finite'), l('o gramatică este ambiguă', 'a grammar is ambiguous')],
    explain: l('Este o condiție necesară, nu suficientă: o folosim prin reducere la absurd.', 'It is a necessary, not sufficient, condition: we use it by contradiction.'),
  },
  {
    topic: 'pump',
    q: l('Care condiții trebuie să le respecte descompunerea w = xyz?', 'Which conditions must the split w = xyz satisfy?'),
    options: [same('|xy| ≤ p, |y| ≥ 1'), same('|xy| ≥ p, |y| ≥ 1'), same('|y| ≤ p, |x| ≥ 1'), same('|xyz| ≤ p')],
    explain: l('y nu e vid și se află în primele p simboluri ale lui w.', 'y is non-empty and lies within the first p symbols of w.'),
  },
  {
    topic: 'pump',
    q: l('În demonstrație, cine alege descompunerea xyz?', 'In the proof, who chooses the split xyz?'),
    options: [l('Adversarul — trebuie tratate toate descompunerile', 'The adversary — every split must be handled'), l('Noi alegem cea mai convenabilă', 'We pick the most convenient one'), l('Este unică', 'It is unique'), l('Se alege aleator', 'It is picked at random')],
    explain: l('Lema spune doar că EXISTĂ o descompunere; nu știm care, deci trebuie să le acoperim pe toate.', 'The lemma only says a split EXISTS; we do not know which, so we must cover all of them.'),
  },
  {
    topic: 'pump',
    q: l('Pentru L = {aⁿbⁿ} și w = aᵖbᵖ, ce conține y?', 'For L = {aⁿbⁿ} and w = aᵖbᵖ, what does y contain?'),
    options: [l('Doar a-uri', 'Only a’s'), l('Doar b-uri', 'Only b’s'), l('Și a-uri, și b-uri', 'Both a’s and b’s'), l('Depinde de p', 'It depends on p')],
    explain: l('|xy| ≤ p, iar primele p simboluri ale lui w sunt toate a.', '|xy| ≤ p, and the first p symbols of w are all a.'),
  },
  // ---------------------------------------------------------------- normal forms
  {
    topic: 'cfg',
    q: l('Care producție este permisă în forma normală Chomsky?', 'Which production is allowed in Chomsky normal form?'),
    options: [same('A → BC'), same('A → aB'), same('A → B'), same('A → abc')],
    explain: l('În FNC avem doar A → BC și A → a (plus S → ε dacă ε ∈ L).', 'CNF only has A → BC and A → a (plus S → ε if ε ∈ L).'),
  },
  {
    topic: 'cfg',
    q: l('Care producție este în forma normală Greibach?', 'Which production is in Greibach normal form?'),
    options: [same('A → aBC'), same('A → BCa'), same('A → Ba'), same('A → BC')],
    explain: l('În FNG fiecare parte dreaptă începe cu un terminal, urmat doar de neterminale.', 'In GNF every right side starts with a terminal followed only by nonterminals.'),
  },
  {
    topic: 'cfg',
    q: l('Un simbol este neproductiv dacă:', 'A symbol is unproductive if:'),
    options: [l('nu derivă niciun cuvânt format doar din terminale', 'it derives no word made only of terminals'), l('nu se poate ajunge la el din S', 'it cannot be reached from S'), l('are o ε-producție', 'it has an ε-production'), l('apare în stânga unei redenumiri', 'it is on the left of a rename')],
    explain: l('„Inaccesibil” înseamnă că nu poate fi atins din S; „neproductiv” — că nu produce niciun cuvânt terminal.', '“Inaccessible” means it cannot be reached from S; “unproductive” means it produces no terminal word.'),
  },
  {
    topic: 'cfg',
    q: l('De ce eliminăm întâi simbolurile neproductive și abia apoi pe cele inaccesibile?', 'Why remove unproductive symbols before inaccessible ones?'),
    options: [
      l('Eliminarea celor neproductive poate face alte simboluri inaccesibile', 'Removing unproductive ones can make other symbols inaccessible'),
      l('Ordinea nu contează', 'The order does not matter'),
      l('Simbolurile inaccesibile sunt mereu productive', 'Inaccessible symbols are always productive'),
      l('Așa cere FNG', 'GNF requires it'),
    ],
    explain: l('Ex.: S → a | AB, A → a; B e neproductiv. Ștergând S → AB, A devine inaccesibil.', 'E.g. S → a | AB, A → a; B is unproductive. Deleting S → AB makes A inaccessible.'),
  },
  // ---------------------------------------------------------------- left recursion
  {
    topic: 'lr',
    q: l('Cum se elimină recursivitatea stângă directă din A → Aα | β?', 'How is direct left recursion removed from A → Aα | β?'),
    options: [same("A → βA', A' → αA' | ε"), same("A → αA', A' → βA' | ε"), same('A → βα | β'), same("A → A'β, A' → α")],
    explain: l('A generează βα*: întâi un β, apoi oricâți α — exact ce produc A → βA\' și A\' → αA\' | ε.', "A generates βα*: one β, then any number of α — exactly what A → βA' and A' → αA' | ε produce."),
  },
  {
    topic: 'lr',
    q: l('Gramatica S → Aa | b, A → Sc | d este recursivă la stânga?', 'Is the grammar S → Aa | b, A → Sc | d left recursive?'),
    options: [l('Da, indirect: S ⇒ Aa ⇒ Sca', 'Yes, indirectly: S ⇒ Aa ⇒ Sca'), l('Nu', 'No'), l('Da, direct', 'Yes, directly'), l('Doar dacă adăugăm ε', 'Only if we add ε')],
    explain: l('S nu începe direct cu S, dar prin A ajungem la o formă care începe cu S.', 'S does not start with S directly, but through A we reach a form starting with S.'),
  },
  {
    topic: 'lr',
    q: l('De ce contează recursivitatea stângă?', 'Why does left recursion matter?'),
    options: [l('Analizorii descendenți (top-down) intră în buclă infinită', 'Top-down parsers loop forever'), l('Face gramatica ambiguă', 'It makes the grammar ambiguous'), l('Schimbă limbajul generat', 'It changes the generated language'), l('Împiedică trecerea în FNC', 'It prevents conversion to CNF')],
    explain: l('Un analizor descendent care expandează A → Aα ar încerca din nou A fără să consume nimic.', 'A top-down parser expanding A → Aα would try A again without consuming input.'),
  },
  // ---------------------------------------------------------------- ambiguity
  {
    topic: 'amb',
    q: l('O gramatică este ambiguă dacă există un cuvânt cu:', 'A grammar is ambiguous if some word has:'),
    options: [l('doi arbori de derivare diferiți', 'two different derivation trees'), l('două derivări diferite oarecare', 'any two different derivations'), l('o derivare foarte lungă', 'a very long derivation'), l('nicio derivare', 'no derivation')],
    explain: l('Ordinea de aplicare poate diferi fără ambiguitate; contează arborii (echivalent: două derivări stângi).', 'The order of rewriting can differ without ambiguity; what counts is trees (equivalently: two leftmost derivations).'),
  },
  {
    topic: 'amb',
    q: l('Este decidabil dacă o gramatică independentă de context este ambiguă?', 'Is it decidable whether a context-free grammar is ambiguous?'),
    options: [l('Nu, problema este nedecidabilă', 'No, the problem is undecidable'), l('Da, cu algoritmul CYK', 'Yes, with the CYK algorithm'), l('Da, trecând în FNC', 'Yes, by converting to CNF'), l('Da, pentru orice gramatică', 'Yes, for every grammar')],
    explain: l('De aceea pagina de ambiguitate face doar o căutare mărginită.', 'This is why the ambiguity page only does a bounded search.'),
  },
  {
    topic: 'amb',
    q: l('Cum se elimină ambiguitatea din E → E+E | E*E | a?', 'How is the ambiguity of E → E+E | E*E | a removed?'),
    options: [l('Prin niveluri de precedență: E → E+T | T, T → T*F | F, F → a', 'With precedence levels: E → E+T | T, T → T*F | F, F → a'), l('Prin trecere în FNC', 'By converting to CNF'), l('Eliminând recursivitatea stângă', 'By removing left recursion'), l('Nu se poate', 'It cannot be done')],
    explain: l('Fiecare nivel corespunde unei priorități, iar recursivitatea la stânga impune asociativitatea la stânga.', 'Each level is one precedence, and left recursion enforces left associativity.'),
  },
  // ---------------------------------------------------------------- pushdown automata
  {
    topic: 'pda',
    q: l('Ce clasă de limbaje acceptă automatele push-down (nedeterministe)?', 'Which class of languages do (nondeterministic) pushdown automata accept?'),
    options: [l('Limbajele independente de context (tip 2)', 'The context-free languages (type 2)'), l('Limbajele regulate (tip 3)', 'The regular languages (type 3)'), l('Limbajele dependente de context (tip 1)', 'The context-sensitive languages (type 1)'), l('Toate limbajele de tip 0', 'All type 0 languages')],
    explain: l('GIC → APD prin expandare/potrivire și APD → GIC prin construcția cu triplete [pXq].', 'CFG → PDA by expand/match and PDA → CFG by the triple construction [pXq].'),
  },
  {
    topic: 'pda',
    q: l('Ce înseamnă (p, AZ) ∈ δ(q, a, Z)?', 'What does (p, AZ) ∈ δ(q, a, Z) mean?'),
    options: [
      l('În q, citind a cu Z în vârf, trece în p și pune A peste Z', 'In q, reading a with Z on top, go to p and push A on top of Z'),
      l('În q, citind a, scoate A și Z din stivă', 'In q, reading a, pop A and Z'),
      l('În q, citind a cu A în vârf, trece în p și pune Z', 'In q, reading a with A on top, go to p and push Z'),
      l('În q, citind a, trece în p fără să modifice stiva', 'In q, reading a, go to p without touching the stack'),
    ],
    explain: l('Vârful Z este înlocuit cu AZ; primul simbol, A, devine noul vârf.', 'The top Z is replaced by AZ; the first symbol, A, becomes the new top.'),
  },
  {
    topic: 'pda',
    q: l('Care este configurația după mișcarea (q0, abb, AZ) ⊢ … cu δ(q0, a, A) = {(q0, AA)}?', 'What is the configuration after the move (q0, abb, AZ) ⊢ … with δ(q0, a, A) = {(q0, AA)}?'),
    options: [same('(q0, bb, AAZ)'), same('(q0, abb, AAZ)'), same('(q0, bb, AZ)'), same('(q0, bb, AAAZ)')],
    explain: l('Se consumă a, vârful A este înlocuit cu AA, restul stivei (Z) rămâne.', 'a is consumed, the top A is replaced by AA, the rest of the stack (Z) stays.'),
  },
  {
    topic: 'pda',
    q: l('Ce relație există între acceptarea prin stări finale și cea prin vidarea stivei?', 'How are acceptance by final state and by empty stack related?'),
    options: [
      l('Sunt echivalente: acceptă aceeași clasă de limbaje', 'They are equivalent: they accept the same class of languages'),
      l('Vidarea stivei acceptă strict mai multe limbaje', 'Empty stack accepts strictly more languages'),
      l('Stările finale acceptă strict mai multe limbaje', 'Final state accepts strictly more languages'),
      l('Un APD dat acceptă mereu același limbaj în ambele moduri', 'A given PDA always accepts the same language both ways'),
    ],
    explain: l('Pentru orice APD de un tip se construiește un alt APD de celălalt tip; același automat poate însă accepta limbaje diferite în cele două moduri.', 'Any PDA of one kind can be turned into another PDA of the other kind; the same automaton can, however, accept different languages in the two modes.'),
  },
  {
    topic: 'pda',
    q: l('Care limbaj NU poate fi acceptat de un automat push-down?', 'Which language can NOT be accepted by a pushdown automaton?'),
    options: [same('{ aⁿbⁿcⁿ | n ≥ 0 }'), same('{ aⁿbⁿ | n ≥ 0 }'), same('{ w wᴿ | w ∈ {a,b}* }'), l('parantezele echilibrate', 'balanced parentheses')],
    explain: l('aⁿbⁿcⁿ nu este independent de context: o stivă poate compara doar două numărători.', 'aⁿbⁿcⁿ is not context-free: a stack can only compare two counts.'),
  },
  {
    topic: 'pda',
    q: l('Care limbaj este acceptat de un APD, dar NU de un APD determinist?', 'Which language is accepted by a PDA but NOT by a deterministic PDA?'),
    options: [same('{ w wᴿ | w ∈ {a,b}* }'), same('{ w c wᴿ | w ∈ {a,b}* }'), same('{ aⁿbⁿ | n ≥ 1 }'), l('orice limbaj regulat', 'any regular language')],
    explain: l('Fără marcaj la mijloc, automatul trebuie să ghicească unde începe wᴿ — nedeterminism care nu poate fi eliminat.', 'Without a middle marker the automaton has to guess where wᴿ starts — nondeterminism that cannot be removed.'),
  },
  {
    topic: 'pda',
    q: l('În construcția GIC → APD (o singură stare, stivă vidă), ce face o producție A → α?', 'In the CFG → PDA construction (one state, empty stack), what does a production A → α give?'),
    options: [same('δ(q, ε, A) ∋ (q, α)'), same('δ(q, A, ε) ∋ (q, α)'), same('δ(q, α, A) ∋ (q, ε)'), same('δ(q, ε, α) ∋ (q, A)')],
    explain: l('Expandare: A din vârf este înlocuit cu α fără să se citească nimic; terminalele se potrivesc apoi cu δ(q, a, a) = {(q, ε)}.', 'Expand: A on top is replaced by α without reading anything; terminals are then matched by δ(q, a, a) = {(q, ε)}.'),
  },
  {
    topic: 'pda',
    q: l('Când este blocat un APD în configurația (q, w, ε)?', 'When is a PDA stuck in the configuration (q, w, ε)?'),
    options: [l('Întotdeauna: nicio mișcare nu se poate face cu stiva vidă', 'Always: no move is possible with an empty stack'), l('Doar dacă w ≠ ε', 'Only if w ≠ ε'), l('Doar dacă q nu este finală', 'Only if q is not final'), l('Niciodată, poate face ε-mișcări', 'Never, it can make ε-moves')],
    explain: l('Orice mișcare citește vârful stivei, așa că fără vârf nu există mișcări. Cu w = ε și acceptare prin stivă vidă, cuvântul este acceptat.', 'Every move reads the top of the stack, so without a top there are no moves. With w = ε and empty-stack acceptance, the word is accepted.'),
  },
];
