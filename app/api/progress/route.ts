import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { guesses, winStreak, gamesPlayed, won, date } = body;

        const cookieStore = await cookies();
        let sessionId = cookieStore.get('geo_session')?.value;

        if (!sessionId) {
            sessionId = uuidv4();
        }

        const client = await clientPromise;
        const db = client.db("geo_game");
        const collection = db.collection("user_progress");

        await collection.updateOne(
            { sessionId, date },
            { 
                $set: { 
                    guesses, 
                    winStreak: winStreak || 0,
                    gamesPlayed: gamesPlayed || 0,
                    won: !!won,
                    lastPlayed: new Date()
                } 
            },
            { upsert: true }
        );

        const response = NextResponse.json({ success: true, sessionId });

        response.cookies.set('geo_session', sessionId, {
            secure: true,
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 365 * 10
        });

        return response;
    } catch (e) {
        console.error("Failed to save progress", e);
        return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const sessionId = cookieStore.get('geo_session')?.value;

        if (!sessionId) {
            return NextResponse.json({ guesses: [], winStreak: 0, gamesPlayed: 0 });
        }

        const url = new URL(req.url);
        const date = url.searchParams.get('date');
        
        if (!date) return NextResponse.json({ error: "Date required" }, { status: 400 });

        const client = await clientPromise;
        const db = client.db("geo_game");
        const collection = db.collection("user_progress");

        const progress = await collection.findOne({ sessionId, date });

        const allGames = await collection.find({ sessionId }).toArray();
        const gamesPlayed = allGames.length;
        const wonGames = allGames.filter(g => g.won).length;
        
        return NextResponse.json({ 
            ...(progress || { guesses: [] }),
            stats: {
                gamesPlayed,
                wins: wonGames,
                winRate: gamesPlayed > 0 ? Math.round((wonGames / gamesPlayed) * 100) : 0
            }
        });

    } catch (e) {
        console.error("Failed to load progress", e);
        return NextResponse.json({ error: "Failed to load" }, { status: 500 });
    }
}
