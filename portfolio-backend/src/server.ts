
import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./database/connect.js";

const PORT = Number(process.env.PORT) || 5000;
const HOST = "0.0.0.0";

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(PORT, HOST, () => {
      console.log(`Server running on ${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
