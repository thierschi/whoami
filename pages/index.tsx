import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createTheme, CssBaseline, NoSsr, ThemeProvider } from '@mui/material';
import type { NextPage } from 'next';
import { RecoilRoot } from 'recoil';
import { App } from '../components/App';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const Home: NextPage = () => {
    return (
        <NoSsr>
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
