import type { ApiError, ApiResponse } from "@/types";
import { NextResponse } from "next/server";

export function jsonOk<T>(
  data: T,
  meta?: ApiResponse<T>["meta"],
  status = 200,
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ data, meta }, { status });
}

export function jsonError(
  error: string,
  status = 500,
  code?: string,
  details?: unknown,
): NextResponse<ApiError> {
  return NextResponse.json({ error, code, details }, { status });
}
