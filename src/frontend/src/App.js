import React, {createContext, useMemo, useState, useContext, useEffect} from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AppRouter from 'pages/router';
import { ToastContainer } from 'react-toastify';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './App.css';
import ThemeToggle from "components/theme-toggle";
import {getData, setData} from "util/local-storage";

function App() {
    const LOCAL_STORAGE_KEY = 'theme_mode';
    const checkIsDarkSchemePreferred = () => window?.matchMedia?.('(prefers-color-scheme:dark)')?.matches ?? false;
    const [themeMode, setThemeMode] = useState(
        getData(LOCAL_STORAGE_KEY) || (checkIsDarkSchemePreferred() ? 'dark' : 'light')
    );
    const theme = useMemo(() =>
        createTheme({
            palette: {
                mode: themeMode,
                ...(themeMode === 'light'
                    ? {
                        primary: {
                            main: '#1976d2',
                            dark: '#115293',
                            contrastText: '#fff',
                        },
                        background: {
                            default: '#f5f5f5',
                            paper: '#fff',
                        },
                    }
                    : {
                        primary: {
                            main: '#1e1e2f',
                            dark: '#151524',
                            contrastText: '#fff',
                        },
                        background: {
                            default: '#121212',
                            paper: '#1e1e1e',
                        },
                    }),
            },
            typography: {
                fontFamily: [
                    '"Roboto"',
                    'Arial',
                    'sans-serif',
                ].join(','),
            },
        }),
        [themeMode]
    );

    const toggleTheme = () => {
        const newTheme = themeMode === 'dark' ? 'light': 'dark';
        setThemeMode(newTheme);
        setData(LOCAL_STORAGE_KEY, newTheme);
    }

    useEffect(() => {
        document.body.style.backgroundColor = theme.palette.background.default;
        document.body.style.color = theme.palette.text.primary;

        return () => {
            document.body.style.backgroundColor = '';
            document.body.style.color = '';
        };
    }, [theme]);

    return (
        <div className="App">
            <ToastContainer
                position={'bottom-right'}
                theme={'dark'}
            />
            <ThemeToggle
                toggleTheme={toggleTheme}
                themeMode={themeMode}
            />
            <ThemeProvider theme={theme}>
                <BrowserRouter>
                    <AppRouter />
                </BrowserRouter>
            </ThemeProvider>
        </div>
    );
}

export default App;
