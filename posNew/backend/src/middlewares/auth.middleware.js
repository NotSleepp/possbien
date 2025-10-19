import jwt from 'jsonwebtoken';
import { enviarError } from '../utils/manejadorRespuestas.js';

/**
 * Middleware de autenticación JWT
 * Verifica que el token sea válido y extrae la información del usuario
 * @param {object} req - Request de Express
 * @param {object} res - Response de Express
 * @param {function} next - Función next de Express
 */
export function autenticar(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    console.log('Auth header received:', authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid Bearer token');
      return enviarError(res, 'Token de acceso requerido', 401, 'AUTHENTICATION_ERROR');
    }
    
    const token = authHeader.substring(7); // Remover 'Bearer '
    console.log('Extracted token:', token);
    
    if (!token) {
      console.log('Empty token');
      return enviarError(res, 'Token de acceso requerido', 401, 'AUTHENTICATION_ERROR');
    }
    
    // Verificar el token JWT
    const jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret';
    console.log('Verifying token with secret:', jwtSecret ? 'Set' : 'Not set');
    const decoded = jwt.verify(token, jwtSecret);
    console.log('Token decoded:', decoded);
    
    // Agregar información del usuario al request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      empresaId: decoded.empresaId,
      rolId: decoded.rolId,
      sucursalId: decoded.sucursalId
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return enviarError(res, 'Token inválido o expirado', 401, 'AUTHENTICATION_ERROR');
  }
}

/**
 * Middleware de autorización multi-tenant
 * Garantiza que el usuario solo acceda a datos de su empresa
 * @param {object} req - Request de Express
 * @param {object} res - Response de Express
 * @param {function} next - Función next de Express
 */
export function autorizarEmpresa(req, res, next) {
  try {
    if (!req.user) {
      return enviarError(res, 'Usuario no autenticado', 401, 'AUTHENTICATION_ERROR');
    }
    
    const { empresaId } = req.user;
    
    if (!empresaId) {
      return enviarError(res, 'Usuario sin empresa asignada', 403, 'AUTHORIZATION_ERROR');
    }
    
    // Agregar filtro de empresa a los parámetros de consulta
    req.filtroEmpresa = { empresaId };
    
    // Si hay parámetros en el body, agregar empresaId automáticamente
    if (req.body && typeof req.body === 'object') {
      req.body.empresaId = empresaId;
    }
    
    // Si hay parámetros de consulta, agregar empresaId
    if (req.query && typeof req.query === 'object') {
      req.query.empresaId = empresaId;
    }
    
    next();
  } catch (error) {
    return enviarError(res, 'Error de autorización', 403, 'AUTHORIZATION_ERROR');
  }
}

/**
 * Middleware para verificar roles específicos
 * @param {string[]|number[]} rolesPermitidos - Array de roles que pueden acceder (nombres o IDs)
 * @returns {function} Middleware de Express
 */
export function autorizarRoles(rolesPermitidos) {
  // Mapeo canónico para nombres de roles usados en rutas
  const ROLE_NAME_TO_CANON = {
    SUPERADMIN: 1,
    ADMIN: 2,
    GERENTE: 3,
    CAJERO: 4,
    EMPLEADO: 5,
  };

  return (req, res, next) => {
    try {
      if (!req.user) {
        return enviarError(res, 'Usuario no autenticado', 401, 'AUTHENTICATION_ERROR');
      }
      
      const { rolId } = req.user;
      
      if (!rolId) {
        return enviarError(res, 'Usuario sin rol asignado', 403, 'AUTHORIZATION_ERROR');
      }
      
      // Normalizar rolesPermitidos: aceptar nombres (string) o IDs (number)
      const normalized = (rolesPermitidos || [])
        .map((r) => {
          if (typeof r === 'string') {
            const key = r.toUpperCase();
            return ROLE_NAME_TO_CANON[key] ?? null;
          }
          if (typeof r === 'number') return r;
          return null;
        })
        .filter((v) => v !== null);

      // Verificar si el rol del usuario está en los roles permitidos
      if (!normalized.includes(rolId)) {
        return enviarError(res, 'No tienes permisos para realizar esta acción', 403, 'AUTHORIZATION_ERROR');
      }
      
      next();
    } catch (error) {
      return enviarError(res, 'Error de autorización', 403, 'AUTHORIZATION_ERROR');
    }
  };
}

/**
 * Middleware para verificar acceso a sucursal específica
 * @param {object} req - Request de Express
 * @param {object} res - Response de Express
 * @param {function} next - Función next de Express
 */
export function autorizarSucursal(req, res, next) {
  try {
    if (!req.user) {
      return enviarError(res, 'Usuario no autenticado', 401, 'AUTHENTICATION_ERROR');
    }
    
    const { sucursalId } = req.user;
    const sucursalSolicitada = req.params.sucursalId || req.body.sucursalId || req.query.sucursalId;
    
    // Si no se especifica sucursal, usar la del usuario
    if (!sucursalSolicitada) {
      if (req.body && typeof req.body === 'object') {
        req.body.sucursalId = sucursalId;
      }
      return next();
    }
    
    // Verificar que el usuario tenga acceso a la sucursal solicitada
    if (sucursalSolicitada !== sucursalId) {
      return enviarError(res, 'No tienes acceso a esta sucursal', 403, 'AUTHORIZATION_ERROR');
    }
    
    next();
  } catch (error) {
    return enviarError(res, 'Error de autorización de sucursal', 403, 'AUTHORIZATION_ERROR');
  }
}

/**
 * Middleware combinado para autenticación y autorización multi-tenant
 * @param {object} req - Request de Express
 * @param {object} res - Response de Express
 * @param {function} next - Función next de Express
 */
export function seguridadMultiTenant(req, res, next) {
  autenticar(req, res, (err) => {
    if (err) return next(err);
    
    autorizarEmpresa(req, res, next);
  });
}

/**
 * Middleware para rutas que requieren autenticación pero no filtrado por empresa
 * (útil para superadmin o rutas de configuración global)
 * @param {object} req - Request de Express
 * @param {object} res - Response de Express
 * @param {function} next - Función next de Express
 */
export function soloAutenticar(req, res, next) {
  autenticar(req, res, next);
}

export default {
  autenticar,
  autorizarEmpresa,
  autorizarRoles,
  autorizarSucursal,
  seguridadMultiTenant,
  soloAutenticar
};