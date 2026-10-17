import { Country } from "@/app/types";
import localCountries from "world-countries";

type RestCountriesObject = {
  names?: { common?: string };
  codes?: { alpha_2?: string; alpha_3?: string };
  coordinates?: { lat?: number; lng?: number };
  borders?: string[];
  area?: number | { kilometers?: number };
  population?: number;
  flag?: { url_svg?: string };
  region?: string;
  subregion?: string;
};

type RestCountriesResponse = {
  data?: {
    objects?: RestCountriesObject[];
  };
  errors?: { message?: string }[];
};

const REST_COUNTRIES_URL = "https://api.restcountries.com/countries/v5";
const restCountriesCache = new Map<string, Country>();

function getLocalCountryDetails(alpha2: string): Country | null {
  const details = localCountries.find(
    (country) => country.cca2.toLowerCase() === alpha2.toLowerCase()
  );

  if (!details) return null;

  return {
    name: details.name.common,
    alpha2Code: details.cca2,
    alpha3Code: details.cca3,
    latlng: details.latlng,
    borders: details.borders || [],
    area: details.area,
    flag: `https://flags.restcountries.com/v5/svg/${details.cca2.toLowerCase()}.svg`,
    region: details.region,
    subregion: details.subregion
  };
}

export async function fetchCountryDetails(alpha2: string): Promise<Country | null> {
  const code = alpha2.toUpperCase();
  const localDetails = getLocalCountryDetails(code);
  if (localDetails) return localDetails;

  const cachedDetails = restCountriesCache.get(code);
  if (cachedDetails) return cachedDetails;

  const apiKey = process.env.REST_COUNTRIES_API || process.env.REST_COUNTRIES_API_KEY;
  if (!apiKey) {
    throw new Error("REST_COUNTRIES_API is not configured");
  }

  const response = await fetch(
    `${REST_COUNTRIES_URL}/codes.alpha_2/${encodeURIComponent(code)}`,
    {
      headers: { Authorization: `Bearer ${apiKey}` },
      next: { revalidate: 86400 }
    }
  );

  const payload = (await response.json()) as RestCountriesResponse;
  if (!response.ok || payload.errors?.length || !payload.data?.objects?.length) {
    const message = payload.errors?.[0]?.message || `REST Countries returned ${response.status}`;
    throw new Error(message);
  }

  const details = payload.data.objects[0];
  const area = typeof details.area === "number"
    ? details.area
    : details.area?.kilometers;

  if (
    !details.names?.common ||
    !details.codes?.alpha_2 ||
    !details.codes.alpha_3 ||
    details.coordinates?.lat === undefined ||
    details.coordinates.lng === undefined ||
    !details.flag?.url_svg ||
    !details.region ||
    !details.subregion
  ) {
    throw new Error(`REST Countries returned incomplete data for ${code}`);
  }

  const country: Country = {
    name: details.names.common,
    alpha2Code: details.codes.alpha_2,
    alpha3Code: details.codes.alpha_3,
    latlng: [details.coordinates.lat, details.coordinates.lng],
    borders: details.borders || [],
    area,
    population: details.population,
    flag: details.flag.url_svg,
    region: details.region,
    subregion: details.subregion
  };
  restCountriesCache.set(code, country);
  return country;
}
