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
  Tab,
  Tabs,
} from '@mui/material';
import { Edit, Delete, Visibility, Add, Business } from '@mui/icons-material';
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

const Builders = () => {
  // State Management
  const [builders, setBuilders] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState({
    totalBuilders: 0,
  });

  // Dialog States
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedBuilder, setSelectedBuilder] = useState(null);

  // Filter States
  const [filterCity, setFilterCity] = useState('');
  const [filterState, setFilterState] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    address: '',
    city: '',
    state: '',
    office: '',
    pin: '',
    gstNo: '',
  });

  // ==================== useEffect Hooks ====================

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, filterCity, filterState]);

  const fetchData = async () => {
    try {
      await Promise.all([
        fetchBuilders(),
        fetchStats(),
      ]);
      setError('');
    } catch (err) {
      setError('Failed to load data');
    }
  };

  const fetchBuilders = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: rowsPerPage.toString(),
      });

      if (filterCity) params.append('city', filterCity);
      if (filterState) params.append('state', filterState);

      const response = await apiClient.get(`/builders?${params}`);
      setBuilders(response.data.content || response.data);
      setTotalElements(response.data.totalElements || response.data.length);
    } catch (error) {
      console.error('Error fetching builders:', error);
      setError('Failed to load builders');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/builders', {
        params: { page: 0, size: 1000 },
      });
      setStats({
        totalBuilders: response.data.totalElements || response.data.length,
      });
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
      firstName: '',
      lastName: '',
      email: '',
      contactNumber: '',
      address: '',
      city: '',
      state: '',
      office: '',
      pin: '',
      gstNo: '',
    });
  };

  const handleAddClick = () => {
    resetForm();
    setOpenDialog(true);
  };

  const handleViewClick = (builder) => {
    setSelectedBuilder(builder);
    setViewDialog(true);
  };

  const handleEditClick = (builder) => {
    setSelectedBuilder(builder);
    setFormData({
      firstName: builder.firstName || '',
      lastName: builder.lastName || '',
      email: builder.email || '',
      contactNumber: builder.contactNumber || '',
      address: builder.address || '',
      city: builder.city || '',
      state: builder.state || '',
      office: builder.office || '',
      pin: builder.pin || '',
      gstNo: builder.gstNo || '',
    });
    setEditDialog(true);
  };

  const handleDeleteClick = (builder) => {
    setSelectedBuilder(builder);
    setDeleteDialog(true);
  };

  const handleCreateBuilder = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError('First Name, Last Name, and Email are required');
      return;
    }

    try {
      await apiClient.post('/builders', formData);
      setSuccess('Builder created successfully');
      setOpenDialog(false);
      resetForm();
      fetchBuilders();
      fetchStats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error creating builder:', error);
      setError('Failed to create builder');
    }
  };

  const handleUpdateBuilder = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError('First Name, Last Name, and Email are required');
      return;
    }

    try {
      await apiClient.put(`/builders/${selectedBuilder.id}`, formData);
      setSuccess('Builder updated successfully');
      setEditDialog(false);
      resetForm();
      fetchBuilders();
      fetchStats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating builder:', error);
      setError('Failed to update builder');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await apiClient.delete(`/builders/${selectedBuilder.id}`);
      setSuccess('Builder deleted successfully');
      setDeleteDialog(false);
      fetchBuilders();
      fetchStats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting builder:', error);
      setError('Failed to delete builder');
    }
  };

  // ==================== Render ====================

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First Name', flex: 1 },
    { field: 'lastName', headerName: 'Last Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'contactNumber', headerName: 'Contact', flex: 1 },
    { field: 'city', headerName: 'City', flex: 1 },
    { field: 'state', headerName: 'State', flex: 1 },
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
        🏗️ Builders Management
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
          <Tab label="📋 All Builders" />
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
                  Total Builders
                </Typography>
                <Typography variant="h5">{stats.totalBuilders}</Typography>
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
            Add New Builder
          </Button>
        </Box>
      </TabPanel>

      {/* Tab 2: All Builders List */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddClick}
          >
            Add New Builder
          </Button>
        </Box>
        <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
          <DataGrid
            rows={builders}
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
            Filter Builders
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="City"
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="State"
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={fetchBuilders}
              >
                Apply Filters
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setFilterCity('');
                  setFilterState('');
                  fetchBuilders();
                }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </TabPanel>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog || editDialog} onClose={() => { setOpenDialog(false); setEditDialog(false); }} maxWidth="md" fullWidth>
        <DialogTitle>
          {openDialog ? 'Add New Builder' : 'Edit Builder'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleFormChange}
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              required
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
            />
            <TextField
              fullWidth
              label="Contact Number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleFormChange}
            />
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleFormChange}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleFormChange}
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label="Office"
              name="office"
              value={formData.office}
              onChange={handleFormChange}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Pin Code"
                  name="pin"
                  value={formData.pin}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="GST Number"
                  name="gstNo"
                  value={formData.gstNo}
                  onChange={handleFormChange}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenDialog(false); setEditDialog(false); resetForm(); }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={openDialog ? handleCreateBuilder : handleUpdateBuilder}
          >
            {openDialog ? 'Create' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Builder Details</DialogTitle>
        <DialogContent>
          {selectedBuilder && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Typography><strong>Name:</strong> {selectedBuilder.firstName} {selectedBuilder.lastName}</Typography>
              <Typography><strong>Email:</strong> {selectedBuilder.email}</Typography>
              <Typography><strong>Contact:</strong> {selectedBuilder.contactNumber}</Typography>
              <Typography><strong>Address:</strong> {selectedBuilder.address}</Typography>
              <Typography><strong>City:</strong> {selectedBuilder.city}</Typography>
              <Typography><strong>State:</strong> {selectedBuilder.state}</Typography>
              <Typography><strong>Office:</strong> {selectedBuilder.office}</Typography>
              <Typography><strong>Pin Code:</strong> {selectedBuilder.pin}</Typography>
              <Typography><strong>GST Number:</strong> {selectedBuilder.gstNo}</Typography>
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
            Are you sure you want to delete this builder? This action cannot be undone.
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

export default Builders;
