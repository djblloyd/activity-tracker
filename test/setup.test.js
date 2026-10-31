// Placeholder spec to confirm the test tooling runs. Real specs are added
// alongside each module in later tasks.
import { describe, it, expect } from 'vitest';

describe('test tooling', () => {
  it('runs the vitest + jsdom environment', () => {
    expect(typeof document).toBe('object');
    expect(1 + 1).toBe(2);
  });
});
