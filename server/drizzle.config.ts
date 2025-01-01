import type { Config } from "drizzle-kit";
import dotenv from "dotenv";
dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL is not set in environment variables");
}

export default {
    schema: "./src/db/schema/*",
    out: "./src/db/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: connectionString,
    },
} satisfies Config;
