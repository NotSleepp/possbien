# Task 11 Testing Checklist

## Home Page - Welcome Message and Quick Actions

### Pre-Testing Setup
- [ ] Ensure backend is running
- [ ] Ensure frontend dev server is running
- [ ] Have test accounts ready (admin and employee)

---

## 1. Welcome Section Testing

### Visual Display
- [ ] Welcome banner displays with gradient background (blue-600 to blue-700)
- [ ] Greeting text is visible and readable (white text)
- [ ] User name appears correctly in greeting
- [ ] Role badge displays on the right side (desktop) or below (mobile)
- [ ] Role badge shows correct role name

### Dynamic Greeting
- [ ] Test before 12:00 PM - should show "Buenos días"
- [ ] Test between 12:00 PM - 6:00 PM - should show "Buenas tardes"
- [ ] Test after 6:00 PM - should show "Buenas noches"

### Responsive Behavior
- [ ] Desktop: Greeting and role badge side-by-side
- [ ] Mobile: Elements stack vertically
- [ ] Text remains readable at all screen sizes

---

## 2. Summary Statistics Testing

### Metric Cards Display
- [ ] Four metric cards display in a row (desktop)
- [ ] Cards show correct titles:
  - [ ] "Ventas de Hoy"
  - [ ] "Productos Vendidos"
  - [ ] "Productos en Stock"
  - [ ] "Clientes Atendidos"
- [ ] Each card shows a value
- [ ] Icons display correctly for each metric
- [ ] Colors are correct:
  - [ ] Green for sales
  - [ ] Blue for products sold
  - [ ] Purple for stock
  - [ ] Orange for customers

### Trend Indicators
- [ ] Trend badges display for applicable metrics
- [ ] Trend arrows point correctly (up/down)
- [ ] Trend percentages display
- [ ] "vs. ayer" subtitle shows where applicable

### Responsive Grid
- [ ] Mobile (< 640px): 1 column
- [ ] Tablet (640px - 1024px): 2 columns
- [ ] Desktop (> 1024px): 4 columns
- [ ] Cards maintain proper spacing at all sizes

---

## 3. Quick Actions Testing

### Card Display
- [ ] Quick action cards display in grid
- [ ] Each card shows:
  - [ ] Icon in colored background
  - [ ] Title
  - [ ] Description
  - [ ] Arrow icon (→)

### Available Actions
- [ ] Dashboard card displays (blue)
- [ ] Productos card displays (purple)
- [ ] Ventas card displays (green)
- [ ] Configuración card displays (orange) - **Admin only**

### Interaction
- [ ] Hover effect works (shadow increases, slight scale)
- [ ] Click navigates to correct page:
  - [ ] Dashboard → /dashboard
  - [ ] Productos → /products
  - [ ] Ventas → /sales
  - [ ] Configuración → /settings
- [ ] Focus state visible when tabbing with keyboard
- [ ] Cards are keyboard accessible (Enter key works)

### Responsive Grid
- [ ] Mobile (< 640px): 1 column
- [ ] Tablet (640px - 768px): 2 columns
- [ ] Desktop (768px - 1280px): 3 columns
- [ ] Large Desktop (> 1280px): 4 columns

---

## 4. Additional Information Cards Testing

### Consejos Rápidos (Quick Tips)
- [ ] Card displays with outlined variant
- [ ] Title "Consejos Rápidos" visible
- [ ] Icon (trending up) displays
- [ ] Three tips display with bullet points
- [ ] Blue dots visible before each tip
- [ ] Text is readable

### Información del Sistema (System Info)
- [ ] Card displays with outlined variant
- [ ] Title "Información del Sistema" visible
- [ ] Icon (settings) displays
- [ ] Three rows of information:
  - [ ] Empresa: Shows company ID or "N/A"
  - [ ] Sucursal: Shows branch ID or "N/A"
  - [ ] Usuario: Shows username
- [ ] Borders between rows visible
- [ ] Key-value pairs aligned properly

### Responsive Layout
- [ ] Mobile: Cards stack vertically
- [ ] Desktop: Cards side-by-side (2 columns)
- [ ] Equal height on desktop
- [ ] Proper spacing maintained

---

## 5. Role-Based Visibility Testing

### Admin User Testing
- [ ] Login as admin (Google OAuth or admin credentials)
- [ ] Navigate to home page
- [ ] Verify Settings quick action card is visible
- [ ] Verify role badge shows "Super Admin" or "Administrador"
- [ ] Click Settings card - should navigate to /settings

### Employee User Testing
- [ ] Login as employee (credentials)
- [ ] Navigate to home page
- [ ] Verify Settings quick action card is NOT visible
- [ ] Verify only 3 quick action cards show (Dashboard, Productos, Ventas)
- [ ] Verify role badge shows "Empleado"

---

## 6. Responsive Design Testing

