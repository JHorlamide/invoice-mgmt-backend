import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import morgan, { StreamOptions } from 'morgan';

const { combine, timestamp, json, colorize } = format;

export class Logger {
   // Create a logger instance.
   static getInstance = (service = "genera-purpose") => {
      const logger = createLogger({
         defaultMeta: { service },
         format: combine( // Specifies that we want our logs to be in JSON format and include the timestamp
            timestamp(),
            json(),
            format.colorize({ all: true }),
            format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
         ),
         transports: [ // Defines that we want our error logs to go to a file named errors.log file
            new transports.Console(),
            Logger.getHttpLoggerTransport(),
            Logger.getInfoLoggerTransport(),
            Logger.getErrorLoggerTransport(),
         ]
      })

      // This configuration will send all of the logs into the console.
      if (process.env.NODE_ENV !== 'production') {
         logger.add(
            new transports.Console({
               format: format.combine(format.colorize(), format.simple()),
            }),
         );
      }

      return logger;
   }

   static errorFilter = format((info, opts) => {
      return info.level === 'error' ? info : false;
   })

   static infoFilter = format((info, opts) => {
      return info.level === 'info' ? info : false;
   });

   static httpFilter = format((info, opts) => {
      return info.level === 'http' ? info : false;
   });

   static getInfoLoggerTransport = () => {
      return new DailyRotateFile({
         filename: 'logs/info-%DATE%.log',
         datePattern: 'HH-DD-MM-YYYY',
         zippedArchive: true,
         maxSize: '10m',
         maxFiles: '14d',
         level: 'info',
         format: format.combine(
            Logger.infoFilter(),
            timestamp(),
            json(),
         ),
      });
   }

   static getErrorLoggerTransport = () => {
      return new DailyRotateFile({
         filename: 'logs/error-%DATE%.log',
         datePattern: 'HH-DD-MM-YYYY',
         zippedArchive: true,
         maxSize: '10m',
         maxFiles: '14d',
         level: 'error',
         format: format.combine(Logger.errorFilter(), format.timestamp(), json()),
      });
   }

   static getHttpLoggerTransport = () => {
      return new DailyRotateFile({
         filename: 'logs/http-%DATE%.log',
         datePattern: 'HH-DD-MM-YYYY',
         zippedArchive: true,
         maxSize: '10m',
         maxFiles: '14d',
         level: 'http',
         format: format.combine(Logger.httpFilter(), format.timestamp(), json()),
      });
   }

   static getHttpLoggerInstance = () => {
      const logger = Logger.getInstance();
  
      const stream: StreamOptions = {
        write: (message: string) => logger.http(message),
      };
  
      const skip = () => {
        const env = process.env.NODE_ENV || 'development';
        return env !== 'development';
      };
  
      const morganMiddleware = morgan(':method :url :status :res[content-length] - :response-time ms :remote-addr', {
        stream,
        skip,
      });
  
      return morganMiddleware;
    };
}
