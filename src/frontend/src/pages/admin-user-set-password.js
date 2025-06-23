import {Box, Button, Container, Paper, TextField, Typography} from "@mui/material";
import {extractFormData} from "util/form";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Loader from 'components/loader';
import { getQueryParams } from "util/url";
import { toast } from 'react-toastify';
import { fetchData } from "util/api";

const AdminUserSetPassword = props => {
    const navigate = useNavigate();
    const [isValid, setIsValid] = useState(null);

    useEffect(async () => {
        const { token } = getQueryParams();
        if (!token) {
            setIsValid(false);
        } else {
            
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = extractFormData(e.target);
        console.log(data);
    };

    if (isValid) {
        return (
            <Container maxWidth="sm">
                <Paper elevation={3} sx={{padding: 4, marginTop: 20}}>
                    <Typography variant="h5" align="center" gutterBottom>
                        CHANGE PASSWORD
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{mt: 2}}>
                        <TextField
                            label="Password"
                            type="password"
                            name='password'
                            fullWidth
                            margin="normal"
                            required
                        />
                        <TextField
                            label="Repeat Password"
                            type="password"
                            name='repeat_password'
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
                            Set Password
                        </Button>
                    </Box>
                </Paper>
            </Container>
        );
    } else if (isValid === false) {
        toast('Invalid token');
        navigate('/');
    } else {
        return (
            <Loader isActive={true} />
        );
    }
}

export default AdminUserSetPassword;