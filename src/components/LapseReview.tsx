import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, ShieldCheck, CheckCircle2, RotateCcw, Sparkles, BookOpen } from 'lucide-react';
import { sound } from '../utils/sound';

export const LapseReview: React.FC = () => {
  const [step, setStep] = useState(1);
  const [safetyCheck, setSafetyCheck] = useState<boolean | null>(null);
  const [unmetNeed, setUnmetNeed] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [isDone, setIsDone] = useState(false);

  const UNMET_NEEDS = [
    'Extreme physical exhaustion or sleep deprivation',
    'Deep loneliness, feeling unnoticed or isolated',
    'High emotional stress, anxiety, or job pressure',
    'Boredom and unstructured digital scrolling',
    'Anger, resentment, or interpersonal conflict',
    'Spiritual dryness or discouragement'
  ];

  const REPAIR_ACTIONS = [
    'Go to sleep immediately without device in the room',
    'Drink water and wash face with cool water',
    'Call or send a brief text to a brother, sister, or friend',
    'Read Romans 8:1 out loud three times to kill toxic shame',
    'Step outside for a 10-minute walk in natural daylight'
  ];

  const handleFinish = () => {
    sound.playVictoryChord();
    setIsDone(true);
  };

  const handleReset = () => {
    setStep(1);
    setSafetyCheck(null);
    setUnmetNeed('');
    setNextAction('');
    setIsDone(false);
  };

  return (
    <div id="lapse-review-card" className="w-full max-w-2xl mx-auto bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
        <div>
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-400" /> Evidence-Based Relapse Restoration
          </span>
          <h2 className="text-xl font-bold text-white mt-0.5">Grace & Reset (No Condemnation)</h2>
          <p className="text-xs text-slate-400">
            Research: Toxic shame drives cortisol spikes and further compulsive loops. Grace and self-compassion restore prefrontal control.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
          title="Restart review"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Scripture Anchor Pill */}
      <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/30 text-amber-200 text-xs mb-6">
        <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-1">
          <BookOpen className="w-3.5 h-3.5" /> Romans 8:1
        </div>
        <p className="italic text-slate-200">
          “There is therefore now no condemnation to them which are in Christ Jesus.”
        </p>
        <span className="text-[10px] text-slate-400 block mt-1">
          One slip does not erase your neural rewiring or God’s steadfast love.
        </span>
      </div>

      {!isDone ? (
        <div className="flex flex-col gap-5 text-left">
          {/* Step 1: Safety & Physical Discomfort */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
              <span className="text-xs font-bold text-slate-400 block mb-1">STEP 1 OF 3</span>
              <h3 className="text-base font-bold text-white mb-2">Immediate Safety & Physical Check</h3>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                First, are you physically safe? Are you experiencing acute physical pain, severe emotional crisis, or self-harm thoughts?
              </p>
              <div className="flex gap-3">
                <button
                  id="safety-safe-btn"
                  onClick={() => { setSafetyCheck(true); setStep(2); }}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" /> I am physically safe & calm
                </button>
                <button
                  id="safety-crisis-btn"
                  onClick={() => { setSafetyCheck(false); }}
                  className="py-3 px-4 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition cursor-pointer"
                >
                  I need crisis support
                </button>
              </div>

              {safetyCheck === false && (
                <div className="mt-4 p-4 rounded-xl bg-rose-950/60 border border-rose-600/40 text-rose-200 text-xs leading-relaxed">
                  <strong>Emergency Resources:</strong> If you are experiencing severe emotional distress or thoughts of harm, please reach out to the 988 Suicide & Crisis Lifeline (call/text 988 in the US/Canada) or contact your local healthcare provider or trusted family member immediately. You are deeply valued.
                </div>
              )}
            </motion.div>
          )}

          {/* Step 2: What Unmet Need was Present? */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
              <span className="text-xs font-bold text-slate-400 block mb-1">STEP 2 OF 3</span>
              <h3 className="text-base font-bold text-white mb-2">Identify The Real Unmet Need</h3>
              <p className="text-xs text-slate-300 mb-3">
                Sexual compulsivity is rarely about sex—it is almost always an attempt to soothe an underlying emotional pain. Which need was speaking?
              </p>
              <div className="flex flex-col gap-2 mb-4">
                {UNMET_NEEDS.map(need => (
                  <button
                    key={need}
                    onClick={() => setUnmetNeed(need)}
                    className={`p-3 rounded-xl border text-xs font-medium text-left transition ${
                      unmetNeed === need
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    {need}
                  </button>
                ))}
              </div>
              <button
                disabled={!unmetNeed}
                onClick={() => setStep(3)}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition cursor-pointer"
              >
                Continue to Restorative Action →
              </button>
            </motion.div>
          )}

          {/* Step 3: Pick One Gentle Restorative Action */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
              <span className="text-xs font-bold text-slate-400 block mb-1">STEP 3 OF 3</span>
              <h3 className="text-base font-bold text-white mb-2">One Gentle Restorative Step</h3>
              <p className="text-xs text-slate-300 mb-3">
                No punitive fasting, no self-flagellation, no despair. Choose one tangible healing action to care for yourself right now:
              </p>
              <div className="flex flex-col gap-2 mb-5">
                {REPAIR_ACTIONS.map(action => (
                  <button
                    key={action}
                    onClick={() => setNextAction(action)}
                    className={`p-3 rounded-xl border text-xs font-medium text-left transition ${
                      nextAction === action
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    {action}
                  </button>
                ))}
              </div>
              <button
                disabled={!nextAction}
                onClick={handleFinish}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 disabled:opacity-40 text-slate-950 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Seal With Grace & Stand Up
              </button>
            </motion.div>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center flex flex-col items-center gap-3"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Your Slate Is Clean. Keep Walking.</h3>
          <p className="text-xs text-slate-300 max-w-md leading-relaxed">
            “For a just man falleth seven times, and riseth up again.” — Proverbs 24:16.
            You recognized that <strong className="text-amber-300">{unmetNeed}</strong> was triggering you.
            Your immediate next step is: <strong className="text-emerald-300">{nextAction}</strong>.
          </p>
          <button
            onClick={handleReset}
            className="mt-2 px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Done
          </button>
        </motion.div>
      )}
    </div>
  );
};
