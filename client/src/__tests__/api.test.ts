import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchAddresses, createAddress, deleteAddress } from "../api.js";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("fetchAddresses", () => {
  it("returns addresses on success", async () => {
    const data = [
      { id: 1, label: "Paris", latitude: 48.85, longitude: 2.35, createdAt: "2026-01-01" },
    ];
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(data) });

    const result = await fetchAddresses();
    expect(result).toEqual(data);
    expect(mockFetch).toHaveBeenCalledWith("/api/addresses");
  });

  it("throws on failure", async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500 });
    await expect(fetchAddresses()).rejects.toThrow("GET /api/addresses failed: 500");
  });
});

describe("createAddress", () => {
  it("posts address and returns created", async () => {
    const created = {
      id: 2,
      label: "Lyon",
      latitude: 45.76,
      longitude: 4.83,
      createdAt: "2026-01-01",
    };
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(created) });

    const result = await createAddress("Lyon", 45.76, 4.83);
    expect(result).toEqual(created);
    expect(mockFetch).toHaveBeenCalledWith("/api/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: "Lyon", latitude: 45.76, longitude: 4.83 }),
    });
  });
});

describe("deleteAddress", () => {
  it("calls DELETE endpoint", async () => {
    mockFetch.mockResolvedValue({ ok: true });
    await deleteAddress(5);
    expect(mockFetch).toHaveBeenCalledWith("/api/addresses/5", { method: "DELETE" });
  });

  it("throws on failure", async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 404 });
    await expect(deleteAddress(999)).rejects.toThrow("DELETE /api/addresses/999 failed: 404");
  });
});
