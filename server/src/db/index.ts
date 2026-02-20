import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

const databaseUrl = process.env.DATABASE_URL ?? "postgresql://carte:carte@localhost:5432/carte";

const client = postgres(databaseUrl, { max: 10 });

export const db = drizzle(client, { schema });
