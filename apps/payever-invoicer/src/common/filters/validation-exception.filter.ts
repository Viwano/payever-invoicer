import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errors = exception.getResponse() as any;

    response.status(400).json({
      statusCode: 400,
      message: 'Validation failed',
      errors: errors.message,
      timestamp: new Date().toISOString(),
    });
  }
}
