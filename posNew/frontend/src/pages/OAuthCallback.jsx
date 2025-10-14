import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../features/auth/api/api.js';

const OAuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setToken, login } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      if (token) {
        setToken(token);
        try {
          const response = await api.get('/auth/me');
          login(response.data, token);
          navigate('/');
        } catch (error) {
          console.error('Error al obtener datos del usuario:', error);
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };

    handleCallback();
  }, [location, navigate, setToken, login]);

  return <div>Cargando...</div>;
};

export default OAuthCallback;