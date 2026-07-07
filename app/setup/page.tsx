"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Mic,
  Users,
  Clock,
  Bookmark,
  FileText,
  Zap,
} from "lucide-react";
import { saveSpeechConfig, getUserTier } from "@/lib/storage";
import { SpeechConfig, UserTier } from "@/types";

const GENRES = [
  { value: "keynote", label: "Keynote Speech" },
  { value: "tedx", label: "TEDx / TED Talk" },
  { value: "wedding-toast", label: "Wedding Toast" },
  { value: "sales-pitch", label: "Sales Pitch" },
  { value: "academic", label: "Academic Presentation" },
  { value: "political", label: "Political Speech" },
  { value: "motivational", label: "Motivational Speech" },
  { value: "comedy", label: "Comedy / Roast" },
  { value: "business-presentation", label: "Business Presentation" },
  { value: "acceptance-speech", label: "Award Acceptance Speech" },
  { value: "eulogy", label: "Eulogy / Memorial" },
  { value: "other", label: "Other" },
];

const MOODS = [
  { value: "inspiring", label: "Inspiring & Uplifting" },
  { value: "informative", label: "Informative & Educational" },
  { value: "entertaining", label: "Entertaining & Fun" },
  { value: "persuasive", label: "Persuasive & Convincing" },
  { value: "emotional", label: "Emotional & Heartfelt" },
  { value: "professional", label: "Professional & Formal" },
  { value: "humorous", label: "Humorous & Witty" },
  { value: "serious", label: "Serious & Impactful" },
];

const AUDIENCES = [
  { value: "general-public", label: "General Public" },
  { value: "business-professionals", label: "Business Professionals" },
  { value: "students", label: "Students" },
  { value: "academic", label: "Academic / Researchers" },
  { value: "children", label: "Children / Young Audience" },
  { value: "executives", label: "C-Suite / Executives" },
  { value: "mixed", label: "Mixed / General" },
];

const LENGTHS = [
  { value: "1-2", label: "1–2 minutes (elevator pitch)" },
  { value: "3-5", label: "3–5 minutes (short speech)" },
  { value: "5-10", label: "5–10 minutes (standard)" },
  { value: "10-15", label: "10–15 minutes (extended)" },
  { value: "15-30", label: "15–30 minutes (seminar)" },
  { value: "30+", label: "30+ minutes (full presentation)" },
];

const TIER_INFO: Record<UserTier, { label: string; style: string }> = {
  trial: { label: "Free Trial", style: "bg-slate-100 text-slate-700" },
  basic: { label: "Basic Plan", style: "bg-purple-100 text-purple-700" },
  premium: { label: "Premium Plan", style: "bg-amber-100 text-amber-700" },
};

