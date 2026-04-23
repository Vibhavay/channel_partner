import apiClient from './apiClient';

const SALES_DETAILS_API_BASE = '/api/sales-details';

// Get all sales with pagination
export const getSalesDetails = (page = 0, size = 10) => {
  return apiClient.get(SALES_DETAILS_API_BASE, {
    params: { page, size }
  });
};

// Get sales by ID
export const getSalesDetailsById = (id) => {
  return apiClient.get(`${SALES_DETAILS_API_BASE}/${id}`);
};

// Get sales for a specific customer
export const getSalesByCustomerId = (customerId, page = 0, size = 10) => {
  return apiClient.get(`${SALES_DETAILS_API_BASE}/customer/${customerId}`, {
    params: { page, size }
  });
};

// Get sales history for a customer
export const getSalesHistoryByCustomerId = (customerId) => {
  return apiClient.get(`${SALES_DETAILS_API_BASE}/customer/${customerId}/history`);
};

// Get last sale for a customer
export const getLastSaleByCustomerId = (customerId) => {
  return apiClient.get(`${SALES_DETAILS_API_BASE}/customer/${customerId}/last`);
};

// Get sales by payment status
export const getSalesByPaymentStatus = (status, page = 0, size = 10) => {
  return apiClient.get(`${SALES_DETAILS_API_BASE}/payment-status/${status}`, {
    params: { page, size }
  });
};

// Get sales by project
export const getSalesByProject = (projectName, page = 0, size = 10) => {
  return apiClient.get(`${SALES_DETAILS_API_BASE}/project/${projectName}`, {
    params: { page, size }
  });
};

// Get sales by date range
export const getSalesByDateRange = (startDate, endDate, page = 0, size = 10) => {
  return apiClient.get(`${SALES_DETAILS_API_BASE}/date-range`, {
    params: { startDate, endDate, page, size }
  });
};

// Get upcoming possessions
export const getUpcomingPossessions = (page = 0, size = 10) => {
  return apiClient.get(`${SALES_DETAILS_API_BASE}/upcoming-possessions`, {
    params: { page, size }
  });
};

// Create a new sales record
export const createSalesDetails = (salesData) => {
  return apiClient.post(SALES_DETAILS_API_BASE, salesData);
};

// Update a sales record
export const updateSalesDetails = (id, salesData) => {
  return apiClient.put(`${SALES_DETAILS_API_BASE}/${id}`, salesData);
};

// Delete a sales record
export const deleteSalesDetails = (id) => {
  return apiClient.delete(`${SALES_DETAILS_API_BASE}/${id}`);
};

// Get sales statistics
export const getSalesStatistics = () => {
  return apiClient.get(`${SALES_DETAILS_API_BASE}/stats/summary`);
};

// Get sales count by status
export const getSalesCountByStatus = (status) => {
  return apiClient.get(`${SALES_DETAILS_API_BASE}/stats/by-status/${status}`);
};

// Get sales count by project
export const getSalesCountByProject = (projectName) => {
  return apiClient.get(`${SALES_DETAILS_API_BASE}/stats/by-project/${projectName}`);
};

// Get sales count by customer
export const getSalesCountByCustomer = (customerId) => {
  return apiClient.get(`${SALES_DETAILS_API_BASE}/stats/by-customer/${customerId}`);
};

export default {
  getSalesDetails,
  getSalesDetailsById,
  getSalesByCustomerId,
  getSalesHistoryByCustomerId,
  getLastSaleByCustomerId,
  getSalesByPaymentStatus,
  getSalesByProject,
  getSalesByDateRange,
  getUpcomingPossessions,
  createSalesDetails,
  updateSalesDetails,
  deleteSalesDetails,
  getSalesStatistics,
  getSalesCountByStatus,
  getSalesCountByProject,
  getSalesCountByCustomer
};

