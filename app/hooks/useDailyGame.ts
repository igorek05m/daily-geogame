import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GAME_START_DATE, Country, GlobalStats } from "@/app/types";
import countries from "@/app/lib/countries.json";

export function useDailyGame() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const todayStr = new Date().toISOString().split('T')[0];
    
    const initialDate = searchParams.get('date') || todayStr;
    const initialValidDate = (initialDate >= GAME_START_DATE && initialDate <= todayStr) ? initialDate : todayStr;

    const [gameDate, setGameDate] = useState(initialValidDate);
    const [guesses, setGuesses] = useState<Country[]>([]);
    const [targetCountry, setTargetCountry] = useState<Country | null>(null);
    const [gameOver, setGameOver] = useState(false);
    const [hasWon, setHasWon] = useState(false);
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
        router.push(`/?date=${newDate}`);
        
        setGameOver(false);
        setHasWon(false);
        setGuesses([]);
        setTargetCountry(null);
        setLoading(true);
    };

    const goToToday = () => {
        if (gameDate === todayStr) return;
        setGameDate(todayStr);
        router.push(`/`);
        setGameOver(false);
        setHasWon(false);
        setGuesses([]);
        setTargetCountry(null);
        setLoading(true);
    };

    const selectDate = (newDate: string) => {
        if (newDate > todayStr) return;
        if (newDate < GAME_START_DATE) return;
        if (newDate === gameDate) return;
        
        setGameDate(newDate);
        if (newDate === todayStr) {
           router.push(`/`);
        } else {
           router.push(`/?date=${newDate}`);
        }
        
        setGameOver(false);
        setHasWon(false);
        setGuesses([]);
        setTargetCountry(null);
        setLoading(true);
    };

    useEffect(() => {
        async function init() {
            try {
                setLoading(true);

                const [progRes, gameRes, statsRes] = await Promise.all([
                    fetch(`/api/progress?date=${gameDate}`),
                    fetch(`/api/daily?date=${gameDate}`),
                    fetch(`/api/stats?date=${gameDate}`)
                ]);

                let isWon = false;
                let currentGuesses: Country[] = [];

                if (progRes.ok) {
                    const progData = await progRes.json();

                    if (progData.stats) setUserStats(progData.stats);

                    if (progData.guesses) {
                        currentGuesses = progData.guesses;
                        setGuesses(currentGuesses);
                    }
                    isWon = progData.won;
                    setHasWon(isWon);
                    
                    if (isWon || currentGuesses.length >= 6) {
                        setGameOver(true);
                    }
                }

                if (gameRes.ok) {
                    const gameData = await gameRes.json();
                    setHintPackages(gameData.hintPackages || []);
                    setTargetCountry(gameData.targetCountry || null); 
                }

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

    const submitGuess = async (name: string) => {
        if (gameOver) return;

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
            const res = await fetch(`/api/country?code=${basic.alpha2}`);
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

            const progressRes = await fetch('/api/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: gameDate, guesses: newGuesses })
            });

            if (progressRes.ok) {
                const progData = await progressRes.json();
                
                if (progData.guesses) {
                    setGuesses(progData.guesses);
                }
                
                setHasWon(progData.won);

                let isNowGameOver = false;
                if (progData.won || newGuesses.length >= 6) {
                    isNowGameOver = true;
                    
                    if (progData.won) {
                        setUserStats(prev => ({ ...prev, wins: prev.wins + 1 }));
                    }

                    const statsRes = await fetch(`/api/stats?date=${gameDate}`);
                    if (statsRes.ok) {
                        const statsData = await statsRes.json();
                        setGlobalStats(statsData || { totalPlayers: 0, totalWinners: 0, winRate: 0, guessDistribution: {} });
                    }
                }

                const gameRes = await fetch(`/api/daily?date=${gameDate}`);
                if (gameRes.ok) {
                    const gameData = await gameRes.json();
                    setHintPackages(gameData.hintPackages || []);
                    if (gameData.targetCountry) setTargetCountry(gameData.targetCountry);
                }
                
                if (isNowGameOver) {
                    setGameOver(true);
                }
            }
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
    };
}