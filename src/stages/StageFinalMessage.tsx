import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, ArrowRight, Stars, Music2 } from 'lucide-react';
import { useBirthdayConfig } from '../context/BirthdayContext';
import { audioManager } from '../utils/audioManager';

interface StageFinalMessageProps {
  onProceedToGallery: () => void;
}

export const StageFinalMessage: React.FC<StageFinalMessageProps> = ({ onProceedToGallery }) => {
  const { config } = useBirthdayConfig();
  const finalMsg = config.finalMessage;
  const [celebrated, setCelebrated] = useState(false);

  const handleCelebrateChapter = () => {
    audioManager.playSuccess();
    setCelebrated(true);

    try {
      // Magnificent double firework burst of pink & gold confetti
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5, x: 0.3 },
        colors: ['#FF8FB8', '#FF4F91', '#F472B6', '#FCD34D', '#FFFFFF']
      });
      setTimeout(() => {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.5, x: 0.7 },
          colors: ['#FF8FB8', '#FF4F91', '#F472B6', '#FCD34D', '#FFFFFF']
        });
      }, 350);
    } catch {}
  };

  const handleGoToGallery = () => {
    audioManager.playSparkle();
    onProceedToGallery();
  };

  return (
    <div className="w-full max-w-md mx-auto my-auto flex flex-col items-center justify-center py-2 px-3 relative z-10 text-center select-none">
      {/* Dreamy Night Card Frame with Dark Plum glow */}
      <div className="w-full glass-dark-plum p-6 sm:p-9 rounded-3xl shadow-2xl border border-pink-500/30 text-white relative overflow-hidden animate-pulse-glow">
        {/* Subtle celestial stars in card */}
        <div className="absolute top-4 left-6 text-pink-300 text-xs flex items-center gap-1 opacity-70">
          <Stars className="w-3.5 h-3.5" />
          <span>Under the Birthday Sky</span>
        </div>
        <div className="absolute top-4 right-6 text-pink-300 text-xs flex items-center gap-1 opacity-70">
          <span>✨</span>
          <span>🌙</span>
        </div>

        {/* Headline */}
        <div className="mt-4 mb-4">
          <span className="text-4xl block mb-2 animate-bounce">🎂</span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-pink-100 drop-shadow-sm">
            {finalMsg.headline}
          </h2>
        </div>

        {/* Heartfelt Paragraphs */}
        <div className="space-y-4 text-pink-100/90 text-sm sm:text-base leading-relaxed max-w-md mx-auto text-left font-sans">
          {finalMsg.paragraphs.map((p, idx) => (
            <p key={idx} className="transition-all duration-500">
              {p}
            </p>
          ))}
        </div>

        {/* Toast */}
        <div className="mt-8 pt-6 border-t border-pink-400/20 text-center">
          <p className="font-display text-2xl sm:text-3xl text-pink-300 font-extrabold tracking-tight drop-shadow-sm">
            {finalMsg.toast}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-md mt-6 space-y-3">
        {!celebrated ? (
          <button
            onClick={handleCelebrateChapter}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-400 text-white font-bold text-base shadow-xl shadow-pink-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Heart className="w-5 h-5 fill-white" />
            <span>{finalMsg.finalButtonText}</span>
          </button>
        ) : (
          <div className="space-y-3 animate-fade-in">
            <button
              onClick={handleCelebrateChapter}
              className="w-full py-3 px-4 rounded-xl bg-pink-900/60 text-pink-200 text-xs font-semibold hover:bg-pink-900/80 transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-300" />
              <span>Shower More Confetti & Love ✨</span>
            </button>

            <button
              onClick={handleGoToGallery}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-400 text-white font-bold text-base shadow-xl shadow-pink-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Our Little Memory Gallery 📸</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
