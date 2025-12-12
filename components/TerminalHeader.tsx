import React from 'react';
import { Terminal, Cpu } from 'lucide-react';

export const TerminalHeader: React.FC = () => {
  return (
    <header className="mb-8 text-center relative border-b border-hacker-green pb-6">
      <div className="flex items-center justify-center gap-3 mb-2">
        <Terminal className="w-8 h-8 text-hacker-green animate-pulse" />
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter shadow-green-glow drop-shadow-[0_0_10px_rgba(0,255,65,0.8)]">
          GitMad<span className="text-white">_</span>Roaster
        </h1>
        <Cpu className="w-8 h-8 text-hacker-green animate-pulse" />
      </div>
      <p className="text-hacker-green/70 text-sm md:text-base uppercase tracking-widest mt-2">
        EST. 2025 // SYSTEM READY // WAITING FOR INPUT
      </p>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-hacker-green to-transparent opacity-50"></div>
    </header>
  );
};