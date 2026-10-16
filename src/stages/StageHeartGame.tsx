import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, Trophy, RotateCcw, ArrowRight, Play } from 'lucide-react';
import { useBirthdayConfig } from '../context/BirthdayContext';
import { audioManager } from '../utils/audioManager';

interface FallingHeart {
  id: number;
  x: number;
  y: number;
  size: number;
  symbol: string;
  points: number;
}

interface StageHeartGameProps {
  onSuccess: () => void;
}

export const StageHeartGame: React.FC<StageHeartGameProps> = ({ onSuccess }) => {
  const { config } = useBirthdayConfig();
  const gameConfig = config.game;
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(gameConfig.durationSeconds);
  const [hearts, setHearts] = useState<FallingHeart[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const nextHeartId = useRef(0);
  const spawnTimerRef = useRef<number | null>(null);
  const gameLoopRef = useRef<number | null>(null);

  const startGame = () => {
    audioManager.playPop();
    setIsPlaying(true);
    setScore(0);
    setCombo(0);
    setTimeLeft(gameConfig.durationSeconds);
    setIsGameOver(false);
    setGameWon(false);
    setHearts([]);
    nextHeartId.current = 0;
  };

  // Main countdown timer
  useEffect(() => {
    if (!isPlaying) return;

    gameLoopRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPlaying]);

  // Spawning falling hearts, flowers, butterflies
  useEffect(() => {
    if (!isPlaying) return;

    const symbols = ['🌸', '💗', '🌷', '💖', '🎀', '🦋', '🌺', '✨', '💕', '🍓'];
    const spawnHeart = () => {
      const newHeart: FallingHeart = {
        id: nextHeartId.current++,
        x: Math.floor(Math.random() * 75) + 12,
        y: Math.floor(Math.random() * 65) + 15,
        size: Math.floor(Math.random() * 14) + 34,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        points: 1
      };

      setHearts((current) => [...current.slice(-5), newHeart]);
    };

    spawnTimerRef.current = window.setInterval(spawnHeart, 600);

    return () => {
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    };
  }, [isPlaying]);

  const endGame = () => {
    setIsPlaying(false);
    setIsGameOver(true);
    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);

    setScore((currentScore) => {
      if (currentScore >= gameConfig.targetScore) {
        setGameWon(true);
        audioManager.playSuccess();
        try {
          confetti({
            particleCount: 90,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FF8FB8', '#FF4F91', '#F472B6', '#FFFFFF', '#FCD34D']
          });
        } catch {}
      } else {
        audioManager.playPop();
      }
      return currentScore;
    });
  };

  const handleTapHeart = (id: number) => {
    audioManager.playPop();
    setHearts((prev) => prev.filter((h) => h.id !== id));
    setCombo((prev) => prev + 1);

    setScore((prev) => {
      const nextScore = prev + 1;
      // "game ma 10 score thai jay pachi bas aena thi vadhare jarur nai" -> complete right at 10!
      if (nextScore >= gameConfig.targetScore) {
        setIsPlaying(false);
        setIsGameOver(true);
        setGameWon(true);
        if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
        audioManager.playSuccess();
        try {
          confetti({
            particleCount: 100,
            spread: 75,
            origin: { y: 0.6 },
            colors: ['#FF8FB8', '#FF4F91', '#F472B6', '#FFFFFF', '#FCD34D']
          });
        } catch {}
      }
      return nextScore;
    });
  };

  const handleProceed = () => {
    audioManager.playSparkle();
    onSuccess();
  };

  return (
    <div className="w-full max-w-md mx-auto my-auto flex flex-col items-center justify-center py-2 px-3 text-center select-none">
      {/* Header */}
      <div className="text-center mb-3">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-800">
          {gameConfig.title}
        </h2>
        <p className="text-xs sm:text-sm font-bold text-pink-600 mt-0.5">
          {gameConfig.subtitle}
        </p>
      </div>

      {/* Game Card Container */}
      <div className="w-full bg-white/80 rounded-3xl p-3.5 sm:p-5 shadow-xl border border-pink-100 flex flex-col items-center relative overflow-hidden">
        {/* HUD Bar */}
        <div className="w-full flex items-center justify-between mb-2.5 px-2">
          <div className="flex items-center gap-1.5 bg-pink-100/90 px-3 py-1 rounded-full text-xs font-extrabold text-pink-700">
            <Trophy className="w-3.5 h-3.5 text-pink-500" />
            <span>
              Score: {score} / {gameConfig.targetScore}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-rose-50 px-2.5 py-1 rounded-full text-xs font-mono font-bold text-rose-600">
            <span>⏱️ {timeLeft}s</span>
          </div>

          {combo > 1 && (
            <div className="text-xs font-black text-pink-600 animate-bounce">
              {combo}x! 🔥
            </div>
          )}
        </div>

        {/* Interactive Play Arena */}
        <div className="w-full h-60 sm:h-72 bg-gradient-to-b from-pink-50/70 via-rose-50/50 to-pink-100/50 rounded-2xl relative overflow-hidden border border-pink-200/60 select-none">
          {!isPlaying && !isGameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-white/70 backdrop-blur-xs">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center mb-3 shadow-lg shadow-pink-300 animate-float-gentle">
                <Heart className="w-8 h-8 fill-white" />
              </div>
              <h3 className="font-display text-xl font-extrabold text-slate-800 mb-1">
                Catch 10 Hearts & Flowers
              </h3>
              <p className="text-xs text-slate-500 mb-4 max-w-xs font-medium">
                Tap 10 cute items on screen to beat the challenge!
              </p>
              <button
                onClick={startGame}
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-extrabold text-sm shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start Game 🎮</span>
              </button>
            </div>
          )}

          {/* Active Hearts/Flowers Floating in Arena */}
          {isPlaying &&
            hearts.map((h) => (
              <button
                key={h.id}
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleTapHeart(h.id);
                }}
                style={{
                  left: `${h.x}%`,
                  top: `${h.y}%`,
                  fontSize: `${h.size}px`
                }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-125 active:scale-90 transition-transform filter drop-shadow-md select-none touch-manipulation animate-pulse"
                aria-label="Catch item"
              >
                {h.symbol}
              </button>
            ))}

          {/* Game Over / Completed Screen */}
          {isGameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20 bg-white/95 backdrop-blur-sm animate-fade-in">
              {score >= gameConfig.targetScore ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center mb-2 shadow-lg animate-bounce">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <h3 className="font-display text-2xl font-black text-pink-600 mb-1">
                    TARGET 10 REACHED! 💗
                  </h3>
                  <p className="text-xs text-slate-600 mb-4 font-semibold">
                    10/10 Score achieved! Challenge complete! 🏆
                  </p>
                  <button
                    onClick={handleProceed}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-400 text-white font-extrabold text-sm shadow-md shadow-pink-400/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <span>Shoot the Birthday Arrow! 🏹</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <div className="text-3xl mb-2">🥺</div>
                  <h3 className="font-display text-xl font-bold text-slate-800 mb-1">
                    {score} / 10 Captured
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Just a few more taps, bestie!
                  </p>
                  <button
                    onClick={startGame}
                    className="py-3 px-6 rounded-xl bg-pink-500 text-white font-bold text-sm shadow-md hover:bg-pink-600 flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Try Again ↺</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
