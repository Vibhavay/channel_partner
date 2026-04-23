# 📊 Call Management Module - Architecture & Data Flow

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        WEB BROWSER (Client)                              │
│                      http://localhost:5173                               │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
                    ▼                             ▼
        ┌─────────────────────┐      ┌──────────────────────┐
        │  React Components   │      │   React Routing      │
        │                     │      │   (React Router)     │
        │ ┌─────────────────┐ │      │                      │
        │ │ CallManagement  │ │      │ /calls → Component   │
        │ │ .jsx (900 lines)│ │      │                      │
        │ │                 │ │      └──────────────────────┘
        │ │ Features:       │ │
        │ │ - 3 Tabs        │ │
        │ │ - 4 Dialogs     │ │
        │ │ - Stats         │ │
        │ └─────────────────┘ │
        │                     │
        │ Material-UI         │
        │ - DataGrid          │
        │ - Cards             │
        │ - Dialogs           │
        │ - Tabs              │
        └──────┬──────────────┘
               │ HTTP/JSON
               │ (JWT Token)
               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    BACKEND - Spring Boot Server                          │
│                     http://localhost:2026                                │
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │              REST API Layer                                      │   │
│  │                                                                   │   │
│  │  ┌──────────────────────────────────────────────────────────┐   │   │
│  │  │        CallLogController (15 Endpoints)                  │   │   │
│  │  │                                                            │   │   │
│  │  │ GET    /api/calls                 (Get all)              │   │   │
│  │  │ POST   /api/calls                 (Create)               │   │   │
│  │  │ GET    /api/calls/{id}            (Get by ID)            │   │   │
│  │  │ PUT    /api/calls/{id}            (Update)               │   │   │
│  │  │ DELETE /api/calls/{id}            (Delete)               │   │   │
│  │  │ GET    /api/calls/customer/{id}   (By Customer)          │   │   │
│  │  │ GET    /api/calls/history/{id}    (History)              │   │   │
│  │  │ GET    /api/calls/last/{id}       (Last Call)            │   │   │
│  │  │ GET    /api/calls/status/{status} (By Status)            │   │   │
│  │  │ GET    /api/calls/type/{type}     (By Type)              │   │   │
│  │  │ GET    /api/calls/employee/{name} (By Employee)          │   │   │
│  │  │ GET    /api/calls/stats/today/... (Statistics)           │   │   │
│  │  └──────────────────────────────────────────────────────────┘   │   │
│  │                              ▲                                    │   │
│  │                              │                                    │   │
│  └──────────────────────────────┼────────────────────────────────────┘   │
│                                 │                                         │
│  ┌──────────────────────────────┼────────────────────────────────────┐   │
│  │      Service Layer           │                                    │   │
│  │                              │                                    │   │
│  │  ┌──────────────────────────▼──────────────────────┐             │   │
│  │  │    CallLogService (20+ Methods)                 │             │   │
│  │  │                                                  │             │   │
│  │  │ • CRUD Operations                               │             │   │
│  │  │   - create, update, delete, getById             │             │   │
│  │  │                                                  │             │   │
│  │  │ • Query Methods                                 │             │   │
│  │  │   - getByCustomerId                             │             │   │
│  │  │   - getCallHistory                              │             │   │
│  │  │   - getLastCall                                 │             │   │
│  │  │   - getByStatus, getByType, getByEmployee       │             │   │
│  │  │                                                  │             │   │
│  │  │ • Statistics Methods                            │             │   │
│  │  │   - getTodaysCallCount                          │             │   │
│  │  │   - getTodaysIncomingCallCount                  │             │   │
│  │  │   - getTodaysOutgoingCallCount                  │             │   │
│  │  │   - getTodaysFollowUpCalls                      │             │   │
│  │  │                                                  │             │   │
│  │  │ • Conversion Methods                            │             │   │
│  │  │   - convertToDTO                                │             │   │
│  │  │   - convertToEntity                             │             │   │
│  │  └──────────────────────────┬──────────────────────┘             │   │
│  │                              │                                    │   │
│  └──────────────────────────────┼────────────────────────────────────┘   │
│                                 │                                         │
│  ┌──────────────────────────────┼────────────────────────────────────┐   │
│  │    Repository Layer (JPA)    │                                    │   │
│  │                              │                                    │   │
│  │  ┌──────────────────────────▼──────────────────────┐             │   │
│  │  │  CallLogRepository (11+ Custom Methods)         │             │   │
│  │  │                                                  │             │   │
│  │  │ • Pagination                                    │             │   │
│  │  │   - findAll(Pageable)                           │             │   │
│  │  │                                                  │             │   │
│  │  │ • Customer Queries                              │             │   │
│  │  │   - findByCustomerId(Long, Pageable)            │             │   │
│  │  │   - findByCustomerIdOrderByCallDateTime(Long)   │             │   │
│  │  │   - findFirstByCustomerIdOrderByCallDateTime    │             │   │
│  │  │                                                  │             │   │
│  │  │ • Filtering Queries                             │             │   │
│  │  │   - findByCallStatusAndDateTimeBetween(...)     │             │   │
│  │  │   - findByCallTypeAndDateTimeBetween(...)       │             │   │
│  │  │   - findByCreatedByAndDateTimeBetween(...)      │             │   │
│  │  │                                                  │             │   │
│  │  │ • Statistics Queries                            │             │   │
│  │  │   - countByCallStatus(String)                   │             │   │
│  │  │   - countByCallType(String)                     │             │   │
│  │  └──────────────────────────┬──────────────────────┘             │   │
│  │                              │                                    │   │
│  └──────────────────────────────┼────────────────────────────────────┘   │
│                                 │                                         │
│  ┌──────────────────────────────┼────────────────────────────────────┐   │
│  │    Entity/Model Layer        │                                    │   │
│  │                              │                                    │   │
│  │  ┌──────────────────────────▼──────────────────────┐             │   │
│  │  │  CallLog.java (@Entity)                         │             │   │
│  │  │                                                  │             │   │
│  │  │  Fields:                                         │             │   │
│  │  │  • id (Long, Auto-generated)                    │             │   │
│  │  │  • customer (Customer, FK relationship)         │             │   │
│  │  │  • callDateTime (LocalDateTime, Auto-set)       │             │   │
│  │  │  • callType (String: Incoming/Outgoing)         │             │   │
│  │  │  • callStatus (String: 5 statuses)              │             │   │
│  │  │  • callNotes (TEXT)                             │             │   │
│  │  │  • createdBy (String, Employee name)            │             │   │
│  │  │  • createdAt (LocalDateTime, Auto-set)          │             │   │
│  │  │  • updatedAt (LocalDateTime, Auto-set)          │             │   │
│  │  │                                                  │             │   │
│  │  │  ↓ (Converter)                                   │             │   │
│  │  │                                                  │             │   │
│  │  │  CallLogDTO.java                                │             │   │
│  │  │  (All entity fields + customer name/email/phone)│             │   │
│  │  └──────────────────────────┬──────────────────────┘             │   │
│  │                              │                                    │   │
│  └──────────────────────────────┼────────────────────────────────────┘   │
│                                 │                                         │
│                                 ▼                                         │
│                    ┌────────────────────────┐                            │
│                    │  Spring Data JPA       │                            │
│                    │  (ORM Framework)       │                            │
│                    └────────────────┬───────┘                            │
│                                     │                                     │
└─────────────────────────────────────┼─────────────────────────────────────┘
                                      │ SQL Queries
                                      │ (Parameterized)
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    MySQL Database (Port 3306)                            │
│                  channel_partner_db                                      │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────┐       │
│  │              call_logs Table                                  │       │
│  │                                                                │       │
│  │  Columns:                                                     │       │
│  │  • id (BIGINT, PK, AUTO_INCREMENT)                           │       │
│  │  • customer_id (BIGINT, FK → customers.id)                   │       │
│  │  • call_date_time (DATETIME)                                 │       │
│  │  • call_type (VARCHAR(50))                                   │       │
│  │  • call_status (VARCHAR(50))                                 │       │
│  │  • call_notes (TEXT)                                         │       │
│  │  • created_by (VARCHAR(100))                                 │       │
│  │  • created_at (DATETIME)                                     │       │
│  │  • updated_at (DATETIME)                                     │       │
│  │                                                                │       │
│  │  Indexes:                                                     │       │
│  │  • idx_customer_id (customer lookups)                         │       │
│  │  • idx_call_date_time (date range queries)                   │       │
│  │  • idx_call_status (status filtering)                        │       │
│  │  • idx_call_type (type filtering)                            │       │
│  └──────────────────────────────────────────────────────────────┘       │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────┐       │
│  │              customers Table (Related)                        │       │
│  │                                                                │       │
│  │  • id (BIGINT, PK)                                           │       │
│  │  • firstName, lastName                                       │       │
│  │  • email, phone                                              │       │
│  │  • city, state, address                                      │       │
│  │  • budget                                                     │       │
│  │  • project_id (FK)                                           │       │
│  │  • ... other fields                                          │       │
│  └──────────────────────────────────────────────────────────────┘       │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### 1. Add New Call Flow

