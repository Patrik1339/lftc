import type { StepTable } from '../automata/types';
import { Html, useI18n } from '../i18n';

export function Table({ table }: { table: StepTable }) {
  const { tx } = useI18n();
  return (
    <div className="table-wrap">
      {table.title && <Html as="div" className="table-title" html={tx(table.title)} />}
      <table>
        <thead>
          <tr>
            {table.headers.map((h, i) => (
              <th key={i} dangerouslySetInnerHTML={{ __html: tx(h) }} />
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={i} className={table.highlightRows?.includes(i) ? 'hl' : undefined}>
              {row.map((c, j) => (
                <td key={j}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
