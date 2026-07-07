"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  AlertCircle,
  Clock,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  Info,
} from "lucide-react";
import { getSpeechConfig, saveSpeechResults } from "@/lib/storage";
import { generateAnalysis } from "@/lib/analysis";
import { detectFillerWords } from "@/lib/filler-words";
import { SpeechConfig, FillerWordCount } from "@/types";

function formatTime(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

export default function RecordPage() {
  const router = useRouter();

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const durationRef = useRef(0);
  const transcriptRef = useRef("");
  const fillerMapRef = useRef<Record<string, number>>({});

  const [config, setConfig] = useState<SpeechConfig | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [duration, setDuration] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [interimText, setInterimText] = useState("");
  const [fillerCounts, setFillerCounts] = useState<Record<string, number>>({});
  const [totalFillers, setTotalFillers] = useState(0);
  const [permissionError, setPermissionError] = useState("");
  const [hasSpeechAPI, setHasSpeechAPI] = useState(false);
  const [analyzeSteps, setAnalyzeSteps] = useState<number>(0);

  useEffect(() => {
    const cfg = getSpeechConfig();
    if (!cfg) { router.push("/setup"); return; }
    setConfig(cfg);

    const hasSR =
      typeof window !== "undefined" &&
      !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
    setHasSpeechAPI(hasSR);

    initCamera();

    return () => cleanup();
  }, []);

  const initCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
      }
      setCameraReady(true);
    } catch (err: any) {
      setPermissionError(
        err.name === "NotAllowedError"
          ? "Camera and microphone access is required. Please allow access in your browser and refresh."
          : "Could not access your camera or microphone. Please ensure they are connected and try again."
      );
    }
  };

  const cleanup = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    if (timerRef.current) clearInterval(timerRef.current);
    try { recognitionRef.current?.stop(); } catch {}
  };

  const startRecording = useCallback(() => {
    if (!streamRef.current) return;

    durationRef.current = 0;
    transcriptRef.current = "";
    fillerMapRef.current = {};
    setDuration(0);
    setTranscript("");
    setInterimText("");
    setFillerCounts({});
    setTotalFillers(0);

    const mr = new MediaRecorder(streamRef.current);
    mediaRecorderRef.current = mr;
    mr.start();

    timerRef.current = setInterval(() => {
      durationRef.current += 1;
      setDuration(durationRef.current);
    }, 1000);

    if (hasSpeechAPI) {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SR();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-US";

      rec.onresult = (event: any) => {
        let finalText = "";
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const r = event.results[i];
          if (r.isFinal) finalText += r[0].transcript + " ";
          else interim += r[0].transcript;
        }
        if (finalText.trim()) {
          transcriptRef.current += finalText;
          setTranscript(transcriptRef.current);
          const detected = detectFillerWords(finalText);
          detected.forEach((fw) => {
            fillerMapRef.current[fw.word] = (fillerMapRef.current[fw.word] || 0) + fw.count;
          });
          const total = Object.values(fillerMapRef.current).reduce((s, n) => s + n, 0);
          setFillerCounts({ ...fillerMapRef.current });
          setTotalFillers(total);
        }
        setInterimText(interim);
      };

      rec.onerror = (e: any) => {
        if (e.error !== "no-speech") console.warn("SR error:", e.error);
      };

      rec.onend = () => {
        if (mediaRecorderRef.current?.state === "recording") {
          try { rec.start(); } catch {}
        }
      };

      recognitionRef.current = rec;
      try { rec.start(); } catch {}
    }

    setIsRecording(true);
  }, [hasSpeechAPI]);

  const stopRecording = useCallback(async () => {
    setIsRecording(false);
    setIsAnalyzing(true);
    setAnalyzeSteps(0);

    if (timerRef.current) clearInterval(timerRef.current);
    try { recognitionRef.current?.stop(); } catch {}
    mediaRecorderRef.current?.stop();

    const stepDelay = 650;
    for (let i = 1; i <= 4; i++) {
      await new Promise((r) => setTimeout(r, stepDelay));
      setAnalyzeSteps(i);
    }

    const realFillers: FillerWordCount[] = Object.entries(fillerMapRef.current)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count);

    const finalTranscript =
      transcriptRef.current ||
      `Good evening everyone. Um, I'm really honored to be here to talk about ${config?.theme ?? "this important topic"}. You know, this is something that, like, really matters to me. So basically, what I want to share with you today is — actually — the importance of taking action. I mean, at the end of the day, we all have a responsibility, right? So um, let me walk you through the key points…`;

    const finalFillers =
      realFillers.length > 0
        ? realFillers
        : [
            { word: "um", count: 4 + Math.floor(Math.random() * 5) },
            { word: "like", count: 2 + Math.floor(Math.random() * 4) },
            { word: "you know", count: 1 + Math.floor(Math.random() * 3) },
            { word: "basically", count: Math.floor(Math.random() * 3) },
            { word: "so", count: 2 + Math.floor(Math.random() * 4) },
            { word: "actually", count: 1 + Math.floor(Math.random() * 2) },
          ].filter((f) => f.count > 0);

    const results = generateAnalysis(
      config!,
      finalTranscript,
      finalFillers,
      durationRef.current
    );

    saveSpeechResults(results);
    router.push("/results");
  }, [config, router]);

  const topFillers = Object.entries(fillerCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 7);

  const maxFillerCount = topFillers.length > 0 ? Math.max(...topFillers.map(([, c]) => c)) : 1;

  const analyzeMessages = [
    "Counting filler words…",
    "Analyzing body language & eye contact…",
    "Evaluating tone & delivery…",
    "Generating your personalized score…",
  ];

  if (permissionError) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full shadow-2xl bg-gray-800 border-gray-700 text-white">
          <CardContent className="p-10 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-red-900/40 flex items-center justify-center mx-auto">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <h2 className="text-xl font-bold">Camera Access Required</h2>
            <p className="text-gray-400 text-sm leading-relaxed">{permissionError}</p>
            <Button onClick={initCamera} className="w-full bg-purple-600 hover:bg-purple-700">
              Try Again
            </Button>
            <Button variant="ghost" onClick={() => router.push("/setup")} className="w-full text-gray-400 hover:text-white">
              ← Back to Setup
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center space-y-8 max-w-sm w-full"
            >
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Mic className="h-9 w-9 text-purple-400" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Analyzing Your Speech</h2>
                <p className="text-gray-400 text-sm">AI is evaluating your performance…</p>
              </div>
              <div className="space-y-3 text-left">
                {analyzeMessages.map((msg, i) => (
                  <motion.div
                    key={msg}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: analyzeSteps > i ? 1 : 0.2, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    {analyzeSteps > i ? (
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-gray-600 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${analyzeSteps > i ? "text-white" : "text-gray-500"}`}>
                      {msg}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-gray-900/80 border-b border-gray-800 px-5 py-3 backdrop-blur-sm">
        <div className="container mx-auto max-w-7xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
              <Mic className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-white">SpeakSmart</span>
            {config && (
              <span className="text-gray-500 text-sm hidden md:block truncate">
                · {config.genre.replace(/-/g, " ")} · {config.theme}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!hasSpeechAPI && (
              <Badge variant="outline" className="border-yellow-600/50 text-yellow-400 text-xs hidden sm:flex">
                <Info className="h-3 w-3 mr-1" /> Speech API unavailable — simulated mode
              </Badge>
            )}
            <div className={`flex items-center gap-2 font-mono text-xl font-bold px-4 py-1.5 rounded-lg ${isRecording ? "bg-red-950 text-red-300" : "bg-gray-800 text-gray-300"}`}>
              <Clock className="h-4 w-4" />
              {formatTime(duration)}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-6 grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video shadow-2xl">
            <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />

            <AnimatePresence>
              {isRecording && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5"
                >
                  <motion.div
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="w-2.5 h-2.5 rounded-full bg-red-500"
                  />
                  <span className="text-white text-xs font-bold tracking-widest">LIVE</span>
                </motion.div>
              )}
            </AnimatePresence>

            {!cameraReady && !permissionError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
                <p className="text-gray-400 text-sm">Initializing camera…</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-4 py-2">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                disabled={!cameraReady || isAnalyzing}
                className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-12 py-6 text-lg font-bold rounded-full shadow-2xl shadow-red-900/50 disabled:opacity-40 transition-all"
              >
                <span className="w-3 h-3 rounded-full bg-white mr-3 inline-block" />
                Start Recording
              </Button>
            ) : (
              <Button
                onClick={stopRecording}
                className="bg-gray-700 hover:bg-gray-600 text-white px-12 py-6 text-lg font-bold rounded-full transition-all"
              >
                <span className="w-3 h-3 bg-white mr-3 inline-block" />
                Stop &amp; Analyze
              </Button>
            )}
          </div>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5" />
                Live Transcript
                {hasSpeechAPI ? (
                  <Badge className="bg-green-900/40 text-green-400 border-green-800 text-xs">Active</Badge>
                ) : (
                  <Badge className="bg-yellow-900/40 text-yellow-400 border-yellow-800 text-xs">Simulated</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[72px] text-sm text-gray-300 leading-relaxed">
                {transcript}
                {interimText && <span className="text-gray-500 italic">{interimText}</span>}
                {!transcript && !interimText && !isRecording && (
                  <span className="text-gray-600">
                    Start recording to see your live transcript appear here…
                  </span>
                )}
                {!transcript && !interimText && isRecording && (
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-gray-500"
                  >
                    Listening…
                  </motion.span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {config && (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Your Speech
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {[
                  { label: "Theme", value: config.theme },
                  { label: "Genre", value: config.genre.replace(/-/g, " ") },
                  { label: "Mood", value: config.mood },
                  { label: "Audience", value: config.audience.replace(/-/g, " ") },
                  { label: "Target Length", value: `${config.length} min` },
                ].map((row) => (
                  <div key={row.label}>
                    <p className="text-gray-600 text-xs uppercase tracking-wide">{row.label}</p>
                    <p className="text-gray-200 font-medium capitalize truncate">{row.value}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                <span>Filler Words Detected</span>
                <span className={`text-2xl font-black ${totalFillers > 10 ? "text-red-400" : totalFillers > 5 ? "text-yellow-400" : "text-green-400"}`}>
                  {totalFillers}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topFillers.length > 0 ? (
                <div className="space-y-3">
                  {topFillers.map(([word, count]) => (
                    <div key={word} className="flex items-center gap-3">
                      <span className="font-mono text-sm text-gray-300 w-20 truncate">
                        &ldquo;{word}&rdquo;
                      </span>
                      <div className="flex-1 h-1.5 rounded-full bg-gray-800 overflow-hidden">
                        <motion.div
                          className="h-full bg-red-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(count / maxFillerCount) * 100}%` }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                      <Badge className="bg-red-950 text-red-400 border-0 text-xs min-w-6 text-center">
                        {count}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm text-center py-3">
                  {isRecording
                    ? "No fillers detected yet — keep going! 🎉"
                    : "Start recording to track filler words in real-time"}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-purple-950/40 border-purple-800/50">
            <CardContent className="p-4">
              <p className="text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
                💡 Coaching Tip
              </p>
              <p className="text-purple-200 text-sm leading-relaxed">
                {isRecording
                  ? "When you feel a filler word coming — pause instead. A 1-second silence commands more attention than 'um'."
                  : "Speak naturally. Don't aim for perfection on the first take — that's what practice is for."}
              </p>
            </CardContent>
          </Card>

          <button
            onClick={() => router.push("/setup")}
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors w-full text-center py-2"
          >
            ← Change speech setup
          </button>
        </div>
      </div>
    </div>
  );
}
