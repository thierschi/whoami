// import { PrismaClient } from '@prisma/client';
// import crypto from 'crypto';
// import { IUser } from './types';

// const prisma = new PrismaClient();

// export const createNewUser = async (name: string): Promise<IUser> => {
//   const secret = crypto.randomBytes(2048).toString('base64');

//   const newUser = await prisma.user.create({
//     data: { name: name, secret: secret },
//   });

//   return newUser;
// };

// export const changeUserName = async (user: IUser): Promise<IUser> => {
//   const updatedUser = await prisma.user.update({
//     where: { id: user.id },
//     data: { name: user.name },
//   });

//   return updatedUser;
// };

export {};
