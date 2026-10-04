-- ==========================================================
-- CarePoint Hospital Management System Initial Seed Data
-- ==========================================================

USE `hospital_management_db`;

-- Disable Foreign Key checks for clean seeding
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE `prescription_items`;
TRUNCATE TABLE `prescriptions`;
TRUNCATE TABLE `bill_items`;
TRUNCATE TABLE `payments`;
TRUNCATE TABLE `bills`;
TRUNCATE TABLE `appointments`;
TRUNCATE TABLE `insurances`;
TRUNCATE TABLE `medical_histories`;
TRUNCATE TABLE `rooms`;
TRUNCATE TABLE `floor_wards`;
TRUNCATE TABLE `medicines`;
TRUNCATE TABLE `services`;
TRUNCATE TABLE `users`;
TRUNCATE TABLE `doctors`;
TRUNCATE TABLE `departments`;
TRUNCATE TABLE `patients`;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. Seed Departments
INSERT INTO `departments` (`DepartmentID`, `DepartmentName`, `Description`, `PhoneNo`, `Location`) VALUES
(1, 'Cardiology', 'Comprehensive heart health checks, ECG, angiography and cardiac intensive care.', '040-111111', 'Block A, 1st Floor'),
(2, 'Pediatrics', 'Specialized care for infants, children, adolescents and pediatric vaccination.', '040-222222', 'Block B, Ground Floor'),
(3, 'Orthopedics', 'Bone, joint, spine, arthritis, and sports injury management and surgery.', '040-333333', 'Block C, 2nd Floor'),
(4, 'Neurology', 'Diagnosis and advanced treatment of brain, spine, and nervous system disorders.', '040-444444', 'Block A, 3rd Floor'),
(5, 'General Medicine', 'Primary care, diagnostic assessments, adult internal medicine and disease prevention.', '040-555555', 'Block Main, Ground Floor');

-- 2. Seed Doctors
INSERT INTO `doctors` (`DoctorID`, `DepartmentID`, `FirstName`, `LastName`, `Gender`, `Qualification`, `Specialization`, `Phone`, `Email`, `ConsultationFee`, `JoiningDate`) VALUES
(1, 1, 'Ananya', 'Rao', 'Female', 'MBBS, MD (Cardiology), DM', 'Senior Interventional Cardiologist', '9000000001', 'dr.ananya@carepoint.example', 600.00, '2020-01-10'),
(2, 2, 'Sameer', 'Khan', 'Male', 'MBBS, MD (Pediatrics), DCH', 'Pediatric Specialist & Neonatologist', '9000000002', 'dr.sameer@carepoint.example', 450.00, '2021-03-05'),
(3, 3, 'Manish', 'Reddy', 'Male', 'MBBS, MS (Ortho), M.Ch', 'Orthopedic & Joint Replacement Surgeon', '9000000003', 'dr.manish@carepoint.example', 700.00, '2019-07-20'),
(4, 4, 'Priya', 'Nair', 'Female', 'MBBS, MD, DM (Neurology)', 'Consultant Neurologist', '9000000004', 'dr.priya@carepoint.example', 750.00, '2022-05-15'),
(5, 5, 'Rajesh', 'Verma', 'Male', 'MBBS, MD (Internal Medicine)', 'General Physician & Consultant', '9000000005', 'dr.rajesh@carepoint.example', 400.00, '2018-11-01');

-- 3. Seed Patients
INSERT INTO `patients` (`PatientID`, `AadhaarNo`, `FirstName`, `LastName`, `DOB`, `Gender`, `BloodGroup`, `Phone`, `Email`, `Address`, `EmergencyContactName`, `EmergencyContactPhone`, `RegistrationDate`) VALUES
(1, '1111 2222 3333', 'Ravi', 'Kumar', '1985-04-12', 'Male', 'O+', '9111111111', 'ravi.kumar@example.com', 'Flat 402, Green Meadows, Hyderabad', 'Sunita Kumar', '9111111112', '2024-01-15'),
(2, '2222 3333 4444', 'Sunita', 'Sharma', '1992-08-25', 'Female', 'B+', '9222222222', 'sunita.sharma@example.com', '12-3-45 Jubilee Hills, Hyderabad', 'Vikram Sharma', '9222222223', '2024-02-10'),
(3, '3333 4444 5555', 'Amit', 'Patel', '1978-11-30', 'Male', 'A+', '9333333333', 'amit.patel@example.com', 'Plot 88, Madhapur, Hyderabad', 'Neha Patel', '9333333334', '2024-03-01'),
(4, '4444 5555 6666', 'Kavita', 'Deshmukh', '2001-06-18', 'Female', 'AB+', '9444444444', 'kavita.d@example.com', 'B-14 Banjara Hills, Hyderabad', 'Ramesh Deshmukh', '9444444445', '2024-03-20');

