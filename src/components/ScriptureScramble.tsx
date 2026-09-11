import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, RefreshCw, CheckCircle2, BookOpen, Lightbulb } from 'lucide-react';
import { sound } from '../utils/sound';

interface ScripturePuzzle {
  reference: string;
  fullVerse: string;
  words: string[];
  hint: string;
  neuroNote: string;
}

const PUZZLES: ScripturePuzzle[] = [
  {
    reference: 'Romans 8:1',
    fullVerse: 'There is therefore now no condemnation to them which are in Christ Jesus',
    words: ['There', 'is', 'therefore', 'now', 'no', 'condemnation', 'to', 'them', 'which', 'are', 'in', 'Christ', 'Jesus'],
    hint: 'Freedom from guilt and toxic shame',
    neuroNote: 'Activating grace de-escalates amygdala distress and prevents relapse.'
  },
  {
    reference: 'Proverbs 4:23',
    fullVerse: 'Keep thy heart with all diligence for out of it are the issues of life',
    words: ['Keep', 'thy', 'heart', 'with', 'all', 'diligence', 'for', 'out', 'of', 'it', 'are', 'the', 'issues', 'of', 'life'],
    hint: 'Guarding what enters your eyes and ears',
    neuroNote: 'Visual attention gates dorsal striatum habits. Guarding your focus stops the cue loop.'
  },
  {
    reference: 'Philippians 4:8',
    fullVerse: 'Whatsoever things are true pure lovely think on these things',
    words: ['Whatsoever', 'things', 'are', 'true', 'pure', 'lovely', 'think', 'on', 'these', 'things'],
    hint: 'Renewing thoughts with high-virtue focus',
    neuroNote: 'Attentional displacement: the brain cannot stay empty, it must be filled with good.'
  },
  {
    reference: '1 Corinthians 10:13',
    fullVerse: 'God is faithful who will also make a way to escape',
    words: ['God', 'is', 'faithful', 'who', 'will', 'also', 'make', 'a', 'way', 'to', 'escape'],
    hint: 'There is always an immediate action choice',
    neuroNote: 'Prefrontal agency: realizing you are not trapped restores impulse control.'
  }
];

export const ScriptureScramble: React.FC = () => {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const currentPuzzle = PUZZLES[puzzleIndex];

  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isSolved, setIsSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Initialize randomized words
  useEffect(() => {
    resetPuzzle(puzzleIndex);
  }, [puzzleIndex]);

  const resetPuzzle = (index: number) => {
    const puzzle = PUZZLES[index];
    // Shuffle words
    const shuffled = [...puzzle.words].sort(() => Math.random() - 0.5);
    setAvailableWords(shuffled);
    setSelectedWords([]);
    setIsSolved(false);
    setShowHint(false);
  };

  const handleSelectWord = (word: string, index: number) => {
    sound.playChime(500 + selectedWords.length * 30);
    const newSelected = [...selectedWords, word];
    const newAvailable = availableWords.filter((_, i) => i !== index);

    setSelectedWords(newSelected);
    setAvailableWords(newAvailable);

    // Check if solved
    if (newAvailable.length === 0) {
      const constructed = newSelected.join(' ');
      if (constructed.toLowerCase() === currentPuzzle.fullVerse.toLowerCase()) {
        setIsSolved(true);
        sound.playVictoryChord();
        try {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        } catch {
          // ignore
        }
      } else {
        sound.playSoftThud();
      }
    }
  };

  const handleRemoveWord = (word: string, index: number) => {
    sound.playChime(350);
    const newSelected = selectedWords.filter((_, i) => i !== index);
    setSelectedWords(newSelected);
    setAvailableWords([...availableWords, word]);
    setIsSolved(false);
  };

  const nextPuzzle = () => {
    setPuzzleIndex(prev => (prev + 1) % PUZZLES.length);
  };

  return (
    <div id="scripture-scramble-card" className="w-full bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Word of Truth Mind Puzzle
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium">
                {currentPuzzle.reference}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Engage working memory to displace cravings. Reassemble the sacred verse.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="hint-toggle-btn"
            onClick={() => setShowHint(!showHint)}
            className="p-2 rounded-xl bg-slate-800 text-amber-400 hover:bg-slate-700 transition"
            title="Hint"
          >
            <Lightbulb className="w-4 h-4" />
          </button>
          <button
            id="reset-puzzle-btn"
            onClick={() => resetPuzzle(puzzleIndex)}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            title="Reset"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showHint && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 mb-4 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 shrink-0" />
          <span><strong>Hint:</strong> {currentPuzzle.hint}</span>
        </div>
      )}

      {/* Assembly Area */}
      <div className="min-h-[90px] p-4 bg-slate-950/80 rounded-2xl border border-slate-800/80 mb-5 flex flex-wrap gap-2 items-center">
        {selectedWords.length === 0 && (
          <span className="text-xs text-slate-500 italic select-none">
            Tap the scrambled words below in order to assemble the verse...
          </span>
        )}
        {selectedWords.map((word, idx) => (
          <motion.button
            key={`${word}-${idx}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={() => handleRemoveWord(word, idx)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/30 to-amber-600/30 text-amber-200 border border-amber-500/40 text-xs font-semibold cursor-pointer hover:bg-rose-500/20 hover:border-rose-500/40 hover:text-rose-300 transition"
          >
            {word}
          </motion.button>
        ))}
      </div>

      {/* Scrambled Word Pool */}
      <div className="flex flex-wrap gap-2 mb-6">
        {availableWords.map((word, idx) => (
          <button
            key={`${word}-${idx}`}
            onClick={() => handleSelectWord(word, idx)}
            className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/60 text-xs font-medium cursor-pointer transition active:scale-95 shadow-sm"
          >
            {word}
          </button>
        ))}
      </div>

      {/* Solved State Banner */}
      {isSolved && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 mb-2"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <span className="text-xs font-bold text-emerald-300 block">Verse Complete!</span>
              <p className="text-xs text-slate-300">{currentPuzzle.neuroNote}</p>
            </div>
          </div>
          <button
            id="next-puzzle-btn"
            onClick={nextPuzzle}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition cursor-pointer shrink-0"
          >
            Next Scripture →
          </button>
        </motion.div>
      )}
    </div>
  );
};
