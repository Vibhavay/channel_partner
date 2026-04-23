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
import salesDetailsAPI from '../api/salesDetailsAPI';
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

const SalesDetails = () => {
  // State Management
  const [salesList, setSalesList] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState({
    totalCompleted: 0,
    totalPending: 0,
    totalPartial: 0,
  });

  // Dialog States
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedSales, setSelectedSales] = useState(null);

  // Filter States
  const [filterCustomerId, setFilterCustomerId] = useState('');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('');
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
    agreementDate: '',
    possessionDate: '',
    salesExecutiveId: '',
    notes: '',
  });

  // ==================== useEffect Hooks ====================

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, filterCustomerId, filterPaymentStatus, filterProject]);

  const fetchData = async () => {
    try {
      await Promise.all([
        fetchSales(),
        fetchCustomers(),
        fetchStats(),
      ]);
      setError('');
    } catch (err) {
      setError('Failed to load data');
    }
  };

  const fetchSales = async () => {
    try {
      const response = await salesDetailsAPI.getSalesDetails(page, rowsPerPage);
      setSalesList(response.data.content || response.data);
      setTotalElements(response.data.totalElements || response.data.length);
    } catch (error) {
      console.error('Error fetching sales:', error);
      setError('Failed to load sales');
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
      const response = await salesDetailsAPI.getSalesStatistics();
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
      agreementDate: '',
      possessionDate: '',
      salesExecutiveId: '',
      notes: '',
    });
  };

  const handleAddClick = () => {
    resetForm();
    setOpenDialog(true);
  };

  const handleViewClick = (sales) => {
    setSelectedSales(sales);
    setViewDialog(true);
  };

  const handleEditClick = (sales) => {
    setSelectedSales(sales);
    setFormData({
      customerId: sales.customerId,
      projectName: sales.projectName || '',
      buildingName: sales.buildingName || '',
      flatNo: sales.flatNo || '',
      floorNo: sales.floorNo || '',
      flatType: sales.flatType || '',
      carpetArea: sales.carpetArea || '',
      agreementValue: sales.agreementValue || '',
      bookingAmount: sales.bookingAmount || '',
      agreementDate: sales.agreementDate || '',
      possessionDate: sales.possessionDate || '',
      salesExecutiveId: sales.salesExecutiveId || '',
      notes: sales.notes || '',
    });
    setEditDialog(true);
  };

  const handleDeleteClick = (sales) => {
    setSelectedSales(sales);
    setDeleteDialog(true);
  };

  const handleCreateSales = async () => {
    if (!formData.customerId || !formData.flatNo || !formData.agreementValue) {
      setError('Customer, Flat No, and Agreement Value are required');
      return;
    }

    try {
      await salesDetailsAPI.createSalesDetails({
        ...formData,
        customerId: parseInt(formData.customerId),
        carpetArea: formData.carpetArea ? parseFloat(formData.carpetArea) : null,
        agreementValue: parseFloat(formData.agreementValue),
        bookingAmount: parseFloat(formData.bookingAmount || 0),
        salesExecutiveId: formData.salesExecutiveId ? parseInt(formData.salesExecutiveId) : null,
      });
      setSuccess('Sales record created successfully');
      setOpenDialog(false);
      resetForm();
      fetchSales();
      fetchStats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error creating sales:', error);
      setError('Failed to create sales record');
    }
  };

  const handleUpdateSales = async () => {
    if (!formData.customerId || !formData.flatNo || !formData.agreementValue) {
      setError('Customer, Flat No, and Agreement Value are required');
      return;
    }

    try {
      await salesDetailsAPI.updateSalesDetails(selectedSales.id, {
        ...formData,
        customerId: parseInt(formData.customerId),
        carpetArea: formData.carpetArea ? parseFloat(formData.carpetArea) : null,
        agreementValue: parseFloat(formData.agreementValue),
        bookingAmount: parseFloat(formData.bookingAmount || 0),
        salesExecutiveId: formData.salesExecutiveId ? parseInt(formData.salesExecutiveId) : null,
      });
      setSuccess('Sales record updated successfully');
      setEditDialog(false);
      resetForm();
      fetchSales();
      fetchStats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating sales:', error);
      setError('Failed to update sales record');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await salesDetailsAPI.deleteSalesDetails(selectedSales.id);
      setSuccess('Sales record deleted successfully');
      setDeleteDialog(false);
      fetchSales();
      fetchStats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting sales:', error);
      setError('Failed to delete sales record');
    }
  };

  // ==================== Render ====================

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'customerName', headerName: 'Customer', flex: 1 },
    { field: 'projectName', headerName: 'Project', flex: 1 },
    { field: 'flatNo', headerName: 'Flat No', flex: 1 },
    { field: 'agreementValue', headerName: 'Agreement Value', flex: 1 },
    {
      field: 'paymentStatus',
      headerName: 'Payment Status',
      flex: 1,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'inline-block',
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            backgroundColor:
              params.value === 'Completed'
                ? '#c8e6c9'
                : params.value === 'Partial'
                ? '#fff9c4'
                : '#ffccbc',
            color:
              params.value === 'Completed'
                ? '#2e7d32'
                : params.value === 'Partial'
                ? '#f57f17'
                : '#d84315',
            fontWeight: 'bold',
            fontSize: '0.85rem',
          }}
        >
          {params.value || '-'}
        </Box>
      ),
    },
    { field: 'possessionDate', headerName: 'Possession Date', flex: 1 },
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
        💼 Sales Details (Flat Purchases)
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
          <Tab label="📋 All Sales" />
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
                  Completed Sales
                </Typography>
                <Typography variant="h5">{stats.totalCompleted}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#fff9c4' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Partial Payments
                </Typography>
                <Typography variant="h5">{stats.totalPartial}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#ffccbc' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Pending Payments
                </Typography>
                <Typography variant="h5">{stats.totalPending}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: '#bbdefb' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Sales
                </Typography>
                <Typography variant="h5">
                  {stats.totalCompleted + stats.totalPartial + stats.totalPending}
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
            Add New Sales Record
          </Button>
        </Box>
      </TabPanel>

      {/* Tab 2: All Sales List */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddClick}
          >
            Add New Sales Record
          </Button>
        </Box>
        <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
          <DataGrid
            rows={salesList}
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
            Filter Sales
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
                <InputLabel>Payment Status</InputLabel>
                <Select
                  name="filterPaymentStatus"
                  value={filterPaymentStatus}
                  onChange={(e) => setFilterPaymentStatus(e.target.value)}
                  label="Payment Status"
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Partial">Partial</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
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
                onClick={fetchSales}
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
                  setFilterPaymentStatus('');
                  setFilterProject('');
                  setFilterStartDate('');
                  setFilterEndDate('');
                  fetchSales();
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
          {openDialog ? 'Add New Sales Record' : 'Edit Sales Record'}
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
              label="Booking Amount"
              type="number"
              name="bookingAmount"
              value={formData.bookingAmount}
              onChange={handleFormChange}
              inputProps={{ step: '0.01' }}
            />
            <TextField
              fullWidth
              label="Agreement Date"
              type="date"
              name="agreementDate"
              value={formData.agreementDate}
              onChange={handleFormChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Possession Date"
              type="date"
              name="possessionDate"
              value={formData.possessionDate}
              onChange={handleFormChange}
              InputLabelProps={{ shrink: true }}
            />
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
            onClick={openDialog ? handleCreateSales : handleUpdateSales}
          >
            {openDialog ? 'Create' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Sales Record Details</DialogTitle>
        <DialogContent>
          {selectedSales && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Typography><strong>Customer:</strong> {selectedSales.customerName}</Typography>
              <Typography><strong>Email:</strong> {selectedSales.customerEmail}</Typography>
              <Typography><strong>Phone:</strong> {selectedSales.customerPhone}</Typography>
              <Typography><strong>Project:</strong> {selectedSales.projectName}</Typography>
              <Typography><strong>Building:</strong> {selectedSales.buildingName}</Typography>
              <Typography><strong>Flat No:</strong> {selectedSales.flatNo}</Typography>
              <Typography><strong>Floor No:</strong> {selectedSales.floorNo}</Typography>
              <Typography><strong>Flat Type:</strong> {selectedSales.flatType}</Typography>
              <Typography><strong>Carpet Area:</strong> {selectedSales.carpetArea} sq ft</Typography>
              <Typography><strong>Agreement Value:</strong> ₹ {selectedSales.agreementValue}</Typography>
              <Typography><strong>Booking Amount:</strong> ₹ {selectedSales.bookingAmount}</Typography>
              <Typography><strong>Remaining Amount:</strong> ₹ {selectedSales.remainingAmount}</Typography>
              <Typography><strong>Payment Status:</strong> {selectedSales.paymentStatus}</Typography>
              <Typography><strong>Agreement Date:</strong> {selectedSales.agreementDate}</Typography>
              <Typography><strong>Possession Date:</strong> {selectedSales.possessionDate}</Typography>
              <Typography><strong>Notes:</strong> {selectedSales.notes}</Typography>
              <Typography><strong>Created At:</strong> {selectedSales.createdAt}</Typography>
              <Typography><strong>Updated At:</strong> {selectedSales.updatedAt}</Typography>
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
            Are you sure you want to delete this sales record? This action cannot be undone.
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

export default SalesDetails;

