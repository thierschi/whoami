import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { IUser, userValidator } from '../../service/user/types';
import { guestUserValidator, IGuestUser } from './types';

const prisma = new PrismaClient();

export const createNewGuestUser = async (name: string): Promise<IGuestUser> => {
  const secret = crypto.randomBytes(2048).toString('base64');

  const newUser = await prisma.user.create({
    data: { name: name, isGuest: true },
  });

  const newSecret = await prisma.guestSecret.create({
    data: {
      userId: newUser.id,
      secret: secret,
    },
  });

  const newGuestUser = {
    name: newUser.name,
    id: newUser.id,
    secret: newSecret.secret,
  };

  return guestUserValidator.parse(newGuestUser);
};

export const getUser = async (id: string): Promise<IUser | null> => {
  const user = await prisma.user.findUnique({
    where: { id: id },
  });

  return userValidator.nullable().parse(user);
};
