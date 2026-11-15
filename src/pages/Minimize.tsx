import { useMemo } from 'react';
import { DFA_EXAMPLES } from '../automata/examples';
import { minimize } from '../automata/minimize';
import { isDeterministic } from '../automata/types';
import { AutomatonEditor } from '../components/AutomatonEditor';
import { ResultText, Theory, WordTester } from '../components/Extras';
import { Stepper } from '../components/Stepper';
import { useI18n } from '../i18n';
import { AlgoPageProps, useParsed } from './common';

export function MinimizePage({ text, setText, goTo }: AlgoPageProps) {
  const { t } = useI18n();
  const parsed = useParsed(text);
  const dfa = parsed.ok && isDeterministic(parsed.automaton) ? parsed.automaton : null;
  const run = useMemo(() => (dfa ? minimize(dfa) : null), [dfa]);

  return (
    <>
      <div className="top-grid">
        <Theory html={t('theory.min')} />
        <AutomatonEditor value={text} onChange={setText} examples={DFA_EXAMPLES} parsed={parsed} />
      </div>
      {parsed.ok && !dfa && (
        <div className="notice">
          {t('min.notDfa')}{' '}
          <button className="primary" onClick={() => goTo('nfa', text)}>{t('min.convert')}</button>
        </div>
      )}
      {run && dfa && (
        <>
          <Stepper steps={run.steps} />
          <div className="bottom-grid">
            <ResultText automaton={run.result} />
            <WordTester
              automata={[
                { label: t('graph.original'), automaton: dfa },
                { label: t('graph.minimal'), automaton: run.result },
              ]}
            />
          </div>
        </>
      )}
    </>
  );
}
