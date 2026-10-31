// Serialization (pure functions). Implemented in task 4.1.

/**
 * @param {object[]} list
 * @returns {string} JSON text
 */
export function serialize(list) {
  return JSON.stringify(list);
}

/**
 * Check whether a value is a well-formed Activity record.
 * A well-formed Activity has: id (string), project (string), task (string),
 * date (string), time (string), hours (number > 0), rating (integer in [1,5]),
 * and sequence (number).
 * @param {*} value
 * @returns {boolean}
 */
function isWellFormedActivity(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  if (typeof value.id !== 'string') return false;
  if (typeof value.project !== 'string') return false;
  if (typeof value.task !== 'string') return false;
  if (typeof value.date !== 'string') return false;
  if (typeof value.time !== 'string') return false;
  if (typeof value.hours !== 'number' || !Number.isFinite(value.hours) || value.hours <= 0) {
    return false;
  }
  if (!Number.isInteger(value.rating) || value.rating < 1 || value.rating > 5) {
    return false;
  }
  if (typeof value.sequence !== 'number' || !Number.isFinite(value.sequence)) {
    return false;
  }
  return true;
}

/**
 * @param {string} text
 * @returns {{ ok: true, list: object[] } | { ok: false }}
 * Returns ok:false when text is not valid JSON or not a well-formed Activity_List.
 */
export function deserialize(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    // JSON.parse throws SyntaxError on malformed input.
    return { ok: false };
  }
  if (!Array.isArray(parsed)) {
    return { ok: false };
  }
  if (!parsed.every(isWellFormedActivity)) {
    return { ok: false };
  }
  return { ok: true, list: parsed };
}
