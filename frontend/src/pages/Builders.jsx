import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Alert, TablePagination, IconButton, DialogContentText } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import apiClient from '../api/apiClient';

const Builders = () => {
  const [builders, setBuilders] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedBuilder, setSelectedBuilder] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', contactNumber: '', address: '', city: '', state: '', office: '', pin: '', gstNo: '' });

  useEffect(() => {
    fetchBuilders();
  }, [page, rowsPerPage]);

  const fetchBuilders = async () => {
    try {
      const response = await apiClient.get('/builders', {
        params: { page, size: rowsPerPage }
      });
      setBuilders(response.data.content);
      setTotalElements(response.data.totalElements);
      setError('');
    } catch (error) {
      console.error('Error fetching builders:', error);
      setError('Failed to load builders');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSubmit = async () => {
    try {
      await apiClient.post('/builders', form);
      setOpen(false);
      setForm({ firstName: '', lastName: '', email: '', contactNumber: '', address: '', city: '', state: '', office: '', pin: '', gstNo: '' });
      fetchBuilders();
    } catch (error) {
      console.error('Error creating builder:', error);
      setError('Failed to create builder');
    }
  };

  const handleEdit = (builder) => {
    setSelectedBuilder(builder);
    setForm({
      firstName: builder.firstName,
      lastName: builder.lastName,
      email: builder.email,
      contactNumber: builder.contactNumber,
      address: builder.address,
      city: builder.city,
      state: builder.state,
      office: builder.office,
      pin: builder.pin,
      gstNo: builder.gstNo
    });
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await apiClient.put(`/builders/${selectedBuilder.id}`, form);
      setEditOpen(false);
      setForm({ firstName: '', lastName: '', email: '', contactNumber: '', address: '', city: '', state: '', office: '', pin: '', gstNo: '' });
      setSelectedBuilder(null);
      fetchBuilders();
    } catch (error) {
      console.error('Error updating builder:', error);
      setError('Failed to update builder');
    }
  };

  const handleDelete = (builder) => {
    setSelectedBuilder(builder);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await apiClient.delete(`/builders/${selectedBuilder.id}`);
      setDeleteOpen(false);
      setSelectedBuilder(null);
      fetchBuilders();
    } catch (error) {
      console.error('Error deleting builder:', error);
      setError('Failed to delete builder');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Builders
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        Add Builder
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Contact Number</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>City</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Office</TableCell>
              <TableCell>Pin</TableCell>
              <TableCell>GST No</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {builders.map((builder, index) => (
              <TableRow
                key={builder.id}
                sx={{
                  '&:nth-of-type(odd)': {
                    backgroundColor: '#f9f9f9',
                  },
                  '&:hover': {
                    backgroundColor: '#e3f2fd',
                    transition: 'background-color 0.3s ease',
                  },
                }}
              >
                <TableCell>{builder.id}</TableCell>
                <TableCell>{builder.firstName}</TableCell>
                <TableCell>{builder.lastName}</TableCell>
                <TableCell>{builder.email}</TableCell>
                <TableCell>{builder.contactNumber}</TableCell>
                <TableCell>{builder.address}</TableCell>
                <TableCell>{builder.city}</TableCell>
                <TableCell>{builder.state}</TableCell>
                <TableCell>{builder.office}</TableCell>
                <TableCell>{builder.pin}</TableCell>
                <TableCell>{builder.gstNo}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(builder)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(builder)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalElements}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Add Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Builder</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="First Name"
            fullWidth
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Last Name"
            fullWidth
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Contact Number"
            fullWidth
            value={form.contactNumber}
            onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Address"
            fullWidth
            multiline
            rows={2}
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <TextField
            margin="dense"
            label="City"
            fullWidth
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
          <TextField
            margin="dense"
            label="State"
            fullWidth
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Office"
            fullWidth
            value={form.office}
            onChange={(e) => setForm({ ...form, office: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Pin"
            fullWidth
            value={form.pin}
            onChange={(e) => setForm({ ...form, pin: e.target.value })}
          />
          <TextField
            margin="dense"
            label="GST No"
            fullWidth
            value={form.gstNo}
            onChange={(e) => setForm({ ...form, gstNo: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Builder</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="First Name"
            fullWidth
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Last Name"
            fullWidth
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Contact Number"
            fullWidth
            value={form.contactNumber}
            onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Address"
            fullWidth
            multiline
            rows={2}
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <TextField
            margin="dense"
            label="City"
            fullWidth
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
          <TextField
            margin="dense"
            label="State"
            fullWidth
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Office"
            fullWidth
            value={form.office}
            onChange={(e) => setForm({ ...form, office: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Pin"
            fullWidth
            value={form.pin}
            onChange={(e) => setForm({ ...form, pin: e.target.value })}
          />
          <TextField
            margin="dense"
            label="GST No"
            fullWidth
            value={form.gstNo}
            onChange={(e) => setForm({ ...form, gstNo: e.target.value })}
          />
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
            Are you sure you want to delete the builder "{selectedBuilder?.firstName} {selectedBuilder?.lastName}"? This action cannot be undone.
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

export default Builders;
