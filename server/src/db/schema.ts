import { pgTable, serial, text, doublePrecision, timestamp } from "drizzle-orm/pg-core";

export const addresses = pgTable("addresses", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;
