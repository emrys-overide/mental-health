import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Bookmark, Volume2, VolumeX, ChevronUp, ChevronDown, 
  Sparkles, BookOpen, Brain, Play, Share2, Compass, Check,
  Music, Sliders, Timer, ArrowDown, ShieldCheck,
  Search, Infinity as InfinityIcon, X, SlidersHorizontal,
  Flame, Sparkle, Mic
} from 'lucide-react';
import { ReelCategory, SingleBiteChunk } from '../types';
import { BITE_CHUNKS } from '../data/reels';
import { sound, instrumental, InstrumentalStyle } from '../utils/sound';
import { generateInfiniteChunk } from '../utils/infiniteWisdomEngine';
import { DailyDevotion } from '../types';

interface ReelFeedProps {
  onOpenPause: () => void;
  onOpenGame: () => void;
  onOpenDevotion?: () => void;
  onOpenLiveVoice?: () => void;
  devotion?: DailyDevotion;
  isCommittedToday?: boolean;
}

const CATEGORIES: ('All' | ReelCategory)[] = [
  'All',
  'Encouragement',
  'Love & Mercy',
  'Peace & Stillness',
  'Strength & Comfort',
  'Overcoming Tips',
  'Urge Mastery',
  'Self-Development',
  'Brain & Dopamine',
  'Combating Scriptures',
  'Body & Health',
  'Stats & Science',
  'Cross-Addictions'
];

