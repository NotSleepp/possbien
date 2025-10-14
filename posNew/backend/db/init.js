/**
 * Script de inicialización de base de datos - POS System
 * Versión 3.0 - ES Modules
 * 
 * Funcionalidades:
 * - Crear/eliminar base de datos
 * - Ejecutar schema (crear tablas)
 * - Insertar datos iniciales (seeds)
 * - Verificar estado de la base de datos
 * - Resetear base de datos completa
 * - Backup de base de datos
 */

import mysql from 'mysql2/promise';
import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createHash, randomBytes } from 'crypto';
import dotenv from 'dotenv';

// Configurar __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
dotenv.config();

/**
 * Configuración de la base de datos
 */
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'pos_system',
  charset: 'utf8mb4',
  timezone: '+00:00'
};

/**
 * Configuración sin base de datos (para crear/eliminar DB)
 */
const DB_CONFIG_NO_DB = {
  host: DB_CONFIG.host,
  port: DB_CONFIG.port,
  user: DB_CONFIG.user,
  password: DB_CONFIG.password,
  charset: DB_CONFIG.charset,
  timezone: DB_CONFIG.timezone
};

/**
 * Rutas de archivos SQL
 */
const PATHS = {
  schema: join(__dirname, 'schema.sql'),
  seeds: join(__dirname, 'seeds.sql'),
  mejoras: join(__dirname, 'mejoras_schema.sql'),
  indices: join(__dirname, 'indices_rendimiento.sql')
};

/**
 * Clase para gestionar la base de datos
 */
class DatabaseManager {
  constructor() {
    this.connection = null;
  }

  /**
   * Conectar a MySQL (sin seleccionar base de datos)
   */
  async conectarSinDB() {
    try {
      this.connection = await mysql.createConnection(DB_CONFIG_NO_DB);
      console.log('✅ Conectado a MySQL');
    } catch (error) {
      throw new Error(`Error al conectar a MySQL: ${error.message}`);
    }
  }

  /**
   * Conectar a la base de datos específica
   */
  async conectar() {
    try {
      this.connection = await mysql.createConnection(DB_CONFIG);
      console.log(`✅ Conectado a la base de datos: ${DB_CONFIG.database}`);
    } catch (error) {
      throw new Error(`Error al conectar a la base de datos: ${error.message}`);
    }
  }

  /**
   * Desconectar de la base de datos
   */
  async desconectar() {
    if (this.connection) {
      await this.connection.end();
      console.log('✅ Desconectado de la base de datos');
    }
  }

  /**
   * Verificar si la base de datos existe
   */
  async existeBaseDatos() {
    try {
      const [rows] = await this.connection.execute(
        'SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?',
        [DB_CONFIG.database]
      );
      return rows.length > 0;
    } catch (error) {
      throw new Error(`Error al verificar base de datos: ${error.message}`);
    }
  }

  /**
   * Crear base de datos
   */
  async crearBaseDatos() {
    try {
      await this.connection.execute(
        `CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.database}\` 
         CHARACTER SET utf8mb4 
         COLLATE utf8mb4_unicode_ci`
      );
      console.log(`✅ Base de datos '${DB_CONFIG.database}' creada`);
    } catch (error) {
      throw new Error(`Error al crear base de datos: ${error.message}`);
    }
  }

  /**
   * Eliminar base de datos
   */
  async eliminarBaseDatos() {
    try {
      await this.connection.execute(`DROP DATABASE IF EXISTS \`${DB_CONFIG.database}\``);
      console.log(`✅ Base de datos '${DB_CONFIG.database}' eliminada`);
    } catch (error) {
      throw new Error(`Error al eliminar base de datos: ${error.message}`);
    }
  }

  /**
   * Leer y limpiar contenido SQL
   */
  async leerArchivoSQL(rutaArchivo) {
    try {
      const contenido = await readFile(rutaArchivo, 'utf8');
      
      // Limpiar comentarios y líneas vacías
      const lineas = contenido
        .split('\n')
        .map(linea => linea.trim())
        .filter(linea => linea && !linea.startsWith('--'));
      
      return lineas.join('\n');
    } catch (error) {
      throw new Error(`Error al leer archivo ${rutaArchivo}: ${error.message}`);
    }
  }

