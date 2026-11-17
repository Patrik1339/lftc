import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DotPalette } from '../automata/dot';
import { AutomatonView, GraphvizView } from '../components/AutomatonView';
import { GrammarBox } from '../components/GrammarView';
import { formHtml, rulesByLhs } from '../grammar/chomsky';
import { Html, useI18n } from '../i18n';
import { pdaToDot } from '../pda/pda';
import { EXERCISES, Exercise, ExerciseType, Feedback } from '../practice/exercises';
import { QUESTIONS, Question } from '../practice/quiz';
import type { PageId } from './common';

const TOPICS: PageId[] = ['chomsky', 'bnf', 'epsilon', 'nfa', 'min', 'pump', 'cfg', 'lr', 'amb', 'pda'];
const ROUND = 10;

const shuffle = <T,>(xs: T[]): T[] => {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

type Tab = 'quiz' | 'ex';

export function PracticePage({ goTo }: { goTo: (p: PageId, text?: string) => void }) {
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>('quiz');
  const [topic, setTopic] = useState<PageId | 'all'>('all');
  const has = (p: PageId) => (tab === 'quiz' ? QUESTIONS : EXERCISES).some((x) => x.topic === p);
  const topics = TOPICS.filter(has);
  const current = topic !== 'all' && !topics.includes(topic) ? 'all' : topic;

  return (
    <>
      <p className="lead pr-lead">{t('pr.intro')}</p>
      <div className="pr-tabs" role="tablist">
        {(['quiz', 'ex'] as const).map((k) => (
          <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'pr-tab on' : 'pr-tab'} onClick={() => setTab(k)}>
            <span className="pr-tab-icon">{k === 'quiz' ? '☑' : '✎'}</span>
            <span>
              <b>{t(`pr.tab.${k}`)}</b>
              <span className="pr-tab-sub">{t(`pr.tab.${k}.sub`)}</span>
            </span>
          </button>
        ))}
      </div>
      <div className="pr-filter">
        {(['all', ...topics] as const).map((p) => (
          <button key={p} className={p === current ? 'chip on' : 'chip'} onClick={() => setTopic(p)}>
            {p === 'all' ? t('pr.all') : t(`nav.${p}`)}
          </button>
        ))}
      </div>
      {tab === 'quiz' ? <Quiz key={current} topic={current} /> : <Exercises topic={current} goTo={goTo} />}
    </>
  );
}

// ---------------------------------------------------------------- quiz

interface Asked {
  q: Question;
  /** Shuffled option indices into q.options (0 is the correct one). */
  order: number[];
}

function newRound(topic: PageId | 'all'): Asked[] {
  const pool = QUESTIONS.filter((q) => topic === 'all' || q.topic === topic);
  return shuffle(pool)
    .slice(0, ROUND)
    .map((q) => ({ q, order: shuffle(q.options.map((_, i) => i)) }));
}

