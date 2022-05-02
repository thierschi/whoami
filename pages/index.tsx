import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import type { NextPage } from 'next';
import { App } from '../components/App';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const Home: NextPage = () => {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    );
};

export default Home;
