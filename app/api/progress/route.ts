import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';
import { getDistanceFromLatLonInKm, getBearingAngle } from "@/app/lib/geoUtils";
import countries from '@/app/lib/countries.json';
import { GAME_START_DATE, Country } from '@/app/types';

type SubmittedGuess = Pick<Country, 'name' | 'alpha2Code' | 'alpha3Code' | 'latlng' | 'flag' | 'region' | 'subregion' | 'connection'>;
type StoredGuess = {
    name: string;
    alpha2Code: string;
    alpha3Code?: string;
    flag?: string;
    latlng: [number, number];
    distance?: number;
    bearing?: number;
    connection?: Country['connection'];
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { date } = body;
        let { guesses } = body as { date?: unknown; guesses?: unknown };

        const today = new Date().toISOString().split('T')[0];
        if (
            typeof date !== 'string' ||
            !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
            date < GAME_START_DATE ||
            date > today ||
            !Array.isArray(guesses) ||
            guesses.length === 0 ||
            guesses.length > 6
        ) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        const countryByName = new Map(
            countries.map((country) => [country.name.toLowerCase(), country])
        );
        const submittedGuesses = guesses as SubmittedGuess[];
        const validGuesses = submittedGuesses.every((guess) => {
            if (
                !guess ||
                typeof guess.name !== 'string' ||
                typeof guess.alpha2Code !== 'string' ||
                !Array.isArray(guess.latlng) ||
                guess.latlng.length < 2 ||
                !guess.latlng.every((value) => typeof value === 'number' && Number.isFinite(value))
            ) {
                return false;
            }

            const country = countryByName.get(guess.name.toLowerCase());
            return country?.alpha2.toLowerCase() === guess.alpha2Code.toLowerCase();
        });

        if (!validGuesses) {
            return NextResponse.json({ error: "Invalid guesses" }, { status: 400 });
        }

        let storedGuesses: StoredGuess[] = submittedGuesses.map((guess) => ({
            name: guess.name,
            alpha2Code: guess.alpha2Code,
            alpha3Code: guess.alpha3Code,
            flag: guess.flag,
            latlng: guess.latlng,
            connection: guess.connection
        }));

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

            storedGuesses = submittedGuesses.map((g) => {
                const lat = Array.isArray(g.latlng) && g.latlng.length >= 2 ? g.latlng[0] : 0;
                const lng = Array.isArray(g.latlng) && g.latlng.length >= 2 ? g.latlng[1] : 0;
                
                const distance = Math.round(getDistanceFromLatLonInKm(lat, lng, targetLat, targetLng));
                const bearing = Math.round(getBearingAngle(lat, lng, targetLat, targetLng));

                let connection: Country['connection'] = "none";
                
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

            const newestGuess = storedGuesses[0];
            if (newestGuess.name?.toLowerCase() === dailyGame.targetCountry.name.toLowerCase()) {
                isWon = true;
            }
        }

        await collection.updateOne(
            { sessionId, date },
            { $set: { guesses: storedGuesses, won: isWon, lastPlayed: new Date() } },
            { upsert: true }
        );

        const response = NextResponse.json({ success: true, sessionId, won: isWon, guesses: storedGuesses });
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
