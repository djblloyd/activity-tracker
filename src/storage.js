// Storage wrapper over localStorage. Implemented in task 6.1.

import { serialize, deserialize } from './serialization.js';

export const STORAGE_KEY = 'activity-tracker.activities.v1';

/**
 * Serialize the Activity_List and write it to localStorage under STORAGE_KEY.
 * Wraps the write in try/catch so browser exceptions (e.g. QuotaExceededError
 * or storage being disabled) surface as a typed failure rather than throwing.
 * @param {object[]} list
 * @returns {{ ok: true } | { ok: false }}
 */
export function save(list) {
  try {
    localStorage.setItem(STORAGE_KEY, serialize(list));
    return { ok: true };
  } catch (err) {
    return { ok: false };
  }
}

/**
 * Read the stored Activity_List from localStorage.
 * - Returns { status: 'empty', list: [] } when no value is stored.
 * - Returns { status: 'loaded', list } when the stored value deserializes.
 * - Returns { status: 'corrupt', list: [] } when the value cannot be parsed
 *   into a well-formed Activity_List. The raw stored value is left untouched.
 * @returns {{ status: 'loaded', list: object[] }
 *          | { status: 'empty', list: [] }
 *          | { status: 'corrupt', list: [] }}
 */
export function load() {
  let raw;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch (err) {
    // Reading can throw when storage is disabled; treat as corrupt so the
    // app surfaces a load message rather than crashing.
    return { status: 'corrupt', list: [] };
  }

  if (raw === null || raw === undefined) {
    return { status: 'empty', list: [] };
  }

  const result = deserialize(raw);
  if (result.ok) {
    return { status: 'loaded', list: result.list };
  }
  // Parse/shape failed. Do not overwrite the raw stored value.
  return { status: 'corrupt', list: [] };
}
