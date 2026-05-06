/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Header } from './components/Header';
import { DecisionForm } from './components/DecisionForm';
import { FactorsList } from './components/FactorsList';
import { ComparisonView } from './components/ComparisonView';
import { SwotView } from './components/SwotView';
import { PairwiseView } from './components/PairwiseView';
import { HistoryList } from './components/HistoryList';
import { analyzeDecision } from './services/geminiService';
import { DecisionAnalysis, AnalysisMode, Factor, HistoryEntry, cn } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, BrainCircuit, ChevronRight, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function App() {
  const [analysis, setAnalysis] = useState<DecisionAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<AnalysisMode>('list');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeQuery, setActiveQuery] = useState<string>("");

  const handleAnalyze = async (query: string) => {
    setIsLoading(true);
    try {
      const result = await analyzeDecision(query);
      setAnalysis(result);
      setActiveQuery(query);
      
      const newEntry: HistoryEntry = {
        id: crypto.randomUUID(),
        query,
        analysis: result,
        timestamp: Date.now()
      };
      setHistory(prev => [newEntry, ...prev]);
      setMode('list');
    } catch (error) {
      alert("Analysis failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateWeight = (id: string, weight: number) => {
    if (!analysis) return;
    const newFactors = analysis.factors.map(f => f.id === id ? { ...f, weight } : f);
    setAnalysis({ ...analysis, factors: newFactors });
  };

  const handleReset = () => {
    setAnalysis(null);
    setMode('list');
    setActiveQuery("");
  };

  const handleSelectHistory = (entry: HistoryEntry) => {
    setAnalysis(entry.analysis);
    setActiveQuery(entry.query);
    setMode('list');
  };

  const handleDeleteHistory = (id: string) => {
    setHistory(prev => prev.filter(e => e.id !== id));
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tiebreaker-${filename}-${new Date().getTime()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 font-sans selection:bg-indigo-600 selection:text-white">
      <Header 
        showHistory={mode === 'history'} 
        onShowHistory={() => setMode(mode === 'history' ? 'list' : 'history')} 
      />
      
      <main className="max-w-7xl mx-auto px-6 py-16">
        <AnimatePresence mode="wait">
          {mode === 'history' ? (
            <motion.div
              key="history-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="space-y-12"
            >
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-8">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Knowledge Base</span>
                  <h2 className="text-4xl font-black text-slate-900 italic tracking-tight uppercase leading-none">
                    Archived Nodes
                  </h2>
                </div>
                {analysis && (
                  <button 
                    onClick={() => setMode('list')}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-[4px_4px_0px_0px_rgba(79,70,229,1)]"
                  >
                    <ArrowLeft size={14} strokeWidth={3} />
                    <span>Return to Active Trace</span>
                  </button>
                )}
              </div>
              
              <HistoryList 
                entries={history} 
                onSelect={handleSelectHistory} 
                onDelete={handleDeleteHistory} 
              />
            </motion.div>
          ) : !analysis ? (
            <motion.div
              key="input-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="flex flex-col items-center justify-center min-h-[60vh] space-y-16"
            >
              <div className="text-center space-y-6">
                <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase text-slate-900 leading-[0.9]">
                  Architect Your<br />Future Choices.
                </h2>
                <div className="flex items-center justify-center gap-4">
                  <div className="h-px bg-slate-300 w-12" />
                  <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">
                    Precision Decision Analysis System
                  </p>
                  <div className="h-px bg-slate-300 w-12" />
                </div>
              </div>
              
              <DecisionForm onAnalyze={handleAnalyze} isLoading={isLoading} />

              <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest w-full text-center mb-4">Sample Input Nodes</span>
                {['Relocate HQ to Austin?', 'Buy Electric Car in 2024?', 'Go full Remote?'].map((ex, i) => (
                  <button 
                    key={i}
                    onClick={() => handleAnalyze(ex)}
                    className="text-[10px] font-black uppercase tracking-widest border-2 border-slate-200 px-4 py-2 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all italic"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="analysis-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-12"
            >
              {/* Header Info */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-2 border-slate-900 pb-8">
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Query Active</span>
                  <h2 className="text-4xl font-black text-slate-900 italic tracking-tight uppercase leading-none">
                    "{activeQuery}"
                  </h2>
                </div>
                
                <div className="flex items-center gap-1 bg-slate-200 p-1 border border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                  <TabButton active={mode === 'list'} onClick={() => setMode('list')} label="Factors" />
                  <TabButton active={mode === 'pairwise'} onClick={() => setMode('pairwise')} label="Pairwise" />
                  <TabButton active={mode === 'table'} onClick={() => setMode('table')} label="Matrix" />
                  <TabButton active={mode === 'swot'} onClick={() => setMode('swot')} label="SWOT" />
                  <button 
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-900 hover:bg-rose-50 transition-colors"
                  >
                    <RotateCcw size={14} strokeWidth={3} />
                  </button>
                </div>
              </div>

              {/* Verdict Section */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-slate-900">
                <div className="md:col-span-8 bg-slate-900 text-white p-10 flex flex-col justify-between min-h-[250px]">
                  <div>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4">Tiebreaker Logic Report</p>
                    <div className="prose prose-invert prose-slate max-w-none prose-sm font-bold uppercase tracking-tight text-slate-300 leading-relaxed italic">
                      <ReactMarkdown>{analysis.summary}</ReactMarkdown>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-10 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <BrainCircuit size={16} />
                    <span>Nueromorphic Kernel v3.442 - Analysis Stabilized</span>
                  </div>
                </div>
                <div className="md:col-span-4 bg-indigo-50 p-10 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Confidence Metric</span>
                  <div className="text-8xl font-black text-indigo-600 tracking-tighter leading-none mb-2">
                    84<span className="text-2xl ml-1">%</span>
                  </div>
                  <div className="h-1 w-12 bg-indigo-600 mb-8" />
                  <div className="flex flex-col w-full gap-2">
                    <button 
                      onClick={() => {
                        const data = JSON.stringify(analysis, null, 2);
                        const blob = new Blob([data], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `tiebreaker-full-node-${new Date().getTime()}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="w-full py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 group"
                    >
                      Binary Full JSON <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    <div className="h-px bg-slate-200 my-2" />
                    
                    <ExportButton 
                      label="Full Report (TXT)"
                      onClick={() => {
                        const pros = analysis.factors.filter(f => f.category === 'pro').map(f => `+ ${f.text} (Weight: ${f.weight})`).join('\n');
                        const cons = analysis.factors.filter(f => f.category === 'con').map(f => `- ${f.text} (Weight: ${f.weight})`).join('\n');
                        const swot = `STRENGTHS:\n${analysis.swot.strengths.join('\n')}\n\nWEAKNESSES:\n${analysis.swot.weaknesses.join('\n')}\n\nOPPORTUNITIES:\n${analysis.swot.opportunities.join('\n')}\n\nTHREATS:\n${analysis.swot.threats.join('\n')}`;
                        const report = `THE TIEBREAKER: ANALYSIS REPORT\nQuery: ${activeQuery}\n\nSUMMARY\n${analysis.summary}\n\nPROS\n${pros}\n\nCONS\n${cons}\n\nSWOT\n${swot}`;
                        downloadFile(report, 'full-report.txt');
                      }}
                    />

                    <ExportButton 
                      label="Export SWOT Core"
                      onClick={() => {
                        const swot = `SWOT ANALYSIS: ${activeQuery}\n\nSTRENGTHS:\n${analysis.swot.strengths.join('\n')}\n\nWEAKNESSES:\n${analysis.swot.weaknesses.join('\n')}\n\nOPPORTUNITIES:\n${analysis.swot.opportunities.join('\n')}\n\nTHREATS:\n${analysis.swot.threats.join('\n')}`;
                        downloadFile(swot, 'swot-analysis.txt');
                      }}
                    />

                    <ExportButton 
                      label="Export Matrix Mapping"
                      onClick={() => {
                        const matrix = `COMPARISON MATRIX: ${activeQuery}\n\nHeaders: ${analysis.comparisonTable.headers.join(' | ')}\n\n` + 
                          analysis.comparisonTable.rows.map(r => `${r.label}: ${r.values.join(' | ')}`).join('\n');
                        downloadFile(matrix, 'comparison-matrix.txt');
                      }}
                    />

                    <ExportButton 
                      label="Export Weighted Factors"
                      onClick={() => {
                        const pros = analysis.factors.filter(f => f.category === 'pro').map(f => `[PRO] ${f.text} (W:${f.weight})`).join('\n');
                        const cons = analysis.factors.filter(f => f.category === 'con').map(f => `[CON] ${f.text} (W:${f.weight})`).join('\n');
                        downloadFile(`WEIGHTED FACTORS: ${activeQuery}\n\nPROS:\n${pros}\n\nCONS:\n${cons}`, 'weighted-factors.txt');
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Content */}
              <div className="min-h-[600px]">
                {mode === 'list' && (
                  <FactorsList 
                    factors={analysis.factors} 
                    onUpdateWeight={updateWeight} 
                    query={activeQuery}
                  />
                )}
                {mode === 'pairwise' && (
                  <PairwiseView 
                    factors={analysis.factors} 
                    onUpdateWeight={updateWeight} 
                  />
                )}
                {mode === 'table' && (
                  <ComparisonView data={analysis.comparisonTable} />
                )}
                {mode === 'swot' && (
                  <SwotView data={analysis.swot} />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-40 bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20">
          <div className="space-y-6">
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter">The Tiebreaker</h3>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest max-w-sm leading-relaxed">
              Equilibrium analysis platform. Breaking circular decision loops since 2026. Powered by geometric balance and algorithmic weight assessment.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 md:justify-items-end">
            <div className="space-y-4">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Protocol</span>
              <ul className="space-y-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <li><a href="#" className="hover:text-white transition-colors">SWOT Standard</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Matrix Model</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Weight Bias</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Utility</span>
              <ul className="space-y-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <li><a href="#" className="hover:text-white transition-colors">Export Node</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Lock</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Archive</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ExportButton({ active, onClick, label }: { active?: boolean, onClick: () => void, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full py-2.5 px-4 text-[10px] font-black uppercase tracking-[0.15em] border border-slate-900 transition-all flex items-center justify-between group/btn",
        active 
          ? "bg-slate-900 text-white italic" 
          : "bg-white text-slate-900 hover:bg-slate-50"
      )}
    >
      <span>{label}</span>
      <ChevronRight size={12} className="opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
    </button>
  );
}

function TabButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all",
        active 
          ? "bg-slate-900 text-white italic" 
          : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
      )}
    >
      {label}
    </button>
  );
}
