import { Box } from '@mui/material';
import _ from 'lodash';
import * as React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { gameCodeAtom } from '../../atoms/game-code.atom';
import { gameSelector } from '../../selectors/game.selector';
import { AppBar } from '../app-bar/app-bar.component';
import { MainScreen } from './components/main-screen.component';
import { NotStartedScreen } from './components/not-started-screen.component';

export const Game: React.FunctionComponent = (): JSX.Element => {
    const [gameCode, setGameCode] = useRecoilState(gameCodeAtom);
    const game = useRecoilValue(gameSelector);

    const renderDerivedScreen = React.useCallback(() => {
        if (_.isNull(gameCode)) return <MainScreen />;

        if (_.isNull(game)) {
            setGameCode(null);
            return <MainScreen />;
        }

        if (!game.started) return <NotStartedScreen />;
    }, [gameCode, setGameCode, game]);

    return (
        <Box height="100%" display="flex" flexDirection="column">
            <Box flex={0}>
                <AppBar />
            </Box>
            <Box flex={1} overflow="hidden">
                {renderDerivedScreen()}
            </Box>
        </Box>
    );
};
