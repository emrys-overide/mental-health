import { useState, useRef, useEffect, useCallback } from 'react';
import { pcmFloat32ToBase64, LiveAudioPlayer } from '../utils/liveAudio';

export interface LiveTranscriptItem {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export type LiveSessionStatus = 'idle' | 'connecting' | 'connected' | 'error' | 'closed';

export function useLiveVoice() {
  const [status, setStatus] = useState<LiveSessionStatus>('idle');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<LiveTranscriptItem[]>([]);
  const [micVolume, setMicVolume] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const audioPlayerRef = useRef<LiveAudioPlayer | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorNodeRef = useRef<ScriptProcessorNode | null>(null);
  const isMutedRef = useRef(false);

  // Keep isMutedRef in sync with state
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  const disconnect = useCallback(() => {
    // 1. Clean up audio player
    if (audioPlayerRef.current) {
      audioPlayerRef.current.stopAndClear();
      audioPlayerRef.current.close();
      audioPlayerRef.current = null;
    }

    // 2. Clean up mic stream & context
    if (processorNodeRef.current) {
      processorNodeRef.current.disconnect();
      processorNodeRef.current = null;
    }
    if (inputAudioCtxRef.current && inputAudioCtxRef.current.state !== 'closed') {
      inputAudioCtxRef.current.close().catch(() => {});
      inputAudioCtxRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    // 3. Clean up WebSocket
    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.onerror = null;
      wsRef.current.onmessage = null;
      if (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING) {
        wsRef.current.close();
      }
      wsRef.current = null;
    }

    setStatus('closed');
    setIsSpeaking(false);
    setMicVolume(0);
  }, []);

  const connect = useCallback(async () => {
    disconnect();
    setStatus('connecting');
    setErrorMessage(null);

    try {
      // 1. Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;

      // 2. Setup 16kHz Input Audio Context for speech capture
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new AudioCtx({ sampleRate: 16000 });
      inputAudioCtxRef.current = inputCtx;

      const player = new LiveAudioPlayer();
      audioPlayerRef.current = player;

      // 3. Connect to server WebSocket at /api/live
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[Live Voice] WebSocket opened');
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.type === 'ready') {
            setStatus('connected');
          } else if (msg.type === 'audio' && msg.audio) {
            player.enqueueChunk(
              msg.audio,
              () => setIsSpeaking(true),
              () => setIsSpeaking(false)
            );
          } else if (msg.type === 'interrupted') {
            // User began speaking or interrupted
            player.stopAndClear();
            setIsSpeaking(false);
          } else if (msg.type === 'transcript') {
            const role = msg.role === 'user' ? 'user' : 'model';
            setTranscripts((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.role === role && Date.now() - last.timestamp < 4000) {
                return [
                  ...prev.slice(0, -1),
                  { ...last, text: last.text + ' ' + msg.text },
                ];
              }
              return [
                ...prev,
                {
                  id: Math.random().toString(36).substring(2, 9),
                  role,
                  text: msg.text,
                  timestamp: Date.now(),
                },
              ];
            });
          } else if (msg.type === 'error') {
            console.error('[Live Voice] Error from server:', msg.message);
            setErrorMessage(msg.message || 'Live API error');
            setStatus('error');
          } else if (msg.type === 'closed') {
            setStatus('closed');
          }
        } catch (e) {
          console.error('[Live Voice] Failed to process incoming message:', e);
        }
      };

      ws.onerror = (err) => {
        console.error('[Live Voice] WebSocket error:', err);
        setErrorMessage('Unable to connect to the Live Voice server.');
        setStatus('error');
      };

      ws.onclose = () => {
        console.log('[Live Voice] WebSocket closed');
        setStatus('closed');
        setIsSpeaking(false);
      };

      // 4. Hook up microphone audio processor
      const source = inputCtx.createMediaStreamSource(stream);
      // ScriptProcessor with 2048 buffer size gives ~128ms packets at 16kHz
      const processor = inputCtx.createScriptProcessor(2048, 1, 1);
      processorNodeRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (isMutedRef.current) {
          setMicVolume(0);
          return;
        }

        const inputData = e.inputBuffer.getChannelData(0);

        // Calculate simple volume level for visualizer
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          sum += inputData[i] * inputData[i];
        }
        const rms = Math.sqrt(sum / inputData.length);
        setMicVolume(Math.min(1, rms * 5));

        // Stream audio chunk to Live API WebSocket
        if (ws.readyState === WebSocket.OPEN) {
          const base64Audio = pcmFloat32ToBase64(inputData);
          ws.send(JSON.stringify({ audio: base64Audio }));
        }
      };

      source.connect(processor);
      processor.connect(inputCtx.destination);
    } catch (err: any) {
      console.error('[Live Voice] Microphone or connection initialization error:', err);
      setErrorMessage(
        err?.name === 'NotAllowedError'
          ? 'Microphone permission was denied. Please allow microphone access to talk.'
          : err?.message || 'Failed to start Live Voice session.'
      );
      setStatus('error');
    }
  }, [disconnect]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const sendTextMessage = useCallback((text: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    setTranscripts((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        role: 'user',
        text,
        timestamp: Date.now(),
      },
    ]);
    wsRef.current.send(JSON.stringify({ text }));
  }, []);

  const clearTranscripts = useCallback(() => {
    setTranscripts([]);
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
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
    clearTranscripts,
  };
}
