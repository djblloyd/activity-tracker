// Shared fast-check generators for ActivityTracker property tests.
//
// These are stubs to be filled in as the corresponding properties are
// implemented in later tasks. Each export maps to a generator described in
// the design document's Testing Strategy.

import fc from 'fast-check';

/**
 * Valid activity input: non-empty project/task, YYYY-MM-DD date, HH:MM time,
 * hours as a float > 0, rating as an integer 1-5.
 * Implemented in task 2.5 / 3.2.
 */
export function validInput() {
  throw new Error('validInput generator not yet implemented');
}

/**
 * Raw input that blanks or whitespace-fills one required field at a time,
 * with all other fields valid. Implemented in task 2.2.
 */
export function invalidField() {
  throw new Error('invalidField generator not yet implemented');
}

/**
 * Hours values that are not a finite number > 0 (<= 0, NaN, non-numeric
 * strings). Implemented in task 2.3.
 */
export function invalidHours() {
  throw new Error('invalidHours generator not yet implemented');
}

/**
 * Arbitrary rating candidates: integers, floats, out-of-range numbers, and
 * non-numbers. Implemented in task 2.4.
 */
export function anyRating() {
  throw new Error('anyRating generator not yet implemented');
}

/**
 * Activity lists with assigned sequence numbers, able to force rating ties
 * and date/time collisions. Implemented in task 3.2 / 3.3 / 3.4.
 */
export function activityList() {
  throw new Error('activityList generator not yet implemented');
}

/**
 * Malformed stored values: non-JSON strings and valid-JSON-but-wrong-shape
 * values. Implemented in task 4.3.
 */
export function malformedStored() {
  throw new Error('malformedStored generator not yet implemented');
}

// Re-export fast-check so test files share a single instance.
export { fc };
