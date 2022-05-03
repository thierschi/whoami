export const convertToValidURL = (s: string): string => {
    if (/^https?\:\/\/.*/gi.test(s)) {
        return s;
    }
    return `http://${s}`;
};
