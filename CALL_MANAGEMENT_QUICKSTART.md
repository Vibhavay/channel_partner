# Call Management Module - Quick Start Guide

## Quick Setup & Testing

### Prerequisites
- Backend running on port 2026
- Frontend running on port 5173
- MySQL database configured
- All dependencies installed

### Backend Compilation & Run

```bash
# Navigate to project directory
cd C:\Users\Admin\IdeaProjects\channel_partner

# Clean and compile
mvn clean compile -DskipTests

# Run the application (port 2026)
mvn spring-boot:run -DskipTests
```

### Frontend Setup & Run

```bash
# Navigate to frontend directory
cd C:\Users\Admin\IdeaProjects\channel_partner\frontend

# Install dependencies
npm install

# Start development server (port 5173)
npm run dev
```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:2026/api
- **Call Management Page**: http://localhost:5173/calls
- **Swagger UI**: http://localhost:2026/swagger-ui.html (if enabled)

---

## API Testing Examples

### 1. Create a Call Log

**Endpoint**: `POST /api/calls`

**Request Body**:
```json
{
  "customerId": 1,
  "callDateTime": "2026-04-21T15:30:00",
  "callType": "Outgoing",
  "callStatus": "Connected",
  "callNotes": "Customer interested in 2 BHK apartments. Will follow up next week.",
  "createdBy": "John Doe"
}
```

**cURL Command**:
```bash
curl -X POST http://localhost:2026/api/calls \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "callDateTime": "2026-04-21T15:30:00",
    "callType": "Outgoing",
    "callStatus": "Connected",
    "callNotes": "Customer interested in 2 BHK apartments",
    "createdBy": "John Doe"
  }'
```

---

### 2. Get Call History for Customer

**Endpoint**: `GET /api/calls/history/{customerId}`

**Example**:
```bash
curl http://localhost:2026/api/calls/history/1
```

**Response**:
```json
[
  {
    "id": 1,
    "customerId": 1,
    "customerName": "John Smith",
    "customerEmail": "john@example.com",
    "customerPhone": "9876543210",
    "callDateTime": "2026-04-21T15:30:00",
    "callType": "Outgoing",
    "callStatus": "Connected",
    "callNotes": "Customer interested in 2 BHK apartments",
    "createdBy": "John Doe",
    "createdAt": "2026-04-21T15:30:00",
    "updatedAt": "2026-04-21T15:30:00"
  }
]
```

---

### 3. Get Last Call for Customer

**Endpoint**: `GET /api/calls/last/{customerId}`

**Example**:
```bash
curl http://localhost:2026/api/calls/last/1
```

---

### 4. Get Today's Call Statistics

**Endpoints**:
```bash
# Total calls today
curl http://localhost:2026/api/calls/stats/today/count

# Incoming calls today
curl http://localhost:2026/api/calls/stats/today/incoming

# Outgoing calls today
curl http://localhost:2026/api/calls/stats/today/outgoing

# Follow-ups required today
curl http://localhost:2026/api/calls/followups/today
```

---

### 5. Get All Calls (Paginated)

**Endpoint**: `GET /api/calls?page=0&size=10`

**Example**:
```bash
curl "http://localhost:2026/api/calls?page=0&size=10"
```

---

### 6. Update a Call Log

**Endpoint**: `PUT /api/calls/{id}`

**Request Body**:
```json
{
  "customerId": 1,
  "callDateTime": "2026-04-21T15:30:00",
  "callType": "Outgoing",
  "callStatus": "Follow-up Required",
  "callNotes": "Updated notes - Follow up on pricing query",
  "createdBy": "John Doe"
}
```

**cURL Command**:
```bash
curl -X PUT http://localhost:2026/api/calls/1 \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "callDateTime": "2026-04-21T15:30:00",
    "callType": "Outgoing",
    "callStatus": "Follow-up Required",
    "callNotes": "Updated notes - Follow up on pricing query",
    "createdBy": "John Doe"
  }'
```

---

### 7. Delete a Call Log

**Endpoint**: `DELETE /api/calls/{id}`

**cURL Command**:
```bash
curl -X DELETE http://localhost:2026/api/calls/1
```

---

### 8. Get Calls by Status

**Endpoint**: `GET /api/calls/status/{status}?page=0&size=10`

**Example**:
```bash
curl "http://localhost:2026/api/calls/status/Follow-up%20Required?page=0&size=10"
```

---

### 9. Get Calls by Type

**Endpoint**: `GET /api/calls/type/{callType}?page=0&size=10`

**Example**:
```bash
curl "http://localhost:2026/api/calls/type/Incoming?page=0&size=10"
```

---

### 10. Get Calls by Employee

