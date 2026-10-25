import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { SequenceDisplay } from './common/SequenceDisplay';
import { formatValue, isMatrix } from '../engine/answerParser';
import {
  ArrowLeft,
  ArrowRight,
  Cpu,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  KeyRound,
  Shield,
  Send,
  BookOpen,
} from 'lucide-react';

export const PowerSequence: React.FC = () => {
  const {
    gameState,
    currentSet,
    goToScreen,
    submitPowerSequence,
    isAllPowerSequencesSolved,
  } = useGame();

  const [activeTab, setActiveTab] = useState<number>(0); // 0 to 3 for Q1 to Q4
  const [userInputs, setUserInputs] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    currentSet.powerSequences.forEach(ps => {
      init[ps.id] = gameState.powerSequencesProgress[ps.id]?.userAnswerInput || '';
    });
    return init;
  });

  const [feedbacks, setFeedbacks] = useState<
    Record<string, { type: 'success' | 'error' | null; message: string }>
  >({});

  const [showRuleModal, setShowRuleModal] = useState<string | null>(null);

  const activePS = currentSet.powerSequences[activeTab] || currentSet.powerSequences[0];
  const activeProgress = gameState.powerSequencesProgress[activePS.id];
  const isCurrentSolved = activeProgress?.verified || false;

  const handleInputChange = (sequenceId: string, val: string) => {
    setUserInputs(prev => ({ ...prev, [sequenceId]: val }));
    setFeedbacks(prev => ({ ...prev, [sequenceId]: { type: null, message: '' } }));
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const inputVal = userInputs[activePS.id] || '';
    if (!inputVal.trim()) return;

    const res = submitPowerSequence(activePS.id, inputVal);
    if (res.success) {
      setFeedbacks(prev => ({
        ...prev,
        [activePS.id]: { type: 'success', message: res.message },
      }));
    } else {
      setFeedbacks(prev => ({
        ...prev,
        [activePS.id]: { type: 'error', message: res.message },
      }));
    }
  };

  // Find corresponding hero file rules for reference
  const hero1File = currentSet.heroFiles.find(
    f => f.heroIdentity.toLowerCase() === activePS.hero1.toLowerCase()
  );
  const hero2File = currentSet.heroFiles.find(
    f => f.heroIdentity.toLowerCase() === activePS.hero2.toLowerCase()
  );

  const totalSolved = currentSet.powerSequences.filter(
    ps => gameState.powerSequencesProgress[ps.id]?.verified
  ).length;

  return (
    <div className="flex-1 px-4 sm:px-6 py-6 max-w-5xl mx-auto w-full space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between border-b border-doom-800 pb-4">
        <button
          onClick={() => goToScreen('dashboard')}
          className="flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Archive Dashboard</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <span>Chained Sequences:</span>
          <strong className="text-doom-neon">{totalSolved}/4 Verified</strong>
        </div>
      </div>

      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-doom-900 via-doom-850 to-doom-900 border border-doom-emerald/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-doom-emerald/20 border border-doom-emerald/40 text-xs font-mono font-bold text-doom-neon uppercase">
              Phase 2 • Sequential Transformation
            </span>
            <span className="text-xs font-mono text-neutral-400">
              10 Points Each • 40 Max
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display uppercase tracking-wide text-white">
            Power Sequence Matrix
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 font-sans max-w-xl">
            Pass the initial input through <span className="text-doom-neon font-semibold">{activePS.hero1}</span>'s rule,
            then take that intermediate output and pass it through <span className="text-doom-gold font-semibold">{activePS.hero2}</span>'s rule.
          </p>
        </div>

        {/* Proceed to Doom Lock button if all solved */}
        {isAllPowerSequencesSolved && (
          <button
            onClick={() => goToScreen('doomLock')}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-doom-gold to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-doom-950 font-display font-bold uppercase tracking-wider text-xs shadow-gold-glow flex items-center gap-2 shrink-0 cursor-pointer transition-all"
          >
            <span>Proceed to Doom Lock</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Tabs for Q1, Q2, Q3, Q4 */}
      <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1">
        {currentSet.powerSequences.map((ps, idx) => {
          const isSolved = gameState.powerSequencesProgress[ps.id]?.verified;
          const isActive = activeTab === idx;

          return (
            <button
              key={ps.id}
              onClick={() => setActiveTab(idx)}
              className={`px-4 py-2.5 rounded-xl border text-xs font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-doom-emerald/20 border-doom-emerald text-doom-neon shadow-emerald-glow'
                  : isSolved
                  ? 'bg-doom-850/80 border-neutral-700 text-neutral-200'
                  : 'bg-doom-900/60 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <span>Q{ps.questionNumber}.</span>
              <span>{ps.hero1} → {ps.hero2}</span>
              {isSolved && <CheckCircle2 className="w-3.5 h-3.5 text-doom-neon" />}
            </button>
          );
        })}
      </div>

      {/* Active Challenge Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-doom-900/90 border border-neutral-800 space-y-6">
        {/* Sequence Title & Chain diagram */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-doom-emerald/10 border border-doom-emerald/30 text-doom-neon">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-doom-gold">
                CHALLENGE 0{activePS.questionNumber}
              </div>
              <h3 className="text-xl font-bold font-display uppercase tracking-wider text-white">
                {activePS.hero1} <span className="text-doom-neon">➔</span> {activePS.hero2}
              </h3>
            </div>
          </div>

          {/* Reference buttons for heroes */}
          <div className="flex items-center gap-2">
            {hero1File && (
              <button
                onClick={() => setShowRuleModal(hero1File.heroIdentity)}
                className="px-3 py-1.5 rounded-lg bg-doom-850 hover:bg-doom-800 border border-neutral-700 text-neutral-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5 text-doom-neon" />
                <span>{activePS.hero1} Rule</span>
              </button>
            )}
            {hero2File && (
              <button
                onClick={() => setShowRuleModal(hero2File.heroIdentity)}
                className="px-3 py-1.5 rounded-lg bg-doom-850 hover:bg-doom-800 border border-neutral-700 text-neutral-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5 text-doom-gold" />
                <span>{activePS.hero2} Rule</span>
              </button>
            )}
          </div>
        </div>

        {/* Input Pipeline Visualization */}
        <div className="space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
            Transformation Pipeline
          </span>

          <div className="p-5 rounded-xl bg-doom-950/80 border border-neutral-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
            {/* Step 1: Initial Input */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                1. Initial Challenge Input
              </span>
              <SequenceDisplay value={activePS.input} size="md" />
            </div>

            {/* Transition 1 */}
            <div className="flex flex-col items-center gap-1 text-doom-neon">
              <ArrowRight className="w-5 h-5 hidden md:block" />
              <span className="text-[11px] font-mono font-semibold">
                Apply {activePS.hero1}
              </span>
            </div>

            {/* Step 2: Intermediate state */}
            <div className="p-3 rounded-lg border border-dashed border-neutral-700 bg-doom-900/40 text-neutral-400 font-mono text-xs">
              [ Intermediate Result ]
            </div>

            {/* Transition 2 */}
            <div className="flex flex-col items-center gap-1 text-doom-gold">
              <ArrowRight className="w-5 h-5 hidden md:block" />
              <span className="text-[11px] font-mono font-semibold">
                Apply {activePS.hero2}
              </span>
            </div>

            {/* Step 3: Final Output target */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                3. Final Required Output
              </span>
              {isCurrentSolved ? (
                <SequenceDisplay value={activePS.expectedOutput} size="md" highlight />
              ) : (
                <div className="px-4 py-2 rounded-lg bg-doom-850 border border-neutral-700 text-neutral-400 font-mono text-xs">
                  ? ? ?
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submission Form */}
        <form onSubmit={handleVerify} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-neutral-300">
                Enter Chained Final Output:
              </label>
              <span className="text-[10px] font-mono text-neutral-500">
                Format: numbers separated by commas or spaces
              </span>
            </div>
            <input
              type="text"
              disabled={isCurrentSolved}
              placeholder="e.g. 4, 4, 24, 24 or 7"
              value={userInputs[activePS.id] || ''}
              onChange={e => handleInputChange(activePS.id, e.target.value)}
              className={`w-full px-4 py-3 rounded-xl bg-doom-850 border text-sm font-mono tracking-wide text-neutral-100 placeholder-neutral-500 focus:outline-none transition-all ${
                isCurrentSolved
                  ? 'border-doom-emerald/70 bg-doom-emerald/10 text-doom-neon font-bold'
                  : 'border-neutral-700 focus:border-doom-emerald/60'
              }`}
            />
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {feedbacks[activePS.id]?.message && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`p-3.5 rounded-xl text-xs font-mono flex items-start gap-2 border ${
                  feedbacks[activePS.id]?.type === 'success'
                    ? 'bg-doom-emerald/15 border-doom-emerald/50 text-doom-neon'
                    : 'bg-doom-red/15 border-doom-red/50 text-red-300'
                }`}
              >
                {feedbacks[activePS.id]?.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-doom-neon mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-doom-red mt-0.5" />
                )}
                <span>{feedbacks[activePS.id]?.message}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit button */}
          {!isCurrentSolved ? (
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-doom-emerald to-emerald-600 hover:from-doom-neon hover:to-emerald-500 text-doom-950 font-display font-bold uppercase tracking-wider text-sm shadow-emerald-glow flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Verify Chained Output (10 Points)</span>
            </button>
          ) : (
            <div className="p-4 rounded-xl bg-doom-emerald/15 border border-doom-emerald/50 text-center font-mono text-xs font-bold text-doom-neon flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-doom-neon" />
              <span>TRANSFORMATION VERIFIED (+10 PTS)</span>
            </div>
          )}
        </form>

        {/* Explanation Card when solved */}
        {isCurrentSolved && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-doom-950/80 border border-doom-emerald/30 text-xs font-mono space-y-1"
          >
            <div className="text-doom-neon font-bold">Rule Analysis:</div>
            <p className="text-neutral-300 font-sans leading-relaxed">{activePS.explanation}</p>
          </motion.div>
        )}
      </div>

      {/* Hero Rule Quick-Inspect Modal */}
      <AnimatePresence>
        {showRuleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg p-6 rounded-2xl bg-doom-900 border border-doom-emerald/40 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h4 className="text-base font-bold font-display uppercase tracking-wider text-white">
                  Hero Archive Signature: {showRuleModal}
                </h4>
                <button
                  onClick={() => setShowRuleModal(null)}
                  className="text-neutral-400 hover:text-white text-xs font-mono px-2 py-1 rounded bg-neutral-800"
                >
                  Close
                </button>
              </div>

              {(() => {
                const f = currentSet.heroFiles.find(
                  item => item.heroIdentity.toLowerCase() === showRuleModal.toLowerCase()
                );
                if (!f) return <p className="text-xs text-neutral-400">Rule data unarchived.</p>;
                return (
                  <div className="space-y-3 text-xs font-sans">
                    <div className="p-3 rounded-lg bg-doom-950/80 border border-neutral-800">
                      <div className="text-[11px] font-mono text-doom-gold uppercase tracking-wider mb-1">
                        Archived Mathematical Rule
                      </div>
                      <p className="text-neutral-200 leading-relaxed font-semibold">
                        {f.ruleExplanation}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-doom-950/80 border border-neutral-800">
                      <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                        Archival Inscription
                      </div>
                      <p className="text-neutral-300 italic">"{f.hint}"</p>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
