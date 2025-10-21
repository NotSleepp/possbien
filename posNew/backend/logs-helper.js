#!/usr/bin/env node

/**
 * Helper script para ver logs del sistema POS
 * Uso: node logs-helper.js [comando] [opciones]
 * 
 * Comandos disponibles:
 * - recent: Ver logs recientes
 * - errors: Ver solo errores
 * - today: Ver logs del día actual
 * - files: Listar archivos de logs
 * - clean: Limpiar logs antiguos
 * - watch: Ver logs en tiempo real
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logsDir = path.join(__dirname, 'logs');

// Colores para la consola
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
};

function colorize(text, color) {
    return `${colors[color]}${text}${colors.reset}`;
}

function showHelp() {
    console.log(colorize('\n📋 POS Logging System Helper', 'cyan'));
    console.log(colorize('================================', 'cyan'));
    console.log('\nComandos disponibles:');
    console.log(colorize('  recent [lines]', 'green') + '     - Ver logs recientes (default: 50 líneas)');
    console.log(colorize('  errors [lines]', 'red') + '     - Ver solo errores (default: 50 líneas)');
    console.log(colorize('  today [lines]', 'blue') + '      - Ver logs del día actual (default: 100 líneas)');
    console.log(colorize('  files', 'yellow') + '             - Listar archivos de logs disponibles');
    console.log(colorize('  clean [days]', 'magenta') + '     - Limpiar logs antiguos (default: 7 días)');
    console.log(colorize('  watch', 'white') + '             - Ver logs en tiempo real (Ctrl+C para salir)');
    console.log(colorize('  stats', 'cyan') + '             - Ver estadísticas de logs');
    console.log('\nEjemplos:');
    console.log('  node logs-helper.js recent 100');
    console.log('  node logs-helper.js errors');
    console.log('  node logs-helper.js clean 14');
    console.log('  node logs-helper.js watch\n');
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function readLogFile(filename, lines = null, tail = true) {
    const filePath = path.join(logsDir, filename);
    
    if (!fs.existsSync(filePath)) {
        return null;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (lines) {
        const logLines = content.split('\n').filter(line => line.trim());
        if (tail) {
            content = logLines.slice(-lines).join('\n');
        } else {
            content = logLines.slice(0, lines).join('\n');
        }
    }
    
    return content;
}

function showRecent(lines = 50) {
    console.log(colorize(`\n📄 Últimos ${lines} logs:`, 'green'));
    console.log(colorize('='.repeat(50), 'green'));
    
    const content = readLogFile('app.log', lines);
    if (content) {
        console.log(content);
    } else {
        console.log(colorize('No hay logs disponibles aún.', 'yellow'));
    }
}

function showErrors(lines = 50) {
    console.log(colorize(`\n❌ Últimos ${lines} errores:`, 'red'));
    console.log(colorize('='.repeat(50), 'red'));
    
    const content = readLogFile('errors.log', lines);
    if (content) {
        console.log(content);
    } else {
        console.log(colorize('No hay errores registrados aún.', 'yellow'));
    }
}

function showToday(lines = 100) {
    const today = new Date().toISOString().split('T')[0];
    const todayFile = `app-${today}.log`;
    
    console.log(colorize(`\n📅 Logs de hoy (${today}):`, 'blue'));
    console.log(colorize('='.repeat(50), 'blue'));
    
    const content = readLogFile(todayFile, lines);
    if (content) {
        console.log(content);
    } else {
        console.log(colorize('No hay logs para el día de hoy aún.', 'yellow'));
    }
}

function listFiles() {
    console.log(colorize('\n📁 Archivos de logs disponibles:', 'yellow'));
    console.log(colorize('='.repeat(50), 'yellow'));
    
    if (!fs.existsSync(logsDir)) {
        console.log(colorize('Directorio de logs no existe aún.', 'yellow'));
        return;
    }
    
    const files = fs.readdirSync(logsDir);
    
    if (files.length === 0) {
        console.log(colorize('No hay archivos de logs aún.', 'yellow'));
        return;
    }
    
    files.forEach(file => {
        const filePath = path.join(logsDir, file);
        const stats = fs.statSync(filePath);
        const size = formatBytes(stats.size);
        const modified = stats.mtime.toLocaleString();
        
        console.log(`${colorize(file, 'white')} - ${colorize(size, 'cyan')} - ${colorize(modified, 'magenta')}`);
    });
}

function cleanLogs(daysToKeep = 7) {
    console.log(colorize(`\n🧹 Limpiando logs antiguos (manteniendo ${daysToKeep} días)...`, 'magenta'));
    
    if (!fs.existsSync(logsDir)) {
        console.log(colorize('Directorio de logs no existe.', 'yellow'));
        return;
    }
    
    const files = fs.readdirSync(logsDir);
    const now = new Date();
    let deletedCount = 0;
    
    files.forEach(file => {
        if (file.includes('app-') && file.endsWith('.log')) {
            const filePath = path.join(logsDir, file);
            const stats = fs.statSync(filePath);
            const daysDiff = (now - stats.mtime) / (1000 * 60 * 60 * 24);
            
            if (daysDiff > daysToKeep) {
                fs.unlinkSync(filePath);
                console.log(colorize(`Eliminado: ${file}`, 'red'));
                deletedCount++;
            }
        }
    });
    
    if (deletedCount === 0) {
        console.log(colorize('No hay archivos antiguos para eliminar.', 'green'));
    } else {
        console.log(colorize(`Se eliminaron ${deletedCount} archivos antiguos.`, 'green'));
    }
}

function watchLogs() {
    console.log(colorize('\n👀 Monitoreando logs en tiempo real...', 'white'));
    console.log(colorize('Presiona Ctrl+C para salir\n', 'yellow'));
    
    const appLogPath = path.join(logsDir, 'app.log');
    
    if (!fs.existsSync(appLogPath)) {
        console.log(colorize('Archivo de logs no existe aún. Esperando...', 'yellow'));
    }
    
    let lastSize = 0;
    
    const checkForChanges = () => {
        if (fs.existsSync(appLogPath)) {
            const stats = fs.statSync(appLogPath);
            
            if (stats.size > lastSize) {
                const content = fs.readFileSync(appLogPath, 'utf8');
                const newContent = content.slice(lastSize);
                process.stdout.write(newContent);
                lastSize = stats.size;
            }
        }
    };
    
    // Verificar cambios cada segundo
    const interval = setInterval(checkForChanges, 1000);
    
    // Manejar Ctrl+C
    process.on('SIGINT', () => {
        clearInterval(interval);
        console.log(colorize('\n\n👋 Monitoreo detenido.', 'yellow'));
        process.exit(0);
    });
}

function showStats() {
    console.log(colorize('\n📊 Estadísticas de logs:', 'cyan'));
    console.log(colorize('='.repeat(50), 'cyan'));
    
    if (!fs.existsSync(logsDir)) {
        console.log(colorize('Directorio de logs no existe aún.', 'yellow'));
        return;
    }
    
    const files = fs.readdirSync(logsDir);
    let totalSize = 0;
    let totalFiles = files.length;
    
    files.forEach(file => {
        const filePath = path.join(logsDir, file);
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
    });
    
    console.log(`Total de archivos: ${colorize(totalFiles, 'white')}`);
    console.log(`Tamaño total: ${colorize(formatBytes(totalSize), 'white')}`);
    console.log(`Directorio: ${colorize(logsDir, 'white')}`);
    
    if (totalFiles > 0) {
        console.log(`\nArchivos más recientes:`);
        files
            .map(file => ({
                name: file,
                stats: fs.statSync(path.join(logsDir, file))
            }))
            .sort((a, b) => b.stats.mtime - a.stats.mtime)
            .slice(0, 5)
            .forEach(({ name, stats }) => {
                console.log(`  ${colorize(name, 'white')} - ${colorize(formatBytes(stats.size), 'cyan')}`);
            });
    }
}

// Procesar argumentos de línea de comandos
const args = process.argv.slice(2);
const command = args[0];
const param = args[1];

switch (command) {
    case 'recent':
        showRecent(param ? parseInt(param) : 50);
        break;
    case 'errors':
        showErrors(param ? parseInt(param) : 50);
        break;
    case 'today':
        showToday(param ? parseInt(param) : 100);
        break;
    case 'files':
        listFiles();
        break;
    case 'clean':
        cleanLogs(param ? parseInt(param) : 7);
        break;
    case 'watch':
        watchLogs();
        break;
    case 'stats':
        showStats();
        break;
    default:
        showHelp();
        break;
}