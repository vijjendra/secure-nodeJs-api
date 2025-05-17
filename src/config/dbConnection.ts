import mongoose, { ConnectOptions } from "mongoose";
import ttConfig from "./ttConfig";

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('Database is already connected');
      return;
    }

    try {
      const options: ConnectOptions = {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 5,
        retryWrites: true,
        retryReads: true,
      };

      await mongoose.connect(ttConfig.dbConnectionString, options);
      this.isConnected = true;
      console.log('Database successfully connected!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error connecting to MongoDB:', errorMessage);
      throw new Error(`Database connection failed: ${errorMessage}`);
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('Database disconnected successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error disconnecting from MongoDB:', errorMessage);
      throw new Error(`Database disconnection failed: ${errorMessage}`);
    }
  }

  public isDatabaseConnected(): boolean {
    return this.isConnected;
  }
}

export default DatabaseConnection.getInstance();
