import { z } from 'zod';

export const guestUserValidator = z.object({
  id: z.string().cuid(),
  name: z.string().min(1),
  secret: z.string().min(1),
});

export type IGuestUser = z.infer<typeof guestUserValidator>;

export const userValidator = z.object({
  id: z.string().cuid(),
  name: z.string().min(1),
  email: z.string().email().nullable(),
  image: z.string().url().nullable(),
  isGuest: z.boolean(),
});

export type IUser = z.infer<typeof userValidator>;
