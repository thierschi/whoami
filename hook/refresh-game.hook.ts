import * as React from 'react';
import { useRecoilRefresher_UNSTABLE } from 'recoil';
import { gameSelector } from '../selectors/game.selector';

export const useRefreshGame = (): void => {
    const [hasTimeout, setHasTimeout] = React.useState(false);
    const refreshGameSelector = useRecoilRefresher_UNSTABLE(gameSelector);

    if (!hasTimeout) {
        setHasTimeout(true);
        setTimeout(() => {
            refreshGameSelector();
            setHasTimeout(false);
        }, 1000);
    }
};