-- 4. Seed Medical Histories
INSERT INTO `medical_histories` (`HistoryID`, `PatientID`, `PastIllnesses`, `PastSurgeries`, `FamilyHistory`, `ChronicConditions`, `Allergies`, `Notes`, `CreatedAt`) VALUES
(1, 1, 'Mild Viral Fever (2022)', 'Appendectomy (2015)', 'Father had hypertension', 'Hypertension Stage 1', 'Penicillin', 'Routine BP monitoring recommended.', '2024-01-15'),
(2, 2, 'Asthma episodes in childhood', 'None', 'Mother has Type 2 Diabetes', 'Mild Seasonal Asthma', 'Dust, Pollen, Sulfa drugs', 'Uses inhaler during seasonal weather change.', '2024-02-10'),
(3, 3, 'Typhoid (2018)', 'Knee Arthroscopy (2021)', 'No significant hereditary disease', 'Elevated Cholesterol', 'No known drug allergies', 'Advised low sodium and cardiac diet.', '2024-03-01');

-- 5. Seed Insurances
INSERT INTO `insurances` (`InsuranceID`, `PatientID`, `ProviderName`, `PolicyNumber`, `PolicyHolderName`, `Relationship`, `CoverageType`, `ValidFrom`, `ValidTo`) VALUES
(1, 1, 'Star Health Insurance', 'SH-POL-887412', 'Ravi Kumar', 'Self', 'Comprehensive Family Floater', '2024-01-01', '2026-12-31'),
(2, 2, 'HDFC ERGO Health', 'HDFC-MED-99431', 'Vikram Sharma', 'Spouse', 'Corporate Group Health', '2023-04-01', '2026-03-31'),
(3, 3, 'Care Health Insurance', 'CARE-SUP-41029', 'Amit Patel', 'Self', 'Senior & Individual Elite', '2024-01-01', '2027-01-01');

-- 6. Seed Medicines
INSERT INTO `medicines` (`MedicineID`, `MedicineName`, `Category`, `Description`, `UnitPrice`, `IsActive`) VALUES
(1, 'Paracetamol 500mg', 'Analgesic / Antipyretic', 'Fever reducer and mild to moderate pain reliever.', 2.50, TRUE),
(2, 'Amoxicillin 500mg', 'Antibiotic', 'Broad-spectrum penicillin antibiotic for bacterial infections.', 8.00, TRUE),
(3, 'Atorvastatin 10mg', 'Cardiovascular / Statin', 'Cholesterol-lowering medication for heart disease prevention.', 12.00, TRUE),
(4, 'Metformin 500mg', 'Antidiabetic', 'Oral diabetes medicine helping control blood sugar levels.', 4.00, TRUE),
(5, 'Ibuprofen 400mg', 'NSAID / Anti-inflammatory', 'Relieves inflammation, swelling and joint pain.', 5.00, TRUE),
(6, 'Pantoprazole 40mg', 'Gastrointestinal / PPI', 'Reduces stomach acid and prevents acid reflux.', 7.50, TRUE),
(7, 'Cetirizine 10mg', 'Antihistamine', 'Relief from allergy symptoms, cold, sneezing and rashes.', 3.00, TRUE);

-- 7. Seed Services
INSERT INTO `services` (`ServiceID`, `ServiceName`, `Description`, `Charge`, `IsActive`) VALUES
(1, 'Doctor Consultation', 'General or specialized OPD clinical consultation.', 500.00, TRUE),
(2, 'Electrocardiogram (ECG)', '12-lead standard cardiac activity assessment.', 350.00, TRUE),
(3, 'Complete Blood Count (CBC)', 'Laboratory diagnostic blood profile analysis.', 400.00, TRUE),
(4, 'Chest X-Ray Digital', 'High-resolution thoracic radiologic imaging.', 600.00, TRUE),
(5, 'Echocardiogram (2D Echo)', 'Ultrasound imaging of cardiac chambers and valves.', 1800.00, TRUE),
(6, 'Blood Sugar Fasting & PP', 'Glucose level testing before and after food.', 200.00, TRUE);

-- 8. Seed Floors / Wards
INSERT INTO `floor_wards` (`FloorWardID`, `FloorWardName`, `Description`) VALUES
(1, 'Ground Floor - Outpatient Wing', 'OPD consultation rooms, triage desk, diagnostic labs, and emergency bay.'),
(2, '1st Floor - General & Semi-Private Ward', 'Inpatient care rooms, post-operative observation and nurse stations.'),
(3, '2nd Floor - Intensive Care & Surgical Suites', 'ICU, Cardiac Care Unit (CCU), and state-of-the-art operation theatres.');

