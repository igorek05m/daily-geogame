"use client";
import { useState } from 'react';
import { HowToPlayModal } from './HowToPlay';
import { PrivacyModal } from './Privacy';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const [showRules, setShowRules] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <>
      <footer className="w-full border-t border-[#333] bg-[#1a1a1a] mt-12 py-10 text-[#9ca3af] text-xs md:text-sm">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col gap-2">
            <h3 className="text-gray-300 font-bold uppercase tracking-wider">Daily Geo</h3>
            <p className="leading-relaxed opacity-80">
              Test your geography knowledge every day. 
              One country, 6 hints. Can you guess it?
            </p>
            <p className="mt-2 text-[10px] opacity-50">
              &copy; {currentYear} GeoGame. All rights reserved.
            </p>
          </div>

          <div className="flex flex-col gap-2 items-center md:items-start">
            <h3 className="text-gray-300 font-bold uppercase tracking-wider">Links</h3>
            
            <button 
              onClick={() => setShowRules(true)} 
              className="text-gray-400 hover:text-[#22c55e] transition-colors text-left cursor-pointer"
            >
              How to play?
            </button>
            
            <button 
              onClick={() => setShowPrivacy(true)} 
              className="text-gray-400 hover:text-[#22c55e] transition-colors text-left cursor-pointer"
            >
              Privacy Policy
            </button>
            
            <a href="https://github.com/igorek05m/geo" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#22c55e] transition-colors">
              GitHub Repository
            </a>
          </div>

          <div className="flex flex-col gap-2 items-center md:items-start">
            <h3 className="text-gray-300 font-bold uppercase tracking-wider">Data Sources</h3>
            <p className="opacity-80">Game data provided by:</p>
            <ul className="list-disc list-inside opacity-70">
              <li><a href="https://restcountries.com/" target="_blank" className="text-gray-400 hover:text-[#22c55e] underline decoration-dotted">RestCountries API</a></li>
              <li><a href="https://github.com/factbook/factbook.json" target="_blank" className="text-gray-400 hover:text-[#22c55e] underline decoration-dotted">CIA World Factbook</a></li>
              <li><a href="https://simplemaps.com/resources/svg-world" target="_blank" className="text-gray-400 hover:text-[#22c55e] underline decoration-dotted">SimpleMaps (SVG)</a></li>
            </ul>
          </div>
        </div>

        <div className="w-full text-center mt-8 pt-4 border-t border-[#333] opacity-70 text-[10px]">
          Built with Next.js, Tailwind & MongoDB by <a href="https://igiii.is-a.dev" className="text-[#22c55e] hover:text-white">igiii</a>.
        </div>
      </footer>

      <HowToPlayModal isOpen={showRules} onClose={() => setShowRules(false)} />
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </>
  );
};