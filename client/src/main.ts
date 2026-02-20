import "leaflet/dist/leaflet.css";
import "./style.css";

import { initMap, addPin, removePin, fitAllPins, panTo } from "./map.js";
import { setupSearch } from "./search.js";
import { initSidebar, renderAddress, removeAddress, updateEmpty } from "./sidebar.js";
import { fetchAddresses, createAddress, deleteAddress } from "./api.js";
import type { NominatimResult } from "./types.js";

async function main() {
  initMap("map");

  const searchInput = document.getElementById("search-input") as HTMLInputElement;
  const searchResults = document.getElementById("search-results") as HTMLUListElement;
  const addressList = document.getElementById("address-list") as HTMLUListElement;
  const emptyMsg = document.getElementById("empty-msg") as HTMLElement;
  const sidebar = document.getElementById("sidebar") as HTMLElement;
  const burgerBtn = document.getElementById("burger-btn") as HTMLElement;
  const mapContainer = document.getElementById("map-container") as HTMLElement;
  const fitAllBtn = document.getElementById("fit-all-btn") as HTMLElement;

  initSidebar(addressList, emptyMsg, sidebar, burgerBtn, mapContainer);

  async function handleSelect(result: NominatimResult) {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const address = await createAddress(result.display_name, lat, lng);
    addPin(address);
    renderAddress(address, handleDelete, handleLocate);
    panTo(lat, lng);
  }

  async function handleDelete(id: number) {
    await deleteAddress(id);
    removePin(id);
    removeAddress(id);
  }

  function handleLocate(lat: number, lng: number) {
    panTo(lat, lng);
  }

  setupSearch(searchInput, searchResults, handleSelect);

  fitAllBtn.addEventListener("click", fitAllPins);

  try {
    const addresses = await fetchAddresses();
    for (const addr of addresses) {
      addPin(addr);
      renderAddress(addr, handleDelete, handleLocate);
    }
    updateEmpty();
  } catch {
    /* first load when backend is not available */
  }
}

main();
