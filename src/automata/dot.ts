import { Automaton, Highlight, EPSILON, edges } from './types';

export interface DotPalette {
  fg: string;
  muted: string;
  hl: string;
  hlFill: string;
  hl2: string;
  hl2Fill: string;
}

const q = (s: string) => `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

export function toDot(a: Automaton, hl: Highlight = {}, pal: DotPalette): string {
  const lines: string[] = [
    'digraph A {',
    '  rankdir=LR; bgcolor="transparent"; pad=0.2; nodesep=0.35; ranksep=0.45;',
    `  node [fontname="Helvetica", fontsize=13, color="${pal.fg}", fontcolor="${pal.fg}", shape=circle, width=0.45, fixedsize=false];`,
    `  edge [fontname="Helvetica", fontsize=12, color="${pal.fg}", fontcolor="${pal.fg}", arrowsize=0.7];`,
    '  __start [shape=point, style=invis, width=0];',
  ];

  for (const s of a.states) {
    const attrs: string[] = [];
    if (a.finals.includes(s)) attrs.push('shape=doublecircle');
    if (hl.stateColors?.[s]) attrs.push(`style=filled, fillcolor="${hl.stateColors[s]}", fontcolor="#111"`);
    if (hl.states2?.includes(s)) attrs.push(`style=filled, fillcolor="${pal.hl2Fill}", color="${pal.hl2}", penwidth=2.2`);
    if (hl.states?.includes(s)) attrs.push(`style=filled, fillcolor="${pal.hlFill}", color="${pal.hl}", penwidth=2.6`);
    if (hl.dim?.includes(s)) attrs.push(`style=dashed, color="${pal.muted}", fontcolor="${pal.muted}"`);
    lines.push(`  ${q(s)} [${attrs.join(', ')}];`);
  }
  if (a.start && a.states.includes(a.start)) lines.push(`  __start -> ${q(a.start)} [arrowsize=0.8];`);

  // Merge parallel edges into one arrow labelled "a, b".
  const merged = new Map<string, { from: string; to: string; syms: string[]; hot: boolean }>();
  const hot = new Set((hl.edges ?? []).map((e) => e.join('\u0000')));
  for (const e of edges(a)) {
    const [from, sym, to] = e;
    const key = `${from}\u0000${to}`;
    const m = merged.get(key) ?? { from, to, syms: [], hot: false };
    m.syms.push(sym);
    m.hot ||= hot.has(e.join('\u0000'));
    merged.set(key, m);
  }
  for (const m of merged.values()) {
    const dim = hl.dim?.includes(m.from) || hl.dim?.includes(m.to);
    const attrs = [`label=${q(' ' + m.syms.join(', ') + ' ')}`];
    if (m.syms.every((s) => s === EPSILON) && !m.hot) attrs.push('style=dashed');
    if (m.hot) attrs.push(`color="${pal.hl}", fontcolor="${pal.hl}", penwidth=2.4`);
    else if (dim) attrs.push(`color="${pal.muted}", fontcolor="${pal.muted}", style=dashed`);
    lines.push(`  ${q(m.from)} -> ${q(m.to)} [${attrs.join(', ')}];`);
  }
  lines.push('}');
  return lines.join('\n');
}
