// UI layer: DOM rendering and form handling. Implemented in tasks 7.1 / 7.4.

import { orderForDisplay, computeBestRated } from './activity.js';

const TOTAL_STARS = 5;
const FILLED_STAR = '\u2605'; // ★
const EMPTY_STAR = '\u2606'; // ☆
export const EMPTY_LIST_MESSAGE = 'No activities have been logged yet.';
export const NO_BEST_RATED_MESSAGE = 'No best-rated activity is available yet.';
export const ADD_SUCCESS_MESSAGE = 'Activity added.';
export const SAVE_FAILURE_MESSAGE = 'The activity could not be saved.';
export const LOAD_FAILURE_MESSAGE = 'Stored activities could not be loaded.';

/**
 * Render a Liked_Rating as exactly `rating` filled stars out of five total
 * positions. Returns a DOM element containing five star positions, the first
 * `rating` of which are marked filled.
 *
 * Requirements: 2.5 — render the rating as the corresponding number of filled
 * stars out of five total star positions.
 *
 * @param {number} rating integer in [1, 5]
 * @param {Document} [doc] document to create elements with (defaults to global)
 * @returns {HTMLElement} a <span class="stars"> with five star positions
 */
export function renderStars(rating, doc = document) {
  const container = doc.createElement('span');
  container.className = 'stars';
  container.dataset.rating = String(rating);
  container.setAttribute('role', 'img');
  container.setAttribute('aria-label', `${rating} out of ${TOTAL_STARS} stars`);

  for (let position = 1; position <= TOTAL_STARS; position += 1) {
    const star = doc.createElement('span');
    const filled = position <= rating;
    star.className = filled ? 'star filled' : 'star';
    star.dataset.filled = filled ? 'true' : 'false';
    star.setAttribute('aria-hidden', 'true');
    star.textContent = filled ? FILLED_STAR : EMPTY_STAR;
    container.appendChild(star);
  }

  return container;
}

/**
 * Render a single activity as a list-row element showing its project, task,
 * date, time, hours, and Liked_Rating stars.
 *
 * Requirements: 4.1 — each row shows project, task, date, time, hours, and
 * the Liked_Rating; 2.5 — rating rendered as filled stars out of five.
 *
 * @param {object} activity an Activity record
 * @param {Document} [doc] document to create elements with (defaults to global)
 * @returns {HTMLLIElement} an <li class="activity-row"> element
 */
export function renderActivityRow(activity, doc = document) {
  const row = doc.createElement('li');
  row.className = 'activity-row';
  if (activity.id != null) {
    row.dataset.id = String(activity.id);
  }

  const fields = [
    { name: 'project', label: 'Project', value: activity.project },
    { name: 'task', label: 'Task', value: activity.task },
    { name: 'date', label: 'Date', value: activity.date },
    { name: 'time', label: 'Time', value: activity.time },
    { name: 'hours', label: 'Hours', value: String(activity.hours) },
  ];

  for (const field of fields) {
    const span = doc.createElement('span');
    span.className = `activity-field activity-${field.name}`;
    span.dataset.field = field.name;

    const label = doc.createElement('span');
    label.className = 'field-label';
    label.textContent = `${field.label}: `;

    const value = doc.createElement('span');
    value.className = 'field-value';
    value.textContent = field.value;

    span.appendChild(label);
    span.appendChild(value);
    row.appendChild(span);
  }

  const ratingWrap = doc.createElement('span');
  ratingWrap.className = 'activity-field activity-rating';
  ratingWrap.dataset.field = 'rating';
  ratingWrap.appendChild(renderStars(activity.rating, doc));
  row.appendChild(ratingWrap);

  return row;
}

/**
 * Render the full Activity_List into the given container element. Activities
 * are ordered for display with the most recently recorded first. When the list
 * is empty, an empty-state message is rendered instead.
 *
 * Requirements: 4.2 — render added activities; 4.3 — empty-state message when
 * the list is empty; 4.4 — order by date and time, most recent first.
 *
 * @param {object[]} list the Activity_List
 * @param {HTMLElement} container the <ul> (or similar) to render into
 */
