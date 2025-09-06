// app/api/nhl/player/route.ts
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { errorJson, type RouteError } from "@/types/api";

function pretty(t: string) {
  try {
    return JSON.stringify(JSON.parse(t), null, 2);
  } catch {
    return t;
  }
}

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id)
    return errorJson(
      { error: "Bad Request", message: "Provide ?id=<playerId>", status: 400 },
      400
    );

  const url = `https://api-web.nhle.com/v1/player/${id}/landing`;
  try {
    const upstream = await fetch(url, { cache: "no-store" });
    const text = await upstream.text();
    const printResponseForDebug = false;

    console.log("\n[NHL PLAYER] URL:", url);
    console.log("[NHL PLAYER] Status:", upstream.status);
    if (printResponseForDebug)
      console.log("[NHL PLAYER] Payload:\n", pretty(text), "\n");

    const headers = new Headers();
    headers.set(
      "content-type",
      upstream.headers.get("content-type") ?? "application/json; charset=utf-8"
    );
    const cc = upstream.headers.get("cache-control");
    if (cc) headers.set("cache-control", cc);

    return new Response(text, { status: upstream.status, headers });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    const payload: RouteError = {
      error: "Upstream fetch failed",
      message,
      status: 502,
      upstreamUrl: url,
    };
    console.error("[NHL PLAYER] Fetch error:", payload);
    return errorJson(payload, 502);
  }
}
