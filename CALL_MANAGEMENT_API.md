# Call Management API Documentation

## Base URL
```
http://localhost:2026/api/calls
```

## Authentication
All endpoints require JWT Bearer token in the Authorization header:
```
Authorization: Bearer {token}
```

---

## Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/calls` | Get all call logs (paginated) |
| POST | `/api/calls` | Create a new call log |
| GET | `/api/calls/{id}` | Get call log by ID |
| PUT | `/api/calls/{id}` | Update call log |
| DELETE | `/api/calls/{id}` | Delete call log |
| GET | `/api/calls/customer/{customerId}` | Get calls for specific customer |
| GET | `/api/calls/history/{customerId}` | Get complete call history |
| GET | `/api/calls/last/{customerId}` | Get last call for customer |
| GET | `/api/calls/status/{status}` | Get calls by status |
| GET | `/api/calls/type/{callType}` | Get calls by type |
| GET | `/api/calls/employee/{employeeName}` | Get calls by employee |
| GET | `/api/calls/stats/today/count` | Total calls today |
| GET | `/api/calls/stats/today/incoming` | Incoming calls today |
| GET | `/api/calls/stats/today/outgoing` | Outgoing calls today |
| GET | `/api/calls/followups/today` | Today's follow-ups |

---

## Detailed Endpoint Documentation

### 1. GET /api/calls
Retrieve all call logs with pagination.

**Query Parameters:**
```
page: 0 (default)
size: 10 (default)
```

**Example Request:**
```bash
GET /api/calls?page=0&size=10
```

**Response:**
```json
{
  "content": [
    {
      "id": 1,
      "customerId": 1,
      "customerName": "John Smith",
      "customerEmail": "john@example.com",
      "customerPhone": "9876543210",
      "callDateTime": "2026-04-21T15:30:00",
      "callType": "Outgoing",
      "callStatus": "Connected",
      "callNotes": "Discussed project details",
      "createdBy": "Admin",
      "createdAt": "2026-04-21T15:30:00",
      "updatedAt": "2026-04-21T15:30:00"
    }
  ],
  "totalElements": 15,
  "totalPages": 2,
  "currentPage": 0,
  "size": 10
}
```

**Status Codes:**
- `200 OK` - Success
- `401 Unauthorized` - Invalid token
- `500 Internal Server Error` - Server error

---

### 2. POST /api/calls
Create a new call log entry.

**Request Body:**
```json
{
  "customerId": 1,
  "callDateTime": "2026-04-21T15:30:00",
  "callType": "Outgoing",
  "callStatus": "Connected",
  "callNotes": "Customer interested in 2 BHK apartments",
  "createdBy": "John Doe"
}
```

**Required Fields:**
- `customerId` (Long)
- `callType` (String: "Incoming" or "Outgoing")
- `callStatus` (String: "Connected", "Not Answered", "Busy", "Wrong Number", "Follow-up Required")
- `createdBy` (String)

**Optional Fields:**
- `callDateTime` (LocalDateTime) - Defaults to now if not provided
- `callNotes` (String)

**Example Request:**
```bash
curl -X POST http://localhost:2026/api/calls \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "customerId": 1,
    "callDateTime": "2026-04-21T15:30:00",
    "callType": "Outgoing",
    "callStatus": "Connected",
    "callNotes": "Customer interested in properties",
    "createdBy": "John Doe"
  }'
```

**Response (201 Created):**
```json
{
  "id": 1,
  "customerId": 1,
  "customerName": "John Smith",
  "customerEmail": "john@example.com",
  "customerPhone": "9876543210",
  "callDateTime": "2026-04-21T15:30:00",
  "callType": "Outgoing",
  "callStatus": "Connected",
  "callNotes": "Customer interested in properties",
  "createdBy": "John Doe",
  "createdAt": "2026-04-21T15:30:00",
  "updatedAt": "2026-04-21T15:30:00"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Customer not found",
  "timestamp": "2026-04-21T15:30:00",
  "status": 400
}
```

