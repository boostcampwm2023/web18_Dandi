import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { logger } from 'src/configs/logger.config';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = logger;

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException();
    }

    const response = (exception as HttpException).getResponse();

    this.logger.error(`${req.url}\n${exception.stack}`);
    res.status(exception.getStatus()).json(response);
  }
}
