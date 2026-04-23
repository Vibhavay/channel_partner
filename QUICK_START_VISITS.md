# 🚀 Quick Start Guide - Customer Visit Module

## ⚡ Getting Started in 5 Minutes

### Step 1: Database Migration (1 min)
```sql
-- Login to MySQL
mysql -u root -p channel_partner_db1

-- Execute migration script
SOURCE /path/to/database/migration_customer_visits.sql;

-- Verify
SELECT COUNT(*) FROM customer_visits;
```

### Step 2: Backend Setup (2 min)
```bash
# Navigate to project root
cd /path/to/channel_partner

# Rebuild with Maven
mvn clean install

# Start Spring Boot server
mvn spring-boot:run

# Server will start on http://localhost:2026
```

### Step 3: Frontend Setup (1 min)
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Step 4: Test the Module (1 min)
```
1. Login to the application
2. Click "📅 Visits" in the navbar
3. Click "Add New Visit" button
4. Select a customer and enter visit details
5. Click "Create" to save
```

---

## 📋 Verification Checklist

### Backend Verification
```bash
# Test API endpoints
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:2026/api/customer-visits

# Should return: {"content": [...], "totalElements": ...}
```

### Database Verification
```sql
-- Check table exists
DESCRIBE customer_visits;

-- Count records
SELECT COUNT(*) as visit_count FROM customer_visits;

-- Check foreign keys
SELECT * FROM customer_visits LIMIT 5;
```

### Frontend Verification
- Navigate to `/customer-visits` route
- Should see tabbed interface
- Dashboard tab shows statistics
- All Visits tab shows data grid
- Filters tab shows filter options

---

## 🎯 Common Tasks

### Create a New Visit
```javascript
// API Call
POST /api/customer-visits
{
  "customerId": 1,
  "visitDate": "2026-04-23T14:30:00",
  "visitType": "SITE_VISIT",
  "status": "Scheduled",
  "notes": "Initial site visit",
  "projectId": 1,
  "createdBy": "Admin"
}
```

### Get Customer's Visit History
```javascript
// API Call
GET /api/customer-visits/customer/1/history

// Returns: Array of all visits for customer 1
```

### Filter Visits by Status
```javascript
// API Call
GET /api/customer-visits/status/Completed?page=0&size=10

// Returns: Paginated completed visits
```

### Get Visit Statistics
```javascript
// API Call
GET /api/customer-visits/stats/summary

// Returns: { "totalConfirmed": 5, "totalCompleted": 10, ... }
```

---

## 🔍 Testing Endpoints with cURL

### Get All Visits
```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:2026/api/customer-visits?page=0&size=10"
```

### Get Visit by ID
```bash
curl -H "Authorization: Bearer TOKEN" \
  "http://localhost:2026/api/customer-visits/1"
```

### Create Visit
```bash
curl -X POST \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "visitDate": "2026-04-23T14:30:00",
    "visitType": "SITE_VISIT",
    "status": "Scheduled",
    "notes": "Test visit",
    "createdBy": "Admin"
  }' \
  "http://localhost:2026/api/customer-visits"
```

### Update Visit
```bash
curl -X PUT \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "visitDate": "2026-04-24T15:00:00",
    "visitType": "SITE_VISIT",
    "status": "Completed",
    "notes": "Updated test visit",
    "createdBy": "Admin"
  }' \
  "http://localhost:2026/api/customer-visits/1"
```

### Delete Visit
```bash
curl -X DELETE \
  -H "Authorization: Bearer TOKEN" \
  "http://localhost:2026/api/customer-visits/1"
```

---

## 🐛 Troubleshooting

### Issue: 404 API Error
**Solution:**
- Verify backend is running on port 2026
- Check endpoint URL matches `/api/customer-visits`
- Verify authentication token is valid

### Issue: Database Connection Error
**Solution:**
- Verify MySQL is running
- Check database credentials in `application.properties`
- Verify `channel_partner_db1` database exists
- Run migration script again

### Issue: Frontend Not Showing Data
**Solution:**
- Check browser DevTools Network tab
- Verify backend API is responding
- Clear browser cache
- Check API URL in `customerVisitAPI.js`

### Issue: Table Not Created
**Solution:**
- Verify migration script executed without errors
- Check MySQL error log
- Verify you have permission to create tables
- Try creating table manually with `migration_customer_visits.sql`

---

## 📚 File Locations

### Backend Files
```
src/main/java/com/example/channelpartner/
├── model/CustomerVisit.java
├── dto/CustomerVisitDTO.java
├── repository/CustomerVisitRepository.java
├── service/CustomerVisitService.java
└── controller/CustomerVisitController.java
```

### Frontend Files
```
frontend/src/
├── pages/CustomerVisits.jsx
├── api/customerVisitAPI.js
├── App.jsx
└── components/Navbar.jsx
```

### Database Files
```
database/migration_customer_visits.sql
```

### Documentation Files
```
CUSTOMER_VISITS_MODULE.md
IMPLEMENTATION_SUMMARY.md
QUICK_START.md (this file)
```

---

## 🔑 Key URLs

| Component | URL | Port |
|-----------|-----|------|
| Backend API | http://localhost:2026 | 2026 |
| API Docs | http://localhost:2026/api/customer-visits | 2026 |
| Frontend | http://localhost:5173 | 5173 |
| Customer Visits Page | http://localhost:5173/customer-visits | 5173 |
| Database | localhost:3306 | 3306 |

