"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  CheckCircle,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Home,
  BarChart3,
  MessageSquare,
  Zap,
  Star,
  Shield,
  Mic,
} from "lucide-react";
import { getSpeechResults } from "@/lib/storage";
import { ScoreRing } from "@/components/score-ring";
import { SpeechResults, UserTier } from "@/types";

function scoreColor(s: number) {
  if (s >= 9) return "text-green-500";
  if (s >= 8) return "text-lime-500";
  if (s >= 7) return "text-indigo-500";
  if (s >= 6) return "text-amber-500";
  if (s >= 5) return "text-orange-500";
  return "text-red-500";
}

function scoreBg(s: number) {
  if (s >= 9) return "bg-green-50 border-green-200";
  if (s >= 8) return "bg-lime-50 border-lime-200";
  if (s >= 7) return "bg-indigo-50 border-indigo-200";
  if (s >= 6) return "bg-amber-50 border-amber-200";
  if (s >= 5) return "bg-orange-50 border-orange-200";
  return "bg-red-50 border-red-200";
}

function fmtDuration(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m === 0 ? `${sec}s` : `${m}m ${sec}s`;
}

const TIER_ICONS: Record<UserTier, typeof Zap> = {
  trial: Zap,
  basic: Star,
  premium: Shield,
};

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<SpeechResults | null>(null);

  useEffect(() => {
    const data = getSpeechResults();
    if (!data) { router.push("/"); return; }
    setResults(data);
  }, [router]);

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
      </div>
    );
  }

  const tier = results.config.tier;
  const isPremium = tier === "premium";
  const isTrialOnly = tier === "trial";
  const TierIcon = TIER_ICONS[tier];
  const cats = Object.values(results.categories);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="bg-gradient-to-br from-purple-950 via-indigo-900 to-slate-900 text-white py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <Badge className="bg-white/10 text-white border-white/20 mb-5 px-4 py-1.5">
              <TierIcon className="h-3 w-3 mr-1.5 inline" />
              {tier.charAt(0).toUpperCase() + tier.slice(1)} Plan · Analysis Complete
            </Badge>
            <h1 className="text-4xl font-black mb-2">Your Speech Analysis</h1>
            <p className="text-purple-200 text-sm mb-12">
              {results.config.theme} ·{" "}
              {results.config.genre.replace(/-/g, " ")} ·{" "}
              {fmtDuration(results.duration)}
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-10">
              <ScoreRing score={results.overallScore} size={190} strokeWidth={15} showGrade grade={results.grade} />

              <div className="grid grid-cols-2 gap-3 max-w-xs w-full">
                {[
                  { label: "Filler Words", value: results.totalFillerWords, color: "text-red-300", bg: "bg-red-950/40" },
                  { label: "Total Words", value: results.wordCount, color: "text-blue-300", bg: "bg-blue-950/40" },
                  { label: "Duration", value: fmtDuration(results.duration), color: "text-green-300", bg: "bg-green-950/40" },
                  { label: "Filler Rate", value: `${results.fillerWordPercentage}%`, color: "text-amber-300", bg: "bg-amber-950/40" },
                ].map((s) => (
                  <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center backdrop-blur-sm`}>
                    <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                    <div className="text-xs text-white/50 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 pt-10">
        <Tabs defaultValue="scores">
          <TabsList className={`grid w-full mb-8 bg-white shadow-sm border rounded-xl grid-cols-4`}>
            <TabsTrigger value="scores">📊 Scores</TabsTrigger>
            <TabsTrigger value="fillers">💬 Filler Words</TabsTrigger>
            <TabsTrigger value="feedback">📝 Feedback</TabsTrigger>
            <TabsTrigger value={isPremium ? "plan" : "upgrade"}>
              {isPremium ? "🗝 Action Plan" : "⬆ Upgrade"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scores">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cats.map((cat, i) => (
                <motion.div key={cat.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                  <Card className={`border ${scoreBg(cat.score)} h-full`}>
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-gray-800 text-sm">{cat.name}</h3>
                        <div>
                          <span className={`text-2xl font-black ${scoreColor(cat.score)}`}>{cat.score.toFixed(1)}</span>
                          <span className="text-gray-400 text-xs">/10</span>
                        </div>
                      </div>
                      <Progress value={cat.score * 10} className="h-2 mb-3" />
                      <Badge variant="outline" className={`text-xs ${scoreColor(cat.score)} border-current mb-3`}>
                        {cat.label}
                      </Badge>

                      {isTrialOnly ? (
                        <p className="text-xs text-gray-400 italic">
                          Upgrade to Basic for detailed category feedback
                        </p>
                      ) : (
                        <p className="text-xs text-gray-600 leading-relaxed">{cat.feedback}</p>
                      )}

                      {isPremium && cat.tips.length > 0 && (
                        <div className="mt-3 space-y-1.5">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tips</p>
                          {cat.tips.slice(0, 2).map((tip) => (
                            <div key={tip} className="flex items-start gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
                              <p className="text-xs text-gray-600">{tip}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="fillers">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="h-5 w-5 text-red-600" />
                    </div>
                    Filler Word Analysis
                    <Badge
                      className={
                        results.totalFillerWords > 10
                          ? "bg-red-100 text-red-700"
                          : results.totalFillerWords > 5
                          ? "bg-amber-100 text-amber-700"
                          : "bg-green-100 text-green-700"
                      }
                    >
                      {results.totalFillerWords} total
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div
                    className={`p-4 rounded-xl border ${
                      results.fillerWordPercentage > 5
                        ? "bg-red-50 border-red-200"
                        : results.fillerWordPercentage > 2
                        ? "bg-amber-50 border-amber-200"
                        : "bg-green-50 border-green-200"
                    }`}
                  >
                    <p className="font-semibold text-gray-800 mb-1">
                      {results.fillerWordPercentage}% of your words were fillers
                    </p>
                    <p className="text-sm text-gray-600">
                      {results.fillerWordPercentage > 5
                        ? "Above the recommended 2–3% threshold. Replace fillers with confident pauses — this is your #1 improvement area."
                        : results.fillerWordPercentage > 2
                        ? "Slightly above the ideal 2% threshold. Small, focused improvements here will be noticeable immediately."
                        : "You're within the acceptable range. Excellent discipline and preparation!"}
                    </p>
                  </div>

                  {isTrialOnly ? (
                    <div className="text-center py-10 space-y-4">
                      <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto">
                        <Star className="h-8 w-8 text-purple-600" />
                      </div>
                      <h3 className="font-bold text-gray-900">
                        Word-by-word breakdown available on Basic &amp; Premium
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Upgrade to see exactly which filler words you use most and how often.
                      </p>
                      <Link href="/pricing">
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                          Upgrade Now <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ) : results.fillerWords.length === 0 ? (
                    <div className="text-center py-10">
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <p className="font-bold text-gray-900">No filler words detected — outstanding!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {results.fillerWords.map((fw, i) => (
                        <div key={fw.word} className="flex items-center gap-3">
                          <span className="text-xs text-gray-400 w-5 font-mono">{i + 1}.</span>
                          <span className="font-mono text-sm font-semibold text-gray-800 w-28 truncate">
                            &ldquo;{fw.word}&rdquo;
                          </span>
                          <div className="flex-1">
                            <Progress value={(fw.count / (results.fillerWords[0]?.count || 1)) * 100} className="h-3" />
                          </div>
                          <div className="text-right w-20 flex-shrink-0">
                            <span className="font-black text-red-600">{fw.count}×</span>
                            <span className="text-gray-400 text-xs ml-1">
                              ({results.wordCount > 0 ? ((fw.count / results.wordCount) * 100).toFixed(1) : 0}%)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="feedback">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              <Card className="border-green-200 bg-green-50 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-green-800 text-base">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    What You Did Well
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {results.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                        <p className="text-green-900 text-sm leading-relaxed">{s}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-amber-200 bg-amber-50 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-amber-800 text-base">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {results.improvements.map((imp, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                        <p className="text-amber-900 text-sm leading-relaxed">{imp}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {isPremium ? (
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Shield className="h-5 w-5 text-amber-500" />
                      Premium AI Deep-Dive
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {results.detailedFeedback.split("\n\n").map((para, i) => {
                        if (!para.trim()) return null;
                        const html = para
                          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                          .replace(/\n/g, "<br/>");
                        return (
                          <p key={i} className="text-sm text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 shadow-sm">
                  <CardContent className="p-6 text-center">
                    <Shield className="h-10 w-10 text-amber-500 mx-auto mb-3" />
                    <h3 className="font-bold text-gray-900 mb-2">Unlock Premium AI Coaching</h3>
                    <p className="text-gray-600 text-sm mb-5">
                      Get a detailed paragraph-by-paragraph AI review, vocal analysis, body
                      language deep-dive, and a personalized roadmap.
                    </p>
                    <Link href="/pricing">
                      <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                        Upgrade to Premium <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </TabsContent>

          {isPremium && (
            <TabsContent value="plan">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                      Your 4-Week Improvement Roadmap
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                      Personalized steps to transform your public speaking
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {results.actionPlan.map((step, i) => {
                        const html = step.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
                        return (
                          <div key={i} className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-black flex-shrink-0">
                              {i + 1}
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed pt-0.5" dangerouslySetInnerHTML={{ __html: html }} />
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          )}

          {!isPremium && (
            <TabsContent value="upgrade">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="shadow-sm">
                  <CardContent className="p-10 text-center space-y-6">
                    <Shield className="h-16 w-16 text-amber-500 mx-auto" />
                    <div>
                      <h2 className="text-2xl font-black text-gray-900 mb-2">
                        Unlock Your Full Potential
                      </h2>
                      <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                        You&apos;re on the{" "}
                        <strong>{tier.charAt(0).toUpperCase() + tier.slice(1)}</strong> plan.
                        Upgrade to Premium for unlimited sessions, deep-dive AI feedback,
                        category coaching tips, and a personalized 4-week improvement plan.
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3 max-w-lg mx-auto text-sm">
                      {[
                        "Unlimited recordings",
                        "Full filler word breakdown",
                        "Eye contact analysis",
                        "Tone & vocal variety",
                        "Confidence deep-dive",
                        "4-week action plan",
                      ].map((f) => (
                        <div key={f} className="flex items-center gap-2 bg-purple-50 rounded-lg p-2">
                          <CheckCircle className="h-3.5 w-3.5 text-purple-500 flex-shrink-0" />
                          <span className="text-gray-700 text-xs">{f}</span>
                        </div>
                      ))}
                    </div>

                    <Link href="/pricing">
                      <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-10 py-6 text-lg rounded-xl">
                        Upgrade to Premium
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          )}
        </Tabs>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => router.push("/record")}
            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-6 text-base font-bold rounded-xl"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Practice Again
          </Button>
          <Button onClick={() => router.push("/setup")} variant="outline" className="flex-1 py-6 text-base rounded-xl">
            <Mic className="mr-2 h-5 w-5" />
            New Speech Setup
          </Button>
          <Button onClick={() => router.push("/")} variant="ghost" className="flex-1 py-6 text-base rounded-xl">
            <Home className="mr-2 h-5 w-5" />
            Home
          </Button>
        </div>
      </div>
    </div>
  );
}
