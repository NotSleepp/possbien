import PropTypes from 'prop-types';
import { Input, Button } from '../../../shared/components/ui';

/**
 * Formulario genérico para crear/editar configuraciones
 * Soporta diferentes tipos de campos y validación
 */
const ConfigurationForm = ({
  fields,
  values,
  onChange,
  onSubmit,
  isSubmitting,
  errors = {},
  submitLabel = 'Guardar',
  cancelLabel = 'Cancelar',
  onCancel,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const renderField = (field) => {
    const error = errors[field.name];
    const value = values[field.name] || '';

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.name} className="space-y-1">
            <label className="block text-sm font-medium text-base-content">
              {field.label}
              {field.required && <span className="text-error ml-1">*</span>}
            </label>
            <textarea
              name={field.name}
              value={value}
              onChange={(e) => onChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              disabled={field.disabled || isSubmitting}
              rows={field.rows || 3}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                error
                  ? 'border-error focus:ring-error'
                  : 'border-base-300 focus:ring-primary'
              } ${field.disabled || isSubmitting ? 'bg-base-200 cursor-not-allowed' : 'bg-base-100'}`}
            />
            {error && <p className="text-sm text-error">{error}</p>}
            {field.hint && !error && (
              <p className="text-sm text-base-content/60">{field.hint}</p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className="space-y-1">
            <label className="block text-sm font-medium text-base-content">
              {field.label}
              {field.required && <span className="text-error ml-1">*</span>}
            </label>
            <select
              name={field.name}
              value={value}
              onChange={(e) => onChange(field.name, e.target.value)}
              disabled={field.disabled || isSubmitting}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                error
                  ? 'border-error focus:ring-error'
                  : 'border-base-300 focus:ring-primary'
              } ${field.disabled || isSubmitting ? 'bg-base-200 cursor-not-allowed' : 'bg-base-100'}`}
            >
              <option value="">Seleccionar...</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {error && <p className="text-sm text-error">{error}</p>}
            {field.hint && !error && (
              <p className="text-sm text-base-content/60">{field.hint}</p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.name} className="flex items-center space-x-2">
            <input
              type="checkbox"
              name={field.name}
              checked={!!value}
              onChange={(e) => onChange(field.name, e.target.checked)}
              disabled={field.disabled || isSubmitting}
              className="w-4 h-4 text-primary border-base-300 rounded focus:ring-primary"
            />
            <label className="text-sm font-medium text-base-content">
              {field.label}
            </label>
            {field.hint && (
              <span className="text-sm text-base-content/60">({field.hint})</span>
            )}
          </div>
        );

      default:
        return (
          <Input
            key={field.name}
            label={field.label}
            value={value}
            onChange={(v) => onChange(field.name, v)}
            type={field.type || 'text'}
            placeholder={field.placeholder}
            required={field.required}
            disabled={field.disabled || isSubmitting}
            error={error}
            hint={field.hint}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => renderField(field))}

      <div className="flex justify-end gap-2 pt-4 border-t border-base-300">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {cancelLabel}
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Guardando...' : submitLabel}
        </Button>
      </div>
    </form>
  );
};

ConfigurationForm.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['text', 'email', 'number', 'password', 'textarea', 'select', 'checkbox']),
      placeholder: PropTypes.string,
      required: PropTypes.bool,
      disabled: PropTypes.bool,
      hint: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
          label: PropTypes.string.isRequired,
        })
      ),
      rows: PropTypes.number,
    })
  ).isRequired,
  values: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
  errors: PropTypes.object,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  onCancel: PropTypes.func,
};

export default ConfigurationForm;
