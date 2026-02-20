import type { Address } from "./types.js";

const TRASH_SVG = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
  <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
</svg>`;

let listEl: HTMLUListElement;
let emptyEl: HTMLElement;
let sidebarEl: HTMLElement;

export function initSidebar(
  list: HTMLUListElement,
  empty: HTMLElement,
  sidebar: HTMLElement,
  burgerBtn: HTMLElement,
  mapContainer: HTMLElement,
): void {
  listEl = list;
  emptyEl = empty;
  sidebarEl = sidebar;

  burgerBtn.addEventListener("click", () => {
    sidebarEl.classList.toggle("open");
  });

  mapContainer.addEventListener("click", () => {
    sidebarEl.classList.remove("open");
  });
}

export function renderAddress(
  address: Address,
  onDelete: (id: number) => void,
  onLocate: (lat: number, lng: number) => void,
): void {
  const li = document.createElement("li");

  const label = document.createElement("span");
  label.className = "addr-label";
  label.textContent = address.label;
  label.title = address.label;
  label.addEventListener("click", () => onLocate(address.latitude, address.longitude));

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.innerHTML = TRASH_SVG;
  deleteBtn.title = "Supprimer l'adresse";
  deleteBtn.addEventListener("click", () => onDelete(address.id));

  li.appendChild(label);
  li.appendChild(deleteBtn);
  li.dataset.addressId = String(address.id);
  listEl.appendChild(li);

  updateEmpty();
}

export function removeAddress(id: number): void {
  const li = listEl.querySelector(`li[data-address-id="${id}"]`);
  if (li) li.remove();
  updateEmpty();
}

function updateEmpty(): void {
  if (listEl.children.length === 0) {
    emptyEl.classList.remove("hidden");
  } else {
    emptyEl.classList.add("hidden");
  }
}

export { updateEmpty };
