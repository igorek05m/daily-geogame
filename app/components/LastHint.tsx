import React from 'react';
import { HintPackage } from '@/app/types';
import { Lightbulb, Info, ArrowDown } from "lucide-react";

interface LastHintProps {
  hintPackages: HintPackage[];
  guesses: unknown[];
  gameOver: boolean;
}

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
        <div className="w-full bg-[#1e1e1e] border-l-4 border-blue-500 p-4 rounded-sm shadow-lg mb-4 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 relative">
            <div className="flex items-start gap-3">
                <div className="mt-1 p-1 bg-blue-500/10 rounded-full">
                    <Lightbulb size={20} className="text-blue-400" />
                </div>
                <div className="flex-grow">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold uppercase text-blue-400 tracking-wider">
                            Current Hint ({hintToShowIndex + 1}/{allHints.length})
                        </span>
                        <span className="text-[10px] uppercase text-gray-500 border border-[#333] px-1 rounded">
                            {currentHint.packageTitle}
                        </span>
                    </div>
                    
                    <h3 className="text-gray-400 text-xs font-semibold uppercase mb-1">
                        {currentHint.label}
                    </h3>
                    <p className="text-white font-mono text-base font-medium">
                        {currentHint.value}
                    </p>
                    
                    <div className="mt-2 text-[10px] text-gray-600 italic">
                        {hintToShowIndex < allHints.length - 1 
                            ? `Next hint unlocks after guess #${hintToShowIndex + 1}` 
                            : "All hints revealed!"
                        }
                    </div>
                </div>
            </div>
            
            <button 
                onClick={scrollToAllHints}
                className="w-full text-center text-[14px] text-gray-500 hover:text-white mt-1 pt-2 border-t border-[#333] flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >   
                <span className="flex items-center gap-1 animate-bounce-subtle">
                    View all hints <ArrowDown size={14} />
                </span>
            </button>
        </div>
    );
};