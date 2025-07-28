/**
 * SmartBizFlow - Comprehensive Error Logging Service
 * Provides centralized error logging, monitoring, and alerting
 */

import winston from 'winston';
import path from 'path';

// Define log levels
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define log colors
const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Add colors to winston
winston.addColors(logColors);

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!require('fs').existsSync(logsDir)) {
  require('fs').mkdirSync(logsDir, { recursive: true });
}

// Create Winston logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  levels: logLevels,
  format: logFormat,
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    
    // Error log file
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    }),
    
    // Combined log file
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    }),
    
    // Performance log file
    new winston.transports.File({
      filename: path.join(logsDir, 'performance.log'),
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ],
});

// Error types
export interface ErrorInfo {
  message: string;
  stack?: string;
  code?: string;
  context?: Record<string, any>;
  userId?: string;
  requestId?: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface PerformanceMetric {
  operation: string;
  duration: number;
  timestamp: Date;
  success: boolean;
  error?: string;
  context?: Record<string, any>;
}

export interface SecurityEvent {
  type: 'login' | 'logout' | 'access_denied' | 'suspicious_activity' | 'data_access';
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  details: Record<string, any>;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

class ErrorLoggingService {
  private static instance: ErrorLoggingService;
  private errorCount = 0;
  private performanceMetrics: PerformanceMetric[] = [];
  private securityEvents: SecurityEvent[] = [];

  private constructor() {
    // Set up global error handlers
    this.setupGlobalErrorHandlers();
  }

  public static getInstance(): ErrorLoggingService {
    if (!ErrorLoggingService.instance) {
      ErrorLoggingService.instance = new ErrorLoggingService();
    }
    return ErrorLoggingService.instance;
  }

  /**
   * Set up global error handlers
   */
  private setupGlobalErrorHandlers(): void {
    // Handle uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      this.logError({
        message: 'Uncaught Exception',
        stack: error.stack,
        context: { type: 'uncaught_exception' },
        severity: 'critical'
      });
      
