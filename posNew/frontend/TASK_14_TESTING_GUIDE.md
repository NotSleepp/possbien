# Task 14: Toast Notification System - Testing Guide

## Quick Start Testing

### Prerequisites
1. Backend server running on `http://localhost:3000`
2. Frontend development server running
3. Test user credentials available
4. Google OAuth configured (for OAuth testing)

## Manual Testing Scenarios

### 1. Success Toast - Credential Login

**Steps:**
1. Navigate to `/login`
2. Enter valid employee credentials
3. Click "Iniciar Sesión"

**Expected Result:**
- ✅ Green success toast appears in top-right corner
- ✅ Message: "¡Inicio de sesión exitoso! Bienvenido."
- ✅ Toast auto-dismisses after 5 seconds
- ✅ User is redirected to home page
- ✅ Toast has checkmark icon

**Visual Check:**
- Green background (green-50)
- Green left border (green-500)
- Green text (green-800)
- Smooth slide-in animation from right

---

### 2. Error Toast - Invalid Credentials

**Steps:**
1. Navigate to `/login`
2. Enter invalid username or password
3. Click "Iniciar Sesión"

**Expected Result:**
- ✅ Red error toast appears in top-right corner
- ✅ Message: "Usuario o contraseña incorrectos. Por favor, verifica tus credenciales."
- ✅ Toast auto-dismisses after 5 seconds
- ✅ User remains on login page
- ✅ Toast has X circle icon
- ✅ Inline error also displayed in form

**Visual Check:**
- Red background (red-50)
- Red left border (red-500)
- Red text (red-800)
- Smooth slide-in animation from right

---

### 3. Error Toast - Inactive Account

**Steps:**
1. Navigate to `/login`
2. Enter credentials for an inactive user
3. Click "Iniciar Sesión"

**Expected Result:**
- ✅ Red error toast appears
- ✅ Message: "Tu cuenta está desactivada. Contacta con el administrador."
- ✅ Toast auto-dismisses after 5 seconds

---

### 4. Error Toast - Network Error

**Steps:**
1. Stop the backend server
2. Navigate to `/login`
3. Enter any credentials
4. Click "Iniciar Sesión"

**Expected Result:**
- ✅ Red error toast appears
- ✅ Message: "No se pudo conectar con el servidor. Verifica tu conexión a internet."
- ✅ Toast auto-dismisses after 5 seconds

---

### 5. Success Toast - Google OAuth Login

**Steps:**
1. Navigate to `/login`
2. Click "Iniciar Sesión con Google"
3. Complete Google authentication
4. Allow OAuth callback to process

**Expected Result:**
- ✅ Green success toast appears
- ✅ Message: "¡Autenticación exitosa! Bienvenido."
- ✅ Toast auto-dismisses after 5 seconds
- ✅ User is redirected to home page

---

### 6. Error Toast - OAuth Failure

**Steps:**
1. Navigate to `/login`
2. Click "Iniciar Sesión con Google"
3. Cancel or deny Google authentication

**Expected Result:**
- ✅ Red error toast appears
- ✅ Error message displayed
- ✅ User redirected back to login page
- ✅ Toast visible during redirect

---

### 7. Info Toast - Logout

**Steps:**
1. Login to the application
2. Open sidebar
3. Click "Cerrar Sesión"
4. Confirm logout in modal

**Expected Result:**
- ✅ Blue info toast appears
- ✅ Message: "Sesión cerrada correctamente. ¡Hasta pronto!"
- ✅ Toast auto-dismisses after 5 seconds
- ✅ User is redirected to login page
- ✅ Toast has info icon

**Visual Check:**
- Blue background (blue-50)
- Blue left border (blue-500)
- Blue text (blue-800)
- Info icon displayed

---

### 8. Multiple Toasts Stacking

**Steps:**
1. Trigger multiple toast notifications quickly
   - Try invalid login 3 times rapidly
   - Or use browser console:
   ```javascript
   useToastStore.getState().success('Toast 1');
   useToastStore.getState().error('Toast 2');
   useToastStore.getState().warning('Toast 3');
   useToastStore.getState().info('Toast 4');
   ```

**Expected Result:**
- ✅ All toasts appear stacked vertically
- ✅ Proper spacing between toasts (12px gap)
- ✅ Each toast is independently dismissible
- ✅ Toasts auto-dismiss in order
- ✅ No overlap or visual glitches

---

### 9. Manual Toast Dismissal

**Steps:**
1. Trigger any toast notification
2. Click the X button on the toast

