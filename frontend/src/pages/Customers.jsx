import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Alert, IconButton, DialogContentText, FormControl, InputLabel, Select, MenuItem, Box, Paper } from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import apiClient from '../api/apiClient';

const Customers = () => {
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
  const [visits, setVisits] = useState([]);
  const [visitsOpen, setVisitsOpen] = useState(false);
  const [addVisitOpen, setAddVisitOpen] = useState(false);
  const [editVisitOpen, setEditVisitOpen] = useState(false);
  const [deleteVisitOpen, setDeleteVisitOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [visitForm, setVisitForm] = useState({
    visitDate: '',
    status: 'Completed',
    notes: '',
    projectId: '',
    flatType: '',
    flatSize: '',
    visitStatus: ''
  });
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    budget: '',
    dateOfInquiry: '',
    status: '',
    followUpDate: '',
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
        dateOfInquiry: '',
        status: '',
        followUpDate: '',
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
      dateOfInquiry: customer.dateOfInquiry,
      status: customer.status,
      followUpDate: customer.followUpDate,
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
        dateOfInquiry: '',
        status: '',
        followUpDate: '',
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

  // Visit Management Functions
  const handleViewVisits = async (customer) => {
    setSelectedCustomer(customer);
    try {
      const response = await apiClient.get(`/visits/customer/${customer.id}`);
      setVisits(response.data);
      setVisitsOpen(true);
    } catch (error) {
      console.error('Error fetching visits:', error);
      setError('Failed to load visits');
    }
  };

  const handleAddVisit = () => {
    setVisitForm({
      visitDate: '',
      status: 'Completed',
      notes: '',
      projectId: '',
      flatType: '',
      flatSize: '',
      visitStatus: ''
    });
    setAddVisitOpen(true);
  };

  const handleVisitInputChange = (e) => {
    const { name, value } = e.target;
    setVisitForm({ ...visitForm, [name]: value });
  };

  const handleSubmitVisit = async () => {
    try {
      await apiClient.post('/visits', {
        ...visitForm,
        customerId: selectedCustomer.id,
        projectId: visitForm.projectId ? parseInt(visitForm.projectId) : null,
        flatSize: visitForm.flatSize ? parseFloat(visitForm.flatSize) : null
      });
      setAddVisitOpen(false);
      setVisitForm({
        visitDate: '',
        status: 'Completed',
        notes: '',
        projectId: '',
        flatType: '',
        flatSize: '',
        visitStatus: ''
      });
      handleViewVisits(selectedCustomer);
    } catch (error) {
      console.error('Error creating visit:', error);
      setError('Failed to create visit');
    }
  };

  const handleEditVisit = (visit) => {
    setSelectedVisit(visit);
    setVisitForm({
      visitDate: visit.visitDate,
      status: visit.status,
      notes: visit.notes,
      projectId: visit.projectId || '',
      flatType: visit.flatType || '',
      flatSize: visit.flatSize || '',
      visitStatus: visit.visitStatus || ''
    });
    setEditVisitOpen(true);
  };

  const handleUpdateVisit = async () => {
    try {
      await apiClient.put(`/visits/${selectedVisit.id}`, {
        ...visitForm,
        customerId: selectedCustomer.id,
        projectId: visitForm.projectId ? parseInt(visitForm.projectId) : null,
        flatSize: visitForm.flatSize ? parseFloat(visitForm.flatSize) : null
      });
      setEditVisitOpen(false);
      handleViewVisits(selectedCustomer);
    } catch (error) {
      console.error('Error updating visit:', error);
      setError('Failed to update visit');
    }
  };

  const handleDeleteVisit = (visit) => {
    setSelectedVisit(visit);
    setDeleteVisitOpen(true);
  };

  const confirmDeleteVisit = async () => {
    try {
      await apiClient.delete(`/visits/${selectedVisit.id}`);
      setDeleteVisitOpen(false);
      handleViewVisits(selectedCustomer);
    } catch (error) {
      console.error('Error deleting visit:', error);
      setError('Failed to delete visit');
    }
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
            { field: 'dateOfInquiry', headerName: 'Date of Inquiry', flex: 1 },
            { field: 'followUpDate', headerName: 'Follow Up Date', flex: 1 },
            {
              field: 'actions',
              headerName: 'Actions',
              flex: 1,
              renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    color="info"
                    size="small"
                    onClick={() => handleViewVisits(params.row)}
                    title="View Visits"
                  >
                    <Visibility />
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

      {/* Add Dialog */}
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
          <TextField
            margin="dense"
            name="dateOfInquiry"
            label="Date of Inquiry"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={form.dateOfInquiry}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="followUpDate"
            label="Follow Up Date"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={form.followUpDate}
            onChange={handleInputChange}
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

      {/* Edit Dialog */}
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
          <TextField
            margin="dense"
            name="dateOfInquiry"
            label="Date of Inquiry"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={form.dateOfInquiry}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="followUpDate"
            label="Follow Up Date"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={form.followUpDate}
            onChange={handleInputChange}
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

      {/* Delete Confirmation Dialog */}
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

      {/* Site Visits Dialog */}
      <Dialog open={visitsOpen} onClose={() => setVisitsOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          Site Visits - {selectedCustomer?.firstName} {selectedCustomer?.lastName}
        </DialogTitle>
        <DialogContent>
          <Button
            variant="contained"
            onClick={handleAddVisit}
            sx={{ mb: 2, mt: 1 }}
          >
            Add Visit
          </Button>
          {visits.length === 0 ? (
            <Typography color="textSecondary" sx={{ mt: 2 }}>
              No site visits recorded yet.
            </Typography>
          ) : (
            <Paper sx={{ mt: 2, borderRadius: 2, boxShadow: 3 }}>
              <DataGrid
                rows={visits}
                columns={[
                  { field: 'id', headerName: 'ID', width: 70 },
                  { field: 'projectName', headerName: 'Project', flex: 1 },
                  { field: 'flatType', headerName: 'Flat Type', flex: 1 },
                  { field: 'flatSize', headerName: 'Flat Size (sq ft)', flex: 1 },
                  {
                    field: 'visitStatus',
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
                            params.value === 'confirmed'
                              ? '#c8e6c9'
                              : params.value === 'liked'
                              ? '#fff9c4'
                              : '#ffccbc',
                          color:
                            params.value === 'confirmed'
                              ? '#2e7d32'
                              : params.value === 'liked'
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
                  { field: 'visitDate', headerName: 'Visit Date', flex: 1 },
                  {
                    field: 'actions',
                    headerName: 'Actions',
                    flex: 1,
                    renderCell: (params) => (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton onClick={() => handleEditVisit(params.row)} color="primary" size="small">
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleDeleteVisit(params.row)} color="error" size="small">
                          <Delete />
                        </IconButton>
                      </Box>
                    ),
                  },
                ]}
                autoHeight
                components={{ Toolbar: GridToolbar }}
                sx={{ borderRadius: 2 }}
              />
            </Paper>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVisitsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Add Visit Dialog */}
      <Dialog open={addVisitOpen} onClose={() => setAddVisitOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Site Visit</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="visitDate"
            label="Visit Date"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={visitForm.visitDate}
            onChange={handleVisitInputChange}
            required
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Project</InputLabel>
            <Select
              name="projectId"
              value={visitForm.projectId}
              onChange={handleVisitInputChange}
              label="Project"
            >
              {projects.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Flat Type</InputLabel>
            <Select
              name="flatType"
              value={visitForm.flatType}
              onChange={handleVisitInputChange}
              label="Flat Type"
            >
              <MenuItem value="1 BHK">1 BHK</MenuItem>
              <MenuItem value="2 BHK">2 BHK</MenuItem>
              <MenuItem value="3 BHK">3 BHK</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="flatSize"
            label="Flat Size (Square Feet)"
            type="number"
            fullWidth
            variant="outlined"
            value={visitForm.flatSize}
            onChange={handleVisitInputChange}
            inputProps={{ step: '0.01' }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              name="visitStatus"
              value={visitForm.visitStatus}
              onChange={handleVisitInputChange}
              label="Status"
            >
              <MenuItem value="rejected">Rejected</MenuItem>
              <MenuItem value="liked">Liked</MenuItem>
              <MenuItem value="confirmed">Confirmed</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="notes"
            label="Notes"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={visitForm.notes}
            onChange={handleVisitInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddVisitOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmitVisit} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Visit Dialog */}
      <Dialog open={editVisitOpen} onClose={() => setEditVisitOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Site Visit</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="visitDate"
            label="Visit Date"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={visitForm.visitDate}
            onChange={handleVisitInputChange}
            required
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Project</InputLabel>
            <Select
              name="projectId"
              value={visitForm.projectId}
              onChange={handleVisitInputChange}
              label="Project"
            >
              {projects.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Flat Type</InputLabel>
            <Select
              name="flatType"
              value={visitForm.flatType}
              onChange={handleVisitInputChange}
              label="Flat Type"
            >
              <MenuItem value="1 BHK">1 BHK</MenuItem>
              <MenuItem value="2 BHK">2 BHK</MenuItem>
              <MenuItem value="3 BHK">3 BHK</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="flatSize"
            label="Flat Size (Square Feet)"
            type="number"
            fullWidth
            variant="outlined"
            value={visitForm.flatSize}
            onChange={handleVisitInputChange}
            inputProps={{ step: '0.01' }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              name="visitStatus"
              value={visitForm.visitStatus}
              onChange={handleVisitInputChange}
              label="Status"
            >
              <MenuItem value="rejected">Rejected</MenuItem>
              <MenuItem value="liked">Liked</MenuItem>
              <MenuItem value="confirmed">Confirmed</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="notes"
            label="Notes"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={visitForm.notes}
            onChange={handleVisitInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditVisitOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateVisit} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Visit Confirmation Dialog */}
      <Dialog open={deleteVisitOpen} onClose={() => setDeleteVisitOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this site visit record? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteVisitOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteVisit} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Customers;
