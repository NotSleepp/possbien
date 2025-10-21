import fs from 'fs';
import path from 'path';

/**
 * Analizador de errores de logs
 * Proporciona funciones para analizar y reportar errores comunes
 */

/**
 * Lee un archivo de log y extrae los errores
 */
export const leerErroresDeLog = (rutaArchivo) => {
  try {
    const contenido = fs.readFileSync(rutaArchivo, 'utf8');
    const lineas = contenido.split('\n');
    
    const errores = lineas
      .filter(linea => linea.includes('ERROR'))
      .map(linea => {
        const match = linea.match(/\[(.*?)\] ERROR: (.*)/);
        if (match) {
          return {
            timestamp: match[1],
            mensaje: match[2],
            linea: linea
          };
        }
        return null;
      })
      .filter(error => error !== null);
    
    return errores;
  } catch (error) {
    console.error(`Error leyendo archivo de log: ${error.message}`);
    return [];
  }
};

/**
 * Analiza errores HTTP y los agrupa por tipo
 */
export const analizarErroresHTTP = (errores) => {
  const erroresHTTP = errores.filter(error => 
    error.mensaje.includes('HTTP') && error.mensaje.includes('Error')
  );
  
  const agrupados = {};
  
  erroresHTTP.forEach(error => {
    // Extraer método, endpoint y código de estado
    const match = error.mensaje.match(/HTTP.*Error (\d+) for (\w+) (.+)/);
    if (match) {
      const [, codigo, metodo, endpoint] = match;
      const clave = `${metodo} ${endpoint}`;
      
      if (!agrupados[clave]) {
        agrupados[clave] = {
          metodo,
          endpoint,
          codigo,
          count: 0,
          timestamps: []
        };
      }
      
      agrupados[clave].count++;
      agrupados[clave].timestamps.push(error.timestamp);
    }
  });
  
  return agrupados;
};

/**
 * Analiza errores de validación específicamente
 */
export const analizarErroresValidacion = (errores) => {
  const erroresValidacion = errores.filter(error => 
    error.mensaje.includes('Invalid input data') || 
    error.mensaje.includes('validation') ||
    error.mensaje.includes('ZodError')
  );
  
  const problemas = {};
  
  erroresValidacion.forEach(error => {
    // Intentar extraer detalles del error de validación
    if (error.mensaje.includes('Invalid input data')) {
      const siguienteLinea = error.linea;
      // Buscar patrones comunes de errores de validación
      if (siguienteLinea.includes('Expected boolean')) {
        const campo = siguienteLinea.match(/Path: \[(\w+)\]/);
        if (campo) {
          const nombreCampo = campo[1];
          if (!problemas[nombreCampo]) {
            problemas[nombreCampo] = {
              tipo: 'tipo_incorrecto',
              esperado: 'boolean',
              count: 0,
              ejemplos: []
            };
          }
          problemas[nombreCampo].count++;
          problemas[nombreCampo].ejemplos.push(error.timestamp);
        }
      }
    }
  });
  
  return problemas;
};

/**
 * Genera un reporte completo de errores
 */
export const generarReporteErrores = (rutasArchivos) => {
  const reporte = {
    timestamp: new Date().toISOString(),
    archivos: rutasArchivos,
    resumen: {
      totalErrores: 0,
      erroresHTTP: 0,
      erroresValidacion: 0
    },
    erroresPorEndpoint: {},
    problemasValidacion: {},
    recomendaciones: []
  };
  
  // Procesar cada archivo
  rutasArchivos.forEach(rutaArchivo => {
    const errores = leerErroresDeLog(rutaArchivo);
    reporte.resumen.totalErrores += errores.length;
    
    // Analizar errores HTTP
    const erroresHTTP = analizarErroresHTTP(errores);
    reporte.resumen.erroresHTTP += Object.keys(erroresHTTP).length;
    
    Object.keys(erroresHTTP).forEach(endpoint => {
      if (!reporte.erroresPorEndpoint[endpoint]) {
        reporte.erroresPorEndpoint[endpoint] = erroresHTTP[endpoint];
      } else {
        reporte.erroresPorEndpoint[endpoint].count += erroresHTTP[endpoint].count;
        reporte.erroresPorEndpoint[endpoint].timestamps.push(...erroresHTTP[endpoint].timestamps);
      }
    });
    
    // Analizar errores de validación
    const problemasValidacion = analizarErroresValidacion(errores);
    reporte.resumen.erroresValidacion += Object.keys(problemasValidacion).length;
    
    Object.keys(problemasValidacion).forEach(campo => {
      if (!reporte.problemasValidacion[campo]) {
        reporte.problemasValidacion[campo] = problemasValidacion[campo];
      } else {
        reporte.problemasValidacion[campo].count += problemasValidacion[campo].count;
        reporte.problemasValidacion[campo].ejemplos.push(...problemasValidacion[campo].ejemplos);
      }
    });
  });
  
  // Generar recomendaciones
  reporte.recomendaciones = generarRecomendaciones(reporte);
  
  return reporte;
};

