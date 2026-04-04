import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <h1 className="font-display text-5xl font-bold text-primary mb-4">
              Oops
            </h1>
            <h2 className="font-display text-2xl font-semibold mb-4">
              Something went wrong
            </h2>
            <p className="text-muted-foreground mb-8">
              We hit an unexpected error. Please refresh the page or go back to the homepage.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 rounded-md bg-primary text-primary-foreground font-display font-semibold hover:opacity-90 transition-opacity"
              >
                Refresh
              </button>
              <a
                href="/"
                className="px-6 py-2 rounded-md border border-border text-foreground font-display font-semibold hover:bg-secondary transition-colors"
              >
                Go Home
              </a>
            </div>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
