const queryParamKeys = {
    gameCode: 'joinGame',
};

export const getCodeFromQParams = (): string | null => {
    const paramsString = window.location.search;
    const params: Record<string, string> = {};

    paramsString
        .replace('?', '')
        .split('&')
        .forEach((e) => {
            const p = e.split('=');
            params[p[0]] = p.filter((v, i) => i !== 0).join();
        });

    if (queryParamKeys.gameCode in params) {
        return params[queryParamKeys.gameCode];
    }
    return null;
};

export const removeCodeFromQParams = (): string => {
    const paramsString = window.location.search;
    const params: Record<string, string> = {};

    paramsString
        .replace('?', '')
        .split('&')
        .forEach((e) => {
            const p = e.split('=');
            params[p[0]] = p.filter((v, i) => i !== 0).join();
        });

    if (queryParamKeys.gameCode in params) {
        delete params[queryParamKeys.gameCode];
    }

    const paramsArr: string[] = [];
    for (const key of Object.keys(params)) {
        paramsArr.push(`${key}=${params[key]}`);
    }

    return `${window.location.origin}${window.location.pathname}${
        paramsArr.length > 0 ? '?' : ''
    }${paramsArr.join('&')}`;
};
