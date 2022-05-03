import _ from 'lodash';
import { selector } from 'recoil';
import { gameCodeAtom } from '../atoms/game-code.atom';
import { nameAtom } from '../atoms/name.atom';
import { ISanitizedGame } from '../model/game/game.model';

export const gameSelector = selector({
    key: 'game-selector',
    get: async ({ get }): Promise<ISanitizedGame | null> => {
        const gameCode = get(gameCodeAtom);

        if (_.isNull(gameCode)) return null;

        const name = get(nameAtom);

        if (_.isNull(name)) return null;

        const [playerName, playerGuid] = name.split('(guid)');

        const url = `${window.location.origin}/api/getGame?code=${gameCode}&playerName=${playerName}&playerGuid=${playerGuid}`;

        const rawRes = await fetch(url, { method: 'GET' });

        if (!rawRes.ok) return null;

        const res = rawRes.json();

        return res;
    },
});
