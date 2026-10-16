import React from 'react';
import { Mail, Sparkles, Heart, Gift } from 'lucide-react';
import { useBirthdayConfig } from '../context/BirthdayContext';
import { audioManager } from '../utils/audioManager';

interface StageWelcomeProps {
  onContinue: () => void;
}

export const StageWelcome: React.FC<StageWelcomeProps> = ({ onContinue }) => {
  const { config } = useBirthdayConfig();

  const handleProceed = () => {
    audioManager.playPop();
    onContinue();
  };

  return (
    <div className="w-full max-w-md mx-auto my-auto flex flex-col items-center justify-center py-2 px-3 text-center select-none">
      <div className="glass-pink p-5 sm:p-8 rounded-3xl w-full shadow-2xl relative border border-white">
        {/* Soft glowing badge */}
        <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-tr from-pink-300 via-rose-200 to-pink-100 flex items-center justify-center shadow-lg shadow-pink-200/50 animate-float-gentle">
          <Gift className="w-10 h-10 text-pink-600" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/90 text-pink-700 text-xs font-semibold tracking-wide mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Sister & Best Friend Secret Space</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-800 mb-2 tracking-tight">
          {config.welcomeTitle}
        </h1>

        <p className="text-xl sm:text-2xl text-pink-600 font-extrabold mb-4">
          {config.welcomeSubtitle}
        </p>

        <p className="text-sm text-slate-600 mb-8 leading-relaxed max-w-sm mx-auto">
          Every screen ahead was handcrafted by {config.senderName} with memories, sweet smiles, and infinite love for my cute didu. Take your time and enjoy every little step!
        </p>

        <button
          onClick={handleProceed}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-400 text-white font-bold text-base sm:text-lg shadow-lg shadow-pink-400/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5"
        >
          <Mail className="w-5 h-5" />
          <span>Open Your Letter 💌</span>
        </button>

        <div className="mt-4 flex items-center justify-center gap-1 text-xs text-pink-400">
          <Heart className="w-3.5 h-3.5 fill-pink-400" />
          <span>Ready for step 1 of your journey</span>
        </div>
      </div>
    </div>
  );
};
