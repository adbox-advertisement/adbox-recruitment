const mode = import.meta.env.VITE_API_MODE ?? 'mock';
if (mode !== 'mock' && mode !== 'http') throw new Error('VITE_API_MODE must be mock or http.');

export const env = {
  isMock: mode === 'mock',
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/$/, ''),
  mockFailure: import.meta.env.VITE_MOCK_FAILURE || 'none',
} as const;

if (env.isMock && !env.apiBaseUrl.startsWith('/')) {
  throw new Error('Mock mode requires a same-origin API path.');
}
