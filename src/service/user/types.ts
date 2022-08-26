import { z } from 'zod';

export const userValidator = z.object({
  id: z.string().cuid(),
  secret: z.string(),
  name: z.string().min(1),
});

export type IUser = z.infer<typeof userValidator>;
