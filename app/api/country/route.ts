import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const code = req.nextUrl.searchParams.get('code');
    
    if (!code) {
        return NextResponse.json({ error: "Country code is required" }, { status: 400 });
    }

    try {
        const res = await fetch(`https://restcountries.com/v3.1/alpha/${code}`, {
            cache: 'force-cache'
        });
        
        if (!res.ok) throw new Error("Failed to fetch from RestCountries");
        
        const data = await res.json();
        return NextResponse.json(data);
    } catch (e) {
        console.error("Cache proxy error:", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}