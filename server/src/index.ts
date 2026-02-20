import { createApp } from "./app.js";
import { runMigrations } from "./db/migrate.js";

const port = Number(process.env.PORT) || 3000;

async function main() {
  await runMigrations();
  const app = createApp();
  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
