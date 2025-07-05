import AdminLayout from "layout/admin";
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {ADMIN_DASHBOARD} from "pages/routes.config";
import {useAdminGuard} from "util/hooks";


const AdminNoRoute = props => {
    useAdminGuard();

    const navigate = useNavigate();
    return (
        <AdminLayout>
            <Container
                maxWidth="md"
                sx={{
                    textAlign: 'left',
                    py: 10,
                }}
            >
                <Typography variant="h1" fontWeight="bold" color="text.primary" gutterBottom>
                    404
                </Typography>
                <Typography variant="h5" color="text.secondary" gutterBottom>
                    Oops! Page not found.
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    The page you're looking for doesn't exist or has been moved.
                </Typography>
                <Button
                    variant="contained"
                    onClick={() => navigate(ADMIN_DASHBOARD)}
                    sx={{ mt: 2 }}
                >
                    Go to Home
                </Button>
            </Container>
        </AdminLayout>
    );
}

export default AdminNoRoute;