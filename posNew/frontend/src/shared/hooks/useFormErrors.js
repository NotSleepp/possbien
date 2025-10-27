import { useState, useCallback } from 'react';
import { getValidationErrors } from '../../utils/errorHandler';

/**
 * Hook personalizado para manejar errores de formularios
 * Proporciona funciones para establecer, limpiar y procesar errores de API
 */
export const useFormErrors = () => {
  const [errors, setErrors] = useState({});

  /**
   * Establece un error para un campo específico
   * @param {string} field - Nombre del campo
   * @param {string} message - Mensaje de error
   */
  const setFieldError = useCallback((field, message) => {
    setErrors((prev) => ({
      ...prev,
      [field]: message,
    }));
  }, []);

  /**
   * Limpia el error de un campo específico
   * @param {string} field - Nombre del campo
   */
  const clearFieldError = useCallback((field) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  /**
   * Limpia todos los errores
   */
  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * Procesa errores del backend y los establece en el estado
   * Utiliza la función getValidationErrors para extraer errores estructurados
   * @param {Object} error - Error del backend
   */
  const setApiErrors = useCallback((error) => {
    const validationErrors = getValidationErrors(error);
    setErrors(validationErrors);
  }, []);

  /**
   * Establece múltiples errores a la vez
   * @param {Object} errorObject - Objeto con errores por campo
   */
  const setMultipleErrors = useCallback((errorObject) => {
    setErrors(errorObject);
  }, []);

  /**
   * Verifica si hay algún error
   * @returns {boolean}
   */
  const hasErrors = useCallback(() => {
    return Object.keys(errors).length > 0;
  }, [errors]);

  /**
   * Obtiene el error de un campo específico
   * @param {string} field - Nombre del campo
   * @returns {string|undefined}
   */
  const getFieldError = useCallback(
    (field) => {
      return errors[field];
    },
    [errors]
  );

  return {
    errors,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    setApiErrors,
    setMultipleErrors,
    hasErrors,
    getFieldError,
  };
};

export default useFormErrors;