**Expected Result:**
- ✅ Toast slides out to the right
- ✅ Toast fades out smoothly
- ✅ Toast is removed from DOM after animation
- ✅ Other toasts adjust position smoothly

---

### 10. Toast Persistence During Navigation

**Steps:**
1. Login successfully (triggers success toast)
2. Immediately navigate to different pages

**Expected Result:**
- ✅ Toast remains visible during navigation
- ✅ Toast stays in same position
- ✅ Toast continues countdown
- ✅ Toast auto-dismisses even after navigation

---

## Accessibility Testing

### Screen Reader Testing

**Steps:**
1. Enable screen reader (NVDA, JAWS, or VoiceOver)
2. Trigger various toast notifications
3. Listen to announcements

**Expected Result:**
- ✅ Toast message is announced when it appears
- ✅ Toast type is conveyed (success, error, etc.)
- ✅ Close button is properly labeled
- ✅ No duplicate announcements

---

### Keyboard Navigation

**Steps:**
1. Trigger a toast notification
2. Press Tab key to focus close button
3. Press Enter or Space to close

**Expected Result:**
- ✅ Close button receives focus
- ✅ Focus indicator is visible
- ✅ Enter key closes toast
- ✅ Space key closes toast
- ✅ Focus returns to appropriate element

---

### Color Contrast

**Steps:**
1. Use browser DevTools or contrast checker
2. Check contrast ratios for each toast variant

**Expected Result:**
- ✅ Success: Text contrast ≥ 4.5:1
- ✅ Error: Text contrast ≥ 4.5:1
- ✅ Warning: Text contrast ≥ 4.5:1
- ✅ Info: Text contrast ≥ 4.5:1
- ✅ Icons are clearly visible

---

## Responsive Testing

### Mobile View (< 768px)

**Steps:**
1. Resize browser to mobile width (375px)
2. Trigger toast notifications

**Expected Result:**
- ✅ Toast width adjusts appropriately
- ✅ Toast doesn't overflow screen
- ✅ Text wraps properly
- ✅ Icons remain visible
- ✅ Close button is easily tappable (44x44px minimum)

---

### Tablet View (768px - 1024px)

**Steps:**
1. Resize browser to tablet width (768px)
2. Trigger toast notifications

**Expected Result:**
- ✅ Toast displays correctly
- ✅ Proper spacing from edges
- ✅ All content readable

---

### Desktop View (> 1024px)

**Steps:**
1. View on desktop resolution
2. Trigger toast notifications

**Expected Result:**
- ✅ Toast positioned in top-right corner
- ✅ Proper spacing from edges (16px)
- ✅ Max width respected (448px)

---

## Browser Compatibility Testing

### Chrome/Edge
- ✅ Animations smooth
- ✅ Colors render correctly
- ✅ No console errors

### Firefox
- ✅ Animations smooth
- ✅ Colors render correctly
- ✅ No console errors

### Safari
- ✅ Animations smooth
- ✅ Colors render correctly
- ✅ No console errors

---

## Performance Testing

### Memory Leaks

**Steps:**
1. Open browser DevTools > Performance
2. Trigger 50+ toasts rapidly
3. Let them all auto-dismiss
4. Check memory usage

**Expected Result:**
- ✅ Memory returns to baseline
- ✅ No retained detached DOM nodes
- ✅ No memory leaks

---

### Animation Performance

**Steps:**
1. Open browser DevTools > Performance
2. Record while triggering multiple toasts
3. Check frame rate

**Expected Result:**
- ✅ 60 FPS maintained
- ✅ No layout thrashing
- ✅ Smooth animations

---

## Edge Cases Testing

### 1. Very Long Messages

**Test:**
```javascript
useToastStore.getState().error('Este es un mensaje muy largo que debería ajustarse correctamente dentro del toast sin romper el diseño o causar problemas de overflow en la interfaz de usuario.');
```

**Expected Result:**
- ✅ Text wraps properly
- ✅ Toast height adjusts
- ✅ No horizontal overflow
- ✅ Close button remains visible

---

### 2. Special Characters

**Test:**
```javascript
useToastStore.getState().success('¡Éxito! Operación completada: 100% ✓ <>&"\'');
```

**Expected Result:**
- ✅ Special characters display correctly
- ✅ HTML entities are escaped
- ✅ Emojis render properly

---

### 3. Rapid Fire Toasts

**Test:**
```javascript
for (let i = 0; i < 10; i++) {
  useToastStore.getState().info(`Toast ${i + 1}`);
}
```

