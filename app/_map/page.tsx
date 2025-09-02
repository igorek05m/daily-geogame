"use client"
import React from "react";
import { ReactSVG } from "react-svg";
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const countriesToColor: any[] = [
  {"name":"Poland","topLevelDomain":[".pl"],"alpha2Code":"PL","alpha3Code":"POL","callingCodes":["48"],"capital":"Warsaw","altSpellings":["PL","Republic of Poland","Rzeczpospolita Polska"],"subregion":"Central Europe","region":"Europe","population":37950802,"latlng":[52,20],"demonym":"Polish","area":312679,"gini":30.2,"timezones":["UTC+01:00"],"borders":["BLR","CZE","DEU","LTU","RUS","SVK","UKR"],"nativeName":"Polska","numericCode":"616","flags":{"svg":"https://flagcdn.com/pl.svg","png":"https://flagcdn.com/w320/pl.png"},"currencies":[{"code":"PLN","name":"Polish złoty","symbol":"zł"}],"languages":[{"iso639_1":"pl","iso639_2":"pol","name":"Polish","nativeName":"język polski"}],"translations":{"br":"Polonia","pt":"Polónia","nl":"Polen","hr":"Poljska","fa":"لهستان","de":"Polen","es":"Polonia","fr":"Pologne","ja":"ポーランド","it":"Polonia","hu":"Lengyelország"},"flag":"https://flagcdn.com/pl.svg","regionalBlocs":[{"acronym":"EU","name":"European Union"}],"cioc":"POL","independent":true},
  {"name":"Czech Republic","topLevelDomain":[".cz"],"alpha2Code":"CZ","alpha3Code":"CZE","callingCodes":["420"],"capital":"Prague","altSpellings":["CZ","Česká republika","Česko"],"subregion":"Central Europe","region":"Europe","population":10698896,"latlng":[49.75,15.5],"demonym":"Czech","area":78865,"gini":25,"timezones":["UTC+01:00"],"nativeName":"Česká republika","numericCode":"203","flags":{"svg":"https://flagcdn.com/cz.svg","png":"https://flagcdn.com/w320/cz.png"},"currencies":[{"code":"CZK","name":"Czech koruna","symbol":"Kč"}],"languages":[{"iso639_1":"cs","iso639_2":"ces","name":"Czech","nativeName":"čeština"},{"iso639_1":"sk","iso639_2":"slk","name":"Slovak","nativeName":"slovenčina"}],"translations":{"br":"Tchekia","pt":"República Checa","nl":"Tsjechië","hr":"Češka","fa":"جمهوری چک","de":"Tschechische Republik","es":"República Checa","fr":"République tchèque","ja":"チェコ","it":"Repubblica Ceca","hu":"Csehország"},"flag":"https://flagcdn.com/cz.svg","regionalBlocs":[{"acronym":"EU","name":"European Union"}],"cioc":"CZE","independent":true},
  {"name":"France","topLevelDomain":[".fr"],"alpha2Code":"FR","alpha3Code":"FRA","callingCodes":["33"],"capital":"Paris","altSpellings":["FR","French Republic","République française"],"subregion":"Western Europe","region":"Europe","population":67391582,"latlng":[46,2],"demonym":"French","area":640679,"gini":32.4,"timezones":["UTC-10:00","UTC-09:30","UTC-09:00","UTC-08:00","UTC-04:00","UTC-03:00","UTC+01:00","UTC+02:00","UTC+03:00","UTC+04:00","UTC+05:00","UTC+10:00","UTC+11:00","UTC+12:00"],"borders":["AND","BEL","DEU","ITA","LUX","MCO","ESP","CHE"],"nativeName":"France","numericCode":"250","flags":{"svg":"https://flagcdn.com/fr.svg","png":"https://flagcdn.com/w320/fr.png"},"currencies":[{"code":"EUR","name":"Euro","symbol":"€"}],"languages":[{"iso639_1":"fr","iso639_2":"fra","name":"French","nativeName":"français"}],"translations":{"br":"Frañs","pt":"França","nl":"Frankrijk","hr":"Francuska","fa":"فرانسه","de":"Frankreich","es":"Francia","fr":"France","ja":"フランス","it":"Francia","hu":"Franciaország"},"flag":"https://flagcdn.com/fr.svg","regionalBlocs":[{"acronym":"EU","name":"European Union"}],"cioc":"FRA","independent":true},
  {"name":"Brazil","topLevelDomain":[".br"],"alpha2Code":"BR","alpha3Code":"BRA","callingCodes":["55"],"capital":"Brasília","altSpellings":["BR","Brasil","Federative Republic of Brazil","República Federativa do Brasil"],"subregion":"South America","region":"Americas","population":212559409,"latlng":[-10,-55],"demonym":"Brazilian","area":8515767,"gini":53.4,"timezones":["UTC-05:00","UTC-04:00","UTC-03:00","UTC-02:00"],"borders":["ARG","BOL","COL","FRA","GUF","GUY","PRY","PER","SUR","URY","VEN"],"nativeName":"Brasil","numericCode":"076","flags":{"svg":"https://flagcdn.com/br.svg","png":"https://flagcdn.com/w320/br.png"},"currencies":[{"code":"BRL","name":"Brazilian real","symbol":"R$"}],"languages":[{"iso639_1":"pt","iso639_2":"por","name":"Portuguese","nativeName":"Português"}],"translations":{"br":"Brazil","pt":"Brasil","nl":"Brazilië","hr":"Brazil","fa":"برزیل","de":"Brasilien","es":"Brasil","fr":"Brésil","ja":"ブラジル","it":"Brasile","hu":"Brazília"},"flag":"https://flagcdn.com/br.svg","regionalBlocs":[{"acronym":"USAN","name":"Union of South American Nations","otherAcronyms":["UNASUR","UNASUL","UZAN"],"otherNames":["Unión de Naciones Suramericanas","União de Nações Sul-Americanas","Unie van Zuid-Amerikaanse Naties","South American Union"]}],"cioc":"BRA","independent":true},
  {"name":"Romania","topLevelDomain":[".ro"],"alpha2Code":"RO","alpha3Code":"ROU","callingCodes":["40"],"capital":"Bucharest","altSpellings":["RO","Rumania","Roumania","România"],"subregion":"Eastern Europe","region":"Europe","population":19286123,"latlng":[46,25],"demonym":"Romanian","area":238391,"gini":35.8,"timezones":["UTC+02:00"],"borders":["BGR","HUN","MDA","SRB","UKR"],"nativeName":"România","numericCode":"642","flags":{"svg":"https://flagcdn.com/ro.svg","png":"https://flagcdn.com/w320/ro.png"},"currencies":[{"code":"RON","name":"Romanian leu","symbol":"lei"}],"languages":[{"iso639_1":"ro","iso639_2":"ron","name":"Romanian","nativeName":"Română"}],"translations":{"br":"Roumania","pt":"Roménia","nl":"Roemenië","hr":"Rumunjska","fa":"رومانی","de":"Rumänien","es":"Rumania","fr":"Roumanie","ja":"ルーマニア","it":"Romania","hu":"Románia"},"flag":"https://flagcdn.com/ro.svg","regionalBlocs":[{"acronym":"EU","name":"European Union"}],"cioc":"ROU","independent":true},
  {"name":"Russian Federation","topLevelDomain":[".ru"],"alpha2Code":"RU","alpha3Code":"RUS","callingCodes":["7"],"capital":"Moscow","altSpellings":["RU","Rossiya","Russian Federation","Российская Федерация","Rossiyskaya Federatsiya"],"subregion":"Eastern Europe","region":"Europe","population":144104080,"latlng":[60,100],"demonym":"Russian","area":17124442,"gini":37.5,"timezones":["UTC+03:00","UTC+04:00","UTC+06:00","UTC+07:00","UTC+08:00","UTC+09:00","UTC+10:00","UTC+11:00","UTC+12:00"],"borders":["AZE","BLR","CHN","EST","FIN","GEO","KAZ","PRK","LVA","LTU","MNG","NOR","POL","UKR"],"nativeName":"Россия","numericCode":"643","flags":{"svg":"https://flagcdn.com/ru.svg","png":"https://flagcdn.com/w320/ru.png"},"currencies":[{"code":"RUB","name":"Russian ruble","symbol":"₽"}],"languages":[{"iso639_1":"ru","iso639_2":"rus","name":"Russian","nativeName":"Русский"}],"translations":{"br":"Rusia","pt":"Rússia","nl":"Rusland","hr":"Rusija","fa":"روسیه","de":"Russland","es":"Rusia","fr":"Russie","ja":"ロシア連邦","it":"Russia","hu":"Oroszország"},"flag":"https://flagcdn.com/ru.svg","regionalBlocs":[{"acronym":"EEU","name":"Eurasian Economic Union","otherAcronyms":["EAEU"]}],"cioc":"RUS","independent":true},
];

