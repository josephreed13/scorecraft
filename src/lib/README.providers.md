# Providers Overview


This folder centralizes app-wide providers. Today it includes:


- **ReactQueryProvider** — sets sane defaults for a data-heavy dashboard.
- **ThemeProvider** — stubbed; swap in `next-themes` when you want dark/system theme.


## Devtools (optional but recommended)
```bash
npm i -D @tanstack/react-query-devtools
```
Then uncomment the import and `<ReactQueryDevtools />` in `ReactQueryProvider.tsx`.


## Why `useState` for QueryClient?
Prevents a new client on each render under React 18 Strict Mode.