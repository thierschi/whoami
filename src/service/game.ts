import _ from 'lodash';
import { z } from 'zod';

export const userValidator = z.object({
  displayName: z.string().min(1),
  id: z.string().uuid(),
});

export const gameValidator = z.object({
  key: z.string().min(5).max(5),
  host: userValidator,
  players: z.array(
    z.object({
      user: userValidator,
      word: z.string().nullable(),
      selectsWordFor: userValidator.nullable(),
    }),
  ),
  started: z.boolean(),
  locked: z.boolean(),
});

export type IUser = z.infer<typeof userValidator>;
export type IGame = z.infer<typeof gameValidator>;

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

export const createNewGame = (user: IUser): IGame => {
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

export const joinGame = (code: string, user: IUser): IGame | null => {
  let game: IGame | null = getGame(code);

  if (_.isNull(game)) throw new Error(`No game with code ${code} exists.`);

  const playerWithName = game.players.filter(
    (p) => p.user.displayName === user.displayName,
  )[0];

  if (!_.isUndefined(playerWithName) && playerWithName.user.id !== user.id) {
    throw new Error('Name is taken');
  }

  const player = game.players.filter((p) => p.user.id === user.id)[0];

  if (_.isUndefined(player) && !game.started) {
    game.players.push({ user: user, word: null, selectsWordFor: null });

    return game;
  }

  return game;
};

// export const startGame = (code: string): IGame | null => {
//   let game: IGame | null = getGame(code);

//   if (_.isNull(game)) return null;
//   if (game.players.length <= 1) return null;

//   while (true) {
//     const players = [...game.players];
//     let playerNames = players.map((e) => e.name);
//     const newGame: IGame = { ...game, started: true, players: [] };

//     for (const p of players) {
//       const player = { ...p };

//       const r = Math.floor(Math.random() * playerNames.length);
//       player.partner = playerNames[r];
//       playerNames = playerNames.filter((e) => e !== player.partner);

//       newGame.players.push(player);
//     }

//     let allGood = true;

//     for (const p of newGame.players) {
//       if (p.name === p.partner) {
//         allGood = false;
//         break;
//       }
//     }

//     if (!allGood) continue;

//     game.players = newGame.players;
//     game.started = true;
//     return game;
//   }
// };

// export const setWord = (
//   code: string,
//   name: string,
//   word: string,
// ): IGame | null => {
//   const game = getGame(code);

//   if (
//     _.isNull(game) ||
//     game.players.filter((g) => g.name === name).length === 0 ||
//     game.locked ||
//     !game.started
//   )
//     return null;

//   const partnerName = game.players.filter((g) => g.name === name)[0].partner;
//   const partner = game.players.filter((g) => g.name === partnerName)[0];
//   partner.word = word;

//   return game;
// };

// export const lockGame = (code: string, name: string): IGame | null => {
//   const game = getGame(code);

//   if (_.isNull(game) || game.locked || !game.started) return null;

//   if (game.host !== name) return game;

//   if (game.players.filter((p) => _.isNull(p.word)).length > 0) {
//     return game;
//   }

//   game.locked = true;

//   return game;
// };

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
