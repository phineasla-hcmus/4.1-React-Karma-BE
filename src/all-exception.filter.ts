import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { ResponseError } from './error';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  unknownErrorId = 'unknown_error';

  constructor(private readonly logger: Logger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof HttpException) {
      this.handleHttpException(exception, host);
      return;
    }
    if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack, exception.name);
    } else {
      this.logger.error(
        'Invalid exception, expected an error object to be thrown.',
        undefined,
        exception,
      );
    }
    const [, response] = this.unpackHost(host);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      errorId: this.unknownErrorId,
      message: 'Unknown error has occurred',
    });
  }

  private handleHttpException(exception: HttpException, host: ArgumentsHost) {
    const [, response] = this.unpackHost(host);
    const context: string | any = exception.getResponse();
    let res: ResponseError;
    if (typeof context === 'string') {
      res = { errorId: this.unknownErrorId, message: context };
    } else if (
      typeof context.errorId === 'string' ||
      typeof context.message === 'string'
    ) {
      res = context;
    } else {
      res = {
        errorId: context.errorId || this.unknownErrorId,
        message: context.message || 'Caught HttpException but missing message',
      };
    }
    this.logger.error(res.errorId, undefined, res);
    response.status(exception.getStatus()).json(res);
  }

  private unpackHost(host: ArgumentsHost): [Request, Response, NextFunction] {
    return host.getArgs();
  }
}
