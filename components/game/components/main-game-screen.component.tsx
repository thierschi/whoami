import { Dehaze, SpeakerNotes } from '@mui/icons-material';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { Box } from '@mui/system';
import * as React from 'react';
import { Notes } from './notes.component';
import { WordList } from './words-list.component';

export const MainGameScreen: React.FunctionComponent = (): JSX.Element => {
    const [navValue, setNavValue] = React.useState(0);

    return (
        <Box height="100%" display="flex" flexDirection="column">
            {navValue === 0 && (
                <Box flex={1}>
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
