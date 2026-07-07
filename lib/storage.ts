import { SpeechConfig, SpeechResults, UserTier } from '@/types';

const KEYS = {
  SPEECH_CONFIG: 'speaksmart_config',
  SPEECH_RESULTS: 'speaksmart_results',
  USER_TIER: 'speaksmart_tier',
};

export function saveSpeechConfig(config: SpeechConfig): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(KEYS.SPEECH_CONFIG, JSON.stringify(config));
  }
}

export function getSpeechConfig(): SpeechConfig | null {
  if (typeof window === 'undefined') return null;
  const stored = sessionStorage.getItem(KEYS.SPEECH_CONFIG);
  if (!stored) return null;
  try { return JSON.parse(stored) as SpeechConfig; } catch { return null; }
}

export function saveSpeechResults(results: SpeechResults): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(KEYS.SPEECH_RESULTS, JSON.stringify(results));
  }
}

export function getSpeechResults(): SpeechResults | null {
  if (typeof window === 'undefined') return null;
  const stored = sessionStorage.getItem(KEYS.SPEECH_RESULTS);
  if (!stored) return null;
  try { return JSON.parse(stored) as SpeechResults; } catch { return null; }
}

export function saveUserTier(tier: UserTier): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(KEYS.USER_TIER, tier);
  }
}

export function getUserTier(): UserTier | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(KEYS.USER_TIER) as UserTier | null;
}

export function clearSession(): void {
  if (typeof window !== 'undefined') {
    Object.values(KEYS).forEach(k => sessionStorage.removeItem(k));
  }
}
