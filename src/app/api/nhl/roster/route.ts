export const dynamic = "force-dynamic";
export const revalidate = 0;

import { errorJson } from "@/types/api";

function pretty(t: string) {
  try {
    return JSON.stringify(JSON.parse(t), null, 2);
  } catch {
    return t;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const team = searchParams.get("team"); // e.g., "ANA"
  const season = searchParams.get("season") || "current"; // "20242025" or "current"
  const printResponseForDebug = false;

  if (!team) {
    return errorJson(
      {
        error: "Bad Request",
        message: "Provide ?team=TRI[&season=YYYYYYYY|current]",
        status: 400,
      },
      400
    );
  }

  const url = `https://api-web.nhle.com/v1/roster/${team}/${season}`;

  try {
    const upstream = await fetch(url, { cache: "no-store" });
    const text = await upstream.text();

    console.log("\n[NHL ROSTER] URL:", url);
    console.log("[NHL ROSTER] Status:", upstream.status);
    if (printResponseForDebug)
      console.log("[NHL ROSTER] Payload:\n", pretty(text), "\n");

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
    return errorJson(
      {
        error: "Upstream fetch failed",
        message,
        status: 502,
        upstreamUrl: url,
      },
      502
    );
  }
}
