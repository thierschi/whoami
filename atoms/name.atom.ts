import { atom } from 'recoil';

export const nameAtom = atom<string | null>({
    key: 'name-atom',
    default: null,
});
