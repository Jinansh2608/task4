import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { SetId } from '../types/game';
import { Shield, Users, Layers, Play, RefreshCw, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const GameSetup: React.FC = () => {
  const { startNewGame, resetGame, goToScreen, gameState } = useGame();
  const [teamName, setTeamName] = useState(gameState.teamName || '');
  const [selectedSet, setSelectedSet] = useState<SetId>(gameState.selectedSet || 'A');
  const [confirmReset, setConfirmReset] = useState(false);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    startNewGame(teamName, selectedSet);
  };

  const setsInfo: Record<SetId, { label: string; heroPool: string; desc: string }> = {
    A: {
      label: 'Set A — Primary Cipher',
      heroPool: 'Loki, Spider-Man, Hawkeye, Thanos, Iron Man, Doctor Strange, Black Widow',
      desc: 'Balanced sequences featuring pair misdirections, target optimization, and position multipliers.',
    },
    B: {
      label: 'Set B — Kinetic Cipher',
      heroPool: 'Thor, Ant-Man, Captain America, Black Panther, Scarlet Witch, Doctor Strange, Vision',
      desc: 'Dynamic combinations with force addition, shrinking scalers, rotational grids, and neighbor products.',
    },
    C: {
      label: 'Set C — Quantum Cipher',
      heroPool: 'Loki, Hulk, Spider-Man, Hawkeye, Thanos, Iron Man, Doctor Strange',
      desc: 'Complex conditional transformations, gamma squaring, multiples filtering, and row boundary mirrors.',
    },
    D: {
      label: 'Set D — Cosmic Cipher',
      heroPool: 'Ant-Man, Thor, Black Widow, Captain Marvel, Vision, Scarlet Witch, Black Panther',
      desc: 'Intricate digital compressions, cosmic amplification boosts, and synthetic pair fusions.',
    },
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-8 md:py-12 relative">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-doom-900/90 border border-doom-emerald/30 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-doom-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-doom-emerald/10 border border-doom-emerald/30">
              <Shield className="w-6 h-6 text-doom-neon" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display uppercase tracking-wider text-white">
                Archive Protocol Setup
              </h2>
              <p className="text-xs text-neutral-400 font-mono">
                Configure your team and select a question archive set
              </p>
            </div>
          </div>
          <button
            onClick={() => goToScreen('landing')}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 text-xs font-mono flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
        </div>

        <form onSubmit={handleStart} className="space-y-6">
          {/* Team Name Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-300">
              <Users className="w-4 h-4 text-doom-neon" />
              <span>Strike Team Designation</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Latverian Decoders / Team Stark"
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-doom-850 border border-neutral-700/80 text-white placeholder-neutral-500 font-sans text-sm focus:outline-none focus:border-doom-emerald/60 focus:ring-2 focus:ring-doom-emerald/20 transition-all"
            />
          </div>

          {/* Question Set Selection */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-300">
              <Layers className="w-4 h-4 text-doom-gold" />
              <span>Select Question Set</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(['A', 'B', 'C', 'D'] as SetId[]).map(setId => {
                const info = setsInfo[setId];
                const isSelected = selectedSet === setId;

                return (
                  <button
                    key={setId}
                    type="button"
                    onClick={() => setSelectedSet(setId)}
                    className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                      isSelected
                        ? 'bg-doom-emerald/15 border-doom-emerald shadow-emerald-glow'
                        : 'bg-doom-850/60 border-neutral-800 hover:border-neutral-700 hover:bg-doom-800/40'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 className="w-4 h-4 text-doom-neon" />
                      </div>
                    )}
                    <div className="flex items-baseline gap-2 mb-1">
                      <span
                        className={`text-base font-bold font-mono ${
                          isSelected ? 'text-doom-neon' : 'text-neutral-200'
                        }`}
                      >
                        SET {setId}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                      {info.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Set Summary Banner */}
          <div className="p-3.5 rounded-lg bg-doom-950/70 border border-neutral-800 text-xs font-mono space-y-1">
            <div className="text-doom-neon font-semibold flex items-center gap-1.5">
              <span>Selected Archive: Set {selectedSet}</span>
              <span className="text-neutral-500">•</span>
              <span className="text-neutral-400 font-normal">7 Files • 4 Power Sequences • 1 Lock</span>
            </div>
            <div className="text-neutral-400 text-[11px] truncate">
              Hero Roster: {setsInfo[selectedSet].heroPool}
            </div>
          </div>

          {/* Launch Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-doom-emerald to-emerald-600 hover:from-doom-neon hover:to-emerald-500 text-doom-950 font-display text-lg font-bold uppercase tracking-wider shadow-emerald-glow hover:shadow-emerald-glow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>START 20-MINUTE CIPHER</span>
            </button>
          </div>
        </form>

        {/* Optional Organizer Reset Area */}
        <div className="border-t border-doom-800/80 pt-4 flex items-center justify-between text-xs text-neutral-500 font-mono">
          <span>Organizer session control:</span>
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="text-neutral-400 hover:text-doom-red flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset State</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-doom-red">Erase progress?</span>
              <button
                type="button"
                onClick={() => {
                  resetGame();
                  setConfirmReset(false);
                }}
                className="px-2 py-0.5 rounded bg-doom-red text-white text-[11px] font-bold"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 text-[11px]"
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
