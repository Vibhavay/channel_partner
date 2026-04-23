import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Avatar,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:2026/api/auth/login', {
        username,
        password,
      });

      const { token, username: loggedInUser } = response.data;

      // Call context login to update auth state
      login(token, loggedInUser);

      // Navigate to dashboard
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%', textAlign: 'center' }}>
          <Avatar sx={{ bgcolor: '#667eea', width: 64, height: 64, mx: 'auto', mb: 2 }}>
            <BusinessCenterIcon sx={{ fontSize: 32, color: 'white' }} />
          </Avatar>
          <Typography component="h1" variant="h4" sx={{ mb: 1, fontWeight: 'bold', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Dealzy
          </Typography>
          <Typography component="p" variant="body2" sx={{ mb: 3, color: 'gray' }}>
            Real Estate Deal Management System
          </Typography>
          <Typography component="p" variant="body2" sx={{ mb: 3, color: 'gray', fontSize: '0.9rem' }}>
            Login to access your dashboard
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                Demo Credentials:
              </Typography>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                <strong>Admin:</strong> admin / admin123
              </Typography>
              <Typography variant="caption" display="block">
                <strong>Partner:</strong> partner / partner123
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;

