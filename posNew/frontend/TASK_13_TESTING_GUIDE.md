# Task 13: Error Handling - Testing Guide

## Quick Testing Instructions

### 1. Test ErrorBoundary

Create a test component that throws an error:

**Option A: Create a temporary test component**
```jsx
// In any page, temporarily add:
const TestError = () => {
  throw new Error('Test error boundary');
};

// Then render it:
<TestError />
```

**Option B: Use browser console**
```javascript
// In browser console, force a React error
throw new Error('Test error');
```

**Expected Result:**
- Error boundary fallback UI appears
- Shows "¡Algo salió mal!" message
- In dev mode: shows error details
- Buttons work: "Recargar Página", "Intentar de Nuevo", "Ir al Inicio"

---

### 2. Test 404 Not Found Page

**Steps:**
1. Start the dev server: `npm run dev`
2. Navigate to a non-existent route:
   - `http://localhost:5173/this-does-not-exist`
   - `http://localhost:5173/random-page`
   - `http://localhost:5173/xyz123`

**Expected Result:**
- 404 page displays with large "404" number
- Sad face icon shows
- Message: "Página No Encontrada"
- Buttons work: "Ir al Inicio", "Volver Atrás"

---

### 3. Test 403 Access Denied Page

**Steps:**
1. Login as a non-admin user (employee)
2. Try to access an admin-only route:
   - Navigate to `http://localhost:5173/settings`

**Expected Result:**
- AccessDenied component displays
- Shows large "403" number
- Lock icon appears
- Message: "Acceso Denegado"
- Buttons work: "Ir al Inicio", "Volver Atrás"

**Alternative Test:**
- Login as admin
- Logout
- Try to access `/settings` without authentication
- Should redirect to login first

---

### 4. Test Generic Error Page

**Steps:**
1. Temporarily modify a route to throw an error:

```jsx
// In routes/index.jsx, add a test route:
{
  path: '/test-error',
  element: <div>{(() => { throw new Error('Test route error'); })()}</div>,
  errorElement: <ErrorPage />,
}
```

2. Navigate to `http://localhost:5173/test-error`

**Expected Result:**
- ErrorPage displays
- Shows appropriate icon and message
- In dev mode: shows error details
- Buttons work: "Ir al Inicio", "Volver Atrás", "Recargar Página"

---

### 5. Test Responsive Design

**Steps:**
1. Open any error page (404, 403, or error boundary)
2. Open browser DevTools (F12)
3. Toggle device toolbar (Ctrl+Shift+M)
4. Test different screen sizes:
   - Mobile: 375px
   - Tablet: 768px
   - Desktop: 1920px

**Expected Result:**
- Layout adapts to screen size
- Buttons stack vertically on mobile
- Text remains readable
- Icons scale appropriately
- No horizontal scrolling

---

### 6. Test Navigation Buttons

For each error page, test all buttons:

**"Ir al Inicio" button:**
- Should navigate to `/` (home page)
- Should work from any error page

**"Volver Atrás" button:**
- Should go back in browser history
- Should work correctly

**"Recargar Página" button (ErrorBoundary):**
- Should reload the current page
- Should clear error state

**"Intentar de Nuevo" button (ErrorBoundary):**
- Should reset error state
- Should attempt to re-render component

---

### 7. Test Development vs Production Mode

**Development Mode:**
```bash
npm run dev
```
- Trigger any error
- Verify error details are visible
- Check console for error logs

**Production Build:**
```bash
npm run build
npm run preview
```
- Trigger any error
- Verify error details are hidden
- Only user-friendly messages show

---

## Automated Testing (Optional)

If you want to write tests:

### Test ErrorBoundary
```jsx
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

const ThrowError = () => {
  throw new Error('Test error');
};

test('catches errors and displays fallback', () => {
  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  );
  
  expect(screen.getByText(/algo salió mal/i)).toBeInTheDocument();
});
```

