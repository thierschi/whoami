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

export interface ISanitizedGame {
    key: string;
    host: boolean;
    players: {
        name: string;
        word: string | null;
        partner: string | null;
    }[];
    started: boolean;
    locked: boolean;
}
