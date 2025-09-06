"use client";

import { ClubScheduleGame } from "./types";

type Props = { game: ClubScheduleGame | null };

export default function SelectedGameJson({ game }: Props) {
  return (
    <div className="p-4 border rounded-xl shadow bg-white text-gray-900 dark:bg-zinc-900 dark:text-zinc-100">
      <h4 className="text-md font-semibold mb-2">Selected Game JSON</h4>
      {!game ? (
        <div className="text-sm opacity-80">
          Select a game above to view details.
        </div>
      ) : (
        <pre className="text-xs p-2 rounded overflow-x-auto bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
          {JSON.stringify(game, null, 2)}
        </pre>
      )}
    </div>
  );
}
