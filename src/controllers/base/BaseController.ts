import { Response, NextFunction } from 'express';
import { CustomError } from '../../utils/customError';
import { ApiResponse } from '../../utils/apiResponse';
import { ICustomRequest } from "../../types/ICustomRequest";

export abstract class BaseController {
  protected abstract service: any;

  protected async handleRequest(
    req: ICustomRequest,
    res: Response,
    next: NextFunction,
    handler: () => Promise<any>
  ): Promise<void> {
    try {
      const result = await handler();
      if (result) {
        this.sendResponse(res, result);
      } else {
        ApiResponse.notFound(res);
      }
    } catch (error) {
      ApiResponse.handleError(res, error);
    }
  }

  protected sendResponse(res: Response, data: any): void {
   if (data.isSuccess !== undefined) {
      // If the data already has isSuccess, it's already formatted correctly
      res.status(200).json(data);
    } else {
      ApiResponse.success(res, data);
    }
  }

  protected handleError(error: any, res: Response, next: NextFunction): void {
    ApiResponse.handleError(res, error);
  }

  protected validateRequest(req: ICustomRequest, schema: any): void {
    const { error } = schema.validate(req.body);
    if (error) {
      throw new CustomError(error.details[0].message, 400);
    }
  }

  protected getPaginationParams(req: ICustomRequest): { pageNo: number; pageSize: number } {
    const pageNo = parseInt(req.query.pageNo as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    return { pageNo, pageSize };
  }

  /**
   * Gets the userId from the request and throws an error if not found
   * @throws CustomError with 401 if user is not authenticated
   */
  protected getUserId(req: ICustomRequest): string {
    const userId = req.user?.userId;
    if (!userId) {
      throw CustomError.authenticationError();
    }
    return userId;
  }

  /**
   * Gets the userId from the request and returns null if not found
   * @returns userId if authenticated, null otherwise
   */
  protected getUserIdOrNull(req: ICustomRequest): string | null {
    return req.user?.userId || null;
  }

 
} 