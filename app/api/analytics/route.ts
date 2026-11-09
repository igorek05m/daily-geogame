import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';

type SessionStatsRow = {
    _id: string;
    gamesPlayed: number;
    completedGames: number;
    wins: number;
    guesses: number;
};

type DailyActivityRow = {
    _id: string;
    players: number;
};

export async function GET() {
    try {
        const client = await clientPromise;
        const collection = client.db("geo_game").collection("user_progress");

        const [sessions, dailyActivity] = await Promise.all([
            collection.aggregate<SessionStatsRow>([
                {
                    $group: {
                        _id: "$sessionId",
                        gamesPlayed: { $sum: 1 },
                        completedGames: {
                            $sum: {
                                $cond: [
                                    { $or: ["$won", { $gte: [{ $size: "$guesses" }, 6] }] },
                                    1,
                                    0
                                ]
                            }
                        },
                        wins: { $sum: { $cond: ["$won", 1, 0] } },
                        guesses: { $sum: { $size: "$guesses" } }
                    }
                }
            ]).toArray(),
            collection.aggregate<DailyActivityRow>([
                { $group: { _id: { date: "$date", sessionId: "$sessionId" } } },
                { $group: { _id: "$_id.date", players: { $sum: 1 } } },
                { $sort: { _id: -1 } }
            ]).toArray()
        ]);

        const totalGames = sessions.reduce((sum, session) => sum + session.gamesPlayed, 0);
        const completedGames = sessions.reduce((sum, session) => sum + session.completedGames, 0);
        const totalWins = sessions.reduce((sum, session) => sum + session.wins, 0);
        const totalGuesses = sessions.reduce((sum, session) => sum + session.guesses, 0);
        const totalPlayers = sessions.length;

        return NextResponse.json({
            overallPlayers: totalPlayers,
            totalGames,
            totalWins,
            completedGames,
            totalLosses: completedGames - totalWins,
            totalGuesses,
            completionRate: totalGames > 0 ? Math.round((completedGames / totalGames) * 100) : 0,
            overallWinRate: completedGames > 0 ? Math.round((totalWins / completedGames) * 100) : 0,
            averageGuessesPerGame: totalGames > 0 ? Number((totalGuesses / totalGames).toFixed(1)) : 0,
            activeDays: dailyActivity.length,
            averageGamesPerSession: totalPlayers > 0 ? Number((totalGames / totalPlayers).toFixed(1)) : 0,
            averageWinsPerSession: totalPlayers > 0 ? Number((totalWins / totalPlayers).toFixed(1)) : 0,
            dailyActivity: dailyActivity.map(({ _id: date, players }) => ({ date, players }))
        });
    } catch (error) {
        console.error("Analytics error", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
