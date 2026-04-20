# Quick Start Guide - Channel Partner Management System

## 🚀 Current Status
✅ **Application is RUNNING and READY to use**

---

## 📱 Access Points

| Component | URL | Status |
|-----------|-----|--------|
| Frontend (UI) | http://localhost:5173 | ✅ Running |
| Backend API | http://localhost:2026 | ✅ Running |
| Database | localhost:3306/channel_partner_db | ✅ Connected |

---

## 🔐 Login Credentials

Use these credentials to access the application:

### Admin Account
```
Username: admin
Password: admin123
Role: ADMIN
```

### Partner Account
```
Username: partner
Password: partner123
Role: PARTNER
```

---

## 📋 Available Pages/Features

1. **Dashboard** - Overview with statistics
   - Total Builders
   - Total Projects
   - Total Customers
   - Total Earnings

2. **Builders** - Manage builder companies
   - View all builders with pagination
   - Add new builder
   - Edit builder details
   - Delete builder

3. **Projects** - Manage real estate projects
   - View all projects with pagination
   - Add new project
   - Edit project details
   - Delete project
   - Price range management

4. **Customers** - Manage customer leads
   - View all customers with pagination
   - Add new customer
   - Edit customer details
   - Delete customer
   - Track follow-up dates
   - Update customer status

5. **Sales** - View sales records
   - Sales history
   - Commission tracking
   - Total earnings

---

## ⚙️ If You Need to Restart Servers

### Restart Backend (Spring Boot)
```powershell
# Stop all Java processes
Stop-Process -Name "java" -Force

# Navigate to project directory
cd C:\Users\Admin\IdeaProjects\channel_partner

# Run Maven
mvn clean spring-boot:run
```

### Restart Frontend (React/Vite)
```powershell
# Stop all Node processes
Stop-Process -Name "node" -Force

# Navigate to frontend directory
cd C:\Users\Admin\IdeaProjects\channel_partner\frontend

# Start development server
npm run dev
```

---

## 🔄 Reset Users (If Login Issues)

If you encounter login issues, you can reinitialize users by calling:

```bash
# Using PowerShell
$headers = @{"Content-Type"="application/json"}
$response = Invoke-WebRequest -Uri "http://localhost:2026/api/init/users" -Method POST -Headers $headers
$response.Content
```

This will create fresh admin and partner users with the default credentials.

---

## 📝 Common Tasks

### Add a New Builder
1. Click on "Builders" in the navigation menu
2. Click the "Add Builder" button
3. Fill in the form:
   - Name
   - Contact Person
   - Email
   - Phone
   - Address
4. Click "Add" to save

### Create a New Project
1. Click on "Projects" in the navigation menu
2. Click the "Add Project" button
3. Fill in the form:
   - Project Name
   - Location
   - Description
   - Min Price
   - Max Price
   - Select Builder
4. Click "Add" to save

### Add a Customer Lead
1. Click on "Customers" in the navigation menu
2. Click the "Add Customer" button
3. Fill in the form:
   - Name
   - Email
   - Phone
   - Address
   - Date of Inquiry
   - Follow Up Date
   - Status (Interested/Visited/Booked/Not Interested)
   - Select Project
4. Click "Add" to save

### Update an Entry
1. Navigate to the list (Builders/Projects/Customers)
2. Click the pencil icon (Edit) on the row you want to edit
3. Modify the details in the dialog
4. Click "Update" to save

### Delete an Entry
1. Navigate to the list (Builders/Projects/Customers)
2. Click the trash icon (Delete) on the row
3. Confirm the deletion in the dialog

---

## 🔍 Troubleshooting

### Issue: Login fails with "Invalid username or password"
**Solution**: Call the init endpoint to reset users
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:2026/api/init/users" -Method POST
```

### Issue: Pages not loading or showing errors
**Solution**: 
1. Open browser DevTools (F12)
2. Check the Console tab for error messages
3. Clear browser cache and localStorage
4. Refresh the page (Ctrl+R)

### Issue: Backend API not responding
**Solution**:
1. Check if Java process is running: `Get-Process java`
2. Verify port 2026 is not blocked
3. Restart the backend server

### Issue: Frontend UI not loading
**Solution**:
1. Check if Node process is running: `Get-Process node`
2. Verify port 5173 is accessible
3. Clear browser cache
4. Restart the frontend server

---

## 📊 Database Info

- **Database**: MySQL
- **Database Name**: channel_partner_db
- **Host**: localhost:3306
- **User**: root
- **Password**: (empty)

Tables created:
- users
- builders
- projects
- customers
- sales
- follow_ups
- visits

---

## 🛠️ Technology Stack

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Security with JWT
- MySQL 8.0
- Maven

### Frontend
- React 18
- Material-UI v5
- Vite
- Axios
- React Router v6

---

## 📚 File Structure

```
channel_partner/
├── frontend/                    # React frontend
│   ├── src/
│   │   ├── pages/             # Login, Dashboard, Builders, etc.
│   │   ├── components/        # Reusable components
│   │   ├── context/           # Authentication context
│   │   └── api/               # API client configuration
│   └── package.json
├── src/
│   └── main/
│       ├── java/              # Backend source code
│       │   └── com/example/channelpartner/
│       │       ├── controller/ # REST controllers
│       │       ├── service/   # Business logic
│       │       ├── model/     # Entity classes
│       │       ├── repository/ # Database access
│       │       └── config/    # Configuration classes
│       └── resources/          # Properties and SQL scripts
└── pom.xml                     # Maven configuration

```

---

## ✅ Features Implemented

- [x] User authentication with JWT tokens
- [x] Role-based access control (Admin, Partner)
- [x] Builder management (CRUD with pagination)
- [x] Project management (CRUD with pagination)
- [x] Customer management (CRUD with pagination)
- [x] Sales tracking
- [x] Follow-up date tracking
- [x] Modern UI with Material Design
- [x] Responsive layout
- [x] Form validation
- [x] Error handling
- [x] Pagination support
- [x] Automatic user initialization

---

## 🎯 Next Session

When you start the application in your next session:

1. Both servers will start automatically (if running background processes)
2. Or manually start them using the commands above
3. Access the application at http://localhost:5173
4. Login with admin/admin123 or partner/partner123

---

**Last Updated**: April 5, 2026
**Version**: 1.0.0

