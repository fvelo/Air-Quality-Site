import fs from 'fs';
import path from 'path';
import { createLogger, format, transports } from 'winston';

// ensuring logs directory exists at project root
const logDir = path.resolve(__dirname, '..', '..', 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// define a custom log format for readability
const logFormat = format.printf(({ timestamp, level, message, ...meta }) => {
  const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return `${timestamp} [${level.toUpperCase()}] ${message}${metaString}`;
});

// create the Winston logger
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new transports.File({ filename: path.join(logDir, 'app.log'), handleExceptions: true }),
  ],
  exitOnError: false,
});

export default logger;