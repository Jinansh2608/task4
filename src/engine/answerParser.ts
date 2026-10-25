import { ValueType } from '../types/game';

/**
 * Parses user input strings into typed ValueType (number, number[], or number[][]).
 * Supports versatile formats:
 * - Numbers separated by commas, spaces, or tabs: "4, 12, 24, 40" or "4 12 24 40"
 * - Matrices separated by slashes, semicolons, or newlines: "1 7 3 / 2 9 5 / 8 4 6"
 * - JSON-like arrays: "[4, 12, 24, 40]" or "[[1,2],[3,4]]"
 */
export function parseUserInput(rawInput: string): ValueType | null {
  const trimmed = rawInput.trim();
  if (!trimmed) return null;

  // Try JSON parse first if it starts with [
  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed === 'number') return parsed;
      if (Array.isArray(parsed)) {
        if (parsed.every(item => typeof item === 'number')) return parsed as number[];
        if (parsed.every(row => Array.isArray(row) && row.every(cell => typeof cell === 'number'))) {
          return parsed as number[][];
        }
      }
    } catch {
      // Fall through to standard parsing
    }
  }

  // Check if it's a matrix (contains '/', ';', or newlines)
  if (trimmed.includes('/') || trimmed.includes(';') || trimmed.includes('\n')) {
    const rowDelim = trimmed.includes('\n') ? '\n' : trimmed.includes('/') ? '/' : ';';
    const rawRows = trimmed.split(rowDelim).map(r => r.trim()).filter(r => r.length > 0);
    
    const matrix: number[][] = [];
    for (const rawRow of rawRows) {
      // Clean up bracket characters if present in rows
      const cleanRow = rawRow.replace(/[[\]]/g, '').trim();
      const tokens = cleanRow.split(/[,\s]+/).filter(t => t.length > 0);
      const rowNumbers: number[] = [];
      for (const token of tokens) {
        const num = Number(token);
        if (isNaN(num)) return null;
        rowNumbers.push(num);
      }
      if (rowNumbers.length > 0) {
        matrix.push(rowNumbers);
      }
    }

    if (matrix.length > 0) {
      // If only one row was produced from a delimiter, check if it's actually 1D list
      if (matrix.length === 1 && !trimmed.includes('/') && !trimmed.includes(';')) {
        return matrix[0];
      }
      return matrix;
    }
  }

  // Single list or single number
  const cleanStr = trimmed.replace(/[[\]]/g, '').trim();
  const tokens = cleanStr.split(/[,\s]+/).filter(t => t.length > 0);
  
  if (tokens.length === 0) return null;
  if (tokens.length === 1) {
    const singleNum = Number(tokens[0]);
    return isNaN(singleNum) ? null : singleNum;
  }

  const numbers: number[] = [];
  for (const token of tokens) {
    const num = Number(token);
    if (isNaN(num)) return null;
    numbers.push(num);
  }
  return numbers;
}

/**
 * Checks if a ValueType is a 2D matrix
 */
export function isMatrix(val: ValueType): val is number[][] {
  return Array.isArray(val) && val.length > 0 && Array.isArray(val[0]);
}

/**
 * Checks if a ValueType is a 1D list
 */
export function isNumberList(val: ValueType): val is number[] {
  return Array.isArray(val) && (val.length === 0 || typeof val[0] === 'number');
}

/**
 * Format ValueType into a readable string
 */
export function formatValue(val: ValueType, format: 'inline' | 'multiline' = 'inline'): string {
  if (typeof val === 'number') {
    return val.toString();
  }
  if (isMatrix(val)) {
    if (format === 'multiline') {
      return val.map(row => row.join(' ')).join('\n');
    }
    return val.map(row => row.join(' ')).join(' / ');
  }
  if (isNumberList(val)) {
    return val.join(', ');
  }
  return '';
}
