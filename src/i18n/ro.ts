import type { Dict } from './en';

export const ro: Dict = {
  'app.title': 'LFTC Vizual',
  'app.subtitle': 'Limbaje formale și tehnici de compilare — pas cu pas',
  'nav.home': 'Acasă',
  'nav.epsilon': 'ε-tranziții',
  'nav.nfa': 'AFN → AFD',
  'nav.min': 'Minimizare',
  'nav.pump': 'Lema de pompare',

  'home.intro': 'Alege un subiect. Fiecare pagină are o scurtă recapitulare teoretică, exemple gata făcute și o rulare animată, pas cu pas, a algoritmului pe orice automat introduci.',
  'home.epsilon': 'Elimină ε-tranzițiile folosind ε-închiderile, păstrând limbajul acceptat.',
  'home.nfa': 'Transformă un automat nedeterminist într-unul determinist prin construcția submulțimilor.',
  'home.min': 'Elimină stările inaccesibile și unește stările echivalente pentru a obține AFD-ul minimal.',
  'home.pump': 'Demonstrează prin reducere la absurd că un limbaj nu este regulat, cu un p aleator.',
  'home.flow': 'Fluxul tipic: AFN-ε → (eliminare ε) → AFN → (submulțimi) → AFD → (minimizare) → AFD minimal. Fiecare pagină are un buton care trimite rezultatul la pasul următor.',

  'graph.original': 'Automatul inițial',
  'graph.building': 'Automatul în construcție',
  'graph.result': 'Rezultat (fără ε)',
  'graph.afn': 'AFN',
  'graph.afdBuilding': 'AFD în construcție',
  'graph.afd': 'AFD rezultat',
  'graph.complete': 'AFD accesibil și complet',
  'graph.minimal': 'AFD minimal',

  'col.state': 'Stare',
  'col.symbol': 'Simbol',
  'col.final': 'Finală?',
  'col.dfaState': 'Stare AFD',
  'col.class': 'Clasă',
  'col.states': 'Stări',

  'parse.oneStart': 'trebuie exact o stare inițială',
  'parse.unknownHeader': 'antet necunoscut „{name}” (folosește start:, final: sau states:)',
  'parse.badTransition': 'o tranziție se scrie: stare simbol destinație(i)',
  'parse.empty': 'automatul nu are stări',
  'parse.noStart': 'lipsește linia „start: ...”',
  'parse.line': 'Linia {line}',

  'editor.title': 'Automat',
  'editor.examples': 'Exemplu…',
  'editor.help': 'Format: <code>start: q0</code>, <code>final: q1, q2</code>, apoi câte o linie pe tranziție: <code>q0 a q1 q2</code>. Folosește <code>ε</code> sau <code>eps</code> pentru cuvântul vid și <code>#</code> pentru comentarii.',
  'stepper.first': 'Primul',
  'stepper.prev': 'Înapoi',
  'stepper.next': 'Înainte',
  'stepper.last': 'Ultimul',
  'stepper.play': 'Redă',
  'stepper.pause': 'Pauză',
  'stepper.step': 'Pasul {i} din {n}',
  'stepper.keys': 'Sfat: folosește săgețile ← →',
  'tester.title': 'Testează un cuvânt',
  'tester.placeholder': 'ex. abba (gol = ε)',
  'tester.accept': 'acceptat',
  'tester.reject': 'respins',
  'result.title': 'Rezultat (text)',
  'result.copy': 'Copiază',
  'result.copied': 'Copiat!',
  'theory.title': 'Teorie',

  'ex.epsilon.abc': 'a*b*c* (lanț de ε)',
  'ex.epsilon.union': '(ab)* ∪ a*',
  'ex.epsilon.chain': 'a(b|ε)c',
  'ex.nfa.endsAb': 'Se termină în „ab”',
  'ex.nfa.thirdLast': 'Al treilea simbol de la final este „a” (8 submulțimi)',
  'ex.nfa.aaOrBb': 'Conține „aa” sau „bb”',
  'ex.nfa.epsilon': '(a|b)*abb cu ε',
  'ex.dfa.hopcroft': 'AFD clasic cu 8 stări (Hopcroft)',
  'ex.dfa.evenA': 'Număr par de a',
  'ex.dfa.partial': 'Începe cu „ab” (δ parțială)',

  'epsilon.goto.nfa': 'Transformă rezultatul în AFD →',
  'epsilon.none': 'Acest automat nu are ε-tranziții; algoritmul doar recalculează aceleași tranziții. Încearcă un exemplu cu ε.',
  'epsilon.tbl.closures': 'ε-închideri',
  'epsilon.tbl.delta': 'Tranziții noi',
  'epsilon.s.intro.t': 'Automatul inițial',
  'epsilon.s.intro.b': 'Automatul are {n} ε-tranziți(i) (punctate / evidențiate). Le vom înlocui cu tranziții obișnuite astfel încât limbajul acceptat să rămână același.',
  'epsilon.s.closure.t': 'ε-închiderea lui {q}',
  'epsilon.s.closure.b': 'ε-cl({q}) este mulțimea stărilor în care se poate ajunge din {q} folosind doar ε-tranziții (inclusiv {q}): ε-cl({q}) = {cl}.',
  'epsilon.s.closure.b1': 'Din {q} nu pleacă nicio ε-tranziție, deci ε-cl({q}) = {cl}.',
  'epsilon.s.delta.t': "δ'({q}, {a})",
  'epsilon.s.delta.b': "δ'({q}, {a}) = ε-cl(δ(ε-cl({q}), {a})) = ε-cl(δ({cl}, {a})) = ε-cl({mid}) = {fin}. Adăugăm aceste tranziții în noul automat.",
  'epsilon.s.delta.empty': "δ'({q}, {a}) = ε-cl(δ({cl}, {a})) = ε-cl({mid}) = ∅, deci nu se adaugă nicio tranziție.",
  'epsilon.s.finals.t': 'Stările finale',
  'epsilon.s.finals.b': "O stare q devine finală dacă ε-cl(q) conține o stare finală. F = {F}, devin finale: {added}. Deci F' = {F2}.",
  'epsilon.s.finals.none': "O stare q este finală dacă ε-cl(q) conține o stare finală. Nu apar stări finale noi: F' = {F2}.",
  'epsilon.s.unreach.t': 'Eliminarea stărilor inaccesibile',
  'epsilon.s.unreach.b': 'Fără ε-tranziții, în stările {list} nu se mai poate ajunge din starea inițială, deci le putem șterge.',
  'epsilon.s.done.t': 'Gata',
  'epsilon.s.done.b': 'Automatul din dreapta nu are ε-tranziții și acceptă exact același limbaj ca cel inițial.',

  'subset.goto.min': 'Minimizează acest AFD →',
  'subset.includeEmpty': 'Păstrează ∅ ca stare capcană (AFD complet)',
  'subset.tbl': 'Tabelul submulțimilor',
  'subset.s.intro.t': 'AFN-ul',
  'subset.s.intro.b': 'Fiecare stare a AFD-ului va fi o mulțime de stări ale AFN-ului: „toate stările în care AFN-ul poate fi simultan”. Construim doar submulțimile accesibile.',
  'subset.s.intro.epsilon': 'Acest AFN are ε-tranziții. Fiecare stare a AFD-ului va fi o mulțime <b>ε-închisă</b> de stări: după fiecare mutare adăugăm și tot ce se atinge prin ε.',
  'subset.s.start.t': 'Starea inițială',
  'subset.s.start.b': 'AFD-ul pornește din mulțimea care conține doar starea inițială a AFN-ului: {S}.',
  'subset.s.start.epsilon': 'AFD-ul pornește din ε-cl({q0}) = {S}.',
  'subset.s.move.t': 'Din {S} cu {a}',
  'subset.s.move.new': '{parts}. Reuniunea este {mv}. {closure} Mulțimea {T} este <b>nouă</b>, deci devine o stare nouă a AFD-ului și se adaugă în tabel.',
  'subset.s.move.old': '{parts}. Reuniunea este {mv}. {closure} Mulțimea {T} există deja, deci doar adăugăm tranziția {S} —{a}→ {T}.',
  'subset.s.move.skip': '{parts}. Reuniunea este vidă, deci nu există tranziție (am ales să nu desenăm starea capcană ∅).',
  'subset.s.finals.t': 'Stările finale',
  'subset.s.finals.b': 'O stare a AFD-ului este finală dacă conține cel puțin o stare finală a AFN-ului din {F}. Stări finale: {F2}.',
  'subset.s.done.t': 'Gata',
  'subset.s.done.b': 'AFD-ul are {n} stări și acceptă același limbaj ca AFN-ul.',

  'min.goto.input': 'Folosește AFD-ul rezultat ca intrare',
  'min.notDfa': 'Minimizarea necesită un automat determinist (fără ε, cel mult o destinație pentru fiecare stare și simbol).',
  'min.convert': 'Transformă-l mai întâi în AFD →',
  'min.s.intro.t': 'AFD-ul inițial',
  'min.s.intro.b': 'Minimizăm în 3 etape: (1) eliminăm stările inaccesibile, (2) completăm δ cu o stare capcană dacă e nevoie, (3) unim stările echivalente rafinând partițiile ≡0, ≡1, ….',
  'min.s.reach.t': 'Stările accesibile',
  'min.s.reach.b': 'Pornind din starea inițială ajungem în {reach}. Stările {list} sunt inaccesibile și se elimină.',
  'min.s.reach.none': 'Toate stările sunt accesibile din starea inițială: {reach}. Nu eliminăm nimic.',
  'min.s.complete.t': 'Completarea AFD-ului',
  'min.s.complete.b': 'Lipsesc unele tranziții ({list}). Adăugăm o stare capcană {sink} care buclează pe orice simbol și trimitem acolo toate tranzițiile lipsă.',
  'min.s.eq0.t': 'Echivalența ≡0',
  'min.s.eq0.b': 'Inițial separăm doar stările finale de cele nefinale: {classes}. (Cuvântul vid le distinge.)',
  'min.s.iter.t': 'De la ≡{k} la ≡{k1}',
  'min.s.iter.b': 'Două stări rămân în aceeași clasă doar dacă erau în aceeași clasă ≡{k} <b>și</b> pentru orice simbol ajung în stări din aceeași clasă ≡{k}. Clasele se despart: ≡{k1}: {classes}.',
  'min.s.iter.stable': 'Nicio clasă nu se mai desparte: ≡{k1} = ≡{k}. Partiția e stabilă, deci acestea sunt clasele de stări echivalente: {classes}.',
  'min.s.quotient.t': 'AFD-ul minimal',
  'min.s.quotient.b': 'Fiecare clasă devine o singură stare; tranziția unei clase se ia de la oricare dintre stările ei. Din {n} stări am obținut {m}.',

  'pump.general': 'Demonstrație (pentru p oarecare)',
  'pump.g.lbl.assume': 'Presupunere',
  'pump.g.lbl.word': 'Alegerea lui w',
  'pump.g.lbl.lemma': 'Condițiile lemei',
  'pump.g.lbl.split': 'Forma descompunerii',
  'pump.g.lbl.pump': 'Pompare',
  'pump.g.lbl.contra': 'Contradicție',
  'pump.g.lbl.end': 'Concluzie',
  'pump.g.assume': 'Presupunem, prin reducere la absurd, că L este regulat. Fie p ≥ 1 constanta dată de lema de pompare. Nu cunoaștem valoarea lui p, deci raționamentul trebuie să funcționeze pentru <b>orice</b> p.',
  'pump.g.word': 'Alegem {w}.',
  'pump.g.lemma': 'Conform lemei, există o descompunere w = xyz astfel încât: <b>(1)</b> |xy| ≤ p, <b>(2)</b> |y| ≥ 1, <b>(3)</b> xy<sup>i</sup>z ∈ L pentru orice i ≥ 0. Nu știm care este această descompunere, deci lucrăm cu una oarecare, folosind doar (1) și (2).',
  'pump.g.end': 'Contradicția a fost obținută pentru o descompunere oarecare care respectă (1) și (2), deci presupunerea este falsă: <b>L nu este regulat</b>. ∎',
  'pump.example': 'Verificare pe un exemplu concret',
  'pump.example.b': 'Demonstrația de mai sus este valabilă pentru orice p. Ca să o vezi „în acțiune”, o verificăm pe un p generat aleator.',
  'pump.lang': 'Limbaj',
  'pump.newP': 'Alt p aleator',
  'pump.s1': '1. Un p concret',
  'pump.s1.b': 'Pentru ilustrare luăm <b>p = {p}</b> (generat aleator).',
  'pump.s2': '2. Alegem un cuvânt w ∈ L cu |w| ≥ p',
  'pump.s2.b': 'Alegem w = {w}, cu |w| = {len} ≥ {p}.',
  'pump.s3': '3. Orice descompunere w = xyz cu |xy| ≤ p, |y| ≥ 1',
  'pump.s3.b': 'Lema spune doar că <i>există</i> o descompunere, deci trebuie să le învingem pe <b>toate</b>. Încearcă-le cu glisoarele:',
  'pump.xlen': '|x|',
  'pump.ylen': '|y|',
  'pump.s4': '4. Pompăm: alegem i',
  'pump.s4.b': 'Lema afirmă că xy<sup>i</sup>z ∈ L pentru orice i ≥ 0. Găsește un i pentru care nu e adevărat:',
  'pump.in': '∈ L — acest i nu dă o contradicție, încearcă altul.',
  'pump.out': '∉ L — contradicție pentru această descompunere!',
  'pump.hint': 'Indiciu: i = {i} funcționează pentru această descompunere.',
  'pump.s5': '5. Toate descompunerile',
  'pump.s5.b': 'Există {n} descompuneri posibile. Pentru fiecare există un i cu xy<sup>i</sup>z ∉ L:',
  'pump.col.i': 'i',
  'pump.col.pumped': 'xyⁱz',

  'theory.epsilon': `
<p>Un <b>AFN-ε</b> își poate schimba starea fără să citească un simbol. Pentru a elimina ε-tranzițiile folosim <b>ε-închiderea</b>:</p>
<p class="formula">ε-cl(q) = { r | r se atinge din q folosind doar ε-tranziții } (q ∈ ε-cl(q))</p>
<p>Noul automat A' = (Q, Σ, δ', q<sub>0</sub>, F') are aceleași stări și:</p>
<ul>
<li class="formula">δ'(q, a) = ε-cl( δ( ε-cl(q), a ) )</li>
<li class="formula">F' = { q ∈ Q | ε-cl(q) ∩ F ≠ ∅ }</li>
</ul>
<p>Intuiție: un pas al lui A' pe <i>a</i> = „oricâți pași ε, apoi un pas cu <i>a</i>, apoi oricâți pași ε”. O stare devine finală dacă poate ajunge într-o stare finală doar prin ε. La final, stările devenite inaccesibile pot fi eliminate.</p>`,
  'theory.nfa': `
<p>Pentru orice AFN există un AFD echivalent (<b>construcția submulțimilor</b>). O stare a AFD-ului este o <b>mulțime</b> de stări ale AFN-ului.</p>
<ul>
<li>Starea inițială: {q<sub>0</sub>} (sau ε-cl(q<sub>0</sub>) dacă există ε-tranziții).</li>
<li class="formula">δ<sub>D</sub>(S, a) = ⋃<sub>q ∈ S</sub> δ(q, a)   (urmată de ε-cl dacă e cazul)</li>
<li>Stări finale: toate mulțimile S cu S ∩ F ≠ ∅.</li>
</ul>
<p>Construim doar submulțimile <b>accesibile</b>, cu o listă de lucru: luăm o mulțime neprocesată, calculăm tranziția ei pe fiecare simbol și adăugăm mulțimile noi în listă. În cel mai rău caz sunt 2<sup>|Q|</sup> submulțimi. Mulțimea vidă ∅ este o stare capcană; poate fi omisă dacă se acceptă un AFD parțial.</p>`,
  'theory.min': `
<p>Un AFD este <b>minimal</b> dacă niciun AFD cu mai puține stări nu acceptă același limbaj. AFD-ul minimal este unic (până la redenumirea stărilor).</p>
<ol>
<li><b>Stările inaccesibile</b> — în care nu se poate ajunge din q<sub>0</sub> — se elimină.</li>
<li>Dacă δ este parțială, adăugăm o stare <b>capcană</b> pentru ca δ să fie totală.</li>
<li><b>Stări echivalente</b>: p ≡ q dacă pentru orice cuvânt w, δ(p, w) ∈ F ⟺ δ(q, w) ∈ F. Calculăm ≡ prin rafinări succesive:
  <ul>
  <li class="formula">≡<sub>0</sub>: {F, Q ∖ F}</li>
  <li class="formula">p ≡<sub>k+1</sub> q ⟺ p ≡<sub>k</sub> q și δ(p, a) ≡<sub>k</sub> δ(q, a) pentru orice a ∈ Σ</li>
  </ul>
  Ne oprim când ≡<sub>k+1</sub> = ≡<sub>k</sub>.</li>
<li>Fiecare clasă de echivalență devine o stare a AFD-ului minimal.</li>
</ol>`,
  'theory.pump': `
<p><b>Lema de pompare pentru limbaje regulate.</b> Dacă L este regulat, atunci există p ≥ 1 astfel încât orice w ∈ L cu |w| ≥ p se poate scrie w = xyz cu:</p>
<ol>
<li>|xy| ≤ p,</li>
<li>|y| ≥ 1,</li>
<li>xy<sup>i</sup>z ∈ L pentru orice i ≥ 0.</li>
</ol>
<p><b>Șablonul demonstrației (prin reducere la absurd)</b> — gândește-te la un joc contra unui adversar:</p>
<ol>
<li>Presupunem că L e regulat; adversarul alege p.</li>
<li><b>Tu</b> alegi un cuvânt w ∈ L cu |w| ≥ p (inteligent, astfel încât xy să cadă într-o zonă utilă).</li>
<li>Adversarul alege <b>orice</b> descompunere w = xyz cu |xy| ≤ p, |y| ≥ 1 — trebuie să le tratezi pe toate.</li>
<li><b>Tu</b> alegi i ≥ 0 astfel încât xy<sup>i</sup>z ∉ L. Contradicție ⇒ L nu este regulat.</li>
</ol>
<p>Atenție: lema este doar o condiție necesară. Poate arăta că un limbaj <i>nu</i> este regulat, niciodată că este.</p>`,
};
