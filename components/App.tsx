import { NoSsr, useTheme } from '@mui/material';
import _ from 'lodash';
import * as React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { gameCodeAtom } from '../atoms/game-code.atom';
import { nameAtom } from '../atoms/name.atom';
import { getNameFromLS } from '../util/local-storage.util';
import { disableScroll } from '../util/scroll.util';
import { Game } from './game/game.component';
import { NameScreen } from './name-screen/name-screen.component';

export const App: React.FunctionComponent = (): JSX.Element => {
    const theme = useTheme();
    const gameCode = useRecoilValue(gameCodeAtom);

    const [name, setName] = useRecoilState(nameAtom);

    const [height, setHeight] = React.useState<string | number>('100vh');

    React.useEffect(() => {
        disableScroll();
        setHeight(window.innerHeight);

        setName(getNameFromLS());
    }, [setName, setHeight]);

    return (
        <div
            style={{
                width: '100vw',
                height: height,
                backgroundColor: theme.palette.background.default,
            }}
        >
            <NoSsr>
                <React.Suspense fallback={<h1>Loading</h1>}>
                    {_.isNull(name) ? <NameScreen /> : <Game />}
                </React.Suspense>
            </NoSsr>
        </div>
    );
};
