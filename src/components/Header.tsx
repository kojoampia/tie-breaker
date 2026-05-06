/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function Header() {
  return (
    <header className="bg-white border-b-2 border-slate-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-end justify-between pb-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase text-slate-900 leading-none">
            The Tiebreaker
          </h1>
          <p className="text-slate-500 font-medium uppercase text-[10px] tracking-widest mt-2">
            AI-Powered Decision Analysis System v1.0
          </p>
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
