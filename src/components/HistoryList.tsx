/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HistoryEntry } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, ChevronRight, Trash2 } from 'lucide-react';

interface HistoryListProps {
  entries: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onDelete: (id: string) => void;
}

export function HistoryList({ entries, onSelect, onDelete }: HistoryListProps) {
  if (entries.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center py-20 bg-white border-2 border-dashed border-slate-200">
        <Clock size={48} className="text-slate-200 mb-4" />
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">No archived analysis nodes</h3>
      </div>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <AnimatePresence mode="popLayout">
        {[...entries].reverse().map((entry) => (
          <motion.div
            key={entry.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group relative bg-white border-2 border-slate-900 p-8 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer flex flex-col"
            onClick={() => onSelect(entry)}
          >
            <div className="flex justify-between items-start mb-6">
              <span className="px-2 py-1 bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest leading-none">
                {new Date(entry.timestamp).toLocaleDateString()} @ {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(entry.id);
                }}
                className="text-slate-300 hover:text-rose-500 transition-colors p-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
            
            <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 mb-4 leading-none italic line-clamp-2">
              {entry.query}
            </h3>

            <p className="text-xs text-slate-500 line-clamp-4 mb-8 font-medium leading-relaxed italic flex-grow">
              {entry.analysis.summary}
            </p>

            <div className="flex items-center justify-between pt-6 border-t-2 border-slate-100">
               <div className="flex gap-4">
                 <div className="text-center">
                   <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Logic +</div>
                   <div className="text-lg font-black text-indigo-600">{entry.analysis.factors.filter(f => f.category === 'pro').length}</div>
                 </div>
                 <div className="text-center">
                   <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Risk -</div>
                   <div className="text-lg font-black text-rose-500">{entry.analysis.factors.filter(f => f.category === 'con').length}</div>
                 </div>
               </div>
               <div className="w-10 h-10 border-2 border-slate-900 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                <ChevronRight size={18} strokeWidth={3} />
               </div>
            </div>
            
            <div className="absolute top-0 right-0 w-full h-full bg-indigo-600 opacity-0 group-hover:opacity-[0.02] pointer-events-none transition-opacity" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
