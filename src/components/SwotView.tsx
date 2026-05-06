/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SWOT } from '../types';

interface SwotViewProps {
  data: SWOT;
}

export function SwotView({ data }: SwotViewProps) {
  const sections = [
    { label: 'Strengths', items: data.strengths, code: 'S', color: 'bg-indigo-600' },
    { label: 'Weaknesses', items: data.weaknesses, code: 'W', color: 'bg-rose-500' },
    { label: 'Opportunities', items: data.opportunities, code: 'O', color: 'bg-slate-900' },
    { label: 'Threats', items: data.threats, code: 'T', color: 'bg-slate-400' },
  ];

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 border border-slate-200">
      {sections.map((section, idx) => (
        <div key={idx} className="bg-white p-10 flex flex-col min-h-[300px]">
          <div className="flex justify-between items-center mb-10">
            <span className={`px-4 py-1.5 ${section.color} text-white text-[10px] font-black uppercase tracking-[0.3em]`}>
              {section.label}
            </span>
            <span className="text-6xl font-black text-slate-100 italic leading-none select-none">
              {section.code}
            </span>
          </div>
          
          <ul className="space-y-6 grow">
            {section.items.map((item, i) => (
              <li key={i} className="flex gap-4 group">
                <div className={`mt-1.5 w-1.5 h-1.5 grow-0 shrink-0 ${section.color}`} />
                <p className="text-sm font-bold text-slate-900 uppercase tracking-tight leading-relaxed group-hover:pl-2 transition-all">
                  {item}
                </p>
              </li>
            ))}
          </ul>
          
          <div className="mt-10 pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
            <span>Factor Group {idx + 1}</span>
            <span>Ref: {section.code}-NODE</span>
          </div>
        </div>
      ))}
    </div>
  );
}