---

## 📱 UI Navigation

### From Navbar
```
Home → 📅 Visits → Customer Visits Page
```

### From Customers
```
Customers Page → History Button → Customer Visits Page (filtered)
```

### Tabs in Customer Visits Page
```
Tab 1: Dashboard → Statistics cards
Tab 2: All Visits → DataGrid with pagination
Tab 3: Filters → Advanced filtering options
```

---

## 🎮 Using the Frontend

### Add Visit
1. Click "📅 Visits" in navbar
2. Click "Add New Visit" button
3. Fill form:
   - Customer: (required)
   - Visit Date: (required)
   - Visit Type: (optional)
   - Status: (required)
   - Project: (optional)
   - Flat Type: (optional)
   - Flat Size: (optional)
   - Visit Status: (optional)
   - Notes: (optional)
4. Click "Create"

### Edit Visit
1. Find visit in DataGrid
2. Click Edit icon (pencil)
3. Modify details
4. Click "Update"

### Delete Visit
1. Find visit in DataGrid
2. Click Delete icon (trash)
3. Confirm deletion

### Filter Visits
1. Go to "Filters" tab
2. Select filter criteria:
   - Customer (dropdown)
   - Status (Scheduled, Completed, Cancelled, Rescheduled)
   - Type (Site Visit, Video Tour, Consultation, Follow-up)
   - Date Range (start and end dates)
3. Click "Apply Filters"
4. To clear filters, click "Clear Filters"

### View Statistics
1. Go to "Dashboard" tab
2. See statistics cards for:
   - Confirmed Visits
   - Completed Visits
   - Scheduled Visits
   - Total Visits

---

## 🚀 Performance Tips

### Backend Optimization
- Use pagination (already implemented)
- Database indexes created on key columns
- Consider caching for frequently accessed data
- Monitor slow queries in application logs

### Frontend Optimization
- DataGrid pagination reduces DOM nodes
- Tab-based layout defers component loading
- Filter results before rendering large lists
- Use browser DevTools for performance profiling

### Database Optimization
- Indexes on: customer_id, visit_date, status, visit_type
- Consider archiving old visits
- Use EXPLAIN to analyze queries
- Periodic database maintenance

---

## 📊 Expected Results

### After Successful Setup:
- ✅ 5 Java files created in backend
- ✅ 1 new database table with 0 or more records
- ✅ 2 new frontend files created
- ✅ 3 existing files modified
- ✅ REST API responding on port 2026
- ✅ Frontend accessible on port 5173
- ✅ Customer Visits page showing dashboard

### First Visit Creation:
- ✅ Form validates input
- ✅ Success message appears
- ✅ Statistics update immediately
- ✅ New visit appears in DataGrid
- ✅ Database record created

---

## 🔄 Update Checklist

When updating the module in the future:

- [ ] Backup database before migration
- [ ] Stop backend server
- [ ] Stop frontend dev server
- [ ] Execute new migration script (if any)
- [ ] Rebuild backend (`mvn clean install`)
- [ ] Rebuild frontend (`npm install`)
- [ ] Start both servers
- [ ] Test all functionality
- [ ] Verify no console errors

---

## 💡 Tips & Tricks

### Tip 1: Use Filter Tab for Complex Queries
- Combine multiple filters for specific results
- Clear filters to reset view

### Tip 2: Check Dashboard Statistics First
- Understand data volume before filtering
- See what statuses exist

### Tip 3: Use Created By Field for Audit Trail
- Know who created/updated each visit
- Useful for accountability

### Tip 4: Leverage Visit Type
- Helps categorize visits (Site, Virtual, Consultation, etc.)
- Easier filtering and reporting

### Tip 5: Use Notes Field Effectively
- Add context about visit
- Document decisions/outcomes
- Helps with follow-ups

---

## 📞 Need Help?

1. **Check Logs**
   ```bash
   # Backend logs
   tail -f nohup.out
   
   # Frontend console
   Open DevTools (F12) → Console tab
   ```

2. **Test API**
   - Use Postman, Insomnia, or cURL
   - Verify endpoint URLs
   - Check authentication

3. **Review Documentation**
   - Read `CUSTOMER_VISITS_MODULE.md`
   - Check code comments
   - Review API endpoint list

4. **Debug Frontend**
   - Open DevTools (F12)
   - Check Network tab for API calls
   - Check Console for errors

5. **Debug Backend**
   - Check Spring Boot logs
   - Enable SQL logging in application.properties
   - Use breakpoints in IDE

---

## ✅ Success Criteria

You'll know the implementation is successful when:

✅ Backend builds without errors
✅ Database migration completes successfully
✅ Frontend compiles without errors
✅ Can create a new visit
✅ Can edit a visit
✅ Can delete a visit
✅ Can view visit history for a customer
✅ Can filter visits by various criteria
✅ Statistics display correctly
✅ Navigation works from Customers page
✅ No console or server errors
✅ All API endpoints respond correctly

---

## 🎉 You're All Set!

Enjoy using the Customer Visit module! It's ready for production use.

For detailed information, refer to `CUSTOMER_VISITS_MODULE.md`

Happy tracking! 📅✨

