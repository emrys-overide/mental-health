import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, Calendar as CalendarIcon, Trophy, CheckCircle2, 
  ChevronLeft, ChevronRight, Shield, Heart, Sparkles, 
  BookOpen, RefreshCw, Award, Info, AlertCircle, Compass, 
  Check, ArrowRight, Activity
} from 'lucide-react';
import { StreakData, DailyStreakRecord } from '../types';
import { 
  getStreakData, logDailyStatus, formatDateKey, 
  getMilestones, MilestoneBadge 
} from '../utils/streakStorage';
import { sound } from '../utils/sound';
import { UrgeTrendChart } from './UrgeTrendChart';

interface VictoryStreaksProps {
  onOpenSos?: () => void;
  onOpenDevotion?: () => void;
}

export const VictoryStreaks: React.FC<VictoryStreaksProps> = ({ onOpenSos, onOpenDevotion }) => {
  const [streakData, setStreakData] = useState<StreakData>(() => getStreakData());
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<string>(formatDateKey(new Date()));
  const [dailyNote, setDailyNote] = useState('');
  const [gratitudeText, setGratitudeText] = useState('');
  const [justLoggedMessage, setJustLoggedMessage] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'calendar' | 'trends' | 'milestones' | 'science'>('calendar');

  const todayKey = formatDateKey(new Date());
  const todayRecord = streakData.history[todayKey];
  const isLoggedToday = !!todayRecord;

  // Sync state from storage
  useEffect(() => {
    setStreakData(getStreakData());
  }, []);

  const milestones = getMilestones(streakData.currentStreak, streakData.longestStreak);

  // Month navigation
  const prevMonth = () => {
    sound.playChime(420);
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    sound.playChime(460);
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToCurrentMonth = () => {
    sound.playChime(500);
    setCurrentDate(new Date());
    setSelectedDay(todayKey);
  };

  // Logging handlers
  const handleLogDay = (status: 'victory' | 'urged-surfed' | 'grace-reset') => {
    if (status === 'victory') {
      sound.playChime(640);
    } else if (status === 'urged-surfed') {
      sound.playChime(560);
    } else {
      sound.playZenBowl();
    }

    const updated = logDailyStatus(
      selectedDay, 
      status, 
      dailyNote || undefined, 
      gratitudeText || undefined
    );
    setStreakData(updated);

    const message = status === 'victory'
      ? '🔥 Victory recorded! Prefrontal wiring strengthened.'
      : status === 'urged-surfed'
      ? '🌊 Urge surfed! Your dopamine receptors are healing.'
      : '🌱 Fresh start with grace! “My grace is sufficient for thee.”';
    
    setJustLoggedMessage(message);
    setTimeout(() => setJustLoggedMessage(null), 3500);
    setDailyNote('');
    setGratitudeText('');
  };

  // Calendar generation logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  // Adjust for Monday-start week: 0 (Sun) becomes 6, 1 (Mon) becomes 0
  const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;

  const calendarDays: Array<{ dateStr: string; dayNumber: number; isCurrentMonth: boolean }> = [];

  // Previous month trailing days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const d = prevMonthLastDay - i;
    const prevDate = new Date(year, month - 1, d);
    calendarDays.push({
      dateStr: formatDateKey(prevDate),
      dayNumber: d,
      isCurrentMonth: false
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const curDate = new Date(year, month, d);
    calendarDays.push({
      dateStr: formatDateKey(curDate),
      dayNumber: d,
      isCurrentMonth: true
    });
  }

  // Next month filling days to complete grid (multiples of 7)
  const remaining = (7 - (calendarDays.length % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    const nextDate = new Date(year, month + 1, d);
    calendarDays.push({
      dateStr: formatDateKey(nextDate),
      dayNumber: d,
      isCurrentMonth: false
    });
  }

  // Dynamic flame styling based on current streak
  const getFlameVisual = (days: number) => {
    if (days >= 90) {
      return {
        color: 'text-amber-300 drop-shadow-[0_0_25px_rgba(251,191,36,0.8)]',
        bg: 'bg-gradient-to-tr from-amber-500 via-yellow-400 to-emerald-400',
        label: '✨ Transcendent Neuro-Reset',
        glow: 'shadow-amber-500/50'
      };
    }
    if (days >= 60) {
      return {
        color: 'text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.7)]',
        bg: 'bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400',
        label: '🦅 Sanctuary Fire (60+ Days)',
        glow: 'shadow-emerald-500/40'
      };
    }
    if (days >= 30) {
      return {
        color: 'text-cyan-400 drop-shadow-[0_0_18px_rgba(34,211,238,0.7)]',
        bg: 'bg-gradient-to-tr from-cyan-500 via-blue-500 to-amber-400',
        label: '👑 Warrior Torch (30+ Days)',
        glow: 'shadow-cyan-500/40'
      };
    }
    if (days >= 14) {
      return {
        color: 'text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]',
        bg: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-yellow-400',
        label: '🔥 Blazing Fire (14+ Days)',
        glow: 'shadow-amber-500/30'
      };
    }
    if (days >= 7) {
      return {
        color: 'text-orange-400 drop-shadow-[0_0_12px_rgba(249,115,22,0.6)]',
        bg: 'bg-gradient-to-tr from-orange-500 to-amber-500',
        label: '⚡ Rising Flame (7+ Days)',
        glow: 'shadow-orange-500/30'
      };
    }
    if (days >= 3) {
      return {
        color: 'text-amber-400',
        bg: 'bg-gradient-to-tr from-amber-500 to-yellow-500',
        label: '🌱 Active Spark (3+ Days)',
        glow: 'shadow-amber-500/20'
      };
    }
    return {
      color: 'text-amber-500/80',
      bg: 'bg-slate-800',
      label: '✨ Freedom Spark',
      glow: 'shadow-slate-800/20'
    };
  };

  const flameVisual = getFlameVisual(streakData.currentStreak);
  const resetProgress = Math.min(100, Math.round((streakData.currentStreak / 90) * 100));

  const selectedRecord = streakData.history[selectedDay];

  return (
    <div id="victory-streaks-container" className="w-full max-w-3xl mx-auto space-y-6">
      {/* Top Hero: Animated Flame & Core Recovery Metrics */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-800 p-6 shadow-2xl backdrop-blur-xl">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Flame Icon & Streak Counter */}
          <div className="flex items-center gap-5">
            <motion.div 
              animate={{ 
                scale: [1, 1.06, 1],
                rotate: [-1, 1, -1] 
              }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className={`relative w-20 h-20 rounded-3xl ${flameVisual.bg} p-0.5 shadow-2xl ${flameVisual.glow} flex items-center justify-center`}
            >
              <div className="w-full h-full rounded-[22px] bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center">
                <Flame className={`w-10 h-10 ${flameVisual.color} fill-current animate-pulse`} />
              </div>
              <span className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black shadow uppercase tracking-tighter">
                {streakData.currentStreak}d
              </span>
            </motion.div>

            <div className="text-left">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400 block mb-0.5">
                {flameVisual.label}
              </span>
              <div className="flex items-baseline gap-2">
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-serif-biblical">
                  {streakData.currentStreak}
                </h2>
                <span className="text-sm font-bold text-slate-300">Days of Freedom</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                “He that overcometh shall inherit all things.” — Revelation 21:7
              </p>
            </div>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-around">
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center min-w-[90px] shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Longest</span>
              <span className="text-xl font-black text-emerald-400 font-serif-biblical">
                {streakData.longestStreak}
              </span>
              <span className="text-[10px] text-slate-500 block">days</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center min-w-[90px] shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Victories</span>
              <span className="text-xl font-black text-amber-400 font-serif-biblical">
                {streakData.totalVictories}
              </span>
              <span className="text-[10px] text-slate-500 block">days clean</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center min-w-[90px] shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target</span>
              <span className="text-xl font-black text-cyan-400 font-serif-biblical">
                90
              </span>
              <span className="text-[10px] text-slate-500 block">day reset</span>
            </div>
          </div>
        </div>

        {/* 90-Day Neuro-Reset Progress Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              90-Day Dopamine D2 Receptor Neuro-Reset
            </span>
            <span className="text-amber-400 font-black">{resetProgress}% complete ({streakData.currentStreak}/90d)</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-950 p-0.5 border border-slate-800 overflow-hidden relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${resetProgress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-emerald-400 to-cyan-400 shadow-lg"
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-semibold mt-1 px-1">
            <span>Day 1: Break Cue</span>
            <span>Day 7: Prefrontal</span>
            <span>Day 30: Vitality</span>
            <span>Day 60: Rewire</span>
            <span>Day 90: Full Reset ✨</span>
          </div>
        </div>
      </div>

      {/* Sub-view Switcher: Calendar vs Urge Trends vs Milestones vs Science */}
      <div className="flex bg-slate-900/90 p-1 rounded-2xl border border-slate-800 shadow-md overflow-x-auto">
        <button
          onClick={() => { sound.playChime(420); setActiveView('calendar'); }}
          className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeView === 'calendar'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CalendarIcon className="w-3.5 h-3.5" />
          Monthly Calendar
        </button>

        <button
          id="victory-streaks-tab-trends"
          onClick={() => { sound.playChime(440); setActiveView('trends'); }}
          className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeView === 'trends'
              ? 'bg-cyan-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          Urge Trends
        </button>

        <button
          onClick={() => { sound.playChime(460); setActiveView('milestones'); }}
          className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeView === 'milestones'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          Badges ({milestones.filter(m => m.unlocked).length}/{milestones.length})
        </button>

        <button
          onClick={() => { sound.playChime(480); setActiveView('science'); }}
          className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeView === 'science'
              ? 'bg-teal-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          Evidence
        </button>
      </div>

      {/* Notification Banner when user logs a day */}
      <AnimatePresence>
        {justLoggedMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-lg"
          >
            <span>{justLoggedMessage}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* VIEW 1: MONTHLY CALENDAR HEAT MAP */}
      {activeView === 'calendar' && (
        <div className="space-y-6">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
            {/* Calendar Month Header & Controls */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-serif-biblical">
                  {monthName} {year}
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold border border-slate-700">
                  Consistency Map
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={goToCurrentMonth}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition cursor-pointer"
                >
                  Today
                </button>
                <button
                  onClick={prevMonth}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                  title="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days of the Week Header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>

            {/* Calendar Heat Map Grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {calendarDays.map((cell, idx) => {
                const record = streakData.history[cell.dateStr];
                const isSelected = selectedDay === cell.dateStr;
                const isToday = cell.dateStr === todayKey;

                // Color calculation for heat map cell
                let cellStyle = 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-600';
                let statusIcon: React.ReactNode = null;

                if (record?.status === 'victory') {
                  cellStyle = 'bg-emerald-500/25 border-emerald-500/60 text-emerald-200 shadow-sm shadow-emerald-500/20';
                  statusIcon = <Check className="w-3 h-3 text-emerald-400" />;
                } else if (record?.status === 'urged-surfed') {
                  cellStyle = 'bg-cyan-500/25 border-cyan-500/60 text-cyan-200 shadow-sm shadow-cyan-500/20';
                  statusIcon = <Compass className="w-3 h-3 text-cyan-400" />;
                } else if (record?.status === 'grace-reset') {
                  cellStyle = 'bg-amber-500/20 border-amber-500/50 text-amber-300';
                  statusIcon = <RefreshCw className="w-3 h-3 text-amber-400" />;
                }

                if (!cell.isCurrentMonth) {
                  cellStyle += ' opacity-40';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      sound.playChime(440);
                      setSelectedDay(cell.dateStr);
                    }}
                    className={`relative min-h-[56px] p-1.5 rounded-2xl border transition-all flex flex-col justify-between items-center cursor-pointer ${cellStyle} ${
                      isSelected ? 'ring-2 ring-amber-400 scale-102 z-10' : ''
                    } ${isToday ? 'border-amber-400/90' : ''}`}
                  >
                    <div className="w-full flex items-center justify-between text-[11px] font-bold">
                      <span>{cell.dayNumber}</span>
                      {isToday && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                      )}
                    </div>

                    <div className="my-0.5 flex items-center justify-center">
                      {statusIcon || (
                        <span className="text-[10px] text-slate-600">·</span>
                      )}
                    </div>

                    <div className="w-full text-center">
                      {record?.status === 'victory' && (
                        <span className="text-[8px] font-black text-emerald-300 uppercase">Victory</span>
                      )}
                      {record?.status === 'urged-surfed' && (
                        <span className="text-[8px] font-black text-cyan-300 uppercase">Surfed</span>
                      )}
                      {record?.status === 'grace-reset' && (
                        <span className="text-[8px] font-black text-amber-300 uppercase">Grace</span>
                      )}
                      {!record && isToday && (
                        <span className="text-[8px] font-bold text-amber-400">Today</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Heat Map Legend */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-emerald-500/30 border border-emerald-500/60 inline-block" />
                <span>Clean Victory</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-cyan-500/30 border border-cyan-500/60 inline-block" />
                <span>Urge Surfed & Conquered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-amber-500/25 border border-amber-500/50 inline-block" />
                <span>Grace Reset / Fresh Start</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md border border-amber-400 inline-block" />
                <span>Today</span>
              </div>
            </div>
          </div>

          {/* Action Card for the Selected Day */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  {selectedDay === todayKey ? 'Record Today’s Triumph' : 'Daily Journal & Check-In'}
                </span>
                <h4 className="text-sm font-bold text-white font-serif-biblical">
                  {new Date(selectedDay + 'T00:00:00').toLocaleDateString(undefined, { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric' 
                  })}
                </h4>
              </div>

              {selectedRecord && (
                <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                  selectedRecord.status === 'victory'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : selectedRecord.status === 'urged-surfed'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}>
                  {selectedRecord.status === 'victory' && '✓ Victory Recorded'}
                  {selectedRecord.status === 'urged-surfed' && '🌊 Urge Surfed'}
                  {selectedRecord.status === 'grace-reset' && '🌱 Grace Reset'}
                </span>
              )}
            </div>

            {/* Quick Logging Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 my-3">
              <button
                onClick={() => handleLogDay('victory')}
                className="py-3 px-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Flame className="w-4 h-4 fill-current" />
                <span>Claim Clean Victory 🔥</span>
              </button>

              <button
                onClick={() => handleLogDay('urged-surfed')}
                className="py-3 px-3 rounded-2xl bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 font-bold text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Surfed an Urge 🌊</span>
              </button>

              <button
                onClick={() => handleLogDay('grace-reset')}
                className="py-3 px-3 rounded-2xl bg-slate-950 hover:bg-slate-800 text-amber-300 border border-amber-500/40 font-bold text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-amber-400" />
                <span>Grace Reset & Learn 🌱</span>
              </button>
            </div>

            {/* Optional reflection note */}
            <div className="space-y-2 mt-4">
              <input
                type="text"
                value={dailyNote}
                onChange={e => setDailyNote(e.target.value)}
                placeholder={selectedRecord?.note ? `Logged note: ${selectedRecord.note}` : 'Optional reflection: What helped you stay strong today?'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500 transition"
              />
              <input
                type="text"
                value={gratitudeText}
                onChange={e => setGratitudeText(e.target.value)}
                placeholder={selectedRecord?.gratitude ? `Gratitude: ${selectedRecord.gratitude}` : 'One thing you thank God for today...'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: URGE TRENDS & INTENSITY */}
      {activeView === 'trends' && (
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md space-y-4 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
            <div>
              <h3 className="text-sm font-bold text-white font-serif-biblical flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Urge Strength & Craving Intensity Trends
              </h3>
              <p className="text-xs text-slate-400">
                Logged during your 60-Second Urge Pauses (SOS). Watch cravings weaken as prefrontal inhibition strengthens.
              </p>
            </div>
            {onOpenSos && (
              <button
                onClick={onOpenSos}
                className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-sm active:scale-95"
              >
                <Flame className="w-3.5 h-3.5 text-rose-400" />
                Launch 60s Pause
              </button>
            )}
          </div>

          <UrgeTrendChart compact={false} />
        </div>
      )}

      {/* VIEW 3: MILESTONE BADGES */}
      {activeView === 'milestones' && (
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white font-serif-biblical">
                Neuro-Recovery Milestones
              </h3>
              <p className="text-xs text-slate-400">
                Each milestone reflects an objective neurochemical regeneration phase in clinical recovery.
              </p>
            </div>
            <span className="text-xs font-black text-amber-400 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
              {milestones.filter(m => m.unlocked).length} of {milestones.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {milestones.map(m => (
              <div
                key={m.days}
                className={`p-4 rounded-2xl border transition-all ${
                  m.unlocked
                    ? 'bg-gradient-to-tr from-emerald-950/40 via-slate-900 to-amber-950/30 border-emerald-500/40 shadow-lg'
                    : 'bg-slate-950/60 border-slate-800/80 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl p-2 rounded-xl bg-slate-900 border border-slate-800">
                    {m.icon}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-white">{m.title}</h4>
                      {m.unlocked ? (
                        <span className="text-[10px] font-black text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Unlocked
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-bold">
                          {m.days - streakData.currentStreak > 0 ? `${m.days - streakData.currentStreak}d left` : 'Upcoming'}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-amber-300/90 font-medium">{m.subtitle}</p>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{m.scienceNote}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: NEUROPLASTIC EVIDENCE */}
      {activeView === 'science' && (
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md space-y-4 text-left">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white font-serif-biblical flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              What Happens to Your Brain Day-by-Day
            </h3>
            <p className="text-xs text-slate-400">
              Evidence synthesized from clinical fMRI addiction literature (Gola et al., Voon et al., Volkow et al.).
            </p>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <h4 className="font-bold text-amber-400 mb-1">Days 1–7: Prefrontal Energy Awakening</h4>
              <p className="leading-relaxed text-slate-300">
                During the first week, stopping compulsive dopamine spikes causes temporary restlessness. By day 7, executive glucose metabolism in the dorsolateral prefrontal cortex improves, giving you a noticeable boost in mental clarity and focus.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <h4 className="font-bold text-emerald-400 mb-1">Days 8–30: Rebuilding Everyday Pleasure</h4>
              <p className="leading-relaxed text-slate-300">
                D2 dopamine receptors begin upregulating. Everyday activities—music, exercise, scripture reading, spending time with family—start providing deep, natural satisfaction again. Social anxiety and gaze avoidance decrease.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <h4 className="font-bold text-cyan-400 mb-1">Days 31–90: Deep Structural Rewiring</h4>
              <p className="leading-relaxed text-slate-300">
                The transcription factor DeltaFosB degrades. Neural pathways associated with compulsive seeking undergo long-term depression (atrophy), while new righteous, wholesome circuits become your automatic default response.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
