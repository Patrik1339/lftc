import { Fragment, useMemo, useState } from 'react';
import { AutomatonEditor } from '../components/AutomatonEditor';
import { Theory } from '../components/Extras';
import {
  ChomskyType,
  GeneralDerivation,
  GeneralGrammar,
  classify,
  findDerivation,
  formHtml,
  generateWords,
  parseGeneralGrammar,
  ruleHtml,
  rulesByLhs,
} from '../grammar/chomsky';
import { CHOMSKY_EXAMPLES } from '../grammar/examples';
import { symHtml } from '../grammar/types';
import { Html, useI18n } from '../i18n';
import type { AlgoPageProps } from './common';

const TYPES: ChomskyType[] = [0, 1, 2, 3];
const MAX_N = 10;

/** Sample word and search length for the per-type example cards (CHOMSKY_EXAMPLES[0..3]). */
const CARDS: { type: ChomskyType; word: string; maxLen: number }[] = [
  { type: 3, word: 'abb', maxLen: 3 },
  { type: 2, word: 'aaabbb', maxLen: 8 },
  { type: 1, word: 'aabbcc', maxLen: 9 },
  { type: 0, word: 'aaaa', maxLen: 8 },
];

const parseOrThrow = (text: string): GeneralGrammar => {
  const r = parseGeneralGrammar(text);
  if (!r.ok) throw new Error(`bad built-in example: ${JSON.stringify(r.errors)}`);
  return r.grammar;
};

const rhsHtml = (rhs: string[]) => (rhs.length ? rhs.map(symHtml).join('') : 'ε');

function RulesBox({ g }: { g: GeneralGrammar }) {
  return (
    <div className="gram-lines">
      {rulesByLhs(g).map(({ lhs, rhss }, i) => (
        <div key={i} className="gram-line">
          <span className="gram-lhs" dangerouslySetInnerHTML={{ __html: rhsHtml(lhs) }} />
          <span className="gram-arrow">→</span>
          {rhss.map((r, k) => (
            <Fragment key={k}>
              {k > 0 && <span className="gram-bar"> | </span>}
              <span dangerouslySetInnerHTML={{ __html: rhsHtml(r) }} />
            </Fragment>
          ))}
        </div>
      ))}
    </div>
  );
}

function DerivationLine({ d }: { d: GeneralDerivation }) {
  return (
    <ol className="deriv">
      {d.forms.map((f, i) => (
        <li key={i}>
          <span className="deriv-arrow">{i === 0 ? '' : '⇒'}</span>
          <span dangerouslySetInnerHTML={{ __html: formHtml(f, d.at[i], d.rules[i]?.lhs.length) }} />
          {i < d.rules.length && <span className="deriv-prod" dangerouslySetInnerHTML={{ __html: ruleHtml(d.rules[i]) }} />}
        </li>
      ))}
    </ol>
  );
}

const wordList = (words: string[]) => words.map((w) => w || 'ε').join(', ');

/** Four nested regions: each class of languages strictly contains the next. */
function HierarchyDiagram() {
  const { t } = useI18n();
  const boxes = TYPES.map((k) => ({ k, inset: k * 34 }));
  return (
    <figure className="card chomsky-diagram">
      <div className="graph-title">{t('ch.diagram')}</div>
      <svg viewBox="0 0 480 300" role="img" aria-label={t('ch.diagram')}>
        {boxes.map(({ k, inset }) => (
          <g key={k}>
            <rect
              x={10 + inset}
              y={10 + inset}
              width={460 - 2 * inset}
              height={280 - 2 * inset}
              rx={18}
              className={`ch-region ch-r${k}`}
            />
            <text x={24 + inset} y={32 + inset} className="ch-label">
              {t(`ch.t${k}.short`)}
            </text>
            <text x={456 - inset} y={32 + inset} textAnchor="end" className="ch-ex">
              {t(`ch.t${k}.diag`)}
            </text>
          </g>
        ))}
      </svg>
      <Html as="p" className="muted small" html={t('ch.diagram.b')} />
    </figure>
  );
}

