import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
          <Avatar sx={{ bgcolor: '#ffffff', mr: 1 }}>
            <BusinessCenterIcon sx={{ color: '#667eea' }} />
          </Avatar>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
            Dealzy
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Button color="inherit" component={Link} to="/">📊 Dashboard</Button>
        <Button color="inherit" component={Link} to="/builders">🏗️ Builders</Button>
        <Button color="inherit" component={Link} to="/projects">🏢 Projects</Button>
        <Button color="inherit" component={Link} to="/customers">👥 Customers</Button>
        <Button color="inherit" component={Link} to="/customer-visits">📅 Visits</Button>
        <Button color="inherit" component={Link} to="/calls">📞 Calls</Button>
        <Button color="inherit" component={Link} to="/sales-details">💼 Purchases</Button>
        <Button color="inherit" component={Link} to="/bookings">📋 Bookings</Button>
        <Button color="inherit" component={Link} to="/commissions">💰 Commissions</Button>

        <Box sx={{ ml: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2">
            {user && `Welcome, ${user}`}
          </Typography>
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            size="small"
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
