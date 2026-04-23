# Customer Module Refactoring - Quick Reference Card

## What Changed?

| What | Before | After |
|------|--------|-------|
| Customer date fields | `dateOfInquiry`, `followUpDate` | ❌ Removed |
| Customer form | Had date inputs | No date inputs |
| Customer list | Showed date columns | No date columns |
| Call tracking | Split between Customer & Call modules | Consolidated in Call module only |
| API response | Included dates | No dates, has `projectName` |
| Follow-up tracking | Customer field | Call records with "Follow-up Required" status |

---

## API Quick Reference

### Get Customer
```
GET /api/customers/{id}
```
**Response**: Basic customer info WITHOUT dates

### Get Customer + Last Call (NEW)
```
GET /api/customers/{id}/with-last-call
```
**Response**: Customer info + last call details in one call

### Create Customer
```
POST /api/customers
Body: {
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "status": "Interested",
  "projectId": 1
  // NO date fields!
}
```

### Track Follow-ups
```
POST /api/calls
Body: {
  "customerId": 1,
  "callType": "Outgoing",
  "callStatus": "Follow-up Required",
  "callNotes": "Follow up on 2026-04-25",
  "createdBy": "John Smith"
}
```

---

## Frontend Usage

### Show Customer with Last Call
```javascript
// Single efficient call
const data = await apiClient.get(`/customers/${id}/with-last-call`);
console.log(`Last call: ${data.lastCallDateTime}`);
console.log(`Status: ${data.lastCallStatus}`);
```

### Create Customer
```javascript
const form = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  status: 'Interested',
  projectId: 1
  // Remove any date fields
};
await apiClient.post('/customers', form);
```

---

## Database Notes

**Already Correct** ✅
- `customers` table: No date columns
- `call_logs` table: Has all needed fields
- Indexes: Already in place

**If Migrations Needed**:
```sql
SOURCE database/migration_refactor_customer.sql
```

---

## Common Issues & Fixes

### Date fields not showing in form?
✅ Correct! They've been removed intentionally.

### API returns error about date fields?
Check request body - remove `dateOfInquiry` and `followUpDate` fields.

### Can't find follow-up dates?
They're now in call records. View `/api/calls/history/{customerId}`

### Old code breaking?
Update to remove date field references from both backend and frontend.

---

## Key Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/customers` | GET | List all customers |
| `/api/customers/{id}` | GET | Get single customer |
| `/api/customers/{id}/with-last-call` | GET | **NEW**: Get customer + last call |
| `/api/customers` | POST | Create customer (no dates) |
| `/api/customers/{id}` | PUT | Update customer (no dates) |
| `/api/calls` | GET | List all calls |
| `/api/calls/last/{customerId}` | GET | Get last call for customer |
| `/api/calls/history/{customerId}` | GET | Get all calls for customer |
| `/api/calls` | POST | Create new call |

---

## Testing Quick Steps

```bash
# Test new endpoint
curl http://localhost:8080/api/customers/1/with-last-call

# Create customer (no dates)
curl -X POST http://localhost:8080/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "projectId": 1,
    "status": "Interested"
  }'

# Create follow-up call
curl -X POST http://localhost:8080/api/calls \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "callType": "Outgoing",
    "callStatus": "Follow-up Required",
    "callNotes": "Schedule follow-up for next week",
    "createdBy": "Admin"
  }'
```

---

## Files You Need to Know About

### Backend Files
- `CustomerDTO.java` - Updated (no dates)
- `CustomerService.java` - Updated (no dates, has new method)
- `CustomerController.java` - Updated (new endpoint)
- `CustomerWithLastCallDTO.java` - New file

### Frontend Files
- `Customers.jsx` - Updated (no date fields)

### Database Files
- `schema.sql` - Already correct
- `migration_refactor_customer.sql` - Optional cleanup

### Documentation Files
- `REFACTORING_CUSTOMER_MODULE.md` - Complete reference
- `CUSTOMER_REFACTORING_GUIDE.md` - Implementation guide
- `REFACTORING_COMPLETION_REPORT.md` - Final report
- `verify_refactoring.sh` - Verification script

---

