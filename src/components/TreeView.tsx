import { useCallback } from 'react';
import type { DotPalette } from '../automata/dot';
import type { Text } from '../automata/types';
import type { Tree } from '../grammar/ambiguity';
import { GraphvizView } from './AutomatonView';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Graphviz HTML label: nonterminals bold with their index as a subscript. */
function label(t: Tree): string {
  const m = /^([A-Z])(?:_([A-Za-z0-9]+)|([0-9]+))?('*)$/.exec(t.sym);
  if (!t.children || !m) return `<${esc(t.sym)}>`;
  const sub = m[2] ?? m[3];
  return `<<B>${m[1]}</B>${sub ? `<SUB>${sub}</SUB>` : ''}${m[4]}>`;
}

function treeDot(tree: Tree, diff: Set<Tree>, pal: DotPalette): string {
  const lines = [
    'digraph T {',
    '  bgcolor="transparent"; pad=0.2; nodesep=0.3; ranksep=0.35; ordering=out;',
    `  node [shape=plaintext, fontname="Helvetica", fontsize=15, fontcolor="${pal.fg}", height=0.3, width=0.3];`,
    `  edge [arrowhead=none, color="${pal.fg}"];`,
  ];
  let n = 0;
  const visit = (t: Tree, hl: boolean): string => {
    const id = `n${n++}`;
    const on = hl || diff.has(t);
    const style = on ? `, shape=box, style="rounded,filled", fillcolor="${pal.hl2Fill}", color="${pal.hl2}"` : '';
    lines.push(`  ${id} [label=${label(t)}${style}];`);
    const edge = on ? ` [color="${pal.hl2}", penwidth=2]` : '';
    if (t.children?.length === 0) {
      const eps = `n${n++}`;
      lines.push(`  ${eps} [label="ε", fontcolor="${pal.muted}"];`, `  ${id} -> ${eps}${edge};`);
    }
    for (const c of t.children ?? []) lines.push(`  ${id} -> ${visit(c, on)}${edge};`);
    return id;
  };
  visit(tree, false);
  lines.push('}');
  return lines.join('\n');
}

export function TreeView({ tree, diff, title }: { tree: Tree; diff: Set<Tree>; title?: Text }) {
  const makeDot = useCallback((pal: DotPalette) => treeDot(tree, diff, pal), [tree, diff]);
  return <GraphvizView makeDot={makeDot} title={title} className="tree" />;
}
