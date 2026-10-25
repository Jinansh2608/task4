import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { Shield, Users, Clock, FileText, Cpu, KeyRound, ArrowRight, Sparkles } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { goToScreen } = useGame();

  const specs = [
    { icon: <Users className="w-4 h-4 text-doom-neon" />, label: 'Team Size', value: '3–4 Players' },
    { icon: <Clock className="w-4 h-4 text-amber-400" />, label: 'Duration', value: '20 Minutes' },
    { icon: <FileText className="w-4 h-4 text-emerald-400" />, label: 'Archives', value: '7 Hero Files' },
    { icon: <Cpu className="w-4 h-4 text-cyan-400" />, label: 'Transformations', value: '4 Power Sequences' },
    { icon: <KeyRound className="w-4 h-4 text-doom-gold" />, label: 'Master Lock', value: '1 Final Cipher' },
  ];

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-8 md:py-16 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-doom-emerald/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-doom-gold/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full max-w-4xl flex flex-col items-center text-center z-10 space-y-8"
      >
        {/* Doom Archive Crest */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-doom-850 via-doom-900 to-doom-950 border border-doom-emerald/40 flex items-center justify-center shadow-emerald-glow relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-doom-emerald/20 to-transparent" />
            <Shield className="w-10 h-10 md:w-12 md:h-12 text-doom-neon drop-shadow-[0_0_12px_rgba(52,211,153,0.6)]" />
            <div className="absolute -inset-1 border border-doom-emerald/20 rounded-2xl animate-pulse-subtle" />
          </div>
          <div className="absolute -top-1 -right-1 px-2 py-0.5 rounded-full bg-doom-emerald/20 border border-doom-emerald/40 text-[9px] font-mono text-doom-neon uppercase tracking-widest">
            v2.6 Secure
          </div>
        </motion.div>

        {/* Title & Subtitle */}
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-doom-850 border border-doom-emerald/30 text-xs font-mono text-doom-neon"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>LATVERIAN ARCHIVAL SYSTEMS • TOP SECRET</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-display tracking-tight text-white uppercase"
          >
            THE SORCERER’S <span className="text-transparent bg-clip-text bg-gradient-to-r from-doom-neon via-emerald-400 to-doom-gold">CIPHER</span>
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg sm:text-xl md:text-2xl font-mono tracking-widest text-neutral-400 uppercase"
          >
            DOOM’S HERO ARCHIVE
          </motion.h2>
        </div>

        {/* Narrative Story Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="max-w-2xl px-6 py-4 rounded-xl bg-doom-900/80 border border-doom-emerald/20 backdrop-blur-md shadow-lg"
        >
          <p className="text-base sm:text-lg text-neutral-200 font-sans italic leading-relaxed">
            “Every hero leaves a pattern behind. Doom has hidden their identities inside mathematical systems. Observe. Decode. Verify. Identify.”
          </p>
        </motion.div>

        {/* Specifications Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 w-full max-w-3xl"
        >
          {specs.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-lg bg-doom-850/60 border border-neutral-800 flex flex-col items-center justify-center text-center space-y-1 hover:border-doom-emerald/40 transition-colors"
            >
              <div className="p-2 rounded bg-doom-950/80 border border-neutral-800">
                {item.icon}
              </div>
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono">
                {item.label}
              </span>
              <span className="text-xs sm:text-sm font-bold font-mono text-neutral-100">
                {item.value}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Primary Action Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="pt-4 flex flex-col items-center space-y-3"
        >
          <button
            onClick={() => goToScreen('setup')}
            className="px-8 sm:px-10 py-4 rounded-xl bg-gradient-to-r from-doom-emerald via-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-doom-950 font-display text-lg sm:text-xl font-bold uppercase tracking-wider shadow-emerald-glow-lg hover:shadow-[0_0_40px_rgba(16,185,129,0.7)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-3 cursor-pointer"
          >
            <span>ENTER THE ARCHIVE</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <p className="text-xs text-neutral-400 font-mono tracking-wide">
            Observe carefully. Every pattern has a rule.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
