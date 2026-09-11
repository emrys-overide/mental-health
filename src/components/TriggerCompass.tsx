import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, BookOpen, Brain, Sparkles, Check, ArrowRight } from 'lucide-react';
import { sound } from '../utils/sound';

interface TriggerOption {
  id: string;
  name: string;
  icon: string;
  scriptureRef: string;
  scriptureText: string;
  brainInsight: string;
  antidote: string;
}

const TRIGGERS: TriggerOption[] = [
  {
    id: 'loneliness',
    name: 'Loneliness / Isolation',
    icon: '🫂',
    scriptureRef: 'James 5:16 & Galatians 6:2',
    scriptureText: '“Bear ye one another’s burdens, and so fulfil the law of Christ.”',
    brainInsight: 'Social isolation drops oxytocin, prompting the ventral striatum to seek synthetic hyper-stimulus. Real human connection cures the deficit.',
    antidote: 'Send a genuine voice message to a friend, or pray for someone else in need right now.'
  },
  {
    id: 'exhaustion',
    name: 'Late-Night Fatigue / Sleep Loss',
    icon: '🌙',
    scriptureRef: 'Psalm 127:2',
    scriptureText: '“It is vain for you to rise up early, to sit up late... for so he giveth his beloved sleep.”',
    brainInsight: 'Research shows sleep-deprived brains experience up to 40% decreased prefrontal inhibitory capacity. Cravings at 1 AM are biology, not spiritual failure.',
    antidote: 'Charge your phone in another room or kitchen, shut your eyes, and pray Psalm 4:8.'
  },
  {
    id: 'boredom',
    name: 'Boredom & Mindless Scroll',
    icon: '⚡',
    scriptureRef: 'Philippians 4:8',
    scriptureText: '“Think on whatsoever things are true, honest, just, pure, lovely...”',
    brainInsight: 'The brain seeks dopamine when under-stimulated. Mindless scrolling creates an unpredictable reward loop (like a slot machine).',
    antidote: 'Switch to our Prefrontal Reflex Game, or start a creative 5-minute task with your hands.'
  },
  {
    id: 'stress',
    name: 'Anxiety, Work & School Pressure',
    icon: '🌧️',
    scriptureRef: 'Philippians 4:6-7',
    scriptureText: '“Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.”',
    brainInsight: 'Cortisol stimulates the urge to self-medicate or numb out. Physiological breathing (extended exhale) stimulates the vagus nerve.',
    antidote: 'Take 4 slow physiological sighs (double inhale, long slow sigh out) and launch the 60s Urge Pause.'
  },
  {
    id: 'spiritual',
    name: 'Spiritual Dryness / Condemnation',
    icon: '🕊️',
    scriptureRef: 'Romans 8:1-2',
    scriptureText: '“There is therefore now no condemnation to them which are in Christ Jesus.”',
    brainInsight: 'Moral incongruence and religious guilt can paradoxically fuel obsessive cycles (scrupulosity). True grace restores emotional peace.',
    antidote: 'Rest in Christ’s finished work. You are loved unconditionally, not based on your performance.'
  }
];

export const TriggerCompass: React.FC<{ onOpenPause: () => void }> = ({ onOpenPause }) => {
  const [selectedId, setSelectedId] = useState<string>(TRIGGERS[0].id);

  const selectedTrigger = TRIGGERS.find(t => t.id === selectedId) || TRIGGERS[0];

  const handleSelect = (id: string) => {
    sound.playChime(480);
    setSelectedId(id);
  };

  return (
    <div id="trigger-compass-card" className="w-full max-w-2xl mx-auto bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
        <div>
          <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" /> Research Page 8: Internal Cue Mapping
          </span>
          <h2 className="text-xl font-bold text-white mt-0.5">Emotion & Trigger Compass</h2>
          <p className="text-xs text-slate-400">
            Identify the exact internal cue driving the urge and apply the clinical & biblical antidote.
          </p>
        </div>
      </div>

      {/* Trigger Selector Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TRIGGERS.map(t => (
          <button
            key={t.id}
            onClick={() => handleSelect(t.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
              selectedId === t.id
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.name}</span>
          </button>
        ))}
      </div>

      {/* Detail Content Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTrigger.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-left flex flex-col gap-4"
        >
          {/* Scripture Anchor */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <div className="flex items-center gap-1.5 font-bold text-amber-300 text-xs mb-1">
              <BookOpen className="w-4 h-4" />
              {selectedTrigger.scriptureRef}
            </div>
            <p className="italic text-xs text-slate-200 leading-relaxed font-serif-biblical">
              {selectedTrigger.scriptureText}
            </p>
          </div>

          {/* Neuro Insight */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 shrink-0 mt-0.5">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-cyan-300 block mb-0.5">What’s Happening in the Brain:</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedTrigger.brainInsight}
              </p>
            </div>
          </div>

          {/* Antidote & Action */}
          <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-emerald-300 block mb-0.5">Immediate Antidote:</span>
              <p className="text-xs text-slate-200">
                {selectedTrigger.antidote}
              </p>
            </div>

            <button
              id="trigger-pause-now-btn"
              onClick={onOpenPause}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              Start 60s Urge Pause <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
