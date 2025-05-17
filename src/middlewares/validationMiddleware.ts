import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { ICustomRequest } from '../types/ICustomRequest';
import { CustomError } from '../utils/customError';
import { ApiResponse } from '../utils/apiResponse';

export const validateRequest = (schema: Schema) => {
  return (req: ICustomRequest, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      throw new CustomError(error.details[0].message, 400);
    }
    next();
  };
};

export const validateUserId = (req: ICustomRequest, res: Response, next: NextFunction): void => {
  const userId = req.user?.userId;
  if (!userId) {
    ApiResponse.unauthorized(res, 'User ID is required');
    return;
  }
  next();
};

export const validateQuery = (schema: Schema) => {
  return (req: Request,  next: NextFunction) => {
    const { error } = schema.validate(req.query);
    if (error) {
      throw new CustomError(error.details[0].message, 400);
    }
    next();
  };
};

export const validateParams = (schema: Schema) => {
  return (req: ICustomRequest, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.params);
    if (error) {
      throw new CustomError(error.details[0].message, 400);
    }
    next();
  };
}; 