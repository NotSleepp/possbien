import logger from '../utils/logger.js';

// Middleware para logging de requests HTTP
export const requestLogger = (req, res, next) => {
    const startTime = Date.now();
    
    // Capturar información de la request
    const requestInfo = {
        method: req.method,
        url: req.originalUrl || req.url,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        headers: req.headers,
        query: req.query,
        params: req.params,
        timestamp: new Date().toISOString()
    };
    
    // Log de la request entrante
    logger.info(`Incoming ${req.method} request to ${req.originalUrl}`, {
        type: 'HTTP_REQUEST',
        ...requestInfo
    });
    
    // Capturar el body si existe (para POST, PUT, PATCH)
    if (req.body && Object.keys(req.body).length > 0) {
        // Filtrar información sensible
        const sanitizedBody = sanitizeBody(req.body);
        logger.info(`Request body for ${req.method} ${req.originalUrl}`, {
            type: 'HTTP_REQUEST_BODY',
            body: sanitizedBody,
            url: req.originalUrl
        });
    }
    
    // Interceptar la respuesta
    const originalSend = res.send;
    const originalJson = res.json;
    
    res.send = function(body) {
        const duration = Date.now() - startTime;
        
        logger.info(`Response sent for ${req.method} ${req.originalUrl}`, {
            type: 'HTTP_RESPONSE',
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            contentLength: body ? body.length : 0,
            url: req.originalUrl,
            method: req.method
        });
        
        // Si es un error (status >= 400), loggearlo como error
        if (res.statusCode >= 400) {
            logger.error(`HTTP Error ${res.statusCode} for ${req.method} ${req.originalUrl}`, {
                type: 'HTTP_ERROR',
                statusCode: res.statusCode,
                duration: `${duration}ms`,
                responseBody: body ? body.substring(0, 1000) : 'No body',
                requestInfo
            });
        }
        
        return originalSend.call(this, body);
    };
    
    res.json = function(obj) {
        const duration = Date.now() - startTime;
        
        logger.info(`JSON response sent for ${req.method} ${req.originalUrl}`, {
            type: 'HTTP_JSON_RESPONSE',
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            url: req.originalUrl,
            method: req.method
        });
        
        // Si es un error (status >= 400), loggearlo como error
        if (res.statusCode >= 400) {
            logger.error(`HTTP JSON Error ${res.statusCode} for ${req.method} ${req.originalUrl}`, {
                type: 'HTTP_JSON_ERROR',
                statusCode: res.statusCode,
                duration: `${duration}ms`,
                responseData: obj,
                requestInfo
            });
        }
        
        return originalJson.call(this, obj);
    };
    
    next();
};

// Middleware para capturar errores
export const errorLogger = (err, req, res, next) => {
    const errorInfo = {
        message: err.message,
        stack: err.stack,
        name: err.name,
        code: err.code,
        status: err.status || err.statusCode,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
    };
    
    logger.error(`Unhandled error in ${req.method} ${req.originalUrl}`, {
        type: 'UNHANDLED_ERROR',
        error: errorInfo,
        requestBody: sanitizeBody(req.body),
        query: req.query,
        params: req.params
    });
    
    next(err);
};

// Función para sanitizar el body removiendo información sensible
function sanitizeBody(body) {
    if (!body || typeof body !== 'object') {
        return body;
    }
    
    const sensitiveFields = [
        'password', 'passwd', 'pwd', 'secret', 'token', 'key', 'auth',
        'authorization', 'credential', 'pin', 'ssn', 'social', 'credit',
        'card', 'cvv', 'cvc', 'account'
    ];
    
    const sanitized = { ...body };
    
    Object.keys(sanitized).forEach(key => {
        const lowerKey = key.toLowerCase();
        if (sensitiveFields.some(field => lowerKey.includes(field))) {
            sanitized[key] = '[REDACTED]';
        } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
            sanitized[key] = sanitizeBody(sanitized[key]);
        }
    });
    
    return sanitized;
}

// Middleware para logging de performance
export const performanceLogger = (req, res, next) => {
    const startTime = process.hrtime.bigint();
    
    res.on('finish', () => {
        const endTime = process.hrtime.bigint();
        const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds
        
        if (duration > 1000) { // Log slow requests (>1 second)
            logger.warn(`Slow request detected: ${req.method} ${req.originalUrl}`, {
                type: 'SLOW_REQUEST',
                duration: `${duration.toFixed(2)}ms`,
                method: req.method,
                url: req.originalUrl,
                statusCode: res.statusCode
            });
        }
    });
    
    next();
};

// Middleware para logging de autenticación
export const authLogger = (req, res, next) => {
    // Si hay información de usuario en la request
    if (req.user) {
        logger.info(`Authenticated request from user ${req.user.id || req.user.email}`, {
            type: 'AUTH_REQUEST',
            userId: req.user.id,
            userEmail: req.user.email,
            url: req.originalUrl,
            method: req.method,
            ip: req.ip
        });
    }
    
    next();
};

export default {
    requestLogger,
    errorLogger,
    performanceLogger,
    authLogger
};