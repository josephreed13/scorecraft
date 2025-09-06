import { z } from "zod";

export const TeamSchema = z.object({
  id: z.number(),
  name: z.string(),
  abbreviation: z.string().optional(),
});
export type Team = z.infer<typeof TeamSchema>;

export const GameTeamSchema = z.object({
  score: z.number(),
  team: TeamSchema.pick({ id: true, name: true }),
});

export const GameSchema = z.object({
  gamePk: z.number(),
  gameDate: z.string(), // ISO date
  status: z.object({
    abstractGameState: z.string(),
    codedGameState: z.string(),
    detailedState: z.string(),
    statusCode: z.string(),
    startTimeTBD: z.boolean().optional(),
  }),
  teams: z.object({
    away: GameTeamSchema,
    home: GameTeamSchema,
  }),
});
export type Game = z.infer<typeof GameSchema>;

export const ScheduleResponseSchema = z.object({
  dates: z
    .array(
      z.object({
        date: z.string(),
        games: z.array(GameSchema),
      })
    )
    .default([]),
});
export type ScheduleResponse = z.infer<typeof ScheduleResponseSchema>;
