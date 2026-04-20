import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, Alert, Box, CircularProgress, Fade } from '@mui/material';
import { Engineering, Folder, People, AttachMoney } from '@mui/icons-material';
import apiClient from '../api/apiClient';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [followUps, setFollowUps] = useState([]);
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchCurrentWeekFollowUps();
    fetchConfirmedCustomers();
  }, []);

  const fetchStats = async () => {
    try {
      const [buildersRes, projectsRes, customersRes, salesRes] = await Promise.all([
        apiClient.get('/builders'),
        apiClient.get('/projects'),
        apiClient.get('/customers'),
        apiClient.get('/sales/earnings')
      ]);
      setStats({
        builders: buildersRes.data.content?.length || buildersRes.data.length || 0,
        projects: projectsRes.data.content?.length || projectsRes.data.length || 0,
        customers: customersRes.data.content?.length || customersRes.data.length || 0,
        earnings: salesRes.data || 0
      });
      setError('');
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentWeekFollowUps = async () => {
    try {
      const response = await apiClient.get('/followups');
      setFollowUps(Array.isArray(response.data) ? response.data.slice(0, 5) : []);
    } catch (error) {
      console.error('Error fetching follow-ups:', error);
    }
  };

  const fetchConfirmedCustomers = async () => {
    try {
      const response = await apiClient.get('/visits/confirmed-count');
      setConfirmedCount(response.data || 0);
    } catch (error) {
      console.error('Error fetching confirmed customers:', error);
    }
  };

  const cardData = [
    { title: 'Builders', value: stats.builders || 0, icon: <Engineering />, color: '#1976d2' },
    { title: 'Projects', value: stats.projects || 0, icon: <Folder />, color: '#388e3c' },
    { title: 'Customers', value: stats.customers || 0, icon: <People />, color: '#f57c00' },
    { title: 'Total Earnings', value: `₹${(stats.earnings || 0).toLocaleString()}`, icon: <AttachMoney />, color: '#d32f2f' }
  ];

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        Dashboard
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Fade in={!loading} timeout={1000}>
        <Grid container spacing={3}>
          {cardData.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  background: `linear-gradient(135deg, ${card.color}15 0%, ${card.color}05 100%)`,
                  border: `1px solid ${card.color}30`,
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: `0 8px 25px ${card.color}40`,
                    cursor: 'pointer'
                  },
                  borderLeft: `5px solid ${card.color}`
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ color: card.color, mb: 1 }}>
                    {React.cloneElement(card.icon, { fontSize: 'large' })}
                  </Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    {card.title}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: card.color }}>
                    {card.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Fade>

      {/* Reminder and Confirmed by Customer Section */}
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {/* Reminder Section */}
          <Grid item xs={12} md={9}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#f57c00' }}>
              Reminder
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Follow-ups scheduled for this week
            </Typography>

            {followUps.length === 0 ? (
              <Card sx={{ p: 3, textAlign: 'center', backgroundColor: '#f9f9f9' }}>
                <Typography color="textSecondary">
                  No follow-ups scheduled for this week
                </Typography>
              </Card>
            ) : (
              <Card sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 0 }}>
                  {followUps.map((followUp, index) => (
                    <Box
                      key={followUp.id}
                      sx={{
                        p: 2,
                        borderBottom: index < followUps.length - 1 ? '1px solid #e0e0e0' : 'none',
                        '&:hover': {
                          backgroundColor: '#f5f5f5',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {followUp.customerName}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Status: {followUp.status}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#f57c00' }}>
                            {new Date(followUp.followUpDate).toLocaleDateString()}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Customer ID: {followUp.customerId}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Confirmed by Customer Section */}
          <Grid item xs={12} md={3}>

            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                background: 'linear-gradient(135deg, #2e7d3215 0%, #2e7d3205 100%)',
                border: '1px solid #2e7d3230',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: '0 8px 25px #2e7d3240',
                  cursor: 'pointer'
                },
                borderLeft: '5px solid #2e7d32'
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ color: '#2e7d32', mb: 1 }}>
                  <People fontSize="large" />
                </Box>
                <Typography color="textSecondary" gutterBottom variant="h6">
                  Bookings Confirmed
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                  {confirmedCount}
                </Typography>
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                  Customers who confirmed booking
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
