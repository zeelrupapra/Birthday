import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { KeyRound, Sparkles, Heart, Delete, Lock, Unlock } from 'lucide-react';
import { useBirthdayConfig } from '../context/BirthdayContext';
import { audioManager } from '../utils/audioManager';

interface StagePasscodeProps {
  onSuccess: () => void;
}

export const StagePasscode: React.FC<StagePasscodeProps> = ({ onSuccess }) => {
  const { config } = useBirthdayConfig();
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Normalizes entered code (removes slashes, dashes, spaces)
  const normalize = (val: string) => val.replace(/[\/\-\s]/g, '').trim();

  const verifyCode = useCallback((inputToTest: string) => {
    const rawNormalized = normalize(inputToTest);
    const targetNormalized = normalize(config.passcode || '1710');
    const altTarget = '1710';

    if (rawNormalized === targetNormalized || rawNormalized === altTarget) {
      setErrorMessage('');
      setIsUnlocked(true);
      audioManager.playSuccess();
      audioManager.startMusic(config.musicPath);

      try {
        confetti({
          particleCount: 85,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF8FB8', '#FF4F91', '#F472B6', '#FFFFFF']
        });
      } catch {}

      setTimeout(() => {
        onSuccess();
      }, 1200);
    } else {
      audioManager.playPop();
      setIsShaking(true);
      setErrorMessage("Oopsie... that's not the magic code 💕 Try again!");
      setTimeout(() => setIsShaking(false), 500);
    }
  }, [config.passcode, config.musicPath, onSuccess]);

  const handleKeypadPress = useCallback((digit: string) => {
    if (isUnlocked) return;
    audioManager.playClick();
    setCode((prev) => {
      if (prev.length >= 4) return prev;
      const next = prev + digit;
      setErrorMessage('');
      if (next.length === 4) {
        setTimeout(() => verifyCode(next), 50);
      }
      return next;
    });
  }, [isUnlocked, verifyCode]);

  const handleDelete = useCallback(() => {
    if (isUnlocked) return;
    audioManager.playClick();
    setCode((prev) => prev.slice(0, -1));
    setErrorMessage('');
  }, [isUnlocked]);

  // Global physical keyboard listener (desktop/laptop numbers, numpad, backspace, enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if an admin input or modal is active
      if (isUnlocked) return;

      const key = e.key;

      // Handle number keys (top row '0'-'9' and numpad digits)
      if (/^[0-9]$/.test(key)) {
        // If event came from our input field, let onChange handle it to avoid duplicate
        if (e.target === inputRef.current) return;
        e.preventDefault();
        handleKeypadPress(key);
      } else if (key === 'Backspace' || key === 'Delete') {
        if (e.target === inputRef.current) return;
        e.preventDefault();
        handleDelete();
      } else if (key === 'Enter') {
        e.preventDefault();
        setCode((current) => {
          verifyCode(current);
          return current;
        });
      } else if (key === 'Escape') {
        e.preventDefault();
        setCode('');
        setErrorMessage('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isUnlocked, handleKeypadPress, handleDelete, verifyCode]);

  // Auto focus input on mount for physical/virtual keyboards
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericOnly = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCode(numericOnly);
    setErrorMessage('');
    audioManager.playClick();
    if (numericOnly.length === 4) {
      verifyCode(numericOnly);
    }
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    verifyCode(code);
  };

  const handleFocusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-md mx-auto my-auto flex flex-col items-center justify-center py-2 px-3 text-center select-none">
      <div
        className={`glass-pink p-5 sm:p-7 rounded-3xl w-full text-center relative border border-white transition-all shadow-xl ${
          isShaking ? 'animate-[shake_0.4s_ease-in-out]' : ''
        }`}
      >
        {/* Animated Icon Header */}
        <div
          onClick={handleFocusInput}
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-tr from-pink-200 to-rose-100 flex items-center justify-center shadow-inner cursor-pointer"
        >
          {isUnlocked ? (
            <Unlock className="w-8 h-8 text-pink-500 animate-bounce" />
          ) : (
            <Lock className="w-8 h-8 text-pink-500 animate-pulse" />
          )}
        </div>

        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-800 mb-1 tracking-tight">
          {config.secretScreenHeading}
        </h2>
        <p className="text-base sm:text-lg font-bold text-pink-600 mb-1">
          {config.secretScreenSubtext}
        </p>

        {/* Hint displaying: (your special date) */}
        <div className="inline-block px-3 py-1 rounded-full bg-pink-100/80 border border-pink-200 text-xs font-semibold text-pink-700 mb-4">
          Hint: {config.secretScreenHint}
        </div>

        {/* Display 4 Interactive Dots for passcode */}
        <div
          onClick={handleFocusInput}
          className="flex justify-center items-center gap-3 mb-4 h-10 cursor-pointer"
          title="Click to enter with keyboard"
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all duration-200 ${
                i < code.length
                  ? 'bg-pink-500 scale-125 shadow-sm shadow-pink-400'
                  : 'bg-pink-100 border border-pink-200'
              }`}
            />
          ))}
        </div>

        {/* Feedback message */}
        {errorMessage ? (
          <div className="text-xs font-semibold text-rose-500 bg-rose-50 border border-rose-100 py-1.5 px-3 rounded-full mb-3 inline-block animate-fade-in">
            {errorMessage}
          </div>
        ) : null}

        {/* Real keyboard & mobile number pad input */}
        <form onSubmit={handleInputSubmit} className="mb-4">
          <input
            ref={inputRef}
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="one-time-code"
            autoFocus
            placeholder="• • • •"
            value={code}
            onChange={handleInputChange}
            className="w-full text-center text-xl font-mono font-bold tracking-widest py-2.5 px-4 rounded-xl bg-white/90 border border-pink-200 text-pink-700 placeholder:text-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-inner"
            maxLength={4}
          />
        </form>

        {/* Touch & Click Number Pad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto mb-4 select-none touch-manipulation">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onPointerDown={(e) => {
                e.preventDefault();
                handleKeypadPress(digit);
              }}
              className="h-12 rounded-xl bg-white/95 hover:bg-pink-50 active:bg-pink-200 font-mono text-xl font-bold text-slate-700 shadow-xs border border-pink-100 flex items-center justify-center transition-all active:scale-90 cursor-pointer select-none touch-manipulation"
            >
              {digit}
            </button>
          ))}

          {/* Backspace Button */}
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            className="h-12 rounded-xl bg-pink-50 hover:bg-pink-100 active:bg-pink-200 text-pink-600 flex items-center justify-center transition-all active:scale-90 cursor-pointer select-none touch-manipulation"
            title="Backspace"
          >
            <Delete className="w-5 h-5" />
          </button>

          {/* Zero Button */}
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              handleKeypadPress('0');
            }}
            className="h-12 rounded-xl bg-white/95 hover:bg-pink-50 active:bg-pink-200 font-mono text-xl font-bold text-slate-700 shadow-xs border border-pink-100 flex items-center justify-center transition-all active:scale-90 cursor-pointer select-none touch-manipulation"
          >
            0
          </button>

          {/* Submit Key Button */}
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              verifyCode(code);
            }}
            className="h-12 rounded-xl bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white flex items-center justify-center shadow-sm transition-all active:scale-90 cursor-pointer select-none touch-manipulation"
            title="Submit passcode"
          >
            <KeyRound className="w-5 h-5" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => verifyCode(code)}
          disabled={code.length === 0}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-sm shadow-md shadow-pink-500/20 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer select-none touch-manipulation"
        >
          {isUnlocked ? 'Magic Unlocked! ✨' : 'Unlock Birthday Surprise 🔐'}
        </button>

        <p className="mt-3 text-[11px] text-pink-400 flex items-center justify-center gap-1 font-medium">
          <Heart className="w-3 h-3 fill-pink-400" />
          <span>Made with love by {config.senderName} for {config.name}</span>
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
};