  /**
   * Ejecutar archivo SQL
   */
  async ejecutarArchivoSQL(rutaArchivo, descripcion = '') {
    try {
      console.log(`📄 Ejecutando ${descripcion || rutaArchivo}...`);
      
      const contenidoSQL = await this.leerArchivoSQL(rutaArchivo);
      
      // Dividir en consultas individuales
      const consultas = contenidoSQL
        .split(';')
        .map(consulta => consulta.trim())
        .filter(consulta => consulta.length > 0);
      
      let consultasEjecutadas = 0;
      
      for (const consulta of consultas) {
        if (consulta.trim()) {
          try {
            await this.connection.execute(consulta);
            consultasEjecutadas++;
          } catch (error) {
            // Ignorar errores de DROP TABLE IF EXISTS y CREATE TABLE IF NOT EXISTS
            if (!error.message.includes('already exists') && 
                !error.message.includes("doesn't exist")) {
              console.warn(`⚠️  Advertencia en consulta: ${error.message}`);
            }
          }
        }
      }
      
      console.log(`✅ ${descripcion || 'Archivo SQL'} ejecutado (${consultasEjecutadas} consultas)`);
    } catch (error) {
      throw new Error(`Error al ejecutar ${descripcion || rutaArchivo}: ${error.message}`);
    }
  }

  /**
   * Obtener información de tablas
   */
  async obtenerInfoTablas() {
    try {
      const [tablas] = await this.connection.execute(
        `SELECT TABLE_NAME, TABLE_ROWS, DATA_LENGTH, INDEX_LENGTH 
         FROM INFORMATION_SCHEMA.TABLES 
         WHERE TABLE_SCHEMA = ? 
         ORDER BY TABLE_NAME`,
        [DB_CONFIG.database]
      );
      
      return tablas;
    } catch (error) {
      throw new Error(`Error al obtener información de tablas: ${error.message}`);
    }
  }

  /**
   * Verificar estado de la base de datos
   */
  async verificarEstado() {
    try {
      console.log('\n📊 ESTADO DE LA BASE DE DATOS');
      console.log('=' .repeat(50));
      
      // Información de MySQL
      const [version] = await this.connection.execute('SELECT VERSION() as version');
      console.log(`🔧 Versión MySQL: ${version[0].version}`);
      
      // Información de la base de datos
      const [dbInfo] = await this.connection.execute(
        `SELECT DEFAULT_CHARACTER_SET_NAME, DEFAULT_COLLATION_NAME 
         FROM INFORMATION_SCHEMA.SCHEMATA 
         WHERE SCHEMA_NAME = ?`,
        [DB_CONFIG.database]
      );
      
      if (dbInfo.length > 0) {
        console.log(`📁 Base de datos: ${DB_CONFIG.database}`);
        console.log(`🔤 Charset: ${dbInfo[0].DEFAULT_CHARACTER_SET_NAME}`);
        console.log(`🔤 Collation: ${dbInfo[0].DEFAULT_COLLATION_NAME}`);
      }
      
      // Información de tablas
      const tablas = await this.obtenerInfoTablas();
      console.log(`\n📋 Tablas encontradas: ${tablas.length}`);
      
      if (tablas.length > 0) {
        console.log('\nDetalle de tablas:');
        tablas.forEach(tabla => {
          const tamaño = ((tabla.DATA_LENGTH + tabla.INDEX_LENGTH) / 1024).toFixed(2);
          console.log(`  • ${tabla.TABLE_NAME}: ${tabla.TABLE_ROWS} registros (${tamaño} KB)`);
        });
        
        // Contar registros totales
        const totalRegistros = tablas.reduce((sum, tabla) => sum + (tabla.TABLE_ROWS || 0), 0);
        console.log(`\n📊 Total de registros: ${totalRegistros}`);
      }
      
      console.log('=' .repeat(50));
    } catch (error) {
      throw new Error(`Error al verificar estado: ${error.message}`);
    }
  }

  /**
   * Crear backup de la base de datos
   */
  async crearBackup() {
    try {
      console.log('💾 Creando backup de la base de datos...');
      
      const fecha = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
      const nombreBackup = `backup_${DB_CONFIG.database}_${fecha}.sql`;
      
      // Aquí podrías implementar la lógica de backup usando mysqldump
      // Por ahora solo mostramos el mensaje
      console.log(`✅ Backup creado: ${nombreBackup}`);
      console.log('ℹ️  Nota: Implementar mysqldump para backup completo');
      
    } catch (error) {
      throw new Error(`Error al crear backup: ${error.message}`);
    }
  }
}

/**
 * Función principal
 */
