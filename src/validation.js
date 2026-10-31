// Validation logic layer (pure functions). Implemented in task 2.1.

/**
 * @param {*} rating
 * @returns {boolean} true iff rating is an integer in [1, 5]
 */
export function isValidRating(rating) {
  return (
    typeof rating === 'number' &&
    Number.isInteger(rating) &&
    rating >= 1 &&
    rating <= 5
  );
}

/**
 * @param {*} value
 * @returns {boolean} true iff value is non-empty after trimming whitespace
 */
function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Coerce a raw hours value to a finite number, or NaN when not parseable.
 * @param {*} value
 * @returns {number}
 */
function parseHours(value) {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') {
      return NaN;
    }
    return Number(trimmed);
  }
  return NaN;
}

/**
 * Validate raw form input for an activity.
 * @param {{project:string, task:string, date:string, time:string, hours:string|number, rating:number|null}} raw
 * @returns {{ ok: true, values: object } | { ok: false, errors: object }}
 */
export function validateActivityInput(raw) {
  const errors = {};

  if (!isNonEmptyString(raw.project)) {
    errors.project = 'Project is required.';
  }
  if (!isNonEmptyString(raw.task)) {
    errors.task = 'Task is required.';
  }
  if (!isNonEmptyString(raw.date)) {
    errors.date = 'Date is required.';
  }
  if (!isNonEmptyString(raw.time)) {
    errors.time = 'Time is required.';
  }

  const hours = parseHours(raw.hours);
  if (!Number.isFinite(hours) || hours <= 0) {
    errors.hours = 'Hours must be a number greater than 0.';
  }

  if (!isValidRating(raw.rating)) {
    errors.rating = 'Rating must be a whole number from 1 to 5.';
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    values: {
      project: raw.project.trim(),
      task: raw.task.trim(),
      date: raw.date,
      time: raw.time,
      hours,
      rating: raw.rating,
    },
  };
}
