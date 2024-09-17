import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../actions/authActions";
import { TextField, Button, Container, Typography, Box, CircularProgress } from "@mui/material";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isLoading, error: authError } = useSelector((state) => state.auth);


    console.log(user,"the user exist")
    useEffect(() => {
        if (user) {
            if (user.role === "super-admin") {
                navigate("/admin-management");
            } else {
                navigate("/dashboard");
            }
        }
    }, [user, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        dispatch(login(email, password))
            .catch(err => setError(err.message || "Login failed"));
    };

    return (
        <Container maxWidth="xs" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                    backgroundColor: 'background.paper',
                    width: '100%',
                    maxWidth: 400,
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Login
                </Typography>
                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && (
                        <Typography color="error" variant="body2" style={{ marginTop: 10 }}>
                            {error}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        style={{ marginTop: 20 }}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} /> : "Login"}
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default Login;
