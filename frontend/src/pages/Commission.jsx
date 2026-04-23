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
import { Edit, Delete, Visibility, Add, Calculate } from '@mui/icons-material';
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

const Commission = () => {
  // State Management
  const [commissions, setCommissions] = useState([]);
  const [commissionSettings, setCommissionSettings] = useState([]);
  const [projects, setProjects] = useState([]);
  const [builders, setBuilders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState({
    expected: 0,
    received: 0,
    pending: 0,
    pendingCount: 0,
    receivedCount: 0,
  });

  // Dialog States
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [settingsDialog, setSettingsDialog] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState(null);

  // Filter States
  const [filterCustomerId, setFilterCustomerId] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    saleId: '',
    bookingId: '',
    customerId: '',
    expectedCommission: '',
    receivedCommission: '',
    paymentDate: '',
    status: 'Pending',
    notes: '',
  });

  const [settingsFormData, setSettingsFormData] = useState({
    projectId: '',
    builderId: '',
    commissionPercentage: '',
    notes: '',
  });

  // ==================== useEffect Hooks ====================

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, filterCustomerId, filterStatus]);

  const fetchData = async () => {
    try {
      await Promise.all([
        fetchCommissions(),
        fetchCommissionSettings(),
        fetchProjects(),
        fetchBuilders(),
        fetchCustomers(),
        fetchStats(),
      ]);
      setError('');
    } catch (err) {
      setError('Failed to load data');
    }
  };

  const fetchCommissions = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: rowsPerPage.toString(),
      });

      if (filterCustomerId) params.append('customerId', filterCustomerId);
      if (filterStatus) params.append('status', filterStatus);

      const response = await apiClient.get(`/commissions?${params}`);
      setCommissions(response.data.content || response.data);
      setTotalElements(response.data.totalElements || response.data.length);
    } catch (error) {
      console.error('Error fetching commissions:', error);
      setError('Failed to load commissions');
    }
  };

  const fetchCommissionSettings = async () => {
    try {
      const response = await apiClient.get('/commission-settings');
      setCommissionSettings(response.data);
    } catch (error) {
      console.error('Error fetching commission settings:', error);
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

  const fetchBuilders = async () => {
    try {
      const response = await apiClient.get('/builders', {
        params: { page: 0, size: 100 },
      });
      setBuilders(response.data.content || response.data);
    } catch (error) {
      console.error('Error fetching builders:', error);
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
      const response = await apiClient.get('/commissions/stats');
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

  const handleSettingsFormChange = (e) => {
    const { name, value } = e.target;
    setSettingsFormData({ ...settingsFormData, [name]: value });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const resetForm = () => {
    setFormData({
      saleId: '',
      bookingId: '',
      customerId: '',
      expectedCommission: '',
      receivedCommission: '',
      paymentDate: '',
      status: 'Pending',
      notes: '',
    });
  };

  const resetSettingsForm = () => {
    setSettingsFormData({
      projectId: '',
      builderId: '',
      commissionPercentage: '',
      notes: '',
    });
  };

  const handleAddClick = () => {
    resetForm();
    setOpenDialog(true);
  };

  const handleSettingsClick = () => {
    resetSettingsForm();
    setSettingsDialog(true);
  };

  const handleViewClick = (commission) => {
    setSelectedCommission(commission);
    setViewDialog(true);
  };

  const handleEditClick = (commission) => {
    setSelectedCommission(commission);
    setFormData({
      saleId: commission.saleId || '',
      bookingId: commission.bookingId || '',
      customerId: commission.customerId || '',
      expectedCommission: commission.expectedCommission || '',
      receivedCommission: commission.receivedCommission || '',
      paymentDate: commission.paymentDate || '',
      status: commission.status || 'Pending',
      notes: commission.notes || '',
    });
    setEditDialog(true);
  };

  const handleDeleteClick = (commission) => {
    setSelectedCommission(commission);
    setDeleteDialog(true);
  };

  const handleCreateCommission = async () => {
    if (!formData.customerId || !formData.expectedCommission) {
      setError('Customer and Expected Commission are required');
      return;
    }

    try {
      await apiClient.post('/commissions', {
        ...formData,
        saleId: formData.saleId ? parseInt(formData.saleId) : null,
        bookingId: formData.bookingId ? parseInt(formData.bookingId) : null,
        customerId: parseInt(formData.customerId),
        expectedCommission: parseFloat(formData.expectedCommission),
        receivedCommission: formData.receivedCommission ? parseFloat(formData.receivedCommission) : null,
      });
      setSuccess('Commission record created successfully');
      setOpenDialog(false);
      resetForm();
      fetchCommissions();
      fetchStats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error creating commission:', error);
      setError('Failed to create commission record');
    }
  };

  const handleUpdateCommission = async () => {
    if (!formData.customerId || !formData.expectedCommission) {
      setError('Customer and Expected Commission are required');
      return;
    }

    try {
      await apiClient.put(`/commissions/${selectedCommission.id}`, {
        ...formData,
        saleId: formData.saleId ? parseInt(formData.saleId) : null,
        bookingId: formData.bookingId ? parseInt(formData.bookingId) : null,
        customerId: parseInt(formData.customerId),
        expectedCommission: parseFloat(formData.expectedCommission),
        receivedCommission: formData.receivedCommission ? parseFloat(formData.receivedCommission) : null,
      });
      setSuccess('Commission record updated successfully');
      setEditDialog(false);
      resetForm();
      fetchCommissions();
      fetchStats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating commission:', error);
      setError('Failed to update commission record');
    }
  };

  const handleCreateSettings = async () => {
    if (!settingsFormData.commissionPercentage) {
      setError('Commission Percentage is required');
      return;
    }

    try {
      await apiClient.post('/commission-settings', {
        ...settingsFormData,
        projectId: settingsFormData.projectId ? parseInt(settingsFormData.projectId) : null,
        builderId: settingsFormData.builderId ? parseInt(settingsFormData.builderId) : null,
        commissionPercentage: parseFloat(settingsFormData.commissionPercentage),
      });
      setSuccess('Commission setting created successfully');
      setSettingsDialog(false);
      resetSettingsForm();
      fetchCommissionSettings();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error creating commission setting:', error);
      setError('Failed to create commission setting');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await apiClient.delete(`/commissions/${selectedCommission.id}`);
      setSuccess('Commission record deleted successfully');
      setDeleteDialog(false);
      fetchCommissions();
      fetchStats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting commission:', error);
      setError('Failed to delete commission record');
    }
  };

  // ==================== Render ====================

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'customerName', headerName: 'Customer', flex: 1 },
    { field: 'projectName', headerName: 'Project', flex: 1 },
    { field: 'expectedCommission', headerName: 'Expected', flex: 1, renderCell: (params) => `₹${params.value?.toLocaleString() || 0}` },
    { field: 'receivedCommission', headerName: 'Received', flex: 1, renderCell: (params) => `₹${params.value?.toLocaleString() || 0}` },
    { field: 'pendingCommission', headerName: 'Pending', flex: 1, renderCell: (params) => `₹${params.value?.toLocaleString() || 0}` },
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
              params.value === 'Received'
                ? '#c8e6c9'
                : params.value === 'Partial'
                ? '#fff9c4'
                : '#ffccbc',
            color:
              params.value === 'Received'
                ? '#2e7d32'
                : params.value === 'Partial'
                ? '#f57f17'
                : '#d84315',
            fontWeight: 'bold',
            fontSize: '0.85rem',
          }}
        >
          {params.value || 'Pending'}
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
        💰 Commission Management
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
          <Tab label="📋 All Commissions" />
          <Tab label="⚙️ Settings" />
          <Tab label="🔍 Filters" />
        </Tabs>
      </Box>

      {/* Tab 1: Dashboard with Statistics */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#e8f5e8' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Expected Commission
                </Typography>
                <Typography variant="h5">₹{stats.expected?.toLocaleString() || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#c8e6c9' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Received Commission
                </Typography>
                <Typography variant="h5">₹{stats.received?.toLocaleString() || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#ffccbc' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Pending Commission
                </Typography>
                <Typography variant="h5">₹{stats.pending?.toLocaleString() || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#fff9c4' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Pending Records
                </Typography>
                <Typography variant="h5">{stats.pendingCount || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddClick}
          >
            Add Commission
          </Button>
          <Button
            variant="outlined"
            startIcon={<Calculate />}
            onClick={handleSettingsClick}
          >
            Commission Settings
          </Button>
        </Box>
      </TabPanel>

      {/* Tab 2: All Commissions List */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddClick}
          >
            Add Commission
          </Button>
        </Box>
        <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
          <DataGrid
            rows={commissions}
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

      {/* Tab 3: Commission Settings */}
      <TabPanel value={tabValue} index={2}>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleSettingsClick}
          >
            Add Commission Setting
          </Button>
        </Box>
        <Grid container spacing={2}>
          {commissionSettings.map((setting) => (
            <Grid item xs={12} md={6} key={setting.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">
                    {setting.projectName || setting.builderName}
                  </Typography>
                  <Typography>Commission: {setting.commissionPercentage}%</Typography>
                  {setting.notes && <Typography variant="body2" color="textSecondary">{setting.notes}</Typography>}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Tab 4: Filters */}
      <TabPanel value={tabValue} index={3}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Filter Commissions
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
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Partial">Partial</MenuItem>
                  <MenuItem value="Received">Received</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={fetchCommissions}
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
                  fetchCommissions();
                }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </TabPanel>

      {/* Add/Edit Commission Dialog */}
      <Dialog open={openDialog || editDialog} onClose={() => { setOpenDialog(false); setEditDialog(false); }} maxWidth="sm" fullWidth>
        <DialogTitle>
          {openDialog ? 'Add New Commission' : 'Edit Commission'}
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
              label="Sale ID (Optional)"
              name="saleId"
              value={formData.saleId}
              onChange={handleFormChange}
              type="number"
            />
            <TextField
              fullWidth
              label="Booking ID (Optional)"
              name="bookingId"
              value={formData.bookingId}
              onChange={handleFormChange}
              type="number"
            />
            <TextField
              fullWidth
              required
              label="Expected Commission"
              type="number"
              name="expectedCommission"
              value={formData.expectedCommission}
              onChange={handleFormChange}
              inputProps={{ step: '0.01' }}
            />
            <TextField
              fullWidth
              label="Received Commission"
              type="number"
              name="receivedCommission"
              value={formData.receivedCommission}
              onChange={handleFormChange}
              inputProps={{ step: '0.01' }}
            />
            <TextField
              fullWidth
              label="Payment Date"
              type="date"
              name="paymentDate"
              value={formData.paymentDate}
              onChange={handleFormChange}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                label="Status"
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Partial">Partial</MenuItem>
                <MenuItem value="Received">Received</MenuItem>
              </Select>
            </FormControl>
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
            onClick={openDialog ? handleCreateCommission : handleUpdateCommission}
          >
            {openDialog ? 'Create' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Commission Settings Dialog */}
      <Dialog open={settingsDialog} onClose={() => setSettingsDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Commission Setting</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Project (Optional)</InputLabel>
              <Select
                name="projectId"
                value={settingsFormData.projectId}
                onChange={handleSettingsFormChange}
                label="Project (Optional)"
              >
                <MenuItem value="">Select Project</MenuItem>
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Builder (Optional)</InputLabel>
              <Select
                name="builderId"
                value={settingsFormData.builderId}
                onChange={handleSettingsFormChange}
                label="Builder (Optional)"
              >
                <MenuItem value="">Select Builder</MenuItem>
                {builders.map((builder) => (
                  <MenuItem key={builder.id} value={builder.id}>
                    {builder.firstName} {builder.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              required
              label="Commission Percentage"
              type="number"
              name="commissionPercentage"
              value={settingsFormData.commissionPercentage}
              onChange={handleSettingsFormChange}
              inputProps={{ step: '0.01', min: 0, max: 100 }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Notes"
              name="notes"
              value={settingsFormData.notes}
              onChange={handleSettingsFormChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setSettingsDialog(false); resetSettingsForm(); }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateSettings}
          >
            Create Setting
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Commission Details</DialogTitle>
        <DialogContent>
          {selectedCommission && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Typography><strong>Customer:</strong> {selectedCommission.customerName}</Typography>
              <Typography><strong>Project:</strong> {selectedCommission.projectName}</Typography>
              <Typography><strong>Expected Commission:</strong> ₹{selectedCommission.expectedCommission?.toLocaleString()}</Typography>
              <Typography><strong>Received Commission:</strong> ₹{selectedCommission.receivedCommission?.toLocaleString()}</Typography>
              <Typography><strong>Pending Commission:</strong> ₹{selectedCommission.pendingCommission?.toLocaleString()}</Typography>
              <Typography><strong>Payment Date:</strong> {selectedCommission.paymentDate}</Typography>
              <Typography><strong>Status:</strong> {selectedCommission.status}</Typography>
              <Typography><strong>Notes:</strong> {selectedCommission.notes}</Typography>
              <Typography><strong>Created At:</strong> {selectedCommission.createdAt}</Typography>
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
            Are you sure you want to delete this commission record? This action cannot be undone.
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

export default Commission;
