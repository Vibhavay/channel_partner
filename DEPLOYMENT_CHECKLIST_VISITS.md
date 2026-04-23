# ✅ Customer Visit Module - Deployment Checklist

## 📋 Pre-Deployment Verification

### Backend Setup
- [ ] Java 17+ installed
- [ ] Maven 3.6+ installed
- [ ] Spring Boot 3.2.0 configured
- [ ] MySQL 8.0+ running
- [ ] All 5 Java files present in correct directories
- [ ] No compilation errors (`mvn clean compile`)
- [ ] Dependencies resolve correctly (`mvn dependency:resolve`)

### Frontend Setup
- [ ] Node.js 16+ installed
- [ ] npm 8+ installed
- [ ] React 18 installed
- [ ] Material-UI dependencies installed
- [ ] Vite build tool configured
- [ ] All 2 new React files created
- [ ] 3 existing files modified correctly

### Database Setup
- [ ] MySQL service running
- [ ] Database `channel_partner_db1` exists
- [ ] User account has privileges
- [ ] Backup created before migration
- [ ] Migration script available at `/database/migration_customer_visits.sql`

---

## 🔧 Installation Checklist

### Step 1: Database Migration
```bash
- [ ] Open MySQL CLI
- [ ] Execute: mysql -u root -p channel_partner_db1
- [ ] Execute: SOURCE /path/to/database/migration_customer_visits.sql;
- [ ] Verify table created: SHOW TABLES;
- [ ] Verify columns: DESCRIBE customer_visits;
- [ ] Verify data migrated: SELECT COUNT(*) FROM customer_visits;
- [ ] Verify indexes: SHOW INDEXES FROM customer_visits;
- [ ] Verify foreign keys: SELECT * FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_NAME='customer_visits';
```

### Step 2: Backend Build
```bash
- [ ] Navigate to project root
- [ ] Run: mvn clean install
- [ ] Verify: BUILD SUCCESS message
- [ ] Verify no test failures
- [ ] Check target directory created
- [ ] Verify JAR file generated
```

### Step 3: Backend Start
```bash
- [ ] Run: mvn spring-boot:run
- [ ] Wait for: "Started ChannelPartnerApplication"
- [ ] Verify port 2026 listening
- [ ] Check no error logs
- [ ] Test endpoint: curl http://localhost:2026/api/customer-visits
```

### Step 4: Frontend Dependencies
```bash
- [ ] Navigate to: cd frontend
- [ ] Run: npm install
- [ ] Verify: "added X packages" message
- [ ] Check node_modules created
- [ ] Verify package-lock.json generated
```

### Step 5: Frontend Start
```bash
- [ ] Run: npm run dev
- [ ] Wait for: "Local: http://localhost:5173"
- [ ] Check no build errors
- [ ] Open browser to http://localhost:5173
- [ ] Verify login page loads
```

---

## 🧪 Functional Testing

### CRUD Operations
- [ ] **Create Visit**
  - [ ] Navigate to /customer-visits
  - [ ] Click "Add New Visit"
  - [ ] Fill required fields
  - [ ] Click "Create"
  - [ ] Verify success message
  - [ ] Verify visit in list

- [ ] **Read Visit**
  - [ ] View visit in DataGrid
  - [ ] Click view icon
  - [ ] Verify all details display
  - [ ] Close dialog

- [ ] **Update Visit**
  - [ ] Click edit icon on visit
  - [ ] Modify at least one field
  - [ ] Click "Update"
  - [ ] Verify success message
  - [ ] Verify changes saved

- [ ] **Delete Visit**
  - [ ] Click delete icon on visit
  - [ ] Confirm deletion
  - [ ] Verify success message
  - [ ] Verify visit removed from list

### Filtering
- [ ] **Filter by Customer**
  - [ ] Go to Filters tab
  - [ ] Select customer from dropdown
  - [ ] Click Apply
  - [ ] Verify only selected customer's visits shown

- [ ] **Filter by Status**
  - [ ] Go to Filters tab
  - [ ] Select status (e.g., "Completed")
  - [ ] Click Apply
  - [ ] Verify only completed visits shown

- [ ] **Filter by Type**
  - [ ] Go to Filters tab
  - [ ] Select type (e.g., "Site Visit")
  - [ ] Click Apply
  - [ ] Verify only that type shown

- [ ] **Filter by Date Range**
  - [ ] Go to Filters tab
  - [ ] Select start and end dates
  - [ ] Click Apply
  - [ ] Verify visits within range shown

- [ ] **Clear Filters**
  - [ ] Click "Clear Filters"
  - [ ] Verify all filters reset
  - [ ] Verify all visits display

