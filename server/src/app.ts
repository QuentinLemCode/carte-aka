import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { addressRouter } from "./routes/addresses.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();

  app.use(express.json());

  app.use("/api/addresses", addressRouter);

  const clientDist = path.resolve(__dirname, "../../client/dist");
  app.use(express.static(clientDist));
  app.get("{*path}", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });

  return app;
}
