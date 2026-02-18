import React, { useState } from 'react';
import countries from "@/app/lib/countries.json";

interface GuessInputProps {
  onGuess: (name: string) => void;
  gameOver: boolean;
}

export const GuessInput = ({ onGuess, gameOver }: GuessInputProps) => {
  const [inputVal, setInputVal] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleGuess = () => {
    if (!inputVal.trim()) return;
    onGuess(inputVal.trim());
    setInputVal("");
    setShowSuggestions(false);
  };

  const handleSelect = (name: string) => {
    onGuess(name);
    setInputVal("");
    setShowSuggestions(false);
  };

  const currentFilteredCountries = countries.filter(c => 
    c.name.toLowerCase().includes(inputVal.toLowerCase())
  ).slice(0, 10);

  return (
    <div className="w-full relative z-50">
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <input 
              type="text" 
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
              placeholder="Enter country name..."
              className="w-full bg-[#1e1e1e] border border-[#333] p-3 text-white focus:outline-none focus:border-green-500 rounded-sm uppercase placeholder:normal-case"
              disabled={gameOver}
            />
            {showSuggestions && inputVal && (
              <ul className="absolute left-0 right-0 top-full mt-1 bg-[#252525] border border-[#444] max-h-60 overflow-y-auto shadow-2xl z-50">
                {currentFilteredCountries.map(c => (
                  <li 
                    key={c.name} 
                    onClick={() => handleSelect(c.name)}
                    className="p-2 hover:bg-[#333] cursor-pointer border-b border-[#333] last:border-0 hover:text-green-400"
                  >
                    {c.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button 
            onClick={handleGuess}
            disabled={gameOver || !inputVal}
            className="bg-green-700 hover:bg-green-600 text-white px-6 font-bold border border-green-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(0,255,0,0.2)]"
          >
            GUESS
          </button>
        </div>
    </div>
  );
};