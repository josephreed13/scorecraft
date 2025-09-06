"use client";

import { Team } from "./types";

type Props = {
  teams: Team[];
  team: Team | null;
  teamsErr: string | null;
  onChange: (triCode: string) => void;
};

export default function TeamPanel({ teams, team, teamsErr, onChange }: Props) {
  return (
    <div className="p-4 border rounded-xl shadow bg-white text-gray-900 dark:bg-zinc-900 dark:text-zinc-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
        <h2 className="text-xl font-bold">Team</h2>
        <label className="text-sm flex items-center gap-2">
          <span className="opacity-80">Choose team:</span>
          <select
            className="rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2 py-1 text-sm"
            value={team?.triCode ?? ""}
            onChange={(e) => onChange(e.target.value)}
            disabled={!teams.length}
          >
            {teams.map((t) => (
              <option key={t.id} value={t.triCode}>
                {t.triCode} — {t.fullName}
              </option>
            ))}
          </select>
        </label>
      </div>

      {teamsErr && (
        <div className="text-red-500 text-sm mb-2">Error: {teamsErr}</div>
      )}

      {!team ? (
        <div>Loading…</div>
      ) : (
        <>
          <div className="text-sm">
            {team.fullName} ({team.triCode})
          </div>
          <pre className="text-xs mt-2 p-2 rounded overflow-x-auto bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
            {JSON.stringify(team, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
}
