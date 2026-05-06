/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ComparisonTable as ComparisonTableType } from '../types';

interface ComparisonTableProps {
  data: ComparisonTableType;
}

export function ComparisonView({ data }: ComparisonTableProps) {
  return (
    <div className="mt-8 overflow-x-auto border-2 border-slate-900 shadow-[10px_10px_0px_0px_rgba(15,23,42,1)] bg-white">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b-2 border-slate-900 bg-slate-50">
            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap">
              Structural Dimension
            </th>
            {data.headers.map((header, i) => (
              <th key={i} className="p-6 text-sm font-black text-slate-900 uppercase tracking-tighter min-w-[250px] italic">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y-2 divide-slate-900">
          {data.rows.map((row, i) => (
            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
              <td className="p-6 border-r-2 border-slate-900 bg-slate-50/20">
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{row.label}</span>
              </td>
              {row.values.map((val, j) => (
                <td key={j} className="p-6 text-sm font-bold text-slate-700 leading-relaxed group">
                  <div className="border-l-2 border-slate-100 pl-4 group-hover:border-indigo-600 transition-all">
                    {val}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
