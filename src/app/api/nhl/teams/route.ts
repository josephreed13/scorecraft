export const dynamic = "force-dynamic";
export const revalidate = 0;

import type { RouteError } from "@/types/api";
import { errorJson } from "@/types/api";

function pretty(text: string) {
  try {
    return JSON.stringify(JSON.parse(text), null, 2);
  } catch {
    return text;
  }
}

export async function GET() {
  const url = "https://api.nhle.com/stats/rest/en/team";
  try {
    const upstream = await fetch(url, { cache: "no-store" });
    const text = await upstream.text();
    const printResponseForDebug = false;

    console.log("\n[NHL TEAMS] URL:", url);
    console.log("[NHL TEAMS] Status:", upstream.status);
    if (printResponseForDebug)
      console.log("[NHL TEAMS] Payload:\n", pretty(text), "\n");

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
    console.error("[NHL TEAMS] Fetch error:", payload);
    return errorJson(payload, 502);
  }
}
