import React, { useState } from 'react';
import { Download, Share, PlusSquare, Check, X, Smartphone, Monitor } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { sound } from '../utils/sound';

interface PWAInstallButtonProps {
  compact?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showDesktopHelp, setShowDesktopHelp] = useState(false);

  // If already installed and running as standalone app, don't show install prompt
  if (isInstalled) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-400">
        <Check className="w-3 h-3" /> App Active
      </span>
    );
  }

  const handleInstallClick = async () => {
    sound.playChime(580);
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      setShowDesktopHelp(true);
    }
  };

  return (
    <>
      <button
        id="pwa-install-btn"
        onClick={handleInstallClick}
        className={`relative group inline-flex items-center justify-center gap-1.5 rounded-xl font-bold transition-all shadow-md active:scale-95 cursor-pointer ${
          compact
            ? 'p-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-500/40 text-amber-300 text-xs'
            : 'px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:brightness-110 text-xs shadow-amber-500/20'
        }`}
        title="Install as App on Phone or PC"
      >
        <Download className="w-3.5 h-3.5 animate-bounce" />
        {!compact && <span className="font-black tracking-tight">Install App</span>}
      </button>

      {/* iOS Safari Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-left relative">
            <button
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4">
              <Smartphone className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-white font-serif-biblical">
              Install on iPhone or iPad
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Add Overcome directly to your home screen for an instant, full-screen native experience without browser bars:
            </p>

            <div className="mt-4 space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">1</span>
                <div>
                  <p className="font-bold text-white flex items-center gap-1.5">
                    Tap the Share button <Share className="w-3.5 h-3.5 text-cyan-400 inline" />
                  </p>
                  <p className="text-[11px] text-slate-400">Located at the bottom of Safari on iPhone, or top bar on iPad.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">2</span>
                <div>
                  <p className="font-bold text-white flex items-center gap-1.5">
                    Select “Add to Home Screen” <PlusSquare className="w-3.5 h-3.5 text-emerald-400 inline" />
                  </p>
                  <p className="text-[11px] text-slate-400">Scroll down in the share sheet options.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">3</span>
                <div>
                  <p className="font-bold text-white">Tap “Add” in top right</p>
                  <p className="text-[11px] text-slate-400">The app icon will immediately appear on your phone home screen.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      )}

      {/* Desktop / Android General Instructions Modal if browser prompt not fired yet */}
      {showDesktopHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-left relative">
            <button
              onClick={() => setShowDesktopHelp(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4">
              <Monitor className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-white font-serif-biblical">
              Install Overcome on Your Device
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              You can install this app on your PC, Mac, Chromebook, or Android phone:
            </p>

            <div className="mt-4 space-y-2.5 text-xs text-slate-300">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <p className="font-bold text-white">Desktop (Chrome / Edge):</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Click the <strong>Install</strong> icon in your browser address bar (top right, looks like a monitor or download arrow) or select <strong>Menu (⋮) → Save and share → Install app</strong>.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <p className="font-bold text-white">Android (Chrome):</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Tap <strong>Menu (⋮)</strong> in Chrome and choose <strong>“Install app”</strong> or <strong>“Add to Home screen”</strong>.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowDesktopHelp(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
