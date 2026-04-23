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
import { Edit, Delete, Visibility, Add, People, History } from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
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

const Customers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState({
    totalCustomers: 0,
  });

  // Dialog States
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Filter States
  const [filterProjectId, setFilterProjectId] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCity, setFilterCity] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    budget: '',
    status: 'Interested',
    projectId: '',
  });

  // ==================== useEffect Hooks ====================

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, filterProjectId, filterStatus, filterCity]);

  const fetchData = async () => {
    try {
      await Promise.all([
        fetchCustomers(),
        fetchProjects(),
        fetchStats(),
      ]);
      setError('');
    } catch (err) {
      setError('Failed to load data');
    }
  };

  const fetchCustomers = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: rowsPerPage.toString(),
      });

      if (filterProjectId) params.append('projectId', filterProjectId);
      if (filterStatus) params.append('status', filterStatus);
      if (filterCity) params.append('city', filterCity);

      const response = await apiClient.get(`/customers?${params}`);
      setCustomers(response.data.content || response.data);
      setTotalElements(response.data.totalElements || response.data.length);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('Failed to load customers');
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await apiClient.get('/projects', {
        params: { page: 0, size: 100 },
      });
      setProjects(response.data.content || response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/customers', {
        params: { page: 0, size: 1000 },
      });
      setStats({
        totalCustomers: response.data.totalElements || response.data.length,
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
      phone: '',
      address: '',
      city: '',
      state: '',
      budget: '',
      status: 'Interested',
      projectId: '',
    });
  };

  const handleAddClick = () => {
    resetForm();
    setOpenDialog(true);
  };

  const handleViewClick = (customer) => {
    setSelectedCustomer(customer);
    setViewDialog(true);
  };

  const handleEditClick = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      firstName: customer.firstName || '',
      lastName: customer.lastName || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
      city: customer.city || '',
      state: customer.state || '',
      budget: customer.budget || '',
      status: customer.status || 'Interested',
      projectId: customer.projectId || '',
    });
    setEditDialog(true);
  };

  const handleDeleteClick = (customer) => {
    setSelectedCustomer(customer);
    setDeleteDialog(true);
  };

  const handleHistoryClick = (customerId) => {
    // Navigate to customer history or open a modal
    navigate(`/customers/${customerId}/history`);
  };

  const handleCreateCustomer = async () => {
    if (!formData.firstName || !formData.lastName || !formData.projectId) {
      setError('First Name, Last Name, and Project are required');
      return;
    }

    try {
      await apiClient.post('/customers', {
        ...formData,
        projectId: parseInt(formData.projectId),
        budget: formData.budget ? parseFloat(formData.budget) : null,
      });
      setSuccess('Customer created successfully');
      setOpenDialog(false);
      resetForm();
      fetchCustomers();
      fetchStats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error creating customer:', error);
      setError('Failed to create customer');
    }
  };

  const handleUpdateCustomer = async () => {
    if (!formData.firstName || !formData.lastName || !formData.projectId) {
      setError('First Name, Last Name, and Project are required');
      return;
    }

    try {
      await apiClient.put(`/customers/${selectedCustomer.id}`, {
        ...formData,
        projectId: parseInt(formData.projectId),
        budget: formData.budget ? parseFloat(formData.budget) : null,
      });
      setSuccess('Customer updated successfully');
      setEditDialog(false);
      resetForm();
      fetchCustomers();
      fetchStats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating customer:', error);
      setError('Failed to update customer');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await apiClient.delete(`/customers/${selectedCustomer.id}`);
      setSuccess('Customer deleted successfully');
      setDeleteDialog(false);
      fetchCustomers();
      fetchStats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting customer:', error);
      setError('Failed to delete customer');
    }
  };

  // ==================== Render ====================

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'fullName',
      headerName: 'Full Name',
      flex: 1,
      valueGetter: (params) => `${params.row.firstName || ''} ${params.row.lastName || ''}`.trim()
    },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'phone', headerName: 'Phone', flex: 1 },
    { field: 'city', headerName: 'City', flex: 1 },
    {
      field: 'projectName',
      headerName: 'Project',
      flex: 1,
      valueGetter: (params) => params.row.project?.name || ''
    },
    {
      field: 'budget',
      headerName: 'Budget',
      flex: 1,
      renderCell: (params) => `₹${params.value?.toLocaleString() || 0}`
    },
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
              params.value === 'Booked'
                ? '#c8e6c9'
                : params.value === 'Visited'
                ? '#fff9c4'
                : '#e3f2fd',
            color:
              params.value === 'Booked'
                ? '#2e7d32'
                : params.value === 'Visited'
                ? '#f57f17'
                : '#1976d2',
            fontWeight: 'bold',
            fontSize: '0.85rem',
          }}
        >
          {params.value || 'Interested'}
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
            color="secondary"
            size="small"
            onClick={() => handleHistoryClick(params.row.id)}
            title="History"
          >
            <History />
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
        👥 Customers Management
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
          <Tab label="📋 All Customers" />
          <Tab label="🔍 Filters" />
        </Tabs>
      </Box>

      {/* Tab 1: Dashboard with Statistics */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: '#f3e5f5' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Customers
                </Typography>
                <Typography variant="h5">{stats.totalCustomers}</Typography>
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
            Add New Customer
          </Button>
        </Box>
      </TabPanel>

      {/* Tab 2: All Customers List */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddClick}
          >
            Add New Customer
          </Button>
        </Box>
        <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
          <DataGrid
            rows={customers}
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
            Filter Customers
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Project</InputLabel>
                <Select
                  name="filterProjectId"
                  value={filterProjectId}
                  onChange={(e) => setFilterProjectId(e.target.value)}
                  label="Project"
                >
                  <MenuItem value="">All Projects</MenuItem>
                  {projects.map((project) => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name}
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
                  <MenuItem value="Interested">Interested</MenuItem>
                  <MenuItem value="Visited">Visited</MenuItem>
                  <MenuItem value="Booked">Booked</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="City"
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={fetchCustomers}
              >
                Apply Filters
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setFilterProjectId('');
                  setFilterStatus('');
                  setFilterCity('');
                  fetchCustomers();
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
          {openDialog ? 'Add New Customer' : 'Edit Customer'}
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
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
            />
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
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
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Budget"
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleFormChange}
                  inputProps={{ step: '0.01' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    label="Status"
                  >
                    <MenuItem value="Interested">Interested</MenuItem>
                    <MenuItem value="Visited">Visited</MenuItem>
                    <MenuItem value="Booked">Booked</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <FormControl fullWidth required>
              <InputLabel>Project</InputLabel>
              <Select
                name="projectId"
                value={formData.projectId}
                onChange={handleFormChange}
                label="Project"
              >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenDialog(false); setEditDialog(false); resetForm(); }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={openDialog ? handleCreateCustomer : handleUpdateCustomer}
          >
            {openDialog ? 'Create' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Customer Details</DialogTitle>
        <DialogContent>
          {selectedCustomer && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Typography><strong>Name:</strong> {selectedCustomer.firstName} {selectedCustomer.lastName}</Typography>
              <Typography><strong>Email:</strong> {selectedCustomer.email}</Typography>
              <Typography><strong>Phone:</strong> {selectedCustomer.phone}</Typography>
              <Typography><strong>Address:</strong> {selectedCustomer.address}</Typography>
              <Typography><strong>City:</strong> {selectedCustomer.city}</Typography>
              <Typography><strong>State:</strong> {selectedCustomer.state}</Typography>
              <Typography><strong>Budget:</strong> ₹{selectedCustomer.budget?.toLocaleString()}</Typography>
              <Typography><strong>Status:</strong> {selectedCustomer.status}</Typography>
              <Typography><strong>Project:</strong> {selectedCustomer.project?.name}</Typography>
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
            Are you sure you want to delete this customer? This action cannot be undone.
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

export default Customers;
