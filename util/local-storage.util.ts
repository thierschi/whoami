import _ from 'lodash';
import { ILocalNotes } from '../model/local-storage/local-storage.mode';

const localStorageKeys = {
    name: 'whoami-ls-name',
    notes: 'whoami-notes',
};

export const getNameFromLS = (): string | null => {
    const name = localStorage.getItem(localStorageKeys.name);

    return name;
};

export const saveNameToLS = (name: string): void => {
    localStorage.setItem(localStorageKeys.name, name);
};

export const removeNameFromLS = (): void => {
    localStorage.removeItem(localStorageKeys.name);
};

export const saveNotesToLS = (notes: ILocalNotes): void => {
    localStorage.setItem(localStorageKeys.notes, JSON.stringify(notes));
};

export const getNotesFromLS = (): ILocalNotes | null => {
    const lSNotes = localStorage.getItem(localStorageKeys.notes);

    return _.isNull(lSNotes) ? null : JSON.parse(lSNotes);
};

export const removeNotesFromLS = (): void => {
    localStorage.removeItem(localStorageKeys.notes);
};
