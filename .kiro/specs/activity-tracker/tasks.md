# Implementation Plan: ActivityTracker

## Overview

This plan builds ActivityTracker test-first, from the pure logic layer outward to storage and finally the DOM-facing UI, wiring everything together at the end. The implementation is plain HTML/CSS/JavaScript ES modules with no build step. Testing uses Vitest with the jsdom environment, and fast-check for the 11 correctness properties. Each property test runs a minimum of 100 iterations and is tagged with a comment referencing its design property.

Work proceeds in dependency order: project scaffolding and shared types first, then the pure modules (validation, activity operations, serialization) with their property tests placed next to each implementation, then the storage wrapper, then rendering and wiring, closing with integration tests that exercise storage and recompute flows end-to-end.

## Tasks

- [x] 1. Set up project structure and test tooling
  - Create `index.html`, `styles.css`, and a `src/` directory for ES modules (`validation.js`, `activity.js`, `serialization.js`, `storage.js`, `ui.js`, `app.js`)
  - Create `package.json` with Vitest, `jsdom`, and `fast-check` as dev dependencies and a `test` script running `vitest --run`
  - Add `vitest.config.js` configuring the `jsdom` test environment and a `test/` directory for specs
  - Create a shared fast-check generators helper (`test/generators.js`) stub to be filled in as properties are implemented (`validInput`, `invalidField`, `invalidHours`, `anyRating`, `activityList`, `malformedStored`)
  - _Requirements: 1.1, 2.1_

- [x] 2. Implement input validation
  - [x] 2.1 Implement `isValidRating` and `validateActivityInput` in `validation.js`
    - `isValidRating` returns true iff the value is an integer in [1, 5]
    - `validateActivityInput` rejects empty/whitespace-only project, task, date, time; rejects hours unless a finite number > 0; rejects rating unless `isValidRating`; returns `{ ok, values }` or `{ ok, errors }` with per-field messages; never mutates `raw`
    - Normalize `values` on success: trim project/task, coerce hours to number, keep date/time as non-empty strings, rating as integer
    - _Requirements: 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.3, 2.4_

  - [ ]* 2.2 Write property test for missing required fields
    - Implement the `invalidField` generator (blanks or whitespace-fills one required field at a time, others valid)
    - **Property 2: Missing required fields are rejected with a field-specific error**
    - **Validates: Requirements 1.4, 1.5, 1.6, 1.7, 2.3**

  - [ ]* 2.3 Write property test for invalid hours
    - Implement the `invalidHours` generator (`<= 0`, `NaN`, non-numeric strings)
    - **Property 3: Non-positive or non-numeric hours are rejected**
    - **Validates: Requirements 1.8**

  - [ ]* 2.4 Write property test for rating validity
    - Implement the `anyRating` generator (integers, floats, out-of-range numbers, non-numbers)
    - **Property 4: Rating validity is exactly the integers 1 through 5**
    - **Validates: Requirements 2.4, 2.3**

  - [ ]* 2.5 Write property test for non-mutation of input
    - Implement the `validInput` generator (valid project/task/date/time/hours/rating)
    - **Property 5: Validation never mutates the user's input**
    - **Validates: Requirements 1.9, 2.3**

- [x] 3. Implement activity creation and ordering
  - [x] 3.1 Implement `createActivity`, `orderForDisplay`, and `computeBestRated` in `activity.js`
    - `createActivity` builds an immutable Activity from validated values plus a sequence number, generating an `id` (`crypto.randomUUID()` with fallback) and preserving project, task, date, time, hours, rating
    - `orderForDisplay` returns a new array ordered by combined `date + 'T' + time` descending, ties broken by sequence descending
    - `computeBestRated` returns the Activity with the maximum rating (ties broken by highest sequence), or null for an empty list
    - _Requirements: 1.2, 4.4, 5.1, 5.2, 5.3_

  - [ ]* 3.2 Write property test for adding a valid activity
    - Uses the `validInput` and `activityList` generators
    - **Property 1: Adding a valid activity grows the list and preserves its values**
    - **Validates: Requirements 1.2**

  - [ ]* 3.3 Write property test for display ordering
    - Implement/extend the `activityList` generator to force date/time collisions
    - **Property 8: Display order is a sorted permutation by date and time, most recent first**
    - **Validates: Requirements 4.4**

  - [ ]* 3.4 Write property test for best-rated selection
    - Extend the `activityList` generator to force rating ties
    - **Property 11: The best-rated activity has the highest rating, ties broken by most recently added**
    - **Validates: Requirements 5.1, 5.2, 5.3**

- [x] 4. Implement serialization
  - [x] 4.1 Implement `serialize` and `deserialize` in `serialization.js`
    - `serialize` returns `JSON.stringify(list)`
    - `deserialize` returns `{ ok: true, list }` only when the text parses to an array of well-formed Activity records; otherwise `{ ok: false }` (catches `SyntaxError`, validates shape)
    - _Requirements: 3.3, 3.5_

  - [ ]* 4.2 Write property test for serialize/deserialize round trip
    - Uses the `activityList` generator
    - **Property 6: Serialize/deserialize round trip preserves the list and its order**
    - **Validates: Requirements 3.3**

  - [ ]* 4.3 Write property test for rejecting ill-formed stored data
    - Implement the `malformedStored` generator (non-JSON strings and valid-JSON-but-wrong-shape values)
    - **Property 7: Deserialize rejects any ill-formed stored data**
    - **Validates: Requirements 3.5**

