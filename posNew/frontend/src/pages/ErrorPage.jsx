import { useNavigate, useRouteError } from 'react-router-dom';
import { Button } from '../shared/components/ui';

/**
 * ErrorPage Component
 * Generic error page for unexpected errors in routing
 * Used by React Router's errorElement
 */
const ErrorPage = () => {
  const navigate = useNavigate();
  const error = useRouteError();

  // Determine error type and message
  const getErrorInfo = () => {
    if (error?.status === 404) {
      return {
        title: 'Página No Encontrada',
        message: 'Lo sentimos, la página que buscas no existe.',
        icon: (
          <svg
            className="h-12 w-12 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
        bgColor: 'bg-blue-100',
      };
    }

    if (error?.status === 403) {
      return {
        title: 'Acceso Denegado',
        message: 'No tienes permisos para acceder a esta página.',
        icon: (
          <svg
            className="h-12 w-12 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        ),
        bgColor: 'bg-red-100',
      };
    }

    return {
      title: 'Error Inesperado',
      message: 'Ha ocurrido un error inesperado. Por favor, intenta de nuevo.',
      icon: (
        <svg
          className="h-12 w-12 text-orange-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      bgColor: 'bg-orange-100',
    };
  };

  const errorInfo = getErrorInfo();

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-2xl w-full">
        {/* Icon */}
        <div className="mb-6 text-center">
          <div className={`mx-auto h-24 w-24 rounded-full ${errorInfo.bgColor} flex items-center justify-center`}>
            {errorInfo.icon}
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {errorInfo.title}
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            {errorInfo.message}
          </p>
        </div>

        {/* Error details (only in development) */}
        {import.meta.env.DEV && error && (
          <div className="mb-6 bg-gray-100 border border-gray-300 rounded-lg p-4">
            <h2 className="text-sm font-semibold text-gray-800 mb-2">
              Detalles del Error (solo en desarrollo):
            </h2>
            <pre className="text-xs text-gray-700 overflow-auto max-h-40 whitespace-pre-wrap">
              {error.statusText || error.message || 'Error desconocido'}
            </pre>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="primary"
            onClick={() => navigate('/')}
          >
            Ir al Inicio
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Volver Atrás
          </Button>
          <Button
            variant="ghost"
            onClick={handleReload}
          >
            Recargar Página
          </Button>
        </div>

        {/* Additional help */}
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            Si el problema persiste, por favor contacta al soporte técnico.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