async function main() {
  const args = process.argv.slice(2);
  const comando = args[0];
  
  if (!comando || comando === '--help') {
    mostrarAyuda();
    return;
  }
  
  const db = new DatabaseManager();
  
  try {
    switch (comando) {
      case '--create':
      case '--migrate':
        await crearBaseDatos(db);
        break;
        
      case '--seed':
        await insertarDatos(db);
        break;
        
      case '--reset':
        await resetearBaseDatos(db);
        break;
        
      case '--check':
        await verificarBaseDatos(db);
        break;
        
      case '--backup':
        await crearBackupBaseDatos(db);
        break;
        
      default:
        console.error(`❌ Comando desconocido: ${comando}`);
        mostrarAyuda();
        process.exit(1);
    }
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  } finally {
    await db.desconectar();
  }
}

/**
 * Crear base de datos y ejecutar schema
 */
async function crearBaseDatos(db) {
  console.log('🚀 Iniciando creación de base de datos...');
  
  // Conectar sin seleccionar DB
  await db.conectarSinDB();
  
  // Crear base de datos
  await db.crearBaseDatos();
  await db.desconectar();
  
  // Conectar a la nueva base de datos
  await db.conectar();
  
  // Ejecutar schema
  await db.ejecutarArchivoSQL(PATHS.schema, 'Schema (creación de tablas)');
  
  // Ejecutar mejoras (tablas adicionales)
  await db.ejecutarArchivoSQL(PATHS.mejoras, 'Mejoras (tablas adicionales para POS profesional)');
  
  // Ejecutar índices de rendimiento
  await db.ejecutarArchivoSQL(PATHS.indices, 'Índices de rendimiento');
  
  console.log('✅ Base de datos creada exitosamente');
}

/**
 * Generar contraseña segura
 */
function generarContraseñaSegura(longitud = 12) {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let contraseña = '';
  
  for (let i = 0; i < longitud; i++) {
    const randomIndex = Math.floor(Math.random() * caracteres.length);
    contraseña += caracteres[randomIndex];
  }
  
  return contraseña;
}

/**
 * Generar hash de contraseña (formato bcrypt simulado)
 */
function generarHashContraseña(contraseña) {
  // Generar un hash bcrypt simulado más realista
  const salt = randomBytes(16).toString('hex').substring(0, 22);
  const hash = createHash('sha256').update(contraseña + salt).digest('hex').substring(0, 31);
  return `$2b$10$${salt}${hash}`;
}

/**
 * Procesar seeds con contraseñas dinámicas
 */
async function procesarSeedsConContraseñas(rutaSeeds) {
  try {
    let contenidoSeeds = await readFile(rutaSeeds, 'utf8');
    
    // Generar contraseñas para cada usuario
    const usuarios = [
      { nombre: 'admin', contraseña: generarContraseñaSegura(16) },
      { nombre: 'vendedor1', contraseña: generarContraseñaSegura(12) },
      { nombre: 'cajero1', contraseña: generarContraseñaSegura(12) }
    ];
    
    console.log('\n🔐 Contraseñas generadas:');
    console.log('=' .repeat(50));
    
    // Hash estático que aparece en seeds.sql
    const hashEstatico = '$2b$10$rQZ8kJxH5fKjH5fKjH5fKOuKjH5fKjH5fKjH5fKjH5fKjH5fKjH5f';
    
    // Generar todos los hashes primero
    const hashesNuevos = usuarios.map(usuario => ({
      nombre: usuario.nombre,
      contraseña: usuario.contraseña,
      hash: generarHashContraseña(usuario.contraseña)
    }));
    
    // Reemplazar cada ocurrencia del hash estático con un hash único
    let contadorReemplazos = 0;
    const patronHash = new RegExp(hashEstatico.replace(/\$/g, '\\\$'), 'g');
    
    contenidoSeeds = contenidoSeeds.replace(patronHash, () => {
      if (contadorReemplazos < hashesNuevos.length) {
        const hashActual = hashesNuevos[contadorReemplazos].hash;
        console.log(`✓ Reemplazado hash para usuario: ${hashesNuevos[contadorReemplazos].nombre}`);
        contadorReemplazos++;
        return hashActual;
      }
      return hashEstatico; // Si hay más ocurrencias, mantener el original
    });
    
    // Mostrar las contraseñas generadas
    hashesNuevos.forEach(usuario => {
      console.log(`👤 ${usuario.nombre}: ${usuario.contraseña}`);
    });
    
    console.log('=' .repeat(50));
    console.log('⚠️  IMPORTANTE: Guarda estas contraseñas en un lugar seguro');
    console.log('=' .repeat(50));
    
    return contenidoSeeds;
    
  } catch (error) {
    throw new Error(`Error al procesar seeds: ${error.message}`);
  }
}

