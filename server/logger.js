import fs from 'fs';
import path from 'path';
import winston from 'winston';

// Get the current directory
const __filename = new URL(import.meta.url).pathname; // Get the current file path
const __dirname = path.dirname(__filename); // Get the directory name from the file path

// Create logs directory if it doesn't exist
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Define a custom log format
const customFormat = winston.format.printf(
  ({ timestamp, level, message, ...metadata }) => {
    let log = `${timestamp} [${level}]: ${message} `;
    if (metadata && Object.keys(metadata).length) {
      log += JSON.stringify(metadata);
    }
    return log;
  }
);

// Configure Winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), customFormat),
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
    }),
  ],
});

// Log to the console as well in development mode
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), customFormat),
    })
  );
}

export default logger;
