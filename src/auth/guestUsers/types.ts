import { z } from 'zod';

export const guestUserValidator = z.object({
  id: z.string().cuid(),
  name: z.string().min(1),
  secret: z.string().min(1),
});

export type IGuestUser = z.infer<typeof guestUserValidator>;
