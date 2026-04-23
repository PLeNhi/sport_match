import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";

interface ErrorResponse {
  statusCode: number;
  message: string;
  timestamp: string;
  error?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";
    let error = "Internal Server Error";

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();
      if (typeof response === "object") {
        message = (response as any).message || exception.message;
        error = (response as any).error || exception.name;
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
    }

    const errorResponse: ErrorResponse = {
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      error,
    };

    console.error("Exception caught:", {
      path: request.url,
      method: request.method,
      statusCode: status,
      error: exception,
    });

    response.status(status).json(errorResponse);
  }
}
