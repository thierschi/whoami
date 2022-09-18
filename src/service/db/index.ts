import { Prisma, PrismaClient } from '@prisma/client';
import _ from 'lodash';

let _instance: PrismaClient<
  Prisma.PrismaClientOptions,
  never,
  Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
> | null = null;

export const getPrismaClient = () => {
  if (_.isNull(_instance)) {
    _instance = new PrismaClient();
  }

  return _instance;
};