function Quiz({ topic }: { topic: PageId | 'all' }) {
  const { t, lang } = useI18n();
  const [round, setRound] = useState(() => newRound(topic));
  const [idx, setIdx] = useState(0);
  /** Picked option (index into q.options) per question. */
  const [picks, setPicks] = useState<(number | undefined)[]>([]);
  const done = idx >= round.length;
  const score = picks.filter((p) => p === 0).length;

  const restart = () => {
    setRound(newRound(topic));
    setIdx(0);
    setPicks([]);
  };

  if (done) {
    const wrong = round.filter((_, i) => picks[i] !== 0);
    const pct = Math.round((100 * score) / round.length);
    return (
      <section className="card quiz-result">
        <div className="score-ring" style={{ '--pct': pct } as React.CSSProperties}>
          <span>{pct}%</span>
        </div>
        <h2>{score === round.length ? t('pr.perfect') : t('pr.result', { s: score, n: round.length })}</h2>
        <button className="primary" onClick={restart}>{t('pr.again')}</button>
        {wrong.length > 0 && (
          <div className="mistakes">
            <h3>{t('pr.mistakes')}</h3>
            {wrong.map(({ q }, i) => (
              <div key={i} className="mistake">
                <Html as="p" html={q.q[lang]} />
                <p className="ok">
                  ✓ <Html html={q.options[0][lang]} />
                </p>
                <Html as="p" className="muted small" html={q.explain[lang]} />
              </div>
            ))}
          </div>
        )}
      </section>
    );
  }

  const { q, order } = round[idx];
  const picked = picks[idx];
  const answered = picked !== undefined;
  const choose = (o: number) => {
    if (answered) return;
    const next = [...picks];
    next[idx] = o;
    setPicks(next);
  };

  return (
    <section className="card quiz">
      <div className="quiz-head">
        <span className="topic-chip">{t(`nav.${q.topic}`)}</span>
        <span className="muted small">{t('pr.question', { i: idx + 1, n: round.length })}</span>
        <span className="quiz-score">{t('pr.score', { s: score })}</span>
      </div>
      <div className="progress">
        <div style={{ width: `${((idx + (answered ? 1 : 0)) / round.length) * 100}%` }} />
      </div>
      <Html as="p" className="quiz-q" html={q.q[lang]} />
      <div className="options">
        {order.map((o, k) => {
          const cls = !answered ? '' : o === 0 ? ' right' : o === picked ? ' wrong' : ' faded';
          return (
            <button key={o} className={`option${cls}`} onClick={() => choose(o)} disabled={answered && cls === ' faded'}>
              <span className="option-key">{String.fromCharCode(65 + k)}</span>
              <Html html={q.options[o][lang]} />
            </button>
          );
        })}
      </div>
      {answered && (
        <div className={picked === 0 ? 'feedback ok-box' : 'feedback bad-box'}>
          <b>{picked === 0 ? t('pr.correct') : t('pr.wrong')}</b> <Html html={q.explain[lang]} />
        </div>
      )}
      {answered && (
        <div className="actions">
          <button className="primary" onClick={() => setIdx(idx + 1)} autoFocus>
            {idx + 1 === round.length ? t('pr.finish') : t('pr.next')} →
          </button>
        </div>
      )}
    </section>
  );
}

// ---------------------------------------------------------------- open exercises

