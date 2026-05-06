/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Factor, cn } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Swords, ChevronRight, ChevronLeft, Scale } from 'lucide-react';

interface PairwiseViewProps {
  factors: Factor[];
  onUpdateWeight: (id: string, weight: number) => void;
}

export function PairwiseView({ factors, onUpdateWeight }: PairwiseViewProps) {
  const [selectedFactorA, setSelectedFactorA] = useState<string | null>(factors[0]?.id || null);
  const [selectedFactorB, setSelectedFactorB] = useState<string | null>(factors[1]?.id || null);

  const factorA = factors.find(f => f.id === selectedFactorA);
  const factorB = factors.find(f => f.id === selectedFactorB);

  return (
    <div className="mt-8 space-y-px bg-slate-200 border border-slate-200">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-px">
        {/* Selection Column */}
        <div className="lg:col-span-4 bg-white p-8 border-r border-slate-200">
          <div className="flex justify-between items-center mb-8">
            <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em]">Select Nodes</span>
            <span className="text-3xl font-black text-slate-100 italic leading-none">SEL</span>
          </div>
          
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Factor Alpha</p>
              <select 
                value={selectedFactorA || ''} 
                onChange={(e) => setSelectedFactorA(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-900 p-4 text-xs font-black uppercase italic focus:outline-none"
              >
                {factors.map(f => (
                  <option key={f.id} value={f.id}>{f.text.substring(0, 40)}...</option>
                ))}
              </select>
            </div>

            <div className="flex justify-center">
              <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white">
                <Swords size={14} />
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Factor Beta</p>
              <select 
                value={selectedFactorB || ''} 
                onChange={(e) => setSelectedFactorB(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-900 p-4 text-xs font-black uppercase italic focus:outline-none"
              >
                {factors.map(f => (
                  <option key={f.id} value={f.id}>{f.text.substring(0, 40)}...</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-10 p-6 bg-slate-50 border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed">
              * Direct pairwise comparison forces psychological evaluation of relative importance. Adjust weights to reach equilibrium.
            </p>
          </div>
        </div>

        {/* Comparison Area */}
        <div className="lg:col-span-8 bg-white p-10 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {factorA && factorB && factorA.id !== factorB.id ? (
              <motion.div 
                key={`${factorA.id}-${factorB.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-12"
              >
                <div className="flex flex-col md:flex-row items-stretch gap-px bg-slate-200 border border-slate-200 shadow-[12px_12px_0px_0px_rgba(15,23,42,0.05)]">
                  <ComparisonNode 
                    factor={factorA} 
                    onUpdate={onUpdateWeight} 
                    side="left"
                    isDominant={factorA.weight > factorB.weight}
                  />
                  <div className="flex flex-col items-center justify-center bg-slate-900 text-white p-6 md:w-24">
                    <div className="text-[10px] font-black uppercase tracking-widest mb-2 origin-center -rotate-90 md:rotate-0 whitespace-nowrap">Differential</div>
                    <div className="text-xl font-black italic">
                      {Math.abs(factorA.weight - factorB.weight)}
                    </div>
                  </div>
                  <ComparisonNode 
                    factor={factorB} 
                    onUpdate={onUpdateWeight} 
                    side="right"
                    isDominant={factorB.weight > factorA.weight}
                  />
                </div>

                <div className="bg-indigo-50 border border-indigo-100 p-8 flex flex-col items-center text-center">
                  <Scale size={24} className="text-indigo-600 mb-4" />
                  <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-2">Relational Logic</h4>
                  <p className="text-sm font-bold text-slate-700 italic max-w-lg">
                    {factorA.weight > factorB.weight 
                      ? `"${factorA.text}" is currently modeled as having a higher impact than "${factorB.text}".`
                      : factorA.weight < factorB.weight 
                      ? `"${factorB.text}" is currently modeled as having a higher impact than "${factorA.text}".`
                      : `Both factors are modeled with equal architectural importance.`
                    }
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                  <Swords size={32} />
                </div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Select two distinct factors to begin pairwise duel</h3>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ComparisonNode({ factor, onUpdate, side, isDominant }: { factor: Factor, onUpdate: (id: string, weight: number) => void, side: 'left' | 'right', isDominant: boolean }) {
  return (
    <div className={cn(
      "flex-1 bg-white p-10 flex flex-col justify-between transition-all duration-500",
      isDominant ? "bg-slate-50/50" : ""
    )}>
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className={cn(
            "px-2 py-0.5 text-[8px] font-black uppercase tracking-widest",
            factor.category === 'pro' ? "bg-indigo-600 text-white" : "bg-rose-500 text-white"
          )}>
            {factor.category}
          </span>
          {isDominant && (
            <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1">
              • Dominant Node
            </span>
          )}
        </div>
        <h4 className="text-lg font-black uppercase tracking-tighter text-slate-900 leading-tight">
          {factor.text}
        </h4>
      </div>

      <div className="flex items-center gap-4">
        <div className="grow">
           <div className="flex justify-between items-end mb-2">
             <span className="text-[10px] font-black text-slate-400 uppercase">Impact Weight</span>
             <span className="text-2xl font-black text-slate-900">{factor.weight.toString().padStart(2, '0')}</span>
           </div>
           <div className="h-2 bg-slate-100 overflow-hidden">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${(factor.weight / 10) * 100}%` }}
               className={cn("h-full", factor.category === 'pro' ? "bg-indigo-600" : "bg-rose-500")} 
             />
           </div>
        </div>
        <div className="flex flex-col gap-1">
          <button 
            onClick={() => onUpdate(factor.id, Math.min(10, factor.weight + 1))}
            className="w-10 h-10 border border-slate-200 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-colors"
          >
            <Plus size={14} strokeWidth={3} />
          </button>
          <button 
            onClick={() => onUpdate(factor.id, Math.max(0, factor.weight - 1))}
            className="w-10 h-10 border border-slate-200 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-colors"
          >
            <Minus size={14} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}

function Plus({ size, strokeWidth, className }: { size: number, strokeWidth: number, className?: string }) {
  return <ChevronLeft size={size} strokeWidth={strokeWidth} className={cn("-rotate-90", className)} />;
}

function Minus({ size, strokeWidth, className }: { size: number, strokeWidth: number, className?: string }) {
  return <ChevronRight size={size} strokeWidth={strokeWidth} className={cn("rotate-90", className)} />;
}
