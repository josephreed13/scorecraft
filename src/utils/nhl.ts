export function nhlUrl(path?: string | null) {
  if (!path) return null;
  // Some fields already include locale like /fr/... — keep as-is
  return `https://www.nhl.com${path}`;
}