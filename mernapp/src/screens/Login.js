import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Alert } from '@mui/material';

export default function Login() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  let navigate = useNavigate();

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting data:", credentials);

    try {
      const response = await fetch("http://localhost:5000/api/loginuser", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        const json = await response.json();
        console.log("Backend Error Response:", json);

        if (json.errors && Array.isArray(json.errors)) {
          setError(json.errors.map(err => err.msg).join(", "));
        } else {
          setError(json.message || 'Enter valid credentials');
        }
        setSuccessMessage(null);
      } else {
        const json = await response.json();
        console.log("Login Successful:", json);

        if (json.success) {
          localStorage.setItem("userEmail", credentials.email);
          localStorage.setItem("authToken", json.authToken);
          console.log(localStorage.getItem("authToken"));
          setSuccessMessage('Login successful!');
          setError(null);
          navigate("/"); // Redirect to home page after successful login
        } else {
          setError(json.message || 'Something went wrong!');
        }
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
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: 400,
          width: '100%',
          padding: 3,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        {error && <Alert severity="error">{error}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}

        <TextField
          label="Email Address"
          type="email"
          name="email"
          value={credentials.email}
          onChange={onChange}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Password"
          type="password"
          name="password"
          value={credentials.password}
          onChange={onChange}
          fullWidth
          margin="normal"
          required
        />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button
            type="submit"
            variant="contained"
            color="success"
            sx={{ width: '48%' }}
          >
            Submit
          </Button>

          <Link to="/createuser" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              color="error"
              sx={{ width: '100%' }}
            >
              I'm a new user
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
