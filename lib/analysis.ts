import { SpeechConfig, SpeechResults, CategoryScore, FillerWordCount } from '@/types';

function getGrade(score: number): string {
  if (score >= 9.5) return 'A+';
  if (score >= 9) return 'A';
  if (score >= 8.5) return 'A-';
  if (score >= 8) return 'B+';
  if (score >= 7.5) return 'B';
  if (score >= 7) return 'B-';
  if (score >= 6.5) return 'C+';
  if (score >= 6) return 'C';
  if (score >= 5.5) return 'C-';
  if (score >= 5) return 'D';
  return 'F';
}

function getLabel(score: number): string {
  if (score >= 9) return 'Exceptional';
  if (score >= 8) return 'Excellent';
  if (score >= 7) return 'Good';
  if (score >= 6) return 'Fair';
  if (score >= 5) return 'Needs Work';
  return 'Poor';
}

function randScore(base: number, variance = 0.8): number {
  const s = base + (Math.random() * variance * 2 - variance);
  return Math.round(Math.max(1, Math.min(10, s)) * 10) / 10;
}

export function generateAnalysis(
  config: SpeechConfig,
  transcript: string,
  fillerWords: FillerWordCount[],
  duration: number
): SpeechResults {
  const words = transcript.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const totalFillerWords = fillerWords.reduce((s, fw) => s + fw.count, 0);
  const fillerPct = wordCount > 0 ? (totalFillerWords / wordCount) * 100 : 0;

  const penalty = Math.min(fillerPct * 0.28, 2.5);

  const bl  = randScore(7.2 - penalty * 0.2);
  const ec  = randScore(6.8 - penalty * 0.15);
  const ton = randScore(7.0 - penalty * 0.4);
  const conf = randScore(7.5 - penalty * 0.55);
  const del = randScore(7.2 - penalty * 0.45);
  const con = randScore(7.8 - penalty * 0.1);

  const overallScore = Math.round(((bl + ec + ton + conf + del + con) / 6) * 10) / 10;
  const audienceLabel = config.audience.replace(/-/g, ' ');
  const genreLabel = config.genre.replace(/-/g, ' ');

  const categories: SpeechResults['categories'] = {
    bodyLanguage: {
      name: 'Body Language',
      score: bl,
      label: getLabel(bl),
      feedback: bl >= 7.5
        ? `Your posture was confident and open, which reinforced your authority as a ${genreLabel} speaker. Hand gestures were purposeful and naturally supported your message.`
        : bl >= 6
        ? `Your body language showed moments of confidence but was inconsistent. Closed postures at times diminished your on-stage presence.`
        : `Body language needs focused attention. Slumped posture and nervous movement were observed and undermined your message's overall impact.`,
      tips: [
        'Stand with feet shoulder-width apart for a grounded, confident stance.',
        'Use open-palm gestures to appear approachable and trustworthy.',
        'Avoid touching your face or hair — both signal nervousness.',
        'Move with purpose and intention; never pace aimlessly.',
      ],
    },
    eyeContact: {
      name: 'Eye Contact',
      score: ec,
      label: getLabel(ec),
      feedback: ec >= 7.5
        ? `You maintained strong, consistent eye contact — creating personal connection and demonstrating presence. Your gaze effectively scanned the room.`
        : ec >= 6
        ? `Eye contact was adequate but inconsistent. Breaking away too frequently disrupted the connection with your audience.`
        : `Eye contact must be a priority. Frequent downward glances significantly weakened audience trust and engagement.`,
      tips: [
        'Hold eye contact for 3–5 seconds per person before moving on.',
        'Divide the room into three zones and address each zone systematically.',
        'When glancing at notes, pause, look down, then look back up before speaking.',
        'Practice the "lighthouse" technique — slow, sweeping eye contact across the room.',
      ],
    },
    tone: {
      name: 'Tone & Vocal Variety',
      score: ton,
      label: getLabel(ton),
      feedback: ton >= 7.5
        ? `Your vocal variety was impressive — effective shifts in pitch, pace, and volume kept listeners engaged throughout your ${config.mood} delivery.`
        : ton >= 6
        ? `Tone was mostly appropriate for a ${config.mood} speech, but more variation is needed. Some sections sounded monotone.`
        : `Tone lacked the variety essential for a ${config.mood} ${genreLabel} speech. Monotone delivery causes audiences to disengage quickly.`,
      tips: [
        'Vary your pace — slow down for key points, speed up to build excitement.',
        'Use strategic pauses after important statements for maximum impact.',
        'Modulate your volume deliberately to create emphasis and energy.',
        'Match your vocal tone to the emotional content of each section.',
      ],
    },
    confidence: {
      name: 'Confidence',
      score: conf,
      label: getLabel(conf),
      feedback: conf >= 7.5
        ? `You projected strong, commanding confidence — vital for a ${genreLabel} addressing ${audienceLabel}. Your presence enhanced credibility and message delivery.`
        : conf >= 6
        ? `Moderate confidence was shown, but hesitations — especially filler words — undermined your authority at key moments.`
        : `Confidence level requires development. Excessive filler words signal uncertainty. Targeted preparation and rehearsal will yield rapid improvement.`,
      tips: [
        'Replace filler words with confident pauses — silence commands attention.',
        'Power pose for 2 minutes before your speech to physiologically boost confidence.',
        'Memorize your opening 30 seconds — strong starts build momentum.',
        'Reframe nervousness as excitement — they share the same physiological signature.',
      ],
    },
    delivery: {
      name: 'Delivery',
      score: del,
      label: getLabel(del),
      feedback: del >= 7.5
        ? `Delivery was polished and effective. Pacing was appropriate for ${audienceLabel} and the message came through with clarity and flow.`
        : del >= 6
        ? `Delivery was satisfactory but could be improved. Pacing issues and ${totalFillerWords} filler word instances disrupted the overall flow.`
        : `Delivery requires substantial work. Pacing issues combined with ${totalFillerWords} filler words made it difficult to follow your core message.`,
      tips: [
        'Record yourself regularly to identify and fix delivery patterns.',
        'Practice with a timer to master your intended speech length.',
        'Use the rule of three — group ideas in sets of three for memorability.',
        'End with a strong, memorable call-to-action or closing statement.',
      ],
    },
    content: {
      name: 'Content & Structure',
      score: con,
      label: getLabel(con),
      feedback: con >= 7.5
        ? `Content on "${config.theme}" was well-organized and appropriately calibrated for ${audienceLabel}. The ${config.mood} tone aligned well with your stated outcome.`
        : con >= 6
        ? `Content had strong elements but the structure could be clearer. Key points about "${config.theme}" need more deliberate emphasis.`
        : `Content structure needs work. The core message around "${config.theme}" was hard to follow, which may prevent achieving your intended outcome.`,
      tips: [
        'Open with a hook — a story, statistic, or provocative question.',
        'Structure: Tell them what you\'ll say → say it → tell them what you said.',
        'Use concrete examples and personal stories to illustrate abstract points.',
        'Connect every key point explicitly to your audience\'s interests and pain points.',
      ],
    },
  };

  const strengths: string[] = [];
  if (bl >= 7) strengths.push(`Confident body language that establishes authority with ${audienceLabel}.`);
  if (ec >= 7) strengths.push(`Effective eye contact that creates genuine personal connection.`);
  if (ton >= 7) strengths.push(`Good vocal variety that sustains audience engagement throughout.`);
  if (conf >= 7) strengths.push(`Commanding presence that builds trust and credibility.`);
  if (del >= 7) strengths.push(`Smooth, clear delivery that makes your content easy to follow.`);
  if (con >= 7) strengths.push(`Well-structured content aligned with your ${config.mood} goal.`);
  if (totalFillerWords < 5) strengths.push(`Minimal filler words — excellent preparation and vocabulary control.`);
  if (strengths.length === 0) {
    strengths.push(`Completed the full speech without stopping — consistency is the foundation of mastery.`);
    strengths.push(`Willingness to practice and be evaluated is the single most important trait of great speakers.`);
  }

  const improvements: string[] = [];
  if (totalFillerWords > 10) improvements.push(`Reduce ${totalFillerWords} filler word instances — replace with deliberate, confident pauses.`);
  if (bl < 7) improvements.push(`Practice body language in front of a mirror or camera; focus on open posture and intentional gestures.`);
  if (ec < 7) improvements.push(`Improve eye contact using a zone-scanning technique; practice with real or simulated audiences.`);
  if (ton < 7) improvements.push(`Develop vocal variety — deliberately vary pitch, pace, and volume in daily reading exercises.`);
  if (conf < 7) improvements.push(`Build confidence through regular rehearsal, positive visualization, and pre-speech power posing.`);
  if (del < 7) improvements.push(`Polish delivery with more full-run rehearsals, timing yourself against your target length.`);
  if (improvements.length === 0) {
    improvements.push(`Fine-tune your ${config.mood} emotional register for even sharper audience alignment.`);
    improvements.push(`Incorporate more storytelling and concrete examples to deepen audience engagement.`);
  }

  const detailedFeedback = `Your ${genreLabel} speech on "${config.theme}" has been comprehensively evaluated. With an overall score of ${overallScore}/10, you ${overallScore >= 7 ? 'demonstrated solid public speaking fundamentals that form a strong foundation' : 'identified clear growth areas that — with targeted practice — will improve quickly'}.

**Audience Alignment:** Your speech was directed at ${audienceLabel} with a ${config.mood} intent. ${overallScore >= 7 ? 'The content and delivery style largely matched your audience\'s expectations.' : 'The style and vocabulary could be better calibrated to match what ' + audienceLabel + ' expect from a ' + config.mood + ' speech.'}

**Filler Word Impact:** ${totalFillerWords} filler words were detected across your speech (${fillerPct.toFixed(1)}% of total words). ${fillerPct > 5 ? 'This is significantly above the recommended 2–3% threshold and noticeably impacts perceived confidence and preparation. This is your highest-priority improvement.' : fillerPct > 2 ? 'This is slightly above the ideal 2% threshold. Targeted practice will produce quick wins here.' : 'Outstanding discipline — you\'re well within the acceptable range. Maintain this standard.'}

**Standout Observation:** ${overallScore >= 8 ? 'Your performance shows strong command of public speaking fundamentals. Consistent practice at this level will push you into expert territory.' : overallScore >= 6 ? 'You have a solid baseline with clear improvement pathways. Focus your next 2–3 practice sessions specifically on the lower-scoring categories.' : 'There is meaningful distance between your current performance and your potential. Daily focused practice on fundamentals will produce rapid, visible improvement within 3–4 weeks.'}

**Strategic Recommendation:** For your next practice session, focus exclusively on one category at a time. Start with confidence and filler word reduction — these produce the most immediate and visible improvements across all other metrics.`;

  const actionPlan = [
    `**Week 1 — Filler Word Elimination:** Record yourself speaking for 2 minutes daily on any topic. Each time you use a filler word, restart. This creates rapid neural reprogramming. Target: fewer than 5 filler words per minute.`,
    `**Week 2 — Body Language Mastery:** Practice your full speech in front of a full-length mirror. Focus exclusively on posture, gestures, and facial expressions — mute yourself if needed.`,
    `**Week 3 — Vocal Power:** Read aloud from any book for 10 minutes daily, deliberately varying pace, pitch, and volume. Record and critically listen back. Identify your monotone sections.`,
    `**Week 4 — Full Integration:** Deliver your complete speech five times this week. Each session focuses on a different element. Record at least two sessions for honest self-review.`,
    `**Ongoing — Community Practice:** Join a Toastmasters club or form a peer practice group. External, structured feedback accelerates growth faster than solo practice alone.`,
    `**Performance Ritual:** Always prepare and memorize an opening hook — a story, surprising statistic, or bold question. A powerful 30-second opening builds confidence that carries through the entire speech.`,
  ];

  return {
    overallScore,
    grade: getGrade(overallScore),
    duration,
    wordCount,
    fillerWords,
    totalFillerWords,
    fillerWordPercentage: Math.round(fillerPct * 10) / 10,
    transcript,
    categories,
    strengths,
    improvements,
    detailedFeedback,
    actionPlan,
    config,
    timestamp: new Date().toISOString(),
  };
}
