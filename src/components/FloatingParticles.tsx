import React, { useMemo } from 'react';

interface Particle {
  id: number;
  symbol: string;
  left: string;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  sway: number;
}

export const FloatingParticles: React.FC<{ isDarkTheme?: boolean }> = ({ isDarkTheme = false }) => {
  const particles = useMemo<Particle[]>(() => {
    // Flowers, hearts, sparkles, butterflies, ribbons
    const lightSymbols = [
      '🌸', '💗', '✨', '🌷', '🎀', '🦋', '💖', '🌺', '💕', '🌼', '⭐', '🌸', '💓', '💫', '💐', '🎀'
    ];
    const darkSymbols = [
      '✨', '⭐', '💫', '💗', '🌙', '🌸', '💖', '🦋', '🎀', '⭐', '✨', '🌷'
    ];
    const pool = isDarkTheme ? darkSymbols : lightSymbols;

    return Array.from({ length: 24 }, (_, i) => ({
      id: i,
      symbol: pool[i % pool.length],
      left: `${(i * 4.16 + (i % 5) * 1.5)}%`,
      size: 16 + (i % 6) * 4,
      duration: 10 + (i % 7) * 3,
      delay: (i * 0.6) % 6,
      opacity: isDarkTheme ? 0.35 + (i % 4) * 0.12 : 0.28 + (i % 4) * 0.12,
      sway: 15 + (i % 4) * 10
    }));
  }, [isDarkTheme]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute bottom-[-50px] select-none transform-gpu"
          style={{
            left: p.left,
            fontSize: `${p.size}px`,
            opacity: p.opacity,
            animation: `floatUp ${p.duration}s infinite ease-in-out`,
            animationDelay: `${p.delay}s`
          }}
        >
          {p.symbol}
        </span>
      ))}
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) translateX(0px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          50% {
            transform: translateY(-55vh) translateX(25px) rotate(180deg);
          }
          85% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(-118vh) translateX(-20px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
