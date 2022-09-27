import { z } from 'zod';
import { userValidator } from '../auth/users/types';

export const gameValidator = z.object({
  key: z.string().min(5).max(5),
  host: userValidator,
  players: z.array(
    z.object({
      user: userValidator,
      isActive: z.boolean(),
      word: z
        .object({
          word: z.string().min(1),
          description: z.string().optional(),
          url: z.string().url().optional(),
        })
        .optional(),
      selectsWordFor: userValidator.optional(),
    }),
  ),
  started: z.boolean(),
  locked: z.boolean(),
});

export type IGame = z.infer<typeof gameValidator>;
