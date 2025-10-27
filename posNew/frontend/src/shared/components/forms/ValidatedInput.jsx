import React, { useState, useEffect } from 'react';
import { Input } from '../ui/Input';

/**
 * Componente de input con validación en tiempo real usando Zod
 * 
 * @param {Object} props
 * @param {string} props.name - Nombre del campo
 * @param {*} props.value - Valor actual del campo
 * @param {Function} props.onChange - Función para manejar cambios
 * @param {Function} props.onBlur - Función para manejar pérdida de foco
 * @param {Object} props.schema - Esquema Zod para validar el campo
 * @param {string} props.label - Etiqueta del campo
 * @param {string} props.type - Tipo de input (text, email, password, etc.)
 * @param {string} props.error - Error externo (del servidor o formulario)
 * @param {boolean} props.required - Si el campo es requerido
 * @param {string} props.placeholder - Placeholder del input
 * @param {boolean} props.disabled - Si el input está deshabilitado
 * @param {string} props.className - Clases CSS adicionales
 * 
 * @example
 * <ValidatedInput
 *   name="email"
 *   value={formData.email}
 *   onChange={handleChange}
 *   schema={z.object({ email: z.string().email() })}
 *   label="Correo Electrónico"
 *   type="email"
 *   required
 * />
 */
export const ValidatedInput = ({ 
  name, 
  value, 
  onChange, 
  onBlur,
  schema, 
  label, 
  type = 'text',
  error: externalError,
  required = false,
  placeholder,
  disabled = false,
  className = '',
  ...props 
}) => {
  const [internalError, setInternalError] = useState('');
  const [touched, setTouched] = useState(false);
  
  // Usar error externo si existe, sino usar error interno
  const displayError = externalError || internalError;
  
  // Validar campo cuando cambia el valor y ya fue tocado
  useEffect(() => {
    if (touched && value !== undefined && schema && !externalError) {
      validateField();
    }
  }, [value, touched]);
  
  // Limpiar error interno cuando hay error externo
  useEffect(() => {
    if (externalError) {
      setInternalError('');
    }
  }, [externalError]);
  
  /**
   * Valida el campo usando el esquema Zod
   */
  const validateField = () => {
    if (!schema) return;
    
    try {
      // Validar solo este campo
      schema.parse({ [name]: value });
      setInternalError('');
    } catch (err) {
      // Extraer el primer error para este campo
      if (err.errors && err.errors[0]) {
        setInternalError(err.errors[0].message);
      }
    }
  };
  
  /**
   * Maneja la pérdida de foco del input
   */
  const handleBlur = (e) => {
    setTouched(true);
    validateField();
    if (onBlur) onBlur(e);
  };
  
  /**
   * Maneja el cambio de valor del input
   */
  const handleChange = (e) => {
    // Si había un error y el usuario está corrigiendo, limpiar el error
    if (displayError && touched) {
      setInternalError('');
    }
    onChange(e);
  };
  
  return (
    <div className={`form-field ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Input
        id={name}
        name={name}
        type={type}
        value={value || ''}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={displayError ? 'border-red-500' : ''}
        aria-invalid={!!displayError}
        aria-describedby={displayError ? `${name}-error` : undefined}
        {...props}
      />
      {displayError && (
        <span 
          id={`${name}-error`}
          className="error-message text-red-500 text-sm mt-1 block"
          role="alert"
        >
          {displayError}
        </span>
      )}
    </div>
  );
};
