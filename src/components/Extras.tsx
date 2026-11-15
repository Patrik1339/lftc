import { useState } from 'react';
import { serializeAutomaton } from '../automata/parse';
import { accepts, splitWord } from '../automata/simulate';
import type { Automaton } from '../automata/types';
import { Html, useI18n } from '../i18n';

export function Theory({ html }: { html: string }) {
  const { t } = useI18n();
  return (
    <details className="theory card" open>
      <summary>{t('theory.title')}</summary>
      <Html as="div" html={html} />
    </details>
  );
}

/** Runs one word through several automata so students can check they agree. */
export function WordTester({ automata }: { automata: { label: string; automaton: Automaton }[] }) {
  const { t } = useI18n();
  const [word, setWord] = useState('');
  return (
    <div className="card tester">
      <h3>{t('tester.title')}</h3>
      <input value={word} onChange={(e) => setWord(e.target.value)} placeholder={t('tester.placeholder')} spellCheck={false} />
      <ul>
        {automata.map(({ label, automaton }) => {
          const ok = accepts(automaton, splitWord(automaton, word));
          return (
            <li key={label}>
              <span>{label}:</span> <b className={ok ? 'ok' : 'bad'}>{ok ? `✓ ${t('tester.accept')}` : `✗ ${t('tester.reject')}`}</b>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ResultText({ automaton, actions }: { automaton: Automaton; actions?: React.ReactNode }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const text = serializeAutomaton(automaton);
  return (
    <div className="card result">
      <div className="editor-head">
        <h3>{t('result.title')}</h3>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(text).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            });
          }}
        >
          {copied ? t('result.copied') : t('result.copy')}
        </button>
      </div>
      <pre>{text}</pre>
      {actions && <div className="actions">{actions}</div>}
    </div>
  );
}

export function Notice({ html }: { html: string }) {
  return <Html as="div" className="notice" html={html} />;
}
