import React, { useState, useEffect } from 'react';
import { BirthdayProvider, useBirthdayConfig } from './context/BirthdayContext';
import { FloatingParticles } from './components/FloatingParticles';
import { AudioControl } from './components/AudioControl';
import { JourneyHeader } from './components/JourneyHeader';
import { AdminPanel } from './admin/AdminPanel';

// Stage components
import { StageCountdown } from './stages/StageCountdown';
import { StagePasscode } from './stages/StagePasscode';
import { StageWelcome } from './stages/StageWelcome';
import { StageLetterEnvelope } from './stages/StageLetterEnvelope';
import { StagePhotoMemories } from './stages/StagePhotoMemories';
import { StageMemoryJourney } from './stages/StageMemoryJourney';
import { StageHeartGame } from './stages/StageHeartGame';
import { StageBestFriendQuiz } from './stages/StageBestFriendQuiz';
import { StageArrowShoot } from './stages/StageArrowShoot';
import { StageBloomingTree } from './stages/StageBloomingTree';
import { StageCakeCutting } from './stages/StageCakeCutting';
import { StageAwardCeremony } from './stages/StageAwardCeremony';
import { StageSpinWheel } from './stages/StageSpinWheel';
import { StageSurpriseBox } from './stages/StageSurpriseBox';
import { StageFinalMessage } from './stages/StageFinalMessage';
import { StageMemoryGallery } from './stages/StageMemoryGallery';

export type StageId =
  | 'countdown'
  | 'passcode'
  | 'welcome'
  | 'envelope'
  | 'photomemories'
  | 'memoryjourney'
  | 'heartgame'
  | 'quiz'
  | 'arrowshoot'
  | 'bloomingtree'
  | 'cakecutting'
  | 'award'
  | 'wheel'
  | 'surprisebox'
  | 'finalmessage'
  | 'gallery';

