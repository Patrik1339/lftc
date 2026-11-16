import { useMemo, useState } from 'react';
import { AutomatonEditor } from '../components/AutomatonEditor';
import { Notice, Theory } from '../components/Extras';
import { GrammarTester, GrammarText } from '../components/GrammarView';
import { Stepper } from '../components/Stepper';
import { LR_EXAMPLES } from '../grammar/examples';
import { eliminateLeftRecursion, leftRecPreconditions } from '../grammar/leftrec';
import { MAX_PRODUCTIONS, TooLargeError } from '../grammar/normal';
import { removeEpsilonAndRenames } from '../grammar/simplify';
import { parseGrammar, serializeGrammar } from '../grammar/types';
import { useI18n } from '../i18n';
import type { AlgoPageProps } from './common';

export function LeftRecPage({ text, setText }: AlgoPageProps) {
  const { t } = useI18n();
  const [withEps, setWithEps] = useState(true);
  const parsed = useMemo(() => parseGrammar(text), [text]);
  const pre = parsed.ok ? leftRecPreconditions(parsed.grammar) : null;
  const blocked = !!pre && (pre.epsilon || pre.cycle);
  const run = useMemo(() => {
    if (!parsed.ok || blocked) return null;
    try {
      return eliminateLeftRecursion(parsed.grammar, withEps);
    } catch (e) {
      if (e instanceof TooLargeError) return 'tooLarge' as const;
      throw e;
    }
  }, [parsed, blocked, withEps]);

  return (
    <>
      <div className="top-grid">
        <Theory html={t('theory.lr')} />
        <div className="stack">
          <AutomatonEditor value={text} onChange={setText} examples={LR_EXAMPLES} parsed={parsed} title="geditor.title" help="geditor.help" />
          <div className="card">
            <div className="field">
              <b>{t('lr.variant')}</b>
              <label className="check">
                <input type="radio" checked={withEps} onChange={() => setWithEps(true)} />
                <span dangerouslySetInnerHTML={{ __html: t('lr.variant.eps') }} />
              </label>
              <label className="check">
                <input type="radio" checked={!withEps} onChange={() => setWithEps(false)} />
                <span dangerouslySetInnerHTML={{ __html: t('lr.variant.noeps') }} />
              </label>
            </div>
          </div>
        </div>
      </div>
      {parsed.ok && blocked && (
        <div className="notice">
          <span dangerouslySetInnerHTML={{ __html: t(pre!.epsilon ? 'lr.needClean.eps' : 'lr.needClean.cycle') }} />{' '}
          <button className="primary" onClick={() => setText(serializeGrammar(removeEpsilonAndRenames(parsed.grammar)))}>
            {t('lr.clean')}
          </button>
        </div>
      )}
      {run === 'tooLarge' && <Notice html={t('cfg.tooLarge', { n: MAX_PRODUCTIONS })} />}
      {run && run !== 'tooLarge' && parsed.ok && (
        <>
          <Stepper steps={run.steps} />
          <div className="bottom-grid">
            <GrammarText title={t('lr.result')} grammar={run.result} />
            <GrammarTester
              grammars={[
                { label: t('gview.original'), grammar: parsed.grammar },
                { label: t('lr.result'), grammar: run.result },
              ]}
            />
          </div>
        </>
      )}
    </>
  );
}
