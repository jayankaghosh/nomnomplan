import {Box, Button, Container, Paper, TextField, Typography, InputAdornment, IconButton} from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {extractFormData} from "util/form";
import {getGenerateAdminTokenQuery} from "query/admin";
import {fetchData} from "util/api";
import {getAdminToken, setAdminToken} from "util/auth";
import {useNavigate} from "react-router-dom";
import {ADMIN_DASHBOARD} from "pages/routes.config";
import Loader from "../components/loader";
import {useState} from "react";
import {toast} from "react-toastify";

const AdminLogin = props => {

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async e => {
        e.preventDefault();
        const {email: username, password} = extractFormData(e.target);
        try {
            setIsLoading(true);
            const {generateAdminToken: {token}} = await fetchData(getGenerateAdminTokenQuery(), {
                username,
                password
            }, 'GenerateAdminToken');
            setAdminToken(token);
        } catch ({ category, message }) {
            if (category === 'aborted') return;
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const navigate = useNavigate();
    if (getAdminToken()) {
        navigate(ADMIN_DASHBOARD);
    }

    return (
        <Container maxWidth="sm">
            <Loader isLoading={isLoading} />
            <Paper elevation={3} sx={{padding: 4, marginTop: 20}}>
                <Typography variant="h5" align="center" gutterBottom>
                    LOGIN
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{mt: 2}}>
                    <TextField
                        label="Email"
                        type="email"
                        name='email'
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        name='password'
                        fullWidth
                        margin="normal"
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3}}
                    >
                        Login
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}

export default AdminLogin;