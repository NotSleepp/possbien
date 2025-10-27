import PropTypes from 'prop-types';
import { Button, LoadingSpinner } from '../../../shared/components/ui';

/**
 * Tabla reutilizable para mostrar listados de configuración
 * Incluye columnas configurables, acciones y estados de carga
 */
const ConfigurationTable = ({
  columns,
  data,
  isLoading,
  onEdit,
  onDelete,
  emptyMessage = 'No hay registros para mostrar',
  actions = true,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-base-300 mb-4">
          <svg
            className="w-8 h-8 text-base-content/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <p className="text-base-content/60 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-base-300">
        <thead className="bg-base-100">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-left text-sm font-semibold text-base-content"
              >
                {column.label}
              </th>
            ))}
            {actions && (
              <th className="px-4 py-3 text-right text-sm font-semibold text-base-content">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-base-100 divide-y divide-base-300">
          {data.map((item, index) => (
            <tr
              key={item.id || index}
              className="hover:bg-base-200 transition-colors"
            >
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 text-sm text-base-content">
                  {column.render
                    ? column.render(item[column.key], item)
                    : item[column.key] || '-'}
                </td>
              ))}
              {actions && (
                <td className="px-4 py-3 text-right space-x-2">
                  {onEdit && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onEdit(item)}
                      aria-label={`Editar ${item.nombre || item.codigo || 'registro'}`}
                    >
                      Editar
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onDelete(item)}
                      aria-label={`Eliminar ${item.nombre || item.codigo || 'registro'}`}
                    >
                      Eliminar
                    </Button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

ConfigurationTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      render: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.array,
  isLoading: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  emptyMessage: PropTypes.string,
  actions: PropTypes.bool,
};

export default ConfigurationTable;
