import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Alert,
  IconButton,
  DialogContentText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Paper,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  Tab,
  Tabs,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { Edit, Delete, Phone, CallReceived, CallMade, ExpandMore } from '@mui/icons-material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import apiClient from '../api/apiClient';

const CallManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [callLogs, setCallLogs] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [callHistoryOpen, setCallHistoryOpen] = useState(false);
  const [addCallOpen, setAddCallOpen] = useState(false);
  const [editCallOpen, setEditCallOpen] = useState(false);
  const [deleteCallOpen, setDeleteCallOpen] = useState(false);
  const [selectedCall, setSelectedCall] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState('');
  const [lastCall, setLastCall] = useState(null);
  const [callStats, setCallStats] = useState({
    totalCalls: 0,
    incomingCalls: 0,
    outgoingCalls: 0,
    followUpRequired: 0,
  });

  const [form, setForm] = useState({
    customerId: '',
    callDateTime: new Date().toISOString().slice(0, 16),
    callType: 'Outgoing',
    callStatus: 'Connected',
    callNotes: '',
    createdBy: 'Admin', // Should be from logged-in user
  });

  const [filterForm, setFilterForm] = useState({
    callStatus: '',
    callType: '',
    dateRange: 'today',
  });

  useEffect(() => {
    fetchCustomers();
    fetchCallStats();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await apiClient.get('/customers', { params: { page: 0, size: 100 } });
      setCustomers(response.data.content);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('Failed to load customers');
    }
  };

  const fetchCallStats = async () => {
    try {
      const incomingCount = await apiClient.get('/calls/stats/today/incoming');
      const outgoingCount = await apiClient.get('/calls/stats/today/outgoing');
      const followUpCalls = await apiClient.get('/calls/followups/today');

      setCallStats({
        incomingCalls: incomingCount.data,
        outgoingCalls: outgoingCount.data,
        totalCalls: incomingCount.data + outgoingCount.data,
        followUpRequired: followUpCalls.data.length,
      });
    } catch (error) {
      console.error('Error fetching call stats:', error);
    }
  };

  const handleViewCallHistory = async (customer) => {
    setSelectedCustomer(customer);
    try {
      const response = await apiClient.get(`/calls/history/${customer.id}`);
      setCallLogs(response.data);

      const lastCallResponse = await apiClient.get(`/calls/last/${customer.id}`);
      setLastCall(lastCallResponse.data);

      setCallHistoryOpen(true);
    } catch (error) {
      console.error('Error fetching call history:', error);
      setError('Failed to load call history');
    }
  };

  const handleAddCall = () => {
    setForm({
      customerId: selectedCustomer?.id || '',
      callDateTime: new Date().toISOString().slice(0, 16),
      callType: 'Outgoing',
      callStatus: 'Connected',
      callNotes: '',
      createdBy: 'Admin',
    });
    setAddCallOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmitCall = async () => {
    try {
      await apiClient.post('/calls', {
        ...form,
        customerId: parseInt(form.customerId),
        callDateTime: new Date(form.callDateTime),
      });
      setAddCallOpen(false);
      setForm({
        customerId: selectedCustomer?.id || '',
        callDateTime: new Date().toISOString().slice(0, 16),
        callType: 'Outgoing',
        callStatus: 'Connected',
        callNotes: '',
        createdBy: 'Admin',
      });
      if (selectedCustomer) {
        handleViewCallHistory(selectedCustomer);
      } else {
        fetchCallStats();
      }
    } catch (error) {
      console.error('Error creating call:', error);
      setError('Failed to create call log');
    }
  };

  const handleEditCall = (call) => {
    setSelectedCall(call);
    setForm({
      customerId: call.customerId,
      callDateTime: new Date(call.callDateTime).toISOString().slice(0, 16),
      callType: call.callType,
      callStatus: call.callStatus,
      callNotes: call.callNotes,
      createdBy: call.createdBy,
    });
    setEditCallOpen(true);
  };

  const handleUpdateCall = async () => {
    try {
      await apiClient.put(`/calls/${selectedCall.id}`, {
        ...form,
        customerId: parseInt(form.customerId),
        callDateTime: new Date(form.callDateTime),
      });
      setEditCallOpen(false);
      if (selectedCustomer) {
        handleViewCallHistory(selectedCustomer);
      } else {
        fetchCallStats();
      }
    } catch (error) {
      console.error('Error updating call:', error);
      setError('Failed to update call log');
    }
  };

  const handleDeleteCall = (call) => {
    setSelectedCall(call);
    setDeleteCallOpen(true);
  };

  const confirmDeleteCall = async () => {
    try {
      await apiClient.delete(`/calls/${selectedCall.id}`);
      setDeleteCallOpen(false);
      if (selectedCustomer) {
        handleViewCallHistory(selectedCustomer);
      }
    } catch (error) {
      console.error('Error deleting call:', error);
      setError('Failed to delete call');
    }
  };

  const getCallStatusColor = (status) => {
    switch (status) {
      case 'Connected':
        return '#c8e6c9';
      case 'Not Answered':
        return '#ffccbc';
      case 'Follow-up Required':
        return '#fff9c4';
      case 'Busy':
        return '#f8bbd0';
      default:
        return '#eeeeee';
    }
  };

  const getCallTypeIcon = (type) => {
    return type === 'Incoming' ? <CallReceived color="success" /> : <CallMade color="primary" />;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        📞 Customer Call Management
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Statistics Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Calls Today
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                {callStats.totalCalls}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Incoming Calls
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#388e3c' }}>
                {callStats.incomingCalls}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Outgoing Calls
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                {callStats.outgoingCalls}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Follow-ups Required
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#f57c00' }}>
                {callStats.followUpRequired}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Customer Call History" icon={<Phone />} iconPosition="start" />
          <Tab label="Add New Call" icon={<Phone />} iconPosition="start" />
          <Tab label="Call Analytics" />
        </Tabs>
      </Box>

      {/* Tab 1: Customer Call History */}
      {tabValue === 0 && (
        <Box>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Select Customer to View Call History
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 2 }}>
              {customers.map((customer) => (
                <Card
                  key={customer.id}
                  onClick={() => handleViewCallHistory(customer)}
                  sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.05)', boxShadow: 5 },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6">{customer.firstName} {customer.lastName}</Typography>
                    <Typography color="textSecondary" variant="body2">
                      {customer.email}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      {customer.phone}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Paper>
        </Box>
      )}

      {/* Tab 2: Add New Call */}
      {tabValue === 1 && (
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h6" gutterBottom>
            Quick Add Call Log
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Select Customer</InputLabel>
              <Select
                name="customerId"
                value={form.customerId}
                onChange={handleInputChange}
                label="Select Customer"
              >
                {customers.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.firstName} {customer.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              name="callDateTime"
              label="Call Date & Time"
              type="datetime-local"
              value={form.callDateTime}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Call Type</InputLabel>
              <Select
                name="callType"
                value={form.callType}
                onChange={handleInputChange}
                label="Call Type"
              >
                <MenuItem value="Incoming">Incoming</MenuItem>
                <MenuItem value="Outgoing">Outgoing</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Call Status</InputLabel>
              <Select
                name="callStatus"
                value={form.callStatus}
                onChange={handleInputChange}
                label="Call Status"
              >
                <MenuItem value="Connected">Connected</MenuItem>
                <MenuItem value="Not Answered">Not Answered</MenuItem>
                <MenuItem value="Busy">Busy</MenuItem>
                <MenuItem value="Wrong Number">Wrong Number</MenuItem>
                <MenuItem value="Follow-up Required">Follow-up Required</MenuItem>
              </Select>
            </FormControl>
            <TextField
              name="callNotes"
              label="Call Notes"
              multiline
              rows={4}
              value={form.callNotes}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              name="createdBy"
              label="Employee Name"
              value={form.createdBy}
              onChange={handleInputChange}
              fullWidth
            />
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmitCall}
              startIcon={<Phone />}
            >
              Save Call Log
            </Button>
          </Box>
        </Paper>
      )}

      {/* Tab 3: Call Analytics */}
      {tabValue === 2 && (
        <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h6" gutterBottom>
            Call Analytics & Reports
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Call Distribution
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Chip label={`Incoming: ${callStats.incomingCalls}`} color="success" variant="outlined" />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Chip label={`Outgoing: ${callStats.outgoingCalls}`} color="primary" variant="outlined" />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Follow-up Summary
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    Pending Follow-ups: {callStats.followUpRequired}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Call History Dialog */}
      <Dialog open={callHistoryOpen} onClose={() => setCallHistoryOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          Call History - {selectedCustomer?.firstName} {selectedCustomer?.lastName}
        </DialogTitle>
        <DialogContent>
          {lastCall && (
            <Accordion defaultExpanded sx={{ mb: 3 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 2 }}>
                  {getCallTypeIcon(lastCall.callType)}
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Last Call: {new Date(lastCall.callDateTime).toLocaleString()}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Typography>
                    <strong>Type:</strong> {lastCall.callType}
                  </Typography>
                  <Typography>
                    <strong>Status:</strong>
                    <Chip label={lastCall.callStatus} sx={{ ml: 1 }} size="small" />
                  </Typography>
                  <Typography sx={{ gridColumn: '1 / -1' }}>
                    <strong>Notes:</strong> {lastCall.callNotes || 'No notes'}
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>
          )}

          <Button
            variant="contained"
            onClick={handleAddCall}
            sx={{ mb: 2 }}
            startIcon={<Phone />}
          >
            Add Call Log
          </Button>

          {callLogs.length === 0 ? (
            <Typography color="textSecondary" sx={{ mt: 2 }}>
              No call records found.
            </Typography>
          ) : (
            <Paper sx={{ mt: 2, borderRadius: 2 }}>
              <DataGrid
                rows={callLogs}
                columns={[
                  {
                    field: 'callType',
                    headerName: 'Type',
                    width: 100,
                    renderCell: (params) => getCallTypeIcon(params.value),
                  },
                  {
                    field: 'callDateTime',
                    headerName: 'Date & Time',
                    flex: 1,
                    renderCell: (params) => new Date(params.value).toLocaleString(),
                  },
                  {
                    field: 'callStatus',
                    headerName: 'Status',
                    flex: 1,
                    renderCell: (params) => (
                      <Chip
                        label={params.value}
                        size="small"
                        sx={{
                          backgroundColor: getCallStatusColor(params.value),
                          color: '#000',
                          fontWeight: 'bold',
                        }}
                      />
                    ),
                  },
                  {
                    field: 'callNotes',
                    headerName: 'Notes',
                    flex: 1.5,
                    renderCell: (params) => (
                      <Typography variant="body2" sx={{ whiteSpace: 'normal' }}>
                        {params.value || '-'}
                      </Typography>
                    ),
                  },
                  {
                    field: 'createdBy',
                    headerName: 'By',
                    width: 120,
                  },
                  {
                    field: 'actions',
                    headerName: 'Actions',
                    width: 100,
                    renderCell: (params) => (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditCall(params.row)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteCall(params.row)}
                        >
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
          <Button onClick={() => setCallHistoryOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Add Call Dialog */}
      <Dialog open={addCallOpen} onClose={() => setAddCallOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Call Log</DialogTitle>
        <DialogContent>
          {selectedCustomer && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Customer: {selectedCustomer.firstName} {selectedCustomer.lastName}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            name="callDateTime"
            label="Call Date & Time"
            type="datetime-local"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={form.callDateTime}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Call Type</InputLabel>
            <Select
              name="callType"
              value={form.callType}
              onChange={handleInputChange}
              label="Call Type"
            >
              <MenuItem value="Incoming">Incoming</MenuItem>
              <MenuItem value="Outgoing">Outgoing</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Call Status</InputLabel>
            <Select
              name="callStatus"
              value={form.callStatus}
              onChange={handleInputChange}
              label="Call Status"
            >
              <MenuItem value="Connected">Connected</MenuItem>
              <MenuItem value="Not Answered">Not Answered</MenuItem>
              <MenuItem value="Busy">Busy</MenuItem>
              <MenuItem value="Wrong Number">Wrong Number</MenuItem>
              <MenuItem value="Follow-up Required">Follow-up Required</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="callNotes"
            label="Call Notes"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={form.callNotes}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="createdBy"
            label="Employee Name"
            type="text"
            fullWidth
            variant="outlined"
            value={form.createdBy}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddCallOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmitCall} variant="contained">
            Add Call
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Call Dialog */}
      <Dialog open={editCallOpen} onClose={() => setEditCallOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Call Log</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="callDateTime"
            label="Call Date & Time"
            type="datetime-local"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={form.callDateTime}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Call Type</InputLabel>
            <Select
              name="callType"
              value={form.callType}
              onChange={handleInputChange}
              label="Call Type"
            >
              <MenuItem value="Incoming">Incoming</MenuItem>
              <MenuItem value="Outgoing">Outgoing</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Call Status</InputLabel>
            <Select
              name="callStatus"
              value={form.callStatus}
              onChange={handleInputChange}
              label="Call Status"
            >
              <MenuItem value="Connected">Connected</MenuItem>
              <MenuItem value="Not Answered">Not Answered</MenuItem>
              <MenuItem value="Busy">Busy</MenuItem>
              <MenuItem value="Wrong Number">Wrong Number</MenuItem>
              <MenuItem value="Follow-up Required">Follow-up Required</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="callNotes"
            label="Call Notes"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={form.callNotes}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="createdBy"
            label="Employee Name"
            type="text"
            fullWidth
            variant="outlined"
            value={form.createdBy}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditCallOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateCall} variant="contained">
            Update Call
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteCallOpen} onClose={() => setDeleteCallOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this call record? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteCallOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteCall} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CallManagement;

