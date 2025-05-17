import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import config from "../config/ttConfig";
import { ApiResponse } from "../utils/apiResponse";

interface HmacSignature {
  signature: string;
  timestamp: number;
}

class HmacTokenService {
  private static readonly SIGNATURE_HEADER = "x-hmac-signature";
  private static readonly DEFAULT_EXPIRY = "10m";
  private static readonly SIGNATURE_DELIMITER = "|";

  /**
   * Calculate token expiry time in milliseconds
   */
  static hmacTokenExpiryTime(): number {
    const expiryTime = config.HMAC_TOKEN_EXPIRYIN || HmacTokenService.DEFAULT_EXPIRY;
    return HmacTokenService.getExpiryTimeInMS(expiryTime);
  }

  /**
   * Middleware for HMAC authentication
   */
  static async hmacAuthentication(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const receivedSignature = req.headers[HmacTokenService.SIGNATURE_HEADER] as string | undefined;
      
      if (!receivedSignature) {
        console.error("HMAC auth failed: No signature provided", {
          headers: req.headers,
          url: req.url,
          method: req.method
        });
        ApiResponse.unauthorized(res);
        return;
      }

      const { signature, timestamp } = HmacTokenService.parseSignature(receivedSignature);
      HmacTokenService.validateTimestamp(timestamp);

      const dataToSign = HmacTokenService.buildDataToSign(req, timestamp);
      const calculatedSignature = HmacTokenService.calculateSignature(dataToSign);

      if (signature !== calculatedSignature) {
        console.error("HMAC auth failed: Invalid signature", {
          receivedSignature,
          calculatedSignature,
          url: req.url,
          method: req.method
        });
        ApiResponse.unauthorized(res);
        return;
      }

      next();
    } catch (error: any) {
      console.error("HMAC authentication error:", {
        message: error.message,
        stack: error.stack,
        headers: req.headers,
        url: req.url,
        method: req.method
      });

      // Handle specific security-related errors
      if (error.message.includes("Unauthorized")) {
        ApiResponse.unauthorized(res);
      } else {
        // For unexpected errors, return 500 but log the details
        ApiResponse.handleError(res, new Error("Internal Server Error"));
      }
    }
  }

  /**
   * Parse the received signature into signature and timestamp
   */
  private static parseSignature(receivedSignature: string): HmacSignature {
    const [signature, timestamp] = receivedSignature.split(HmacTokenService.SIGNATURE_DELIMITER);

    if (!signature || !timestamp) {
      throw new Error("Unauthorized - Invalid signature format");
    }

    const parsedTimestamp = parseInt(timestamp, 10);
    if (isNaN(parsedTimestamp)) {
      throw new Error("Unauthorized - Invalid timestamp");
    }

    return { signature, timestamp: parsedTimestamp };
  }

  /**
   * Validate the timestamp against the max allowed expiry time
   */
  private static validateTimestamp(timestamp: number): void {
    const currentTime = Date.now();
    const timeDifference = Math.abs(currentTime - timestamp);
    const maxTimeDifference = HmacTokenService.hmacTokenExpiryTime();

    if (timeDifference > maxTimeDifference) {
      throw new Error("Unauthorized - Signature expired");
    }
  }

  /**
   * Build the data string to sign
   */
  private static buildDataToSign(req: Request, timestamp: number): string {
    return `${timestamp}:${req.method}:${req.url}:${JSON.stringify(req.body)}`;
  }

  /**
   * Calculate HMAC signature
   */
  private static calculateSignature(dataToSign: string): string {
    return crypto
      .createHmac("sha256", config.HMAC_SECRET_KEY)
      .update(dataToSign)
      .digest("hex");
  }

  /**
   * Convert expiry time string to milliseconds
   */
  private static getExpiryTimeInMS(expiry: string): number {
    const unit = expiry.slice(-1);
    const value = parseInt(expiry.slice(0, -1));

    switch (unit) {
      case "s":
        return value * 1000;
      case "m":
        return value * 60 * 1000;
      case "h":
        return value * 60 * 60 * 1000;
      case "d":
        return value * 24 * 60 * 60 * 1000;
      default:
        return 10 * 60 * 1000; // Default 10 minutes
    }
  }
}

export default HmacTokenService;