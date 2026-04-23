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
import { Edit, Delete, Visibility, Add, LocationCity } from '@mui/icons-material';
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

const Projects = () => {
  // State Management
  const [projects, setProjects] = useState([]);
  const [builders, setBuilders] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState({
    totalProjects: 0,
  });

  // Dialog States
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Filter States
  const [filterBuilderId, setFilterBuilderId] = useState('');
  const [filterLocation, setFilterLocation] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    minPrice: '',
    maxPrice: '',
    builderId: '',
  });

  // ==================== useEffect Hooks ====================

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, filterBuilderId, filterLocation]);

  const fetchData = async () => {
    try {
      await Promise.all([
        fetchProjects(),
        fetchBuilders(),
        fetchStats(),
      ]);
      setError('');
    } catch (err) {
      setError('Failed to load data');
    }
  };

  const fetchProjects = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: rowsPerPage.toString(),
      });

      if (filterBuilderId) params.append('builderId', filterBuilderId);
      if (filterLocation) params.append('location', filterLocation);

      const response = await apiClient.get(`/projects?${params}`);
      setProjects(response.data.content || response.data);
      setTotalElements(response.data.totalElements || response.data.length);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to load projects');
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

  const fetchStats = async () => {
    try {
      const response = await apiClient.get('/projects', {
        params: { page: 0, size: 1000 },
      });
      setStats({
        totalProjects: response.data.totalElements || response.data.length,
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
      name: '',
      location: '',
      description: '',
      minPrice: '',
      maxPrice: '',
      builderId: '',
    });
  };

  const handleAddClick = () => {
    resetForm();
    setOpenDialog(true);
  };

  const handleViewClick = (project) => {
    setSelectedProject(project);
    setViewDialog(true);
  };

  const handleEditClick = (project) => {
    setSelectedProject(project);
    setFormData({
      name: project.name || '',
      location: project.location || '',
      description: project.description || '',
      minPrice: project.minPrice || '',
      maxPrice: project.maxPrice || '',
      builderId: project.builderId || '',
    });
    setEditDialog(true);
  };

  const handleDeleteClick = (project) => {
    setSelectedProject(project);
    setDeleteDialog(true);
  };

  const handleCreateProject = async () => {
    if (!formData.name || !formData.builderId) {
      setError('Project Name and Builder are required');
      return;
    }

    try {
      await apiClient.post('/projects', {
        ...formData,
        builderId: parseInt(formData.builderId),
        minPrice: formData.minPrice ? parseFloat(formData.minPrice) : null,
        maxPrice: formData.maxPrice ? parseFloat(formData.maxPrice) : null,
      });
      setSuccess('Project created successfully');
      setOpenDialog(false);
      resetForm();
      fetchProjects();
      fetchStats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error creating project:', error);
      setError('Failed to create project');
    }
  };

  const handleUpdateProject = async () => {
    if (!formData.name || !formData.builderId) {
      setError('Project Name and Builder are required');
      return;
    }

    try {
      await apiClient.put(`/projects/${selectedProject.id}`, {
        ...formData,
        builderId: parseInt(formData.builderId),
        minPrice: formData.minPrice ? parseFloat(formData.minPrice) : null,
        maxPrice: formData.maxPrice ? parseFloat(formData.maxPrice) : null,
      });
      setSuccess('Project updated successfully');
      setEditDialog(false);
      resetForm();
      fetchProjects();
      fetchStats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating project:', error);
      setError('Failed to update project');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await apiClient.delete(`/projects/${selectedProject.id}`);
      setSuccess('Project deleted successfully');
      setDeleteDialog(false);
      fetchProjects();
      fetchStats();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting project:', error);
      setError('Failed to delete project');
    }
  };

  // ==================== Render ====================

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Project Name', flex: 1 },
    { field: 'location', headerName: 'Location', flex: 1 },
    {
      field: 'builderName',
      headerName: 'Builder',
      flex: 1,
      valueGetter: (params) => params.row.builder?.firstName + ' ' + params.row.builder?.lastName || ''
    },
    {
      field: 'minPrice',
      headerName: 'Min Price',
      flex: 1,
      renderCell: (params) => `₹${params.value?.toLocaleString() || 0}`
    },
    {
      field: 'maxPrice',
      headerName: 'Max Price',
      flex: 1,
      renderCell: (params) => `₹${params.value?.toLocaleString() || 0}`
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
        🏗️ Projects Management
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
          <Tab label="📋 All Projects" />
          <Tab label="🔍 Filters" />
        </Tabs>
      </Box>

      {/* Tab 1: Dashboard with Statistics */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ backgroundColor: '#e8f5e8' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Projects
                </Typography>
                <Typography variant="h5">{stats.totalProjects}</Typography>
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
            Add New Project
          </Button>
        </Box>
      </TabPanel>

      {/* Tab 2: All Projects List */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddClick}
          >
            Add New Project
          </Button>
        </Box>
        <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
          <DataGrid
            rows={projects}
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
            Filter Projects
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Builder</InputLabel>
                <Select
                  name="filterBuilderId"
                  value={filterBuilderId}
                  onChange={(e) => setFilterBuilderId(e.target.value)}
                  label="Builder"
                >
                  <MenuItem value="">All Builders</MenuItem>
                  {builders.map((builder) => (
                    <MenuItem key={builder.id} value={builder.id}>
                      {builder.firstName} {builder.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Location"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                onClick={fetchProjects}
              >
                Apply Filters
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setFilterBuilderId('');
                  setFilterLocation('');
                  fetchProjects();
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
          {openDialog ? 'Add New Project' : 'Edit Project'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              fullWidth
              required
              label="Project Name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
            />
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleFormChange}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Minimum Price"
                  type="number"
                  name="minPrice"
                  value={formData.minPrice}
                  onChange={handleFormChange}
                  inputProps={{ step: '0.01' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Maximum Price"
                  type="number"
                  name="maxPrice"
                  value={formData.maxPrice}
                  onChange={handleFormChange}
                  inputProps={{ step: '0.01' }}
                />
              </Grid>
            </Grid>
            <FormControl fullWidth required>
              <InputLabel>Builder</InputLabel>
              <Select
                name="builderId"
                value={formData.builderId}
                onChange={handleFormChange}
                label="Builder"
              >
                {builders.map((builder) => (
                  <MenuItem key={builder.id} value={builder.id}>
                    {builder.firstName} {builder.lastName}
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
            onClick={openDialog ? handleCreateProject : handleUpdateProject}
          >
            {openDialog ? 'Create' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Project Details</DialogTitle>
        <DialogContent>
          {selectedProject && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Typography><strong>Project Name:</strong> {selectedProject.name}</Typography>
              <Typography><strong>Location:</strong> {selectedProject.location}</Typography>
              <Typography><strong>Description:</strong> {selectedProject.description}</Typography>
              <Typography><strong>Min Price:</strong> ₹{selectedProject.minPrice?.toLocaleString()}</Typography>
              <Typography><strong>Max Price:</strong> ₹{selectedProject.maxPrice?.toLocaleString()}</Typography>
              <Typography><strong>Builder:</strong> {selectedProject.builder?.firstName} {selectedProject.builder?.lastName}</Typography>
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
            Are you sure you want to delete this project? This action cannot be undone.
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

export default Projects;