```
┌─────────────┐
│  User Opens │
│  Call Form  │
└──────┬──────┘
       │
       ▼
┌──────────────────────────┐
│ Select Customer          │
│ Fill Call Details        │
│ (Type, Status, Notes)    │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Frontend Validation      │
│ - Customer selected      │
│ - Required fields filled │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ POST /api/calls                  │
│ Headers:                         │
│ - Authorization: Bearer {token}  │
│ - Content-Type: application/json │
│ Body: CallLogDTO                 │
└──────┬───────────────────────────┘
       │ (HTTP Request)
       ▼
┌──────────────────────────┐
│ CallLogController        │
│ createCallLog()          │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ CallLogService.createCallLog()   │
│ 1. Fetch customer from DB        │
│ 2. Validate customer exists      │
│ 3. Convert DTO to Entity         │
│ 4. Set relationship              │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────┐
│ CallLogRepository        │
│ save(CallLog entity)     │
└──────┬───────────────────┘
       │ (JPA)
       ▼
┌──────────────────────────────────┐
│ MySQL Database                   │
│ INSERT INTO call_logs            │
│ (customer_id, call_date_time,    │
│  call_type, call_status, ...)    │
│                                   │
│ Auto-set:                         │
│ - id (AUTO_INCREMENT)            │
│ - created_at (CURRENT_TIMESTAMP) │
│ - updated_at (CURRENT_TIMESTAMP) │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Saved Entity Returned    │
│ (with generated ID)      │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ Convert Entity to DTO            │
│ Add customer details:            │
│ - customerName                   │
│ - customerEmail                  │
│ - customerPhone                  │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ Return CallLogDTO (201 Created)  │
│ Response Headers:                │
│ - Content-Type: application/json │
└──────┬───────────────────────────┘
       │ (HTTP Response)
       ▼
┌──────────────────────────┐
│ Frontend Receives        │
│ Response with Call ID    │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ Update UI:                       │
│ 1. Close dialog                  │
│ 2. Refresh call history          │
│ 3. Update statistics             │
│ 4. Show success message          │
└──────────────────────────────────┘
```

