import { CustomError } from "../../utils/customError";
import { logger } from "../../utils/logger";

export abstract class BaseService {
  protected handleError(error: unknown, message: string, statusCode: number = 500): never {
    logger.error(`Error in ${this.constructor.name}:`, { 
      error,
      message,
      statusCode,
      stack: error instanceof Error ? error.stack : undefined
    });
    
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError(message, statusCode);
  }

  protected async executeWithErrorHandling<T>(
    operation: () => Promise<T>,
    errorMessage: string,
    statusCode: number = 500
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      this.handleError(error, errorMessage, statusCode);
    }
  }

 
} 