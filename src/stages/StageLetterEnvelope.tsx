import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Mail, Sparkles, Heart, ArrowRight } from 'lucide-react';
import { useBirthdayConfig } from '../context/BirthdayContext';
import { audioManager } from '../utils/audioManager';

interface StageLetterEnvelopeProps {
  onNext: () => void;
}

export const StageLetterEnvelope: React.FC<StageLetterEnvelopeProps> = ({ onNext }) => {
  const { config } = useBirthdayConfig();
  const letter = config.letter;
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenEnvelope = () => {
    if (isOpen) return;
    audioManager.playPop();
    audioManager.playSparkle();
    setIsOpen(true);

    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF8FB8', '#FF4F91', '#F472B6', '#FFFFFF', '#FCD34D']
      });
    } catch {}
  };

  const handleProceed = () => {
    audioManager.playPop();
    onNext();
  };

  const sealInitial = (config.name || 'V').trim().charAt(0).toUpperCase();

  return (
    <div className="w-full max-w-md mx-auto my-auto flex flex-col items-center justify-center py-2 px-3 text-center select-none">
      {!isOpen ? (
        /* Unopened Envelope State */
        <div
          onClick={handleOpenEnvelope}
          className="relative w-72 h-80 sm:w-80 sm:h-96 mx-auto cursor-pointer group transition-transform duration-300 hover:scale-105 active:scale-95"
        >
          {/* Subtle magical glow backdrop */}
          <div className="absolute inset-0 bg-pink-300/40 rounded-3xl filter blur-xl group-hover:bg-pink-400/50 transition-colors" />

          {/* Envelope Body */}
          <div className="relative w-full h-full bg-gradient-to-br from-pink-100 via-rose-100 to-pink-200 rounded-3xl shadow-xl border-2 border-white/80 p-6 flex flex-col items-center justify-center overflow-hidden">
            {/* Flap triangle */}
            <div
              className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-pink-300 to-pink-200 shadow-md transform origin-top transition-transform duration-500"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)'
              }}
            />

            {/* Heart wax seal */}
            <div className="absolute top-20 z-10 w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-lg flex items-center justify-center border-2 border-rose-300 animate-pulse-glow group-hover:scale-110 transition-transform">
              <span className="font-display text-2xl font-black">{sealInitial}</span>
            </div>

            <div className="mt-20 text-center z-10">
              <p className="font-display text-xl font-extrabold text-pink-700">
                For {config.name}&apos;s Eyes Only 🎀
              </p>
              <span className="inline-block mt-2 text-xs font-bold text-rose-500 bg-white/90 px-3 py-1 rounded-full shadow-xs">
                Tap to Open 💌
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Opened Letter Parchment State */
        <div className="w-full max-w-md animate-fade-in">
          <div className="bg-gradient-to-b from-[#FFFDF9] via-[#FFF9F6] to-[#FFF5F8] p-6 sm:p-8 rounded-3xl shadow-2xl border border-pink-100 relative overflow-hidden">
            {/* Decorative Ribbon Seal */}
            <div className="absolute top-4 right-4 flex items-center gap-1 text-pink-300 text-sm">
              <span>🌸</span>
              <span>✨</span>
            </div>

            {/* Salutation */}
            <h3 className="font-display text-2xl sm:text-3xl font-black text-pink-600 mb-4 tracking-tight">
              {letter.salutation}
            </h3>

            {/* Letter Paragraphs with subtle staggered visual rhythm */}
            <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed font-sans text-left">
              {letter.paragraphs.map((p, idx) => (
                <p
                  key={idx}
                  className="transition-all duration-700"
                  style={{ animation: `fadeInUp 0.6s ease-out ${idx * 0.18}s both` }}
                >
                  {p}
                </p>
              ))}
            </div>

            {/* Closing & Signature */}
            <div className="mt-8 pt-4 border-t border-pink-100 text-right">
              <p className="text-xs text-slate-400 font-semibold">{letter.closing}</p>
              <p className="font-display text-2xl font-extrabold text-pink-600 mt-1">
                {letter.signature}
              </p>
            </div>
          </div>

          {/* Next Button */}
          <div className="mt-6 text-center">
            <button
              onClick={handleProceed}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-400 text-white font-bold text-base shadow-lg shadow-pink-400/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Our Little Memories 📸</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-xs text-pink-400 mt-2 flex items-center justify-center gap-1">
              <Heart className="w-3 h-3 fill-pink-400" />
              <span>Memories chapter unlocked</span>
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
