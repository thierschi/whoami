import _ from 'lodash';

export interface IGame {
    key: string;
    host: string;
    players: {
        name: string;
        word: string | null;
        partner: string | null;
    }[];
    started: boolean;
    locked: boolean;
}

const games: IGame[] = [
    {
        key: 'test',
        host: 'Lukas',
        players: [
            {
                name: 'Lukas',
                word: null,
                partner: null,
            },
            {
                name: 'Mxi',
                word: null,
                partner: null,
            },
            {
                name: 'Nico',
                word: null,
                partner: null,
            },
            {
                name: 'Mauritz',
                word: null,
                partner: null,
            },
            {
                name: 'Justin',
                word: null,
                partner: null,
            },
            {
                name: 'Anika',
                word: null,
                partner: null,
            },
        ],
        started: false,
        locked: false,
    },
];

export const createNewGame = (name: string): IGame => {
    while (true) {
        let characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ0123456789';
        let code = '';

        for (var i = 0; i < 5; i++) {
            code += characters.charAt(
                Math.floor(Math.random() * characters.length)
            );
        }

        for (const g of games) {
            if (g.key === code) continue;
        }

        const newGame = {
            key: code,
            host: name,
            players: [{ name: name, word: null, partner: null }],
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

export const joinGame = (code: string, name: string): IGame | null => {
    let game: IGame | null = getGame(code);

    if (_.isNull(game)) return null;

    const player = game.players.filter(
        (p) => p.name.split('(guid)')[0] === name.split('(guid)')[0]
    )[0];

    if (_.isUndefined(player)) {
        game.players.push({ name: name, word: null, partner: null });

        console.log(games);
        return game;
    }

    if (player.name === name) {
        return game;
    }

    throw new Error('Name is taken');
};

export const startGame = (code: string): IGame | null => {
    let game: IGame | null = getGame(code);

    if (_.isNull(game)) return null;

    while (true) {
        const players = [...game.players];
        let playerNames = players.map((e) => e.name);
        const newGame: IGame = { ...game, started: true, players: [] };

        for (const p of players) {
            const player = { ...p };

            const r = Math.floor(Math.random() * playerNames.length);
            player.partner = playerNames[r];
            playerNames = playerNames.filter((e) => e !== player.partner);

            newGame.players.push(player);
        }

        let allGood = true;

        for (const p of newGame.players) {
            if (p.name === p.partner) {
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