### Statistics
- [ ] **Dashboard Tab**
  - [ ] Navigate to Dashboard tab
  - [ ] Verify 4 statistics cards display
  - [ ] Verify numbers are accurate
  - [ ] Verify formatting correct

- [ ] **Update on Change**
  - [ ] Create new visit
  - [ ] Go to Dashboard
  - [ ] Verify statistics updated
  - [ ] Go back to Filters, update visit status
  - [ ] Return to Dashboard
  - [ ] Verify statistics updated again

### Navigation
- [ ] **From Navbar**
  - [ ] Click "📅 Visits" in navbar
  - [ ] Verify /customer-visits page loads
  - [ ] Verify all tabs visible

- [ ] **From Customers**
  - [ ] Go to /customers
  - [ ] Click History button on customer
  - [ ] Verify redirected to /customer-visits
  - [ ] Verify customer context preserved

- [ ] **Back Navigation**
  - [ ] From /customer-visits
  - [ ] Click back button
  - [ ] Verify navigation works

### API Testing
- [ ] **GET all visits**
  ```bash
  curl -H "Authorization: Bearer TOKEN" \
    http://localhost:2026/api/customer-visits
  ```
  - [ ] Response: 200 OK
  - [ ] Response has content array
  - [ ] Response has pagination info

- [ ] **GET single visit**
  ```bash
  curl -H "Authorization: Bearer TOKEN" \
    http://localhost:2026/api/customer-visits/1
  ```
  - [ ] Response: 200 OK
  - [ ] Response has visit details

- [ ] **POST create visit**
  ```bash
  curl -X POST \
    -H "Authorization: Bearer TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"customerId":1,"visitDate":"2026-04-23T14:00:00",...}' \
    http://localhost:2026/api/customer-visits
  ```
  - [ ] Response: 201 Created
  - [ ] Response includes ID
  - [ ] Database record created

- [ ] **PUT update visit**
  - [ ] Response: 200 OK
  - [ ] Changes saved in database

- [ ] **DELETE visit**
  - [ ] Response: 204 No Content
  - [ ] Record deleted from database

### Error Handling
- [ ] **Missing Required Fields**
  - [ ] Try to create visit without customer
  - [ ] Verify error message
  - [ ] Try without visit date
  - [ ] Verify error message

- [ ] **Invalid Customer ID**
  - [ ] Try to create visit with invalid customer ID
  - [ ] Verify 404 or 400 error

- [ ] **Duplicate Delete**
  - [ ] Delete visit
  - [ ] Try to delete same visit again
  - [ ] Verify appropriate error

### UI/UX Testing
- [ ] **Form Validation**
  - [ ] Required fields highlighted
  - [ ] Error messages display
  - [ ] Field types correct (date, select, text)

- [ ] **Responsive Design**
  - [ ] Test on different screen sizes
  - [ ] Verify layout adapts
  - [ ] Verify no horizontal scroll

- [ ] **Dialog Behavior**
  - [ ] Dialog can be closed
  - [ ] Dialog can be submitted
  - [ ] Dialog persists data on error

- [ ] **DataGrid Features**
  - [ ] Sorting works on columns
  - [ ] Pagination works
  - [ ] Search/filter toolbar works
  - [ ] Action buttons work

---

## 📊 Data Integrity Checks

- [ ] **Referential Integrity**
  ```sql
  SELECT COUNT(*) FROM customer_visits WHERE customer_id NOT IN (SELECT id FROM customers);
  -- Should return: 0
  ```

- [ ] **Cascading Delete**
  - [ ] Delete a customer
  - [ ] Verify related visits deleted
  - [ ] Verify no orphaned records

- [ ] **Index Usage**
  ```sql
  SHOW INDEXES FROM customer_visits;
  -- Should show 4 indexes
  ```

- [ ] **Timestamp Accuracy**
  ```sql
  SELECT id, created_at, updated_at FROM customer_visits LIMIT 5;
  -- Verify recent timestamps
  ```

---

## 🔐 Security Checks

- [ ] **Authentication Required**
  - [ ] Try accessing /api/customer-visits without token
  - [ ] Verify 401 Unauthorized

- [ ] **Authorization**
  - [ ] Login with different user roles
  - [ ] Verify appropriate access levels

- [ ] **CORS Configuration**
  - [ ] Verify frontend can reach backend
  - [ ] Check no CORS errors in console

- [ ] **Input Validation**
  - [ ] Try SQL injection in notes field
  - [ ] Verify parameterized queries used
  - [ ] No injection possible