---

### 3. GET /api/calls/{id}
Retrieve a specific call log by ID.

**Path Parameters:**
- `id` (Long) - Call log ID

**Example Request:**
```bash
GET /api/calls/1
```

**Response:**
```json
{
  "id": 1,
  "customerId": 1,
  "customerName": "John Smith",
  "customerEmail": "john@example.com",
  "customerPhone": "9876543210",
  "callDateTime": "2026-04-21T15:30:00",
  "callType": "Outgoing",
  "callStatus": "Connected",
  "callNotes": "Customer interested in properties",
  "createdBy": "John Doe",
  "createdAt": "2026-04-21T15:30:00",
  "updatedAt": "2026-04-21T15:30:00"
}
```

---

### 4. PUT /api/calls/{id}
Update an existing call log.

**Path Parameters:**
- `id` (Long) - Call log ID

**Request Body:**
```json
{
  "customerId": 1,
  "callDateTime": "2026-04-21T15:30:00",
  "callType": "Outgoing",
  "callStatus": "Follow-up Required",
  "callNotes": "Updated notes",
  "createdBy": "John Doe"
}
```

**Example Request:**
```bash
curl -X PUT http://localhost:2026/api/calls/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "customerId": 1,
    "callDateTime": "2026-04-21T15:30:00",
    "callType": "Outgoing",
    "callStatus": "Follow-up Required",
    "callNotes": "Updated notes",
    "createdBy": "John Doe"
  }'
```

**Response:**
```json
{
  "id": 1,
  "customerId": 1,
  "customerName": "John Smith",
  "customerEmail": "john@example.com",
  "customerPhone": "9876543210",
  "callDateTime": "2026-04-21T15:30:00",
  "callType": "Outgoing",
  "callStatus": "Follow-up Required",
  "callNotes": "Updated notes",
  "createdBy": "John Doe",
  "createdAt": "2026-04-21T15:30:00",
  "updatedAt": "2026-04-21T15:30:00"
}
```

---

### 5. DELETE /api/calls/{id}
Delete a call log entry.

**Path Parameters:**
- `id` (Long) - Call log ID

**Example Request:**
```bash
curl -X DELETE http://localhost:2026/api/calls/1 \
  -H "Authorization: Bearer {token}"
```

**Response:**
- `204 No Content` - Successful deletion

---

### 6. GET /api/calls/customer/{customerId}
Get all calls for a specific customer with pagination.

**Path Parameters:**
- `customerId` (Long) - Customer ID

**Query Parameters:**
- `page` (default: 0)
- `size` (default: 10)

**Example Request:**
```bash
GET /api/calls/customer/1?page=0&size=10
```

**Response:**
```json
{
  "content": [
    {
      "id": 1,
      "customerId": 1,
      "customerName": "John Smith",
      "callDateTime": "2026-04-21T15:30:00",
      "callType": "Outgoing",
      "callStatus": "Connected",
      "callNotes": "Customer interested in properties",
      "createdBy": "John Doe",
      "createdAt": "2026-04-21T15:30:00",
      "updatedAt": "2026-04-21T15:30:00"
    }
  ],
  "totalElements": 5,
  "totalPages": 1,
  "currentPage": 0,
  "size": 10
}
```

---

### 7. GET /api/calls/history/{customerId}
Get the complete call history for a customer (ordered by date, latest first).

**Path Parameters:**
- `customerId` (Long) - Customer ID

**Example Request:**
```bash
GET /api/calls/history/1
```

