import { useMemo } from 'react';
import { parseAutomaton } from '../automata/parse';

export type PageId = 'home' | 'epsilon' | 'nfa' | 'min' | 'pump' | 'cfg' | 'lr' | 'amb';

export interface AlgoPageProps {
  text: string;
  setText: (t: string) => void;
  goTo: (page: PageId, text?: string) => void;
}

export const useParsed = (text: string) => useMemo(() => parseAutomaton(text), [text]);
