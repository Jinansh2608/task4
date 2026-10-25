import { ValueType, PowerSequenceQuestion } from '../types/game';
import { isMatrix, isNumberList } from './answerParser';

/**
 * Extracts all scalar numbers from a ValueType
 */
export function flattenNumbers(value: ValueType): number[] {
  if (typeof value === 'number') {
    return [value];
  }
  if (isMatrix(value)) {
    return value.flat();
  }
  if (isNumberList(value)) {
    return value;
  }
  return [];
}

/**
 * Extraction rule:
 * "For each Power Sequence, take the largest number in its final output and extract its last digit."
 */
export function extractDigitFromOutput(output: ValueType): number {
  const nums = flattenNumbers(output);
  if (nums.length === 0) return 0;
  const maxVal = Math.max(...nums);
  return Math.abs(maxVal) % 10;
}

/**
 * Derives the 4-digit Doom Lock code from the four Power Sequence questions
 */
export function deriveDoomLockCode(powerSequences: PowerSequenceQuestion[]): string {
  const digits = powerSequences.slice(0, 4).map(ps => {
    return extractDigitFromOutput(ps.expectedOutput).toString();
  });
  return digits.join('');
}

/**
 * Validates player's Doom Lock attempt
 */
export function validateDoomLock(enteredDigits: string[], expectedCode: string): boolean {
  const enteredCode = enteredDigits.join('').trim();
  return enteredCode === expectedCode.trim();
}
