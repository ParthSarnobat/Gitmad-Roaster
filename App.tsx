import React, { useState, useCallback } from 'react';
import { TerminalHeader } from './components/TerminalHeader';
import { CodeInput } from './components/CodeInput';
import { RoastResult } from './components/RoastResult';
import { generateRoast } from './services/geminiService';
import { RoastState, RoastCard } from './types';
import { Bug } from 'lucide-react';

const App: React.FC = () => {
  const [currentCode, setCurrentCode] = useState('');
  const [state, setState] = useState<RoastState>({
    status: 'idle',
    data: null,
    errorMessage: null,
  });

  const handleRoast = useCallback(async (code: string) => {
    setCurrentCode(code);
    setState((prev) => ({ ...prev, status: 'loading', errorMessage: null, data: null }));
    
    // Artificial minimum delay for the "Scanning" effect (2 seconds)
    const minDelay = new Promise(resolve => setTimeout(resolve, 2000));
    const roastPromise = generateRoast(code);

    try {
      const [_, result] = await Promise.all([minDelay, roastPromise]);
      
      // Type guard to ensure we received a roast card, not a fix result (which shouldn't happen in this flow)
      if ('archetype' in result) {
         setState({
          status: 'success',
          data: result as RoastCard,
          errorMessage: null,
        });
        
        // Auto-scroll to results
        setTimeout(() => {
          const resultElement = document.getElementById('card-container');
          if (resultElement) {
            resultElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      } else {
        throw new Error("Unexpected response type");
      }

    } catch (error: any) {
      setState({
        status: 'error',
        data: null,
        errorMessage: error.message || "Unknown system failure.",
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-hacker-black p-4 md:p-8 font-mono overflow-x-hidden selection:bg-hacker-green selection:text-black">
      {/* Background Grid Effect */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-10"
        style={{
            backgroundImage: `linear-gradient(#00ff41 1px, transparent 1px), linear-gradient(90deg, #00ff41 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
        }}
      ></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <TerminalHeader />
        
        <main className="flex flex-col items-center w-full">
          <CodeInput onSubmit={handleRoast} isLoading={state.status === 'loading'} />
          
          {state.status === 'error' && (
            <div className="w-full max-w-4xl p-4 border border-red-500 bg-red-900/10 text-red-500 flex items-center gap-3 animate-pulse mt-4">
               <Bug className="w-6 h-6" />
               <p>CRITICAL ERROR: {state.errorMessage}</p>
            </div>
          )}

          {state.data && <RoastResult roast={state.data} code={currentCode} />}
        </main>

        <footer className="mt-16 text-center text-hacker-green/40 text-xs pb-8">
          <p>POWERED BY GEMINI 3.0 PRO // USE AT YOUR OWN EGO'S RISK</p>
        </footer>
      </div>
    </div>
  );
};

export default App;