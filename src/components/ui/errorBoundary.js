import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Show a customized fallback UI
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-base-100">
          <div className="max-w-md w-full p-6 bg-base-200 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-error mb-4">
              Something went wrong
            </h2>
            <p className="mb-4">
              We apologize for the inconvenience. Please try refreshing the page
              or contact support if the problem persists.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => window.location.reload()}
                className="btn btn-primary"
              >
                Refresh Page
              </button>
              <button
                onClick={() => window.history.back()}
                className="btn btn-ghost"
              >
                Go Back
              </button>
            </div>
            {process.env.NODE_ENV === "development" && (
              <div className="mt-6">
                <details className="bg-base-300 p-4 rounded-lg">
                  <summary className="font-semibold cursor-pointer">
                    Error Details (Development Only)
                  </summary>
                  <pre className="mt-2 text-sm overflow-auto p-2 bg-base-100 rounded">
                    {this.state.error && this.state.error.toString()}
                    <br />
                    {this.state.errorInfo &&
                      this.state.errorInfo.componentStack}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