function TypeTable() {
  const { t } = useI18n();
  return (
    <section className="card amb-section">
      <h3>{t('ch.table')}</h3>
      <div className="table-wrap">
        <table className="ch-table">
          <thead>
            <tr>
              <th>{t('ch.col.type')}</th>
              <th>{t('ch.col.grammar')}</th>
              <th>{t('ch.col.form')}</th>
              <th>{t('ch.col.machine')}</th>
              <th>{t('ch.col.example')}</th>
            </tr>
          </thead>
          <tbody>
            {TYPES.map((k) => (
              <tr key={k}>
                <td>
                  <b>{t('ch.typeN', { n: k })}</b>
                </td>
                <Html as="td" html={t(`ch.t${k}.name`)} />
                <Html as="td" html={t(`ch.t${k}.form`)} />
                <Html as="td" html={t(`ch.t${k}.machine`)} />
                <Html as="td" html={t(`ch.t${k}.lang`)} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ExampleCard({ index, onLoad }: { index: number; onLoad: (text: string) => void }) {
  const { t } = useI18n();
  const ex = CHOMSKY_EXAMPLES[index];
  const { type, word, maxLen } = CARDS[index];
  const { g, d, words } = useMemo(() => {
    const g = parseOrThrow(ex.text);
    return { g, d: findDerivation(g, word), words: generateWords(g, maxLen).words };
  }, [ex.text, word, maxLen]);
  return (
    <section className="card ch-card">
      <div className="editor-head">
        <h3>
          {t('ch.typeN', { n: type })} — <Html html={t(`ch.t${type}.name`)} />
        </h3>
        <button onClick={() => onLoad(ex.text)}>{t('ch.load')}</button>
      </div>
      <Html as="p" className="ch-card-lang" html={t(`ch.t${type}.cardLang`)} />
      <RulesBox g={g} />
      <Html as="p" className="muted small" html={t(`ch.t${type}.why`)} />
      {d && (
        <>
          <div className="graph-title">{t('ch.derivOf', { w: word })}</div>
          <DerivationLine d={d} />
        </>
      )}
      <p className="small">
        <span className="muted">{t('ch.wordsUpTo', { n: maxLen })}</span> {wordList(words)}
      </p>
    </section>
  );
}

function Checker({ text, setText }: { text: string; setText: (t: string) => void }) {
  const { t } = useI18n();
  const [n, setN] = useState(6);
  const [word, setWord] = useState('');
  const parsed = useMemo(() => parseGeneralGrammar(text), [text]);
  const g = parsed.ok ? parsed.grammar : null;
  const cls = useMemo(() => (g ? classify(g) : null), [g]);
  const gen = useMemo(() => (g ? generateWords(g, n) : null), [g, n]);
  const w = word.replace(/\s+|ε/g, '');
  const deriv = useMemo(() => (g && word ? findDerivation(g, w) : null), [g, w, word]);

  return (
    <section className="ch-checker">
      <h2>{t('ch.checker')}</h2>
      <Html as="p" className="muted" html={t('ch.checker.b')} />
      <div className="top-grid">
        <div className="stack">
          <AutomatonEditor value={text} onChange={setText} examples={CHOMSKY_EXAMPLES} parsed={parsed} title="geditor.title" help="ch.editor.help" />
        </div>
        {cls && g && (
          <div className="stack">
            <div className="card">
              <Html as="p" className="verdict" html={t('ch.verdict', { n: cls.type }, { name: t(`ch.t${cls.type}.name`) })} />
              {cls.linear && <Html as="p" className="small" html={t(cls.linear === 'right' ? 'ch.linear.right' : 'ch.linear.left')} />}
              <ul className="ch-checks">
                {[3, 2, 1, 0].map((k) => {
                  const c = cls.checks[k as ChomskyType];
                  return (
                    <li key={k}>
                      <b className={c.ok ? 'ok' : 'bad'}>{c.ok ? '✓' : '✗'}</b> <b>{t('ch.typeN', { n: k })}</b>{' '}
                      <span className="muted">({t(`ch.t${k}.short`)})</span>
                      {c.bad && c.reason && (
                        <div className="small">
                          <span className="p-mark" dangerouslySetInnerHTML={{ __html: ruleHtml(c.bad) }} /> — <Html html={t(c.reason)} />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
              {cls.onlyEpsilon && <Html as="p" className="small" html={t('ch.note.eps')} />}
              <Html as="p" className="muted small" html={t('ch.note.lang')} />
            </div>
            <div className="card amb-controls">
              <label className="field">
                <b>{t('ch.gen', { n })}</b>
                <input type="range" min={0} max={MAX_N} value={n} onChange={(e) => setN(Number(e.target.value))} />
              </label>
              {gen && (
                <p className="sample">
                  {gen.words.length ? wordList(gen.words) : <span className="muted">{t('ch.gen.none')}</span>}
                  {gen.truncated && <Html as="span" className="muted small" html={' ' + t('ch.gen.truncated')} />}
                </p>
              )}
              <label className="field">
                <b>{t('ch.ownWord')}</b>
                <input value={word} onChange={(e) => setWord(e.target.value)} placeholder={t('ch.ownWord.ph')} spellCheck={false} />
              </label>
              {word &&
                (deriv ? (
                  <DerivationLine d={deriv} />
                ) : (
                  <Html as="p" className="small" html={t('ch.ownWord.none', { w })} />
                ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export function ChomskyPage({ text, setText }: AlgoPageProps) {
  const { t } = useI18n();
  const load = (s: string) => {
    setText(s);
    document.querySelector('.ch-checker')?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <>
      <div className="top-grid">
        <Theory html={t('theory.chomsky')} />
        <HierarchyDiagram />
      </div>
      <TypeTable />
      <h2>{t('ch.examples')}</h2>
      <div className="ch-cards">
        {CARDS.map((_, i) => (
          <ExampleCard key={i} index={i} onLoad={load} />
        ))}
      </div>
      <Checker text={text} setText={setText} />
    </>
  );
}