export default function SetupPage() {
  const router = useRouter();
  const [tier, setTier] = useState<UserTier>("trial");
  const [form, setForm] = useState({
    genre: "",
    theme: "",
    mood: "",
    audience: "",
    length: "",
    outcome: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const saved = getUserTier();
    if (saved) setTier(saved);
    else router.push("/pricing");
  }, [router]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.genre) e.genre = "Please select a speech genre";
    if (!form.theme.trim()) e.theme = "Please enter your speech theme or topic";
    if (!form.mood) e.mood = "Please select a mood";
    if (!form.audience) e.audience = "Please select a target audience";
    if (!form.length) e.length = "Please select a speech length";
    if (!form.outcome.trim()) e.outcome = "Please describe your desired outcome";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const config: SpeechConfig = {
      genre: form.genre as SpeechConfig["genre"],
      theme: form.theme,
      mood: form.mood as SpeechConfig["mood"],
      audience: form.audience as SpeechConfig["audience"],
      length: form.length as SpeechConfig["length"],
      outcome: form.outcome,
      tier,
    };
    saveSpeechConfig(config);
    router.push("/record");
  };

  const set = (key: string) => (v: string) => {
    setForm((p) => ({ ...p, [key]: v }));
    setErrors((p) => ({ ...p, [key]: "" }));
  };

  const tierInfo = TIER_INFO[tier];

  return (
    <div className="min-h-screen bg-gray-50 py-14 px-4">
      <div className="container mx-auto max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-5 flex-wrap">
            <Badge className={tierInfo.style}>{tierInfo.label}</Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
              <span className="font-medium text-gray-700">Step 1 of 2: Setup</span>
              <ArrowRight className="h-3 w-3" />
              <span className="text-gray-400">Step 2: Record</span>
            </div>
          </div>
          <Progress value={45} className="h-1.5 max-w-xs mx-auto mb-8" />
          <h1 className="text-4xl font-black text-gray-900 mb-3">Set Up Your Speech</h1>
          <p className="text-gray-500 leading-relaxed">
            Tell us about your speech so our AI can provide personalized, relevant analysis.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
            <CardContent className="p-8 space-y-7">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <FileText className="h-4 w-4 text-purple-600" />
                  Speech Genre *
                </Label>
                <Select onValueChange={set("genre")}>
                  <SelectTrigger className={`h-12 ${errors.genre ? "border-red-400 bg-red-50" : ""}`}>
                    <SelectValue placeholder="Select the type of speech you're practicing…" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENRES.map((g) => (
                      <SelectItem key={g.value} value={g.value}>
                        {g.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.genre && <p className="text-red-500 text-xs">{errors.genre}</p>}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <Mic className="h-4 w-4 text-purple-600" />
                  Speech Theme / Topic *
                </Label>
                <Input
                  placeholder="e.g. The Future of Renewable Energy, Why Kindness Matters…"
                  className={`h-12 ${errors.theme ? "border-red-400 bg-red-50" : ""}`}
                  value={form.theme}
                  onChange={(e) => set("theme")(e.target.value)}
                />
                {errors.theme && <p className="text-red-500 text-xs">{errors.theme}</p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <Zap className="h-4 w-4 text-purple-600" />
                    Mood / Feeling *
                  </Label>
                  <Select onValueChange={set("mood")}>
                    <SelectTrigger className={`h-12 ${errors.mood ? "border-red-400 bg-red-50" : ""}`}>
                      <SelectValue placeholder="Select mood…" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOODS.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.mood && <p className="text-red-500 text-xs">{errors.mood}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <Users className="h-4 w-4 text-purple-600" />
                    Target Audience *
                  </Label>
                  <Select onValueChange={set("audience")}>
                    <SelectTrigger className={`h-12 ${errors.audience ? "border-red-400 bg-red-50" : ""}`}>
                      <SelectValue placeholder="Select audience…" />
                    </SelectTrigger>
                    <SelectContent>
                      {AUDIENCES.map((a) => (
                        <SelectItem key={a.value} value={a.value}>
                          {a.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.audience && <p className="text-red-500 text-xs">{errors.audience}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <Clock className="h-4 w-4 text-purple-600" />
                  Intended Speech Length *
                </Label>
                <Select onValueChange={set("length")}>
                  <SelectTrigger className={`h-12 ${errors.length ? "border-red-400 bg-red-50" : ""}`}>
                    <SelectValue placeholder="How long should your speech be?" />
                  </SelectTrigger>
                  <SelectContent>
                    {LENGTHS.map((l) => (
                      <SelectItem key={l.value} value={l.value}>
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.length && <p className="text-red-500 text-xs">{errors.length}</p>}
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <Bookmark className="h-4 w-4 text-purple-600" />
                  Desired Outcome *
                </Label>
                <Textarea
                  placeholder="What do you hope your audience will feel, think, or do after your speech? e.g. I want my audience to feel inspired to take action on climate change and leave with 3 concrete steps they can take this week…"
                  className={`min-h-[110px] resize-none ${errors.outcome ? "border-red-400 bg-red-50" : ""}`}
                  value={form.outcome}
                  onChange={(e) => set("outcome")(e.target.value)}
                  maxLength={500}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    {form.outcome.length}/500 characters
                  </span>
                </div>
                {errors.outcome && <p className="text-red-500 text-xs">{errors.outcome}</p>}
              </div>

              <Button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-6 text-lg font-bold rounded-xl"
              >
                Continue to Recording Studio
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
