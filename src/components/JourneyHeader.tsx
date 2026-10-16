import React from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { audioManager } from '../utils/audioManager';

interface JourneyHeaderProps {
  currentStage: number;
  totalStages: number;
  stageTitle: string;
  onPrev?: () => void;
  onRestart?: () => void;
  showNavControls?: boolean;
}

export const JourneyHeader: React.FC<JourneyHeaderProps> = ({
  currentStage,
  totalStages,
  stageTitle,
  onPrev,
  onRestart,
  showNavControls = true
}) => {
  const handlePrev = () => {
    audioManager.playClick();
    if (onPrev) onPrev();
  };

  const handleRestart = () => {
    audioManager.playClick();
    if (onRestart) onRestart();
  };

  return (
    <header className="sticky top-0 z-40 w-full px-4 py-3 flex items-center justify-between pointer-events-auto bg-white/40 backdrop-blur-md border-b border-pink-100/60 max-w-xl mx-auto">
      <div className="flex items-center gap-2">
        {showNavControls && onPrev && currentStage > 1 ? (
          <button
            onClick={handlePrev}
            aria-label="Go to previous step"
            className="w-8 h-8 rounded-full flex items-center justify-center text-pink-600 bg-white/80 shadow-xs hover:bg-pink-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        ) : null}

        <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-pink-700 bg-pink-100/80 px-2.5 py-1 rounded-full">
          <span>💗</span>
          <span>
            {currentStage} / {totalStages}
          </span>
        </div>
      </div>

      <div className="text-xs font-medium text-pink-800/80 max-w-[170px] truncate text-center">
        {stageTitle}
      </div>

      <div className="flex items-center gap-1">
        {showNavControls && onRestart ? (
          <button
            onClick={handleRestart}
            aria-label="Restart surprise experience"
            title="Start from beginning"
            className="w-8 h-8 rounded-full flex items-center justify-center text-pink-400 hover:text-pink-600 hover:bg-pink-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="w-8" />
        )}
      </div>
    </header>
  );
};
