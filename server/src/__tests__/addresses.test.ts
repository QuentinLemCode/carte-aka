import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";

const mockDb = {
  select: vi.fn(),
  insert: vi.fn(),
  delete: vi.fn(),
};

vi.mock("../db/index.js", () => ({ db: mockDb }));

vi.mock("drizzle-orm", () => ({
  eq: (col: unknown, val: unknown) => ({ col, val }),
}));

const { addressRouter } = await import("../routes/addresses.js");

function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use("/api/addresses", addressRouter);
  return app;
}

describe("GET /api/addresses", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns all addresses", async () => {
    const mockAddresses = [
      {
        id: 1,
        label: "Paris",
        latitude: 48.8566,
        longitude: 2.3522,
        createdAt: new Date().toISOString(),
      },
    ];
    const chain = {
      from: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockResolvedValue(mockAddresses),
    };
    mockDb.select.mockReturnValue(chain);

    const app = createTestApp();
    const res = await request(app).get("/api/addresses");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockAddresses);
  });
});

describe("POST /api/addresses", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates an address with valid input", async () => {
    const created = {
      id: 1,
      label: "Paris",
      latitude: 48.8566,
      longitude: 2.3522,
      createdAt: new Date().toISOString(),
    };
    const chain = {
      values: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([created]),
    };
    mockDb.insert.mockReturnValue(chain);

    const app = createTestApp();
    const res = await request(app)
      .post("/api/addresses")
      .send({ label: "Paris", latitude: 48.8566, longitude: 2.3522 });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(created);
  });

  it("returns 400 for invalid input", async () => {
    const app = createTestApp();
    const res = await request(app)
      .post("/api/addresses")
      .send({ label: "", latitude: "not-a-number" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("returns 400 when latitude is out of range", async () => {
    const app = createTestApp();
    const res = await request(app)
      .post("/api/addresses")
      .send({ label: "Test", latitude: 200, longitude: 0 });

    expect(res.status).toBe(400);
  });
});

describe("DELETE /api/addresses/:id", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deletes an existing address", async () => {
    const deleted = { id: 1, label: "Paris", latitude: 48.8566, longitude: 2.3522 };
    const chain = {
      where: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([deleted]),
    };
    mockDb.delete.mockReturnValue(chain);

    const app = createTestApp();
    const res = await request(app).delete("/api/addresses/1");

    expect(res.status).toBe(204);
  });

  it("returns 404 for non-existing address", async () => {
    const chain = { where: vi.fn().mockReturnThis(), returning: vi.fn().mockResolvedValue([]) };
    mockDb.delete.mockReturnValue(chain);

    const app = createTestApp();
    const res = await request(app).delete("/api/addresses/999");

    expect(res.status).toBe(404);
  });

  it("returns 400 for invalid id", async () => {
    const app = createTestApp();
    const res = await request(app).delete("/api/addresses/abc");

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid id");
  });
});
