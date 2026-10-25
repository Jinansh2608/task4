import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  GameState,
  SetId,
  ScreenType,
  HeroFileProgress,
  PowerSequenceProgress,
  DoomLockProgress,
  QuestionSet,
} from '../types/game';
import { QUESTION_SETS } from '../data/questionBank';
import { validatePredictionInput, validateHeroIdentity } from '../engine/answerValidator';
import {
  calculateTotalScore,
  getPredictionPoints,
  getIdentityPoints,
  getPowerSequencePoints,
  getDoomLockPoints,
} from '../engine/scoring';
import { deriveDoomLockCode, validateDoomLock } from '../engine/doomLock';
import { formatValue } from '../engine/answerParser';

const STORAGE_KEY = 'dooms_hero_archive_state_v1';
const DEFAULT_DURATION_SECONDS = 20 * 60; // 20 minutes = 1200 seconds

interface GameContextType {
  gameState: GameState;
  currentSet: QuestionSet;
  remainingSeconds: number;
  isTimeExpired: boolean;
  isAllHeroFilesDecoded: boolean;
  isAllHeroFilesPredicted: boolean;
  isAllPowerSequencesSolved: boolean;
  isDoomLockUnlocked: boolean;
  isVictorious: boolean;
  // Navigation
  goToScreen: (screen: ScreenType) => void;
  openHeroFile: (fileId: string) => void;
  // Game Actions
  startNewGame: (teamName: string, setId: SetId) => void;
  resetGame: () => void;
  saveHypothesis: (fileId: string, text: string) => void;
  submitPrediction: (fileId: string, input: string) => { success: boolean; message: string };
  submitHeroIdentity: (fileId: string, heroName: string) => { success: boolean; message: string; ruleExplanation: string };
  submitPowerSequence: (sequenceId: string, input: string) => { success: boolean; message: string };
  submitDoomLock: (digits: string[]) => { success: boolean; message: string };
}

const initialDoomLock: DoomLockProgress = {
  digits: ['', '', '', ''],
  verified: false,
  pointsAwarded: 0,
};

function createInitialHeroProgress(setId: SetId): Record<string, HeroFileProgress> {
  const set = QUESTION_SETS[setId];
  const progress: Record<string, HeroFileProgress> = {};
  set.heroFiles.forEach(file => {
    progress[file.id] = {
      fileId: file.id,
      hypothesis: '',
      userPredictionInput: '',
      predictionVerified: false,
      predictionPointsAwarded: 0,
      selectedHero: undefined,
      identityVerified: false,
      identityPointsAwarded: 0,
      isDecoded: false,
    };
  });
  return progress;
}

function createInitialPowerSequenceProgress(setId: SetId): Record<string, PowerSequenceProgress> {
  const set = QUESTION_SETS[setId];
  const progress: Record<string, PowerSequenceProgress> = {};
  set.powerSequences.forEach(ps => {
    progress[ps.id] = {
      sequenceId: ps.id,
      userAnswerInput: '',
      verified: false,
      pointsAwarded: 0,
    };
  });
  return progress;
}

