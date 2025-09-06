// src/lib/nhl/client.ts
import { z } from "zod";
import {
  TeamSchema,
  ScheduleResponseSchema,
  type Team,
  type ScheduleResponse,
} from "./types";

async function fetchJson<T>(url: string, schema: z.ZodTypeAny): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`API ${res.status}: ${url}`);
  const json = await res.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) throw new Error("Schema validation failed");
  return parsed.data as T;
}

export async function getTeams(): Promise<Team[]> {
  const data = await fetchJson<{ teams: Team[] }>(
    "/api/nhl/teams",
    z.object({
      teams: z.array(
        TeamSchema.extend({ abbreviation: z.string().optional() })
      ),
    })
  );
  // keep shape; abbreviation is optional in TeamSchema; present here
  return data.teams;
}

export async function getScheduleByTeamAbbrev(
  teamAbbrev: string,
  startDate: string,
  endDate: string
): Promise<ScheduleResponse> {
  const qs = new URLSearchParams({ teamAbbrev, startDate, endDate }).toString();
  return await fetchJson<ScheduleResponse>(
    `/api/nhl/schedule?${qs}`,
    ScheduleResponseSchema
  );
}
