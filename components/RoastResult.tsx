import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { RoastCard } from '../types';
import { Terminal, Zap, Brain, Palette, Paintbrush } from 'lucide-react';
import { RedemptionArc } from './RedemptionArc';

interface RoastResultProps {
  roast: RoastCard;
  code: string;
}

export const RoastResult: React.FC<RoastResultProps> = ({ roast, code }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState('');

  useEffect(() => {
    if (!roast) return;

    // Reset state for new roast
    setIsLoading(true);

    // 1. Force Refresh: Add random seed
    const seed = Math.floor(Math.random() * 1000000);
    
    // 2. URL Encoding Fix: Safely encode the prompt
    const safePrompt = encodeURIComponent(roast.image_prompt);
    
    // Construct Pollinations URL
    const url = `https://image.pollinations.ai/prompt/${safePrompt}?width=400&height=400&nologo=true&seed=${seed}`;

    // 3. Console Logging
    console.log("Generated Image URL:", url);
    console.log("Roast done, showing fix button now"); // Force visibility check log

    setImgSrc(url);
  }, [roast]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    console.warn("Primary image generation failed. Switching to fallback.");
    
    // 4. Add Error Handling & Fallback
    const fallbackUrl = `https://robohash.org/${encodeURIComponent(roast.archetype)}?set=set2&size=400x400`;
    
    if (imgSrc !== fallbackUrl) {
      setImgSrc(fallbackUrl);
    } else {
      setIsLoading(false);
    }
  };

  if (!roast) return null;

  const themeColor = roast.theme_color || '#00ff41';

  return (
    <div id="card-container" className="w-full max-w-2xl mx-auto mt-12 perspective-1000 mb-20">
      <div className="relative animate-in slide-in-from-bottom-12 fade-in duration-700 md:hover:rotate-y-2 transition-transform transform-style-3d">
        
        {/* Card Border & Glow - Dynamic Theme */}
        <div 
          className="relative bg-black border-2 rounded-xl overflow-hidden transition-all duration-500"
          style={{ 
            borderColor: themeColor,
            boxShadow: `0 0 30px ${themeColor}33` // Hex transparency ~20%
          }}
        >
          
          {/* Header */}
          <div 
            className="border-b p-4 flex justify-between items-center backdrop-blur-sm"
            style={{ 
              backgroundColor: `${themeColor}11`, // ~7% opacity
              borderColor: themeColor 
            }}
          >
            <div>
              <h2 
                className="text-xl font-bold font-mono tracking-tighter uppercase drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
                style={{ color: themeColor }}
              >
                {roast.archetype}
              </h2>
              <div 
                className="text-xs uppercase tracking-widest opacity-60"
                style={{ color: themeColor }}
              >
                Class: LEGENDARY TRASH
              </div>
            </div>
            <div className="text-4xl animate-pulse filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
              {roast.emoji}
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 md:p-8 space-y-8 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%] animate-shine">
            
            {/* Visual Character Box */}
            <div className="flex justify-center -mt-2 mb-8">
              <div 
                className="w-[280px] h-[280px] bg-[#030303] border-[3px] relative group overflow-hidden rounded-lg shadow-2xl flex items-center justify-center"
                style={{ 
                  borderColor: themeColor,
                  boxShadow: `inset 0 0 40px ${themeColor}11, 0 10px 30px -10px ${themeColor}33`
                }}
              >
                 {/* Loading State */}
                 {isLoading && (
                   <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-hacker-green bg-[#050505] z-10 transition-opacity duration-300">
                     <Paintbrush className="animate-bounce" size={24} style={{ color: themeColor }} />
                     <span className="text-xs font-mono animate-pulse tracking-widest" style={{ color: themeColor }}>
                       PAINTING...
                     </span>
                   </div>
                 )}

                 {/* Real Image */}
                 <img 
                   src={imgSrc} 
                   alt={roast.archetype}
                   className={`w-full h-full object-cover rounded-[10px] transition-opacity duration-700 ${!isLoading ? 'opacity-100' : 'opacity-0'}`}
                   onLoad={handleImageLoad}
                   onError={handleImageError}
                 />
                
                {/* Overlay Effects */}
                <div className="absolute inset-0 pointer-events-none bg-[url('https://media.giphy.com/media/xT9Igk31elsk8qHNai/giphy.gif')] opacity-[0.05] mix-blend-overlay"></div>
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/80"></div>
                
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 opacity-50" style={{ borderColor: themeColor }}></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 opacity-50" style={{ borderColor: themeColor }}></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 opacity-50" style={{ borderColor: themeColor }}></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 opacity-50" style={{ borderColor: themeColor }}></div>
              </div>
            </div>

            {/* Score & Quote */}
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="relative group shrink-0">
                <div 
                  className="w-32 h-32 rounded-full border-4 flex items-center justify-center bg-black relative z-10"
                  style={{ borderColor: themeColor }}
                >
                   <span 
                    className="text-5xl font-black font-mono drop-shadow-[0_0_15px_currentColor]"
                    style={{ color: themeColor }}
                   >
                     {roast.score}
                   </span>
                </div>
                {/* Rotating dashed ring */}
                <div 
                  className="absolute inset-0 rounded-full border border-dashed animate-[spin_10s_linear_infinite] opacity-50"
                  style={{ borderColor: themeColor }}
                ></div>
                
                <div 
                  className="absolute -bottom-2 w-full text-center text-xs font-bold uppercase tracking-widest bg-black px-1 translate-y-4"
                  style={{ color: themeColor }}
                >
                  Quality
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                 <div 
                   className="text-white/90 italic font-mono text-lg border-l-4 pl-4 py-2"
                   style={{ 
                     borderColor: themeColor,
                     backgroundColor: `${themeColor}0D`
                   }}
                 >
                   "{roast.quote}"
                 </div>
              </div>
            </div>

            {/* Stats Bars */}
            <div className="space-y-4 pt-4 border-t" style={{ borderColor: `${themeColor}33` }}>
              <StatBar label="Sanity" value={roast.stats.sanity} icon={<Brain size={16} />} color={themeColor} />
              <StatBar label="Efficiency" value={roast.stats.efficiency} icon={<Zap size={16} />} color={themeColor} />
              <StatBar label="Style" value={roast.stats.style} icon={<Palette size={16} />} color={themeColor} />
            </div>

            {/* Detailed Roast */}
            <div className="pt-6 mt-4 border-t" style={{ borderColor: `${themeColor}33` }}>
               <div className="flex items-center gap-2 mb-2 opacity-70" style={{ color: themeColor }}>
                  <Terminal size={14} />
                  <span className="text-xs font-bold uppercase">Verdict.log</span>
               </div>
               <div className="text-sm text-gray-300 font-mono leading-relaxed prose prose-invert prose-p:my-1 prose-strong:text-white">
                 <ReactMarkdown>{roast.details}</ReactMarkdown>
               </div>
            </div>

          </div>
          
          {/* Footer Decor */}
          <div 
            className="bg-hacker-black p-2 border-t flex justify-between text-[10px] font-mono uppercase"
            style={{ 
              borderColor: themeColor,
              color: `${themeColor}66`
            }}
          >
             <span>GitMad v1.0</span>
             <span>Ref: {Math.random().toString(36).substring(7).toUpperCase()}</span>
          </div>

        </div>

        {/* --- REDEMPTION ARC SECTION --- */}
        <RedemptionArc originalCode={code} />

      </div>
    </div>
  );
};

const StatBar = ({ label, value, icon, color }: { label: string, value: number, icon: React.ReactNode, color: string }) => {
  return (
    <div className="flex items-center gap-4">
      <div 
        className="w-24 text-xs font-bold flex items-center gap-2 uppercase opacity-80"
        style={{ color: color }}
      >
        {icon} {label}
      </div>
      <div 
        className="flex-1 h-3 rounded-sm overflow-hidden border bg-black"
        style={{ borderColor: `${color}66` }}
      >
        <div 
          className="h-full transition-all duration-1000 ease-out" 
          style={{ width: `${value}%`, backgroundColor: color }}
        ></div>
      </div>
      <div className="w-8 text-right text-xs text-white font-mono">{value}</div>
    </div>
  );
};