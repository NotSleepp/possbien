/**
 * Permission Utilities
 * Functions to check user permissions based on roles
 */

import { USER_ROLES } from './constants';

// Prefer canonical role from JWT (rolId) and fallback to DB id_rol
const getCanonicalRoleId = (user) => (user?.rolId ?? user?.id_rol ?? null);

/**
 * Check if a user has a specific role
 * @param {Object} user - User object with rolId or id_rol property
 * @param {number} roleId - Role ID to check
 * @returns {boolean} - True if user has the role
 */
export const hasRole = (user, roleId) => {
  const role = getCanonicalRoleId(user);
  if (!role) return false;
  return role === roleId;
};

/**
 * Check if a user has any of the specified roles
 * @param {Object} user - User object with rolId or id_rol property
 * @param {number[]} roleIds - Array of role IDs to check
 * @returns {boolean} - True if user has any of the roles
 */
export const hasAnyRole = (user, roleIds) => {
  const role = getCanonicalRoleId(user);
  if (!role || !Array.isArray(roleIds)) return false;
  return roleIds.includes(role);
};

/**
 * Check if a user is an admin (Super Admin or Admin)
 * @param {Object} user - User object
 * @returns {boolean} - True if user is admin
 */
export const isAdmin = (user) => {
  return hasAnyRole(user, [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN]);
};

/**
 * Check if a user is a super admin
 * @param {Object} user - User object
 * @returns {boolean} - True if user is super admin
 */
export const isSuperAdmin = (user) => {
  return hasRole(user, USER_ROLES.SUPER_ADMIN);
};

/**
 * Check if a user is a manager or higher
 * @param {Object} user - User object
 * @returns {boolean} - True if user is manager, admin, or super admin
 */
export const isManagerOrHigher = (user) => {
  return hasAnyRole(user, [
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN,
    USER_ROLES.MANAGER,
  ]);
};

/**
 * Check if a user can access a specific module/feature
 * @param {Object} user - User object
 * @param {string} module - Module name
 * @returns {boolean} - True if user can access the module
 */
export const canAccessModule = (user, module) => {
  const role = getCanonicalRoleId(user);
  if (!role) return false;

  // Define module permissions
  const modulePermissions = {
    dashboard: [
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.ADMIN,
      USER_ROLES.MANAGER,
      USER_ROLES.CASHIER,
      USER_ROLES.EMPLOYEE,
    ],
    products: [
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.ADMIN,
      USER_ROLES.MANAGER,
      USER_ROLES.CASHIER,
      USER_ROLES.EMPLOYEE,
    ],
    sales: [
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.ADMIN,
      USER_ROLES.MANAGER,
      USER_ROLES.CASHIER,
      USER_ROLES.EMPLOYEE,
    ],
    reports: [
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.ADMIN,
      USER_ROLES.MANAGER,
    ],
    users: [
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.ADMIN,
    ],
    settings: [
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.ADMIN,
    ],
  };

  const allowedRoles = modulePermissions[module];
  if (!allowedRoles) return false;

  return allowedRoles.includes(role);
};

/**
 * Check if a user can perform a specific action
 * @param {Object} user - User object
 * @param {string} action - Action name (create, read, update, delete)
 * @param {string} resource - Resource name
 * @returns {boolean} - True if user can perform the action
 */
export const canPerformAction = (user, action, resource) => {
  const role = getCanonicalRoleId(user);
  if (!role) return false;

  // Define action permissions
  const actionPermissions = {
    products: {
      create: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.MANAGER],
      read: [
        USER_ROLES.SUPER_ADMIN,
        USER_ROLES.ADMIN,
        USER_ROLES.MANAGER,
        USER_ROLES.CASHIER,
        USER_ROLES.EMPLOYEE,
      ],
      update: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.MANAGER],
      delete: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN],
    },
    sales: {
      create: [
        USER_ROLES.SUPER_ADMIN,
        USER_ROLES.ADMIN,
        USER_ROLES.MANAGER,
        USER_ROLES.CASHIER,
      ],
      read: [
        USER_ROLES.SUPER_ADMIN,
        USER_ROLES.ADMIN,
        USER_ROLES.MANAGER,
        USER_ROLES.CASHIER,
        USER_ROLES.EMPLOYEE,
      ],
      update: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.MANAGER],
      delete: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN],
    },
    users: {
      create: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN],
      read: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN],
      update: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN],
      delete: [USER_ROLES.SUPER_ADMIN],
    },
  };

  const resourcePermissions = actionPermissions[resource];
  if (!resourcePermissions) return false;

  const allowedRoles = resourcePermissions[action];
  if (!allowedRoles) return false;

  return allowedRoles.includes(role);
};

/**
 * Get user role name
 * @param {Object} user - User object
 * @returns {string} - Role name
 */
export const getUserRoleName = (user) => {
  const role = getCanonicalRoleId(user);
  if (!role) return 'Desconocido';

  const roleNames = {
    [USER_ROLES.SUPER_ADMIN]: 'Super Administrador',
    [USER_ROLES.ADMIN]: 'Administrador',
    [USER_ROLES.MANAGER]: 'Gerente',
    [USER_ROLES.CASHIER]: 'Cajero',
    [USER_ROLES.EMPLOYEE]: 'Empleado',
  };

  return roleNames[role] || 'Desconocido';
};

/**
 * Filter menu items based on user permissions
 * @param {Array} menuItems - Array of menu items with roles property
 * @param {Object} user - User object
 * @returns {Array} - Filtered menu items
 */
export const filterMenuByPermissions = (menuItems, user) => {
  const role = getCanonicalRoleId(user);
  if (!role || !Array.isArray(menuItems)) return [];

  return menuItems.filter((item) => {
    if (!item.roles || !Array.isArray(item.roles)) return true;
    return item.roles.includes(role);
  });
};

export default {
  hasRole,
  hasAnyRole,
  isAdmin,
  isSuperAdmin,
  isManagerOrHigher,
  canAccessModule,
  canPerformAction,
  getUserRoleName,
  filterMenuByPermissions,
};
