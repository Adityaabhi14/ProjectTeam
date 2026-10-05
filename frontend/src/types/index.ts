// =================================================================
// CarePoint Health Management System — Core Types & Schemas
// =================================================================

export type NavigationView =
  | 'home'
  | 'treatments'
  | 'doctors'
  | 'appointments'
  | 'patient-profile'
  | 'assessment'
  | 'tracker'
  | 'pharmacy'
  | 'chatbot'
  | 'staff';

// ── Hospital Entities ──────────────────────────────────────────

export interface Patient {
  PatientID?: number;
  AadhaarNo?: string;
  FirstName: string;
  LastName?: string;
  DOB?: string;
  Gender?: 'Male' | 'Female' | 'Other';
  BloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  Phone: string;
  Email?: string;
  Address?: string;
  EmergencyContactName?: string;
  EmergencyContactPhone?: string;
  RegistrationDate?: string;
}

export interface Doctor {
  DoctorID?: number;
  DepartmentID: number;
  DepartmentName?: string;
  FirstName: string;
  LastName: string;
  Gender?: 'Male' | 'Female' | 'Other';
  Qualification?: string;
  Specialization: string;
  Phone?: string;
  Email?: string;
  ConsultationFee?: number;
  JoiningDate?: string;
  AvatarUrl?: string;
  Rating?: number;
  ReviewCount?: number;
  ExperienceYears?: number;
  ConsultationModes?: ('online' | 'offline')[];
  Bio?: string;
  AvailableDays?: string[];
}

export interface Department {
  DepartmentID?: number;
  DepartmentName: string;
  Description?: string;
  PhoneNo?: string;
  Location?: string;
  Icon?: string;
  DoctorCount?: number;
}

export interface Appointment {
  AppointmentID?: number;
  PatientID: number;
  DoctorID: number;
  PatientName?: string;
  DoctorName?: string;
  DepartmentName?: string;
  AppointmentDate: string;
  StartTime?: string;
  EndTime?: string;
  Type?: 'Consultation' | 'Follow-up' | 'Emergency' | 'Procedure' | 'Online Telehealth' | 'In-Clinic Visit';
  Reason?: string;
  Status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No-show';
  ConsultationMode?: 'online' | 'offline';
  MeetLink?: string;
  CreatedAt?: string;
}

export interface MedicalHistory {
  HistoryID?: number;
  PatientID: number;
  PatientName?: string;
  PastIllnesses?: string;
  PastSurgeries?: string;
  FamilyHistory?: string;
  ChronicConditions?: string;
  Allergies?: string;
  Notes?: string;
  CreatedAt?: string;
}

export interface Insurance {
  InsuranceID?: number;
  PatientID: number;
  PatientName?: string;
  ProviderName: string;
  PolicyNumber: string;
  PolicyHolderName?: string;
  Relationship?: string;
  CoverageType?: string;
  ValidFrom?: string;
  ValidTo?: string;
}

export interface Prescription {
  PrescriptionID?: number;
  AppointmentID: number;
  DoctorID: number;
  DoctorName?: string;
  PatientName?: string;
  Description?: string;
  Notes?: string;
  Items?: PrescriptionItem[];
  CreatedAt?: string;
}

export interface PrescriptionItem {
  PrescriptionItemID?: number;
  PrescriptionID: number;
  MedicineID: number;
  MedicineName?: string;
  Dose?: string;
  Frequency?: string;
  Duration?: string;
  Instructions?: string;
}

export interface Medicine {
  MedicineID?: number;
  MedicineName: string;
  Category?: string;
  Description?: string;
  UnitPrice: number;
  IsActive: boolean;
  StockQuantity?: number;
  Manufacturer?: string;
}

export interface Service {
  ServiceID?: number;
  ServiceName: string;
  Description?: string;
  Charge: number;
  IsActive: boolean;
}

export interface Bill {
  BillID?: number;
  AppointmentID?: number;
  PatientID: number;
  PatientName?: string;
  BillDate?: string;
  Subtotal?: number;
  Discount?: number;
  Tax?: number;
  TotalAmount: number;
  Status: 'Unpaid' | 'Partially Paid' | 'Paid' | 'Cancelled';
  Notes?: string;
}

export interface BillItem {
  BillItemID?: number;
  BillID: number;
  ServiceID?: number;
  ServiceName?: string;
  Description?: string;
  Quantity: number;
  UnitPrice: number;
  Amount?: number;
}

export interface Payment {
  PaymentID?: number;
  BillID: number;
  PaymentDate?: string;
  PaymentMethod: 'Cash' | 'Card' | 'UPI' | 'Net banking' | 'Insurance';
  AmountPaid: number;
  ReferenceNo?: string;
  Status: 'Completed' | 'Pending' | 'Failed' | 'Refunded';
  Notes?: string;
}

export interface FloorWard {
  FloorWardID?: number;
  FloorWardName: string;
  Description?: string;
}

export interface Room {
  RoomID?: number;
  FloorWardID: number;
  FloorWardName?: string;
  RoomNumber: string;
  RoomType: 'General' | 'Semi-private' | 'Private' | 'ICU' | 'Operation theatre';
  BedCount: number;
  OccupancyStatus: 'Available' | 'Occupied' | 'Maintenance';
  ChargePerDay: number;
  Status: 'Active' | 'Inactive';
  Notes?: string;
}

// ── Health Assessment & Diagnostic Support ───────────────────────

export interface AssessmentResponse {
  age: number;
  gender: string;
  chiefComplaint: string;
  symptoms: string[];
  severity: 'mild' | 'moderate' | 'severe';
  durationDays: number;
  lifestyle: {
    sleepHours: number;
    activityLevel: 'sedentary' | 'moderate' | 'active';
    smoker: boolean;
    stressLevel: 'low' | 'medium' | 'high';
  };
  chronicConditions: string[];
}

export interface AssessmentResult {
  urgencyLevel: 'routine' | 'recommended' | 'urgent' | 'emergency';
  suggestedDepartment: string;
  considerations: string[];
  recommendedActions: string[];
  selfCareTips: string[];
  suggestedDoctorId?: number;
  clinicalDisclaimer: string;
}

// ── Vitals & Health Tracker ──────────────────────────────────────

export interface VitalMetric {
  id: string;
  name: string;
  value: number | string;
  unit: string;
  status: 'optimal' | 'normal' | 'attention' | 'critical';
  trend: 'up' | 'down' | 'stable';
  history: { timestamp: string; value: number }[];
  normalRange: string;
  iconName: string;
}

export interface VitalLogEntry {
  id: string;
  date: string;
  time: string;
  heartRate: number;
  systolicBP: number;
  diastolicBP: number;
  bloodGlucose: number;
  oxygenSaturation: number;
  weightKg: number;
  notes?: string;
}

// ── Medical Lab Report ──────────────────────────────────────────

export interface MedicalReportDoc {
  id: string;
  title: string;
  category: 'Hematology' | 'Cardiology' | 'Radiology' | 'Biochemistry' | 'Pathology';
  date: string;
  doctorName: string;
  department: string;
  status: 'Completed' | 'Pending Review' | 'Critical Flag';
  summary: string;
  parameters: {
    name: string;
    value: string | number;
    unit: string;
    referenceRange: string;
    isAbnormal: boolean;
  }[];
  notes: string;
}
