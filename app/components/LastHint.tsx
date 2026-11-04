import React from 'react';
import { HintPackage, LastHintProps } from '@/app/types';
import { Lightbulb, ArrowDown } from "lucide-react";

export const LastHint: React.FC<LastHintProps> = ({ hintPackages, guesses, gameOver }) => {
    
    if (!hintPackages || hintPackages.length === 0) return null;

    const allHints = hintPackages.flatMap(pkg => 
        pkg.hints.map(hint => ({
            ...hint,
            packageTitle: pkg.title 
        }))
    );

    let hintToShowIndex = guesses.length;
    if (gameOver) {
       hintToShowIndex = Math.min(guesses.length, allHints.length - 1);
    } else {
       hintToShowIndex = Math.min(guesses.length, allHints.length - 1);
    }

    const currentHint = allHints[hintToShowIndex];

    const scrollToAllHints = () => {
        const element = document.getElementById('all-hints');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (!currentHint) return null;

    return (
        <div className="w-full bg-[#1e1e1e] border border-[#252525] border-l-2 border-l-[#22c55e] p-5 rounded-lg mb-3 flex flex-col gap-4 relative">
            <div className="flex items-start gap-3">
                <div className="mt-1 p-1.5 bg-[#22c55e]/10 rounded-full shrink-0">
                    <Lightbulb size={18} className="text-[#22c55e]" />
                </div>
                <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between gap-3 mb-2">
                        <span className="text-xs text-[#9ca3af]">
                            Hint {hintToShowIndex + 1} of {allHints.length}
                        </span>
                        <span className="text-[10px] uppercase text-[#6b7280] tracking-wide">
                            {currentHint.packageTitle}
                        </span>
                    </div>
                    <h3 className="text-[#9ca3af] text-xs uppercase font-semibold mb-1">
                        {currentHint.label}
                    </h3>
                    <p className="text-[#e0e0e0] text-base leading-relaxed break-words">
                        {currentHint.value}
                    </p>
                </div>
            </div>
            
            <button 
                onClick={scrollToAllHints}
                className="self-center border-t border-[#252525] pt-3 text-sm text-[#9ca3af] hover:text-[#e0e0e0] hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-1 cursor-pointer"
            >   
                See all hints <ArrowDown size={14} />
            </button>
        </div>
    );
};