### Mobile (< 640px)
- [ ] Welcome section stacks vertically
- [ ] Role badge below greeting
- [ ] Metric cards in single column
- [ ] Quick actions in single column
- [ ] Info cards stack vertically
- [ ] All text readable
- [ ] No horizontal scroll
- [ ] Touch targets adequate size

### Tablet (640px - 1024px)
- [ ] Welcome section side-by-side
- [ ] Metric cards in 2 columns
- [ ] Quick actions in 2 columns
- [ ] Info cards stack vertically
- [ ] Proper spacing maintained

### Desktop (> 1024px)
- [ ] Full layout displays correctly
- [ ] Metric cards in 4 columns
- [ ] Quick actions in 3-4 columns
- [ ] Info cards side-by-side
- [ ] Optimal use of space

---

## 7. Accessibility Testing

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Focus indicators visible
- [ ] Enter key activates quick action cards
- [ ] Tab order is logical
- [ ] No keyboard traps

### Screen Reader
- [ ] Page structure makes sense
- [ ] Headings announced correctly
- [ ] Card content readable
- [ ] Interactive elements identified
- [ ] Role information conveyed

### Color Contrast
- [ ] White text on blue gradient readable
- [ ] All text meets WCAG AA standards
- [ ] Icons visible and clear
- [ ] Trend indicators distinguishable

---

## 8. Data Display Testing

### User Data
- [ ] User name displays correctly (nombre or username)
- [ ] Company ID displays if available
- [ ] Branch ID displays if available
- [ ] Username displays in system info
- [ ] Fallback to "N/A" when data missing

### Mock Data
- [ ] Sales value displays: "$12,450"
- [ ] Products sold displays: "156"
- [ ] Stock displays: "1,234"
- [ ] Customers displays: "89"
- [ ] Trend percentages display correctly

---

## 9. Performance Testing

### Load Time
- [ ] Page loads quickly (< 1 second)
- [ ] No visible lag or jank
- [ ] Smooth transitions

### Interactions
- [ ] Hover effects smooth
- [ ] Navigation instant
- [ ] No delays in interactions

---

## 10. Cross-Browser Testing

### Chrome/Edge
- [ ] All features work
- [ ] Layout correct
- [ ] Interactions smooth

### Firefox
- [ ] All features work
- [ ] Layout correct
- [ ] Interactions smooth

### Safari
- [ ] All features work
- [ ] Layout correct
- [ ] Interactions smooth

### Mobile Browsers
- [ ] iOS Safari works correctly
- [ ] Android Chrome works correctly
- [ ] Touch interactions work

---

## 11. Edge Cases Testing

### Missing User Data
- [ ] Page works if user.nombre is null (falls back to username)
- [ ] Page works if user.id_empresa is null (shows "N/A")
- [ ] Page works if user.id_sucursal is null (shows "N/A")

### Different Roles
- [ ] Test with id_rol = 1 (Super Admin)
- [ ] Test with id_rol = 2 (Admin)
- [ ] Test with id_rol = 3+ (Employee)

### Time Changes
- [ ] Greeting updates when time crosses boundaries
- [ ] Page refresh shows correct greeting

---

## 12. Integration Testing

### Navigation Flow
- [ ] Login → Home page displays
- [ ] Home → Dashboard works
- [ ] Home → Products works
- [ ] Home → Settings works (admin only)
- [ ] Back button returns to home

### Auth State
- [ ] User data persists on page refresh
- [ ] Logout clears data and redirects
- [ ] Protected route works correctly

---

## Bug Tracking

### Issues Found
| Issue | Severity | Status | Notes |
|-------|----------|--------|-------|
|       |          |        |       |

---

## Sign-Off

### Tester Information
- **Tester Name**: _______________
- **Date**: _______________
- **Browser**: _______________
- **Device**: _______________

### Test Results
- [ ] All critical tests passed
- [ ] All high-priority tests passed
- [ ] All medium-priority tests passed
- [ ] All low-priority tests passed

### Overall Status
- [ ] ✅ PASSED - Ready for production
- [ ] ⚠️ PASSED WITH MINOR ISSUES - Can deploy with known issues
- [ ] ❌ FAILED - Needs fixes before deployment

### Notes
_Add any additional notes or observations here_

---

## Quick Test Script

For rapid testing, follow this sequence:

1. **Login as Admin**
   - Verify welcome message
   - Check all 4 quick actions visible
   - Click each quick action
   - Verify role badge shows admin

2. **Login as Employee**
   - Verify welcome message
   - Check only 3 quick actions visible (no Settings)
   - Click each quick action
   - Verify role badge shows employee

3. **Responsive Check**
   - Resize browser from mobile to desktop
   - Verify layout adapts correctly
   - Check all breakpoints

4. **Interaction Check**
   - Hover over quick action cards
   - Tab through with keyboard
   - Click to navigate

5. **Data Check**
   - Verify all metrics display
   - Check user info displays
   - Verify tips and system info show

**Expected Time**: 10-15 minutes per user role
