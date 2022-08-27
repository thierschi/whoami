import { PrismaClient } from '@prisma/client';
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { NodeHTTPCreateContextFnOptions } from '@trpc/server/adapters/node-http';
import { IncomingMessage } from 'http';
import _ from 'lodash';
import { getSession } from 'next-auth/react';
import ws from 'ws';

const prisma = new PrismaClient();

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
      const dbUser = await prisma.user.findUnique({
        where: { email: userMail },
      });

      user = {
        name: dbUser?.name,
        id: dbUser?.id,
      };
    }
  }

  return {
    req,
    res,
    user,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
