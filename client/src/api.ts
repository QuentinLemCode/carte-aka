import type { Address } from "./types.js";

const BASE = "/api/addresses";

export async function fetchAddresses(): Promise<Address[]> {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error(`GET ${BASE} failed: ${res.status}`);
  return res.json();
}

export async function createAddress(
  label: string,
  latitude: number,
  longitude: number,
): Promise<Address> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ label, latitude, longitude }),
  });
  if (!res.ok) throw new Error(`POST ${BASE} failed: ${res.status}`);
  return res.json();
}

export async function deleteAddress(id: number): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`DELETE ${BASE}/${id} failed: ${res.status}`);
}
