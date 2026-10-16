import React, { useState } from 'react';
import { Trophy, Download, Sparkles, Heart, ArrowRight, Check } from 'lucide-react';
import { useBirthdayConfig } from '../context/BirthdayContext';
import { downloadAwardCertificate } from '../utils/canvasGenerators';
import { audioManager } from '../utils/audioManager';

interface StageAwardCeremonyProps {
  onNext: () => void;
}

export const StageAwardCeremony: React.FC<StageAwardCeremonyProps> = ({ onNext }) => {
  const { config } = useBirthdayConfig();
  const award = config.award;
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async () => {
    audioManager.playSparkle();
    setIsDownloading(true);
    try {
      await downloadAwardCertificate(award.recipient, award.officialDate, award.categories);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch {
      // Safe fallback
    } finally {
      setIsDownloading(false);
    }
  };

  const handleProceed = () => {
    audioManager.playPop();
    onNext();
  };

  return (
    <div className="w-full max-w-md mx-auto my-auto flex flex-col items-center justify-center py-2 px-3 text-center select-none">
      {/* Title */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold mb-1">
          <Trophy className="w-3.5 h-3.5 text-pink-500" />
          <span>Annual Honors Ceremony</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-800">
          {award.title}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Officially awarded on <strong className="text-pink-600">{award.officialDate}</strong>
        </p>
      </div>

      {/* Visual Award Certificate Frame */}
      <div className="w-full bg-gradient-to-b from-[#FFFDF9] via-[#FFF9FA] to-[#FFF0F5] p-5 sm:p-7 rounded-3xl shadow-2xl border-4 border-pink-200/80 relative overflow-hidden mb-5">
        {/* Ornate corner seals */}
        <div className="absolute top-2 left-2 text-pink-300 text-sm">🎀</div>
        <div className="absolute top-2 right-2 text-pink-300 text-sm">🎀</div>
        <div className="absolute bottom-2 left-2 text-pink-300 text-sm">🎀</div>
        <div className="absolute bottom-2 right-2 text-pink-300 text-sm">🎀</div>

        <div className="text-center">
          <span className="text-[10px] tracking-widest text-slate-400 font-bold uppercase">
            CERTIFICATE OF EXCELLENCE
          </span>
          <p className="text-xs text-slate-500 mt-1">Presented with unmeasured love to:</p>

          <h3 className="font-display text-4xl sm:text-5xl font-black text-pink-600 my-1 tracking-tight">
            {award.recipient}
          </h3>

          <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-xs tracking-wider uppercase shadow-xs mb-4">
            {award.awardName}
          </div>
        </div>

        {/* Categories Grid */}
        <div className="space-y-2 mb-5">
          {award.categories.map((cat, idx) => (
            <div
              key={idx}
              className="bg-white/80 p-2.5 sm:p-3 rounded-2xl border border-pink-100 flex items-center gap-3 shadow-2xs"
            >
              <span className="text-xl shrink-0">{cat.icon}</span>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">
                  {cat.title}
                </h4>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {cat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Certificate Footer Stamp */}
        <div className="pt-3 border-t border-pink-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-[10px]">
              SEAL
            </div>
            <span className="text-[11px] font-semibold text-pink-700">Official Bestie Seal</span>
          </div>

          <div className="text-right">
            <span className="font-display text-sm font-extrabold text-pink-600 block">
              Forever Your {config.senderName} 💕
            </span>
            <span className="text-[10px] text-slate-400">Verified & Sealed</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-2.5">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-pink-50 text-pink-700 font-bold text-sm shadow-md border border-pink-200 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          {downloaded ? (
            <>
              <Check className="w-4 h-4 text-emerald-500" />
              <span>Award Certificate Saved to Device! 🏆</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-pink-500" />
              <span>{isDownloading ? 'Generating High-Res PNG...' : 'Download My Award 🏆'}</span>
            </>
          )}
        </button>

        <button
          onClick={handleProceed}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-400 text-white font-bold text-base shadow-lg shadow-pink-400/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span>Spin the Bestie Wheel 🎡</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
