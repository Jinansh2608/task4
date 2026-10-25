import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { QUESTION_SETS } from '../data/questionBank';
import { deriveDoomLockCode } from '../engine/doomLock';
import { formatValue } from '../engine/answerParser';
import { ShieldAlert, KeyRound, RefreshCw, X, Check, Lock, Unlock, Eye, Sparkles } from 'lucide-react';
import { SetId } from '../types/game';

interface OrganizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ORGANIZER_PIN = 'DOOM2026';

export const OrganizerModal: React.FC<OrganizerModalProps> = ({ isOpen, onClose }) => {
  const { gameState, resetGame, goToScreen, startNewGame } = useGame();
  const [pinInput, setPinInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedSetView, setSelectedSetView] = useState<SetId>(gameState.selectedSet || 'A');
  const [confirmReset, setConfirmReset] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === ORGANIZER_PIN) {
      setIsUnlocked(true);
      setErrorMessage('');
    } else {
      setErrorMessage('Access Denied. Invalid Authorization Code.');
    }
  };

  const handleReset = () => {
    resetGame();
    setConfirmReset(false);
    onClose();
  };

  const targetSet = QUESTION_SETS[selectedSetView];
  const doomLockCode = deriveDoomLockCode(targetSet.powerSequences);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl border border-doom-gold/40 bg-doom-900 shadow-gold-glow overflow-hidden text-neutral-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-doom-800 bg-doom-950/80">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-doom-gold/10 border border-doom-gold/30">
                  <ShieldAlert className="w-5 h-5 text-doom-gold" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display uppercase tracking-wider text-doom-gold">
                    Organizer Command Protocol
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono">
                    Restricted access • Event coordinator console
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {!isUnlocked ? (
                <form onSubmit={handleUnlock} className="max-w-md mx-auto py-8 text-center space-y-4">
                  <div className="inline-flex p-3 rounded-full bg-neutral-800/60 border border-neutral-700 text-neutral-300">
                    <Lock className="w-6 h-6 text-doom-gold" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-base text-neutral-100">
                      Authorization Required
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1">
                      Enter the organizer clearance key to inspect master answer keys or reset telemetry.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="password"
                      placeholder="Enter Organizer PIN..."
                      value={pinInput}
                      onChange={e => setPinInput(e.target.value)}
                      className="w-full px-4 py-2 text-center rounded-lg bg-doom-850 border border-neutral-700 text-sm font-mono tracking-widest text-neutral-100 focus:outline-none focus:border-doom-gold/60"
                      autoFocus
                    />
                    {errorMessage && (
                      <p className="text-xs text-doom-red font-mono">{errorMessage}</p>
                    )}
                  </div>
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-2 rounded-lg bg-doom-gold/20 hover:bg-doom-gold/30 border border-doom-gold/50 text-doom-gold font-mono text-sm font-semibold transition-all shadow-gold-glow"
                    >
                      Verify Clearance
                    </button>
                    <p className="text-[11px] text-neutral-500 font-mono mt-2">
                      Organizer key: DOOM2026
                    </p>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  {/* Status & Actions */}
                  <div className="p-4 rounded-lg bg-doom-850/80 border border-neutral-800 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="text-xs text-neutral-400 font-mono">Current Session</div>
                      <div className="text-sm font-bold font-mono text-doom-neon">
                        Team: {gameState.teamName || 'None'} | Set: {gameState.selectedSet} | Score: {gameState.totalScore}/100
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!confirmReset ? (
                        <button
                          onClick={() => setConfirmReset(true)}
                          className="px-3 py-1.5 rounded bg-doom-red/20 hover:bg-doom-red/30 border border-doom-red/50 text-doom-red text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          Reset Game
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-doom-red font-mono">Confirm?</span>
                          <button
                            onClick={handleReset}
                            className="px-2.5 py-1 rounded bg-doom-red hover:bg-red-600 text-white text-xs font-mono font-bold"
                          >
                            Yes, Reset
                          </button>
                          <button
                            onClick={() => setConfirmReset(false)}
                            className="px-2.5 py-1 rounded bg-neutral-800 text-neutral-300 text-xs font-mono"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Set Selector for Answer Key */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-bold uppercase tracking-wider font-display text-neutral-200">
                        Classified Master Answer Key
                      </h4>
                      <div className="flex gap-1">
                        {(['A', 'B', 'C', 'D'] as SetId[]).map(s => (
                          <button
                            key={s}
                            onClick={() => setSelectedSetView(s)}
                            className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                              selectedSetView === s
                                ? 'bg-doom-gold text-doom-950 shadow-gold-glow'
                                : 'bg-doom-800 text-neutral-400 hover:text-white'
                            }`}
                          >
                            Set {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Answer Key Display */}
                    <div className="space-y-4">
                      {/* Hero Files Key */}
                      <div className="border border-neutral-800 rounded-lg overflow-hidden">
                        <div className="bg-doom-950/80 px-4 py-2 border-b border-neutral-800 text-xs font-mono font-semibold text-doom-emerald flex justify-between">
                          <span>Set {selectedSetView} Hero Files (7 Files + 1 Decoy: {targetSet.decoyHero})</span>
                          <span>Points: 50 max</span>
                        </div>
                        <div className="divide-y divide-neutral-800/80 bg-doom-850/40 text-xs font-mono">
                          {targetSet.heroFiles.map(file => (
                            <div key={file.id} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <span className="text-doom-gold font-bold mr-2">File 0{file.fileNumber}:</span>
                                <span className="text-white font-semibold">{file.heroIdentity}</span>
                                <span className="text-neutral-500 ml-2">({file.difficulty})</span>
                                <div className="text-[11px] text-neutral-400 mt-0.5">{file.ruleExplanation}</div>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-neutral-500 text-[11px]">Test Answer: </span>
                                <span className="text-doom-neon font-bold">{formatValue(file.expectedOutput)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Power Sequences Key */}
                      <div className="border border-neutral-800 rounded-lg overflow-hidden">
                        <div className="bg-doom-950/80 px-4 py-2 border-b border-neutral-800 text-xs font-mono font-semibold text-doom-emerald flex justify-between">
                          <span>Power Sequences (4 Challenges)</span>
                          <span>Points: 40 max</span>
                        </div>
                        <div className="divide-y divide-neutral-800/80 bg-doom-850/40 text-xs font-mono">
                          {targetSet.powerSequences.map(ps => (
                            <div key={ps.id} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div>
                                <span className="text-doom-gold font-bold mr-2">Q{ps.questionNumber}:</span>
                                <span className="text-neutral-200">{ps.hero1} → {ps.hero2}</span>
                                <div className="text-[11px] text-neutral-400 mt-0.5">{ps.explanation}</div>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-neutral-500 text-[11px]">Output: </span>
                                <span className="text-doom-neon font-bold">{formatValue(ps.expectedOutput)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Doom Lock Key */}
                      <div className="p-4 rounded-lg bg-doom-950/90 border border-doom-gold/40 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-mono text-neutral-400">Doom Lock 4-Digit Master Code</div>
                          <div className="text-xs text-neutral-500 font-mono mt-0.5">
                            Rule: Last digit of largest number in each PS (Q1..Q4)
                          </div>
                        </div>
                        <div className="text-2xl font-mono font-black text-doom-gold tracking-widest px-4 py-1.5 rounded bg-doom-900 border border-doom-gold/30">
                          {doomLockCode}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-doom-800 bg-doom-950/80 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded bg-doom-800 hover:bg-doom-750 text-neutral-200 text-xs font-mono"
              >
                Close Console
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
