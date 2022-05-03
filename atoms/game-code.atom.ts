import { atom } from 'recoil';

export const gameCodeAtom = atom<string | null>({
    key: 'game-code-atom',
    default: null,
});
