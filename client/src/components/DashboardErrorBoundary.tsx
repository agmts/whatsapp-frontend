import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Component, ReactNode } from "react";
import { useLocation } from "wouter";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class DashboardErrorBoundaryInner extends Component<Props & { setLocation: any }, State> {
  constructor(props: Props & { setLocation: any }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    console.error('DashboardErrorBoundary caught error:', error);
    console.error('Error stack:', error.stack);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Component stack:', errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen p-8 bg-background">
          <div className="flex flex-col items-center w-full max-w-2xl p-8">
            <AlertTriangle
              size={48}
              className="text-destructive mb-6 flex-shrink-0"
            />

            <h2 className="text-2xl font-bold mb-2 text-foreground">Dashboard Error</h2>
            <p className="text-muted-foreground mb-6 text-center">The dashboard encountered an error while loading conversations:</p>

            <div className="p-4 w-full rounded bg-muted overflow-auto mb-6 max-h-64">
              <div className="mb-4">
                <p className="text-sm font-semibold text-foreground mb-2">Error Message:</p>
                <p className="text-sm text-destructive font-mono break-words">{this.state.error?.message}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-2">Stack Trace:</p>
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap break-words font-mono">
                  {this.state.error?.stack}
                </pre>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg",
                  "bg-primary text-primary-foreground",
                  "hover:opacity-90 cursor-pointer"
                )}
              >
                <RotateCcw size={16} />
                Reload Dashboard
              </button>
              <button
                onClick={() => this.props.setLocation('/')}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg",
                  "bg-secondary text-secondary-foreground",
                  "hover:opacity-90 cursor-pointer"
                )}
              >
                <Home size={16} />
                Back to Login
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function DashboardErrorBoundary({ children }: { children: ReactNode }) {
  const [, setLocation] = useLocation();
  return (
    <DashboardErrorBoundaryInner setLocation={setLocation}>
      {children}
    </DashboardErrorBoundaryInner>
  );
}
