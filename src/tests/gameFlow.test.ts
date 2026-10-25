import { describe, it, expect, beforeEach } from 'vitest';
import { QUESTION_SETS } from '../data/questionBank';
import { calculateTotalScore, getPredictionPoints, getIdentityPoints, getPowerSequencePoints, getDoomLockPoints } from '../engine/scoring';
import { validatePredictionInput, validateHeroIdentity } from '../engine/answerValidator';
import { deriveDoomLockCode, validateDoomLock } from '../engine/doomLock';
import { formatValue } from '../engine/answerParser';

describe('Game Flow and State Transition Logic', () => {
  it('allows retrying prediction without corrupting state', () => {
    const file = QUESTION_SETS.A.heroFiles[0]; // Loki: [3, 12, 7, 5] -> [12, 3, 5, 7]
    
    // First attempt: wrong
    const attempt1 = validatePredictionInput('1, 2, 3, 4', file.expectedOutput);
    expect(attempt1.isValid).toBe(false);

    // Second attempt: correct
    const attempt2 = validatePredictionInput('12, 3, 5, 7', file.expectedOutput);
    expect(attempt2.isValid).toBe(true);

    // Alternative spacing
    const attempt3 = validatePredictionInput('12 3 5 7', file.expectedOutput);
    expect(attempt3.isValid).toBe(true);
  });

  it('allows retrying identity selection without repeating prediction test', () => {
    const file = QUESTION_SETS.A.heroFiles[0]; // Loki
    
    // Wrong hero chosen first
    expect(validateHeroIdentity('Spider-Man', file.heroIdentity)).toBe(false);

    // Correct hero chosen second
    expect(validateHeroIdentity('Loki', file.heroIdentity)).toBe(true);
    expect(validateHeroIdentity('loki ', file.heroIdentity)).toBe(true);
  });

  it('scores correctly when prediction is right but hero identity is initially wrong', () => {
    const file = QUESTION_SETS.A.heroFiles[0]; // Easy file 1: prediction = 3 pts, identity = 2 pts
    
    // Step 1: correct prediction
    const predictionPts = getPredictionPoints(file.fileNumber);
    expect(predictionPts).toBe(3);

    const partialScore = calculateTotalScore(
      {
        [file.id]: {
          fileId: file.id,
          hypothesis: '',
          userPredictionInput: '12, 3, 5, 7',
          predictionVerified: true,
          predictionPointsAwarded: predictionPts,
          selectedHero: 'Spider-Man', // incorrect
          identityVerified: false,
          identityPointsAwarded: 0,
          isDecoded: false,
        },
      },
      {},
      { digits: [], verified: false, pointsAwarded: 0 }
    );
    expect(partialScore).toBe(3);

    // Step 2: correct identity retry
    const identityPts = getIdentityPoints(file.fileNumber);
    expect(identityPts).toBe(2);

    const fullScore = calculateTotalScore(
      {
        [file.id]: {
          fileId: file.id,
          hypothesis: '',
          userPredictionInput: '12, 3, 5, 7',
          predictionVerified: true,
          predictionPointsAwarded: predictionPts,
          selectedHero: 'Loki', // correct
          identityVerified: true,
          identityPointsAwarded: identityPts,
          isDecoded: true,
        },
      },
      {},
      { digits: [], verified: false, pointsAwarded: 0 }
    );
    expect(fullScore).toBe(5);
  });

  it('ensures all sets can achieve exactly 100 points', () => {
    (['A', 'B', 'C', 'D'] as const).forEach(setId => {
      const qSet = QUESTION_SETS[setId];

      let heroFilesScore = 0;
      qSet.heroFiles.forEach(f => {
        heroFilesScore += getPredictionPoints(f.fileNumber) + getIdentityPoints(f.fileNumber);
      });
      // 4 * 5 + 3 * 10 = 50
      expect(heroFilesScore).toBe(50);

      const psScore = qSet.powerSequences.length * getPowerSequencePoints();
      // 4 * 10 = 40
      expect(psScore).toBe(40);

      const doomScore = getDoomLockPoints();
      // 10
      expect(doomScore).toBe(10);

      const grandTotal = heroFilesScore + psScore + doomScore;
      expect(grandTotal).toBe(100);
    });
  });

  it('validates all four Doom Lock codes derived from Power Sequence outputs', () => {
    // Set A
    const codeA = deriveDoomLockCode(QUESTION_SETS.A.powerSequences);
    expect(codeA).toBe('4795');
    expect(validateDoomLock(['4', '7', '9', '5'], codeA)).toBe(true);

    // Set B
    const codeB = deriveDoomLockCode(QUESTION_SETS.B.powerSequences);
    expect(codeB).toBe('6867');
    expect(validateDoomLock(['6', '8', '6', '7'], codeB)).toBe(true);

    // Set C
    const codeC = deriveDoomLockCode(QUESTION_SETS.C.powerSequences);
    expect(codeC.length).toBe(4);
    expect(validateDoomLock(codeC.split(''), codeC)).toBe(true);

    // Set D
    const codeD = deriveDoomLockCode(QUESTION_SETS.D.powerSequences);
    expect(codeD).toBe('8721');
    expect(validateDoomLock(['8', '7', '2', '1'], codeD)).toBe(true);
  });
});
