import { useI18n } from '../i18n';
import type { PageId } from './common';

const TOPICS: { id: PageId; icon: string; nav: string; desc: string }[] = [
  { id: 'epsilon', icon: 'ε', nav: 'nav.epsilon', desc: 'home.epsilon' },
  { id: 'nfa', icon: '⇉', nav: 'nav.nfa', desc: 'home.nfa' },
  { id: 'min', icon: '⊟', nav: 'nav.min', desc: 'home.min' },
  { id: 'pump', icon: 'xyⁱz', nav: 'nav.pump', desc: 'home.pump' },
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
    </>
  );
}
