import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';
import { getDistanceFromLatLonInKm, getBearingAngle } from "@/app/lib/geoUtils";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { date } = body; 
        let { guesses } = body;

        if (!date || !Array.isArray(guesses)) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        const cookieStore = await cookies();
        let sessionId = cookieStore.get('geo_session')?.value;

        if (!sessionId) {
            sessionId = uuidv4();
        }

        const client = await clientPromise;
        const db = client.db("geo_game");
        const collection = db.collection("user_progress");

        const dailyGame = await db.collection("daily_games").findOne({ date });
        let isWon = false;

        if (dailyGame && guesses.length > 0) {
            const targetLat = dailyGame.targetCountry.latlng[0];
            const targetLng = dailyGame.targetCountry.latlng[1];

            guesses = guesses.map((g: any) => {
                const lat = Array.isArray(g.latlng) && g.latlng.length >= 2 ? g.latlng[0] : 0;
                const lng = Array.isArray(g.latlng) && g.latlng.length >= 2 ? g.latlng[1] : 0;
                
                const distance = Math.round(getDistanceFromLatLonInKm(lat, lng, targetLat, targetLng));
                const bearing = Math.round(getBearingAngle(lat, lng, targetLat, targetLng));

                let connection = "none";
                
                if (g.alpha3Code && dailyGame.targetCountry.alpha3Code) {
                    if (dailyGame.targetCountry.alpha3Code === g.alpha3Code) connection = "guess";
                    else if (dailyGame.targetCountry.borders?.includes(g.alpha3Code)) connection = "neighbor";
                    else if (dailyGame.targetCountry.subregion === g.subregion) connection = "subregion";
                    else if (dailyGame.targetCountry.region === g.region) connection = "region";
                } else if (g.connection) {
                    connection = g.connection; 
                }

                return { 
                    name: g.name,
                    alpha2Code: g.alpha2Code, 
                    flag: g.flag,
                    latlng: g.latlng,
                    distance, 
                    bearing, 
                    connection, 
                };

            });

            const newestGuess = guesses[0];
            if (newestGuess.name?.toLowerCase() === dailyGame.targetCountry.name.toLowerCase()) {
                isWon = true;
            }
        }

        await collection.updateOne(
            { sessionId, date },
            { $set: { guesses, won: isWon, lastPlayed: new Date() } },
            { upsert: true }
        );

        const response = NextResponse.json({ success: true, sessionId, won: isWon, guesses });
        const isProd = process.env.NODE_ENV === 'production';

        response.cookies.set('geo_session', sessionId, {
            secure: isProd,
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
        
        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return NextResponse.json({ error: "Valid date required" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("geo_game");
        const collection = db.collection("user_progress");

        const progress = await collection.findOne({ sessionId, date });

        const gamesPlayed = await collection.countDocuments({ sessionId });
        const wonGames = await collection.countDocuments({ sessionId, won: true });
        
        return NextResponse.json({ 
            ...(progress || { guesses: [], won: false }),
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
