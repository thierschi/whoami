import { atom } from 'recoil';

export const notesAtom = atom<string[]>({
    key: 'notes-atom',
    default: [],
});
