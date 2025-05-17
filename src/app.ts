// Import necessary modules
import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import connectDB from "./config/dbConnection";
import { errorHandler } from "./middlewares/errorMiddleware";
import ttConfig from "./config/ttConfig";
import authRoutes from "./routes/authRoute";
import userRoute from "./routes/userRoute";
import cookieParser from "cookie-parser";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { ApiResponse } from "./utils/apiResponse";

// Load environment variables
dotenv.config();


// Create Express application
const app: Application = express();

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: "same-site" },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: "deny" },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  xssFilter: true,
}));

// CORS Configuration
const corsOptions = {
  origin: ttConfig.WEBSITE_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  credentials: true,
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Body Parser Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Cookie Parser Middleware
app.use(cookieParser());

// Compression Middleware
app.use(compression());

// Logger middleware
app.use(morgan(ttConfig.ENVIRONMENT === "production" ? "combined" : "dev"));

// API Versioning
const apiVersion = ttConfig.API_VERSION || "";
const apiBase = apiVersion ? `/api/${apiVersion}` : "/api";

// Health Check Endpoint
app.get(`${apiBase}/health`, async (req: Request, res: Response) => {
  const dbStatus = connectDB.isDatabaseConnected() ? "connected" : "disconnected";
  res.status(200).json({
    status: "UP",
    message: "API is running smoothly!",
    environment: ttConfig.ENVIRONMENT,
    version: process.env.npm_package_version,
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
    },
  });
});

// API Routes
app.use(`${apiBase}/auth`, authRoutes);
app.use(`${apiBase}/user`, userRoute);

// Error Handling Middleware
app.use(errorHandler);

// 404 Handler
app.use((req: Request, res: Response) => {
  ApiResponse.notFound(res, `Not Found - ${req.originalUrl}`);
});

export default app;
