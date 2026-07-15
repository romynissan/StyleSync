import { CACHE_TTL_SECONDS } from "@/lib/cache";

export function withCacheHeaders<T extends Response>(response: T): T {
  response.headers.set(
    "Cache-Control",
    `public, s-maxage=${CACHE_TTL_SECONDS}, stale-while-revalidate=300`,
  );
  return response;
}
