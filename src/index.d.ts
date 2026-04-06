export type StrapiParams = Record<string, unknown>;

export interface StrapiCacheOptions {
  cache?: "force-cache" | "no-store";
  revalidate?: number;
}

export interface StrapiClient {
  fetch<T = unknown>(
    endpoint: string,
    params?: StrapiParams,
    options?: StrapiCacheOptions,
  ): Promise<T>;
  buildUrl(endpoint: string, params?: StrapiParams): string;
}

export interface StrapiClientConfig {
  url: string;
  token: string;
}

export function createStrapiClient(config: StrapiClientConfig): StrapiClient;
export function buildStrapiUrl(
  baseUrl: string,
  endpoint: string,
  params?: StrapiParams,
): string;
