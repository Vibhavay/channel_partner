# 🚀 Sales Details Module - Quick Reference

## ⚡ 5-Minute Setup

### Step 1: Database
```bash
mysql -u root -p channel_partner_db1 < database/migration_sales_details.sql
```

### Step 2: Backend
```bash
mvn clean install
mvn spring-boot:run
```

### Step 3: Frontend  
```bash
cd frontend
npm install
npm run dev
```

### Step 4: Test
- Open http://localhost:5173
- Click "💼 Purchases" in navbar
- Create a test sales record

---

## 📋 API Quick Reference

### Base URL
```
http://localhost:2026/api/sales-details
```

### Create Sales Record
```bash
curl -X POST http://localhost:2026/api/sales-details \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": 1,
    "projectName": "Sunset Towers",
    "flatNo": "A-101",
    "floorNo": "1",
    "flatType": "2BHK",
    "agreementValue": 5000000,
    "bookingAmount": 1000000,
    "agreementDate": "2026-04-23",
    "possessionDate": "2026-12-31",
    "paymentStatus": "Partial"
  }'
```

### Get All Sales
```bash
curl http://localhost:2026/api/sales-details?page=0&size=10 \
  -H "Authorization: Bearer TOKEN"
```

### Get Customer Sales
```bash
curl http://localhost:2026/api/sales-details/customer/1 \
  -H "Authorization: Bearer TOKEN"
```

### Get Statistics
```bash
curl http://localhost:2026/api/sales-details/stats/summary \
  -H "Authorization: Bearer TOKEN"
```

---

## 🎯 Key API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/` | GET | List all |
| `/{id}` | GET | Get one |
| `/` | POST | Create |
| `/{id}` | PUT | Update |
| `/{id}` | DELETE | Delete |
| `/customer/{customerId}` | GET | By customer |
| `/payment-status/{status}` | GET | By status |
| `/stats/summary` | GET | Statistics |

---

## 🗂️ File Locations

### Backend
```
src/main/java/com/example/channelpartner/
├── model/SalesDetails.java
├── dto/SalesDetailsDTO.java
├── repository/SalesDetailsRepository.java
├── service/SalesDetailsService.java
└── controller/SalesDetailsController.java
```

### Frontend
```
frontend/src/
├── pages/SalesDetails.jsx
├── api/salesDetailsAPI.js
├── App.jsx (modified)
└── components/Navbar.jsx (modified)
```

### Database
```
database/migration_sales_details.sql
```

---

## 🧪 Testing Workflows

### Test 1: Create Sales
1. Navigate to /sales-details
2. Click "Add New Sales Record"
3. Fill form with:
   - Customer: Select from dropdown
   - Project Name: "Test Project"
   - Flat No: "A-101"
   - Agreement Value: 5000000
   - Booking Amount: 1000000
4. Click "Create"
5. Verify in list

### Test 2: Update Flat Purchase
1. Find record in DataGrid
2. Click edit icon
3. Change booking amount to 5000000
4. Click "Update"
5. Verify payment status changed to "Completed"
6. Verify remaining amount = 0

### Test 3: Filter Sales
1. Go to Filters tab
2. Select payment status "Partial"
3. Click "Apply Filters"
4. Verify only partial payments shown

### Test 4: View Statistics
1. Go to Dashboard tab
2. Check Completed, Partial, Pending counts
3. Create new record
4. Verify statistics updated

---

## 📊 Database Schema Quick Look

```sql
CREATE TABLE sales_details (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT NOT NULL FK,
    project_name VARCHAR(100),
    flat_no VARCHAR(50),
    agreement_value DECIMAL(15,2),
    booking_amount DECIMAL(15,2),
    remaining_amount DECIMAL(15,2) AUTO_CALC,
    payment_status VARCHAR(50) AUTO_UPDATE,
    agreement_date DATE,
    possession_date DATE,
    created_at DATETIME AUTO,
    updated_at DATETIME AUTO
);
```

---

## 🔧 Configuration

### Database Connection
```properties
# application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/channel_partner_db1
spring.datasource.username=root
spring.datasource.password=
```

### API Base URL (Frontend)
```javascript
// frontend/src/api/apiClient.js
const API_URL = 'http://localhost:2026';
```

---

## 🐛 Troubleshooting

