import React, { useState, useRef, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, RotateCw, CheckCircle2 } from 'lucide-react';
import { WheelOption } from '../data/birthdayConfig';
import { useBirthdayConfig } from '../context/BirthdayContext';
import { audioManager } from '../utils/audioManager';

interface StageSpinWheelProps {
  onNext: () => void;
}

export const StageSpinWheel: React.FC<StageSpinWheelProps> = ({ onNext }) => {
  const { config } = useBirthdayConfig();
  const wheelConfig = config.wheel;
  const options = wheelConfig.options;
  const numSlices = options.length;
  const sliceAngle = (2 * Math.PI) / numSlices;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedResult, setSelectedResult] = useState<WheelOption | null>(null);
  const [hasSpunAtLeastOnce, setHasSpunAtLeastOnce] = useState(false);
  const [spinsCount, setSpinsCount] = useState(0);

  // Pointer deflection angle for tactile peg-hitting animation
  const [pointerDeflect, setPointerDeflect] = useState(0);

  // Wheel physics state
  const rotationRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastSliceIdxRef = useRef(-1);

  // High-DPI Canvas Rendering
  const drawWheel = useCallback((currentRotation: number, winningIdx: number | null = null) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const center = width / 2;
    // Generous safe padding so outer rim and LED lights never crop
    const radius = center - 30;

    ctx.clearRect(0, 0, width, height);

    // 1. Outer Golden/Pink Halo & Rim
    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, radius + 16, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFE4EF';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(center, center, radius + 10, 0, 2 * Math.PI);
    ctx.fillStyle = '#FF5E97';
    ctx.fill();

    // LED bulb studs around rim
    const totalBulbs = 18;
    for (let b = 0; b < totalBulbs; b++) {
      const bulbAngle = (b * (2 * Math.PI)) / totalBulbs;
      const bx = center + (radius + 13) * Math.cos(bulbAngle);
      const by = center + (radius + 13) * Math.sin(bulbAngle);
      ctx.beginPath();
      ctx.arc(bx, by, 4.5, 0, 2 * Math.PI);
      const isLit = (b + Math.floor(currentRotation * 4)) % 2 === 0;
      ctx.fillStyle = isLit ? '#FEF08A' : '#FFFFFF';
      ctx.shadowColor = isLit ? 'rgba(254, 240, 138, 0.8)' : 'transparent';
      ctx.shadowBlur = isLit ? 6 : 0;
      ctx.fill();
    }
    ctx.restore();

    // 2. Draw Wheel Slices
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(currentRotation);

    const sliceColors = [
      '#FF4F8E', // Magenta Pink
      '#F472B6', // Soft Rose
      '#FB7185', // Coral Pink
      '#FDA4AF', // Warm Pastel Pink
      '#EC4899', // Rich Pink
      '#E11D48'  // Deep Rose
    ];

    options.forEach((opt, idx) => {
      const startA = idx * sliceAngle;
      const endA = startA + sliceAngle;
      const isWinner = winningIdx === idx;

      // Slice sector
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startA, endA);
      ctx.closePath();
      ctx.fillStyle = isWinner ? '#FF2A7A' : sliceColors[idx % sliceColors.length];
      ctx.fill();

      // Clean white borders between slices
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // Outer golden pin on each slice boundary
      const pinX = radius * Math.cos(startA);
      const pinY = radius * Math.sin(startA);
      ctx.save();
      ctx.beginPath();
      ctx.arc(pinX, pinY, 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#FEF08A';
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Text & Emoji aligned along slice radial axis
      ctx.save();
      const midA = startA + sliceAngle / 2;
      ctx.rotate(midA);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 22px "Outfit", "Plus Jakarta Sans", sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.35)';
      ctx.shadowBlur = 5;
      ctx.fillText(`${opt.emoji} ${opt.label}`, radius - 24, 0);
      ctx.restore();
    });

    // 3. Center Hub (Tappable Spin Badge)
    ctx.beginPath();
    ctx.arc(0, 0, 44, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0,0,0,0.18)';
    ctx.shadowBlur = 10;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, 36, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFF1F5';
    ctx.strokeStyle = '#FF4F8E';
    ctx.lineWidth = 3;
    ctx.fill();
    ctx.stroke();

    ctx.font = '28px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur = 0;
    ctx.fillText('🎡', 0, 1);

    ctx.restore();
  }, [options, sliceAngle]);

  useEffect(() => {
    drawWheel(rotationRef.current, null);
  }, [drawWheel]);

  // Smooth realistic stopping mechanism with elastic settle
  const handleSpin = () => {
    if (isSpinning) return;
    audioManager.playPop();
    setIsSpinning(true);
    setSelectedResult(null);

    // Pick random winning option
    const targetIdx = Math.floor(Math.random() * numSlices);

    // Pointer is positioned at top (3*PI / 2 or 270°)
    const sliceCenter = targetIdx * sliceAngle + sliceAngle / 2;
    const targetAngle = (1.5 * Math.PI - sliceCenter + 4 * Math.PI) % (2 * Math.PI);

    // 7 to 9 full spins for satisfying suspense
    const extraRounds = (7 + Math.floor(Math.random() * 2)) * (2 * Math.PI);
    const startRotation = rotationRef.current % (2 * Math.PI);
    const finalRotation = startRotation + extraRounds + targetAngle;

    const spinDuration = 4200; // ms
    const startTime = performance.now();

    // High-precision smooth deceleration curve with subtle elastic rebound at end
    const smoothEaseOut = (t: number) => {
      // Quintic ease out for butter-smooth deceleration
      const p = 1 - Math.pow(1 - t, 4.2);
      // Add subtle elastic settle during the last 5% of animation
      if (t > 0.95) {
        const settleT = (t - 0.95) / 0.05;
        const bounce = Math.sin(settleT * Math.PI) * 0.003;
        return p + bounce;
      }
      return p;
    };

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      const eased = smoothEaseOut(progress);

      const currentAngle = startRotation + (finalRotation - startRotation) * eased;
      rotationRef.current = currentAngle;
      drawWheel(currentAngle, null);

      // Detect slice pin collision with pointer needle
      const normalized = (currentAngle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
      const currentSlice = Math.floor(normalized / sliceAngle);

      if (currentSlice !== lastSliceIdxRef.current) {
        lastSliceIdxRef.current = currentSlice;
        audioManager.playTick();

        // Realistic tactile needle kick/deflection
        setPointerDeflect(progress < 0.85 ? -14 : -7);
        setTimeout(() => setPointerDeflect(0), 40);
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Satisfying Stop Achieved!
        setIsSpinning(false);
        setPointerDeflect(0);
        rotationRef.current = finalRotation;
        drawWheel(finalRotation, targetIdx);

        const won = options[targetIdx];
        setSelectedResult(won);
        setHasSpunAtLeastOnce(true);
        setSpinsCount((c) => c + 1);
        audioManager.playSuccess();

        // Celebration Confetti
        try {
          confetti({
            particleCount: 90,
            spread: 75,
            origin: { y: 0.55 },
            colors: ['#FF4F8E', '#FFA8C5', '#FCD34D', '#FFFFFF', '#FB7185']
          });
        } catch {}
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const handleProceed = () => {
    audioManager.playSparkle();
    onNext();
  };

  return (
    <div className="w-full max-w-sm mx-auto my-auto flex flex-col items-center justify-center py-2 px-3 text-center select-none">
      {/* Title Header */}
      <div className="mb-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-pink-100 text-pink-700 text-xs font-extrabold mb-1">
          <Sparkles className="w-3.5 h-3.5 text-pink-500" />
          <span>Interactive Bestie Wheel</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-800">
          {wheelConfig.title}
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-pink-600 mt-0.5">
          {wheelConfig.subtitle}
        </p>
      </div>

      {/* Fully Contained Wheel Container - Guaranteed 100% visible on all mobile screens */}
      <div className="relative w-full max-w-[270px] sm:max-w-[310px] aspect-square flex items-center justify-center mx-auto my-2 select-none">
        {/* Top Pointer Needle with Realistic Spring Deflection */}
        <div
          className="absolute -top-3 z-30 flex flex-col items-center pointer-events-none drop-shadow-lg transition-transform duration-75"
          style={{
            transform: `rotate(${pointerDeflect}deg)`,
            transformOrigin: 'top center'
          }}
        >
          <div
            className="w-7 h-9 bg-gradient-to-b from-rose-600 via-pink-600 to-rose-700 shadow-md transform rotate-180"
            style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
          />
          <div className="w-4 h-4 rounded-full bg-white shadow-xs -mt-2 border-2 border-pink-500" />
        </div>

        {/* Ambient Glow */}
        <div
          className={`absolute inset-1 rounded-full bg-pink-400/25 blur-xl transition-all duration-500 ${
            isSpinning ? 'scale-105 opacity-80' : 'opacity-30'
          }`}
        />

        {/* The 100% Crisp Retina Canvas */}
        <canvas
          ref={canvasRef}
          width={640}
          height={640}
          onClick={handleSpin}
          className="w-full h-full object-contain relative z-10 drop-shadow-xl cursor-pointer touch-manipulation"
        />
      </div>

      {/* High-Target Hit Area Spin Controls for Mobile */}
      <div className="w-full max-w-xs mt-2 flex flex-col items-center gap-2">
        <button
          onClick={handleSpin}
          disabled={isSpinning}
          className="w-full min-h-[54px] py-4 px-8 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-400 text-white font-black text-base sm:text-lg shadow-xl shadow-pink-500/30 hover:scale-[1.02] active:scale-[0.96] transition-all disabled:opacity-60 flex items-center justify-center gap-2.5 touch-manipulation cursor-pointer select-none"
        >
          <RotateCw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
          <span>{isSpinning ? 'Spinning Magic... 🎡' : spinsCount === 0 ? 'SPIN THE WHEEL! ✨' : 'SPIN AGAIN ↺'}</span>
        </button>

        {hasSpunAtLeastOnce && (
          <button
            onClick={handleProceed}
            className="w-full py-3 px-5 rounded-2xl bg-pink-100 hover:bg-pink-200 text-pink-700 font-extrabold text-sm flex items-center justify-center gap-1.5 transition-colors shadow-xs touch-manipulation cursor-pointer select-none"
          >
            <span>Proceed to Next Surprise</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Result Challenge Card */}
      {selectedResult && (
        <div className="w-full max-w-xs mt-3 glass-pink p-4 sm:p-5 rounded-3xl border border-white text-center shadow-xl animate-fade-in">
          <div className="text-3xl mb-1">{selectedResult.emoji}</div>
          <span className="text-[10px] font-black tracking-widest text-pink-500 uppercase bg-pink-100 px-3 py-1 rounded-full">
            BESTIE CHALLENGE UNLOCKED
          </span>
          <h3 className="font-display text-xl font-extrabold text-slate-800 mt-1.5 mb-1.5">
            {selectedResult.label}
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed bg-white/85 p-3 rounded-2xl border border-pink-100">
            {selectedResult.challenge}
          </p>

          <button
            onClick={handleProceed}
            className="mt-3 w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all touch-manipulation cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Accept Perk & Proceed 🎁</span>
          </button>
        </div>
      )}
    </div>
  );
};
