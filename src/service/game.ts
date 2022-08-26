import * as trpc from '@trpc/server';
import _ from 'lodash';
import { IGame, IPlayer } from './game.model';

const games: IGame[] = [
  {
    key: 'test',
    host: {
      displayName: 'Lukas',
      id: '2',
    },
    players: [
      {
        user: {
          displayName: 'Lukas',
          id: '2',
        },
        word: null,
        selectsWordFor: null,
      },
      {
        user: {
          displayName: 'Maxi',
          id: '3',
        },
        word: null,
        selectsWordFor: null,
      },
      {
        user: {
          displayName: 'Nico',
          id: '4',
        },
        word: null,
        selectsWordFor: null,
      },
      {
        user: {
          displayName: 'Mauritz',
          id: '5',
        },
        word: null,
        selectsWordFor: null,
      },
      {
        user: {
          displayName: 'Justin',
          id: '6',
        },
        word: null,
        selectsWordFor: null,
      },
    ],
    started: false,
    locked: false,
  },
];

export const createNewGame = (user: IPlayer): IGame => {
  while (true) {
    let characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ0123456789';
    let code = '';

    for (var i = 0; i < 5; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    for (const g of games) {
      if (g.key === code) continue;
    }

    const newGame: IGame = {
      key: code,
      host: user,
      players: [{ user: user, word: null, selectsWordFor: null }],
      started: false,
      locked: false,
    };

    games.push(newGame);
    return newGame;
  }
};

export const getGame = (code: string): IGame | null => {
  let game: IGame | null = null;

  for (const g of games) {
    if (g.key === code) {
      game = g;
    }
  }

  return game;
};

export const joinGame = (code: string, user: IPlayer): IGame | null => {
  let game: IGame | null = getGame(code);

  if (_.isNull(game))
    throw new trpc.TRPCError({
      code: 'NOT_FOUND',
      message: `The game with code ${code} was not found.`,
    });

  const playerWithName = game.players.filter(
    (p) => p.user.displayName === user.displayName,
  )[0];

  if (!_.isUndefined(playerWithName) && playerWithName.user.id !== user.id) {
    throw new trpc.TRPCError({
      code: 'CONFLICT',
      message: `There is already a user with name ${user.displayName} joined in the game ${code}`,
    });
  }

  const player = game.players.filter((p) => p.user.id === user.id)[0];

  if (_.isUndefined(player) && !game.started) {
    game.players.push({ user: user, word: null, selectsWordFor: null });

    return game;
  }

  return game;
};

export const startGame = (code: string): IGame | null => {
  let game: IGame | null = getGame(code);

  if (_.isNull(game)) {
    throw new trpc.TRPCError({
      code: 'NOT_FOUND',
      message: `The game with code ${code} was not found.`,
    });
  }
  if (game.players.length <= 1) {
    throw new trpc.TRPCError({
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
      newPlayer.selectsWordFor = users[r];
      users = users.filter((u) => u.id !== newPlayer.selectsWordFor?.id);

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

    game.players = newGame.players;
    game.started = true;
    return game;
  }
};

export const setWord = (code: string, user: IPlayer, word: string): IGame => {
  const game = getGame(code);

  if (_.isNull(game)) {
    throw new trpc.TRPCError({
      code: 'NOT_FOUND',
      message: `The game with code ${code} was not found.`,
    });
  }

  if (game.players.filter((g) => g.user.id === user.id).length === 0) {
    throw new trpc.TRPCError({
      code: 'UNAUTHORIZED',
      message: `You are not a player of game ${code}.`,
    });
  }

  if (game.locked || !game.started) {
    throw new trpc.TRPCError({
      code: 'PRECONDITION_FAILED',
      message: `A word cannot be set, because the game is either locked or not started yet.`,
    });
  }

  const selectWordFor = game.players.filter((g) => g.user.id === user.id)[0]
    .selectsWordFor;
  const partner = game.players.filter(
    (g) => g.user.id === selectWordFor?.id,
  )[0];
  partner.word = word;

  return game;
};

export const lockGame = (code: string, user: IPlayer): IGame => {
  const game = getGame(code);

  if (_.isNull(game)) {
    throw new trpc.TRPCError({
      code: 'NOT_FOUND',
      message: `The game with code ${code} was not found.`,
    });
  }

  if (game.host.id !== user.id) {
    throw new trpc.TRPCError({
      code: 'UNAUTHORIZED',
      message: `You are not the host of game ${code}.`,
    });
  }

  if (game.locked || !game.started) {
    throw new trpc.TRPCError({
      code: 'PRECONDITION_FAILED',
      message: `A word cannot be set, because the game is either locked or not started yet.`,
    });
  }

  if (game.players.filter((p) => _.isNull(p.word)).length > 0) {
    throw new trpc.TRPCError({
      code: 'PRECONDITION_FAILED',
      message: 'One or more players do not have a word set yet.',
    });
  }

  game.locked = true;

  return game;
};

// export const sanitizeGame = (game_: IGame, name: string): ISanitizedGame => {
//   const game = { ...game_ };
//   const sanitizedGame: ISanitizedGame = {
//     key: game.key,
//     host: game.host === name,
//     players: [],
//     started: game.started,
//     locked: game.locked,
//   };

//   for (const player of game.players) {
//     const newPlayer: typeof player = {
//       name: player.name === name ? player.name : player.name.split('(guid)')[0],
//       word:
//         player.name === name
//           ? _.isNull(player.word)
//             ? null
//             : ''
//           : player.word,
//       partner: _.isNull(player.partner)
//         ? null
//         : player.partner.split('(guid)')[0],
//     };

//     sanitizedGame.players.push(newPlayer);
//   }

//   return sanitizedGame;
// };