-- 9. Seed Rooms
INSERT INTO `rooms` (`RoomID`, `FloorWardID`, `RoomNumber`, `RoomType`, `BedCount`, `OccupancyStatus`, `ChargePerDay`, `Status`, `Notes`) VALUES
(1, 1, 'OPD-101', 'General', 1, 'Available', 0.00, 'Active', 'Consultation room for Cardiology.'),
(2, 2, 'GW-201', 'General', 6, 'Available', 800.00, 'Active', 'Male General Inpatient Ward with 6 beds.'),
(3, 2, 'SP-205', 'Semi-private', 2, 'Available', 1800.00, 'Active', 'Two sharing air-conditioned room with television.'),
(4, 2, 'PV-210', 'Private', 1, 'Occupied', 3200.00, 'Active', 'Deluxe private room with attached restroom and sofa bed.'),
(5, 3, 'ICU-301', 'ICU', 4, 'Available', 6500.00, 'Active', 'Critical care monitoring unit equipped with ventilators.');

-- 10. Seed Appointments
INSERT INTO `appointments` (`AppointmentID`, `PatientID`, `DoctorID`, `AppointmentDate`, `StartTime`, `EndTime`, `Type`, `Reason`, `Status`, `CreatedAt`) VALUES
(1, 1, 1, CURDATE(), '10:00:00', '10:30:00', 'Consultation', 'Chest discomfort and routine hypertension follow-up.', 'Scheduled', CURDATE()),
(2, 2, 2, CURDATE(), '11:00:00', '11:30:00', 'Consultation', 'Seasonal allergic cough and breathing difficulty.', 'Scheduled', CURDATE()),
(3, 3, 3, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '14:00:00', '14:30:00', 'Follow-up', 'Post-surgery knee rehabilitation assessment.', 'Scheduled', CURDATE());

-- 11. Seed Prescriptions
INSERT INTO `prescriptions` (`PrescriptionID`, `AppointmentID`, `DoctorID`, `Description`, `Notes`, `CreatedAt`) VALUES
(1, 1, 1, 'Cardiac support and blood pressure stabilization regimen.', 'Maintain low sodium intake and record daily blood pressure.', NOW());

-- 12. Seed Prescription Items
INSERT INTO `prescription_items` (`PrescriptionItemID`, `PrescriptionID`, `MedicineID`, `Dose`, `Frequency`, `Duration`, `Instructions`) VALUES
(1, 1, 3, '10mg', 'Once Daily at Bedtime', '30 Days', 'Take with water after dinner.'),
(2, 1, 6, '40mg', 'Once Daily (Morning)', '15 Days', 'Take empty stomach 30 mins before breakfast.');

-- 13. Seed Bills
INSERT INTO `bills` (`BillID`, `AppointmentID`, `PatientID`, `BillDate`, `Subtotal`, `Discount`, `Tax`, `TotalAmount`, `Status`, `Notes`) VALUES
(1, 1, 1, CURDATE(), 950.00, 50.00, 45.00, 945.00, 'Paid', 'Consultation fee and 12-lead ECG diagnostic charge.');

-- 14. Seed Bill Items
INSERT INTO `bill_items` (`BillItemID`, `BillID`, `ServiceID`, `Description`, `Quantity`, `UnitPrice`, `Amount`) VALUES
(1, 1, 1, 'Doctor Consultation', 1, 600.00, 600.00),
(2, 1, 2, 'Electrocardiogram (ECG)', 1, 350.00, 350.00);

-- 15. Seed Payments
INSERT INTO `payments` (`PaymentID`, `BillID`, `PaymentDate`, `PaymentMethod`, `AmountPaid`, `ReferenceNo`, `Status`, `Notes`) VALUES
(1, 1, CURDATE(), 'UPI', 945.00, 'UPI-REF-99882211', 'Completed', 'Payment received via Google Pay / QR code.');

-- 16. Seed Users (passwords hashed with bcrypt: 'Admin@123', 'Doctor@123', 'Staff@123', 'Patient@123')
INSERT INTO `users` (`UserID`, `Username`, `Email`, `PasswordHash`, `Role`, `DoctorID`, `PatientID`, `IsActive`) VALUES
(1, 'admin', 'admin@carepoint.example', '$2a$10$wK1k6a.8kUj/gqV3L4X4xOdZlR7M9v6hL6Bv1sU5Uo1tC/b4fGk9W', 'Admin', NULL, NULL, TRUE),
(2, 'dr.ananya', 'dr.ananya@carepoint.example', '$2a$10$wK1k6a.8kUj/gqV3L4X4xOdZlR7M9v6hL6Bv1sU5Uo1tC/b4fGk9W', 'Doctor', 1, NULL, TRUE),
(3, 'staff', 'staff@carepoint.example', '$2a$10$wK1k6a.8kUj/gqV3L4X4xOdZlR7M9v6hL6Bv1sU5Uo1tC/b4fGk9W', 'Staff', NULL, NULL, TRUE),
(4, 'ravi.kumar', 'ravi.kumar@example.com', '$2a$10$wK1k6a.8kUj/gqV3L4X4xOdZlR7M9v6hL6Bv1sU5Uo1tC/b4fGk9W', 'Patient', NULL, 1, TRUE);
