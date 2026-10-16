import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Utensils, RotateCcw, ArrowRight, Wind } from 'lucide-react';
import { useBirthdayConfig } from '../context/BirthdayContext';
import { audioManager } from '../utils/audioManager';

interface StageCakeCuttingProps {
  onNext: () => void;
}

export const StageCakeCutting: React.FC<StageCakeCuttingProps> = ({ onNext }) => {
  const { config } = useBirthdayConfig();
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [isCutting, setIsCutting] = useState(false);
  const [isCut, setIsCut] = useState(false);

  // Step 1: Blow the candles
  const handleBlowCandles = () => {
    if (candlesBlown) return;
    audioManager.playBlow();
    audioManager.playSparkle();
    setCandlesBlown(true);

    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.45, x: 0.5 },
        colors: ['#FF4081', '#FFA7C4', '#FCD34D', '#FFFFFF', '#F50057']
      });
    } catch {}
  };

  // Step 2: Cut the birthday cake
  const handleCutCake = () => {
    if (isCutting || isCut) return;
    setIsCutting(true);
    audioManager.playSlice();

    setTimeout(() => {
      setIsCutting(false);
      setIsCut(true);
      audioManager.playSuccess();

      try {
        confetti({
          particleCount: 110,
          spread: 85,
          origin: { y: 0.5, x: 0.5 },
          colors: ['#FF2A7A', '#FF4081', '#FCD34D', '#FFFFFF', '#E91E63']
        });
      } catch {}
    }, 650);
  };

  const handleReset = () => {
    setCandlesBlown(false);
    setIsCutting(false);
    setIsCut(false);
  };

  return (
    <div className="w-full max-w-sm mx-auto my-auto flex flex-col items-center justify-center py-2 px-3 text-center select-none animate-fade-in">
      {/* Pristine White Card Container */}
      <div className="w-full bg-white/95 backdrop-blur-md rounded-[32px] p-5 sm:p-6 shadow-xl border border-pink-100/80 flex flex-col items-center">
        {/* Top Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFE8F0] text-[#D81B60] text-xs font-bold tracking-wide mb-2 shadow-xs">
          <span>🎂</span>
          <span>Candle & Cake Ceremony</span>
        </div>

        {/* Heading */}
        <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#2D121F] tracking-tight leading-snug mb-1">
          Make a Wish & Cut Your Cake! 🎂✨
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm font-medium text-[#8E4A68] mb-4 max-w-xs">
          {!candlesBlown
            ? 'Make a wish, blow out the candles, and cut your birthday slice! 🍰'
            : !isCut
            ? 'Now take the golden knife and cut your birthday slice! 🍰'
            : `Happy Birthday, ${config.name}! Enjoy your royal cake! 🍰✨`}
        </p>

        {/* Inner Pink Display Frame */}
        <div className="w-full bg-gradient-to-b from-[#FFF5F8] to-[#FFF0F4] rounded-[24px] p-4 sm:p-5 border border-pink-100 flex flex-col items-center justify-center relative min-h-[220px] overflow-hidden select-none">
          {/* 3 Pink Candles */}
          <div className="flex items-center justify-center gap-7 mb-1 z-20">
            {[0, 1, 2].map((idx) => (
              <div
                key={idx}
                onClick={handleBlowCandles}
                className="flex flex-col items-center cursor-pointer group touch-manipulation"
              >
                {!candlesBlown ? (
                  <div className="relative flex items-center justify-center mb-1">
                    <div
                      className="w-3.5 h-6 bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 rounded-full blur-[0.5px] animate-pulse drop-shadow-[0_0_10px_rgba(251,191,36,0.9)]"
                      style={{ animationDuration: `${0.8 + idx * 0.2}s` }}
                    />
                    <div className="absolute w-1 h-3 bg-white rounded-full opacity-80" />
                  </div>
                ) : (
                  <div className="text-sm text-slate-400 font-bold mb-1 animate-fade-in">
                    💨
                  </div>
                )}

                {/* Pink Candle Cylinder */}
                <div className="w-3 h-10 bg-gradient-to-b from-[#FF80AB] to-[#FF4081] rounded-full shadow-xs border border-pink-200" />
              </div>
            ))}
          </div>

          {/* Cake Layers */}
          <div className="relative flex flex-col items-center w-full max-w-[240px]">
            {/* Strawberries & Flower on Top Rim */}
            <div className="flex items-center justify-center gap-3 -mb-3 z-20">
              <span className="text-base drop-shadow-xs">🍓</span>
              <span className="text-xs drop-shadow-xs">🌸</span>
              <span className="text-base drop-shadow-xs">🍓</span>
            </div>

            {/* Top Cake Tier (Pill-shaped, Soft Pink, text: config.name) */}
            <div className="w-48 h-14 bg-gradient-to-b from-[#FFA4C2] to-[#FF7DA6] rounded-[24px] border-2 border-white shadow-md flex items-center justify-center z-10 px-2">
              <span className="font-display text-xs sm:text-sm font-black tracking-widest text-[#5C1631] uppercase truncate max-w-[170px]">
                {config.name}
              </span>
            </div>

            {/* Bottom Cake Tier (Larger Pill-shaped, Magenta/Rose, text: birthDateString) */}
            <div className="w-56 h-16 bg-gradient-to-b from-[#FF2E79] via-[#FF4081] to-[#F50057] rounded-[24px] border-2 border-white shadow-lg flex items-center justify-center -mt-2 z-10">
              <span className="font-mono text-xs font-bold tracking-wider text-white drop-shadow-sm flex items-center gap-1.5">
                <span>🤍</span>
                <span>{config.birthDateString || '17/10/2008'}</span>
                <span>🤍</span>
              </span>
            </div>

            {/* Cake Pedestal / Plate Base */}
            <div className="w-64 h-3.5 bg-gradient-to-r from-slate-200/70 via-white to-slate-200/70 rounded-full shadow-xs -mt-1 z-0" />
          </div>

          {/* Knife Animation during cutting */}
          {isCutting && (
            <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none animate-fade-in">
              <div className="w-1.5 h-36 bg-amber-200 border border-white shadow-[0_0_15px_rgba(251,191,36,0.95)] animate-pulse" />
              <span className="absolute text-4xl transform rotate-45 -translate-y-12">
                🔪
              </span>
            </div>
          )}
        </div>

        {/* First Slice Served Card */}
        {isCut && (
          <div className="w-full mt-3 bg-pink-50/90 rounded-2xl p-3 border border-pink-200 shadow-sm animate-fade-in flex flex-col items-center text-center">
            <div className="text-2xl mb-0.5 animate-bounce">🍰</div>
            <h4 className="font-display text-sm font-black text-pink-600">
              FIRST SLICE SERVED! 😋
            </h4>
            <p className="text-xs font-bold text-slate-700 mt-0.5">
              First bite for Birthday Queen {config.name} 👑
            </p>
            <p className="text-[11px] font-semibold text-pink-500">
              And a big sweet slice for {config.senderName}! 🍰❤️
            </p>
          </div>
        )}

        {/* Action Button */}
        <div className="w-full mt-4 flex flex-col items-center gap-2">
          {!candlesBlown ? (
            <button
              onClick={handleBlowCandles}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#FF2A7A] to-[#FF5290] text-white font-bold text-base shadow-lg shadow-pink-500/25 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 touch-manipulation cursor-pointer select-none animate-pulse"
            >
              <Wind className="w-5 h-5" />
              <span>Make a Wish & Blow Candles 🕯️💨</span>
            </button>
          ) : !isCut ? (
            <button
              onClick={handleCutCake}
              disabled={isCutting}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#FF2A7A] to-[#FF5290] text-white font-bold text-base shadow-lg shadow-pink-500/25 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 touch-manipulation cursor-pointer select-none animate-bounce"
            >
              <Utensils className="w-5 h-5" />
              <span>{isCutting ? 'Cutting the Cake... 🍰' : 'Cut The Birthday Cake 🍰'}</span>
            </button>
          ) : (
            <div className="w-full flex items-center gap-2">
              <button
                onClick={handleReset}
                className="py-3 px-3.5 rounded-2xl bg-pink-100 hover:bg-pink-200 text-pink-700 font-extrabold text-xs flex items-center gap-1 transition-colors touch-manipulation cursor-pointer select-none"
                title="Cut cake again"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Cut Again ↺</span>
              </button>

              <button
                onClick={() => {
                  audioManager.playSparkle();
                  onNext();
                }}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#FF2A7A] to-[#FF5290] text-white font-black text-sm shadow-md hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 animate-bounce touch-manipulation cursor-pointer select-none"
              >
                <span>Claim Bestie &amp; Sister Award 🏆</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
