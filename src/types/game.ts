export type SetId = 'A' | 'B' | 'C' | 'D';

export type Difficulty = 'Easy' | 'Medium';

export type ValueType = number | number[] | number[][];

export interface ExamplePair {
  input: ValueType;
  output: ValueType;
}

export interface HeroFile {
  id: string; // e.g. "file-01"
  fileNumber: number; // 1 to 7
  difficulty: Difficulty;
  heroIdentity: string;
  examples: ExamplePair[];
  hint: string;
  testInput: ValueType;
  expectedOutput: ValueType;
  transformationId: string;
  ruleExplanation: string;
}

export interface PowerSequenceQuestion {
  id: string; // e.g. "ps-01"
  questionNumber: number; // 1 to 4
  hero1: string;
  hero2: string;
  description?: string;
  input: ValueType;
  expectedOutput: ValueType;
  alternativeAnswers?: ValueType[]; // In case of mathematical variants
  explanation: string;
}

export interface QuestionSet {
  setId: SetId;
  heroBank: string[]; // 8 heroes
  decoyHero: string;
  heroFiles: HeroFile[];
  powerSequences: PowerSequenceQuestion[];
}

export interface HeroFileProgress {
  fileId: string;
  hypothesis: string;
  userPredictionInput: string;
  predictionVerified: boolean;
  predictionPointsAwarded: number;
  selectedHero?: string;
  identityVerified: boolean;
  identityPointsAwarded: number;
  isDecoded: boolean; // Both prediction and identity verified
}

export interface PowerSequenceProgress {
  sequenceId: string;
  userAnswerInput: string;
  verified: boolean;
  pointsAwarded: number;
}

export interface DoomLockProgress {
  digits: string[]; // 4 digits
  verified: boolean;
  pointsAwarded: number;
}

export type ScreenType = 
  | 'landing' 
  | 'setup' 
  | 'dashboard' 
  | 'heroFile' 
  | 'powerSequence' 
  | 'doomLock' 
  | 'victory' 
  | 'timeExpired';

export interface GameState {
  screen: ScreenType;
  activeFileId: string | null;
  teamName: string;
  selectedSet: SetId;
  startTime: number | null; // Timestamp
  durationSeconds: number; // 1200 (20 min)
  isTimerRunning: boolean;
  heroFilesProgress: Record<string, HeroFileProgress>;
  powerSequencesProgress: Record<string, PowerSequenceProgress>;
  doomLockProgress: DoomLockProgress;
  totalScore: number;
  completedAt?: number | null;
}
