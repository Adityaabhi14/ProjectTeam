// =================================================================
// CarePoint Hospital Management System — Storage & Mock Data Cache
// Provides immediate high-fidelity demo data & local caching
// =================================================================

import {
  Patient,
  Doctor,
  Department,
  Appointment,
  MedicalHistory,
  Prescription,
  Medicine,
  Service,
  Bill,
  Payment,
  FloorWard,
  Room,
  VitalMetric,
  VitalLogEntry,
  MedicalReportDoc
} from '../types';

const STORAGE_KEY = 'carepoint_hms_data_v4';

export interface StorageData {
  seq: Record<string, number>;
  patient: Patient[];
  doctor: Doctor[];
  department: Department[];
  appointment: Appointment[];
  medhistory: MedicalHistory[];
  prescription: Prescription[];
  medicine: Medicine[];
  service: Service[];
  bill: Bill[];
  payment: Payment[];
  floorward: FloorWard[];
  room: Room[];
  vitals: VitalMetric[];
  vitalLogs: VitalLogEntry[];
  reports: MedicalReportDoc[];
}

const defaultData: StorageData = {
  seq: {
    patient: 4,
    doctor: 6,
    department: 8,
    appointment: 5,
    medhistory: 3,
    prescription: 3,
    medicine: 8,
    service: 6,
    bill: 3,
    payment: 3,
    floorward: 4,
    room: 8
  },
  department: [
    {
      DepartmentID: 1,
      DepartmentName: 'Cardiology & Heart Care',
      Description: 'Comprehensive cardiovascular diagnostics, interventional cardiology, electrophysiology, and post-surgery rehabilitation.',
      PhoneNo: '+1 (800) 452-3201',
      Location: 'Wing A · Level 3',
      Icon: 'HeartPulse',
      DoctorCount: 4
    },
    {
      DepartmentID: 2,
      DepartmentName: 'Neurology & Brain Sciences',
      Description: 'State-of-the-art neurology center for stroke management, epilepsy diagnostics, neuro-rehab, and cognitive wellness.',
      PhoneNo: '+1 (800) 452-3202',
      Location: 'Wing B · Level 4',
      Icon: 'Brain',
      DoctorCount: 3
    },
    {
      DepartmentID: 3,
      DepartmentName: 'Orthopedics & Joint Care',
      Description: 'Minimally invasive joint replacements, sports injury recovery, arthroscopy, and spine rehabilitation therapy.',
      PhoneNo: '+1 (800) 452-3203',
      Location: 'Wing C · Level 2',
      Icon: 'Bone',
      DoctorCount: 3
    },
    {
      DepartmentID: 4,
      DepartmentName: 'Pediatrics & Neonatal Care',
      Description: 'Compassionate pediatric wellness, developmental screenings, vaccinations, and 24/7 neonatal intensive care unit (NICU).',
      PhoneNo: '+1 (800) 452-3204',
      Location: 'Wing A · Level 1',
      Icon: 'Baby',
      DoctorCount: 4
    },
    {
      DepartmentID: 5,
      DepartmentName: 'Dermatology & Skin Biology',
      Description: 'Advanced clinical dermatology, allergy testing, laser therapies, and complex autoimmune skin condition management.',
      PhoneNo: '+1 (800) 452-3205',
      Location: 'Wing D · Level 2',
      Icon: 'Sparkles',
      DoctorCount: 2
    },
    {
      DepartmentID: 6,
      DepartmentName: 'General Medicine & Triage',
      Description: 'Primary clinical care, preventive executive health checks, acute infectious diseases, and chronic metabolic control.',
      PhoneNo: '+1 (800) 452-3206',
      Location: 'Ground Floor · Ambulatory Pavilion',
      Icon: 'Stethoscope',
      DoctorCount: 5
    },
    {
      DepartmentID: 7,
      DepartmentName: 'Ophthalmology & Eye Care',
      Description: 'Digital retinal imaging, micro-incision cataract surgery, glaucoma management, and pediatric vision screening.',
      PhoneNo: '+1 (800) 452-3207',
      Location: 'Wing C · Level 1',
      Icon: 'Eye',
      DoctorCount: 2
    },
    {
      DepartmentID: 8,
      DepartmentName: 'Mental Wellness & Psychology',
      Description: 'Confidential psychiatric evaluations, cognitive behavioral therapy, anxiety mitigation, and holistic neuro-psychology.',
      PhoneNo: '+1 (800) 452-3208',
      Location: 'Wellness Pavilion · Level 3',
      Icon: 'Smile',
      DoctorCount: 3
    }
  ],
  doctor: [
    {
      DoctorID: 1,
      DepartmentID: 1,
      DepartmentName: 'Cardiology & Heart Care',
      FirstName: 'Ananya',
      LastName: 'Rao',
      Gender: 'Female',
      Qualification: 'MD, DM Cardiology (AIIMS), FACC',
      Specialization: 'Interventional Cardiologist',
      Phone: '+1 (555) 301-4491',
      Email: 'ananya.rao@carepoint.health',
      ConsultationFee: 75,
      JoiningDate: '2019-03-15',
      Rating: 4.95,
      ReviewCount: 142,
      ExperienceYears: 14,
      ConsultationModes: ['online', 'offline'],
      Bio: 'Dr. Rao is a senior cardiologist specializing in non-invasive cardiac imaging, arterial valve reconstruction, and proactive cardiovascular disease prevention.',
      AvailableDays: ['Mon', 'Tue', 'Thu', 'Fri']
    },
    {
      DoctorID: 2,
      DepartmentID: 2,
      DepartmentName: 'Neurology & Brain Sciences',
      FirstName: 'Julian',
      LastName: 'Vance',
      Gender: 'Male',
      Qualification: 'MD Neurology, PhD Neurobiology (Johns Hopkins)',
      Specialization: 'Cognitive Neurologist & Neuro-diagnostician',
      Phone: '+1 (555) 301-4492',
      Email: 'julian.vance@carepoint.health',
      ConsultationFee: 90,
      Rating: 4.92,
      ReviewCount: 98,
      ExperienceYears: 16,
      ConsultationModes: ['online', 'offline'],
      Bio: 'Pioneering researcher and clinician dedicated to early-stage memory preservation, migraine therapies, and neuro-vascular imaging.',
      AvailableDays: ['Tue', 'Wed', 'Fri', 'Sat']
    },
    {
      DoctorID: 3,
      DepartmentID: 3,
      DepartmentName: 'Orthopedics & Joint Care',
      FirstName: 'Manish',
      LastName: 'Reddy',
      Gender: 'Male',
      Qualification: 'MS Ortho, MCh Orth (UK)',
      Specialization: 'Orthopedic & Joint Surgeon',
      Phone: '+1 (555) 301-4493',
      Email: 'manish.reddy@carepoint.health',
      ConsultationFee: 80,
      Rating: 4.88,
      ReviewCount: 115,
      ExperienceYears: 12,
      ConsultationModes: ['offline'],
      Bio: 'Renowned joint replacement specialist utilizing robotic-guided knee and hip arthroplasty with rapid-recovery protocols.',
      AvailableDays: ['Mon', 'Wed', 'Thu', 'Sat']
    },
    {
      DoctorID: 4,
      DepartmentID: 4,
      DepartmentName: 'Pediatrics & Neonatal Care',
      FirstName: 'Elena',
      LastName: 'Rostova',
      Gender: 'Female',
      Qualification: 'MD Pediatrics, Fellowship Pediatric Pulmonology',
      Specialization: 'Consultant Pediatrician',
      Phone: '+1 (555) 301-4494',
      Email: 'elena.rostova@carepoint.health',
      ConsultationFee: 65,
      Rating: 4.98,
      ReviewCount: 204,
      ExperienceYears: 11,
      ConsultationModes: ['online', 'offline'],
      Bio: 'Specializes in early childhood respiratory health, allergy desensitization, and nurturing child developmental milestones.',
      AvailableDays: ['Mon', 'Tue', 'Wed', 'Fri']
    },
    {
      DoctorID: 5,
      DepartmentID: 5,
      DepartmentName: 'Dermatology & Skin Biology',
      FirstName: 'Sameer',
      LastName: 'Khan',
      Gender: 'Male',
      Qualification: 'MD Dermatology, FAAD',
      Specialization: 'Clinical Dermatologist',
      Phone: '+1 (555) 301-4495',
      Email: 'sameer.khan@carepoint.health',
      ConsultationFee: 70,
      Rating: 4.86,
      ReviewCount: 88,
      ExperienceYears: 9,
      ConsultationModes: ['online', 'offline'],
      Bio: 'Focuses on complex dermatological disorders, autoimmune skin therapies, and digital dermoscopy lesion mapping.',
      AvailableDays: ['Tue', 'Thu', 'Sat']
    },
    {
      DoctorID: 6,
      DepartmentID: 6,
      DepartmentName: 'General Medicine & Triage',
      FirstName: 'Marcus',
      LastName: 'Sterling',
      Gender: 'Male',
      Qualification: 'MD Internal Medicine (Harvard Medical School)',
      Specialization: 'Internal Medicine Physician',
      Phone: '+1 (555) 301-4496',
      Email: 'marcus.sterling@carepoint.health',
      ConsultationFee: 60,
      Rating: 4.94,
      ReviewCount: 167,
      ExperienceYears: 18,
      ConsultationModes: ['online', 'offline'],
      Bio: 'Dedicated to preventative metabolic health, hypertension control, personalized lifestyle medicine, and multi-system diagnostics.',
      AvailableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    }
  ],
  patient: [
    {
      PatientID: 1,
      AadhaarNo: '4829-1029-3841',
      FirstName: 'David',
      LastName: 'Harrison',
      DOB: '1984-06-18',
      Gender: 'Male',
      BloodGroup: 'O+',
      Phone: '+1 (555) 839-2041',
      Email: 'david.harrison@email.com',
      Address: '428 Meadowbrook Lane, Suite 4, Springfield',
      EmergencyContactName: 'Sarah Harrison',
      EmergencyContactPhone: '+1 (555) 839-2049',
      RegistrationDate: '2024-01-12'
    },
    {
      PatientID: 2,
      AadhaarNo: '9381-4019-2810',
      FirstName: 'Amara',
      LastName: 'Chen',
      DOB: '1992-11-04',
      Gender: 'Female',
      BloodGroup: 'A+',
      Phone: '+1 (555) 749-1120',
      Email: 'amara.chen@email.com',
      Address: '124 Beacon Hill Road, Boston, MA',
      EmergencyContactName: 'David Chen',
      EmergencyContactPhone: '+1 (555) 749-1129',
      RegistrationDate: '2024-02-18'
    },
    {
      PatientID: 3,
      AadhaarNo: '6201-9481-3021',
      FirstName: 'Robert',
      LastName: 'Kowalski',
      DOB: '1970-08-22',
      Gender: 'Male',
      BloodGroup: 'B+',
      Phone: '+1 (555) 912-3840',
      Email: 'r.kowalski@email.com',
      Address: '88 Oakridge Drive, Chicago, IL',
      EmergencyContactName: 'Maria Kowalski',
      EmergencyContactPhone: '+1 (555) 912-3849',
      RegistrationDate: '2023-11-05'
    }
  ],
  appointment: [
    {
      AppointmentID: 1,
      PatientID: 1,
      DoctorID: 1,
      PatientName: 'David Harrison',
      DoctorName: 'Dr. Ananya Rao',
      DepartmentName: 'Cardiology & Heart Care',
      AppointmentDate: '2026-10-06',
      StartTime: '10:00 AM',
      EndTime: '10:30 AM',
      Type: 'Online Telehealth',
      Reason: 'Quarterly cardiovascular review & echocardiogram followup',
      Status: 'Scheduled',
      ConsultationMode: 'online',
      MeetLink: 'https://telehealth.carepoint.health/room/cp-8291-cardio',
      CreatedAt: '2026-10-01'
    },
    {
      AppointmentID: 2,
      PatientID: 1,
      DoctorID: 6,
      PatientName: 'David Harrison',
      DoctorName: 'Dr. Marcus Sterling',
      DepartmentName: 'General Medicine & Triage',
      AppointmentDate: '2026-10-15',
      StartTime: '02:00 PM',
      EndTime: '02:30 PM',
      Type: 'In-Clinic Visit',
      Reason: 'Annual comprehensive metabolic panel & lipid assessment',
      Status: 'Scheduled',
      ConsultationMode: 'offline',
      CreatedAt: '2026-10-02'
    },
    {
      AppointmentID: 3,
      PatientID: 2,
      DoctorID: 4,
      PatientName: 'Amara Chen',
      DoctorName: 'Dr. Elena Rostova',
      DepartmentName: 'Pediatrics & Neonatal Care',
      AppointmentDate: '2026-09-24',
      StartTime: '11:15 AM',
      EndTime: '11:45 AM',
      Type: 'In-Clinic Visit',
      Reason: 'Toddler 18-month developmental checkup',
      Status: 'Completed',
      ConsultationMode: 'offline',
      CreatedAt: '2026-09-20'
    }
  ],
  medhistory: [
    {
      HistoryID: 1,
      PatientID: 1,
      PatientName: 'David Harrison',
      PastIllnesses: 'Mild Hypertension (diagnosed 2021), Seasonal allergic rhinitis',
      PastSurgeries: 'Laparoscopic Appendectomy (2015)',
      FamilyHistory: 'Maternal history of Type 2 Diabetes, Paternal history of Coronary Artery Disease (CAD)',
      ChronicConditions: 'Hypertension (Stage 1 controlled)',
      Allergies: 'Penicillin (mild cutaneous rash), Tree nuts',
      Notes: 'Patient exercises 3 times weekly. Adherent to low-sodium Mediterranean diet.',
      CreatedAt: '2024-01-12'
    }
  ],
  prescription: [
    {
      PrescriptionID: 1,
      AppointmentID: 1,
      DoctorID: 1,
      DoctorName: 'Dr. Ananya Rao',
      PatientName: 'David Harrison',
      Description: 'Maintenance Cardiovascular Protocol',
      Notes: 'Take Telmisartan with breakfast. Maintain hydration and keep daily BP log.',
      CreatedAt: '2026-09-10',
      Items: [
        {
          PrescriptionItemID: 1,
          PrescriptionID: 1,
          MedicineID: 1,
          MedicineName: 'Telmisartan 40mg',
          Dose: '1 Tablet',
          Frequency: 'Once daily (Morning)',
          Duration: '90 Days',
          Instructions: 'Take with full glass of water after breakfast'
        },
        {
          PrescriptionItemID: 2,
          PrescriptionID: 1,
          MedicineID: 2,
          MedicineName: 'Rosuvastatin 10mg',
          Dose: '1 Tablet',
          Frequency: 'Once daily (Night)',
          Duration: '90 Days',
          Instructions: 'Take before bedtime'
        }
      ]
    }
  ],
  medicine: [
    {
      MedicineID: 1,
      MedicineName: 'Telmisartan 40mg',
      Category: 'Cardiovascular / Antihypertensive',
      Description: 'Angiotensin II Receptor Blocker for precise blood pressure control and cardiovascular protection.',
      UnitPrice: 14.50,
      IsActive: true,
      StockQuantity: 420,
      Manufacturer: 'Aegis Pharma'
    },
    {
      MedicineID: 2,
      MedicineName: 'Rosuvastatin 10mg',
      Category: 'Cardiovascular / Lipid Regulator',
      Description: 'High-efficacy HMG-CoA reductase inhibitor for lowering LDL cholesterol and arterial plaque stabilization.',
      UnitPrice: 18.20,
      IsActive: true,
      StockQuantity: 310,
      Manufacturer: 'Novis Health'
    },
    {
      MedicineID: 3,
      MedicineName: 'Metformin XR 500mg',
      Category: 'Endocrine / Antidiabetic',
      Description: 'Extended-release biguanide for optimal glycemic control and insulin sensitivity enhancement.',
      UnitPrice: 9.80,
      IsActive: true,
      StockQuantity: 580,
      Manufacturer: 'BioCare Therapeutics'
    },
    {
      MedicineID: 4,
      MedicineName: 'Amoxicillin + Clavulanate 625mg',
      Category: 'Infectious Disease / Antibiotic',
      Description: 'Broad-spectrum beta-lactam antibacterial for bacterial respiratory and soft-tissue infections.',
      UnitPrice: 22.00,
      IsActive: true,
      StockQuantity: 195,
      Manufacturer: 'Sandoz Lifesciences'
    },
    {
      MedicineID: 5,
      MedicineName: 'Montelukast + Levocetirizine',
      Category: 'Respiratory / Antiallergic',
      Description: 'Dual action leukotriene receptor antagonist and antihistamine for allergic bronchitis and seasonal rhinitis.',
      UnitPrice: 16.50,
      IsActive: true,
      StockQuantity: 240,
      Manufacturer: 'Apex Healthcare'
    },
    {
      MedicineID: 6,
      MedicineName: 'Pantoprazole DSR 40mg',
      Category: 'Gastroenterology / Proton Pump Inhibitor',
      Description: 'Sustained gastroprotective capsule for acid reflux, gastritis, and peptic ulcer prophylaxis.',
      UnitPrice: 12.00,
      IsActive: true,
      StockQuantity: 460,
      Manufacturer: 'Cipla Laboratories'
    },
    {
      MedicineID: 7,
      MedicineName: 'Cholecalciferol (Vitamin D3) 60,000 IU',
      Category: 'Nutritional / Bone Health',
      Description: 'Weekly therapeutic dose for calcium absorption, immune modulation, and bone density support.',
      UnitPrice: 8.50,
      IsActive: true,
      StockQuantity: 350,
      Manufacturer: 'Sun Pharma'
    }
  ],
  service: [
    { ServiceID: 1, ServiceName: 'Specialist Doctor Consultation', Description: '30-minute in-depth clinical review', Charge: 75, IsActive: true },
    { ServiceID: 2, ServiceName: '12-Lead Digital Electrocardiogram (ECG)', Description: 'High-resolution rhythm and ischemic detection', Charge: 45, IsActive: true },
    { ServiceID: 3, ServiceName: '2D Color Doppler Echocardiography', Description: 'Hemodynamic cardiac ultrasound imaging', Charge: 140, IsActive: true },
    { ServiceID: 4, ServiceName: 'Comprehensive Metabolic Panel (CMP)', Description: '14-parameter hepatic, renal, and electrolyte panel', Charge: 60, IsActive: true },
    { ServiceID: 5, ServiceName: 'Digital Chest X-Ray (PA View)', Description: 'Low-radiation pulmonary and cardiac radiography', Charge: 50, IsActive: true },
    { ServiceID: 6, ServiceName: 'MRI Brain & Cranial Angiography', Description: '3 Tesla non-contrast neuro-imaging', Charge: 380, IsActive: true }
  ],
  bill: [
    {
      BillID: 1,
      AppointmentID: 1,
      PatientID: 1,
      PatientName: 'David Harrison',
      BillDate: '2026-09-10',
      Subtotal: 120,
      Discount: 10,
      Tax: 5.5,
      TotalAmount: 115.5,
      Status: 'Paid',
      Notes: 'Settled via Corporate Health Insurance'
    }
  ],
  payment: [
    {
      PaymentID: 1,
      BillID: 1,
      PaymentDate: '2026-09-10',
      PaymentMethod: 'Insurance',
      AmountPaid: 115.5,
      ReferenceNo: 'INS-TX-99824',
      Status: 'Completed',
      Notes: 'Direct cashless approval'
    }
  ],
  floorward: [
    { FloorWardID: 1, FloorWardName: 'Ground Floor · Emergency & OPD', Description: 'Trauma triage, outpatient clinics, and pharmacy.' },
    { FloorWardID: 2, FloorWardName: 'Level 2 · Surgical & Orthopedic Suites', Description: 'Pre-op staging, orthopedic inpatient wing.' },
    { FloorWardID: 3, FloorWardName: 'Level 3 · Cardiac & Intensive Care Unit (ICU)', Description: 'Continuous telemetry monitoring and critical care.' },
    { FloorWardID: 4, FloorWardName: 'Level 4 · Executive & Deluxe Patient Suites', Description: 'Private recovery suites with dedicated nursing support.' }
  ],
  room: [
    { RoomID: 1, FloorWardID: 1, RoomNumber: 'OPD-101', RoomType: 'General', BedCount: 4, OccupancyStatus: 'Available', ChargePerDay: 60, Status: 'Active' },
    { RoomID: 2, FloorWardID: 3, RoomNumber: 'ICU-301', RoomType: 'ICU', BedCount: 1, OccupancyStatus: 'Occupied', ChargePerDay: 280, Status: 'Active' },
    { RoomID: 3, FloorWardID: 3, RoomNumber: 'ICU-302', RoomType: 'ICU', BedCount: 1, OccupancyStatus: 'Available', ChargePerDay: 280, Status: 'Active' },
    { RoomID: 4, FloorWardID: 4, RoomNumber: 'STE-401', RoomType: 'Private', BedCount: 1, OccupancyStatus: 'Occupied', ChargePerDay: 180, Status: 'Active' },
    { RoomID: 5, FloorWardID: 4, RoomNumber: 'STE-402', RoomType: 'Private', BedCount: 1, OccupancyStatus: 'Available', ChargePerDay: 180, Status: 'Active' }
  ],
  vitals: [
    {
      id: 'hr',
      name: 'Heart Rate',
      value: 72,
      unit: 'BPM',
      status: 'optimal',
      trend: 'stable',
      normalRange: '60 - 100 BPM',
      iconName: 'Heart',
      history: [
        { timestamp: '08:00', value: 68 },
        { timestamp: '11:00', value: 74 },
        { timestamp: '14:00', value: 78 },
        { timestamp: '17:00', value: 71 },
        { timestamp: '20:00', value: 72 }
      ]
    },
    {
      id: 'bp',
      name: 'Blood Pressure',
      value: '118/76',
      unit: 'mmHg',
      status: 'optimal',
      trend: 'down',
      normalRange: '< 120/80 mmHg',
      iconName: 'Activity',
      history: [
        { timestamp: 'Mon', value: 122 },
        { timestamp: 'Tue', value: 120 },
        { timestamp: 'Wed', value: 119 },
        { timestamp: 'Thu', value: 118 },
        { timestamp: 'Fri', value: 118 }
      ]
    },
    {
      id: 'o2',
      name: 'Oxygen Saturation (SpO2)',
      value: 99,
      unit: '%',
      status: 'optimal',
      trend: 'stable',
      normalRange: '95 - 100 %',
      iconName: 'Wind',
      history: [
        { timestamp: '08:00', value: 98 },
        { timestamp: '12:00', value: 99 },
        { timestamp: '16:00', value: 99 },
        { timestamp: '20:00', value: 99 }
      ]
    },
    {
      id: 'glucose',
      name: 'Fasting Blood Glucose',
      value: 94,
      unit: 'mg/dL',
      status: 'normal',
      trend: 'stable',
      normalRange: '70 - 99 mg/dL',
      iconName: 'Droplet',
      history: [
        { timestamp: 'Mon', value: 98 },
        { timestamp: 'Tue', value: 96 },
        { timestamp: 'Wed', value: 95 },
        { timestamp: 'Thu', value: 93 },
        { timestamp: 'Fri', value: 94 }
      ]
    },
    {
      id: 'bmi',
      name: 'Body Mass Index (BMI)',
      value: 23.4,
      unit: 'kg/m²',
      status: 'normal',
      trend: 'stable',
      normalRange: '18.5 - 24.9',
      iconName: 'Scale',
      history: [
        { timestamp: 'Jun', value: 24.1 },
        { timestamp: 'Jul', value: 23.9 },
        { timestamp: 'Aug', value: 23.6 },
        { timestamp: 'Sep', value: 23.4 }
      ]
    }
  ],
  vitalLogs: [
    {
      id: 'vlog-1',
      date: '2026-10-03',
      time: '08:30 AM',
      heartRate: 70,
      systolicBP: 118,
      diastolicBP: 76,
      bloodGlucose: 94,
      oxygenSaturation: 99,
      weightKg: 74.2,
      notes: 'Morning measurement post 15-minute gentle stretch.'
    },
    {
      id: 'vlog-2',
      date: '2026-10-02',
      time: '08:15 AM',
      heartRate: 72,
      systolicBP: 120,
      diastolicBP: 78,
      bloodGlucose: 96,
      oxygenSaturation: 98,
      weightKg: 74.5,
      notes: 'Normal readings. Good hydration.'
    },
    {
      id: 'vlog-3',
      date: '2026-10-01',
      time: '08:45 AM',
      heartRate: 74,
      systolicBP: 121,
      diastolicBP: 79,
      bloodGlucose: 98,
      oxygenSaturation: 99,
      weightKg: 74.6,
      notes: 'Post-weekend baseline check.'
    }
  ],
  reports: [
    {
      id: 'REP-2026-0981',
      title: 'Comprehensive Cardiovascular & Lipid Diagnostic Report',
      category: 'Cardiology',
      date: '2026-09-12',
      doctorName: 'Dr. Ananya Rao',
      department: 'Cardiology & Heart Care',
      status: 'Completed',
      summary: 'Normal sinus rhythm with well-preserved left ventricular systolic function (LVEF 62%). Serum LDL cholesterol demonstrates positive response to therapy.',
      parameters: [
        { name: 'Total Cholesterol', value: '168', unit: 'mg/dL', referenceRange: '< 200', isAbnormal: false },
        { name: 'LDL Cholesterol', value: '88', unit: 'mg/dL', referenceRange: '< 100', isAbnormal: false },
        { name: 'HDL Cholesterol', value: '54', unit: 'mg/dL', referenceRange: '> 40', isAbnormal: false },
        { name: 'Serum Triglycerides', value: '128', unit: 'mg/dL', referenceRange: '< 150', isAbnormal: false },
        { name: 'Left Ventricle Ejection Fraction (LVEF)', value: '62', unit: '%', referenceRange: '55 - 70', isAbnormal: false }
      ],
      notes: 'Continue current medication regimen. Next scheduled follow-up in 6 months.'
    },
    {
      id: 'REP-2026-0742',
      title: 'Advanced Hematology & Complete Blood Count (CBC)',
      category: 'Hematology',
      date: '2026-08-20',
      doctorName: 'Dr. Marcus Sterling',
      department: 'General Medicine & Triage',
      status: 'Completed',
      summary: 'All leukocyte, erythrocyte, and platelet parameters within optimal clinical reference brackets.',
      parameters: [
        { name: 'Hemoglobin', value: '15.2', unit: 'g/dL', referenceRange: '13.5 - 17.5', isAbnormal: false },
        { name: 'Total White Blood Cells (WBC)', value: '6,400', unit: '/mcL', referenceRange: '4,500 - 11,000', isAbnormal: false },
        { name: 'Platelet Count', value: '260,000', unit: '/mcL', referenceRange: '150,000 - 450,000', isAbnormal: false },
        { name: 'HbA1c (Glycated Hemoglobin)', value: '5.4', unit: '%', referenceRange: '< 5.7', isAbnormal: false }
      ],
      notes: 'No signs of systemic inflammation or anemia.'
    }
  ]
};

export function getStoredData(): StorageData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.doctor && parsed.department) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to parse local storage cache:', err);
  }
  saveStoredData(defaultData);
  return defaultData;
}

export function saveStoredData(data: StorageData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save to local storage:', err);
  }
}