**Response:**
```json
[
  {
    "id": 5,
    "customerId": 1,
    "customerName": "John Smith",
    "callDateTime": "2026-04-21T16:00:00",
    "callType": "Incoming",
    "callStatus": "Follow-up Required",
    "callNotes": "Customer requesting quote",
    "createdBy": "Jane Doe",
    "createdAt": "2026-04-21T16:00:00",
    "updatedAt": "2026-04-21T16:00:00"
  },
  {
    "id": 1,
    "customerId": 1,
    "customerName": "John Smith",
    "callDateTime": "2026-04-21T15:30:00",
    "callType": "Outgoing",
    "callStatus": "Connected",
    "callNotes": "Initial contact",
    "createdBy": "John Doe",
    "createdAt": "2026-04-21T15:30:00",
    "updatedAt": "2026-04-21T15:30:00"
  }
]
```

---

### 8. GET /api/calls/last/{customerId}
Get the most recent call for a customer.

**Path Parameters:**
- `customerId` (Long) - Customer ID

**Example Request:**
```bash
GET /api/calls/last/1
```

**Response:**
```json
{
  "id": 5,
  "customerId": 1,
  "customerName": "John Smith",
  "customerEmail": "john@example.com",
  "customerPhone": "9876543210",
  "callDateTime": "2026-04-21T16:00:00",
  "callType": "Incoming",
  "callStatus": "Follow-up Required",
  "callNotes": "Customer requesting quote",
  "createdBy": "Jane Doe",
  "createdAt": "2026-04-21T16:00:00",
  "updatedAt": "2026-04-21T16:00:00"
}
```

**Response when no calls exist:**
```json
null
```

---

### 9. GET /api/calls/status/{status}
Get all calls with a specific status today.

**Path Parameters:**
- `status` (String) - One of: "Connected", "Not Answered", "Busy", "Wrong Number", "Follow-up Required"

**Query Parameters:**
- `page` (default: 0)
- `size` (default: 10)

**Example Request:**
```bash
GET /api/calls/status/Follow-up%20Required?page=0&size=10
```

**Response:**
```json
{
  "content": [
    {
      "id": 5,
      "customerId": 1,
      "customerName": "John Smith",
      "callDateTime": "2026-04-21T16:00:00",
      "callType": "Incoming",
      "callStatus": "Follow-up Required",
      "callNotes": "Customer requesting quote",
      "createdBy": "Jane Doe",
      "createdAt": "2026-04-21T16:00:00",
      "updatedAt": "2026-04-21T16:00:00"
    }
  ],
  "totalElements": 2,
  "totalPages": 1,
  "currentPage": 0,
  "size": 10
}
```

---

### 10. GET /api/calls/type/{callType}
Get all calls of a specific type today.

**Path Parameters:**
- `callType` (String) - "Incoming" or "Outgoing"

**Query Parameters:**
- `page` (default: 0)
- `size` (default: 10)

**Example Request:**
```bash
GET /api/calls/type/Incoming?page=0&size=10
```

**Response:**
```json
{
  "content": [
    {
      "id": 5,
      "customerId": 1,
      "customerName": "John Smith",
      "callDateTime": "2026-04-21T16:00:00",
      "callType": "Incoming",
      "callStatus": "Follow-up Required",
      "callNotes": "Customer requesting quote",
      "createdBy": "Jane Doe",
      "createdAt": "2026-04-21T16:00:00",
      "updatedAt": "2026-04-21T16:00:00"
    }
  ],
  "totalElements": 3,
  "totalPages": 1,
  "currentPage": 0,
  "size": 10
}
```

---

### 11. GET /api/calls/employee/{employeeName}
Get all calls made by a specific employee today.

**Path Parameters:**
- `employeeName` (String) - Name of the employee

**Query Parameters:**
- `page` (default: 0)
- `size` (default: 10)

**Example Request:**
```bash
GET /api/calls/employee/John%20Doe?page=0&size=10
```

**Response:**
```json
{
  "content": [
    {
      "id": 1,
      "customerId": 1,
      "customerName": "John Smith",
      "callDateTime": "2026-04-21T15:30:00",
      "callType": "Outgoing",
      "callStatus": "Connected",
      "callNotes": "Customer interested in properties",
      "createdBy": "John Doe",
      "createdAt": "2026-04-21T15:30:00",
      "updatedAt": "2026-04-21T15:30:00"
    }
  ],
  "totalElements": 4,
  "totalPages": 1,
  "currentPage": 0,
  "size": 10
}
```

