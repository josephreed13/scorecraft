"use client";

import Image from "next/image";
import { ClubScheduleGame, Team } from "./types";
import { nhlUrl, formatDate, formatTimeET } from "./utils";

type Props = {
  team: Team | null;
  game: ClubScheduleGame | null;
};

export default function SelectedGameCard({ team, game }: Props) {
  if (!game) {
    return (
      <div className="p-4 border rounded-xl shadow bg-white text-gray-900 dark:bg-zinc-900 dark:text-zinc-100">
        <h4 className="text-md font-semibold mb-3">Selected Game</h4>
        <div className="text-sm opacity-80">Select a game to view details.</div>
      </div>
    );
  }

  const isHome = game.homeTeam?.abbrev === team?.triCode;
  const left = isHome ? game.homeTeam : game.awayTeam;
  const right = isHome ? game.awayTeam : game.homeTeam;
  const sep = isHome ? "vs" : "@";

  const leftName = `${left?.placeName?.default ?? ""} ${
    left?.commonName?.default ?? ""
  }`.trim();
  const rightName = `${right?.placeName?.default ?? ""} ${
    right?.commonName?.default ?? ""
  }`.trim();

  const leftScore = typeof left?.score === "number" ? left!.score : "—";
  const rightScore = typeof right?.score === "number" ? right!.score : "—";

  const links = {
    gamecenter: nhlUrl(game?.gameCenterLink),
    recapFr: nhlUrl(game?.threeMinRecapFr),
    cgFr: nhlUrl(game?.condensedGameFr),
  };

  return (
    <div className="p-4 border rounded-xl shadow bg-white text-gray-900 dark:bg-zinc-900 dark:text-zinc-100">
      <h4 className="text-md font-semibold mb-3">Selected Game</h4>

      <div className="text-sm opacity-80 mb-2">
        {formatDate(game.gameDate)} • {formatTimeET(game.startTimeUTC)} ET
      </div>

      {/* Matchup row */}
      <div className="flex items-center justify-between gap-3 mb-3">
        {/* Left */}
        <div className="flex items-center gap-2 min-w-0">
          {left?.logo && (
            <Image
              src={left.logo}
              alt={`${leftName} logo`}
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
          )}
          <div className="truncate">
            <div className="font-semibold truncate">{leftName}</div>
            <div className="text-xs opacity-70">{left?.abbrev}</div>
          </div>
        </div>

        <div className="shrink-0 text-base font-semibold opacity-80">{sep}</div>

        {/* Right */}
        <div className="flex items-center gap-2 justify-end min-w-0">
          <div className="text-right truncate">
            <div className="font-semibold truncate">{rightName}</div>
            <div className="text-xs opacity-70">{right?.abbrev}</div>
          </div>
          {right?.logo && (
            <Image
              src={right.logo}
              alt={`${rightName} logo`}
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
          )}
        </div>
      </div>

      {/* Score */}
      <div className="mt-3 text-center">
        <div className="text-4xl font-extrabold tracking-wide">
          {leftScore} <span className="mx-3">–</span> {rightScore}
        </div>
        {game.gameState && (
          <div className="mt-1 text-xs uppercase opacity-70 tracking-wider">
            {game.gameState}
          </div>
        )}
      </div>

      {/* Links */}
      {(links.gamecenter || links.recapFr || links.cgFr) && (
        <>
          <h5 className="text-sm font-semibold mt-4 mb-1">Links</h5>
          <ul className="flex flex-wrap gap-3 text-sm">
            {links.gamecenter && (
              <li>
                <a
                  className="underline hover:no-underline"
                  href={links.gamecenter}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open Gamecenter
                </a>
              </li>
            )}
            {links.recapFr && (
              <li>
                <a
                  className="underline hover:no-underline"
                  href={links.recapFr}
                  target="_blank"
                  rel="noreferrer"
                >
                  3-min Recap (FR)
                </a>
              </li>
            )}
            {links.cgFr && (
              <li>
                <a
                  className="underline hover:no-underline"
                  href={links.cgFr}
                  target="_blank"
                  rel="noreferrer"
                >
                  Condensed Game (FR)
                </a>
              </li>
            )}
          </ul>
        </>
      )}
    </div>
  );
}
