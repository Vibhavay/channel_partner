# Customer Module Refactoring - Implementation Guide

## Overview
This guide provides implementation details for the removal of redundant date fields (`dateOfInquiry` and `followUpDate`) from the Customer module, consolidating all call tracking exclusively in the Call Management module.

---

## Changes Summary

### Backend Changes

#### 1. CustomerDTO.java
```java
// REMOVED:
// private LocalDate dateOfInquiry;
// private LocalDate followUpDate;

// ADDED:
private String projectName;
```

**Impact**: API responses no longer include date fields. New endpoint provides combined customer + last call data.

#### 2. CustomerService.java
```java
// ADDED dependency:
private final CallLogRepository callLogRepository;

// NEW METHOD:
public CustomerWithLastCallDTO getCustomerWithLastCall(Long customerId) {
    Customer customer = customerRepository.findById(customerId)
            .orElseThrow(() -> new RuntimeException("Customer not found"));
    
    CustomerWithLastCallDTO dto = new CustomerWithLastCallDTO();
    // Set customer fields...
    
    CallLog lastCall = callLogRepository.findFirstByCustomerIdOrderByCallDateTimeDesc(customerId);
    if (lastCall != null) {
        dto.setLastCallId(lastCall.getId());
        dto.setLastCallDateTime(lastCall.getCallDateTime());
        // ... set other call fields
    }
    
    return dto;
}
```

#### 3. CustomerController.java
```java
// NEW ENDPOINT:
@GetMapping("/{id}/with-last-call")
public ResponseEntity<CustomerWithLastCallDTO> getCustomerWithLastCall(@PathVariable Long id) {
    return ResponseEntity.ok(customerService.getCustomerWithLastCall(id));
}
```

#### 4. CustomerWithLastCallDTO.java (NEW)
Complete DTO combining customer and call information for efficient frontend rendering.

---

### Frontend Changes

#### Customers.jsx

**Removed from DataGrid**:
```javascript
// BEFORE:
{ field: 'dateOfInquiry', headerName: 'Date of Inquiry', flex: 1 },
{ field: 'followUpDate', headerName: 'Follow Up Date', flex: 1 },

// AFTER: Removed entirely
```

**Removed from Add Dialog**:
```javascript
// BEFORE:
<TextField
  margin="dense"
  name="dateOfInquiry"
  label="Date of Inquiry"
  type="date"
  ...
/>
<TextField
  margin="dense"
  name="followUpDate"
  label="Follow Up Date"
  type="date"
  ...
/>

// AFTER: Both removed
```

**Removed from Edit Dialog**: Same as Add Dialog

**Form State** (Already Correct):
```javascript
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
  // No date fields
});
```

---

## API Endpoints Reference

### Customer Endpoints

#### Create Customer
```
POST /api/customers
```

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "budget": 2500000.00,
  "status": "Interested",
  "projectId": 1
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "budget": 2500000.00,
  "status": "Interested",
  "projectId": 1,
  "projectName": "Marina Heights"
}
```

#### Get Customer
```
GET /api/customers/{id}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "status": "Interested",
  "projectId": 1,
  "projectName": "Marina Heights"
}
```

#### Get Customer with Last Call (NEW)
```
GET /api/customers/{id}/with-last-call
```

**Response** (200 OK):
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "budget": 2500000.00,
  "status": "Interested",
  "projectId": 1,
  "projectName": "Marina Heights",
  "lastCallId": 5,
  "lastCallDateTime": "2026-04-22T14:30:00",
  "lastCallType": "Outgoing",
  "lastCallStatus": "Connected",
  "lastCallNotes": "Customer interested in 2BHK units",
  "lastCallCreatedAt": "2026-04-22T14:30:00"
}
```

#### Update Customer
```
PUT /api/customers/{id}
```

**Request Body** (Same as Create, without date fields):
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "status": "Visited",
  "projectId": 1
}
```

#### List All Customers
```
GET /api/customers?page=0&size=10
```

**Response**:
```json
{
  "content": [
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "status": "Interested",
      "projectId": 1,
      "projectName": "Marina Heights"
    },
    // ... more customers
  ],
  "totalElements": 25,
  "totalPages": 3,
  "currentPage": 0
}
```

#### Delete Customer
```
DELETE /api/customers/{id}
```

**Response** (204 No Content)

---

## Database Notes

### Schema is Already Correct
The database schema in `schema.sql` is already properly configured:

```sql
CREATE TABLE customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    budget DECIMAL(15,2),
    status VARCHAR(50),
    project_id BIGINT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id)
    -- NOTE: No date_of_inquiry or follow_up_date columns
);

