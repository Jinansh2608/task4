import { HeroFileProgress, PowerSequenceProgress, DoomLockProgress } from '../types/game';

export const SCORE_RULES = {
  EASY_PREDICTION: 3,
  EASY_IDENTITY: 2,
  MEDIUM_PREDICTION: 5,
  MEDIUM_IDENTITY: 5,
  POWER_SEQUENCE: 10,
  DOOM_LOCK: 10,
  MAX_SCORE: 100,
} as const;

export function getPredictionPoints(fileNumber: number): number {
  return fileNumber <= 4 ? SCORE_RULES.EASY_PREDICTION : SCORE_RULES.MEDIUM_PREDICTION;
}

export function getIdentityPoints(fileNumber: number): number {
  return fileNumber <= 4 ? SCORE_RULES.EASY_IDENTITY : SCORE_RULES.MEDIUM_IDENTITY;
}

export function getPowerSequencePoints(): number {
  return SCORE_RULES.POWER_SEQUENCE;
}

export function getDoomLockPoints(): number {
  return SCORE_RULES.DOOM_LOCK;
}

export function calculateTotalScore(
  heroFilesProgress: Record<string, HeroFileProgress>,
  powerSequencesProgress: Record<string, PowerSequenceProgress>,
  doomLockProgress: DoomLockProgress
): number {
  let score = 0;

  // Hero Files
  for (const progress of Object.values(heroFilesProgress)) {
    score += progress.predictionPointsAwarded || 0;
    score += progress.identityPointsAwarded || 0;
  }

  // Power Sequences
  for (const progress of Object.values(powerSequencesProgress)) {
    score += progress.pointsAwarded || 0;
  }

  // Doom Lock
  score += doomLockProgress.pointsAwarded || 0;

  return Math.min(score, SCORE_RULES.MAX_SCORE);
}
