import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Heart, ArrowRight, Eye, X } from 'lucide-react';
import { MemoryPhoto } from '../data/birthdayConfig';
import { useBirthdayConfig } from '../context/BirthdayContext';
import { PhotoCard } from '../components/PhotoCard';
import { audioManager } from '../utils/audioManager';

interface StagePhotoMemoriesProps {
  onNext: () => void;
}

export const StagePhotoMemories: React.FC<StagePhotoMemoriesProps> = ({ onNext }) => {
  const { config } = useBirthdayConfig();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inspectingPhoto, setInspectingPhoto] = useState<MemoryPhoto | null>(null);

  const photos = config.photos && config.photos.length > 0 ? config.photos : [];
  const safeIndex = Math.min(currentIndex, photos.length - 1);
  const currentPhoto = photos[safeIndex] || photos[0];

  const handleNext = () => {
    audioManager.playClick();
    if (currentIndex < photos.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    audioManager.playClick();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(photos.length - 1);
    }
  };

  const handleOpenModal = () => {
    audioManager.playSparkle();
    setInspectingPhoto(currentPhoto);
  };

  const handleProceed = () => {
    audioManager.playPop();
    onNext();
  };

  if (!currentPhoto) return null;

  return (
    <div className="w-full max-w-md mx-auto my-auto flex flex-col items-center justify-center py-2 px-3 text-center select-none">
      {/* Title */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{config.name}&apos;s Spotlight Vault ✨</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-800">
          {config.name} in the Spotlight 📸
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Swipe or tap Next to admire {config.name}&apos;s {photos.length} iconic photos!
        </p>
      </div>

      {/* Main Interactive Carousel Card */}
      <div className="w-full relative max-w-sm mb-6">
        <div className="transition-all duration-300 transform">
          <PhotoCard memory={currentPhoto} onSelect={handleOpenModal} />
        </div>

        {/* Floating Carousel Navigation Buttons */}
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={handlePrev}
            aria-label="Previous memory"
            className="w-11 h-11 rounded-full bg-white shadow-md border border-pink-100 text-pink-600 flex items-center justify-center hover:bg-pink-50 active:scale-95 transition-transform"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5">
            {photos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  audioManager.playClick();
                  setCurrentIndex(idx);
                }}
                className={`transition-all duration-300 rounded-full ${
                  idx === safeIndex
                    ? 'w-6 h-2.5 bg-pink-500'
                    : 'w-2.5 h-2.5 bg-pink-200 hover:bg-pink-300'
                }`}
                aria-label={`Jump to photo ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            aria-label="Next memory"
            className="w-11 h-11 rounded-full bg-white shadow-md border border-pink-100 text-pink-600 flex items-center justify-center hover:bg-pink-50 active:scale-95 transition-transform"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Next Step CTA */}
      <button
        onClick={handleProceed}
        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-400 text-white font-bold text-base shadow-lg shadow-pink-400/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        <span>Memory Timeline Journey ✨</span>
        <ArrowRight className="w-5 h-5" />
      </button>

      {/* Lightbox / Expanded View Modal */}
      {inspectingPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 animate-fade-in"
          onClick={() => setInspectingPhoto(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-pink-200 relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setInspectingPhoto(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center hover:bg-pink-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-pink-600 uppercase tracking-wider mb-2">
              <span>{inspectingPhoto.accentEmoji}</span>
              <span>{inspectingPhoto.dateTag}</span>
            </div>

            <h3 className="font-display text-xl font-bold text-slate-800 mb-1">
              {inspectingPhoto.title}
            </h3>

            <p className="text-sm font-semibold text-pink-500 mb-3">
              {inspectingPhoto.caption}
            </p>

            <div className="w-full h-48 rounded-2xl overflow-hidden mb-3 bg-pink-50 border border-pink-100 flex items-center justify-center">
              <img
                src={inspectingPhoto.imagePath}
                alt={inspectingPhoto.title}
                style={{
                  objectFit: inspectingPhoto.fit || 'cover',
                  objectPosition: `${inspectingPhoto.positionX ?? 50}% ${inspectingPhoto.positionY ?? 50}%`,
                  transform: `scale(${inspectingPhoto.scale ?? 1}) rotate(${inspectingPhoto.rotate ?? 0}deg)`,
                  transformOrigin: `${inspectingPhoto.positionX ?? 50}% ${inspectingPhoto.positionY ?? 50}%`,
                }}
                className="w-full h-full transition-all duration-300"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              {inspectingPhoto.story}
            </p>

            <button
              onClick={() => setInspectingPhoto(null)}
              className="mt-4 w-full py-2.5 rounded-xl bg-pink-500 text-white font-bold text-xs"
            >
              Close Snapshot 📸
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
