import { useState, useRef } from 'prop-types';
import PropTypes from 'prop-types';
import { Button } from '../ui';

/**
 * Componente para carga de imágenes con preview
 * Soporta drag & drop y validación de tamaño/tipo
 */
const ImageUpload = ({
  value,
  onChange,
  label = 'Imagen',
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB por defecto
  preview = true,
  disabled = false,
  error,
  hint,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      onChange(null, 'El archivo debe ser una imagen');
      return;
    }

    // Validar tamaño
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
      onChange(null, `La imagen no debe superar ${maxSizeMB}MB`);
      return;
    }

    // Crear URL para preview
    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result, null);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleRemove = () => {
    onChange(null, null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-base-content">
          {label}
        </label>
      )}

      <div
        className={`relative border-2 border-dashed rounded-lg transition-colors ${
          dragActive
            ? 'border-primary bg-primary/5'
            : error
            ? 'border-error'
            : 'border-base-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!disabled ? handleClick : undefined}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />

        {value && preview ? (
          <div className="relative p-4">
            <img
              src={value}
              alt="Preview"
              className="max-h-48 mx-auto rounded-lg object-contain"
            />
            {!disabled && (
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="absolute top-2 right-2"
              >
                Eliminar
              </Button>
            )}
          </div>
        ) : (
          <div className="p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-base-content/40"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="mt-2 text-sm text-base-content/60">
              Arrastra una imagen aquí o haz clic para seleccionar
            </p>
            <p className="mt-1 text-xs text-base-content/40">
              PNG, JPG, GIF hasta {(maxSize / (1024 * 1024)).toFixed(0)}MB
            </p>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-error">{error}</p>}
      {hint && !error && <p className="text-sm text-base-content/60">{hint}</p>}
    </div>
  );
};

ImageUpload.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  accept: PropTypes.string,
  maxSize: PropTypes.number,
  preview: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  hint: PropTypes.string,
};

export default ImageUpload;
