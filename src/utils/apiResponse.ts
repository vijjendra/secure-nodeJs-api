import { Response } from "express";
import { ICustomResponse } from "../types/ICustomResponse";
import { CustomError } from './customError';
import { HttpStatusCode } from './customError';
import { logger } from './logger';

export class ApiResponse {
  /**
   * Send a success response with data
   * @param res Express response object
   * @param data Response data
   * @param message Success message
   * @param statusCode HTTP status code (default: 200)
   */
  static success<T>(
    res: Response,
    data: T,
    message: string = "Success",
    statusCode: number = HttpStatusCode.OK
  ): Response {
    const response: ICustomResponse = {
      isSuccess: true,
      data,
      message,
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Send an error response
   * @param res Express response object
   * @param message Error message
   * @param statusCode HTTP status code (default: 500)
   * @param errors Additional error details
   */
  static error(
    res: Response,
    message: string = "Internal Server Error",
    statusCode: number = HttpStatusCode.INTERNAL_SERVER_ERROR,
    errors?: any
  ): Response {
    const response: ICustomResponse = {
      isSuccess: false,
      data: null,
      message,
      errors,
    };
    return res.status(statusCode).json(response);
  }

  

  /**
   * Send a not found response
   * @param res Express response object
   * @param message Error message (default: "Resource not found")
   */
  static notFound(
    res: Response,
    message: string = "Resource not found"
  ): Response {
    return this.error(res, message, HttpStatusCode.NOT_FOUND);
  }

  /**
   * Send a bad request response
   * @param res Express response object
   * @param message Error message (default: "Bad request")
   * @param errors Additional error details
   */
  static badRequest(
    res: Response,
    message: string = "Bad request",
    errors?: any
  ): Response {
    return this.error(res, message, HttpStatusCode.BAD_REQUEST, errors);
  }

  /**
   * Send a created response
   * @param res Express response object
   * @param data Created resource data
   * @param message Success message (default: "Resource created successfully")
   */
  static created<T>(
    res: Response,
    data: T,
    message: string = "Resource created successfully"
  ): Response {
    return this.success(res, data, message, HttpStatusCode.CREATED);
  }

  /**
   * Send a no content response
   * @param res Express response object
   */
  static noContent(res: Response): Response {
    return res.status(HttpStatusCode.OK).send();
  }

  /**
   * Send an unauthorized response
   * @param res Express response object
   * @param message Error message (default: "Unauthorized - Access Denied")
   */
  static unauthorized(
    res: Response,
    message: string = "Unauthorized - Access Denied"
  ): Response {
    return this.error(res, message, HttpStatusCode.UNAUTHORIZED);
  }

  /**
   * Send a forbidden response
   * @param res Express response object
   * @param message Error message (default: "Forbidden")
   */
  static forbidden(
    res: Response,
    message: string = "Forbidden"
  ): Response {
    return this.error(res, message, HttpStatusCode.FORBIDDEN);
  }

  /**
   * Send a too many requests response
   * @param res Express response object
   * @param message Error message (default: "Too many requests")
   */
  static tooManyRequests(
    res: Response,
    message: string = "Too many requests"
  ): Response {
    return this.error(res, message, HttpStatusCode.TOO_MANY_REQUESTS);
  }

  /**
   * Handle controller errors consistently
   * @param res Express response object
   * @param error Error object
   */
  static handleError(res: Response, error: any): Response {
    if (error instanceof CustomError) {
      logger.error('Custom error caught:', {
        error,
        statusCode: error.statusCode,
        type: error.type,
        details: error.details
      });
      return this.error(res, error.message, error.statusCode, error.details);
    }

    logger.error('Controller Error:', {
      error,
      stack: error instanceof Error ? error.stack : undefined
    });
    return this.error(res, 'Internal server error', HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
}
