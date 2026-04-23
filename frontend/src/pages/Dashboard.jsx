import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, Alert, Box, CircularProgress, Fade, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { Engineering, Folder, People, AttachMoney, TrendingUp, Receipt, Payment, BarChart } from '@mui/icons-material';
import apiClient from '../api/apiClient';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [commissionStats, setCommissionStats] = useState({});
  const [projectSales, setProjectSales] = useState([]);
  const [followUps, setFollowUps] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [
        buildersRes,
        projectsRes,
        customersRes,
        bookingsRes,
        commissionStatsRes,
        followUpsRes,
        projectSalesRes
      ] = await Promise.all([
        apiClient.get('/builders', { params: { page: 0, size: 1000 } }),
        apiClient.get('/projects', { params: { page: 0, size: 1000 } }),
        apiClient.get('/customers', { params: { page: 0, size: 1000 } }),
        apiClient.get('/bookings', { params: { page: 0, size: 1000 } }),
        apiClient.get('/commissions/stats'),
        apiClient.get('/followups'),
        fetchProjectWiseSales()
      ]);

      setStats({
        builders: buildersRes.data.totalElements || buildersRes.data.length || 0,
        projects: projectsRes.data.totalElements || projectsRes.data.length || 0,
        customers: customersRes.data.totalElements || customersRes.data.length || 0,
        bookings: bookingsRes.data.totalElements || bookingsRes.data.length || 0,
      });

      setCommissionStats(commissionStatsRes.data || {});
      setFollowUps(Array.isArray(followUpsRes.data) ? followUpsRes.data.slice(0, 5) : []);
      setBookings(bookingsRes.data.content || bookingsRes.data || []);
      setProjectSales(projectSalesRes || []);

      setError('');
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectWiseSales = async () => {
    try {
      const salesRes = await apiClient.get('/sales-details', { params: { page: 0, size: 1000 } });
      const sales = salesRes.data.content || salesRes.data || [];

      // Group sales by project
      const projectMap = {};
      sales.forEach(sale => {
        const projectName = sale.projectName || 'Unknown Project';
        if (!projectMap[projectName]) {
          projectMap[projectName] = {
            projectName,
            totalSales: 0,
            totalValue: 0,
            count: 0
          };
        }
        projectMap[projectName].count += 1;
        projectMap[projectName].totalValue += sale.agreementValue || 0;
      });

      return Object.values(projectMap).sort((a, b) => b.totalValue - a.totalValue);
    } catch (error) {
      console.error('Error fetching project sales:', error);
      return [];
    }
  };

  const conversionRate = stats.customers > 0 ? ((stats.bookings / stats.customers) * 100).toFixed(1) : 0;

  const cardData = [
    { title: 'Total Builders', value: stats.builders || 0, icon: <Engineering />, color: '#1976d2' },
    { title: 'Total Projects', value: stats.projects || 0, icon: <Folder />, color: '#388e3c' },
    { title: 'Total Customers', value: stats.customers || 0, icon: <People />, color: '#f57c00' },
    { title: 'Total Bookings', value: stats.bookings || 0, icon: <Receipt />, color: '#9c27b0' },
    { title: 'Conversion Rate', value: `${conversionRate}%`, icon: <TrendingUp />, color: '#2196f3' },
    { title: 'Revenue Generated', value: `₹${(commissionStats.received || 0).toLocaleString()}`, icon: <AttachMoney />, color: '#4caf50' },
    { title: 'Pending Payments', value: `₹${(commissionStats.pending || 0).toLocaleString()}`, icon: <Payment />, color: '#ff9800' },
    { title: 'Commission Earned', value: `₹${(commissionStats.expected || 0).toLocaleString()}`, icon: <BarChart />, color: '#f44336' }
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
        📊 Dashboard Overview
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Key Metrics Cards */}
      <Fade in={!loading} timeout={1000}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
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

      {/* Detailed Reports Section */}
      <Grid container spacing={3}>
        {/* Project-wise Sales */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2', display: 'flex', alignItems: 'center', gap: 1 }}>
                <BarChart />
                Project-wise Sales
              </Typography>
              <TableContainer component={Paper} sx={{ maxHeight: 300, mt: 2 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Project</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Sales Count</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total Value</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {projectSales.slice(0, 5).map((project, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{project.projectName}</TableCell>
                        <TableCell align="right">
                          <Chip label={project.count} size="small" color="primary" />
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                          ₹{project.totalValue.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                    {projectSales.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                          <Typography color="textSecondary">No sales data available</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Commission & Revenue Report */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#4caf50', display: 'flex', alignItems: 'center', gap: 1 }}>
                <AttachMoney />
                Revenue & Commission Report
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#e8f5e9', borderRadius: 1 }}>
                      <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                        ₹{(commissionStats.expected || 0).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Expected Commission
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#c8e6c9', borderRadius: 1 }}>
                      <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                        ₹{(commissionStats.received || 0).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Received Commission
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#fff9c4', borderRadius: 1 }}>
                      <Typography variant="h6" sx={{ color: '#f57f17', fontWeight: 'bold' }}>
                        ₹{(commissionStats.pending || 0).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Pending Payments
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#bbdefb', borderRadius: 1 }}>
                      <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                        {commissionStats.pendingCount || 0}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Pending Records
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Follow-ups */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#f57c00', display: 'flex', alignItems: 'center', gap: 1 }}>
                📅 Recent Follow-ups
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Upcoming follow-ups this week
              </Typography>

              {followUps.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center', backgroundColor: '#f9f9f9', borderRadius: 1 }}>
                  <Typography color="textSecondary">
                    No follow-ups scheduled
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ maxHeight: 250, overflow: 'auto' }}>
                  {followUps.map((followUp, index) => (
                    <Box
                      key={followUp.id}
                      sx={{
                        p: 2,
                        borderBottom: index < followUps.length - 1 ? '1px solid #e0e0e0' : 'none',
                        '&:hover': {
                          backgroundColor: '#f5f5f5',
                        },
                        borderRadius: 1,
                        mb: index < followUps.length - 1 ? 1 : 0
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {followUp.customerName || `Customer ${followUp.customerId}`}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Status: {followUp.status}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#f57c00' }}>
                            {followUp.followUpDate ? new Date(followUp.followUpDate).toLocaleDateString() : 'N/A'}
                          </Typography>
                          <Chip
                            label={followUp.status}
                            size="small"
                            color={followUp.status === 'Completed' ? 'success' : 'warning'}
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Bookings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#9c27b0', display: 'flex', alignItems: 'center', gap: 1 }}>
                📋 Recent Bookings
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Latest customer bookings
              </Typography>

              {bookings.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center', backgroundColor: '#f9f9f9', borderRadius: 1 }}>
                  <Typography color="textSecondary">
                    No recent bookings
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ maxHeight: 250, overflow: 'auto' }}>
                  {bookings.slice(0, 5).map((booking, index) => (
                    <Box
                      key={booking.id}
                      sx={{
                        p: 2,
                        borderBottom: index < bookings.slice(0, 5).length - 1 ? '1px solid #e0e0e0' : 'none',
                        '&:hover': {
                          backgroundColor: '#f5f5f5',
                        },
                        borderRadius: 1,
                        mb: index < bookings.slice(0, 5).length - 1 ? 1 : 0
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {booking.customerName || `Customer ${booking.customerId}`}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {booking.flatNo} - {booking.projectName}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#9c27b0' }}>
                            ₹{booking.agreementValue?.toLocaleString()}
                          </Typography>
                          <Chip
                            label={booking.status}
                            size="small"
                            color={booking.status === 'Confirmed' ? 'success' : 'primary'}
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
