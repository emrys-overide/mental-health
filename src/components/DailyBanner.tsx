import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, BookOpen, ArrowRight, ChevronRight, 
  Share2, Volume2, Check, X, ShieldCheck
} from 'lucide-react';
import { DailyDevotion } from '../types';
import { sound } from '../utils/sound';

interface DailyBannerProps {
  devotion: DailyDevotion;
  onOpenDevotion: () => void;
  isCommittedToday?: boolean;
}

export const DailyBanner: React.FC<DailyBannerProps> = ({ 
  devotion, 
  onOpenDevotion,
  isCommittedToday = false 
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playChime(520);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`Today's Scripture: ${devotion.scriptureRef} — ${devotion.scriptureText}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePlayTone = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playZenBowl();
  };

  if (isDismissed) {
    return (
      <div className="w-full max-w-xl mx-auto mb-3 flex justify-center">
        <button
          onClick={() => setIsDismissed(false)}
          className="text-[11px] font-semibold text-amber-300/80 hover:text-amber-200 bg-slate-900/80 px-3 py-1 rounded-full border border-amber-500/20 flex items-center gap-1.5 backdrop-blur-md transition cursor-pointer"
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          Show Today’s Scripture Banner ({devotion.scriptureRef})
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto mb-5 px-1">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/70 via-slate-900/90 to-emerald-950/60 border border-amber-500/35 p-4 shadow-xl backdrop-blur-xl group hover:border-amber-500/50 transition-all cursor-pointer"
        onClick={onOpenDevotion}
      >
        {/* Soft radial aura */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Top meta strip */}
        <div className="flex items-center justify-between gap-2 mb-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Scripture of the Day
            </span>
            <span className="text-[11px] text-slate-300/90 font-medium">
              {devotion.dateStr}
            </span>
          </div>

          <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
            {isCommittedToday && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Committed
              </span>
            )}
            <button
              onClick={handlePlayTone}
              className="p-1.5 rounded-lg bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 transition"
              title="Calm chime"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 transition"
              title="Copy scripture"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setIsDismissed(true); }}
              className="p-1.5 rounded-lg bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Minimize banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Scripture Content */}
        <div className="relative z-10 text-left">
          <div className="flex items-baseline gap-2 mb-1">
            <h3 className="text-sm font-bold text-amber-300 font-serif-biblical tracking-wide">
              {devotion.scriptureRef}
            </h3>
            <span className="text-[11px] text-slate-400 font-normal truncate">
              — {devotion.theme}
            </span>
          </div>

          <p className="text-xs text-slate-200 italic font-medium leading-relaxed mb-3 line-clamp-2">
            {devotion.scriptureText}
          </p>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold group-hover:text-amber-300 transition">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Read Today's Story & Daily Commitment</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>

            <span className="text-[10px] text-slate-400">
              2 min devotion
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
