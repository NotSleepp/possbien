import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

/**
 * AccessDenied Component (403 Forbidden)
 * Displayed when a user tries to access a route they don't have permission for
 */
const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        {/* 403 Number */}
        <div className="mb-6">
          <h1 className="text-9xl font-bold text-red-600">403</h1>
        </div>

        {/* Icon */}
        <div className="mb-6">
          <div className="mx-auto h-24 w-24 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              className="h-12 w-12 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Acceso Denegado
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          No tienes permisos para acceder a esta página. Si crees que esto es un error, contacta al administrador.
        </p>

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
        </div>

        {/* Additional help */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Esta página requiere permisos especiales. Contacta al administrador si necesitas acceso.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
