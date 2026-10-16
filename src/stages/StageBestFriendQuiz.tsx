import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { HelpCircle, Sparkles, Heart, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useBirthdayConfig } from '../context/BirthdayContext';
import { audioManager } from '../utils/audioManager';

interface StageBestFriendQuizProps {
  onComplete: () => void;
}

export const StageBestFriendQuiz: React.FC<StageBestFriendQuizProps> = ({ onComplete }) => {
  const { config } = useBirthdayConfig();
  const quiz = config.quiz;
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [answersRecorded, setAnswersRecorded] = useState<number[]>([]);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  const currentQ = quiz.questions[currentQIndex];

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return;
    audioManager.playPop();
    setSelectedOption(idx);
    setFeedback(currentQ.options[idx].reaction);
    setAnswersRecorded((prev) => [...prev, idx]);
  };

  const handleNextQuestion = () => {
    audioManager.playClick();
    setSelectedOption(null);
    setFeedback(null);

    if (currentQIndex < quiz.questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      setIsQuizComplete(true);
      audioManager.playSuccess();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF8FB8', '#FF4F91', '#F472B6', '#FFFFFF']
        });
      } catch {}
    }
  };

  const handleProceed = () => {
    audioManager.playSparkle();
    onComplete();
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-6 max-w-lg mx-auto">
      {/* Title */}
      <div className="text-center mb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold mb-1">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Interactive Bestie Quiz</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-800">
          {quiz.title}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {!isQuizComplete
            ? `Question ${currentQIndex + 1} of ${quiz.questions.length}`
            : 'Telepathy test complete! 💅'}
        </p>
      </div>

      {!isQuizComplete ? (
        /* Active Quiz Question Card */
        <div className="w-full glass-pink p-5 sm:p-7 rounded-3xl shadow-xl border border-white">
          {/* Progress bar */}
          <div className="w-full bg-pink-100 h-1.5 rounded-full mb-5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-pink-500 to-rose-400 h-full transition-all duration-300"
              style={{
                width: `${((currentQIndex + 1) / quiz.questions.length) * 100}%`
              }}
            />
          </div>

          <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-800 mb-5 leading-snug">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="space-y-3 mb-5">
            {currentQ.options.map((opt, idx) => {
              const isChosen = selectedOption === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={selectedOption !== null}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm font-medium transition-all duration-200 border flex items-center justify-between ${
                    isChosen
                      ? 'bg-pink-500 text-white border-pink-500 shadow-md shadow-pink-300 scale-[1.01]'
                      : selectedOption !== null
                      ? 'bg-white/40 text-slate-400 border-pink-50'
                      : 'bg-white hover:bg-pink-50/70 active:bg-pink-100 text-slate-700 border-pink-100 shadow-2xs'
                  }`}
                >
                  <span className="flex-1 pr-2">{opt.text}</span>
                  {isChosen && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Instant Reaction Feedback */}
          {feedback && (
            <div className="p-3 bg-pink-50 border border-pink-200 rounded-2xl text-center mb-5 animate-fade-in">
              <p className="text-sm font-extrabold text-pink-700">
                {feedback}
              </p>
            </div>
          )}

          {/* Continue button */}
          {selectedOption !== null && (
            <button
              onClick={handleNextQuestion}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-sm shadow-md hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>
                {currentQIndex < quiz.questions.length - 1 ? 'Next Question 💗' : 'See Our Compatibility ✨'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        /* Quiz Complete Result */
        <div className="w-full glass-pink p-6 sm:p-8 rounded-3xl shadow-2xl border border-white text-center animate-pulse-glow">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-tr from-pink-400 via-rose-300 to-pink-200 flex items-center justify-center shadow-lg shadow-pink-300 animate-bounce">
            <Heart className="w-10 h-10 text-white fill-white" />
          </div>

          <span className="text-xs font-bold tracking-widest text-pink-600 uppercase bg-pink-100 px-3 py-1 rounded-full">
            Bestie Compatibility Result 💗
          </span>

          <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-500 mt-3 mb-2">
            {quiz.resultScoreText}
          </h3>

          <p className="text-sm text-slate-700 leading-relaxed max-w-sm mx-auto mb-6">
            {quiz.resultDescription}
          </p>

          <button
            onClick={handleProceed}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-400 text-white font-bold text-base shadow-lg shadow-pink-400/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>Claim Your Official Award 🏆</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
