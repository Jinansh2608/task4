import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HERO_GUIDE, HeroGuideEntry } from '../data/heroGuide';
import { X, Search, BookOpen, Sparkles, Shield, Zap, Target, Crosshair, Flame, Activity, Compass, EyeOff, ShieldAlert, CloudLightning, Minimize2, Wand2, Cpu, Sun } from 'lucide-react';

interface HeroGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-5 h-5 text-emerald-400" />,
  Activity: <Activity className="w-5 h-5 text-red-400" />,
  Crosshair: <Crosshair className="w-5 h-5 text-purple-400" />,
  Flame: <Flame className="w-5 h-5 text-indigo-400" />,
  Zap: <Zap className="w-5 h-5 text-amber-400" />,
  Compass: <Compass className="w-5 h-5 text-cyan-400" />,
  EyeOff: <EyeOff className="w-5 h-5 text-rose-400" />,
  ShieldAlert: <ShieldAlert className="w-5 h-5 text-green-500" />,
  CloudLightning: <CloudLightning className="w-5 h-5 text-blue-400" />,
  Minimize2: <Minimize2 className="w-5 h-5 text-orange-400" />,
  Shield: <Shield className="w-5 h-5 text-blue-500" />,
  Target: <Target className="w-5 h-5 text-purple-300" />,
  Wand2: <Wand2 className="w-5 h-5 text-red-500" />,
  Cpu: <Cpu className="w-5 h-5 text-teal-400" />,
  Sun: <Sun className="w-5 h-5 text-yellow-300" />,
};

export const HeroGuideModal: React.FC<HeroGuideModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHeroes = HERO_GUIDE.filter(
    h =>
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-xl border border-doom-emerald/30 bg-doom-900 shadow-2xl overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-doom-800 bg-doom-950/70">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-doom-emerald/10 border border-doom-emerald/30">
                  <BookOpen className="w-5 h-5 text-doom-neon" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-display tracking-wider text-neutral-100 uppercase">
                    Archive Hero Dossier
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono">
                    Tactical intelligence & behavioral archetypes
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition-colors"
                aria-label="Close dossier"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="px-6 py-3 border-b border-doom-800 bg-doom-950/40">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search by hero or behavioural pattern..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-lg bg-doom-850 border border-neutral-700/60 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-doom-emerald/60 focus:ring-1 focus:ring-doom-emerald/40 font-mono"
                />
              </div>
            </div>

            {/* Hero List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {filteredHeroes.length === 0 ? (
                <div className="text-center py-12 text-neutral-500 font-mono text-sm">
                  No hero matches the query in the archives.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredHeroes.map(hero => (
                    <div
                      key={hero.name}
                      className="p-3.5 rounded-lg border border-neutral-800 bg-doom-850/60 hover:border-doom-emerald/40 hover:bg-doom-800/40 transition-all flex items-start gap-3"
                    >
                      <div className="p-2 rounded bg-doom-950/80 border border-neutral-800 shrink-0 mt-0.5">
                        {iconMap[hero.iconName] || <Sparkles className="w-5 h-5 text-neutral-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2">
                          <h4 className="font-semibold text-sm text-neutral-100 font-display tracking-wide truncate">
                            {hero.name}
                          </h4>
                          <span className="text-[11px] font-mono text-doom-gold/80 shrink-0">
                            {hero.title}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                          {hero.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-doom-800 bg-doom-950/60 flex items-center justify-between text-xs text-neutral-400 font-mono">
              <span>Classified Doom Intelligence • 15 Hero Archetypes</span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded bg-doom-800 hover:bg-doom-750 text-neutral-200 border border-neutral-700 text-xs transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
