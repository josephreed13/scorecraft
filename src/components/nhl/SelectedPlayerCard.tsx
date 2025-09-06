"use client";

import { useState } from "react";
import Image from "next/image";
import { RosterPlayer } from "./types";
import { isRouteError } from "@/types/api";

type Props = { player: RosterPlayer | null };

// Minimal shape for the landing endpoint (all optional)
type PlayerLanding = {
  playerId?: number;
  firstName?: { default?: string };
  lastName?: { default?: string };
  positionCode?: string;
  shootsCatches?: string;
  heightInInches?: number;
  weightInPounds?: number;
  birthDate?: string;
  birthCity?: { default?: string };
  birthCountry?: string;
  currentTeam?: { id?: number; abbrev?: string; name?: { default?: string } };
  draftDetails?: { year?: number; overallPick?: number; teamAbbrev?: string };
  rookieSeason?: string;
  headshot?: string;
};

function initials(p?: RosterPlayer) {
  const f = p?.firstName?.default?.[0] ?? "";
  const l = p?.lastName?.default?.[0] ?? "";
  return (f + l).toUpperCase() || "—";
}
function fmtName(p: RosterPlayer) {
  return (
    `${p.firstName?.default ?? ""} ${p.lastName?.default ?? ""}`.trim() || "—"
  );
}
function fmtHeight(p: RosterPlayer) {
  if (p.heightInInches != null) {
    const inches = p.heightInInches;
    const ft = Math.floor(inches / 12);
    const inch = inches % 12;
    return `${ft}'${inch}"`;
  }
  if (p.heightInCentimeters != null) return `${p.heightInCentimeters} cm`;
  return "—";
}
function fmtWeight(p: RosterPlayer) {
  if (p.weightInPounds != null) return `${p.weightInPounds} lb`;
  if (p.weightInKilograms != null) return `${p.weightInKilograms} kg`;
  return "—";
}
function calcAge(birthDate?: string) {
  if (!birthDate) return "—";
  const b = new Date(birthDate);
  if (isNaN(b.getTime())) return "—";
  const now = new Date();
  let age = now.getUTCFullYear() - b.getUTCFullYear();
  const mNow = now.getUTCMonth(),
    dNow = now.getUTCDate();
  const mB = b.getUTCMonth(),
    dB = b.getUTCDate();
  if (mNow < mB || (mNow === mB && dNow < dB)) age--;
  return String(age);
}
function fmtBirthplace(p: RosterPlayer) {
  const city = p.birthCity?.default ?? "";
  const country = p.birthCountry ?? "";
  const loc = [city, country].filter(Boolean).join(", ");
  return loc || "—";
}

export default function SelectedPlayerCard({ player }: Props) {
  const title = "Selected Player";

  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [more, setMore] = useState<PlayerLanding | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onViewMore() {
    if (!player?.id) return;
    // Toggle closed
    if (expanded) {
      setExpanded(false);
      return;
    }
    // Expand immediately (so skeleton can show), then fetch if needed
    setExpanded(true);
    if (more) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/nhl/player?id=${player.id}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body: unknown = await res.json();
      if (isRouteError(body)) {
        setError(body.message ?? body.error);
        return;
      }
      setMore(body as PlayerLanding);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load player");
    } finally {
      setLoading(false);
    }
  }

  if (!player) {
    return (
      <div className="p-4 border rounded-xl shadow bg-white text-gray-900 dark:bg-zinc-900 dark:text-zinc-100">
        <h4 className="text-md font-semibold mb-3">{title}</h4>
        <div className="text-sm opacity-80">
          Select a player from the roster.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-xl shadow bg-white text-gray-900 dark:bg-zinc-900 dark:text-zinc-100">
      <h4 className="text-md font-semibold mb-3">{title}</h4>

      {/* Row: headshot left, meta right */}
      <div className="flex items-start gap-4">
        {player.headshot ? (
          <Image
            src={player.headshot}
            alt={`${fmtName(player)} headshot`}
            width={144}
            height={144}
            className="h-36 w-36 rounded-lg object-cover bg-zinc-200 dark:bg-zinc-800"
          />
        ) : (
          <div className="h-36 w-36 flex items-center justify-center rounded-lg bg-zinc-200 dark:bg-zinc-800 text-2xl font-bold">
            {initials(player)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="text-2xl font-semibold truncate">
            {fmtName(player)}
          </div>
          <div className="mt-1 text-sm opacity-80">
            {player.positionCode ?? "—"} · {player.shootsCatches ?? "—"} ·{" "}
            {player.sweaterNumber != null ? `#${player.sweaterNumber}` : "—"}
          </div>
        </div>
      </div>

      {/* Two columns under the row: Height/Weight | Age/Birthplace */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="opacity-70 text-xs uppercase">Height</div>
          <div className="font-medium">{fmtHeight(player)}</div>

          <div className="opacity-70 text-xs uppercase mt-3">Weight</div>
          <div className="font-medium">{fmtWeight(player)}</div>
        </div>
        <div>
          <div className="opacity-70 text-xs uppercase">Age</div>
          <div className="font-medium">{calcAge(player.birthDate)}</div>

          <div className="opacity-70 text-xs uppercase mt-3">Birthplace</div>
          <div className="font-medium">{fmtBirthplace(player)}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4">
        <button
          type="button"
          onClick={onViewMore}
          disabled={!player.id}
          className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm
                     hover:bg-zinc-100 dark:hover:bg-zinc-800"
          aria-expanded={expanded}
          aria-controls="player-more"
        >
          {expanded ? "Hide details" : "View more"}
          {loading && (
            <span className="inline-block h-3 w-3 rounded-full animate-pulse bg-zinc-400 dark:bg-zinc-600" />
          )}
        </button>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </div>

      {/* Expanded details: skeleton while loading, then content */}
      {expanded && (
        <div id="player-more" className="mt-4">
          {loading && (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              aria-busy="true"
              aria-live="polite"
            >
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-24 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                  <div className="h-4 w-40 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                </div>
              ))}
            </div>
          )}

          {!loading && more && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="opacity-70 text-xs uppercase">Current Team</div>
                <div className="font-medium">
                  {more.currentTeam?.name?.default ??
                    more.currentTeam?.abbrev ??
                    "—"}
                </div>
              </div>
              <div>
                <div className="opacity-70 text-xs uppercase">
                  Rookie Season
                </div>
                <div className="font-medium">{more.rookieSeason ?? "—"}</div>
              </div>
              <div>
                <div className="opacity-70 text-xs uppercase">Draft</div>
                <div className="font-medium">
                  {more.draftDetails?.year
                    ? `${more.draftDetails.overallPick ?? "—"} overall • ${
                        more.draftDetails.year
                      } • ${more.draftDetails.teamAbbrev ?? "—"}`
                    : "—"}
                </div>
              </div>
              <div>
                <div className="opacity-70 text-xs uppercase">
                  Shoots/Catches
                </div>
                <div className="font-medium">{more.shootsCatches ?? "—"}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
