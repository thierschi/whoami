const generateLogPrefix = (): string => {
    const now = new Date();
    const nowAdjusted = new Date(
        Date.now() - now.getTimezoneOffset() * 60 * 1000
    );
    return `[ ${nowAdjusted.toUTCString().replace(' GMT', '')} ]: `;
};

const info = (msg: string, ...msgs: string[]): void => {
    const msgsToLog = msgs.join(' ');
    console.log(`[INFO] ${generateLogPrefix()}${msg}${msgsToLog}`);
};

const error = (msg: string, ...msgs: string[]): void => {
    const msgsToLog = msgs.join(' ');
    console.log(`[ERROR] ${generateLogPrefix()}${msg}${msgsToLog}`);
};

const logger = {
    info: info,
    error: error,
};

export default logger;
