import type { Example } from '../automata/examples';
import type { ParseResult } from '../automata/parse';
import { Html, useI18n } from '../i18n';

interface Props {
  value: string;
  onChange: (text: string) => void;
  examples: Example[];
  parsed: ParseResult;
}

export function AutomatonEditor({ value, onChange, examples, parsed }: Props) {
  const { t } = useI18n();
  return (
    <div className="editor card">
      <div className="editor-head">
        <h3>{t('editor.title')}</h3>
        <select
          value=""
          onChange={(e) => {
            const ex = examples[Number(e.target.value)];
            if (ex) onChange(ex.text);
          }}
        >
          <option value="">{t('editor.examples')}</option>
          {examples.map((ex, i) => (
            <option key={ex.name} value={i}>{t(ex.name)}</option>
          ))}
        </select>
      </div>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} spellCheck={false} rows={12} />
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
      <Html as="p" className="muted small" html={t('editor.help')} />
    </div>
  );
}
