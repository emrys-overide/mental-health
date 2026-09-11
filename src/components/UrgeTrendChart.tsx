import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingDown, TrendingUp, Minus, Activity, Flame, 
  Trash2, ShieldCheck, Clock, Calendar, Check, AlertTriangle
} from 'lucide-react';
import { 
  getUrgeLogs, getUrgeTrendStats, deleteUrgeLog, 
  getIntensityLabel, UrgeTrendStats 
} from '../utils/urgeStorage';
import { UrgeIntensityLog } from '../types';
import { sound } from '../utils/sound';

interface UrgeTrendChartProps {
  compact?: boolean;
  onSelectIntensity?: (val: number) => void;
}

export const UrgeTrendChart: React.FC<UrgeTrendChartProps> = ({ compact = false }) => {
  const [logs, setLogs] = useState<UrgeIntensityLog[]>(() => getUrgeLogs());
  const [stats, setStats] = useState<UrgeTrendStats>(() => getUrgeTrendStats());
  const [selectedLog, setSelectedLog] = useState<UrgeIntensityLog | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const refresh = () => {
    setLogs(getUrgeLogs());
    setStats(getUrgeTrendStats());
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playChime(360);
    deleteUrgeLog(id);
    refresh();
    if (selectedLog?.id === id) {
      setSelectedLog(null);
    }
  };

  const getBarColor = (intensity: number) => {
    if (intensity <= 3) return 'from-emerald-500 to-teal-400';
    if (intensity <= 6) return 'from-amber-400 to-yellow-500';
    if (intensity <= 8) return 'from-orange-500 to-amber-500';
    return 'from-rose-500 to-red-600';
  };

  const getBarBg = (intensity: number) => {
    if (intensity <= 3) return 'bg-emerald-500';
    if (intensity <= 6) return 'bg-amber-400';
    if (intensity <= 8) return 'bg-orange-500';
    return 'bg-rose-500';
  };

  return (
    <div id="urge-trend-chart-container" className="w-full text-left space-y-4">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* Average Intensity */}
        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
            <Activity className="w-3 h-3 text-cyan-400" /> Avg Urge Level
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-black text-white">{stats.averageIntensity}</span>
            <span className="text-[11px] text-slate-500">/ 10</span>
          </div>
          <span className="text-[9px] text-slate-400 mt-0.5">Across {stats.totalLogs} logs</span>
        </div>

        {/* 7-Day Trend Direction */}
        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
            {stats.trendDirection === 'down' ? (
              <TrendingDown className="w-3 h-3 text-emerald-400" />
            ) : stats.trendDirection === 'up' ? (
              <TrendingUp className="w-3 h-3 text-rose-400" />
            ) : (
              <Minus className="w-3 h-3 text-amber-400" />
            )}
            7-Day Trend
          </span>
          <div className="mt-1 flex items-center gap-1.5">
            {stats.trendDirection === 'down' ? (
              <span className="text-xs font-black text-emerald-400">Weakening ↓</span>
            ) : stats.trendDirection === 'up' ? (
              <span className="text-xs font-black text-rose-400">Spiking ↑</span>
            ) : (
              <span className="text-xs font-black text-amber-300">Stabilizing</span>
            )}
          </div>
          <span className="text-[9px] text-slate-400 mt-0.5">
            {stats.trendDirection === 'down'
              ? 'Neurochemical desensitization'
              : 'Keep practicing the pause'}
          </span>
        </div>

        {/* 7-Day Average */}
        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" /> Past 7 Days
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-black text-amber-300">{stats.past7DaysAverage}</span>
            <span className="text-[11px] text-slate-500">/ 10</span>
          </div>
          <span className="text-[9px] text-slate-400 mt-0.5">Recent baseline</span>
        </div>

        {/* Peak Intensity */}
        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
            <Flame className="w-3 h-3 text-rose-400" /> Peak Craving
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-black text-rose-400">{stats.peakIntensity}</span>
            <span className="text-[11px] text-slate-500">/ 10</span>
          </div>
          <span className="text-[9px] text-emerald-400 mt-0.5">Surfed & delayed!</span>
        </div>
      </div>

      {/* Visual Chronological Urge Trend Chart (SVG / Bars) */}
      <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-inner">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Chronological Urge Intensity Over Time
            </h4>
            <p className="text-[10px] text-slate-400">
              Each bar shows urge strength (1-10) during SOS pauses. Tap a bar for details.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> 1-3
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> 4-6
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> 7-10
            </span>
          </div>
        </div>

        {/* Bar Graph Canvas */}
        {stats.recentChronological.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No urge logs recorded yet. Use the 60s pause slider above to log your first urge!
          </div>
        ) : (
          <div className="w-full">
            {/* Y-axis grid scale reference */}
            <div className="relative h-44 flex items-end justify-between gap-1 sm:gap-2 pt-6 px-1 border-b border-slate-800">
              {/* Horizontal guideline markers */}
              <div className="absolute inset-x-0 top-6 border-b border-slate-800/40 pointer-events-none flex justify-end pr-1">
                <span className="text-[8px] text-slate-600">10 (Peak)</span>
              </div>
              <div className="absolute inset-x-0 top-1/2 border-b border-slate-800/40 pointer-events-none flex justify-end pr-1">
                <span className="text-[8px] text-slate-600">5 (Mid)</span>
              </div>

              {stats.recentChronological.map((log) => {
                const heightPercent = Math.max(12, (log.intensity / 10) * 100);
                const isSelected = selectedLog?.id === log.id;
                const labelInfo = getIntensityLabel(log.intensity);

                return (
                  <div
                    key={log.id}
                    onClick={() => {
                      sound.playChime(480);
                      setSelectedLog(isSelected ? null : log);
                    }}
                    className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer"
                  >
                    {/* Urge Value on Top */}
                    <span className={`text-[10px] font-black transition-all mb-1 ${
                      isSelected ? 'scale-125 text-white' : 'text-slate-400 group-hover:text-white'
                    }`}>
                      {log.intensity}
                    </span>

                    {/* Gradient Bar */}
                    <div className="w-full max-w-[28px] h-full flex items-end">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPercent}%` }}
                        transition={{ duration: 0.4 }}
                        className={`w-full rounded-t-lg bg-gradient-to-t ${getBarColor(log.intensity)} transition-all shadow-md ${
                          isSelected
                            ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950 brightness-125'
                            : 'group-hover:brightness-110 opacity-90'
                        }`}
                      />
                    </div>

                    {/* Date / Time Label Below */}
                    <div className="mt-2 text-center overflow-hidden w-full">
                      <span className="text-[8px] sm:text-[9px] text-slate-400 block truncate">
                        {log.dateStr.slice(5)}
                      </span>
                      <span className="text-[7px] text-slate-500 block truncate">
                        {log.timeStr.replace(/:\d+\s*/, ' ')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Log Inspector Popout */}
        <AnimatePresence>
          {selectedLog && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${getIntensityLabel(selectedLog.intensity).badgeBg} ${getIntensityLabel(selectedLog.intensity).color} ${getIntensityLabel(selectedLog.intensity).border}`}>
                    Level {selectedLog.intensity}/10 — {getIntensityLabel(selectedLog.intensity).text}
                  </span>
                  <span className="text-slate-400 text-[10px]">
                    {selectedLog.dateStr} at {selectedLog.timeStr}
                  </span>
                  {selectedLog.completed60s && (
                    <span className="text-emerald-400 text-[10px] font-bold flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> 60s Escaped
                    </span>
                  )}
                </div>

                {selectedLog.need && (
                  <p className="text-[11px] text-slate-300">
                    <span className="text-slate-500 font-semibold">Underlying Need:</span> {selectedLog.need}
                  </p>
                )}
                {selectedLog.action && (
                  <p className="text-[11px] text-slate-300">
                    <span className="text-slate-500 font-semibold">Action Taken:</span> {selectedLog.action}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={(e) => handleDelete(selectedLog.id, e)}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" /> Remove Log
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recent Log History Table/List (Collapsible / Compact) */}
      {!compact && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              Recent Urge Pause Logs ({logs.length})
            </h4>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
            {logs.slice(0, 10).map((log) => {
              const labelInfo = getIntensityLabel(log.intensity);
              return (
                <div
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className={`p-2.5 rounded-xl border transition flex items-center justify-between gap-2 cursor-pointer ${
                    selectedLog?.id === log.id
                      ? 'bg-slate-800/90 border-slate-600'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Intensity pill */}
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${getBarBg(log.intensity)} text-slate-950`}>
                      {log.intensity}
                    </span>

                    <div className="min-w-0 text-left">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[11px] font-bold ${labelInfo.color}`}>
                          {labelInfo.text}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          • {log.dateStr} {log.timeStr}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate max-w-xs">
                        {log.need ? `Need: ${log.need}` : 'Urge recorded during pause'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {log.completed60s && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                        Surfed
                      </span>
                    )}
                    <button
                      onClick={(e) => handleDelete(log.id, e)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition"
                      title="Delete log"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