- [x] 5. Checkpoint - Ensure all logic-layer tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement the storage wrapper
  - [x] 6.1 Implement `save` and `load` in `storage.js` over `localStorage`
    - Define the versioned `STORAGE_KEY` (`activity-tracker.activities.v1`)
    - `save` serializes via `serialization.js` and wraps `setItem` in `try/catch`, returning `{ ok }`
    - `load` reads the key: returns `{ status: 'empty', list: [] }` when absent, `{ status: 'loaded', list }` on successful deserialize, and `{ status: 'corrupt', list: [] }` when parse/shape fails — without overwriting the raw stored value
    - _Requirements: 3.1, 3.2, 3.4, 3.5_

  - [ ]* 6.2 Write unit tests for the storage wrapper
    - `load()` with no stored key returns empty (Requirement 3.4); `save`/`load` round trip through a mock `localStorage`; `save` returns `{ ok: false }` when `setItem` throws
    - _Requirements: 3.1, 3.2, 3.4_

- [x] 7. Implement rendering of the activity list and best-rated panel
  - [x] 7.1 Implement star rendering and activity-row rendering in `ui.js`
    - Render a Liked_Rating as exactly `r` filled stars out of five total positions
    - Render each activity row showing project, task, date, time, hours, and Liked_Rating stars, using `orderForDisplay` for the list
    - Render the empty-state message when the list is empty (Requirements 4.3)
    - _Requirements: 2.5, 4.1, 4.2, 4.4_

  - [ ]* 7.2 Write property test that a rendered row shows every field
    - Uses the `validInput`/`activityList` generators in a jsdom environment
    - **Property 9: A rendered row shows every Activity field**
    - **Validates: Requirements 4.1**

  - [ ]* 7.3 Write property test for star rendering
    - Uses ratings 1–5 in a jsdom environment
    - **Property 10: A rating renders as that many filled stars out of five**
    - **Validates: Requirements 2.5**

  - [x] 7.4 Implement the best-rated panel and form rendering in `ui.js`
    - Render the best-rated panel from `computeBestRated` showing all six fields, or the "no best-rated activity" message when empty (Requirements 5.1, 5.4)
    - Render the form with project, task, date, time, hours inputs and a 5-position star control (Requirements 1.1, 2.1, 2.2)
    - Provide helpers to show field validation messages, a success confirmation, and storage status messages
    - _Requirements: 1.1, 2.1, 2.2, 5.1, 5.4_

  - [ ]* 7.5 Write unit tests for form, stars, empty states, and best-rated panel
    - Form renders all fields and a 5-position star control (Requirements 1.1, 2.1); selecting each star value 1–5 renders that many filled stars (Requirement 2.2); empty list shows the "no activities logged" message (Requirement 4.3); `computeBestRated([])` null path shows the "no best-rated activity" message (Requirement 5.4)
    - _Requirements: 1.1, 2.1, 2.2, 4.3, 5.4_

- [x] 8. Wire the application together in `app.js`
  - [x] 8.1 Initialize state and bind the submit flow
    - On load, call `storage.load()` to populate `state.activities`, set `nextSequence` to max existing sequence + 1, handle `corrupt` by showing the load-failure message, and render the list and best-rated panel
    - On submit: read raw form values, call `validateActivityInput`; on failure render field errors and preserve inputs; on success `createActivity`, append, increment `nextSequence`, call `storage.save`; on write failure keep in-memory state and show the "could not be saved" message; on success show confirmation, clear the form, and re-render list and best-rated panel
    - Link `index.html` to `styles.css` and `app.js`
    - _Requirements: 1.2, 1.3, 1.9, 2.3, 3.1, 3.2, 3.3, 3.4, 3.5, 4.2, 5.2_

  - [ ]* 8.2 Write integration tests for the end-to-end flows
    - After adding an activity, mock `localStorage` receives the complete serialized Activity_List (Requirement 3.1); with `setItem` throwing, the in-memory list is retained and the "could not be saved" message shows (Requirement 3.2); with a corrupt stored value, load yields an empty list, the raw value is unchanged, and the "could not be loaded" message shows (Requirement 3.5); adding an activity recomputes and updates the best-rated panel (Requirement 5.2); a new row appears and the form clears after a successful add (Requirements 1.3, 4.2)
    - _Requirements: 1.3, 3.1, 3.2, 3.5, 4.2, 5.2_

- [x] 9. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional test sub-tasks and can be skipped for a faster MVP.
- Each task references specific requirements for traceability; property tests additionally reference their design property number.
- Property tests use fast-check with a minimum of 100 iterations each and are tagged with the `// Feature: activity-tracker, Property {number}: {property_text}` comment format.
- Property sub-tasks are placed immediately after the implementation they validate so errors surface early.
- DOM-touching property and example tests run under Vitest's jsdom environment.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["2.1", "3.1", "4.1"] },
    { "id": 1, "tasks": ["2.2", "2.3", "2.4", "2.5", "3.2", "3.3", "3.4", "4.2", "4.3", "6.1"] },
    { "id": 2, "tasks": ["6.2", "7.1", "7.4"] },
    { "id": 3, "tasks": ["7.2", "7.3", "7.5", "8.1"] },
    { "id": 4, "tasks": ["8.2"] }
  ]
}
```
