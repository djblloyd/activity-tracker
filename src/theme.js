// Light/dark theme toggle. With no saved choice the page follows the system
// colour scheme; clicking the toggle saves an explicit 'light' or 'dark'.

export const THEME_KEY = 'activityTracker.theme';

/**
 * Read the saved theme choice, or null when none is saved or storage is
 * unavailable.
 * @param {Storage} [store]
 * @returns {'light'|'dark'|null}
 */
export function getSavedTheme(store = globalThis.localStorage) {
  try {
    const value = store && store.getItem(THEME_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

/**
 * Whether the system prefers a dark colour scheme.
 * @param {Window} [win]
 * @returns {boolean}
 */
export function systemPrefersDark(win = globalThis.window) {
  return Boolean(
    win && typeof win.matchMedia === 'function' && win.matchMedia('(prefers-color-scheme: dark)').matches
  );
}

/**
 * The theme currently in effect: the saved choice, else the system preference.
 * @returns {'light'|'dark'}
 */
export function resolveTheme(saved, prefersDark) {
  return saved || (prefersDark ? 'dark' : 'light');
}

/**
 * Apply a theme to the document root and sync the toggle button's state.
 * @param {'light'|'dark'} theme
 * @param {Document} [doc]
 */
export function applyTheme(theme, doc = document) {
  doc.documentElement.dataset.theme = theme;
  const button = doc.querySelector('#theme-toggle');
  if (button) {
    const dark = theme === 'dark';
    button.setAttribute('aria-pressed', String(dark));
    button.textContent = dark ? '☀ Light mode' : '☾ Dark mode';
  }
}

/**
 * Apply the current theme and wire the toggle button.
 * @param {Document} [doc]
 */
export function initTheme(doc = document) {
  const win = doc.defaultView;
  applyTheme(resolveTheme(getSavedTheme(), systemPrefersDark(win)), doc);

  const button = doc.querySelector('#theme-toggle');
  if (button) {
    button.addEventListener('click', () => {
      const next = doc.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(next, doc);
      try {
        globalThis.localStorage.setItem(THEME_KEY, next);
      } catch {
        // Storage unavailable: the choice still applies for this visit.
      }
    });
  }

  // Follow system changes while the user has not made an explicit choice.
  if (win && typeof win.matchMedia === 'function') {
    win.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', (e) => {
      if (!getSavedTheme()) applyTheme(e.matches ? 'dark' : 'light', doc);
    });
  }
}
