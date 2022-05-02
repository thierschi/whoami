import { useTheme } from '@mui/material';
import * as React from 'react';
import { AppBar } from './AppBar';
import { NameScreen } from './NameScreen';

export const App: React.FunctionComponent = (): JSX.Element => {
    const theme = useTheme();
    console.log(theme);

    return (
        <div
            style={{
                width: '100vw',
                height: '100vh',
                backgroundColor: theme.palette.background.default,
            }}
        >
            <AppBar />
            <NameScreen />
        </div>
    );
};
