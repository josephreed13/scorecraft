"use client";
import { useQuery } from "@tanstack/react-query";
import { getScheduleByTeamAbbrev, getTeams } from "./client";

export function useNhlTeams() {
  return useQuery({
    queryKey: ["nhl", "teams"],
    queryFn: getTeams,
    staleTime: 5 * 60_000,
  });
}

export function useTeamScheduleByAbbrev(
  teamAbbrev?: string,
  startDate?: string,
  endDate?: string
) {
  return useQuery({
    queryKey: ["nhl", "schedule", { teamAbbrev, startDate, endDate }],
    queryFn: () => {
      if (!teamAbbrev || !startDate || !endDate)
        throw new Error("Missing params");
      return getScheduleByTeamAbbrev(teamAbbrev, startDate, endDate);
    },
    enabled: Boolean(teamAbbrev && startDate && endDate),
    staleTime: 30_000,
  });
}
