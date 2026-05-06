/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface DecisionFormProps {
  onAnalyze: (query: string) => void;
  isLoading: boolean;
}

export function DecisionForm({ onAnalyze, isLoading }: DecisionFormProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onAnalyze(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      <div className="relative">
        <div className="bg-white border-2 border-slate-900 p-8 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] transition-all">
          <div className="flex items-center justify-between mb-6">
            <label htmlFor="decision-input" className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
              Primary Input Node
            </label>
            <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
              <Sparkles size={12} strokeWidth={3} />
              <span>Neural Processing Active</span>
            </div>
          </div>
          <textarea
            id="decision-input"
            className="w-full h-40 bg-slate-50 text-slate-900 placeholder:text-slate-300 focus:outline-none resize-none font-sans text-2xl font-bold leading-tight px-6 py-6 italic border border-slate-100"
            placeholder="e.g., Should we relocate the corporate HQ to Austin?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.metaKey) handleSubmit(e);
            }}
          />
          <div className="flex flex-col md:flex-row items-center justify-between mt-8 gap-4">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider italic">
              * Provide binary or multivariate options for optimal analysis
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading || !query.trim()}
              className="w-full md:w-auto flex items-center justify-center gap-3 bg-indigo-600 text-white px-10 py-4 font-black uppercase text-xs tracking-[0.2em] hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Initialize Analysis</span>
                  <Send size={14} strokeWidth={3} />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </form>
  );
}