const defaultInitialState: GameState = {
  screen: 'landing',
  activeFileId: null,
  teamName: '',
  selectedSet: 'A',
  startTime: null,
  durationSeconds: DEFAULT_DURATION_SECONDS,
  isTimerRunning: false,
  heroFilesProgress: createInitialHeroProgress('A'),
  powerSequencesProgress: createInitialPowerSequenceProgress('A'),
  doomLockProgress: initialDoomLock,
  totalScore: 0,
  completedAt: null,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed;
      }
    } catch (e) {
      console.error('Failed to load state from localStorage:', e);
    }
    return defaultInitialState;
  });

  const [remainingSeconds, setRemainingSeconds] = useState<number>(DEFAULT_DURATION_SECONDS);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
  }, [gameState]);

  // Current Question Set
  const currentSet = useMemo(() => {
    return QUESTION_SETS[gameState.selectedSet || 'A'];
  }, [gameState.selectedSet]);

  // Timer logic
  useEffect(() => {
    if (!gameState.isTimerRunning || !gameState.startTime) {
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - gameState.startTime!) / 1000);
      const remaining = Math.max(0, gameState.durationSeconds - elapsed);
      setRemainingSeconds(remaining);

      if (remaining === 0 && gameState.screen !== 'victory' && gameState.screen !== 'timeExpired') {
        setGameState(prev => ({
          ...prev,
          isTimerRunning: false,
          screen: 'timeExpired',
        }));
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [gameState.isTimerRunning, gameState.startTime, gameState.durationSeconds, gameState.screen]);

  // Checks
  const isTimeExpired = remainingSeconds <= 0 && gameState.isTimerRunning === false && gameState.startTime !== null;

  const isAllHeroFilesDecoded = useMemo(() => {
    return currentSet.heroFiles.every(f => gameState.heroFilesProgress[f.id]?.isDecoded);
  }, [currentSet.heroFiles, gameState.heroFilesProgress]);

  const isAllHeroFilesPredicted = useMemo(() => {
    return currentSet.heroFiles.every(f => gameState.heroFilesProgress[f.id]?.predictionVerified);
  }, [currentSet.heroFiles, gameState.heroFilesProgress]);

  const isAllPowerSequencesSolved = useMemo(() => {
    return currentSet.powerSequences.every(ps => gameState.powerSequencesProgress[ps.id]?.verified);
  }, [currentSet.powerSequences, gameState.powerSequencesProgress]);

  const isDoomLockUnlocked = isAllPowerSequencesSolved;
  const isVictorious = gameState.doomLockProgress.verified;

  // Actions
  const goToScreen = useCallback((screen: ScreenType) => {
    setGameState(prev => ({
      ...prev,
      screen,
    }));
  }, []);

  const openHeroFile = useCallback((fileId: string) => {
    setGameState(prev => ({
      ...prev,
      activeFileId: fileId,
      screen: 'heroFile',
    }));
  }, []);

  const startNewGame = useCallback((teamName: string, setId: SetId) => {
    const heroProgress = createInitialHeroProgress(setId);
    const psProgress = createInitialPowerSequenceProgress(setId);
    const startTime = Date.now();

    const newState: GameState = {
      screen: 'dashboard',
      activeFileId: null,
      teamName: teamName.trim() || 'Hero Strike Team',
      selectedSet: setId,
      startTime,
      durationSeconds: DEFAULT_DURATION_SECONDS,
      isTimerRunning: true,
      heroFilesProgress: heroProgress,
      powerSequencesProgress: psProgress,
      doomLockProgress: { ...initialDoomLock },
      totalScore: 0,
      completedAt: null,
    };

    setGameState(newState);
    setRemainingSeconds(DEFAULT_DURATION_SECONDS);
  }, []);

  const resetGame = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setGameState({
      ...defaultInitialState,
      heroFilesProgress: createInitialHeroProgress('A'),
      powerSequencesProgress: createInitialPowerSequenceProgress('A'),
    });
    setRemainingSeconds(DEFAULT_DURATION_SECONDS);
  }, []);

  const saveHypothesis = useCallback((fileId: string, text: string) => {
    setGameState(prev => {
      const current = prev.heroFilesProgress[fileId];
      if (!current) return prev;
      return {
        ...prev,
        heroFilesProgress: {
          ...prev.heroFilesProgress,
          [fileId]: {
            ...current,
            hypothesis: text,
          },
        },
      };
    });
  }, []);

  const submitPrediction = useCallback((fileId: string, input: string): { success: boolean; message: string } => {
    const file = currentSet.heroFiles.find(f => f.id === fileId);
    if (!file) return { success: false, message: 'Invalid Hero File.' };

    const validation = validatePredictionInput(input, file.expectedOutput);
    if (!validation.isValid) {
      return { success: false, message: 'Doom Test Failed: Output does not match the observed mathematical pattern.' };
    }

    setGameState(prev => {
      const current = prev.heroFilesProgress[fileId] || {
        fileId,
        hypothesis: '',
        userPredictionInput: '',
        predictionVerified: false,
        predictionPointsAwarded: 0,
        selectedHero: undefined,
        identityVerified: false,
        identityPointsAwarded: 0,
        isDecoded: false,
      };

      // If already verified prediction, do not award duplicate points
      const alreadyAwarded = current.predictionPointsAwarded > 0;
      const pointsToAward = alreadyAwarded ? current.predictionPointsAwarded : getPredictionPoints(file.fileNumber);

      const updatedProgress: HeroFileProgress = {
        ...current,
        userPredictionInput: input,
        predictionVerified: true,
        predictionPointsAwarded: pointsToAward,
      };

      const newHeroFiles = {
        ...prev.heroFilesProgress,
        [fileId]: updatedProgress,
      };

      const newScore = calculateTotalScore(newHeroFiles, prev.powerSequencesProgress, prev.doomLockProgress);

      return {
        ...prev,
        heroFilesProgress: newHeroFiles,
        totalScore: newScore,
      };
    });

    return { success: true, message: 'Doom Test Passed! System verified your mathematical prediction.' };
  }, [currentSet.heroFiles]);

  const submitHeroIdentity = useCallback((fileId: string, heroName: string): { success: boolean; message: string; ruleExplanation: string } => {
    const file = currentSet.heroFiles.find(f => f.id === fileId);
    if (!file) return { success: false, message: 'Invalid Hero File.', ruleExplanation: '' };

    const isCorrect = validateHeroIdentity(heroName, file.heroIdentity);
    if (!isCorrect) {
      return {
        success: false,
        message: 'Identity mismatch. The mathematical signature does not correspond to this hero.',
        ruleExplanation: '',
      };
    }

    setGameState(prev => {
      const current = prev.heroFilesProgress[fileId];
      if (!current) return prev;

      const alreadyAwarded = current.identityPointsAwarded > 0;
      const pointsToAward = alreadyAwarded ? current.identityPointsAwarded : getIdentityPoints(file.fileNumber);

      const updatedProgress: HeroFileProgress = {
        ...current,
        selectedHero: heroName,
        identityVerified: true,
        identityPointsAwarded: pointsToAward,
        isDecoded: true,
      };

      const newHeroFiles = {
        ...prev.heroFilesProgress,
        [fileId]: updatedProgress,
      };

      const newScore = calculateTotalScore(newHeroFiles, prev.powerSequencesProgress, prev.doomLockProgress);

      return {
        ...prev,
        heroFilesProgress: newHeroFiles,
        totalScore: newScore,
      };
    });

    return {
      success: true,
      message: 'PATTERN MATCH FOUND. Identity confirmed.',
      ruleExplanation: file.ruleExplanation,
    };
  }, [currentSet.heroFiles]);

  const submitPowerSequence = useCallback((sequenceId: string, input: string): { success: boolean; message: string } => {
    const ps = currentSet.powerSequences.find(p => p.id === sequenceId);
    if (!ps) return { success: false, message: 'Invalid sequence challenge.' };

    const validation = validatePredictionInput(input, ps.expectedOutput, ps.alternativeAnswers);
    if (!validation.isValid) {
      return { success: false, message: 'Transformation mismatch: Output does not match the chained hero rules.' };
    }

    setGameState(prev => {
      const current = prev.powerSequencesProgress[sequenceId] || {
        sequenceId,
        userAnswerInput: '',
        verified: false,
        pointsAwarded: 0,
      };

      const alreadyAwarded = current.pointsAwarded > 0;
      const pointsToAward = alreadyAwarded ? current.pointsAwarded : getPowerSequencePoints();

      const updatedProgress: PowerSequenceProgress = {
        ...current,
        userAnswerInput: input,
        verified: true,
        pointsAwarded: pointsToAward,
      };

      const newPS = {
        ...prev.powerSequencesProgress,
        [sequenceId]: updatedProgress,
      };

      const newScore = calculateTotalScore(prev.heroFilesProgress, newPS, prev.doomLockProgress);

      return {
        ...prev,
        powerSequencesProgress: newPS,
        totalScore: newScore,
      };
    });

    return { success: true, message: 'Power Sequence Transformation Verified!' };
  }, [currentSet.powerSequences]);

  const submitDoomLock = useCallback((digits: string[]): { success: boolean; message: string } => {
    const expectedCode = deriveDoomLockCode(currentSet.powerSequences);
    const isCodeCorrect = validateDoomLock(digits, expectedCode);

    if (!isCodeCorrect) {
      return { success: false, message: 'DECRYPTION FAILED. Cipher key rejected by Doom Lock.' };
    }

    setGameState(prev => {
      const alreadyAwarded = prev.doomLockProgress.pointsAwarded > 0;
      const pointsToAward = alreadyAwarded ? prev.doomLockProgress.pointsAwarded : getDoomLockPoints();

      const updatedDoomLock: DoomLockProgress = {
        digits,
        verified: true,
        pointsAwarded: pointsToAward,
      };

      const newScore = calculateTotalScore(prev.heroFilesProgress, prev.powerSequencesProgress, updatedDoomLock);

      return {
        ...prev,
        doomLockProgress: updatedDoomLock,
        totalScore: newScore,
        completedAt: Date.now(),
        isTimerRunning: false,
        screen: 'victory',
      };
    });

    return { success: true, message: 'DOOM LOCK DECRYPTED. Master security barrier disabled!' };
  }, [currentSet.powerSequences]);

  return (
    <GameContext.Provider
      value={{
        gameState,
        currentSet,
        remainingSeconds,
        isTimeExpired,
        isAllHeroFilesDecoded,
        isAllHeroFilesPredicted,
        isAllPowerSequencesSolved,
        isDoomLockUnlocked,
        isVictorious,
        goToScreen,
        openHeroFile,
        startNewGame,
        resetGame,
        saveHypothesis,
        submitPrediction,
        submitHeroIdentity,
        submitPowerSequence,
        submitDoomLock,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
