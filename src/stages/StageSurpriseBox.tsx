import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Gift, Sparkles, Heart, ArrowRight } from 'lucide-react';
import { useBirthdayConfig } from '../context/BirthdayContext';
import { audioManager } from '../utils/audioManager';

interface StageSurpriseBoxProps {
  onOpenFinal: () => void;
}

export const StageSurpriseBox: React.FC<StageSurpriseBoxProps> = ({ onOpenFinal }) => {
  const { config } = useBirthdayConfig();
  const [isOpen, setIsOpen] = useState(false);
  const surprise = config.surpriseBox;

  const handleBoxTap = () => {
    if (isOpen) return;
    audioManager.playSuccess();
    setIsOpen(true);

    try {
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#FF8FB8', '#FF4F91', '#FFD6E7', '#F472B6', '#FFFFFF', '#FCD34D']
      });
    } catch {}
  };

  const handleProceed = () => {
    audioManager.playSparkle();
    onOpenFinal();
  };

  return (
    <div className="w-full max-w-md mx-auto my-auto flex flex-col items-center justify-center py-2 px-3 text-center select-none">
      {/* Title */}
      <div className="mb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Climax Surprise</span>
        </div>
        <h2 className="font-display text-3xl font-extrabold text-slate-800">
          {surprise.prompt}
        </h2>
        <p className="text-lg font-bold text-pink-600 mt-1">
          {surprise.hint}
        </p>
      </div>

      {/* 3D Styled Gift Box Container */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-4 flex items-center justify-center">
        {/* Soft magical glow */}
        <div
          className={`absolute inset-0 rounded-full bg-pink-400/40 filter blur-2xl transition-all duration-700 ${
            isOpen ? 'scale-125 opacity-90 bg-rose-400/60' : 'scale-90 opacity-40'
          }`}
        />

        <div
          onClick={handleBoxTap}
          className={`group relative w-48 h-48 sm:w-56 sm:h-56 cursor-pointer transition-transform duration-500 select-none touch-manipulation ${
            !isOpen ? 'hover:scale-105 active:scale-95 animate-float-gentle' : ''
          }`}
        >
          {/* Lid (pops off upwards when opened) */}
          <div
            className={`absolute top-0 left-0 right-0 h-16 sm:h-20 bg-gradient-to-r from-rose-400 via-pink-400 to-rose-300 rounded-2xl shadow-xl border-t-2 border-white/60 z-20 transition-all duration-700 ${
              isOpen
                ? 'transform -translate-y-24 -rotate-12 opacity-80'
                : 'transform translate-y-0'
            }`}
          >
            {/* Ribbon Bow on top */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-pink-200 border-2 border-white shadow-md flex items-center justify-center text-xl">
                🎀
              </div>
            </div>

            {/* Vertical ribbon stripe on lid */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-white/40 shadow-xs" />
          </div>

          {/* Box Body */}
          <div className="absolute top-12 sm:top-14 left-2 right-2 bottom-0 bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 rounded-3xl shadow-2xl border-2 border-pink-300 overflow-hidden flex items-center justify-center z-10">
            {/* Vertical ribbon on body */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-white/30" />
            {/* Horizontal ribbon on body */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-8 bg-white/30" />

            {!isOpen ? (
              <span className="relative z-10 text-xs font-bold text-white tracking-widest uppercase bg-black/20 px-3 py-1 rounded-full backdrop-blur-xs">
                Tap to Unwrap 🎁
              </span>
            ) : (
              <div className="relative z-10 text-center animate-fade-in p-4 text-white">
                <span className="text-4xl block animate-bounce">💖</span>
                <span className="font-display text-xl font-black">
                  Surprise Unwrapped!
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Button to read final emotional message */}
      {isOpen && (
        <div className="w-full max-w-sm mt-6 animate-fade-in">
          <button
            onClick={handleProceed}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-400 text-white font-bold text-base shadow-xl shadow-pink-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>Read Final Birthday Message 💌</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-xs text-pink-400 mt-2">
            The most emotional chapter awaits you... 💗
          </p>
        </div>
      )}
    </div>
  );
};
