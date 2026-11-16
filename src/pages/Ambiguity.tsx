import { useMemo, useState } from 'react';
import { AutomatonEditor } from '../components/AutomatonEditor';
import { Theory } from '../components/Extras';
import { TreeView } from '../components/TreeView';
import { Derivation, Tree, derivationOf, findAmbiguity, firstDifference, treeDifference, treesForWord } from '../grammar/ambiguity';
import { AMB_EXAMPLES } from '../grammar/examples';
import { parseGrammar, prodHtml, symHtml } from '../grammar/types';
import { Html, useI18n } from '../i18n';
import type { AlgoPageProps } from './common';

const MAX_N = 8;

const formHtml = (form: string[], at?: number) =>
  form.length ? form.map((X, i) => (i === at ? `<u class="rw">${symHtml(X)}</u>` : symHtml(X))).join('') : 'ε';

/** One derivation: α₀ ⇒ α₁ ⇒ …, the rewritten nonterminal underlined, the step where the two differ highlighted. */
function DerivationList({ d, diffAt, title }: { d: Derivation; diffAt: number; title: string }) {
  return (
    <div className="deriv-col">
      <div className="graph-title">{title}</div>
      <ol className="deriv">
        {d.forms.map((f, i) => (
          <li key={i} className={i === diffAt ? 'hl' : undefined}>
            <span className="deriv-arrow">{i === 0 ? '' : '⇒'}</span>
            <span dangerouslySetInnerHTML={{ __html: formHtml(f, d.at[i]) }} />
            {i < d.prods.length && <span className="deriv-prod" dangerouslySetInnerHTML={{ __html: prodHtml(...d.prods[i]) }} />}
          </li>
        ))}
      </ol>
    </div>
  );
}

function DerivationPair({ trees, mode }: { trees: Tree[]; mode: 'left' | 'right' }) {
  const { t } = useI18n();
  const ds = trees.map((tr) => derivationOf(tr, mode));
  const diffAt = ds.length === 2 ? firstDifference(ds[0], ds[1]) : -1;
  return (
    <section className="card amb-section">
      <h3>{t(mode === 'left' ? 'amb.left' : 'amb.right')}</h3>
      <Html as="p" className="muted small" html={t(ds.length === 2 ? (mode === 'left' ? 'amb.left.b' : 'amb.right.b') : 'amb.single.deriv')} />
      <div className={`graphs graphs-${ds.length}`}>
        {ds.map((d, k) => (
          <DerivationList key={k} d={d} diffAt={diffAt} title={t('amb.derivN', { n: k + 1 })} />
        ))}
      </div>
    </section>
  );
}

export function AmbiguityPage({ text, setText }: AlgoPageProps) {
  const { t } = useI18n();
  const [n, setN] = useState(6);
  const [word, setWord] = useState('');
  const parsed = useMemo(() => parseGrammar(text), [text]);
  const w = word.replace(/\s+/g, '');
  const search = useMemo(() => (parsed.ok && !w ? findAmbiguity(parsed.grammar, n) : null), [parsed, n, w]);
  const own = useMemo(() => (parsed.ok && w ? treesForWord(parsed.grammar, w) : null), [parsed, w]);
  const trees = own ?? search?.trees ?? [];
  const shown = w || search?.word || '';
  const diff = useMemo(() => (trees.length === 2 ? treeDifference(trees[0], trees[1]) : [new Set<Tree>(), new Set<Tree>()]), [trees]);

  let status: { html: string; ok: boolean } | null = null;
  if (search) {
    status = search.word !== null
      ? { ok: false, html: t('amb.found', { w: search.word || 'ε', n: search.word.length }) }
      : { ok: true, html: t('amb.notFound', { n, count: search.checked }) };
  } else if (own) {
    status =
      own.length === 0
        ? { ok: true, html: t('amb.word.none', { w }) }
        : own.length === 1
          ? { ok: true, html: t('amb.word.one', { w }) }
          : { ok: false, html: t('amb.word.two', { w }) };
  }

  return (
    <>
      <div className="top-grid">
        <Theory html={t('theory.amb')} />
        <div className="stack">
          <AutomatonEditor value={text} onChange={setText} examples={AMB_EXAMPLES} parsed={parsed} title="geditor.title" help="geditor.help" />
          <div className="card amb-controls">
            <label className="field">
              <b>{t('amb.maxLen', { n })}</b>
              <input type="range" min={1} max={MAX_N} value={n} disabled={!!w} onChange={(e) => setN(Number(e.target.value))} />
            </label>
            <label className="field">
              <b>{t('amb.ownWord')}</b>
              <input value={word} onChange={(e) => setWord(e.target.value)} placeholder={t('amb.ownWord.ph')} spellCheck={false} />
            </label>
          </div>
        </div>
      </div>
      {status && (
        <div className={status.ok ? 'notice' : 'notice amb-yes'}>
          <Html html={status.html} />
        </div>
      )}
      {trees.length > 0 && (
        <>
          <section className="card amb-section">
            <h3>{t('amb.trees')}</h3>
            <Html
              as="p"
              className="muted small"
              html={t(trees.length === 2 ? 'amb.trees.b' : 'amb.single.tree', { w: shown || 'ε' }, { root: symHtml(trees[0].sym) })}
            />
            <div className={`graphs graphs-${trees.length}`}>
              {trees.map((tr, k) => (
                <TreeView key={k} tree={tr} diff={diff[k]} title={t('amb.treeN', { n: k + 1 })} />
              ))}
            </div>
          </section>
          <DerivationPair trees={trees} mode="left" />
          <DerivationPair trees={trees} mode="right" />
        </>
      )}
    </>
  );
}
