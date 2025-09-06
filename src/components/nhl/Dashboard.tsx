"use client";

import { useEffect, useState } from "react";
import TeamPanel from "./TeamPanel";
import ScheduleList from "./ScheduleList";
import SelectedGameCard from "./SelectedGameCard";
import SelectedGameJson from "./SelectedGameJson";
import RosterList from "./RosterList";
import SelectedPlayerCard from "./SelectedPlayerCard";
import {
  ClubRosterResponse,
  ClubScheduleGame,
  RosterPlayer,
  Team,
} from "./types";
import { isRouteError } from "@/types/api";

const SEASON_ID = "20242025";

export default function Dashboard() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamsErr, setTeamsErr] = useState<string | null>(null);
  const [team, setTeam] = useState<Team | null>(null);

  const [schedule, setSchedule] = useState<ClubScheduleGame[] | null>(null);
  const [schedErr, setSchedErr] = useState<string | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const [roster, setRoster] = useState<ClubRosterResponse | null>(null);
  const [rosterErr, setRosterErr] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<RosterPlayer | null>(
    null
  );

  // Load teams (sorted; default to ANA)
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

  // When team changes, fetch schedule + roster
  useEffect(() => {
    if (!team?.triCode) return;

    // schedule
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

    // roster
    setRoster(null);
    setRosterErr(null);
    setSelectedPlayer(null);
    (async () => {
      try {
        const res = await fetch(
          `/api/nhl/roster?team=${team.triCode}&season=${SEASON_ID}`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body: unknown = await res.json();

        if (isRouteError(body)) {
          setRoster(null);
          setRosterErr(body.message ?? body.error);
          return;
        }

        const r = body as ClubRosterResponse;
        setRoster(r);

        // pick a sensible default player
        const first =
          r.forwards?.[0] ??
          r.defensemen?.[0] ??
          r.goalies?.[0] ??
          r.roster?.[0] ??
          null;
        setSelectedPlayer(first ?? null);
      } catch (err: unknown) {
        setRosterErr(
          err instanceof Error ? err.message : "Failed to fetch roster"
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
        onChange={(tri) =>
          setTeam(teams.find((t) => t.triCode === tri) || null)
        }
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

      {/* Row 3 — Roster | Selected Player */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RosterList
          team={team}
          seasonId={SEASON_ID}
          roster={roster}
          rosterErr={rosterErr}
          selectedPlayer={selectedPlayer}
          onSelect={(p) => setSelectedPlayer(p)}
        />
        <SelectedPlayerCard team={team} player={selectedPlayer} />
      </div>

      {/* Row 4 — Raw JSON for selected game */}
      <SelectedGameJson game={selectedGame} />
    </div>
  );
}
