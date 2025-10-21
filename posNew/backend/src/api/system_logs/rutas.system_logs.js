import express from 'express';
import * as controlador from './controlador.system_logs.js';
import { getRecentLogs, cleanOldLogs } from '../../utils/logger.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const logsDir = path.join(__dirname, '../../../logs');

// Rutas originales para system logs (base de datos)
router.post('/', controlador.crearSystemLog);
router.get('/por-empresa/:idEmpresa', controlador.obtenerTodosSystemLogs);
router.get('/:id', controlador.obtenerSystemLogPorId);
router.put('/:id', controlador.actualizarSystemLog);
router.delete('/:id', controlador.eliminarSystemLog);

// === NUEVAS RUTAS PARA LOGGING EN TIEMPO REAL ===

// GET /api/system-logs/live/recent - Obtener logs recientes del archivo
router.get('/live/recent', (req, res) => {
    try {
        const { lines = 50, type = 'app' } = req.query;
        const logs = getRecentLogs(parseInt(lines), type);
        
        res.json({
            success: true,
            data: {
                logs: logs,
                lines: parseInt(lines),
                type: type,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener logs recientes',
            error: error.message
        });
    }
});

// GET /api/system-logs/live/files - Listar archivos de logs disponibles
router.get('/live/files', (req, res) => {
    try {
        if (!fs.existsSync(logsDir)) {
            return res.json({
                success: true,
                data: {
                    files: [],
                    message: 'Directorio de logs no existe aún'
                }
            });
        }
        
        const files = fs.readdirSync(logsDir).map(file => {
            const filePath = path.join(logsDir, file);
            const stats = fs.statSync(filePath);
            
            return {
                name: file,
                size: stats.size,
                created: stats.birthtime,
                modified: stats.mtime,
                sizeFormatted: formatBytes(stats.size)
            };
        }).sort((a, b) => b.modified - a.modified);
        
        res.json({
            success: true,
            data: {
                files: files,
                totalFiles: files.length,
                logsDirectory: logsDir
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al listar archivos de logs',
            error: error.message
        });
    }
});

// GET /api/system-logs/live/file/:filename - Obtener contenido de un archivo específico
router.get('/live/file/:filename', (req, res) => {
    try {
        const { filename } = req.params;
        const { lines, tail = true } = req.query;
        
        // Validar nombre de archivo para seguridad
        if (!filename.match(/^[a-zA-Z0-9._-]+\.log$/)) {
            return res.status(400).json({
                success: false,
                message: 'Nombre de archivo inválido'
            });
        }
        
        const filePath = path.join(logsDir, filename);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: 'Archivo de log no encontrado'
            });
        }
        
        let content = fs.readFileSync(filePath, 'utf8');
        
        if (lines) {
            const logLines = content.split('\n').filter(line => line.trim());
            const numLines = parseInt(lines);
            
            if (tail === 'true') {
                content = logLines.slice(-numLines).join('\n');
            } else {
                content = logLines.slice(0, numLines).join('\n');
            }
        }
        
        res.json({
            success: true,
            data: {
                filename: filename,
                content: content,
                lines: lines ? parseInt(lines) : 'all',
                tail: tail === 'true'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al leer archivo de log',
            error: error.message
        });
    }
});

// GET /api/system-logs/live/errors - Obtener solo logs de errores
router.get('/live/errors', (req, res) => {
    try {
        const { lines = 50 } = req.query;
        const errorLogs = getRecentLogs(parseInt(lines), 'errors');
        
        res.json({
            success: true,
            data: {
                errorLogs: errorLogs,
                lines: parseInt(lines),
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener logs de errores',
            error: error.message
        });
    }
});

// GET /api/system-logs/live/today - Obtener logs del día actual
router.get('/live/today', (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const todayLogFile = `app-${today}.log`;
        const { lines = 100 } = req.query;
        
        const filePath = path.join(logsDir, todayLogFile);
        
        if (!fs.existsSync(filePath)) {
            return res.json({
                success: true,
                data: {
                    logs: 'No hay logs para el día de hoy aún',
                    date: today,
                    message: 'Archivo de log diario no existe'
                }
            });
        }
        
        let content = fs.readFileSync(filePath, 'utf8');
        const logLines = content.split('\n').filter(line => line.trim());
        const recentLines = logLines.slice(-parseInt(lines));
        
        res.json({
            success: true,
            data: {
                logs: recentLines.join('\n'),
                date: today,
                totalLines: logLines.length,
                returnedLines: recentLines.length
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener logs del día',
            error: error.message
        });
    }
});

// POST /api/system-logs/live/clean - Limpiar logs antiguos
router.post('/live/clean', (req, res) => {
    try {
        const { daysToKeep = 7 } = req.body;
        
        cleanOldLogs(parseInt(daysToKeep));
        
        res.json({
            success: true,
            message: `Logs antiguos limpiados (manteniendo ${daysToKeep} días)`,
            daysToKeep: parseInt(daysToKeep)
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al limpiar logs antiguos',
            error: error.message
        });
    }
});

// GET /api/system-logs/live/stats - Estadísticas de logs
router.get('/live/stats', (req, res) => {
    try {
        if (!fs.existsSync(logsDir)) {
            return res.json({
                success: true,
                data: {
                    totalFiles: 0,
                    totalSize: 0,
                    message: 'Directorio de logs no existe aún'
                }
            });
        }
        
        const files = fs.readdirSync(logsDir);
        let totalSize = 0;
        let fileStats = [];
        
        files.forEach(file => {
            const filePath = path.join(logsDir, file);
            const stats = fs.statSync(filePath);
            totalSize += stats.size;
            
            fileStats.push({
                name: file,
                size: stats.size,
                sizeFormatted: formatBytes(stats.size),
                created: stats.birthtime,
                modified: stats.mtime
            });
        });
        
        res.json({
            success: true,
            data: {
                totalFiles: files.length,
                totalSize: totalSize,
                totalSizeFormatted: formatBytes(totalSize),
                files: fileStats,
                logsDirectory: logsDir
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas de logs',
            error: error.message
        });
    }
});

// Función auxiliar para formatear bytes
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export default router;
