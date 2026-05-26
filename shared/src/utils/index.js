"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceUnavailableError = exports.UnauthorizedError = exports.ValidationError = exports.NotFoundError = void 0;
exports.createLogger = createLogger;
exports.successResponse = successResponse;
exports.errorResponse = errorResponse;
const winston_1 = __importDefault(require("winston"));
function createLogger(serviceName) {
    const logger = winston_1.default.createLogger({
        level: process.env.LOG_LEVEL || 'info',
        defaultMeta: { service: serviceName },
        format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.metadata({ fillExcept: ['level', 'message', 'timestamp', 'service'] }), winston_1.default.format.json()),
        transports: [new winston_1.default.transports.Console()],
    });
    return {
        info: (message, meta) => logger.info(message, meta),
        warn: (message, meta) => logger.warn(message, meta),
        error: (message, meta) => logger.error(message, meta),
        debug: (message, meta) => logger.debug(message, meta),
    };
}
function successResponse(data, message) {
    return { success: true, data, message };
}
function errorResponse(error, errors) {
    return { success: false, error, errors };
}
class NotFoundError extends Error {
    constructor(resource) {
        super(`${resource} not found`);
        this.statusCode = 404;
        this.name = 'NotFoundError';
    }
}
exports.NotFoundError = NotFoundError;
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 400;
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
class UnauthorizedError extends Error {
    constructor(message = 'Unauthorized') {
        super(message);
        this.statusCode = 401;
        this.name = 'UnauthorizedError';
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ServiceUnavailableError extends Error {
    constructor(service) {
        super(`${service} is currently unavailable`);
        this.statusCode = 503;
        this.name = 'ServiceUnavailableError';
    }
}
exports.ServiceUnavailableError = ServiceUnavailableError;
//# sourceMappingURL=index.js.map