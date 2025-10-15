# Sidebar Testing Guide

## Manual Testing Checklist

### 1. Icon Display
- [ ] All menu items display appropriate icons
- [ ] Icons are properly aligned with text
- [ ] Icons are visible and clear

### 2. Active Route Indicator
- [ ] Navigate to Home - verify it's highlighted
- [ ] Navigate to Dashboard - verify it's highlighted
- [ ] Navigate to Products - verify it's highlighted
- [ ] Only one route should be highlighted at a time
- [ ] Active route has blue background and shadow

### 3. User Information Display
- [ ] User avatar displays correct initial
- [ ] User name is displayed correctly
- [ ] User email/username is displayed
- [ ] User role badge shows correct role in Spanish
- [ ] Information is properly truncated if too long

### 4. Mobile Responsive Behavior
**Desktop (width >= 768px):**
- [ ] Sidebar is always visible
- [ ] Sidebar is fixed on the left side
- [ ] No close button visible
- [ ] No hamburger menu button visible

**Mobile (width < 768px):**
- [ ] Sidebar is hidden by default
- [ ] Hamburger menu button is visible in top-left
- [ ] Clicking hamburger opens sidebar as overlay
- [ ] Close button (X) is visible in sidebar
- [ ] Clicking close button closes sidebar
- [ ] Clicking outside sidebar closes it
- [ ] Clicking a menu item closes sidebar
- [ ] Dark overlay appears behind sidebar when open

### 5. Logout Confirmation
- [ ] Clicking logout button opens modal
- [ ] Modal displays confirmation message
- [ ] Modal has "Cancelar" and "Cerrar Sesión" buttons
- [ ] Clicking "Cancelar" closes modal without logging out
- [ ] Clicking "Cerrar Sesión" logs out and redirects to login
- [ ] Pressing ESC key closes modal
- [ ] Clicking outside modal closes it

### 6. Role-Based Menu Visibility

**Test with Super Admin (id_rol: 1):**
- [ ] All menu items visible (Home, Dashboard, Productos, Ventas, Reportes, Usuarios, Configuración)

**Test with Admin (id_rol: 2):**
- [ ] All menu items visible except none (same as Super Admin)

**Test with Manager (id_rol: 3):**
- [ ] Visible: Home, Dashboard, Productos, Ventas, Reportes
- [ ] Hidden: Usuarios, Configuración

**Test with Cashier (id_rol: 4):**
- [ ] Visible: Home, Dashboard, Productos, Ventas
- [ ] Hidden: Reportes, Usuarios, Configuración

**Test with Employee (id_rol: 5):**
- [ ] Visible: Home, Dashboard, Productos, Ventas
- [ ] Hidden: Reportes, Usuarios, Configuración

### 7. Navigation Functionality
- [ ] Clicking Home navigates to "/"
- [ ] Clicking Dashboard navigates to "/dashboard"
- [ ] Clicking Productos navigates to "/products"
- [ ] Clicking Ventas navigates to "/sales"
- [ ] Clicking Reportes navigates to "/reports"
- [ ] Clicking Usuarios navigates to "/users"
- [ ] Clicking Configuración navigates to "/settings"
- [ ] URL updates correctly on navigation
- [ ] Browser back/forward buttons work correctly

### 8. Visual Polish
- [ ] Hover effects work on all menu items
- [ ] Transitions are smooth
- [ ] Colors match design system
- [ ] Spacing is consistent
- [ ] Text is readable
- [ ] No visual glitches or overlaps

### 9. Accessibility
- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical
- [ ] Focus indicators are visible
- [ ] ARIA labels are present
- [ ] Screen reader announces menu items correctly

### 10. Edge Cases
- [ ] Very long user names are truncated properly
- [ ] Very long email addresses are truncated properly
- [ ] User with no name/email displays username
- [ ] Sidebar works with different screen sizes
- [ ] Rapid clicking doesn't break functionality
- [ ] Multiple logout attempts don't cause errors

## Automated Testing Scenarios

### Unit Tests
```javascript
// Test role-based filtering
test('filters menu items based on user role', () => {
  // Test with different roles
});

// Test logout confirmation
test('shows confirmation modal before logout', () => {
  // Click logout, verify modal appears
});

// Test active route highlighting
test('highlights active route', () => {
  // Navigate to route, verify highlight
});
```

### Integration Tests
```javascript
// Test complete navigation flow
test('navigates through all menu items', () => {
  // Click each menu item, verify navigation
});

// Test mobile drawer behavior
test('opens and closes sidebar on mobile', () => {
  // Test hamburger, close button, overlay click
});

// Test logout flow
test('logs out user and redirects to login', () => {
  // Complete logout flow
});
```

## Browser Compatibility Testing

Test in the following browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Performance Testing

- [ ] Sidebar renders quickly (< 100ms)
- [ ] No layout shifts during render
- [ ] Smooth animations (60fps)
- [ ] No memory leaks on repeated open/close
- [ ] Icons load without delay

## Known Issues / Limitations

1. **Sales, Reports, and Users pages**: These routes are defined in the sidebar but may not have corresponding page components yet. They will need to be created in future tasks.

2. **Role definitions**: The role IDs (1-5) are hardcoded. Consider moving to constants file for better maintainability.

3. **Internationalization**: All text is in Spanish. Future enhancement could add i18n support.

## Testing with Different User Roles

To test different roles, you can temporarily modify the user object in the auth store or create test users with different roles in the backend.

Example test users:
- Super Admin: id_rol = 1
- Admin: id_rol = 2
- Manager: id_rol = 3
- Cashier: id_rol = 4
- Employee: id_rol = 5
