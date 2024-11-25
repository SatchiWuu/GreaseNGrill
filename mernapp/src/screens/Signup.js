import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TextField, Button, Box, Alert, Container } from '@mui/material';

export default function Signup() {
    const [credentials, setCredentials] = useState({
        name: "",
        email: "",
        password: "",
        location: ""
    });

    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting data:", credentials);

        try {
            const response = await fetch("http://localhost:5000/api/createuser", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: credentials.name,
                    email: credentials.email,
                    password: credentials.password,
                    location: credentials.location 
                })
            });

            if (!response.ok) {
                const json = await response.json();
                console.log("Backend Error Response:", json); 

                if (json.errors && Array.isArray(json.errors)) {
                    setError(json.errors.map(err => err.msg).join(", "));
                } else {
                    setError(json.message || 'Something went wrong!');
                }
                setSuccessMessage(null); 
            } else {
                const json = await response.json();
                console.log("User Created Successfully:", json); 
                setSuccessMessage('User created successfully!');
                setError(null);
            }

        } catch (error) {
            console.error("Error:", error);
            setError("An error occurred. Please try again later.");
            setSuccessMessage(null); 
        }
    };

    const onChange = (event) => {
        setCredentials({ ...credentials, [event.target.name]: event.target.value });
    };

    return (
        <Container maxWidth="sm">
            <form onSubmit={handleSubmit}>
                {error && <Alert severity="error">{error}</Alert>}
                {successMessage && <Alert severity="success">{successMessage}</Alert>}

                <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={credentials.name}
                    onChange={onChange}
                    required
                    margin="normal"
                />

                <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    name="email"
                    value={credentials.email}
                    onChange={onChange}
                    required
                    margin="normal"
                />

                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={onChange}
                    required
                    margin="normal"
                />

                <TextField
                    fullWidth
                    label="Address"
                    name="location"
                    value={credentials.location}
                    onChange={onChange}
                    required
                    margin="normal"
                />

                <Box display="flex" justifyContent="space-between" mt={3}>
                    <Button type="submit" variant="contained" color="success" sx={{ width: '48%' }}>
                        Submit
                    </Button>
                    <Link to="/login" style={{ textDecoration: 'none', width: '48%' }}>
                        <Button variant="contained" color="error" fullWidth>
                            Already a user
                        </Button>
                    </Link>
                </Box>
            </form>
        </Container>
    );
}
