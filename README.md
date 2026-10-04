# CarePoint Hospital Management System

A full-stack, enterprise-grade Hospital Management System (HMS) built with **Node.js**, **Express**, and **MySQL**, designed precisely from the hospital domain Entity-Relationship (ER) diagram.

---

## 🏛️ System Architecture & File Organization

The project is organized into a clean, modular Model-Controller-Route-Service architecture:

```
projectteam/
├── backend/
│   ├── config/
│   │   ├── config.js               # Environment variables and centralized configuration
│   │   └── db.js                   # MySQL connection pool (mysql2/promise) & query helpers
│   ├── database/
│   │   ├── schema.sql              # Complete MySQL DDL schema for all 15 ER entities + Users
│   │   ├── seed.sql                # Rich demo seed data for quick testing and onboarding
│   │   └── init-db.js              # Automated database and table creation runner script
│   ├── middleware/
│   │   ├── auth.js                 # JWT verification and Role-Based Access Control (RBAC)
│   │   ├── errorHandler.js         # Centralized error handler with MySQL error code formatting
│   │   └── validator.js            # Request payload validator helpers
│   ├── controllers/
│   │   ├── authController.js       # Register, login, JWT issuance, profile retrieval
│   │   ├── patientController.js    # Patient CRUD & full clinical profile aggregation
│   │   ├── doctorController.js     # Doctor CRUD, department joins, schedule tracking
│   │   ├── departmentController.js # Department management with doctor counters
│   │   ├── appointmentController.js# Appointment booking, status transitions & lookups
│   │   ├── medicalHistoryController.js # Patient past illnesses, allergies, and surgical records
│   │   ├── insuranceController.js  # Patient insurance policies and coverage dates
│   │   ├── prescriptionController.js # Prescriptions with nested medicine items & dosage
│   │   ├── medicineController.js   # Pharmacy inventory and catalog
│   │   ├── billController.js       # Billing, subtotal calculation, tax/discount adjustments
│   │   ├── billItemController.js   # Bill line items with auto-recalculating parent bills
│   │   ├── paymentController.js    # Payment receipts with auto-updating bill status
│   │   ├── serviceController.js    # Hospital diagnostic and clinical services catalog
│   │   ├── floorWardController.js  # Hospital floors and ward allocations
│   │   ├── roomController.js       # Room bed counts, occupancy tracking, and tariffs
│   │   └── dashboardController.js  # Real-time analytics, revenue, bed counts, and recent activity
│   ├── routes/
│   │   ├── index.js                # Master API router mounting all domain endpoints under /api
│   │   ├── authRoutes.js           # /api/auth
│   │   ├── patientRoutes.js        # /api/patients
│   │   ├── doctorRoutes.js         # /api/doctors
│   │   ├── departmentRoutes.js     # /api/departments
│   │   ├── appointmentRoutes.js    # /api/appointments
│   │   ├── medicalHistoryRoutes.js # /api/medical-histories
│   │   ├── insuranceRoutes.js      # /api/insurances
│   │   ├── prescriptionRoutes.js   # /api/prescriptions
│   │   ├── medicineRoutes.js       # /api/medicines
│   │   ├── serviceRoutes.js        # /api/services
│   │   ├── billRoutes.js           # /api/bills
│   │   ├── billItemRoutes.js       # /api/bill-items
│   │   ├── paymentRoutes.js        # /api/payments
│   │   ├── floorWardRoutes.js      # /api/floor-wards
│   │   ├── roomRoutes.js           # /api/rooms
│   │   └── dashboardRoutes.js      # /api/dashboard
│   ├── .env.example                # Environment variables template
│   ├── .env                        # Local environment configuration
│   └── server.js                   # Express application entrypoint, static server, and middleware
├── index.html                      # Hospital portal UI (public site, staff portal, patient profiles)
├── script.js                       # Frontend client connected to MySQL REST API with offline sync
├── style.css                       # Modern CSS styling for the hospital interface
├── package.json                    # Project metadata, dependencies, and npm scripts
└── README.md                       # Comprehensive backend design & API documentation
```

---

## 🗄️ Database Schema & ER Diagram Mapping