const chosen = {
  "name":"Russian Federation","topLevelDomain":[".ru"],"alpha2Code":"RU","alpha3Code":"RUS","callingCodes":["7"],"capital":"Moscow","altSpellings":["RU","Rossiya","Russian Federation","Российская Федерация","Rossiyskaya Federatsiya"],"subregion":"Eastern Europe","region":"Europe","population":144104080,"latlng":[60,100],"demonym":"Russian","area":17124442,"gini":37.5,"timezones":["UTC+03:00","UTC+04:00","UTC+06:00","UTC+07:00","UTC+08:00","UTC+09:00","UTC+10:00","UTC+11:00","UTC+12:00"],"borders":["AZE","BLR","CHN","EST","FIN","GEO","KAZ","PRK","LVA","LTU","MNG","NOR","POL","UKR"],"nativeName":"Россия","numericCode":"643","flags":{"svg":"https://flagcdn.com/ru.svg","png":"https://flagcdn.com/w320/ru.png"},"currencies":[{"code":"RUB","name":"Russian ruble","symbol":"₽"}],"languages":[{"iso639_1":"ru","iso639_2":"rus","name":"Russian","nativeName":"Русский"}],"translations":{"br":"Rusia","pt":"Rússia","nl":"Rusland","hr":"Rusija","fa":"روسیه","de":"Russland","es":"Rusia","fr":"Russie","ja":"ロシア連邦","it":"Russia","hu":"Oroszország"},"flag":"https://flagcdn.com/ru.svg","regionalBlocs":[{"acronym":"EEU","name":"Eurasian Economic Union","otherAcronyms":["EAEU"]}],"cioc":"RUS","independent":true
}