export const ReelFeed: React.FC<ReelFeedProps> = ({ 
  onOpenPause, 
  onOpenGame,
  onOpenDevotion,
  onOpenLiveVoice,
  devotion,
  isCommittedToday
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | ReelCategory>('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  // Dynamic Infinite Stream & Search State
  const [extraDynamicChunks, setExtraDynamicChunks] = useState<SingleBiteChunk[]>([]);
  const [infiniteMode, setInfiniteMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [inspireNotification, setInspireNotification] = useState<string | null>(null);

  // Instrumental background music states
  const [isInstrumentalActive, setIsInstrumentalActive] = useState(true);
  const [instrumentalStyle, setInstrumentalStyle] = useState<InstrumentalStyle>('lofi');
  const [showMusicMenu, setShowMusicMenu] = useState(false);

  // Auto-scroll states
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [autoScrollDuration, setAutoScrollDuration] = useState(10); // in seconds
  const [progressPercent, setProgressPercent] = useState(0);
  const [isPausedByHoverOrHold, setIsPausedByHoverOrHold] = useState(false);

  // Deeper context slide-up sheet
  const [showDeeperSheet, setShowDeeperSheet] = useState(false);

  // Off-canvas Dashboard / Slider Drawer for categories & controls
  const [showDashboardDrawer, setShowDashboardDrawer] = useState(false);

  // Engagement states
  const [likesMap, setLikesMap] = useState<Record<string, { count: number; liked: boolean }>>(() => {
    const initial: Record<string, { count: number; liked: boolean }> = {};
    BITE_CHUNKS.forEach(c => {
      initial[c.id] = { count: c.likes, liked: false };
    });
    return initial;
  });
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({});
  const [copiedLink, setCopiedLink] = useState(false);
  const [showHeartPop, setShowHeartPop] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const touchStartY = useRef<number | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Combined pool: static BITE_CHUNKS + dynamic infinite additions
  const combinedAllChunks = useMemo(() => {
    return [...BITE_CHUNKS, ...extraDynamicChunks];
  }, [extraDynamicChunks]);

  // Filtered bite chunks by category & optional search query
  const filteredChunks: SingleBiteChunk[] = useMemo(() => {
    let result = selectedCategory === 'All'
      ? combinedAllChunks
      : combinedAllChunks.filter(c => c.category === selectedCategory);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(q) ||
        c.headline.toLowerCase().includes(q) ||
        c.shortFact.toLowerCase().includes(q) ||
        c.keyTakeaway.toLowerCase().includes(q) ||
        (c.scriptureAnchor && (c.scriptureAnchor.ref.toLowerCase().includes(q) || c.scriptureAnchor.text.toLowerCase().includes(q)))
      );
    }
    return result.length > 0 ? result : [BITE_CHUNKS[0]];
  }, [combinedAllChunks, selectedCategory, searchQuery]);

  const safeIndex = Math.min(currentIndex, Math.max(0, filteredChunks.length - 1));
  const currentChunk = filteredChunks[safeIndex] || BITE_CHUNKS[0];

  // Generate on-demand fresh truth chunk
  const handleGenerateFreshTruth = useCallback(() => {
    sound.playChime(640);
    const newIndex = combinedAllChunks.length;
    const newChunk = generateInfiniteChunk(newIndex, selectedCategory);
    setExtraDynamicChunks(prev => [...prev, newChunk]);
    
    setTimeout(() => {
      setCurrentIndex(filteredChunks.length);
      setInspireNotification(`✨ Revealed: “${newChunk.title}”`);
      setTimeout(() => setInspireNotification(null), 3000);
    }, 50);
  }, [combinedAllChunks.length, selectedCategory, filteredChunks.length]);

  // Next / Prev navigation with Infinite Stream support
  const goNext = useCallback(() => {
    sound.playChime(440);
    setShowDeeperSheet(false);
    setProgressPercent(0);

    if (infiniteMode && safeIndex >= filteredChunks.length - 1) {
      const nextIndex = combinedAllChunks.length;
      const newChunk = generateInfiniteChunk(nextIndex, selectedCategory);
      setExtraDynamicChunks(prev => [...prev, newChunk]);
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(prev => (prev + 1) % filteredChunks.length);
    }
  }, [filteredChunks.length, infiniteMode, safeIndex, combinedAllChunks.length, selectedCategory]);

  const goPrev = useCallback(() => {
    sound.playChime(380);
    setShowDeeperSheet(false);
    setProgressPercent(0);
    setCurrentIndex(prev => (prev - 1 + filteredChunks.length) % filteredChunks.length);
  }, [filteredChunks.length]);

  // Wheel scrolling (mouse wheel strictly moves to next/previous chunk)
  const wheelLockRef = useRef(false);
  const handleWheel = (e: React.WheelEvent) => {
    if (wheelLockRef.current) return;
    if (Math.abs(e.deltaY) > 25) {
      wheelLockRef.current = true;
      if (e.deltaY > 0) {
        goNext();
      } else {
        goPrev();
      }
      setTimeout(() => {
        wheelLockRef.current = false;
      }, 500);
    }
  };

  // Auto-scroll timer logic
  useEffect(() => {
    if (!autoScrollEnabled || isPausedByHoverOrHold || !isPlaying) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      return;
    }

    const intervalMs = 100;
    const stepIncrement = (intervalMs / (autoScrollDuration * 1000)) * 100;

    progressIntervalRef.current = window.setInterval(() => {
      setProgressPercent(prev => {
        if (prev >= 100) {
          goNext();
          return 0;
        }
        return prev + stepIncrement;
      });
    }, intervalMs);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, [autoScrollEnabled, autoScrollDuration, isPausedByHoverOrHold, isPlaying, goNext]);

  // Reset video and state on chunk change
  useEffect(() => {
    setShowDeeperSheet(false);
    setProgressPercent(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [safeIndex, selectedCategory]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
      if (isInstrumentalActive && !instrumental.getIsPlaying()) {
        instrumental.start(instrumentalStyle);
      }
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleVideoMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsVideoMuted(videoRef.current.muted);
  };

  const toggleInstrumentalMusic = () => {
    const nextState = !isInstrumentalActive;
    setIsInstrumentalActive(nextState);
    if (nextState) {
      sound.playChime(540);
      instrumental.start(instrumentalStyle);
    } else {
      instrumental.stop();
    }
  };

  const handleLike = () => {
    sound.playChime(600);
    setShowHeartPop(true);
    setTimeout(() => setShowHeartPop(false), 800);

    setLikesMap(prev => {
      const cur = prev[currentChunk.id] || { count: currentChunk.likes, liked: false };
      const nextLiked = !cur.liked;
      return {
        ...prev,
        [currentChunk.id]: {
          count: nextLiked ? cur.count + 1 : cur.count - 1,
          liked: nextLiked
        }
      };
    });
  };

  const handleSave = () => {
    sound.playChime(520);
    setSavedMap(prev => ({
      ...prev,
      [currentChunk.id]: !prev[currentChunk.id]
    }));
  };

  const handleShare = () => {
    sound.playChime(440);
    if (navigator.clipboard) {
      const shareText = `💡 ${currentChunk.headline}: ${currentChunk.title}\n\n${currentChunk.shortFact}\n\nKey Takeaway: ${currentChunk.keyTakeaway}${
        currentChunk.scriptureAnchor ? `\n\n📖 ${currentChunk.scriptureAnchor.ref} — ${currentChunk.scriptureAnchor.text}` : ''
      }`;
      navigator.clipboard.writeText(shareText);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Touch Swipe Handlers for mobile (Single-screen swipe between shorts)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    setIsPausedByHoverOrHold(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPausedByHoverOrHold(false);
    if (touchStartY.current === null) return;
    const diff = touchStartY.current - e.changedTouches[0].clientY;
    if (diff > 40) {
      goNext();
    } else if (diff < -40) {
      goPrev();
    }
    touchStartY.current = null;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'j') {
        goNext();
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        goPrev();
      } else if (e.key === ' ' || e.key === 'p') {
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev]);

  const currentLikeInfo = likesMap[currentChunk.id] || { count: currentChunk.likes, liked: false };
  const isSaved = !!savedMap[currentChunk.id];

  const getTypeBadgeStyle = (type: string) => {
    switch (type) {
      case 'brain':
        return 'bg-cyan-500/25 text-cyan-300 border-cyan-500/40';
      case 'body':
        return 'bg-rose-500/25 text-rose-300 border-rose-500/40';
      case 'stat':
        return 'bg-amber-500/25 text-amber-300 border-amber-500/40';
      case 'cross-addiction':
        return 'bg-purple-500/25 text-purple-300 border-purple-500/40';
      case 'scripture':
      case 'love':
        return 'bg-emerald-500/25 text-emerald-300 border-emerald-500/40';
      case 'peace':
        return 'bg-teal-500/25 text-teal-300 border-teal-500/40';
      case 'encouragement':
        return 'bg-amber-400/25 text-amber-300 border-amber-400/50';
      case 'strength':
        return 'bg-indigo-500/25 text-indigo-300 border-indigo-500/40';
      case 'tip':
      case 'urge':
        return 'bg-emerald-500/25 text-emerald-300 border-emerald-500/40';
      default:
        return 'bg-amber-500/25 text-amber-300 border-amber-500/40';
    }
  };

  return (
    <div 
      id="reel-feed-container" 
      className="w-full h-full flex items-center justify-center relative overflow-hidden select-none"
    >
      {/* Dynamic Truth Notification Toast */}
      <AnimatePresence>
        {inspireNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="absolute top-16 z-50 px-4 py-2 rounded-2xl bg-amber-500 text-slate-950 text-xs font-black shadow-2xl border border-yellow-300 pointer-events-none"
          >
            {inspireNotification}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main TikTok Video Stage (Fits 100% of mobile screen, centered on desktop) */}
      <div 
        ref={containerRef}
        className="relative w-full h-full sm:max-w-[420px] sm:h-[calc(100%-12px)] sm:my-auto bg-slate-950 sm:rounded-[36px] overflow-hidden sm:border sm:border-slate-800 shadow-2xl flex flex-col justify-between"
        onMouseEnter={() => setIsPausedByHoverOrHold(true)}
        onMouseLeave={() => setIsPausedByHoverOrHold(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        {/* Continuous Auto-scroll Progress Line */}
        {autoScrollEnabled && (
          <div className="absolute top-0 inset-x-0 z-30 h-1 bg-slate-800/40 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 transition-all duration-100 ease-linear"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        {/* Video Background Layer */}
        <div 
          className="absolute inset-0 z-0 bg-slate-950 cursor-pointer flex items-center justify-center"
          onClick={togglePlay}
        >
          <video
            ref={videoRef}
            src={currentChunk.videoUrl}
            poster={currentChunk.thumbnailUrl}
            autoPlay
            loop
            muted={isVideoMuted}
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Cinematic Scrim Vignette for supreme text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/45 to-slate-950/95 pointer-events-none" />

          {/* Play / Pause Indicator */}
          <AnimatePresence>
            {!isPlaying && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="w-16 h-16 rounded-full bg-black/75 backdrop-blur-md flex items-center justify-center text-white border border-white/20 z-20 pointer-events-none"
              >
                <Play className="w-8 h-8 fill-white ml-1" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Heart Pop on like */}
          <AnimatePresence>
            {showHeartPop && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 1 }}
                exit={{ scale: 2.2, opacity: 0 }}
                className="absolute text-rose-500 pointer-events-none z-30"
              >
                <Heart className="w-24 h-24 fill-rose-500 stroke-rose-400 drop-shadow-2xl" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Top Floating Glass Header (Inside Reel Card) */}
        <div className="relative z-20 flex items-center justify-between p-3 pt-2.5">
          {/* Left: Category Pill + Dashboard Drawer Trigger */}
          <button
            id="reel-category-drawer-btn"
            onClick={(e) => {
              e.stopPropagation();
              sound.playChime(480);
              setShowDashboardDrawer(true);
            }}
            className="px-2.5 py-1 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 backdrop-blur-md text-[11px] font-bold text-slate-200 flex items-center gap-1.5 shadow active:scale-95 transition cursor-pointer"
            title="Open Topics & Wisdom Dashboard"
          >
            <SlidersHorizontal className="w-3 h-3 text-amber-400" />
            <span className="truncate max-w-[110px]">{selectedCategory}</span>
            <span className="text-[10px] text-amber-400">▾</span>
          </button>

          {/* Center: Chunk Counter / Status */}
          <div className="flex items-center gap-1">
            {isPausedByHoverOrHold && autoScrollEnabled && (
              <span className="text-[9px] bg-amber-500/25 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold animate-pulse">
                Paused
              </span>
            )}
            <span className="text-[10px] font-black text-slate-300 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
              {safeIndex + 1}/{filteredChunks.length}
            </span>
          </div>

          {/* Right: Search, Sound & Settings */}
          <div className="flex items-center gap-1">
            {/* Search Trigger */}
            <button
              id="reel-search-btn"
              onClick={(e) => {
                e.stopPropagation();
                sound.playChime(500);
                setShowSearchBar(!showSearchBar);
              }}
              className={`p-1.5 rounded-full backdrop-blur-md transition active:scale-90 cursor-pointer ${
                showSearchBar || searchQuery
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-black/50 text-slate-300 hover:text-white border border-white/10'
              }`}
              title="Search truth topics"
            >
              <Search className="w-3.5 h-3.5" />
            </button>

            {/* Video Mute Toggle */}
            <button
              id="reel-video-mute-btn"
              onClick={(e) => { 
                e.stopPropagation(); 
                toggleVideoMute(); 
              }}
              className="p-1.5 rounded-full bg-black/50 backdrop-blur-md text-white/90 hover:text-white border border-white/10 transition active:scale-90 cursor-pointer"
              title={isVideoMuted ? 'Unmute video audio' : 'Mute video audio'}
            >
              {isVideoMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-300" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
          </div>
        </div>

        {/* Quick In-Feed Search Overlay Bar */}
        <AnimatePresence>
          {showSearchBar && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="relative z-30 px-3 py-1"
            >
              <div className="relative w-full flex items-center">
                <Search className="w-3.5 h-3.5 absolute left-3 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    setCurrentIndex(0);
                  }}
                  placeholder="Filter by peace, mercy, habit, tip, fear..."
                  className="w-full pl-8 pr-7 py-1.5 rounded-2xl bg-slate-900/95 border border-amber-500/60 text-xs text-white placeholder-slate-400 outline-none shadow-xl"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* RIGHT VERTICAL ACTION RAIL (Pure TikTok Style) */}
        <div className="absolute right-2 sm:right-3 bottom-24 z-20 flex flex-col items-center gap-2.5">
          {/* Like */}
          <div className="flex flex-col items-center">
            <button
              id="reel-like-btn"
              onClick={handleLike}
              className={`p-2.5 rounded-full backdrop-blur-md border transition-transform active:scale-75 shadow-lg cursor-pointer ${
                currentLikeInfo.liked
                  ? 'bg-rose-500/30 border-rose-500 text-rose-500'
                  : 'bg-black/60 border-white/20 text-white hover:bg-black/80'
              }`}
            >
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${currentLikeInfo.liked ? 'fill-rose-500' : ''}`} />
            </button>
            <span className="text-[9px] font-bold text-white mt-0.5 drop-shadow">
              {currentLikeInfo.count.toLocaleString()}
            </span>
          </div>

          {/* Bookmark/Save */}
          <div className="flex flex-col items-center">
            <button
              id="reel-save-btn"
              onClick={handleSave}
              className={`p-2.5 rounded-full backdrop-blur-md border transition-transform active:scale-75 shadow-lg cursor-pointer ${
                isSaved
                  ? 'bg-amber-500/30 border-amber-500 text-amber-400'
                  : 'bg-black/60 border-white/20 text-white hover:bg-black/80'
              }`}
            >
              <Bookmark className={`w-4 h-4 sm:w-5 sm:h-5 ${isSaved ? 'fill-amber-400' : ''}`} />
            </button>
            <span className="text-[9px] font-bold text-white mt-0.5 drop-shadow">
              {isSaved ? 'Saved' : 'Save'}
            </span>
          </div>

          {/* Deeper Clinical Study / Nuance Trigger */}
          <div className="flex flex-col items-center">
            <button
              id="reel-context-btn"
              onClick={() => {
                sound.playChime(500);
                setShowDeeperSheet(true);
              }}
              className="p-2.5 rounded-full bg-cyan-950/70 backdrop-blur-md border border-cyan-400/40 text-cyan-300 hover:bg-cyan-900/80 transition active:scale-75 shadow-lg cursor-pointer"
              title="Read deeper clinical study & context"
            >
              <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
            </button>
            <span className="text-[9px] font-bold text-cyan-300 mt-0.5 drop-shadow">
              Study
            </span>
          </div>

          {/* Calm Instrumental Music Toggle */}
          <div className="flex flex-col items-center">
            <button
              id="reel-music-btn"
              onClick={toggleInstrumentalMusic}
              className={`p-2.5 rounded-full backdrop-blur-md border transition active:scale-75 shadow-lg cursor-pointer ${
                isInstrumentalActive
                  ? 'bg-emerald-500/30 border-emerald-500 text-emerald-400'
                  : 'bg-black/60 border-white/20 text-slate-400'
              }`}
              title="Toggle calm background instrumental music"
            >
              <Music className={`w-4 h-4 sm:w-5 sm:h-5 ${isInstrumentalActive ? 'animate-pulse text-emerald-400' : ''}`} />
            </button>
            <span className="text-[9px] font-bold text-emerald-300 mt-0.5 drop-shadow">
              Music
            </span>
          </div>

          {/* Share */}
          <div className="flex flex-col items-center">
            <button
              id="reel-share-btn"
              onClick={handleShare}
              className="p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-black/80 transition active:scale-75 shadow-lg cursor-pointer"
              title="Copy and share this truth"
            >
              {copiedLink ? <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" /> : <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
            <span className="text-[9px] font-bold text-white mt-0.5 drop-shadow">
              {copiedLink ? 'Copied' : 'Share'}
            </span>
          </div>

          {/* Live Voice Companion Trigger */}
          {onOpenLiveVoice && (
            <div className="flex flex-col items-center">
              <button
                id="reel-live-voice-btn"
                onClick={() => {
                  sound.playChime(560);
                  onOpenLiveVoice();
                }}
                className="p-2.5 rounded-full bg-gradient-to-tr from-cyan-500/80 to-teal-500/80 backdrop-blur-md border border-cyan-400 text-slate-950 hover:scale-110 active:scale-80 transition shadow-lg shadow-cyan-500/30 cursor-pointer"
                title="Talk in real-time with Live Voice Companion (Gemini Live)"
              >
                <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950" />
              </button>
              <span className="text-[9px] font-bold text-cyan-300 mt-0.5 drop-shadow">
                Voice
              </span>
            </div>
          )}

          {/* Inspire Fresh Truth (+) */}
          <div className="flex flex-col items-center pt-1">
            <button
              id="reel-inspire-plus-btn"
              onClick={handleGenerateFreshTruth}
              className="p-2.5 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 font-black hover:scale-110 active:scale-90 shadow-xl transition cursor-pointer"
              title="Generate fresh scripture truth"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            </button>
            <span className="text-[8px] font-black text-amber-300 mt-0.5 uppercase">
              Inspire+
            </span>
          </div>

          {/* Next Chunk Arrow Button */}
          <div className="flex flex-col items-center pt-1">
            <button
              id="reel-next-btn"
              onClick={goNext}
              className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center hover:bg-amber-400 active:scale-80 transition cursor-pointer shadow-md"
              title="Next short"
            >
              <ChevronDown className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* BOTTOM VIDEO OVERLAY: SINGLE BITE-SIZED TRUTH */}
        <div className="relative z-10 px-4 pb-4 max-w-[84%] flex flex-col justify-end">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentChunk.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-2 text-left"
            >
              {/* Type Badge & Category */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border shadow-sm ${getTypeBadgeStyle(currentChunk.type)}`}>
                  {currentChunk.typeLabel}
                </span>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  {currentChunk.headline}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-base sm:text-lg font-black text-white leading-tight drop-shadow-md">
                {currentChunk.title}
              </h2>

              {/* Bite-Sized Fact Card (The single readable chunk) */}
              <div 
                onClick={() => setShowDeeperSheet(true)}
                className="p-3 rounded-2xl bg-slate-950/85 backdrop-blur-xl border border-slate-700/80 shadow-2xl relative cursor-pointer active:scale-98 transition"
              >
                <p className="text-xs sm:text-[13px] text-slate-100 font-medium leading-relaxed drop-shadow-sm">
                  {currentChunk.shortFact}
                </p>

                <div className="mt-1.5 flex items-center justify-between text-[10px] text-amber-400 font-bold">
                  <span>📖 Tap to expand clinical study</span>
                  <span>▸</span>
                </div>
              </div>

              {/* Scripture Weapon Anchor */}
              {currentChunk.scriptureAnchor ? (
                <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-950/80 via-slate-950/85 to-amber-950/80 backdrop-blur-md border border-emerald-500/40 shadow">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="font-serif-biblical font-bold text-amber-300 text-[11px] flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-amber-400" />
                      {currentChunk.scriptureAnchor.ref}
                    </span>
                    <span className="text-[8px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-black uppercase">
                      Truth Weapon
                    </span>
                  </div>
                  <p className="italic text-[11px] font-serif-biblical text-slate-200 line-clamp-2">
                    “{currentChunk.scriptureAnchor.text}”
                  </p>
                </div>
              ) : (
                <div className="p-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-cyan-500/35 text-[11px] text-cyan-200">
                  <span className="font-bold text-cyan-300 block">Takeaway:</span>
                  <p className="line-clamp-2">{currentChunk.keyTakeaway}</p>
                </div>
              )}

              {/* Swipe Up Hint */}
              <div 
                onClick={goNext}
                className="flex items-center gap-1.5 text-[10px] text-slate-400 hover:text-amber-300 cursor-pointer pt-0.5"
              >
                <ArrowDown className="w-3 h-3 text-amber-400 animate-bounce" />
                <span className="font-semibold">Swipe or tap next for more truth</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* OFF-CANVAS DASHBOARD & TOPICS SLIDER DRAWER */}
      <AnimatePresence>
        {showDashboardDrawer && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDashboardDrawer(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Slide-out Panel from Left */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-sm h-full bg-slate-950 border-r border-slate-800 shadow-2xl z-10 flex flex-col justify-between overflow-hidden"
            >
              {/* Drawer Top Header */}
              <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/50">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-black text-white">Wisdom Dashboard & Topics</h3>
                </div>
                <button
                  onClick={() => setShowDashboardDrawer(false)}
                  className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs text-left">
                {/* Search In Feed */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Search Within Shorts
                  </label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => {
                        setSearchQuery(e.target.value);
                        setCurrentIndex(0);
                      }}
                      placeholder="Filter topics (mercy, peace, cold water, tips)..."
                      className="w-full pl-8 pr-7 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Category Selection Filter */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Categories & Scripture Themes
                    </label>
                    <span className="text-[10px] text-amber-400 font-bold">
                      {combinedAllChunks.length} Total
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {CATEGORIES.map(cat => {
                      const count = cat === 'All'
                        ? combinedAllChunks.length
                        : combinedAllChunks.filter(r => r.category === cat).length;
                      const isActive = selectedCategory === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => {
                            sound.playChime(480);
                            setSelectedCategory(cat);
                            setCurrentIndex(0);
                            setShowDashboardDrawer(false);
                          }}
                          className={`p-2 rounded-xl font-bold transition flex items-center justify-between text-left cursor-pointer border ${
                            isActive
                              ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow'
                              : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                          }`}
                        >
                          <span className="truncate text-xs">{cat}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                            isActive ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Instrumental Soundscape Switcher */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Calm Instrumental Soundscape
                  </label>
                  <div className="space-y-1.5">
                    {[
                      { id: 'lofi', label: 'Lofi Peace Chords', desc: 'Warm electric piano loop' },
                      { id: 'celestial432', label: '432Hz Celestial Pad', desc: 'Deep calm harmonic drone' },
                      { id: 'harp', label: 'Meditative Harp', desc: 'Gentle pentatonic arpeggio' },
                      { id: 'waves', label: 'Calm Ocean Waves', desc: 'Singing bowl & surf filter' }
                    ].map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          sound.playChime(520);
                          setInstrumentalStyle(item.id as InstrumentalStyle);
                          instrumental.setStyle(item.id as InstrumentalStyle);
                          if (!isInstrumentalActive) {
                            setIsInstrumentalActive(true);
                            instrumental.start(item.id as InstrumentalStyle);
                          }
                        }}
                        className={`w-full p-2.5 rounded-xl text-left transition cursor-pointer border flex items-center justify-between ${
                          isInstrumentalActive && instrumentalStyle === item.id
                            ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500/50 font-bold'
                            : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-semibold">{item.label}</div>
                          <div className="text-[10px] opacity-75">{item.desc}</div>
                        </div>
                        {isInstrumentalActive && instrumentalStyle === item.id && (
                          <Check className="w-4 h-4 text-emerald-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auto-Scroll Timer */}
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Timer className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-bold text-white text-xs">Auto-Advance</span>
                    </div>
                    <button
                      onClick={() => {
                        sound.playChime(460);
                        setAutoScrollEnabled(!autoScrollEnabled);
                      }}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        autoScrollEnabled ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {autoScrollEnabled ? 'Active' : 'Paused'}
                    </button>
                  </div>
                  {autoScrollEnabled && (
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[11px] text-slate-400">Duration per short:</span>
                      <select
                        value={autoScrollDuration}
                        onChange={e => {
                          setAutoScrollDuration(Number(e.target.value));
                          setProgressPercent(0);
                        }}
                        className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                      >
                        <option value={8}>8 seconds</option>
                        <option value={10}>10 seconds</option>
                        <option value={14}>14 seconds</option>
                        <option value={18}>18 seconds</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Infinite Wisdom Stream Generator */}
                <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-amber-300 text-xs block">Infinite Stream Mode</span>
                    <span className="text-[10px] text-slate-400">Generates fresh wisdom as you scroll</span>
                  </div>
                  <button
                    onClick={() => {
                      sound.playChime(460);
                      setInfiniteMode(!infiniteMode);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      infiniteMode
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                        : 'bg-slate-900 text-slate-400 border-slate-700'
                    }`}
                  >
                    {infiniteMode ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-4 border-t border-slate-800/80 bg-slate-900/50 flex items-center gap-2">
                <button
                  onClick={() => {
                    handleGenerateFreshTruth();
                    setShowDashboardDrawer(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs shadow hover:brightness-110 active:scale-95 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  Inspire New Truth
                </button>
                <button
                  onClick={() => setShowDashboardDrawer(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:text-white"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DEEP CLINICAL NUANCE BOTTOM SHEET */}
      <AnimatePresence>
        {showDeeperSheet && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeeperSheet(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative w-full max-w-lg bg-slate-900 border-t sm:border border-slate-700 rounded-t-[32px] sm:rounded-3xl shadow-2xl p-6 z-10 max-h-[85vh] overflow-y-auto text-left"
            >
              <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-4 sm:hidden" />

              <div className="flex items-center justify-between mb-3">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${getTypeBadgeStyle(currentChunk.type)}`}>
                  {currentChunk.typeLabel}
                </span>
                <button
                  onClick={() => setShowDeeperSheet(false)}
                  className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-lg font-black text-white mb-2">
                {currentChunk.title}
              </h3>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 mb-4">
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {currentChunk.shortFact}
                </p>
              </div>

              {/* Clinical Nuance */}
              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30">
                  <h4 className="font-bold text-cyan-300 mb-1 flex items-center gap-1.5 text-xs">
                    <Brain className="w-3.5 h-3.5" /> Clinical & Neurobiological Study
                  </h4>
                  <p className="leading-relaxed text-slate-200">
                    {currentChunk.deeperDetail}
                  </p>
                </div>

                {currentChunk.scriptureAnchor && (
                  <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
                    <h4 className="font-serif-biblical font-bold text-amber-300 mb-1 flex items-center gap-1.5 text-xs">
                      <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                      Scripture Anchor: {currentChunk.scriptureAnchor.ref}
                    </h4>
                    <p className="italic font-serif-biblical text-slate-100 leading-relaxed">
                      “{currentChunk.scriptureAnchor.text}”
                    </p>
                  </div>
                )}

                <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30">
                  <h4 className="font-bold text-amber-300 mb-1 flex items-center gap-1.5 text-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Tactical Habit Action Step
                  </h4>
                  <p className="text-slate-200 leading-relaxed">
                    {currentChunk.keyTakeaway}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowDeeperSheet(false);
                    onOpenPause();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs shadow transition active:scale-95"
                >
                  60-Second Urge Pause
                </button>
                <button
                  onClick={() => setShowDeeperSheet(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:text-white"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
