"use client";

import { ClubRosterResponse, RosterPlayer, Team } from "./types";

type Props = {
  team: Team | null;
  seasonId: string;
  roster: ClubRosterResponse | null;
  rosterErr: string | null;
  selectedPlayer: RosterPlayer | null;
  onSelect: (p: RosterPlayer) => void;
};

function formatPlayer(p: RosterPlayer) {
  const num = p.sweaterNumber != null ? `#${p.sweaterNumber}` : "";
  const name = `${p.firstName?.default ?? ""} ${
    p.lastName?.default ?? ""
  }`.trim();
  const pos = p.positionCode ?? "";
  const shoots = p.shootsCatches ? ` · ${p.shootsCatches}` : "";
  return { num, name, pos, shoots };
}

export default function RosterList({
  team,
  seasonId,
  roster,
  rosterErr,
  selectedPlayer,
  onSelect,
}: Props) {
  const groups: Array<{ label: string; items: RosterPlayer[] }> = [];
  if (roster?.forwards?.length)
    groups.push({ label: "Forwards", items: roster.forwards });
  if (roster?.defensemen?.length)
    groups.push({ label: "Defensemen", items: roster.defensemen });
  if (roster?.goalies?.length)
    groups.push({ label: "Goalies", items: roster.goalies });
  if (!groups.length && roster?.roster?.length)
    groups.push({ label: "Roster", items: roster.roster });

  const isSelected = (p: RosterPlayer) => {
    if (!selectedPlayer) return false;
    if (p.id != null && selectedPlayer.id != null)
      return p.id === selectedPlayer.id;
    // fallback by name + number when id missing
    const a = `${p.firstName?.default ?? ""}|${p.lastName?.default ?? ""}|${
      p.sweaterNumber ?? ""
    }`;
    const b = `${selectedPlayer.firstName?.default ?? ""}|${
      selectedPlayer.lastName?.default ?? ""
    }|${selectedPlayer.sweaterNumber ?? ""}`;
    return a === b;
  };

  return (
    <div className="p-4 border rounded-xl shadow bg-white text-gray-900 dark:bg-zinc-900 dark:text-zinc-100">
      <h3 className="text-lg font-semibold mb-3">
        {team ? `${team.fullName} — ${seasonId} Roster` : "Roster"}
      </h3>

      {rosterErr && (
        <div className="text-red-500 text-sm mb-2">{rosterErr}</div>
      )}

      {!roster ? (
        <div>Loading…</div>
      ) : !groups.length ? (
        <div className="text-sm opacity-80">No roster data.</div>
      ) : (
        <div className="max-h-96 overflow-auto rounded border border-zinc-200 dark:border-zinc-800 p-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {groups.map((g) => (
              <div key={g.label}>
                <h4 className="font-semibold mb-2">{g.label}</h4>
                <ul className="space-y-1">
                  {g.items.map((p, i) => {
                    const { num, name, pos, shoots } = formatPlayer(p);
                    const selected = isSelected(p);
                    return (
                      <li key={p.id ?? `${g.label}-${i}`}>
                        <button
                          type="button"
                          onClick={() => onSelect(p)}
                          aria-current={selected ? "true" : undefined}
                          className={`w-full flex items-center justify-between text-left text-sm px-2 py-1 rounded
                                      hover:bg-zinc-100 dark:hover:bg-zinc-800
                                      focus:outline-none focus:ring-2 focus:ring-blue-500
                                      ${
                                        selected
                                          ? "bg-zinc-100 dark:bg-zinc-800"
                                          : ""
                                      }`}
                        >
                          <span className="truncate">
                            <span className="tabular-nums mr-2 opacity-70">
                              {num}
                            </span>
                            <span className="font-medium">{name || "—"}</span>
                          </span>
                          <span className="opacity-70 text-xs">
                            {pos}
                            {shoots}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