/**
 * Genera recomendaciones basadas en el análisis de errores
 */
const generarRecomendaciones = (reporte) => {
  const recomendaciones = [];
  
  // Recomendaciones para errores HTTP frecuentes
  Object.keys(reporte.erroresPorEndpoint).forEach(endpoint => {
    const error = reporte.erroresPorEndpoint[endpoint];
    if (error.count > 5) {
      recomendaciones.push({
        tipo: 'endpoint_problematico',
        prioridad: 'alta',
        mensaje: `El endpoint ${endpoint} tiene ${error.count} errores. Revisar validación y lógica de negocio.`,
        endpoint: endpoint,
        count: error.count
      });
    }
  });
  
  // Recomendaciones para problemas de validación
  Object.keys(reporte.problemasValidacion).forEach(campo => {
    const problema = reporte.problemasValidacion[campo];
    if (problema.tipo === 'tipo_incorrecto') {
      recomendaciones.push({
        tipo: 'validacion_tipo',
        prioridad: 'media',
        mensaje: `El campo '${campo}' recibe tipos incorrectos. Implementar transformación automática de datos.`,
        campo: campo,
        esperado: problema.esperado,
        count: problema.count
      });
    }
  });
  
  return recomendaciones.sort((a, b) => {
    const prioridades = { alta: 3, media: 2, baja: 1 };
    return prioridades[b.prioridad] - prioridades[a.prioridad];
  });
};

/**
 * Guarda el reporte en un archivo JSON
 */
export const guardarReporte = (reporte, rutaDestino) => {
  try {
    fs.writeFileSync(rutaDestino, JSON.stringify(reporte, null, 2), 'utf8');
    console.log(`Reporte guardado en: ${rutaDestino}`);
    return true;
  } catch (error) {
    console.error(`Error guardando reporte: ${error.message}`);
    return false;
  }
};

/**
 * Función principal para analizar logs
 */
export const analizarLogs = (directorioLogs = './logs') => {
  const archivosLog = [
    path.join(directorioLogs, 'errors.log'),
    path.join(directorioLogs, 'app.log'),
    path.join(directorioLogs, `app-${new Date().toISOString().split('T')[0]}.log`)
  ].filter(archivo => fs.existsSync(archivo));
  
  if (archivosLog.length === 0) {
    console.log('No se encontraron archivos de log para analizar.');
    return null;
  }
  
  const reporte = generarReporteErrores(archivosLog);
  
  // Mostrar resumen en consola
  console.log('\n=== REPORTE DE ANÁLISIS DE ERRORES ===');
  console.log(`Total de errores encontrados: ${reporte.resumen.totalErrores}`);
  console.log(`Endpoints con errores: ${Object.keys(reporte.erroresPorEndpoint).length}`);
  console.log(`Problemas de validación: ${Object.keys(reporte.problemasValidacion).length}`);
  
  console.log('\n=== ENDPOINTS MÁS PROBLEMÁTICOS ===');
  Object.keys(reporte.erroresPorEndpoint)
    .sort((a, b) => reporte.erroresPorEndpoint[b].count - reporte.erroresPorEndpoint[a].count)
    .slice(0, 5)
    .forEach(endpoint => {
      const error = reporte.erroresPorEndpoint[endpoint];
      console.log(`${endpoint}: ${error.count} errores (código ${error.codigo})`);
    });
  
  console.log('\n=== RECOMENDACIONES PRINCIPALES ===');
  reporte.recomendaciones.slice(0, 5).forEach((rec, index) => {
    console.log(`${index + 1}. [${rec.prioridad.toUpperCase()}] ${rec.mensaje}`);
  });
  
  // Guardar reporte completo
  const rutaReporte = path.join(directorioLogs, `error-analysis-${Date.now()}.json`);
  guardarReporte(reporte, rutaReporte);
  
  return reporte;
};