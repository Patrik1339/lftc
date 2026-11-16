import type { Viz } from '@viz-js/viz';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DotPalette, toDot } from '../automata/dot';
import type { Automaton, Highlight, Text } from '../automata/types';
import { Html, useI18n } from '../i18n';

let vizPromise: Promise<Viz> | null = null;
// Graphviz (WASM) is large, so load it in its own chunk.
const getViz = () => (vizPromise ??= import('@viz-js/viz').then((m) => m.instance()));

function useDark(): boolean {
  const mq = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  const [dark, setDark] = useState(mq?.matches ?? false);
  useEffect(() => {
    if (!mq) return;
    const on = (e: MediaQueryListEvent) => setDark(e.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [mq]);
  return dark;
}

const LIGHT: DotPalette = { fg: '#1f2340', muted: '#b6bacb', hl: '#4f46e5', hlFill: '#e0e7ff', hl2: '#d97706', hl2Fill: '#fef3c7' };
const DARK: DotPalette = { fg: '#e6e8f2', muted: '#4a5068', hl: '#a5b4fc', hlFill: '#2a2f63', hl2: '#fbbf24', hl2Fill: '#4a3410' };

export function AutomatonView({ automaton, highlight, title }: { automaton: Automaton; highlight?: Highlight; title?: Text }) {
  const makeDot = useCallback((pal: DotPalette) => toDot(automaton, highlight, pal), [automaton, highlight]);
  return <GraphvizView makeDot={makeDot} title={title} />;
}

/** Renders any Graphviz graph; `makeDot` gets the palette for the current color scheme. */
export function GraphvizView({ makeDot, title, className }: { makeDot: (pal: DotPalette) => string; title?: Text; className?: string }) {
  const { tx } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const dark = useDark();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const dot = makeDot(dark ? DARK : LIGHT);
    getViz()
      .then((viz) => {
        if (cancelled || !ref.current) return;
        const svg = viz.renderSVGElement(dot);
        // Keep Graphviz's natural size (so small automata aren't blown up) but let CSS shrink it.
        svg.removeAttribute('height');
        ref.current.replaceChildren(svg);
        setError(null);
      })
      .catch((e) => !cancelled && setError(String(e)));
    return () => {
      cancelled = true;
    };
  }, [makeDot, dark]);

  return (
    <figure className={className ? `graph ${className}` : 'graph'}>
      {title && <Html as="div" className="graph-title" html={tx(title)} />}
      <div className="graph-svg" ref={ref} />
      {error && <div className="error">{error}</div>}
    </figure>
  );
}
