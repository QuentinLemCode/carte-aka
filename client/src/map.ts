import L from "leaflet";
import type { Address } from "./types.js";

const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

let map: L.Map;
const markers = new Map<number, L.Marker>();

export function initMap(elementId: string): L.Map {
  map = L.map(elementId).setView([46.603, 1.888], 6);
  L.tileLayer(TILE_URL, { attribution: ATTRIBUTION, maxZoom: 19 }).addTo(map);
  return map;
}

export function addPin(address: Address): L.Marker {
  const marker = L.marker([address.latitude, address.longitude])
    .bindPopup(address.label)
    .addTo(map);
  markers.set(address.id, marker);
  return marker;
}

export function removePin(id: number): void {
  const marker = markers.get(id);
  if (marker) {
    map.removeLayer(marker);
    markers.delete(id);
  }
}

export function fitAllPins(): void {
  if (markers.size === 0) return;
  const group = L.featureGroup(Array.from(markers.values()));
  map.fitBounds(group.getBounds().pad(0.1));
}

export function panTo(lat: number, lng: number, zoom = 15): void {
  map.setView([lat, lng], zoom);
}

export function getMap(): L.Map {
  return map;
}
