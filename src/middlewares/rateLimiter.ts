import { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import { ApiResponse } from "../utils/apiResponse";

interface RateLimitConfig {
  windowMs: number;
  max: number;
  message?: string;
  standardHeaders?: boolean;
  legacyHeaders?: boolean;
  skipFailedRequests?: boolean;
  skipSuccessfulRequests?: boolean;
  keyGenerator?: (req: Request) => string;
  handler?: (req: Request, res: Response) => void;
  skip?: (req: Request) => boolean;
}

class RateLimiterMiddleware {
  private static defaultConfig: RateLimitConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skipFailedRequests: false,
    skipSuccessfulRequests: false,
  };

  private static getClientIp(req: Request): string {
    const xForwardedFor = req.headers["x-forwarded-for"];
    if (typeof xForwardedFor === "string") {
      return xForwardedFor.split(",")[0].trim();
    }
    return req.ip || "unknown";
  }

  static create(config: Partial<RateLimitConfig> = {}) {
    const finalConfig: RateLimitConfig = {
      ...this.defaultConfig,
      ...config,
      keyGenerator: config.keyGenerator || this.getClientIp,
      handler: (req: Request, res: Response) => {
        ApiResponse.tooManyRequests( 
          res, 
         this.defaultConfig.message 
        );
      },
    };

    return rateLimit(finalConfig);
  }

  static strict() {
    return this.create({
      windowMs: 60 * 1000, // 1 minute
      max: 30, // 30 requests per minute
      message: "Too many requests, please try again later",
    });
  }

  static moderate() {
    return this.create({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // 100 requests per 15 minutes
      message: "Too many requests, please try again later",
    });
  }

  static lenient() {
    return this.create({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 1000, // 1000 requests per hour
      message: "Too many requests, please try again later",
    });
  }
}

// Export default instance with moderate rate limiting
export default RateLimiterMiddleware.moderate();
