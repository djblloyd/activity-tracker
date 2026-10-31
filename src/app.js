// Application entry point: wires state, storage, and UI. Implemented in task 8.1.

import { validateActivityInput } from './validation.js';
import { createActivity } from './activity.js';
import * as storage from './storage.js';
import {
  renderActivityList,
  renderBestRated,
  renderForm,
  showFieldErrors,
  clearFieldErrors,
  showSuccessMessage,
  showSaveError,
  showLoadError,
  clearStatus,
} from './ui.js';

/**
 * The authoritative in-memory application state. The UI always renders from
 * this state; storage is written after each successful mutation.
 * @type {{ activities: object[], nextSequence: number }}
 */
export const state = {
  activities: [],
  nextSequence: 0,
};

/**
 * Compute the sequence counter to use for the next inserted activity: one more
 * than the highest existing sequence, or 0 when the list is empty.
 * @param {object[]} list
 * @returns {number}
 */
function computeNextSequence(list) {
  let max = -1;
  for (const activity of list) {
    if (typeof activity.sequence === 'number' && activity.sequence > max) {
      max = activity.sequence;
    }
  }
  return max + 1;
}

/**
 * Re-render the activity list and best-rated panel from the current in-memory
 * state. Both views are driven off state.activities so they always agree.
 * @param {Document} [doc]
 */
function render(doc = document) {
  const listContainer = doc.querySelector('#activity-list');
  const bestContainer = doc.querySelector('#best-rated');
  renderActivityList(state.activities, listContainer);
  renderBestRated(state.activities, bestContainer);
}

/**
 * Read the raw form values from the activity form. The rating is read from the
 * checked radio input within the #rating radiogroup (or null when none is
 * selected). Other fields are read as their raw string values so that
 * validateActivityInput can report per-field errors and the UI can preserve
 * what the user typed on rejection.
 * @param {HTMLFormElement} form
 * @returns {{project:string, task:string, date:string, time:string, hours:string, rating:number|null}}
 */
function readFormValues(form) {
  const getValue = (id) => {
    const el = form.querySelector(`#${id}`);
    return el ? el.value : '';
  };

  const checkedRating = form.querySelector('input[name="rating"]:checked');
  const rating = checkedRating ? Number(checkedRating.value) : null;

  return {
    project: getValue('project'),
    task: getValue('task'),
    date: getValue('date'),
    time: getValue('time'),
    hours: getValue('hours'),
    rating,
  };
}

/**
 * Reset the activity form inputs and the rating control after a successful add.
 * @param {HTMLFormElement} form
 */
function resetForm(form) {
  form.reset();
  // form.reset() restores the authored (empty) markup for native inputs, but
  // the rating control is rendered by the UI layer, so re-render it cleared.
  renderForm(form, null);
}

/**
 * Handle submission of the activity form: validate, create, append, persist,
 * and re-render. Implements the event flow described in design.md.
 * @param {Event} event
 * @param {HTMLFormElement} form
 */
function handleSubmit(event, form) {
  event.preventDefault();
  const doc = form.ownerDocument || document;

  const raw = readFormValues(form);
  const result = validateActivityInput(raw);

  if (!result.ok) {
    // Validation failed: show per-field errors and preserve the user's inputs
    // (the form is not reset). (Requirements 1.4-1.9, 2.3)
    clearStatus(doc);
    showFieldErrors(result.errors, doc);
    return;
  }

  // Validation passed: clear any previous errors, create and append the
  // activity, and advance the sequence counter. (Requirements 1.2)
  clearFieldErrors(doc);
  const activity = createActivity(result.values, state.nextSequence);
  state.activities.push(activity);
  state.nextSequence += 1;

  // Persist the complete current list. (Requirement 3.1)
  const saveResult = storage.save(state.activities);

  if (!saveResult.ok) {
    // Write failed: keep the in-memory state and show the save-failure
    // message. The just-added activity remains visible. (Requirement 3.2)
    showSaveError(undefined, doc);
    render(doc);
    return;
  }

  // Write succeeded: confirm, clear the form, and re-render. (Requirements
  // 1.3, 4.2, 5.2)
  showSuccessMessage(undefined, doc);
  resetForm(form);
  render(doc);
}

/**
 * Initialize the application: load stored activities, seed in-memory state,
 * surface a load failure when the stored data is corrupt, wire the submit
 * handler, and perform the initial render.
 * @param {Document} [doc]
 */
export function init(doc = document) {
  const loaded = storage.load();

  state.activities = loaded.list;
  state.nextSequence = computeNextSequence(loaded.list);

  // On corrupt stored data, the list is empty and we tell the user their
  // stored activities could not be loaded. (Requirement 3.5). 'empty' is the
  // normal first-run path and shows no error (Requirement 3.4).
  if (loaded.status === 'corrupt') {
    showLoadError(undefined, doc);
  }

  const form = doc.querySelector('#activity-form');
  if (form) {
    renderForm(form, null);
    form.addEventListener('submit', (event) => handleSubmit(event, form));
  }

  render(doc);
}

// Auto-initialize when running in a browser with a ready document. Tests import
// `init`/`state` directly against their own jsdom document, so this guard
// avoids running against a half-built document during import.
if (typeof document !== 'undefined' && document.querySelector('#activity-form')) {
  init();
}
