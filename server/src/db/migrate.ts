import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./index.js";

export async function runMigrations() {
  const migrationsFolder = new URL("../../drizzle", import.meta.url).pathname;
  await migrate(db, { migrationsFolder });
  console.log("Migrations complete");
}