---

## 📈 Performance Testing

- [ ] **Load Time**
  - [ ] Measure page load time: < 2 seconds
  - [ ] Measure API response: < 100ms
  - [ ] Measure DataGrid rendering: < 500ms

- [ ] **Large Dataset**
  - [ ] Test with 1000+ visits
  - [ ] Verify pagination works
  - [ ] Verify no timeout issues

- [ ] **Concurrent Users**
  - [ ] Multiple users accessing simultaneously
  - [ ] Verify data consistency
  - [ ] No race conditions

- [ ] **Database Performance**
  - [ ] Monitor query execution times
  - [ ] Verify indexes used
  - [ ] No slow queries

---

## 📝 Documentation Checks

- [ ] **README Files**
  - [ ] CUSTOMER_VISITS_MODULE.md exists
  - [ ] QUICK_START_VISITS.md exists
  - [ ] IMPLEMENTATION_SUMMARY.md exists
  - [ ] VISITS_MODULE_ARCHITECTURE.md exists

- [ ] **Code Comments**
  - [ ] Classes have JavaDoc
  - [ ] Methods have JavaDoc
  - [ ] Complex logic commented

- [ ] **API Documentation**
  - [ ] All endpoints documented
  - [ ] Request/response examples provided
  - [ ] Error codes documented

- [ ] **Database Documentation**
  - [ ] Schema documented
  - [ ] Foreign keys documented
  - [ ] Indexes documented

---

## 🚀 Deployment Steps

### Production Deployment
1. [ ] Backup database
2. [ ] Stop backend server
3. [ ] Stop frontend dev server
4. [ ] Execute database migration
5. [ ] Build backend (`mvn clean package`)
6. [ ] Deploy backend JAR
7. [ ] Build frontend (`npm run build`)
8. [ ] Deploy frontend to web server
9. [ ] Update DNS/routing if needed
10. [ ] Verify all endpoints accessible
11. [ ] Run smoke tests
12. [ ] Monitor for errors
13. [ ] Document deployment details

### Rollback Plan
- [ ] Database backup available
- [ ] Previous version JAR available
- [ ] Previous version code available
- [ ] Rollback script prepared
- [ ] Deployment log maintained

---

## 📞 Post-Deployment Monitoring

### First 24 Hours
- [ ] Monitor error logs
- [ ] Monitor performance metrics
- [ ] Monitor database connections
- [ ] Monitor API response times
- [ ] Verify all users can access
- [ ] Verify data integrity
- [ ] Address any issues

### First Week
- [ ] Gather user feedback
- [ ] Monitor system stability
- [ ] Optimize slow queries if any
- [ ] Verify backup procedures
- [ ] Document any issues
- [ ] Plan follow-up improvements

### Ongoing
- [ ] Daily log review
- [ ] Weekly performance review
- [ ] Monthly data quality check
- [ ] Quarterly security review
- [ ] Plan feature enhancements

---

## ✅ Final Sign-Off

### Backend Developer
- [ ] Code reviewed
- [ ] Tests pass
- [ ] Documentation complete
- [ ] Ready for deployment
- **Name**: _________________ **Date**: _________

### Frontend Developer
- [ ] Code reviewed
- [ ] Tests pass
- [ ] UI/UX approved
- [ ] Ready for deployment
- **Name**: _________________ **Date**: _________

### QA Lead
- [ ] Functional tests passed
- [ ] Integration tests passed
- [ ] Performance tests acceptable
- [ ] Security checks passed
- **Name**: _________________ **Date**: _________

### Project Manager
- [ ] Requirements met
- [ ] Timeline on schedule
- [ ] Budget approved
- [ ] Stakeholder approved
- **Name**: _________________ **Date**: _________

---

## 📋 Issues Log

| Issue ID | Description | Status | Resolution |
|----------|-------------|--------|-----------|
| | | | |
| | | | |
| | | | |

---

## 🎉 Deployment Complete!

Once all checkboxes are marked, the Customer Visit Module is ready for production use.

**Deployment Status**: ⏳ Pending → ⏳ In Progress → ✅ Complete

**Deployment Date**: _________________
**Deployed By**: _________________
**Version**: 1.0.0
**Status**: Production Ready ✅

---

## 📞 Support Contacts

- **Backend Issues**: [Developer Name] - [Email]
- **Frontend Issues**: [Developer Name] - [Email]
- **Database Issues**: [DBA Name] - [Email]
- **General Support**: [Support Team] - [Email]

---

**Document Prepared By**: _________________
**Date**: _________________
**Version**: 1.0
**Last Updated**: _________________


