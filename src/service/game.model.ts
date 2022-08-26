import { z } from 'zod';

export const playerValidator = z.object({
  displayName: z.string().min(1),
  id: z.string().uuid(),
});

export const gameValidator = z.object({
  key: z.string().min(5).max(5),
  host: playerValidator,
  players: z.array(
    z.object({
      user: playerValidator,
      word: z.string().nullable(),
      selectsWordFor: playerValidator.nullable(),
    }),
  ),
  started: z.boolean(),
  locked: z.boolean(),
});

export type IPlayer = z.infer<typeof playerValidator>;
export type IGame = z.infer<typeof gameValidator>;
