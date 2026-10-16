import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';
import { useBirthdayConfig } from '../context/BirthdayContext';
import { audioManager } from '../utils/audioManager';

interface StageBloomingTreeProps {
  onNext: () => void;
}

interface Blossom {
  id: number;
  x: number; // percentage in heart shape
  y: number;
  type: 'heart' | 'flower' | 'sparkle';
  color: string;
  size: number;
  delay: number;
}

export const StageBloomingTree: React.FC<StageBloomingTreeProps> = ({ onNext }) => {
  const { config } = useBirthdayConfig();
  const [treeGrown, setTreeGrown] = useState(false);
  const [blossomedCount, setBlossomedCount] = useState(0);
  const [extraBlooms, setExtraBlooms] = useState<{ id: number; x: number; y: number; symbol: string }[]>([]);

  // Mathematical heart coordinate generator for the blooming crown
  const generateHeartBlossoms = (): Blossom[] => {
    const list: Blossom[] = [];
    const colors = [
      '#FF4F8E', // Magenta Pink
      '#F472B6', // Rose
      '#FB7185', // Coral
      '#FDA4AF', // Warm Pastel
      '#FCD34D', // Gold stardust
      '#FFA6C9', // Soft Sakura
      '#E11D48'  // Ruby
    ];

    let id = 0;
    // Outer perimeter of heart
    for (let t = 0; t < Math.PI * 2; t += 0.16) {
      // Parametric heart formula
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

      // Map to percentage within the crown area (center ~ 50%, 35%)
      const x = 50 + hx * 2.3;
      const y = 35 + hy * 2.1;

      list.push({
        id: id++,
        x,
        y,
        type: Math.random() > 0.4 ? 'flower' : 'heart',
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 16 + Math.floor(Math.random() * 8),
        delay: 0.8 + Math.random() * 1.5
      });
    }

    // Inner filling of heart with dense blossoms
    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 0.7); // clustered
      const hx = 16 * Math.pow(Math.sin(angle), 3) * r;
      const hy = -(13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle)) * r;

      const x = 50 + hx * 2.1;
      const y = 35 + hy * 1.9;

      list.push({
        id: id++,
        x,
        y,
        type: Math.random() > 0.5 ? 'flower' : 'heart',
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 14 + Math.floor(Math.random() * 10),
        delay: 1.2 + Math.random() * 1.6
      });
    }

    return list;
  };

  const [blossoms] = useState<Blossom[]>(generateHeartBlossoms);

  // Tree growth sequence
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setTreeGrown(true);
      audioManager.playSparkle();
    }, 400);

    const timer2 = setTimeout(() => {
      setBlossomedCount(blossoms.length);
      audioManager.playSuccess();
      try {
        confetti({
          particleCount: 70,
          spread: 75,
          origin: { y: 0.35, x: 0.5 },
          colors: ['#FFA6C9', '#FF4F8E', '#FCD34D', '#FFFFFF', '#FDA4AF']
        });
      } catch {}
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [blossoms.length]);

  // Interactive tap: spawn extra blooming flowers/hearts anywhere on screen
  const handleTapScreen = (e: React.MouseEvent | React.TouchEvent) => {
    audioManager.playPop();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const rect = e.currentTarget.getBoundingClientRect();

    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    const symbols = ['🌸', '💖', '🌺', '💗', '✨', '🌷'];
    const newBloom = {
      id: Date.now() + Math.random(),
      x,
      y,
      symbol: symbols[Math.floor(Math.random() * symbols.length)]
    };

    setExtraBlooms((prev) => [...prev.slice(-15), newBloom]);
  };

  return (
    <div
      onClick={handleTapScreen}
      className="relative w-full max-w-sm mx-auto h-[590px] sm:h-[630px] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between items-center py-7 px-5 select-none bg-gradient-to-b from-[#FFF6F3] via-[#FFEBE8] to-[#FFDFE5] touch-manipulation cursor-pointer"
    >
      {/* Background Soft Sunbeam / Aurora Glow */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-rose-300/25 blur-3xl pointer-events-none" />

      {/* Top Header matching reference video */}
      <div className="text-center z-20">
        <p className="font-serif italic text-xs tracking-wider text-rose-500/80 mb-0.5">
          it&apos;s officially your day
        </p>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#3B1929] tracking-tight">
          Happy Birthday, {config.name}! 🌸❤️
        </h2>
        <p className="font-serif italic text-xs text-rose-600/90 mt-0.5">
          and just like that, the sweetest soul turns {new Date().getFullYear() - (config.birthYear || 2008)}! ✨
        </p>
      </div>

      {/* Center The Blooming Tree of Hearts & Flowers */}
      <div className="relative w-full h-[360px] flex items-center justify-center my-auto z-10 pointer-events-none">
        {/* SVG Tree Trunk & Branches */}
        <svg
          viewBox="0 0 200 280"
          className="w-full h-full drop-shadow-md transition-all duration-1000"
        >
          <defs>
            <linearGradient id="trunkGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#4A2518" />
              <stop offset="60%" stopColor="#693722" />
              <stop offset="100%" stopColor="#8C4E33" />
            </linearGradient>
          </defs>

          {/* Main Trunk rising up */}
          <path
            d="M 98 280 L 98 160 Q 98 140 85 110 M 102 280 L 102 160 Q 102 140 115 110"
            stroke="url(#trunkGrad)"
            strokeWidth="7"
            strokeLinecap="round"
            className="transition-all duration-1000"
            style={{
              strokeDasharray: 300,
              strokeDashoffset: treeGrown ? 0 : 300,
              transition: 'stroke-dashoffset 1.2s ease-out'
            }}
          />

          {/* Left Branch Network spreading into heart shape */}
          <path
            d="M 95 160 Q 75 130 55 95 M 85 110 Q 55 80 40 55 M 65 115 Q 45 105 30 90"
            fill="none"
            stroke="url(#trunkGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            style={{
              strokeDasharray: 200,
              strokeDashoffset: treeGrown ? 0 : 200,
              transition: 'stroke-dashoffset 1.4s ease-out 0.4s'
            }}
          />

          {/* Right Branch Network spreading into heart shape */}
          <path
            d="M 105 160 Q 125 130 145 95 M 115 110 Q 145 80 160 55 M 135 115 Q 155 105 170 90"
            fill="none"
            stroke="url(#trunkGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            style={{
              strokeDasharray: 200,
              strokeDashoffset: treeGrown ? 0 : 200,
              transition: 'stroke-dashoffset 1.4s ease-out 0.4s'
            }}
          />

          {/* Center Upper Crown Twigs */}
          <path
            d="M 100 135 L 100 80 M 100 100 Q 88 75 80 50 M 100 100 Q 112 75 120 50"
            fill="none"
            stroke="url(#trunkGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{
              strokeDasharray: 150,
              strokeDashoffset: treeGrown ? 0 : 150,
              transition: 'stroke-dashoffset 1.2s ease-out 0.6s'
            }}
          />
        </svg>

        {/* Blooming Heart & Flower Cluster */}
        {treeGrown &&
          blossoms.map((b) => (
            <div
              key={b.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-blossom drop-shadow-sm select-none"
              style={{
                left: `${b.x}%`,
                top: `${b.y}%`,
                animationDelay: `${b.delay}s`,
                fontSize: `${b.size}px`
              }}
            >
              {b.type === 'flower' ? (
                <span>🌸</span>
              ) : b.type === 'heart' ? (
                <span style={{ color: b.color }}>💖</span>
              ) : (
                <span>✨</span>
              )}
            </div>
          ))}

        {/* Extra Interactive Blooms Tapped by User */}
        {extraBlooms.map((b) => (
          <div
            key={b.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 text-2xl animate-blossom select-none pointer-events-none drop-shadow-md z-30"
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`
            }}
          >
            {b.symbol}
          </div>
        ))}
      </div>

      {/* Gentle Floating Falling Petals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute text-sm text-pink-400 select-none opacity-0"
            style={{
              left: `${15 + i * 15}%`,
              top: '10%',
              animation: `petalFall ${5 + (i % 3)}s linear infinite`,
              animationDelay: `${i * 0.9}s`
            }}
          >
            {i % 2 === 0 ? '🌸' : '💗'}
          </div>
        ))}
      </div>

      {/* Bottom Action Controls */}
      <div className="w-full z-20 pb-2">
        <p className="text-[11px] font-sans font-semibold text-rose-500/80 text-center mb-2.5">
          Tap anywhere to bloom more flowers & hearts! 🌸✨
        </p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            audioManager.playSparkle();
            onNext();
          }}
          className="w-full min-h-[52px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#FF2A7A] via-[#FF4E93] to-[#FF6B8B] text-white font-black text-sm shadow-xl shadow-pink-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
        >
          <span>Continue to Birthday Cake 🎂</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
