import { UrgeIntensityLog } from '../types';
import { auth, saveUrgeLogToCloud } from '../services/firebase';

const STORAGE_KEY = 'renewmind_urge_logs_v1';

// Seed initial realistic data over the past 7 days so trends are immediately tangible
const getInitialSampleLogs = (): UrgeIntensityLog[] => {
  const now = Date.now();
  const sampleData: { daysAgo: number; hour: number; intensity: number; need: string; action: string; completed: boolean }[] = [
    { daysAgo: 6, hour: 22, intensity: 8, need: 'I am bored and seeking dopamine', action: 'Splash cold water on face', completed: true },
    { daysAgo: 5, hour: 15, intensity: 7, need: 'I feel stressed and overwhelmed', action: 'Step outside for 3 minutes of fresh air', completed: true },
    { daysAgo: 4, hour: 23, intensity: 6, need: 'I am physically exhausted / tired', action: 'Drink a tall glass of ice cold water', completed: true },
    { daysAgo: 3, hour: 14, intensity: 5, need: 'I feel lonely or isolated', action: 'Text or call a safe friend/mentor for encouragement', completed: true },
    { daysAgo: 2, hour: 21, intensity: 6, need: 'I am noticing a bodily craving spike', action: 'Walk into another room where people are', completed: true },
    { daysAgo: 1, hour: 16, intensity: 4, need: 'I feel stressed and overwhelmed', action: 'Do 12 slow push-ups or stretching', completed: true },
  ];

  return sampleData.map((item, idx) => {
    const d = new Date(now - item.daysAgo * 86400000);
    d.setHours(item.hour, 30, 0, 0);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const timeStr = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

    return {
      id: `urge-seed-${idx}-${d.getTime()}`,
      timestamp: d.getTime(),
      dateStr,
      timeStr,
      intensity: item.intensity,
      need: item.need,
      action: item.action,
      completed60s: item.completed
    };
  });
};

export const getUrgeLogs = (): UrgeIntensityLog[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialSampleLogs();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.sort((a, b) => b.timestamp - a.timestamp);
    }
    return [];
  } catch (err) {
    console.error('Error loading urge logs from localStorage', err);
    return getInitialSampleLogs();
  }
};

export const getStoredUrgeLogs = (): UrgeIntensityLog[] => {
  return getUrgeLogs();
};

export const saveUrgeLog = (
  intensity: number,
  need?: string,
  action?: string,
  completed60s: boolean = false
): UrgeIntensityLog => {
  const currentLogs = getUrgeLogs();
  const d = new Date();
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;
  const timeStr = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  const newLog: UrgeIntensityLog = {
    id: `urge-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    timestamp: Date.now(),
    dateStr,
    timeStr,
    intensity: Math.max(1, Math.min(10, Math.round(intensity))),
    need: need || undefined,
    action: action || undefined,
    completed60s
  };

  const updated = [newLog, ...currentLogs];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving urge log to localStorage', err);
  }

  // Cloud sync if user is signed in with Firebase
  if (auth.currentUser) {
    saveUrgeLogToCloud(auth.currentUser.uid, newLog)
      .catch(err => console.warn('Cloud save urge log non-fatal error:', err));
  }

  return newLog;
};

export const deleteUrgeLog = (id: string): void => {
  const currentLogs = getUrgeLogs();
  const updated = currentLogs.filter(log => log.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error deleting urge log', err);
  }
};

export interface UrgeTrendStats {
  totalLogs: number;
  averageIntensity: number;
  past7DaysAverage: number;
  trendDirection: 'down' | 'stable' | 'up';
  percentageChange: number;
  peakIntensity: number;
  lowestIntensity: number;
  recentChronological: UrgeIntensityLog[]; // oldest to newest for charting
}

export const getUrgeTrendStats = (): UrgeTrendStats => {
  const logs = getUrgeLogs();
  if (logs.length === 0) {
    return {
      totalLogs: 0,
      averageIntensity: 0,
      past7DaysAverage: 0,
      trendDirection: 'stable',
      percentageChange: 0,
      peakIntensity: 0,
      lowestIntensity: 0,
      recentChronological: []
    };
  }

  const chronological = [...logs].reverse();
  const total = logs.reduce((sum, l) => sum + l.intensity, 0);
  const averageIntensity = parseFloat((total / logs.length).toFixed(1));

  const peakIntensity = Math.max(...logs.map(l => l.intensity));
  const lowestIntensity = Math.min(...logs.map(l => l.intensity));

  // Past 7 days logs vs older logs to compute trend
  const sevenDaysAgo = Date.now() - 7 * 86400000;
  const recentWeekLogs = logs.filter(l => l.timestamp >= sevenDaysAgo);
  const olderLogs = logs.filter(l => l.timestamp < sevenDaysAgo);

  const past7DaysAverage = recentWeekLogs.length > 0
    ? parseFloat((recentWeekLogs.reduce((sum, l) => sum + l.intensity, 0) / recentWeekLogs.length).toFixed(1))
    : averageIntensity;

  let trendDirection: 'down' | 'stable' | 'up' = 'stable';
  let percentageChange = 0;

  if (olderLogs.length > 0 && recentWeekLogs.length > 0) {
    const olderAvg = olderLogs.reduce((sum, l) => sum + l.intensity, 0) / olderLogs.length;
    const diff = past7DaysAverage - olderAvg;
    percentageChange = Math.round((Math.abs(diff) / (olderAvg || 1)) * 100);

    if (diff < -0.4) {
      trendDirection = 'down'; // Urges are weakening! Excellent progress
    } else if (diff > 0.4) {
      trendDirection = 'up';
    } else {
      trendDirection = 'stable';
    }
  }

  return {
    totalLogs: logs.length,
    averageIntensity,
    past7DaysAverage,
    trendDirection,
    percentageChange,
    peakIntensity,
    lowestIntensity,
    recentChronological: chronological.slice(-14) // last 14 logs for trend chart
  };
};

export const getIntensityLabel = (val: number): { text: string; color: string; badgeBg: string; border: string; desc: string } => {
  if (val <= 3) {
    return {
      text: 'Mild / Noticeable',
      color: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/20',
      border: 'border-emerald-500/40',
      desc: 'Gentle ripple or passing mental suggestion.'
    };
  }
  if (val <= 6) {
    return {
      text: 'Moderate Urge',
      color: 'text-amber-400',
      badgeBg: 'bg-amber-500/20',
      border: 'border-amber-500/40',
      desc: 'Noticeable bodily pull, wandering attention.'
    };
  }
  if (val <= 8) {
    return {
      text: 'High Craving Spike',
      color: 'text-orange-400',
      badgeBg: 'bg-orange-500/20',
      border: 'border-orange-500/40',
      desc: 'Strong neurochemical pull; requires deliberate pause.'
    };
  }
  return {
    text: 'Severe / Acute Emergency',
    color: 'text-rose-400',
    badgeBg: 'bg-rose-500/20',
    border: 'border-rose-500/40',
    desc: 'Maximum craving wave. Physical escape window active!'
  };
};
