import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/customError";
import { ApiResponse } from "../utils/apiResponse";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  if (err instanceof CustomError) {
    ApiResponse.error(res, err.message, err.statusCode);
    return;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    ApiResponse.unauthorized(res, 'Invalid token');
    return;
  }

  if (err.name === 'TokenExpiredError') {
    ApiResponse.unauthorized(res, 'Token expired');
    return;
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    ApiResponse.badRequest(res, err.message);
    return;
  }

  // Default error
  ApiResponse.error(res, 'Internal server error', 500);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  ApiResponse.notFound(res, `Route ${req.originalUrl} not found`);
};
