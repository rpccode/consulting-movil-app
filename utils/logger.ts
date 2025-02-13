import { config } from '../src/config/env';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private prefix: string;

  constructor() {
    this.prefix = `[${config.env.toUpperCase()}]`;
  }

  private log(level: LogLevel, message: string, ...args: any[]) {
    if (!config.enableLogs && config.isProduction) return;

    const timestamp = new Date().toISOString();
    const logMessage = `${this.prefix} ${timestamp} [${level.toUpperCase()}]: ${message}`;

    switch (level) {
      case 'info':
        console.log(logMessage, ...args);
        break;
      case 'warn':
        console.warn(logMessage, ...args);
        break;
      case 'error':
        console.error(logMessage, ...args);
        break;
      case 'debug':
        if (!config.isProduction) {
          console.debug(logMessage, ...args);
        }
        break;
    }
  }

  info(message: string, ...args: any[]) {
    this.log('info', message, ...args);
  }

  warn(message: string, ...args: any[]) {
    this.log('warn', message, ...args);
  }

  error(message: string, ...args: any[]) {
    this.log('error', message, ...args);
  }

  debug(message: string, ...args: any[]) {
    this.log('debug', message, ...args);
  }
}

export const logger = new Logger();