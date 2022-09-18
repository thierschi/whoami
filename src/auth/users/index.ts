import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import _ from 'lodash';
import { guestUserValidator, IGuestUser, IUser } from './types';

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

export const deleteGuestUser = async (id: string): Promise<void> => {
  await prisma.user.delete({ where: { id: id } });
};

export const getUserById = async (id: string): Promise<IUser | null> => {
  const dbUser = await prisma.user.findUnique({
    where: { id: id },
  });

  if (_.isNull(dbUser)) {
    return null;
  }

  return {
    id: dbUser.id,
    name: dbUser.name ?? '',
    email: dbUser.email,
    image: dbUser.image,
    isGuest: dbUser.isGuest,
  };
};

export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  const dbUser = await prisma.user.findUnique({
    where: { email: email },
  });

  if (_.isNull(dbUser)) {
    return null;
  }

  return {
    id: dbUser.id,
    name: dbUser.name ?? '',
    email: dbUser.email,
    image: dbUser.image,
    isGuest: dbUser.isGuest,
  };
};
