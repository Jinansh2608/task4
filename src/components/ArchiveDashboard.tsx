import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { HeroFileCard } from './HeroFileCard';
import {
  Shield,
  Layers,
  Cpu,
  Lock,
  Unlock,
  ArrowRight,
  Sparkles,
  Award,
  CheckCircle2,
  Clock,
  KeyRound,
} from 'lucide-react';

export const ArchiveDashboard: React.FC = () => {
  const {
    gameState,
    currentSet,
    openHeroFile,
    goToScreen,
    remainingSeconds,
    isAllHeroFilesDecoded,
    isAllPowerSequencesSolved,
  } = useGame();

  const solvedFilesCount = currentSet.heroFiles.filter(
    f => gameState.heroFilesProgress[f.id]?.isDecoded
  ).length;

  const solvedPSCount = currentSet.powerSequences.filter(
    ps => gameState.powerSequencesProgress[ps.id]?.verified
  ).length;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="flex-1 px-4 sm:px-6 py-6 max-w-7xl mx-auto w-full space-y-8">
      {/* Top Hero Banner & Mission Directives */}
      <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-doom-900 via-doom-850 to-doom-900 border border-doom-emerald/30 shadow-2xl overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-doom-emerald/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-doom-emerald/20 border border-doom-emerald/40 text-xs font-mono font-bold text-doom-neon uppercase tracking-wider">
                SET {gameState.selectedSet} ARCHIVE DECK
              </span>
              <span className="text-xs font-mono text-neutral-400">
                Team: <strong className="text-white">{gameState.teamName}</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display uppercase tracking-tight text-white">
              Latverian Mathematical Vault
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 font-sans max-w-2xl leading-relaxed">
              Seven heroes are sealed within mathematical transformation matrices.
              Decode each hero's signature pattern, test predictions against Doom's system, and unlock the final lock.
            </p>
          </div>

          {/* Quick Stats Panel */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
            <div className="p-3 rounded-xl bg-doom-950/80 border border-neutral-800 text-center">
              <div className="text-[10px] font-mono text-neutral-400 uppercase">Score</div>
              <div className="text-xl sm:text-2xl font-black font-mono text-doom-gold">
                {gameState.totalScore}
                <span className="text-xs font-normal text-neutral-500">/100</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-doom-950/80 border border-neutral-800 text-center">
              <div className="text-[10px] font-mono text-neutral-400 uppercase">Hero Files</div>
              <div className="text-xl sm:text-2xl font-black font-mono text-doom-neon">
                {solvedFilesCount}
                <span className="text-xs font-normal text-neutral-500">/7</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-doom-950/80 border border-neutral-800 text-center">
              <div className="text-[10px] font-mono text-neutral-400 uppercase">Sequences</div>
              <div className="text-xl sm:text-2xl font-black font-mono text-neutral-200">
                {solvedPSCount}
                <span className="text-xs font-normal text-neutral-500">/4</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-doom-950/80 border border-neutral-800 text-center">
              <div className="text-[10px] font-mono text-neutral-400 uppercase">Time Left</div>
              <div className="text-xl sm:text-2xl font-black font-mono text-white">
                {timeFormatted}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 pt-4 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center gap-3">
          <div className="w-full bg-doom-950 rounded-full h-2 overflow-hidden border border-neutral-800">
            <div
              className="bg-gradient-to-r from-doom-emerald to-doom-neon h-2 rounded-full transition-all duration-500"
              style={{ width: `${gameState.totalScore}%` }}
            />
          </div>
          <div className="text-[11px] font-mono text-neutral-400 whitespace-nowrap">
            Archive Completion: <strong className="text-white">{gameState.totalScore}%</strong>
          </div>
        </div>
      </div>

      {/* Hero Files Section (7 Cards) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-doom-neon" />
            <h2 className="text-lg sm:text-xl font-bold font-display uppercase tracking-wider text-white">
              Hero Files Directory
            </h2>
          </div>
          <span className="text-xs font-mono text-neutral-400">
            Files 01–04: Easy (5 pts) • Files 05–07: Medium (10 pts)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {currentSet.heroFiles.map((file, idx) => (
            <HeroFileCard
              key={file.id}
              file={file}
              progress={gameState.heroFilesProgress[file.id]}
              onOpen={openHeroFile}
              index={idx}
            />
          ))}
        </div>
      </div>

      {/* Phase 2: Power Sequences & Phase 3: Doom Lock Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Power Sequences Card */}
        <div
          className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
            isAllHeroFilesDecoded
              ? 'bg-doom-900/90 border-doom-emerald/50 shadow-emerald-glow'
              : 'bg-doom-950/60 border-neutral-800/80 opacity-75'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-lg border ${
                    isAllHeroFilesDecoded
                      ? 'bg-doom-emerald/15 border-doom-emerald/40 text-doom-neon'
                      : 'bg-neutral-800 border-neutral-700 text-neutral-500'
                  }`}
                >
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold font-display text-lg uppercase text-white tracking-wide">
                    Phase 2: Power Sequences
                  </h3>
                  <span className="text-xs font-mono text-neutral-400">
                    4 Chained Transformations • 40 Points Max
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-doom-gold">
                {solvedPSCount}/4 Complete
              </span>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed font-sans">
              Chain two hero rules sequentially: the output of the first rule feeds directly into the second rule. Solve all four to reveal the Doom Lock digits.
            </p>
          </div>

          <div className="pt-6">
            {isAllHeroFilesDecoded ? (
              <button
                onClick={() => goToScreen('powerSequence')}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-doom-emerald to-emerald-600 hover:from-doom-neon hover:to-emerald-500 text-doom-950 font-display font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-emerald-glow transition-all cursor-pointer"
              >
                <span>{isAllPowerSequencesSolved ? 'Review Power Sequences' : 'Enter Power Sequences'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-doom-950 border border-neutral-800 text-neutral-500 text-xs font-mono">
                <Lock className="w-4 h-4" />
                <span>Decode all 7 Hero Files to Unlock Phase 2 ({solvedFilesCount}/7 solved)</span>
              </div>
            )}
          </div>
        </div>

        {/* Doom Lock Card */}
        <div
          className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
            isAllPowerSequencesSolved
              ? 'bg-doom-900/90 border-doom-gold/50 shadow-gold-glow'
              : 'bg-doom-950/60 border-neutral-800/80 opacity-75'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`p-2 rounded-lg border ${
                    isAllPowerSequencesSolved
                      ? 'bg-doom-gold/15 border-doom-gold/40 text-doom-gold'
                      : 'bg-neutral-800 border-neutral-700 text-neutral-500'
                  }`}
                >
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold font-display text-lg uppercase text-white tracking-wide">
                    Phase 3: The Doom Lock
                  </h3>
                  <span className="text-xs font-mono text-neutral-400">
                    4-Digit Master Cipher • 10 Points
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-doom-neon">
                {gameState.doomLockProgress.verified ? 'DECRYPTED' : 'LOCKED'}
              </span>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed font-sans">
              Extract the required digits from your Power Sequence outputs according to the extraction rule. Decrypt the master cipher to unlock the Pattern Room.
            </p>
          </div>

          <div className="pt-6">
            {isAllPowerSequencesSolved ? (
              <button
                onClick={() => goToScreen('doomLock')}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-doom-gold to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-doom-950 font-display font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-gold-glow transition-all cursor-pointer"
              >
                <span>{gameState.doomLockProgress.verified ? 'Inspect Decrypted Lock' : 'Decrypt Doom Lock'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-doom-950 border border-neutral-800 text-neutral-500 text-xs font-mono">
                <Lock className="w-4 h-4" />
                <span>Complete all 4 Power Sequences to Unlock Lock ({solvedPSCount}/4 completed)</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
