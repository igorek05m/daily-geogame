import { GameHeaderProps } from "@/app/types";

export const GameHeader = ({ dayNumber, gameDate, userStats, globalStats, changeDate, isToday, isStart }: GameHeaderProps) => {
  return (
    <div className="w-full max-w-4xl border border-[#333] bg-[#1e1e1e] p-2 flex flex-col md:flex-row justify-between items-center shadow-lg rounded-sm gap-2">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => changeDate(-1)} 
          disabled={isStart}
          className={`text-gray-400 px-2 ${isStart ? "opacity-30 cursor-not-allowed" : "hover:text-white"}`}
        >
          ◀
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold tracking-wider text-green-400">DAILY GUESS #{dayNumber}</h1>
          <span className="text-xs text-gray-500 block">{gameDate}</span>
        </div>
        <button 
          onClick={() => changeDate(1)} 
          disabled={isToday} 
          className={`px-2 ${isToday ? "text-gray-700 cursor-not-allowed" : "text-gray-400 hover:text-white"}`}
        >
          ▶
        </button>
      </div>
      
      <div className="flex gap-2">
        <div className="bg-[#333] px-3 py-1 rounded text-yellow-400 border border-yellow-400/20">
          <span>🏆 You: {userStats.wins}</span>
        </div>
        
        {/* <div className="bg-[#333] px-3 py-1 rounded text-blue-400 border border-blue-400/20">
          <span>🌍 Players: {globalStats?.totalPlayers || 0}</span>
        </div> */}
      </div>
    </div>
  );
};