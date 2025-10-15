# Products Feature

## Overview
The Products feature provides a complete interface for managing product inventory in the POS system. It includes search, filtering, sorting, pagination, and CRUD operations.

## Structure

```
src/features/products/
├── hooks/
│   └── useProducts.js          # React Query hook for products data
└── README.md                   # This file

src/components/products/
├── ProductTable.jsx            # Desktop table view
├── ProductCard.jsx             # Mobile card view
├── ProductFilters.jsx          # Search and filter controls
├── Pagination.jsx              # Pagination controls
├── EmptyState.jsx              # Empty state component
└── index.js                    # Component exports

src/pages/
└── ProductsPage.jsx            # Main products page
```

## Components

### useProducts Hook
Custom React Query hook for managing products data.

**Features:**
- Fetches products by company ID
- Automatic caching (5-minute stale time)
- Delete mutation with cache invalidation
- Loading and error states

**Usage:**
```javascript
import { useProducts } from '../features/products/hooks/useProducts';

const { products, isLoading, isError, error, deleteProduct, isDeleting } = useProducts();
```

**Returns:**
- `products`: Array of product objects
- `isLoading`: Boolean for initial load state
- `isError`: Boolean for error state
- `error`: Error object with user-friendly messages
- `deleteProduct`: Function to delete a product
- `isDeleting`: Boolean for delete operation state

### ProductTable
Desktop table view with sortable columns.

**Props:**
- `products`: Array of products to display
- `onEdit`: Function called when edit button is clicked
- `onDelete`: Function called when delete button is clicked
- `isDeleting`: Boolean for delete loading state

**Features:**
- Sortable columns (click header to sort)
- Visual indicators for low stock
- Status badges
- Action buttons (Edit, Delete)
- Hover effects

### ProductCard
Mobile-optimized card view.

**Props:**
- `product`: Product object to display
- `onEdit`: Function called when edit button is clicked
- `onDelete`: Function called when delete button is clicked
- `isDeleting`: Boolean for delete loading state

**Features:**
- Compact layout for mobile
- Product icon
- Status badge
- Price and stock display
- Low stock warning
- Action buttons

### ProductFilters
Search and filter controls.

**Props:**
- `searchTerm`: Current search value
- `onSearchChange`: Function called when search changes
- `statusFilter`: Current filter value ('all', 'active', 'inactive')
- `onStatusFilterChange`: Function called when filter changes

**Features:**
- Real-time search
- Status filter buttons
- Active state highlighting
- Responsive layout

### Pagination
Pagination controls for product list.

**Props:**
- `currentPage`: Current page number
- `totalPages`: Total number of pages
- `onPageChange`: Function called when page changes
- `totalItems`: Total number of items
- `itemsPerPage`: Items per page

**Features:**
- Smart page number display with ellipsis
- Previous/Next navigation
- Item range display
- Disabled states

### EmptyState
Empty state component for no products or no results.

**Props:**
- `hasFilters`: Boolean indicating if filters are active
- `onClearFilters`: Function to clear filters (when hasFilters is true)
- `onAddProduct`: Function to add product (when hasFilters is false)

**Features:**
- Two variants (no products / no results)
- Contextual messaging
- Action buttons

## ProductsPage

Main page component that integrates all product components.

**Features:**
- Header with title and add button
- Search and filter controls
- Responsive views (table/cards)
- Pagination
- Loading state
- Error state with retry
- Empty states
- Delete confirmation modal

**State Management:**
- `searchTerm`: Search query
- `statusFilter`: Active filter
- `currentPage`: Current page
- `productToDelete`: Product selected for deletion
- `showDeleteModal`: Modal visibility

**Computed State:**
- `filteredProducts`: Products after search and filter
- `paginatedProducts`: Current page of products
- `totalPages`: Total pages based on filtered products

## API Integration

### Endpoints

**GET** `/api/productos/por-empresa/:idEmpresa`
- Fetches all products for a company
- Requires authentication
- Returns array of product objects

**DELETE** `/api/productos/:id`
- Deletes a product by ID
- Requires authentication
- Returns success/error response

### Product Object Structure

```javascript
{
  id: number,
  codigo: string,
  nombre: string,
  descripcion: string | null,
  precio_venta: number,
  precio_compra: number,
  stock_actual: number,
  stock_minimo: number,
  activo: boolean,
  id_empresa: number,
  id_categoria: number | null,
  created_at: string,
  updated_at: string
}
```

## Usage Example

```javascript
import ProductsPage from './pages/ProductsPage';

// In your router
<Route path="/products" element={<ProductsPage />} />
```

## Features

### Search
- Searches across product name, code, and description
- Real-time filtering
- Case-insensitive
- Resets pagination to page 1

### Filter
- Filter by status (All, Active, Inactive)
- Visual indication of active filter
- Resets pagination to page 1

### Sort
- Click column headers to sort
- Toggle between ascending/descending
- Visual indicators (up/down arrows)
- Sortable columns: código, nombre, precio_venta, stock_actual

### Pagination
- 10 items per page
- Smart page number display
- Shows item range
- Previous/Next navigation

### Delete
- Confirmation modal before deletion
- Shows product details in confirmation
- Loading state during deletion
- Automatic cache refresh after deletion

### Responsive Design
- Desktop (≥768px): Table view
- Mobile (<768px): Card view
- Touch-friendly buttons
- Optimized layouts

## Styling

All components use Tailwind CSS classes and follow the design system defined in `src/styles/theme.js`.

**Color Scheme:**
- Primary: Blue (#3b82f6)
- Success: Green (#10b981)
- Danger: Red (#ef4444)
- Gray: Various shades for neutral elements

## Accessibility

- ARIA labels on icon-only buttons
- Keyboard navigation support
- Focus indicators
- Semantic HTML
- Screen reader friendly
- Error messages with proper roles

## Performance

- React Query caching (5-minute stale time)
- useMemo for expensive computations
- Pagination reduces DOM nodes
- Optimized re-renders
- Lazy loading ready

## Future Enhancements

1. **Add/Edit Forms**
   - Create product modal
   - Edit product modal
   - Form validation

2. **Bulk Operations**
   - Select multiple products
   - Bulk delete
   - Bulk status change

3. **Advanced Filters**
   - Filter by category
   - Filter by price range
   - Filter by stock level

4. **Export**
   - Export to CSV
   - Export to PDF
   - Print view

5. **Product Details**
   - Detailed product page
   - Stock history
   - Sales analytics

## Testing

### Manual Testing
1. Load page with products
2. Load page with no products
3. Search for products
4. Filter by status
5. Sort columns
6. Navigate pages
7. Delete product
8. Test on mobile
9. Test loading states
10. Test error states

### Edge Cases
- No products in database
- No products match filters
- Single page of products
- Products with missing fields
- Long product names
- Very low stock
- Inactive products

## Troubleshooting

**Products not loading:**
- Check authentication token
- Verify company ID in user data
- Check API endpoint availability
- Check browser console for errors

**Search not working:**
- Verify searchTerm state is updating
- Check filteredProducts computation
- Ensure product fields exist

**Pagination issues:**
- Verify totalPages calculation
- Check currentPage state
- Ensure paginatedProducts slice is correct

**Delete not working:**
- Check authentication
- Verify product ID
- Check API response
- Ensure cache invalidation

## Dependencies

- React 18+
- React Query (TanStack Query)
- React Icons
- Axios
- Zustand (for auth store)
- Tailwind CSS
