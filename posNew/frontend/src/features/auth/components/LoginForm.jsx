import { useState } from 'react';
import { Input, Button } from '../../../shared/components/ui';

/**
 * LoginForm Component
 * Form for email/password authentication
 * 
 * @param {Object} props
 * @param {Function} props.onSubmit - Submit handler that receives {username, password}
 * @param {boolean} props.isLoading - Show loading state
 * @param {string} props.error - Error message to display
 * @param {string} props.className - Additional CSS classes
 */
const LoginForm = ({ 
  onSubmit, 
  isLoading = false, 
  error = '', 
  className = '' 
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    if (!username.trim()) {
      errors.username = 'El usuario es requerido';
    }
    
    if (!password) {
      errors.password = 'La contraseña es requerida';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clear previous field errors
    setFieldErrors({});
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Call parent submit handler
    if (onSubmit) {
      onSubmit({ username: username.trim(), password });
    }
  };

  const handleUsernameChange = (value) => {
    setUsername(value);
    // Clear field error when user starts typing
    if (fieldErrors.username) {
      setFieldErrors(prev => ({ ...prev, username: '' }));
    }
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    // Clear field error when user starts typing
    if (fieldErrors.password) {
      setFieldErrors(prev => ({ ...prev, password: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {/* General Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Username Input */}
      <div className="mb-4">
        <Input
          type="text"
          label="Usuario"
          name="username"
          placeholder="Ingresa tu usuario"
          value={username}
          onChange={handleUsernameChange}
          error={fieldErrors.username}
          disabled={isLoading}
          required
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          }
        />
      </div>

      {/* Password Input */}
      <div className="mb-6">
        <Input
          type="password"
          label="Contraseña"
          name="password"
          placeholder="Ingresa tu contraseña"
          value={password}
          onChange={handlePasswordChange}
          error={fieldErrors.password}
          disabled={isLoading}
          required
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          }
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        disabled={isLoading}
        className="w-full"
      >
        Iniciar Sesión
      </Button>
    </form>
  );
};

export default LoginForm;
