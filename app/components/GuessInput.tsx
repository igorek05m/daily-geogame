import { useState, useEffect, useRef } from 'react';
import countries from "@/app/lib/countries.json";
import { GuessInputProps } from '@/app/types';

export const GuessInput = ({ onGuess, gameOver }: GuessInputProps) => {
  const [inputVal, setInputVal] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

   const currentFilteredCountries = countries.filter(c => 
    c.name.toLowerCase().includes(inputVal.toLowerCase())
  ).slice(0, 10);

  useEffect(() => {
    if (listRef.current && showSuggestions && currentFilteredCountries.length > 0) {
      const selectedItem = listRef.current.children[selectedIndex];
      if (selectedItem) {
        selectedItem.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex, showSuggestions, currentFilteredCountries]);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || currentFilteredCountries.length === 0) {
      if (e.key === 'Enter') handleGuess();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      if (currentFilteredCountries[selectedIndex]) {
        setInputVal(currentFilteredCountries[selectedIndex].name);
      }
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, currentFilteredCountries.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && currentFilteredCountries[selectedIndex]) {
        handleSelect(currentFilteredCountries[selectedIndex].name);
      } else {
        handleGuess();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
    setShowSuggestions(true);
    setSelectedIndex(0); 
  };

  return (
    <div className="w-full relative z-50">
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <input 
            type="text" 
            value={inputVal}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter country name..."
            aria-label="Country guess"
            className="w-full bg-[#1e1e1e] border border-[#333] p-3.5 text-[#e0e0e0] focus:outline-none focus:border-[#3b82f6] rounded-md placeholder:text-[#6b7280]"
            disabled={gameOver}
          />
          {showSuggestions && inputVal && (
            <ul ref={listRef} className="absolute left-0 right-0 top-full mt-1 bg-[#1e1e1e] border border-[#333] max-h-60 overflow-y-auto shadow-xl z-50 rounded-md">
              {currentFilteredCountries.map((c, index) => (
                <li 
                  key={c.name} 
                  onClick={() => handleSelect(c.name)}
                  className={`p-2 cursor-pointer border-b border-[#333] last:border-b-0 flex justify-between items-center
                  ${index === selectedIndex 
                    ? "bg-[#333] text-[#3b82f6] border-l-4 border-l-[#22c55e] pl-1"
                    : "hover:bg-[#333] hover:text-[#3b82f6] text-[#d1d5db]"
                  }`}
                >
                  {c.name}
                  {index === selectedIndex && <span className="text-xs">↵</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button 
          onClick={handleGuess}
          disabled={gameOver || !inputVal}
          className="bg-[#22c55e] hover:bg-[#15803d] text-white px-6 font-bold disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed rounded-md"
        >
          GUESS
        </button>
      </div>
    </div>
  );
};