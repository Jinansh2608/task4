import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGame } from '../context/GameContext';
import {
  Shield,
  Award,
  Sparkles,
  RotateCcw,
  Home,
  LayoutDashboard,
  CheckCircle2,
  Clock,
  Layers,
  Cpu,
} from 'lucide-react';

export const VictoryScreen: React.FC = () => {
  const { gameState, resetGame, goToScreen, remainingSeconds, currentSet } = useGame();
  const [confirmRestart, setConfirmRestart] = useState(false);

  // Trigger celebration confetti
  useEffect(() => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#d4af37', '#ffffff'],
      });
    } catch {
      // confetti fallback
    }
  }, []);

  const totalDuration = gameState.durationSeconds || 1200;
  const timeTakenSeconds = Math.max(0, totalDuration - remainingSeconds);
  const takenMins = Math.floor(timeTakenSeconds / 60);
  const takenSecs = timeTakenSeconds % 60;
  const formattedTimeTaken = `${takenMins}m ${takenSecs.toString().padStart(2, '0')}s`;

  return (
    <div className="flex-1 px-4 sm:px-6 py-8 md:py-14 max-w-4xl mx-auto w-full flex flex-col justify-center items-center space-y-8 relative">
      {/* Ambient background victory glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-doom-emerald/15 rounded-full blur-[150px] pointer-events-none" />

      {/* Main Victory Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full bg-gradient-to-br from-doom-900 via-doom-850 to-doom-950 border-2 border-doom-emerald/50 rounded-3xl p-6 sm:p-10 shadow-emerald-glow-lg text-center space-y-8 relative overflow-hidden z-10"
      >
        {/* Doom Trophy Emblem */}
        <div className="relative inline-block">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-doom-850 border border-doom-gold/50 flex items-center justify-center shadow-gold-glow">
            <Award className="w-10 h-10 sm:w-12 sm:h-12 text-doom-gold" />
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-doom-emerald/20 border border-doom-emerald text-[10px] font-mono text-doom-neon font-bold whitespace-nowrap">
            CIPHER SOLVED
          </div>
        </div>

        {/* Victory Inscriptions (Exact Required Text) */}
        <div className="space-y-2">
          <div className="text-xs sm:text-sm font-mono font-bold tracking-widest text-doom-gold uppercase">
            DOOM LOCK DECRYPTED • HERO SIGNATURES VERIFIED
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-display uppercase tracking-tight text-white">
            POWER SEQUENCE COMPLETE
          </h1>
          <p className="text-base sm:text-xl font-mono text-doom-neon tracking-wide pt-1">
            THE PATTERN ROOM IS NOW UNLOCKED.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto pt-2">
          <div className="p-4 rounded-xl bg-doom-950/80 border border-neutral-800">
            <span className="text-[10px] font-mono text-neutral-400 uppercase">Team Name</span>
            <div className="text-base font-bold font-display text-white truncate mt-1">
              {gameState.teamName || 'Strike Team'}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-doom-950/80 border border-neutral-800">
            <span className="text-[10px] font-mono text-neutral-400 uppercase">Archive Set</span>
            <div className="text-base font-bold font-mono text-doom-neon mt-1">
              SET {gameState.selectedSet}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-doom-950/80 border border-neutral-800">
            <span className="text-[10px] font-mono text-neutral-400 uppercase">Total Score</span>
            <div className="text-2xl font-black font-mono text-doom-gold mt-0.5">
              {gameState.totalScore}
              <span className="text-xs font-normal text-neutral-500">/100</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-doom-950/80 border border-neutral-800">
            <span className="text-[10px] font-mono text-neutral-400 uppercase">Completion Time</span>
            <div className="text-base font-bold font-mono text-white mt-1">
              {formattedTimeTaken}
            </div>
          </div>
        </div>

        {/* Progress Breakdown */}
        <div className="p-4 rounded-xl bg-doom-950/60 border border-neutral-800/80 flex flex-wrap items-center justify-around gap-4 text-xs font-mono text-neutral-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-doom-neon" />
            <span>7/7 Hero Files Decoded (50 pts)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-doom-neon" />
            <span>4/4 Power Sequences Solved (40 pts)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-doom-gold" />
            <span>Doom Lock Decrypted (10 pts)</span>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={() => goToScreen('dashboard')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-doom-800 hover:bg-doom-750 border border-neutral-700 text-neutral-200 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </button>

          <button
            onClick={() => goToScreen('landing')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-doom-800 hover:bg-doom-750 border border-neutral-700 text-neutral-200 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return to Landing Page</span>
          </button>

          {!confirmRestart ? (
            <button
              onClick={() => setConfirmRestart(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-doom-red/20 hover:bg-doom-red/30 border border-doom-red/40 text-red-300 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restart Game</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-doom-950 border border-doom-red/60">
              <span className="text-xs font-mono text-doom-red font-semibold pl-2">Reset score?</span>
              <button
                onClick={() => {
                  resetGame();
                  setConfirmRestart(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-doom-red text-white text-xs font-mono font-bold"
              >
                Yes, Restart
              </button>
              <button
                onClick={() => setConfirmRestart(false)}
                className="px-2.5 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 text-xs font-mono"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
