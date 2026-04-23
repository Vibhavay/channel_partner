import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Alert, IconButton, DialogContentText, FormControl, InputLabel, Select, MenuItem, Box, Paper } from '@mui/material';
import { Edit, Delete, History } from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
const Customers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    budget: '',
    status: '',
    projectId: ''
  });
  useEffect(() => {
    fetchCustomers();
    fetchProjects();
  }, [page, rowsPerPage]);
  const fetchCustomers = async () => {
    try {
      const response = await apiClient.get('/customers', {
        params: { page, size: rowsPerPage }
      });
      setCustomers(response.data.content);
      setTotalElements(response.data.totalElements);
      setError('');
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('Failed to load customers');
    }
  };
  const fetchProjects = async () => {
    try {
      const response = await apiClient.get('/projects', {
        params: { page: 0, size: 100 }
      });
      setProjects(response.data.content);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  const handleSubmit = async () => {
    try {
      await apiClient.post('/customers', form);
      setOpen(false);
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        budget: '',
        status: '',
        projectId: ''
      });
      fetchCustomers();
    } catch (error) {
      console.error('Error creating customer:', error);
      setError('Failed to create customer');
    }
  };
  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setForm({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      state: customer.state,
      budget: customer.budget,
      status: customer.status,
      projectId: customer.projectId
    });
    setEditOpen(true);
  };
  const handleUpdate = async () => {
    try {
      await apiClient.put(`/customers/${selectedCustomer.id}`, form);
      setEditOpen(false);
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        budget: '',
        status: '',
        projectId: ''
      });
      setSelectedCustomer(null);
      fetchCustomers();
    } catch (error) {
      console.error('Error updating customer:', error);
      setError('Failed to update customer');
    }
  };
  const handleDelete = (customer) => {
    setSelectedCustomer(customer);
    setDeleteOpen(true);
  };
  const confirmDelete = async () => {
    try {
      await apiClient.delete(`/customers/${selectedCustomer.id}`);
      setDeleteOpen(false);
      setSelectedCustomer(null);
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
      setError('Failed to delete customer');
    }
  };
  const handleViewVisitHistory = (customer) => {
    navigate('/customer-visits', { state: { customerId: customer.id, customerName: `${customer.firstName} ${customer.lastName}` } });
  };
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Customers
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        Add Customer
      </Button>
      <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
        <DataGrid
          rows={customers}
          columns={[
            { field: 'firstName', headerName: 'First Name', flex: 1 },
            { field: 'lastName', headerName: 'Last Name', flex: 1 },
            { field: 'email', headerName: 'Email', flex: 1 },
            { field: 'phone', headerName: 'Phone', flex: 1 },
            { field: 'status', headerName: 'Status', flex: 1 },
            {
              field: 'actions',
              headerName: 'Actions',
              flex: 1,
              renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    color="info"
                    size="small"
                    onClick={() => handleViewVisitHistory(params.row)}
                    title="View Visit History"
                  >
                    <History />
                  </IconButton>
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => handleEdit(params.row)}
                    title="Edit"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleDelete(params.row)}
                    title="Delete"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              ),
            },
          ]}
          paginationMode="server"
          rowCount={totalElements}
          page={page}
          pageSize={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          components={{ Toolbar: GridToolbar }}
          sx={{ borderRadius: 2, boxShadow: 3 }}
        />
      </Paper>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Customer</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="firstName"
            label="First Name"
            fullWidth
            variant="outlined"
            value={form.firstName}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="dense"
            name="lastName"
            label="Last Name"
            fullWidth
            variant="outlined"
            value={form.lastName}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={form.email}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="phone"
            label="Phone"
            type="text"
            fullWidth
            variant="outlined"
            value={form.phone}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="address"
            label="Address"
            type="text"
            fullWidth
            variant="outlined"
            value={form.address}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="city"
            label="City"
            type="text"
            fullWidth
            variant="outlined"
            value={form.city}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="state"
            label="State"
            type="text"
            fullWidth
            variant="outlined"
            value={form.state}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="budget"
            label="Budget"
            type="number"
            fullWidth
            variant="outlined"
            value={form.budget}
            onChange={handleInputChange}
            inputProps={{ step: '0.01' }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={form.status}
              onChange={handleInputChange}
              label="Status"
            >
              <MenuItem value="Interested">Interested</MenuItem>
              <MenuItem value="Visited">Visited</MenuItem>
              <MenuItem value="Booked">Booked</MenuItem>
              <MenuItem value="Not Interested">Not Interested</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Project</InputLabel>
            <Select
              name="projectId"
              value={form.projectId}
              onChange={handleInputChange}
              label="Project"
            >
              {projects.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Customer</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="firstName"
            label="First Name"
            fullWidth
            variant="outlined"
            value={form.firstName}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="dense"
            name="lastName"
            label="Last Name"
            fullWidth
            variant="outlined"
            value={form.lastName}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={form.email}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="phone"
            label="Phone"
            type="text"
            fullWidth
            variant="outlined"
            value={form.phone}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="address"
            label="Address"
            type="text"
            fullWidth
            variant="outlined"
            value={form.address}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="city"
            label="City"
            type="text"
            fullWidth
            variant="outlined"
            value={form.city}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="state"
            label="State"
            type="text"
            fullWidth
            variant="outlined"
            value={form.state}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="budget"
            label="Budget"
            type="number"
            fullWidth
            variant="outlined"
            value={form.budget}
            onChange={handleInputChange}
            inputProps={{ step: '0.01' }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={form.status}
              onChange={handleInputChange}
              label="Status"
            >
              <MenuItem value="Interested">Interested</MenuItem>
              <MenuItem value="Visited">Visited</MenuItem>
              <MenuItem value="Booked">Booked</MenuItem>
              <MenuItem value="Not Interested">Not Interested</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Project</InputLabel>
            <Select
              name="projectId"
              value={form.projectId}
              onChange={handleInputChange}
              label="Project"
            >
              {projects.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the customer "{selectedCustomer?.firstName} {selectedCustomer?.lastName}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
export default Customers;
