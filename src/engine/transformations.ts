import { ValueType } from '../types/game';

/**
 * Pure transformation functions for THE SORCERER'S CIPHER.
 * Each function represents an underlying mathematical pattern discovered in the Hero Files.
 */

// --- General List & Value Transformations ---

/** Swap adjacent pairs: [a, b, c, d] -> [b, a, d, c] */
export function swapAdjacentPairs(input: number[]): number[] {
  const result = [...input];
  for (let i = 0; i < result.length - 1; i += 2) {
    const temp = result[i];
    result[i] = result[i + 1];
    result[i + 1] = temp;
  }
  return result;
}

/** Consecutive differences: [x0, x1, x2...] -> [x1-x0, x2-x1...] */
export function consecutiveDifferences(input: number[]): number[] {
  const result: number[] = [];
  for (let i = 0; i < input.length - 1; i++) {
    result.push(input[i + 1] - input[i]);
  }
  return result;
}

/** Select value closest to 20 */
export function closestTo20(input: number[]): number {
  if (input.length === 0) return 0;
  let closest = input[0];
  let minDiff = Math.abs(input[0] - 20);
  for (let i = 1; i < input.length; i++) {
    const diff = Math.abs(input[i] - 20);
    if (diff < minDiff) {
      minDiff = diff;
      closest = input[i];
    }
  }
  return closest;
}

/** Keep odd 1-based positions: pos 1, 3, 5... (0-based indices 0, 2, 4...) */
export function keepOddPositions1Based(input: number[]): number[] {
  return input.filter((_, idx) => idx % 2 === 0);
}

/** Keep even 1-based positions: pos 2, 4, 6... (0-based indices 1, 3, 5...) */
export function keepEvenPositions1Based(input: number[]): number[] {
  return input.filter((_, idx) => idx % 2 === 1);
}

/** Multiply each value by its 1-based position: val * (i + 1) */
export function multiplyByPosition(input: number[]): number[] {
  return input.map((val, idx) => val * (idx + 1));
}

/** Reverse each row of a 2D matrix */
export function reverseMatrixRows(matrix: number[][]): number[][] {
  return matrix.map(row => [...row].reverse());
}

/** Rotate a 2D matrix 180 degrees */
export function rotateMatrix180(matrix: number[][]): number[][] {
  return matrix
    .slice()
    .reverse()
    .map(row => row.slice().reverse());
}

/** Swap first and last values in rows, leaving the center row unchanged (Set C Doctor Strange) */
export function swapOuterRowsFirstAndLast(matrix: number[][]): number[][] {
  const midRow = Math.floor(matrix.length / 2);
  return matrix.map((row, rIdx) => {
    if (matrix.length > 2 && rIdx === midRow) {
      return [...row];
    }
    if (row.length <= 1) return [...row];
    const newRow = [...row];
    const temp = newRow[0];
    newRow[0] = newRow[newRow.length - 1];
    newRow[newRow.length - 1] = temp;
    return newRow;
  });
}

/** Add adjacent pairs: [a, b, c, d] -> [a+b, c+d] */
export function addAdjacentPairs(input: number[]): number[] {
  const result: number[] = [];
  for (let i = 0; i < input.length - 1; i += 2) {
    result.push(input[i] + input[i + 1]);
  }
  return result;
}

/** Divide each value by 2, then add 1: val / 2 + 1 */
export function divideBy2ThenAdd1(input: number[]): number[] {
  return input.map(x => Math.floor(x / 2) + 1);
}

/** Move the last value to the front: [a, b, c] -> [c, a, b] */
export function moveLastToFront(input: number[]): number[] {
  if (input.length <= 1) return [...input];
  const last = input[input.length - 1];
  return [last, ...input.slice(0, -1)];
}

/** Select the middle value: index floor(length / 2) */
export function selectMiddleValue(input: number[]): number {
  if (input.length === 0) return 0;
  const midIndex = Math.floor(input.length / 2);
  return input[midIndex];
}

/** For each pair, add 2 to the first and 4 to the second: [a, b, c, d] -> [a+2, b+4, c+2, d+4] */
export function pairAdd2And4(input: number[]): number[] {
  return input.map((val, idx) => (idx % 2 === 0 ? val + 2 : val + 4));
}

/** Multiply neighboring values (sliding window): [a, b, c] -> [a*b, b*c] */
export function multiplyNeighboringValues(input: number[]): number[] {
  const result: number[] = [];
  for (let i = 0; i < input.length - 1; i++) {
    result.push(input[i] * input[i + 1]);
  }
  return result;
}

/** Swap the first and last values: [a, b, c, d] -> [d, b, c, a] */
export function swapFirstAndLast(input: number[]): number[] {
  if (input.length <= 1) return [...input];
  const res = [...input];
  const first = res[0];
  res[0] = res[res.length - 1];
  res[res.length - 1] = first;
  return res;
}

