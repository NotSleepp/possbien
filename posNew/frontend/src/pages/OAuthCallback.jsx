import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { api } from '../features/auth/api/api.js';
import { LoadingSpinner } from '../shared/components/ui';

const OAuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setToken, login } = useAuthStore();
  const { error: showErrorToast, success: showSuccessToast } = useToastStore();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setIsProcessing(true);
        setError(null);

        // Extract token from URL parameters
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const errorParam = params.get('error');

        // Check if there's an error from the OAuth provider
        if (errorParam) {
          const errorMessage = decodeURIComponent(errorParam);
          setError(errorMessage || 'Error en la autenticación con Google');
          showErrorToast(errorMessage || 'Error en la autenticación con Google. Por favor, intenta nuevamente.');
          setIsProcessing(false);
          
          // Redirect to login after showing error briefly
          setTimeout(() => {
            navigate('/login', { 
              state: { 
                error: errorMessage || 'Error en la autenticación con Google. Por favor, intenta nuevamente.' 
              } 
            });
          }, 2000);
          return;
        }

        // Check if token is present
        if (!token) {
          const errorMsg = 'No se recibió el token de autenticación';
          setError(errorMsg);
          showErrorToast('Error en la autenticación. No se recibió el token de acceso.');
          setIsProcessing(false);
          
          setTimeout(() => {
            navigate('/login', { 
              state: { 
                error: 'Error en la autenticación. No se recibió el token de acceso.' 
              } 
            });
          }, 2000);
          return;
        }

        // Store token first
        setToken(token);

        // Fetch user data
        try {
          const response = await api.get('/auth/me');
          
          // Verify we received valid user data
          if (!response.data || !response.data.id) {
            throw new Error('Datos de usuario inválidos');
          }

          // Login with user data and token
          login(response.data, token);

          // Show success toast
          showSuccessToast('¡Autenticación exitosa! Bienvenido.');

          // Successful authentication - redirect to home
          navigate('/', { replace: true });
        } catch (fetchError) {
          console.error('Error al obtener datos del usuario:', fetchError);
          
          // Clear the invalid token
          setToken(null);
          
          const errorMessage = fetchError.response?.data?.message 
            || fetchError.userMessage 
            || 'Error al obtener los datos del usuario';
          
          setError(errorMessage);
          showErrorToast('Error al completar la autenticación. Por favor, intenta nuevamente.');
          setIsProcessing(false);
          
          setTimeout(() => {
            navigate('/login', { 
              state: { 
                error: 'Error al completar la autenticación. Por favor, intenta nuevamente.' 
              } 
            });
          }, 2000);
        }
      } catch (error) {
        console.error('Error en el callback de OAuth:', error);
        setError('Error inesperado durante la autenticación');
        showErrorToast('Error inesperado durante la autenticación. Por favor, intenta nuevamente.');
        setIsProcessing(false);
        
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              error: 'Error inesperado durante la autenticación. Por favor, intenta nuevamente.' 
            } 
          });
        }, 2000);
      }
    };

    handleCallback();
  }, [location, navigate, setToken, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-6">
        {isProcessing && !error && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <LoadingSpinner size="lg" text="Procesando autenticación..." />
            <p className="mt-4 text-sm text-gray-600">
              Por favor espera mientras completamos tu inicio de sesión
            </p>
          </div>
        )}

        {error && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error de Autenticación
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {error}
            </p>
            <p className="text-xs text-gray-500">
              Redirigiendo a la página de inicio de sesión...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback;