import { Component } from 'react';
import Button from '../ui/Button';

/**
 * ErrorBoundary Component
 * Catches React errors in child components and displays a fallback UI
 * 
 * Usage:
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-base-100 px-4">
          <div className="max-w-2xl w-full">
            {/* Icon */}
            <div className="mb-6 text-center">
              <div className="mx-auto h-24 w-24 rounded-full bg-error/20 flex items-center justify-center">
                <svg
                  className="h-12 w-12 text-error"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-base-content mb-3">
                ¡Algo salió mal!
              </h1>
              <p className="text-lg text-base-content/70 mb-4">
                Lo sentimos, ha ocurrido un error inesperado. Por favor, intenta recargar la página.
              </p>
            </div>

            {/* Error details (only in development) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="mb-6 bg-error/10 border border-error rounded-lg p-4">
                <h2 className="text-sm font-semibold text-error mb-2">
                  Detalles del Error (solo en desarrollo):
                </h2>
                <pre className="text-xs text-error overflow-auto max-h-40 whitespace-pre-wrap">
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="primary"
                onClick={this.handleReload}
              >
                Recargar Página
              </Button>
              <Button
                variant="secondary"
                onClick={this.handleReset}
              >
                Intentar de Nuevo
              </Button>
              <Button
                variant="ghost"
                onClick={() => window.location.href = '/'}
              >
                Ir al Inicio
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