## Before & After Code Snippets

### Before: Adding Customer (OLD - Don't Use)
```java
CustomerDTO dto = new CustomerDTO();
dto.setFirstName("John");
dto.setDateOfInquiry(LocalDate.now());  // ❌ Gone
dto.setFollowUpDate(LocalDate.now().plusDays(7));  // ❌ Gone
customerService.createCustomer(dto);
```

### After: Adding Customer (NEW - Use This)
```java
CustomerDTO dto = new CustomerDTO();
dto.setFirstName("John");
dto.setLastName("Doe");
dto.setEmail("john@example.com");
dto.setProjectId(1L);
dto.setStatus("Interested");
// ✅ No date fields
customerService.createCustomer(dto);
```

### Before: Checking Follow-ups (OLD - Don't Use)
```javascript
if (customer.followUpDate < today) {
  // Need follow-up  // ❌ Not available
}
```

### After: Checking Follow-ups (NEW - Use This)
```javascript
const lastCall = await apiClient.get(`/calls/last/${customerId}`);
if (lastCall && lastCall.callStatus === 'Follow-up Required') {
  // Need follow-up  // ✅ From call records
}
```

---

## Validation Rules

### Required Fields for Customer
- firstName (string, max 100)
- lastName (string, max 100)
- projectId (number, must exist)

### Optional Fields for Customer
- email (valid email format)
- phone (string, max 20)
- address (string, max 500)
- city (string, max 100)
- state (string, max 100)
- budget (decimal, non-negative)
- status (enum: Interested, Visited, Booked, Not Interested)

### Required Fields for Call
- customerId (number, must exist)
- callType (enum: Incoming, Outgoing)
- callStatus (enum: Connected, Not Answered, Busy, Wrong Number, Follow-up Required)
- createdBy (string, max 100)

---

## Performance Tips

### Get Customer + Last Call
```javascript
// ✅ Good: Single API call
const data = await apiClient.get(`/customers/${id}/with-last-call`);
```

### Multiple Calls? Use Parallel
```javascript
// ✅ Good: Parallel requests
const [customer, calls] = await Promise.all([
  apiClient.get(`/customers/${id}`),
  apiClient.get(`/calls/history/${id}`)
]);
```

### Don't: Sequential calls
```javascript
// ❌ Bad: Slow sequential calls
const customer = await apiClient.get(`/customers/${id}`);
const calls = await apiClient.get(`/calls/history/${id}`);
```

---

## Error Messages

| Error | Cause | Fix |
|-------|-------|-----|
| 400 Bad Request | Missing required field | Add firstName, lastName, projectId |
| 404 Not Found | Customer doesn't exist | Check customer ID |
| 400 Bad Request | Date fields in request | Remove dateOfInquiry, followUpDate |
| 500 Error | Project doesn't exist | Use valid projectId |

---

## Useful Links

- **Full Documentation**: See `REFACTORING_CUSTOMER_MODULE.md`
- **Implementation Guide**: See `CUSTOMER_REFACTORING_GUIDE.md`
- **Completion Report**: See `REFACTORING_COMPLETION_REPORT.md`
- **Verification**: Run `verify_refactoring.sh`

---

## Quick Decision Tree

```
Need to create/update customer?
└─ Remove any date fields ✅

Need to track follow-ups?
└─ Create a call with status "Follow-up Required" ✅

Need last call for customer?
└─ Use GET /api/customers/{id}/with-last-call ✅

Need all calls for customer?
└─ Use GET /api/calls/history/{id} ✅

Seeing date fields in form?
└─ Clear cache and refresh browser ✅

Old code using date fields?
└─ Update to use call records instead ✅
```

---

## Did You Know?

✅ The new endpoint `/api/customers/{id}/with-last-call` is more efficient than making two separate calls

✅ Follow-up dates are now tracked as individual call records, giving better audit trails

✅ The database schema was already correct - no migrations needed for new systems

✅ Backward compatibility maintained - old code that sends dates will still work (dates are just ignored)

✅ All indexes are already in place for optimal performance

---

**Print This**: Keep this card handy during implementation!

**Last Updated**: April 22, 2026  
**Version**: 1.0