---

### 12. GET /api/calls/stats/today/count
Get total number of calls made today.

**Example Request:**
```bash
GET /api/calls/stats/today/count
```

**Response:**
```json
5
```

---

### 13. GET /api/calls/stats/today/incoming
Get total number of incoming calls made today.

**Example Request:**
```bash
GET /api/calls/stats/today/incoming
```

**Response:**
```json
2
```

---

### 14. GET /api/calls/stats/today/outgoing
Get total number of outgoing calls made today.

**Example Request:**
```bash
GET /api/calls/stats/today/outgoing
```

**Response:**
```json
3
```

---

### 15. GET /api/calls/followups/today
Get all calls requiring follow-up made today.

**Example Request:**
```bash
GET /api/calls/followups/today
```

**Response:**
```json
[
  {
    "id": 5,
    "customerId": 1,
    "customerName": "John Smith",
    "customerEmail": "john@example.com",
    "customerPhone": "9876543210",
    "callDateTime": "2026-04-21T16:00:00",
    "callType": "Incoming",
    "callStatus": "Follow-up Required",
    "callNotes": "Customer requesting quote",
    "createdBy": "Jane Doe",
    "createdAt": "2026-04-21T16:00:00",
    "updatedAt": "2026-04-21T16:00:00"
  }
]
```

---

## Data Models

### CallLogDTO

```json
{
  "id": 1,
  "customerId": 1,
  "customerName": "John Smith",
  "customerEmail": "john@example.com",
  "customerPhone": "9876543210",
  "callDateTime": "2026-04-21T15:30:00",
  "callType": "Outgoing",
  "callStatus": "Connected",
  "callNotes": "Customer interested in properties",
  "createdBy": "John Doe",
  "createdAt": "2026-04-21T15:30:00",
  "updatedAt": "2026-04-21T15:30:00"
}
```

### Call Types
- `Incoming` - Incoming call from customer
- `Outgoing` - Outgoing call to customer

### Call Status Values
- `Connected` - Call successfully connected
- `Not Answered` - Customer did not answer
- `Busy` - Customer line was busy
- `Wrong Number` - Called wrong number
- `Follow-up Required` - Follow-up call needed

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 204 | No Content | Deletion successful |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Invalid or missing authentication |
| 403 | Forbidden | No permission to access resource |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error |

---

## Common Error Responses

**Customer Not Found:**
```json
{
  "error": "Customer not found",
  "timestamp": "2026-04-21T15:30:00",
  "status": 400
}
```

**Call Log Not Found:**
```json
{
  "error": "Call log not found",
  "timestamp": "2026-04-21T15:30:00",
  "status": 404
}
```

**Validation Error:**
```json
{
  "error": "Invalid call status. Allowed values: Connected, Not Answered, Busy, Wrong Number, Follow-up Required",
  "timestamp": "2026-04-21T15:30:00",
  "status": 400
}
```

---

## Rate Limiting
Currently no rate limiting is implemented. To be added in future versions.

---

## Pagination

All list endpoints support pagination with the following parameters:
- `page` (0-indexed, default: 0)
- `size` (default: 10, max: 100)

**Example:**
```bash
GET /api/calls?page=1&size=20
```

---

## Sorting

Calls are automatically sorted by date in descending order (latest first) in history endpoints.

---

## Version History

**v1.0.0** (April 21, 2026)
- Initial release
- Complete CRUD operations
- Customer-specific queries
- Statistics endpoints
- Follow-up management

---

## Support

For issues or questions:
1. Check the logs at: `C:\Users\Admin\IdeaProjects\channel_partner\backend.log`
2. Review the Quick Start Guide: `CALL_MANAGEMENT_QUICKSTART.md`
3. Consult the Implementation Guide: `CALL_MANAGEMENT_GUIDE.md`

