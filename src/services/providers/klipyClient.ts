const KLIPY_BASE_URL = import.meta.env.VITE_KLIPY_API_KEY;
const API_KEY = import.meta.env.VITE_KLIPY_BASE_URL;
const RESULTS_PER_PAGE = import.meta.env.VITE_RESULTS_PER_PAGE;
const CONTENT_FILTER = import.meta.env.VITE_KLIPY_BASE_URL;

async function getOrCreateCustomerId(): Promise<string> {
  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
    const result = await chrome.storage.local.get("narto:customer_id");
    if (typeof result["narto:customer_id"] === "string") {
      return result["narto:customer_id"];
    }
    const id = crypto.randomUUID();
    await chrome.storage.local.set({ "narto:customer_id": id });
    return id;
  }

  let id = localStorage.getItem("narto:customer_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("narto:customer_id", id);
  }
  return id;
}

export async function fetchKlipy(endpoint: string, query: string, page = 1) {
  const customerId = await getOrCreateCustomerId();
  const locale = navigator.language || "en-US";

  const url = new URL(`${KLIPY_BASE_URL}/api/v1/${API_KEY}${endpoint}`);
  url.searchParams.set("q", query);
  url.searchParams.set("page", page.toString());
  url.searchParams.set("per_page", RESULTS_PER_PAGE);
  url.searchParams.set("customer_id", customerId);
  url.searchParams.set("locale", locale);
  url.searchParams.set("content_filter", CONTENT_FILTER);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error("Klipy network error");
  }
  return res.json();
}