The MySQL schema is mapped directly to the 15 entities and relationships from the ER Diagram:

| ER Entity | MySQL Table | Primary Key | Key Foreign Keys & Relationships |
|---|---|---|---|
| **DEPARTMENT** | `departments` | `DepartmentID` | Has 1-to-N Doctors |
| **DOCTOR** | `doctors` | `DoctorID` | `DepartmentID` ➔ `departments` |
| **PATIENT** | `patients` | `PatientID` | Has 1-to-N Medical Histories, Insurances, Appointments, Bills |
| **MEDICAL HISTORY** | `medical_histories` | `HistoryID` | `PatientID` ➔ `patients` (CASCADE) |
| **INSURANCE** | `insurances` | `InsuranceID` | `PatientID` ➔ `patients` (CASCADE) |
| **APPOINTMENT** | `appointments` | `AppointmentID` | `PatientID` ➔ `patients`, `DoctorID` ➔ `doctors` |
| **PRESCRIPTION** | `prescriptions` | `PrescriptionID` | `AppointmentID` ➔ `appointments`, `DoctorID` ➔ `doctors` |
| **PRESCRIPTION ITEM** | `prescription_items` | `PrescriptionItemID` | `PrescriptionID` ➔ `prescriptions`, `MedicineID` ➔ `medicines` |
| **MEDICINE** | `medicines` | `MedicineID` | Catalog for prescription items |
| **SERVICE** | `services` | `ServiceID` | Catalog for clinical procedures & bill items |
| **BILL** | `bills` | `BillID` | `PatientID` ➔ `patients`, `AppointmentID` ➔ `appointments` |
| **BILL ITEM** | `bill_items` | `BillItemID` | `BillID` ➔ `bills`, `ServiceID` ➔ `services` |
| **PAYMENT** | `payments` | `PaymentID` | `BillID` ➔ `bills` (Auto-updates Bill status to Paid/Partially Paid) |
| **FLOOR / WARD** | `floor_wards` | `FloorWardID` | Has 1-to-N Rooms |
| **ROOM** | `rooms` | `RoomID` | `FloorWardID` ➔ `floor_wards` |
| **USER / AUTH** | `users` | `UserID` | `DoctorID`, `PatientID` with bcrypt password hashing & JWT |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18+ recommended, v24 tested)
- **MySQL Server** (v8.0+ or MariaDB / XAMPP / WAMP)

### 2. Configure Environment
Check or adjust `backend/.env`:
```env
PORT=5000
NODE_ENV=development

# MySQL Connection Details
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=hospital_management_db

# JWT Authentication
JWT_SECRET=carepoint_hospital_super_secret_jwt_key_2026
JWT_EXPIRES_IN=7d
```

### 3. Initialize the MySQL Database
Run the automated schema and seed runner:
```bash
npm run init-db
```
This will:
1. Connect to MySQL.
2. Create the `hospital_management_db` database if it does not already exist.
3. Execute `backend/database/schema.sql` (creating all 15 ER tables + indexes + foreign key constraints).
4. Execute `backend/database/seed.sql` with sample departments, doctors, services, medicines, rooms, patients, appointments, and bills.

### 4. Start the Application
```bash
# Start backend server
npm start

# Or start in watch mode for development
npm run dev
```