CREATE TABLE call_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id BIGINT NOT NULL,
    call_date_time DATETIME NOT NULL,
    call_type VARCHAR(50) NOT NULL,
    call_status VARCHAR(50) NOT NULL,
    call_notes TEXT,
    created_by VARCHAR(100) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    INDEX idx_customer_id (customer_id),
    INDEX idx_call_date_time (call_date_time),
    INDEX idx_call_status (call_status),
    INDEX idx_call_type (call_type)
);
```

### Migration Script
If your existing system has these columns, use:
```bash
SOURCE database/migration_refactor_customer.sql
```

---

## Code Examples

### Frontend: Create Customer
```javascript
import apiClient from '../api/apiClient';

const createCustomer = async () => {
  const form = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '1234567890',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    budget: 2500000,
    status: 'Interested',
    projectId: 1
    // NO date fields!
  };

  try {
    const response = await apiClient.post('/customers', form);
    console.log('Customer created:', response.data);
  } catch (error) {
    console.error('Error creating customer:', error);
  }
};
```

### Frontend: Display Customer with Last Call
```javascript
import apiClient from '../api/apiClient';

const displayCustomerInfo = async (customerId) => {
  try {
    // Get customer with last call in single request
    const response = await apiClient.get(`/customers/${customerId}/with-last-call`);
    const { 
      firstName, 
      lastName, 
      status,
      lastCallDateTime,
      lastCallStatus,
      lastCallNotes 
    } = response.data;

    console.log(`Customer: ${firstName} ${lastName}`);
    console.log(`Status: ${status}`);
    console.log(`Last Call: ${lastCallDateTime}`);
    console.log(`Call Status: ${lastCallStatus}`);
    console.log(`Notes: ${lastCallNotes}`);
  } catch (error) {
    console.error('Error fetching customer:', error);
  }
};
```

### Frontend: Track Follow-ups via Calls
```javascript
import apiClient from '../api/apiClient';

const createFollowUpCall = async (customerId, followUpDate) => {
  const call = {
    customerId: customerId,
    callDateTime: new Date(followUpDate),
    callType: 'Outgoing',
    callStatus: 'Follow-up Required',
    callNotes: `Follow-up scheduled for ${followUpDate}`,
    createdBy: 'John Smith'
  };

  try {
    const response = await apiClient.post('/calls', call);
    console.log('Follow-up created:', response.data);
  } catch (error) {
    console.error('Error creating follow-up:', error);
  }
};
```

---

## Validation Rules

### Customer Creation/Update

| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| firstName | String | Yes | Non-empty, max 100 chars |
| lastName | String | Yes | Non-empty, max 100 chars |
| email | String | No | Valid email format |
| phone | String | No | Max 20 chars |
| address | String | No | Max 500 chars |
| city | String | No | Max 100 chars |
| state | String | No | Max 100 chars |
| budget | Decimal | No | Non-negative |
| status | String | No | Valid enum |
| projectId | Long | Yes | Must exist in projects table |

### Valid Status Values
- `Interested`
- `Visited`
- `Booked`
- `Not Interested`

---

## Error Handling

### Common HTTP Response Codes

```
200 OK              - Successful GET request
201 Created         - Successful POST request
204 No Content      - Successful DELETE request
400 Bad Request     - Validation error
404 Not Found       - Customer/Project not found
500 Server Error    - Internal server error
```

### Error Response Format
```json
{
  "timestamp": "2026-04-22T14:30:00.000Z",
  "status": 404,
  "error": "Not Found",
  "message": "Customer not found",
  "path": "/api/customers/999"
}
```

---

## Deployment Checklist

- [ ] Backend compiled successfully
- [ ] No compilation errors or warnings (other than expected)
- [ ] Database schema verified
- [ ] Migration script tested (if needed)
- [ ] Frontend built successfully
- [ ] All tests passing
- [ ] API endpoints tested with curl/Postman
- [ ] UI tested in browser
- [ ] Date fields not visible in forms
- [ ] Customer creation/update works
- [ ] Call history accessible
- [ ] Last call info displays correctly

---

## Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Date fields still visible | Clear browser cache, hard refresh (Ctrl+F5) |
| Form submit fails with 400 | Verify projectId is provided and valid |
| No call data showing | Check if calls exist in database for customer |
| API returns 404 | Verify customer ID exists |
| Frontend shows old data | Check network tab for actual response in DevTools |

---

**Last Updated**: April 22, 2026
**Version**: 1.0
**Status**: Complete and Ready for Deployment

