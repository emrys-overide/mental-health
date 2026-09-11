import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Play, Pause, RotateCcw, CheckCircle2, ShieldCheck, 
  Wind, Eye, Heart, Check, X, Sliders, Activity, 
  TrendingDown, Sparkles, ChevronRight, BookmarkCheck
} from 'lucide-react';
import { sound } from '../utils/sound';
import { saveUrgeLog, getIntensityLabel } from '../utils/urgeStorage';
import { UrgeTrendChart } from './UrgeTrendChart';

interface UrgeInterruptionProps {
  onComplete?: () => void;
  onOpenLiveVoice?: () => void;
}

const NEEDS_OPTIONS = [
  'I feel stressed and overwhelmed',
  'I feel lonely or isolated',
  'I am bored and seeking dopamine',
  'I am physically exhausted / tired',
  'I am noticing a bodily craving spike',
  'I feel spiritually discouraged'
];

const CONCRETE_ACTIONS = [
  'Walk into another room where people are',
  'Drink a tall glass of ice cold water',
  'Step outside for 3 minutes of fresh air',
  'Text or call a safe friend/mentor for encouragement',
  'Splash cold water on face (mammalian dive reflex)',
  'Do 12 slow push-ups or stretching'
];

export const UrgeInterruption: React.FC<UrgeInterruptionProps> = ({ onComplete, onOpenLiveVoice }) => {
  const [activeTab, setActiveTab] = useState<'pause' | 'trends'>('pause');
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0); // 0 to 60
  const [selectedNeed, setSelectedNeed] = useState<string>('');
  const [chosenAction, setChosenAction] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [urgeIntensity, setUrgeIntensity] = useState<number>(7);
  const [postPauseIntensity, setPostPauseIntensity] = useState<number | null>(null);
  const [logNotification, setLogNotification] = useState<string | null>(null);
  const [hasLoggedSession, setHasLoggedSession] = useState<boolean>(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 4 Evidence-based phases (Page 9 of Research):
  // Phase 1 (0-10s): Screen away & Name Need
  // Phase 2 (10-30s): Eyes-open comfortable breathing & grounding
  // Phase 3 (30-45s): Notice urge without treating as a command
  // Phase 4 (45-60s): Choose concrete next action
  let currentPhase = 1;
  if (seconds >= 10 && seconds < 30) currentPhase = 2;
  else if (seconds >= 30 && seconds < 45) currentPhase = 3;
  else if (seconds >= 45) currentPhase = 4;

  const handleIntensityChange = (newVal: number) => {
    sound.playChime(320 + newVal * 30);
    setUrgeIntensity(newVal);
  };

  const handleLogUrgeNow = (completed: boolean = false) => {
    sound.playChime(620);
    saveUrgeLog(urgeIntensity, selectedNeed, chosenAction, completed);
    setHasLoggedSession(true);
    setLogNotification(`✓ Urge intensity ${urgeIntensity}/10 logged to trends`);
    setTimeout(() => setLogNotification(null), 3500);
  };

  const startPause = () => {
    setIsActive(true);
    setIsCompleted(false);
    setPostPauseIntensity(null);
    sound.playZenBowl();
    
    // Automatically log the initial urge state if not already logged
    if (!hasLoggedSession) {
      saveUrgeLog(urgeIntensity, selectedNeed, chosenAction, false);
      setHasLoggedSession(true);
    }
  };

  const stopPause = () => {
    setIsActive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const resetPause = () => {
    stopPause();
    setSeconds(0);
    setIsCompleted(false);
    setPostPauseIntensity(null);
    setHasLoggedSession(false);
  };

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          const next = prev + 1;
          // Phase shift sound cues
          if (next === 10 || next === 30 || next === 45) {
            sound.playChime(528);
          }
          if (next >= 60) {
            clearInterval(intervalRef.current!);
            setIsActive(false);
            setIsCompleted(true);
            sound.playVictoryChord();

            // Save completed record with urge level, chosen action & need
            saveUrgeLog(urgeIntensity, selectedNeed, chosenAction, true);

            try {
              confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
            } catch {
              // ignore
            }
            if (onComplete) onComplete();
            return 60;
          }
          return next;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, onComplete, urgeIntensity, selectedNeed, chosenAction]);

  const intensityMeta = getIntensityLabel(urgeIntensity);

  return (
    <div id="urge-interruption-card" className="w-full max-w-xl mx-auto bg-slate-900/95 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
      {/* Glow background accent */}
      <div className="absolute top-0 right-1/4 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 mb-4 gap-3">
        <div>
          <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Clinical Urge Pause Protocol
          </span>
          <h2 className="text-xl font-black text-white mt-0.5">60-Second Escape Route</h2>
          <p className="text-xs text-slate-400">
            “God is faithful... will make a way to escape.” — 1 Cor 10:13
          </p>
        </div>

        {/* View Switcher: Protocol vs Trends */}
        <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 self-start sm:self-auto shrink-0 shadow-inner">
          <button
            id="urge-tab-pause-btn"
            onClick={() => { sound.playChime(420); setActiveTab('pause'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'pause'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            60s Pause
          </button>
          <button
            id="urge-tab-trends-btn"
            onClick={() => { sound.playChime(460); setActiveTab('trends'); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'trends'
                ? 'bg-cyan-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Urge Trends
          </button>
        </div>
      </div>

      {/* Toast Notification for Logged Urges */}
      <AnimatePresence>
        {logNotification && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="mb-4 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-md"
          >
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              {logNotification}
            </span>
            <button
              onClick={() => setActiveTab('trends')}
              className="text-[11px] underline text-emerald-200 hover:text-white ml-2"
            >
              View Trends →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TAB 1: 60-SECOND PROTOCOL */}
      {activeTab === 'pause' && (
        <div className="space-y-4">
          {/* URGE INTENSITY SLIDER (1 - 10) */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-slate-200">
                  Rate Urge Intensity (1 – 10)
                </span>
              </div>

              {/* Dynamic Intensity Badge */}
              <div className="flex items-center gap-1.5">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${intensityMeta.badgeBg} ${intensityMeta.color} ${intensityMeta.border}`}>
                  {urgeIntensity} / 10 — {intensityMeta.text}
                </span>
              </div>
            </div>

            {/* Slider Input */}
            <div className="relative my-2 px-1">
              <input
                id="urge-intensity-slider"
                type="range"
                min="1"
                max="10"
                step="1"
                value={urgeIntensity}
                onChange={(e) => handleIntensityChange(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            {/* Numeric Quick-Select Buttons (1 to 10) */}
            <div className="grid grid-cols-10 gap-1 mt-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                const isSelected = urgeIntensity === num;
                return (
                  <button
                    key={num}
                    id={`urge-num-btn-${num}`}
                    onClick={() => handleIntensityChange(num)}
                    className={`py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      isSelected
                        ? num <= 3
                          ? 'bg-emerald-500 text-slate-950 scale-110 shadow-md ring-2 ring-emerald-400/50'
                          : num <= 6
                          ? 'bg-amber-400 text-slate-950 scale-110 shadow-md ring-2 ring-amber-400/50'
                          : num <= 8
                          ? 'bg-orange-500 text-slate-950 scale-110 shadow-md ring-2 ring-orange-400/50'
                          : 'bg-rose-500 text-white scale-110 shadow-md ring-2 ring-rose-400/50'
                        : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>

            {/* Clinical Guidance Footnote & Quick Log Action */}
            <div className="mt-3 pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
              <p className="truncate mr-2 italic">
                {intensityMeta.desc}
              </p>

              <button
                id="log-urge-now-btn"
                onClick={() => handleLogUrgeNow(false)}
                className="shrink-0 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-[10px] font-bold flex items-center gap-1 transition active:scale-95 cursor-pointer"
                title="Save current intensity to trend history"
              >
                <BookmarkCheck className="w-3.5 h-3.5 text-cyan-400" />
                Log Level
              </button>
            </div>
          </div>

          {/* TIMER CONTROLS & RADIAL DISPLAY */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">
              {isActive ? 'Pause Running... Breathe & Ground' : 'Ready to Break the Craving Loop?'}
            </span>

            <div className="flex items-center gap-2">
              {isActive ? (
                <button
                  id="pause-timer-stop-btn"
                  onClick={stopPause}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-rose-400 hover:bg-slate-700 transition flex items-center gap-1 text-xs font-bold"
                  title="Pause exercise"
                >
                  <Pause className="w-4 h-4" /> Pause
                </button>
              ) : (
                <button
                  id="pause-timer-start-btn"
                  onClick={startPause}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs hover:bg-emerald-400 transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" /> Start 60s Escape
                </button>
              )}

              <button
                id="pause-timer-reset-btn"
                onClick={resetPause}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Radial Circle Timer */}
          <div className="flex flex-col items-center justify-center my-2">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  stroke="#1e293b"
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  stroke="#10b981"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={276}
                  strokeDashoffset={276 - (276 * seconds) / 60}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>

              {/* Center Countdown & Phase */}
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black text-white tracking-tight">
                  {60 - seconds}s
                </span>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-1">
                  Phase {currentPhase} of 4
                </span>
              </div>
            </div>

            {/* 4 Phase Indicator Tabs */}
            <div className="grid grid-cols-4 gap-1.5 w-full mt-4 text-center">
              <div className={`p-1.5 rounded-xl border text-[10px] font-semibold transition ${
                currentPhase === 1
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800'
              }`}>
                1. Name Need
              </div>
              <div className={`p-1.5 rounded-xl border text-[10px] font-semibold transition ${
                currentPhase === 2
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800'
              }`}>
                2. Ground
              </div>
              <div className={`p-1.5 rounded-xl border text-[10px] font-semibold transition ${
                currentPhase === 3
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800'
              }`}>
                3. Notice Urge
              </div>
              <div className={`p-1.5 rounded-xl border text-[10px] font-semibold transition ${
                currentPhase === 4
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800'
              }`}>
                4. Action
              </div>
            </div>
          </div>

          {/* Active Phase Content Guidance */}
          <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-2xl min-h-[135px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {currentPhase === 1 && (
                <motion.div
                  key="phase-1"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-left"
                >
                  <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wide flex items-center gap-1.5 mb-1">
                    <Wind className="w-4 h-4" /> 0–10s: Turn Away & Name The Real Need
                  </h4>
                  <p className="text-xs text-slate-300 mb-2">
                    Put your phone flat down or step back from the monitor. What is really happening inside right now?
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {NEEDS_OPTIONS.map(need => (
                      <button
                        key={need}
                        onClick={() => setSelectedNeed(need)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                          selectedNeed === need
                            ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                            : 'bg-slate-850 text-slate-300 border-slate-700 hover:text-white'
                        }`}
                      >
                        {need}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentPhase === 2 && (
                <motion.div
                  key="phase-2"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-left"
                >
                  <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wide flex items-center gap-1.5 mb-1">
                    <Eye className="w-4 h-4" /> 10–30s: Eyes-Open Grounding
                  </h4>
                  <p className="text-xs text-slate-300 mb-2 leading-relaxed">
                    Breathe naturally without forcing. Notice 3 physical objects in the room: a chair, a window, your own hands.
                    Feel your feet planted solidly on the floor. You are in the present moment, held by God.
                  </p>
                  <div className="p-2 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-cyan-300 text-xs italic">
                    “Be still, and know that I am God.” — Psalm 46:10
                  </div>
                </motion.div>
              )}

              {currentPhase === 3 && (
                <motion.div
                  key="phase-3"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-left"
                >
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1.5 mb-1">
                    <Heart className="w-4 h-4" /> 30–45s: An Urge is Not a Command
                  </h4>
                  <p className="text-xs text-slate-300 mb-2 leading-relaxed">
                    Notice the craving sensation in your body—tension, heat, or restlessness.
                    Treat it like a passing cloud or an itch: <strong>you do NOT have to obey it</strong>.
                    The urge does not need to drop to zero for you to choose freedom.
                  </p>
                  <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-800/40 text-amber-300 text-xs italic">
                    “Walk in the Spirit, and ye shall not fulfil the lust of the flesh.” — Galatians 5:16
                  </div>
                </motion.div>
              )}

              {currentPhase === 4 && (
                <motion.div
                  key="phase-4"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-left"
                >
                  <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wide flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-4 h-4" /> 45–60s: Choose One Concrete Next Step
                  </h4>
                  <p className="text-xs text-slate-300 mb-2">
                    What single healthy action will you take right this second?
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {CONCRETE_ACTIONS.map(action => (
                      <button
                        key={action}
                        onClick={() => setChosenAction(action)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                          chosenAction === action
                            ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                            : 'bg-slate-850 text-slate-300 border-slate-700 hover:text-white'
                        }`}
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Completion Banner with Post-Pause Urge Rating */}
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 flex flex-col items-center text-center gap-3 shadow-xl"
            >
              <CheckCircle2 className="w-9 h-9 text-emerald-400" />
              <div>
                <h3 className="text-base font-bold text-white">Pause Completed! You Broke The Automatic Loop.</h3>
                <p className="text-xs text-slate-300 max-w-sm mt-0.5">
                  Initial urge intensity of <strong className="text-amber-300">{urgeIntensity}/10</strong> delayed successfully.
                  {chosenAction && <span className="block font-semibold text-emerald-300 mt-1">Now do this: {chosenAction}</span>}
                </p>
              </div>

              {/* Post-Pause Urge Evaluation */}
              <div className="w-full pt-3 border-t border-emerald-900/60 text-left">
                <span className="text-[11px] font-bold text-slate-200 block mb-1.5">
                  How does the urge intensity feel now?
                </span>
                <div className="flex items-center gap-1 justify-between">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        sound.playChime(400 + num * 25);
                        setPostPauseIntensity(num);
                        saveUrgeLog(num, selectedNeed, `Post-Pause: ${chosenAction || '60s escape'}`, true);
                      }}
                      className={`flex-1 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        postPauseIntensity === num
                          ? 'bg-cyan-400 text-slate-950 font-black'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                {postPauseIntensity !== null && (
                  <div className="mt-2 text-center text-xs font-bold text-cyan-300 flex items-center justify-center gap-1">
                    <TrendingDown className="w-4 h-4 text-emerald-400" />
                    {postPauseIntensity < urgeIntensity ? (
                      <span>Urge dropped from {urgeIntensity} to {postPauseIntensity}! Dopamine craving disrupted.</span>
                    ) : (
                      <span>Urge logged at {postPauseIntensity}/10. Keep moving and stay in public view.</span>
                    )}
                  </div>
                )}
              </div>

              {/* Live Voice Companion Trigger if available */}
              {onOpenLiveVoice && (
                <button
                  onClick={() => {
                    sound.playChime(540);
                    if (onComplete) onComplete();
                    onOpenLiveVoice();
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-teal-500/20 hover:from-cyan-500/30 hover:to-teal-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Talk with Live Voice Companion (Gemini Live)</span>
                </button>
              )}

              {/* View Trends CTA */}
              <button
                onClick={() => setActiveTab('trends')}
                className="mt-1 text-xs font-bold text-emerald-300 hover:text-white underline flex items-center gap-1 cursor-pointer"
              >
                View Your Urge Intensity Trends Over Time →
              </button>
            </motion.div>
          )}
        </div>
      )}

      {/* TAB 2: URGE TRENDS & HISTORY VIEW */}
      {activeTab === 'trends' && (
        <div className="space-y-4">
          <UrgeTrendChart compact={false} />
        </div>
      )}
    </div>
  );
};

