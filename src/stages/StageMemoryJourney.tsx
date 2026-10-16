import React, { useState } from 'react';
import { BookOpen, Sparkles, Heart, ArrowRight } from 'lucide-react';
import { useBirthdayConfig } from '../context/BirthdayContext';
import { audioManager } from '../utils/audioManager';

interface StageMemoryJourneyProps {
  onNext: () => void;
}

export const StageMemoryJourney: React.FC<StageMemoryJourneyProps> = ({ onNext }) => {
  const { config } = useBirthdayConfig();
  const [activeStep, setActiveStep] = useState(0);
  const photos = config.photos && config.photos.length > 0 ? config.photos : [];

  const handleStepClick = (idx: number) => {
    audioManager.playClick();
    setActiveStep(idx);
  };

  const handleProceed = () => {
    audioManager.playPop();
    onNext();
  };

  return (
    <div className="w-full max-w-md mx-auto my-auto flex flex-col items-center justify-center py-2 px-3 text-center select-none">
      {/* Title */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Timeline of Happiness</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-800">
          Little Moments, Big Memories ✨
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Every memory with you is a favorite chapter in my life book!
        </p>
      </div>

      {/* Interactive Vertical Timeline Cards */}
      <div className="w-full space-y-4 mb-8">
        {photos.map((item, idx) => {
          const isActive = activeStep === idx;
          return (
            <div
              key={item.id}
              onClick={() => handleStepClick(idx)}
              className={`p-4 sm:p-5 rounded-3xl transition-all duration-300 cursor-pointer border ${
                isActive
                  ? 'glass-pink border-pink-300 shadow-xl scale-[1.02]'
                  : 'bg-white/70 border-pink-100 hover:bg-white/90 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3.5">
                {/* Memory Number Circle */}
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                    isActive
                      ? 'bg-gradient-to-tr from-pink-500 to-rose-400 text-white shadow-md shadow-pink-300'
                      : 'bg-pink-100 text-pink-600'
                  }`}
                >
                  0{idx + 1}
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg font-bold text-slate-800">
                      {item.title}
                    </h3>
                    <span className="text-sm">{item.accentEmoji}</span>
                  </div>

                  <p className="text-base font-bold text-pink-600 mt-0.5">
                    {item.caption}
                  </p>

                  {isActive ? (
                    <div className="mt-3 pt-3 border-t border-pink-100 animate-fade-in">
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.story}
                      </p>
                      <div className="mt-2.5 flex items-center gap-1 text-[11px] font-semibold text-rose-500">
                        <Heart className="w-3.5 h-3.5 fill-rose-500 animate-pulse" />
                        <span>Core Memory Saved Forever 💕</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-pink-400 mt-1 flex items-center gap-1">
                      <span>Tap to expand reflection</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Button */}
      <button
        onClick={handleProceed}
        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-400 text-white font-bold text-base shadow-lg shadow-pink-400/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        <span>Ready for a Tiny Challenge? 🎮</span>
        <ArrowRight className="w-5 h-5" />
      </button>

      <p className="text-xs text-pink-400 mt-3 text-center">
        Test your reflexes in the next stage! 💗
      </p>
    </div>
  );
};
