# Toast Notification System - Quick Reference

## Import
```javascript
import { useToastStore } from '@/store/useToastStore';
```

## Basic Usage

### In a Component
```javascript
function MyComponent() {
  const { success, error, warning, info } = useToastStore();

  // Show success toast
  success('Operation completed successfully');

  // Show error toast
  error('Something went wrong');

  // Show warning toast
  warning('Please save your changes');

  // Show info toast
  info('New update available');
}
```

## Methods

### Convenience Methods
```javascript
const { success, error, warning, info } = useToastStore();

success(message, duration?)  // Green toast with checkmark
error(message, duration?)    // Red toast with X
warning(message, duration?)  // Yellow toast with triangle
info(message, duration?)     // Blue toast with info icon
```

### Advanced Methods
```javascript
const { addToast, removeToast, clearToasts } = useToastStore();

// Add custom toast
const id = addToast({
  message: 'Custom message',
  type: 'success' | 'error' | 'warning' | 'info',
  duration: 5000  // milliseconds, 0 = no auto-dismiss
});

// Remove specific toast
removeToast(id);

// Clear all toasts
clearToasts();
```

## Duration Options

```javascript
// Quick (2 seconds)
success('Copied!', 2000);

// Default (5 seconds)
success('Saved successfully');  // or success('Saved', 5000);

// Long (10 seconds)
warning('Unsaved changes', 10000);

// Persistent (manual close only)
error('Critical error', 0);
```

## Common Patterns

### CRUD Operations
```javascript
// Create
success('Item created successfully');

// Update
success('Item updated successfully');

// Delete
success('Item deleted successfully');

// Error
error('Failed to save item');
```

### Authentication
```javascript
// Login
success('Welcome back!');
error('Invalid credentials');

// Logout
info('Logged out successfully');

// Session
warning('Session expiring soon');
```

### API Calls
```javascript
try {
  const data = await api.get('/data');
  success('Data loaded successfully');
} catch (err) {
  error('Failed to load data');
}
```

### Form Validation
```javascript
if (!formData.email) {
  error('Email is required');
  return;
}

if (!isValidEmail(formData.email)) {
  error('Invalid email format');
  return;
}

success('Form submitted successfully');
```

## Toast Variants

| Variant | Color | Icon | Use Case |
|---------|-------|------|----------|
| Success | Green | ✓ | Successful operations |
| Error | Red | ⊗ | Errors and failures |
| Warning | Yellow | ⚠ | Warnings and cautions |
| Info | Blue | ℹ | General information |

## Best Practices

### ✅ DO
- Keep messages concise (< 100 characters)
- Use appropriate variant for context
- Provide manual close for important messages
- Use consistent language
- Test with screen readers

### ❌ DON'T
- Show too many toasts at once (max 3-4)
- Use for critical errors (use modals)
- Make messages too long
- Rely only on color
- Use for permanent information

## Examples by Scenario

### File Upload
```javascript
const uploadFile = async (file) => {
  const toastId = info('Uploading file...', 0);
  
  try {
    await upload(file);
    removeToast(toastId);
    success('File uploaded successfully');
  } catch (err) {
    removeToast(toastId);
    error('Failed to upload file');
  }
};
```

### Network Error
```javascript
try {
  await api.post('/data', data);
  success('Data saved');
} catch (err) {
  if (!err.response) {
    error('Network error. Check your connection.');
  } else if (err.response.status === 403) {
    error('Permission denied');
  } else {
    error('Failed to save data');
  }
}
```

### Batch Operations
```javascript
const deleteMultiple = async (ids) => {
  try {
    await Promise.all(ids.map(id => deleteItem(id)));
    success(`${ids.length} items deleted`);
  } catch (err) {
    error('Failed to delete some items');
  }
};
```

## Accessibility

- All toasts have `role="alert"`
- Container has `aria-live="polite"`
- Close button has `aria-label="Close notification"`
- Keyboard accessible (Tab to close button, Enter/Space to close)
- Screen reader announces messages

## Troubleshooting

### Toast not appearing?
1. Check ToastContainer is in App.jsx
2. Verify import path is correct
3. Check browser console for errors

### Toast not auto-dismissing?
1. Check duration is > 0
2. Verify no JavaScript errors
3. Check setTimeout is working

### Multiple toasts overlapping?
1. Check ToastContainer has flex-col
2. Verify gap-3 class is applied
3. Check for CSS conflicts

## Need Help?

- See `TASK_14_IMPLEMENTATION_SUMMARY.md` for technical details
- See `TASK_14_TESTING_GUIDE.md` for testing scenarios
- See `src/components/ui/TOAST_VISUAL_GUIDE.md` for visual examples
- See `src/components/ui/README.md` for component documentation
