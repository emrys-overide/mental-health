export interface ScriptureInsight {
  id: string;
  reference: string;
  text: string;
  theme: string;
  neuroscienceLink: string;
  practicalAction: string;
  evidenceRef: string;
}

export type ReelCategory = 
  | 'Brain & Dopamine'
  | 'Body & Health'
  | 'Stats & Science'
  | 'Cross-Addictions'
  | 'Combating Scriptures'
  | 'Urge Mastery'
  | 'Encouragement'
  | 'Love & Mercy'
  | 'Peace & Stillness'
  | 'Strength & Comfort'
  | 'Overcoming Tips'
  | 'Self-Development';

export type ChunkType = 
  | 'brain'
  | 'body'
  | 'stat'
  | 'cross-addiction'
  | 'scripture'
  | 'urge'
  | 'truth'
  | 'tip'
  | 'encouragement'
  | 'peace'
  | 'love'
  | 'strength';

export interface SingleBiteChunk {
  id: string;
  chunkNumber: number;
  type: ChunkType;
  typeLabel: string;
  category: ReelCategory;
  headline: string;
  title: string;
  shortFact: string;
  deeperDetail: string;
  scriptureAnchor?: {
    ref: string;
    text: string;
  };
  keyTakeaway: string;
  videoUrl: string;
  thumbnailUrl: string;
  likes: number;
  authorOrSource: string;
}

export interface VideoReel {
  id: string;
  title: string;
  headline: string;
  category: ReelCategory;
  videoUrl: string;
  thumbnailUrl: string;
  speakerOrAuthor: string;
  durationSec: number;
  infoChunk: string;
  bodyHarm?: string;
  brainImpact?: string;
  statistic?: string;
  otherAddictionRelation?: string;
  scriptureCombat: {
    ref: string;
    text: string;
    principle: string;
  };
  scienceTakeaway: string;
  actionStep: string;
  likes: number;
  tags: string[];
}

export interface IfThenPlan {
  id: string;
  trigger: string;
  action: string;
  scripture: string;
  createdAt: string;
}

export interface CheckInRecord {
  id: string;
  timestamp: string;
  emotion: string;
  context: string;
  cravingLevel: number; // 0-10
  actionTaken?: string;
}

export interface LapseReviewRecord {
  id: string;
  timestamp: string;
  safetyCheck: boolean;
  unmetNeed: string;
  context: string;
  nextGraceAction: string;
  reflection: string;
}

export interface DailyDevotion {
  id: string;
  dayNumber: number;
  dateStr?: string;
  title: string;
  scriptureRef: string;
  scriptureText: string;
  theme: string;
  meditationStory: string;
  reflectionQuestion: string;
  neuroInsight: string;
  prayer: string;
  commitmentPledges: string[];
}

export interface DailyStreakRecord {
  dateStr: string; // 'YYYY-MM-DD'
  status: 'victory' | 'urged-surfed' | 'grace-reset';
  note?: string;
  intensity?: number; // 1-3
  gratitude?: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalVictories: number;
  startDate: string;
  lastLogDate?: string;
  history: Record<string, DailyStreakRecord>; // key: 'YYYY-MM-DD'
}

export interface UrgeIntensityLog {
  id: string;
  timestamp: number;
  dateStr: string; // 'YYYY-MM-DD'
  timeStr: string; // '2:45 PM'
  intensity: number; // 1 to 10
  need?: string;
  action?: string;
  completed60s: boolean;
}

export type ActiveTab = 'reels' | 'mindgame' | 'pause' | 'activities' | 'journal' | 'streaks';
