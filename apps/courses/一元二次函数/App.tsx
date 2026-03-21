import React, { useState } from 'react';
import { Coefficients } from './types';
import Graph from './components/Graph';
import ControlPanel from './components/ControlPanel';
import InfoPanel from './components/InfoPanel';
import KnowledgeBase from './components/KnowledgeBase';

const App: React.FC = () => {
  // uiCoeffs: Reflects exactly what the sliders show (can be invalid, e.g., a=0)
  const [uiCoeffs, setUiCoeffs] = useState<Coefficients>({ a: 1, b: 0, c: 0 });
  
  // activeCoeffs: The last valid set of coefficients used for Graph and AI (always valid)
  const [activeCoeffs, setActiveCoeffs] = useState<Coefficients>({ a: 1, b: 0, c: 0 });
  
  // error: Validation error message
  const [error, setError] = useState<string | null>(null);

  const handleCoeffChange = (newCoeffs: Coefficients) => {
    // 1. Update UI immediately so sliders move smoothly
    setUiCoeffs(newCoeffs);

    // 2. Validate 'a'
    if (newCoeffs.a === 0) {
      setError("二次项系数 a 不能为 0 (否则变为一次函数)");
      // Do NOT update activeCoeffs, effectively "freezing" the graph and AI context
    } else {
      setError(null);
      setActiveCoeffs(newCoeffs);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-white p-1.5 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-800">一元二次函数图像精讲</h1>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            高考数学复习辅助工具
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col gap-12">
        
        {/* Section 1: Interactive Tool (Graph + Controls + AI) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[700px] lg:h-[800px]">
          {/* Left Column: Visualization & Controls */}
          <div className="lg:col-span-7 flex flex-col gap-6 h-full">
            {/* Graph receives activeCoeffs (guaranteed valid) */}
            <div className="flex-grow min-h-[400px]">
                <Graph coeffs={activeCoeffs} />
            </div>
            {/* Controls receive uiCoeffs (user input) and the error state */}
            <div className="flex-shrink-0">
                <ControlPanel 
                  coeffs={uiCoeffs} 
                  onChange={handleCoeffChange} 
                  error={error}
                />
            </div>
          </div>

          {/* Right Column: Knowledge & AI */}
          <div className="lg:col-span-5 h-full min-h-[500px]">
            {/* InfoPanel receives activeCoeffs for context */}
            <InfoPanel 
              coeffs={activeCoeffs} 
              isInvalid={!!error}
            />
          </div>
        </section>

        {/* Section 2: Knowledge Base */}
        <section>
           <KnowledgeBase />
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-slate-200 py-8 mt-12 text-center text-slate-500 text-sm">
          <p>© 2024 高考数学复习助手 | 基于 Google Gemini API</p>
      </footer>
    </div>
  );
};

export default App;
