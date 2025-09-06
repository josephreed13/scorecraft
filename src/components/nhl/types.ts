export type DefaultString = { default?: string };

export type Team = {
  id: number;
  franchiseId: number;
  fullName: string;
  leagueId: number;
  rawTricode: string;
  triCode: string;
};

export type ClubScheduleGameTeam = {
  abbrev?: string;
  id?: number;
  score?: number;
  logo?: string;
  placeName?: DefaultString;
  commonName?: DefaultString;
};

export type ClubScheduleGame = {
  id?: number;
  season?: number;
  gameType?: number;
  gameDate?: string;
  startTimeUTC?: string;
  gameState?: string;
  venue?: DefaultString;
  homeTeam?: ClubScheduleGameTeam;
  awayTeam?: ClubScheduleGameTeam;
  gameCenterLink?: string;
  threeMinRecapFr?: string;
  condensedGameFr?: string;
};

export type RosterPlayer = {
  id?: number;
  headshot?: string;
  firstName?: DefaultString;
  lastName?: DefaultString;
  sweaterNumber?: number;
  positionCode?: string;
  shootsCatches?: string;
  heightInInches?: number;
  weightInPounds?: number;
  heightInCentimeters?: number;
  weightInKilograms?: number;
  birthDate?: string;
  birthCity?: DefaultString;
  birthCountry?: string;
};

export type ClubRosterResponse = {
  // api-web format (most common)
  forwards?: RosterPlayer[];
  defensemen?: RosterPlayer[];
  goalies?: RosterPlayer[];
  // fallback for other shapes
  roster?: RosterPlayer[];
};
