import { useNavigate } from 'react-router-dom';
import { Button } from '../shared/components/ui';

/**
 * NotFoundPage Component
 * 404 error page displayed when a route doesn't exist
 */
const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Number */}
        <div className="mb-6">
          <h1 className="text-9xl font-bold text-blue-600">404</h1>
        </div>

        {/* Icon */}
        <div className="mb-6">
          <div className="mx-auto h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center">
            <svg
              className="h-12 w-12 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Página No Encontrada
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Lo sentimos, la página que buscas no existe o ha sido movida.
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
            Si crees que esto es un error, por favor contacta al soporte técnico.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
