import { buildStrapiUrl } from "./url.js";

export function createFetcher(baseUrl, token) {
  return async function fetchFromStrapi(endpoint, params = {}, options = {}) {
    const url = buildStrapiUrl(baseUrl, endpoint, params);
    const { cache = "force-cache", revalidate = undefined } = options;

    const fetchOptions = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    if (typeof revalidate === "number") {
      fetchOptions.next = { revalidate };
    } else {
      fetchOptions.cache = cache;
    }

    const res = await fetch(url, fetchOptions);

    if (!res.ok) {
      throw new Error(`Strapi fetch failed: ${res.status} ${res.statusText}`);
    }

    return res.json();
  };
}
