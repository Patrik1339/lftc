import { Fragment, useState } from 'react';
import { derives, wordsUpTo } from '../grammar/membership';
import { Grammar, GrammarView as View, pkey, rhsHtml, serializeGrammar, symHtml } from '../grammar/types';
import { Html, useI18n } from '../i18n';

export function GrammarBox({ view }: { view: View }) {
  const { tx } = useI18n();
  const { grammar: g, highlight: h = {} } = view;
  const altClass = (k: string) =>
    h.added?.includes(k) ? 'p-add' : h.removed?.includes(k) ? 'p-del' : h.marked?.includes(k) ? 'p-mark' : undefined;
  return (
    <figure className="graph gram">
      {view.title && <Html as="div" className="graph-title" html={tx(view.title)} />}
      <div className="gram-lines">
        {g.nonterminals
          .filter((A) => g.prods[A].length)
          .map((A) => (
            <div key={A} className={h.dim?.includes(A) ? 'gram-line dim' : h.nts?.includes(A) ? 'gram-line hl' : 'gram-line'}>
              <span className="gram-lhs" dangerouslySetInnerHTML={{ __html: symHtml(A) }} />
              <span className="gram-arrow">→</span>
              <span>
                {g.prods[A].map((r, i) => (
                  <Fragment key={i}>
                    {i > 0 && <span className="gram-bar"> | </span>}
                    <span className={altClass(pkey(A, r))} dangerouslySetInnerHTML={{ __html: rhsHtml(r) }} />
                  </Fragment>
                ))}
              </span>
            </div>
          ))}
      </div>
    </figure>
  );
}

export function GrammarText({ title, grammar, actions }: { title: string; grammar: Grammar; actions?: React.ReactNode }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const text = serializeGrammar(grammar);
  return (
    <div className="card result">
      <div className="editor-head">
        <h3>{title}</h3>
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

const SAMPLE_LEN = 4;

/** Checks a word against several grammars, and lists the short words each one generates. */
export function GrammarTester({ grammars }: { grammars: { label: string; grammar: Grammar }[] }) {
  const { t } = useI18n();
  const [word, setWord] = useState('');
  const w = [...word.replace(/\s+/g, '')];
  const samples = grammars.map(({ grammar }) => wordsUpTo(grammar, SAMPLE_LEN).map((x) => x || 'ε'));
  const same = samples.every((s) => s.join(' ') === samples[0].join(' '));
  return (
    <div className="card tester">
      <h3>{t('tester.title')}</h3>
      <input value={word} onChange={(e) => setWord(e.target.value)} placeholder={t('gtester.placeholder')} spellCheck={false} />
      <ul>
        {grammars.map(({ label, grammar }) => {
          const ok = derives(grammar, w);
          return (
            <li key={label}>
              <span>{label}:</span> <b className={ok ? 'ok' : 'bad'}>{ok ? `✓ ${t('gtester.yes')}` : `✗ ${t('gtester.no')}`}</b>
            </li>
          );
        })}
      </ul>
      <h3 className="sample-title">{t('gtester.sample', { n: SAMPLE_LEN })}</h3>
      <p className="mono small sample">{samples[0].join(', ') || '∅'}</p>
      <p className={same ? 'ok small' : 'bad small'}>{same ? `✓ ${t('gtester.same')}` : `✗ ${t('gtester.differ')}`}</p>
    </div>
  );
}
