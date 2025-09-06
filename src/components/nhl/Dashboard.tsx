"use client";

import { useEffect, useState } from "react";
import TeamPanel from "./TeamPanel";
import ScheduleList from "./ScheduleList";
import SelectedGameCard from "./SelectedGameCard";
import SelectedGameJson from "./SelectedGameJson";
import { ClubScheduleGame, Team } from "./types";
import { isRouteError } from "@/types/api";

const SEASON_ID = "20242025";

export default function TeamsSchedulePanel() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamsErr, setTeamsErr] = useState<string | null>(null);
  const [team, setTeam] = useState<Team | null>(null);

  const [schedule, setSchedule] = useState<ClubScheduleGame[] | null>(null);
  const [schedErr, setSchedErr] = useState<string | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  // Load teams
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/nhl/teams", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body: unknown = await res.json();

        if (isRouteError(body)) {
          setTeamsErr(body.message ?? body.error);
          setTeams([]);
          return;
        }

        const data = (body as { data?: Team[] }).data;
        if (Array.isArray(data) && data.length > 0) {
          const sorted = [...data].sort((a, b) =>
            a.triCode.localeCompare(b.triCode)
          );
          setTeams(sorted);
          setTeam(sorted.find((t) => t.triCode === "ANA") ?? sorted[0]);
        } else {
          setTeams([]);
          setTeamsErr("No teams in response");
        }
      } catch (err: unknown) {
        setTeamsErr(
          err instanceof Error ? err.message : "Failed to fetch teams"
        );
      }
    })();
  }, []);

  // Load schedule when team changes
  useEffect(() => {
    if (!team?.triCode) return;
    setSchedule(null);
    setSchedErr(null);
    setSelectedIdx(null);

    (async () => {
      try {
        const res = await fetch(
          `/api/nhl/schedule?team=${team.triCode}&season=${SEASON_ID}`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body: unknown = await res.json();

        if (isRouteError(body)) {
          setSchedule([]);
          setSchedErr(body.message ?? body.error);
          return;
        }

        const games = (body as { games?: ClubScheduleGame[] }).games;
        if (Array.isArray(games)) {
          setSchedule(games);
          setSelectedIdx(games.length ? 0 : null);
          if (!games.length)
            setSchedErr(
              `No schedule found for ${team.triCode} in ${SEASON_ID}.`
            );
        } else {
          setSchedule([]);
          setSchedErr("Schedule payload missing games[]");
        }
      } catch (err: unknown) {
        setSchedErr(
          err instanceof Error ? err.message : "Failed to fetch schedule"
        );
      }
    })();
  }, [team?.triCode]);

  const selectedGame =
    selectedIdx != null && schedule ? schedule[selectedIdx] ?? null : null;

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Row 1 — Team panel */}
      <TeamPanel
        teams={teams}
        team={team}
        teamsErr={teamsErr}
        onChange={(tri) => {
          const next = teams.find((t) => t.triCode === tri) || null;
          setTeam(next);
        }}
      />

      {/* Row 2 — Schedule | Selected Game */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ScheduleList
          team={team}
          seasonId={SEASON_ID}
          schedule={schedule}
          schedErr={schedErr}
          selectedIdx={selectedIdx}
          onSelect={setSelectedIdx}
        />
        <SelectedGameCard team={team} game={selectedGame} />
      </div>

      {/* Row 3 — Raw JSON */}
      <SelectedGameJson game={selectedGame} />
    </div>
  );
}
