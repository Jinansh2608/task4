import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import {
  Clock,
  Award,
  AlertTriangle,
  RotateCcw,
  LayoutDashboard,
  Home,
  Shield,
  Layers,
  Cpu,
} from 'lucide-react';

export const TimeExpiredScreen: React.FC = () => {
  const { gameState, resetGame, goToScreen, currentSet } = useGame();
  const [confirmRestart, setConfirmRestart] = useState(false);

  const solvedFilesCount = currentSet.heroFiles.filter(
    f => gameState.heroFilesProgress[f.id]?.isDecoded
  ).length;

  const solvedPSCount = currentSet.powerSequences.filter(
    ps => gameState.powerSequencesProgress[ps.id]?.verified
  ).length;

  return (
    <div className="flex-1 px-4 sm:px-6 py-10 max-w-3xl mx-auto w-full flex flex-col justify-center items-center space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full bg-doom-900/90 border-2 border-doom-red/50 rounded-2xl p-6 sm:p-10 shadow-red-glow text-center space-y-6"
      >
        {/* Warning Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-doom-red/10 border border-doom-red/40 flex items-center justify-center text-doom-red">
          <Clock className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-mono font-bold tracking-widest text-doom-red uppercase">
            CHRONOMETER DEPLETED • 20 MINUTES ELAPSED
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display uppercase tracking-tight text-white">
            ARCHIVE LOCKDOWN INITIATED
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 font-sans max-w-md mx-auto">
            The security window has closed. All submissions have concluded. Your score and solved signatures have been permanently logged.
          </p>
        </div>

        {/* Results Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto pt-2">
          <div className="p-4 rounded-xl bg-doom-950 border border-neutral-800">
            <span className="text-[10px] font-mono text-neutral-400 uppercase">Team Name</span>
            <div className="text-sm font-bold font-display text-white truncate mt-1">
              {gameState.teamName}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-doom-950 border border-neutral-800">
            <span className="text-[10px] font-mono text-neutral-400 uppercase">Archive Set</span>
            <div className="text-sm font-bold font-mono text-doom-neon mt-1">
              SET {gameState.selectedSet}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-doom-950 border border-neutral-800 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-mono text-neutral-400 uppercase">Final Score</span>
            <div className="text-xl font-black font-mono text-doom-gold mt-1">
              {gameState.totalScore}
              <span className="text-xs font-normal text-neutral-500">/100</span>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-doom-950/60 border border-neutral-800 text-xs font-mono text-neutral-400 flex justify-center gap-6">
          <span>Hero Files: <strong className="text-white">{solvedFilesCount}/7</strong></span>
          <span>Power Sequences: <strong className="text-white">{solvedPSCount}/4</strong></span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-neutral-800">
          <button
            onClick={() => goToScreen('dashboard')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-doom-850 hover:bg-doom-800 border border-neutral-700 text-neutral-200 text-xs font-mono font-bold flex items-center justify-center gap-2"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Review Solved Archive</span>
          </button>

          {!confirmRestart ? (
            <button
              onClick={() => setConfirmRestart(true)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-doom-red/20 hover:bg-doom-red/30 border border-doom-red/50 text-red-300 text-xs font-mono font-bold flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restart Protocol</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 p-1 rounded-lg bg-doom-950 border border-doom-red/60">
              <span className="text-xs font-mono text-doom-red pl-2">Confirm restart?</span>
              <button
                onClick={() => {
                  resetGame();
                  setConfirmRestart(false);
                }}
                className="px-2.5 py-1 rounded bg-doom-red text-white text-xs font-mono font-bold"
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmRestart(false)}
                className="px-2 py-1 rounded bg-neutral-800 text-neutral-300 text-xs font-mono"
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
