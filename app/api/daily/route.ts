
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import countries from '@/app/lib/countries.json';
import { fetchFactbookData, generateHintPackages, HintPackage } from '@/app/lib/factbook';
import axios from 'axios';

async function fetchCountryDetails(alpha2: string) {
  try {
    const res = await axios.get(`https://restcountries.com/v3.1/alpha/${alpha2}`);
    if (res.data && res.data.length > 0) {
      const data = res.data[0];
      return {
        name: data.name.common,
        alpha2Code: data.cca2,
        alpha3Code: data.cca3,
        latlng: data.latlng,
        borders: data.borders || [],
        area: data.area,
        population: data.population,
        flag: data.flags.svg,
        region: data.region,
        subregion: data.subregion
      };
    }
  } catch (e) {
    console.error(`Failed to fetch RestCountries for ${alpha2}`, e);
  }
  return null;
}

export async function GET(req: NextRequest) {
  try {
    let client;
    try {
       client = await clientPromise;
    } catch (dbError) {
       console.warn("Database connection failed, falling back to in-memory game generation.");
    }

    const url = new URL(req.url);
    const dateParam = url.searchParams.get("date");
    const today = new Date().toISOString().split('T')[0];
    const targetDate = dateParam || today;

    let game = null;

    if (client) {
      const db = client.db("geo_game");
      const collection = db.collection("daily_games");
      game = await collection.findOne({ date: targetDate });
    }

    if (!game) {
        console.log(`Creating new daily game for ${targetDate} (DB available: ${!!client})...`);

        let attempts = 0;
        let targetCountry = null;
        let factbookData = null;
        let hintPackages: HintPackage[] = [];

        while (!targetCountry && attempts < 5) {
            attempts++;
            const randIndex = Math.floor(Math.random() * countries.length);
            const candidate = countries[randIndex];
            
            const details = await fetchCountryDetails(candidate.alpha2);
            if (!details) continue;

            const fips = candidate.fipsCode || candidate.alpha2.toLowerCase();
            factbookData = await fetchFactbookData(fips);

            if (factbookData) {
            targetCountry = { ...details, fipsCode: fips };
            } else {
                console.log(`Skipping ${candidate.name} - no Factbook data.`);
            }
        }

        if (!targetCountry) {
            console.warn("Could not find a valid country after attempts. Forcing fallback.");
            const plDetails = await fetchCountryDetails("PL");
            const plFactbook = await fetchFactbookData("pl"); 
            
            targetCountry = plDetails || {
            name: "Poland", alpha2Code: "PL", alpha3Code: "POL", latlng: [52, 20], 
            borders: ["DEU", "CZE", "SVK", "UKR", "BLR", "LTU", "RUS"],
            area: 312696, population: 38000000, flag: "https://flagcdn.com/pl.svg", 
            region: "Europe", subregion: "Central Europe", fipsCode: "pl"
            };
            factbookData = plFactbook;
        }

        hintPackages = [];
        
        try {
            hintPackages = generateHintPackages(factbookData, targetCountry);
        } catch (err) {
            console.warn("Hint generation error", err);
            hintPackages = [];
        }

        if (hintPackages.length > 6) hintPackages = hintPackages.slice(0, 6);

        const newGame = {
            date: targetDate,
            targetCountry,
            hintPackages,
            createdAt: new Date()
        };

        if (client) {
            const db = client.db("geo_game");
            const collection = db.collection("daily_games");
            const result = await collection.insertOne(newGame);
            game = { ...newGame, _id: result.insertedId };
        } else {
            game = newGame;
        }
    }

    return NextResponse.json(game);

  } catch (e) {
    console.error("API Error:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
