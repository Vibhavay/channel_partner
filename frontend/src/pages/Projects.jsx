import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Alert, TablePagination, IconButton, DialogContentText, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import apiClient from '../api/apiClient';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [builders, setBuilders] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    location: '',
    description: '',
    minPrice: '',
    maxPrice: '',
    builderId: ''
  });

  useEffect(() => {
    fetchProjects();
    fetchBuilders();
  }, [page, rowsPerPage]);

  const fetchProjects = async () => {
    try {
      const response = await apiClient.get('/projects', {
        params: { page, size: rowsPerPage }
      });
      setProjects(response.data.content);
      setTotalElements(response.data.totalElements);
      setError('');
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to load projects');
    }
  };

  const fetchBuilders = async () => {
    try {
      const response = await apiClient.get('/builders', {
        params: { page: 0, size: 100 }
      });
      setBuilders(response.data.content);
    } catch (error) {
      console.error('Error fetching builders:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await apiClient.post('/projects', form);
      setOpen(false);
      setForm({
        name: '',
        location: '',
        description: '',
        minPrice: '',
        maxPrice: '',
        builderId: ''
      });
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
      setError('Failed to create project');
    }
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setForm({
      name: project.name,
      location: project.location,
      description: project.description,
      minPrice: project.minPrice,
      maxPrice: project.maxPrice,
      builderId: project.builderId
    });
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await apiClient.put(`/projects/${selectedProject.id}`, form);
      setEditOpen(false);
      setForm({
        name: '',
        location: '',
        description: '',
        minPrice: '',
        maxPrice: '',
        builderId: ''
      });
      setSelectedProject(null);
      fetchProjects();
    } catch (error) {
      console.error('Error updating project:', error);
      setError('Failed to update project');
    }
  };

  const handleDelete = (project) => {
    setSelectedProject(project);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await apiClient.delete(`/projects/${selectedProject.id}`);
      setDeleteOpen(false);
      setSelectedProject(null);
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      setError('Failed to delete project');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Projects
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        Add Project
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Min Price</TableCell>
              <TableCell>Max Price</TableCell>
              <TableCell>Builder</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project, index) => (
              <TableRow
                key={project.id}
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
                <TableCell>{project.id}</TableCell>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.location}</TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>₹{(project.minPrice || 0).toLocaleString()}</TableCell>
                <TableCell>₹{(project.maxPrice || 0).toLocaleString()}</TableCell>
                <TableCell>{project.builder?.firstName} {project.builder?.lastName}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(project)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(project)} color="error">
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
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Project</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Project Name"
            fullWidth
            variant="outlined"
            value={form.name}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="dense"
            name="location"
            label="Location"
            fullWidth
            variant="outlined"
            value={form.location}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={form.description}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="minPrice"
            label="Min Price"
            type="number"
            fullWidth
            variant="outlined"
            value={form.minPrice}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="maxPrice"
            label="Max Price"
            type="number"
            fullWidth
            variant="outlined"
            value={form.maxPrice}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Builder</InputLabel>
            <Select
              name="builderId"
              value={form.builderId}
              onChange={handleInputChange}
              label="Builder"
            >
              {builders.map((builder) => (
                <MenuItem key={builder.id} value={builder.id}>
                  {builder.firstName} {builder.lastName}
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
        <DialogTitle>Edit Project</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Project Name"
            fullWidth
            variant="outlined"
            value={form.name}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="dense"
            name="location"
            label="Location"
            fullWidth
            variant="outlined"
            value={form.location}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={form.description}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="minPrice"
            label="Min Price"
            type="number"
            fullWidth
            variant="outlined"
            value={form.minPrice}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="maxPrice"
            label="Max Price"
            type="number"
            fullWidth
            variant="outlined"
            value={form.maxPrice}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Builder</InputLabel>
            <Select
              name="builderId"
              value={form.builderId}
              onChange={handleInputChange}
              label="Builder"
            >
              {builders.map((builder) => (
                <MenuItem key={builder.id} value={builder.id}>
                  {builder.firstName} {builder.lastName}
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
            Are you sure you want to delete the project "{selectedProject?.name}"? This action cannot be undone.
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

export default Projects;
