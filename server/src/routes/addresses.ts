import { Router } from "express";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/index.js";
import { addresses } from "../db/schema.js";

const createAddressSchema = z.object({
  label: z.string().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const addressRouter = Router();

addressRouter.get("/", async (_req, res) => {
  const rows = await db.select().from(addresses).orderBy(addresses.createdAt);
  res.json(rows);
});

addressRouter.post("/", async (req, res) => {
  const parsed = createAddressSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const [created] = await db.insert(addresses).values(parsed.data).returning();
  res.status(201).json(created);
});

addressRouter.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [deleted] = await db.delete(addresses).where(eq(addresses.id, id)).returning();

  if (!deleted) {
    res.status(404).json({ error: "Address not found" });
    return;
  }

  res.status(204).end();
});
