import React, { useState } from 'react';
import { Flame, ScanLine, Loader2, DownloadCloud } from 'lucide-react';

interface CodeInputProps {
  onSubmit: (code: string) => void;
  isLoading: boolean;
}

export const CodeInput: React.FC<CodeInputProps> = ({ onSubmit, isLoading }) => {
  const [code, setCode] = useState('');
  const [isFetching, setIsFetching] = useState(false);

  const fetchGithubCode = async (url: string) => {
    // Transform to raw URL
    // Format: https://github.com/user/repo/blob/branch/path/to/file
    // Target: https://raw.githubusercontent.com/user/repo/branch/path/to/file
    
    let rawUrl = url;
    if (url.includes('github.com') && !url.includes('raw.githubusercontent.com')) {
      rawUrl = url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
    }

    try {
      setIsFetching(true);
      const response = await fetch(rawUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      const text = await response.text();
      setCode(text);
    } catch (error) {
      console.error("Failed to fetch GitHub code:", error);
      // We keep the URL in the box if it fails so the user knows
    } finally {
      setIsFetching(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCode(value);

    // Detect if the input is a single GitHub URL
    // Regex checks for: start of string, http/https, github.com, /blob/, and no whitespace
    const trimmed = value.trim();
    const isGithubUrl = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w-]+\/blob\/.+/.test(trimmed);

    if (isGithubUrl) {
      fetchGithubCode(trimmed);
    }
  };

  const handleSubmit = () => {
    if (!code.trim()) return;
    onSubmit(code);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative group">
        <div className="absolute -inset-1 bg-hacker-green rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
        <div className="relative bg-hacker-black border border-hacker-green p-1">
          <div className="bg-hacker-darkGreen/20 px-4 py-1 flex justify-between items-center border-b border-hacker-green/30 text-xs text-hacker-green/60">
            <span>INPUT_BUFFER</span>
            <div className="flex gap-4">
               {isFetching && <span className="flex items-center gap-1 text-hacker-green animate-pulse"><DownloadCloud size={12}/> FETCHING SOURCE...</span>}
               <span>/dev/stdin</span>
            </div>
          </div>
          <textarea
            value={code}
            onChange={handleTextChange}
            disabled={isLoading || isFetching}
            placeholder="// Paste your spaghetti code here... OR drop a GitHub file URL."
            className="w-full h-64 bg-black text-hacker-green p-4 font-mono text-sm focus:outline-none resize-y selection:bg-hacker-green selection:text-black placeholder-hacker-green/30 disabled:opacity-50"
            spellCheck={false}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={isLoading || !code.trim() || isFetching}
          className={`
            relative px-8 py-3 bg-black border-2 border-hacker-green text-hacker-green font-bold text-xl uppercase tracking-widest
            transition-all duration-200 
            hover:bg-hacker-green hover:text-black hover:shadow-[0_0_20px_rgba(0,255,65,0.6)]
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black disabled:hover:text-hacker-green disabled:hover:shadow-none
            group
          `}
        >
          <span className="flex items-center gap-2">
            {isFetching ? (
              <>
                <Loader2 className="animate-spin" /> EXTRACTING SPAGHETTI...
              </>
            ) : isLoading ? (
              <>
                <ScanLine className="animate-spin-slow" /> SCANNING CODE...
              </>
            ) : (
              <>
                <Flame className="group-hover:animate-bounce" /> ROAST ME
              </>
            )}
          </span>
        </button>
      </div>
    </div>
  );
};
