"use client";

import { Suspense, useState, useEffect } from "react";
import { useDailyGame } from "@/app/hooks/useDailyGame";
import { GameHeader } from "@/app/components/GameHeader";
import { GuessInput } from "@/app/components/GuessInput";
import { GuessList } from "@/app/components/GuessList";
import { HintGrid } from '@/app/components/HintGrid';
import { LastHint } from '@/app/components/LastHint';
import { WorldMap } from "@/app/components/Map";
import { Footer } from "@/app/components/Footer";
import { CommunityAnalyticsModal } from "@/app/components/CommunityAnalyticsModal";
import { StatsModal } from "@/app/components/StatsModal";
import { ChangelogModal } from "@/app/components/ChangelogModal";
import { GAME_START_DATE } from "@/app/types";

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#121212] text-[#e0e0e0] p-10 flex items-center justify-center">Loading today&apos;s map...</div>}>
      <GameContent />
    </Suspense>
  );
}

function GameContent() {
  const { 
    gameDate, 
    dayNumber, 
    guesses, 
    targetCountry, 
    gameOver,
    hasWon,
    hintPackages, 
    loading, 
    userStats,
    globalStats,
    changeDate, 
    goToToday,
    selectDate,
    submitGuess,
    todayStr 
  } = useDailyGame();

  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);

  useEffect(() => {
    if (gameOver) {
      setIsStatsModalOpen(true);
    } else {
      setIsStatsModalOpen(false);
    }
  }, [gameOver, gameDate]);
  
  if (loading) return <div className="min-h-screen bg-[#121212] text-[#e0e0e0] p-10 flex items-center justify-center">Loading today&apos;s map...</div>;

  return (
    <div className="min-h-screen bg-[#121212] text-[#e0e0e0] font-mono flex flex-col items-center">
      
      <div className="w-full max-w-5xl flex-grow px-4 py-6 md:px-8 md:py-8 flex flex-col gap-5">
        <GameHeader 
          dayNumber={dayNumber}
          gameDate={gameDate}
          userStats={userStats}
          globalStats={globalStats}
          changeDate={changeDate}
          goToToday={goToToday}
          selectDate={selectDate}
          todayStr={todayStr}
          isToday={gameDate >= todayStr}
          isStart={gameDate <= GAME_START_DATE}
          onOpenStats={() => setIsStatsModalOpen(true)}
          onOpenAnalytics={() => setIsAnalyticsOpen(true)}
          onOpenChangelog={() => setIsChangelogOpen(true)}
        />
        
        <div className="w-full h-[250px] sm:h-[380px] md:h-[560px] bg-[#1a1a1a] relative">
           <WorldMap guesses={guesses} targetCountry={targetCountry} />
        </div>

        <GuessInput 
           onGuess={submitGuess} 
           gameOver={gameOver} 
        />

        <LastHint 
           hintPackages={hintPackages} 
           guesses={guesses} 
           gameOver={gameOver} 
        />

        <GuessList 
           guesses={guesses} 
           targetCountry={targetCountry} 
           gameOver={gameOver} 
        />

        <HintGrid 
           hintPackages={hintPackages} 
           guesses={guesses} 
           gameOver={gameOver} 
        />

      </div>

      <Footer
        onOpenActivity={() => setIsAnalyticsOpen(true)}
      />
      <CommunityAnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        globalStats={globalStats}
        gameDate={gameDate}
      />

      <StatsModal 
        isOpen={isStatsModalOpen} 
        onClose={() => setIsStatsModalOpen(false)} 
        dayNumber={dayNumber}
        gameOver={gameOver}
        hasWon={hasWon}
        targetCountry={targetCountry}
        globalStats={globalStats}
        guesses={guesses}
      />
      
      <ChangelogModal 
        isOpen={isChangelogOpen} 
        onClose={() => setIsChangelogOpen(false)} 
      />

    </div>
  );
}