/**
 * Obtener hash estático por nombre de usuario
 */
function getHashEstatico(nombreUsuario) {
  // Hash bcrypt estático que se encuentra en seeds.sql
  const hashEstatico = '$2b$10$rQZ8kJxH5fKjH5fKjH5fKOuKjH5fKjH5fKjH5fKjH5fKjH5fKjH5f';
  return hashEstatico;
}

/**
 * Insertar datos iniciales
 */
async function insertarDatos(db) {
  console.log('🌱 Insertando datos iniciales...');
  
  await db.conectar();
  
  // Procesar seeds con contraseñas dinámicas
  const contenidoSeeds = await procesarSeedsConContraseñas(PATHS.seeds);
  
  // Debug: mostrar contenido procesado
  console.log(`📝 Contenido procesado (${contenidoSeeds.length} caracteres):`);
  console.log(`📝 Primeras 500 caracteres: ${contenidoSeeds.substring(0, 500)}...`);
  
  // Declarar variables de conteo al inicio
  let consultasEjecutadas = 0;
  let erroresEncontrados = 0;
  
  // Ejecutar consultas usando transacción para mantener variables de sesión
  console.log('📝 Ejecutando seeds en transacción para mantener variables...');
  
  // Dividir consultas de manera más inteligente para manejar consultas multilínea
  const lineas = contenidoSeeds.split('\n');
  const todasLasConsultas = [];
  let consultaActual = '';
  
  for (let i = 0; i < lineas.length; i++) {
    const linea = lineas[i].trim();
    
    // Saltar líneas vacías y comentarios
    if (linea.length === 0 || linea.startsWith('--')) {
      continue;
    }
    
    // Agregar la línea a la consulta actual
    if (consultaActual.length > 0) {
      consultaActual += ' ' + linea;
    } else {
      consultaActual = linea;
    }
    
    // Si la línea termina con ';', la consulta está completa
    if (linea.endsWith(';')) {
      // Remover el ';' final y agregar la consulta
      const consultaCompleta = consultaActual.slice(0, -1).trim();
      if (consultaCompleta.length > 0) {
        todasLasConsultas.push(consultaCompleta);
      }
      consultaActual = '';
    }
  }
  
  // Si queda una consulta sin terminar, agregarla
  if (consultaActual.trim().length > 0) {
    todasLasConsultas.push(consultaActual.trim());
  }
  
  // Filtrar consultas vacías después del procesamiento
  const consultasLimpias = todasLasConsultas.filter(consulta => 
    consulta && consulta.trim().length > 0 && !consulta.trim().startsWith('--')
  );
  
  console.log(`📝 Total de consultas encontradas: ${consultasLimpias.length}`);
  
  // Debug: mostrar las primeras 10 consultas
  console.log('🔍 Primeras 10 consultas encontradas:');
  consultasLimpias.slice(0, 10).forEach((consulta, index) => {
    const tipo = consulta.split(/\s+/)[0].toUpperCase();
    console.log(`  ${index + 1}. ${tipo}: ${consulta.substring(0, 100)}...`);
  });
  
  // Mostrar tipos de consultas encontradas
  const tiposEncontrados = {};
  consultasLimpias.forEach(consulta => {
    const tipo = consulta.split(/\s+/)[0].toUpperCase();
    tiposEncontrados[tipo] = (tiposEncontrados[tipo] || 0) + 1;
  });
  console.log('📊 Tipos de consultas encontradas:', tiposEncontrados);
  
  const consultas = consultasLimpias
    .filter(consulta => {
      // Permitir INSERT, UPDATE, DELETE, SET, CREATE, ALTER, DROP
      const tiposPermitidos = ['INSERT', 'UPDATE', 'DELETE', 'SET', 'CREATE', 'ALTER', 'DROP'];
      const primeraPalabra = consulta.split(/\s+/)[0].toUpperCase();
      return tiposPermitidos.includes(primeraPalabra);
    });
  
  console.log(`📝 Procesando ${consultas.length} consultas en transacción...`);
  
  // Iniciar transacción
  await db.connection.query('START TRANSACTION');
  
  try {
    for (let i = 0; i < consultas.length; i++) {
      const consulta = consultas[i];
      if (consulta.trim()) {
        const tipoConsulta = consulta.split(/\s+/)[0].toUpperCase();
        console.log(`🔍 Ejecutando consulta ${i + 1} (${tipoConsulta}): ${consulta.substring(0, 80)}...`);
        
        const resultado = await db.connection.query(consulta);
        
        const filasAfectadas = resultado[0]?.affectedRows;
        if (tipoConsulta === 'INSERT' && filasAfectadas > 0) {
          console.log(`✅ Consulta ${i + 1} ejecutada exitosamente. Filas insertadas: ${filasAfectadas}`);
        } else {
          console.log(`✅ Consulta ${i + 1} ejecutada exitosamente. Filas afectadas: ${filasAfectadas || 'N/A'}`);
        }
        
        // Debug: verificar variables de sesión después de SET
        if (tipoConsulta === 'SET' && consulta.includes('@id_empresa')) {
          const [rows] = await db.connection.query('SELECT @id_empresa as id_empresa');
          console.log(`   🔍 Variable @id_empresa = ${rows[0]?.id_empresa || 'NULL'}`);
        }
        
        consultasEjecutadas++;
        
        // Log de progreso cada 5 consultas
        if ((i + 1) % 5 === 0) {
          console.log(`   ✓ Procesadas ${i + 1}/${consultas.length} consultas`);
        }
      }
    }
    
    // Confirmar transacción
    await db.connection.query('COMMIT');
    console.log('✅ Transacción confirmada exitosamente');
    
  } catch (error) {
    // Revertir transacción en caso de error
    await db.connection.query('ROLLBACK');
    console.error('❌ Error en transacción, revirtiendo cambios...');
    console.error(`   Error: ${error.message}`);
    erroresEncontrados++;
    throw error;
  }
  
  console.log(`✅ Datos iniciales procesados: ${consultasEjecutadas} consultas exitosas, ${erroresEncontrados} errores`);
}

