import { useI18n } from '../i18n';
import type { PageId } from './common';

const TOPICS: { id: PageId; icon: string; nav: string; desc: string }[] = [
  { id: 'chomsky', icon: '3⊂2⊂1⊂0', nav: 'nav.chomsky', desc: 'home.chomsky' },
  { id: 'bnf', icon: '::=', nav: 'nav.bnf', desc: 'home.bnf' },
  { id: 'epsilon', icon: 'ε', nav: 'nav.epsilon', desc: 'home.epsilon' },
  { id: 'nfa', icon: '⇉', nav: 'nav.nfa', desc: 'home.nfa' },
  { id: 'min', icon: '⊟', nav: 'nav.min', desc: 'home.min' },
  { id: 'pump', icon: 'xyⁱz', nav: 'nav.pump', desc: 'home.pump' },
  { id: 'cfg', icon: 'A→BC', nav: 'nav.cfg', desc: 'home.cfg' },
  { id: 'lr', icon: 'A→Aα', nav: 'nav.lr', desc: 'home.lr' },
  { id: 'amb', icon: '⋀ ≠ ⋀', nav: 'nav.amb', desc: 'home.amb' },
];

export function HomePage({ goTo }: { goTo: (p: PageId) => void }) {
  const { t } = useI18n();
  return (
    <>
      <p className="lead">{t('home.intro')}</p>
      <div className="topics">
        {TOPICS.map((tp) => (
          <button key={tp.id} className="topic card" onClick={() => goTo(tp.id)}>
            <span className="topic-icon">{tp.icon}</span>
            <span className="topic-name">{t(tp.nav)}</span>
            <span className="topic-desc">{t(tp.desc)}</span>
          </button>
        ))}
      </div>
      <p className="muted">{t('home.flow')}</p>
      <p className="muted">{t('home.flowCfg')}</p>
    </>
  );
}
