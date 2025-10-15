# Task 10: Products Page - Testing Checklist

## Pre-Testing Setup
- [ ] Backend server is running on http://localhost:3000
- [ ] Frontend server is running
- [ ] User is authenticated (logged in)
- [ ] Database has some test products

## Basic Functionality

### Page Load
- [ ] Page loads without errors
- [ ] Loading spinner appears during initial load
- [ ] Products display after loading completes
- [ ] Header shows "Productos" title and description
- [ ] "Agregar Producto" button is visible (if products exist)

### Product Display - Desktop (≥768px)
- [ ] Products display in table format
- [ ] All columns are visible (Código, Nombre, Precio, Stock, Estado, Acciones)
- [ ] Product data is correctly formatted
- [ ] Prices show 2 decimal places
- [ ] Status badges show correct colors (green for active, red for inactive)
- [ ] Low stock items show red text
- [ ] Table rows have hover effect

### Product Display - Mobile (<768px)
- [ ] Products display in card format
- [ ] Cards show product icon
- [ ] Product name and code are visible
- [ ] Status badge is displayed
- [ ] Price and stock are shown side by side
- [ ] Action buttons are full width
- [ ] Cards have proper spacing

## Search Functionality
- [ ] Search input is visible
- [ ] Search icon is displayed
- [ ] Typing in search filters products in real-time
- [ ] Search works for product name
- [ ] Search works for product code
- [ ] Search works for product description
- [ ] Search is case-insensitive
- [ ] Search resets pagination to page 1
- [ ] Clearing search shows all products again

## Filter Functionality
- [ ] Filter buttons are visible (Todos, Activos, Inactivos)
- [ ] "Todos" is selected by default
- [ ] Clicking "Activos" shows only active products
- [ ] Clicking "Inactivos" shows only inactive products
- [ ] Active filter button is highlighted
- [ ] Filter resets pagination to page 1
- [ ] Filter works in combination with search

## Sort Functionality (Desktop Only)
- [ ] Column headers are clickable
- [ ] Clicking header sorts ascending first
- [ ] Clicking same header again sorts descending
- [ ] Sort icon shows current direction
- [ ] Sorting works for Código column
- [ ] Sorting works for Nombre column
- [ ] Sorting works for Precio column
- [ ] Sorting works for Stock column
- [ ] Sorting persists when changing pages

## Pagination
- [ ] Pagination controls appear when more than 10 products
- [ ] Current page is highlighted
- [ ] "Previous" button is disabled on first page
- [ ] "Next" button is disabled on last page
- [ ] Clicking page number navigates to that page
- [ ] Item range text is correct (e.g., "Showing 1 to 10 of 45")
- [ ] Ellipsis appears for large page counts
- [ ] Pagination updates when filters change

## Delete Functionality
- [ ] Clicking delete button opens confirmation modal
- [ ] Modal shows product name and code
- [ ] Modal shows warning message
- [ ] "Cancelar" button closes modal without deleting
- [ ] "Eliminar" button deletes the product
- [ ] Loading spinner appears on delete button during deletion
- [ ] Modal closes after successful deletion
- [ ] Product list refreshes after deletion
- [ ] Error message appears if deletion fails

## Edit Functionality (Placeholder)
- [ ] Clicking edit button shows alert (placeholder)
- [ ] Alert message indicates feature is pending

## Add Product Functionality (Placeholder)
- [ ] "Agregar Producto" button is visible
- [ ] Clicking button shows alert (placeholder)
- [ ] Alert message indicates feature is pending

## Empty States

### No Products at All
- [ ] Empty state appears when no products exist
- [ ] Package icon is displayed
- [ ] "No hay productos registrados" message shows
- [ ] "Agregar Producto" button is displayed
- [ ] No search/filter controls are shown

### No Results from Filters
- [ ] Empty state appears when filters return no results
- [ ] Package icon is displayed
- [ ] "No se encontraron productos" message shows
- [ ] "Limpiar filtros" button is displayed
- [ ] Clicking "Limpiar filtros" resets search and filters

## Loading States
- [ ] Full-page spinner appears on initial load
- [ ] Delete button shows spinner during deletion
- [ ] Page is not interactive during loading
- [ ] Loading text is accessible to screen readers

## Error States
- [ ] Error message appears if API fails
- [ ] Error icon is displayed
- [ ] User-friendly error message is shown
- [ ] "Reintentar" button is available
- [ ] Clicking "Reintentar" reloads the page

## Responsive Design

### Desktop (≥1024px)
- [ ] Table view is displayed
- [ ] All columns are visible
- [ ] Filters are in a single row
- [ ] Pagination is properly aligned
- [ ] Layout is not cramped

### Tablet (768px - 1023px)
- [ ] Table view is displayed
- [ ] Columns may wrap if needed
- [ ] Filters may stack
- [ ] Touch targets are adequate

### Mobile (<768px)
- [ ] Card view is displayed
- [ ] Cards stack vertically
- [ ] Filters stack vertically
- [ ] Buttons are full width
- [ ] Text is readable
- [ ] Touch targets are large enough

## Accessibility

### Keyboard Navigation
- [ ] Tab key navigates through interactive elements
- [ ] Enter key activates buttons
- [ ] Escape key closes modal
- [ ] Focus indicators are visible
- [ ] Tab order is logical

### Screen Reader
- [ ] Page title is announced
- [ ] Button labels are descriptive
- [ ] Loading states are announced
- [ ] Error messages are announced
- [ ] Table structure is properly announced

### Visual
- [ ] Text has sufficient contrast
- [ ] Focus indicators are visible
- [ ] Icons have text alternatives
- [ ] Color is not the only indicator

## Performance
- [ ] Page loads quickly
- [ ] Search is responsive (no lag)
- [ ] Sorting is instant
- [ ] Pagination is smooth
- [ ] No memory leaks (check DevTools)
- [ ] No unnecessary re-renders

## Edge Cases

### Data Edge Cases
- [ ] Products with null/undefined fields display correctly
- [ ] Very long product names are handled (truncation)
- [ ] Very long descriptions are handled
- [ ] Products with 0 stock display correctly
- [ ] Products with negative stock display correctly
- [ ] Products with very high prices display correctly

### Interaction Edge Cases
- [ ] Rapid clicking on buttons doesn't cause issues
- [ ] Changing filters while loading works correctly
- [ ] Deleting last product on a page works correctly
- [ ] Searching while on page 2+ resets to page 1
- [ ] Modal can be closed by clicking backdrop
- [ ] Modal can be closed by pressing Escape

### Network Edge Cases
- [ ] Slow network shows loading state
- [ ] Network error shows error state
- [ ] Retry after error works
- [ ] Token expiration redirects to login

## Browser Compatibility
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge
- [ ] Works on iOS Safari
- [ ] Works on Android Chrome

## Integration with Other Features
- [ ] Authentication token is included in requests
- [ ] Company ID is correctly used from auth store
- [ ] Logout works from products page
- [ ] Navigation to other pages works
- [ ] Back button works correctly

## Console Checks
- [ ] No errors in browser console
- [ ] No warnings in browser console
- [ ] API requests are successful (check Network tab)
- [ ] No 404 errors for resources
- [ ] No CORS errors

## Final Checks
- [ ] All features work as expected
- [ ] UI matches design specifications
- [ ] Code is clean and well-documented
- [ ] No TODO comments left unresolved
- [ ] Performance is acceptable
- [ ] User experience is smooth

## Notes
- Document any issues found during testing
- Note any browser-specific issues
- Record any performance concerns
- List any suggested improvements
