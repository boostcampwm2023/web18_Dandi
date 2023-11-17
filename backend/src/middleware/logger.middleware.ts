import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { logger } from 'src/configs/logger.config';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = logger;

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.info(`Request ${req.method} ${req.originalUrl}`);
    res.on('finish', () => {
      this.logger.info(`Response ${req.method} ${req.originalUrl}: ${res.statusCode}`);
    });

    next();
  }
}
