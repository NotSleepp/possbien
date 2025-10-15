/**
 * Permission Utilities
 * Functions to check user permissions based on roles
 */

import { USER_ROLES } from './constants';

/**
 * Check if a user has a specific role
 * @param {Object} user - User object with id_rol property
 * @param {number} roleId - Role ID to check
 * @returns {boolean} - True if user has the role
 */
export const hasRole = (user, roleId) => {
  if (!user || !user.id_rol) return false;
  return user.id_rol === roleId;
};

/**
 * Check if a user has any of the specified roles
 * @param {Object} user - User object with id_rol property
 * @param {number[]} roleIds - Array of role IDs to check
 * @returns {boolean} - True if user has any of the roles
 */
export const hasAnyRole = (user, roleIds) => {
  if (!user || !user.id_rol || !Array.isArray(roleIds)) return false;
  return roleIds.includes(user.id_rol);
};

/**
 * Check if a user is an admin (Super Admin or Admin)
 * @param {Object} user - User object with id_rol property
 * @returns {boolean} - True if user is admin
 */
export const isAdmin = (user) => {
  return hasAnyRole(user, [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN]);
};

/**
 * Check if a user is a super admin
 * @param {Object} user - User object with id_rol property
 * @returns {boolean} - True if user is super admin
 */
export const isSuperAdmin = (user) => {
  return hasRole(user, USER_ROLES.SUPER_ADMIN);
};

/**
 * Check if a user is a manager or higher
 * @param {Object} user - User object with id_rol property
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
 * @param {Object} user - User object with id_rol property
 * @param {string} module - Module name
 * @returns {boolean} - True if user can access the module
 */
export const canAccessModule = (user, module) => {
  if (!user || !user.id_rol) return false;

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

  return allowedRoles.includes(user.id_rol);
};

/**
 * Check if a user can perform a specific action
 * @param {Object} user - User object with id_rol property
 * @param {string} action - Action name (create, read, update, delete)
 * @param {string} resource - Resource name
 * @returns {boolean} - True if user can perform the action
 */
export const canPerformAction = (user, action, resource) => {
  if (!user || !user.id_rol) return false;

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

  return allowedRoles.includes(user.id_rol);
};

/**
 * Get user role name
 * @param {Object} user - User object with id_rol property
 * @returns {string} - Role name
 */
export const getUserRoleName = (user) => {
  if (!user || !user.id_rol) return 'Desconocido';

  const roleNames = {
    [USER_ROLES.SUPER_ADMIN]: 'Super Administrador',
    [USER_ROLES.ADMIN]: 'Administrador',
    [USER_ROLES.MANAGER]: 'Gerente',
    [USER_ROLES.CASHIER]: 'Cajero',
    [USER_ROLES.EMPLOYEE]: 'Empleado',
  };

  return roleNames[user.id_rol] || 'Desconocido';
};

/**
 * Filter menu items based on user permissions
 * @param {Array} menuItems - Array of menu items with roles property
 * @param {Object} user - User object with id_rol property
 * @returns {Array} - Filtered menu items
 */
export const filterMenuByPermissions = (menuItems, user) => {
  if (!user || !user.id_rol || !Array.isArray(menuItems)) return [];

  return menuItems.filter((item) => {
    if (!item.roles || !Array.isArray(item.roles)) return true;
    return item.roles.includes(user.id_rol);
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
