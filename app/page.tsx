"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Mic,
  Eye,
  Activity,
  BarChart3,
  MessageSquare,
  Shield,
  ArrowRight,
  Play,
  CheckCircle,
  Users,
  Zap,
} from "lucide-react";

const features = [
  { icon: Mic, title: "Filler Word Detection", desc: "Real-time tallying of 'um', 'uh', 'like', 'you know', and 19 other filler words using live speech recognition." },
  { icon: Eye, title: "Eye Contact Analysis", desc: "AI evaluates how consistently you maintain eye contact with your audience throughout your speech." },
  { icon: Activity, title: "Body Language Scoring", desc: "Computer vision analyzes posture, gestures, and movement to assess your physical communication." },
  { icon: MessageSquare, title: "Tone & Delivery", desc: "Vocal variety, pacing, volume, and clarity are all measured for a comprehensive delivery assessment." },
  { icon: Shield, title: "Confidence Meter", desc: "A composite confidence score built from all visual and verbal cues detected during your speech." },
  { icon: BarChart3, title: "Detailed Analytics", desc: "In-depth charts, breakdowns, and actionable improvement plans tailored to your speech type and audience." },
];

const steps = [
  { n: "01", title: "Choose Your Plan", desc: "Select Trial, Basic, or Premium based on how deeply you want to practice and how much feedback you need." },
  { n: "02", title: "Set Up Your Speech", desc: "Define your genre, theme, target audience, mood, and desired outcome so analysis is fully personalized." },
  { n: "03", title: "Record & Analyze", desc: "Deliver your speech live on camera. AI analyzes filler words, body language, tone, and confidence in real-time." },
];

const instructions = [
  "Choose your pricing plan — Free Trial, Basic, or Premium",
  "Complete the speech setup form: topic, genre, mood, audience, length, and desired outcome",
  "Allow browser access to your camera and microphone when prompted — this is required for analysis",
  "Click 'Start Recording' and deliver your speech naturally, as if in front of a real audience",
  "Click 'Stop & Analyze' when finished — our AI will immediately begin evaluating your performance",
  "Review your overall score (1–10), filler word tally, body language scores, and detailed feedback",
  "Click 'Practice Again' to record another take and track your real-time improvement",
];

const stats = [
  { value: "19+", label: "Filler Words Tracked" },
  { value: "6", label: "Performance Categories" },
  { value: "1–10", label: "Scoring Scale" },
  { value: "4-Week", label: "Improvement Plan" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-950 via-indigo-900 to-slate-900 text-white py-28 px-4">
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 50%, rgba(139,92,246,0.4) 0%, transparent 50%),
                              radial-gradient(circle at 75% 20%, rgba(99,102,241,0.3) 0%, transparent 50%)`
          }}
        />
        <div className="container mx-auto max-w-6xl relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/30 mb-6 text-sm px-4 py-1.5">
              🎤 AI-Powered Public Speaking Coach
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
              Master the Art of{" "}
              <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 bg-clip-text text-transparent">
                Public Speaking
              </span>
            </h1>
            <p className="text-xl text-purple-100/90 max-w-3xl mx-auto mb-10 leading-relaxed">
              Record your practice speeches and receive instant AI-powered feedback on filler
              words, body language, eye contact, tone, confidence, and delivery — graded on a
              10-point scale with personalized coaching.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing">
                <Button size="lg" className="bg-white text-purple-900 hover:bg-purple-50 font-bold px-10 py-6 text-lg rounded-2xl shadow-2xl shadow-purple-900/40">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-10 py-6 text-lg rounded-2xl">
                  <Play className="mr-2 h-5 w-5" />
                  See How It Works
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20"
          >
            {stats.map((s) => (
              <div key={s.label} className="text-center p-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="text-3xl font-black text-white">{s.value}</div>
                <div className="text-sm text-purple-200 mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <Badge className="bg-purple-100 text-purple-700 mb-4">How It Works</Badge>
            <h2 className="text-4xl font-bold text-gray-900">Three Simple Steps</h2>
            <p className="text-gray-500 mt-3 text-lg">From setup to comprehensive feedback in minutes</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div key={step.n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }} viewport={{ once: true }}>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 h-full">
                  <CardContent className="p-8">
                    <div className="text-7xl font-black text-purple-100 mb-4 leading-none">{step.n}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-14">
            <Badge className="bg-green-100 text-green-700 mb-4">Step-by-Step Guide</Badge>
            <h2 className="text-4xl font-bold text-gray-900">How to Use SpeakSmart</h2>
            <p className="text-gray-500 mt-3 text-lg">Follow these steps for the best results</p>
          </div>
          <div className="space-y-3">
            {instructions.map((instruction, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} viewport={{ once: true }} className="flex items-start gap-4 p-5 rounded-xl bg-gray-50 border border-gray-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <p className="text-gray-700 leading-relaxed pt-0.5">{instruction}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/pricing">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-12 py-6 text-lg rounded-2xl shadow-lg">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="bg-indigo-100 text-indigo-700 mb-4">AI Analysis</Badge>
            <h2 className="text-4xl font-bold text-gray-900">What Gets Analyzed</h2>
            <p className="text-gray-500 mt-3 text-lg max-w-2xl mx-auto">
              Our AI evaluates every dimension of your public speaking performance
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} viewport={{ once: true }}>
                <Card className="border-0 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                      <f.icon className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">{f.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-14">
            <Badge className="bg-amber-100 text-amber-700 mb-4">Scoring System</Badge>
            <h2 className="text-4xl font-bold text-gray-900">The 1–10 Speech Score</h2>
            <p className="text-gray-500 mt-3 text-lg">
              Every speech is graded across 6 dimensions into one composite score
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { range: "9–10", label: "Exceptional / Perfect", desc: "Captivating, knowledgeable, on-theme, and deeply engaging. Audience is fully moved.", color: "bg-green-50 border-green-200 text-green-800" },
              { range: "7–8", label: "Good to Excellent", desc: "Strong delivery with minor refinements needed. Clearly prepared and confident.", color: "bg-blue-50 border-blue-200 text-blue-800" },
              { range: "5–6", label: "Fair / Developing", desc: "Shows promise but needs focused work on delivery, confidence, or structure.", color: "bg-amber-50 border-amber-200 text-amber-800" },
              { range: "1–4", label: "Needs Significant Work", desc: "Foundational issues with filler words, delivery, or content structure require attention.", color: "bg-red-50 border-red-200 text-red-800" },
            ].map((tier) => (
              <Card key={tier.range} className={`border ${tier.color}`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-black">{tier.range}</span>
                    <Badge variant="outline" className="border-current text-xs">{tier.label}</Badge>
                  </div>
                  <p className="text-sm leading-relaxed opacity-80">{tier.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-gradient-to-br from-purple-950 to-indigo-900 text-white">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-bold mb-5">Ready to Become a Better Speaker?</h2>
            <p className="text-purple-200 text-lg mb-10">
              Start with a completely free trial. No credit card required.
            </p>
            <Link href="/pricing">
              <Button size="lg" className="bg-white text-purple-900 hover:bg-purple-50 font-bold px-12 py-6 text-lg rounded-2xl">
                Start Free Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="py-8 px-4 bg-gray-950 text-gray-500 text-center text-sm">
        <p>© 2024 SpeakSmart. AI-powered public speaking coaching.</p>
      </footer>
    </div>
  );
}
