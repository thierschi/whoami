import _ from 'lodash';
import * as React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { gameCodeAtom } from '../atoms/game-code.atom';
import { nameAtom } from '../atoms/name.atom';
import { refreshGameAtom } from '../atoms/refresh-game.atom';
import { isISanitizedGame } from '../model/game/game.util';
import { gameSelector } from '../selectors/game.selector';

export const useRefreshGame = (): void => {
    const gameCode = useRecoilValue(gameCodeAtom);
    const name = useRecoilValue(nameAtom);
    const game = useRecoilValue(gameSelector);
    const setRefreshGameCount = useSetRecoilState(refreshGameAtom);

    const fetchGame = React.useCallback(async () => {
        if (_.isNull(gameCode) || _.isNull(name)) {
            return;
        }

        const [playerName, playerGuid] = name.split('(guid)');

        const url = `${window.location.origin}/api/getGame?code=${gameCode}&playerName=${playerName}&playerGuid=${playerGuid}`;

        const rawRes = await fetch(url, { method: 'GET' });
        const res = rawRes.json();

        if (!rawRes.ok || !isISanitizedGame(res)) {
            return;
        }

        if (!_.isEqual(res, game)) {
            setRefreshGameCount(6);
        }
        setTimeout(fetchGame, 5000);
    }, [gameCode, name]);

    fetchGame();
};
