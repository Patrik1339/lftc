import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import type { Text } from '../automata/types';
import { en, Key } from './en';
import { ro } from './ro';

export type Lang = 'ro' | 'en';
const dicts = { ro, en };

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

interface I18n {
  lang: Lang;
  setLang: (l: Lang) => void;
  /** Translate a key; params are HTML-escaped. The result may contain HTML from the dictionary. */
  t: (key: Key | string, params?: Record<string, string | number>) => string;
  /** Translate a Text (literal string or {key, params}). Literal strings are escaped. */
  tx: (text: Text | undefined) => string;
}

const Ctx = createContext<I18n | null>(null);

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem('lftc.lang');
    if (saved === 'ro' || saved === 'en') return saved;
  } catch {
    /* storage unavailable */
  }
  return 'ro';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem('lftc.lang', l);
    } catch {
      /* storage unavailable */
    }
  }, []);
  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      const template: string = (dicts[lang] as Record<string, string>)[key] ?? key;
      return template.replace(/\{(\w+)\}/g, (m, name) => (params && name in params ? escape(String(params[name])) : m));
    },
    [lang],
  );
  const tx = useCallback(
    (text: Text | undefined) => (text === undefined ? '' : typeof text === 'string' ? escape(text) : t(text.key, text.params)),
    [t],
  );
  return <Ctx.Provider value={{ lang, setLang, t, tx }}>{children}</Ctx.Provider>;
}

export function useI18n(): I18n {
  const v = useContext(Ctx);
  if (!v) throw new Error('useI18n outside provider');
  return v;
}

/** Renders a translated HTML string. */
export function Html({ html, as: Tag = 'span', className }: { html: string; as?: 'span' | 'div' | 'p' | 'li'; className?: string }) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
