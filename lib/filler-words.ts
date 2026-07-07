import { FillerWordCount } from '@/types';

export const FILLER_WORDS = [
  'um', 'uh', 'er', 'ah', 'hmm',
  'like', 'you know', 'basically', 'literally', 'actually',
  'so', 'right', 'okay', 'well', 'i mean',
  'kind of', 'sort of', 'you see', 'the thing is',
];

export function detectFillerWords(text: string): FillerWordCount[] {
  if (!text || !text.trim()) return [];

  const lower = text.toLowerCase();
  const counts: Record<string, number> = {};

  for (const filler of FILLER_WORDS) {
    const escaped = filler.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = filler.includes(' ')
      ? new RegExp(escaped, 'gi')
      : new RegExp(`\\b${escaped}\\b`, 'gi');

    const matches = lower.match(regex);
    if (matches && matches.length > 0) {
      counts[filler] = matches.length;
    }
  }

  return Object.entries(counts)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count);
}
