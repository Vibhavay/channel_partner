import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  Alert,
  IconButton,
  Box,
  Paper,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tab,
  Tabs,
} from '@mui/material';
import { Edit, Delete, Visibility, Add } from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import apiClient from '../api/apiClient';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Booking = () => {
  // State Management
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState({
    totalBookings: 0,
    booked: 0,
    confirmed: 0,
  });

  // Dialog States
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Filter States
  const [filterCustomerId, setFilterCustomerId] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterProject, setFilterProject] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    customerId: '',
    projectName: '',
    buildingName: '',
    flatNo: '',
    floorNo: '',
    flatType: '',
    carpetArea: '',
    agreementValue: '',
    bookingAmount: '',
    bookingDate: '',
    paymentPlan: '',
    status: 'Booked',
    salesExecutiveId: '',
    notes: '',
  });

  // ==================== useEffect Hooks ====================

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, filterCustomerId, filterStatus, filterProject]);

  const fetchData = async () => {
    try {
      await Promise.all([
        fetchBookings(),
        fetchCustomers(),
        fetchStats(),
      ]);
      setError('');
    } catch (err) {
      setError('Failed to load data');
    }
  };

  const fetchBookings = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: rowsPerPage.toString(),
      });

      if (filterCustomerId) params.append('customerId', filterCustomerId);
      if (filterStatus) params.append('status', filterStatus);
      if (filterProject) params.append('projectName', filterProject);

      const response = await apiClient.get(`/bookings?${params}`);
      setBookings(response.data.content || response.data);
      setTotalElements(response.data.totalElements || response.data.length);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to load bookings');
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await apiClient.get('/customers', {
        params: { page: 0, size: 100 },
      });
      setCustomers(response.data.content || response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/bookings/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // ==================== Event Handlers ====================

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const resetForm = () => {
    setFormData({
      customerId: '',
      projectName: '',
      buildingName: '',
      flatNo: '',
      floorNo: '',
      flatType: '',
      carpetArea: '',
      agreementValue: '',
      bookingAmount: '',
      bookingDate: '',
      paymentPlan: '',
      status: 'Booked',
      salesExecutiveId: '',
      notes: '',
    });
  };

  const handleAddClick = () => {
    resetForm();
    setOpenDialog(true);
  };

  const handleViewClick = (booking) => {
    setSelectedBooking(booking);
    setViewDialog(true);
  };

  const handleEditClick = (booking) => {
    setSelectedBooking(booking);
    setFormData({
      customerId: booking.customerId,
      projectName: booking.projectName || '',
      buildingName: booking.buildingName || '',
      flatNo: booking.flatNo || '',
      floorNo: booking.floorNo || '',
      flatType: booking.flatType || '',
      carpetArea: booking.carpetArea || '',
      agreementValue: booking.agreementValue || '',
      bookingAmount: booking.bookingAmount || '',
      bookingDate: booking.bookingDate || '',
      paymentPlan: booking.paymentPlan || '',
      status: booking.status || 'Booked',
      salesExecutiveId: booking.salesExecutiveId || '',
      notes: booking.notes || '',
    });
    setEditDialog(true);
  };

  const handleDeleteClick = (booking) => {
    setSelectedBooking(booking);
    setDeleteDialog(true);
  };

  const handleCreateBooking = async () => {
    if (!formData.customerId || !formData.flatNo || !formData.agreementValue || !formData.bookingAmount || !formData.bookingDate) {
      setError('Customer, Flat No, Agreement Value, Booking Amount, and Booking Date are required');
      return;
    }

    try {
      await apiClient.post('/bookings', {
        ...formData,
        customerId: parseInt(formData.customerId),
        carpetArea: formData.carpetArea ? parseFloat(formData.carpetArea) : null,
        agreementValue: parseFloat(formData.agreementValue),
        bookingAmount: parseFloat(formData.bookingAmount),
        salesExecutiveId: formData.salesExecutiveId ? parseInt(formData.salesExecutiveId) : null,
      });
      setSuccess('Booking record created successfully');
      setOpenDialog(false);
      resetForm();
      fetchBookings();
      fetchStats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error creating booking:', error);
      setError('Failed to create booking record');
    }
  };

  const handleUpdateBooking = async () => {
    if (!formData.customerId || !formData.flatNo || !formData.agreementValue || !formData.bookingAmount || !formData.bookingDate) {
      setError('Customer, Flat No, Agreement Value, Booking Amount, and Booking Date are required');
      return;
    }

    try {
      await apiClient.put(`/bookings/${selectedBooking.id}`, {
        ...formData,
        customerId: parseInt(formData.customerId),
        carpetArea: formData.carpetArea ? parseFloat(formData.carpetArea) : null,
        agreementValue: parseFloat(formData.agreementValue),
        bookingAmount: parseFloat(formData.bookingAmount),
        salesExecutiveId: formData.salesExecutiveId ? parseInt(formData.salesExecutiveId) : null,
      });
      setSuccess('Booking record updated successfully');
      setEditDialog(false);
      resetForm();
      fetchBookings();
      fetchStats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating booking:', error);
      setError('Failed to update booking record');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await apiClient.delete(`/bookings/${selectedBooking.id}`);
      setSuccess('Booking record deleted successfully');
      setDeleteDialog(false);
      fetchBookings();
      fetchStats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting booking:', error);
      setError('Failed to delete booking record');
    }
  };

  // ==================== Render ====================

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'customerName', headerName: 'Customer', flex: 1 },
    { field: 'projectName', headerName: 'Project', flex: 1 },
    { field: 'flatNo', headerName: 'Flat No', flex: 1 },
    { field: 'agreementValue', headerName: 'Agreement Value', flex: 1 },
    { field: 'bookingAmount', headerName: 'Booking Amount', flex: 1 },
    { field: 'bookingDate', headerName: 'Booking Date', flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'inline-block',
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            backgroundColor:
              params.value === 'Confirmed'
                ? '#c8e6c9'
                : params.value === 'Booked'
                ? '#fff9c4'
                : '#ffccbc',
            color:
              params.value === 'Confirmed'
                ? '#2e7d32'
                : params.value === 'Booked'
                ? '#f57f17'
                : '#d84315',
            fontWeight: 'bold',
            fontSize: '0.85rem',
          }}
        >
          {params.value || 'Booked'}
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            color="info"
            size="small"
            onClick={() => handleViewClick(params.row)}
            title="View"
          >
            <Visibility />
          </IconButton>
          <IconButton
            color="primary"
            size="small"
            onClick={() => handleEditClick(params.row)}
            title="Edit"
          >
            <Edit />
          </IconButton>
          <IconButton
            color="error"
            size="small"
            onClick={() => handleDeleteClick(params.row)}
            title="Delete"
          >
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        📋 Booking / Deal Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Tab Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="📊 Dashboard" />
          <Tab label="📋 All Bookings" />
          <Tab label="🔍 Filters" />
        </Tabs>
      </Box>

      {/* Tab 1: Dashboard with Statistics */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: '#e3f2fd' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Bookings
                </Typography>
                <Typography variant="h5">{stats.totalBookings}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: '#fff9c4' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Booked
                </Typography>
                <Typography variant="h5">{stats.booked}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: '#c8e6c9' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Confirmed
                </Typography>
                <Typography variant="h5">{stats.confirmed}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddClick}
          >
            Add New Booking
          </Button>
        </Box>
      </TabPanel>

      {/* Tab 2: All Bookings List */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddClick}
          >
            Add New Booking
          </Button>
        </Box>
        <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
          <DataGrid
            rows={bookings}
            columns={columns}
            paginationMode="server"
            rowCount={totalElements}
            page={page}
            pageSize={rowsPerPage}
            onPageChange={(newPage) => setPage(newPage)}
            onPageSizeChange={(newSize) => setRowsPerPage(newSize)}
            rowsPerPageOptions={[5, 10, 25, 50]}
            components={{ Toolbar: GridToolbar }}
            sx={{ borderRadius: 2, boxShadow: 3 }}
          />
        </Paper>
      </TabPanel>

      {/* Tab 3: Filters */}
      <TabPanel value={tabValue} index={2}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Filter Bookings
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Customer</InputLabel>
                <Select
                  name="filterCustomerId"
                  value={filterCustomerId}
                  onChange={(e) => setFilterCustomerId(e.target.value)}
                  label="Customer"
                >
                  <MenuItem value="">All Customers</MenuItem>
                  {customers.map((customer) => (
                    <MenuItem key={customer.id} value={customer.id}>
                      {customer.firstName} {customer.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="filterStatus"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="Booked">Booked</MenuItem>
                  <MenuItem value="Confirmed">Confirmed</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Project Name"
                value={filterProject}
                onChange={(e) => setFilterProject(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={fetchBookings}
              >
                Apply Filters
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setFilterCustomerId('');
                  setFilterStatus('');
                  setFilterProject('');
                  setFilterStartDate('');
                  setFilterEndDate('');
                  fetchBookings();
                }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </TabPanel>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog || editDialog} onClose={() => { setOpenDialog(false); setEditDialog(false); }} maxWidth="sm" fullWidth>
        <DialogTitle>
          {openDialog ? 'Add New Booking' : 'Edit Booking'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl fullWidth required>
              <InputLabel>Customer</InputLabel>
              <Select
                name="customerId"
                value={formData.customerId}
                onChange={handleFormChange}
                label="Customer"
              >
                {customers.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.firstName} {customer.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              required
              label="Project Name"
              name="projectName"
              value={formData.projectName}
              onChange={handleFormChange}
            />
            <TextField
              fullWidth
              label="Building Name"
              name="buildingName"
              value={formData.buildingName}
              onChange={handleFormChange}
            />
            <TextField
              fullWidth
              required
              label="Flat No"
              name="flatNo"
              value={formData.flatNo}
              onChange={handleFormChange}
            />
            <TextField
              fullWidth
              label="Floor No"
              name="floorNo"
              value={formData.floorNo}
              onChange={handleFormChange}
            />
            <FormControl fullWidth>
              <InputLabel>Flat Type</InputLabel>
              <Select
                name="flatType"
                value={formData.flatType}
                onChange={handleFormChange}
                label="Flat Type"
              >
                <MenuItem value="">Select Type</MenuItem>
                <MenuItem value="1BHK">1BHK</MenuItem>
                <MenuItem value="2BHK">2BHK</MenuItem>
                <MenuItem value="3BHK">3BHK</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Carpet Area (sq ft)"
              type="number"
              name="carpetArea"
              value={formData.carpetArea}
              onChange={handleFormChange}
              inputProps={{ step: '0.01' }}
            />
            <TextField
              fullWidth
              required
              label="Agreement Value"
              type="number"
              name="agreementValue"
              value={formData.agreementValue}
              onChange={handleFormChange}
              inputProps={{ step: '0.01' }}
            />
            <TextField
              fullWidth
              required
              label="Booking Amount"
              type="number"
              name="bookingAmount"
              value={formData.bookingAmount}
              onChange={handleFormChange}
              inputProps={{ step: '0.01' }}
            />
            <TextField
              fullWidth
              required
              label="Booking Date"
              type="date"
              name="bookingDate"
              value={formData.bookingDate}
              onChange={handleFormChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Payment Plan"
              name="paymentPlan"
              value={formData.paymentPlan}
              onChange={handleFormChange}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                label="Status"
              >
                <MenuItem value="Booked">Booked</MenuItem>
                <MenuItem value="Confirmed">Confirmed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Sales Executive ID"
              type="number"
              name="salesExecutiveId"
              value={formData.salesExecutiveId}
              onChange={handleFormChange}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleFormChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenDialog(false); setEditDialog(false); resetForm(); }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={openDialog ? handleCreateBooking : handleUpdateBooking}
          >
            {openDialog ? 'Create' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Booking Details</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Typography><strong>Customer:</strong> {selectedBooking.customerName}</Typography>
              <Typography><strong>Email:</strong> {selectedBooking.customerEmail}</Typography>
              <Typography><strong>Phone:</strong> {selectedBooking.customerPhone}</Typography>
              <Typography><strong>Project:</strong> {selectedBooking.projectName}</Typography>
              <Typography><strong>Building:</strong> {selectedBooking.buildingName}</Typography>
              <Typography><strong>Flat No:</strong> {selectedBooking.flatNo}</Typography>
              <Typography><strong>Floor No:</strong> {selectedBooking.floorNo}</Typography>
              <Typography><strong>Flat Type:</strong> {selectedBooking.flatType}</Typography>
              <Typography><strong>Carpet Area:</strong> {selectedBooking.carpetArea} sq ft</Typography>
              <Typography><strong>Agreement Value:</strong> ₹ {selectedBooking.agreementValue}</Typography>
              <Typography><strong>Booking Amount:</strong> ₹ {selectedBooking.bookingAmount}</Typography>
              <Typography><strong>Booking Date:</strong> {selectedBooking.bookingDate}</Typography>
              <Typography><strong>Payment Plan:</strong> {selectedBooking.paymentPlan}</Typography>
              <Typography><strong>Status:</strong> {selectedBooking.status}</Typography>
              <Typography><strong>Notes:</strong> {selectedBooking.notes}</Typography>
              <Typography><strong>Created At:</strong> {selectedBooking.createdAt}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this booking record? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Booking;
