import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Toolbar,
    AppBar,
    Typography,
    IconButton,
    Divider,
} from '@mui/material';
import { Menu, ChevronLeft } from '@mui/icons-material';
import { useState } from 'react';
import AdminMenu from "../components/admin-menu";

const drawerWidth = 240;
const collapsedWidth = 60;


const AdminLayout = ({ title, children }) => {
    const [drawerOpen, setDrawerOpen] = useState(true);

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
                        {drawerOpen ? <ChevronLeft /> : <Menu />}
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        NomNomPlan Admin {title ? ` / ${title}` : ''}
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerOpen ? drawerWidth : collapsedWidth,
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    boxSizing: 'border-box',
                    '& .MuiDrawer-paper': {
                        width: drawerOpen ? drawerWidth : collapsedWidth,
                        transition: (theme) =>
                            theme.transitions.create('width', {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.standard,
                            }),
                        overflowX: 'hidden',
                    },
                }}
                open={drawerOpen}
            >
                <Toolbar />
                <Divider />
                <AdminMenu drawerOpen={drawerOpen} />
            </Drawer>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    transition: 'margin 0.3s',
                }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
};

export default AdminLayout;
