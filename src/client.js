import { createFetcher } from "./fetcher.js";
import { buildStrapiUrl } from "./url.js";

export function createStrapiClient({ url, token }) {
  if (!url) throw new Error("strapi-next-fetch: `url` is required");
  if (!token) throw new Error("strapi-next-fetch: `token` is required");

  const fetch = createFetcher(url, token);
  const buildUrl = (endpoint, params) => buildStrapiUrl(url, endpoint, params);

  return { fetch, buildUrl };
}
