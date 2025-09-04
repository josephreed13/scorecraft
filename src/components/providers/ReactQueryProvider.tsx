"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const DEFAULT_QUERY_OPTIONS = {
  queries: {
    // Reasonable defaults for dashboards?
    staleTime: 30_000, // 30s
    refetchOnWindowFocus: false,
    retry: 1,
  },
};

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: DEFAULT_QUERY_OPTIONS })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {/* debugger */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
