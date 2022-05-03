import _ from 'lodash';
import * as React from 'react';
import { useRecoilValueLoadable } from 'recoil';
import { ISanitizedGame } from '../model/game/game.model';
import { gameSelector } from '../selectors/game.selector';

export const useGame = (): ISanitizedGame | null => {
    const gameLoadable = useRecoilValueLoadable(gameSelector);
    const [game, setGame] = React.useState<ISanitizedGame | null>(null);
    React.useEffect(() => {
        if (_.isNull(game)) {
            const newGame =
                gameLoadable.state === 'hasValue'
                    ? gameLoadable.getValue()
                    : null;

            setGame(newGame);
            return;
        }

        const newGame =
            gameLoadable.state === 'hasValue' ? gameLoadable.getValue() : game;
        setGame(newGame);
    }, [gameLoadable]);

    return game;
};
