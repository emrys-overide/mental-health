import React, { useEffect, useRef, useState } from 'react';
import { 
  Mic, MicOff, Volume2, VolumeX, Sparkles, X, 
  RefreshCw, AlertCircle, MessageSquare, Flame, 
  HeartHandshake, BookOpen, Send
} from 'lucide-react';
import { useLiveVoice } from '../hooks/useLiveVoice';
import { sound } from '../utils/sound';

interface LiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LiveVoiceModal({ isOpen, onClose }: LiveVoiceModalProps) {
  const {
    status,
    isSpeaking,
    isMuted,
    errorMessage,
    transcripts,
    micVolume,
    connect,
    disconnect,
    toggleMute,
    sendTextMessage,
  } = useLiveVoice();

  const [textInput, setTextInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-connect when opened
  useEffect(() => {
    if (isOpen) {
      connect();
    } else {
      disconnect();
    }
  }, [isOpen, connect, disconnect]);

  // Scroll to bottom on new transcripts
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts]);

  if (!isOpen) return null;

  const quickPrompts = [
    { label: "Urge SOS", text: "I'm experiencing an intense urge right now. Can you guide me through a calm pause?", icon: Flame },
    { label: "Short Prayer", text: "Can you lead me in a short, grounding prayer for mind renewal?", icon: HeartHandshake },
    { label: "Scripture Anchor", text: "Remind me of God's promise in 1 Corinthians 10:13 and Romans 12:2.", icon: BookOpen },
    { label: "Science Check", text: "Explain why this craving will peak and fade within 90 seconds if I don't feed it.", icon: Sparkles },
  ];

  const handleSendPrompt = (promptText: string) => {
    sound.playPop();
    sendTextMessage(promptText);
  };

  const handleSendTyped = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    handleSendPrompt(textInput.trim());
    setTextInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-950 border border-slate-800/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-amber-400 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white font-serif-biblical">
                  RenewMind Voice Companion
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Live API
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                Powered by <span className="text-slate-300 font-mono text-[10px]">gemini-3.1-flash-live-preview</span>
              </p>
            </div>
          </div>

          <button
            id="close-live-voice-btn"
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer border border-slate-800"
            title="Close conversation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Voice Visualizer Section */}
        <div className="p-6 bg-gradient-to-b from-slate-900/70 via-slate-950 to-slate-950 flex flex-col items-center justify-center border-b border-slate-800/60 relative overflow-hidden">
          
          {/* Animated Glow Waves */}
          <div 
            className={`absolute w-64 h-64 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
              isSpeaking
                ? 'bg-amber-500/20 scale-125'
                : status === 'connected'
                ? 'bg-cyan-500/15 scale-100'
                : 'bg-slate-800/10 scale-75'
            }`}
          />

          {/* Central Animated Orb */}
          <div className="relative mb-3 flex items-center justify-center">
            {/* Outer pulsating ring */}
            <div 
              className={`absolute rounded-full transition-all duration-300 ${
                isSpeaking 
                  ? 'w-28 h-28 bg-amber-400/20 animate-ping'
                  : micVolume > 0.05
                  ? 'w-24 h-24 bg-cyan-400/25 animate-pulse'
                  : 'w-20 h-20 bg-slate-800/40'
              }`}
            />
            
            {/* Core Orb */}
            <div 
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
                status === 'connecting'
                  ? 'bg-gradient-to-tr from-slate-800 to-slate-700 animate-pulse text-slate-400'
                  : isSpeaking
                  ? 'bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 scale-110 shadow-amber-500/40'
                  : isMuted
                  ? 'bg-gradient-to-tr from-rose-900 to-rose-700 text-rose-200'
                  : micVolume > 0.05
                  ? 'bg-gradient-to-tr from-cyan-400 to-teal-500 text-slate-950 scale-105 shadow-cyan-500/40'
                  : 'bg-gradient-to-tr from-slate-850 to-slate-800 border border-slate-700 text-cyan-400'
              }`}
            >
              {isSpeaking ? (
                <Volume2 className="w-8 h-8 animate-bounce" />
              ) : isMuted ? (
                <MicOff className="w-8 h-8" />
              ) : (
                <Mic className={`w-8 h-8 ${micVolume > 0.05 ? 'scale-110' : ''}`} />
              )}
            </div>
          </div>

          {/* State Indicator Text */}
          <div className="text-center z-10">
            {status === 'connecting' && (
              <span className="text-xs font-semibold text-cyan-400 flex items-center justify-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Connecting to Gemini Live voice channel...
              </span>
            )}
            {status === 'connected' && isSpeaking && (
              <span className="text-xs font-bold text-amber-400 tracking-wide flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" /> RenewMind Companion is speaking...
              </span>
            )}
            {status === 'connected' && !isSpeaking && !isMuted && (
              <span className="text-xs font-medium text-emerald-400 flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Listening to your voice... Speak freely
              </span>
            )}
            {status === 'connected' && isMuted && (
              <span className="text-xs font-medium text-rose-400">
                Microphone is muted
              </span>
            )}
            {status === 'error' && (
              <span className="text-xs font-medium text-rose-400 flex items-center justify-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> Connection issue
              </span>
            )}
            {status === 'closed' && (
              <span className="text-xs text-slate-400">
                Live voice session ended
              </span>
            )}
          </div>

          {/* Error Details if any */}
          {errorMessage && (
            <div className="mt-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-[11px] text-rose-300 max-w-sm text-center">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Live Conversation Transcript Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[140px] max-h-[220px] bg-slate-950/60">
          {transcripts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-500">
              <MessageSquare className="w-7 h-7 mb-2 opacity-40 text-cyan-400" />
              <p className="text-xs">Real-time transcripts will appear here as you speak.</p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Say "Hello", share what you're battling, or ask for a verse of strength.
              </p>
            </div>
          ) : (
            transcripts.map((item) => (
              <div
                key={item.id}
                className={`flex flex-col ${
                  item.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                    item.role === 'user'
                      ? 'bg-cyan-500/20 text-cyan-100 border border-cyan-500/30 rounded-br-sm'
                      : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-sm font-serif-biblical'
                  }`}
                >
                  <span className="block text-[10px] font-bold tracking-wider uppercase mb-0.5 opacity-60">
                    {item.role === 'user' ? 'You' : 'Companion'}
                  </span>
                  {item.text}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-900 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {quickPrompts.map((qp, i) => {
            const Icon = qp.icon;
            return (
              <button
                key={i}
                onClick={() => handleSendPrompt(qp.text)}
                disabled={status !== 'connected'}
                className="shrink-0 px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-medium flex items-center gap-1 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
              >
                <Icon className="w-3 h-3 text-cyan-400" />
                {qp.label}
              </button>
            );
          })}
        </div>

        {/* Optional Typed Message Input for Quiet Environments */}
        <form onSubmit={handleSendTyped} className="px-4 py-2.5 bg-slate-950 border-t border-slate-900 flex items-center gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Or type a message to the voice companion..."
            disabled={status !== 'connected'}
            className="flex-1 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status !== 'connected' || !textInput.trim()}
            className="p-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 disabled:opacity-40 transition cursor-pointer"
            title="Send text"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Bottom Control Bar */}
        <div className="px-5 py-3.5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between gap-3">
          
          {/* Mute Toggle */}
          <button
            id="live-voice-toggle-mute-btn"
            onClick={toggleMute}
            disabled={status !== 'connected'}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
              isMuted
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isMuted ? 'Unmute Mic' : 'Mute Mic'}</span>
          </button>

          {/* Reconnect / Status */}
          {status === 'error' || status === 'closed' ? (
            <button
              onClick={connect}
              className="px-4 py-2 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reconnect Live Session
            </button>
          ) : (
            <button
              id="live-voice-end-session-btn"
              onClick={onClose}
              className="px-4 py-2 rounded-2xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/30 border border-slate-700 text-xs font-bold text-slate-300 transition flex items-center gap-1.5 cursor-pointer"
            >
              End Conversation
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
