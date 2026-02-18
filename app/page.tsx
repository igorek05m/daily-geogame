"use client";

import { useEffect, useState } from "react";
import WorldMap from "./_map/page";
import countries from "./lib/countries.json";
import { HintGrid } from './hintGrid';

const GAME_START_DATE = "2026-02-18";

export type Country = {
  name: string;
  alpha2Code: string;
  alpha3Code: string;
  latlng: [number, number];
  borders?: string[];
  area?: number;
  population?: number;
  flag?: string;
  region?: string;
  subregion?: string;
};

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  var R = 6371;
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return Math.round(d);
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

function getBearing(lat1: number, lon1: number, lat2: number, lon2: number) {
  const startLat = deg2rad(lat1);
  const startLng = deg2rad(lon1);
  const destLat = deg2rad(lat2);
  const destLng = deg2rad(lon2);

  const y = Math.sin(destLng - startLng) * Math.cos(destLat);
  const x = Math.cos(startLat) * Math.sin(destLat) - Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
  let brng = Math.atan2(y, x);
  brng = (brng * 180 / Math.PI + 360) % 360;
  const arrows = ["⬆️", "↗️", "➡️", "↘️", "⬇️", "↙️", "⬅️", "↖️"];
  const index = Math.round(brng / 45) % 8;
  return arrows[index];
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [guesses, setGuesses] = useState<Country[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [targetCountry, setTargetCountry] = useState<Country | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [hintPackages, setHintPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({ gamesPlayed: 0, wins: 0, winRate: 0 });

  const todayStr = new Date().toISOString().split('T')[0];
  const [gameDate, setGameDate] = useState(todayStr);

  const changeDate = (offset: number) => {
    const current = new Date(gameDate);
    current.setDate(current.getDate() + offset);
    const newDate = current.toISOString().split('T')[0];

    if (newDate > todayStr) return;

    if (newDate < GAME_START_DATE) return;
    
    setGameDate(newDate);
    setGameOver(false);
    setGuesses([]);
    setTargetCountry(null);
    setLoading(true);
  };

  const getDayNumber = (dateStr: string) => {
    const start = new Date(GAME_START_DATE).getTime();
    const current = new Date(dateStr).getTime();
    const diff = Math.floor((current - start) / (1000 * 3600 * 24));
    return Math.max(1, diff + 1);
  };

  useEffect(() => {
    setMounted(true);
    async function init() {
      try {
        setLoading(true);
        const gameRes = await fetch(`/api/daily?date=${gameDate}`);
        const gameData = await gameRes.json();
        
        let currentGameTarget: Country | null = null;
        if (gameData.targetCountry) {
          currentGameTarget = gameData.targetCountry;
          setTargetCountry(currentGameTarget);
          setHintPackages(gameData.hintPackages || []);
        }

        if (currentGameTarget) {
          const progRes = await fetch(`/api/progress?date=${gameDate}`);
          if (progRes.ok) {
            const progData = await progRes.json();
            
            if (progData.stats) setUserStats(progData.stats);

            if (progData.guesses && Array.isArray(progData.guesses)) {
              setGuesses(progData.guesses);
              
              const newestGuess = progData.guesses[0];
              if (newestGuess && newestGuess.name === currentGameTarget.name) {
                setGameOver(true);
              } else if (progData.guesses.length >= 6) {
                setGameOver(true);
              }
            }
          }
        }

      } catch (error) {
        console.error("Failed to init game", error);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [gameDate]);

  const saveProgress = async (newGuesses: Country[], isWin: boolean) => {
      try {
        await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: gameDate,
            guesses: newGuesses,
            won: isWin,
          })
        });
      } catch (e) {
        console.error("Failed to save progress", e);
      }
  };

  const handleGuess = () => {
    if (!targetCountry || gameOver) return;
    const normalizedInput = inputVal.trim().toLowerCase();
    
    guessAsync(normalizedInput);
  };

  const guessAsync = async (name: string) => {
      const basic = countries.find(c => c.name.toLowerCase() === name);
      if (!basic) {
        alert("Unknown country! Try picking from the list.");
        return;
      }
      
      if (guesses.some(g => g.name.toLowerCase() === name)) {
        alert("Already guessed!");
        return;
      }

      // setLoading(true); // temporary spinner for guess?
      try {
         const res = await fetch(`https://restcountries.com/v3.1/alpha/${basic.alpha2}`);
         if (!res.ok) throw new Error("Failed to fetch country data");
         const data = await res.json();
         const details = data[0];
         
         const countryData: Country = {
          name: details.name.common,
          alpha2Code: details.cca2,
          alpha3Code: details.cca3,
          latlng: details.latlng,
          borders: details.borders,
          area: details.area,
          population: details.population,
          flag: details.flags.svg,
          region: details.region,
          subregion: details.subregion
        };

        const newGuesses = [countryData, ...guesses];
        setGuesses(newGuesses);
        setInputVal("");
        setShowSuggestions(false);

        let won = false;
        if (countryData.name === targetCountry?.name) {
          setGameOver(true);
          won = true;
        } else if (newGuesses.length >= 6) {
          setGameOver(true);
        }

        await saveProgress(newGuesses, won);

      } catch (err) {
        console.error(err);
        alert("Error fetching country data. Try again.");
      } finally {
        setLoading(false);
      }
  };

  const handleSelect = (name: string) => {
    setInputVal(name);
    setShowSuggestions(false);
  };

  const currentFilteredCountries = countries.filter(c => 
    c.name.toLowerCase().includes(inputVal.toLowerCase())
  ).slice(0, 10);

  if (loading || !targetCountry) return <div className="min-h-screen bg-black text-white p-10 flex items-center justify-center">Loading Daily Challenge...</div>;

  const dayNumber = getDayNumber(gameDate);

  return (
    <div className="min-h-screen bg-[#121212] text-[#e0e0e0] font-mono p-4 flex flex-col items-center gap-6">
      <div className="w-full max-w-4xl border border-[#333] bg-[#1e1e1e] p-2 flex flex-col md:flex-row justify-between items-center shadow-lg rounded-sm gap-2">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => changeDate(-1)} 
            disabled={gameDate <= GAME_START_DATE}
            className={`text-gray-400 px-2 ${gameDate <= GAME_START_DATE ? "opacity-30 cursor-not-allowed" : "hover:text-white"}`}
          >
            ◀
          </button>
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-wider text-green-400">DAILY GUESS #{dayNumber}</h1>
            <span className="text-xs text-gray-500 block">{gameDate}</span>
          </div>
          <button 
            onClick={() => changeDate(1)} 
            disabled={gameDate >= todayStr} 
            className={`px-2 ${gameDate >= todayStr ? "text-gray-700 cursor-not-allowed" : "text-gray-400 hover:text-white"}`}
          >
            ▶
          </button>
        </div>
        
        <div className="bg-[#333] px-3 py-1 rounded text-yellow-400 flex gap-2">
            <span>🏆 {userStats.wins} Wins</span>
        </div>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-1 gap-6">
        <div className="w-full aspect-video bg-[#1a1a1a] border border-[#333] relative">
           <WorldMap guesses={guesses} targetCountry={targetCountry} />
           <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 px-4 py-1 rounded text-sm border border-gray-600">
              INTERACTIVE MAP
           </div>
        </div>

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

              if (isCorrect) {
                square = "🟩";
              } else if (isNeighbor) {
                square = "🟨";
              } else if (isSameSubregion) {
                square = "🟧";
              } else {
                square = "🟥"; 
              }

              return (
                <li key={idx} className="flex items-center gap-3 p-2 bg-[#121212] border border-[#333] font-mono text-sm relative overflow-hidden transition-colors hover:bg-[#1a1a1a]">
                  {isCorrect && <div className="absolute inset-0 bg-green-500/10 animate-pulse pointer-events-none"></div>}
                  <span className="text-gray-500 w-6 text-right font-mono select-none">{guessNum}.</span> 
                  <span className="text-xl select-none" title={isCorrect ? "Correct!" : isNeighbor ? "Neighbor" : "Incorrect"}>{square}</span>
                  <div className="flex-grow min-w-0">
                    <span className={`font-bold truncate block ${isCorrect ? "text-green-400" : "text-white"}`}>
                      {guess.name}
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

        <HintGrid 
          hintPackages={hintPackages} 
          guesses={guesses} 
          gameOver={gameOver} 
        />

      </div>
    </div>
  );
}