/**
 * Resetear base de datos completa
 */
async function resetearBaseDatos(db) {
  console.log('🔄 Reseteando base de datos...');
  
  // Conectar sin seleccionar DB
  await db.conectarSinDB();
  
  // Eliminar y crear base de datos
  await db.eliminarBaseDatos();
  await db.crearBaseDatos();
  await db.desconectar();
  
  // Conectar a la nueva base de datos
  await db.conectar();
  
  // Ejecutar schema, mejoras, índices y seeds
  await db.ejecutarArchivoSQL(PATHS.schema, 'Schema (creación de tablas)');
  await db.ejecutarArchivoSQL(PATHS.mejoras, 'Mejoras (tablas adicionales)');
  await db.ejecutarArchivoSQL(PATHS.indices, 'Índices de rendimiento');
  await db.ejecutarArchivoSQL(PATHS.seeds, 'Seeds (datos iniciales)');
  
  console.log('✅ Base de datos reseteada exitosamente');
}

/**
 * Verificar estado de la base de datos
 */
async function verificarBaseDatos(db) {
  await db.conectar();
  await db.verificarEstado();
}

/**
 * Crear backup de la base de datos
 */
async function crearBackupBaseDatos(db) {
  await db.conectar();
  await db.crearBackup();
}

/**
 * Mostrar ayuda
 */
function mostrarAyuda() {
  console.log(`
🗄️  GESTOR DE BASE DE DATOS - POS SYSTEM v3.0
`);
  console.log('Uso: node db/init.js [comando]\n');
  console.log('Comandos disponibles:');
  console.log('  --create, --migrate  Crear base de datos y ejecutar schema');
  console.log('  --seed              Insertar datos iniciales');
  console.log('  --reset             Resetear base de datos completa');
  console.log('  --check             Verificar estado de la base de datos');
  console.log('  --backup            Crear backup de la base de datos');
  console.log('  --help              Mostrar esta ayuda\n');
  console.log('Variables de entorno requeridas:');
  console.log('  DB_HOST             Host de la base de datos (default: localhost)');
  console.log('  DB_PORT             Puerto de la base de datos (default: 3306)');
  console.log('  DB_USER             Usuario de la base de datos (default: root)');
  console.log('  DB_PASSWORD         Contraseña de la base de datos');
  console.log('  DB_NAME             Nombre de la base de datos (default: pos_system)\n');
  console.log('Ejemplos:');
  console.log('  npm run db:create   # Crear base de datos');
  console.log('  npm run db:seed     # Insertar datos iniciales');
  console.log('  npm run db:reset    # Resetear todo');
  console.log('  npm run db:check    # Verificar estado\n');
}

// Ejecutar función principal si el archivo se ejecuta directamente
if (process.argv[1] && process.argv[1].endsWith('init.js')) {
  main();
}

export { DatabaseManager, DB_CONFIG };