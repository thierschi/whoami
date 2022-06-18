import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { CssBaseline, NoSsr, ThemeProvider } from '@mui/material';
import type { NextPage } from 'next';
import Head from 'next/head';
import { RecoilRoot } from 'recoil';
import { App } from '../components/App';
import { usePreferredTheme } from '../hook/theme.hook';

const Home: NextPage = () => {
    const theme = usePreferredTheme();

    return (
        <NoSsr>
            <Head>
                <meta name="apple-mobile-web-app-capable" content="yes" />
            </Head>
            <RecoilRoot>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <App />
                </ThemeProvider>
            </RecoilRoot>
        </NoSsr>
    );
};

export default Home;
