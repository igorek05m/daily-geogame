import React from 'react';
import { Modal } from './Modal';
import { Props } from '@/app/types';

export const HowToPlayModal = ({ isOpen, onClose }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="How to Play">
      <p>
        Guess the mystery country in <strong>6 tries</strong>.
        Each guess must be a valid country name.
      </p>

      <div className="my-4 border-t border-b border-[#333] py-4 space-y-3">
        <h3 className="font-bold text-white">Meaning of colors:</h3>
        
        <div className="flex items-center gap-3">
          <span className="text-2xl">🟩</span>
          <div>
            <strong className="text-green-400">Green</strong>
            <p className="text-xs opacity-70">Correct country! You won.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-2xl">🟨</span>
          <div>
            <strong className="text-yellow-400">Yellow</strong>
            <p className="text-xs opacity-70">Neighboring country (shares a border).</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-2xl">🟧</span>
          <div>
            <strong className="text-orange-400">Orange</strong>
            <p className="text-xs opacity-70">Same subregion or very close (&lt; 2000km).</p>
          </div>
        </div>
      </div>

      <p>
        After each guess, you will unlock a new <strong>Hint</strong> about the mystery country (Population, Flag, Economy, etc.).
      </p>

      <div className="bg-[#111] p-3 rounded border border-[#333] mt-4 text-center">
        <span className="text-green-400 font-bold">New country available every day!</span>
      </div>
    </Modal>
  );
};