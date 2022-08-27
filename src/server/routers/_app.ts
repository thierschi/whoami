/**
 * This file contains the root router of your tRPC-backend
 */
import * as trpc from '@trpc/server';
import { EventEmitter } from 'events';

import superjson from 'superjson';
import { z } from 'zod';
import { createNewGuestUser } from '../../auth/guestUsers';
import { createNewGame, getGame, joinGame } from '../../service/game';
import { playerValidator } from '../../service/game.model';
import { createRouter } from '../createRouter';

const ee = new EventEmitter();

export interface Post {
  text: string;
}

/**
 * Create your application's root router
 * If you want to use SSG, you need export this
 * @link https://trpc.io/docs/ssg
 * @link https://trpc.io/docs/router
 */
export const appRouter = createRouter()
  .transformer(superjson)
  .subscription('onAdd', {
    resolve({ ctx }) {
      // `resolve()` is triggered for each client when they start subscribing `onAdd`

      // return a `Subscription` with a callback which is triggered immediately
      return new trpc.Subscription<Post>((emit: any) => {
        const onAdd = (data: Post) => {
          console.log('onAdd', data);
          // emit data to client
          emit.data(data);
        };

        // trigger `onAdd()` when `add` is triggered in our event emitter
        ee.on('add', onAdd);

        // unsubscribe function when client disconnects or stops subscribing
        return () => {
          ee.off('add', onAdd);
        };
      });
    },
  })
  .mutation('add', {
    input: z.object({
      text: z.string().min(1),
    }),
    async resolve({ ctx, input }) {
      ee.emit('add', input);
    },
  })
  .mutation('createGame', {
    input: playerValidator,
    async resolve({ ctx, input }) {
      return createNewGame(input);
    },
  })
  .mutation('joinGame', {
    input: z.object({ user: playerValidator, code: z.string().min(5).max(5) }),
    async resolve({ ctx, input }) {
      console.log('joinGame');
      return joinGame(input.code, input.user);
    },
  })
  .query('getGame', {
    input: z.string().min(5).max(5),
    async resolve({ ctx, input }) {
      return getGame(input);
    },
  })
  .mutation('registerGuestUser', {
    input: z.string(),
    async resolve({ ctx, input }) {
      const user = await createNewGuestUser(input);

      return user;
    },
  })
  .mutation('ping', {
    async resolve({ ctx }) {
      return ctx;
    },
  });

export type AppRouter = typeof appRouter;
