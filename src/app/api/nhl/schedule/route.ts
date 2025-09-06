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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const team = searchParams.get("team");
  const season = searchParams.get("season");
  const printResponseForDebug = false;

  let url: string | null = null;
  if (team && season) {
    url = `https://api-web.nhle.com/v1/club-schedule-season/${team}/${season}`;
  } else if (date) {
    url = `https://api-web.nhle.com/v1/schedule/${date}`;
  } else {
    return errorJson(
      {
        error: "Bad Request",
        message: "Provide ?date=YYYY-MM-DD or ?team=TRI&season=YYYYYYYY",
        status: 400,
      },
      400
    );
  }

  try {
    const upstream = await fetch(url, { cache: "no-store" });
    const text = await upstream.text();

    console.log("\n[NHL SCHEDULE] URL:", url);
    console.log("[NHL SCHEDULE] Status:", upstream.status);
    if (printResponseForDebug)
      console.log("[NHL SCHEDULE] Payload:\n", pretty(text), "\n");

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
      upstreamUrl: url ?? undefined,
    };
    console.error("[NHL SCHEDULE] Fetch error:", payload);
    return errorJson(payload, 502);
  }
}
