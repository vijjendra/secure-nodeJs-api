import jwt, { VerifyErrors } from "jsonwebtoken";
import {Response, NextFunction } from "express";
import config from "../config/ttConfig";
import { ApiResponse } from "../utils/apiResponse";
import { ICustomRequest } from "../types/ICustomRequest";
import { JwtTokenType } from "../utils/status.enum";



class JWTTokenMiddleware {
  private static readonly TOKEN_PREFIX = "Bearer ";

  /**
   * Generate an access token and optionally store it in cookies
   */
  static generateAccessToken(
    user: any,
    res?: Response,
    isSaveToCookies: boolean = true
  ): string {
    try {
      const secret = config.JWT.ACCESS_TOKEN_SECRET;
      const expiresIn = config.JWT.ACCESS_TOKEN_EXPIRYIN || "10m";

      const accessToken = jwt.sign({ userToken: user }, secret, { expiresIn });

      if (accessToken && isSaveToCookies && res && config.ENABLE_COOKIES) {
        this.setAuthCookie(res, "accessToken", accessToken, expiresIn);
      }

      return accessToken;
    } catch (error) {
      console.error("Failed to generate access token:", error);
      throw new Error("Failed to generate access token");
    }
  }

  /**
   * Generate a refresh token and optionally store it in cookies
   */
  static generateRefreshToken(
    user: any,
    res?: Response,
    isSaveToCookies: boolean = true
  ): string {
    try {
      const secret = config.JWT.REFRESH_TOKEN_SECRET;
      const expiresIn = config.JWT.REFRESH_TOKEN_EXPIRYIN || "15d";

      const refreshToken = jwt.sign({ userToken: user }, secret, { expiresIn });

      if (refreshToken && isSaveToCookies && res && config.ENABLE_COOKIES) {
        this.setAuthCookie(res, "refreshToken", refreshToken, expiresIn);
      }

      return refreshToken;
    } catch (error) {
      console.error("Failed to generate refresh token:", error);
      throw new Error("Failed to generate refresh token");
    }
  }

  /**
   * Middleware to authenticate static bearer token
   */
  static authenticateStaticBearerToken = async (
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const authHeader = req.headers.authorization || req.headers.Authorization;
      
    
      if (!authHeader || typeof authHeader !== "string") {
        ApiResponse.unauthorized(res, "Access Denied");
        return;
      }

      if (!authHeader.startsWith(this.TOKEN_PREFIX)) {
        ApiResponse.unauthorized(res, "Access Denied");
        return;
      }

      const token = authHeader.split(" ")[1];
 
      if (token !== config.BEARER_ACCESS_TOKEN) {
        ApiResponse.unauthorized(res, "Access Denied");
        return;
      }

      next();
    } catch (error: any) {
      console.error("Authentication error:", error);
      ApiResponse.error(res, error.message || "Internal Server Error");
    }
  };

  /**
   * Middleware to authorize user with access token
   */
  static authorizeUser = (
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): void => {
    this.validateJWTToken(
      req,
      res,
      next,
      config.JWT.ACCESS_TOKEN_SECRET,
      JwtTokenType.AcessToken
    );
  };

  /**
   * Middleware to authorize refresh token
   */
  static authorizeRefreshToken = (
    req: ICustomRequest,
    res: Response,
    next: NextFunction
  ): void => {
    this.validateJWTToken(
      req,
      res,
      next,
      config.JWT.REFRESH_TOKEN_SECRET,
      JwtTokenType.RefreshToken
    );
  };

  /**
   * Set secure cookie with token
   */
  private static setAuthCookie(
    res: Response,
    name: string,
    token: string,
    expiry: string
  ): void {
    const maxAge = this.getExpiryTimeInMS(expiry);

    res.cookie(name, token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge,
    });
  }

  /**
   * Validate JWT token
   */
  private static validateJWTToken(
    req: ICustomRequest,
    res: Response,
    next: NextFunction,
    secretKey: string,
    tokenType: JwtTokenType
  ): void {
    try {
      const authHeader = req.headers.authorization || req.headers.Authorization;

      if (!authHeader || typeof authHeader !== "string" || !authHeader.startsWith(this.TOKEN_PREFIX)) {
        ApiResponse.unauthorized(res);
        return;
      }

      const token = authHeader.split(" ")[1];

      if (config.ENABLE_COOKIES) {
        const cookieToken = tokenType === JwtTokenType.RefreshToken
          ? req.cookies?.refreshToken
          : req.cookies?.accessToken;

        if (!cookieToken || cookieToken !== token) {
          ApiResponse.unauthorized(res);
          return;
        }
      }

      jwt.verify(token, secretKey, (err: VerifyErrors | null, decoded: any) => {
        if (err) {
          const errorMessage = err.name === "TokenExpiredError"
            ? "Token has expired"
            : "Invalid token";
          ApiResponse.unauthorized(res, errorMessage);
          return;
        }

        if (!decoded || typeof decoded === "string" || !("userToken" in decoded)) {
          ApiResponse.unauthorized(res);
          return;
        }

        // Set both user and userId in the request
        req.user = decoded.userToken;
        
        //console.log("Decoded user token:", decoded.userToken);
        next();
      });
    } catch (error: any) {
      console.error("Token validation error:", error);
      ApiResponse.error(res, "Internal Server Error");
    }
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
        return 15 * 60 * 1000; // Default 15 minutes
    }
  }
}

export default JWTTokenMiddleware;
