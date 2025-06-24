import {Box, Button, Container, Paper, TextField, Typography, InputAdornment, IconButton} from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {extractFormData} from "util/form";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Loader from 'components/loader';
import { getQueryParams } from "util/url";
import { toast } from 'react-toastify';
import { fetchData } from "util/api";
import { isAdminPasswordTokenValidQuery, getAdminUserSetPasswordQuery } from "query/admin";
import {ADMIN_LOGIN} from "pages/routes.config";

const AdminSetPassword = props => {
    const navigate = useNavigate();
    const [isValid, setIsValid] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);

    const { token } = getQueryParams();

    useEffect(() => {
        const execute = async () => {
            if (!token) {
                setIsValid(false);
                setErrorMessage('Token not found');
            } else {
                const { isAdminPasswordTokenValid: { status, message } } = await fetchData(isAdminPasswordTokenValidQuery(), {token});
                if (status) {
                    setIsValid(true);
                } else {
                    setIsValid(false);
                    setErrorMessage(message);
                }
            }
        }
        execute();
    }, []);

    const handleSubmit = async e => {
        e.preventDefault();
        const { password, repeat_password } = extractFormData(e.target);
        setIsLoading(true);
        if (password !== repeat_password) {
            toast.error('Passwords don\'t match');
        } else {
            const {adminUserSetPassword: {status, message}} = await fetchData(getAdminUserSetPasswordQuery(), {
                token,
                password
            });
            if (status) {
                toast.success(message);
                navigate(ADMIN_LOGIN)
            } else {
                toast.error(message);
            }
        }
        setIsLoading(false);
    };

    if (isValid) {
        return (
            <Container maxWidth="sm">
                <Loader isLoading={isLoading} />
                <Paper elevation={3} sx={{padding: 4, marginTop: 20}}>
                    <Typography variant="h5" align="center" gutterBottom>
                        CHANGE PASSWORD
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{mt: 2}}>
                        <TextField
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            name='password'
                            fullWidth
                            margin="normal"
                            required
                            autoComplete='new-password'
                            slots={{
                                inputAdornment: InputAdornment,
                            }}
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
                        <TextField
                            label="Repeat Password"
                            type={showRepeatPassword ? 'text' : 'password'}
                            name='repeat_password'
                            fullWidth
                            margin="normal"
                            required
                            autoComplete='new-password'
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                                            edge="end"
                                        >
                                            {showRepeatPassword ? <VisibilityOff /> : <Visibility />}
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
                            Set Password
                        </Button>
                    </Box>
                </Paper>
            </Container>
        );
    } else if (isValid === false) {
        toast.error(errorMessage + '');
        navigate(ADMIN_LOGIN);
    } else {
        return (
            <Loader isLoading={true} />
        );
    }
}

export default AdminSetPassword;