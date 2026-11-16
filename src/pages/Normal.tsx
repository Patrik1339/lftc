import { useMemo } from 'react';
import { AutomatonEditor } from '../components/AutomatonEditor';
import { Notice, Theory } from '../components/Extras';
import { GrammarTester, GrammarText } from '../components/GrammarView';
import { Stepper } from '../components/Stepper';
import { CFG_EXAMPLES } from '../grammar/examples';
import { MAX_PRODUCTIONS, normalize } from '../grammar/normal';
import { parseGrammar, serializeGrammar } from '../grammar/types';
import { useI18n } from '../i18n';
import type { AlgoPageProps } from './common';

export function NormalFormsPage({ text, setText, goTo }: AlgoPageProps) {
  const { t } = useI18n();
  const parsed = useMemo(() => parseGrammar(text), [text]);
  const run = useMemo(() => (parsed.ok ? normalize(parsed.grammar) : null), [parsed]);

  return (
    <>
      <div className="top-grid">
        <Theory html={t('theory.cfg')} />
        <AutomatonEditor value={text} onChange={setText} examples={CFG_EXAMPLES} parsed={parsed} title="geditor.title" help="geditor.help" />
      </div>
      {run && parsed.ok && (
        <>
          {run.empty && <Notice html={t('cfg.emptyLang')} />}
          {run.tooLarge && <Notice html={t('cfg.tooLarge', { n: MAX_PRODUCTIONS })} />}
          <Stepper steps={run.steps} />
          {run.cnf && (
            <div className="bottom-grid">
              <div className="stack">
                <GrammarText title={t('gview.cnf')} grammar={run.cnf} />
                {run.gnf && <GrammarText title={t('gview.gnf')} grammar={run.gnf} />}
                {run.reduced && (
                  <div className="actions">
                    <button onClick={() => goTo('lr', serializeGrammar(run.reduced!))}>{t('cfg.goto.lr')}</button>
                  </div>
                )}
              </div>
              <GrammarTester
                grammars={[
                  { label: t('gview.original'), grammar: parsed.grammar },
                  { label: t('gview.cnf'), grammar: run.cnf },
                  ...(run.gnf ? [{ label: t('gview.gnf'), grammar: run.gnf }] : []),
                ]}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}
