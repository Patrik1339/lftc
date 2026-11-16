import { useEffect, useState } from 'react';
import type { Step } from '../automata/types';
import { Html, useI18n } from '../i18n';
import { AutomatonView } from './AutomatonView';
import { GrammarBox } from './GrammarView';
import { Table } from './Table';

export function Stepper({ steps }: { steps: Step[] }) {
  const { t, tx } = useI18n();
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const last = steps.length - 1;
  const idx = Math.min(i, last);

  // Restart whenever the algorithm input changes.
  useEffect(() => {
    setI(0);
    setPlaying(false);
  }, [steps]);

  useEffect(() => {
    if (!playing) return;
    if (idx >= last) {
      setPlaying(false);
      return;
    }
    const id = setTimeout(() => setI((x) => x + 1), 1800);
    return () => clearTimeout(id);
  }, [playing, idx, last]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'TEXTAREA' || tag === 'INPUT' || tag === 'SELECT') return;
      if (e.key === 'ArrowRight') setI((x) => Math.min(x + 1, last));
      if (e.key === 'ArrowLeft') setI((x) => Math.max(x - 1, 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [last]);

  if (!steps.length) return null;
  const step = steps[idx];
  // First step of each phase, for the jump links.
  const phases = steps.flatMap((s, k) => (s.phase && (k === 0 || tx(steps[k - 1].phase) !== tx(s.phase)) ? [k] : []));
  const phaseOf = (k: number) => phases.filter((p) => p <= k).pop();

  return (
    <section className="stepper">
      {phases.length > 1 && (
        <div className="phases">
          {phases.map((p, n) => (
            <button key={p} className={phaseOf(idx) === p ? 'active' : undefined} onClick={() => setI(p)}>
              <Html html={`${n + 1}. ${tx(steps[p].phase)}`} />
            </button>
          ))}
        </div>
      )}
      <div className="stepper-bar">
        <button onClick={() => setI(0)} disabled={idx === 0} title={t('stepper.first')}>⏮</button>
        <button onClick={() => setI(idx - 1)} disabled={idx === 0}>◀ {t('stepper.prev')}</button>
        <button className="primary" onClick={() => setI(idx + 1)} disabled={idx === last}>{t('stepper.next')} ▶</button>
        <button onClick={() => setI(last)} disabled={idx === last} title={t('stepper.last')}>⏭</button>
        <button onClick={() => (idx === last ? (setI(0), setPlaying(true)) : setPlaying(!playing))}>
          {playing ? `⏸ ${t('stepper.pause')}` : `⏵ ${t('stepper.play')}`}
        </button>
        <span className="stepper-count">{t('stepper.step', { i: idx + 1, n: steps.length })}</span>
      </div>
      <input
        className="stepper-range"
        type="range"
        min={0}
        max={last}
        value={idx}
        onChange={(e) => setI(Number(e.target.value))}
        aria-label={t('stepper.step', { i: idx + 1, n: steps.length })}
      />
      <div className="step-text">
        <Html as="div" className="step-title" html={tx(step.title)} />
        <Html as="p" html={tx(step.body)} />
      </div>
      {step.graphs && (
        <div className={`graphs graphs-${step.graphs.length}`}>
          {step.graphs.map((g, k) => (
            <AutomatonView key={k} automaton={g.automaton} highlight={g.highlight} title={g.title} />
          ))}
        </div>
      )}
      {step.grammars && (
        <div className={`graphs graphs-${step.grammars.length}`}>
          {step.grammars.map((g, k) => (
            <GrammarBox key={k} view={g} />
          ))}
        </div>
      )}
      {step.tables?.map((tb, k) => <Table key={k} table={tb} />)}
      <div className="muted small">{t('stepper.keys')}</div>
    </section>
  );
}
