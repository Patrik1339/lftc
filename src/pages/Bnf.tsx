import { Fragment } from 'react';
import { Theory } from '../components/Extras';
import { EBNF_RULES, NOTATION_EXAMPLES, NotationExample, notationHtml } from '../grammar/notation';
import { Html, useI18n } from '../i18n';
import type { PageId } from './common';

const Words = ({ ws }: { ws: string[] }) => (
  <>
    {ws.map((w, i) => (
      <Fragment key={w}>
        {i > 0 && ' '}
        <code>{w}</code>
      </Fragment>
    ))}
  </>
);

const Code = ({ src }: { src: string }) => <pre className="bnf-code" dangerouslySetInnerHTML={{ __html: notationHtml(src) }} />;

/** Metasymbols of each notation, side by side. */
const META: { key: string; bnf: string; ebnf: string }[] = [
  { key: 'bnf.meta.def', bnf: '::=', ebnf: '=' },
  { key: 'bnf.meta.alt', bnf: '|', ebnf: '|' },
  { key: 'bnf.meta.nt', bnf: '<digit>', ebnf: 'digit' },
  { key: 'bnf.meta.t', bnf: '"if"', ebnf: '"if"' },
  { key: 'bnf.meta.cat', bnf: '<a> <b>', ebnf: 'a , b' },
  { key: 'bnf.meta.opt', bnf: '—', ebnf: '[ … ]' },
  { key: 'bnf.meta.rep', bnf: '—', ebnf: '{ … }' },
  { key: 'bnf.meta.group', bnf: '—', ebnf: '( … )' },
  { key: 'bnf.meta.end', bnf: '—', ebnf: ';' },
];

function MetaTable() {
  const { t } = useI18n();
  return (
    <section className="card">
      <h3>{t('bnf.meta')}</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{t('bnf.col.meaning')}</th>
              <th>BNF</th>
              <th>EBNF</th>
            </tr>
          </thead>
          <tbody>
            {META.map((m) => (
              <tr key={m.key}>
                <Html as="td" html={t(m.key)} />
                <td>
                  <code dangerouslySetInnerHTML={{ __html: notationHtml(m.bnf) }} />
                </td>
                <td>
                  <code dangerouslySetInnerHTML={{ __html: notationHtml(m.ebnf) }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Html as="p" className="muted small" html={t('bnf.meta.b')} />
    </section>
  );
}

function RulesTable() {
  const { t } = useI18n();
  return (
    <section className="card amb-section">
      <h3>{t('bnf.rules')}</h3>
      <Html as="p" className="muted small" html={t('bnf.rules.b')} />
      <div className="table-wrap">
        <table className="bnf-rules">
          <thead>
            <tr>
              <th>{t('bnf.col.construct')}</th>
              <th>EBNF</th>
              <th>BNF</th>
            </tr>
          </thead>
          <tbody>
            {EBNF_RULES.map((r) => (
              <tr key={r.key}>
                <Html as="td" html={t(r.key)} />
                <td>
                  <Code src={r.ebnf} />
                </td>
                <td>
                  <Code src={r.bnf} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ExampleCard({ ex, goTo }: { ex: NotationExample; goTo: (p: PageId, text?: string) => void }) {
  const { t } = useI18n();
  return (
    <section className="card bnf-card">
      <h3>{t(`${ex.key}.title`)}</h3>
      <Html as="p" className="small" html={t(`${ex.key}.note`)} />
      <div className="bnf-pair">
        <div>
          <div className="graph-title">BNF</div>
          <Code src={ex.bnf} />
        </div>
        <div>
          <div className="graph-title">EBNF</div>
          <Code src={ex.ebnf} />
        </div>
      </div>
      {ex.grammar && (
        <>
          <div className="graph-title">{t('bnf.asGrammar')}</div>
          <pre className="bnf-code">{ex.grammar}</pre>
        </>
      )}
      <p className="small">
        <b className="ok">✓</b> <Words ws={ex.yes} />
        <span className="bnf-gap" />
        <b className="bad">✗</b> <Words ws={ex.no} />
      </p>
      {ex.grammar && (
        <div className="actions">
          <button onClick={() => goTo('amb', ex.grammar)}>{t('bnf.toAmb')}</button>{' '}
          <button onClick={() => goTo('chomsky', ex.grammar)}>{t('bnf.toChomsky')}</button>
        </div>
      )}
    </section>
  );
}

export function BnfPage({ goTo }: { goTo: (p: PageId, text?: string) => void }) {
  const { t } = useI18n();
  return (
    <>
      <div className="top-grid">
        <Theory html={t('theory.bnf')} />
        <MetaTable />
      </div>
      <RulesTable />
      <h2>{t('bnf.examples')}</h2>
      <div className="ch-cards">
        {NOTATION_EXAMPLES.map((ex) => (
          <ExampleCard key={ex.key} ex={ex} goTo={goTo} />
        ))}
      </div>
    </>
  );
}
