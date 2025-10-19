import { FiPackage, FiPlus } from 'react-icons/fi';
import { Button } from '../../../shared/components/ui';

/**
 * EmptyState Component
 * Displays when no products are found or available
 */
const EmptyState = ({ 
  title = "No products found", 
  description = "Get started by adding your first product to the inventory.",
  showAddButton = true,
  onAddClick 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <FiPackage className="w-8 h-8 text-gray-400" />
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-500 mb-6 max-w-sm">
        {description}
      </p>
      
      {showAddButton && onAddClick && (
        <Button 
          onClick={onAddClick}
          className="inline-flex items-center gap-2"
        >
          <FiPlus className="w-4 h-4" />
          Add Product
        </Button>
      )}
    </div>
  );
};

export default EmptyState;