export const WorldMap: React.FC = () => {

  const handleBeforeInjection = (svg: SVGSVGElement) => {
    if (!svg) return;
    svg.querySelectorAll('[id]').forEach(el => {
      el.id = el.id.replace(/-\d+$/, '');

      svg.setAttribute("width", "1010");
      svg.setAttribute("height", "666");
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet")
      svg.setAttribute("fill", "#555555")
      // svg.setAttribute("stroke", "#AAAAAA");
    });
  }

  const handleAfterInjection = (svg: SVGSVGElement) => {
    if (!svg) return;
    
    countriesToColor.forEach((country) => {
      let el = svg.querySelector<SVGElement>(`#${country.alpha2Code?.toUpperCase()}`);
      console.log(el);

      let connection: "none" | "region" | "subregion" | "neighbor" | "guess" = "none";
      if (chosen.name === country.name) connection = "guess";
      else if (chosen.borders.includes(country.alpha3Code)) connection = "neighbor";
      else if (chosen.subregion === country.subregion) connection = "subregion";
      else if (chosen.region === country.region) connection = "region";

      switch (connection) {
        case "guess":
          el?.setAttribute("fill", "#2E7D32");
          break;
        case "neighbor":
          el?.setAttribute("fill", "#71fb52ff");
          break;
        case "subregion":
          el?.setAttribute("fill", "#efe300ff");
          break;
        case "region":
          el?.setAttribute("fill", "#f85b1dff");
          break;
        case "none":
          el?.setAttribute("fill", "#B71C1C");
          break;
        default:
          el?.setAttribute("fill", "#555555");
      }

    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <TransformWrapper
        wheel={{ step: 0.7 }}
        pinch={{ step: 0.18 }}
        doubleClick={{ disabled: false }}
        minScale={0.5}
        maxScale={12}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div style={{ marginBottom: '10px' }}>
              <button onClick={() => zoomIn()}>+</button>
              <button onClick={() => zoomOut()}>−</button>
              <button onClick={() => resetTransform()}>Reset</button>
            </div>

            <TransformComponent>
              <ReactSVG
                src="/world.svg"
                beforeInjection={handleBeforeInjection}
                afterInjection={handleAfterInjection}
                loading={() => <span>Ładowanie mapy...</span>}
                fallback={() => <span>SVG not found</span>}
              />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
};

export default WorldMap;
