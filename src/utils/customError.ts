/**
 * HTTP Status Codes enum for better type safety and maintainability
 */
export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503
}

/**
 * Error types for better error categorization
 */
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  INTERNAL = 'INTERNAL'
}

/**
 * Custom error class that extends the built-in Error class
 * with additional properties and functionality for better error handling
 */
export class CustomError extends Error {
  public readonly statusCode: HttpStatusCode;
  public readonly type: ErrorType;
  public readonly timestamp: Date;
  public readonly details?: Record<string, any>;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: HttpStatusCode = HttpStatusCode.INTERNAL_SERVER_ERROR,
    type: ErrorType = ErrorType.INTERNAL,
    details?: Record<string, any>,
    isOperational: boolean = true
  ) {
    super(message);
    
    // Set the prototype explicitly
    Object.setPrototypeOf(this, new.target.prototype);
    
    // Set error properties
    this.statusCode = statusCode;
    this.type = type;
    this.timestamp = new Date();
    this.details = details;
    this.isOperational = isOperational;

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Create a validation error
   */
  static validationError(message: string, details?: Record<string, any>): CustomError {
    return new CustomError(
      message,
      HttpStatusCode.BAD_REQUEST,
      ErrorType.VALIDATION,
      details
    );
  }

  /**
   * Create an authentication error
   */
  static authenticationError(message: string = 'Authentication failed'): CustomError {
    return new CustomError(
      message,
      HttpStatusCode.UNAUTHORIZED,
      ErrorType.AUTHENTICATION
    );
  }

  /**
   * Create an authorization error
   */
  static authorizationError(message: string = 'Not authorized'): CustomError {
    return new CustomError(
      message,
      HttpStatusCode.FORBIDDEN,
      ErrorType.AUTHORIZATION
    );
  }

  /**
   * Create a not found error
   */
  static notFoundError(message: string = 'Resource not found'): CustomError {
    return new CustomError(
      message,
      HttpStatusCode.NOT_FOUND,
      ErrorType.NOT_FOUND
    );
  }

  /**
   * Create a conflict error
   */
  static conflictError(message: string, details?: Record<string, any>): CustomError {
    return new CustomError(
      message,
      HttpStatusCode.CONFLICT,
      ErrorType.CONFLICT,
      details
    );
  }

  /**
   * Create a bad request error
   */
  static badRequestError(message: string, details?: Record<string, any>): CustomError {
    return new CustomError(
      message,
      HttpStatusCode.BAD_REQUEST,
      ErrorType.VALIDATION,
      details
    );
  }

  /**
   * Create an internal server error
   */
  static internalError(message: string = 'Internal server error'): CustomError {
    return new CustomError(
      message,
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      ErrorType.INTERNAL,
      undefined,
      false
    );
  }

  /**
   * Convert error to a plain object for logging or API responses
   */
  toJSON(): Record<string, any> {
    return {
      message: this.message,
      statusCode: this.statusCode,
      type: this.type,
      timestamp: this.timestamp,
      details: this.details,
      stack: this.stack
    };
  }

  /**
   * Check if the error is operational (expected) or programming (unexpected)
   */
  isOperationalError(): boolean {
    return this.isOperational;
  }
}
