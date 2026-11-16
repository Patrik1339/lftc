import { useI18n } from '../i18n';
import type { PageId } from './common';

interface Topic {
  id: PageId;
  icon: string;
  nav: string;
  desc: string;
}

const GROUPS: { id: 'grammar' | 'automata'; title: string; desc: string; flow: string; topics: Topic[] }[] = [
  {
    id: 'automata',
    title: 'home.groupAutomata',
    desc: 'home.groupAutomataDesc',
    flow: 'home.flow',
    topics: [
      { id: 'epsilon', icon: 'ε', nav: 'nav.epsilon', desc: 'home.epsilon' },
      { id: 'nfa', icon: '⇉', nav: 'nav.nfa', desc: 'home.nfa' },
      { id: 'min', icon: '⊟', nav: 'nav.min', desc: 'home.min' },
      { id: 'pump', icon: 'xyⁱz', nav: 'nav.pump', desc: 'home.pump' },
    ],
  },
  {
    id: 'grammar',
    title: 'home.groupGrammar',
    desc: 'home.groupGrammarDesc',
    flow: 'home.flowCfg',
    topics: [
      { id: 'chomsky', icon: '3⊂2⊂1⊂0', nav: 'nav.chomsky', desc: 'home.chomsky' },
      { id: 'bnf', icon: '::=', nav: 'nav.bnf', desc: 'home.bnf' },
      { id: 'cfg', icon: 'A→BC', nav: 'nav.cfg', desc: 'home.cfg' },
      { id: 'lr', icon: 'A→Aα', nav: 'nav.lr', desc: 'home.lr' },
      { id: 'amb', icon: '⋀ ≠ ⋀', nav: 'nav.amb', desc: 'home.amb' },
    ],
  },
];

export function HomePage({ goTo }: { goTo: (p: PageId) => void }) {
  const { t } = useI18n();
  return (
    <>
      <section className="hero">
        <span className="hero-badge">{t('home.badge')}</span>
        <h1 className="hero-title">{t('app.title')}</h1>
        <p className="hero-sub">{t('app.subtitle')}</p>
        <p className="lead">{t('home.intro')}</p>
      </section>
      {GROUPS.map((g) => (
        <section key={g.id} className={`topic-group group-${g.id}`}>
          <div className="group-head">
            <h2>{t(g.title)}</h2>
            <span className="group-count">
              {g.topics.length} {t('home.topics')}
            </span>
          </div>
          <p className="muted group-desc">{t(g.desc)}</p>
          <div className="topics">
            {g.topics.map((tp) => (
              <button key={tp.id} className="topic card" onClick={() => goTo(tp.id)}>
                <span className="topic-icon">{tp.icon}</span>
                <span className="topic-name">{t(tp.nav)}</span>
                <span className="topic-desc">{t(tp.desc)}</span>
                <span className="topic-go">
                  {t('home.open')} <span aria-hidden>→</span>
                </span>
              </button>
            ))}
          </div>
          <p className="flow">{t(g.flow)}</p>
        </section>
      ))}
    </>
  );
}