      // Exit process after logging
      setTimeout(() => {
        process.exit(1);
      }, 1000);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
      this.logError({
        message: 'Unhandled Promise Rejection',
        stack: reason?.stack || reason?.toString(),
        context: { 
          type: 'unhandled_rejection',
          promise: promise.toString()
        },
        severity: 'critical'
      });
    });

    // Handle process warnings
    process.on('warning', (warning: any) => {
      this.logWarning({
        message: 'Process Warning',
        stack: warning.stack,
        context: { 
          type: 'process_warning',
          name: warning.name,
          message: warning.message
        },
        severity: 'medium'
      });
    });
  }

  /**
   * Log an error
   */
  logError(errorInfo: Omit<ErrorInfo, 'timestamp'>): void {
    const fullErrorInfo: ErrorInfo = {
      ...errorInfo,
      timestamp: new Date()
    };

    this.errorCount++;
    
    logger.error(`[ERROR] ${errorInfo.message}`, {
      error: fullErrorInfo,
      errorCount: this.errorCount
    });

    // Log to error file with additional context
    logger.error('Error Details', {
      message: errorInfo.message,
      stack: errorInfo.stack,
      code: errorInfo.code,
      context: errorInfo.context,
      userId: errorInfo.userId,
      requestId: errorInfo.requestId,
      severity: errorInfo.severity,
      timestamp: fullErrorInfo.timestamp.toISOString()
    });
  }

  /**
   * Log a warning
   */
  logWarning(warningInfo: Omit<ErrorInfo, 'timestamp'>): void {
    const fullWarningInfo: ErrorInfo = {
      ...warningInfo,
      timestamp: new Date()
    };

    logger.warn(`[WARNING] ${warningInfo.message}`, {
      warning: fullWarningInfo
    });
  }

  /**
   * Log an info message
   */
  logInfo(message: string, context?: Record<string, any>): void {
    logger.info(`[INFO] ${message}`, context);
  }

  /**
   * Log a debug message
   */
  logDebug(message: string, context?: Record<string, any>): void {
    logger.debug(`[DEBUG] ${message}`, context);
  }

  /**
   * Log HTTP requests
   */
  logHttp(method: string, url: string, statusCode: number, duration: number, userId?: string): void {
    logger.http(`[HTTP] ${method} ${url} - ${statusCode} (${duration}ms)`, {
      method,
      url,
      statusCode,
      duration,
      userId,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Log performance metrics
   */
  logPerformance(metric: Omit<PerformanceMetric, 'timestamp'>): void {
    const fullMetric: PerformanceMetric = {
      ...metric,
      timestamp: new Date()
    };

    this.performanceMetrics.push(fullMetric);

    // Keep only last 1000 metrics
    if (this.performanceMetrics.length > 1000) {
      this.performanceMetrics = this.performanceMetrics.slice(-1000);
    }

    logger.info(`[PERFORMANCE] ${metric.operation} - ${metric.duration}ms`, {
      metric: fullMetric
    });
  }

  /**
   * Log security events
   */
  logSecurityEvent(event: Omit<SecurityEvent, 'timestamp'>): void {
    const fullEvent: SecurityEvent = {
      ...event,
      timestamp: new Date()
    };

    this.securityEvents.push(fullEvent);

    // Keep only last 1000 security events
    if (this.securityEvents.length > 1000) {
      this.securityEvents = this.securityEvents.slice(-1000);
    }

    logger.warn(`[SECURITY] ${event.type} - ${event.details.message || 'Security event detected'}`, {
      event: fullEvent
    });
  }

  /**
   * Log database operations
   */
  logDatabaseOperation(operation: string, table: string, duration: number, success: boolean, error?: string): void {
    this.logPerformance({
      operation: `DB_${operation.toUpperCase()}`,
      duration,
      success,
      error,
      context: { table, operation }
    });
  }

  /**
   * Log API operations
   */
  logApiOperation(method: string, endpoint: string, duration: number, statusCode: number, userId?: string): void {
    this.logPerformance({
      operation: `API_${method.toUpperCase()}`,
      duration,
      success: statusCode < 400,
      context: { endpoint, statusCode, userId }
    });
  }

  /**
   * Log authentication events
   */
  logAuthEvent(type: 'login' | 'logout' | 'failed_login' | 'password_change', userId?: string, ipAddress?: string): void {
    this.logSecurityEvent({
      type: type === 'failed_login' ? 'access_denied' : 'login',
      userId,
      ipAddress,
      details: { authType: type },
      severity: type === 'failed_login' ? 'medium' : 'low'
    });
  }

  /**
   * Get error statistics
   */
  getErrorStats(): {
    totalErrors: number;
    errorsBySeverity: Record<string, number>;
    recentErrors: ErrorInfo[];
  } {
    return {
      totalErrors: this.errorCount,
      errorsBySeverity: {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0
      },
      recentErrors: []
    };
  }

  /**
   * Get performance statistics
   */
  getPerformanceStats(): {
    totalOperations: number;
    averageResponseTime: number;
    successRate: number;
    recentMetrics: PerformanceMetric[];
  } {
    if (this.performanceMetrics.length === 0) {
      return {
        totalOperations: 0,
        averageResponseTime: 0,
        successRate: 0,
        recentMetrics: []
      };
    }

    const successful = this.performanceMetrics.filter(m => m.success);
    const totalDuration = this.performanceMetrics.reduce((sum, m) => sum + m.duration, 0);

    return {
      totalOperations: this.performanceMetrics.length,
      averageResponseTime: totalDuration / this.performanceMetrics.length,
      successRate: (successful.length / this.performanceMetrics.length) * 100,
      recentMetrics: this.performanceMetrics.slice(-10)
    };
  }

  /**
   * Get security statistics
   */
  getSecurityStats(): {
    totalEvents: number;
    eventsByType: Record<string, number>;
    recentEvents: SecurityEvent[];
  } {
    const eventsByType: Record<string, number> = {};
    this.securityEvents.forEach(event => {
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
    });

    return {
      totalEvents: this.securityEvents.length,
      eventsByType,
      recentEvents: this.securityEvents.slice(-10)
    };
  }

  /**
   * Clear old logs
   */
  clearOldLogs(daysToKeep: number = 30): void {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    this.performanceMetrics = this.performanceMetrics.filter(
      metric => metric.timestamp > cutoffDate
    );

    this.securityEvents = this.securityEvents.filter(
      event => event.timestamp > cutoffDate
    );

    logger.info(`[MAINTENANCE] Cleared logs older than ${daysToKeep} days`);
  }

  /**
   * Export logs for analysis
   */
  exportLogs(): {
    errors: ErrorInfo[];
    performance: PerformanceMetric[];
    security: SecurityEvent[];
  } {
    return {
      errors: [],
      performance: this.performanceMetrics,
      security: this.securityEvents
    };
  }
}

// Export singleton instance
export const errorLogger = ErrorLoggingService.getInstance();
export default errorLogger; 