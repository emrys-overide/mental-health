import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, CheckCircle, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';
import { IfThenPlan } from '../types';
import { sound } from '../utils/sound';

const PRESET_TRIGGERS = [
  'I find myself scrolling late at night in bed',
  'I feel stressed, overwhelmed or exhausted from work/school',
  'I experience loneliness or feeling rejected',
  'I get a random pop-up or unexpected trigger while browsing',
  'I am bored alone in my room with a locked door'
];

const PRESET_ACTIONS = [
  'Turn off phone, leave it outside bedroom, and pray Psalm 23',
  'Drink a tall glass of ice water and do 10 slow pushups',
  'Send a message to my accountability partner or friend',
  'Step outside for 3 minutes and breathe in the fresh air',
  'Open the Prefrontal Reflex game and play for 60 seconds'
];

const PRESET_SCRIPTURES = [
  '1 Corinthians 10:13 (God makes a way to escape)',
  'Romans 12:2 (Renewing of your mind)',
  'Proverbs 4:23 (Guard your heart with all diligence)',
  'Philippians 4:8 (Think on whatsoever things are pure & lovely)',
  '2 Timothy 2:22 (Flee youthful lusts, pursue peace)'
];

export const IfThenBuilder: React.FC = () => {
  const [plans, setPlans] = useState<IfThenPlan[]>(() => {
    const saved = localStorage.getItem('recovery_if_then_plans');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [
      {
        id: 'plan-default-1',
        trigger: 'I find myself scrolling late at night in bed',
        action: 'Turn off phone, leave it outside bedroom, and pray Psalm 23',
        scripture: 'Proverbs 4:23 (Guard your heart with all diligence)',
        createdAt: new Date().toLocaleDateString()
      },
      {
        id: 'plan-default-2',
        trigger: 'I feel stressed, overwhelmed or exhausted',
        action: 'Drink a tall glass of ice water and do 10 slow pushups',
        scripture: '1 Corinthians 10:13 (God makes a way to escape)',
        createdAt: new Date().toLocaleDateString()
      }
    ];
  });

  const [selectedTrigger, setSelectedTrigger] = useState(PRESET_TRIGGERS[0]);
  const [customTrigger, setCustomTrigger] = useState('');
  const [selectedAction, setSelectedAction] = useState(PRESET_ACTIONS[0]);
  const [customAction, setCustomAction] = useState('');
  const [selectedScripture, setSelectedScripture] = useState(PRESET_SCRIPTURES[0]);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    localStorage.setItem('recovery_if_then_plans', JSON.stringify(plans));
  }, [plans]);

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTrigger = customTrigger.trim() || selectedTrigger;
    const finalAction = customAction.trim() || selectedAction;

    if (!finalTrigger || !finalAction) return;

    sound.playVictoryChord();
    const newPlan: IfThenPlan = {
      id: 'plan-' + Date.now(),
      trigger: finalTrigger,
      action: finalAction,
      scripture: selectedScripture,
      createdAt: new Date().toLocaleDateString()
    };

    setPlans(prev => [newPlan, ...prev]);
    setCustomTrigger('');
    setCustomAction('');
    setIsAdding(false);
  };

  const handleDeletePlan = (id: string) => {
    sound.playSoftThud();
    setPlans(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div id="if-then-plans-container" className="w-full max-w-2xl mx-auto bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
        <div>
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Evidence-Informed Planning (Sheeran et al. 2025)
          </span>
          <h2 className="text-xl font-bold text-white mt-0.5">If–Then Action Blueprints</h2>
          <p className="text-xs text-slate-400">
            Meta-analysis of 642 tests shows pre-committing to an automated alternative breaks habitual relapse loops.
          </p>
        </div>

        <button
          id="toggle-add-plan-btn"
          onClick={() => setIsAdding(!isAdding)}
          className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
        >
          {isAdding ? 'Close Form' : <><Plus className="w-3.5 h-3.5" /> New Blueprint</>}
        </button>
      </div>

      {/* Plan Builder Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreatePlan}
            className="overflow-hidden mb-6 p-5 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-col gap-4 text-left"
          >
            <div>
              <label className="text-xs font-bold text-rose-400 flex items-center gap-1.5 mb-1.5">
                <ShieldAlert className="w-3.5 h-3.5" /> IF (Cue or Trigger occurs):
              </label>
              <select
                id="preset-trigger-select"
                value={selectedTrigger}
                onChange={e => setSelectedTrigger(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 mb-2 focus:border-amber-400 outline-none"
              >
                {PRESET_TRIGGERS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <input
                id="custom-trigger-input"
                type="text"
                placeholder="Or type a specific personal trigger..."
                value={customTrigger}
                onChange={e => setCustomTrigger(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 focus:border-amber-400 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-1.5">
                <CheckCircle className="w-3.5 h-3.5" /> THEN (My Concrete Alternative Action):
              </label>
              <select
                id="preset-action-select"
                value={selectedAction}
                onChange={e => setSelectedAction(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 mb-2 focus:border-amber-400 outline-none"
              >
                {PRESET_ACTIONS.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
              <input
                id="custom-action-input"
                type="text"
                placeholder="Or type an immediate healthy physical action..."
                value={customAction}
                onChange={e => setCustomAction(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 focus:border-amber-400 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5 mb-1.5">
                <BookOpen className="w-3.5 h-3.5" /> SCRIPTURE ANCHOR:
              </label>
              <select
                id="scripture-anchor-select"
                value={selectedScripture}
                onChange={e => setSelectedScripture(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 focus:border-amber-400 outline-none"
              >
                {PRESET_SCRIPTURES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <button
              id="save-plan-submit-btn"
              type="submit"
              className="mt-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-bold text-xs hover:opacity-90 transition cursor-pointer"
            >
              Save & Rehearse Blueprint
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Saved Blueprints List */}
      <div className="flex flex-col gap-3">
        {plans.map(plan => (
          <div
            key={plan.id}
            className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition text-left flex items-start justify-between gap-3 shadow-md"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  IF TRIGGER
                </span>
                <span className="text-xs font-semibold text-slate-200">{plan.trigger}</span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  THEN ACTION
                </span>
                <span className="text-xs font-bold text-white">{plan.action}</span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-amber-300 font-serif-biblical italic">
                <BookOpen className="w-3 h-3 text-amber-400" />
                {plan.scripture}
              </div>
            </div>

            <button
              onClick={() => handleDeletePlan(plan.id)}
              className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition"
              title="Delete plan"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
