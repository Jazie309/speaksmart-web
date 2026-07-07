"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showGrade?: boolean;
  grade?: string;
}

function getScoreColor(score: number): string {
  if (score >= 9) return "#22c55e";
  if (score >= 8) return "#84cc16";
  if (score >= 7) return "#6366f1";
  if (score >= 6) return "#f59e0b";
  if (score >= 5) return "#f97316";
  return "#ef4444";
}

export function ScoreRing({
  score,
  size = 180,
  strokeWidth = 14,
  className,
  showGrade,
  grade,
}: ScoreRingProps) {
  const [animated, setAnimated] = useState(false);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const color = getScoreColor(score);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: animated
              ? circumference - (score / 10) * circumference
              : circumference,
          }}
          transition={{ duration: 1.6, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <motion.span
          className="text-4xl font-black text-white leading-none"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: animated ? 1 : 0, scale: animated ? 1 : 0.5 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {score.toFixed(1)}
        </motion.span>
        <span className="text-xs text-white/60 font-medium mt-1">out of 10</span>
        {showGrade && grade && (
          <motion.span
            className="text-lg font-bold mt-1"
            style={{ color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: animated ? 1 : 0 }}
            transition={{ delay: 0.9 }}
          >
            {grade}
          </motion.span>
        )}
      </div>
    </div>
  );
}
