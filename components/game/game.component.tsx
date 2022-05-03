import { Box } from '@mui/material';
import _ from 'lodash';
import * as React from 'react';
import { useRecoilState } from 'recoil';
import { gameCodeAtom } from '../../atoms/game-code.atom';
import { useGame } from '../../hook/game.hook';
import { AppBar } from '../app-bar/app-bar.component';
import { MainGameScreen } from './components/main-game-screen.component';
import { MainScreen } from './components/main-screen.component';
import { NotStartedScreen } from './components/not-started-screen.component';
import { SetWordScreen } from './components/set-word-screen.component';

export const Game: React.FunctionComponent = (): JSX.Element => {
    const [gameCode, setGameCode] = useRecoilState(gameCodeAtom);

    const game = useGame();

    const renderDerivedScreen = React.useCallback(() => {
        if (_.isNull(gameCode)) return <MainScreen />;

        if (_.isNull(game)) return <MainScreen />;

        if (!game.started) return <NotStartedScreen />;

        if (!game.locked) return <SetWordScreen />;

        return <MainGameScreen />;
    }, [gameCode, game]);

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
