
import React from 'react';

interface Props {
  children: React.ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * ErrorBoundary class component to catch rendering errors in its child tree.
 * Inherits from React.Component to use lifecycle methods and access built-in properties.
 */
class ErrorBoundary extends React.Component<Props, State> {
  // Initialize state using property initializer
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  /**
   * Static method to update state when an error is thrown in a child component.
   */
  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null };
  }

  /**
   * Captures error information for logging or side-effects.
   */
  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Standard React class method logic for catching errors
    console.error("Uncaught error:", error, errorInfo);
    // Properly updates state with error details using the inherited setState method
    this.setState({ error, errorInfo });
  }

  /**
   * Resets the error state to allow recovery attempts.
   */
  private handleResetError = () => {
    // Standard React class method logic for resetting state
    this.setState({ hasError: false, error: null, errorInfo: null });
  }

  public render() {
    if (this.state.hasError) {
      // Accesses props for fallback customization from the inherited props property
      const { fallbackMessage = "We're sorry — something went wrong." } = this.props;
      return (
        <div className="p-6 sm:p-10 bg-red-50 border border-red-300 rounded-lg shadow-xl max-w-2xl mx-auto my-8 text-center" role="alert">
          <div className="flex justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-red-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-red-700 mb-3">Oops! An Error Occurred.</h2>
          <p className="text-red-600 mb-4">{fallbackMessage}</p>
          {this.state.error && (
            <details className="mb-4 text-left bg-red-100 p-3 rounded text-sm text-red-700">
              <summary className="cursor-pointer font-medium">Error Details (for debugging)</summary>
              <pre className="mt-2 whitespace-pre-wrap break-all">
                {this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack && (
                  `\n\nComponent Stack:\n${this.state.errorInfo.componentStack}`
                )}
              </pre>
            </details>
          )}
          <button
            onClick={this.handleResetError}
            className="px-6 py-2.5 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 transition duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label="Try to recover from error"
          >
            Try Again or Go Back
          </button>
           <p className="text-xs text-gray-500 mt-3">If the problem persists, please contact support or try refreshing the page.</p>
        </div>
      );
    }

    // Accesses children from inherited props property
    return this.props.children;
  }
}

export default ErrorBoundary;
