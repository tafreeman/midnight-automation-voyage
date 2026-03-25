import { useCallback, useEffect, useRef, useState } from "react";

const TTS_SERVER = "http://localhost:8765";
const STORAGE_KEY = "mav-voice-preference";

interface VoiceInfo {
  name: string;
  gender: string;
  locale: string;
  styles: string[];
  source: "edge-tts" | "browser";
}

interface StoredPreference {
  voice: string;
  speed: number;
}

function loadPreference(): StoredPreference {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as StoredPreference;
  } catch { /* ignore */ }
  return { voice: "", speed: 1 };
}

function savePreference(pref: StoredPreference) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pref));
  } catch { /* ignore */ }
}

/** Convert a numeric speed multiplier to an edge-tts rate string (e.g. 1.25 -> "+25%") */
function speedToRate(speed: number): string {
  const pct = Math.round((speed - 1) * 100);
  return pct >= 0 ? `+${pct}%` : `${pct}%`;
}

export function useNarration() {
  const pref = loadPreference();

  const [playing, setPlaying] = useState(false);
  const [speed, _setSpeed] = useState(pref.speed);
  const [voice, _setVoice] = useState(pref.voice);
  const [availableVoices, setAvailableVoices] = useState<VoiceInfo[]>([]);
  const [serverAvailable, setServerAvailable] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  // Persist preference changes
  const setSpeed = useCallback((s: number) => {
    _setSpeed(s);
    savePreference({ voice, speed: s });
  }, [voice]);

  const setVoice = useCallback((v: string) => {
    _setVoice(v);
    savePreference({ voice: v, speed });
  }, [speed]);

  // Probe the TTS server and load voices
  useEffect(() => {
    mountedRef.current = true;
    let cancelled = false;

    async function init() {
      // Try edge-tts server
      try {
        const res = await fetch(`${TTS_SERVER}/health`, { signal: AbortSignal.timeout(2000) });
        if (res.ok && !cancelled) {
          setServerAvailable(true);
          const vRes = await fetch(`${TTS_SERVER}/voices`);
          const data: Omit<VoiceInfo, "source">[] = await vRes.json();
          if (!cancelled) {
            const edgeVoices: VoiceInfo[] = data.map((v) => ({ ...v, source: "edge-tts" as const }));
            setAvailableVoices((prev) => {
              const browserOnly = prev.filter((v) => v.source === "browser");
              return [...edgeVoices, ...browserOnly];
            });
          }
        }
      } catch {
        if (!cancelled) setServerAvailable(false);
      }

      // Also load Web Speech API voices as fallback
      function loadBrowserVoices() {
        if (cancelled) return;
        const synth = window.speechSynthesis;
        if (!synth) return;
        const sv = synth.getVoices();
        if (sv.length === 0) return;
        const browserVoices: VoiceInfo[] = sv.map((v) => ({
          name: v.name,
          gender: "",
          locale: v.lang,
          styles: [],
          source: "browser" as const,
        }));
        setAvailableVoices((prev) => {
          const edgeOnly = prev.filter((v) => v.source === "edge-tts");
          return [...edgeOnly, ...browserVoices];
        });
      }

      loadBrowserVoices();
      // Chrome loads voices async
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = loadBrowserVoices;
      }
    }

    init();
    return () => {
      cancelled = true;
      mountedRef.current = false;
    };
  }, []);

  // Stop any current playback
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    if (utteranceRef.current) {
      window.speechSynthesis?.cancel();
      utteranceRef.current = null;
    }
    if (mountedRef.current) setPlaying(false);
  }, []);

  // Play via edge-tts server
  const playEdgeTTS = useCallback(async (text: string): Promise<boolean> => {
    try {
      const controller = new AbortController();
      abortRef.current = controller;

      const res = await fetch(`${TTS_SERVER}/synthesize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice, rate: speedToRate(speed) }),
        signal: controller.signal,
      });

      if (!res.ok) return false;

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      return new Promise<boolean>((resolve) => {
        audio.onended = () => {
          URL.revokeObjectURL(url);
          if (mountedRef.current) setPlaying(false);
          resolve(true);
        };
        audio.onerror = () => {
          URL.revokeObjectURL(url);
          if (mountedRef.current) setPlaying(false);
          resolve(false);
        };
        audio.play().catch(() => resolve(false));
      });
    } catch {
      return false;
    }
  }, [voice, speed]);

  // Play via Web Speech API fallback
  const playBrowser = useCallback((text: string) => {
    const synth = window.speechSynthesis;
    if (!synth) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speed;

    // Try to match selected voice
    if (voice) {
      const match = synth.getVoices().find((v) => v.name === voice);
      if (match) utterance.voice = match;
    }

    utterance.onend = () => {
      utteranceRef.current = null;
      if (mountedRef.current) setPlaying(false);
    };
    utterance.onerror = () => {
      utteranceRef.current = null;
      if (mountedRef.current) setPlaying(false);
    };

    utteranceRef.current = utterance;
    synth.speak(utterance);
  }, [voice, speed]);

  // Toggle narration for given text
  const toggle = useCallback(async (text?: string) => {
    if (playing) {
      stop();
      return;
    }

    if (!text) return;

    setPlaying(true);

    // Determine if selected voice is an edge-tts voice
    const selectedVoice = availableVoices.find((v) => v.name === voice);
    const useServer = serverAvailable && (!selectedVoice || selectedVoice.source === "edge-tts");

    if (useServer) {
      const ok = await playEdgeTTS(text);
      if (!ok && mountedRef.current) {
        // Fall back to browser
        playBrowser(text);
      }
    } else {
      playBrowser(text);
    }
  }, [playing, stop, serverAvailable, voice, availableVoices, playEdgeTTS, playBrowser]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      stop();
    };
  }, [stop]);

  return {
    playing,
    toggle,
    speed,
    setSpeed,
    voice,
    setVoice,
    availableVoices,
    serverAvailable,
  };
}
