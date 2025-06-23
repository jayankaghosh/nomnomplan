import { useState } from 'react';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper
} from '@mui/material';

import { extractFormData } from 'util/form';

const Login = () => {

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = extractFormData(e.target);
        console.log(data);
    };

    return (
        <Container maxWidth="sm">
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
                        type="password"
                        name='password'
                        fullWidth
                        margin="normal"
                        required
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