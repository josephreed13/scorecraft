import Link from "next/link";

export default function HomePage() {
  return (
    <main className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Scorecraft</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/nhl"
          className="block rounded-xl border shadow p-5
                     bg-white text-gray-900
                     hover:bg-zinc-50
                     dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-800
                     dark:hover:bg-zinc-800"
        >
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">NHL Dashboard</span>
            <span aria-hidden className="text-xl">
              →
            </span>
          </div>
          <p className="text-sm opacity-70 mt-1">
            Explore teams, schedules, and game details.
          </p>
        </Link>
      </div>
    </main>
  );
}
