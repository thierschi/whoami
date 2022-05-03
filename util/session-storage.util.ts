const sessionStorageKeys = {
    gameCode: 'whoami-ss-game-code',
};

export const getCodeFromSs = (): string | null => {
    const name = sessionStorage.getItem(sessionStorageKeys.gameCode);

    return name;
};

export const saveCodeToSs = (code: string): void => {
    sessionStorage.setItem(sessionStorageKeys.gameCode, code);
};

export const removeCodeFromSs = (): void => {
    sessionStorage.removeItem(sessionStorageKeys.gameCode);
};
