import winston from 'winston';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear directorio de logs si no existe
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Formato personalizado para los logs
const customFormat = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
        let logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        
        // Si hay stack trace (errores), incluirlo
        if (stack) {
            logMessage += `\n${stack}`;
        }
        
        // Si hay metadata adicional, incluirla
        if (Object.keys(meta).length > 0) {
            logMessage += `\nMetadata: ${JSON.stringify(meta, null, 2)}`;
        }
        
        return logMessage;
    })
);

// Configuración del logger principal
const logger = winston.createLogger({
    level: 'debug',
    format: customFormat,
    transports: [
        // Log de todos los niveles en un archivo general
        new winston.transports.File({
            filename: path.join(logsDir, 'app.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            tailable: true
        }),
        
        // Log de errores en archivo separado
        new winston.transports.File({
            filename: path.join(logsDir, 'errors.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            tailable: true
        }),
        
        // Log diario
        new winston.transports.File({
            filename: path.join(logsDir, `app-${new Date().toISOString().split('T')[0]}.log`),
            maxsize: 10485760, // 10MB
            maxFiles: 30,
            tailable: true
        }),
        
        // Console output con colores
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

// Interceptar console.log, console.error, console.warn
const originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info,
    debug: console.debug
};

// Función para obtener información del caller
function getCallerInfo() {
    const stack = new Error().stack;
    const stackLines = stack.split('\n');
    
    // Buscar la primera línea que no sea de este archivo
    for (let i = 3; i < stackLines.length; i++) {
        const line = stackLines[i];
        if (line && !line.includes('logger.js') && !line.includes('node_modules')) {
            const match = line.match(/at\s+(.+)\s+\((.+):(\d+):(\d+)\)/);
            if (match) {
                return {
                    function: match[1],
                    file: path.basename(match[2]),
                    line: match[3],
                    column: match[4]
                };
            }
        }
    }
    return { function: 'unknown', file: 'unknown', line: '0', column: '0' };
}

// Sobrescribir console methods
console.log = (...args) => {
    const caller = getCallerInfo();
    const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ');
    
    logger.info(`[CONSOLE.LOG] ${message}`, { 
        caller: `${caller.file}:${caller.line}`,
        function: caller.function,
        originalArgs: args
    });
    originalConsole.log(...args);
};

console.error = (...args) => {
    const caller = getCallerInfo();
    const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ');
    
    logger.error(`[CONSOLE.ERROR] ${message}`, { 
        caller: `${caller.file}:${caller.line}`,
        function: caller.function,
        originalArgs: args
    });
    originalConsole.error(...args);
};

console.warn = (...args) => {
    const caller = getCallerInfo();
    const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ');
    
    logger.warn(`[CONSOLE.WARN] ${message}`, { 
        caller: `${caller.file}:${caller.line}`,
        function: caller.function,
        originalArgs: args
    });
    originalConsole.warn(...args);
};

console.info = (...args) => {
    const caller = getCallerInfo();
    const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ');
    
    logger.info(`[CONSOLE.INFO] ${message}`, { 
        caller: `${caller.file}:${caller.line}`,
        function: caller.function,
        originalArgs: args
    });
    originalConsole.info(...args);
};

console.debug = (...args) => {
    const caller = getCallerInfo();
    const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ');
    
    logger.debug(`[CONSOLE.DEBUG] ${message}`, { 
        caller: `${caller.file}:${caller.line}`,
        function: caller.function,
        originalArgs: args
    });
    originalConsole.debug(...args);
};

// Capturar errores no manejados
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    originalConsole.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    originalConsole.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Funciones de utilidad para logging manual
export const logInfo = (message, meta = {}) => logger.info(message, meta);
export const logError = (message, meta = {}) => logger.error(message, meta);
export const logWarn = (message, meta = {}) => logger.warn(message, meta);
export const logDebug = (message, meta = {}) => logger.debug(message, meta);

// Función para obtener logs recientes
export const getRecentLogs = (lines = 50, logType = 'app') => {
    const logFile = path.join(logsDir, `${logType}.log`);
    
    try {
        if (!fs.existsSync(logFile)) {
            return 'No hay logs disponibles aún.';
        }
        
        const content = fs.readFileSync(logFile, 'utf8');
        const logLines = content.split('\n').filter(line => line.trim());
        const recentLines = logLines.slice(-lines);
        
        return recentLines.join('\n');
    } catch (error) {
        return `Error al leer logs: ${error.message}`;
    }
};

// Función para limpiar logs antiguos
export const cleanOldLogs = (daysToKeep = 7) => {
    try {
        const files = fs.readdirSync(logsDir);
        const now = new Date();
        
        files.forEach(file => {
            const filePath = path.join(logsDir, file);
            const stats = fs.statSync(filePath);
            const daysDiff = (now - stats.mtime) / (1000 * 60 * 60 * 24);
            
            if (daysDiff > daysToKeep && file.includes('app-')) {
                fs.unlinkSync(filePath);
                logger.info(`Archivo de log antiguo eliminado: ${file}`);
            }
        });
    } catch (error) {
        logger.error('Error al limpiar logs antiguos:', error);
    }
};

export default logger;