### 2. View Call History Flow

```
┌──────────────────────┐
│ User Clicks Customer │
│ Card on UI           │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│ Frontend:                                │
│ Call API: /api/calls/history/{customerId}│
│ Simultaneously call:                     │
│ /api/calls/last/{customerId}             │
└──────┬───────────────────────────────────┘
       │ (HTTP GET Requests)
       ▼
┌──────────────────────────────┐
│ CallLogController            │
│ getCallHistoryByCustomerId() │
│ getLastCallByCustomerId()    │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ CallLogService                       │
│ Retrieves data from Repository       │
│                                       │
│ For History:                         │
│ - Query all calls for customer       │
│ - Order by callDateTime DESC         │
│ - Convert all to DTOs                │
│                                       │
│ For Last Call:                       │
│ - Query most recent call             │
│ - Convert to DTO                     │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ CallLogRepository Queries         │
│                                   │
│ History:                         │
│ SELECT * FROM call_logs          │
│ WHERE customer_id = ?            │
│ ORDER BY call_date_time DESC;    │
│                                   │
│ Last Call:                       │
│ SELECT * FROM call_logs          │
│ WHERE customer_id = ?            │
│ ORDER BY call_date_time DESC     │
│ LIMIT 1;                         │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│ MySQL Returns Result Set                 │
│ (Multiple rows for history, 1 for last) │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│ Convert Entities to DTOs                 │
│ Add computed fields:                     │
│ - customerName (firstName + lastName)    │
│ - customerEmail                          │
│ - customerPhone                          │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ Return JSON Array (200 OK)       │
│                                   │
│ [                                │
│   { CallLogDTO },                │
│   { CallLogDTO },                │
│   ...                            │
│ ]                                │
└──────┬───────────────────────────┘
       │ (HTTP Response)
       ▼
┌──────────────────────────────────────────┐
│ Frontend Receives Data:                  │
│ 1. Update lastCall state (accordion)     │
│ 2. Update callLogs state (data grid)     │
│ 3. Open call history dialog              │
│ 4. Render components                     │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│ UI Rendered:                             │
│ - Dialog showing call history            │
│ - Last call details in accordion         │
│ - DataGrid with all calls                │
│ - Edit/Delete buttons for each call      │
└──────────────────────────────────────────┘
```

