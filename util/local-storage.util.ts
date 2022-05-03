const localStorageKeys = {
    name: 'whoami-ls-name',
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
