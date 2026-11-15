import { useMemo } from 'react';
import { EPSILON_EXAMPLES } from '../automata/examples';
import { eliminateEpsilon } from '../automata/epsilon';
import { serializeAutomaton } from '../automata/parse';
import { hasEpsilon } from '../automata/types';
import { AutomatonEditor } from '../components/AutomatonEditor';
import { Notice, ResultText, Theory, WordTester } from '../components/Extras';
import { Stepper } from '../components/Stepper';
import { useI18n } from '../i18n';
import { AlgoPageProps, useParsed } from './common';

export function EpsilonPage({ text, setText, goTo }: AlgoPageProps) {
  const { t } = useI18n();
  const parsed = useParsed(text);
  const run = useMemo(() => (parsed.ok ? eliminateEpsilon(parsed.automaton) : null), [parsed]);

  return (
    <>
      <div className="top-grid">
        <Theory html={t('theory.epsilon')} />
        <AutomatonEditor value={text} onChange={setText} examples={EPSILON_EXAMPLES} parsed={parsed} />
      </div>
      {parsed.ok && !hasEpsilon(parsed.automaton) && <Notice html={t('epsilon.none')} />}
      {run && parsed.ok && (
        <>
          <Stepper steps={run.steps} />
          <div className="bottom-grid">
            <ResultText
              automaton={run.result}
              actions={<button className="primary" onClick={() => goTo('nfa', serializeAutomaton(run.result))}>{t('epsilon.goto.nfa')}</button>}
            />
            <WordTester
              automata={[
                { label: t('graph.original'), automaton: parsed.automaton },
                { label: t('graph.result'), automaton: run.result },
              ]}
            />
          </div>
        </>
      )}
    </>
  );
}