**Endpoint**: `GET /api/calls/employee/{employeeName}?page=0&size=10`

**Example**:
```bash
curl "http://localhost:2026/api/calls/employee/John%20Doe?page=0&size=10"
```

---

## Frontend Usage Walkthrough

### Step 1: Login
1. Go to http://localhost:5173
2. Login with credentials (default: admin/admin)

### Step 2: Navigate to Call Management
1. Click "📞 Calls" button in the navigation bar
2. You'll see the Call Management page with statistics

### Step 3: View Call History
1. Click on "Customer Call History" tab
2. Click on any customer card
3. View their complete call history

### Step 4: Add a New Call
1. Click on "Add New Call" tab
2. Select a customer
3. Fill in call details:
   - Date & Time
   - Call Type (Incoming/Outgoing)
   - Call Status
   - Notes
   - Employee Name
4. Click "Save Call Log"

### Step 5: View Analytics
1. Click on "Call Analytics" tab
2. See real-time call statistics
3. Monitor follow-ups required

---

## Sample Test Data

### Create Test Calls

```bash
# Call 1: Connected call
curl -X POST http://localhost:2026/api/calls \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "callDateTime": "2026-04-21T09:00:00",
    "callType": "Outgoing",
    "callStatus": "Connected",
    "callNotes": "Discussed project details",
    "createdBy": "Admin"
  }'

# Call 2: Follow-up required
curl -X POST http://localhost:2026/api/calls \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "callDateTime": "2026-04-21T14:30:00",
    "callType": "Incoming",
    "callStatus": "Follow-up Required",
    "callNotes": "Customer needs budget quotation",
    "createdBy": "Admin"
  }'

# Call 3: Not answered
curl -X POST http://localhost:2026/api/calls \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 2,
    "callDateTime": "2026-04-21T16:00:00",
    "callType": "Outgoing",
    "callStatus": "Not Answered",
    "callNotes": "Will try again later",
    "createdBy": "Admin"
  }'
```

---

## Database Verification

### Check Call Logs Table

```sql
-- View all call logs
SELECT * FROM call_logs ORDER BY call_date_time DESC;

-- Check call logs for specific customer
SELECT * FROM call_logs WHERE customer_id = 1 ORDER BY call_date_time DESC;

-- Call statistics
SELECT 
  call_type, 
  call_status, 
  COUNT(*) as total 
FROM call_logs 
GROUP BY call_type, call_status;

-- Today's calls
SELECT * FROM call_logs 
WHERE DATE(call_date_time) = CURDATE() 
ORDER BY call_date_time DESC;
```

---

## Troubleshooting

### Backend won't start
- Check if port 2026 is already in use
- Verify MySQL is running
- Check application.properties configuration

### Frontend won't load
- Verify port 5173 is available
- Check npm dependencies with `npm install`
- Clear browser cache and refresh

### API calls fail
- Verify backend is running: `curl http://localhost:2026/api/calls`
- Check CORS configuration
- Verify request/response format

### Database errors
- Ensure tables are created: Run `schema.sql`
- Check database connection string
- Verify user permissions on database

---

## Performance Tips

1. **Pagination**: Always use pagination for large datasets
2. **Indexing**: Database has indexes on frequently queried fields
3. **Caching**: Frontend caches customer list for performance
4. **Lazy Loading**: Call history loads on demand

---

## Security Considerations

1. **Authentication**: All endpoints require JWT token
2. **Validation**: Input validation on both frontend and backend
3. **SQL Injection**: Parameterized queries prevent SQL injection
4. **XSS Protection**: React automatically escapes content
5. **CORS**: Configured to allow frontend requests

---

## Files Modified/Created

**Backend Files Created**:
- `CallLog.java` (Model)
- `CallLogDTO.java` (DTO)
- `CallLogRepository.java` (Repository)
- `CallLogService.java` (Service)
- `CallLogController.java` (Controller)

**Frontend Files Created**:
- `CallManagement.jsx` (Page Component)

**Modified Files**:
- `Customer.java` (Added CallLog relationship)
- `App.jsx` (Added route)
- `Navbar.jsx` (Added menu item)
- `schema.sql` (Added call_logs table)
- `schema-cleanup.sql` (Added cleanup for call_logs)

---

## Next Steps

1. ✅ Backend compilation successful
2. ✅ Database schema updated
3. ✅ All models, services, and controllers created
4. ✅ Frontend component created
5. ⏳ Start Backend: `mvn spring-boot:run -DskipTests`
6. ⏳ Start Frontend: `npm run dev`
7. 🧪 Test APIs using provided examples
8. 📊 Access dashboard at http://localhost:5173

---

**Version**: 1.0.0  
**Last Updated**: April 21, 2026  
**Status**: Ready for Testing

