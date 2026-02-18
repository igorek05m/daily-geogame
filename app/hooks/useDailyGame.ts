import { useState, useEffect } from "react";
import { GAME_START_DATE, Country, GlobalStats } from "@/app/types";
import countries from "@/app/lib/countries.json";

export function useDailyGame() {
    const todayStr = new Date().toISOString().split('T')[0];
    const [gameDate, setGameDate] = useState(todayStr);
    const [guesses, setGuesses] = useState<Country[]>([]);
    const [targetCountry, setTargetCountry] = useState<Country | null>(null);
    const [gameOver, setGameOver] = useState(false);
    const [hintPackages, setHintPackages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [userStats, setUserStats] = useState({ gamesPlayed: 0, wins: 0, winRate: 0 });
    const [globalStats, setGlobalStats] = useState<GlobalStats>({
        totalPlayers: 0,
        totalWinners: 0,
        winRate: 0,
        guessDistribution: {}
    });

    const getDayNumber = (dateStr: string) => {
        const start = new Date(GAME_START_DATE).getTime();
        const current = new Date(dateStr).getTime();
        const diff = Math.floor((current - start) / (1000 * 3600 * 24));
        return Math.max(1, diff + 1);
    };

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

    useEffect(() => {
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


            const statsRes = await fetch(`/api/stats?date=${gameDate}`);
            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setGlobalStats(statsData || { totalPlayers: 0, totalWinners: 0, winRate: 0 });
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

    const submitGuess = async (name: string) => {
        if (!targetCountry || gameOver) return;

        const basic = countries.find(c => c.name.toLowerCase() === name.toLowerCase());
        if (!basic) {
            alert("Unknown country! Try picking from the list.");
            return;
        }
        
        if (guesses.some(g => g.name.toLowerCase() === name.toLowerCase())) {
            alert("Already guessed!");
            return;
        }

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
        }
    };

    return {
        gameDate,
        dayNumber: getDayNumber(gameDate),
        guesses,
        targetCountry,
        gameOver,
        hintPackages,
        loading,
        userStats,
        globalStats,
        changeDate,
        submitGuess,
        todayStr
    };
}