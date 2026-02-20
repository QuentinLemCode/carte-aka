export interface Address {
  id: number;
  label: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

export interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}
