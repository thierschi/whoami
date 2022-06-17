import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createTheme, CssBaseline, NoSsr, ThemeProvider } from '@mui/material';
import type { NextPage } from 'next';
import Head from 'next/head';
import { RecoilRoot } from 'recoil';
import { App } from '../components/App';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        success: {
            main: '#03ff13',
            dark: '#03ff13',
        },
    },
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
});

const Home: NextPage = () => {
    return (
        <NoSsr>
            <Head>
                <meta name="apple-mobile-web-app-capable" content="yes" />
            </Head>
            <RecoilRoot>
                <ThemeProvider theme={darkTheme}>
                    <CssBaseline />
                    <App />
                </ThemeProvider>
            </RecoilRoot>
        </NoSsr>
    );
};

export default Home;