export function renderActivityList(list, container) {
  if (!container) return;
  const doc = container.ownerDocument || document;
  container.textContent = '';

  if (!Array.isArray(list) || list.length === 0) {
    const empty = doc.createElement('li');
    empty.className = 'empty-state';
    empty.dataset.empty = 'true';
    empty.textContent = EMPTY_LIST_MESSAGE;
    container.appendChild(empty);
    return;
  }

  const ordered = orderForDisplay(list);
  for (const activity of ordered) {
    container.appendChild(renderActivityRow(activity, doc));
  }
}
/**
 * Build the six-field detail block for a single activity, used by both the
 * best-rated panel and anywhere a full activity summary is needed. Shows
 * project, task, date, time, hours, and the Liked_Rating as filled stars.
 *
 * @param {object} activity an Activity record
 * @param {Document} doc document to create elements with
 * @returns {HTMLElement} a <div class="activity-details"> element
 */
function renderActivityDetails(activity, doc) {
  const details = doc.createElement('div');
  details.className = 'activity-details';
  if (activity.id != null) {
    details.dataset.id = String(activity.id);
  }

  const fields = [
    { name: 'project', label: 'Project', value: activity.project },
    { name: 'task', label: 'Task', value: activity.task },
    { name: 'date', label: 'Date', value: activity.date },
    { name: 'time', label: 'Time', value: activity.time },
    { name: 'hours', label: 'Hours', value: String(activity.hours) },
  ];

  for (const field of fields) {
    const span = doc.createElement('span');
    span.className = `activity-field activity-${field.name}`;
    span.dataset.field = field.name;

    const label = doc.createElement('span');
    label.className = 'field-label';
    label.textContent = `${field.label}: `;

    const value = doc.createElement('span');
    value.className = 'field-value';
    value.textContent = field.value;

    span.appendChild(label);
    span.appendChild(value);
    details.appendChild(span);
  }

  const ratingWrap = doc.createElement('span');
  ratingWrap.className = 'activity-field activity-rating';
  ratingWrap.dataset.field = 'rating';
  ratingWrap.appendChild(renderStars(activity.rating, doc));
  details.appendChild(ratingWrap);

  return details;
}

/**
 * Render the best-rated panel into the given container. The best-rated
 * activity is computed from the list with computeBestRated and shown with all
 * six fields (project, task, date, time, hours, Liked_Rating). When the list
 * is empty (no best-rated activity), a message is rendered instead.
 *
 * Requirements: 5.1 — display the Best_Rated_Activity with all six fields when
 * the list has at least one activity; 5.4 — show the "no best-rated activity"
 * message when the list is empty.
 *
 * @param {object[]} list the Activity_List
 * @param {HTMLElement} container the element to render the panel into
 */
export function renderBestRated(list, container) {
  if (!container) return;
  const doc = container.ownerDocument || document;
  container.textContent = '';

  const best = computeBestRated(Array.isArray(list) ? list : []);

  if (best === null) {
    const empty = doc.createElement('p');
    empty.className = 'empty-state';
    empty.dataset.empty = 'true';
    empty.textContent = NO_BEST_RATED_MESSAGE;
    container.appendChild(empty);
    return;
  }

  container.appendChild(renderActivityDetails(best, doc));
}

/**
 * Render an interactive 5-position star control for setting the Liked_Rating.
 * Exactly five star positions are rendered (values 1 through 5). When a
 * `selected` rating is provided, the first `selected` stars are shown filled
 * to reflect the current selection (Requirement 2.2). The control is built as
 * accessible radio buttons so exactly the integer values 1–5 can be chosen
 * (Requirement 2.1).
 *
 * This renders into an existing container (e.g. the #rating radiogroup from
 * index.html) rather than replacing it, preserving the container's own ARIA
 * attributes.
 *
 * Requirements: 2.1 — offer exactly the integer values 1–5; 2.2 — selecting a
 * star value renders that many filled stars.
 *
 * @param {HTMLElement} container the radiogroup element to render into
 * @param {number|null} [selected] the currently selected rating (1–5) or null
 * @returns {HTMLElement} the container
 */
export function renderRatingControl(container, selected = null) {
  if (!container) return container;
  const doc = container.ownerDocument || document;
  container.textContent = '';

  for (let value = 1; value <= TOTAL_STARS; value += 1) {
    const label = doc.createElement('label');
    label.className = 'star-option';
    label.dataset.value = String(value);

    const input = doc.createElement('input');
    input.type = 'radio';
    input.name = 'rating';
    input.value = String(value);
    input.className = 'star-input';
    input.setAttribute('aria-label', `${value} star${value === 1 ? '' : 's'}`);
    if (selected != null && Number(selected) === value) {
      input.checked = true;
    }

    const glyph = doc.createElement('span');
    const filled = selected != null && value <= Number(selected);
    glyph.className = filled ? 'star filled' : 'star';
    glyph.dataset.filled = filled ? 'true' : 'false';
    glyph.setAttribute('aria-hidden', 'true');
    glyph.textContent = filled ? FILLED_STAR : EMPTY_STAR;

    label.appendChild(input);
    label.appendChild(glyph);
    container.appendChild(label);
  }

  return container;
}

