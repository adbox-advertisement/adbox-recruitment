import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { env } from './config/env';
import { ErrorBoundary } from './shared/components/ErrorBoundary';
import './styles/index.css';

async function bootstrap() {
  if (env.isMock) {
    const { startMocks } = await import('./services/mocks');
    await startMocks();
  }
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
}
void bootstrap().catch(() => {
  const root = document.getElementById('root');
  if (root)
    root.innerHTML =
      '<main class="boot-error"><h1>We couldn’t open the application.</h1><p>Please reload this page. If it keeps happening, email <a href="mailto:info@adboxgh.com">info@adboxgh.com</a>.</p></main>';
});
