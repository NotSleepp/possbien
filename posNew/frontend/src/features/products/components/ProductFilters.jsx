import { FiSearch, FiFilter } from "react-icons/fi";
import { Input, Button } from "../../../shared/components/ui";

/**
 * ProductFilters Component
 * Search and filter controls for products
 */
const ProductFilters = ({ searchTerm, onSearchChange, statusFilter, onStatusFilterChange }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Search Input */}
      <div className="flex-1">
        <Input
          type="text"
          placeholder="Buscar por nombre o código..."
          value={searchTerm}
          onChange={onSearchChange}
          icon={<FiSearch />}
        />
      </div>

      {/* Status Filter */}
      <div className="flex gap-2">
        <Button
          variant={statusFilter === 'all' ? 'primary' : 'ghost'}
          size="md"
          onClick={() => onStatusFilterChange('all')}
          icon={<FiFilter />}
        >
          Todos
        </Button>
        <Button
          variant={statusFilter === 'active' ? 'primary' : 'ghost'}
          size="md"
          onClick={() => onStatusFilterChange('active')}
        >
          Activos
        </Button>
        <Button
          variant={statusFilter === 'inactive' ? 'primary' : 'ghost'}
          size="md"
          onClick={() => onStatusFilterChange('inactive')}
        >
          Inactivos
        </Button>
      </div>
    </div>
  );
};

export default ProductFilters;
