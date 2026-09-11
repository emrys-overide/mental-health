import express from "express";
import http from "http";
import path from "path";
import { createServer as createViteServer } from "vite";
import { WebSocketServer, WebSocket } from "ws";
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const PORT = 3000;

  app.use(express.json());

  // API Health Check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      liveModel: "gemini-3.1-flash-live-preview",
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // WebSocket Server for Live API (/api/live)
  const wss = new WebSocketServer({ server, path: "/api/live" });

  let aiClient: GoogleGenAI | null = null;
  function getAIClient(): GoogleGenAI {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured in the environment");
      }
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  wss.on("connection", async (clientWs: WebSocket) => {
    console.log("[Live API] Client connected for voice conversation");
    let session: any = null;

    try {
      const ai = getAIClient();

      session = await ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction: `You are the RenewMind Voice Companion—a compassionate, faith-grounded, and neuroscience-informed recovery partner.
You speak with warmth, peaceful presence, and understanding.
You are grounded in Scripture (Romans 12:2 on renewing the mind, 1 Corinthians 10:13 on God providing a way out, Philippians 4:8 on what is noble, Psalm 46:1 on God being an ever-present help) and modern neuroplasticity (urges peak and fade within 90 seconds, dopamine anticipation vs true peace, prefrontal inhibition).
Guidelines:
- Keep your spoken responses concise (2 to 4 sentences), conversational, and comforting, allowing natural back-and-forth voice dialogue.
- If the user is facing a craving or distress, calmly guide them to breathe, pause, and name what their soul truly needs (rest, safety, connection, peace).
- If the user asks for a prayer, offer a short, uplifting prayer of strength and grace.
- Never judge, shame, or lecture. Offer unconditional encouragement and celebrate small victories.`,
          outputAudioTranscription: {},
          inputAudioTranscription: {},
        },
        callbacks: {
          onmessage: (message: LiveServerMessage) => {
            const parts = message.serverContent?.modelTurn?.parts;
            if (parts && parts.length > 0) {
              for (const part of parts) {
                if (part.inlineData?.data) {
                  if (clientWs.readyState === WebSocket.OPEN) {
                    clientWs.send(
                      JSON.stringify({
                        type: "audio",
                        audio: part.inlineData.data,
                      })
                    );
                  }
                }
                if (part.text) {
                  if (clientWs.readyState === WebSocket.OPEN) {
                    clientWs.send(
                      JSON.stringify({
                        type: "transcript",
                        role: "model",
                        text: part.text,
                      })
                    );
                  }
                }
              }
            }

            if (message.serverContent?.interrupted) {
              if (clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(JSON.stringify({ type: "interrupted" }));
              }
            }

            if (message.serverContent?.turnComplete) {
              if (clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(JSON.stringify({ type: "turnComplete" }));
              }
            }
          },
          onerror: (err: any) => {
            console.error("[Live API] Gemini Live session error:", err);
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(
                JSON.stringify({
                  type: "error",
                  message: err?.message || "Live API session encountered an error.",
                })
              );
            }
          },
          onclose: () => {
            console.log("[Live API] Gemini Live session closed");
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ type: "closed" }));
            }
          },
        },
      });

      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(
          JSON.stringify({
            type: "ready",
            model: "gemini-3.1-flash-live-preview",
            message: "Connected to Gemini Live. You can speak freely.",
          })
        );
      }

      clientWs.on("message", (raw) => {
        try {
          const msg = JSON.parse(raw.toString());
          if (msg.audio) {
            session.sendRealtimeInput({
              audio: { data: msg.audio, mimeType: "audio/pcm;rate=16000" },
            });
          } else if (msg.text) {
            session.sendRealtimeInput({
              text: msg.text,
            });
          }
        } catch (e) {
          console.error("[Live API] Failed to parse client message:", e);
        }
      });

      clientWs.on("close", () => {
        console.log("[Live API] Client connection closed");
        if (session) {
          try {
            session.close();
          } catch (e) {
            // ignore close errors
          }
        }
      });
    } catch (err: any) {
      console.error("[Live API] Initialization failed:", err);
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(
          JSON.stringify({
            type: "error",
            message:
              err?.message ||
              "Failed to initialize Gemini Live API session. Please ensure GEMINI_API_KEY is configured in Secrets.",
          })
        );
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`RenewMind server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
