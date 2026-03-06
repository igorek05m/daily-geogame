
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

function smartTruncate(str: string, len = 250) {
    if (!str) return "No data";
    if (str.length <= len) return str;

    const sub = str.substring(0, len);
    const lastPeriod = sub.lastIndexOf(". ");
    
    if (lastPeriod > len * 0.75) {
        return sub.substring(0, lastPeriod + 1) + "..";
    }
    
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
    } catch {
        // Not found, try next region
    }
  }
  console.warn(`Could not find Factbook data for FIPS: ${fipsCode}`);
  return null;
}

function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

const getVal = (obj: any, path: string[]) => {
    return path.reduce((acc, part) => (acc && acc[part]) ? acc[part] : null, obj);
};

export function generateHintPackages(data: any, basicData?: any): HintPackage[] {
    const hints: HintPackage[] = [];

    const climateOptions = [
        { label: "Weather", val: getVal(data, ["Geography", "Climate", "text"]) },
        { label: "Hazards", val: getVal(data, ["Geography", "Natural hazards", "text"]) },
        { label: "Environment", val: getVal(data, ["Geography", "Environment - current issues", "text"]) },
        { label: "Location", val: getVal(data, ["Geography", "Location", "text"]) },
        { label: "Comparative", val: getVal(data, ["Geography", "Area - comparative", "text"]) }
    ].filter(o => o.val);
    
    const climateChoice = climateOptions.length > 0 ? pickRandom(climateOptions) : { label: "Data", val: "No climate data." };
    
    hints.push({ 
        title: "Geography", 
        hints: [{ label: climateChoice.label, value: smartTruncate(climateChoice.val) }] 
    });

    const terrainOptions = [
        { label: "Landscape", val: getVal(data, ["Geography", "Terrain", "text"]) },
        { label: "Elevation", val: getVal(data, ["Geography", "Elevation", "highest point", "text"]) ? `Highest point: ${getVal(data, ["Geography", "Elevation", "highest point", "text"])}` : null },
        { label: "Coastline", val: getVal(data, ["Geography", "Coastline", "text"]) ? `Coastline length: ${getVal(data, ["Geography", "Coastline", "text"])}` : null },
        { label: "Land Use", val: getVal(data, ["Geography", "Land use", "agricultural land", "text"]) ? `Agricultural land: ${getVal(data, ["Geography", "Land use", "agricultural land", "text"])}` : null }
    ].filter(o => o.val);

    const terrainChoice = terrainOptions.length > 0 ? pickRandom(terrainOptions) : { label: "Data", val: "No terrain data." };

    hints.push({ 
        title: "Terrain", 
        hints: [{ label: terrainChoice.label, value: smartTruncate(terrainChoice.val) }] 
    });

    const resOptions = [
        { label: "Natural Resources", val: getVal(data, ["Geography", "Natural resources", "text"]) },
        { label: "Major Crops", val: getVal(data, ["Economy", "Agricultural products", "text"]) },
        { label: "Occupations", val: getVal(data, ["Economy", "Labor force - by occupation", "text"]) },
        { label: "Clean Energy", val: getVal(data, ["Energy", "Electricity - from renewable sources", "text"]) ? `Renewable energy: ${getVal(data, ["Energy", "Electricity - from renewable sources", "text"])}` : null }
    ].filter(o => o.val);

    const resChoice = resOptions.length > 0 ? pickRandom(resOptions) : { label: "Data", val: "No resource data." };
    
    hints.push({ 
        title: "Resources", 
        hints: [{ label: resChoice.label, value: smartTruncate(resChoice.val) }] 
    });

    const tradeOptions = [
        { label: "Main Exports", val: getVal(data, ["Economy", "Exports - commodities", "text"]) },
        { label: "Main Imports", val: getVal(data, ["Economy", "Imports - commodities", "text"]) },
        { label: "Industries", val: getVal(data, ["Economy", "Industries", "text"]) },
        { label: "GDP Sector", val: getVal(data, ["Economy", "GDP - composition, by sector of origin", "text"]) }
    ].filter(o => o.val);

    const tradeChoice = tradeOptions.length > 0 ? pickRandom(tradeOptions) : { label: "Data", val: "No trade data." };

    hints.push({ 
        title: "Trade", 
        hints: [{ label: tradeChoice.label, value: smartTruncate(tradeChoice.val) }] 
    });

    const popStr = basicData?.population ? `${(basicData.population / 1000000).toFixed(2)}M` : "N/A";
    
    const socOptions = [
        { label: "Religions", val: getVal(data, ["People and Society", "Religions", "text"]) },
        { label: "Languages", val: getVal(data, ["People and Society", "Languages", "text"]) || (basicData?.languages ? Object.values(basicData.languages).join(", ") : null) },
        { label: "Age Structure", val: getVal(data, ["People and Society", "Age structure", "text"]) },
        { label: "Median Age", val: getVal(data, ["People and Society", "Median age", "total", "text"]) ? `Median Age: ${getVal(data, ["People and Society", "Median age", "total", "text"])}` : null },
        { label: "Urbanization", val: getVal(data, ["People and Society", "Urbanization", "urban population", "text"]) ? `Urban pop: ${getVal(data, ["People and Society", "Urbanization", "urban population", "text"])}` : null },
        { label: "Life Exp.", val: getVal(data, ["People and Society", "Life expectancy at birth", "total population", "text"]) ? `Life Expectancy: ${getVal(data, ["People and Society", "Life expectancy at birth", "total population", "text"])}` : null }
    ].filter(o => o.val);

    const socChoice = socOptions.length > 0 ? pickRandom(socOptions) : { label: "Culture", val: "" };
    const societyVal = `Pop: ${popStr} ${socChoice.val ? `| ${smartTruncate(socChoice.val)}` : ""}`;

    hints.push({ 
        title: "Society", 
        hints: [{ label: socChoice.label, value: societyVal }] 
    });

    const symOptions = [
        { label: "Flag Desc", val: getVal(data, ["Government", "Flag description", "text"]) },
        { label: "Symbol", val: getVal(data, ["Government", "National symbol(s)", "text"]) },
        { label: "Anthem", val: getVal(data, ["Government", "National anthem", "name", "text"]) ? `Anthem: "${getVal(data, ["Government", "National anthem", "name", "text"])}"` : null },
        { label: "Gov Type", val: getVal(data, ["Government", "Government type", "text"]) }
    ].filter(o => o.val);

    if (symOptions.length === 0 && basicData?.currencies) {
        const currStr = Object.values(basicData.currencies).map((c: any) => `${c.name} (${c.symbol})`).join(", ");
        symOptions.push({ label: "Currency", val: currStr });
    }

    const symChoice = symOptions.length > 0 ? pickRandom(symOptions) : { label: "Gov", val: "No symbol data." };

    hints.push({ 
        title: "Symbols", 
        hints: [{ label: symChoice.label, value: smartTruncate(symChoice.val) }] 
    });

    return hints;
}