Open your browser at:
- **Application Web UI:** [http://localhost:5000](http://localhost:5000)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 📡 REST API Reference

All endpoints return JSON in standard format: `{ success: true, data: ... }`

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new user account (Admin, Doctor, Staff, Patient)
- `POST /api/auth/login` — Login with username/email and password, returns JWT token
- `GET /api/auth/me` — Get current authenticated user profile (Bearer token required)

### Patients (`/api/patients`)
- `GET /api/patients` — List patients (supports search `?q=`)
- `GET /api/patients/:id` — Get patient by ID
- `GET /api/patients/:id/full-profile` — Aggregates patient info, medical history, insurance, appointments, prescriptions with items, bills, and payments
- `POST /api/patients` — Create a new patient
- `PUT /api/patients/:id` — Update patient details
- `DELETE /api/patients/:id` — Delete patient

### Doctors & Departments (`/api/doctors`, `/api/departments`)
- `GET /api/doctors` — List doctors (filter by `?departmentId=` or search `?q=`)
- `GET /api/doctors/:id` — Get doctor details and upcoming appointment counts
- `POST /api/doctors` — Create doctor
- `PUT /api/doctors/:id` — Update doctor
- `DELETE /api/doctors/:id` — Delete doctor
- `GET /api/departments` — List departments with doctor count
- `GET /api/departments/:id` — Get department by ID with associated doctors
- `POST /api/departments` — Create department
- `PUT /api/departments/:id` — Update department
- `DELETE /api/departments/:id` — Delete department

### Appointments (`/api/appointments`)
- `GET /api/appointments` — List appointments (filters: `?date=`, `?patientId=`, `?doctorId=`, `?status=`)
- `GET /api/appointments/:id` — Get appointment details with patient & doctor info
- `POST /api/appointments` — Create appointment
- `POST /api/appointments/book` — Public web booking endpoint (auto-registers patient if not existing)
- `PUT /api/appointments/:id` — Update appointment status or time
- `DELETE /api/appointments/:id` — Delete appointment

### Clinical Records (`/api/medical-histories`, `/api/insurances`)
- `GET /api/medical-histories` — List medical history records
- `POST /api/medical-histories` — Add medical history for a patient
- `PUT /api/medical-histories/:id` — Update medical history
- `DELETE /api/medical-histories/:id` — Delete record
- `GET /api/insurances` — List insurance policies
- `POST /api/insurances` — Add insurance policy
- `PUT /api/insurances/:id` — Update insurance policy
- `DELETE /api/insurances/:id` — Delete insurance policy

### Pharmacy & Prescriptions (`/api/prescriptions`, `/api/medicines`)
- `GET /api/prescriptions` — List prescriptions with items and doctor details
- `GET /api/prescriptions/:id` — Get prescription with items
- `POST /api/prescriptions` — Create prescription (supports optional nested `items` array)
- `POST /api/prescriptions/:id/items` — Add an item to an existing prescription
- `DELETE /api/prescriptions/:id/items/:itemId` — Remove item from prescription
- `GET /api/medicines` — List medicines (filter `?category=`, `?activeOnly=true`)
- `POST /api/medicines` — Add new medicine
- `PUT /api/medicines/:id` — Update medicine
- `DELETE /api/medicines/:id` — Delete medicine

### Billing & Payments (`/api/bills`, `/api/bill-items`, `/api/payments`, `/api/services`)
- `GET /api/bills` — List bills with paid amount and balance due calculations
- `GET /api/bills/:id` — Get full bill details with items and payment receipts
- `POST /api/bills` — Create bill (supports optional nested `items` array)
- `PUT /api/bills/:id` — Update bill
- `DELETE /api/bills/:id` — Delete bill
- `POST /api/bill-items` — Add item to bill (auto-recalculates parent bill Subtotal and TotalAmount)
- `PUT /api/bill-items/:id` — Update item
- `DELETE /api/bill-items/:id` — Delete item
- `GET /api/payments` — List payment records
- `POST /api/payments` — Record payment (auto-updates parent Bill status: `Unpaid`, `Partially Paid`, `Paid`)
- `GET /api/services` — List hospital diagnostic & procedure services catalog
- `POST /api/services` — Add hospital service

### Facilities & Inpatient (`/api/floor-wards`, `/api/rooms`)
- `GET /api/floor-wards` — List floors and wards with room and bed counts
- `GET /api/floor-wards/:id` — Get floor/ward with room list
- `POST /api/floor-wards` — Create floor/ward
- `GET /api/rooms` — List rooms (filters: `?occupancyStatus=`, `?roomType=`, `?floorWardId=`)
- `GET /api/rooms/:id` — Get room details
- `POST /api/rooms` — Create room
- `PUT /api/rooms/:id` — Update room status / occupancy
- `DELETE /api/rooms/:id` — Delete room

### Dashboard & Analytics (`/api/dashboard/stats`)
- `GET /api/dashboard/stats` — Aggregates total patients, doctors, departments, today's appointments, unpaid bills, total revenue collected, bed count & room availability, and recent activities.
