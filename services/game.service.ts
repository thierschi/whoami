import { connected } from 'process';

export interface IGame {
    key: string;
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

export const createNewGame = () => {
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

        games.push({ key: code, players: [], started: false, locked: false });
        return code;
    }
};

export const getGame = (code: string): IGame | null => {
    let game: IGame | null = null;

    for (const g of games) {
        if (g.key === code && !g.locked) {
            game = g;
        }
    }

    return game;
};
