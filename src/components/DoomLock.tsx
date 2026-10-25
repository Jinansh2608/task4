import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { deriveDoomLockCode, extractDigitFromOutput } from '../engine/doomLock';
import { formatValue } from '../engine/answerParser';
import {
  KeyRound,
  Shield,
  Lock,
  Unlock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Layers,
  HelpCircle,
} from 'lucide-react';

export const DoomLock: React.FC = () => {
  const { currentSet, submitDoomLock, gameState, goToScreen } = useGame();

  const [digits, setDigits] = useState<string[]>(['', '', '', '']);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });
  const [isDecrypting, setIsDecrypting] = useState(false);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  const handleDigitChange = (index: number, value: string) => {
    // Only accept single numerical digit
    const cleaned = value.replace(/[^0-9]/g, '');
    const lastChar = cleaned.slice(-1);

    const newDigits = [...digits];
    newDigits[index] = lastChar;
    setDigits(newDigits);
    setFeedback({ type: null, message: '' });

    // Auto-advance to next input
    if (lastChar && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleDecrypt = (e: React.FormEvent) => {
    e.preventDefault();
    if (digits.some(d => d === '')) {
      setFeedback({ type: 'error', message: 'All 4 code slots must be populated with numerical digits.' });
      return;
    }

    setIsDecrypting(true);

    setTimeout(() => {
      const res = submitDoomLock(digits);
      setIsDecrypting(false);

      if (res.success) {
        setFeedback({ type: 'success', message: res.message });
      } else {
        setFeedback({ type: 'error', message: res.message });
      }
    }, 700);
  };

  const expectedCode = deriveDoomLockCode(currentSet.powerSequences);

  return (
    <div className="flex-1 px-4 sm:px-6 py-8 max-w-4xl mx-auto w-full flex flex-col justify-center items-center space-y-8">
      {/* Vault Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex p-3 rounded-2xl bg-doom-gold/10 border border-doom-gold/40 text-doom-gold shadow-gold-glow">
          <KeyRound className="w-8 h-8 md:w-10 md:h-10 animate-pulse-subtle" />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold tracking-widest text-doom-gold uppercase">
            Master Security Barrier • 10 Points
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display uppercase tracking-tight text-white">
            The Doom Lock
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 font-sans max-w-lg mx-auto leading-relaxed">
            Four security cylinders lock the archive chamber. Extract the required digits from your Power Sequence results.
          </p>
        </div>
      </motion.div>

      {/* Extraction Rule Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full p-5 rounded-2xl bg-doom-950/90 border border-doom-gold/40 shadow-xl space-y-3"
      >
        <div className="flex items-center gap-2 text-doom-gold text-xs font-mono font-bold uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Universal Extraction Rule (All Sets)</span>
        </div>
        <div className="p-4 rounded-xl bg-doom-900 border border-neutral-800 text-sm font-sans text-neutral-200 leading-relaxed">
          “For each Power Sequence, take the <strong className="text-doom-neon">largest number</strong> in its final output and extract its <strong className="text-doom-gold">last digit</strong>. Concatenate the four digits in <strong className="text-white">Q1–Q4 order</strong>.”
        </div>

        {/* Quick Reference of solved Power Sequence outputs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {currentSet.powerSequences.map(ps => {
            const isSolved = gameState.powerSequencesProgress[ps.id]?.verified;
            return (
              <div
                key={ps.id}
                className="p-2.5 rounded-lg bg-doom-850/80 border border-neutral-800 text-center font-mono"
              >
                <div className="text-[10px] text-neutral-400 uppercase">
                  Q{ps.questionNumber} Output
                </div>
                <div className="text-xs font-bold text-neutral-200 truncate mt-1">
                  {isSolved ? formatValue(ps.expectedOutput) : 'Locked'}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* 4 Numbered Code Slots Form */}
      <motion.form
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        onSubmit={handleDecrypt}
        className="w-full max-w-xl p-6 sm:p-8 rounded-2xl bg-doom-900/90 border border-doom-emerald/30 shadow-2xl space-y-6 text-center"
      >
        <div className="flex justify-center items-center gap-3 sm:gap-4">
          {[0, 1, 2, 3].map(slotIdx => (
            <div key={slotIdx} className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                Digit {slotIdx + 1} (Q{slotIdx + 1})
              </span>
              <input
                ref={inputRefs[slotIdx]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digits[slotIdx]}
                onChange={e => handleDigitChange(slotIdx, e.target.value)}
                onKeyDown={e => handleKeyDown(slotIdx, e)}
                disabled={isDecrypting || gameState.doomLockProgress.verified}
                className="w-14 h-16 sm:w-16 sm:h-20 text-3xl sm:text-4xl font-mono font-black text-center rounded-xl bg-doom-850 border-2 border-neutral-700 focus:border-doom-gold text-doom-gold focus:outline-none focus:shadow-gold-glow transition-all"
              />
            </div>
          ))}
        </div>

        {/* Feedback Message */}
        <AnimatePresence>
          {feedback.message && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`p-3.5 rounded-xl text-xs font-mono flex items-center justify-center gap-2 border ${
                feedback.type === 'success'
                  ? 'bg-doom-emerald/15 border-doom-emerald/50 text-doom-neon'
                  : 'bg-doom-red/15 border-doom-red/50 text-red-300'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-doom-neon" />
              ) : (
                <AlertCircle className="w-4 h-4 text-doom-red" />
              )}
              <span>{feedback.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Button */}
        <div>
          {!gameState.doomLockProgress.verified ? (
            <button
              type="submit"
              disabled={isDecrypting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-doom-gold via-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-doom-950 font-display text-lg font-bold uppercase tracking-wider shadow-gold-glow flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {isDecrypting ? (
                <span>DECRYPTING CIPHER MATRIX...</span>
              ) : (
                <>
                  <Unlock className="w-5 h-5" />
                  <span>DECRYPT DOOM LOCK</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => goToScreen('victory')}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-doom-emerald to-emerald-500 text-doom-950 font-display text-lg font-bold uppercase tracking-wider shadow-emerald-glow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-5 h-5" />
              <span>PROCEED TO VICTORY SANCTUM</span>
            </button>
          )}
        </div>
      </motion.form>
    </div>
  );
};
