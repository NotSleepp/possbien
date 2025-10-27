import PropTypes from 'prop-types';

/**
 * Layout compartido para todas las páginas de configuración
 * Proporciona estructura consistente con header, descripción y área de acciones
 */
const ConfigurationLayout = ({ title, description, actions, children, breadcrumbs }) => {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-4 text-sm">
            <ol className="flex items-center space-x-2 text-base-content/60">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && <span className="mx-2">/</span>}
                  {crumb.href ? (
                    <a 
                      href={crumb.href} 
                      className="hover:text-primary transition-colors"
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="text-base-content">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-base-content">{title}</h1>
            {description && (
              <p className="text-base-content/60 mt-2">{description}</p>
            )}
          </div>
          
          {/* Actions */}
          {actions && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {actions}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
};

ConfigurationLayout.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  actions: PropTypes.node,
  children: PropTypes.node.isRequired,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
    })
  ),
};

export default ConfigurationLayout;