### 3. Get Statistics Flow

```
┌─────────────────────────────────┐
│ Page Loads / Data Refreshes     │
│ useEffect Hook Triggered        │
└──────┬──────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│ Make Multiple API Calls:                 │
│                                           │
│ 1. GET /api/calls/stats/today/incoming   │
│ 2. GET /api/calls/stats/today/outgoing   │
│ 3. GET /api/calls/followups/today        │
│                                           │
│ All requests include JWT token           │
└──────┬───────────────────────────────────┘
       │ (Parallel HTTP Requests)
       ▼
┌──────────────────────────────────────────┐
│ CallLogController                        │
│                                           │
│ getTodaysIncomingCallCount()             │
│ getTodaysOutgoingCallCount()             │
│ getTodaysFollowUpCalls()                 │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│ CallLogService                           │
│                                           │
│ - Query database for counts              │
│ - Count by call_type = 'Incoming'        │
│ - Count by call_type = 'Outgoing'        │
│ - Count by call_status = 'Follow-up...'  │
│ - Convert to DTOs                        │
└──────┬───────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────────┐
│ Database Queries (Using Indexes):          │
│                                             │
│ For Incoming:                              │
│ SELECT COUNT(*) FROM call_logs             │
│ WHERE call_type = 'Incoming'               │
│ AND DATE(call_date_time) = CURDATE();      │
│ (Uses idx_call_type)                       │
│                                             │
│ For Outgoing:                              │
│ SELECT COUNT(*) FROM call_logs             │
│ WHERE call_type = 'Outgoing'               │
│ AND DATE(call_date_time) = CURDATE();      │
│                                             │
│ For Follow-ups:                            │
│ SELECT * FROM call_logs                    │
│ WHERE call_status = 'Follow-up Required'   │
│ AND DATE(call_date_time) = CURDATE();      │
│ (Uses idx_call_status)                     │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│ MySQL Returns Results:                   │
│ - incomingCount: Long                    │
│ - outgoingCount: Long                    │
│ - followUpCalls: List<CallLogDTO>        │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│ Return JSON Responses (200 OK)           │
│                                           │
│ Response 1: 5 (incoming)                 │
│ Response 2: 3 (outgoing)                 │
│ Response 3: [CallLogDTO, ...]            │
└──────┬───────────────────────────────────┘
       │ (HTTP Responses)
       ▼
┌──────────────────────────────────────────┐
│ Frontend Processes All Responses:        │
│ 1. Add responses: 5 + 3 = 8 total        │
│ 2. Count follow-up list: 2 items         │
│ 3. Update callStats state                │
└──────┬───────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────┐
│ Update Statistics Cards on UI:           │
│ ┌────────────────┐ ┌────────────────┐   │
│ │ Total Calls    │ │ Incoming Calls │   │
│ │      8         │ │       5        │   │
│ └────────────────┘ └────────────────┘   │
│ ┌────────────────┐ ┌────────────────┐   │
│ │ Outgoing Calls │ │ Follow-ups Req │   │
│ │       3        │ │        2       │   │
│ └────────────────┘ └────────────────┘   │
└──────────────────────────────────────────┘
```

