import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DotPalette } from '../automata/dot';
import { AutomatonEditor } from '../components/AutomatonEditor';
import { GraphvizView } from '../components/AutomatonView';
import { Theory } from '../components/Extras';
import { parseGrammar } from '../grammar/types';
import { Html, useI18n } from '../i18n';
import { PDA_EXAMPLES } from '../pda/examples';
import { Pda, RunStep, cfgToPda, deltaText, isDeterministicPda, parsePda, pdaToDot, runPda, serializePda, splitInput, stackText } from '../pda/pda';
import type { AlgoPageProps } from './common';

const set = (xs: string[]) => `{${xs.join(', ')}}`;

function Tuple({ pda }: { pda: Pda }) {
  const { t } = useI18n();
  const det = isDeterministicPda(pda);
  return (
    <div className="card pda-tuple">
      <p className="mono">
        Q = {set(pda.states)}, Σ = {set(pda.inputAlphabet)}, Γ = {set(pda.stackAlphabet)}, q<sub>0</sub> = {pda.start}, Z<sub>0</sub> = {pda.startStack}
        {pda.mode === 'final' && <>, F = {set(pda.finals)}</>}
      </p>
      <p className="pda-badges">
        <span className="topic-chip">{t(pda.mode === 'final' ? 'pda.mode.final' : 'pda.mode.empty')}</span>
        <span className="topic-chip">{t(det ? 'pda.det' : 'pda.nondet')}</span>
      </p>
    </div>
  );
}

