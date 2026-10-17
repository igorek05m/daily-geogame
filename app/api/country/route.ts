import { NextRequest, NextResponse } from 'next/server';
import { fetchCountryDetails } from '@/app/lib/countryData';

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get('code');
    
    if (!code) {
        return NextResponse.json({ error: "Country code is required" }, { status: 400 });
    }

    try {
        const country = await fetchCountryDetails(code);
        if (!country) {
            return NextResponse.json({ error: "Country not found" }, { status: 404 });
        }

        return NextResponse.json([{
            name: { common: country.name },
            cca2: country.alpha2Code,
            cca3: country.alpha3Code,
            latlng: country.latlng,
            borders: country.borders,
            area: country.area,
            population: country.population,
            flags: { svg: country.flag },
            region: country.region,
            subregion: country.subregion
        }]);
    } catch (error) {
        console.error("REST Countries request failed:", error);
        return NextResponse.json({ error: "Country data unavailable" }, { status: 502 });
    }
}