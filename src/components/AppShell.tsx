import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { HeroGuideModal } from './HeroGuideModal';
import { OrganizerModal } from './OrganizerModal';
import { Shield, BookOpen, Clock, Award, Settings, Terminal, CheckCircle2, Lock, Unlock, AlertTriangle } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const {
    gameState,
    remainingSeconds,
    goToScreen,
    currentSet,
    isAllHeroFilesDecoded,
    isAllPowerSequencesSolved,
  } = useGame();

  const [isHeroGuideOpen, setIsHeroGuideOpen] = useState(false);
  const [isOrganizerOpen, setIsOrganizerOpen] = useState(false);

  // Time format mm:ss
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Timer warning states
  const isCriticalTime = remainingSeconds <= 60 && gameState.isTimerRunning;
  const isWarningTime = remainingSeconds <= 300 && remainingSeconds > 60 && gameState.isTimerRunning;

  // Solved counts
  const solvedFilesCount = currentSet.heroFiles.filter(
    f => gameState.heroFilesProgress[f.id]?.isDecoded
  ).length;

  const solvedPSCount = currentSet.powerSequences.filter(
    ps => gameState.powerSequencesProgress[ps.id]?.verified
  ).length;

  const showGameNav = gameState.screen !== 'landing' && gameState.screen !== 'setup';

  return (
    <div className="min-h-screen flex flex-col bg-doom-950 text-neutral-100 relative font-sans">
      {/* Scanline overlay */}
      <div className="fixed inset-0 scanline-overlay z-40 pointer-events-none opacity-40" />

      {/* Persistent Navigation Header */}
      <header className="sticky top-0 z-30 border-b border-doom-emerald/20 bg-doom-950/90 backdrop-blur-md px-3 sm:px-6 py-2.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Title */}
          <button
            onClick={() => {
              if (showGameNav) goToScreen('dashboard');
            }}
            className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none"
          >
            <div className="relative p-1.5 sm:p-2 rounded-lg bg-doom-emerald/10 border border-doom-emerald/30 group-hover:border-doom-emerald/60 transition-colors shadow-emerald-glow">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-doom-neon" />
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-doom-neon animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-black font-display tracking-widest text-white uppercase">
                  The Sorcerer’s Cipher
                </span>
                {showGameNav && (
                  <span className="px-1.5 py-0.2 rounded bg-doom-emerald/20 border border-doom-emerald/40 text-[10px] font-mono font-bold text-doom-neon">
                    SET {gameState.selectedSet}
                  </span>
                )}
              </div>
              <p className="text-[10px] font-mono text-neutral-400 tracking-wider">
                DOOM’S HERO ARCHIVE
              </p>
            </div>
          </button>

          {/* Center: Live Stats (when in game) */}
          {showGameNav && (
            <div className="hidden lg:flex items-center gap-5 text-xs font-mono">
              {/* Team */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-doom-850/80 border border-neutral-800">
                <Terminal className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-neutral-400">Team:</span>
                <span className="font-semibold text-neutral-200 truncate max-w-[120px]">
                  {gameState.teamName || 'Strike Team'}
                </span>
              </div>

              {/* Files Progress */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-doom-850/80 border border-neutral-800">
                <span className="text-neutral-400">Files:</span>
                <span
                  className={`font-bold ${
                    isAllHeroFilesDecoded ? 'text-doom-neon' : 'text-neutral-200'
                  }`}
                >
                  {solvedFilesCount}/7
                </span>
              </div>

              {/* Power Sequences */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-doom-850/80 border border-neutral-800">
                <span className="text-neutral-400">Power Seq:</span>
                <span
                  className={`font-bold ${
                    isAllPowerSequencesSolved ? 'text-doom-neon' : 'text-neutral-200'
                  }`}
                >
                  {solvedPSCount}/4
                </span>
              </div>

              {/* Doom Lock */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-doom-850/80 border border-neutral-800">
                <span className="text-neutral-400">Lock:</span>
                {gameState.doomLockProgress.verified ? (
                  <span className="font-bold text-doom-neon flex items-center gap-1">
                    <Unlock className="w-3.5 h-3.5" /> DECRYPTED
                  </span>
                ) : (
                  <span className="text-neutral-400 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> LOCKED
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Right: Score, Timer & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {showGameNav && (
              <>
                {/* Score badge */}
                <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-doom-850 border border-doom-gold/30 shadow-gold-glow">
                  <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-doom-gold" />
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-xs sm:text-sm font-black font-mono text-doom-gold">
                      {gameState.totalScore}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">/100</span>
                  </div>
                </div>

                {/* Timer badge */}
                <div
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg border font-mono transition-all ${
                    isCriticalTime
                      ? 'bg-doom-red/20 border-doom-red text-doom-red animate-pulse shadow-red-glow'
                      : isWarningTime
                      ? 'bg-amber-950/40 border-amber-500/50 text-amber-400'
                      : 'bg-doom-850 border-neutral-700 text-doom-neon'
                  }`}
                >
                  {isCriticalTime ? (
                    <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
                  ) : (
                    <Clock className="w-3.5 h-3.5" />
                  )}
                  <span className="text-xs sm:text-sm font-bold tracking-wider">
                    {timeFormatted}
                  </span>
                </div>
              </>
            )}

            {/* Dossier (Hero Guide) button */}
            <button
              onClick={() => setIsHeroGuideOpen(true)}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-doom-800 hover:bg-doom-750 border border-neutral-700 hover:border-doom-emerald/50 text-neutral-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all"
              title="Hero Dossier & Guide"
            >
              <BookOpen className="w-3.5 h-3.5 text-doom-neon" />
              <span className="hidden sm:inline">Hero Guide</span>
            </button>

            {/* Organizer Console button */}
            <button
              onClick={() => setIsOrganizerOpen(true)}
              className="p-1.5 rounded-lg bg-doom-900 hover:bg-doom-850 border border-neutral-800 hover:border-doom-gold/40 text-neutral-400 hover:text-doom-gold transition-colors"
              title="Organizer Console"
              aria-label="Organizer Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 flex flex-col">{children}</main>

      {/* Modals */}
      <HeroGuideModal isOpen={isHeroGuideOpen} onClose={() => setIsHeroGuideOpen(false)} />
      <OrganizerModal isOpen={isOrganizerOpen} onClose={() => setIsOrganizerOpen(false)} />
    </div>
  );
};