/** Square only even values: val % 2 === 0 ? val * val : val */
export function squareEvenValues(input: number[]): number[] {
  return input.map(x => (x % 2 === 0 ? x * x : x));
}

/** Select largest value below 20 */
export function largestValueBelow20(input: number[]): number {
  const below20 = input.filter(x => x < 20);
  if (below20.length === 0) return Math.min(...input);
  return Math.max(...below20);
}

/** Remove multiples of 3 */
export function removeMultiplesOf3(input: number[]): number[] {
  return input.filter(x => x % 3 !== 0);
}

/** Multiply by 1-based position, then add 1: val * (i + 1) + 1 */
export function multiplyByPositionAdd1(input: number[]): number[] {
  return input.map((val, idx) => val * (idx + 1) + 1);
}

/** Divide each value by 2: val / 2 */
export function divideBy2(input: number[]): number[] {
  return input.map(x => Math.floor(x / 2));
}

/** Sum digits of a single number: e.g. 48 -> 4 + 8 = 12 */
export function sumDigitsSingle(num: number): number {
  return Math.abs(num)
    .toString()
    .split('')
    .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
}

/** Sum digits of numbers or list of numbers */
export function sumDigits(input: number | number[]): number | number[] {
  if (typeof input === 'number') {
    return sumDigitsSingle(input);
  }
  return input.map(sumDigitsSingle);
}

/** Add 3, then multiply by 2: (val + 3) * 2 */
export function add3Multiply2(input: number | number[]): number | number[] {
  if (typeof input === 'number') {
    return (input + 3) * 2;
  }
  return input.map(x => (x + 3) * 2);
}

/** Sliding window sum of adjacent pairs: [a, b, c] -> [a+b, b+c] */
export function sumAdjacentPairsSliding(input: number[]): number[] {
  const result: number[] = [];
  for (let i = 0; i < input.length - 1; i++) {
    result.push(input[i] + input[i + 1]);
  }
  return result;
}

/** Remove the smallest value (first occurrence): [4, 9, 7] -> [9, 7] */
export function removeSmallestValue(input: number[]): number[] {
  if (input.length <= 1) return [];
  const minVal = Math.min(...input);
  const minIndex = input.indexOf(minVal);
  return input.filter((_, idx) => idx !== minIndex);
}

/**
 * Universal dispatcher for named transformations
 */
export function executeTransformation(transformationId: string, input: ValueType): ValueType {
  switch (transformationId) {
    case 'setA_file01_loki':
      return swapAdjacentPairs(input as number[]);
    case 'setA_file02_spiderman':
      return consecutiveDifferences(input as number[]);
    case 'setA_file03_hawkeye':
      return closestTo20(input as number[]);
    case 'setA_file04_thanos':
      return keepOddPositions1Based(input as number[]);
    case 'setA_file05_ironman':
      return multiplyByPosition(input as number[]);
    case 'setA_file06_drstrange':
      return reverseMatrixRows(input as number[][]);
    case 'setA_file07_blackwidow':
      return keepEvenPositions1Based(input as number[]);

    case 'setB_file01_thor':
      return addAdjacentPairs(input as number[]);
    case 'setB_file02_antman':
      return divideBy2ThenAdd1(input as number[]);
    case 'setB_file03_captamerica':
      return moveLastToFront(input as number[]);
    case 'setB_file04_blackpanther':
      return selectMiddleValue(input as number[]);
    case 'setB_file05_scarletwitch':
      return pairAdd2And4(input as number[]);
    case 'setB_file06_drstrange':
      return rotateMatrix180(input as number[][]);
    case 'setB_file07_vision':
      return multiplyNeighboringValues(input as number[]);

    case 'setC_file01_loki':
      return swapFirstAndLast(input as number[]);
    case 'setC_file02_hulk':
      return squareEvenValues(input as number[]);
    case 'setC_file03_spiderman':
      return consecutiveDifferences(input as number[]);
    case 'setC_file04_hawkeye':
      return largestValueBelow20(input as number[]);
    case 'setC_file05_thanos':
      return removeMultiplesOf3(input as number[]);
    case 'setC_file06_ironman':
      return multiplyByPositionAdd1(input as number[]);
    case 'setC_file07_drstrange':
      return swapOuterRowsFirstAndLast(input as number[][]);

    case 'setD_file01_antman':
      return divideBy2(input as number[]);
    case 'setD_file02_thor':
      return sumDigits(input as number | number[]);
    case 'setD_file03_blackwidow':
      return keepEvenPositions1Based(input as number[]);
    case 'setD_file04_captmarvel':
      return add3Multiply2(input as number | number[]);
    case 'setD_file05_vision':
      return sumAdjacentPairsSliding(input as number[]);
    case 'setD_file06_scarletwitch':
      return swapAdjacentPairs(input as number[]);
    case 'setD_file07_blackpanther':
      return removeSmallestValue(input as number[]);

    default:
      throw new Error(`Unknown transformation ID: ${transformationId}`);
  }
}
