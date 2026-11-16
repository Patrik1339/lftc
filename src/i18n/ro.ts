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
  'home.badge': 'Ghid interactiv de studiu',
  'home.groupGrammar': 'Gramatici',
  'home.groupGrammarDesc': 'Clasificare, notații, forme normale și ambiguitatea gramaticilor independente de context.',
  'home.groupAutomata': 'Automate finite și limbaje regulate',
  'home.groupAutomataDesc': 'De la AFN-ε la AFD-ul minimal și demonstrația că un limbaj nu este regulat.',
  'home.open': 'Deschide',
  'home.topics': 'subiecte',
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
  // gramatici (comun)
  'nav.cfg': 'FNC & FNG',
  'nav.lr': 'Recursivitate stângă',
  'home.cfg': 'Adu orice gramatică independentă de context la forma normală Chomsky și apoi Greibach: ε-producții, redenumiri, simboluri inutile, FNC, FNG.',
  'home.lr': 'Detectează recursivitatea stângă directă și indirectă și elimin-o cu algoritmul clasic de substituție.',
  'home.flowCfg': 'Pentru gramatici: gramatică → (ε, redenumiri, neproductive, inaccesibile) → gramatică redusă → FNC → FNG.',
  'gparse.noArrow': 'o producție se scrie: A -> α | β',
  'gparse.badLhs': '„{name}” nu este neterminal (neterminalele încep cu literă mare)',
  'gparse.empty': 'gramatica nu are producții',
  'gparse.badStart': 'simbolul de start „{name}” nu are producții',
  'geditor.title': 'Gramatică',
  'geditor.help': 'Câte o linie pe neterminal: <code>S -> aSb | AB | ε</code>. Neterminalele sunt litere mari, eventual cu indice (<code>A1</code>, <code>X_a</code>, <code>S\'</code>); orice alt caracter este terminal. Folosește <code>ε</code>, <code>eps</code> sau <code>λ</code> pentru cuvântul vid. Prima linie dă simbolul de start.',
  'gview.original': 'Gramatica inițială',
  'gview.building': 'Gramatica în construcție',
  'gview.before': 'Înainte',
  'gview.after': 'După',
  'gview.cnf': 'Forma normală Chomsky (FNC)',
  'gview.gnf': 'Forma normală Greibach (FNG)',
  'col.prod': 'Producție',
  'col.newProds': 'Producții noi',
  'col.copied': 'Producții copiate',
  'col.terminal': 'Terminal',
  'col.newNt': 'Neterminal nou',
  'col.replacedBy': 'Înlocuită cu',
  'gtester.placeholder': 'ex. aabb (gol = ε)',
  'gtester.yes': 'generat',
  'gtester.no': 'negenerat',
  'gtester.sample': 'Cuvintele de lungime ≤ {n} (gramatica inițială)',
  'gtester.same': 'toate gramaticile generează exact aceste cuvinte',
  'gtester.differ': 'gramaticile generează cuvinte scurte diferite',
  'ex.cfg.full': 'Exemplu complet (fiecare pas are ce face)',
  'ex.cfg.anbn': 'aⁿbⁿ (S → aSb | ε)',
  'ex.cfg.paren': 'Paranteze echilibrate',
  'ex.cfg.expr': 'Expresii aritmetice',
  'ex.cfg.cnfIndirect': 'Deja în FNC, recursivitate stângă indirectă',
  'ex.lr.expr': 'Expresii E, T, F (directă)',
  'ex.lr.indirect': 'Indirectă: S → Aa, A → Sd',
  'ex.lr.multi': 'Mai multe alternative recursive',
  'ex.lr.cycle3': 'Indirectă prin 3 neterminale',
  'ex.lr.epsilon': 'Cu ε-producții (necesită curățare)',

  // FNC & FNG
  'cfg.emptyLang': 'Simbolul de start este neproductiv, deci <b>L(G) = ∅</b>: nu avem ce aduce la formă normală.',
  'cfg.tooLarge': 'Forma Greibach a acestei gramatici are peste {n} producții, așa că ne oprim după FNC. (FNG poate fi exponențial mai mare.)',
  'cfg.goto.lr': 'Elimină recursivitatea stângă din gramatica redusă →',
  'cfg.ph.eps': 'ε-producții',
  'cfg.ph.unit': 'Redenumiri',
  'cfg.ph.prod': 'Neproductive',
  'cfg.ph.acc': 'Inaccesibile',
  'cfg.ph.cnf': 'FNC',
  'cfg.ph.gnf': 'FNG',
  'cfg.tbl.nullable': 'Neterminale anulabile (A ⇒* ε)',
  'cfg.tbl.unit': 'Mulțimile de redenumire',
  'cfg.tbl.productive': 'Neterminale productive',
  'cfg.tbl.accessible': 'Simboluri accesibile',
  'cfg.tbl.order': 'Ordinea neterminalelor',

  'cfg.eps.none.t': '1. ε-producții',
  'cfg.eps.none.b': 'Gramatica nu are ε-producții. Nu avem nimic de făcut la acest pas.',
  'cfg.eps.onlyStart.b': 'Singura ε-producție este {S} → ε, iar {S} nu apare în nicio parte dreaptă, ceea ce este permis. Nu avem nimic de făcut la acest pas.',
  'cfg.eps.null.t': '1. Neterminale anulabile: N{i}',
  'cfg.eps.null0.b': 'Căutăm întâi neterminalele care derivă ε. Pornim de la cele cu ε-producție (tăiate — vor dispărea): N<sub>0</sub> = {A | A → ε} = {N}.',
  'cfg.eps.nullI.b': 'N<sub>{i}</sub> = N<sub>{i1}</sub> ∪ {A | A → α, α ∈ N<sub>{i1}</sub>*}: un neterminal este anulabil dacă are o parte dreaptă formată doar din neterminale anulabile. N<sub>{i}</sub> = {N}.',
  'cfg.eps.stable.t': '1. Mulțimea neterminalelor anulabile',
  'cfg.eps.stable.b': 'N<sub>{k1}</sub> = N<sub>{k}</sub>, deci iterația se oprește. Neterminale anulabile: N<sub>ε</sub> = {N}.',
  'cfg.eps.prod.t': '1. Producții noi pentru {A}',
  'cfg.eps.prod.b': 'Pentru fiecare producție a lui {A} adăugăm toate variantele obținute prin <b>ștergerea oricărei submulțimi de apariții</b> ale simbolurilor anulabile {N} (dar niciodată varianta vidă). ε-producțiile dispar.',
  'cfg.eps.start.t': '1. Este ε în limbaj?',
  'cfg.eps.start.new': 'Simbolul de start {S} este anulabil, deci ε ∈ L(G) și trebuie păstrat. Cum {S} apare în părți drepte, adăugăm un nou simbol de start {S1} → {S} | ε ({S1} nu apare în nicio parte dreaptă).',
  'cfg.eps.start.keep': 'Simbolul de start {S} este anulabil, deci ε ∈ L(G). {S} nu apare în nicio parte dreaptă, așa că păstrăm pur și simplu {S} → ε.',
  'cfg.eps.done.t': '1. Fără ε-producții',
  'cfg.eps.done.b': 'Noua gramatică nu are ε-producții (cu excepția eventuală a S → ε, cu S absent din părțile drepte) și generează același limbaj.',

  'cfg.unit.none.t': '2. Redenumiri',
  'cfg.unit.none.b': 'Nu există redenumiri (producții de forma A → B). Nu avem nimic de făcut la acest pas.',
  'cfg.unit.sets.t': '2. Mulțimile de redenumire N<sub>A</sub>',
  'cfg.unit.sets.b': 'O <b>redenumire</b> este o producție A → B cu B neterminal (tăiate). Pentru fiecare A calculăm N<sub>A</sub> = {B | A ⇒* B folosind doar redenumiri}: pornim de la {A} și adăugăm C ori de câte ori B → C cu B deja în mulțime.',
  'cfg.unit.prod.t': '2. Producțiile lui {A}',
  'cfg.unit.prod.b': 'N<sub>A</sub> = {NA}. {A} își păstrează producțiile care nu sunt redenumiri și primește toate producțiile (ne-redenumiri) ale fiecărui B ∈ N<sub>A</sub>: A → α ori de câte ori B → α nu este redenumire.',
  'cfg.unit.done.t': '2. Fără redenumiri',
  'cfg.unit.done.b': 'Toate redenumirile au fost înlocuite cu producțiile la care duc.',

  'cfg.prod.iter.t': '3. Neterminale productive: N{i}',
  'cfg.prod.iter1.b': 'Un neterminal este <b>productiv</b> dacă derivă un cuvânt format doar din terminale. N<sub>0</sub> = ∅ și N<sub>1</sub> = {A | A → x, x ∈ Σ*} = {N}.',
  'cfg.prod.iterI.b': 'N<sub>{i}</sub> = {A | A → α, α ∈ (N<sub>{i1}</sub> ∪ Σ)*}: părți drepte doar cu terminale și neterminale deja productive. N<sub>{i}</sub> = {N}.',
  'cfg.prod.none.t': '3. Toate neterminalele sunt productive',
  'cfg.prod.none.b': 'Iterația este stabilă, iar N = {N} conține toate neterminalele. Nu eliminăm nimic.',
  'cfg.prod.remove.t': '3. Eliminăm simbolurile neproductive',
  'cfg.prod.remove.b': 'Iterația este stabilă: N = {N}. Neterminalele neproductive {bad} nu pot încheia nicio derivare, deci le eliminăm împreună cu <b>toate producțiile în care apar</b>.',
  'cfg.prod.empty.t': '3. Limbajul este vid',
  'cfg.prod.empty.b': 'Simbolul de start {S} nu este productiv (N = {N}), deci L(G) = ∅. Algoritmul se oprește.',

  'cfg.acc.iter.t': '4. Simboluri accesibile: V{i}',
  'cfg.acc.iter0.b': 'Un simbol este <b>accesibil</b> dacă apare într-o formă propozițională derivată din {S}. Pornim cu V<sub>0</sub> = {V}.',
  'cfg.acc.iterI.b': 'V<sub>{i}</sub> = V<sub>{i1}</sub> ∪ {X | A → αXβ, A ∈ V<sub>{i1}</sub>}: adăugăm toate simbolurile din părțile drepte ale neterminalelor accesibile. V<sub>{i}</sub> = {V}.',
  'cfg.acc.none.t': '4. Toate simbolurile sunt accesibile',
  'cfg.acc.none.b': 'Iterația este stabilă și toate simbolurile sunt accesibile. Nu eliminăm nimic. Gramatica este acum <b>redusă</b> (proprie).',
  'cfg.acc.remove.t': '4. Eliminăm simbolurile inaccesibile',
  'cfg.acc.remove.b': 'V = {V}. Simbolurile {bad} nu pot fi atinse din simbolul de start, deci le eliminăm împreună cu producțiile lor. Gramatica este acum <b>redusă</b> (proprie).',

  'cfg.cnf.intro.t': '5. Spre forma normală Chomsky',
  'cfg.cnf.intro.b': 'În FNC fiecare producție este A → BC sau A → a (plus S → ε dacă e nevoie). Producțiile marcate nu au această formă: conțin terminale lângă alte simboluri sau au mai mult de două simboluri.',
  'cfg.cnf.intro.ok': 'Toate producțiile au deja forma A → BC sau A → a (plus eventual S → ε). Gramatica este deja în FNC.',
  'cfg.cnf.term.t': '5a. Terminale în producții lungi',
  'cfg.cnf.term.b': 'În fiecare parte dreaptă de lungime ≥ 2 înlocuim fiecare terminal a cu un neterminal nou X<sub>a</sub> și adăugăm X<sub>a</sub> → a.',
  'cfg.cnf.long.t': '5b. Spargem producțiile lungi ale lui {A}',
  'cfg.cnf.long.b': 'O producție A → B<sub>1</sub>B<sub>2</sub>…B<sub>k</sub> cu k ≥ 3 devine lanțul A → B<sub>1</sub>Y<sub>1</sub>, Y<sub>1</sub> → B<sub>2</sub>Y<sub>2</sub>, …, Y<sub>k-2</sub> → B<sub>k-1</sub>B<sub>k</sub>, cu neterminale noi Y (cozile identice refolosesc același Y).',
  'cfg.cnf.done.t': '5. Gramatica în FNC',
  'cfg.cnf.done.b': 'Toate producțiile au acum forma A → BC sau A → a (și eventual S → ε).',

  'cfg.gnf.intro.t': '6. Spre forma normală Greibach',
  'cfg.gnf.intro.b': 'În FNG fiecare producție este A → aα cu a ∈ Σ și α ∈ N*. Pornim de la FNC și numerotăm cele {n} neterminale A<sub>1</sub>, …, A<sub>n</sub>. Scopul primei treceri: orice producție A<sub>i</sub> → A<sub>j</sub>γ are j &gt; i.',
  'cfg.gnf.intro.eps': 'În FNG fiecare producție este A → aα cu a ∈ Σ și α ∈ N*. Punem deoparte {S} → ε (o adăugăm la final) și numerotăm cele {n} neterminale A<sub>1</sub>, …, A<sub>n</sub>. Scopul primei treceri: orice producție A<sub>i</sub> → A<sub>j</sub>γ are j &gt; i.',
  'cfg.gnf.sub.t': '6. Substituim {Aj} în producțiile lui {Ai}',
  'cfg.gnf.sub.b': '{Ai} (i = {i}) are producții care încep cu {Aj} (j = {j} &lt; i). Înlocuim fiecare {Ai} → {Aj}γ cu {Ai} → δγ pentru fiecare producție {Aj} → δ.',
  'cfg.gnf.lr.t': '6. Recursivitatea stângă a lui {A}',
  'cfg.gnf.lr.b': '{A} este acum direct recursiv la stânga: {A} → {A}α cu α ∈ {alphas}; celelalte producții sunt β ∈ {betas}. Cu neterminalul nou {Z}: {A} → β | β{Z} și {Z} → α | α{Z} (varianta fără ε).',
  'cfg.gnf.back.t': '6. Substituția înapoi',
  'cfg.gnf.back.b': 'Acum orice A<sub>i</sub> → A<sub>j</sub>γ are j &gt; i, deci ultimul neterminal {An} are doar producții care încep cu terminal. Mergând înapoi (A<sub>n-1</sub>, …, A<sub>1</sub>, apoi Z-urile), substituim neterminalele de la început care încep deja cu terminale. Producțiile marcate încep încă cu un neterminal.',
  'cfg.gnf.backsub.t': '6. Substituim în {A}',
  'cfg.gnf.backsub.b': 'Producții ale lui {A} încep cu {B}, ale căror producții încep toate, deja, cu un terminal. După substituție, toate producțiile lui {A} încep cu un terminal.',
  'cfg.gnf.backsubZ.b': 'Producțiile neterminalului nou {A} încep cu {B}; acestea încep deja cu terminale, deci le substituim.',
  'cfg.gnf.unused.t': 'Eliminăm neterminalele inaccesibile',
  'cfg.gnf.unused.b': 'După substituții, {bad} nu mai apar în nicio parte dreaptă accesibilă din simbolul de start, deci le eliminăm.',
  'cfg.gnf.done.t': '6. Gramatica în FNG',
  'cfg.gnf.done.b': 'Fiecare producție are forma A → aα (un terminal urmat de neterminale). În total {n} producții.',
  'cfg.gnf.done.eps': 'Fiecare producție are forma A → aα, plus {S} → ε, pe care am adăugat-o înapoi. În total {n} producții.',

  // recursivitate stângă
  'lr.variant': 'Forma producțiilor noi',
  'lr.variant.eps': "cu ε: A → βA', A' → αA' | ε (analizoare LL)",
  'lr.variant.noeps': "fără ε: A → β | βA', A' → α | αA' (pentru FNG)",
  'lr.needClean.eps': 'Algoritmul cere o gramatică <b>fără ε-producții</b> (ele pot ascunde recursivitate stângă, de ex. A → BAα cu B ⇒ ε).',
  'lr.needClean.cycle': 'Algoritmul cere o gramatică <b>fără cicluri</b> A ⇒⁺ A (formate din redenumiri).',
  'lr.clean': 'Elimină întâi ε-producțiile și redenumirile',
  'lr.result': 'Fără recursivitate stângă',
  'lr.tbl.detect': 'Recursivitate stângă',
  'lr.col.corners': 'A ⇒⁺ B… pentru B în',
  'lr.col.direct': 'directă',
  'lr.col.indirect': 'indirectă',
  'lr.s.detect.t': 'Detectăm recursivitatea stângă',
  'lr.s.detect.b': 'A este <b>recursiv la stânga</b> dacă A ⇒⁺ Aα. Pentru fiecare neterminal listăm neterminalele care pot apărea primele într-o formă propozițională derivată din el. Recursive la stânga: {list}. Numerotăm neterminalele A<sub>1</sub>, …, A<sub>n</sub> în ordinea din tabel.',
  'lr.s.detect.none': 'Niciun neterminal nu poate deriva o formă propozițională care începe cu el însuși, deci gramatica nu are recursivitate stângă. Nu avem nimic de făcut.',
  'lr.s.sub.t': 'i = {i}: substituim {Aj} în {Ai}',
  'lr.s.sub.b': '{Ai} are producții {Ai} → {Aj}γ cu j = {j} &lt; i = {i}. Le înlocuim cu {Ai} → δγ pentru fiecare {Aj} → δ. Cum {Aj} a fost deja prelucrat, rezultă doar producții care încep cu un terminal, cu A<sub>k</sub> cu k &gt; j, sau cu {Ai} însuși (recursivitate directă).',
  'lr.s.direct.t': 'i = {i}: recursivitatea stângă directă a lui {A}',
  'lr.s.noDirect.b': '{A} nu are producții de forma {A} → {A}α, deci rămâne neschimbat.',
  'lr.s.direct.eps': 'Separăm producțiile: {A} → {A}α cu α ∈ {alphas} și {A} → β cu β ∈ {betas}. Cum {A} ⇒* βα…α, generăm aceleași cuvinte de la stânga la dreapta: {A} → β{Z} și {Z} → α{Z} | ε.',
  'lr.s.direct.noeps': 'Separăm producțiile: {A} → {A}α cu α ∈ {alphas} și {A} → β cu β ∈ {betas}. Cum {A} ⇒* βα…α, generăm aceleași cuvinte de la stânga la dreapta: {A} → β | β{Z} și {Z} → α | α{Z}.',
  'lr.s.done.t': 'Gata',
  'lr.s.done.b': 'Gramatica din dreapta nu are recursivitate stângă (directă sau indirectă) și generează același limbaj.',

  'theory.cfg': `
<p>O gramatică independentă de context G = (N, Σ, P, S) se aduce la formă normală într-o ordine fixă. Fiecare pas păstrează L(G).</p>
<h4>1. ε-producții</h4>
<p class="formula">N<sub>0</sub> = {A | A → ε},   N<sub>i+1</sub> = N<sub>i</sub> ∪ {A | A → α, α ∈ N<sub>i</sub>*}</p>
<p>Fiecare producție A → α este înlocuită cu toate variantele obținute prin ștergerea unor apariții ale simbolurilor anulabile (în afară de ε). Dacă S este anulabil, ε ∈ L(G): păstrăm S → ε, folosind un nou start S' → S | ε când S apare într-o parte dreaptă.</p>
<div class="example">S → aSb | ε   ⇒   S' → S | ε,  S → aSb | ab</div>
<h4>2. Redenumiri (A → B)</h4>
<p class="formula">N<sub>A</sub> = {B ∈ N | A ⇒* B} ;   A → α pentru orice B ∈ N<sub>A</sub>, B → α care nu e redenumire</p>
<div class="example">S → A | a,  A → bA | c   ⇒   S → a | bA | c,  A → bA | c</div>
<h4>3. Simboluri neproductive</h4>
<p class="formula">N<sub>0</sub> = ∅,   N<sub>i+1</sub> = {A | A → α, α ∈ (N<sub>i</sub> ∪ Σ)*}</p>
<p>Neterminalele din afara lui N se elimină, împreună cu toate producțiile în care apar. Dacă S ∉ N, atunci L(G) = ∅.</p>
<h4>4. Simboluri inaccesibile</h4>
<p class="formula">V<sub>0</sub> = {S},   V<sub>i+1</sub> = V<sub>i</sub> ∪ {X | A → αXβ, A ∈ V<sub>i</sub>}</p>
<p>Ordinea 3 → 4 contează: eliminarea simbolurilor neproductive poate face altele inaccesibile, nu invers.</p>
<div class="example">S → a | AB,  A → a   (B neproductiv) ⇒ S → a,  A → a ⇒ (A inaccesibil) S → a</div>
<h4>5. Forma normală Chomsky (FNC)</h4>
<p>Producții <span class="formula">A → BC</span> sau <span class="formula">A → a</span> (și S → ε dacă ε ∈ L, cu S absent din părțile drepte). Pornind de la gramatica redusă:</p>
<ol><li>în părțile drepte de lungime ≥ 2, înlocuim fiecare terminal a cu X<sub>a</sub> și adăugăm X<sub>a</sub> → a;</li>
<li>înlocuim A → B<sub>1</sub>…B<sub>k</sub> (k ≥ 3) cu A → B<sub>1</sub>Y<sub>1</sub>, Y<sub>1</sub> → B<sub>2</sub>Y<sub>2</sub>, …, Y<sub>k-2</sub> → B<sub>k-1</sub>B<sub>k</sub>.</li></ol>
<div class="example">S → aSb | ab   ⇒   S → X<sub>a</sub>Y<sub>1</sub> | X<sub>a</sub>X<sub>b</sub>,  Y<sub>1</sub> → SX<sub>b</sub>,  X<sub>a</sub> → a,  X<sub>b</sub> → b</div>
<h4>6. Forma normală Greibach (FNG)</h4>
<p>Producții <span class="formula">A → aα</span>, a ∈ Σ, α ∈ N* (și S → ε). Pornind de la FNC, cu neterminalele ordonate A<sub>1</sub>, …, A<sub>n</sub>:</p>
<ol><li>pentru i = 1..n: pentru j &lt; i, substituim A<sub>j</sub> în fiecare A<sub>i</sub> → A<sub>j</sub>γ; apoi eliminăm recursivitatea stângă directă a lui A<sub>i</sub> cu un nou Z<sub>i</sub> (A<sub>i</sub> → β | βZ<sub>i</sub>, Z<sub>i</sub> → α | αZ<sub>i</sub>);</li>
<li>acum A<sub>i</sub> → A<sub>j</sub>γ implică j &gt; i, deci A<sub>n</sub> începe cu terminale; substituim înapoi în A<sub>n-1</sub>, …, A<sub>1</sub>;</li>
<li>la final substituim în producțiile Z (ele încep cu un A<sub>k</sub>).</li></ol>
<div class="example">A<sub>1</sub> → A<sub>2</sub>A<sub>2</sub> | a,  A<sub>2</sub> → A<sub>1</sub>A<sub>2</sub> | b<br>A<sub>2</sub> → A<sub>2</sub>A<sub>2</sub>A<sub>2</sub> | aA<sub>2</sub> | b   ⇒   A<sub>2</sub> → aA<sub>2</sub> | b | aA<sub>2</sub>Z | bZ,  Z → A<sub>2</sub>A<sub>2</sub> | A<sub>2</sub>A<sub>2</sub>Z<br>apoi în A<sub>1</sub> și Z se substituie în față producțiile lui A<sub>2</sub>.</div>`,
  'theory.lr': `
<p>O gramatică este <b>recursivă la stânga</b> dacă un neterminal A are o derivare A ⇒⁺ Aα. Recursivitatea este <b>directă</b> dacă A → Aα este producție și <b>indirectă</b> altfel (de ex. S → Aa, A → Sd).</p>
<p>De ce o eliminăm: un analizor descendent (recursiv / LL) care expandează A l-ar apela din nou pe A fără să consume intrare — buclă infinită. Este și un pas al formei normale Greibach.</p>
<h4>Recursivitate stângă directă</h4>
<p>Grupăm producțiile lui A: <span class="formula">A → Aα<sub>1</sub> | … | Aα<sub>m</sub> | β<sub>1</sub> | … | β<sub>n</sub></span> (niciun β nu începe cu A). A generează un β<sub>j</sub> urmat de orice șir de α-uri, deci îl generăm de la stânga la dreapta cu un neterminal nou A':</p>
<ul><li class="formula">cu ε:  A → β<sub>1</sub>A' | … | β<sub>n</sub>A',   A' → α<sub>1</sub>A' | … | α<sub>m</sub>A' | ε</li>
<li class="formula">fără ε:  A → β<sub>j</sub> | β<sub>j</sub>A',   A' → α<sub>i</sub> | α<sub>i</sub>A'</li></ul>
<div class="example">E → E+T | T   ⇒   E → TE',  E' → +TE' | ε   (sau  E → T | TE',  E' → +T | +TE')</div>
<div class="example">A → Aa | Ab | c | d   ⇒   A → cA' | dA',  A' → aA' | bA' | ε</div>
<h4>Recursivitate stângă indirectă (algoritmul general)</h4>
<p>Condiție: fără ε-producții și fără cicluri A ⇒⁺ A. Ordonăm neterminalele A<sub>1</sub>, …, A<sub>n</sub>.</p>
<p class="formula">pentru i = 1..n:<br>&emsp;pentru j = 1..i−1: înlocuim fiecare A<sub>i</sub> → A<sub>j</sub>γ cu A<sub>i</sub> → δγ pentru toate A<sub>j</sub> → δ<br>&emsp;eliminăm recursivitatea stângă directă a lui A<sub>i</sub></p>
<p>Invariant: după pasul i, orice A<sub>i</sub> → A<sub>k</sub>γ are k &gt; i, deci nu mai poate rămâne niciun ciclu de „primele simboluri”.</p>
<div class="example">S → Aa | b,  A → Ac | Sd | c<br>i = 2, j = 1:  A → Ac | Aad | bd | c<br>directă:  A → bdA' | cA',  A' → cA' | adA' | ε</div>`,
  // ambiguitate
  'nav.amb': 'Ambiguitate',
  'home.amb': 'Caută un cuvânt cu doi arbori de derivare diferiți și compară cele două derivări stângi și cele două derivări drepte.',
  'ex.amb.expr': 'E → E+E | E*E (ambiguă)',
  'ex.amb.dangling': '„Dangling else”',
  'ex.amb.eps': 'S → AB cu A, B anulabile',
  'ex.amb.concat': 'Concatenare S → SS',
  'ex.amb.inherent': 'Limbaj inerent ambiguu',
  'ex.amb.exprFixed': 'E, T, F (neambiguă)',
  'amb.maxLen': 'Caută toate cuvintele de lungime ≤ {n}',
  'amb.ownWord': 'Sau verifică un cuvânt anume',
  'amb.ownWord.ph': 'ex. a+a*a (gol = căutare)',
  'amb.found': '<b>Gramatica este ambiguă.</b> Cel mai scurt cuvânt cu doi arbori de derivare diferiți este <b>{w}</b> (lungime {n}).',
  'amb.notFound': 'Niciun cuvânt de lungime ≤ {n} nu are doi arbori de derivare ({count} cuvinte generate, toate verificate). Asta <b>nu</b> demonstrează că gramatica e neambiguă — ambiguitatea este nedecidabilă în general — dar este un indiciu bun. Încearcă o lungime mai mare.',
  'amb.word.none': 'Cuvântul <b>{w}</b> nu este generat de gramatică.',
  'amb.word.one': 'Cuvântul <b>{w}</b> are un singur arbore de derivare, deci nu demonstrează ambiguitatea.',
  'amb.word.two': '<b>{w}</b> are (cel puțin) doi arbori de derivare diferiți, deci gramatica este ambiguă.',
  'amb.trees': 'Arbori de derivare',
  'amb.trees.b': 'Ambii arbori au rădăcina {root} și aceeași frontieră <b>{w}</b>. Subarborii evidențiați arată unde folosesc prima dată producții diferite.',
  'amb.single.tree': 'Singurul arbore de derivare al lui <b>{w}</b>, cu rădăcina {root}.',
  'amb.treeN': 'Arborele {n}',
  'amb.left': 'Derivări de stânga',
  'amb.right': 'Derivări de dreapta',
  'amb.left.b': 'La fiecare pas se rescrie neterminalul <u>cel mai din stânga</u> (subliniat; producția folosită e în dreapta). Fiecare arbore are exact o derivare de stânga, deci doi arbori dau două derivări de stânga distincte ale aceluiași cuvânt. Linia evidențiată arată unde se despart.',
  'amb.right.b': 'La fiecare pas se rescrie neterminalul <u>cel mai din dreapta</u>. Și aici, doi arbori diferiți dau două derivări de dreapta diferite ale aceluiași cuvânt; linia evidențiată arată unde se despart.',
  'amb.single.deriv': 'Neterminalul rescris este subliniat; producția folosită e în dreapta.',
  'amb.derivN': 'Derivarea {n}',
  'theory.amb': `
<p>O gramatică independentă de context G este <b>ambiguă</b> dacă un cuvânt w ∈ L(G) are doi <b>arbori de derivare</b> diferiți. Echivalent, w are două derivări <b>de stânga</b> diferite, sau două derivări <b>de dreapta</b> diferite (fiecărui arbore îi corespunde exact o derivare de stânga și una de dreapta).</p>
<p>Două derivări care doar rescriu neterminalele în altă ordine (același arbore) <i>nu</i> contează — de aceea comparăm stânga cu stânga și dreapta cu dreapta.</p>
<h4>Exemplu</h4>
<div class="example">E → E+E | E*E | a,   w = a+a*a<br>
E ⇒ <u>E</u>+E ⇒ a+<u>E</u> ⇒ a+<u>E</u>*E ⇒ a+a*<u>E</u> ⇒ a+a*a   (a+(a*a))<br>
E ⇒ <u>E</u>*E ⇒ <u>E</u>+E*E ⇒ a+<u>E</u>*E ⇒ a+a*<u>E</u> ⇒ a+a*a   ((a+a)*a)</div>
<h4>De reținut</h4>
<ul>
<li>Ambiguitatea este <b>nedecidabilă</b>: niciun algoritm nu o decide pentru orice gramatică. Aici căutăm toate cuvintele până la o lungime: găsirea unui cuvânt demonstrează ambiguitatea, negăsirea nu demonstrează contrariul.</li>
<li>Ambiguitatea este o proprietate a <b>gramaticii</b>; adesea există o gramatică echivalentă neambiguă, de ex. E → E+T | T, T → T*F | F, F → (E) | a (precedență pe niveluri, asociativitate la stânga).</li>
<li>Unele limbaje sunt <b>inerent ambigue</b>: orice gramatică pentru ele este ambiguă, de ex. {a<sup>i</sup>b<sup>j</sup>c<sup>k</sup> | i = j sau j = k}.</li>
<li>Surse tipice: E → EαE (lipsă de precedență/asociativitate), S → SS, „dangling else” și două moduri de a deriva ε.</li>
</ul>`,
  // ierarhia Chomsky
  'nav.chomsky': 'Ierarhia Chomsky',
  'home.chomsky': 'Cele patru tipuri de gramatici (0–3), forma producțiilor, câte un exemplu pentru fiecare și un verificator care află tipul oricărei gramatici.',
  'ex.ch.t3': 'Tip 3 — liniară la dreapta (se termină cu b)',
  'ex.ch.t2': 'Tip 2 — aⁿbⁿ',
  'ex.ch.t1': 'Tip 1 — aⁿbⁿcⁿ',
  'ex.ch.t0': 'Tip 0 — a^(2ⁿ)',
  'ex.ch.t3left': 'Tip 3 — liniară la stânga (începe cu a)',
  'ex.ch.mixed': 'Liniară la dreapta și la stânga amestecat (nu e tip 3)',
  'ex.ch.t2eps': 'Tip 2 cu o ε-producție',
  'ex.ch.t1eps': 'Tip 1 cu S → ε',
  'chparse.lhsNoNT': 'membrul stâng „{name}” trebuie să conțină un neterminal',
  'ch.diagram': 'Clase de limbaje',
  'ch.diagram.b': 'ℒ<sub>3</sub> ⊊ ℒ<sub>2</sub> ⊊ ℒ<sub>1</sub> ⊊ ℒ<sub>0</sub>: toate incluziunile sunt stricte. Limbajul din dreapta fiecărui inel aparține clasei respective, dar nu și următoarei din interior.',
  'ch.t0.short': 'Tip 0 — recursiv enumerabile',
  'ch.t1.short': 'Tip 1 — dependente de context',
  'ch.t2.short': 'Tip 2 — independente de context',
  'ch.t3.short': 'Tip 3 — regulate',
  'ch.t0.diag': 'problema opririi',
  'ch.t1.diag': 'aⁿbⁿcⁿ',
  'ch.t2.diag': 'aⁿbⁿ',
  'ch.t3.diag': 'a*b*',
  'ch.t0.name': 'Gramatică fără restricții',
  'ch.t1.name': 'Gramatică dependentă de context',
  'ch.t2.name': 'Gramatică independentă de context',
  'ch.t3.name': 'Gramatică regulată',
  'ch.t0.form': 'α → β, α conține un neterminal',
  'ch.t1.form': 'α → β, |α| ≤ |β| (sau αAβ → αγβ, γ ≠ ε); S → ε doar dacă S nu apare în niciun membru drept',
  'ch.t2.form': 'A → β, A ∈ N, β ∈ (N ∪ Σ)*',
  'ch.t3.form': 'A → aB | a (liniară la dreapta) sau A → Ba | a (liniară la stânga); se permite S → ε',
  'ch.t0.machine': 'Mașină Turing',
  'ch.t1.machine': 'Automat liniar mărginit',
  'ch.t2.machine': 'Automat push-down (cu stivă)',
  'ch.t3.machine': 'Automat finit',
  'ch.t0.lang': '{⟨M, w⟩ | M se oprește pe w}',
  'ch.t1.lang': '{a<sup>n</sup>b<sup>n</sup>c<sup>n</sup> | n ≥ 1}, {ww | w ∈ {a,b}*}',
  'ch.t2.lang': '{a<sup>n</sup>b<sup>n</sup> | n ≥ 1}, paranteze echilibrate',
  'ch.t3.lang': 'a*b*, identificatori, numere',
  'ch.t0.cardLang': 'L(G) = {a<sup>2<sup>n</sup></sup> | n ≥ 1} = {aa, aaaa, a<sup>8</sup>, …}',
  'ch.t1.cardLang': 'L(G) = {a<sup>n</sup>b<sup>n</sup>c<sup>n</sup> | n ≥ 1}',
  'ch.t2.cardLang': 'L(G) = {a<sup>n</sup>b<sup>n</sup> | n ≥ 1}',
  'ch.t3.cardLang': 'L(G) = {a, b}*b — cuvintele peste {a, b} care se termină cu b',
  'ch.t0.why': 'Nu e de tip 1: <b>CB → E</b> și <b>AE → ε</b> scurtează forma. A și B sunt marcaje de capăt; C merge spre dreapta dublând fiecare a, apoi D se întoarce (sau E încheie cuvântul și îl șterge pe A). Limbajul în sine este dependent de context — gramatica nu.',
  'ch.t1.why': 'Nu e de tip 2: membrii stângi <b>CB</b>, <b>aB</b>, <b>bB</b>, … au lungime 2 — B devine b doar în <i>contextul</i> a_ sau b_. Toate regulile sunt necontractante, deci e de tip 1.',
  'ch.t2.why': 'Fiecare membru stâng este un singur neterminal, dar în aSb neterminalul e la mijloc, deci nu e liniară: nu e de tip 3. (aⁿbⁿ nu e regulat — vezi lema de pompare.)',
  'ch.t3.why': 'Fiecare membru drept este un terminal, urmat eventual de un singur neterminal: liniară la dreapta. Un automat finit cu starea S și o stare finală acceptă același limbaj.',
  'ch.table': 'Cele patru tipuri pe scurt',
  'ch.col.type': 'Tip',
  'ch.col.grammar': 'Gramatică',
  'ch.col.form': 'Producții',
  'ch.col.machine': 'Recunoscut de',
  'ch.col.example': 'Limbaj exemplu',
  'ch.typeN': 'Tip {n}',
  'ch.examples': 'Câte un exemplu pentru fiecare tip',
  'ch.load': 'Deschide în verificator',
  'ch.derivOf': 'Derivarea lui {w}',
  'ch.wordsUpTo': 'Cuvinte de lungime ≤ {n}:',
  'ch.checker': 'De ce tip este gramatica mea?',
  'ch.checker.b': 'Scrie orice gramatică — membrii stângi pot fi șiruri precum <code>CB</code> sau <code>aB</code>. Verificatorul testează condițiile de la tipul cel mai restrictiv (3) la cel mai general (0) și arată prima producție care o încalcă pe fiecare.',
  'ch.editor.help': 'Câte o regulă pe linie: <code>S -> aSBC | aBC</code>, <code>CB -> BC</code>. Membrul stâng poate fi orice șir cu cel puțin un neterminal. Neterminalele sunt litere mari (eventual cu indice: <code>A1</code>, <code>X_a</code>); orice alt caracter este terminal. <code>ε</code> / <code>eps</code> pentru cuvântul vid. Simbolul de start este S (sau primul neterminal, sau <code>start: X</code>).',
  'ch.verdict': 'Gramatica este de tip {n}: {name}.',
  'ch.linear.right': 'Toate producțiile sunt <b>liniare la dreapta</b> (A → wB sau A → w).',
  'ch.linear.left': 'Toate producțiile sunt <b>liniare la stânga</b> (A → Bw sau A → w).',
  'ch.r.startEps': 'o ε-producție a simbolului de start este permisă doar dacă S nu apare în niciun membru drept',
  'ch.r.contracting': 'membrul drept este mai scurt decât cel stâng (regulă contractantă)',
  'ch.r.lhs': 'membrul stâng nu este un singur neterminal',
  'ch.r.notLinear': 'nu e liniară: neterminalul nu e la un capăt sau sunt mai multe',
  'ch.r.mixed': 'reguli liniare la dreapta amestecate cu reguli liniare la stânga — astfel se pot genera limbaje neregulate',
  'ch.note.eps': 'Tipul 1 nu e satisfăcut doar din cauza ε-producțiilor. Ele pot fi eliminate (vezi <b>FNC &amp; FNG</b>, pasul 1) cu o gramatică echivalentă, deci limbajul este oricum dependent de context.',
  'ch.note.lang': 'Acesta este tipul <i>gramaticii</i>. Limbajul generat poate fi de un tip mai restrictiv, dacă există o altă gramatică pentru el.',
  'ch.gen': 'Cuvinte generate de lungime ≤ {n}',
  'ch.gen.none': 'niciunul',
  'ch.gen.truncated': '(căutarea s-a oprit mai devreme — lista poate fi incompletă)',
  'ch.ownWord': 'Derivează un cuvânt',
  'ch.ownWord.ph': 'de ex. aabbcc',
  'ch.ownWord.none': 'Nu s-a găsit nicio derivare pentru <b>{w}</b>.',
  'theory.chomsky': `
<p>O gramatică este G = (N, Σ, P, S): neterminale N, terminale Σ, simbol de start S ∈ N și producții <span class="formula">α → β</span> cu α ∈ (N ∪ Σ)*N(N ∪ Σ)* (cel puțin un neterminal în stânga) și β ∈ (N ∪ Σ)*. Chomsky (1956) a clasificat gramaticile după cât de restrânse sunt producțiile:</p>
<h4>Tip 0 — fără restricții</h4>
<p>Nicio restricție în afară de cea de mai sus. Generează limbajele <b>recursiv enumerabile</b> (cele acceptate de mașini Turing).</p>
<div class="example">S → aAb,  aA → aaAb,  A → ε   (aici: aⁿbⁿ, n ≥ 1)</div>
<h4>Tip 1 — dependente de context</h4>
<p>Fiecare producție este <b>necontractantă</b>: <span class="formula">|α| ≤ |β|</span>. Formă echivalentă: <span class="formula">αAβ → αγβ</span>, γ ≠ ε — A este rescris în γ doar în contextul α_β. Excepție: S → ε, dacă S nu apare în niciun membru drept.</p>
<div class="example">S → aSBC | aBC,  CB → BC,  aB → ab,  bB → bb,  bC → bc,  cC → cc   (aⁿbⁿcⁿ)</div>
<h4>Tip 2 — independente de context</h4>
<p>Membrul stâng este <b>un singur neterminal</b>: <span class="formula">A → β</span>. A este înlocuit indiferent de vecinii săi.</p>
<div class="example">S → aSb | ab   (aⁿbⁿ),    E → E+T | T,  T → T*F | F,  F → (E) | a</div>
<h4>Tip 3 — regulate</h4>
<p><b>Liniare la dreapta</b>: <span class="formula">A → aB | a</span>, sau <b>liniare la stânga</b>: <span class="formula">A → Ba | a</span> (a ∈ Σ), plus S → ε. Toate regulile trebuie să fie de aceeași parte. Adesea se permite și forma extinsă A → wB | w, w ∈ Σ*; ea generează aceleași limbaje.</p>
<div class="example">S → aS | bA | b,  A → bA | b   (a*b⁺)</div>
<h4>De reținut</h4>
<ul>
<li>Un <b>limbaj</b> este de tip k dacă <i>o</i> gramatică de tip k îl generează. Clasele formează o ierarhie strictă ℒ<sub>3</sub> ⊊ ℒ<sub>2</sub> ⊊ ℒ<sub>1</sub> ⊊ ℒ<sub>0</sub>.</li>
<li>Orice gramatică de tip 3 este de tip 2. Gramaticile de tip 2 cu ε-producții nu sunt literal de tip 1, dar ε-producțiile se pot elimina mereu, deci ℒ<sub>2</sub> ⊆ ℒ<sub>1</sub> rămâne adevărat pentru limbaje.</li>
<li>Apartenența (w ∈ L(G)?) este decidabilă pentru tipurile 1, 2, 3 — la tipul 1 formele propoziționale nu devin mai lungi decât w — și nedecidabilă pentru tipul 0.</li>
</ul>`,
  // BNF & EBNF
  'nav.bnf': 'BNF & EBNF',
  'home.bnf': 'Notațiile folosite pentru sintaxa limbajelor de programare: metasimboluri, conversia EBNF → BNF și exemple rezolvate.',
  'bnf.meta': 'Metasimboluri',
  'bnf.col.meaning': 'Semnificație',
  'bnf.meta.def': 'se definește ca',
  'bnf.meta.alt': 'alternativă (sau)',
  'bnf.meta.nt': 'neterminal (categorie sintactică)',
  'bnf.meta.t': 'terminal (text literal)',
  'bnf.meta.cat': 'concatenare',
  'bnf.meta.opt': 'opțional: de 0 sau 1 ori',
  'bnf.meta.rep': 'repetiție: de 0 sau mai multe ori',
  'bnf.meta.group': 'grupare',
  'bnf.meta.end': 'sfârșitul regulii',
  'bnf.meta.b': 'Multe unelte folosesc în schimb un EBNF asemănător expresiilor regulate: <code>x?</code> opțional, <code>x*</code> de zero sau mai multe ori, <code>x+</code> de una sau mai multe ori, iar concatenarea prin alăturare (ANTLR, specificațiile W3C, gramatica Python).',
  'bnf.rules': 'Din EBNF în BNF',
  'bnf.rules.b': 'Fiecare construcție EBNF se înlocuiește cu un neterminal nou &lt;N&gt; și reguli BNF simple. Repetiția devine recursivitate — singurul mod în care BNF poate spune „de mai multe ori”. Deci EBNF e mai comod, dar nu mai puternic: ambele descriu exact limbajele independente de context.',
  'bnf.col.construct': 'Construcție',
  'bnf.rule.opt': 'Opțional [ β ]',
  'bnf.rule.rep': 'Repetiție { β }',
  'bnf.rule.group': 'Grupare ( β | γ )',
  'bnf.rule.plus': 'Una sau mai multe β+',
  'bnf.examples': 'Exemple',
  'bnf.asGrammar': 'Ca gramatică (notația A → α)',
  'bnf.toAmb': 'Arbori de derivare →',
  'bnf.toChomsky': 'Verifică tipul →',
  'bnf.ex.digits.title': 'Număr fără semn',
  'bnf.ex.digits.note': 'BNF trebuie să folosească recursivitatea (&lt;digit&gt; &lt;number&gt;) pentru „una sau mai multe cifre”; EBNF scrie o cifră urmată de o repetiție.',
  'bnf.ex.signed.title': 'Întreg cu semn opțional',
  'bnf.ex.signed.note': 'Semnul opțional cere o a doua alternativă în BNF; în EBNF este un singur <code>[ … ]</code>. Gruparea <code>( "+" | "-" )</code> din interior evită numele &lt;sign&gt;.',
  'bnf.ex.ident.title': 'Identificator',
  'bnf.ex.ident.note': 'O literă urmată de oricâte litere sau cifre. Varianta BNF este recursivă la stânga; varianta EBNF nu are deloc recursivitate.',
  'bnf.ex.list.title': 'Listă separată prin virgule',
  'bnf.ex.list.note': 'Tiparul <code>x { "," x }</code> — un element, apoi oricâte „, element” — este felul în care se scriu separatorii în EBNF.',
  'bnf.ex.expr.title': 'Expresie aritmetică',
  'bnf.ex.expr.note': 'Precedența vine din niveluri: expr → term → factor. Recursivitatea stângă din BNF (asociativitate la stânga) devine o repetiție în EBNF, adică exact bucla pe care o implementează un parser recursiv descendent.',
  'bnf.ex.if.title': 'Instrucțiunea if',
  'bnf.ex.if.note': 'Ramura else opțională. Ambele variante sunt ambigue pentru <code>if c then if d then s else t</code> („dangling else”); limbajele rezolvă cu regula „else aparține celui mai apropiat if”.',
  'theory.bnf': `
<p><b>BNF</b> (Backus–Naur Form) este o notație pentru gramatici independente de context, introdusă de John Backus și Peter Naur pentru raportul ALGOL 60 (1960). Este modul standard de a descrie <b>sintaxa</b> limbajelor de programare.</p>
<p>O regulă BNF <span class="formula"><span class="bnf-nt">&lt;A&gt;</span> ::= α | β</span> este exact producția <span class="formula">A → α | β</span>: neterminalele se scriu între paranteze unghiulare, terminalele ca text literal (aici între ghilimele), <code>::=</code> se citește „se definește ca”, iar <code>|</code> separă alternativele.</p>
<div class="example"><span class="bnf-nt">&lt;bit&gt;</span> ::= "0" | "1"<br><span class="bnf-nt">&lt;bits&gt;</span> ::= <span class="bnf-nt">&lt;bit&gt;</span> | <span class="bnf-nt">&lt;bit&gt;</span> <span class="bnf-nt">&lt;bits&gt;</span>     ⟺     B → 0 | 1,  S → B | BS</div>
<h4>EBNF — BNF extins</h4>
<p>Propus de Niklaus Wirth (1977) și standardizat ca ISO/IEC 14977 (1996). Adaugă trei construcții care elimină majoritatea neterminalelor auxiliare și a recursivității:</p>
<ul>
<li><code>[ α ]</code> — α este <b>opțional</b> (de 0 sau 1 ori);</li>
<li><code>{ α }</code> — α se <b>repetă</b> de 0 sau mai multe ori;</li>
<li><code>( α | β )</code> — <b>gruparea</b> unor alternative în interiorul unei reguli.</li>
</ul>
<p>În EBNF ISO neterminalele nu au paranteze, terminalele sunt între ghilimele, <code>=</code> definește, <code>,</code> concatenează și <code>;</code> încheie regula.</p>
<div class="example">bits = bit , { bit } ;</div>
<h4>De reținut</h4>
<ul>
<li>BNF, EBNF și notația A → α au <b>aceeași putere</b>: descriu limbajele independente de context (tip 2). EBNF este doar mai scurt.</li>
<li>Orice regulă EBNF se transformă în BNF introducând neterminale noi (tabelul de mai jos).</li>
<li>Diagramele de sintaxă (railroad diagrams) desenează aceleași reguli EBNF ca grafuri.</li>
<li>Condițiile de context (o variabilă trebuie declarată, tipurile trebuie să se potrivească) nu se pot scrie în BNF; ele se verifică ulterior, la analiza semantică.</li>
</ul>`,
};
