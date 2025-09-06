export type Team = {
  id: number;
  franchiseId: number;
  fullName: string;
  leagueId: number;
  rawTricode: string;
  triCode: string;
};

export type ClubScheduleGame = {
  id?: number;
  season?: number;
  gameType?: number;
  gameDate?: string;
  startTimeUTC?: string;
  gameState?: string;
  venue?: { default?: string };
  homeTeam?: {
    abbrev?: string;
    id?: number;
    score?: number;
    logo?: string;
    placeName?: { default?: string };
    commonName?: { default?: string };
  };
  awayTeam?: {
    abbrev?: string;
    id?: number;
    score?: number;
    logo?: string;
    placeName?: { default?: string };
    commonName?: { default?: string };
  };
  gameCenterLink?: string;
  threeMinRecapFr?: string;
  condensedGameFr?: string;
};

export type ClubScheduleResponse = { games?: ClubScheduleGame[] };
