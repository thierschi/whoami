import { TRPCError } from '@trpc/server';
import _ from 'lodash';
import { IUser } from '../auth/users/types';
import { gameStroage } from './memStorage';
import { IGame } from './types';

const createNewGame = (user: IUser): IGame => {
  while (true) {
    let characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ0123456789';
    let code = '';

    for (var i = 0; i < 5; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    const newGame: IGame = {
      key: code,
      host: user,
      players: [
        {
          user: user,
          word: undefined,
          isActive: false,
          selectsWordFor: undefined,
        },
      ],
      started: false,
      locked: false,
    };

    try {
      gameStroage.add(newGame);
    } catch (e) {
      continue;
    }

    return newGame;
  }
};

const getGame = (code: string, user: IUser): IGame => {
  const game = gameStroage.get(code);

  if (_.isUndefined(game)) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `The game with code ${code} was not found.`,
    });
  }
  if (_.isUndefined(game.players.find((p) => p.user.id === user.id))) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: `You are not the host of game ${code}.`,
    });
  }

  return game;
};

const joinGame = (code: string, user: IUser): IGame => {
  const game = gameStroage.get(code);

  if (_.isUndefined(game)) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `The game with code ${code} was not found.`,
    });
  }

  for (const player of game.players) {
    if (player.user.name === user.name) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: `A user with name ${user.name} already joined in the game ${code}`,
      });
    }

    if (player.user.id === user.id) {
      return game;
    }
  }

  const newGame = { ...game };
  newGame.players.push({
    user: user,
    isActive: false,
    word: undefined,
    selectsWordFor: undefined,
  });
  gameStroage.update(newGame);

  return newGame;
};

const startGame = (code: string, user: IUser): IGame => {
  const game = gameStroage.get(code);

  if (_.isUndefined(game)) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `The game with code ${code} was not found.`,
    });
  }
  if (game.host.id !== user.id) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: `You are not the host of game ${code}.`,
    });
  }
  if (game.players.length <= 1) {
    throw new TRPCError({
      code: 'PRECONDITION_FAILED',
      message: 'A game must have 2 or more players to be started.',
    });
  }

  while (true) {
    const players = [...game.players];
    let users = players.map((e) => e.user);
    const newGame: IGame = { ...game, started: true, players: [] };

    for (const p of players) {
      const newPlayer = { ...p };

      const r = Math.floor(Math.random() * users.length);
      const selectedUser = users[r];
      newPlayer.selectsWordFor = selectedUser;
      users = users.filter((u) => u.id !== selectedUser.id);

      newGame.players.push(newPlayer);
    }

    let allGood = true;

    for (const p of newGame.players) {
      if (p.user.id === p.selectsWordFor?.id) {
        allGood = false;
        break;
      }
    }

    if (!allGood) continue;

    gameStroage.update(newGame);
    return newGame;
  }
};

const setWord = (
  code: string,
  user: IUser,
  word: { word: string; description?: string; url?: string },
): IGame => {
  const game = gameStroage.get(code);

  if (_.isUndefined(game)) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `The game with code ${code} was not found.`,
    });
  }

  if (game.players.findIndex((g) => g.user.id === user.id) === -1) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: `You are not a player of game ${code}.`,
    });
  }

  if (game.locked || !game.started) {
    throw new TRPCError({
      code: 'PRECONDITION_FAILED',
      message: `A word cannot be set, because the game is either locked or not started yet.`,
    });
  }

  const newGame = { ...game };

  const selectWordFor = newGame.players.find(
    (g) => g.user.id === user.id,
  )?.selectsWordFor;
  const partner = newGame.players.find((g) => g.user.id === selectWordFor?.id);

  if (_.isUndefined(partner)) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Should not be undefined!',
    });
  }

  partner.word = word;

  gameStroage.update(newGame);
  return newGame;
};

const lockGame = (code: string, user: IUser): IGame => {
  const game = gameStroage.get(code);

  if (_.isUndefined(game)) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `The game with code ${code} was not found.`,
    });
  }

  if (game.host.id !== user.id) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: `You are not the host of game ${code}.`,
    });
  }

  if (game.locked || !game.started) {
    throw new TRPCError({
      code: 'PRECONDITION_FAILED',
      message: `A word cannot be set, because the game is either locked or not started yet.`,
    });
  }

  if (game.players.filter((p) => _.isUndefined(p.word)).length > 0) {
    throw new TRPCError({
      code: 'PRECONDITION_FAILED',
      message: 'One or more players do not have a word set yet.',
    });
  }

  const newGame: IGame = { ...game, locked: true };

  gameStroage.update(newGame);
  return newGame;
};

const setActive = (code: string, user: IUser, isActive: boolean): void => {
  const game = gameStroage.get(code);

  if (_.isUndefined(game)) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: `The game with code ${code} was not found.`,
    });
  }

  const newGame = { ...game };
  const player = newGame.players.find((p) => p.user.id === user.id);

  if (_.isUndefined(player)) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: `You are not a player in game ${code}`,
    });
  }

  player.isActive = isActive;

  gameStroage.update(newGame);
};

export const game = {
  createNew: createNewGame,
  get: getGame,
  join: joinGame,
  start: startGame,
  lock: lockGame,
  word: {
    set: setWord,
  },
  player: {
    setActive: setActive,
  },
};
