import { Dehaze, SpeakerNotes } from '@mui/icons-material';
import {
    BottomNavigation,
    BottomNavigationAction,
    Paper,
    Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import _ from 'lodash';
import * as React from 'react';
import { useGame } from '../../../hook/game.hook';
import { enableScroll } from '../../../util/scroll.util';
import { Notes } from './notes.component';
import { WordList } from './words-list.component';

export const MainGameScreen: React.FunctionComponent = (): JSX.Element => {
    React.useEffect(() => {
        enableScroll();
    }, []);

    const game = useGame();
    const [navValue, setNavValue] = React.useState(0);

    return (
        <Box
            height="100%"
            display="flex"
            flexDirection="column"
            sx={{
                paddingBottom: 'env(safe-area-inset-bottom)',
            }}
        >
            {!_.isNull(game) && (
                <Box flex={0}>
                    <Typography variant="subtitle2" textAlign="center">
                        {game.key}
                    </Typography>
                </Box>
            )}
            {navValue === 0 && (
                <Box flex={1} overflow="scroll">
                    <WordList />
                </Box>
            )}
            {navValue === 1 && (
                <Box flex={1} overflow="scroll">
                    <Notes />
                </Box>
            )}
            <Box flex={0}>
                <Paper elevation={3}>
                    <BottomNavigation
                        showLabels
                        value={navValue}
                        onChange={(event, newValue) => {
                            setNavValue(newValue);
                        }}
                    >
                        <BottomNavigationAction
                            label="Wörter"
                            icon={<Dehaze />}
                        />
                        <BottomNavigationAction
                            label="Notizen"
                            icon={<SpeakerNotes />}
                        />
                    </BottomNavigation>
                </Paper>
            </Box>
        </Box>
    );
};
