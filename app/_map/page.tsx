"use client"
import React from "react";
import { ReactSVG } from "react-svg";
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Country } from "../page";

interface WorldMapProps {
  guesses: Country[];
  targetCountry: Country | null;
}

const colorLegend = [
  { label: "Target", color: "#2E7D32" },
  { label: "Neighbor", color: "#FFEB3B" },
  { label: "Same Region", color: "#FF9800" },
  { label: "Same Subregion", color: "#FF5722" },
  { label: "Incorrect", color: "#B71C1C" },
];

const LoadingMap = () => <span className="text-white">Loading map...</span>;
const FallbackMap = () => <span className="text-white">SVG not found</span>;

export const WorldMap: React.FC<WorldMapProps> = ({ guesses, targetCountry }) => {

  const [svgElement, setSvgElement] = React.useState<SVGSVGElement | null>(null);

  const handleBeforeInjection = React.useCallback((svg: SVGSVGElement) => {
    if (!svg) return;
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    
    if (!svg.getAttribute("viewBox")) {
        svg.setAttribute("viewBox", "0 0 1010 666"); 
    }
    
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    
    svg.querySelectorAll('path').forEach(el => {
       if (el.id) {
          el.id = el.id.replace(/-.*/, ''); 
          el.setAttribute("fill", "#555555");
          el.setAttribute("stroke", "#333");
          el.setAttribute("stroke-width", "0.5");
       }
    });
  }, []);

  const handleAfterInjection = React.useCallback((error: Error | SVGSVGElement, svg?: SVGSVGElement) => {
    if (error && (error as any).tagName === "svg") {
        setSvgElement(error as SVGSVGElement);
    } else if (svg) {
        setSvgElement(svg);
    } 
  }, []);

  React.useEffect(() => {
    if (!svgElement || !targetCountry) return;
    
    const paths = svgElement.querySelectorAll('path');
    paths.forEach(p => {
        p.setAttribute("fill", "#555555");
    });

    guesses.forEach((country) => {
      const code = country.alpha2Code?.toUpperCase();
      if (!code) return;

      const el = svgElement.querySelector(`[id="${code}"]`) || svgElement.getElementById(code);

      if (!el) return;

      let connection: "none" | "region" | "subregion" | "neighbor" | "guess" = "none";
      
      const isTarget = targetCountry.alpha3Code === country.alpha3Code;
      const isNeighbor = targetCountry.borders?.includes(country.alpha3Code);
      const isSameSubregion = targetCountry.subregion === country.subregion;
      const isSameRegion = targetCountry.region === country.region;

      if (isTarget) connection = "guess";
      else if (isNeighbor) connection = "neighbor";
      else if (isSameSubregion) connection = "subregion";
      else if (isSameRegion) connection = "region";

      switch (connection) {
        case "guess":
          el.setAttribute("fill", "#2E7D32"); 
          break;
        case "neighbor":
          el.setAttribute("fill", "#FFEB3B");
          break;
        case "subregion":
          el.setAttribute("fill", "#FF5722");
          break;
        case "region":
          el.setAttribute("fill", "#FF9800"); 
          break;
        case "none":
          el.setAttribute("fill", "#B71C1C"); 
          break;
        default:
          el.setAttribute("fill", "#555555");
      }
    });

  }, [guesses, targetCountry, svgElement]);


  return (
    <div className="w-full h-full flex items-center justify-center bg-[#1a1a1a] border-2 border-dashed border-gray-700 rounded-lg overflow-hidden relative">
      <TransformWrapper
      limitToBounds={false}
        wheel={{ step: 0.7 }}
        pinch={{ step: 0.18 }}
        doubleClick={{ disabled: false }}
        minScale={0.5}
        maxScale={12}
        centerOnInit
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
              <button className="bg-gray-800 text-white p-1 px-3" onClick={() => zoomIn()}>+</button>
              <button className="bg-gray-800 text-white p-1 px-3" onClick={() => zoomOut()}>-</button>
              <button className="bg-gray-800 text-white p-1 px-3" onClick={() => resetTransform()}>R</button>
            </div>

            <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full">
              <ReactSVG
                src="/world.svg"
                beforeInjection={handleBeforeInjection}
                afterInjection={handleAfterInjection}
                className="w-full h-full"
                loading={LoadingMap}
                fallback={FallbackMap}
              />
            </TransformComponent>
            
            <div className="absolute bottom-2 left-2 bg-black/80 p-2 rounded text-xs text-white z-10 border border-gray-700 pointer-events-none">
                 <h4 className="font-bold mb-1 border-b border-gray-600 pb-1">Legend</h4>
                 <div className="flex flex-col gap-1">
                     {colorLegend.map(l => (
                         <div key={l.label} className="flex items-center gap-2">
                             <span className="block w-3 h-3 rounded-full" style={{ backgroundColor: l.color }}></span>
                             <span>{l.label}</span>
                         </div>
                     ))}
                 </div>
            </div>
          </>
        )}
      </TransformWrapper>
    </div>
  );
};

export default WorldMap;

