import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, Clock, ArrowRight } from 'lucide-react';
import { useBirthdayConfig } from '../context/BirthdayContext';
import { audioManager } from '../utils/audioManager';

interface StageCountdownProps {
  onUnlock: () => void;
}

export const StageCountdown: React.FC<StageCountdownProps> = ({ onUnlock }) => {
  const { config } = useBirthdayConfig();

  // Target time: birthDay of birthMonth at 00:00:00 (for countdown display)
  const targetDate = useMemo(() => {
    const now = new Date();
    let year = now.getFullYear();
    const bMonth = (config.birthMonth || 10) - 1;
    const bDay = config.birthDay || 17;
    let bday = new Date(year, bMonth, bDay, 0, 0, 0);

    // If current time has passed today's birthday and it's not today, target next year
    if (now.getTime() > bday.getTime() && (now.getDate() !== bDay || now.getMonth() !== bMonth)) {
      bday = new Date(year + 1, bMonth, bDay, 0, 0, 0);
    }
    return bday;
  }, [config.birthMonth, config.birthDay]);

  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Trigger celebratory confetti upon arriving at the timer screen
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.55 },
        colors: ['#FF8FB8', '#FF4F91', '#FFD6E7', '#F472B6', '#FFFFFF', '#FCD34D']
      });
    } catch {}

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = targetDate.getTime() - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const handleProceed = () => {
    audioManager.playSparkle();
    onUnlock();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthName = monthNames[(config.birthMonth || 10) - 1] || 'October';

  return (
    <div className="w-full max-w-md mx-auto my-auto flex flex-col items-center justify-center py-2 px-3 text-center select-none">
      <div className="glass-pink p-5 sm:p-7 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden border border-white animate-pulse-glow">
        {/* Celebration Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-600 text-xs font-extrabold tracking-widest uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PASSCODE UNLOCKED</span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>

        {/* Big Celebration Headline */}
        <h1 className="font-display text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 mb-2 drop-shadow-xs">
          {config.unlockCelebrationHeadline}
        </h1>

        <p className="text-xl sm:text-2xl font-extrabold text-pink-700 mb-4">
          {String(config.birthDay || 17).padStart(2, '0')} {monthName} {config.birthYear || 2008} · Queen {config.name}&apos;s Day! 👑
        </p>

        {/* The Live Countdown Timer */}
        <div className="bg-white/90 border border-pink-200/80 rounded-2xl p-4 mb-5 shadow-inner">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-pink-700 mb-3">
            <Clock className="w-4 h-4 text-pink-500" />
            <span>Official Birthday Countdown</span>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
            {[
              { label: 'DAYS', value: timeLeft.days },
              { label: 'HOURS', value: timeLeft.hours },
              { label: 'MINUTES', value: timeLeft.minutes },
              { label: 'SECONDS', value: timeLeft.seconds }
            ].map((unit) => (
              <div
                key={unit.label}
                className="bg-gradient-to-b from-pink-50/80 to-pink-100/50 p-2 sm:p-2.5 rounded-xl border border-pink-200 shadow-xs flex flex-col items-center"
              >
                <span className="text-xl sm:text-2xl font-black font-mono text-pink-600 tabular-nums">
                  {String(unit.value).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-bold tracking-wider text-slate-400 mt-0.5">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>

          <p className="text-[11px] font-medium text-pink-500/80 mt-2.5">
            Counting down every single second of your special day ✨
          </p>
        </div>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed font-medium">
          {config.unlockCelebrationSubtext}
        </p>

        {/* Proceed to Journey button */}
        <button
          onClick={handleProceed}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-400 text-white font-extrabold text-base sm:text-lg shadow-lg shadow-pink-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span>Enter Your Surprise World 💌</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <div className="mt-4 flex items-center justify-center gap-1 text-xs text-pink-400">
          <Heart className="w-3.5 h-3.5 fill-pink-400" />
          <span>Handcrafted exclusively with love by {config.senderName} for {config.name}</span>
          <Heart className="w-3.5 h-3.5 fill-pink-400" />
        </div>
      </div>
    </div>
  );
};
