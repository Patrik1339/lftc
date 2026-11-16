import { useCallback, useEffect, useState } from 'react';
import { DFA_EXAMPLES, EPSILON_EXAMPLES, NFA_EXAMPLES } from './automata/examples';
import { AMB_EXAMPLES, CFG_EXAMPLES, LR_EXAMPLES } from './grammar/examples';
import { useI18n } from './i18n';
import type { PageId } from './pages/common';
import { AmbiguityPage } from './pages/Ambiguity';
import { HomePage } from './pages/Home';
import { EpsilonPage } from './pages/Epsilon';
import { LeftRecPage } from './pages/LeftRec';
import { MinimizePage } from './pages/Minimize';
import { NormalFormsPage } from './pages/Normal';
import { NfaToDfaPage } from './pages/NfaToDfa';
import { PumpingPage } from './pages/Pumping';

const PAGES: PageId[] = ['home', 'epsilon', 'nfa', 'min', 'pump', 'cfg', 'lr', 'amb'];
const pageFromHash = (): PageId => {
  const h = window.location.hash.slice(1) as PageId;
  return PAGES.includes(h) ? h : 'home';
};

type Texts = Record<'epsilon' | 'nfa' | 'min' | 'cfg' | 'lr' | 'amb', string>;

export function App() {
  const { t, lang, setLang } = useI18n();
  const [page, setPage] = useState<PageId>(pageFromHash);
  const [texts, setTexts] = useState<Texts>({
    epsilon: EPSILON_EXAMPLES[0].text,
    nfa: NFA_EXAMPLES[0].text,
    min: DFA_EXAMPLES[0].text,
    cfg: CFG_EXAMPLES[0].text,
    lr: LR_EXAMPLES[0].text,
    amb: AMB_EXAMPLES[0].text,
  });

  useEffect(() => {
    const on = () => setPage(pageFromHash());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);

  const goTo = useCallback((p: PageId, text?: string) => {
    if (text !== undefined && p !== 'home' && p !== 'pump') setTexts((old) => ({ ...old, [p]: text }));
    window.location.hash = p;
    window.scrollTo({ top: 0 });
  }, []);
  const setText = (p: keyof Texts) => (text: string) => setTexts((old) => ({ ...old, [p]: text }));

  return (
    <>
      <header className="app-header">
        <div className="brand" onClick={() => goTo('home')}>
          <b>{t('app.title')}</b>
          <span className="muted small">{t('app.subtitle')}</span>
        </div>
        <nav>
          {PAGES.map((p) => (
            <a key={p} href={`#${p}`} className={p === page ? 'active' : undefined}>
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
        {page !== 'home' && <h1>{t(`nav.${page}`)}</h1>}
        {page === 'home' && <HomePage goTo={goTo} />}
        {page === 'epsilon' && <EpsilonPage text={texts.epsilon} setText={setText('epsilon')} goTo={goTo} />}
        {page === 'nfa' && <NfaToDfaPage text={texts.nfa} setText={setText('nfa')} goTo={goTo} />}
        {page === 'min' && <MinimizePage text={texts.min} setText={setText('min')} goTo={goTo} />}
        {page === 'pump' && <PumpingPage />}
        {page === 'cfg' && <NormalFormsPage text={texts.cfg} setText={setText('cfg')} goTo={goTo} />}
        {page === 'lr' && <LeftRecPage text={texts.lr} setText={setText('lr')} goTo={goTo} />}
        {page === 'amb' && <AmbiguityPage text={texts.amb} setText={setText('amb')} goTo={goTo} />}
      </main>
    </>
  );
}
