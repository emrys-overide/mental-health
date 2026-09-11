import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Trophy, Flame, Shield, Sparkles, RefreshCw, 
  Play, Volume2, VolumeX, CheckCircle, Brain,
  Heart, Compass
} from 'lucide-react';
import { sound } from '../utils/sound';

interface TargetItem {
  id: number;
  text: string;
  isVirtue: boolean;
  scripture?: string;
  explanation: string;
  x: number; // percentage 10 - 85
  y: number; // percentage 10 - 80
  color: string;
}

const VIRTUE_TERMS = [
  { text: 'Self-Control', scripture: 'Galatians 5:23', exp: 'Fruit of the Spirit: empowers self-mastery' },
  { text: 'Renew Mind', scripture: 'Romans 12:2', exp: 'Neuroplasticity: actively rewires pathways' },
  { text: 'No Condemnation', scripture: 'Romans 8:1', exp: 'Freedom in Christ kills toxic shame' },
  { text: 'Escape Route', scripture: '1 Cor 10:13', exp: 'God always provides a clean exit' },
  { text: 'Pure & Lovely', scripture: 'Philippians 4:8', exp: 'Cognitive reframing: fill mind with light' },
  { text: 'Guard The Heart', scripture: 'Proverbs 4:23', exp: 'Attention filter protects life’s fountain' },
  { text: 'Peace', scripture: 'Galatians 5:22', exp: 'Calms amygdala stress signals' },
  { text: 'Living Hope', scripture: '1 Peter 1:3', exp: 'Drives dopamine toward true purpose' },
  { text: 'Diligence', scripture: 'Proverbs 13:4', exp: 'Active agency replaces passive consumption' },
  { text: 'Flee into Light', scripture: '2 Timothy 2:22', exp: 'Move away from cues into connection' }
];

const TRAP_TERMS = [
  { text: 'Late-Night Scroll', exp: 'Fatigue lowers prefrontal inhibition' },
  { text: 'Just One Peek', exp: 'Dopamine seeking loop traps the ventral striatum' },
  { text: 'Numb The Pain', exp: 'Avoidance reinforces negative cycles' },
  { text: 'Toxic Shame', exp: 'Cortisol spike that triggers relapse cravings' },
  { text: 'I Deserve It', exp: 'Rationalization of dorsal striatum habit' },
  { text: 'Total Isolation', exp: 'Secrecy magnifies compulsive urgency' },
  { text: 'Giving Up Now', exp: 'All-or-nothing cognitive distortion' }
];

const VIRTUE_COLORS = [
  'from-emerald-500 to-teal-600 border-emerald-400/60 shadow-emerald-500/30',
  'from-cyan-500 to-blue-600 border-cyan-400/60 shadow-cyan-500/30',
  'from-amber-500 to-yellow-600 border-amber-400/60 shadow-amber-500/30',
  'from-violet-500 to-indigo-600 border-violet-400/60 shadow-violet-500/30',
  'from-sky-500 to-blue-600 border-sky-400/60 shadow-sky-500/30'
];

