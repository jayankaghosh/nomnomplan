// ThemeToggle.js
import { IconButton, Box, Tooltip } from '@mui/material';
import { LightMode, DarkMode } from '@mui/icons-material';

const ThemeToggle = ({ toggleTheme, themeMode }) => {
    return (
        <Box
            sx={{
                position: 'fixed',
                top: 8,
                right: 10,
                zIndex: 1300,
            }}
        >
            <Tooltip title={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}>
                <IconButton color="inherit" onClick={toggleTheme}>
                    {themeMode === 'light' ? <DarkMode /> : <LightMode />}
                </IconButton>
            </Tooltip>
        </Box>
    );
};

export default ThemeToggle;
