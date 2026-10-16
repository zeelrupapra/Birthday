import React, { useState } from 'react';
import { Camera, Sparkles, Heart, Upload } from 'lucide-react';
import { MemoryPhoto } from '../data/birthdayConfig';
import { useBirthdayConfig } from '../context/BirthdayContext';
import { audioManager } from '../utils/audioManager';

interface PhotoCardProps {
  memory: MemoryPhoto;
  onSelect?: () => void;
  priority?: boolean;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({ memory, onSelect }) => {
  const { config } = useBirthdayConfig();
  const [imgError, setImgError] = useState(false);
  const [customImg, setCustomImg] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomImg(url);
      setImgError(false);
      audioManager.playSparkle();
    }
  };

  const activeSrc = customImg || memory.imagePath;

  return (
    <div
      onClick={onSelect}
      className="group relative bg-white p-3 sm:p-4 rounded-3xl shadow-xl shadow-pink-200/50 border border-pink-100 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-300/60 cursor-pointer"
    >
      {/* Decorative Washi Tape on top */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-pink-200/80 backdrop-blur-xs rounded-sm -rotate-1 shadow-xs pointer-events-none z-10 flex items-center justify-center">
        <span className="text-[10px] font-mono tracking-widest text-pink-700/70 uppercase">
          {memory.dateTag}
        </span>
      </div>

      {/* Photo viewport */}
      <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-100/80 flex items-center justify-center">
        {!imgError ? (
          <img
            src={activeSrc}
            alt={memory.title}
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
            style={{
              objectFit: memory.fit || 'cover',
              objectPosition: `${memory.positionX ?? 50}% ${memory.positionY ?? 50}%`,
              transform: `scale(${memory.scale ?? 1}) rotate(${memory.rotate ?? 0}deg)`,
              transformOrigin: `${memory.positionX ?? 50}% ${memory.positionY ?? 50}%`,
            }}
            className="w-full h-full transition-all duration-300"
          />
        ) : (
          /* Graceful styled SVG/CSS artwork when local file is missing */
          <div className={`w-full h-full bg-gradient-to-br ${memory.fallbackGradient} flex flex-col items-center justify-center p-6 text-center text-white relative`}>
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 shadow-inner">
              <Camera className="w-7 h-7 text-white" />
            </div>
            <p className="font-display text-xl font-bold tracking-wide drop-shadow-sm">
              {memory.title}
            </p>
            <p className="text-xs text-white/90 font-medium mt-1">
              Add {config.name}&apos;s photo: <code className="bg-black/20 px-1.5 py-0.5 rounded text-[10px]">{memory.imagePath}</code>
            </p>
            
            {/* Direct mobile upload trigger */}
            <label
              onClick={(e) => e.stopPropagation()}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 text-pink-700 text-xs font-semibold shadow-sm hover:bg-white active:scale-95 transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Choose {config.name}&apos;s Photo</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        )}

        {/* Floating badge */}
        <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-xs">
          <span className="text-sm">{memory.accentEmoji}</span>
        </div>
      </div>

      {/* Caption & note below */}
      <div className="mt-3 text-center px-1">
        <h3 className="font-display text-xl font-bold text-slate-800 leading-tight">
          {memory.title}
        </h3>
        <p className="text-sm font-bold text-pink-600 mt-0.5">
          {memory.caption}
        </p>
        <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
          {memory.story}
        </p>
      </div>

      {/* Micro-interaction footer */}
      <div className="mt-2.5 pt-2 border-t border-pink-50 flex items-center justify-between text-xs text-pink-400">
        <span className="flex items-center gap-1 font-medium text-[11px]">
          <Sparkles className="w-3 h-3 text-pink-400" />
          Tap to view memory
        </span>
        <span className="flex items-center gap-0.5 text-pink-500">
          <Heart className="w-3.5 h-3.5 fill-pink-500" />
        </span>
      </div>
    </div>
  );
};
