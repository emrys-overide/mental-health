import React, { useState } from 'react';
import { 
  Cloud, CloudCheck, LogIn, LogOut, User as UserIcon, 
  X, RefreshCw, ShieldCheck, CheckCircle2 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/sound';

export function UserAuthButton() {
  const { user, loading, isCloudSynced, login, logout, syncDataNow } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const handleOpen = () => {
    sound.playPop();
    setShowModal(true);
  };

  const handleLogin = async () => {
    try {
      sound.playChime(500);
      await login();
      setShowModal(false);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleLogout = async () => {
    try {
      sound.playChime(350);
      await logout();
      setShowModal(false);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleManualSync = async () => {
    try {
      setIsSyncing(true);
      sound.playChime(480);
      await syncDataNow();
      setSyncFeedback('All recovery streaks & urge logs synced with Firestore!');
      setTimeout(() => setSyncFeedback(null), 3000);
    } catch (err) {
      setSyncFeedback('Sync error. Will retry automatically.');
    } finally {
      setIsSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="w-7 h-7 rounded-xl bg-slate-900 border border-slate-800 animate-pulse" />
    );
  }

  return (
    <>
      {/* Trigger Button in Header */}
      {user ? (
        <button
          id="header-user-profile-btn"
          onClick={handleOpen}
          className="flex items-center gap-1.5 p-1 pr-2 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 text-xs font-bold text-slate-200 transition cursor-pointer active:scale-95 shadow-sm"
          title={`Signed in as ${user.displayName || user.email}`}
        >
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName || 'User'} 
              className="w-5 h-5 rounded-lg object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-amber-400 to-emerald-400 flex items-center justify-center text-slate-950 text-[10px] font-black">
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
          <span className="hidden md:inline max-w-[80px] truncate text-[11px]">
            {user.displayName?.split(' ')[0] || 'Account'}
          </span>
          <span 
            className={`w-1.5 h-1.5 rounded-full ${isCloudSynced ? 'bg-emerald-400' : 'bg-amber-400'}`} 
            title={isCloudSynced ? 'Cloud Firestore synced' : 'Syncing...'} 
          />
        </button>
      ) : (
        <button
          id="header-google-signin-btn"
          onClick={handleOpen}
          className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/15 to-emerald-500/15 hover:from-cyan-500/25 hover:to-emerald-500/25 border border-cyan-500/35 text-xs font-bold text-cyan-200 transition flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
          title="Sign in with Google to sync recovery progress"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span className="hidden sm:inline">Sign In</span>
        </button>
      )}

      {/* Account & Auth Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-serif-biblical">
                  {user ? 'Account & Cloud Sync' : 'Firebase Cloud Sync'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {user ? (
              <div className="space-y-4">
                {/* User Info Card */}
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || ''} 
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-700"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-amber-500 flex items-center justify-center text-slate-950 font-bold text-lg">
                      {user.displayName?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <h4 className="text-sm font-bold text-white truncate">
                      {user.displayName || 'Overcomer'}
                    </h4>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    <div className="flex items-center gap-1 mt-1 text-[11px] text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Cloud Firestore Connected</span>
                    </div>
                  </div>
                </div>

                {/* Sync Status Banner */}
                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-xs text-cyan-200 space-y-1">
                  <p className="font-semibold flex items-center gap-1.5">
                    <Cloud className="w-3.5 h-3.5 text-cyan-400" />
                    Cloud Backup Active
                  </p>
                  <p className="text-[11px] text-slate-300">
                    Your clean streak counts, milestone badges, daily devotions, and urge logs automatically synchronize to your private Firebase Firestore database.
                  </p>
                </div>

                {syncFeedback && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium text-center">
                    {syncFeedback}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-2 pt-1">
                  <button
                    onClick={handleManualSync}
                    disabled={isSyncing}
                    className="w-full py-2.5 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? 'Syncing with Firestore...' : 'Sync Data Now'}
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-800 hover:border-rose-500/30 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Cloud className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Protect Your Recovery Progress</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Sign in with your Google account to back up your Victory Streaks, 60-second urge logs, and daily devotion reflections securely to Google Cloud Firestore.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Cross-Device Recovery Sync</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Preserves existing offline streaks & badges</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Private & secure under your Google ID</span>
                  </div>
                </div>

                <button
                  id="modal-google-signin-btn"
                  onClick={handleLogin}
                  className="w-full py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold transition flex items-center justify-center gap-2.5 shadow-lg shadow-white/5 cursor-pointer active:scale-98"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
