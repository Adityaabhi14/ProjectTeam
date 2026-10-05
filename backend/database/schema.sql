-- ==========================================================
-- CarePoint Hospital Management System Database Schema
-- Database Engine: MySQL 8.0+
-- Generated according to the provided ER Diagram
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `hospital_management_db`
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `hospital_management_db`;

-- ----------------------------------------------------------
-- 1. DEPARTMENT (Entity in ER Diagram)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `departments` (
    `DepartmentID` INT AUTO_INCREMENT PRIMARY KEY,
    `DepartmentName` VARCHAR(100) NOT NULL,
    `Description` TEXT NULL,
    `PhoneNo` VARCHAR(20) NULL,
    `Location` VARCHAR(100) NULL,
    `CreatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `UpdatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_dept_name` (`DepartmentName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 2. DOCTOR (Entity in ER Diagram)
-- Has 1-to-N relationship with Department
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `doctors` (
    `DoctorID` INT AUTO_INCREMENT PRIMARY KEY,
    `DepartmentID` INT NOT NULL,
    `FirstName` VARCHAR(50) NOT NULL,
    `LastName` VARCHAR(50) NOT NULL,
    `Gender` ENUM('Male', 'Female', 'Other') NULL,
    `Qualification` VARCHAR(100) NULL,
    `Specialization` VARCHAR(100) NULL,
    `Phone` VARCHAR(20) NULL,
    `Email` VARCHAR(100) NULL,
    `ConsultationFee` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `JoiningDate` DATE NULL,
    `CreatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `UpdatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_doctor_department`
        FOREIGN KEY (`DepartmentID`) REFERENCES `departments` (`DepartmentID`)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX `idx_doctor_department` (`DepartmentID`),
    INDEX `idx_doctor_name` (`LastName`, `FirstName`),
    INDEX `idx_doctor_phone` (`Phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 3. PATIENT (Entity in ER Diagram)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `patients` (
    `PatientID` INT AUTO_INCREMENT PRIMARY KEY,
    `AadhaarNo` VARCHAR(20) UNIQUE NULL,
    `FirstName` VARCHAR(50) NOT NULL,
    `LastName` VARCHAR(50) NULL,
    `DOB` DATE NULL,
    `Gender` ENUM('Male', 'Female', 'Other') NULL,
    `BloodGroup` ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NULL,
    `Phone` VARCHAR(20) NOT NULL,
    `Email` VARCHAR(100) NULL,
    `Address` TEXT NULL,
    `EmergencyContactName` VARCHAR(100) NULL,
    `EmergencyContactPhone` VARCHAR(20) NULL,
    `RegistrationDate` DATE DEFAULT (CURRENT_DATE),
    `CreatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `UpdatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_patient_phone` (`Phone`),
    INDEX `idx_patient_email` (`Email`),
    INDEX `idx_patient_name` (`FirstName`, `LastName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 4. MEDICAL HISTORY (Entity in ER Diagram)
-- Has 1-to-N relationship with Patient
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `medical_histories` (
    `HistoryID` INT AUTO_INCREMENT PRIMARY KEY,
    `PatientID` INT NOT NULL,
    `PastIllnesses` TEXT NULL,
    `PastSurgeries` TEXT NULL,
    `FamilyHistory` TEXT NULL,
    `ChronicConditions` TEXT NULL,
    `Allergies` TEXT NULL,
    `Notes` TEXT NULL,
    `CreatedAt` DATE DEFAULT (CURRENT_DATE),
    `UpdatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_medhistory_patient`
        FOREIGN KEY (`PatientID`) REFERENCES `patients` (`PatientID`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_medhistory_patient` (`PatientID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 5. INSURANCE (Entity in ER Diagram)
-- Has 1-to-N relationship with Patient
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `insurances` (
    `InsuranceID` INT AUTO_INCREMENT PRIMARY KEY,
    `PatientID` INT NOT NULL,
    `ProviderName` VARCHAR(100) NOT NULL,
    `PolicyNumber` VARCHAR(100) NOT NULL,
    `PolicyHolderName` VARCHAR(100) NULL,
    `Relationship` VARCHAR(50) NULL,
    `CoverageType` VARCHAR(50) NULL,
    `ValidFrom` DATE NULL,
    `ValidTo` DATE NULL,
    `CreatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `UpdatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_insurance_patient`
        FOREIGN KEY (`PatientID`) REFERENCES `patients` (`PatientID`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_insurance_patient` (`PatientID`),
    INDEX `idx_insurance_policy` (`PolicyNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 6. APPOINTMENT (Entity in ER Diagram)
-- Links Patient (1-N) and Doctor (1-N)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `appointments` (
    `AppointmentID` INT AUTO_INCREMENT PRIMARY KEY,
    `PatientID` INT NOT NULL,
    `DoctorID` INT NOT NULL,
    `AppointmentDate` DATE NOT NULL,
    `StartTime` TIME NULL,
    `EndTime` TIME NULL,
    `Type` ENUM('Consultation', 'Follow-up', 'Emergency', 'Procedure') DEFAULT 'Consultation',
    `Reason` TEXT NULL,
    `Status` ENUM('Scheduled', 'Completed', 'Cancelled', 'No-show') DEFAULT 'Scheduled',
    `CreatedAt` DATE DEFAULT (CURRENT_DATE),
    `UpdatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_appointment_patient`
        FOREIGN KEY (`PatientID`) REFERENCES `patients` (`PatientID`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_appointment_doctor`
        FOREIGN KEY (`DoctorID`) REFERENCES `doctors` (`DoctorID`)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX `idx_appointment_patient` (`PatientID`),
    INDEX `idx_appointment_doctor` (`DoctorID`),
    INDEX `idx_appointment_date` (`AppointmentDate`),
    INDEX `idx_appointment_status` (`Status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 7. PRESCRIPTION (Entity in ER Diagram)
-- Generated from Appointment (1-N) by Doctor (1-N)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `prescriptions` (
    `PrescriptionID` INT AUTO_INCREMENT PRIMARY KEY,
    `AppointmentID` INT NOT NULL,
    `DoctorID` INT NOT NULL,
    `Description` TEXT NULL,
    `Notes` TEXT NULL,
    `CreatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `UpdatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_prescription_appointment`
        FOREIGN KEY (`AppointmentID`) REFERENCES `appointments` (`AppointmentID`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_prescription_doctor`
        FOREIGN KEY (`DoctorID`) REFERENCES `doctors` (`DoctorID`)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX `idx_prescription_appointment` (`AppointmentID`),
    INDEX `idx_prescription_doctor` (`DoctorID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 8. MEDICINE (Entity in ER Diagram)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `medicines` (
    `MedicineID` INT AUTO_INCREMENT PRIMARY KEY,
    `MedicineName` VARCHAR(100) NOT NULL,
    `Category` VARCHAR(50) NULL,
    `Description` TEXT NULL,
    `UnitPrice` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `IsActive` BOOLEAN DEFAULT TRUE,
    `CreatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `UpdatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_medicine_name` (`MedicineName`),
    INDEX `idx_medicine_category` (`Category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 9. PRESCRIPTION ITEM (Entity in ER Diagram)
-- Prescription (1-N) items referencing Medicine (1-N)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `prescription_items` (
    `PrescriptionItemID` INT AUTO_INCREMENT PRIMARY KEY,
    `PrescriptionID` INT NOT NULL,
    `MedicineID` INT NOT NULL,
    `Dose` VARCHAR(50) NULL,
    `Frequency` VARCHAR(50) NULL,
    `Duration` VARCHAR(50) NULL,
    `Instructions` TEXT NULL,
    `CreatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `UpdatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_rxitem_prescription`
        FOREIGN KEY (`PrescriptionID`) REFERENCES `prescriptions` (`PrescriptionID`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_rxitem_medicine`
        FOREIGN KEY (`MedicineID`) REFERENCES `medicines` (`MedicineID`)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX `idx_rxitem_prescription` (`PrescriptionID`),
    INDEX `idx_rxitem_medicine` (`MedicineID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 10. SERVICE (Entity in ER Diagram)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `services` (
    `ServiceID` INT AUTO_INCREMENT PRIMARY KEY,
    `ServiceName` VARCHAR(100) NOT NULL,
    `Description` TEXT NULL,
    `Charge` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `IsActive` BOOLEAN DEFAULT TRUE,
    `CreatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `UpdatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_service_name` (`ServiceName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 11. BILL (Entity in ER Diagram)
-- Created for Patient and linked optionally to Appointment
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bills` (
    `BillID` INT AUTO_INCREMENT PRIMARY KEY,
    `AppointmentID` INT NULL,
    `PatientID` INT NOT NULL,
    `BillDate` DATE DEFAULT (CURRENT_DATE),
    `Subtotal` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `Discount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `Tax` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `TotalAmount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `Status` ENUM('Unpaid', 'Partially Paid', 'Paid', 'Cancelled') DEFAULT 'Unpaid',
    `Notes` TEXT NULL,
    `CreatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `UpdatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_bill_appointment`
        FOREIGN KEY (`AppointmentID`) REFERENCES `appointments` (`AppointmentID`)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_bill_patient`
        FOREIGN KEY (`PatientID`) REFERENCES `patients` (`PatientID`)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX `idx_bill_patient` (`PatientID`),
    INDEX `idx_bill_appointment` (`AppointmentID`),
    INDEX `idx_bill_status` (`Status`),
    INDEX `idx_bill_date` (`BillDate`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 12. BILL ITEM (Entity in ER Diagram)
-- Bill (1-N) items referencing Service (1-N)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bill_items` (
    `BillItemID` INT AUTO_INCREMENT PRIMARY KEY,
    `BillID` INT NOT NULL,
    `ServiceID` INT NULL,
    `Description` VARCHAR(255) NULL,
    `Quantity` INT NOT NULL DEFAULT 1,
    `UnitPrice` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `Amount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `CreatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `UpdatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_billitem_bill`
        FOREIGN KEY (`BillID`) REFERENCES `bills` (`BillID`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_billitem_service`
        FOREIGN KEY (`ServiceID`) REFERENCES `services` (`ServiceID`)
        ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX `idx_billitem_bill` (`BillID`),
    INDEX `idx_billitem_service` (`ServiceID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 13. PAYMENT (Entity in ER Diagram)
-- Bill (1-N) paid by Payment
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `payments` (
    `PaymentID` INT AUTO_INCREMENT PRIMARY KEY,
    `BillID` INT NOT NULL,
    `PaymentDate` DATE DEFAULT (CURRENT_DATE),
    `PaymentMethod` ENUM('Cash', 'Card', 'UPI', 'Net banking', 'Insurance') NOT NULL DEFAULT 'Cash',
    `AmountPaid` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `ReferenceNo` VARCHAR(100) NULL,
    `Status` ENUM('Completed', 'Pending', 'Failed', 'Refunded') DEFAULT 'Completed',
    `Notes` TEXT NULL,
    `CreatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `UpdatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_payment_bill`
        FOREIGN KEY (`BillID`) REFERENCES `bills` (`BillID`)
        ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_payment_bill` (`BillID`),
    INDEX `idx_payment_date` (`PaymentDate`),
    INDEX `idx_payment_status` (`Status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 14. FLOOR / WARD (Entity in ER Diagram)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `floor_wards` (
    `FloorWardID` INT AUTO_INCREMENT PRIMARY KEY,
    `FloorWardName` VARCHAR(100) NOT NULL,
    `Description` TEXT NULL,
    `CreatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `UpdatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_floorward_name` (`FloorWardName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 15. ROOM (Entity in ER Diagram)
-- Allocated to Floor / Ward (1-N)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `rooms` (
    `RoomID` INT AUTO_INCREMENT PRIMARY KEY,
    `FloorWardID` INT NOT NULL,
    `RoomNumber` VARCHAR(20) NOT NULL,
    `RoomType` ENUM('General', 'Semi-private', 'Private', 'ICU', 'Operation theatre') DEFAULT 'General',
    `BedCount` INT NOT NULL DEFAULT 1,
    `OccupancyStatus` ENUM('Available', 'Occupied', 'Maintenance') DEFAULT 'Available',
    `ChargePerDay` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `Status` ENUM('Active', 'Inactive') DEFAULT 'Active',
    `Notes` TEXT NULL,
    `CreatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `UpdatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_room_floorward`
        FOREIGN KEY (`FloorWardID`) REFERENCES `floor_wards` (`FloorWardID`)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX `idx_room_floorward` (`FloorWardID`),
    INDEX `idx_room_number` (`RoomNumber`),
    INDEX `idx_room_occupancy` (`OccupancyStatus`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 16. USERS / AUTH (System User Authentication & Roles)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
    `UserID` INT AUTO_INCREMENT PRIMARY KEY,
    `Username` VARCHAR(50) UNIQUE NOT NULL,
    `Email` VARCHAR(100) UNIQUE NOT NULL,
    `PasswordHash` VARCHAR(255) NOT NULL,
    `Role` ENUM('Admin', 'Doctor', 'Staff', 'Patient') NOT NULL DEFAULT 'Staff',
    `DoctorID` INT NULL,
    `PatientID` INT NULL,
    `IsActive` BOOLEAN DEFAULT TRUE,
    `CreatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `UpdatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_user_doctor`
        FOREIGN KEY (`DoctorID`) REFERENCES `doctors` (`DoctorID`)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_user_patient`
        FOREIGN KEY (`PatientID`) REFERENCES `patients` (`PatientID`)
        ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX `idx_user_role` (`Role`),
    INDEX `idx_user_email` (`Email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
