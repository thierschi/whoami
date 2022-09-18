import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { NodeHTTPCreateContextFnOptions } from '@trpc/server/adapters/node-http';
import { IncomingMessage } from 'http';
import _ from 'lodash';
import { getSession } from 'next-auth/react';
import ws from 'ws';
import { getUserByEmail, getUserById } from '../auth/users';
import { getPrismaClient } from '../service/db';

const prisma = getPrismaClient();

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async ({
  req,
  res,
}:
  | trpcNext.CreateNextContextOptions
  | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>) => {
  const session = await getSession({ req });
  let user = null;

  if (!_.isNull(session)) {
    const userMail = session.user?.email;

    if (!_.isNull(userMail)) {
      const dbUser = await getUserByEmail(session.user?.email ?? '');

      if (!_.isNull(dbUser)) {
        user = dbUser;
      }
    }
  }

  if (
    _.isNull(user) &&
    !_.isUndefined(req.headers.cookie) &&
    req.headers.cookie?.indexOf('whoami.guest.id') > -1 &&
    req.headers.cookie?.indexOf('whoami.guest.secret') > -1
  ) {
    const cookies = req.headers.cookie
      ?.split(';')
      .map((e) => e.replace(/^\s*/g, '').split('='));

    const guestIdEncoded = cookies?.filter(
      (e) => e[0] === 'whoami.guest.id',
    )[0][1];
    const guestSecretEncoded = cookies?.filter(
      (e) => e[0] === 'whoami.guest.secret',
    )[0][1];

    const guestId = _.isUndefined(guestIdEncoded)
      ? undefined
      : decodeURIComponent(guestIdEncoded);
    const guestSecret = _.isUndefined(guestSecretEncoded)
      ? undefined
      : decodeURIComponent(guestSecretEncoded);

    if (!_.isUndefined(guestId) && !_.isUndefined(guestSecret)) {
      const dbUser = await getUserById(guestId);
      const dbSecret = await prisma.guestSecret.findUnique({
        where: { userId: guestId },
      });

      if (
        !_.isNull(dbUser) &&
        !_.isNull(dbSecret) &&
        dbSecret.secret === guestSecret
      ) {
        user = dbUser;
      }
    }
  }

  return {
    req,
    res,
    user,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
