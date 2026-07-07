"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { CheckCircle, Zap, Star, Shield, ArrowRight } from "lucide-react";
import { saveUserTier } from "@/lib/storage";
import { UserTier } from "@/types";

const plans = [
  {
    id: "trial" as UserTier,
    name: "Free Trial",
    icon: Zap,
    price: "Free",
    subtext: "1-day access",
    badge: null,
    tagline: "Try SpeakSmart risk-free and discover how AI coaching can transform your speaking.",
    iconBg: "from-slate-500 to-slate-700",
    borderClass: "border-slate-200",
    buttonClass: "bg-slate-900 hover:bg-slate-800 text-white",
    features: [
      "1 day free access",
      "1 practice recording session",
      "Overall speech score (1–10)",
      "Total filler word count",
      "Basic pass/fail feedback",
      "3 general improvement tips",
    ],
    missing: [
      "No per-word filler breakdown",
      "No body language or eye contact detail",
      "No constructive feedback",
      "No improvement plan",
    ],
  },
  {
    id: "basic" as UserTier,
    name: "Basic",
    icon: Star,
    price: "$9.99",
    subtext: "per month",
    badge: "Most Popular",
    tagline: "Perfect for speakers who want regular structured practice with meaningful feedback.",
    iconBg: "from-purple-600 to-indigo-600",
    borderClass: "border-purple-300",
    buttonClass:
      "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white",
    features: [
      "10 practice sessions per month",
      "Full filler word tally by word",
      "Facial expression analysis",
      "Body language score & feedback",
      "Confidence rating",
      "Delivery & tone scores",
      "3–5 constructive feedback points",
      "Speech strengths identified",
      "Progress tracking",
    ],
    missing: [
      "No unlimited sessions",
      "No full improvement plan",
      "No premium AI deep-dive",
    ],
  },
  {
    id: "premium" as UserTier,
    name: "Premium",
    icon: Shield,
    price: "$24.99",
    subtext: "per month",
    badge: "Best Value",
    tagline: "For serious speakers who want unlimited practice and the deepest AI coaching available.",
    iconBg: "from-amber-500 to-orange-600",
    borderClass: "border-amber-300",
    buttonClass:
      "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white",
    features: [
      "Unlimited practice sessions",
      "Unlimited speech retakes",
      "Full filler word breakdown with %",
      "Detailed facial expression analysis",
      "Complete body language report",
      "Eye contact percentage score",
      "Tone & vocal variety analysis",
      "Confidence deep-dive breakdown",
      "7+ point constructive feedback",
      "Corrective actions & suggestions",
      "4-week personalized improvement plan",
      "Speech strengths & growth areas",
      "Priority support",
    ],
    missing: [],
  },
];

export default function PricingPage() {
  const router = useRouter();

  const handleSelect = (tier: UserTier) => {
    saveUserTier(tier);
    router.push("/setup");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Badge className="bg-purple-100 text-purple-700 mb-4 text-sm px-4 py-1">
            Pricing Plans
          </Badge>
          <h1 className="text-5xl font-black text-gray-900 mb-4">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Coaching Plan
            </span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Start free, upgrade when ready. Every plan includes real-time AI analysis to
            build your confidence as a speaker.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="relative"
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <Badge
                    className={`bg-gradient-to-r ${plan.iconBg} text-white border-0 px-4 py-1 text-xs font-bold shadow-lg`}
                  >
                    {plan.badge}
                  </Badge>
                </div>
              )}
              <Card
                className={`border-2 ${plan.borderClass} shadow-xl h-full transition-all hover:shadow-2xl hover:-translate-y-1 ${plan.badge ? "md:scale-105 md:shadow-2xl" : ""}`}
              >
                <CardHeader className="pb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.iconBg} flex items-center justify-center mb-4`}
                  >
                    <plan.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <p className="text-gray-500 text-sm leading-relaxed">{plan.tagline}</p>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                    {plan.subtext && (
                      <span className="text-gray-400 text-sm">/{plan.subtext.replace("per ", "")}</span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-5">
                  <Button
                    onClick={() => handleSelect(plan.id)}
                    className={`w-full ${plan.buttonClass} font-bold py-6 rounded-xl text-base`}
                  >
                    {plan.id === "trial" ? "Start Free Trial" : `Get ${plan.name}`}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  <Separator />

                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                      Included
                    </p>
                    <ul className="space-y-2.5">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {plan.missing.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                        Not included
                      </p>
                      <ul className="space-y-2">
                        {plan.missing.map((m) => (
                          <li key={m} className="flex items-start gap-2.5">
                            <span className="text-gray-300 flex-shrink-0 mt-0.5">✗</span>
                            <span className="text-sm text-gray-400">{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-gray-400 text-sm mt-12"
        >
          🔒 No credit card required for the free trial. All plans require camera &amp; microphone access.
        </motion.p>
      </div>
    </div>
  );
}
