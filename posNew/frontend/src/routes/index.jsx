import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import ProductsPage from '../pages/ProductsPage';
import DashboardPage from '../pages/DashboardPage';
import SalesPage from '../pages/SalesPage';
import ReportsPage from '../pages/ReportsPage';
import LoginPage from '../pages/LoginPage';
import OAuthCallback from '../pages/OAuthCallback';
import SettingsPage from '../pages/SettingsPage';
import NotFoundPage from '../pages/NotFoundPage';
import ErrorPage from '../pages/ErrorPage';
import ProtectedRoute from '../features/auth/components/ProtectedRoute';
import { MainLayout } from '../shared/components/layout';
import { USER_ROLES } from '../shared/constants';
import PrintersPage from '../pages/PrintersPage';
import PaymentMethodsPage from '../pages/PaymentMethodsPage';
import CompanySettingsPage from '../pages/CompanySettingsPage';
import CategoriesPage from '../pages/CategoriesPage';
import CustomersPage from '../pages/CustomersPage';
import ProvidersPage from '../pages/ProvidersPage';
import BranchesPage from '../pages/BranchesPage';
import CashRegistersPage from '../pages/CashRegistersPage';
import BranchesCajasPage from '../pages/BranchesCajasPage';
import UsersSettingsPage from '../pages/UsersSettingsPage';
import RolesPage from '../pages/RolesPage';
import DocumentTypesPage from '../pages/DocumentTypesPage';
import WarehousesPage from '../pages/WarehousesPage';
import TicketConfigPage from '../pages/TicketConfigPage';
import SerializationPage from '../pages/SerializationPage';

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
          {
            path: '/sales',
            element: <SalesPage />,
          },
          {
            path: '/reports',
            element: <ReportsPage />,
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
          {
            path: '/settings/printers',
            element: <PrintersPage />,
          },
          {
            path: '/settings/payment-methods',
            element: <PaymentMethodsPage />,
          },
          {
            path: '/settings/company',
            element: <CompanySettingsPage />,
          },
          {
            path: '/settings/categories',
            element: <CategoriesPage />,
          },
          {
            path: '/settings/customers',
            element: <CustomersPage />,
          },
          {
            path: '/settings/providers',
            element: <ProvidersPage />,
          },
          {
            path: '/settings/branches',
            element: <BranchesPage />,
          },
          {
            path: '/settings/cash-registers',
            element: <CashRegistersPage />,
          },
          {
            path: '/settings/branches-cajas',
            element: <BranchesCajasPage />,
          },
          {
            path: '/settings/users',
            element: <UsersSettingsPage />,
          },
          {
            path: '/settings/roles',
            element: <RolesPage />,
          },
          {
            path: '/settings/document-types',
            element: <DocumentTypesPage />,
          },
          {
            path: '/settings/warehouses',
            element: <WarehousesPage />,
          },
          {
            path: '/settings/ticket',
            element: <TicketConfigPage />,
          },
          {
            path: '/settings/serialization',
            element: <SerializationPage />,
          },
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