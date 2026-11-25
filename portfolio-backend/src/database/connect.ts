
import { AppDataSource } from "./data-source.js";

export const connectDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();

    console.log("PostgreSQL connected successfully!");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};
