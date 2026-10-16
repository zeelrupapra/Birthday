import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useBirthdayConfig } from '../context/BirthdayContext';
import { audioManager } from '../utils/audioManager';

interface StageArrowShootProps {
  onNext: () => void;
}

export const StageArrowShoot: React.FC<StageArrowShootProps> = ({ onNext }) => {
  const { config } = useBirthdayConfig();
  const [dragY, setDragY] = useState(0); // Pull distance in pixels
  const [isDragging, setIsDragging] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const [arrowProgress, setArrowProgress] = useState(0); // 0 (at bow) to 1 (at heart)

  // Two Hearts Union State:
  // 0: Initial ready to shoot
  // 1: Arrow flying
  // 2: Arrow hit! Two separate hearts ❤️ ❤️ appear and start moving towards each other
  // 3: Two hearts unite / merge into one glowing double heart!
  // 4: Grand Happy Birthday celebration reveal!
  const [loveStep, setLoveStep] = useState<0 | 1 | 2 | 3 | 4>(0);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const flightAnimRef = useRef<number | null>(null);

  const MAX_PULL = 70;

  // Handle Drag / Pull back on bow
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isFlying || loveStep > 0) return;
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isFlying || loveStep > 0) return;
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const bowY = rect.bottom - 110;
      const pull = Math.max(0, Math.min(MAX_PULL, e.clientY - bowY));
      setDragY(pull);
    }
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragY > 20) {
      shootArrow();
    } else {
      setDragY(0);
    }
  };

  // Shoot arrow animation & Two Hearts Union sequence
  const shootArrow = () => {
    if (isFlying || loveStep > 0) return;
    setIsFlying(true);
    setLoveStep(1);
    setDragY(0);
    audioManager.playWhoosh();

    const startTime = performance.now();
    const flightDuration = 450; // ms

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / flightDuration, 1);
      const eased = Math.pow(progress, 1.35);
      setArrowProgress(eased);

      if (progress < 1) {
        flightAnimRef.current = requestAnimationFrame(animate);
      } else {
        // Arrow strikes! Start Two Hearts Union
        setIsFlying(false);
        audioManager.playPop();

        // Step 2: Two separate hearts appear
        setLoveStep(2);

        // Step 3: Hearts drift towards each other and merge (after 1.2s)
        setTimeout(() => {
          setLoveStep(3);
          audioManager.playSparkle();
          audioManager.playTick();

          // Step 4: After hearts merge, the Grand Happy Birthday reveals! (after 1.4s)
          setTimeout(() => {
            setLoveStep(4);
            audioManager.playSuccess();

            try {
              confetti({
                particleCount: 110,
                spread: 85,
                origin: { y: 0.4, x: 0.5 },
                colors: ['#FF2A7A', '#FF4E93', '#FCD34D', '#FFFFFF', '#FF8DA1']
              });
              setTimeout(() => {
                confetti({
                  particleCount: 80,
                  spread: 100,
                  origin: { y: 0.45, x: 0.5 },
                  colors: ['#FF6B8B', '#FCD34D', '#FFFFFF', '#FDA4AF']
                });
              }, 300);
            } catch {}
          }, 1400);
        }, 1200);
      }
    };

    flightAnimRef.current = requestAnimationFrame(animate);
  };

  const handleReset = () => {
    if (flightAnimRef.current) cancelAnimationFrame(flightAnimRef.current);
    setIsFlying(false);
    setLoveStep(0);
    setArrowProgress(0);
    setDragY(0);
  };

  useEffect(() => {
    return () => {
      if (flightAnimRef.current) cancelAnimationFrame(flightAnimRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative w-full max-w-sm mx-auto h-[590px] sm:h-[630px] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between items-center py-7 px-6 select-none bg-gradient-to-b from-[#FFF6F4] via-[#FFEFEF] to-[#FFE2E7] touch-none"
    >
      {/* Soft Dreamy Background Aura */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-rose-300/30 blur-3xl pointer-events-none" />

      {/* Top Heading */}
      <div className="text-center z-10">
        <p className="text-rose-500/80 font-serif italic text-xs tracking-wider mb-0.5">
          {loveStep < 4 ? `a sweet birthday wish, from ${config.senderName} to didu...` : 'best sister & bestie forever'}
        </p>
        <h3 className="font-display font-black text-xl text-[#3B1929]">
          {loveStep < 4 ? 'Birthday Arrow of Love 🏹🌸' : 'Best Sister & Bestie Bond 💖'}
        </h3>
      </div>

      {/* Center Display Area: From Single Target -> Two Hearts Moving Together -> Merged Double Heart -> Grand Happy Birthday */}
      <div className="relative w-full flex flex-col items-center justify-center my-auto z-10 min-h-[260px]">
        {/* State 0: Single Glowing Target Heart */}
        {loveStep < 2 && (
          <div className="relative flex flex-col items-center animate-float-gentle">
            <div className="relative w-28 h-28 flex items-center justify-center filter drop-shadow-[0_10px_25px_rgba(244,114,182,0.45)]">
              <svg viewBox="0 0 100 100" className="w-full h-full transform hover:scale-105 transition-transform">
                <defs>
                  <radialGradient id="heartGradLove" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#FFA6C9" />
                    <stop offset="40%" stopColor="#FF4F8E" />
                    <stop offset="100%" stopColor="#D92066" />
                  </radialGradient>
                  <linearGradient id="glossGradLove" x1="0%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 50,30 C 50,15 30,10 18,22 C 6,34 8,54 28,72 C 38,82 50,92 50,92 C 50,92 62,82 72,72 C 92,54 94,34 82,22 C 70,10 50,15 50,30 Z"
                  fill="url(#heartGradLove)"
                />
                <ellipse cx="32" cy="30" rx="10" ry="6" fill="url(#glossGradLove)" transform="rotate(-30 32 30)" />
              </svg>
            </div>
            <span className="text-[11px] font-bold text-rose-500/80 mt-2 bg-white/70 px-3 py-0.5 rounded-full border border-rose-200">
              Aim for {config.name}&apos;s Heart 🎯💖
            </span>
          </div>
        )}

        {/* State 2 & 3: TWO HEARTS (❤️❤️) Coming Together and Merging! */}
        {(loveStep === 2 || loveStep === 3) && (
          <div className="relative w-full flex flex-col items-center justify-center animate-fade-in">
            <p className="text-xs font-serif italic text-rose-600 mb-4 animate-pulse">
              {loveStep === 2 ? 'Two souls sharing a sweet bond... 🌸💖' : 'Sister & Bestie hearts connected! ✨'}
            </p>

            <div className="relative w-64 h-32 flex items-center justify-center">
              {/* Left Heart (Zeel's Heart) */}
              <div
                className="absolute text-5xl transition-all duration-1000 ease-in-out filter drop-shadow-[0_0_15px_rgba(255,42,122,0.6)] animate-pulse"
                style={{
                  left: loveStep === 3 ? '42%' : '12%',
                  transform: `translateX(-50%) scale(${loveStep === 3 ? 1.25 : 1}) rotate(${loveStep === 3 ? '-10deg' : '0deg'})`
                }}
              >
                ❤️
                <span className="block text-[10px] font-bold text-rose-600 text-center -mt-1 font-sans">
                  {config.senderName}
                </span>
              </div>

              {/* Sparkle Bridge between hearts */}
              <div
                className={`text-xl transition-opacity duration-700 ${
                  loveStep === 3 ? 'opacity-100 scale-125' : 'opacity-40 animate-ping'
                }`}
              >
                ✨ 🌸 ✨
              </div>

              {/* Right Heart (Vrushti Didu's Heart) */}
              <div
                className="absolute text-5xl transition-all duration-1000 ease-in-out filter drop-shadow-[0_0_15px_rgba(255,78,147,0.6)] animate-pulse"
                style={{
                  right: loveStep === 3 ? '42%' : '12%',
                  transform: `translateX(50%) scale(${loveStep === 3 ? 1.25 : 1}) rotate(${loveStep === 3 ? '10deg' : '0deg'})`
                }}
              >
                ❤️
                <span className="block text-[10px] font-bold text-rose-600 text-center -mt-1 font-sans">
                  {config.name}
                </span>
              </div>
            </div>

            {loveStep === 3 && (
              <div className="mt-3 text-xs font-extrabold text-[#E11D48] tracking-widest uppercase bg-white/90 px-4 py-1 rounded-full border border-rose-200 animate-bounce">
                BESTIES FOREVER! 🌸💖
              </div>
            )}
          </div>
        )}

        {/* State 4: Grand Happy Birthday Reveal after hearts united! */}
        {loveStep === 4 && (
          <div className="w-full flex flex-col items-center text-center animate-fade-in z-20 px-2">
            {/* The United Interlocked Heart Icon */}
            <div className="text-5xl mb-2 filter drop-shadow-[0_4px_20px_rgba(255,42,122,0.6)] animate-bounce">
              💖
            </div>

            <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-rose-600 bg-white/90 px-3 py-1 rounded-full border border-rose-200 shadow-xs mb-2">
              <span>🌸</span>
              <span>UNBREAKABLE SISTER & BESTIE BOND</span>
              <span>🌸</span>
            </div>

            {/* The Big Birthday Wish */}
            <h1 className="font-display text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF2A7A] via-[#E11D48] to-[#FF4E93] tracking-tight leading-tight mb-1">
              HAPPY BIRTHDAY, {config.name.toUpperCase()}! 🎂🌸❤️
            </h1>

            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 via-rose-400 to-amber-300 rounded-full my-2" />

            <p className="font-serif italic text-rose-700 text-sm sm:text-base leading-relaxed max-w-xs">
              &quot;To the sweetest didu, best friend, and guide. Having you as my sister is life&apos;s greatest blessing!&quot;
            </p>

            <p className="text-xs font-bold text-[#3B1929] bg-white/90 px-4 py-1.5 rounded-full border border-rose-200 shadow-xs mt-3">
              Best didu &amp; closest person forever! 🌸✨
            </p>
          </div>
        )}
      </div>

      {/* Flying Arrow In Motion */}
      {isFlying && (
        <div
          className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-30 transition-none"
          style={{
            bottom: `${120 + arrowProgress * 280}px`
          }}
        >
          <div className="flex flex-col items-center">
            <div className="text-xl">💘</div>
            <div className="w-1 h-16 bg-gradient-to-b from-amber-600 to-amber-800 rounded-full shadow-xs -mt-1.5" />
            <div className="text-[10px] text-rose-500 font-bold -mt-0.5">✨</div>
          </div>
        </div>
      )}

      {/* Bow and Arrow Area at Bottom */}
      {loveStep === 0 ? (
        <div className="relative w-full flex flex-col items-center z-20 pb-2">
          {/* Draggable Arrow on String */}
          <div
            onPointerDown={handlePointerDown}
            className="flex flex-col items-center cursor-grab active:cursor-grabbing touch-none select-none transition-transform duration-75"
            style={{
              transform: `translateY(${dragY}px)`
            }}
          >
            {/* Arrow */}
            <div className="flex flex-col items-center -mb-3 z-10">
              <div className="w-3.5 h-3.5 bg-gradient-to-b from-rose-500 to-pink-500 transform rotate-45 rounded-xs shadow-sm" />
              <div className="w-1 h-16 bg-gradient-to-b from-amber-600 to-amber-800 rounded-full shadow-xs" />
              <div className="w-3.5 h-2 bg-pink-400 rounded-b-sm -mt-0.5" />
            </div>

            {/* Recurve Bow SVG */}
            <svg width="130" height="48" viewBox="0 0 130 48" className="drop-shadow-md">
              <path
                d="M 12 38 Q 65 6 118 38"
                fill="none"
                stroke="#B45309"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <circle cx="12" cy="38" r="3" fill="#FCD34D" />
              <circle cx="118" cy="38" r="3" fill="#FCD34D" />
              <path
                d={`M 12 38 L 65 ${38 + dragY * 0.45} L 118 38`}
                fill="none"
                stroke="#FB7185"
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* Hint / Shoot Button */}
          <div className="mt-4 flex flex-col items-center gap-2">
            <span className="text-[11px] font-sans font-bold tracking-widest uppercase text-rose-500">
              {dragY > 15 ? 'RELEASE TO SHOOT! 🏹' : 'PULL & RELEASE TO SEND LOVE'}
            </span>

            <button
              onClick={shootArrow}
              className="px-5 py-2 rounded-full bg-white/90 hover:bg-white text-rose-600 border border-rose-200 text-xs font-black shadow-xs active:scale-95 transition-all"
            >
              Or Tap to Shoot Birthday Arrow 🏹💖
            </button>
          </div>
        </div>
      ) : loveStep < 4 ? (
        /* Status during Two Hearts animation */
        <div className="w-full text-center z-20 pb-3 text-xs font-bold text-rose-600 animate-pulse">
          ✨ Celebrating our sweet bond together... 🌸💖 ✨
        </div>
      ) : (
        /* Action Controls after Hearts United and Birthday Wish revealed */
        <div className="w-full flex items-center justify-center gap-2 z-20 pb-2">
          <button
            onClick={handleReset}
            className="py-3 px-4 rounded-2xl bg-white/90 text-rose-600 border border-rose-200 text-xs font-bold shadow-sm active:scale-95 transition-all"
          >
            Shoot Again ↺
          </button>

          <button
            onClick={() => {
              audioManager.playSparkle();
              onNext();
            }}
            className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-[#FF2A7A] via-[#E11D48] to-[#FF4E93] text-white font-extrabold text-sm shadow-lg shadow-rose-400/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 animate-bounce"
          >
            <span>Watch Love Bloom 🌸✨</span>
            <span>→</span>
          </button>
        </div>
      )}
    </div>
  );
};
