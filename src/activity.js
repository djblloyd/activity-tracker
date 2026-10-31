// Activity operations (pure functions). Implemented in task 3.1.

/**
 * Generate a unique identifier, using crypto.randomUUID() when available and
 * falling back to a timestamp-plus-random string otherwise.
 * @returns {string}
 */
function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Build an immutable Activity from validated values.
 * @param {object} values validated input: project, task, date, time, hours, rating
 * @param {number} sequence monotonic insertion counter
 * @returns {object} Activity
 */
export function createActivity(values, sequence) {
  return Object.freeze({
    id: generateId(),
    project: values.project,
    task: values.task,
    date: values.date,
    time: values.time,
    hours: values.hours,
    rating: values.rating,
    sequence,
  });
}

/**
 * Order activities for display: by date+time descending (most recent first),
 * ties broken by insertion sequence descending. Returns a new array.
 * @param {object[]} list
 * @returns {object[]}
 */
export function orderForDisplay(list) {
  return [...list].sort((a, b) => {
    const aKey = `${a.date}T${a.time}`;
    const bKey = `${b.date}T${b.time}`;
    if (aKey > bKey) return -1;
    if (aKey < bKey) return 1;
    return b.sequence - a.sequence;
  });
}

/**
 * Compute the best-rated activity: highest rating, ties broken by the most
 * recently added (highest sequence). Returns null for an empty list.
 * @param {object[]} list
 * @returns {object | null}
 */
export function computeBestRated(list) {
  if (list.length === 0) return null;
  return list.reduce((best, current) => {
    if (current.rating > best.rating) return current;
    if (current.rating === best.rating && current.sequence > best.sequence) {
      return current;
    }
    return best;
  });
}
