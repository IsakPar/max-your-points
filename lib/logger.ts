type LogLevel = 'error' | 'warn' | 'info' | 'debug'

interface LogContext {
  userId?: string
  action?: string
  resource?: string
  [key: string]: string | number | boolean | undefined
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private enabledLevels: LogLevel[] = this.isDevelopment 
    ? ['error', 'warn', 'info', 'debug'] 
    : ['error', 'warn']

  private shouldLog(level: LogLevel): boolean {
    return this.enabledLevels.includes(level)
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const contextStr = context ? ` | ${JSON.stringify(context)}` : ''
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`
  }

  error(message: string, context?: LogContext) {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message, context))
    }
  }

  warn(message: string, context?: LogContext) {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, context))
    }
  }

  info(message: string, context?: LogContext) {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message, context))
    }
  }

  debug(message: string, context?: LogContext) {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message, context))
    }
  }

  // Security-focused logging for admin actions
  auditLog(action: string, context: LogContext) {
    const auditMessage = `AUDIT: ${action}`
    this.info(auditMessage, { ...context, audit: true })
  }
}

export const logger = new Logger()

// Convenience exports
export const { error, warn, info, debug } = logger
export { type LogContext } 