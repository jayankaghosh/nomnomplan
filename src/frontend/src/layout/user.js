import {
    Box,
    Drawer,
    Toolbar,
    AppBar,
    Typography,
    IconButton,
    Divider,
} from '@mui/material';
import { Menu } from '@mui/icons-material';
import { useState } from 'react';
import UserMenu from 'components/user-menu';

const drawerWidth = 240;

const UserLayout = ({ title, children }) => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            {/* AppBar */}
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2 }}
                    >
                        <Menu />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        NomNomPlan {title ? ` / ${title}` : ''}
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Drawer with overlay */}
            <Drawer
                variant="temporary"
                open={drawerOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile
                }}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                    },
                }}
            >
                <Toolbar />
                <Divider />
                <UserMenu drawerOpen={drawerOpen} />
            </Drawer>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
};

export default UserLayout;
