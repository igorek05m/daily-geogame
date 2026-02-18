import { useRef } from 'react';
import { HintGridProps } from '@/app/types';
import { Lock, Unlock, Lightbulb } from "lucide-react";

export const HintGrid: React.FC<HintGridProps> = ({ hintPackages, guesses, gameOver }) => {
    const gridRef = useRef<HTMLDivElement>(null);
  
    if (!hintPackages || hintPackages.length === 0) {
        return (
        <div className="w-full bg-[#1e1e1e] border border-[#333] p-4 rounded-sm shadow-lg animate-pulse">
            <div className="h-5 bg-[#333] w-48 mb-4 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-20 bg-[#252525] border border-[#333] rounded"></div>
                ))}
            </div>
        </div>
        );
    }

    const allHints = hintPackages.flatMap(pkg => 
        pkg.hints.map(hint => ({
        ...hint,
        packageTitle: pkg.title 
        }))
    );

    return (
        <div ref={gridRef} id="all-hints" className="w-full bg-[#1e1e1e] border border-[#333] p-4 rounded-sm shadow-lg">
            <h2 className="border-b border-[#444] pb-2 mb-2 text-gray-400 font-bold uppercase text-sm flex items-center gap-2">
                <Lightbulb size={16} className={gameOver || guesses.length > 0 ? "text-yellow-400" : "text-gray-500"} />
                {gameOver ? "ALL HINTS REVEALED:" : `UNLOCKED HINTS (${Math.min(guesses.length + 1, 6)}/6):`}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-sm">
                {allHints.map((hint, idx) => {
                    const isUnlocked = gameOver || idx <= guesses.length;
                    const locked = !isUnlocked;

                    return (
                        <div 
                            key={`${hint.packageTitle}-${hint.label}-${idx}`} 
                            className={`
                                p-3 border rounded transition-all duration-500 relative overflow-hidden flex flex-col justify-between
                                ${!locked 
                                ? "border-gray-600 bg-[#121212] shadow-[0_0_10px_rgba(0,0,0,0.3)]" 
                                : "border-[#333] bg-[#0f0f0f] opacity-70 select-none grayscale"
                                }
                            `}
                        >
                            <div className="flex justify-between items-start mb-2 border-b border-gray-800 pb-2">
                                <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${!locked ? "text-blue-400" : "text-gray-600"}`}>
                                {locked ? <Lock size={12} /> : <Unlock size={12} />}
                                {locked ? "LOCKED" : `HINT #${idx + 1}`}
                                </span>
                                <span className="text-[10px] text-gray-500 uppercase">
                                {hint.packageTitle}
                                </span>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="text-gray-500 text-xs uppercase font-semibold">
                                {hint.label}
                                </span>
                                
                                {locked ? (
                                    <div className="flex flex-col">
                                        <span className="text-gray-600 blur-[3px] select-none">●●●●● ●●●●</span>
                                        <span className="text-[10px] text-gray-500 mt-1 italic">
                                            Unlocks at guess #{idx}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="font-medium text-sm leading-relaxed text-gray-200">
                                        {hint.value}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};