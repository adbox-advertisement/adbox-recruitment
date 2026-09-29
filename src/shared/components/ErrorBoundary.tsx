import { Component, type ReactNode } from 'react';

export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    // Connect redacted error monitoring here. Do not record applicant answers.
  }
  render() {
    if (this.state.failed)
      return (
        <main className="boot-error">
          <img src="/brand/adbox-mark.svg" width="48" height="48" alt="Adbox" />
          <h1>Something went wrong.</h1>
          <p>Please reload the page. If it happens again, contact info@adboxgh.com.</p>
          <button className="button primary" onClick={() => window.location.reload()}>
            Reload page
          </button>
        </main>
      );
    return this.props.children;
  }
}
