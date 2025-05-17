import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'DD-MM-YYYY',
      level: 'error',
      maxFiles: '14d',
      maxSize: '20m'
    }),
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'DD-MM-YYYY',
      maxFiles: '14d',
      maxSize: '20m'
    })
  ]
});

export { logger }; 