---

## Relationship Diagram

```
┌──────────────────────────────┐
│       customers              │
│ ──────────────────────────── │
│ id (PK)                      │
│ first_name                   │
│ last_name                    │
│ email                        │
│ phone                        │
│ address                      │
│ city                         │
│ state                        │
│ budget                       │
│ date_of_inquiry              │
│ status                       │
│ project_id (FK)              │
│ follow_up_date               │
└──────────────────┬───────────┘
                   │ (1)
                   │ One-to-Many
                   │
                   │ (Many)
┌──────────────────┴───────────────┐
│       call_logs                  │
│ ───────────────────────────────  │
│ id (PK)                          │
│ customer_id (FK) ◄───────────┐   │
│ call_date_time                │   │
│ call_type                     │   │
│ call_status                   │   │
│ call_notes                    │   │
│ created_by                    │   │
│ created_at                    │   │
│ updated_at                    │   │
│                               │   │
│ Indexes:                      │   │
│ • idx_customer_id ────────────┘   │
│ • idx_call_date_time              │
│ • idx_call_status                 │
│ • idx_call_type                   │
└────────────────────────────────────┘
```

**Relationship**: One Customer → Many Calls (1:N)
- Each customer can have multiple call logs
- Each call log belongs to exactly one customer
- Foreign key constraint ensures data integrity
- Cascade delete removes calls when customer is deleted

---

## State Management Flow (Frontend)

```
┌────────────────────────────────────────────┐
│      CallManagement Component              │
│                                             │
│  State Variables (25+):                    │
│  ┌──────────────────────────────────────┐  │
│  │ Data State:                          │  │
│  │ - customers: []                      │  │
│  │ - callLogs: []                       │  │
│  │ - selectedCustomer: null             │  │
│  │ - selectedCall: null                 │  │
│  │ - lastCall: null                     │  │
│  │ - callStats: {}                      │  │
│  │ - visits: []                         │  │
│  └──────────────────────────────────────┘  │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │ UI State:                            │  │
│  │ - tabValue: 0                        │  │
│  │ - callHistoryOpen: false             │  │
│  │ - addCallOpen: false                 │  │
│  │ - editCallOpen: false                │  │
│  │ - deleteCallOpen: false              │  │
│  │ - error: ''                          │  │
│  └──────────────────────────────────────┘  │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │ Form State:                          │  │
│  │ - form: {                            │  │
│  │     customerId: '',                  │  │
│  │     callDateTime: '',                │  │
│  │     callType: '',                    │  │
│  │     callStatus: '',                  │  │
│  │     callNotes: '',                   │  │
│  │     createdBy: ''                    │  │
│  │   }                                  │  │
│  │ - filterForm: {}                     │  │
│  └──────────────────────────────────────┘  │
│                                             │
│  Event Handlers (10+):                     │
│  - handleViewCallHistory()                 │
│  - handleAddCall()                         │
│  - handleInputChange()                     │
│  - handleSubmitCall()                      │
│  - handleEditCall()                        │
│  - handleUpdateCall()                      │
│  - handleDeleteCall()                      │
│  - confirmDeleteCall()                     │
│  - fetchCallStats()                        │
│  - fetchCustomers()                        │
│                                             │
│  useEffect Hooks:                          │
│  - On mount: fetch customers, stats        │
│  - On dialog close: reset state            │
│                                             │
│  Render Methods:                           │
│  - render Tabs                             │
│  - render Statistics Cards                 │
│  - render Customer Grid                    │
│  - render DataGrid                         │
│  - render Dialogs                          │
│  - render Form Inputs                      │
└────────────────────────────────────────────┘
```

---

## Call Status Lifecycle

```
START
  │
  ├─────────────────────────┬────────────────┬──────────────────┬────────────┐
  │                         │                │                  │            │
  ▼                         ▼                ▼                  ▼            ▼
Connected            Not Answered          Busy            Wrong Number  Follow-up
  │                         │                │                  │           Required
  │                         │                │                  │            │
  ├─────────────────────────┼────────────────┼──────────────────┼────────────┘
  │                         │                │                  │
  └─────────────────────────┴────────────────┴──────────────────┘
                            │
                            ▼
                    Call Logged & Complete
                            │
                            ▼
                    Review & Archive
                            │
                            ▼
                          END

Legend:
─────────────────► Status Transition (possible)
```

