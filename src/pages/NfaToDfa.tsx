import { useMemo, useState } from 'react';
import { NFA_EXAMPLES } from '../automata/examples';
import { serializeAutomaton } from '../automata/parse';
import { subsetConstruction } from '../automata/subset';
import { AutomatonEditor } from '../components/AutomatonEditor';
import { ResultText, Theory, WordTester } from '../components/Extras';
import { Stepper } from '../components/Stepper';
import { useI18n } from '../i18n';
import { AlgoPageProps, useParsed } from './common';

export function NfaToDfaPage({ text, setText, goTo }: AlgoPageProps) {
  const { t } = useI18n();
  const parsed = useParsed(text);
  const [includeEmpty, setIncludeEmpty] = useState(true);
  const run = useMemo(() => (parsed.ok ? subsetConstruction(parsed.automaton, { includeEmpty }) : null), [parsed, includeEmpty]);

  return (
    <>
      <div className="top-grid">
        <Theory html={t('theory.nfa')} />
        <div>
          <AutomatonEditor value={text} onChange={setText} examples={NFA_EXAMPLES} parsed={parsed} />
          <label className="check">
            <input type="checkbox" checked={includeEmpty} onChange={(e) => setIncludeEmpty(e.target.checked)} />
            {t('subset.includeEmpty')}
          </label>
        </div>
      </div>
      {run && parsed.ok && (
        <>
          <Stepper steps={run.steps} />
          <div className="bottom-grid">
            <ResultText
              automaton={run.result}
              actions={<button className="primary" onClick={() => goTo('min', serializeAutomaton(run.result))}>{t('subset.goto.min')}</button>}
            />
            <WordTester
              automata={[
                { label: t('graph.afn'), automaton: parsed.automaton },
                { label: t('graph.afd'), automaton: run.result },
              ]}
            />
          </div>
        </>
      )}
    </>
  );
}