const SOLVED_KEY = 'lftc.solved';
function loadSolved(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(SOLVED_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function Exercises({ topic, goTo }: { topic: PageId | 'all'; goTo: (p: PageId, text?: string) => void }) {
  const { t, lang } = useI18n();
  const list = EXERCISES.filter((e) => topic === 'all' || e.topic === topic);
  const [selId, setSelId] = useState(list[0].id);
  const sel = list.find((e) => e.id === selId) ?? list[0];
  const [solved, setSolved] = useState(loadSolved);

  const markSolved = (id: string) => {
    const next = { ...solved, [id]: (solved[id] ?? 0) + 1 };
    setSolved(next);
    try {
      localStorage.setItem(SOLVED_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
  };

  return (
    <div className="ex-layout">
      <aside className="ex-list">
        {list.map((e) => (
          <button key={e.id} className={e.id === sel.id ? 'ex-item on' : 'ex-item'} onClick={() => setSelId(e.id)}>
            <span className="ex-item-title">{e.title[lang]}</span>
            <span className="ex-item-meta">
              <span>{t(`nav.${e.topic}`)}</span>
              {solved[e.id] ? <span className="ok">✓ {t('pr.solved', { n: solved[e.id] })}</span> : null}
            </span>
          </button>
        ))}
      </aside>
      <ExerciseRunner key={sel.id} type={sel} onSolved={() => markSolved(sel.id)} goTo={goTo} />
    </div>
  );
}

function ExerciseRunner({ type, onSolved, goTo }: { type: ExerciseType; onSolved: () => void; goTo: (p: PageId, text?: string) => void }) {
  const { t, lang } = useI18n();
  const [ex, setEx] = useState<Exercise>(() => type.make());
  const [answer, setAnswer] = useState('');
  const [fb, setFb] = useState<Feedback | null>(null);
  const [showSol, setShowSol] = useState(false);
  const [counted, setCounted] = useState(false);

  const fresh = () => {
    setEx(type.make());
    setAnswer('');
    setFb(null);
    setShowSol(false);
    setCounted(false);
  };
  const check = () => {
    const r = ex.check(answer);
    setFb(r);
    if (r.ok && !counted && !showSol) {
      setCounted(true);
      onSolved();
    }
  };
  useEffect(() => setFb(null), [answer]);

  const general = useMemo(() => (ex.general ? rulesByLhs(ex.general) : null), [ex]);
  const pdaDot = useCallback((pal: DotPalette) => (ex.pda ? pdaToDot(ex.pda, {}, pal) : ''), [ex]);
  const multiline = ex.input !== 'line';

  return (
    <section className="card ex">
      <div className="ex-head">
        <div>
          <span className="topic-chip">{t(`nav.${type.topic}`)}</span>
          <h2>{type.title[lang]}</h2>
        </div>
        <button onClick={fresh}>↻ {t('pr.newEx')}</button>
      </div>
      <Html as="p" className="ex-prompt" html={ex.prompt[lang]} />
      {ex.automaton && <AutomatonView automaton={ex.automaton} />}
      {ex.pda && <GraphvizView makeDot={pdaDot} />}
      {ex.grammar && <GrammarBox view={{ grammar: ex.grammar }} />}
      {general && (
        <figure className="graph gram">
          <div className="gram-lines">
            {general.map((r, i) => (
              <div key={i} className="gram-line">
                <span className="gram-lhs" dangerouslySetInnerHTML={{ __html: formHtml(r.lhs) }} />
                <span className="gram-arrow">→</span>
                <span dangerouslySetInnerHTML={{ __html: r.rhss.map((x) => formHtml(x)).join(' <span class="gram-bar">|</span> ') }} />
              </div>
            ))}
          </div>
        </figure>
      )}
      {ex.split && (
        <p className="ex-split">
          x = <b className="x-text">{ex.split.x || 'ε'}</b>, y = <b className="y-text">{ex.split.y}</b>, z = <b className="z-text">{ex.split.z || 'ε'}</b>
        </p>
      )}
      <label className="ex-answer">
        <span className="ex-answer-label">{t('pr.answer')}</span>
        {multiline ? (
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.metaKey || e.ctrlKey) && check()}
            placeholder={ex.placeholder}
            rows={7}
            spellCheck={false}
          />
        ) : (
          <input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && check()}
            placeholder={ex.placeholder}
            spellCheck={false}
            autoComplete="off"
          />
        )}
      </label>
      {multiline && <Html as="p" className="muted small" html={t(ex.input === 'automaton' ? 'editor.help' : ex.input === 'pda' ? 'pda.editor.help' : 'geditor.help')} />}
      <div className="actions ex-actions">
        <button className="primary" onClick={check} disabled={!answer.trim()}>{t('pr.check')}</button>
        <button onClick={() => setShowSol(!showSol)}>{showSol ? t('pr.hideSolution') : t('pr.showSolution')}</button>
        {multiline && <span className="muted small">{t('pr.ctrlEnter')}</span>}
      </div>
      {fb && (
        <div className={fb.ok ? 'feedback ok-box' : 'feedback bad-box'}>
          <b>{fb.ok ? '✓' : '✗'}</b> <Html html={fb.msg[lang]} />
          {fb.errors && (
            <ul className="error">
              {fb.errors.map((e, i) => (
                <li key={i}>
                  {e.line > 0 && `${t('parse.line', { line: e.line })}: `}
                  {t(e.key, e.params)}
                </li>
              ))}
            </ul>
          )}
          {fb.ok && (
            <div className="actions">
              <button className="primary" onClick={fresh}>{t('pr.newEx')} →</button>
            </div>
          )}
        </div>
      )}
      {showSol && (
        <div className="solution">
          <div className="ex-answer-label">{t('pr.solution')}</div>
          <Html as="p" html={ex.solution[lang]} />
          {ex.solutionText && <pre>{ex.solutionText}</pre>}
          {ex.open && (
            <button onClick={() => goTo(ex.open!.page, ex.open!.text)}>
              {t('pr.open', { page: t(`nav.${ex.open.page}`) })} →
            </button>
          )}
        </div>
      )}
    </section>
  );
}
