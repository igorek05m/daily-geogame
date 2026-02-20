
import axios from 'axios';
import { HintPackage } from "@/app/types";

const REGIONS = [
  "africa", 
  "antarctica", 
  "australia-oceania", 
  "central-america-n-caribbean", 
  "central-asia", 
  "east-n-southeast-asia", 
  "europe", 
  "middle-east", 
  "north-america", 
  "south-america", 
  "south-asia"
];

const BASE_URL = "https://raw.githubusercontent.com/factbook/factbook.json/master";

function smartTruncate(str: string, len = 130) {
    if (!str) return "No data";
    if (str.length <= len) return str;
    const sub = str.substring(0, len);
    return sub.substring(0, sub.lastIndexOf(" ")) + "...";
}

export async function fetchFactbookData(fipsCode: string): Promise<any | null> {
  for (const region of REGIONS) {
    try {
      const url = `${BASE_URL}/${region}/${fipsCode.toLowerCase()}.json`;
      const response = await axios.get(url);
      if (response.status === 200) {
        return response.data;
      }
    } catch (e) {
        // Not found, try next region
    }
  }
  console.warn(`Could not find Factbook data for FIPS: ${fipsCode}`);
  return null;
}

export function generateHintPackages(data: any, basicData?: any): HintPackage[] {
    const hints: HintPackage[] = [];
  
    let climateVal = "No climate data.";
    if (data?.Geography?.Climate?.text) {
        climateVal = smartTruncate(data.Geography.Climate.text);
    }
    hints.push({ 
        title: "Climate", 
        hints: [{ label: "Weather", value: climateVal }] 
    });

    let terrainVal = "No terrain data.";
    if (data?.Geography?.Terrain?.text) {
        terrainVal = smartTruncate(data.Geography.Terrain.text);
    } 
    hints.push({ 
        title: "Terrain", 
        hints: [{ label: "Landscape", value: terrainVal }] 
    });

    let resourceVal = "No data.";
    if (data?.Geography?.["Natural resources"]?.text) {
         resourceVal = smartTruncate(data.Geography["Natural resources"].text);
    } else if (data?.Economy?.["Agricultural products"]?.text) {
         resourceVal = smartTruncate(data.Economy["Agricultural products"].text);
    }
    hints.push({ 
        title: "Resources", 
        hints: [{ label: "Natural / Agri", value: resourceVal }] 
    });

    let ecoVal = "No economic data.";
    if (data?.Economy?.["Exports - commodities"]?.text) {
        ecoVal = smartTruncate(data.Economy["Exports - commodities"].text);
    } else if (data?.Economy?.Industries?.text) {
        ecoVal = smartTruncate(data.Economy.Industries.text);
    }
    hints.push({ 
        title: "Trade", 
        hints: [{ label: "Main Exports", value: ecoVal }] 
    });

    const popStr = basicData?.population ? `${(basicData.population / 1000000).toFixed(2)}M` : "N/A";
    let cultureVal = "";
    
    if (data?.["People and Society"]?.Religions?.text) {
        cultureVal = smartTruncate(data["People and Society"].Religions.text, 80);
    } else if (basicData?.languages) {
        cultureVal = Object.values(basicData.languages).join(", ");
    }

    hints.push({ 
        title: "Society", 
        hints: [{ label: "Demographics", value: `Pop: ${popStr} ${cultureVal ? `| ${cultureVal}` : ""}` }] 
    });

    let symbolVal = "No symbol data.";

    if (data?.Government?.["Flag description"]?.text) {
        symbolVal = data.Government["Flag description"].text;
        symbolVal = smartTruncate(symbolVal, 160);
    } else if (data?.Government?.["National symbol(s)"]?.text) {
        symbolVal = `National Symbol: ${data.Government["National symbol(s)"].text}`;
    } else if (basicData?.currencies) {
        symbolVal = "Currency: " + Object.values(basicData.currencies).map((c: any) => `${c.name} (${c.symbol})`).join(", ");
    }

    hints.push({ 
        title: "Symbols", 
        hints: [{ label: "Iconography", value: symbolVal }] 
    });

    return hints;
}
