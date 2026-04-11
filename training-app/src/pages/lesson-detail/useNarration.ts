import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export function useNarration(text: string, audioFile?: string) {
  const [playing, setPlaying] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);
  const [speed, setSpeedRaw] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playingRef = useRef(false);
  const textRef = useRef(text);

  useEffect(() => {
    textRef.current = text;
  }, [text]);

  useEffect(() => {
    if (!audioFile) return;
    const audio = new Audio(audioFile);
    audio.addEventListener("canplaythrough", () => { audioRef.current = audio; setHasAudio(true); });
    audio.addEventListener("error", () => setHasAudio(false));
    audio.addEventListener("ended", () => { setPlaying(false); playingRef.current = false; });
    audio.load();
    return () => { audio.pause(); audio.src = ""; };
  }, [audioFile]);

  const setSpeed = useCallback((newSpeed: number) => {
    setSpeedRaw(newSpeed);
    if (audioRef.current && hasAudio) {
      audioRef.current.playbackRate = newSpeed;
    }
    if (playingRef.current && typeof speechSynthesis !== "undefined" && !hasAudio) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textRef.current);
      utterance.rate = newSpeed;
      utterance.lang = "en-US";
      const voices = speechSynthesis.getVoices();
      const english = voices.filter(v => v.lang.startsWith("en"));
      const voice = english.find(v => v.name.includes("Neural") || v.name.includes("Online"))
        || english.find(v => ["Jenny", "Aria", "Google US"].some(q => v.name.includes(q)))
        || english[0];
      if (voice) utterance.voice = voice;
      utterance.onend = () => { setPlaying(false); playingRef.current = false; };
      utterance.onerror = () => { setPlaying(false); playingRef.current = false; };
      speechSynthesis.speak(utterance);
    }
  }, [hasAudio]);

  useEffect(() => {
    return () => {
      if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
      if (audioRef.current) { audioRef.current.pause(); }
      playingRef.current = false;
    };
  }, []);

  const toggle = useCallback(() => {
    if (playing) {
      if (audioRef.current && hasAudio) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } else if (typeof speechSynthesis !== "undefined") {
        speechSynthesis.cancel();
      }
      setPlaying(false);
      playingRef.current = false;
      return;
    }

    if (hasAudio && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.playbackRate = speed;
      audioRef.current.play();
      setPlaying(true);
      playingRef.current = true;
    } else if (typeof speechSynthesis !== "undefined" && text) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speed;
      utterance.lang = "en-US";
      const voices = speechSynthesis.getVoices();
      const english = voices.filter(v => v.lang.startsWith("en"));
      const voice = english.find(v => v.name.includes("Neural") || v.name.includes("Online"))
        || english.find(v => ["Jenny", "Aria", "Google US"].some(q => v.name.includes(q)))
        || english[0];
      if (voice) utterance.voice = voice;
      utterance.onend = () => { setPlaying(false); playingRef.current = false; };
      utterance.onerror = () => { setPlaying(false); playingRef.current = false; };
      setPlaying(true);
      playingRef.current = true;
      speechSynthesis.speak(utterance);
    }
  }, [text, playing, hasAudio, speed]);

  return { playing, toggle, hasAudio, speed, setSpeed };
}
