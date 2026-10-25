import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { SequenceDisplay } from './common/SequenceDisplay';
import { MatrixGrid } from './common/MatrixGrid';
import { isMatrix, formatValue } from '../engine/answerParser';
import {
  ArrowLeft,
  ArrowRight,
  Shield,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Award,
  Layers,
  Send,
  Lock,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

export const HeroFilePuzzle: React.FC = () => {
  const {
    gameState,
    currentSet,
    openHeroFile,
    goToScreen,
    saveHypothesis,
    submitPrediction,
    submitHeroIdentity,
  } = useGame();

  const fileId = gameState.activeFileId || 'file-01';
  const file = currentSet.heroFiles.find(f => f.id === fileId) || currentSet.heroFiles[0];
  const progress = gameState.heroFilesProgress[file.id];

  const [predictionInput, setPredictionInput] = useState(progress?.userPredictionInput || '');
  const [hypothesisText, setHypothesisText] = useState(progress?.hypothesis || '');
  const [selectedHero, setSelectedHero] = useState<string | null>(progress?.selectedHero || null);

  const [predictionFeedback, setPredictionFeedback] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const [identityFeedback, setIdentityFeedback] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Update inputs when changing active file
  useEffect(() => {
    setPredictionInput(progress?.userPredictionInput || '');
    setHypothesisText(progress?.hypothesis || '');
    setSelectedHero(progress?.selectedHero || null);
    setPredictionFeedback({ type: null, message: '' });
    setIdentityFeedback({ type: null, message: '' });
  }, [file.id, progress]);

  // Handle hypothesis autosave
  const handleHypothesisChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setHypothesisText(val);
    saveHypothesis(file.id, val);
  };

  // Handle prediction submit
  const handleVerifyPrediction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!predictionInput.trim()) return;

    const res = submitPrediction(file.id, predictionInput);
    if (res.success) {
      setPredictionFeedback({ type: 'success', message: res.message });
    } else {
      setPredictionFeedback({ type: 'error', message: res.message });
    }
  };

  // Handle hero identity submit
  const handleVerifyHero = () => {
    if (!selectedHero) return;
    const res = submitHeroIdentity(file.id, selectedHero);
    if (res.success) {
      setIdentityFeedback({ type: 'success', message: res.message });
    } else {
      setIdentityFeedback({ type: 'error', message: res.message });
    }
  };

  // Navigation between files
  const currentIndex = currentSet.heroFiles.findIndex(f => f.id === file.id);
  const prevFile = currentIndex > 0 ? currentSet.heroFiles[currentIndex - 1] : null;
  const nextFile = currentIndex < currentSet.heroFiles.length - 1 ? currentSet.heroFiles[currentIndex + 1] : null;

  const isPredictionVerified = progress?.predictionVerified || false;
  const isDecoded = progress?.isDecoded || false;

  return (
    <div className="flex-1 px-4 sm:px-6 py-6 max-w-5xl mx-auto w-full space-y-6">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-doom-800 pb-4">
        <button
          onClick={() => goToScreen('dashboard')}
          className="flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </button>

        {/* Prev / Next file arrows */}
        <div className="flex items-center gap-2">
          {prevFile && (
            <button
              onClick={() => openHeroFile(prevFile.id)}
              className="px-2.5 py-1 rounded bg-doom-850 hover:bg-doom-800 border border-neutral-800 text-xs font-mono text-neutral-300 flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>File 0{prevFile.fileNumber}</span>
            </button>
          )}
          {nextFile && (
            <button
              onClick={() => openHeroFile(nextFile.id)}
              className="px-2.5 py-1 rounded bg-doom-850 hover:bg-doom-800 border border-neutral-800 text-xs font-mono text-neutral-300 flex items-center gap-1 transition-colors"
            >
              <span>File 0{nextFile.fileNumber}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Hero File Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-doom-900/90 border border-doom-emerald/30 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-doom-gold">
              FILE 0{file.fileNumber} ARCHIVE
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                file.difficulty === 'Easy'
                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-950/80 text-amber-400 border border-amber-500/30'
              }`}
            >
              {file.difficulty} Difficulty
            </span>
            <span className="text-xs font-mono text-neutral-400">
              • Max {file.difficulty === 'Easy' ? 5 : 10} Points
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display uppercase tracking-wide text-white">
            {isDecoded ? (
              <span className="text-doom-neon flex items-center gap-2">
                <span>IDENTITY: {file.heroIdentity}</span>
                <CheckCircle2 className="w-6 h-6 inline-block" />
              </span>
            ) : (
              'SUBJECT: IDENTITY UNKNOWN'
            )}
          </h2>
        </div>

        {/* Current Score for this file */}
        <div className="flex items-center gap-3 self-start sm:self-auto px-4 py-2 rounded-xl bg-doom-850 border border-neutral-800 font-mono">
          <Award className="w-4 h-4 text-doom-gold" />
          <div className="text-xs text-neutral-400">
            Earned:{' '}
            <strong className="text-doom-gold text-sm">
              {(progress?.predictionPointsAwarded || 0) + (progress?.identityPointsAwarded || 0)}
            </strong>
            /{file.difficulty === 'Easy' ? 5 : 10} pts
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column (Observation & Hint) / Right Column (Test & Verification) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* SECTION 1: Observed Behaviour */}
          <div className="p-5 sm:p-6 rounded-2xl bg-doom-900/80 border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-neutral-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-doom-neon" />
                1. Observed Behaviour
              </h3>
              <span className="text-[11px] font-mono text-neutral-400">
                {file.examples.length} Verified Signatures
              </span>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Examine the mathematical transformations produced by this hero's power signature:
            </p>

            <div className="space-y-3.5">
              {file.examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-doom-850/80 border border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 overflow-x-auto"
                >
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                      Input #{idx + 1}
                    </span>
                    <SequenceDisplay value={ex.input} size="sm" />
                  </div>

                  <div className="hidden sm:flex text-doom-emerald">
                    <ArrowRight className="w-4 h-4" />
                  </div>

                  <div className="flex flex-col items-start sm:items-end gap-1">
                    <span className="text-[10px] font-mono text-doom-neon/80 uppercase tracking-wider">
                      Observed Output
                    </span>
                    <SequenceDisplay value={ex.output} size="sm" highlight />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2: Doom Hint */}
          <div className="p-5 rounded-2xl bg-doom-950/80 border border-doom-gold/30 space-y-2 relative overflow-hidden">
            <div className="flex items-center gap-2 text-doom-gold text-xs font-mono font-bold uppercase tracking-wider">
              <Lightbulb className="w-4 h-4" />
              <span>2. Doom’s Archival Inscription</span>
            </div>
            <p className="text-sm text-neutral-200 font-sans italic leading-relaxed border-l-2 border-doom-gold/50 pl-3">
              "{file.hint}"
            </p>
          </div>

          {/* SECTION 3: Your Hypothesis (Team Scratchpad) */}
          <div className="p-5 rounded-2xl bg-doom-900/60 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-semibold">
                3. Team Hypothesis (Optional)
              </label>
              <span className="text-[10px] font-mono text-neutral-500">
                Scratchpad for collaboration
              </span>
            </div>
            <textarea
              rows={2}
              placeholder="e.g. Looks like consecutive numbers are added together pairwise..."
              value={hypothesisText}
              onChange={handleHypothesisChange}
              className="w-full px-3 py-2 rounded-lg bg-doom-850 border border-neutral-700/60 text-xs text-neutral-200 placeholder-neutral-500 font-sans focus:outline-none focus:border-doom-emerald/50"
            />
          </div>
        </div>

        {/* Right Column: Doom Test, Verification & Hero Identity */}
        <div className="space-y-6">
          {/* SECTION 4 & 5: Doom Test & Verification */}
          <div className="p-5 sm:p-6 rounded-2xl bg-doom-900/80 border border-neutral-800 space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-neutral-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                4. Doom Test & Verification
              </h3>
              <span className="text-xs font-mono font-bold text-doom-gold">
                {file.difficulty === 'Easy' ? '3 Points' : '5 Points'}
              </span>
            </div>

            {/* Test Input Display */}
            <div className="p-4 rounded-xl bg-doom-850 border border-neutral-800 flex flex-col items-center justify-center space-y-2 text-center">
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                Unseen Challenge Input
              </span>
              <SequenceDisplay value={file.testInput} size="md" />
            </div>

            {/* Prediction Input Form */}
            <form onSubmit={handleVerifyPrediction} className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-neutral-300">
                    Enter Predicted Output:
                  </label>
                  <span className="text-[10px] font-mono text-neutral-400">
                    {isMatrix(file.testInput) ? 'e.g. 1 7 3 / 2 9 5 / 8 4 6' : 'e.g. 4, 5, 8 or 16'}
                  </span>
                </div>
                <input
                  type="text"
                  disabled={isPredictionVerified}
                  placeholder={
                    isMatrix(file.testInput)
                      ? 'Rows separated by slash / or semicolon (e.g. 1 7 3 / 2 9 5 / 8 4 6)'
                      : 'Numbers separated by commas or spaces (e.g. 12, 3, 5, 7)'
                  }
                  value={predictionInput}
                  onChange={e => setPredictionInput(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl bg-doom-850 border text-sm font-mono tracking-wide text-neutral-100 placeholder-neutral-500 focus:outline-none transition-all ${
                    isPredictionVerified
                      ? 'border-doom-emerald/70 bg-doom-emerald/10 text-doom-neon font-bold'
                      : 'border-neutral-700 focus:border-doom-emerald/60'
                  }`}
                />
              </div>

              {/* Prediction Feedback Message */}
              <AnimatePresence>
                {predictionFeedback.message && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`p-3 rounded-lg text-xs font-mono flex items-start gap-2 border ${
                      predictionFeedback.type === 'success'
                        ? 'bg-doom-emerald/15 border-doom-emerald/50 text-doom-neon'
                        : 'bg-doom-red/15 border-doom-red/50 text-red-300'
                    }`}
                  >
                    {predictionFeedback.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-doom-neon mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 text-doom-red mt-0.5" />
                    )}
                    <span>{predictionFeedback.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Verify Button */}
              {!isPredictionVerified ? (
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-doom-800 hover:bg-doom-750 border border-doom-emerald/40 hover:border-doom-emerald text-doom-neon font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-emerald-glow transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Verify Prediction</span>
                </button>
              ) : (
                <div className="p-2.5 rounded-xl bg-doom-emerald/15 border border-doom-emerald/40 text-center font-mono text-xs font-bold text-doom-neon flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>PREDICTION VERIFIED (+{progress?.predictionPointsAwarded || 0} PTS)</span>
                </div>
              )}
            </form>
          </div>

          {/* SECTION 6: Identify the Hero */}
          <div
            className={`p-5 sm:p-6 rounded-2xl border transition-all duration-300 space-y-4 ${
              isPredictionVerified
                ? 'bg-doom-900/90 border-doom-emerald/40 shadow-emerald-glow'
                : 'bg-doom-950/50 border-neutral-800/80 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-sm font-bold font-display uppercase tracking-wider text-neutral-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-doom-neon" />
                6. Identify the Hero
              </h3>
              <span className="text-xs font-mono font-bold text-doom-gold">
                {file.difficulty === 'Easy' ? '2 Points' : '5 Points'}
              </span>
            </div>

            {!isPredictionVerified ? (
              <div className="py-6 text-center text-xs font-mono text-neutral-500 space-y-2">
                <Lock className="w-5 h-5 mx-auto" />
                <p>Complete and verify the Doom Test prediction above to unlock the Hero Identification Bank.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-neutral-300 font-sans">
                  Select which hero's signature matches this pattern from the 8 available candidates:
                </p>

                {/* Hero Bank Selector */}
                <div className="grid grid-cols-2 gap-2">
                  {currentSet.heroBank.map(heroName => {
                    const isSelected = selectedHero === heroName;
                    const isConfirmedCorrect = isDecoded && file.heroIdentity === heroName;

                    return (
                      <button
                        key={heroName}
                        disabled={isDecoded}
                        onClick={() => {
                          setSelectedHero(heroName);
                          setIdentityFeedback({ type: null, message: '' });
                        }}
                        className={`p-2.5 rounded-lg border text-xs font-mono font-semibold transition-all text-left flex items-center justify-between cursor-pointer ${
                          isConfirmedCorrect
                            ? 'bg-doom-emerald/20 border-doom-emerald text-doom-neon shadow-emerald-glow'
                            : isSelected
                            ? 'bg-doom-gold/20 border-doom-gold text-doom-gold'
                            : 'bg-doom-850/80 border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:text-white'
                        }`}
                      >
                        <span className="truncate">{heroName}</span>
                        {isConfirmedCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-doom-neon" />}
                      </button>
                    );
                  })}
                </div>

                {/* Identity Feedback */}
                <AnimatePresence>
                  {identityFeedback.message && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`p-3 rounded-lg text-xs font-mono flex items-start gap-2 border ${
                        identityFeedback.type === 'success'
                          ? 'bg-doom-emerald/15 border-doom-emerald/50 text-doom-neon'
                          : 'bg-doom-red/15 border-doom-red/50 text-red-300'
                      }`}
                    >
                      {identityFeedback.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-doom-neon mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 shrink-0 text-doom-red mt-0.5" />
                      )}
                      <span>{identityFeedback.message}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Identity Button */}
                {!isDecoded ? (
                  <button
                    onClick={handleVerifyHero}
                    disabled={!selectedHero}
                    className={`w-full py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                      selectedHero
                        ? 'bg-doom-gold hover:bg-yellow-400 text-doom-950 shadow-gold-glow cursor-pointer'
                        : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Confirm Hero Identity</span>
                  </button>
                ) : null}
              </div>
            )}
          </div>

          {/* SECTION 7: Identity Reveal */}
          <AnimatePresence>
            {isDecoded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-doom-850 via-doom-900 to-doom-950 border border-doom-emerald/60 shadow-emerald-glow space-y-4"
              >
                <div className="flex items-center gap-2 text-doom-neon font-mono text-xs font-bold tracking-widest uppercase">
                  <Sparkles className="w-4 h-4" />
                  <span>SYSTEM VERIFIED • PATTERN MATCH FOUND</span>
                </div>

                <div className="space-y-1 border-b border-neutral-800 pb-3">
                  <div className="text-2xl font-bold font-display text-white">
                    {file.heroIdentity}
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                    {file.ruleExplanation}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                  <button
                    onClick={() => goToScreen('dashboard')}
                    className="w-full sm:flex-1 py-2.5 rounded-xl bg-doom-emerald hover:bg-doom-neon text-doom-950 font-display font-bold uppercase tracking-wider text-xs shadow-emerald-glow transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Add to Archive & Return</span>
                  </button>
                  {nextFile && (
                    <button
                      onClick={() => openHeroFile(nextFile.id)}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-doom-800 hover:bg-doom-750 text-neutral-200 border border-neutral-700 text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Next File (0{nextFile.fileNumber})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
