"use client";

import { ClubScheduleGame, Team } from "./types";

type Props = {
  team: Team | null;
  seasonId: string;
  schedule: ClubScheduleGame[] | null;
  schedErr: string | null;
  selectedIdx: number | null;
  onSelect: (idx: number) => void;
};

export default function ScheduleList({
  team,
  seasonId,
  schedule,
  schedErr,
  selectedIdx,
  onSelect,
}: Props) {
  return (
    <div className="p-4 border rounded-xl shadow bg-white text-gray-900 dark:bg-zinc-900 dark:text-zinc-100">
      <h3 className="text-lg font-semibold mb-3">
        {team ? `${team.fullName} — ${seasonId} Schedule` : "Schedule"}
      </h3>

      {schedErr && <div className="text-red-500 text-sm mb-2">{schedErr}</div>}

      {!schedule ? (
        <div>Loading…</div>
      ) : schedule.length === 0 ? (
        <div className="text-sm opacity-80">No games.</div>
      ) : (
        <div className="max-h-96 overflow-auto rounded border border-zinc-200 dark:border-zinc-800">
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {schedule.map((g, idx) => {
              const date = g.gameDate ?? "";
              const home = g.homeTeam?.abbrev ?? "";
              const away = g.awayTeam?.abbrev ?? "";
              const isSelected = selectedIdx === idx;
              return (
                <li key={g.id ?? idx} className="py-2">
                  <button
                    type="button"
                    onClick={() => onSelect(idx)}
                    aria-current={isSelected ? "true" : undefined}
                    className={`w-full flex items-center justify-between gap-3 text-left px-3 py-2
                                hover:bg-zinc-100 dark:hover:bg-zinc-800
                                focus:outline-none focus:ring-2 focus:ring-blue-500
                                ${
                                  isSelected
                                    ? "bg-zinc-100 dark:bg-zinc-800"
                                    : ""
                                }`}
                  >
                    <span className="font-medium">{date}</span>
                    <span className="opacity-80">
                      {away} @ {home}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
