import {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper, InputAdornment, IconButton
} from '@mui/material';

import { extractFormData } from 'util/form';
import {useNavigate} from "react-router-dom";
import {getUserToken, setUserToken} from "util/auth";
import {HOME} from "pages/routes.config";
import {fetchData} from "util/api";
import {toast} from "react-toastify";
import Loader from "components/loader";
import {getGenerateUserTokenQuery} from "query/user";
import {Visibility, VisibilityOff} from "@mui/icons-material";

const Login = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [token, setToken] = useState(getUserToken());

    const navigate = useNavigate();
    useEffect(() => {
        if (token) {
            navigate(HOME);
        }
    }, [token]);

    const handleSubmit = async e => {
        e.preventDefault();
        const {email: username, password} = extractFormData(e.target);
        try {
            setIsLoading(true);
            const {generateUserToken: {token}} = await fetchData(getGenerateUserTokenQuery(), {
                username,
                password
            }, 'GenerateUserToken');
            setUserToken(token);
            setToken(token);
        } catch ({ category, message }) {
            if (category === 'aborted') return;
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Loader isLoading={isLoading} />
            <Paper elevation={3} sx={{padding: 4, marginTop: 20}}>
                <Typography variant="h5" align="center" gutterBottom>
                    Login
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

export default Login;