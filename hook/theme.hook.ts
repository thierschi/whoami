import { createTheme, Theme } from '@mui/material';
import * as React from 'react';

const nonColorTheming = {
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    //border: 0,
                    borderRadius: 10,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 20,
                    boxShadow:
                        '0px 16px 24px 2px hsla(0,0%,0%,0.14), 0px 6px 30px 5px hsla(0,0%,0%,0.12), 0px 8px 10px -5px hsla(0,0%,0%,0.2)',
                },
            },
        },
        MuiLinearProgress: {
            styleOverrides: {
                root: {
                    height: '1px',
                },
            },
        },
    },
};

const lightTheme = createTheme({
    palette: {
        mode: 'light',
    },
    ...nonColorTheming,
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
    ...nonColorTheming,
});

/**
 * Checks the user's preferred mode and returns a mui theme accordingly
 * Will update when when mode changes
 *
 * @returns Theme theme in dark or light mode
 */
export const usePreferredTheme = (): Theme => {
    const [theme, setTheme] = React.useState(lightTheme);

    React.useEffect(() => {
        const isDarkMode = window.matchMedia(
            '(prefers-color-scheme: dark)'
        ).matches;

        setTheme(isDarkMode ? darkTheme : lightTheme);

        window
            .matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', (e) => {
                setTheme(e.matches ? darkTheme : lightTheme);
            });
    }, []);

    return theme;
};
