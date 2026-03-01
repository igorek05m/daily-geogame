import { GameHeaderProps, GAME_START_DATE } from "@/app/types";
import { ChevronLeft, ChevronRight, Trophy, BarChart2, CalendarRange } from "lucide-react";

export const GameHeader = ({ dayNumber, gameDate, userStats, changeDate, goToToday, selectDate, todayStr, isToday, isStart, onOpenStats }: GameHeaderProps) => {
  return (
    <div className="w-full max-w-4xl border border-[#333] bg-[#1e1e1e] p-2 flex flex-col md:flex-row justify-between items-center shadow-lg rounded-sm gap-2">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => changeDate(-1)} 
          disabled={isStart}
          className={`text-gray-400 px-2 ${isStart ? "opacity-30 cursor-not-allowed " : "hover:text-white cursor-pointer"}`}
        >
          <ChevronLeft />
        </button>
        <div className="text-center flex flex-col items-center group relative cursor-pointer" onClick={() => (document.querySelector('input[type="date"]') as HTMLInputElement)?.showPicker?.()}>
          <h1 className="text-xl font-bold tracking-wider text-green-400 leading-tight flex items-center justify-center gap-2">
            DAILY GUESS #{dayNumber}
            <CalendarRange size={16} className="text-gray-500 group-hover:text-green-400 transition-colors" />
          </h1>
          <div className="relative flex justify-center items-center mt-1 gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-semibold flex items-center gap-1">DATE:</span>
            <input 
              type="date"
              value={gameDate}
              min={GAME_START_DATE}
              max={todayStr}
              onChange={(e) => {
                if (e.target.value) selectDate(e.target.value);
              }}
              className="text-[10px] sm:text-xs bg-[#2a2a2a] text-gray-300 border border-[#444] rounded pl-2.5 pr-1 py-0.5 cursor-pointer outline-none group-hover:border-green-500/50 group-hover:text-white transition-all font-mono shadow-sm [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:invert-[0.8] [&::-webkit-calendar-picker-indicator]:opacity-70 group-hover:[&::-webkit-calendar-picker-indicator]:opacity-100"
              style={{ colorScheme: 'dark' }}
              title="Select different date"
            />
          </div>
        </div>
        <button 
          onClick={() => changeDate(1)} 
          disabled={isToday} 
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
      
      <div className="flex gap-2">
        <button 
          onClick={onOpenStats}
          className="bg-[#333] px-3 py-1 rounded text-purple-400 border border-purple-400/20 hover:bg-purple-900/30 transition-colors flex items-center gap-2 cursor-pointer"
          title="Daily Stats"
        >
          <BarChart2 size={16} />
        </button>
        
        <div className="bg-[#333] px-3 py-1 rounded text-yellow-400 border border-yellow-400/20 flex items-center gap-2">
          <Trophy size={16} /> <span>You: {userStats.wins}</span>
        </div>
      </div>
    </div>
  );
};