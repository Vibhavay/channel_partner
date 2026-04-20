import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert } from '@mui/material';
import apiClient from '../api/apiClient';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await apiClient.get('/sales');
      setSales(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching sales:', error);
      setError('Failed to load sales');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Sales
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Button variant="contained" sx={{ mb: 2 }}>
        Add Sale
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sale Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Commission</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.map((sale, index) => (
              <TableRow
                key={sale.id}
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
                <TableCell>{sale.saleDate}</TableCell>
                <TableCell>₹{(sale.amount || 0).toLocaleString()}</TableCell>
                <TableCell>₹{(sale.commission || 0).toLocaleString()}</TableCell>
                <TableCell>{sale.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Sales;