### Issue: 404 API Error
**Solution:**
- Verify backend running on port 2026
- Check endpoint URL matches `/api/sales-details`
- Verify authentication token

### Issue: Database Connection Error
**Solution:**
- Verify MySQL running
- Check database credentials
- Run migration script again

### Issue: Table Not Found
**Solution:**
- Execute: `mysql -u root -p channel_partner_db1 < database/migration_sales_details.sql`
- Verify: `DESCRIBE sales_details;`

### Issue: Frontend Not Loading Data
**Solution:**
- Check browser DevTools Network tab
- Verify backend API responding
- Clear cache: `npm cache clean --force`

---

## 📊 Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| customer_id | FK | Link to customer |
| project_name | String | Property project name |
| flat_no | String | Flat/Unit number |
| flat_type | String | 1BHK, 2BHK, 3BHK |
| carpet_area | Decimal | Size in sq ft |
| agreement_value | Decimal | Total price |
| booking_amount | Decimal | Amount paid |
| remaining_amount | Decimal | Auto-calculated |
| payment_status | String | Pending/Partial/Completed |
| agreement_date | Date | Contract date |
| possession_date | Date | When buyer takes possession |

---

## 💰 Payment Status Logic

```
Booking Amount = 0
  → Status: "Pending" (red)

0 < Booking Amount < Agreement Value
  → Status: "Partial" (yellow)

Booking Amount >= Agreement Value
  → Status: "Completed" (green)

Remaining Amount = Agreement Value - Booking Amount
```

---

## 🔄 Integration

### With Customer Module
```javascript
// Navigate from customer to their sales
/customers/{customerId}/sales
```

### With Call Module
```javascript
// Track post-purchase follow-ups
GET /calls/customer/{customerId}
```

### With Visit Module
```javascript
// Manage possession-related visits
GET /customer-visits/customer/{customerId}
```

---

## 📱 UI Navigation

```
Home → 💼 Purchases (in navbar)
  ↓
Dashboard Tab → View statistics
All Sales Tab → View/Edit/Delete
Filters Tab → Advanced filtering
```

---

## 🎯 Use Cases

### Use Case 1: Track New Flat Sale
1. Customer purchases flat
2. Add sales record with:
   - Agreement value
   - Booking amount (initial payment)
3. System auto-calculates remaining
4. Status auto-set to "Pending" or "Partial"

### Use Case 2: Record Payment
1. Customer makes additional payment
2. Edit sales record
3. Increase booking amount
4. System updates:
   - Remaining amount
   - Payment status

### Use Case 3: Track Possession
1. View upcoming possessions
2. See possession dates
3. Link to visit module for site visits
4. Schedule follow-up calls

---

## 📈 Reports Available

### Dashboard Statistics
- Total Completed Sales
- Total Partial Payments
- Total Pending Payments
- Grand Total

### Filter Reports
- Sales by Customer
- Sales by Status
- Sales by Project
- Sales by Date Range

### Upcoming
- Possession schedule
- Pending payments
- Payment reminders

---

## ✅ Verification Checklist

- [ ] Database table created
- [ ] Backend APIs responding
- [ ] Frontend page loading
- [ ] Can create record
- [ ] Can edit record
- [ ] Can delete record
- [ ] Can filter records
- [ ] Statistics updating
- [ ] Payment status auto-updating
- [ ] Remaining amount auto-calculating

---

## 🚀 Performance Tips

### Backend
- Uses database indexes
- Paginated queries
- Auto-cache statistics
- Lazy loading relationships

### Frontend
- Pagination (10 records/page)
- Tab-based lazy loading
- Real-time validation
- Efficient re-renders

### Database
- 5 indexes on key fields
- Cascade delete
- Foreign key constraints
- Optimized queries

---

## 📞 Support

### Common Questions

**Q: How to calculate remaining amount?**
A: Automatic! Remaining = Agreement Value - Booking Amount

**Q: Can one customer have multiple sales?**
A: Yes! One-to-many relationship

**Q: How payment status updated?**
A: Automatic! Based on booking amount vs agreement value

**Q: Can I export sales data?**
A: Future feature (use grid toolbar search for now)

---

## 🎉 You're Ready!

The Sales Details module is fully functional and ready for production use.

**Happy Selling!** 💼✨


