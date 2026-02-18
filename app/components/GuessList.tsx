import React from 'react';
import { Country } from '@/app/types';
import { getDistanceFromLatLonInKm, getBearing } from "@/app/lib/geoUtils";

interface GuessListProps {
  guesses: Country[];
  targetCountry: Country;
  gameOver: boolean;
}

export const GuessList = ({ guesses, targetCountry, gameOver }: GuessListProps) => {
  return (
    <div className="w-full bg-[#1e1e1e] border border-[#333] p-4 rounded-sm shadow-lg">
      <h2 className="border-b border-[#444] pb-2 mb-2 text-gray-400 font-bold uppercase text-sm">LAST GUESSES:</h2>
      
      {gameOver && (
        <div className="mt-4 p-4 bg-green-900/30 border border-green-600 rounded text-center">
          <h3 className="text-xl font-bold text-green-400">GAME OVER</h3>
          <p className="text-white mt-2">
            The country was: <span className="font-bold text-yellow-400 text-lg">{targetCountry.name}</span>
          </p>
          <p className="text-gray-400 text-sm mt-1">See you tomorrow!</p>
        </div>
      )}

      <ul className="space-y-2 mt-4">
        {guesses.slice().reverse().map((guess, idx) => {
          const distance = getDistanceFromLatLonInKm(
            guess.latlng[0], guess.latlng[1], 
            targetCountry.latlng[0], targetCountry.latlng[1]
          );
          const direction = getBearing(
            guess.latlng[0], guess.latlng[1], 
            targetCountry.latlng[0], targetCountry.latlng[1]
          );
          const isCorrect = guess.name === targetCountry.name;
          const guessNum = idx + 1;

          let square = "🟥"; 
          const isNeighbor = targetCountry.borders?.includes(guess.alpha3Code);
          const isSameSubregion = targetCountry.subregion === guess.subregion;
          const isClose = distance < 2000;

          if (isCorrect) square = "🟩";
          else if (isNeighbor) square = "🟨";
          else if (isSameSubregion || isClose) square = "🟧";

          return (
            <li key={idx} className="flex items-center gap-3 p-2 bg-[#121212] border border-[#333] font-mono text-sm relative overflow-hidden transition-colors hover:bg-[#1a1a1a]">
              {isCorrect && <div className="absolute inset-0 bg-green-500/10 animate-pulse pointer-events-none"></div>}
              <span className="text-gray-500 w-6 text-right font-mono select-none">{guessNum}.</span> 
              <span className="text-xl select-none">{square}</span>
              <div className="flex-grow min-w-0">
                <span className={`font-bold truncate block ${isCorrect ? "text-green-400" : "text-white"}`}>
                  {guess.name.toUpperCase()}
                </span>
              </div>

              {!isCorrect && (
                <div className="flex items-center gap-2 text-xs md:text-sm whitespace-nowrap">
                  <span className={`font-mono ${distance < 2000 ? "text-orange-400" : "text-red-400"}`}>
                    {distance.toLocaleString()} km
                  </span>
                  <span className="text-blue-400 font-bold bg-[#1a1a1a] px-1 rounded border border-[#333] min-w-[24px] text-center">
                    {direction}
                  </span>
                </div>
              )}

              {isCorrect && (<span className="text-green-400 font-bold text-xs md:text-sm animate-bounce whitespace-nowrap sm:inline-block">VICTORY! 🎉</span>)}
            </li>
          );
        })}

        {Array.from({ length: Math.max(0, 6 - guesses.length) }).map((_, i) => (
          <li key={`empty-${i}`} className="flex items-center gap-3 p-2 text-gray-600 font-mono text-sm opacity-30 border border-dashed border-[#333] select-none">
            <span className="w-6 text-right">{guesses.length + 1 + i}.</span>
            <span className="text-xl grayscale">⬜</span>
            <span>(Next guess...)</span>
          </li>
        ))}
      </ul>
    </div>
  );
};