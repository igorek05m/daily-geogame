"use client";
import { useState } from "react";
import { Activity, BarChart3, Frown, Gauge, Trophy, Users, type LucideIcon } from "lucide-react";
import { Modal } from "./Modal";
import { GlobalStats } from "@/app/types";

type CommunityAnalyticsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  globalStats?: GlobalStats;
  gameDate: string;
};

export function CommunityAnalyticsModal({ isOpen, onClose, globalStats, gameDate }: CommunityAnalyticsModalProps) {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);
  const dailyActivity = globalStats?.dailyActivity || [];
  const maxDailyPlayers = Math.max(...dailyActivity.map(({ players }) => players), 1);
  const activityByDate = new Map(dailyActivity.map(({ date, players }) => [date, players]));
  const activityMonths = Array.from(new Set(dailyActivity.map(({ date }) => date.slice(0, 7)))).sort().reverse();
  const selectedMonth = activityMonths[selectedMonthIndex] || activityMonths[0];
  const peakDay = dailyActivity.reduce((peak, day) => day.players > peak.players ? day : peak, { date: "", players: 0 });
  const summaryCards: { icon: LucideIcon; value: string | number; label: string; color: string }[] = [
    { icon: Users, value: globalStats?.overallPlayers || 0, label: "Unique sessions", color: "#3b82f6" },
    { icon: BarChart3, value: globalStats?.totalGames || 0, label: "Games started", color: "#f59e0b" },
    { icon: Trophy, value: globalStats?.totalWins || 0, label: "Wins", color: "#22c55e" },
    { icon: Frown, value: globalStats?.totalLosses || 0, label: "Losses", color: "#ef4444" },
    { icon: Gauge, value: globalStats?.completedGames || 0, label: "Games finished", color: "#60a5fa" }
  ];

  const getMonthDays = (month: string) => {
    const [year, monthNumber] = month.split("-").map(Number);
    const firstDay = new Date(Date.UTC(year, monthNumber - 1, 1));
    const daysInMonth = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
    return [
      ...Array.from({ length: firstDay.getUTCDay() }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) => `${month}-${String(index + 1).padStart(2, "0")}`)
    ];
  };

  const getActivityColor = (players: number | undefined) => {
    if (!players) return "bg-[#252525]";
    const intensity = players / maxDailyPlayers;
    if (intensity >= 0.75) return "bg-[#1d4ed8]";
    if (intensity >= 0.5) return "bg-[#2563eb]";
    if (intensity >= 0.25) return "bg-[#3b82f6]";
    return "bg-[#60a5fa]/60";
  };

  const changeMonth = (offset: number) => {
    setSelectedMonthIndex((index) => Math.min(Math.max(index + offset, 0), Math.max(activityMonths.length - 1, 0)));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Community analytics" wide>
      <div className="flex flex-col gap-6">
        <div className="rounded-xl border border-[#263b66] bg-gradient-to-br from-[#172554] via-[#111827] to-[#121212] p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#93c5fd]">Live community data</p>
              <h3 className="text-xl font-bold text-white">The nerdy breakdown</h3>
              <p className="mt-1 text-xs text-[#9ca3af]">Every recorded game since launch.</p>
            </div>
            <Activity className="h-8 w-8 text-[#60a5fa]" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {summaryCards.map(({ icon: StatIcon, value, label, color }) => {
            return <div key={label} className="rounded-lg border border-[#333] bg-[#121212] p-3 text-center">
              <StatIcon className="mx-auto mb-2 h-4 w-4" style={{ color }} />
              <div className="text-xl font-bold text-white">{value}</div>
              <div className="mt-1 text-[10px] uppercase tracking-wider text-[#9ca3af]">{label}</div>
            </div>;
          })}
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2"><Gauge className="h-4 w-4 text-[#a78bfa]" /><h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">Performance metrics</h3></div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 rounded-xl border border-[#333] bg-[#121212] p-4 sm:grid-cols-4">
            <Metric value={`${globalStats?.overallWinRate || 0}%`} label="Win rate of finished games" />
            <Metric value={`${globalStats?.completionRate || 0}%`} label="Completion rate" />
            <Metric value={globalStats?.totalGuesses || 0} label="Total attempts" />
            <Metric value={globalStats?.averageGuessesPerGame || 0} label="Avg. attempts / game" />
            <Metric value={globalStats?.activeDays || 0} label="Active days" />
            <Metric value={globalStats?.averageGamesPerSession || 0} label="Games / session" />
            <Metric value={globalStats?.averageWinsPerSession || 0} label="Wins / session" />
            <Metric value={`${peakDay.players || 0} sessions`} label={`Peak day${peakDay.date ? ` · ${peakDay.date}` : ""}`} />
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <div><h3 className="font-bold uppercase tracking-wider text-gray-300">Daily activity</h3><p className="mt-1 text-xs text-[#6b7280]">Unique sessions that played each day</p></div>
            <span className="text-[10px] uppercase tracking-wider text-gray-500">{gameDate}</span>
          </div>
          {selectedMonth ? <div>
            <div className="mb-3 flex items-center justify-between rounded-lg border border-[#333] bg-[#121212] p-2">
              <button type="button" onClick={() => changeMonth(1)} disabled={selectedMonthIndex >= activityMonths.length - 1} className="rounded px-3 py-1 text-lg text-gray-400 hover:bg-[#252525] hover:text-white disabled:opacity-30" aria-label="Previous month">&larr;</button>
              <select value={selectedMonth} onChange={(event) => setSelectedMonthIndex(activityMonths.indexOf(event.target.value))} className="cursor-pointer rounded border border-[#444] bg-[#1e1e1e] px-3 py-1 text-center text-sm font-bold uppercase tracking-wider text-white" aria-label="Select activity month">
                {activityMonths.map((month) => <option key={month} value={month}>{new Date(`${month}-01T00:00:00Z`).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" })}</option>)}
              </select>
              <button type="button" onClick={() => changeMonth(-1)} disabled={selectedMonthIndex <= 0} className="rounded px-3 py-1 text-lg text-gray-400 hover:bg-[#252525] hover:text-white disabled:opacity-30" aria-label="Next month">&rarr;</button>
            </div>
            <div className="mb-1 grid grid-cols-7 gap-1 text-center text-[9px] uppercase text-gray-600">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <span key={day}>{day[0]}</span>)}</div>
            <div className="grid grid-cols-7 gap-1">
              {getMonthDays(selectedMonth).map((date, index) => {
                const players = date ? activityByDate.get(date) : undefined;
                const isSelectedDay = date === gameDate;
                return <div key={`${selectedMonth}-${index}`} title={date ? `${date}: ${players || 0} ${players === 1 ? "session" : "sessions"}` : undefined} className={`flex aspect-square flex-col items-center justify-center rounded text-[10px] ${date ? `${getActivityColor(players)} ${isSelectedDay ? "ring-2 ring-white ring-offset-1 ring-offset-[#1e1e1e]" : ""}` : "bg-transparent"} ${players ? "text-white" : "text-gray-600"}`}>
                  {date && <span>{Number(date.slice(-2))}</span>}
                  {date && <span className={`text-[9px] font-bold ${players ? "text-white" : "text-gray-500"}`}>{players ? `${players} sessions` : "0 sessions"}</span>}
                </div>;
              })}
            </div>
          </div> : <p className="text-center text-[#9ca3af]">No activity data yet.</p>}
          <p className="mt-3 text-center text-[10px] leading-relaxed text-[#6b7280]">A session is an anonymous browser/device cookie, not a verified player account.</p>
        </div>
      </div>
    </Modal>
  );
}

function Metric({ value, label }: { value: string | number; label: string }) {
  return <div><div className="text-lg font-bold text-[#60a5fa]">{value}</div><div className="text-[10px] uppercase tracking-wider text-[#6b7280]">{label}</div></div>;
}
