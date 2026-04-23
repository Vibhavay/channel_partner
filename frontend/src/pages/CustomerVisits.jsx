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
import customerVisitAPI from '../api/customerVisitAPI';
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

const CustomerVisits = () => {
  // State Management
  const [visits, setVisits] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState({
    totalConfirmed: 0,
    totalCompleted: 0,
    totalScheduled: 0,
  });

  // Dialog States
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);

  // Filter States
  const [filterCustomerId, setFilterCustomerId] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    customerId: '',
    visitDate: '',
    visitType: '',
    status: 'Scheduled',
    notes: '',
    projectId: '',
    flatType: '',
    flatSize: '',
    visitStatus: '',
    createdBy: 'Current User',
  });

  // ==================== useEffect Hooks ====================

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, filterCustomerId, filterStatus, filterType]);

  const fetchData = async () => {
    try {
      await Promise.all([
        fetchVisits(),
        fetchCustomers(),
        fetchProjects(),
        fetchStats(),
      ]);
      setError('');
    } catch (err) {
      setError('Failed to load data');
    }
  };

  const fetchVisits = async () => {
    try {
      const response = await customerVisitAPI.getCustomerVisits(page, rowsPerPage);
      setVisits(response.data.content || response.data);
      setTotalElements(response.data.totalElements || response.data.length);
    } catch (error) {
      console.error('Error fetching visits:', error);
      setError('Failed to load visits');
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
      const response = await customerVisitAPI.getVisitStatistics();
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
      visitDate: '',
      visitType: '',
      status: 'Scheduled',
      notes: '',
      projectId: '',
      flatType: '',
      flatSize: '',
      visitStatus: '',
      createdBy: 'Current User',
    });
  };

  const handleAddClick = () => {
    resetForm();
    setOpenDialog(true);
  };

  const handleViewClick = (visit) => {
    setSelectedVisit(visit);
    setViewDialog(true);
  };

  const handleEditClick = (visit) => {
    setSelectedVisit(visit);
    setFormData({
      customerId: visit.customerId,
      visitDate: visit.visitDate ? visit.visitDate.substring(0, 16) : '',
      visitType: visit.visitType || '',
      status: visit.status || 'Scheduled',
      notes: visit.notes || '',
      projectId: visit.projectId || '',
      flatType: visit.flatType || '',
      flatSize: visit.flatSize || '',
      visitStatus: visit.visitStatus || '',
      createdBy: visit.createdBy || 'Current User',
    });
    setEditDialog(true);
  };

  const handleDeleteClick = (visit) => {
    setSelectedVisit(visit);
    setDeleteDialog(true);
  };

  const handleCreateVisit = async () => {
    if (!formData.customerId || !formData.visitDate) {
      setError('Customer and Visit Date are required');
      return;
    }

    try {
      await customerVisitAPI.createCustomerVisit({
        ...formData,
        customerId: parseInt(formData.customerId),
        projectId: formData.projectId ? parseInt(formData.projectId) : null,
        flatSize: formData.flatSize ? parseFloat(formData.flatSize) : null,
      });
      setSuccess('Visit created successfully');
      setOpenDialog(false);
      resetForm();
      fetchVisits();
      fetchStats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error creating visit:', error);
      setError('Failed to create visit');
    }
  };

  const handleUpdateVisit = async () => {
    if (!formData.customerId || !formData.visitDate) {
      setError('Customer and Visit Date are required');
      return;
    }

    try {
      await customerVisitAPI.updateCustomerVisit(selectedVisit.id, {
        ...formData,
        customerId: parseInt(formData.customerId),
        projectId: formData.projectId ? parseInt(formData.projectId) : null,
        flatSize: formData.flatSize ? parseFloat(formData.flatSize) : null,
      });
      setSuccess('Visit updated successfully');
      setEditDialog(false);
      resetForm();
      fetchVisits();
      fetchStats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating visit:', error);
      setError('Failed to update visit');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await customerVisitAPI.deleteCustomerVisit(selectedVisit.id);
      setSuccess('Visit deleted successfully');
      setDeleteDialog(false);
      fetchVisits();
      fetchStats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting visit:', error);
      setError('Failed to delete visit');
    }
  };

  // ==================== Render ====================

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'customerName', headerName: 'Customer', flex: 1 },
    { field: 'visitDate', headerName: 'Visit Date', flex: 1 },
    { field: 'visitType', headerName: 'Type', flex: 1 },
    { field: 'status', headerName: 'Status', flex: 1 },
    { field: 'projectName', headerName: 'Project', flex: 1 },
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
        📅 Customer Visits
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
          <Tab label="📋 All Visits" />
          <Tab label="🔍 Filters" />
        </Tabs>
      </Box>

      {/* Tab 1: Dashboard with Statistics */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#c8e6c9' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Confirmed Visits
                </Typography>
                <Typography variant="h5">{stats.totalConfirmed}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#fff9c4' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Completed Visits
                </Typography>
                <Typography variant="h5">{stats.totalCompleted}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#bbdefb' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Scheduled Visits
                </Typography>
                <Typography variant="h5">{stats.totalScheduled}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#f8bbd0' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Visits
                </Typography>
                <Typography variant="h5">
                  {stats.totalConfirmed + stats.totalCompleted + stats.totalScheduled}
                </Typography>
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
            Add New Visit
          </Button>
        </Box>
      </TabPanel>

      {/* Tab 2: All Visits List */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddClick}
          >
            Add New Visit
          </Button>
        </Box>
        <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
          <DataGrid
            rows={visits}
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
            Filter Visits
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
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="Scheduled">Scheduled</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                  <MenuItem value="Rescheduled">Rescheduled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Visit Type</InputLabel>
                <Select
                  name="filterType"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  label="Visit Type"
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="SITE_VISIT">Site Visit</MenuItem>
                  <MenuItem value="VIDEO_TOUR">Video Tour</MenuItem>
                  <MenuItem value="CONSULTATION">Consultation</MenuItem>
                  <MenuItem value="FOLLOW_UP">Follow-up</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Start Date"
                type="datetime-local"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="End Date"
                type="datetime-local"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={fetchVisits}
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
                  setFilterType('');
                  setFilterStartDate('');
                  setFilterEndDate('');
                  fetchVisits();
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
          {openDialog ? 'Add New Visit' : 'Edit Visit'}
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
              label="Visit Date & Time"
              type="datetime-local"
              name="visitDate"
              value={formData.visitDate}
              onChange={handleFormChange}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth>
              <InputLabel>Visit Type</InputLabel>
              <Select
                name="visitType"
                value={formData.visitType}
                onChange={handleFormChange}
                label="Visit Type"
              >
                <MenuItem value="">Select Type</MenuItem>
                <MenuItem value="SITE_VISIT">Site Visit</MenuItem>
                <MenuItem value="VIDEO_TOUR">Video Tour</MenuItem>
                <MenuItem value="CONSULTATION">Consultation</MenuItem>
                <MenuItem value="FOLLOW_UP">Follow-up</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
                label="Status"
              >
                <MenuItem value="Scheduled">Scheduled</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
                <MenuItem value="Rescheduled">Rescheduled</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Project</InputLabel>
              <Select
                name="projectId"
                value={formData.projectId}
                onChange={handleFormChange}
                label="Project"
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
              <InputLabel>Flat Type</InputLabel>
              <Select
                name="flatType"
                value={formData.flatType}
                onChange={handleFormChange}
                label="Flat Type"
              >
                <MenuItem value="">Select Type</MenuItem>
                <MenuItem value="1 BHK">1 BHK</MenuItem>
                <MenuItem value="2 BHK">2 BHK</MenuItem>
                <MenuItem value="3 BHK">3 BHK</MenuItem>
                <MenuItem value="4 BHK">4 BHK</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Flat Size (sq ft)"
              type="number"
              name="flatSize"
              value={formData.flatSize}
              onChange={handleFormChange}
              inputProps={{ step: '0.01' }}
            />
            <FormControl fullWidth>
              <InputLabel>Visit Status</InputLabel>
              <Select
                name="visitStatus"
                value={formData.visitStatus}
                onChange={handleFormChange}
                label="Visit Status"
              >
                <MenuItem value="">Select Status</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
                <MenuItem value="liked">Liked</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
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
            onClick={openDialog ? handleCreateVisit : handleUpdateVisit}
          >
            {openDialog ? 'Create' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Visit Details</DialogTitle>
        <DialogContent>
          {selectedVisit && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Typography><strong>Customer:</strong> {selectedVisit.customerName}</Typography>
              <Typography><strong>Email:</strong> {selectedVisit.customerEmail}</Typography>
              <Typography><strong>Phone:</strong> {selectedVisit.customerPhone}</Typography>
              <Typography><strong>Visit Date:</strong> {selectedVisit.visitDate}</Typography>
              <Typography><strong>Visit Type:</strong> {selectedVisit.visitType}</Typography>
              <Typography><strong>Status:</strong> {selectedVisit.status}</Typography>
              <Typography><strong>Project:</strong> {selectedVisit.projectName}</Typography>
              <Typography><strong>Flat Type:</strong> {selectedVisit.flatType}</Typography>
              <Typography><strong>Flat Size:</strong> {selectedVisit.flatSize} sq ft</Typography>
              <Typography><strong>Visit Status:</strong> {selectedVisit.visitStatus}</Typography>
              <Typography><strong>Notes:</strong> {selectedVisit.notes}</Typography>
              <Typography><strong>Created By:</strong> {selectedVisit.createdBy}</Typography>
              <Typography><strong>Created At:</strong> {selectedVisit.createdAt}</Typography>
              <Typography><strong>Updated At:</strong> {selectedVisit.updatedAt}</Typography>
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
            Are you sure you want to delete this visit? This action cannot be undone.
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

export default CustomerVisits;

