import { useMemo, useState } from 'react';
import { Theory } from '../components/Extras';
import { Html, useI18n } from '../i18n';
import { LANGUAGES } from '../pumping/languages';
import { allSplits, breakingI, pump, randomP, Split } from '../pumping/pumping';

const MAX_I = 6;

function Letters({ parts, p }: { parts: { text: string; cls: string }[]; p?: number }) {
  let pos = 0;
  return (
    <div className="letters">
      {parts.flatMap(({ text, cls }, k) =>
        [...text].map((c, j) => {
          pos++;
          return (
            <span key={`${k}-${j}`} className={`letter ${cls}${p !== undefined && pos === p ? ' p-mark' : ''}`}>
              {c}
            </span>
          );
        }),
      )}
    </div>
  );
}

/** HTML label → plain text for <option> (which cannot contain markup). */
const plain = (html: string) =>
  html.replace(/<sup>(.*?)<\/sup>/g, (_, e: string) => (e.length > 1 ? `^(${e})` : `^${e}`)).replace(/<sub>(.*?)<\/sub>/g, '_$1').replace(/<\/?\w+>/g, '').replace(/&lt;/g, '<');

const short = (s: string, n = 40) => (s.length > n ? `${s.slice(0, n)}…` : s) || 'ε';

export function PumpingPage() {
  const { t, lang } = useI18n();
  const [langId, setLangId] = useState(LANGUAGES[0].id);
  const L = LANGUAGES.find((l) => l.id === langId)!;
  const [p, setP] = useState(() => randomP(L.maxP));
  const [xLen, setXLen] = useState(0);
  const [yLen, setYLen] = useState(1);
  const [i, setI] = useState(2);

  const w = L.word(p);
  const reset = (newP: number) => {
    setP(newP);
    setXLen(0);
    setYLen(1);
    setI(2);
  };
  const split: Split = { x: w.slice(0, xLen), y: w.slice(xLen, xLen + yLen), z: w.slice(xLen + yLen) };
  const pumped = pump(split, i);
  const pumpedIn = L.inL(pumped);
  const splits = useMemo(() => allSplits(w, p).map((s) => ({ s, i: breakingI(L, s) })), [w, p, L]);
  const hintI = breakingI(L, split);
  const g = L.proof[lang];
  const proofSteps: [string, string][] = [
    ['pump.g.lbl.assume', t('pump.g.assume')],
    ['pump.g.lbl.word', t('pump.g.word', { w: '§' }).replace('§', g.word) + ' ' + g.inL],
    ['pump.g.lbl.lemma', t('pump.g.lemma')],
    ['pump.g.lbl.split', g.split],
    ['pump.g.lbl.pump', g.pumped],
    ['pump.g.lbl.contra', g.contradiction],
    ['pump.g.lbl.end', t('pump.g.end')],
  ];

  return (
    <>
      <div className="top-grid">
        <Theory html={t('theory.pump')} />
        <div className="card">
          <label className="field">
            <span>{t('pump.lang')}</span>
            <select
              value={langId}
              onChange={(e) => {
                const nl = LANGUAGES.find((l) => l.id === e.target.value)!;
                setLangId(nl.id);
                reset(randomP(nl.maxP));
              }}
            >
              {LANGUAGES.map((l) => (
                <option key={l.id} value={l.id}>{plain(l.label)}</option>
              ))}
            </select>
          </label>
          <div className="lang-big">
            L = <Html html={L.label} />
          </div>
        </div>
      </div>

      <section className="card pump-section">
        <h2>{t('pump.general')}</h2>
        <ol className="proof general">
          {proofSteps.map(([label, html]) => (
            <li key={label}>
              <b className="proof-label">{t(label)}.</b> <Html html={html} />
            </li>
          ))}
        </ol>
      </section>

      <section className="card pump-section">
        <h2>{t('pump.example')}</h2>
        <Html as="p" className="muted" html={t('pump.example.b')} />
        <div className="p-row">
          <span className="p-badge">p = {p}</span>
          <button className="primary" onClick={() => reset(randomP(L.maxP))}>🎲 {t('pump.newP')}</button>
        </div>
        <h3>{t('pump.s1')}</h3>
        <Html as="p" html={t('pump.s1.b', { p })} />

        <h3>{t('pump.s2')}</h3>
        <p>
          <Html html={t('pump.s2.b', { w: '§', len: w.length, p }).replace('§', L.wordLabel(p))} />
        </p>
        <Letters parts={[{ text: w, cls: '' }]} p={p} />

        <h3>{t('pump.s3')}</h3>
        <Html as="p" html={t('pump.s3.b')} />
        <div className="sliders">
          <label>
            {t('pump.xlen')} = {xLen}
            <input
              type="range"
              min={0}
              max={p - 1}
              value={xLen}
              onChange={(e) => {
                const nx = Number(e.target.value);
                setXLen(nx);
                setYLen((y) => Math.min(y, p - nx));
              }}
            />
          </label>
          <label>
            {t('pump.ylen')} = {yLen}
            <input type="range" min={1} max={p - xLen} value={yLen} onChange={(e) => setYLen(Number(e.target.value))} />
          </label>
        </div>
        <Letters parts={[{ text: split.x, cls: 'x' }, { text: split.y, cls: 'y' }, { text: split.z, cls: 'z' }]} p={p} />
        <p className="split-text">
          x = <b className="x-text">{split.x || 'ε'}</b>, y = <b className="y-text">{split.y}</b>, z = <b className="z-text">{short(split.z)}</b>
          <span className="muted"> — |xy| = {xLen + yLen} ≤ {p}, |y| = {yLen} ≥ 1</span>
        </p>

        <h3>{t('pump.s4')}</h3>
        <Html as="p" html={t('pump.s4.b')} />
        <div className="i-row">
          {Array.from({ length: MAX_I + 1 }, (_, k) => (
            <button key={k} className={k === i ? 'primary' : ''} onClick={() => setI(k)}>
              i = {k}
            </button>
          ))}
        </div>
        <Letters
          parts={[{ text: split.x, cls: 'x' }, ...Array.from({ length: i }, () => ({ text: split.y, cls: 'y' })), { text: split.z, cls: 'z' }]}
        />
        <p className={pumpedIn ? 'verdict in' : 'verdict out'}>
          xy<sup>{i}</sup>z {pumpedIn ? t('pump.in') : t('pump.out')}
        </p>
        {pumpedIn && hintI !== null && <p className="muted">{t('pump.hint', { i: hintI })}</p>}

        <h3>{t('pump.s5')}</h3>
        <Html as="p" html={t('pump.s5.b', { n: splits.length })} />
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>x</th>
                <th>y</th>
                <th>z</th>
                <th>{t('pump.col.i')}</th>
                <th>{t('pump.col.pumped')}</th>
                <th>|xyⁱz|</th>
                <th>∉ L</th>
              </tr>
            </thead>
            <tbody>
              {splits.map(({ s, i: bi }, k) => {
                const current = s.x.length === xLen && s.y.length === yLen;
                const pw = bi === null ? '' : pump(s, bi);
                return (
                  <tr key={k} className={current ? 'hl' : undefined} onClick={() => { setXLen(s.x.length); setYLen(s.y.length); if (bi !== null) setI(bi); }}>
                    <td>{s.x || 'ε'}</td>
                    <td>{s.y}</td>
                    <td>{short(s.z, 20)}</td>
                    <td>{bi ?? '—'}</td>
                    <td className="mono">{bi === null ? '—' : short(pw)}</td>
                    <td>{pw.length}</td>
                    <td className={bi === null ? 'bad' : 'ok'}>{bi === null ? '✗' : '✓'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </section>
    </>
  );
}
