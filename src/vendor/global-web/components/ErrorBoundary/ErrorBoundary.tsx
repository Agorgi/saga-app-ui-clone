import { logger } from '@saga/logger-middleware';
import { AlertCircle } from '@untitledui/icons';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '../Button/Button';
import styles from './ErrorBoundary.module.scss';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  private static nextHeadingId = 0;

  private readonly headingId: string;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
    this.headingId = `error-boundary-heading-${ErrorBoundary.nextHeadingId}`;
    ErrorBoundary.nextHeadingId += 1;
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error, errorInfo: null };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error({ error, errorInfo }, 'ErrorBoundary caught an error');
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  override render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state;
      const technicalMessage = error?.message?.trim() || 'No error message was provided.';
      const componentStack = errorInfo?.componentStack?.trim();
      const jsStack = error?.stack?.trim();

      return (
        <main className={styles.errorBoundary} aria-labelledby={this.headingId}>
          <div className={styles.card} aria-live="polite">
            <div className={styles.iconWrap} aria-hidden>
              <AlertCircle className={styles.icon} size={48} />
            </div>

            <h1 id={this.headingId} className={styles.title}>
              This part of the page couldn&apos;t load
            </h1>

            <p className={styles.lead}>
              Something went wrong while rendering this section. It&apos;s usually a temporary UI
              issue—your account and saved work are typically fine.
            </p>

            <p className={styles.hint}>
              <strong className={styles.hintStrong}>What you can do:</strong> try reloading this
              section with &quot;Try again&quot;. If the problem keeps coming back, use &quot;Go to
              home&quot; and navigate back to what you were doing.
            </p>

            <div className={styles.actions}>
              <Button type="button" onClick={this.handleReset}>
                Try again
              </Button>
              <Button type="button" onClick={this.handleGoHome} className="buttonSecondary">
                Go to home
              </Button>
            </div>

            <details className={styles.details}>
              <summary className={styles.detailsSummary}>Technical details</summary>
              <div className={styles.detailsBody}>
                <p className={styles.detailsIntro}>
                  Share this with support if you need help. It describes what went wrong inside the
                  app.
                </p>
                <section className={styles.detailsBlock} aria-label="Error message">
                  <h2 className={styles.detailsHeading}>Message</h2>
                  <pre className={styles.pre}>{technicalMessage}</pre>
                </section>
                {componentStack ? (
                  <section className={styles.detailsBlock} aria-label="Component stack">
                    <h2 className={styles.detailsHeading}>Component stack</h2>
                    <pre className={styles.pre}>{componentStack}</pre>
                  </section>
                ) : null}
                {jsStack ? (
                  <section className={styles.detailsBlock} aria-label="JavaScript stack">
                    <h2 className={styles.detailsHeading}>Stack trace</h2>
                    <pre className={styles.pre}>{jsStack}</pre>
                  </section>
                ) : null}
              </div>
            </details>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
