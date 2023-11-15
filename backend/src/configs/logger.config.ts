import { format, createLogger } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, printf } = format;
const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}][${level}]: ${message}`;
});

export const logger = createLogger({
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }), logFormat),
  transports: [
    new DailyRotateFile({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      filename: `logFile-error.log`,
      dirname: '../logs',
      maxFiles: '7d',
      maxSize: '10m',
    }),
    new DailyRotateFile({
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      filename: `logFile.log`,
      dirname: '../logs',
      maxFiles: '7d',
      maxSize: '10m',
    }),
  ],
});