**Expected Result:**
- ✅ All toasts appear
- ✅ Proper stacking
- ✅ No performance degradation
- ✅ Auto-dismiss works for all

---

### 4. Zero Duration Toast

**Test:**
```javascript
useToastStore.getState().addToast({
  message: 'This toast stays forever',
  type: 'warning',
  duration: 0
});
```

**Expected Result:**
- ✅ Toast appears
- ✅ Toast does NOT auto-dismiss
- ✅ Manual close button works
- ✅ Toast persists across navigation

---

### 5. Custom Duration

**Test:**
```javascript
useToastStore.getState().success('Quick message', 2000);
```

**Expected Result:**
- ✅ Toast appears
- ✅ Toast dismisses after 2 seconds
- ✅ Animation timing correct

---

## Integration Testing

### Test with Real Authentication Flow

**Complete Flow Test:**
1. Start from logged out state
2. Attempt login with wrong credentials → Error toast
3. Login with correct credentials → Success toast
4. Navigate around app
5. Logout → Info toast
6. Verify all toasts appeared correctly

**Expected Result:**
- ✅ All toasts appear at correct times
- ✅ No duplicate toasts
- ✅ Toasts don't interfere with navigation
- ✅ State is properly managed

---

## Developer Testing

### Console Testing

Open browser console and test the toast store directly:

```javascript
// Get toast store
const toast = useToastStore.getState();

// Test success
toast.success('Success message');

// Test error
toast.error('Error message');

// Test warning
toast.warning('Warning message');

// Test info
toast.info('Info message');

// Test custom toast
const id = toast.addToast({
  message: 'Custom toast',
  type: 'success',
  duration: 10000
});

// Remove specific toast
toast.removeToast(id);

// Clear all toasts
toast.clearToasts();
```

---

## Automated Testing (Future)

### Unit Tests to Write

```javascript
// useToastStore.test.js
describe('useToastStore', () => {
  test('adds toast with unique ID', () => {});
  test('removes toast by ID', () => {});
  test('clears all toasts', () => {});
  test('auto-removes toast after duration', () => {});
  test('convenience methods work correctly', () => {});
});

// Toast.test.jsx
describe('Toast', () => {
  test('renders with correct variant styles', () => {});
  test('displays message correctly', () => {});
  test('calls removeToast on close button click', () => {});
  test('auto-dismisses after duration', () => {});
  test('has proper accessibility attributes', () => {});
});

// ToastContainer.test.jsx
describe('ToastContainer', () => {
  test('renders all active toasts', () => {});
  test('stacks toasts vertically', () => {});
  test('has proper ARIA attributes', () => {});
});
```

---

## Bug Report Template

If you find issues, report them with this format:

```markdown
### Bug: [Brief Description]

**Severity:** Critical / High / Medium / Low

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Behavior:**


**Actual Behavior:**


**Screenshots:**
[Attach if applicable]

**Environment:**
- Browser: 
- OS: 
- Screen Size: 

**Console Errors:**
[Paste any console errors]
```

---

## Testing Checklist

### Functionality
- [ ] Success toast displays correctly
- [ ] Error toast displays correctly
- [ ] Warning toast displays correctly
- [ ] Info toast displays correctly
- [ ] Auto-dismiss works
- [ ] Manual close works
- [ ] Multiple toasts stack properly
- [ ] Toasts persist during navigation

### Authentication Integration
- [ ] Login success shows toast
- [ ] Login error shows toast
- [ ] OAuth success shows toast
- [ ] OAuth error shows toast
- [ ] Logout shows toast

### Accessibility
- [ ] Screen reader announces toasts
- [ ] Keyboard navigation works
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible
- [ ] ARIA attributes present

### Responsive Design
- [ ] Works on mobile (< 768px)
- [ ] Works on tablet (768-1024px)
- [ ] Works on desktop (> 1024px)
- [ ] No horizontal overflow
- [ ] Touch targets adequate size

### Performance
- [ ] No memory leaks
- [ ] Smooth animations (60 FPS)
- [ ] No console errors
- [ ] Fast render time

### Browser Compatibility
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

---

## Success Criteria

All tests pass when:
- ✅ All toast variants display correctly
- ✅ Toasts integrate with authentication events
- ✅ Accessibility requirements met
- ✅ Responsive on all screen sizes
- ✅ No performance issues
- ✅ No console errors
- ✅ Works across major browsers

**Status:** Ready for testing
**Estimated Testing Time:** 30-45 minutes for complete manual testing