export const MindGame: React.FC = () => {
  const [gameMode, setGameMode] = useState<'reflex' | 'surfer'>('reflex');
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  
  // Reflex Game States
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [highestCombo, setHighestCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [activeItems, setActiveItems] = useState<TargetItem[]>([]);
  const [recentMessage, setRecentMessage] = useState<{ text: string; positive: boolean } | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Urge Surfer States
  const [surferPosition, setSurferPosition] = useState(50); // 0 - 100%
  const [waveHeight, setWaveHeight] = useState(30);
  const [surfScore, setSurfScore] = useState(0);
  const [surfTime, setSurfTime] = useState(40);
  const [collectedPearls, setCollectedPearls] = useState<string[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const itemSpawnRef = useRef<NodeJS.Timeout | null>(null);

  const toggleSound = () => {
    const isMuted = sound.toggleMute();
    setSoundEnabled(!isMuted);
  };

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#38BDF8', '#F59E0B', '#8B5CF6']
      });
    } catch {
      // fallback
    }
  };

  // Spawn an item in Reflex Game
  const spawnItem = useCallback(() => {
    const isVirtue = Math.random() > 0.35; // 65% virtue, 35% trap
    let itemData: TargetItem;

    const x = Math.floor(Math.random() * 72) + 12; // 12% - 84%
    const y = Math.floor(Math.random() * 60) + 18; // 18% - 78%

    if (isVirtue) {
      const template = VIRTUE_TERMS[Math.floor(Math.random() * VIRTUE_TERMS.length)];
      const color = VIRTUE_COLORS[Math.floor(Math.random() * VIRTUE_COLORS.length)];
      itemData = {
        id: Date.now() + Math.random(),
        text: template.text,
        isVirtue: true,
        scripture: template.scripture,
        explanation: template.exp,
        x,
        y,
        color
      };
    } else {
      const template = TRAP_TERMS[Math.floor(Math.random() * TRAP_TERMS.length)];
      itemData = {
        id: Date.now() + Math.random(),
        text: template.text,
        isVirtue: false,
        explanation: template.exp,
        x,
        y,
        color: 'from-rose-600 to-red-800 border-rose-400/60 shadow-rose-600/30'
      };
    }

    setActiveItems(prev => {
      // Keep max 4 items at once on screen
      const filtered = prev.slice(-3);
      return [...filtered, itemData];
    });
  }, []);

  // Handle Reflex Tap
  const handleItemClick = (item: TargetItem) => {
    if (gameState !== 'playing') return;

    if (item.isVirtue) {
      // Correct prefrontal hit!
      sound.playChime(440 + combo * 30);
      const points = 100 * (1 + Math.floor(combo / 3));
      setScore(s => s + points);
      setCombo(c => {
        const next = c + 1;
        if (next > highestCombo) setHighestCombo(next);
        if (next % 5 === 0) {
          sound.playVictoryChord();
        }
        return next;
      });
      setRecentMessage({
        text: `+${points} ${item.text} (${item.scripture || 'Truth'})`,
        positive: true
      });
    } else {
      // Tapped a trap! Inhibit failure
      sound.playSoftThud();
      setCombo(0);
      setScore(s => Math.max(0, s - 50));
      setRecentMessage({
        text: `TRAP! Avoid "${item.text}" — ${item.explanation}`,
        positive: false
      });
    }

    // Remove tapped item
    setActiveItems(prev => prev.filter(i => i.id !== item.id));
  };

  // Start Reflex Game
  const startReflexGame = () => {
    setScore(0);
    setCombo(0);
    setHighestCombo(0);
    setTimeLeft(30);
    setActiveItems([]);
    setRecentMessage(null);
    setGameState('playing');
    sound.playZenBowl();
  };

  // Reflex Game loop
  useEffect(() => {
    if (gameMode === 'reflex' && gameState === 'playing') {
      // Spawn timer
      itemSpawnRef.current = setInterval(() => {
        spawnItem();
      }, 950);

      // Countdown timer
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            clearInterval(itemSpawnRef.current!);
            setGameState('gameover');
            sound.playVictoryChord();
            triggerConfetti();
            return 0;
          }
          return t - 1;
        });
      }, 1000);

      return () => {
        if (itemSpawnRef.current) clearInterval(itemSpawnRef.current);
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [gameMode, gameState, spawnItem]);

  // Urge Surfer Wave Loop
  useEffect(() => {
    if (gameMode === 'surfer' && gameState === 'playing') {
      const interval = setInterval(() => {
        setSurfTime(prevTime => {
          if (prevTime <= 1) {
            clearInterval(interval);
            setGameState('gameover');
            sound.playVictoryChord();
            triggerConfetti();
            return 0;
          }

          // Wave changes height dynamically
          const wavePhase = (40 - prevTime) / 40; // 0 to 1
          // Wave peaks in the middle (simulating urge rise and fall)
          const targetWave = 25 + Math.sin(wavePhase * Math.PI) * 55;
          setWaveHeight(targetWave);

          // Check if surfer is balanced near wave crest (within ±18%)
          setSurferPosition(curr => {
            const distance = Math.abs(curr - targetWave);
            if (distance < 20) {
              setSurfScore(s => s + 15);
              if (Math.random() > 0.85) {
                sound.playChime(600);
              }
            }
            return curr;
          });

          return prevTime - 1;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [gameMode, gameState]);

  const startSurferGame = () => {
    setSurfScore(0);
    setSurfTime(40);
    setCollectedPearls([]);
    setSurferPosition(50);
    setWaveHeight(30);
    setGameState('playing');
    sound.playZenBowl();
  };

  return (
    <div id="mind-game-root" className="w-full max-w-4xl mx-auto flex flex-col items-center">
      {/* Game Mode Switcher Header */}
      <div className="w-full flex items-center justify-between p-4 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
            <Brain className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              Prefrontal Mind Trainer
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium border border-emerald-500/30">
                Cognitive Science + Scripture
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Engage your prefrontal cortex to actively inhibit impulsive dopamine loops.
            </p>
          </div>
        </div>

        {/* Audio and Mode Controls */}
        <div className="flex items-center gap-2">
          <button
            id="toggle-sound-btn"
            onClick={toggleSound}
            className="p-2 rounded-xl bg-slate-800/90 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            title={soundEnabled ? 'Mute audio' : 'Unmute audio'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
          </button>

          <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              id="mode-reflex-tab"
              onClick={() => { setGameMode('reflex'); setGameState('idle'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                gameMode === 'reflex'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Reflex Shield (30s)
            </button>
            <button
              id="mode-surfer-tab"
              onClick={() => { setGameMode('surfer'); setGameState('idle'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                gameMode === 'surfer'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Urge Wave Surfer
            </button>
          </div>
        </div>
      </div>

      {/* GAME 1: REFLEX SHIELD */}
      {gameMode === 'reflex' && (
        <div className="w-full bg-gradient-to-b from-slate-900/90 to-slate-950/90 rounded-3xl border border-slate-800/80 p-5 shadow-2xl relative overflow-hidden flex flex-col min-h-[500px]">
          {/* Top Bar Score & Timer */}
          <div className="flex items-center justify-between border-b border-slate-800/70 pb-3 mb-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-amber-400">
                <Trophy className="w-4 h-4" />
                <span className="text-sm font-bold text-white tracking-wider">{score}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Flame className={`w-4 h-4 ${combo > 2 ? 'animate-bounce text-amber-400' : ''}`} />
                <span className="text-xs font-semibold">
                  Streak: <strong className="text-white">{combo}x</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Time:</span>
              <div className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                timeLeft <= 5 
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                  : 'bg-slate-800 text-cyan-300 border-cyan-500/30'
              }`}>
                {timeLeft}s
              </div>
            </div>
          </div>

          {/* Micro message feedback alert */}
          <div className="h-6 flex items-center justify-center mb-1">
            <AnimatePresence mode="wait">
              {recentMessage && (
                <motion.div
                  key={recentMessage.text}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`text-xs font-semibold px-3 py-0.5 rounded-full ${
                    recentMessage.positive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {recentMessage.text}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* PLAYING ARENA */}
          {gameState === 'playing' && (
            <div className="relative flex-1 w-full min-h-[380px] bg-slate-950/60 rounded-2xl border border-slate-800/60 overflow-hidden select-none">
              {/* Subtle ambient grid lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:2.5rem_2.5rem]" />

              {/* Spawned items */}
              {activeItems.map(item => (
                <motion.button
                  key={item.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                  onClick={() => handleItemClick(item)}
                  style={{
                    left: `${item.x}%`,
                    top: `${item.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  className={`absolute px-4 py-2.5 rounded-2xl text-xs font-bold text-white shadow-lg border backdrop-blur-sm cursor-pointer transition-transform active:scale-90 hover:scale-105 bg-gradient-to-r ${item.color}`}
                >
                  <div className="flex items-center gap-1.5">
                    {item.isVirtue ? <Shield className="w-3.5 h-3.5 text-white" /> : <Flame className="w-3.5 h-3.5 text-rose-200" />}
                    <span>{item.text}</span>
                  </div>
                  {item.scripture && (
                    <div className="text-[10px] text-white/80 font-normal mt-0.5">
                      {item.scripture}
                    </div>
                  )}
                </motion.button>
              ))}

              {/* Instructions banner at bottom */}
              <div className="absolute bottom-2 inset-x-4 flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800">
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" /> Tap Virtues & Scripture
                </span>
                <span className="flex items-center gap-1 text-rose-400">
                  ✕ DO NOT tap Cues or Traps!
                </span>
              </div>
            </div>
          )}

          {/* IDLE SCREEN */}
          {gameState === 'idle' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-slate-950/40 rounded-2xl border border-slate-800/40">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 mb-4 shadow-xl shadow-emerald-500/20">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Prefrontal Reflex Challenge</h3>
              <p className="text-sm text-slate-300 max-w-md mb-6 leading-relaxed">
                In compulsive moments, the automatic brain (<em className="text-amber-300">dorsal striatum</em>) acts before you think.
                This 30-second reflex game engages your <strong className="text-emerald-400">Prefrontal Cortex</strong> by requiring you to tap Scripture virtues while inhibiting the urge to touch impulse traps!
              </p>

              <div className="grid grid-cols-2 gap-3 max-w-sm w-full mb-6 text-xs text-left">
                <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-xl text-emerald-300">
                  <span className="font-bold block mb-1">TAP:</span>
                  Self-Control, Renew Mind, No Condemnation, Proverbs 4:23, Peace
                </div>
                <div className="p-3 bg-rose-950/40 border border-rose-800/40 rounded-xl text-rose-300">
                  <span className="font-bold block mb-1">AVOID:</span>
                  Late-Night Scroll, Just One Peek, Toxic Shame, Numb The Pain
                </div>
              </div>

              <button
                id="start-reflex-game-btn"
                onClick={startReflexGame}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-extrabold text-sm tracking-wide shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition cursor-pointer flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                Start 30s Brain Sprint
              </button>
            </div>
          )}

          {/* GAMEOVER SCREEN */}
          {gameState === 'gameover' && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-slate-950/80 rounded-2xl border border-slate-800"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 mb-3 shadow-xl shadow-amber-500/30 animate-bounce">
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white mb-1">Prefrontal Shield Activated!</h3>
              <p className="text-xs text-emerald-400 font-medium mb-4">
                Research: Deliberate response inhibition reinforces prefrontal self-control circuitry.
              </p>

              <div className="flex gap-6 bg-slate-900/90 px-6 py-4 rounded-2xl border border-slate-800 mb-5">
                <div>
                  <span className="text-[11px] text-slate-400 block uppercase">Final Score</span>
                  <span className="text-2xl font-black text-white">{score}</span>
                </div>
                <div className="w-px bg-slate-800" />
                <div>
                  <span className="text-[11px] text-slate-400 block uppercase">Max Streak</span>
                  <span className="text-2xl font-black text-amber-400">{highestCombo}x</span>
                </div>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 max-w-md text-xs text-slate-300 italic mb-5">
                “I can do all things through Christ which strengtheneth me.” — Philippians 4:13
              </div>

              <button
                id="play-again-btn"
                onClick={startReflexGame}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs flex items-center gap-2 hover:scale-105 active:scale-95 transition cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" /> Play Again
              </button>
            </motion.div>
          )}
        </div>
      )}

      {/* GAME 2: URGE WAVE SURFER */}
      {gameMode === 'surfer' && (
        <div className="w-full bg-gradient-to-b from-slate-900/90 to-slate-950/90 rounded-3xl border border-slate-800/80 p-5 shadow-2xl flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between border-b border-slate-800/70 pb-3 mb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-cyan-400" /> Urge Wave Surfing
              </h3>
              <p className="text-[11px] text-slate-400">
                ACT & Mindfulness research: Urges peak like an ocean wave. Ride the crest with balance until it recedes!
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-cyan-400 font-bold">Score: {surfScore}</span>
              <div className="px-3 py-1 rounded-full text-xs font-extrabold bg-slate-800 text-cyan-300 border border-cyan-500/30">
                {surfTime}s
              </div>
            </div>
          </div>

          {gameState === 'playing' ? (
            <div className="flex-1 flex flex-col justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800 relative select-none">
              {/* Wave visualization */}
              <div className="relative h-44 w-full bg-gradient-to-b from-slate-900 to-cyan-950/50 rounded-xl overflow-hidden border border-cyan-900/40 flex items-end">
                {/* Ocean Wave SVG */}
                <svg className="w-full h-full absolute inset-0 preserve-3d" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path
                    d={`M 0 100 L 0 ${100 - waveHeight} Q 25 ${100 - waveHeight - 15} 50 ${100 - waveHeight} T 100 ${100 - waveHeight} L 100 100 Z`}
                    fill="url(#waveGradient)"
                    className="transition-all duration-300 ease-out"
                  />
                  <defs>
                    <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Surfer Marker */}
                <motion.div
                  className="absolute z-10 flex flex-col items-center"
                  style={{
                    left: `${surferPosition}%`,
                    bottom: `${Math.min(85, Math.max(10, waveHeight + 5))}%`,
                    transform: 'translateX(-50%)'
                  }}
                  animate={{
                    rotate: (surferPosition - 50) * 0.4
                  }}
                >
                  <div className="w-10 h-10 rounded-full bg-cyan-400 border-2 border-white shadow-lg shadow-cyan-400/50 flex items-center justify-center text-slate-950 font-bold text-xs">
                    🏄
                  </div>
                  <span className="text-[10px] font-bold text-cyan-200 mt-1 bg-slate-900/80 px-2 py-0.5 rounded-full">
                    Balance: {Math.abs(surferPosition - waveHeight) < 18 ? 'Surfing!' : 'Unsteady'}
                  </span>
                </motion.div>
              </div>

              {/* Surfer Slider / Control */}
              <div className="mt-4 p-4 bg-slate-900/80 rounded-2xl border border-slate-800 flex flex-col gap-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>← Lean Calm (Breathe In)</span>
                  <span className="text-white font-semibold">Slide to Match the Wave Peak</span>
                  <span>Lean Resolve (Breathe Out) →</span>
                </div>
                <input
                  id="surfer-slider"
                  type="range"
                  min="10"
                  max="90"
                  value={surferPosition}
                  onChange={e => setSurferPosition(Number(e.target.value))}
                  className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="text-center text-xs text-slate-400 mt-2">
                Notice: The craving sensations rise, crest, and naturally collapse without you obeying them!
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-slate-950/40 rounded-2xl border border-slate-800/40">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-slate-950 mb-4 shadow-xl shadow-cyan-500/20">
                <Compass className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Urge Surfing Balance</h3>
              <p className="text-sm text-slate-300 max-w-md mb-6 leading-relaxed">
                Neuroscience & ACT research shows cravings are temporary neurochemical spikes.
                Instead of fighting or succumbing, <strong>surf the crest</strong> by maintaining steady awareness as the wave peaks and dissipates.
              </p>
              <button
                id="start-surfer-game-btn"
                onClick={startSurferGame}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-slate-950 font-extrabold text-sm tracking-wide shadow-lg shadow-cyan-500/30 hover:scale-105 active:scale-95 transition cursor-pointer flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                Start Urge Surfing
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
