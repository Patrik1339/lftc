import { useCallback, useEffect, useState } from 'react';
import { DFA_EXAMPLES, EPSILON_EXAMPLES, NFA_EXAMPLES } from './automata/examples';
import { AMB_EXAMPLES, CFG_EXAMPLES, CHOMSKY_EXAMPLES, LR_EXAMPLES } from './grammar/examples';
import { useI18n } from './i18n';
import { PDA_EXAMPLES } from './pda/examples';
import type { PageId } from './pages/common';
import { AmbiguityPage } from './pages/Ambiguity';
import { BnfPage } from './pages/Bnf';
import { ChomskyPage } from './pages/Chomsky';
import { HomePage } from './pages/Home';
import { EpsilonPage } from './pages/Epsilon';
import { LeftRecPage } from './pages/LeftRec';
import { MinimizePage } from './pages/Minimize';
import { NormalFormsPage } from './pages/Normal';
import { NfaToDfaPage } from './pages/NfaToDfa';
import { PdaPage } from './pages/Pda';
import { PracticePage } from './pages/Practice';
import { PumpingPage } from './pages/Pumping';

const PAGES: PageId[] = ['home', 'chomsky', 'bnf', 'epsilon', 'nfa', 'min', 'pump', 'cfg', 'lr', 'amb', 'pda', 'practice'];
const pageFromHash = (): PageId => {
  const h = window.location.hash.slice(1) as PageId;
  return PAGES.includes(h) ? h : 'home';
};

type Texts = Record<'chomsky' | 'epsilon' | 'nfa' | 'min' | 'cfg' | 'lr' | 'amb' | 'pda', string>;

export function App() {
  const { t, lang, setLang } = useI18n();
  const [page, setPage] = useState<PageId>(pageFromHash);
  const [texts, setTexts] = useState<Texts>({
    chomsky: CHOMSKY_EXAMPLES[0].text,
    epsilon: EPSILON_EXAMPLES[0].text,
    nfa: NFA_EXAMPLES[0].text,
    min: DFA_EXAMPLES[0].text,
    cfg: CFG_EXAMPLES[0].text,
    lr: LR_EXAMPLES[0].text,
    amb: AMB_EXAMPLES[0].text,
    pda: PDA_EXAMPLES[0].text,
  });

  useEffect(() => {
    const on = () => setPage(pageFromHash());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);

  // On narrow screens the nav scrolls sideways; keep the current page's tab visible.
  useEffect(() => {
    document.querySelector('nav a.active')?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, [page]);

  const goTo = useCallback((p: PageId, text?: string) => {
    if (text !== undefined) setTexts((old) => (p in old ? { ...old, [p]: text } : old));
    window.location.hash = p;
    window.scrollTo({ top: 0 });
  }, []);
  const setText = (p: keyof Texts) => (text: string) => setTexts((old) => ({ ...old, [p]: text }));

  return (
    <>
      <header className="app-header">
        <div className="brand" onClick={() => goTo('home')}>
          <span className="brand-mark" aria-hidden>
            ε
          </span>
          <span className="brand-text">
            <b>{t('app.title')}</b>
            <span className="muted small">{t('app.subtitle')}</span>
          </span>
        </div>
        <nav>
          {PAGES.map((p) => (
            <a key={p} href={`#${p}`} className={[p === page && 'active', p === 'practice' && 'nav-practice'].filter(Boolean).join(' ') || undefined}>
              {t(`nav.${p}`)}
            </a>
          ))}
        </nav>
        <div className="lang-toggle">
          {(['ro', 'en'] as const).map((l) => (
            <button key={l} className={l === lang ? 'active' : undefined} onClick={() => setLang(l)}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </header>
      <main>
        {page !== 'home' && <h1 className="page-title">{t(`nav.${page}`)}</h1>}
        {page === 'home' && <HomePage goTo={goTo} />}
        {page === 'chomsky' && <ChomskyPage text={texts.chomsky} setText={setText('chomsky')} goTo={goTo} />}
        {page === 'bnf' && <BnfPage goTo={goTo} />}
        {page === 'epsilon' && <EpsilonPage text={texts.epsilon} setText={setText('epsilon')} goTo={goTo} />}
        {page === 'nfa' && <NfaToDfaPage text={texts.nfa} setText={setText('nfa')} goTo={goTo} />}
        {page === 'min' && <MinimizePage text={texts.min} setText={setText('min')} goTo={goTo} />}
        {page === 'pump' && <PumpingPage />}
        {page === 'cfg' && <NormalFormsPage text={texts.cfg} setText={setText('cfg')} goTo={goTo} />}
        {page === 'lr' && <LeftRecPage text={texts.lr} setText={setText('lr')} goTo={goTo} />}
        {page === 'practice' && <PracticePage goTo={goTo} />}
        {page === 'amb' && <AmbiguityPage text={texts.amb} setText={setText('amb')} goTo={goTo} />}
        {page === 'pda' && <PdaPage text={texts.pda} setText={setText('pda')} goTo={goTo} />}
      </main>
    </>
  );
}
