import { defineProject } from 'vitest/config';

export default defineProject({
  define: {
    __BUILD_INFO__: JSON.stringify({ sprint: 'test', commit: 'test', zeit: '2026-01-01T00:00:00Z' }),
  },
  test: { name: 'web', environment: 'node', include: ['src/**/*.test.ts'] },
});
