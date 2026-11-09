import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';

type GuessDistributionRow = {
    _id: number;
    count: number;
};

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const date = url.searchParams.get('date');
        
        if (!date) return NextResponse.json({ error: "Date required" }, { status: 400 });

        const client = await clientPromise;
        const db = client.db("geo_game");
        const collection = db.collection("user_progress");

        const [totalPlayers, totalWinners, distribution] = await Promise.all([
            collection.countDocuments({ date }),
            collection.countDocuments({ date, won: true }),
            collection.aggregate<GuessDistributionRow>([
                { $match: { date, won: true } },
                { $project: { numberOfGuesses: { $size: "$guesses" } } },
                { $group: { _id: "$numberOfGuesses", count: { $sum: 1 } } },
                { $sort: { _id: 1 } }
            ]).toArray()
        ]);

        const guessDistribution: Record<string, number> = {};
        distribution.forEach((item) => {
            guessDistribution[item._id] = item.count;
        });

        return NextResponse.json({
            totalPlayers,
            totalWinners,
            winRate: totalPlayers > 0 ? Math.round((totalWinners / totalPlayers) * 100) : 0,
            guessDistribution
        });
    } catch (e) {
        console.error("Stats error", e);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}