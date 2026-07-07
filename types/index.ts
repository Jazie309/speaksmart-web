export type UserTier = 'trial' | 'basic' | 'premium';

export type SpeechGenre =
  | 'keynote' | 'tedx' | 'wedding-toast' | 'sales-pitch'
  | 'academic' | 'political' | 'motivational' | 'comedy'
  | 'business-presentation' | 'acceptance-speech' | 'eulogy' | 'other';

export type SpeechMood =
  | 'inspiring' | 'informative' | 'entertaining' | 'persuasive'
  | 'emotional' | 'professional' | 'humorous' | 'serious';

export type TargetAudience =
  | 'general-public' | 'business-professionals' | 'students'
  | 'academic' | 'children' | 'executives' | 'mixed';

export type SpeechLength = '1-2' | '3-5' | '5-10' | '10-15' | '15-30' | '30+';

export interface SpeechConfig {
  genre: SpeechGenre;
  theme: string;
  mood: SpeechMood;
  audience: TargetAudience;
  length: SpeechLength;
  outcome: string;
  tier: UserTier;
}

export interface FillerWordCount {
  word: string;
  count: number;
}

export interface CategoryScore {
  name: string;
  score: number;
  label: string;
  feedback: string;
  tips: string[];
}

export interface SpeechResults {
  overallScore: number;
  grade: string;
  duration: number;
  wordCount: number;
  fillerWords: FillerWordCount[];
  totalFillerWords: number;
  fillerWordPercentage: number;
  transcript: string;
  categories: {
    bodyLanguage: CategoryScore;
    eyeContact: CategoryScore;
    tone: CategoryScore;
    confidence: CategoryScore;
    delivery: CategoryScore;
    content: CategoryScore;
  };
  strengths: string[];
  improvements: string[];
  detailedFeedback: string;
  actionPlan: string[];
  config: SpeechConfig;
  timestamp: string;
}
