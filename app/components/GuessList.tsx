import React from 'react';
import { GuessListProps } from '@/app/types';
import { Check, X, MapPin, Globe, PartyPopper, Square, ArrowUp, Footprints } from "lucide-react";

export const GuessList = ({ guesses, targetCountry, gameOver }: GuessListProps) => {
  return (
    <div className="w-full bg-[#1e1e1e] border border-[#252525] p-4 md:p-5 rounded-lg shadow-sm">
      <h2 className="border-b border-[#333] pb-3 mb-3 text-[#9ca3af] font-bold uppercase text-xs tracking-wider flex items-center gap-2">
        <Footprints size={16} /> LAST GUESSES:
      </h2>
      
      {gameOver && targetCountry && (
        <div className="mt-4 p-4 bg-[#14251a] border border-green-500/30 rounded text-center">
        <h3 className="text-xl font-bold text-[#22c55e] flex items-center justify-center gap-2">
            <PartyPopper size={24} /> GAME OVER <PartyPopper size={24} />
          </h3>
          <p className="text-[#e0e0e0] mt-2">
            The country was: <span className="font-bold text-[#22c55e] text-lg">{targetCountry.name}</span>
          </p>
          <p className="text-[#9ca3af] text-sm mt-1">See you tomorrow.</p>
        </div>
      )}

      <ul className="space-y-2 mt-4">
        {guesses.slice().reverse().map((guess, idx) => {
          const distance = guess.distance;
          const bearingAngle = guess.bearing;
          const connection = guess.connection || "none";
          
          const isCorrect = distance === 0 || (targetCountry && guess.name === targetCountry.name);
          const guessNum = idx + 1;

          let Icon = X;
          let colorClass = "text-red-700 bg-red-700/10 border-red-700/20";

          if (isCorrect) {
            Icon = Check;
            colorClass = "text-green-500 bg-green-500/10 border-green-500/20";
          } else if (connection === "neighbor") {
            Icon = MapPin; 
            colorClass = "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
          } else if (connection === "subregion") {
            Icon = Globe;
            colorClass = "text-orange-500 bg-orange-500/10 border-orange-500/20";
          } else if (connection === "region") {
            Icon = Globe;
            colorClass = "text-red-500 bg-red-500/10 border-red-500/20";
          }


          return (
            <li key={idx} className="flex items-center gap-3 p-3 bg-[#121212] border-b border-[#333] text-sm relative overflow-hidden transition-colors duration-200 hover:bg-[#181818] hover:border-[#3b4148] rounded-sm group">
              {isCorrect && <div className="absolute inset-0 bg-green-500/5 animate-pulse pointer-events-none"></div>}
              
              <span className="text-[#6b7280] w-6 text-right font-mono select-none text-xs">{guessNum}.</span>
              
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${colorClass} shrink-0`}>
                 <Icon size={20} strokeWidth={2.5} />
              </div>

              <div className="flex-grow min-w-0 flex flex-col justify-center">
                <span className={`font-bold truncate text-base ${isCorrect ? "text-[#22c55e]" : "text-[#e0e0e0]"}`}>
                  {guess.name}
                </span>
              </div>

              {!isCorrect && distance !== undefined && bearingAngle !== undefined && (
                <div className="flex flex-col items-end gap-1 text-xs md:text-sm whitespace-nowrap">
                  <span className={`font-mono font-bold ${distance < 2000 ? "text-orange-400" : "text-gray-500"}`}>
                    {distance.toLocaleString()} km
                  </span>
                  <div className="flex items-center gap-1 text-gray-400" title={`Bearing: ${Math.round(bearingAngle)}°`}>
                     <ArrowUp 
                        size={16} 
                        className="text-[#3b82f6]"
                        style={{ transform: `rotate(${bearingAngle}deg)` }} 
                     />
                  </div>
                </div>
              )}

              {isCorrect && (
                 <span className="text-green-400 font-bold text-xs md:text-sm animate-bounce whitespace-nowrap sm:flex items-center gap-1">
                    CORRECT <PartyPopper size={16} />
                 </span>
              )}
            </li>
          );
        })}

        {Array.from({ length: Math.max(0, 6 - guesses.length) }).map((_, i) => (
          <li key={`empty-${i}`} className="flex items-center gap-3 p-3 text-[#4b5563] font-mono text-sm border border-dashed border-[#333] rounded-md select-none opacity-70">
            <span className="w-6 text-right text-xs">{guesses.length + 1 + i}.</span>
            <div className="w-10 h-10 rounded-full flex items-center justify-center border border-[#333] bg-[#121212]">
            <Square size={16} className="text-[#4b5563]" />
            </div>
            <span>...</span>
          </li>
        ))}
      </ul>
    </div>
  );
};