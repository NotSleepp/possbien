import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { api } from '../features/auth/api/api.js';
import Card from '../components/ui/Card';
import GoogleLoginButton from '../features/auth/components/GoogleLoginButton';
import LoginForm from '../features/auth/components/LoginForm';

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);
  const { error: showErrorToast, success: showSuccessToast } = useToastStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Check for error message from OAuth callback
  useEffect(() => {
    if (location.state?.error) {
      setError(location.state.error);
      showErrorToast(location.state.error);
      // Clear the error from location state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate, showErrorToast]);

  const handleCredentialsLogin = async ({ username, password }) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await api.post('/usuarios/login', { username, password });
      login(response.data.usuario, response.data.token);
      showSuccessToast('¡Inicio de sesión exitoso! Bienvenido.');
      navigate('/');
    } catch (err) {
      // Handle different error types
      let errorMessage = '';
      if (err.response?.status === 401) {
        errorMessage = 'Usuario o contraseña incorrectos. Por favor, verifica tus credenciales.';
      } else if (err.response?.status === 403) {
        errorMessage = 'Tu cuenta está desactivada. Contacta con el administrador.';
      } else if (!err.response) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
      } else {
        errorMessage = err.userMessage || 'Error al iniciar sesión. Por favor, intenta nuevamente.';
      }
      setError(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to Google OAuth endpoint
    window.location.href = 'http://localhost:3000/api/auth/google';
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-gray-50 px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sistema POS
          </h1>
          <p className="text-gray-600">
            Inicia sesión para acceder al sistema
          </p>
        </div>

        {/* Google Login Section - Admin */}
        <Card variant="elevated" className="overflow-hidden">
          <div className="px-6 py-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Acceso Administrador
                </h2>
                <p className="text-sm text-gray-600">
                  Autenticación con cuenta de Google
                </p>
              </div>
            </div>
          </div>
          <div className="px-6 py-5">
            <GoogleLoginButton onClick={handleGoogleLogin} />
          </div>
        </Card>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gradient-to-br from-blue-50 via-white to-gray-50 text-gray-500 font-medium">
              o continúa con
            </span>
          </div>
        </div>

        {/* Credentials Login Section - Employees */}
        <Card variant="elevated" className="overflow-hidden">
          <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Acceso Empleados
                </h2>
                <p className="text-sm text-gray-600">
                  Ingresa con tus credenciales
                </p>
              </div>
            </div>
          </div>
          <div className="px-6 py-5">
            <LoginForm
              onSubmit={handleCredentialsLogin}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500">
          ¿Problemas para iniciar sesión? Contacta con el administrador del sistema
        </p>
      </div>
    </div>
  );
};

export default LoginPage;