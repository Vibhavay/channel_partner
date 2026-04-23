import apiClient from './apiClient';

const CUSTOMER_VISITS_API_BASE = '/api/customer-visits';

// Get all visits with pagination
export const getCustomerVisits = (page = 0, size = 10) => {
  return apiClient.get(CUSTOMER_VISITS_API_BASE, {
    params: { page, size }
  });
};

// Get visit by ID
export const getCustomerVisitById = (id) => {
  return apiClient.get(`${CUSTOMER_VISITS_API_BASE}/${id}`);
};

// Get visits for a specific customer
export const getVisitsByCustomerId = (customerId, page = 0, size = 10) => {
  return apiClient.get(`${CUSTOMER_VISITS_API_BASE}/customer/${customerId}`, {
    params: { page, size }
  });
};

// Get visit history for a customer
export const getVisitHistoryByCustomerId = (customerId) => {
  return apiClient.get(`${CUSTOMER_VISITS_API_BASE}/customer/${customerId}/history`);
};

// Get last visit for a customer
export const getLastVisitByCustomerId = (customerId) => {
  return apiClient.get(`${CUSTOMER_VISITS_API_BASE}/customer/${customerId}/last`);
};

// Get visits by status
export const getVisitsByStatus = (status, page = 0, size = 10) => {
  return apiClient.get(`${CUSTOMER_VISITS_API_BASE}/status/${status}`, {
    params: { page, size }
  });
};

// Get visits by type
export const getVisitsByType = (visitType, page = 0, size = 10) => {
  return apiClient.get(`${CUSTOMER_VISITS_API_BASE}/type/${visitType}`, {
    params: { page, size }
  });
};

// Get visits by created by (employee)
export const getVisitsByCreatedBy = (createdBy, page = 0, size = 10) => {
  return apiClient.get(`${CUSTOMER_VISITS_API_BASE}/created-by/${createdBy}`, {
    params: { page, size }
  });
};

// Get upcoming visits
export const getUpcomingVisits = (page = 0, size = 10) => {
  return apiClient.get(`${CUSTOMER_VISITS_API_BASE}/upcoming`, {
    params: { page, size }
  });
};

// Get visits by date range
export const getVisitsByDateRange = (startDate, endDate, page = 0, size = 10) => {
  return apiClient.get(`${CUSTOMER_VISITS_API_BASE}/date-range`, {
    params: { startDate, endDate, page, size }
  });
};

// Create a new visit
export const createCustomerVisit = (visitData) => {
  return apiClient.post(CUSTOMER_VISITS_API_BASE, visitData);
};

// Update a visit
export const updateCustomerVisit = (id, visitData) => {
  return apiClient.put(`${CUSTOMER_VISITS_API_BASE}/${id}`, visitData);
};

// Delete a visit
export const deleteCustomerVisit = (id) => {
  return apiClient.delete(`${CUSTOMER_VISITS_API_BASE}/${id}`);
};

// Get visit statistics
export const getVisitStatistics = () => {
  return apiClient.get(`${CUSTOMER_VISITS_API_BASE}/stats/summary`);
};

// Get visit count by status
export const getVisitCountByStatus = (status) => {
  return apiClient.get(`${CUSTOMER_VISITS_API_BASE}/stats/by-status/${status}`);
};

// Get visit count by type
export const getVisitCountByType = (visitType) => {
  return apiClient.get(`${CUSTOMER_VISITS_API_BASE}/stats/by-type/${visitType}`);
};

// Get visit count by customer
export const getVisitCountByCustomer = (customerId) => {
  return apiClient.get(`${CUSTOMER_VISITS_API_BASE}/stats/by-customer/${customerId}`);
};

export default {
  getCustomerVisits,
  getCustomerVisitById,
  getVisitsByCustomerId,
  getVisitHistoryByCustomerId,
  getLastVisitByCustomerId,
  getVisitsByStatus,
  getVisitsByType,
  getVisitsByCreatedBy,
  getUpcomingVisits,
  getVisitsByDateRange,
  createCustomerVisit,
  updateCustomerVisit,
  deleteCustomerVisit,
  getVisitStatistics,
  getVisitCountByStatus,
  getVisitCountByType,
  getVisitCountByCustomer
};

