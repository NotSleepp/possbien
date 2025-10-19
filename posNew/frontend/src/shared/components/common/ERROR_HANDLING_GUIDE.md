# Error Handling System Guide

This guide explains the error handling system implemented in the application, including error boundaries, error pages, and best practices.

## Components Overview

### 1. ErrorBoundary Component
**Location:** `src/components/common/ErrorBoundary.jsx`

A React error boundary that catches JavaScript errors anywhere in the child component tree and displays a fallback UI.

**Features:**
- Catches React rendering errors
- Displays user-friendly error message
- Shows error details in development mode
- Provides actions to recover (reload, reset, go home)
- Can accept custom fallback UI via props

**Usage:**
```jsx
import ErrorBoundary from './components/common/ErrorBoundary';

// Wrap your component tree
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>

// With custom fallback
<ErrorBoundary fallback={<CustomErrorUI />}>
  <YourComponent />
</ErrorBoundary>
```

**When it catches errors:**
- Component rendering errors
- Lifecycle method errors
- Constructor errors in child components
- Errors in event handlers (if they bubble up)

**When it DOESN'T catch errors:**
- Event handlers (use try-catch)
- Asynchronous code (use try-catch)
- Server-side rendering errors
- Errors in the error boundary itself

### 2. Error Pages

#### NotFoundPage (404)
**Location:** `src/pages/NotFoundPage.jsx`

Displayed when a user navigates to a route that doesn't exist.

**Features:**
- Large 404 number display
- Friendly message
- Navigation options (home, back)
- Help text for support

**Usage:**
```jsx
// In routes
{
  path: '*',
  element: <NotFoundPage />,
}
```

#### ForbiddenPage / AccessDenied (403)
**Locations:** 
- `src/pages/ForbiddenPage.jsx` (standalone page)
- `src/components/common/AccessDenied.jsx` (component)

Displayed when a user tries to access a resource they don't have permission for.

**Features:**
- Large 403 number display
- Lock icon
- Clear permission message
- Navigation options
- Help text about contacting admin

**Usage:**
```jsx
// As a route
{
  path: '/forbidden',
  element: <ForbiddenPage />,
}

// As a component (in ProtectedRoute)
if (!hasPermission) {
  return <AccessDenied />;
}
```

#### ErrorPage (Generic)
**Location:** `src/pages/ErrorPage.jsx`

Generic error page for unexpected routing errors. Used by React Router's `errorElement`.

**Features:**
- Adapts to different error types (404, 403, generic)
- Shows error details in development
- Multiple recovery options
- User-friendly messages

**Usage:**
```jsx
// In routes as errorElement
{
  path: '/dashboard',
  element: <DashboardPage />,
  errorElement: <ErrorPage />,
}
```

## Error Handling Strategy

### 1. React Component Errors
Use ErrorBoundary to catch rendering errors:

```jsx
// In App.jsx or layout components
<ErrorBoundary>
  <RouterProvider router={router} />
</ErrorBoundary>
```

### 2. Routing Errors
Use errorElement in route configuration:

```jsx
export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
```

### 3. API Errors
Handle in API interceptors and components:

```jsx
// In api.js interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
    }
    if (error.response?.status === 403) {
      // Handle forbidden
    }
    return Promise.reject(error);
  }
);

// In components
try {
  const data = await fetchData();
} catch (error) {
  // Handle error locally
  setError(error.message);
}
```

### 4. Permission Errors
Use AccessDenied component:

```jsx
// In ProtectedRoute
if (!hasPermission(user, allowedRoles)) {
  return <AccessDenied />;
}
```

## Error Types and Responses

| Error Type | Component | HTTP Status | User Action |
|------------|-----------|-------------|-------------|
| Page Not Found | NotFoundPage | 404 | Navigate home or back |
| Access Denied | AccessDenied/ForbiddenPage | 403 | Navigate home or contact admin |
| React Error | ErrorBoundary | N/A | Reload or reset |
| Routing Error | ErrorPage | Various | Navigate home or reload |
| API Error | Toast/Alert | Various | Retry or dismiss |

## Best Practices

### 1. Use Appropriate Error Components
- **404 errors**: Use `NotFoundPage` for unknown routes
- **403 errors**: Use `AccessDenied` for permission issues
- **React errors**: Wrap with `ErrorBoundary`
- **Routing errors**: Use `errorElement` with `ErrorPage`

### 2. Provide Context
Always provide helpful error messages that:
- Explain what went wrong
- Suggest what the user can do
- Offer ways to recover or get help

### 3. Development vs Production
- Show detailed error info in development
- Show user-friendly messages in production
- Log errors for debugging

```jsx
{import.meta.env.DEV && (
  <div className="error-details">
    {error.stack}
  </div>
)}
```

### 4. Error Recovery
Provide multiple recovery options:
- Reload page
- Go back
- Go to home
- Try again
- Contact support

### 5. Logging
Consider logging errors to a service:

```jsx
componentDidCatch(error, errorInfo) {
  // Log to error reporting service
  logErrorToService(error, errorInfo);
}
```

## Testing Error Handling

### Test ErrorBoundary
```jsx
// Create a component that throws
const ThrowError = () => {
  throw new Error('Test error');
};

// Test
<ErrorBoundary>
  <ThrowError />
</ErrorBoundary>
```

### Test 404 Page
Navigate to a non-existent route:
```
http://localhost:5173/this-does-not-exist
```

### Test 403 Page
Try to access an admin route without permissions:
```
http://localhost:5173/settings (as non-admin user)
```

### Test Error Page
Trigger a routing error or use errorElement.

## Common Scenarios

### Scenario 1: User navigates to wrong URL
**Solution:** NotFoundPage catches via `path: '*'` route

### Scenario 2: User tries to access admin page
**Solution:** ProtectedRoute shows AccessDenied component

### Scenario 3: Component crashes during render
**Solution:** ErrorBoundary catches and shows fallback UI

### Scenario 4: API returns 401
**Solution:** API interceptor logs out user and redirects to login

### Scenario 5: API returns 403
**Solution:** Show error message or redirect to AccessDenied

### Scenario 6: Network error
**Solution:** Show error message with retry option

## Accessibility Considerations

All error pages include:
- Semantic HTML structure
- ARIA labels where appropriate
- Keyboard navigation support
- Clear visual hierarchy
- Sufficient color contrast

## Future Enhancements

Consider adding:
1. Error tracking service integration (Sentry, LogRocket)
2. Custom error pages per error type
3. Error recovery suggestions based on error type
4. Automatic error reporting
5. User feedback mechanism
6. Error analytics dashboard

## Related Files

- `src/App.jsx` - ErrorBoundary wrapper
- `src/routes/index.jsx` - Route error handling
- `src/features/auth/api/api.js` - API error interceptors
- `src/features/auth/components/ProtectedRoute.jsx` - Permission errors
- `src/utils/errorHandler.js` - Error utility functions
