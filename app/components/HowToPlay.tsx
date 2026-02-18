import React from 'react';
import { Modal } from './Modal';
import { Check, MapPin, Globe, ArrowUp } from "lucide-react";

interface HowToPlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal = ({ isOpen, onClose }: HowToPlayProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="How to Play">
      <div className="space-y-4 text-gray-300">
        <p>
          Guess the mystery country in <strong>6 tries</strong>.
          Each guess must be a valid country name.
        </p>

        <div className="my-4 border-t border-b border-[#333] py-4 space-y-3">
          <h3 className="font-bold text-white mb-2">Meaning of symbols:</h3>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
               <Check className="text-green-500" size={16} strokeWidth={3} />
            </div>
            <div>
              <strong className="text-green-400 block">Correct!</strong>
              <p className="text-xs opacity-70">You found the mystery country.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
               <MapPin className="text-yellow-500" size={16} strokeWidth={2.5} />
            </div>
            <div>
              <strong className="text-yellow-400 block">Close!</strong>
              <p className="text-xs opacity-70">Neighboring country (shares a border).</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
               <Globe className="text-orange-500" size={16} strokeWidth={2.5} />
            </div>
            <div>
              <strong className="text-orange-400 block">Region Match</strong>
              <p className="text-xs opacity-70">Same subregion.</p>
            </div>
          </div>
          
           <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
               <ArrowUp className="text-blue-500" size={16} strokeWidth={2.5} style={{ transform: 'rotate(45deg)' }} />
            </div>
            <div>
              <strong className="text-blue-400 block">Direction Hint</strong>
              <p className="text-xs opacity-70">Points towards the target country.</p>
            </div>
          </div>
        </div>

        <p>
          After each guess, you will unlock a new <strong>Hint</strong> (Population, Flag, etc.).
        </p>

        <div className="bg-[#111] p-3 rounded border border-[#333] mt-2 text-center">
          <span className="text-green-400 font-bold text-sm">New country available every day!</span>
        </div>
      </div>
    </Modal>
  );
};