/**
 * Render the activity form's dynamic parts into an existing form element. The
 * static inputs (project, task, date, time, hours) are authored in index.html;
 * this helper populates the 5-position star control inside the form's #rating
 * radiogroup and reflects any currently selected rating.
 *
 * Requirements: 1.1 — present input fields for project, task, date, time, and
 * hours; 2.1 — present a star control offering exactly the values 1–5.
 *
 * @param {HTMLFormElement} form the activity form element
 * @param {number|null} [selectedRating] the currently selected rating or null
 * @returns {HTMLFormElement} the form
 */
export function renderForm(form, selectedRating = null) {
  if (!form) return form;
  const ratingContainer = form.querySelector('#rating, .rating');
  if (ratingContainer) {
    renderRatingControl(ratingContainer, selectedRating);
  }
  return form;
}

/**
 * Show a validation message for a single form field. Locates the field's
 * error element via the `data-error-for` attribute within the given root.
 *
 * Requirements: 1.4–1.8, 2.3 — display a validation message identifying the
 * offending field.
 *
 * @param {string} field the field name (project/task/date/time/hours/rating)
 * @param {string} message the human-readable validation message
 * @param {ParentNode} [root] the scope to search (defaults to document)
 */
export function showFieldError(field, message, root = document) {
  if (!root) return;
  const el = root.querySelector(`[data-error-for="${field}"]`);
  if (el) {
    el.textContent = message;
  }
}

/**
 * Render a set of field validation messages, clearing any previously shown
 * errors first. `errors` is an object keyed by field name as produced by
 * validateActivityInput.
 *
 * @param {Record<string, string>} errors field-name → message map
 * @param {ParentNode} [root] the scope to search (defaults to document)
 */
export function showFieldErrors(errors, root = document) {
  clearFieldErrors(root);
  if (!errors) return;
  for (const [field, message] of Object.entries(errors)) {
    showFieldError(field, message, root);
  }
}

/**
 * Clear all field validation messages within the given root.
 *
 * @param {ParentNode} [root] the scope to search (defaults to document)
 */
export function clearFieldErrors(root = document) {
  if (!root) return;
  const els = root.querySelectorAll('[data-error-for]');
  els.forEach((el) => {
    el.textContent = '';
  });
}

/**
 * Show a success confirmation after an activity is added. Writes into the
 * form status element (#form-status by default).
 *
 * Requirements: 1.3 — display a confirmation when an Activity is successfully
 * added.
 *
 * @param {string} [message] the confirmation text
 * @param {ParentNode} [root] the scope to search (defaults to document)
 */
export function showSuccessMessage(message = ADD_SUCCESS_MESSAGE, root = document) {
  if (!root) return;
  const el = root.querySelector('#form-status');
  if (el) {
    el.textContent = message;
    el.dataset.state = 'success';
  }
}

/**
 * Show a storage write-failure message while keeping the in-memory list.
 * Writes into the form status element (#form-status by default).
 *
 * Requirements: 3.2 — display a message indicating the activity could not be
 * saved.
 *
 * @param {string} [message] the failure text
 * @param {ParentNode} [root] the scope to search (defaults to document)
 */
export function showSaveError(message = SAVE_FAILURE_MESSAGE, root = document) {
  if (!root) return;
  const el = root.querySelector('#form-status');
  if (el) {
    el.textContent = message;
    el.dataset.state = 'error';
  }
}

/**
 * Show a storage load/parse-failure message. Writes into the load status
 * element (#load-status by default).
 *
 * Requirements: 3.5 — display a message indicating stored activities could not
 * be loaded.
 *
 * @param {string} [message] the failure text
 * @param {ParentNode} [root] the scope to search (defaults to document)
 */
export function showLoadError(message = LOAD_FAILURE_MESSAGE, root = document) {
  if (!root) return;
  const el = root.querySelector('#load-status');
  if (el) {
    el.textContent = message;
    el.dataset.state = 'error';
  }
}

/**
 * Clear the form status message (e.g. after the user starts editing again).
 *
 * @param {ParentNode} [root] the scope to search (defaults to document)
 */
export function clearStatus(root = document) {
  if (!root) return;
  const el = root.querySelector('#form-status');
  if (el) {
    el.textContent = '';
    delete el.dataset.state;
  }
}
