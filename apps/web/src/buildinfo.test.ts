import { describe, expect, it } from 'vitest';
import { formatBuildZeit } from './buildinfo.ts';

describe('Build-Info', () => {
  it('formatiert die Build-Zeit in deutscher Zeit', () => {
    expect(formatBuildZeit('2026-11-27T17:04:00Z')).toBe('27.11.2026, 18:04');
  });
});
