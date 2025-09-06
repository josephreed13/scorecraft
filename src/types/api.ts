export type RouteError = {
  error: string;
  message?: string;
  status?: number;
  upstreamUrl?: string;
};

export function isRouteError(x: unknown): x is RouteError {
  return typeof x === "object" && x !== null && "error" in x;
}

export function errorJson(payload: RouteError, status = 500): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json" },
  });
}
