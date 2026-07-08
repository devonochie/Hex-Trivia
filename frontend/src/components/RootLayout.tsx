import { Component, type ReactNode } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";

// --- Error boundary (replaces TanStack's errorComponent) ---------------

interface ErrorBoundaryState {
  error: Error | null;
}

class RouteErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error(error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return <ErrorFallback reset={this.reset} />;
    }
    return this.props.children;
  }
}

function ErrorFallback({ reset }: { reset: () => void }) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              reset();
              navigate(0);
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

// --- Root layout ---------------------------------------------------------
// Note: with react-router-dom (client-side), the <html>/<head>/<body> shell
// lives in index.html, not here, so this only needs to render the outlet.

export function RootLayout() {
  return (
    <RouteErrorBoundary>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </RouteErrorBoundary>
  );
}

export { Link };
