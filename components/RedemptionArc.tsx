import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { generateRoast } from '../services/geminiService';
import { FixResult } from '../types';

interface RedemptionArcProps {
  originalCode: string;
}

export const RedemptionArc: React.FC<RedemptionArcProps> = ({ originalCode }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [fixResult, setFixResult] = useState<FixResult | null>(null);
  const [displayedCode, setDisplayedCode] = useState('');

  const handlePurify = async () => {
    setStatus('loading');
    setDisplayedCode('');
    
    try {
      const result = await generateRoast(`MODE: FIX \n\n${originalCode}`);
      // Type guard to ensure we have the fix result
      if ('mode' in result && result.mode === 'fix') {
        setFixResult(result);
        setStatus('success');
      } else {
        throw new Error("Invalid response format for fix mode");
      }
    } catch (error) {
      console.error("Purification failed:", error);
      setStatus('idle'); // Allow retry
      alert("Purification ritual failed. The spaghetti is too strong.");
    }
  };

  // Typewriter effect
  useEffect(() => {
    if (status === 'success' && fixResult?.fixed_code) {
      let i = 0;
      const code = fixResult.fixed_code;
      const speed = 10; // ms per char

      const interval = setInterval(() => {
        setDisplayedCode(code.substring(0, i));
        i++;
        if (i > code.length) {
          clearInterval(interval);
        }
      }, speed);

      return () => clearInterval(interval);
    }
  }, [status, fixResult]);

  return (
    <div id="fix-section" className="w-full mt-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      
      {/* Action Area */}
      {status !== 'success' && (
        <div className="flex justify-center mb-8">
          <button
            onClick={handlePurify}
            disabled={status === 'loading'}
            className={`
              relative group flex items-center gap-3 px-8 py-4 rounded-full
              bg-black border-2 border-[#0080ff] text-[#0080ff]
              font-bold text-lg tracking-wider uppercase
              transition-all duration-300
              hover:bg-[#0080ff] hover:text-white hover:shadow-[0_0_30px_#0080ff]
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {status === 'loading' ? (
               <>
                 <Loader2 className="animate-spin" /> PURIFYING...
               </>
            ) : (
               <>
                 <Sparkles className="animate-pulse" /> ✨ PURIFY THIS CODE ✨
               </>
            )}
          </button>
        </div>
      )}

      {/* Result Display */}
      {status === 'success' && fixResult && (
        <div className="relative border-2 border-[#0080ff] bg-black/80 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,128,255,0.2)]">
          
          {/* Header */}
          <div className="bg-[#0080ff]/10 border-b border-[#0080ff] p-4 flex justify-between items-center backdrop-blur-md">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-[#0080ff]" />
              <h3 className="text-[#0080ff] font-bold font-mono text-xl tracking-tight">
                CODE_PURIFIED
              </h3>
            </div>
            <div className="text-white/80 font-mono text-sm border border-[#0080ff]/50 px-3 py-1 rounded-full">
              Rank Up: <span className="text-[#0080ff] font-bold">{fixResult.new_rank}</span>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            
            {/* Explanation */}
            <div className="text-gray-300 font-mono italic border-l-4 border-[#0080ff] pl-4 py-2">
              "{fixResult.explanation}"
            </div>

            {/* Code Block */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#0080ff] to-cyan-500 opacity-20 blur rounded-lg"></div>
              <div className="relative bg-[#0a0a0a] rounded-lg border border-[#0080ff]/30 p-1">
                 <div className="flex items-center justify-between px-4 py-2 bg-[#0080ff]/10 border-b border-[#0080ff]/20 rounded-t-lg">
                    <span className="text-xs text-[#0080ff]/70 font-mono">fixed_code.ts</span>
                 </div>
                 <pre 
                   id="fixed-code-display"
                   className="p-4 overflow-x-auto text-sm font-mono text-cyan-400 leading-relaxed min-h-[200px]"
                 >
                   <code>{displayedCode}<span className="animate-cursor">|</span></code>
                 </pre>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};