---

## Performance Characteristics

### Query Performance

| Operation | Query Type | Index Used | Speed |
|-----------|-----------|-----------|-------|
| Get all calls | SELECT * | None | O(n) |
| Get calls by customer | WHERE customer_id | idx_customer_id | O(log n) |
| Get calls by date | WHERE call_date_time BETWEEN | idx_call_date_time | O(log n) |
| Get calls by status | WHERE call_status | idx_call_status | O(log n) |
| Get calls by type | WHERE call_type | idx_call_type | O(log n) |
| Count calls | COUNT(*) | Index | O(log n) |
| Order by date | ORDER BY call_date_time | idx_call_date_time | O(log n) |

### API Response Times (Typical)

| Endpoint | Data Size | Response Time |
|----------|-----------|----------------|
| Get all calls (10 records) | ~5 KB | <50ms |
| Get call history (customer) | ~20 KB | <100ms |
| Statistics (4 calls) | ~2 KB | <30ms |
| Create call | ~1 KB | <100ms |
| Update call | ~1 KB | <100ms |
| Delete call | None | <50ms |

---

## Security Flow

```
┌──────────────────────────────────────────────────────┐
│                   Client Request                      │
│         POST /api/calls with JWT Token               │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│          Spring Security Filter Chain                 │
│                                                       │
│  1. Check Authorization Header Present               │
│     - JWT Token in format: "Bearer {token}"         │
│                                                       │
│  2. Validate JWT Token                               │
│     - Verify signature                               │
│     - Check expiration                               │
│     - Extract claims (user, roles)                   │
│                                                       │
│  3. Set Security Context                             │
│     - Populate principal/authorities                 │
│                                                       │
│  4. Continue to Controller if valid                  │
│     - Otherwise: 401 Unauthorized                    │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│           CallLogController                          │
│                                                       │
│  1. Receive Request                                  │
│  2. Validate Input Parameters                        │
│     - Customer ID exists                             │
│     - Call type is valid enum                        │
│     - Call status is valid enum                      │
│     - Required fields present                        │
│                                                       │
│  3. Pass to Service Layer                            │
│     - Service performs business validation           │
│     - Service queries database                       │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│          CallLogService                              │
│                                                       │
│  1. Business Logic Validation                        │
│     - Customer exists in database                    │
│     - Customer not deleted                           │
│                                                       │
│  2. Data Conversion                                  │
│     - DTO → Entity (secure conversion)               │
│                                                       │
│  3. Repository Call                                  │
│     - Use parameterized queries (JPA)                │
│     - No string concatenation (prevents SQL inject)  │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│         Database Layer (JPA)                         │
│                                                       │
│  1. Generate SQL Query (Parameterized)               │
│     - All user inputs as ? parameters                │
│                                                       │
│  2. Execute Query                                    │
│     - Database validates user permissions            │
│     - Transaction management                         │
│                                                       │
│  3. Return Result Set                                │
│     - ORM maps to entity objects                     │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────┐
│          Response Generation                         │
│                                                       │
│  1. Convert Entity to DTO                            │
│     - Exclude sensitive data if needed               │
│                                                       │
│  2. Serialize to JSON                                │
│     - XSS prevention (React escapes on frontend)     │
│                                                       │
│  3. Send Response                                    │
│     - 200/201 with data                              │
│     - Or error code (400/401/500)                    │
└──────────────────────────────────────────────────────┘
```

---

## Module Dependencies

```
Spring Boot Application
│
├── Spring Security
│   └── JWT Authentication
│
├── Spring Data JPA
│   ├── Hibernate ORM
│   └── MySQL Driver
│
├── Spring Web
│   └── REST Controllers
│
├── Lombok
│   └── Code Generation
│
├── MySQL Database
│   └── Connection Pool
│
└── Frontend (React)
    ├── React Router
    ├── Material-UI
    ├── Axios (HTTP Client)
    └── JavaScript ES6+
```

---

**Architecture Version**: 1.0.0  
**Last Updated**: April 21, 2026

