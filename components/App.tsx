import { useTheme } from '@mui/material';
import _ from 'lodash';
import * as React from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { gameCodeAtom } from '../atoms/game-code.atom';
import { nameAtom } from '../atoms/name.atom';
import { getNameFromLS } from '../util/local-storage.util';
import { disableScroll } from '../util/scroll.util';
import { getCodeFromSs } from '../util/session-storage.util';
import { Game } from './game/game.component';
import { NameScreen } from './name-screen/name-screen.component';

export const App: React.FunctionComponent = (): JSX.Element => {
    const theme = useTheme();
    const setGameCode = useSetRecoilState(gameCodeAtom);

    const [name, setName] = useRecoilState(nameAtom);

    const [height, setHeight] = React.useState<string | number>('100vh');

    React.useEffect(() => {
        disableScroll();
        setHeight(window.innerHeight);

        setName(getNameFromLS());
        setGameCode(getCodeFromSs());
    }, [setName, setHeight, setGameCode]);

    return (
        <div
            style={{
                width: '100vw',
                height: height,
                backgroundColor: theme.palette.background.default,
            }}
        >
            <React.Suspense fallback={<h1>Loading</h1>}>
                {_.isNull(name) ? <NameScreen /> : <Game />}
            </React.Suspense>
        </div>
    );
};
