import type { NominatimResult } from "./types.js";

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

export function setupSearch(
  input: HTMLInputElement,
  resultsList: HTMLUListElement,
  onSelect: (result: NominatimResult) => void,
): void {
  input.addEventListener("input", () => {
    const query = input.value.trim();
    if (query.length < 3) {
      hideResults(resultsList);
      return;
    }
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => searchNominatim(query, resultsList, input, onSelect), 400);
  });

  document.addEventListener("click", (e) => {
    if (!input.contains(e.target as Node) && !resultsList.contains(e.target as Node)) {
      hideResults(resultsList);
    }
  });
}

async function searchNominatim(
  query: string,
  resultsList: HTMLUListElement,
  input: HTMLInputElement,
  onSelect: (result: NominatimResult) => void,
): Promise<void> {
  const params = new URLSearchParams({
    q: query,
    format: "json",
    limit: "5",
    addressdetails: "0",
  });

  try {
    const res = await fetch(`${NOMINATIM_URL}?${params}`, {
      headers: { "Accept-Language": navigator.language },
    });
    if (!res.ok) return;

    const results: NominatimResult[] = await res.json();
    renderResults(results, resultsList, input, onSelect);
  } catch {
    /* network error – silently ignore */
  }
}

function renderResults(
  results: NominatimResult[],
  resultsList: HTMLUListElement,
  input: HTMLInputElement,
  onSelect: (result: NominatimResult) => void,
): void {
  resultsList.innerHTML = "";

  if (results.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Aucun résultat trouvé";
    li.style.color = "var(--color-text-muted)";
    li.style.cursor = "default";
    resultsList.appendChild(li);
    resultsList.classList.add("visible");
    return;
  }

  for (const result of results) {
    const li = document.createElement("li");
    li.textContent = result.display_name;
    li.addEventListener("click", () => {
      onSelect(result);
      input.value = "";
      hideResults(resultsList);
    });
    resultsList.appendChild(li);
  }

  resultsList.classList.add("visible");
}

function hideResults(resultsList: HTMLUListElement): void {
  resultsList.classList.remove("visible");
  resultsList.innerHTML = "";
}
