import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  BookOpen, Sparkles, Brain, Check, X, ShieldCheck, 
  Flame, Heart, CheckCircle2, Volume2, Compass, Share2
} from 'lucide-react';
import { DailyDevotion } from '../types';
import { sound } from '../utils/sound';

interface DailyDevotionModalProps {
  devotion: DailyDevotion;
  isOpen: boolean;
  onClose: () => void;
  onCommitSuccess: () => void;
  isAlreadyCommitted?: boolean;
}

export const DailyDevotionModal: React.FC<DailyDevotionModalProps> = ({
  devotion,
  isOpen,
  onClose,
  onCommitSuccess,
  isAlreadyCommitted = false
}) => {
  const [checkedPledges, setCheckedPledges] = useState<Record<number, boolean>>({});
  const [reflectionNote, setReflectionNote] = useState('');
  const [isSealed, setIsSealed] = useState(isAlreadyCommitted);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsSealed(isAlreadyCommitted);
    // Load saved reflection if any
    const savedNote = localStorage.getItem(`devotion_note_${devotion.id}`);
    if (savedNote) setReflectionNote(savedNote);
  }, [devotion.id, isAlreadyCommitted]);

  if (!isOpen) return null;

  const togglePledge = (index: number) => {
    sound.playChime(460 + index * 30);
    setCheckedPledges(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const allPledgesChecked = devotion.commitmentPledges.every((_, idx) => checkedPledges[idx]);

  const handleSealCommitment = () => {
    sound.playVictoryChord();
    setIsSealed(true);

    // Save commitment date in localStorage
    const todayKey = new Date().toDateString();
    localStorage.setItem('recovery_last_committed_date', todayKey);
    if (reflectionNote.trim()) {
      localStorage.setItem(`devotion_note_${devotion.id}`, reflectionNote.trim());
    }

    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#38BDF8']
      });
    } catch {
      // ignore
    }

    onCommitSuccess();
  };

  const handleCopyStory = () => {
    sound.playChime(500);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `${devotion.title} (${devotion.scriptureRef})\n\n${devotion.scriptureText}\n\n${devotion.meditationStory}\n\nPrayer: ${devotion.prayer}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/40 rounded-[28px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-left my-auto"
      >
        {/* Divine Dawn Header Accent */}
        <div className="relative bg-gradient-to-r from-amber-950/80 via-slate-900 to-emerald-950/80 p-6 border-b border-amber-500/30">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[11px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Daily Devotion & Meditation
              </span>
              <span className="text-xs text-slate-300 font-medium">
                {devotion.dateStr}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyStory}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition"
                title="Share devotion"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
              <button
                id="close-devotion-modal-btn"
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white leading-tight font-serif-biblical tracking-wide">
            {devotion.title}
          </h2>
          <span className="text-xs text-amber-300/90 font-medium block mt-1">
            Theme: {devotion.theme}
          </span>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-200 text-sm leading-relaxed no-scrollbar">
          
          {/* Scripture Spotlight */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 shadow-inner">
            <div className="flex items-center gap-2 font-serif-biblical font-bold text-amber-300 text-sm mb-1.5">
              <BookOpen className="w-4 h-4 text-amber-400" />
              {devotion.scriptureRef}
            </div>
            <blockquote className="text-sm italic font-serif-biblical text-amber-100 font-medium leading-relaxed">
              {devotion.scriptureText}
            </blockquote>
          </div>

          {/* Meditation Story Narrative */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2">
              Meditation Story
            </span>
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3 font-normal text-slate-200 leading-relaxed text-sm">
              {devotion.meditationStory.split('\n\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Clinical & Neuroscience Takeaway */}
          <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0 mt-0.5">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-cyan-300 block mb-1">
                Neuroscience Connection:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {devotion.neuroInsight}
              </p>
            </div>
          </div>

          {/* Reflection Question & Note */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Compass className="w-4 h-4" /> Today's Meditation Prompt:
            </span>
            <p className="text-xs text-slate-300 font-medium">
              {devotion.reflectionQuestion}
            </p>
            <textarea
              value={reflectionNote}
              onChange={e => setReflectionNote(e.target.value)}
              placeholder="Write your private thought or prayer here..."
              rows={2}
              className="w-full text-xs p-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:border-amber-400 outline-none resize-none mt-2"
            />
          </div>

          {/* Heartfelt Prayer */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-amber-500/20">
            <span className="text-xs font-bold text-amber-300/90 block mb-1.5 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-400" /> Daily Prayer:
            </span>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              {devotion.prayer}
            </p>
          </div>

          {/* Daily Commitment Section */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-950 to-emerald-950/40 border border-emerald-500/40 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Daily Covenant of Mind & Heart
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Today's Recovery Commitments
                </h3>
              </div>
              {isSealed && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Sealed Today
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300">
              Check each micro-commitment to affirm your deliberate intention for today:
            </p>

            <div className="space-y-2.5">
              {devotion.commitmentPledges.map((pledge, idx) => {
                const checked = !!checkedPledges[idx] || isSealed;
                return (
                  <button
                    key={idx}
                    onClick={() => togglePledge(idx)}
                    className={`w-full p-3 rounded-xl border text-xs font-medium text-left flex items-start gap-3 transition cursor-pointer ${
                      checked
                        ? 'bg-emerald-500/20 border-emerald-400/60 text-emerald-200'
                        : 'bg-slate-900/80 border-slate-700/70 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition ${
                      checked
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold'
                        : 'border-slate-600 bg-slate-800'
                    }`}>
                      {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span className="leading-snug">{pledge}</span>
                  </button>
                );
              })}
            </div>

            {/* Seal Commitment Button */}
            {!isSealed ? (
              <button
                id="seal-commitment-btn"
                onClick={handleSealCommitment}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-500 hover:opacity-95 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 mt-2 active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                Seal Today’s Commitment In Christ
              </button>
            ) : (
              <div className="p-3 bg-emerald-500/20 border border-emerald-400/50 rounded-xl text-center text-xs font-bold text-emerald-300 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                You have sealed your daily walk for today! Walk in His peace.
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Proverbs 16:3 — “Commit thy works unto the LORD, and thy thoughts shall be established.”</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
