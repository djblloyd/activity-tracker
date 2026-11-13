import { describe, it, expect, beforeEach } from 'vitest';
import { THEME_KEY, getSavedTheme, resolveTheme, applyTheme, initTheme } from '../src/theme.js';

describe('theme', () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
    document.body.innerHTML = '<button id="theme-toggle" aria-pressed="false"></button>';
  });

  it('ignores missing or unknown saved values', () => {
    expect(getSavedTheme()).toBeNull();
    localStorage.setItem(THEME_KEY, 'purple');
    expect(getSavedTheme()).toBeNull();
    localStorage.setItem(THEME_KEY, 'dark');
    expect(getSavedTheme()).toBe('dark');
  });

  it('prefers a saved choice over the system preference', () => {
    expect(resolveTheme(null, true)).toBe('dark');
    expect(resolveTheme(null, false)).toBe('light');
    expect(resolveTheme('light', true)).toBe('light');
  });

  it('applies the theme to the root and syncs the button', () => {
    applyTheme('dark');
    const button = document.querySelector('#theme-toggle');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(button.getAttribute('aria-pressed')).toBe('true');
    applyTheme('light');
    expect(button.getAttribute('aria-pressed')).toBe('false');
  });

  it('toggles and saves the choice on click', () => {
    initTheme(document);
    expect(document.documentElement.dataset.theme).toBe('light');
    document.querySelector('#theme-toggle').click();
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem(THEME_KEY)).toBe('dark');
    document.querySelector('#theme-toggle').click();
    expect(localStorage.getItem(THEME_KEY)).toBe('light');
  });
});
