import React, { useState } from 'react';
import { Camera, Download, Sparkles, Heart, RotateCcw, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { MemoryPhoto } from '../data/birthdayConfig';
import { useBirthdayConfig } from '../context/BirthdayContext';
import { downloadMemoryCard } from '../utils/canvasGenerators';
import { audioManager } from '../utils/audioManager';

interface StageMemoryGalleryProps {
  onReplay: () => void;
}

export const StageMemoryGallery: React.FC<StageMemoryGalleryProps> = ({ onReplay }) => {
  const { config } = useBirthdayConfig();
  const photos = config.photos && config.photos.length > 0 ? config.photos : [];
  const [activePreviewIndex, setActivePreviewIndex] = useState<number | null>(null);
  const [downloadingCard, setDownloadingCard] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadKeepsake = async (photo: MemoryPhoto) => {
    audioManager.playSparkle();
    setDownloadingCard(true);
    try {
      await downloadMemoryCard(
        config.name,
        config.birthDateString || '17/10/2008',
        photo.imagePath,
        photo.caption
      );
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch {
      // Safe fallback
    } finally {
      setDownloadingCard(false);
    }
  };

  const handleReplayClick = () => {
    audioManager.playPop();
    onReplay();
  };

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-start px-4 py-8 max-w-lg mx-auto">
      {/* Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{config.name}&apos;s Birthday Portrait Archive</span>
        </div>
        <h2 className="font-display text-3xl font-extrabold text-slate-800">
          {config.name.toUpperCase()}&apos;S BIRTHDAY GALLERY 📸
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
          {photos.length} iconic pictures celebrating our favorite person on her special day.
        </p>
      </div>

      {/* Grid of Photos */}
      <div className="w-full space-y-6 mb-8">
        {photos.map((item, idx) => (
          <div
            key={item.id}
            className="glass-pink p-4 sm:p-5 rounded-3xl border border-white shadow-xl hover:shadow-2xl transition-all"
          >
            {/* Washi tape */}
            <div className="flex items-center justify-between mb-3 text-xs text-pink-500 font-semibold">
              <span className="uppercase tracking-widest">{item.dateTag}</span>
              <span>{item.accentEmoji}</span>
            </div>

            {/* Photo frame */}
            <div
              onClick={() => setActivePreviewIndex(idx)}
              className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-pink-50 cursor-pointer group shadow-inner mb-4 flex items-center justify-center"
            >
              <img
                src={item.imagePath}
                alt={item.title}
                style={{
                  objectFit: item.fit || 'cover',
                  objectPosition: `${item.positionX ?? 50}% ${item.positionY ?? 50}%`,
                  transform: `scale(${item.scale ?? 1}) rotate(${item.rotate ?? 0}deg)`,
                  transformOrigin: `${item.positionX ?? 50}% ${item.positionY ?? 50}%`,
                }}
                className="w-full h-full transition-all duration-300"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5 backdrop-blur-xs">
                <Eye className="w-4 h-4" />
                <span>Tap for Full View</span>
              </div>
            </div>

            <div className="text-center">
              <h3 className="font-display text-xl font-bold text-slate-800">
                {item.title}
              </h3>
              <p className="text-sm font-semibold text-pink-600 mt-0.5">
                {item.caption}
              </p>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {item.story}
              </p>
            </div>

            {/* Keepsake Download Button */}
            <button
              onClick={() => handleDownloadKeepsake(item)}
              disabled={downloadingCard}
              className="mt-4 w-full py-2.5 px-4 rounded-xl bg-white hover:bg-pink-50 text-pink-600 border border-pink-200 text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save Polaroid Keepsake</span>
            </button>
          </div>
        ))}
      </div>

      {/* Replay Button */}
      <div className="w-full text-center">
        <button
          onClick={handleReplayClick}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-base shadow-lg shadow-pink-400/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Replay Surprise Journey ↻</span>
        </button>
        <p className="text-xs text-pink-500 mt-2 flex items-center justify-center gap-1">
          <Heart className="w-3 h-3 fill-pink-500" />
          <span>Dedicated to {config.name} with endless love from {config.senderName}</span>
          <Heart className="w-3 h-3 fill-pink-500" />
        </p>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activePreviewIndex !== null && photos[activePreviewIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-fade-in"
          onClick={() => setActivePreviewIndex(null)}
        >
          <button
            onClick={() => setActivePreviewIndex(null)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30"
          >
            <X className="w-5 h-5" />
          </button>

          <div
            className="max-w-md w-full bg-white rounded-3xl p-5 shadow-2xl overflow-hidden text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden mb-4 bg-slate-100 flex items-center justify-center">
              <img
                src={photos[activePreviewIndex].imagePath}
                alt={photos[activePreviewIndex].title}
                style={{
                  objectFit: photos[activePreviewIndex].fit || 'cover',
                  objectPosition: `${photos[activePreviewIndex].positionX ?? 50}% ${photos[activePreviewIndex].positionY ?? 50}%`,
                  transform: `scale(${photos[activePreviewIndex].scale ?? 1}) rotate(${photos[activePreviewIndex].rotate ?? 0}deg)`,
                  transformOrigin: `${photos[activePreviewIndex].positionX ?? 50}% ${photos[activePreviewIndex].positionY ?? 50}%`,
                }}
                className="w-full h-full transition-all duration-300"
              />
            </div>

            <h3 className="font-display text-2xl font-bold text-slate-800">
              {photos[activePreviewIndex].title}
            </h3>
            <p className="text-sm font-bold text-pink-600 mt-1">
              {photos[activePreviewIndex].caption}
            </p>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {photos[activePreviewIndex].story}
            </p>

            <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-100">
              <button
                onClick={() =>
                  setActivePreviewIndex((prev) =>
                    prev !== null && prev > 0 ? prev - 1 : photos.length - 1
                  )
                }
                className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center hover:bg-pink-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => handleDownloadKeepsake(photos[activePreviewIndex])}
                className="py-2 px-4 rounded-xl bg-pink-500 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Keepsake</span>
              </button>

              <button
                onClick={() =>
                  setActivePreviewIndex((prev) =>
                    prev !== null && prev < photos.length - 1 ? prev + 1 : 0
                  )
                }
                className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center hover:bg-pink-200"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
