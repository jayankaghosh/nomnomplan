import React, { createContext, useMemo, useState, useContext } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AppRouter from './pages/router';
import { ToastContainer } from 'react-toastify';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './App.css';

function App() {
    const [themeMode, setThemeMode] = useState('dark');
    const theme = useMemo(() =>
        createTheme({
            palette: {
                mode: themeMode,
            },
        }),
        [themeMode]
    );
    return (
        <div className="App">
            <ToastContainer
                position={'bottom-right'}
                theme={'dark'}
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
