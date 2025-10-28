import clienteBaseDeDatos from '../config/baseDeDatos.js';

const knex = clienteBaseDeDatos;

async function ensureDefaultModules() {
  try {
    const result = await knex('modulos').count({ count: '*' });
    const rawCount = result?.[0] ?? {};
    const count = parseInt(rawCount.count ?? rawCount['count(*)'] ?? '0', 10);

    if (count > 0) {
      console.log('[ensureModules] Tabla modulos ya contiene registros:', count);
      return;
    }

    const modules = [
      { nombre: 'Dashboard', descripcion: 'Panel principal del sistema', icono: 'dashboard', ruta: '/dashboard', orden: 1 },
      { nombre: 'Ventas', descripcion: 'Módulo de ventas y facturación', icono: 'shopping-cart', ruta: '/ventas', orden: 2 },
      { nombre: 'Productos', descripcion: 'Gestión de productos e inventario', icono: 'package', ruta: '/productos', orden: 3 },
      { nombre: 'Clientes', descripcion: 'Gestión de clientes', icono: 'users', ruta: '/clientes', orden: 4 },
      { nombre: 'Proveedores', descripcion: 'Gestión de proveedores', icono: 'truck', ruta: '/proveedores', orden: 5 },
      { nombre: 'Inventario', descripcion: 'Control de stock y almacenes', icono: 'warehouse', ruta: '/inventario', orden: 6 },
      { nombre: 'Caja', descripcion: 'Gestión de caja y movimientos', icono: 'credit-card', ruta: '/caja', orden: 7 },
      { nombre: 'Reportes', descripcion: 'Reportes y estadísticas', icono: 'bar-chart', ruta: '/reportes', orden: 8 },
      { nombre: 'Configuración', descripcion: 'Configuración del sistema', icono: 'settings', ruta: '/configuracion', orden: 9 },
      { nombre: 'Usuarios', descripcion: 'Gestión de usuarios y permisos', icono: 'user-check', ruta: '/usuarios', orden: 10 }
    ];

    await knex('modulos').insert(modules);
    console.log('[ensureModules] Módulos por defecto insertados:', modules.length);
  } catch (error) {
    console.error('[ensureModules] Error asegurando módulos por defecto:', error);
  }
}

export default ensureDefaultModules;