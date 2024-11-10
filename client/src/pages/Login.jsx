import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Link } from '@mui/material';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      onLogin();
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <Container className='flex flex-col mt-[86px]' maxWidth="xs">
      <Typography className='font-mono font-light' variant="h3" align="center" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </form>
      {error && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}
      <Typography align="center" style={{ marginTop: '1rem' }}>
        Don't have an account? <Link component={RouterLink} to="/register">Register here</Link>
      </Typography>
    </Container>
  );
};

export default Login;