import Image from "next/image";
import { Modal } from "./Modal";
import { Trophy, Frown, Users, Percent, Info } from "lucide-react";
import { StatsModalProps } from "@/app/types";

export function StatsModal({
  isOpen,
  onClose,
  dayNumber,
  gameOver,
  hasWon,
  targetCountry,
  globalStats,
  guesses
}: StatsModalProps) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Stats - Day ${dayNumber}`}
    >
      <div className="flex flex-col gap-6">
        {gameOver && targetCountry && (
          <div className="flex flex-col gap-4">
            <div className="text-center p-4 bg-[#1a1a1a] border border-[#333] rounded-lg relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-full h-1 ${hasWon ? "bg-green-500" : "bg-red-500"}`} />
              <h3 className={`flex items-center justify-center gap-2 text-2xl font-bold mb-3 ${hasWon ? "text-green-500" : "text-red-500"}`}>
                {hasWon ? (
                  <><Trophy className="w-6 h-6" /> Victory!</>
                ) : (
                  <><Frown className="w-6 h-6" /> Defeat</>
                )}
              </h3>
              <p className="text-gray-400 text-sm mb-2 uppercase tracking-wider">The hidden country was:</p>
              <div className="flex flex-col items-center justify-center gap-3">
                {targetCountry.flag && (
                  <Image
                    src={targetCountry.flag}
                    alt={`${targetCountry.name} flag`}
                    width={80}
                    height={54}
                    className="w-20 h-auto drop-shadow-md rounded-sm border border-[#555]"
                  />
                )}
                <span className="text-2xl font-bold text-white tracking-widest uppercase">
                  {targetCountry.name}
                </span>
              </div>
              
              <a
                href={`https://en.wikipedia.org/wiki/${encodeURIComponent(targetCountry.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center gap-2 bg-[#2a2a2a] hover:bg-[#333] border border-[#444] text-gray-200 py-2 px-4 rounded transition-colors text-sm font-semibold w-full"
              >
                <Info className="w-4 h-4" />
                Curious? Learn more
              </a>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#1a1a1a] border border-[#333] p-4 rounded-lg text-center shadow-inner relative flex flex-col items-center justify-center">
            <Users className="w-5 h-5 text-gray-500 absolute top-3 right-3 opacity-50" />
            <div className="text-3xl font-bold text-blue-400">{globalStats?.totalPlayers || 0}</div>
            <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Players</div>
          </div>
          <div className="bg-[#1a1a1a] border border-[#333] p-4 rounded-lg text-center shadow-inner relative flex flex-col items-center justify-center">
            <Percent className="w-5 h-5 text-gray-500 absolute top-3 right-3 opacity-50" />
            <div className="text-3xl font-bold text-yellow-400">{globalStats?.winRate || 0}%</div>
            <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">Win Rate</div>
          </div>
        </div>

        <div>
          <h4 className="text-sm text-gray-400 mb-3 uppercase tracking-wider font-semibold">Guess Distribution</h4>
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4, 5, 6].map((num) => {
              const count = globalStats?.guessDistribution?.[num] || 0;
              const maxCount = Math.max(...Object.values(globalStats?.guessDistribution || {}).map(Number), 1);
              const percentage = count === 0 ? 0 : Math.max((count / maxCount) * 100, 8);
              
              let barColor = "bg-gray-600";
              if (gameOver && hasWon && guesses.length === num) {
                 barColor = "bg-green-500";
              }
              
              return (
                <div key={num} className="flex items-center gap-3 text-sm font-mono">
                  <div className="w-3 text-right text-gray-400 font-bold">{num}</div>
                  <div className="flex-grow bg-[#1a1a1a] h-6 rounded overflow-hidden border border-[#333]">
                    <div 
                      className={`h-full ${barColor} flex items-center px-2 text-xs font-bold text-white transition-all`}
                      style={{ width: `${percentage}%` }}
                    >
                      {count > 0 ? count : ''}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
}