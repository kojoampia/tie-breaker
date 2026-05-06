/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { History } from 'lucide-react';

interface HeaderProps {
  onShowHistory: () => void;
  showHistory: boolean;
}

export function Header({ onShowHistory, showHistory }: HeaderProps) {
  return (
    <header className="bg-white border-b-2 border-slate-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-end justify-between pb-4">
        <div className="flex items-end gap-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase text-slate-900 leading-none">
              The Tiebreaker
            </h1>
            <p className="text-slate-500 font-medium uppercase text-[10px] tracking-widest mt-2">
              AI-Powered Decision Analysis System v1.0
            </p>
          </div>
          
          <button 
            onClick={onShowHistory}
            className={`flex items-center gap-2 px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2 ${showHistory ? 'bg-slate-900 text-white border-slate-900 shadow-[4px_4px_0px_0px_rgba(79,70,229,1)]' : 'bg-white text-slate-900 border-slate-900 hover:bg-slate-50'}`}
          >
            <History size={14} strokeWidth={3} />
            <span>Archive Nodes</span>
          </button>
        </div>
        
        <div className="hidden sm:block text-right">
          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">
            Geometric Balance Engine
          </p>
          <p className="text-sm font-bold italic text-slate-600">Precision Assessment</p>
        </div>
      </div>
    </header>
  );
}