function AppContent() {
  const { config } = useBirthdayConfig();
  const [currentStageId, setCurrentStageId] = useState<StageId>('passcode');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [footerTapCount, setFooterTapCount] = useState(0);

  // Check URL parameters or hash on initial load
  useEffect(() => {
    const checkAdminRoute = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const isParamAdmin = searchParams.get('admin') === 'true' || searchParams.has('admin');
      const isHashAdmin = window.location.hash === '#admin' || window.location.hash === '#/admin';
      const isPathAdmin = window.location.pathname === '/admin';
      if (isParamAdmin || isHashAdmin || isPathAdmin) {
        setIsAdminOpen(true);
      }
    };

    checkAdminRoute();
    window.addEventListener('hashchange', checkAdminRoute);
    window.addEventListener('popstate', checkAdminRoute);

    // Secret shortcut: Ctrl + Shift + A to open admin
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkAdminRoute);
      window.removeEventListener('popstate', checkAdminRoute);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const stagesOrder: { id: StageId; title: string }[] = [
    { id: 'passcode', title: 'Secret Entry 🔐' },
    { id: 'countdown', title: 'Birthday Countdown ⏳' },
    { id: 'welcome', title: `Welcome ${config.name} 🌸` },
    { id: 'envelope', title: 'Special Letter 💌' },
    { id: 'photomemories', title: 'Photo Memories 📸' },
    { id: 'memoryjourney', title: 'Memory Journey ✨' },
    { id: 'heartgame', title: 'Bestie Challenge 🎮' },
    { id: 'quiz', title: 'Sister & Bestie Quiz 👀' },
    { id: 'arrowshoot', title: 'Birthday Arrow 🏹' },
    { id: 'bloomingtree', title: 'Blooming Heart 🌸❤️' },
    { id: 'cakecutting', title: 'Royal Cake Cutting 🎂' },
    { id: 'award', title: 'Awards Ceremony 🏆' },
    { id: 'wheel', title: 'Birthday Wheel 🎡' },
    { id: 'surprisebox', title: 'Mystery Surprise 🎁' },
    { id: 'finalmessage', title: 'Birthday Message 🎂' },
    { id: 'gallery', title: 'Memory Gallery 📸' },
  ];

  const currentIndex = stagesOrder.findIndex((s) => s.id === currentStageId);
  const currentStageInfo = stagesOrder[currentIndex] || stagesOrder[0];

  const isDarkSection = currentStageId === 'finalmessage';

  const goToNextStage = () => {
    if (currentIndex < stagesOrder.length - 1) {
      setCurrentStageId(stagesOrder[currentIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevStage = () => {
    if (currentIndex > 0) {
      setCurrentStageId(stagesOrder[currentIndex - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRestart = () => {
    setCurrentStageId('passcode');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scroll to top on stage change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStageId]);

  // Secret tap counter on footer: 5 quick taps opens admin panel
  const handleFooterTap = () => {
    setFooterTapCount((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        setIsAdminOpen(true);
        return 0;
      }
      return next;
    });
    setTimeout(() => setFooterTapCount(0), 2000);
  };

  return (
    <div
      className={`min-h-screen relative flex flex-col justify-between transition-colors duration-700 ${
        isDarkSection
          ? 'bg-[#1C0D20] text-slate-100'
          : 'bg-gradient-to-b from-[#FFF7F4] via-[#FFF0F2] to-[#FFE6EC] text-[#2D121F]'
      }`}
    >
      {/* Background Floating Hearts & Sparkles */}
      <FloatingParticles isDarkTheme={isDarkSection} />

      {/* Floating Audio Manager (Always available) */}
      <AudioControl />

      {/* Discrete Journey Header (Shown after Passcode stage) */}
      {currentStageId !== 'passcode' ? (
        <JourneyHeader
          currentStage={currentIndex + 1}
          totalStages={stagesOrder.length}
          stageTitle={currentStageInfo.title}
          onPrev={goToPrevStage}
          onRestart={handleRestart}
          showNavControls={true}
        />
      ) : null}

      {/* Main Interactive Stage Container */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full px-3 py-4 max-w-xl mx-auto">
        {currentStageId === 'passcode' && (
          <StagePasscode onSuccess={() => setCurrentStageId('countdown')} />
        )}

        {currentStageId === 'countdown' && (
          <StageCountdown onUnlock={() => setCurrentStageId('welcome')} />
        )}

        {currentStageId === 'welcome' && (
          <StageWelcome onContinue={() => setCurrentStageId('envelope')} />
        )}

        {currentStageId === 'envelope' && (
          <StageLetterEnvelope onNext={() => setCurrentStageId('photomemories')} />
        )}

        {currentStageId === 'photomemories' && (
          <StagePhotoMemories onNext={() => setCurrentStageId('memoryjourney')} />
        )}

        {currentStageId === 'memoryjourney' && (
          <StageMemoryJourney onNext={() => setCurrentStageId('heartgame')} />
        )}

        {currentStageId === 'heartgame' && (
          <StageHeartGame onSuccess={() => setCurrentStageId('quiz')} />
        )}

        {currentStageId === 'quiz' && (
          <StageBestFriendQuiz onComplete={() => setCurrentStageId('arrowshoot')} />
        )}

        {currentStageId === 'arrowshoot' && (
          <StageArrowShoot onNext={() => setCurrentStageId('bloomingtree')} />
        )}

        {currentStageId === 'bloomingtree' && (
          <StageBloomingTree onNext={() => setCurrentStageId('cakecutting')} />
        )}

        {currentStageId === 'cakecutting' && (
          <StageCakeCutting onNext={() => setCurrentStageId('award')} />
        )}

        {currentStageId === 'award' && (
          <StageAwardCeremony onNext={() => setCurrentStageId('wheel')} />
        )}

        {currentStageId === 'wheel' && (
          <StageSpinWheel onNext={() => setCurrentStageId('surprisebox')} />
        )}

        {currentStageId === 'surprisebox' && (
          <StageSurpriseBox onOpenFinal={() => setCurrentStageId('finalmessage')} />
        )}

        {currentStageId === 'finalmessage' && (
          <StageFinalMessage onProceedToGallery={() => setCurrentStageId('gallery')} />
        )}

        {currentStageId === 'gallery' && (
          <StageMemoryGallery onReplay={handleRestart} />
        )}
      </main>

      {/* Discreet Footer Note with secret tap trigger */}
      <footer
        onClick={handleFooterTap}
        className="relative z-10 py-3 text-center text-[11px] font-medium text-pink-400/80 cursor-default select-none"
      >
        Handcrafted with love by {config.senderName} for {config.name} · Happy Birthday 2026 🌸💖
      </footer>

      {/* Secret Admin Panel (Rendered only when opened via admin URL or secret shortcut) */}
      {isAdminOpen && (
        <AdminPanel
          onClose={() => {
            setIsAdminOpen(false);
            if (window.location.hash.includes('admin')) {
              window.history.replaceState(null, '', window.location.pathname + window.location.search.replace(/[\?&]admin(=[^&]*)?/g, ''));
            }
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <BirthdayProvider>
      <AppContent />
    </BirthdayProvider>
  );
}
