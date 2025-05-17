import dotenv from "dotenv";
import { z } from "zod";

// Load environment variables
dotenv.config({ path: `.env` });

// Define configuration schemas using Zod for runtime validation
const JwtConfigSchema = z.object({
  ACCESS_TOKEN_SECRET: z.string().min(1),
  REFRESH_TOKEN_SECRET: z.string().min(1),
  ACCESS_TOKEN_EXPIRYIN: z.string().default("1h"),
  REFRESH_TOKEN_EXPIRYIN: z.string().default("7d"),
});


const ConfigSchema = z.object({
  PORT: z.number().default(3000),
  ENVIRONMENT: z.enum(["development", "production", "test"]).default("production"),
  WEBSITE_URL: z.string().url().default("http://localhost:5000/"),
  API_VERSION: z.string().default(""),
  dbConnectionString: z.string().min(1),
  BEARER_ACCESS_TOKEN: z.string().min(1),
  HMAC_SECRET_KEY: z.string().min(1),
  HMAC_TOKEN_EXPIRYIN: z.string().default("5m"),
  ENABLE_COOKIES: z.boolean().default(false),
  JWT: JwtConfigSchema
});

// Type inference from Zod schema
type Config = z.infer<typeof ConfigSchema>;

class ConfigurationManager {
  private static instance: ConfigurationManager;
  private config: Config;

  private constructor() {
    this.config = this.loadConfig();
  }

  public static getInstance(): ConfigurationManager {
    if (!ConfigurationManager.instance) {
      ConfigurationManager.instance = new ConfigurationManager();
    }
    return ConfigurationManager.instance;
  }

  private getEnvVariable(key: string, defaultValue?: string): string {
    const value = process.env[key];
    if (!value && defaultValue === undefined) {
      throw new Error(`Environment variable ${key} is required but not defined.`);
    }
    return value || defaultValue || "";
  }

  private loadConfig(): Config {
    const rawConfig = {
      PORT: Number(process.env.PORT) || 3000,
      ENVIRONMENT: (this.getEnvVariable(
        "ENVIRONMENT",
        "development"
      ).toLowerCase() === "dev"
        ? "development"
        : this.getEnvVariable(
            "ENVIRONMENT",
            "development"
          )) as Config["ENVIRONMENT"],
      WEBSITE_URL: this.getEnvVariable("WEBSITE_URL", "http://localhost:5000/"),
      API_VERSION: this.getEnvVariable("API_VERSION", "v1"),
      dbConnectionString: this.getEnvVariable(
        "CONNECTION_STRING",
        "mongodb://localhost:27017/transtutors"
      ),
      BEARER_ACCESS_TOKEN: this.getEnvVariable(
        "BEARER_ACCESS_TOKEN",
        "default-bearer-token"
      ),
      HMAC_SECRET_KEY: this.getEnvVariable(
        "HMACAUTH_SECRET_KEY",
        "default-hmac-secret"
      ),
      HMAC_TOKEN_EXPIRYIN: this.getEnvVariable("HMAC_TOKEN_EXPIRYIN", "5m"),
      ENABLE_COOKIES: this.getEnvVariable("ENABLE_COOKIES", "false") === "true",

      JWT: {
        ACCESS_TOKEN_SECRET: this.getEnvVariable(
          "JWT_ACCESS_TOKEN_SECERT",
          "default-jwt-secret"
        ),
        REFRESH_TOKEN_SECRET: this.getEnvVariable(
          "JWT_REFRESH_TOKEN_SECERT",
          "default-refresh-secret"
        ),
        ACCESS_TOKEN_EXPIRYIN: this.getEnvVariable(
          "JWT_ACCESS_TOKEN_EXPIRYIN",
          "1h"
        ),
        REFRESH_TOKEN_EXPIRYIN: this.getEnvVariable(
          "JWT_REFRESH_TOKEN_EXPIRYIN",
          "7d"
        ),
      },

      
    };

    try {
      return ConfigSchema.parse(rawConfig);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        console.error("Configuration validation failed:", error.errors);
      } else {
        console.error("Unexpected error during configuration validation:", error);
      }
      throw new Error("Failed to validate configuration");
    }
  }

  public getConfig(): Config {
    return this.config;
  }

  
}

// Export a singleton instance
export default ConfigurationManager.getInstance().getConfig();
