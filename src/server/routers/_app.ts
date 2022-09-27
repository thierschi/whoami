/**
 * This file contains the root router of your tRPC-backend
 */
import { TRPCError } from '@trpc/server';
import { EventEmitter } from 'events';
import _ from 'lodash';

import * as trpc from '@trpc/server';
import superjson from 'superjson';
import { z } from 'zod';
import { User } from '../../auth/users';
import { game } from '../../game';
import { createRouter } from '../createRouter';

import { gameStroage } from '../../game/memStorage';
import { IGame } from '../../game/types';

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
  .mutation('registerGuestUser', {
    input: z.string(),
    async resolve({ ctx, input }) {
      const user = await User.guest.createNew(input);

      return user;
    },
  })
  .query('me', {
    async resolve({ ctx }) {
      if (!_.isNull(ctx.user)) {
        User.updateLastSeen(ctx.user.id);
      }
      return ctx.user;
    },
  })
  .mutation('signOutGuest', {
    async resolve({ ctx }) {
      if (_.isNull(ctx.user) || !ctx.user?.isGuest) {
        return;
      }
      User.guest.delete(ctx.user.id);
    },
  })
  .mutation('createNewGame', {
    async resolve({ ctx }) {
      if (_.isNull(ctx.user)) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        });
      }
      return game.createNew(ctx.user);
    },
  })
  .query('getGame', {
    input: z.string().min(5).max(5),
    async resolve({ input, ctx }) {
      if (_.isNull(ctx.user)) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        });
      }
      return game.get(input, ctx.user);
    },
  })
  .subscription('onGameChange', {
    input: z.string().min(5).max(5),
    resolve({ input, ctx }) {
      if (_.isNull(ctx.user)) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        });
      }
      game.player.setActive(input, ctx.user, true);

      return new trpc.Subscription<IGame>((emit: any) => {
        const onGameChange = (g: IGame) => {
          emit.data(g);
        };

        gameStroage.addListener(input, onGameChange);

        // unsubscribe function when client disconnects or stops subscribing
        return () => {
          gameStroage.removeListener(input, onGameChange);
          if (!_.isNull(ctx.user)) {
            game.player.setActive(input, ctx.user, false);
          }
        };
      });
    },
  })
  .mutation('joinGame', {
    input: z.string().min(5).max(5),
    async resolve({ input, ctx }) {
      if (_.isNull(ctx.user)) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        });
      }
      return game.join(input, ctx.user);
    },
  })
  .mutation('startGame', {
    input: z.string().min(5).max(5),
    async resolve({ input, ctx }) {
      if (_.isNull(ctx.user)) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        });
      }
      game.start(input, ctx.user);
    },
  })
  .mutation('setWord', {
    input: z.object({
      key: z.string().min(5).max(5),
      word: z.object({
        word: z.string().min(1),
        description: z.string().optional(),
        url: z.string().url().optional(),
      }),
    }),
    async resolve({ input, ctx }) {
      if (_.isNull(ctx.user)) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        });
      }
      return game.word.set(input.key, ctx.user, input.word);
    },
  })
  .mutation('lockGame', {
    input: z.string().min(5).max(5),
    async resolve({ input, ctx }) {
      if (_.isNull(ctx.user)) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
        });
      }
      return game.lock(input, ctx.user);
    },
  });

export type AppRouter = typeof appRouter;

// TEMPLATE WS
// .subscription('onAdd', {
//   input: z.string(),
//   resolve({ input, ctx }) {
//     console.log(input);
//     // `resolve()` is triggered for each client when they start subscribing `onAdd`

//     // return a `Subscription` with a callback which is triggered immediately
//     return new trpc.Subscription<Post>((emit: any) => {
//       const onAdd = (data: Post) => {
//         console.log('onAdd', data);
//         // emit data to client
//         emit.data(data);
//       };

//       // trigger `onAdd()` when `add` is triggered in our event emitter
//       ee.on('add', onAdd);

//       // unsubscribe function when client disconnects or stops subscribing
//       return () => {
//         ee.off('add', onAdd);
//       };
//     });
//   },
// })
