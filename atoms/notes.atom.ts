import { atom } from 'recoil';
import { INote } from '../model/local-storage/local-storage.mode';

export const notesAtom = atom<INote[]>({
    key: 'notes-atom',
    default: [],
});