/** The input tape (read part faded, head on the next symbol) and the stack (top first). */
function ConfigView({ word, step }: { word: string[]; step: RunStep }) {
  const { t } = useI18n();
  const { state, pos, stack } = step.config;
  return (
    <div className="pda-config">
      <div>
        <div className="graph-title">{t('pda.tape')}</div>
        <div className="letters">
          {word.length === 0 && <span className="muted">ε</span>}
          {word.map((c, i) => (
            <span key={i} className={i < pos ? 'letter read' : i === pos ? 'letter head' : 'letter'}>
              {c}
            </span>
          ))}
        </div>
        <p className="mono">
          ({state}, {stackText(word.slice(pos))}, {stackText(stack)})
        </p>
      </div>
      <div>
        <div className="graph-title">{t('pda.stack')}</div>
        <div className="pda-stack">
          {stack.length === 0 && <span className="muted small">{t('pda.stack.empty')}</span>}
          {stack.map((s, i) => (
            <span key={i} className={i === 0 ? 'pda-cell top' : 'pda-cell'}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function RunView({ pda, word }: { pda: Pda; word: string[] }) {
  const { t } = useI18n();
  const run = useMemo(() => runPda(pda, word), [pda, word]);
  const [i, setI] = useState(0);
  useEffect(() => setI(0), [run]);
  const idx = Math.min(Math.max(i, 0), run.path.length - 1);
  const step = run.path[idx];
  const makeDot = useCallback((pal: DotPalette) => pdaToDot(pda, { state: step.config.state, transition: step.via }, pal), [pda, step]);
  const w = word.join('') || 'ε';
  const verdict = run.accepted
    ? t('pda.accepted', { w, n: run.path.length - 1 })
    : t(run.truncated ? 'pda.rejected.limit' : 'pda.rejected', { w, read: word.slice(0, run.path[run.path.length - 1].config.pos).join('') || 'ε', n: run.explored });

  return (
    <>
      <div className={run.accepted ? 'notice' : 'notice amb-yes'}>
        <Html html={verdict} />
      </div>
      <section className="stepper">
        <div className="stepper-bar">
          <button onClick={() => setI(0)} disabled={idx === 0} title={t('stepper.first')}>⏮</button>
          <button onClick={() => setI(idx - 1)} disabled={idx === 0}>◀ {t('stepper.prev')}</button>
          <button className="primary" onClick={() => setI(idx + 1)} disabled={idx === run.path.length - 1}>{t('stepper.next')} ▶</button>
          <button onClick={() => setI(run.path.length - 1)} disabled={idx === run.path.length - 1} title={t('stepper.last')}>⏭</button>
          <span className="stepper-count">{t('stepper.step', { i: idx + 1, n: run.path.length })}</span>
        </div>
        <input className="stepper-range" type="range" min={0} max={run.path.length - 1} value={idx} onChange={(e) => setI(Number(e.target.value))} />
        <div className="step-text">
          <div className="step-title">{step.via ? <span className="mono">{deltaText(step.via)}</span> : t('pda.initial')}</div>
          <Html as="p" html={step.via ? t(step.via.input ? 'pda.move.read' : 'pda.move.eps', { a: step.via.input, Z: step.via.top, push: stackText(step.via.push) }) : t('pda.initial.b')} />
        </div>
        <div className="graphs graphs-2">
          <GraphvizView makeDot={makeDot} title={{ key: 'pda.diagram' }} />
          <ConfigView word={word} step={step} />
        </div>
        <div className="table-wrap">
          <div className="table-title">{t(run.accepted ? 'pda.computation' : 'pda.computation.partial')}</div>
          <table className="pda-run">
            <thead>
              <tr>
                <th>#</th>
                <th>{t('col.state')}</th>
                <th>{t('pda.col.input')}</th>
                <th>{t('pda.col.stack')}</th>
                <th>{t('pda.col.via')}</th>
              </tr>
            </thead>
            <tbody>
              {run.path.map((s, k) => (
                <tr key={k} className={k === idx ? 'hl' : undefined} onClick={() => setI(k)}>
                  <td>{k === 0 ? '' : '⊢'}</td>
                  <td>{s.config.state}</td>
                  <td className="mono">{stackText(word.slice(s.config.pos))}</td>
                  <td className="mono">{stackText(s.config.stack)}</td>
                  <td className="mono small">{s.via ? deltaText(s.via) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="muted small">{t('pda.limits')}</div>
      </section>
    </>
  );
}

function FromGrammar({ setText }: { setText: (t: string) => void }) {
  const { t } = useI18n();
  const [g, setG] = useState('S -> aSb | ε');
  const parsed = useMemo(() => parseGrammar(g), [g]);
  const pda = parsed.ok ? cfgToPda(parsed.grammar) : null;
  return (
    <section className="card amb-section">
      <h3>{t('pda.cfg')}</h3>
      <Html as="p" className="muted small" html={t('pda.cfg.b')} />
      <div className="graphs graphs-2">
        <label className="field">
          <b>{t('geditor.title')}</b>
          <textarea value={g} onChange={(e) => setG(e.target.value)} rows={5} spellCheck={false} />
          {!parsed.ok && (
            <ul className="error">
              {parsed.errors.map((e, i) => (
                <li key={i}>
                  {e.line > 0 && `${t('parse.line', { line: e.line })}: `}
                  {t(e.key, e.params)}
                </li>
              ))}
            </ul>
          )}
        </label>
        {pda && (
          <div className="field">
            <b>{t('pda.cfg.result')}</b>
            <pre>{pda.transitions.map(deltaText).join('\n')}</pre>
            <div className="actions">
              <button className="primary" onClick={() => setText(serializePda(pda))}>{t('pda.cfg.load')} ↑</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export function PdaPage({ text, setText }: AlgoPageProps) {
  const { t } = useI18n();
  const parsed = useMemo(() => parsePda(text), [text]);
  const [input, setInput] = useState('aabb');
  const word = useMemo(() => (parsed.ok ? splitInput(parsed.pda, input) : []), [parsed, input]);

  return (
    <>
      <div className="top-grid">
        <Theory html={t('theory.pda')} />
        <div className="stack">
          <AutomatonEditor value={text} onChange={setText} examples={PDA_EXAMPLES} parsed={parsed} title="pda.editor.title" help="pda.editor.help" />
          <div className="card amb-controls">
            <label className="field">
              <b>{t('pda.word')}</b>
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('tester.placeholder')} spellCheck={false} />
            </label>
          </div>
        </div>
      </div>
      {parsed.ok && (
        <>
          <Tuple pda={parsed.pda} />
          <RunView pda={parsed.pda} word={word} />
        </>
      )}
      <FromGrammar setText={setText} />
    </>
  );
}
