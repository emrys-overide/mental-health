import React, { useState, useEffect } from 'react';
import { 
  Tv, Gamepad2, ShieldAlert, Sparkles, BookOpen, 
  Volume2, VolumeX, Flame, Heart, Compass,
  ListTodo, Info, X, Mic
} from 'lucide-react';
import { ActiveTab } from './types';
import { ReelFeed } from './components/ReelFeed';
import { MindGame } from './components/MindGame';
import { ScriptureScramble } from './components/ScriptureScramble';
import { UrgeInterruption } from './components/UrgeInterruption';
import { IfThenBuilder } from './components/IfThenBuilder';
import { LapseReview } from './components/LapseReview';
import { TriggerCompass } from './components/TriggerCompass';
import { ScriptureLibrary } from './components/ScriptureLibrary';
import { VictoryStreaks } from './components/VictoryStreaks';
import { DailyDevotionModal } from './components/DailyDevotionModal';
import { LiveVoiceModal } from './components/LiveVoiceModal';
import { UserAuthButton } from './components/UserAuthButton';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { getTodaysDevotion } from './data/devotions';
import { sound } from './utils/sound';
import { getStreakData } from './utils/streakStorage';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('reels');
  const [activitySubTab, setActivitySubTab] = useState<'ifthen' | 'compass' | 'lapse'>('ifthen');
  const [showSosModal, setShowSosModal] = useState(false);
  const [showLiveVoiceModal, setShowLiveVoiceModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showResearchInfo, setShowResearchInfo] = useState(false);
  const [showDevotionModal, setShowDevotionModal] = useState(false);
  const [isCommittedToday, setIsCommittedToday] = useState(false);
  const [currentStreakCount, setCurrentStreakCount] = useState(() => getStreakData().currentStreak);

  const todaysDevotion = getTodaysDevotion();

  useEffect(() => {
    const todayKey = new Date().toDateString();
    const lastCommitted = localStorage.getItem('recovery_last_committed_date');
    if (lastCommitted === todayKey) {
      setIsCommittedToday(true);
    }
  }, []);

  const toggleSound = () => {
    const isMuted = sound.toggleMute();
    setSoundEnabled(!isMuted);
  };

  const handleOpenPause = () => {
    sound.playZenBowl();
    setShowSosModal(true);
  };

  const handleOpenGame = () => {
    sound.playChime(520);
    setActiveTab('mindgame');
  };

  const handleOpenDevotion = () => {
    sound.playChime(500);
    setShowDevotionModal(true);
  };

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-[#070a12] text-slate-100 flex flex-col select-none relative">
      {/* Offline Status Banner */}
      <OfflineIndicator />

      {/* Top App Header (Compact & Mobile-Responsive) */}
      <header className="shrink-0 z-30 w-full bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 px-3 sm:px-4 py-2 sm:py-2.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          {/* Brand Logo & Name */}
          <div 
            onClick={() => {
              sound.playChime(420);
              setActiveTab('reels');
            }}
            className="flex items-center gap-2 cursor-pointer select-none shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 via-amber-500 to-emerald-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 text-sm">
              ✝
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xs sm:text-sm font-extrabold tracking-tight text-white font-serif-biblical">
                  RenewMind
                </h1>
                <span className="hidden xs:inline text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  Scripture & Science
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden md:block leading-none">
                Romans 12:2
              </p>
            </div>
          </div>

          {/* Action Tools Header Bar */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Live Voice Companion Trigger (gemini-3.1-flash-live-preview) */}
            <button
              id="header-live-voice-btn"
              onClick={() => {
                sound.playChime(560);
                setShowLiveVoiceModal(true);
              }}
              className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-teal-500/20 hover:from-cyan-500/30 hover:to-teal-500/30 border border-cyan-500/40 text-xs font-bold text-cyan-300 transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
              title="Real-time Voice Conversation (gemini-3.1-flash-live-preview)"
            >
              <Mic className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="hidden xs:inline">Live Voice</span>
            </button>

            {/* Google Authentication & Firestore Cloud Sync */}
            <UserAuthButton />

            {/* PWA Download / Install App Button */}
            <PWAInstallButton compact={false} />

            {/* Quick Streaks Flame Trigger */}
            <button
              id="header-streaks-btn"
              onClick={() => {
                sound.playChime(540);
                setCurrentStreakCount(getStreakData().currentStreak);
                setActiveTab('streaks');
              }}
              className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-bold text-amber-300 transition flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
              title="Victory Streaks & Heat Map"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <span>{currentStreakCount}d</span>
            </button>

            {/* Today's Devotion quick trigger */}
            <button
              id="header-devotion-btn"
              onClick={handleOpenDevotion}
              className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/35 text-xs font-bold transition flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
              title="Daily Devotion & Commitment"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Devotion</span>
              {isCommittedToday && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Committed today" />
              )}
            </button>

            {/* Quick SOS Trigger Button */}
            <button
              id="header-sos-btn"
              onClick={handleOpenPause}
              className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
              title="60-Second Urge Pause"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden xs:inline">SOS</span>
            </button>

            {/* Audio sound toggle */}
            <button
              id="header-sound-toggle-btn"
              onClick={toggleSound}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition active:scale-90"
              title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-rose-400" />}
            </button>

            {/* Research & Info modal trigger */}
            <button
              id="header-research-info-btn"
              onClick={() => setShowResearchInfo(true)}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition active:scale-90"
              title="Clinical Research Foundation"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area (Strictly Fits Screen Height) */}
      <main className="flex-1 w-full overflow-hidden relative">
        {/* TAB 1: TIKTOK STYLE VIDEO REELS (ZERO OUTSIDE SCROLLING) */}
        {activeTab === 'reels' && (
          <div className="w-full h-full pb-16 overflow-hidden">
            <ReelFeed 
              onOpenPause={handleOpenPause} 
              onOpenGame={handleOpenGame}
              onOpenDevotion={handleOpenDevotion}
              onOpenLiveVoice={() => setShowLiveVoiceModal(true)}
              devotion={todaysDevotion}
              isCommittedToday={isCommittedToday}
            />
          </div>
        )}

        {/* TAB 2: MIND GAMES (Reflex & Word Scramble) */}
        {activeTab === 'mindgame' && (
          <div className="w-full h-full overflow-y-auto px-4 py-5 pb-28">
            <div className="max-w-2xl mx-auto flex flex-col gap-6 items-center">
              <div className="text-center max-w-md">
                <span className="text-[11px] font-bold text-cyan-400 tracking-wider uppercase flex items-center justify-center gap-1.5 mb-1">
                  <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" /> Prefrontal Neuro-Inhibition
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white">Interactive Mind Games</h2>
                <p className="text-xs text-slate-400">
                  Fast cognitive training to displace cravings and stimulate response inhibition.
                </p>
              </div>

              {/* Prefrontal Reflex & Urge Wave Surfer */}
              <MindGame />

              {/* Scripture Word Scramble Working Memory Puzzle */}
              <div className="w-full max-w-2xl">
                <ScriptureScramble />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: 60-SECOND URGE SOS PAUSE */}
        {activeTab === 'pause' && (
          <div className="w-full h-full overflow-y-auto px-4 py-5 pb-28">
            <div className="max-w-md mx-auto flex flex-col items-center gap-5">
              <div className="text-center">
                <span className="text-[11px] font-bold text-emerald-400 tracking-wider uppercase flex items-center justify-center gap-1.5 mb-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> 60-Second Escape Window
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white">Pause The Automatic Loop</h2>
                <p className="text-xs text-slate-400">
                  Section E clinical research: interrupt anticipation before searching begins.
                </p>
              </div>

              <UrgeInterruption onOpenLiveVoice={() => setShowLiveVoiceModal(true)} />
            </div>
          </div>
        )}

        {/* TAB 4: INTERACTIVE ACTIVITIES (If-Then, Compass, Lapse Review) */}
        {activeTab === 'activities' && (
          <div className="w-full h-full overflow-y-auto px-4 py-5 pb-28">
            <div className="max-w-2xl mx-auto flex flex-col items-center gap-5">
              <div className="text-center max-w-md">
                <span className="text-[11px] font-bold text-amber-400 tracking-wider uppercase flex items-center justify-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Research-Backed CBT & ACT Tools
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white">Interactive Growth Activities</h2>
                <p className="text-xs text-slate-400">
                  Practical exercises to build environmental friction, map emotions, and review setbacks with grace.
                </p>
              </div>

              {/* Daily Devotion quick card */}
              <button 
                id="activities-open-devotion-btn"
                onClick={handleOpenDevotion} 
                className="w-full max-w-md p-3 rounded-2xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-emerald-950/60 border border-amber-500/35 text-amber-300 text-xs font-semibold flex items-center justify-between shadow-md hover:border-amber-400/50 transition cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block text-white text-xs font-bold font-serif-biblical">Today's Devotion & Commitment</span>
                    <span className="text-[11px] text-amber-300/90">{todaysDevotion.scriptureRef} — {todaysDevotion.title}</span>
                  </div>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-400/30">
                  {isCommittedToday ? '✓ Sealed' : 'Read & Commit →'}
                </span>
              </button>

              {/* Activity Subtabs Switcher */}
              <div className="flex bg-slate-900/90 p-1 rounded-2xl border border-slate-800 shadow-lg">
                <button
                  id="subtab-ifthen"
                  onClick={() => { sound.playChime(440); setActivitySubTab('ifthen'); }}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    activitySubTab === 'ifthen'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ListTodo className="w-3.5 h-3.5" /> If–Then
                </button>
                <button
                  id="subtab-compass"
                  onClick={() => { sound.playChime(440); setActivitySubTab('compass'); }}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    activitySubTab === 'compass'
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" /> Compass
                </button>
                <button
                  id="subtab-lapse"
                  onClick={() => { sound.playChime(440); setActivitySubTab('lapse'); }}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    activitySubTab === 'lapse'
                      ? 'bg-rose-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5" /> Grace Reset
                </button>
              </div>

              {/* Subtab Views */}
              <div className="w-full">
                {activitySubTab === 'ifthen' && <IfThenBuilder />}
                {activitySubTab === 'compass' && <TriggerCompass onOpenPause={handleOpenPause} />}
                {activitySubTab === 'lapse' && <LapseReview />}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SCRIPTURE & NEUROSCIENCE VAULT */}
        {activeTab === 'journal' && (
          <div className="w-full h-full overflow-y-auto px-4 py-5 pb-28">
            <div className="max-w-3xl mx-auto">
              <ScriptureLibrary />
            </div>
          </div>
        )}

        {/* TAB 6: VICTORY STREAKS & CALENDAR HEAT MAP */}
        {activeTab === 'streaks' && (
          <div className="w-full h-full overflow-y-auto px-4 py-5 pb-28">
            <div className="max-w-xl mx-auto">
              <VictoryStreaks
                onOpenSos={handleOpenPause}
                onOpenDevotion={handleOpenDevotion}
              />
            </div>
          </div>
        )}
      </main>

      {/* Floating Bottom Navigation Bar (Docked at Bottom of Single Screen) */}
      <nav 
        id="app-bottom-nav"
        className="fixed bottom-2 inset-x-3 sm:inset-x-6 max-w-lg mx-auto z-40 bg-slate-950/92 backdrop-blur-2xl border border-slate-800/90 rounded-3xl p-1 shadow-2xl flex items-center justify-around pb-[max(0.25rem,env(safe-area-inset-bottom))]"
      >
        {/* Shorts (TikTok Feed) */}
        <button
          id="nav-tab-reels"
          onClick={() => { 
            sound.playChime(400); 
            setActiveTab('reels'); 
          }}
          className={`flex flex-col items-center py-1.5 px-3 rounded-2xl transition cursor-pointer ${
            activeTab === 'reels'
              ? 'text-amber-400 font-bold bg-amber-500/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Tv className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
          <span className="text-[10px]">Shorts</span>
        </button>

        {/* Streaks */}
        <button
          id="nav-tab-streaks"
          onClick={() => { 
            sound.playChime(460); 
            setCurrentStreakCount(getStreakData().currentStreak);
            setActiveTab('streaks'); 
          }}
          className={`flex flex-col items-center py-1.5 px-3 rounded-2xl transition cursor-pointer ${
            activeTab === 'streaks'
              ? 'text-amber-400 font-bold bg-amber-500/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Flame className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5 fill-current" />
          <span className="text-[10px]">Streaks</span>
        </button>

        {/* Mind Game */}
        <button
          id="nav-tab-mindgame"
          onClick={() => { 
            sound.playChime(440); 
            setActiveTab('mindgame'); 
          }}
          className={`flex flex-col items-center py-1.5 px-3 rounded-2xl transition cursor-pointer ${
            activeTab === 'mindgame'
              ? 'text-cyan-400 font-bold bg-cyan-500/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
          <span className="text-[10px]">Mind Game</span>
        </button>

        {/* Center Urge SOS Pulse Button */}
        <button
          id="nav-tab-pause-center"
          onClick={handleOpenPause}
          className="flex flex-col items-center justify-center -mt-5 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-rose-500 via-rose-600 to-amber-500 text-white shadow-xl shadow-rose-600/30 border-2 border-slate-900 active:scale-90 transition cursor-pointer"
          title="60-Second Urge Pause"
        >
          <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-[7px] sm:text-[8px] font-black tracking-tighter uppercase">SOS</span>
        </button>

        {/* Activities */}
        <button
          id="nav-tab-activities"
          onClick={() => { 
            sound.playChime(480); 
            setActiveTab('activities'); 
          }}
          className={`flex flex-col items-center py-1.5 px-3 rounded-2xl transition cursor-pointer ${
            activeTab === 'activities'
              ? 'text-emerald-400 font-bold bg-emerald-500/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
          <span className="text-[10px]">Activity</span>
        </button>

        {/* Vault */}
        <button
          id="nav-tab-scripture"
          onClick={() => { 
            sound.playChime(520); 
            setActiveTab('journal'); 
          }}
          className={`flex flex-col items-center py-1.5 px-3 rounded-2xl transition cursor-pointer ${
            activeTab === 'journal'
              ? 'text-amber-300 font-bold bg-amber-500/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5" />
          <span className="text-[10px]">Vault</span>
        </button>
      </nav>

      {/* SOS MODAL POPUP (Callable anywhere) */}
      {showSosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl">
            <button
              id="close-sos-modal-btn"
              onClick={() => setShowSosModal(false)}
              className="absolute -top-3 -right-3 z-10 p-2 rounded-full bg-slate-800 text-white hover:bg-slate-700 border border-slate-700 shadow-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <UrgeInterruption 
              onComplete={() => setShowSosModal(false)} 
              onOpenLiveVoice={() => {
                setShowSosModal(false);
                setShowLiveVoiceModal(true);
              }}
            />
          </div>
        </div>
      )}

      {/* RESEARCH & ETHICS INFO MODAL */}
      {showResearchInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-left max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-cyan-400" />
                Evidence Synthesis & Product Ethics
              </h3>
              <button
                id="close-research-info-btn"
                onClick={() => setShowResearchInfo(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
              <p>
                This application is engineered strictly based on the 36-page clinical research synthesis:
                <strong className="text-white block mt-1">“A private recovery assistant for adults and adolescents” (September 2026)</strong>
              </p>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <strong className="text-emerald-400 block mb-1">Key Scientific Principles:</strong>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  <li><strong>Cognitive Foundations:</strong> CBT & ACT (López-Pinar et al. 2025; Crosby & Twohig 2016).</li>
                  <li><strong>Neurobiology:</strong> Ventral striatum anticipation vs dorsal habituation (Gola et al. 2017; Voon et al. 2014).</li>
                  <li><strong>If-Then Plans:</strong> Sheeran et al. 2025 meta-analysis of 642 tests for habit substitution.</li>
                  <li><strong>Non-Shame Relapse Review:</strong> Toxic shame increases cortisol and drives relapse cycles. Grace restores prefrontal control.</li>
                  <li><strong>Biblical Integration:</strong> Romans 8:1, 12:2; Proverbs 4:23; 1 Corinthians 10:13; Philippians 4:8; Galatians 5:22.</li>
                </ul>
              </div>

              <p className="text-[11px] text-slate-400 italic">
                Notice: This tool is an evidence-informed self-help and spiritual growth companion. It does not replace professional medical or psychiatric diagnosis.
              </p>
            </div>

            <button
              onClick={() => setShowResearchInfo(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* DAILY DEVOTION & COMMITMENT MODAL */}
      <DailyDevotionModal
        devotion={todaysDevotion}
        isOpen={showDevotionModal}
        onClose={() => setShowDevotionModal(false)}
        onCommitSuccess={() => setIsCommittedToday(true)}
        isAlreadyCommitted={isCommittedToday}
      />

      {/* GEMINI LIVE VOICE COMPANION MODAL (gemini-3.1-flash-live-preview) */}
      <LiveVoiceModal
        isOpen={showLiveVoiceModal}
        onClose={() => setShowLiveVoiceModal(false)}
      />
    </div>
  );
}