### Test NotFoundPage
```jsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotFoundPage from './NotFoundPage';

test('renders 404 page', () => {
  render(
    <BrowserRouter>
      <NotFoundPage />
    </BrowserRouter>
  );
  
  expect(screen.getByText('404')).toBeInTheDocument();
  expect(screen.getByText(/página no encontrada/i)).toBeInTheDocument();
});
```

---

## Common Issues and Solutions

### Issue 1: ErrorBoundary not catching errors
**Solution:** ErrorBoundary only catches errors in child components during rendering. Event handler errors need try-catch.

### Issue 2: 404 page not showing
**Solution:** Make sure the catch-all route (`path: '*'`) is at the end of your routes array.

### Issue 3: Error details showing in production
**Solution:** Check that `import.meta.env.DEV` is correctly detecting the environment.

### Issue 4: Buttons not working
**Solution:** Check that React Router is properly configured and navigation functions are available.

---

## Visual Checklist

For each error page, verify:

- [ ] Large error code displays correctly (404, 403)
- [ ] Icon is centered and properly sized
- [ ] Icon has correct background color
- [ ] Title is bold and prominent
- [ ] Message text is readable and clear
- [ ] Buttons are properly styled
- [ ] Button hover states work
- [ ] Layout is centered on page
- [ ] Background color is gray-50
- [ ] Help text section is separated by border
- [ ] All text is in Spanish
- [ ] Spacing is consistent

---

## Browser Compatibility

Test in these browsers:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## Accessibility Testing

- [ ] Tab through all buttons (keyboard navigation)
- [ ] Verify focus indicators are visible
- [ ] Test with screen reader (NVDA, JAWS, or VoiceOver)
- [ ] Check color contrast ratios
- [ ] Verify semantic HTML structure
- [ ] Test with keyboard only (no mouse)

---

## Performance Testing

- [ ] Error pages load quickly
- [ ] No unnecessary re-renders
- [ ] Images/icons load properly
- [ ] No console errors or warnings

---

## Integration Testing

Test error handling in context:

1. **Login Flow**
   - Try invalid credentials → should show error message
   - Try accessing protected route → should redirect to login

2. **Navigation Flow**
   - Navigate to valid page → works
   - Navigate to invalid page → 404
   - Navigate to restricted page → 403

3. **API Errors**
   - Simulate 401 error → should logout and redirect
   - Simulate 403 error → should show error message
   - Simulate 500 error → should show error message

---

## Sign-off Checklist

Before marking task as complete:

- [ ] All error components created
- [ ] ErrorBoundary wraps App
- [ ] Routes have errorElement configured
- [ ] 404 catch-all route added
- [ ] All error pages tested manually
- [ ] Responsive design verified
- [ ] Navigation buttons work
- [ ] Dev/prod modes tested
- [ ] No console errors
- [ ] Documentation created
- [ ] Code has no linting errors

---

## Quick Test Script

Run these commands in sequence:

```bash
# 1. Start dev server
npm run dev

# 2. Test 404
# Navigate to: http://localhost:5173/does-not-exist

# 3. Test 403 (if logged in as non-admin)
# Navigate to: http://localhost:5173/settings

# 4. Test ErrorBoundary
# Add a component that throws an error

# 5. Build and test production
npm run build
npm run preview
# Repeat tests above
```

---

## Success Criteria

Task 13 is complete when:

✅ ErrorBoundary catches and displays React errors
✅ 404 page shows for unknown routes
✅ 403 page shows for unauthorized access
✅ Generic error page handles routing errors
✅ All navigation buttons work correctly
✅ Responsive design works on all screen sizes
✅ Error details show in dev, hidden in prod
✅ All pages follow design system
✅ No console errors or warnings
✅ Documentation is complete

---

## Next Steps

After testing is complete:
1. Mark task 13 as complete
2. Commit changes with descriptive message
3. Move to next task in the implementation plan
4. Consider adding error tracking service (future enhancement)
