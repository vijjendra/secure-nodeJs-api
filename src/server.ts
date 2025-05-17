import app from './app';
import connectDB from './config/dbConnection';
import ttConfig from './config/ttConfig';
import { logger } from './utils/logger';

// Graceful Shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received. Shutting down gracefully...`);
  try {
    await connectDB.disconnect();
    logger.info("Database connection closed.");
    process.exit(0);
  } catch (error) {
    logger.error("Error during shutdown:", { 
      error,
      stack: error instanceof Error ? error.stack : undefined 
    });
    process.exit(1);
  }
};

// Process Event Handlers
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("unhandledRejection", (reason: Error) => {
  logger.error("Unhandled Rejection:", { 
    error: reason,
    stack: reason.stack 
  });
  gracefulShutdown("UNHANDLED_REJECTION");
});

process.on("uncaughtException", (error: Error) => {
  logger.error("Uncaught Exception:", { 
    error,
    stack: error.stack 
  });
  gracefulShutdown("UNCAUGHT_EXCEPTION");
});

// Start Server
const startServer = async () => {
  try {
    // Initialize database
    await connectDB.connect();
    logger.info("Database connection established successfully");

    // Start listening
    const port = ttConfig.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running http://localhost:${port}`);
      console.log(`Environment: ${ttConfig.ENVIRONMENT}`);
      console.log(`API Version: ${ttConfig.API_VERSION || 'v1'}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();
