import React from 'react';
import { motion } from 'framer-motion';
import { HeroFile, HeroFileProgress } from '../types/game';
import { Shield, CheckCircle2, Lock, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

interface HeroFileCardProps {
  file: HeroFile;
  progress?: HeroFileProgress;
  onOpen: (fileId: string) => void;
  index: number;
}

export const HeroFileCard: React.FC<HeroFileCardProps> = ({
  file,
  progress,
  onOpen,
  index,
}) => {
  const isDecoded = progress?.isDecoded || false;
  const isPredicted = progress?.predictionVerified || false;
  const earnedScore = (progress?.predictionPointsAwarded || 0) + (progress?.identityPointsAwarded || 0);
  const maxPossible = file.difficulty === 'Easy' ? 5 : 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={() => onOpen(file.id)}
      className={`group relative p-5 rounded-xl border cursor-pointer transition-all duration-300 flex flex-col justify-between overflow-hidden ${
        isDecoded
          ? 'bg-doom-emerald/10 border-doom-emerald/40 hover:border-doom-emerald shadow-emerald-glow'
          : isPredicted
          ? 'bg-doom-850/90 border-amber-500/40 hover:border-amber-400'
          : 'bg-doom-900/80 border-neutral-800 hover:border-doom-emerald/40 hover:bg-doom-850/80'
      }`}
    >
      {/* Background ambient corner glow */}
      {isDecoded && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-doom-emerald/10 rounded-full blur-2xl pointer-events-none" />
      )}

      {/* Top Card Bar */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold tracking-wider text-doom-gold">
              FILE 0{file.fileNumber}
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                file.difficulty === 'Easy'
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
              }`}
            >
              {file.difficulty}
            </span>
          </div>

          {/* Points badge */}
          <div className="text-[11px] font-mono font-semibold text-neutral-400">
            <span className={earnedScore > 0 ? 'text-doom-neon font-bold' : ''}>
              {earnedScore}
            </span>
            <span>/{maxPossible} PTS</span>
          </div>
        </div>

        {/* Status & Identity */}
        <div className="space-y-1 my-3">
          <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
            Identity Status
          </div>
          {isDecoded ? (
            <div className="flex items-center gap-2 text-base font-bold font-display tracking-wide text-doom-neon">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-doom-neon" />
              <span className="truncate">{file.heroIdentity}</span>
            </div>
          ) : isPredicted ? (
            <div className="flex items-center gap-2 text-sm font-semibold font-display tracking-wide text-amber-400">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>TEST VERIFIED • UNIDENTIFIED</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm font-semibold font-mono tracking-wider text-neutral-400">
              <Lock className="w-4 h-4 shrink-0 text-neutral-500" />
              <span>IDENTITY UNKNOWN</span>
            </div>
          )}
        </div>

        {/* Clue Hint teaser */}
        <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed font-sans italic border-l-2 border-neutral-700/60 pl-2.5 my-2">
          "{file.hint}"
        </p>
      </div>

      {/* Card Footer */}
      <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1.5 text-neutral-400">
          <span className="w-2 h-2 rounded-full bg-neutral-700 group-hover:bg-doom-neon transition-colors" />
          <span>{isDecoded ? 'Decoded' : isPredicted ? 'Ready to Identify' : 'Pending Test'}</span>
        </div>
        <div className="flex items-center gap-1 text-neutral-400 group-hover:text-doom-neon font-semibold transition-colors">
          <span>{isDecoded ? 'Inspect' : 'Decrypt'}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
};
