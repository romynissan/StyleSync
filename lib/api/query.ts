export function parseIntParam(
  value: string | null,
  fallback: number,
): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

export function parseOptionalString(value: string | null): string | undefined {
  return value && value.trim().length > 0 ? value.trim() : undefined;
}
