import { GameHeaderProps, GAME_START_DATE } from "@/app/types";
import { ChevronLeft, ChevronRight, Trophy, BarChart2, CalendarRange, ScrollText, Dumbbell } from "lucide-react";

export const GameHeader = ({ dayNumber, gameDate, userStats, changeDate, goToToday, selectDate, todayStr, isToday, isStart, onOpenStats, onOpenChangelog }: GameHeaderProps) => {
  return (
    <div className="w-full pb-1 flex flex-col lg:flex-row justify-between items-stretch lg:items-end gap-5">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        <button 
          onClick={() => changeDate(-1)} 
          disabled={isStart}
          aria-label="Previous day"
          className={`text-gray-400 px-2 ${isStart ? "opacity-30 cursor-not-allowed " : "hover:text-white cursor-pointer"}`}
        >
          <ChevronLeft />
        </button>
        <div className="text-center flex flex-col items-center group relative cursor-pointer" onClick={() => (document.querySelector('input[type="date"]') as HTMLInputElement)?.showPicker?.()}>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-green-400 leading-tight flex items-center justify-center gap-2">
            DAILY GEO <span className="text-[#22c55e]">#{dayNumber}</span>
            <CalendarRange size={16} className="text-gray-500 group-hover:text-green-400 transition-colors" />
          </h1>
          <div className="relative flex justify-center items-center mt-1 gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-1">DATE</span>
            <input 
              type="date"
              value={gameDate}
              min={GAME_START_DATE}
              max={todayStr}
              onChange={(e) => {
                if (e.target.value) selectDate(e.target.value);
              }}
              className="text-[10px] sm:text-xs bg-[#2a2a2a] text-gray-300 border border-[#444] rounded pl-2 pr-1 py-0.5 cursor-pointer outline-none group-hover:border-green-500/50 group-hover:text-white transition-all font-mono"
              style={{ colorScheme: 'dark' }}
              title="Select different date"
            />
          </div>
        </div>
        <button 
          onClick={() => changeDate(1)} 
          disabled={isToday} 
          aria-label="Next day"
          className={`px-2 ${isToday ? "text-gray-700 cursor-not-allowed" : "text-gray-400 hover:text-white cursor-pointer"}`}
        >
          <ChevronRight />
        </button>
        
        {!isToday && (
          <button
            onClick={goToToday}
            className="flex items-center gap-1 text-xs bg-[#333] hover:bg-[#444] text-gray-300 font-bold px-3 py-1.5 rounded transition-colors border border-gray-600/50 cursor-pointer"
            title="Go to Today"
          >
            <CalendarRange size={14} /> Today
          </button>
        )}
      </div>
      
      <div className="flex gap-2 justify-end">
        <button
          disabled
          aria-label="Training mode coming soon"
          className="flex items-center gap-2 rounded bg-[#292929] px-3 py-2 text-sm font-bold text-gray-600 border border-[#3a3a3a] cursor-not-allowed"
          title="Training Mode — coming soon"
        >
          <Dumbbell size={16} /> <span className="hidden sm:inline">Training</span>
        </button>

        <button 
          onClick={onOpenChangelog}
          aria-label="Open changelog"
          className="bg-[#333] px-3 py-2 rounded text-blue-400 border border-blue-400/20 hover:bg-blue-900/30 transition-colors flex items-center gap-2 cursor-pointer"
          title="Changelog"
        >
          <ScrollText size={16} />
        </button>

        <button 
          onClick={onOpenStats}
          aria-label="Open statistics"
          className="bg-[#333] px-3 py-2 rounded text-purple-400 border border-purple-400/20 hover:bg-purple-900/30 transition-colors flex items-center gap-2 cursor-pointer"
          title="Daily Stats"
        >
          <BarChart2 size={16} />
        </button>
        
        <div className="bg-[#333] px-3 py-2 rounded text-[#facc15] border border-[#854d0e] flex items-center gap-2 text-sm font-bold">
          <Trophy size={16} /> <span>{userStats.wins} wins</span>
        </div>
      </div>
    </div>
  );
};