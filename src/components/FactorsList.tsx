/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Plus, Minus, Filter, BrainCircuit, Sparkles, X } from 'lucide-react';
import { Factor, cn } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { summarizeFactors } from '../services/geminiService';

interface FactorsListProps {
  factors: Factor[];
  onUpdateWeight: (id: string, weight: number) => void;
}

export function FactorsList({ factors, onUpdateWeight, query }: FactorsListProps & { query: string }) {
  const [filter, setFilter] = useState<'all' | 'pros' | 'cons'>('all');
  const [liveVerdict, setLiveVerdict] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const pros = factors.filter(f => f.category === 'pro');
  const cons = factors.filter(f => f.category === 'con');

  const calculateScore = (items: Factor[]) => {
    return items.reduce((acc, curr) => acc + curr.weight, 0);
  };

  const proScore = calculateScore(pros);
  const conScore = calculateScore(cons);
  const totalScore = proScore - conScore;

  const handleSummarize = async () => {
    setIsSummarizing(true);
    try {
      const summary = await summarizeFactors(query, factors);
      setLiveVerdict(summary);
    } catch (error) {
      alert("Failed to generate summary.");
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search/Filter Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-white border border-slate-200 p-2 gap-2">
        <div className="flex items-center gap-1 bg-slate-100 p-1 border border-slate-200 w-full md:w-auto">
          <FilterButton active={filter === 'all'} onClick={() => setFilter('all')} label="All Factors" />
          <FilterButton active={filter === 'pros'} onClick={() => setFilter('pros')} label="Pros Only" />
          <FilterButton active={filter === 'cons'} onClick={() => setFilter('cons')} label="Cons Only" />
        </div>
        
        <button 
          onClick={handleSummarize}
          disabled={isSummarizing}
          className="w-full md:w-auto flex items-center justify-center gap-3 bg-indigo-600 text-white px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-700 disabled:opacity-50 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
        >
          {isSummarizing ? (
            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : <BrainCircuit size={14} strokeWidth={3} />}
          <span>Generate Live Verdict</span>
        </button>
      </div>

      <AnimatePresence>
        {liveVerdict && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-900 border-2 border-slate-900 p-8 shadow-[8px_8px_0px_0px_rgba(79,70,229,1)] relative group"
          >
            <button 
              onClick={() => setLiveVerdict(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <X size={16} strokeWidth={3} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <Sparkles size={16} className="text-indigo-400" strokeWidth={3} />
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Current Weight Verdict</span>
            </div>
            <p className="text-sm font-bold text-slate-100 italic leading-relaxed uppercase tracking-tight">
              {liveVerdict}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 space-y-px bg-slate-200 border border-slate-200">
        <div className={cn(
          "grid grid-cols-1 gap-px",
          filter === 'all' ? "md:grid-cols-2" : "md:grid-cols-1"
        )}>
          {/* Pros Column */}
          {(filter === 'all' || filter === 'pros') && (
            <div className="bg-white p-8">
              <div className="flex justify-between items-center mb-8">
                <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em]">Advantages</span>
                <span className="text-4xl font-black text-slate-100 italic leading-none">PRO</span>
              </div>
              <h2 className="text-2xl font-black mb-8 border-l-4 border-indigo-600 pl-4 uppercase tracking-tighter text-slate-900">
                Weighted Pros <span className="text-indigo-600 ml-2">+{proScore}</span>
              </h2>
              
              <div className="space-y-8">
                <AnimatePresence mode="popLayout">
                  {pros.map((factor) => (
                    <FactorItem 
                      key={factor.id} 
                      factor={factor} 
                      onUpdateWeight={onUpdateWeight} 
                      colorClass="indigo"
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Cons Column */}
          {(filter === 'all' || filter === 'cons') && (
            <div className="bg-white p-8">
              <div className="flex justify-between items-center mb-8">
                <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em]">Risks</span>
                <span className="text-4xl font-black text-slate-100 italic leading-none">CON</span>
              </div>
              <h2 className="text-2xl font-black mb-8 border-l-4 border-slate-900 pl-4 uppercase tracking-tighter text-slate-900">
                Weighted Cons <span className="text-rose-500 ml-2">-{conScore}</span>
              </h2>
              
              <div className="space-y-8">
                <AnimatePresence mode="popLayout">
                  {cons.map((factor) => (
                    <FactorItem 
                      key={factor.id} 
                      factor={factor} 
                      onUpdateWeight={onUpdateWeight} 
                      colorClass="rose"
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Score Vector */}
      <div className="bg-slate-900 text-white p-10 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="w-full md:w-1/3">
          <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.3em] mb-2">Calculated Net Score</p>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-black tracking-tighter">
              {totalScore > 0 ? '+' : ''}{totalScore}
            </span>
            <span className="text-xs font-mono text-slate-500 uppercase">Decision Units</span>
          </div>
        </div>

        <div className="hidden md:block grow px-10">
          <div className="relative h-px bg-slate-700 w-full">
            <motion.div 
              initial={{ left: '50%' }}
              animate={{ left: `${50 + (totalScore / 50) * 50}%` }}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 w-4 h-4 rotate-45 border-2 transition-colors duration-500",
                totalScore > 0 ? "bg-indigo-500 border-white" : totalScore < 0 ? "bg-rose-500 border-white" : "bg-slate-900 border-slate-500"
              )}
            />
            <div className="absolute top-4 left-0 text-[10px] font-mono text-slate-500 uppercase">-50 Avoid</div>
            <div className="absolute top-4 right-0 text-[10px] font-mono text-slate-500 uppercase">+50 Pursue</div>
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-mono text-slate-500 uppercase">Equilibrium</div>
          </div>
        </div>

        <div className="w-full md:w-auto text-center md:text-right">
          <div className={cn(
            "inline-block px-6 py-3 border-2 font-black uppercase text-sm tracking-[0.2em]",
            totalScore > 5 ? "border-indigo-500 text-indigo-400" : totalScore > 0 ? "border-indigo-900 text-indigo-900" : totalScore < -5 ? "border-rose-500 text-rose-500" : totalScore < 0 ? "border-rose-900 text-rose-900" : "border-slate-800 text-slate-800"
          )}>
            {totalScore > 5 ? 'High Confidence Lean' : totalScore > 0 ? 'Statistical Advantage' : totalScore < -5 ? 'Critical Avoidance' : totalScore < 0 ? 'Negative Margin' : 'Absolute Equilibrium'}
          </div>
        </div>
      </div>
    </div>
  );
}

function FactorItem({ factor, onUpdateWeight, colorClass }: { factor: Factor, onUpdateWeight: (id: string, weight: number) => void, colorClass: 'indigo' | 'rose' }) {
  const getImpactLabel = (w: number) => {
    if (w >= 9) return 'Critical Impact';
    if (w >= 7) return 'High Multiplier';
    if (w >= 4) return 'Moderate Node';
    if (w >= 2) return 'Minor Variance';
    return 'Negligible Force';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col gap-4 group bg-slate-50/30 p-4 border border-transparent hover:border-slate-100 hover:bg-white transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="grow space-y-1">
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-tight">{factor.text}</h4>
          <p className={cn(
            "text-[9px] font-black uppercase tracking-[0.2em]",
            colorClass === 'indigo' ? "text-indigo-600" : "text-rose-500"
          )}>
            {getImpactLabel(factor.weight)}
          </p>
        </div>
        <div className="flex items-center border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
          <button 
            onClick={() => onUpdateWeight(factor.id, Math.max(0, factor.weight - 1))}
            className="w-8 h-8 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-colors border-r-2 border-slate-900"
          >
            <Minus size={12} strokeWidth={4} />
          </button>
          <div className="w-10 h-8 flex items-center justify-center font-mono font-black text-sm text-slate-900 bg-white">
            {factor.weight.toString().padStart(2, '0')}
          </div>
          <button 
            onClick={() => onUpdateWeight(factor.id, Math.min(10, factor.weight + 1))}
            className="w-8 h-8 flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-white transition-colors border-l-2 border-slate-900"
          >
            <Plus size={12} strokeWidth={4} />
          </button>
        </div>
      </div>
      
      <div className="relative h-4 bg-slate-100 border border-slate-200 overflow-hidden group-hover:border-slate-300 transition-colors">
        {/* Gauge Background Ticks */}
        <div className="absolute inset-0 flex justify-between px-px pointer-events-none opacity-20">
          {[...Array(11)].map((_, i) => (
            <div key={i} className="w-px h-full bg-slate-400" />
          ))}
        </div>
        
        {/* Active Progress Bar */}
        <motion.div 
          className={cn(
            "h-full relative",
            colorClass === 'indigo' ? "bg-indigo-600" : "bg-rose-500"
          )}
          initial={{ width: 0 }}
          animate={{ width: `${(factor.weight / 10) * 100}%` }}
        >
          {/* Animated Highlights */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
          <div className="absolute top-0 right-0 w-1 h-full bg-white/40" />
        </motion.div>
      </div>
    </motion.div>
  );
}

function FilterButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all",
        active 
          ? "bg-slate-900 text-white italic" 
          : "text-slate-500 hover:text-slate-900 hover:bg-white"
      )}
    >
      {label}
    </button>
  );
}
