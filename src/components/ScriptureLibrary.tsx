import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Sparkles, Brain, Check, Copy, Heart } from 'lucide-react';
import { SCRIPTURES_DATA } from '../data/scriptures';
import { sound } from '../utils/sound';

export const ScriptureLibrary: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(SCRIPTURES_DATA[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const selected = SCRIPTURES_DATA.find(s => s.id === selectedId) || SCRIPTURES_DATA[0];

  const handleCopy = (s: typeof selected) => {
    sound.playChime(500);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${s.reference}: "${s.text}" — ${s.theme}`);
      setCopiedId(s.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div id="scripture-library-card" className="w-full max-w-4xl mx-auto bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div>
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" /> Research Page 16: Christian Scripture & Spirituality
          </span>
          <h2 className="text-xl font-bold text-white mt-0.5">Biblical Recovery Scriptures</h2>
          <p className="text-xs text-slate-400">
            God’s Word paired with clinical neuroscience insights for renewing the mind.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {/* Scripture List Pills */}
        <div className="flex flex-col gap-2 max-h-[440px] overflow-y-auto pr-1 no-scrollbar">
          {SCRIPTURES_DATA.map(item => (
            <button
              key={item.id}
              onClick={() => { sound.playChime(420); setSelectedId(item.id); }}
              className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                selectedId === item.id
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md shadow-amber-500/10'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:text-white'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-xs font-serif-biblical text-amber-300">
                  {item.reference}
                </span>
                <span className="text-[10px] text-slate-400">Read</span>
              </div>
              <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                {item.text}
              </p>
            </button>
          ))}
        </div>

        {/* Selected Scripture Detail View */}
        <div className="md:col-span-2 p-6 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <span className="text-xs font-bold text-amber-400 font-serif-biblical tracking-wide">
                  {selected.reference}
                </span>
                <h3 className="text-sm font-extrabold text-white mt-0.5">
                  {selected.theme}
                </h3>
              </div>
              <button
                onClick={() => handleCopy(selected)}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold"
                title="Copy verse"
              >
                {copiedId === selected.id ? (
                  <><Check className="w-3.5 h-3.5 text-emerald-400" /> Copied</>
                ) : (
                  <><Copy className="w-3.5 h-3.5" /> Copy</>
                )}
              </button>
            </div>

            {/* Sacred Verse Text */}
            <blockquote className="p-4 rounded-xl bg-amber-500/10 border-l-4 border-amber-400 text-amber-100 text-sm font-serif-biblical italic leading-relaxed mb-5 shadow-inner">
              “{selected.text}”
            </blockquote>

            {/* Neuro-Link Breakdown */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 mb-4">
              <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 shrink-0">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-cyan-300 block mb-0.5">Neuroscience & Clinical Link:</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selected.neuroscienceLink}
                </p>
              </div>
            </div>

            {/* Practical Action */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-300 block mb-0.5">Practical Today Action:</span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {selected.practicalAction}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Reference in Clinical Synthesis:</span>
            <span className="text-amber-300 font-medium">{selected.evidenceRef}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
