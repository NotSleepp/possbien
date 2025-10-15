import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import ProductsPage from '../pages/ProductsPage';
import DashboardPage from '../pages/DashboardPage';
import LoginPage from '../pages/LoginPage';
import OAuthCallback from '../pages/OAuthCallback';
import SettingsPage from '../pages/SettingsPage';
import NotFoundPage from '../pages/NotFoundPage';
import ErrorPage from '../pages/ErrorPage';
import ProtectedRoute from '../features/auth/components/ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';
import { USER_ROLES } from '../utils/constants';

export const router = createBrowserRouter([
  {
    // Protected routes with MainLayout
    element: <ProtectedRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        // Main layout wrapper for all authenticated pages
        element: <MainLayout />,
        children: [
          {
            path: '/',
            element: <HomePage />,
          },
          {
            path: '/dashboard',
            element: <DashboardPage />,
          },
          {
            path: '/products',
            element: <ProductsPage />,
          },
        ],
      },
    ],
  },
  {
    // Admin-only routes with MainLayout
    element: <ProtectedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN]} />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: '/settings',
            element: <SettingsPage />,
          },
          // Add more admin-only routes here as needed
          // {
          //   path: '/users',
          //   element: <UsersPage />,
          // },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/oauth',
    element: <OAuthCallback />,
    errorElement: <ErrorPage />,
  },
  {
    // 404 catch-all route
    path: '*',
    element: <NotFoundPage />,
  },
]);