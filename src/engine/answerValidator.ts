import { ValueType } from '../types/game';
import { parseUserInput, isMatrix, isNumberList } from './answerParser';

/**
 * Deep equality check between two ValueTypes with tolerance for single-element lists vs scalar
 */
export function compareValues(actual: ValueType | null, expected: ValueType): boolean {
  if (actual === null || actual === undefined) return false;

  // Case 1: Both are single numbers
  if (typeof actual === 'number' && typeof expected === 'number') {
    return actual === expected;
  }

  // Case 2: One is scalar and one is single-element array (e.g. 7 vs [7])
  if (typeof actual === 'number' && isNumberList(expected) && expected.length === 1) {
    return actual === expected[0];
  }
  if (isNumberList(actual) && actual.length === 1 && typeof expected === 'number') {
    return actual[0] === expected;
  }

  // Case 3: Both are matrices
  if (isMatrix(actual) && isMatrix(expected)) {
    if (actual.length !== expected.length) return false;
    for (let r = 0; r < actual.length; r++) {
      if (actual[r].length !== expected[r].length) return false;
      for (let c = 0; c < actual[r].length; c++) {
        if (actual[r][c] !== expected[r][c]) return false;
      }
    }
    return true;
  }

  // Case 4: Both are 1D lists
  if (isNumberList(actual) && isNumberList(expected)) {
    if (actual.length !== expected.length) return false;
    for (let i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }
    return true;
  }

  return false;
}

/**
 * Validates a user-submitted string against an expected ValueType or alternative accepted answers
 */
export function validatePredictionInput(
  rawInput: string,
  expected: ValueType,
  alternatives?: ValueType[]
): { isValid: boolean; parsedValue: ValueType | null } {
  const parsed = parseUserInput(rawInput);
  if (parsed === null) {
    return { isValid: false, parsedValue: null };
  }

  if (compareValues(parsed, expected)) {
    return { isValid: true, parsedValue: parsed };
  }

  if (alternatives && alternatives.length > 0) {
    for (const alt of alternatives) {
      if (compareValues(parsed, alt)) {
        return { isValid: true, parsedValue: parsed };
      }
    }
  }

  return { isValid: false, parsedValue: parsed };
}

/**
 * Validates selected hero identity
 */
export function validateHeroIdentity(selectedHero: string, correctHero: string): boolean {
  if (!selectedHero || !correctHero) return false;
  return selectedHero.trim().toLowerCase() === correctHero.trim().toLowerCase();
}
