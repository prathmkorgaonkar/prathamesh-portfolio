
import "reflect-metadata";
import { DataSource } from "typeorm";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_DATABASE || "portfolio_db",

    synchronize: false,
    logging: false,

    entities: [
        path.join(__dirname, "entities", "*.{js,ts}"),
    ],

    migrations: [
        path.join(__dirname, "migrations", "*.{js,ts}"),
    ],
});
