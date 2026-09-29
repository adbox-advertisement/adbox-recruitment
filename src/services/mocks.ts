import { setupWorker } from 'msw/browser';
import { handlers } from './mock-handlers';

export async function startMocks() {
  const worker = setupWorker(...handlers);
  await worker.start({
    quiet: true,
    onUnhandledFrame: 'bypass',
    serviceWorker: { url: '/mockServiceWorker.js' },
  });
}
