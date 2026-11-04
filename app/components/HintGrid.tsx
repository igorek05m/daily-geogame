import { useRef } from 'react';
import { HintGridProps } from '@/app/types';
import { Lock, Unlock, Lightbulb } from "lucide-react";

export const HintGrid: React.FC<HintGridProps> = ({ hintPackages, guesses, gameOver }) => {
    const gridRef = useRef<HTMLDivElement>(null);
  
    if (!hintPackages || hintPackages.length === 0) {
        return (
        <div className="w-full bg-[#1e1e1e] border border-[#333] p-4 rounded-md shadow-sm animate-pulse">
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
        <div ref={gridRef} id="all-hints" className="w-full bg-[#1e1e1e] border border-[#252525] p-5 md:p-6 rounded-lg shadow-sm mb-2">
            <div className={`flex items-center justify-between gap-4 ${gameOver ? "mb-5" : "mb-2"}`}>
                <h2 className="text-[#e0e0e0] font-bold text-base flex items-center gap-2">
                <Lightbulb size={16} className={gameOver || guesses.length > 0 ? "text-[#22c55e]" : "text-[#4b5563]"} />
                Hints
                </h2>
                <span className="text-xs text-[#6b7280]">
                    {gameOver ? "6 of 6 revealed" : `${Math.min(guesses.length + 1, 6)} of 6 unlocked`}
                </span>
            </div>
            {!gameOver && (
                <p className="mb-5 text-xs text-[#6b7280]">
                    Each guess unlocks one more hint.
                </p>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-sm">
                {allHints.map((hint, idx) => {
                    const isUnlocked = gameOver || idx <= guesses.length;
                    const locked = !isUnlocked;

                    return (
                        <div 
                            key={`${hint.packageTitle}-${hint.label}-${idx}`} 
                            className={`
                                p-4 border rounded-md transition-colors duration-200 relative overflow-hidden flex flex-col hover:border-[#3b4148]
                                ${!locked 
                                ? "border-[#30343a] bg-[#151515] hover:bg-[#181818]"
                                : "border-[#252525] bg-[#111111] opacity-70 select-none grayscale hover:bg-[#151515]"
                                }
                            `}
                        >
                            <div className="flex justify-between items-start mb-2 border-b border-[#252525] pb-2">
                                <span className={`text-[10px] font-bold tracking-wide flex items-center gap-1 ${!locked ? "text-[#22c55e]" : "text-[#6b7280]"}`}>
                                {locked ? <Lock size={12} /> : <Unlock size={12} />}
                                {locked ? "Locked" : `Hint ${idx + 1}`}
                                </span>
                                <span className="text-[10px] text-[#6b7280]">
                                {hint.packageTitle}
                                </span>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="text-[#9ca3af] text-xs font-semibold">
                                {hint.label}
                                </span>
                                
                                {locked ? (
                                    <div className="flex flex-col">
                                        <span className="text-[#4b5563] blur-[3px] select-none">●●●●● ●●●●</span>
                                        <span className="text-[10px] text-[#9ca3af] mt-1 italic">
                                            Unlocks at guess #{idx}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="font-medium text-sm leading-relaxed text-[#e0e0e0]">
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